import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { EndReason } from './SpeechPlayer'
import { WebSpeechPlayer } from './WebSpeechPlayer'

/** speechSynthesis falso: guarda as falas e deixa o teste disparar os eventos (como o navegador faria). */
class FakeUtterance {
  text: string
  lang = ''
  voice: { name: string } | null = null
  rate = 1
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: ((e: { error: string }) => void) | null = null
  onboundary: ((e: { name: string; charIndex: number }) => void) | null = null
  constructor(text: string) {
    this.text = text
  }
}

let queue: FakeUtterance[]
const voices = [
  { name: 'Google US English', lang: 'en-US', voiceURI: 'g-us', localService: false },
  { name: 'Other US Voice', lang: 'en-US', voiceURI: 'o-us', localService: true },
  { name: 'Google UK English Female', lang: 'en-GB', voiceURI: 'g-gb', localService: false },
]

beforeEach(() => {
  vi.useFakeTimers()
  queue = []
  const synth = {
    speaking: false,
    pending: false,
    getVoices: () => voices,
    addEventListener: () => undefined,
    speak: (u: FakeUtterance) => {
      queue.push(u)
      synth.speaking = true
    },
    cancel: () => {
      const stopped = queue
      queue = []
      synth.speaking = false
      stopped.forEach((u) => u.onerror?.({ error: 'interrupted' }))
    },
  }
  vi.stubGlobal('window', {
    speechSynthesis: synth,
    addEventListener: () => undefined,
    setTimeout: (...a: Parameters<typeof setTimeout>) => setTimeout(...a),
    clearTimeout: (id: number) => clearTimeout(id),
    setInterval: (...a: Parameters<typeof setInterval>) => setInterval(...a),
    clearInterval: (id: number) => clearInterval(id),
  })
  vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36', maxTouchPoints: 0 })
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function setup(text: string, extra: { locale?: 'en-US' | 'en-GB'; fromWord?: number } = {}) {
  const player = new WebSpeechPlayer()
  const words: number[] = []
  const ends: EndReason[] = []
  const starts: { name: string | null; matched: boolean }[] = []
  const handle = player.speak({ text, locale: extra.locale ?? 'en-US', rate: 1, fromWord: extra.fromWord }, { onStart: (v) => starts.push(v), onWord: (i) => words.push(i), onEnd: (r) => ends.push(r) })
  return { player, handle, words, ends, starts }
}

describe('WebSpeechPlayer', () => {
  it('fala frase a frase, escolhe a voz do sotaque e termina', () => {
    const { words, ends, starts } = setup('Hello there. How are you?')
    expect(queue.map((u) => u.text)).toEqual(['Hello there.'])
    expect(queue[0]!.voice?.name).toBe('Google US English')
    queue[0]!.onstart?.()
    expect(starts).toEqual([{ name: 'Google US English', matched: true }])
    const first = queue[0]!
    queue = []
    first.onend?.()
    expect(queue.map((u) => u.text)).toEqual(['How are you?'])
    queue[0]!.onstart?.()
    queue[0]!.onend?.()
    expect(ends).toEqual(['finished'])
    expect(words.at(-1)).toBe(5)
  })

  it('usa o evento de fronteira para achar a palavra atual (com o deslocamento do trecho)', () => {
    const { words } = setup('Hello there. How are you?')
    queue[0]!.onstart?.()
    const first = queue[0]!
    queue = []
    first.onend?.()
    queue[0]!.onstart?.()
    queue[0]!.onboundary?.({ name: 'word', charIndex: 4 }) // "are" (índice 4 em "How are you?")
    expect(words.at(-1)).toBe(3)
  })

  it('sem evento de fronteira, avança a palavra por tempo estimado', () => {
    const { words } = setup('One two three four')
    queue[0]!.onstart?.()
    vi.advanceTimersByTime(410)
    expect(words.at(-1)).toBe(1)
    vi.advanceTimersByTime(400)
    expect(words.at(-1)).toBe(2)
  })

  it('para o avanço por tempo quando o navegador envia fronteiras', () => {
    const { words } = setup('One two three four')
    queue[0]!.onstart?.()
    queue[0]!.onboundary?.({ name: 'word', charIndex: 0 })
    const before = words.length
    vi.advanceTimersByTime(2000)
    expect(words.length).toBe(before)
  })

  it('cancelar avisa uma vez e ignora eventos tardios', () => {
    const { handle, words, ends } = setup('One two three four')
    const u = queue[0]!
    u.onstart?.()
    handle.cancel()
    expect(ends).toEqual(['cancelled'])
    const n = words.length
    u.onboundary?.({ name: 'word', charIndex: 4 })
    u.onend?.()
    vi.advanceTimersByTime(3000)
    expect(ends).toEqual(['cancelled'])
    expect(words.length).toBe(n)
  })

  it('uma fala nova interrompe a anterior (nunca duas ao mesmo tempo)', () => {
    const player = new WebSpeechPlayer()
    const a: EndReason[] = []
    const b: EndReason[] = []
    player.speak({ text: 'First one', locale: 'en-US', rate: 1 }, { onEnd: (r) => a.push(r) })
    queue[0]!.onstart?.()
    player.speak({ text: 'Second one', locale: 'en-US', rate: 1 }, { onEnd: (r) => b.push(r) })
    expect(a).toEqual(['cancelled'])
    vi.advanceTimersByTime(100)
    expect(queue.map((u) => u.text)).toEqual(['Second one'])
    expect(b).toEqual([])
  })

  it('começa de uma palavra do meio (voltar/retomar)', () => {
    const { words } = setup('a b c d', { fromWord: 2 })
    expect(queue[0]!.text).toBe('c d')
    queue[0]!.onstart?.()
    expect(words[0]).toBe(2)
  })

  it('voz muda: depois de 4 s sem som, tenta a próxima voz', () => {
    const { starts } = setup('Hello there')
    expect(queue[0]!.voice?.name).toBe('Google US English')
    vi.advanceTimersByTime(4000)
    vi.advanceTimersByTime(100)
    expect(queue[0]!.voice?.name).toBe('Other US Voice')
    queue[0]!.onstart?.()
    expect(starts).toEqual([{ name: 'Other US Voice', matched: true }])
  })

  it('erro antes de começar também troca de voz; sem mais vozes, termina com erro', () => {
    const { ends } = setup('Hello', { locale: 'en-GB' })
    expect(queue[0]!.voice?.name).toBe('Google UK English Female')
    // cada voz falha uma vez: UK Female → (en-US) Google US → Other US → voz padrão → erro
    for (let i = 0; i < 4; i++) {
      const u = queue[0]!
      queue = []
      u.onerror?.({ error: 'synthesis-failed' })
      vi.advanceTimersByTime(100)
    }
    expect(ends).toEqual(['error'])
  })

  it('avisa quando só há voz de outro sotaque', () => {
    const { starts } = setup('Hello', { locale: 'en-GB' })
    // tira a voz britânica: a primeira candidata passa a ser en-US (matched = false)
    queue[0]!.onerror?.({ error: 'synthesis-failed' })
    vi.advanceTimersByTime(100)
    queue[0]!.onstart?.()
    expect(starts[0]!.matched).toBe(false)
  })

  it('sem suporte do navegador: termina com erro, sem falar', () => {
    vi.stubGlobal('window', { setTimeout: (...a: Parameters<typeof setTimeout>) => setTimeout(...a), addEventListener: () => undefined })
    const player = new WebSpeechPlayer()
    const ends: EndReason[] = []
    expect(player.supported).toBe(false)
    player.speak({ text: 'Hello', locale: 'en-US', rate: 1 }, { onEnd: (r) => ends.push(r) })
    vi.advanceTimersByTime(10)
    expect(ends).toEqual(['error'])
  })
})
