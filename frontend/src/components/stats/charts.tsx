import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

/**
 * Gráficos do tema: todas as cores vêm das variáveis CSS (var(--brand), var(--ink)...),
 * então mudam sozinhas quando o sotaque (US/UK) muda. Cada barra tem rótulo numérico
 * e cada ponto da linha é marcado, então a leitura não depende só de cor.
 */
const tick = { fill: 'var(--ink)', fontSize: 12 }
const tooltipStyle = {
  backgroundColor: 'var(--card)',
  border: '2px solid var(--control)',
  borderRadius: 12,
  color: 'var(--ink)',
}

export function AccuracyLine({ data }: { data: { label: string; accuracy: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis dataKey="label" tick={tick} stroke="var(--control)" interval="preserveStartEnd" />
        <YAxis domain={[0, 100]} tick={tick} stroke="var(--control)" unit="%" />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Acerto']} />
        <Line
          type="monotone"
          dataKey="accuracy"
          name="Acerto"
          stroke="var(--brand)"
          strokeWidth={3}
          dot={{ r: 4, fill: 'var(--card)', stroke: 'var(--brand)', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: 'var(--brand)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

/** Barras horizontais com o valor escrito na ponta. */
export function HorizontalBars({ data, unit = '' }: { data: { name: string; value: number }[]; unit?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--line)" horizontal={false} />
        <XAxis type="number" tick={tick} stroke="var(--control)" allowDecimals={false} />
        <YAxis type="category" dataKey="name" tick={tick} stroke="var(--control)" width={130} />
        <Tooltip cursor={{ fill: 'var(--surface)' }} contentStyle={tooltipStyle} formatter={(v) => [`${v}${unit}`, 'Valor']} />
        <Bar dataKey="value" fill="var(--brand)" radius={[0, 6, 6, 0]}>
          <LabelList dataKey="value" position="right" fill="var(--ink)" fontSize={12} fontWeight={700} formatter={(v) => `${v}${unit}`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/** Barras verticais com o valor acima de cada coluna. */
export function ColumnBars({ data, unit = '' }: { data: { name: string; value: number }[]; unit?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis dataKey="name" tick={tick} stroke="var(--control)" />
        <YAxis tick={tick} stroke="var(--control)" allowDecimals={false} />
        <Tooltip cursor={{ fill: 'var(--surface)' }} contentStyle={tooltipStyle} formatter={(v) => [`${v}${unit}`, 'Valor']} />
        <Bar dataKey="value" fill="var(--brand)" radius={[6, 6, 0, 0]}>
          <LabelList dataKey="value" position="top" fill="var(--ink)" fontSize={12} fontWeight={700} formatter={(v) => `${v}${unit}`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
