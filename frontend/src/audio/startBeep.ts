const DURATION = 0.08
const PEAK_GAIN = 0.06
const FREQUENCY = 880
const FADE = 0.015

let context: AudioContext | null = null

/**
 * Bip curto e suave (~80 ms) gerado pela Web Audio API: oscilador + envelope de volume
 * (subida e descida rápidas, para não estalar). Não usa arquivos de áudio e nunca lança erro:
 * sem suporte ou com o áudio bloqueado, simplesmente não toca.
 */
export function playStartBeep(): void {
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return
    context ??= new Ctor()
    const ctx = context
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined)
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = FREQUENCY
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(PEAK_GAIN, now + FADE)
    gain.gain.setValueAtTime(PEAK_GAIN, now + DURATION - FADE)
    gain.gain.linearRampToValueAtTime(0, now + DURATION)
    osc.connect(gain).connect(ctx.destination)
    osc.onended = () => {
      osc.disconnect()
      gain.disconnect()
    }
    osc.start(now)
    osc.stop(now + DURATION)
  } catch {
    // O bip é só um detalhe: falhar em silêncio.
  }
}
