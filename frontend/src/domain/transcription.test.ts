import { describe, expect, it } from 'vitest'
import { compareTranscription as compare, normalizeText } from './transcription'

const statuses = (expected: string, typed: string) => compare(expected, typed).words.map((w) => w.status)

describe('compareTranscription', () => {
  it('frase idêntica: tudo certo, 100%', () => {
    const r = compare('Could we get the check, please?', 'Could we get the check, please?')
    expect(r.accuracy).toBe(100)
    expect(r.correctCount).toBe(6)
    expect(r.totalExpected).toBe(6)
    expect(r.words.every((w) => w.status === 'correct')).toBe(true)
  })

  it('palavra trocada: uma errada com o que foi digitado', () => {
    const r = compare('I will take the elevator', 'I will take the escalator')
    expect(statuses('I will take the elevator', 'I will take the escalator')).toEqual(['correct', 'correct', 'correct', 'correct', 'wrong'])
    expect(r.words[4]).toEqual({ status: 'wrong', expected: 'elevator', typed: 'escalator' })
    expect(r.accuracy).toBe(80)
  })

  it('palavra faltando', () => {
    const r = compare('What time does the subway leave', 'What time the subway leave')
    expect(r.words.map((w) => w.status)).toEqual(['correct', 'correct', 'missing', 'correct', 'correct', 'correct'])
    expect(r.words[2]!.expected).toBe('does')
    expect(r.correctCount).toBe(5)
    expect(r.accuracy).toBe(83)
  })

  it('palavra sobrando', () => {
    const r = compare('Take the lift', 'Take the big lift')
    expect(r.words.map((w) => w.status)).toEqual(['correct', 'correct', 'extra', 'correct'])
    expect(r.words[2]!.typed).toBe('big')
    // palavras sobrando não entram no total esperado
    expect(r.totalExpected).toBe(3)
    expect(r.accuracy).toBe(100)
  })

  it('várias diferenças ao mesmo tempo', () => {
    // esperado: the cat sat on the mat | digitado: a cat sit on mat today
    const r = compare('the cat sat on the mat', 'a cat sit on mat today')
    const byStatus = (s: string) => r.words.filter((w) => w.status === s).length
    expect(byStatus('correct')).toBe(3) // cat, on, mat
    expect(byStatus('wrong')).toBe(2) // the→a, sat→sit
    expect(byStatus('missing')).toBe(1) // the (antes de mat)
    expect(byStatus('extra')).toBe(1) // today
    expect(r.accuracy).toBe(50)
  })

  it('ignora maiúsculas e pontuação', () => {
    const r = compare('Hello, World! How are you?', 'hello world how are you')
    expect(r.accuracy).toBe(100)
    // mostra a palavra original, com a pontuação
    expect(r.words[0]!.expected).toBe('Hello,')
    expect(r.words[0]!.typed).toBe('hello')
  })

  it('aceita apóstrofo tipográfico', () => {
    expect(compare("I don't know", 'I don’t know').accuracy).toBe(100)
  })

  describe('contrações', () => {
    it.each([
      ["I'm late", 'I am late'],
      ['I am late', "I'm late"],
      ["Don't worry", 'Do not worry'],
      ['Do not worry', "don't worry"],
      ["It's cold", 'It is cold'],
      ["I can't swim", 'I cannot swim'],
      ['I cannot swim', "I can't swim"],
      ["They won't come", 'They will not come'],
      ["Let's go", 'Let us go'],
    ])('"%s" equivale a "%s"', (a, b) => {
      expect(compare(a, b).accuracy).toBe(100)
      expect(compare(a, b).words.every((w) => w.status === 'correct')).toBe(true)
    })

    it('uma contração conta como UMA palavra da frase original', () => {
      const r = compare("I'm happy", 'I am happy')
      expect(r.totalExpected).toBe(2)
      expect(r.words).toHaveLength(2)
      expect(r.words[0]).toEqual({ status: 'correct', expected: "I'm", typed: 'I am' })
    })

    it('contração com parte errada vira "errada"', () => {
      const r = compare("I'm happy", 'I was happy')
      expect(r.words.map((w) => w.status)).toEqual(['wrong', 'correct'])
      expect(r.words[0]!.typed).toBe('I was')
    })
  })

  it('hífen separa palavras', () => {
    expect(compare('A well-known actor', 'A well known actor').accuracy).toBe(100)
  })

  describe('transcrição vazia', () => {
    it.each(['', '   ', '...'])('"%s": tudo faltando, 0%', (typed) => {
      const r = compare('Nice to meet you', typed)
      expect(r.accuracy).toBe(0)
      expect(r.correctCount).toBe(0)
      expect(r.words.map((w) => w.status)).toEqual(['missing', 'missing', 'missing', 'missing'])
    })

    it('frase original vazia não divide por zero', () => {
      const r = compare('', 'hello')
      expect(r.accuracy).toBe(0)
      expect(r.totalExpected).toBe(0)
      expect(r.words.map((w) => w.status)).toEqual(['extra'])
    })
  })

  it('guarda a frase original', () => {
    expect(compare('Good morning.', 'good').expectedText).toBe('Good morning.')
  })
})

describe('normalizeText', () => {
  it('iguala frases que só diferem em caixa, pontuação e contrações', () => {
    expect(normalizeText("I'm fine, thanks!")).toBe(normalizeText('i am fine thanks'))
  })
})
