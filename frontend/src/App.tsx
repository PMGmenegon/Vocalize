import AccentSwitch from './components/AccentSwitch'
import { useTheme } from './theme/useTheme'

// Página temporária só para validar o tema; é substituída pelo roteamento real nos próximos commits.
export default function App() {
  const { accent } = useTheme()
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <div className="accent-stripe" aria-hidden="true" />
      <h1 className="text-3xl font-black text-brand">Vocalize</h1>
      <p className="text-muted">Tema ativo: {accent}</p>
      <AccentSwitch />
      <button type="button" className="rounded-lg bg-brand px-4 py-3 font-bold text-on-brand hover:bg-brand-strong">
        Começar
      </button>
    </main>
  )
}
