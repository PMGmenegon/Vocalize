import type { PlacementQuestion } from '../../data/placementQuestions'
import ChoiceGroup from '../ui/ChoiceGroup'
import { LETTERS_BY_INDEX } from './letters'

interface Props {
  question: PlacementQuestion
  /** Alternativa marcada (índice) ou null. Nenhum acerto é mostrado durante o teste. */
  value: number | null
  onChange: (index: number) => void
}

/** Uma pergunta do teste: texto de apoio (se houver), enunciado e as 4 alternativas. */
export default function PlacementQuestionView({ question, value, onChange }: Props) {
  const options = question.options.map((text, i) => ({ value: i, label: `${LETTERS_BY_INDEX[i]}) ${text}` }))
  return (
    <div>
      {question.passage && (
        <blockquote lang="en" className="mb-4 border-l-4 border-brand bg-surface p-4 text-ink">
          {question.passage}
        </blockquote>
      )}
      <p lang="en" className="mb-4 text-xl font-black text-ink">
        {question.prompt}
      </p>
      {/* A pergunta muda a cada tela, então o grupo é remontado para não carregar o foco da anterior. */}
      <div lang="en">
        <ChoiceGroup
          key={question.id}
          legend="Alternativas"
          hideLegend
          value={value ?? -1}
          options={options}
          onChange={onChange}
          columns="sm:grid-cols-2"
        />
      </div>
    </div>
  )
}
