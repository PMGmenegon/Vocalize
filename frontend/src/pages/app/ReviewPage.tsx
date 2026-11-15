import { useEffect, useRef, useState } from 'react'
import { PlayIcon } from '../../components/appIcons'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import DetailPanel from '../../components/ui/DetailPanel'
import { Input } from '../../components/ui/Input'
import { List } from '../../components/ui/List'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import Section from '../../components/ui/Section'
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

  const right = card ? norm(typed) === norm(card.word) : false

  return (
    <>
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          {done || !card ? (
            <section className="border-y border-line py-12">
              <p role="status" className="type-display text-3xl">
                ✓ Revisão de hoje concluída!
              </p>
              <p className="mt-3 text-lg text-muted">
                Você revisou {cards.length} {cards.length === 1 ? 'palavra' : 'palavras'}. Volte amanhã para mais.
              </p>
              <div className="mt-6">
                <Button to="/app">Ir para o início</Button>
              </div>
            </section>
          ) : (
            <section aria-label={`Cartão ${index + 1} de ${cards.length}`}>
              <p className="type-eyebrow border-b border-ink pb-2">
                Cartão {index + 1} de {cards.length}
              </p>

              {!flipped ? (
                <form
                  className="mt-6 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setFlipped(true)
                  }}
                >
                  <h2 className="type-display text-3xl">Ouça e digite a palavra</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" onClick={() => setPlayed(true)}>
                      <PlayIcon className="h-5 w-5" /> Ouvir
                    </Button>
                    <p role="status" className="text-sm text-muted">
                      {played ? 'O áudio chega numa fase futura; por enquanto é só o visual.' : ''}
                    </p>
                  </div>
                  <Input label="Palavra que você ouviu" lang="en" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} />
                  <Button type="submit" size="lg" className="px-8">
                    Virar cartão
                  </Button>
                </form>
              ) : (
                <div className="mt-6 space-y-6">
                  <h2 ref={answer} tabIndex={-1} className="type-eyebrow text-brand focus:outline-none">
                    Resposta
                  </h2>
                  <p role="status" className={`font-black ${right ? 'text-on-ok' : 'text-on-danger'}`}>
                    {right ? (
                      '✓ Você acertou'
                    ) : (
                      <>
                        ✗ Você digitou: <span lang="en">{typed.trim() || '(nada)'}</span>
                      </>
                    )}
                  </p>
                  <div className="border-l-2 border-brand pl-5">
                    <p lang="en" className="type-display text-5xl">
                      {card.word}
                    </p>
                    <p className="mt-2 text-xl text-ink">{card.meaning}</p>
                    <p lang="en" className="mt-3 text-muted">
                      “{card.example}”
                    </p>
                  </div>
                  <fieldset>
                    <legend className="type-eyebrow mb-3">Como foi lembrar essa palavra?</legend>
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
              <p role="alert" className="mt-3 text-sm font-bold text-on-danger empty:hidden">
                {error}
              </p>
            </section>
          )}
        </div>

        <DetailPanel label="Fila de hoje">
          <Section id="queue-title" title="Fila de hoje" meta={cards.length}>
            <List ordered>
              {cards.map((c, i) => (
                <li key={c.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                  <span lang="en" className={`font-bold ${i < index ? 'text-muted line-through' : 'text-ink'}`}>
                    {c.word}
                  </span>
                  <span className={i === index && !done ? 'font-bold text-brand' : 'text-muted'}>{i < index ? '✓ feita' : i === index && !done ? '● agora' : 'pendente'}</span>
                </li>
              ))}
            </List>
          </Section>
        </DetailPanel>
      </div>
    </>
  )
}

export default function ReviewPage() {
  const state = useAsync(() => reviewService.getDue())
  return (
    <Page>
      <PageHeader
        eyebrow="Revisão"
        title="Palavras do dia"
        description="Ouça a palavra, escreva como você ouviu e confira. Avalie para o app saber quando mostrá-la de novo."
      />
      <Async
        state={state}
        skeleton={
          <div role="status" aria-live="polite" className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
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
