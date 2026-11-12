import { useEffect, useRef, useState } from 'react'
import { PlayIcon } from '../../components/appIcons'
import Async from '../../components/ui/Async'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import Skeleton from '../../components/ui/Skeleton'
import { useAsync } from '../../hooks/useAsync'
import { reviewService } from '../../services'
import type { Flashcard, ReviewRating } from '../../types'

const RATINGS: { value: ReviewRating; label: string; hint: string }[] = [
  { value: 'again', label: 'Errei', hint: 'rever hoje' },
  { value: 'hard', label: 'Difícil', hint: 'em 1 dia' },
  { value: 'good', label: 'Bom', hint: 'em 3 dias' },
  { value: 'easy', label: 'Fácil', hint: 'em 7 dias' },
]

const norm = (s: string) => s.trim().toLowerCase()

function Flashcards({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [typed, setTyped] = useState('')
  const [played, setPlayed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const answer = useRef<HTMLHeadingElement>(null)
  const done = index >= cards.length
  const card = cards[index]

  useEffect(() => {
    if (flipped) answer.current?.focus()
  }, [flipped])

  async function rate(rating: ReviewRating) {
    if (!card) return
    setBusy(true)
    setError('')
    try {
      await reviewService.rate(card.id, rating)
      setIndex(index + 1)
      setFlipped(false)
      setTyped('')
      setPlayed(false)
    } catch {
      setError('Não foi possível salvar sua avaliação. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div>
        {done || !card ? (
          <Card tone="soft" className="text-center">
            <p role="status" className="text-2xl font-black text-ink">
              ✓ Revisão de hoje concluída!
            </p>
            <p className="mt-2 text-muted">Você revisou {cards.length} {cards.length === 1 ? 'palavra' : 'palavras'}. Volte amanhã para mais.</p>
            <div className="mt-5 flex justify-center">
              <Button to="/app">Ir para o início</Button>
            </div>
          </Card>
        ) : (
          <Card>
            <p className="text-sm font-bold text-muted">
              Cartão {index + 1} de {cards.length}
            </p>

            {!flipped ? (
              <form
                className="mt-4 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault()
                  setFlipped(true)
                }}
              >
                <h2 className="text-2xl font-black text-brand">Ouça e digite a palavra</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" onClick={() => setPlayed(true)}>
                    <PlayIcon className="h-5 w-5" /> Ouvir
                  </Button>
                  <p role="status" className="text-sm text-muted">
                    {played ? 'O áudio chega numa fase futura; por enquanto é só o visual.' : ''}
                  </p>
                </div>
                <Input
                  label="Palavra que você ouviu"
                  lang="en"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                />
                <Button type="submit" size="lg">
                  Virar cartão
                </Button>
              </form>
            ) : (
              <div className="mt-4 space-y-5">
                <h2 ref={answer} tabIndex={-1} className="text-2xl font-black text-brand focus:outline-none">
                  Resposta
                </h2>
                <div role="status">
                  {norm(typed) === norm(card.word) ? (
                    <Badge tone="ok">✓ Você acertou</Badge>
                  ) : (
                    <Badge tone="danger">
                      ✗ Você digitou: <span lang="en">{typed.trim() || '(nada)'}</span>
                    </Badge>
                  )}
                </div>
                <div className="rounded-xl bg-surface p-5">
                  <p lang="en" className="text-4xl font-black text-ink">
                    {card.word}
                  </p>
                  <p className="mt-1 text-lg text-ink">{card.meaning}</p>
                  <p lang="en" className="mt-3 text-muted">
                    “{card.example}”
                  </p>
                </div>
                <fieldset>
                  <legend className="mb-2 text-sm font-bold text-ink">Como foi lembrar essa palavra?</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {RATINGS.map((r) => (
                      <Button key={r.value} variant={r.value === 'again' ? 'danger' : 'secondary'} disabled={busy} onClick={() => void rate(r.value)} className="flex-col !gap-0">
                        <span>{r.label}</span>
                        <span className="text-xs font-normal">{r.hint}</span>
                      </Button>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}
            <p role="alert" className="mt-3 text-sm font-bold text-on-danger">
              {error}
            </p>
          </Card>
        )}
      </div>

      <Card as="aside" tone="soft">
        <h2 className="text-lg font-black text-ink">Fila de hoje</h2>
        <ol className="mt-3 space-y-2">
          {cards.map((c, i) => (
            <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
              <span lang="en" className={`font-bold ${i < index ? 'text-muted line-through' : 'text-ink'}`}>
                {c.word}
              </span>
              <span className="text-muted">{i < index ? '✓ feita' : i === index && !done ? '● agora' : 'pendente'}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}

export default function ReviewPage() {
  const state = useAsync(() => reviewService.getDue())
  return (
    <Page>
      <PageHeader title="Revisão" description="Ouça a palavra, escreva como você ouviu e confira. Avalie para o app saber quando mostrá-la de novo." />
      <Async
        state={state}
        skeleton={
          <div role="status" aria-live="polite" className="grid gap-6 lg:grid-cols-[1fr_18rem]">
            <span className="sr-only">Carregando suas palavras…</span>
            <Skeleton className="h-80" />
            <Skeleton className="h-56" />
          </div>
        }
        isEmpty={(cards) => cards.length === 0}
        empty={{
          title: 'Nenhuma palavra para revisar hoje',
          description: 'As palavras que você errar nas sessões aparecem aqui para revisão.',
          action: <Button to="/app/praticar">Praticar agora</Button>,
        }}
        errorMessage="Não foi possível carregar suas palavras para revisão."
      >
        {(cards) => <Flashcards cards={cards} />}
      </Async>
    </Page>
  )
}
