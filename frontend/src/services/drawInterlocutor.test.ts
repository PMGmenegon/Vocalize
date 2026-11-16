import { describe, expect, it } from 'vitest'
import { SITUATIONS } from '../data/scenarios'
import { BANK } from '../mocks/bank'
import { drawInterlocutor } from './drawInterlocutor'

/** Gerador pseudoaleatório determinístico (mulberry32), para os testes não oscilarem. */
function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe('dados das situações', () => {
  it('cada interlocutor tem role, userRole, contexto, ao menos 2 cenas e um diálogo mock de 4 a 6 rodadas', () => {
    for (const s of SITUATIONS) {
      expect(s.interlocutors.length).toBeGreaterThan(0)
      for (const i of s.interlocutors) {
        expect(i.role).not.toBe('')
        expect(i.userRole).not.toBe('')
        expect(i.context).not.toBe('')
        expect(i.scenes.length).toBeGreaterThanOrEqual(2)
        expect(BANK[i.id]?.length).toBeGreaterThanOrEqual(4)
        expect(BANK[i.id]?.length).toBeLessThanOrEqual(6)
      }
    }
  })

  it('os ids dos interlocutores são únicos', () => {
    const ids = SITUATIONS.flatMap((s) => s.interlocutors.map((i) => i.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('Conversa na rua tem só Habitante local e Turista', () => {
    const street = SITUATIONS.find((s) => s.id === 'street')!
    expect(street.interlocutors.map((i) => i.role).sort()).toEqual(['Habitante local', 'Turista'])
  })
})

describe('drawInterlocutor', () => {
  it.each(SITUATIONS.map((s) => [s.id, s] as const))('%s: sempre devolve um interlocutor da situação e uma cena dele', (_id, situation) => {
    const random = seeded(7)
    for (let n = 0; n < 200; n++) {
      const { interlocutor, scene } = drawInterlocutor(situation.interlocutors, random)
      expect(situation.interlocutors).toContain(interlocutor)
      expect(interlocutor.scenes).toContain(scene)
    }
  })

  it.each(SITUATIONS.map((s) => [s.id, s] as const))('%s: ao longo de muitas execuções cobre todos os interlocutores e todas as cenas', (_id, situation) => {
    const random = seeded(42)
    const seen = new Map<string, Set<string>>()
    for (let n = 0; n < 2000; n++) {
      const { interlocutor, scene } = drawInterlocutor(situation.interlocutors, random)
      seen.set(interlocutor.id, (seen.get(interlocutor.id) ?? new Set()).add(scene))
    }
    expect([...seen.keys()].sort()).toEqual(situation.interlocutors.map((i) => i.id).sort())
    for (const i of situation.interlocutors) expect([...seen.get(i.id)!].sort()).toEqual([...i.scenes].sort())
  })

  it('Conversa na rua só devolve Habitante local ou Turista', () => {
    const street = SITUATIONS.find((s) => s.id === 'street')!
    const random = seeded(1)
    for (let n = 0; n < 200; n++) expect(['Habitante local', 'Turista']).toContain(drawInterlocutor(street.interlocutors, random).interlocutor.role)
  })

  it('usa a fonte de aleatoriedade recebida (extremos 0 e quase 1 não saem do intervalo)', () => {
    const { interlocutors } = SITUATIONS[0]!
    expect(drawInterlocutor(interlocutors, () => 0).interlocutor).toBe(interlocutors[0])
    expect(drawInterlocutor(interlocutors, () => 0.999999).interlocutor).toBe(interlocutors.at(-1))
  })

  it('falha com uma lista vazia', () => {
    expect(() => drawInterlocutor([])).toThrow()
  })
})
