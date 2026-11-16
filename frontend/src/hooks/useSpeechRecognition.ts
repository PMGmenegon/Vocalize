import { useCallback, useEffect, useRef, useState } from 'react'
import { speechPlayer, type SpeechLocale } from '../audio'
import { getRecognitionConstructor, type RecognitionInstance } from '../audio/recognition'

/**
 * idle = parado · requesting = esperando o aviso de permissão do navegador · listening = ouvindo
 * processing = parou de ouvir, esperando o texto final · error = veja `error`
 */
export type MicState = 'idle' | 'requesting' | 'listening' | 'processing' | 'error'

export type MicError = 'denied' | 'no-mic' | 'no-speech' | 'network' | 'other'

interface Options {
  /** Sotaque da sessão: o reconhecimento espera esse inglês. */
  lang: SpeechLocale
  /** Recebe o texto FINAL (para ir ao campo de resposta, onde a pessoa revisa antes de enviar). */
  onText: (text: string) => void
}

const ERROR_MAP: Record<string, MicError | undefined> = {
  'not-allowed': 'denied',
  'service-not-allowed': 'denied',
  'audio-capture': 'no-mic',
  'no-speech': 'no-speech',
  network: 'network',
  aborted: undefined, // cancelado por nós (ao sair da tela)
}

/** Se o navegador não entregar o texto final em tantos ms depois de pararmos, desistimos. */
const FINAL_TIMEOUT_MS = 6000

/** Resposta por voz (Web Speech API): resultados parciais enquanto fala e texto final ao terminar. */
export function useSpeechRecognition({ lang, onText }: Options) {
  const supported = getRecognitionConstructor() !== undefined
  const [state, setState] = useState<MicState>('idle')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<MicError | null>(null)
  const [inserted, setInserted] = useState(false)

  const rec = useRef<RecognitionInstance | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const onTextRef = useRef(onText)
  useEffect(() => {
    onTextRef.current = onText
  })

  const release = useCallback(() => {
    window.clearTimeout(timer.current)
    const r = rec.current
    rec.current = null
    if (r) {
      r.onstart = r.onresult = r.onerror = r.onend = null
      try {
        r.abort()
      } catch {
        // já estava parado
      }
    }
  }, [])

  // Sair da tela solta o microfone.
  useEffect(() => release, [release])

  const start = useCallback(() => {
    const Recognition = getRecognitionConstructor()
    if (!Recognition) return
    release()
    // O microfone não pode captar a voz sintetizada: calamos o áudio antes de ouvir.
    speechPlayer.cancel()

    const r = new Recognition()
    r.lang = lang
    r.continuous = false
    r.interimResults = true
    r.maxAlternatives = 1
    rec.current = r

    let finalText = ''
    let partial = ''
    let failed = false

    setError(null)
    setInserted(false)
    setInterim('')
    setState('requesting')

    r.onstart = () => setState('listening')
    r.onresult = (e) => {
      let final = ''
      let live = ''
      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i]
        const text = result?.[0]?.transcript ?? ''
        if (result?.isFinal) final += text
        else live += text
      }
      finalText = final
      partial = live
      setInterim((final + live).trim())
    }
    r.onerror = (e) => {
      const mapped = ERROR_MAP[e.error] ?? (e.error in ERROR_MAP ? undefined : 'other')
      if (!mapped) return
      failed = true
      setError(mapped)
      setState('error')
    }
    r.onend = () => {
      window.clearTimeout(timer.current)
      rec.current = null
      setInterim('')
      if (failed) return
      // Alguns navegadores terminam sem marcar o último trecho como final: usamos o que houver.
      const text = (finalText || partial).trim()
      if (text) {
        onTextRef.current(text)
        setInserted(true)
        setState('idle')
      } else {
        setError('no-speech')
        setState('error')
      }
    }

    try {
      r.start()
    } catch {
      release()
      setError('other')
      setState('error')
    }
  }, [lang, release])

  const stop = useCallback(() => {
    const r = rec.current
    if (!r) return
    setState('processing')
    try {
      r.stop()
    } catch {
      // já estava parado
    }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      release()
      setInterim('')
      setError('no-speech')
      setState('error')
    }, FINAL_TIMEOUT_MS)
  }, [release])

  const toggle = useCallback(() => {
    if (state === 'listening') stop()
    else if (state === 'idle' || state === 'error') start()
  }, [state, start, stop])

  return { supported, state, interim, error, inserted, toggle }
}

export type VoiceInput = ReturnType<typeof useSpeechRecognition>
