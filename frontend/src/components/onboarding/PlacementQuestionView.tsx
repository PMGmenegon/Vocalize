import type { PlacementQuestion } from '../../data/placementQuestions'
import ChoiceGroup from '../ui/ChoiceGroup'
import { LETTERS_BY_INDEX } from './letters'

interface Props {
  question: PlacementQuestion
  /** Alternativa marcada (índice) ou null. Nenhum acerto é mostrado durante o teste. */
  value: number | null
  onChange: (index: number) => void
}

/** Uma pergunta do teste: texto de apoio (se houver), enunciado e as alternativas. */
export default function PlacementQuestionView({ question, value, onChange }: Props) {
  const options = question.options.map((text, i) => ({ value: i, label: `${LETTERS_BY_INDEX[i]}) ${text}` }))
  return (
    <div>
      {question.passage && (
        <blockquote lang="en" className="mb-6 border-l-2 border-brand pl-5 text-lg text-ink">
          {question.passage}
        </blockquote>
      )}
      <p lang="en" className="type-display mb-6 text-3xl">
        {question.prompt}
      </p>
      {/* A pergunta muda a cada tela, então o grupo é remontado para não carregar o foco da anterior. */}
      <div lang="en">
        <ChoiceGroup key={question.id} legend="Alternativas" hideLegend value={value ?? -1} options={options} onChange={onChange} />
      </div>
    </div>
  )
}
