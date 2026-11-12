import Button from './Button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

/** Erro de carregamento. role="alert" faz o leitor de tela anunciar na hora. */
export default function ErrorState({ message = 'Não foi possível carregar esta informação.', onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-2xl border-2 border-on-danger bg-danger p-6 text-on-danger">
      <p className="font-black">
        <span aria-hidden="true">✗ </span>
        {message}
      </p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="secondary" onClick={onRetry}>
            Tentar de novo
          </Button>
        </div>
      )}
    </div>
  )
}
