import type { MicError, VoiceInput } from '../../hooks/useSpeechRecognition'
import { MicIcon } from '../appIcons'
import Button from '../ui/Button'

const ERROR_TEXT: Record<MicError, string> = {
  denied: 'O acesso ao microfone está bloqueado. Libere-o nas permissões do site (ícone de cadeado ao lado do endereço; no iPhone, em Ajustes > Safari > Microfone) e tente de novo. Você também pode digitar.',
  'no-mic': 'Não encontramos um microfone neste aparelho. Conecte um e tente de novo, ou digite sua resposta.',
  'no-speech': 'Não ouvimos nada. Toque no microfone e fale de novo, ou digite sua resposta.',
  network: 'O reconhecimento de voz precisa de internet e não conseguiu se conectar. Digite sua resposta.',
  other: 'Não foi possível usar o microfone agora. Digite sua resposta.',
}

const LABEL = {
  idle: 'Responder por voz',
  requesting: 'Permita o microfone…',
  listening: 'Ouvindo… toque para parar',
  processing: 'Processando…',
  error: 'Tentar por voz de novo',
} as const

/** Pontinho que pulsa enquanto o microfone está aberto (e fica parado com movimento reduzido). */
const LiveDot = () => <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-on-danger motion-safe:animate-pulse" />

/**
 * Botão do microfone. Escondido quando o navegador não reconhece voz (a dica fica em <MicStatus />).
 * `variant`: "labeled" (com texto, no treino) ou "icon" (só o ícone, no chat).
 */
export function MicButton({ input, variant }: { input: VoiceInput; variant: 'labeled' | 'icon' }) {
  if (!input.supported) return null
  const { state } = input
  const listening = state === 'listening'
  const waiting = state === 'requesting' || state === 'processing'
  const label = LABEL[state]

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={input.toggle}
        aria-pressed={listening}
        aria-disabled={waiting || undefined}
        aria-label={label}
        title={label}
        className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 bg-card hover:bg-surface ${listening ? 'border-on-danger text-on-danger' : 'border-control text-brand'}`}
      >
        {listening ? <LiveDot /> : <MicIcon className="h-5 w-5" />}
        {listening && <span className="sr-only">Parar de ouvir</span>}
      </button>
    )
  }
  return (
    <Button variant="secondary" onClick={input.toggle} aria-pressed={listening} aria-disabled={waiting || undefined} className={listening ? '!border-on-danger' : ''}>
      {listening ? <LiveDot /> : <MicIcon className="h-5 w-5" />} {label}
    </Button>
  )
}

/**
 * Estado do microfone para todo mundo, inclusive leitores de tela (aria-live): texto parcial enquanto
 * a pessoa fala, erros com o que fazer, e a dica de navegador quando não há reconhecimento de voz.
 */
export function MicStatus({ input, className = '' }: { input: VoiceInput; className?: string }) {
  let message = ''
  if (!input.supported) message = 'Resposta por voz não está disponível neste navegador. Use o Chrome, o Edge ou o Safari, ou continue digitando.'
  else if (input.state === 'requesting') message = 'Permita o uso do microfone no aviso do navegador.'
  else if (input.state === 'listening') message = input.interim ? `Ouvindo: “${input.interim}”` : 'Ouvindo… fale agora.'
  else if (input.state === 'processing') message = input.interim ? `Processando: “${input.interim}”` : 'Processando…'
  else if (input.state === 'error' && input.error) message = ERROR_TEXT[input.error]
  else if (input.inserted) message = 'Texto colocado no campo. Revise antes de enviar.'

  const isError = input.state === 'error'
  return (
    <p role="status" aria-live="polite" className={`min-h-5 text-sm empty:hidden ${isError ? 'font-bold text-on-danger' : 'text-muted'} ${className}`}>
      {message}
    </p>
  )
}
