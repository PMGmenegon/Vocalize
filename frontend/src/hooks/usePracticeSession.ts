import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { sessionService, type HintKind } from '../services'
import type { Correction, Session, TranscriptionResult, Turn } from '../types'

/**
 * Fases de uma rodada (iguais em qualquer layout):
 * preparing = esperando a próxima fala chegar · prepare-error = a fala falhou (dá para tentar de novo)
 * listen = fala pronta, aguardando a transcrição · reply = transcrição conferida, aguardando a resposta
 * reviewed = correção exibida · finished = limite de rodadas atingido e correção já lida
 */
export type Phase = 'preparing' | 'prepare-error' | 'listen' | 'reply' | 'reviewed' | 'finished'

interface State {
  turns: Turn[]
  phase: Phase
  /** Número da tentativa de buscar a próxima fala (muda a cada "próxima" ou "tentar de novo"). */
  attempt: number
  busy: boolean
  error: string
}

type Action =
  | { type: 'turn-ready'; turn: Turn }
  | { type: 'turn-failed' }
  | { type: 'request-turn' }
  | { type: 'busy'; busy: boolean }
  | { type: 'error'; message: string }
  | { type: 'checked'; index: number; transcription: TranscriptionResult }
  | { type: 'replied'; index: number; reply: string; correction: Correction; at: string }
  | { type: 'repetition'; index: number }
  | { type: 'finished' }

const patch = (turns: Turn[], index: number, change: Partial<Turn>) => turns.map((t) => (t.index === index ? { ...t, ...change } : t))

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'turn-ready':
      return { ...state, turns: [...state.turns, action.turn], phase: 'listen', error: '' }
    case 'turn-failed':
      return { ...state, phase: 'prepare-error' }
    case 'request-turn':
      return { ...state, phase: 'preparing', attempt: state.attempt + 1, error: '' }
    case 'busy':
      return { ...state, busy: action.busy }
    case 'error':
      return { ...state, error: action.message }
    case 'checked':
      return { ...state, turns: patch(state.turns, action.index, { transcription: action.transcription }), phase: 'reply', error: '' }
    case 'replied':
      return { ...state, turns: patch(state.turns, action.index, { reply: action.reply, correction: action.correction, repliedAt: action.at }), phase: 'reviewed', error: '' }
    case 'repetition': {
      const turn = state.turns.find((t) => t.index === action.index)
      return { ...state, turns: patch(state.turns, action.index, { repetitions: (turn?.repetitions ?? 0) + 1 }) }
    }
    case 'finished':
      return { ...state, phase: 'finished' }
  }
}

function initialState(session: Session): State {
  const last = session.turns.at(-1)
  const phase: Phase = !last ? 'preparing' : last.correction ? 'reviewed' : last.transcription ? 'reply' : 'listen'
  return { turns: session.turns, phase, attempt: 0, busy: false, error: '' }
}

/**
 * Toda a lógica de uma sessão de prática, compartilhada pelos layouts (treino e chat):
 * chegada assíncrona das falas, transcrição, resultado, resposta, correção, progresso,
 * carregamento e erro. Os layouts só desenham o que este hook entrega.
 * A sessão não tem roteiro fixo: o número de rodadas varia e ela termina por limite ou por "Encerrar".
 */
export function usePracticeSession(session: Session) {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, session, initialState)
  const requested = useRef<number | null>(null)

  // Busca a próxima fala quando a fase é "preparing". A guarda evita pedir duas vezes (StrictMode).
  useEffect(() => {
    if (state.phase !== 'preparing' || requested.current === state.attempt) return
    requested.current = state.attempt
    sessionService.nextTurn(session.id).then(
      (turn) => dispatch({ type: 'turn-ready', turn }),
      () => dispatch({ type: 'turn-failed' }),
    )
  }, [state.phase, state.attempt, session.id])

  const { turns, phase, busy, error } = state
  const current = turns.at(-1)
  const isLast = turns.length >= session.maxTurns
  const done = turns.filter((t) => t.correction).length

  /** Executa uma ação do serviço com estado de "ocupado" e mensagem de erro. */
  const run = useCallback(async <T,>(action: () => Promise<T>, onOk: (value: T) => void, message: string) => {
    dispatch({ type: 'busy', busy: true })
    try {
      onOk(await action())
    } catch {
      dispatch({ type: 'error', message })
    } finally {
      dispatch({ type: 'busy', busy: false })
    }
  }, [])

  const check = useCallback(
    (text: string) => {
      if (!current) return Promise.resolve()
      return run(() => sessionService.checkTranscription(session.id, current.index, text), (transcription) => dispatch({ type: 'checked', index: current.index, transcription }), 'Algo deu errado ao conferir. Tente de novo.')
    },
    [current, run, session.id],
  )

  const reply = useCallback(
    (text: string) => {
      if (!current) return Promise.resolve()
      return run(() => sessionService.submitReply(session.id, current.index, text), (correction) => dispatch({ type: 'replied', index: current.index, reply: text, correction, at: new Date().toISOString() }), 'Algo deu errado ao enviar. Tente de novo.')
    },
    [current, run, session.id],
  )

  /** Pede a próxima fala (ou encerra o fluxo se o limite de rodadas foi atingido). */
  const next = useCallback(() => {
    if (turns.length >= session.maxTurns) dispatch({ type: 'finished' })
    else dispatch({ type: 'request-turn' })
  }, [turns.length, session.maxTurns])

  const retry = useCallback(() => dispatch({ type: 'request-turn' }), [])

  const addRepetition = useCallback(() => {
    if (!current) return
    dispatch({ type: 'repetition', index: current.index })
    void sessionService.addRepetition(session.id, current.index).catch(() => undefined)
  }, [current, session.id])

  const getHint = useCallback((kind: HintKind) => (current ? sessionService.getHint(session.id, current.index, kind) : Promise.resolve('')), [current, session.id])

  /** Encerra a sessão (por escolha do usuário ou ao fim) e vai para o resumo. */
  const finish = useCallback(async () => {
    dispatch({ type: 'busy', busy: true })
    try {
      await sessionService.finish(session.id)
      navigate(`/app/praticar/${session.id}/resumo`, { replace: true })
    } catch {
      dispatch({ type: 'error', message: 'Não foi possível encerrar a sessão. Tente de novo.' })
      dispatch({ type: 'busy', busy: false })
    }
  }, [navigate, session.id])

  return { session, turns, current, phase, busy, error, isLast, done, check, reply, next, retry, addRepetition, getHint, finish }
}

export type PracticeController = ReturnType<typeof usePracticeSession>
