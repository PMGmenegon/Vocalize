import { compareDictation, sameText } from '../mocks/compare'
import { db } from '../mocks/db'
import { DIALOGS } from '../mocks/dialogs'
import type { Accent, Correction, Level, ScenarioId, Session, SessionSummary, TranscriptionResult, Turn } from '../types'
import { summarize } from './history'
import { scenarioTitle } from './scenarioService'
import { simulate } from './runtime'

export interface StartSessionInput {
  scenarioId: ScenarioId
  level: Level
  accent: Accent
}
export type HintKind = 'count' | 'letters'

/** Lê a sessão do "banco"; erro se não existir (link antigo, outro navegador...). */
function load(id: string): Session {
  const session = db.getSessions()[id]
  if (!session) throw new Error('Sessão não encontrada.')
  return session
}

function save(session: Session) {
  db.setSessions({ ...db.getSessions(), [session.id]: session })
}

function turnOf(session: Session, index: number): Turn {
  const turn = session.turns[index]
  if (!turn) throw new Error('Rodada inexistente.')
  return turn
}

const dialogOf = (session: Session, index: number) => {
  const turn = DIALOGS[session.scenarioId][index]
  if (!turn) throw new Error('Rodada inexistente.')
  return turn
}

/**
 * Contrato da prática. A fala da IA só chega ao cliente em `checkTranscription`
 * (depois de o usuário tentar), como acontecerá com o backend real.
 */
export const sessionService = {
  start({ scenarioId, level, accent }: StartSessionInput): Promise<Session> {
    return simulate(() => {
      const dialog = DIALOGS[scenarioId]
      const session: Session = {
        id: `s-${Date.now().toString(36)}`,
        scenarioId,
        level,
        accent,
        startedAt: new Date().toISOString(),
        totalTurns: dialog.length,
        turns: dialog.map((d, index) => ({ index, wordCount: d.ai.split(/\s+/).length, repetitions: 0 })),
      }
      save(session)
      return session
    }, 500)
  },

  get(id: string): Promise<Session> {
    return simulate(() => load(id))
  },

  /** Conta uma repetição (play, repetir ou velocidade reduzida). */
  addRepetition(id: string, turnIndex: number): Promise<number> {
    return simulate(() => {
      const session = load(id)
      const turn = turnOf(session, turnIndex)
      turn.repetitions += 1
      save(session)
      return turn.repetitions
    }, 80)
  },

  getHint(id: string, turnIndex: number, kind: HintKind): Promise<string> {
    return simulate(() => {
      const text = dialogOf(load(id), turnIndex).ai
      if (kind === 'count') return `A fala tem ${text.split(/\s+/).length} palavras.`
      return text
        .split(/\s+/)
        .map((w) => w.charAt(0) + '…')
        .join(' ')
    }, 120)
  },

  checkTranscription(id: string, turnIndex: number, typed: string): Promise<TranscriptionResult> {
    return simulate(() => {
      const session = load(id)
      const result = compareDictation(dialogOf(session, turnIndex).ai, typed)
      turnOf(session, turnIndex).transcription = result
      save(session)
      return result
    }, 400)
  },

  /** Mock: a correção vem pronta do diálogo falso; a IA real corrigirá a resposta de verdade. */
  submitReply(id: string, turnIndex: number, reply: string): Promise<Correction> {
    return simulate(() => {
      const session = load(id)
      const dialog = dialogOf(session, turnIndex)
      const changed = !sameText(reply, dialog.corrected)
      const correction: Correction = {
        original: reply,
        corrected: dialog.corrected,
        explanation: changed
          ? dialog.explanation
          : 'Sua resposta está natural e correta. Ótimo trabalho! Veja o vocabulário-chave abaixo.',
        vocabulary: dialog.vocabulary,
        changed,
      }
      const turn = turnOf(session, turnIndex)
      turn.reply = reply
      turn.correction = correction
      save(session)
      return correction
    }, 600)
  },

  finish(id: string): Promise<SessionSummary> {
    return simulate(() => {
      const session = load(id)
      if (!session.endedAt) session.endedAt = new Date().toISOString()
      save(session)
      return toSummary(session)
    }, 300)
  },

  getSummary(id: string): Promise<SessionSummary> {
    return simulate(() => toSummary(load(id)))
  },
}

function toSummary(session: Session): SessionSummary {
  const s = summarize(session)
  return {
    sessionId: session.id,
    scenarioId: session.scenarioId,
    scenarioTitle: scenarioTitle(session.scenarioId),
    averageAccuracy: s.accuracy,
    durationSeconds: s.seconds,
    turnsCompleted: s.turnsCompleted,
    wrongWords: s.wrongWords,
    correctionsCount: s.corrections,
  }
}
