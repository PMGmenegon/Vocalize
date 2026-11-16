import type { Interlocutor } from '../types'

export interface Draw {
  interlocutor: Interlocutor
  scene: string
}

/** Fonte de aleatoriedade: devolve um número em [0, 1), como Math.random. */
export type RandomSource = () => number

const pick = <T>(items: readonly T[], random: RandomSource): T => items[Math.min(items.length - 1, Math.floor(random() * items.length))]!

/**
 * MOCK — será substituído na Fase 10, quando o backend escolher o interlocutor e a cena (e puder criar cenas novas).
 * Sorteia um interlocutor da situação e uma cena dele. Função pura: a aleatoriedade vem de fora, para ser testável.
 */
export function drawInterlocutor(interlocutors: readonly Interlocutor[], random: RandomSource = Math.random): Draw {
  if (interlocutors.length === 0) throw new Error('A situação não tem interlocutores.')
  const interlocutor = pick(interlocutors, random)
  return { interlocutor, scene: pick(interlocutor.scenes, random) }
}
