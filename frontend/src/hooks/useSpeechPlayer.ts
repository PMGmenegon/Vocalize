import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { estimateDuration, speechPlayer, splitWords, wordsInSeconds, type SpeechHandle, type SpeechLocale } from '../audio'

export type PlaybackStatus = 'idle' | 'playing' | 'paused'

interface Options {
  /** Texto a falar; `null` enquanto ainda não chegou (os controles ficam desativados). */
  text: string | null
  locale: SpeechLocale
  /** Velocidade "normal" (padrão 1). A velocidade "devagar" é sempre 0.75. */
  baseRate?: number
  /** Chamado sempre que a fala recomeça do início (conta uma repetição). */
  onRestart?: () => void
}

const SLOW_RATE = 0.75
/** Quanto "voltar" faz: ~3 s de fala, convertidos em palavras (a API não deixa andar no áudio). */
const BACK_SECONDS = 3

const ACCENT_NAME: Record<SpeechLocale, string> = { 'en-US': 'inglês americano', 'en-GB': 'inglês britânico' }

/**
 * Liga um texto ao motor de voz do app (ver src/audio) e devolve o que os players precisam:
 * estado, progresso por palavra, duração estimada, velocidade e controles.
 *
 * Nada toca sozinho: só os controles (acionados pelo usuário) iniciam a fala. A fala é cancelada ao
 * desmontar o componente (sair da página, trocar de rodada, encerrar a sessão).
 */
export function useSpeechPlayer({ text, locale, baseRate = 1, onRestart }: Options) {
  const supported = speechPlayer.supported
  const [status, setStatus] = useState<PlaybackStatus>('idle')
  const [wordIndex, setWordIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [slow, setSlow] = useState(false)
  const [message, setMessage] = useState('')

  const run = useRef(0)
  const handle = useRef<SpeechHandle | null>(null)
  const word = useRef(0)
  const restartRef = useRef(onRestart)
  useEffect(() => {
    restartRef.current = onRestart
  })

  const total = useMemo(() => splitWords(text ?? '').length, [text])
  const rate = slow ? SLOW_RATE : baseRate
  const duration = estimateDuration(total, rate)
  const progress = completed ? 1 : total === 0 ? 0 : Math.min(1, wordIndex / total)

  const start = useCallback(
    (from: number, rateNow: number) => {
      if (!text) return
      const mine = ++run.current
      word.current = from
      setWordIndex(from)
      setCompleted(false)
      setStatus('playing')
      setMessage('')
      handle.current = speechPlayer.speak(
        { text, locale, rate: rateNow, fromWord: from },
        {
          onStart: (voice) => {
            if (run.current !== mine) return
            if (!voice.matched) setMessage(`Seu aparelho não tem voz em ${ACCENT_NAME[locale]}; usando a voz mais próxima.`)
          },
          onWord: (i) => {
            if (run.current !== mine) return
            word.current = i
            setWordIndex(i)
          },
          onEnd: (reason) => {
            if (run.current !== mine) return
            if (reason === 'finished') {
              word.current = 0
              setWordIndex(0)
              setCompleted(true)
              setStatus('idle')
            } else if (reason === 'cancelled') {
              // Outra fala (ou o app) interrompeu esta: fica pausada no ponto atual.
              setStatus('paused')
            } else {
              setStatus('idle')
              setMessage('Não foi possível tocar o áudio. Confira se o som do aparelho está ligado.')
            }
          },
        },
      )
    },
    [text, locale],
  )

  const halt = useCallback(() => {
    run.current++
    handle.current?.cancel()
    handle.current = null
  }, [])

  // Sair da página, trocar de rodada ou encerrar a sessão desmonta o componente e cala a voz.
  useEffect(() => halt, [halt])

  const pause = useCallback(() => {
    halt()
    setStatus('paused')
  }, [halt])

  const stop = useCallback(() => {
    halt()
    word.current = 0
    setWordIndex(0)
    setCompleted(false)
    setStatus('idle')
  }, [halt])

  /** Toca do início na velocidade pedida (ou na atual) e conta uma repetição. */
  const play = useCallback(
    (rateOverride?: number) => {
      start(0, rateOverride ?? rate)
      restartRef.current?.()
    },
    [start, rate],
  )

  const toggle = useCallback(() => {
    if (status === 'playing') pause()
    else if (status === 'paused') start(word.current, rate)
    else play()
  }, [status, pause, start, play, rate])

  const repeat = useCallback(() => play(), [play])

  /**
   * "Voltar ~3 s": o navegador não deixa andar no áudio, então recomeçamos algumas palavras antes
   * (o equivalente em palavras a 3 s na velocidade atual). Parado, só reposiciona.
   */
  const back3 = useCallback(() => {
    const target = Math.max(0, (completed ? total : word.current) - wordsInSeconds(BACK_SECONDS, rate))
    if (status === 'playing') {
      start(target, rate)
      return
    }
    halt()
    word.current = target
    setWordIndex(target)
    setCompleted(false)
    setStatus(target === 0 ? 'idle' : 'paused')
  }, [completed, total, status, rate, start, halt])

  const toggleSpeed = useCallback(() => {
    const next = !slow
    setSlow(next)
    if (status === 'playing') start(word.current, next ? SLOW_RATE : baseRate)
  }, [slow, status, start, baseRate])

  return {
    supported,
    ready: supported && text !== null && total > 0,
    status,
    playing: status === 'playing',
    /** Índice da palavra falada agora (-1 se não está tocando). */
    activeWord: status === 'playing' ? Math.min(wordIndex, Math.max(0, total - 1)) : -1,
    /** 0–1 */
    progress,
    /** Posição e duração em segundos (estimadas: a API não informa o tempo real). */
    pos: progress * duration,
    duration,
    speed: rate,
    slow,
    /** Frase para leitores de tela (aria-live). */
    announcement: status === 'playing' ? 'Tocando' : status === 'paused' ? 'Pausado' : completed ? 'Áudio terminado' : '',
    /** Aviso discreto (voz alternativa, erro, sem suporte). */
    notice: supported ? message : 'Seu navegador não tem voz sintetizada. Use o Chrome, o Edge ou o Safari para ouvir.',
    toggle,
    play,
    repeat,
    back3,
    stop,
    toggleSpeed,
  }
}

export type SpeechPlayback = ReturnType<typeof useSpeechPlayer>

