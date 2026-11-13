import type { Character } from '../../data/scenarios'
import Avatar from './Avatar'

/** "Digitando…" antes de a bolha do personagem aparecer. */
export default function TypingIndicator({ character }: { character: Character }) {
  return (
    <div className="flex items-end gap-2" role="status">
      <Avatar spec={character.avatar} className="h-9 w-9 sm:h-10 sm:w-10" />
      <div className="flex gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3">
        <span className="sr-only">{character.name} está digitando…</span>
        {[0, 1, 2].map((i) => (
          <span key={i} aria-hidden="true" className="typing-dot h-2 w-2 rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}
