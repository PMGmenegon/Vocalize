import { db } from '../mocks/db'
import { FLASHCARDS } from '../mocks/flashcards'
import { DEMO_USER } from '../mocks/users'
import type { Flashcard, ReviewRating } from '../types'
import { isEmptyMode, simulate } from './runtime'

const today = () => new Date().toISOString().slice(0, 10)
const doneKey = (id: string) => `${today()}:${id}`

/** Palavras que ainda faltam revisar hoje (síncrono: usado também pelo dashboard). */
export function dueToday(): Flashcard[] {
  const user = db.getUser()
  if (isEmptyMode() || user?.id !== DEMO_USER.id) return []
  const done = new Set(db.getReviewed())
  return FLASHCARDS.filter((card) => !done.has(doneKey(card.id)))
}

export const reviewService = {
  getDue(): Promise<Flashcard[]> {
    return simulate(dueToday)
  },

  /** Mock: só marca o cartão como revisado hoje. A API real reagendará pela avaliação. */
  rate(cardId: string, rating: ReviewRating): Promise<{ cardId: string; rating: ReviewRating }> {
    return simulate(() => {
      db.setReviewed([...db.getReviewed(), doneKey(cardId)])
      return { cardId, rating }
    }, 150)
  },
}
