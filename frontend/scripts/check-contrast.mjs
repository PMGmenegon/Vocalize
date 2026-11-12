/**
 * Verifica o contraste WCAG 2.x (nível AA) das combinações de cores de cada tema.
 *
 * Lê as variáveis CSS direto de src/index.css, então não há como o relatório
 * ficar desatualizado em relação ao que o navegador realmente usa.
 *
 *   - texto normal ........ razão mínima 4.5:1
 *   - componentes de UI ... razão mínima 3:1 (bordas de controles, anel de foco)
 *
 * Uso: npm run check:contrast   (sai com código 1 se algum par falhar)
 */
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')

/** Extrai { nome: '#rrggbb' } do bloco de variáveis de um tema. */
function readTokens(accent) {
  const blocks = css.matchAll(
    new RegExp(`html\\[data-accent="${accent}"\\][^{]*\\{([^}]*)\\}`, 'g'),
  )
  for (const [, body] of blocks) {
    if (!body.includes('--canvas')) continue // outra regra do mesmo tema
    const tokens = {}
    for (const m of body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
      tokens[m[1]] = m[2]
    }
    return tokens
  }
  throw new Error(`Bloco de tokens do tema "${accent}" não encontrado em index.css`)
}

/** Luminância relativa (fórmula WCAG). */
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// [primeiro plano, fundo, mínimo, descrição]
const TEXT = 4.5
const UI = 3
const PAIRS = [
  ['ink', 'canvas', TEXT, 'texto principal'],
  ['ink', 'surface', TEXT, 'texto principal em cartões'],
  ['ink', 'card', TEXT, 'texto principal em cards elevados'],
  ['muted', 'card', TEXT, 'texto secundário em cards elevados'],
  ['link', 'card', TEXT, 'links em cards elevados'],
  ['on-danger', 'card', TEXT, 'erros em cards elevados'],
  ['control', 'card', UI, 'borda de controles em cards'],
  ['focus', 'card', UI, 'anel de foco em cards'],
  ['brand', 'card', UI, 'bordas de marca em cards'],
  ['muted', 'canvas', TEXT, 'texto secundário'],
  ['muted', 'surface', TEXT, 'texto secundário em cartões'],
  ['link', 'canvas', TEXT, 'links'],
  ['link', 'surface', TEXT, 'links em cartões'],
  ['accent', 'canvas', TEXT, 'texto na cor secundária'],
  ['accent', 'surface', TEXT, 'texto na cor secundária em cartões'],
  ['on-brand', 'brand', TEXT, 'texto sobre a cor da marca (botões, hero)'],
  ['on-brand-soft', 'brand', TEXT, 'texto suave sobre a cor da marca'],
  ['on-brand', 'brand-strong', TEXT, 'texto em botão (hover)'],
  ['on-accent', 'accent', TEXT, 'texto sobre a cor secundária'],
  ['control', 'canvas', UI, 'borda de controles'],
  ['brand', 'canvas', UI, 'botão sobre o fundo da página'],
  ['focus', 'canvas', UI, 'anel de foco'],
  ['focus', 'surface', UI, 'anel de foco em cartões'],
  ['on-brand', 'brand', UI, 'anel de foco sobre a cor da marca'],
  ['on-danger', 'danger', TEXT, 'palavra errada destacada'],
  ['on-ok', 'ok', TEXT, 'palavra corrigida destacada'],
  ['ink', 'danger', TEXT, 'texto comum sobre fundo de erro'],
  ['muted', 'on-brand-soft', TEXT, 'texto secundário sobre fundo suave'],
  ['on-danger', 'canvas', TEXT, 'mensagens de erro e palavras faltando sobre o fundo'],
  ['on-danger', 'surface', TEXT, 'mensagens de erro em cartões'],
  ['on-danger', 'canvas', UI, 'borda de campo com erro'],
  ['on-ok', 'canvas', TEXT, 'texto de acerto sobre o fundo'],
  ['brand', 'surface', UI, 'ícones e bordas de marca em cartões'],
  ['accent', 'surface', UI, 'ícones na cor secundária em cartões'],
]

let failures = 0
for (const accent of ['us', 'uk']) {
  const t = readTokens(accent)
  console.log(`\nTema ${accent.toUpperCase()}`)
  for (const [fg, bg, min, label] of PAIRS) {
    const fgHex = t[fg]
    const bgHex = t[bg]
    if (!fgHex || !bgHex) {
      console.log(`  ?  token ausente: ${fg} / ${bg}`)
      failures++
      continue
    }
    const ratio = contrast(fgHex, bgHex)
    const ok = ratio >= min
    if (!ok) failures++
    console.log(
      `  ${ok ? 'OK ' : 'XX '} ${ratio.toFixed(2).padStart(5)}:1 (mín ${min})  ${label}  [${fg} ${fgHex} / ${bg} ${bgHex}]`,
    )
  }
}

if (failures > 0) {
  console.error(`\n${failures} combinação(ões) abaixo do mínimo WCAG AA.`)
  process.exit(1)
}
console.log('\nTodas as combinações atendem WCAG AA.')
