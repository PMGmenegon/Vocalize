import type { ReactNode } from 'react'
import type { AsyncState } from '../../hooks/useAsync'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'
import { SkeletonBlock } from './Skeleton'

interface AsyncProps<T> {
  state: AsyncState<T>
  /** Esqueleto específico da tela. Sem ele, usa um genérico. */
  skeleton?: ReactNode
  /** Decide se os dados contam como "vazio". */
  isEmpty?: (data: T) => boolean
  empty?: { title: string; description?: string; action?: ReactNode }
  errorMessage?: string
  children: (data: T) => ReactNode
}

/** Resolve os três estados de qualquer tela que carrega dados: carregando, erro, vazio (e o conteúdo). */
export default function Async<T>({ state, skeleton, isEmpty, empty, errorMessage, children }: AsyncProps<T>) {
  if (state.status === 'loading') return <>{skeleton ?? <SkeletonBlock lines={4} />}</>
  if (state.status === 'error') return <ErrorState message={errorMessage} onRetry={state.reload} />
  if (isEmpty?.(state.data) && empty) return <EmptyState {...empty} />
  return <>{children(state.data)}</>
}
