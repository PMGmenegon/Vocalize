import { describe, expect, it } from 'vitest'
import { chunkWords, estimateDuration, splitWords, wordAtChar, wordStarts, wordsInSeconds } from './timing'
import { detectEngine, rankVoices, type VoiceLike } from './voicePreferences'

const v = (name: string, lang: string, localService = true): VoiceLike => ({ name, lang, localService })
const first = (voices: VoiceLike[], locale: 'en-US' | 'en-GB', engine: Parameters<typeof rankVoices>[2]) => rankVoices(voices, locale, engine)[0]!

describe('detectEngine', () => {
  it.each([
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36', 'chrome'],
    ['Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36', 'chrome'],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0', 'edge'],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15', 'safari'],
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0.0.0 Mobile/15E148 Safari/604.1', 'safari'],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0', 'other'],
    ['Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36', 'other'],
  ])('%s → %s', (ua, engine) => {
    expect(detectEngine(ua)).toBe(engine)
  })

  it('iPadOS (UA de Mac, mas com toque) usa o motor do Safari', () => {
    expect(detectEngine('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15', 5)).toBe('safari')
  })
})

describe('rankVoices', () => {
  const chromeVoices = [v('Microsoft David - English (United States)', 'en-US'), v('Google UK English Male', 'en-GB', false), v('Google US English', 'en-US', false), v('Google UK English Female', 'en-GB', false)]

  it('Chrome: Google US English / Google UK English Female', () => {
    expect(first(chromeVoices, 'en-US', 'chrome').voice?.name).toBe('Google US English')
    expect(first(chromeVoices, 'en-GB', 'chrome').voice?.name).toBe('Google UK English Female')
  })

  it('Safari: Samantha e Daniel, com Enhanced/Premium antes', () => {
    const apple = [v('Samantha', 'en-US'), v('Samantha (Enhanced)', 'en-US'), v('Alex', 'en-US'), v('Daniel', 'en-GB'), v('Daniel (Premium)', 'en-GB')]
    expect(first(apple, 'en-US', 'safari').voice?.name).toBe('Samantha (Enhanced)')
    expect(first(apple, 'en-GB', 'safari').voice?.name).toBe('Daniel (Premium)')
    expect(first(apple.filter((x) => !/\(/.test(x.name)), 'en-GB', 'safari').voice?.name).toBe('Daniel')
  })

  it('Edge: vozes "Online (Natural)" do idioma', () => {
    const edge = [v('Microsoft Zira - English (United States)', 'en-US'), v('Microsoft Aria Online (Natural) - English (United States)', 'en-US', false), v('Microsoft Sonia Online (Natural) - English (United Kingdom)', 'en-GB', false)]
    expect(first(edge, 'en-US', 'edge').voice?.name).toContain('Aria Online (Natural)')
    expect(first(edge, 'en-GB', 'edge').voice?.name).toContain('Sonia Online (Natural)')
  })

  it('outros navegadores: a melhor do idioma (qualidade, depois do aparelho)', () => {
    const list = [v('Plain', 'en-GB', false), v('Local', 'en-GB', true), v('Fancy Natural', 'en-GB', false)]
    expect(first(list, 'en-GB', 'other').voice?.name).toBe('Fancy Natural')
  })

  it('entende "en_GB" com sublinhado (Android)', () => {
    const r = first([v('English United Kingdom', 'en_GB')], 'en-GB', 'chrome')
    expect(r.voice?.name).toBe('English United Kingdom')
    expect(r.matched).toBe(true)
  })

  it('sem voz do sotaque: usa en-US/en-GB e marca como não casada', () => {
    const r = first([v('Google US English', 'en-US', false)], 'en-GB', 'chrome')
    expect(r.voice?.name).toBe('Google US English')
    expect(r.matched).toBe(false)
  })

  it('sem en-US/en-GB: qualquer inglês; sem inglês: voz padrão do navegador', () => {
    expect(first([v('Karen', 'en-AU')], 'en-US', 'other').voice?.name).toBe('Karen')
    const none = first([v('Thomas', 'fr-FR')], 'en-US', 'other')
    expect(none.voice).toBeNull()
  })

  it('ignora vozes de efeito do macOS', () => {
    expect(rankVoices([v('Zarvox', 'en-US'), v('Samantha', 'en-US')], 'en-US', 'other').map((c) => c.voice?.name)).toEqual(['Samantha', undefined])
  })

  it('lista vazia (vozes ainda carregando): só "voz padrão", sem aviso', () => {
    expect(rankVoices([], 'en-GB', 'chrome')).toEqual([{ voice: null, matched: true }])
  })

  it('sempre termina com a voz padrão como último recurso', () => {
    const list = rankVoices(chromeVoices, 'en-US', 'chrome')
    expect(list.at(-1)?.voice).toBeNull()
  })
})

describe('timing', () => {
  it('splitWords ignora espaços extras', () => {
    expect(splitWords('  Hello   there \n friend ')).toEqual(['Hello', 'there', 'friend'])
  })

  it('a duração estimada cresce com as palavras e cai com a velocidade', () => {
    expect(estimateDuration(0, 1)).toBe(0)
    expect(estimateDuration(10, 1)).toBeLessThan(estimateDuration(20, 1))
    expect(estimateDuration(10, 0.75)).toBeGreaterThan(estimateDuration(10, 1))
  })

  it('wordsInSeconds: ~3 s são cerca de 8 palavras a 1x, menos devagar, nunca menos de 1', () => {
    expect(wordsInSeconds(3, 1)).toBe(8)
    expect(wordsInSeconds(3, 0.75)).toBe(6)
    expect(wordsInSeconds(0.1, 1)).toBe(1)
  })

  it('wordAtChar acha a palavra pelo índice do caractere', () => {
    const starts = wordStarts(['Could', 'we', 'get'])
    expect(starts).toEqual([0, 6, 9])
    expect(wordAtChar(starts, 0)).toBe(0)
    expect(wordAtChar(starts, 6)).toBe(1)
    expect(wordAtChar(starts, 10)).toBe(2)
  })

  describe('chunkWords', () => {
    it('divide por frase, guardando o deslocamento de cada trecho', () => {
      const chunks = chunkWords(splitWords('Hello there. How are you? Fine, thanks!'))
      expect(chunks.map((c) => c.words.join(' '))).toEqual(['Hello there.', 'How are you?', 'Fine, thanks!'])
      expect(chunks.map((c) => c.offset)).toEqual([0, 2, 5])
    })

    it('uma frase só vira um trecho só', () => {
      expect(chunkWords(splitWords('Could we get the check please'))).toHaveLength(1)
    })

    it('quebra frases muito longas numa vírgula', () => {
      const long = 'one two three four five six seven eight nine, ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'
      const chunks = chunkWords(splitWords(long), 60)
      expect(chunks.length).toBeGreaterThan(1)
      expect(chunks.flatMap((c) => c.words).join(' ')).toBe(long)
      expect(chunks[0]!.words.at(-1)).toBe('nine,')
    })

    it('texto vazio não gera trechos', () => {
      expect(chunkWords([])).toEqual([])
    })
  })
})
