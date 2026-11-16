import type { SpeakHandlers, SpeakRequest, SpeechHandle, SpeechPlayer } from './SpeechPlayer'
import { chunkWords, splitWords, wordAtChar, wordSeconds, wordStarts } from './timing'
import { detectEngine, rankVoices, type Engine } from './voicePreferences'

/** Sem o som começar em tantos ms, a voz é considerada muda (vozes online às vezes falham sem avisar). */
const START_TIMEOUT_MS = 4000
/** O Chrome costuma ignorar um speak() logo depois de cancel(); uma pausa curta resolve. */
const AFTER_CANCEL_DELAY_MS = 60

const isSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'

/**
 * Implementação com a Web Speech API (speechSynthesis), sem custo.
 *
 * - Fala frase a frase (o Chrome corta falas longas).
 * - Progresso por palavra via evento `boundary`; se a voz não enviar esse evento (vozes online do
 *   Chrome não enviam), o progresso avança por tempo estimado.
 * - Não usa pause()/resume() do navegador (pouco confiáveis); quem pausa cancela e retoma de uma palavra.
 */
export class WebSpeechPlayer implements SpeechPlayer {
  readonly supported = isSupported()

  private voices: SpeechSynthesisVoice[] = []
  private readonly engine: Engine
  private seq = 0
  private current: { id: number; end: (reason: 'cancelled') => void } | null = null
  /** Mantém a fala em andamento referenciada: o Chrome pode coletá-la antes do `onend`. */
  private readonly keepAlive = new Set<SpeechSynthesisUtterance>()
  /** Vozes que ficaram mudas: não tentamos de novo. */
  private readonly muted = new Set<string>()

  constructor() {
    this.engine = typeof navigator === 'undefined' ? 'other' : detectEngine(navigator.userAgent, navigator.maxTouchPoints)
    if (!this.supported) return
    const synth = window.speechSynthesis
    const refresh = () => {
      this.voices = synth.getVoices()
    }
    refresh()
    // As vozes carregam de forma assíncrona: getVoices() pode vir vazio na primeira chamada.
    synth.addEventListener('voiceschanged', refresh)
    // Sem isto, recarregar a página no Chrome deixa a voz falando.
    window.addEventListener('pagehide', () => this.cancel())
  }

  cancel() {
    this.current?.end('cancelled')
    if (this.supported) window.speechSynthesis.cancel()
  }

  speak(request: SpeakRequest, handlers: SpeakHandlers): SpeechHandle {
    const id = ++this.seq
    const handle: SpeechHandle = {
      cancel: () => {
        if (this.current?.id === id) this.cancel()
      },
    }
    if (!this.supported) {
      window.setTimeout(() => handlers.onEnd?.('error'), 0)
      return handle
    }
    const synth = window.speechSynthesis
    const hadActive = this.current !== null || synth.speaking || synth.pending
    this.current?.end('cancelled')
    if (hadActive) synth.cancel()

    const words = splitWords(request.text)
    const from = Math.min(Math.max(0, request.fromWord ?? 0), Math.max(0, words.length - 1))
    const chunks = chunkWords(words.slice(from)).map((c) => ({ ...c, offset: c.offset + from }))
    const candidates = rankVoices(this.voices, request.locale, this.engine).filter((c) => !c.voice || !this.muted.has(c.voice.voiceURI))

    let ended = false
    let started = false
    let ticker: number | undefined
    let watchdog: number | undefined
    let attempt = 0

    const stopTimers = () => {
      window.clearInterval(ticker)
      window.clearTimeout(watchdog)
    }
    const end = (reason: 'finished' | 'cancelled' | 'error') => {
      if (ended) return
      ended = true
      stopTimers()
      if (this.current?.id === id) this.current = null
      this.keepAlive.clear()
      handlers.onEnd?.(reason)
    }
    this.current = { id, end }

    /** Fala o trecho `k` com a voz candidata `c`. Só antes do som começar é que se troca de voz. */
    const playChunk = (k: number, c: number) => {
      if (ended) return
      const chunk = chunks[k]
      if (!chunk) return end('finished')
      const choice = candidates[Math.min(c, candidates.length - 1)]!
      const mine = ++attempt
      const alive = () => !ended && mine === attempt

      const utterance = new SpeechSynthesisUtterance(chunk.words.join(' '))
      utterance.lang = choice.voice?.lang ?? request.locale
      if (choice.voice) utterance.voice = choice.voice
      utterance.rate = request.rate
      const starts = wordStarts(chunk.words)
      let sawBoundary = false

      const failOrNext = () => {
        if (!alive()) return
        stopTimers()
        if (!started && c < candidates.length - 1) {
          if (choice.voice) this.muted.add(choice.voice.voiceURI)
          // Invalida esta tentativa ANTES de cancelar: o cancel() dispara "interrupted" nela.
          attempt++
          synth.cancel()
          window.setTimeout(() => playChunk(k, c + 1), AFTER_CANCEL_DELAY_MS)
        } else {
          end('error')
        }
      }

      utterance.onstart = () => {
        if (!alive()) return
        window.clearTimeout(watchdog)
        if (!started) {
          started = true
          handlers.onStart?.({ name: choice.voice?.name ?? null, matched: choice.matched })
        }
        handlers.onWord?.(chunk.offset)
        // Plano B: sem evento de fronteira, avança uma palavra por tempo estimado.
        let tick = 0
        window.clearInterval(ticker)
        ticker = window.setInterval(() => {
          if (sawBoundary || !alive()) return window.clearInterval(ticker)
          tick = Math.min(tick + 1, chunk.words.length - 1)
          handlers.onWord?.(chunk.offset + tick)
        }, wordSeconds(request.rate) * 1000)
      }
      utterance.onboundary = (e) => {
        if (!alive() || (e.name && e.name !== 'word')) return
        sawBoundary = true
        window.clearInterval(ticker)
        handlers.onWord?.(chunk.offset + wordAtChar(starts, e.charIndex))
      }
      utterance.onend = () => {
        this.keepAlive.delete(utterance)
        if (!alive()) return
        stopTimers()
        handlers.onWord?.(chunk.offset + chunk.words.length)
        playChunk(k + 1, c)
      }
      utterance.onerror = (e) => {
        if (!alive()) return
        if (e.error === 'interrupted' || e.error === 'canceled') return end('cancelled')
        failOrNext()
      }

      if (!started) {
        window.clearTimeout(watchdog)
        watchdog = window.setTimeout(failOrNext, START_TIMEOUT_MS)
      }
      this.keepAlive.add(utterance)
      synth.speak(utterance)
    }

    // Sem espera quando nada estava tocando: o iOS exige que o primeiro speak() ocorra dentro do gesto.
    if (hadActive) window.setTimeout(() => playChunk(0, 0), AFTER_CANCEL_DELAY_MS)
    else playChunk(0, 0)
    return handle
  }
}
