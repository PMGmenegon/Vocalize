import { DEFAULT_MAX_TURNS, SCENARIOS } from '../data/scenarios'
import { BANK, resolveItem } from '../mocks/bank'
import { compareTranscription } from '../domain/transcription'
import { sameText } from '../mocks/compare'
import { db } from '../mocks/db'
import { LEVELS, type Accent, type Correction, type Level, type ScenarioId, type Session, type SessionSummary, type TranscriptionResult, type Turn } from '../types'
import { summarize } from './history'
import { scenarioTitle } from './scenarioService'
import { simulate } from './runtime'

export interface StartSessionInput {
  scenarioId: ScenarioId
  level: Level
  accent: Accent
  /** Limite de rodadas (padrão: DEFAULT_MAX_TURNS). */
  maxTurns?: number
}
export type HintKind = 'count' | 'letters'

/** Chance de a próxima fala falhar no mock, para exercitar o estado de erro com "Tentar de novo". */
const NEXT_TURN_FAILURE_RATE = 0.1

/** Lê a sessão do "banco"; erro se não existir ou se for de uma versão antiga (link velho, outro navegador...). */
function load(id: string): Session {
  const session = db.getSessions()[id]
  if (!session || !session.maxTurns || !SCENARIOS.some((s) => s.id === session.scenarioId)) throw new Error('Sessão não encontrada.')
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

/** O item do banco que deu origem à rodada (só o mock sabe qual foi). */
function itemOf(session: Session, index: number) {
  const pick = db.getPicks()[session.id]?.[index]
  const item = pick === undefined ? undefined : BANK[session.scenarioId][pick]
  if (!item) throw new Error('Rodada inexistente.')
  return resolveItem(item, session.accent)
}

/** Sorteia uma fala adequada ao nível (do nível do usuário ±1), evitando repetir na mesma sessão. */
function pickIndex(session: Session): number {
  const bank = BANK[session.scenarioId]
  const used = new Set(db.getPicks()[session.id] ?? [])
  const at = LEVELS.indexOf(session.level)
  const fits = bank.map((item, idx) => ({ idx, ok: Math.abs(LEVELS.indexOf(item.lv) - at) <= 1 })).filter((x) => x.ok).map((x) => x.idx)
  const fresh = fits.filter((idx) => !used.has(idx))
  const pool = fresh.length > 0 ? fresh : fits.length > 0 ? fits : bank.map((_, idx) => idx)
  return pool[Math.floor(Math.random() * pool.length)]!
}

const randomDelay = () => 700 + Math.floor(Math.random() * 1300)

/**
 * Contrato da prática. As falas chegam UMA A UMA e de forma assíncrona (com IA real, cada
 * uma será gerada na hora): `nextTurn` pode demorar e pode falhar. O texto da fala só chega
 * ao cliente em `checkTranscription`, depois de o usuário tentar.
 */
export const sessionService = {
  start({ scenarioId, level, accent, maxTurns = DEFAULT_MAX_TURNS }: StartSessionInput): Promise<Session> {
    return simulate(() => {
      const session: Session = {
        id: `s-${Date.now().toString(36)}`,
        scenarioId,
        level,
        accent,
        startedAt: new Date().toISOString(),
        maxTurns,
        turns: [],
      }
      save(session)
      return session
    }, 500)
  },

  get(id: string): Promise<Session> {
    return simulate(() => load(id))
  },

  /** Pede a próxima fala. Falha de vez em quando (mock), para a interface mostrar "Tentar de novo". */
  nextTurn(id: string): Promise<Turn> {
    return simulate(() => {
      const session = load(id)
      if (session.turns.length >= session.maxTurns) throw new Error('Limite de rodadas atingido.')
      if (Math.random() < NEXT_TURN_FAILURE_RATE) throw new Error('Falha ao preparar a fala.')
      const pick = pickIndex(session)
      db.setPicks({ ...db.getPicks(), [id]: [...(db.getPicks()[id] ?? []), pick] })
      const turn: Turn = {
        index: session.turns.length,
        wordCount: resolveItem(BANK[session.scenarioId][pick]!, session.accent).ai.split(/\s+/).length,
        repetitions: 0,
        createdAt: new Date().toISOString(),
      }
      session.turns.push(turn)
      save(session)
      return turn
    }, randomDelay())
  },

  /** Conta uma repetição (play do início, repetir). */
  addRepetition(id: string, turnIndex: number): Promise<number> {
    return simulate(() => {
      const session = load(id)
      const turn = turnOf(session, turnIndex)
      turn.repetitions += 1
      save(session)
      return turn.repetitions
    }, 80)
  },

  /**
   * Texto da fala, para o navegador sintetizar a voz. Só o mock devolve o texto ao cliente; com o
   * backend real a fala virá como áudio (ou o texto só será liberado após a conferência).
   */
  getSpokenText(id: string, turnIndex: number): Promise<string> {
    return simulate(() => itemOf(load(id), turnIndex).ai, 60)
  },

  getHint(id: string, turnIndex: number, kind: HintKind): Promise<string> {
    return simulate(() => {
      const text = itemOf(load(id), turnIndex).ai
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
      const result = compareTranscription(itemOf(session, turnIndex).ai, typed)
      turnOf(session, turnIndex).transcription = result
      save(session)
      return result
    }, 400)
  },

  /** Mock: a correção vem pronta do banco; a IA real corrigirá a resposta de verdade. */
  submitReply(id: string, turnIndex: number, reply: string): Promise<Correction> {
    return simulate(() => {
      const session = load(id)
      const item = itemOf(session, turnIndex)
      const changed = !sameText(reply, item.corrected)
      const correction: Correction = {
        original: reply,
        corrected: item.corrected,
        explanation: changed ? item.explanation : 'Sua resposta está natural e correta. Ótimo trabalho! Veja o vocabulário-chave abaixo.',
        vocabulary: item.vocabulary,
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
