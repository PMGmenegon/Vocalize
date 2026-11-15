import Button from './Button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

/** Erro de carregamento. role="alert" faz o leitor de tela anunciar na hora. */
export default function ErrorState({ message = 'Não foi possível carregar esta informação.', onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="border-y border-line py-10">
      <p className="type-eyebrow text-on-danger">
        <span aria-hidden="true">✗ </span>Algo deu errado
      </p>
      <p className="type-display mt-2 text-3xl">{message}</p>
      {onRetry && (
        <div className="mt-6">
          <Button variant="secondary" onClick={onRetry}>
            Tentar de novo
          </Button>
        </div>
      )}
    </div>
  )
}
