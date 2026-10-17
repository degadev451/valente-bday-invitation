import { config } from '../config'

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
export const rand = (min: number, max: number) => min + Math.random() * (max - min)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/** ID único por aparelho (crypto.randomUUID com alternativa para navegadores antigos). */
export function novoId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes)
  else for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const h = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

/** Nome curto fica inteiro; nome longo vira só o primeiro nome (ou "Família Fulano"). */
export function nomeCarinhoso(nome: string): string {
  const limpo = nome.trim().replace(/\s+/g, ' ')
  if (limpo.length <= 18) return limpo
  const [primeiro, segundo] = limpo.split(' ')
  // "Família Souza Albuquerque…" vira "Família Souza", e não só "Família"
  return /^fam(í|i)lia$/i.test(primeiro) && segundo ? `${primeiro} ${segundo}` : primeiro
}

export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('pt-BR', { timeZone: config.fuso, ...opts })

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "domingo, 29 de novembro de 2026" */
export const dataPorExtenso = (iso: string) =>
  fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))

/** "Domingo, 29 de novembro" */
export const diaCurto = (iso: string) =>
  capitalizar(fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso)))

/** "12h" ou "12h30" */
export function hora(iso: string): string {
  const partes = fmt({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(
    new Date(iso),
  )
  const h = Number(partes.find((p) => p.type === 'hour')?.value ?? 0)
  const m = partes.find((p) => p.type === 'minute')?.value ?? '00'
  return m === '00' ? `${h}h` : `${h}h${m}`
}

/** "terça-feira, 10 de novembro" */
export const prazoPorExtenso = (iso: string) =>
  fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso))

export { capitalizar }
