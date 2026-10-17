import { config } from '../config'

const paraUtc = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const descricaoCompleta = () =>
  `${config.agenda.descricao}\n\n📍 ${config.endereco}\n🗺️ ${linkMaps()}`

export function linkGoogleAgenda(): string {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: config.agenda.titulo,
    dates: `${paraUtc(config.inicio)}/${paraUtc(config.fim)}`,
    details: descricaoCompleta(),
    location: config.endereco,
    ctz: config.fuso,
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

export const linkMaps = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.buscaMapa)}`

export const linkWaze = () =>
  `https://waze.com/ul?q=${encodeURIComponent(config.buscaMapa)}&navigate=yes`

const escaparIcs = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')

/** Quebra linhas com mais de 75 bytes, como pede o formato iCalendar. */
function dobrar(linha: string): string {
  const enc = new TextEncoder()
  const partes: string[] = []
  let atual = ''
  for (const ch of linha) {
    if (enc.encode(atual + ch).length > (partes.length ? 74 : 75)) {
      partes.push(atual)
      atual = ch
    } else atual += ch
  }
  partes.push(atual)
  return partes.join('\r\n ')
}

export function conteudoIcs(): string {
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Convite//Pool party//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${paraUtc(config.inicio)}-${config.chaveAparelho}@convite`,
    `DTSTAMP:${paraUtc(new Date().toISOString())}`,
    `DTSTART:${paraUtc(config.inicio)}`,
    `DTEND:${paraUtc(config.fim)}`,
    `SUMMARY:${escaparIcs(config.agenda.titulo)}`,
    `DESCRIPTION:${escaparIcs(descricaoCompleta())}`,
    `LOCATION:${escaparIcs(config.endereco)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escaparIcs(`Amanhã: ${config.agenda.titulo}`)}`,
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return linhas.map(dobrar).join('\r\n') + '\r\n'
}

/** Baixa o arquivo .ics (abre a agenda do celular/computador). */
export function baixarIcs() {
  const blob = new Blob([conteudoIcs()], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = config.agenda.arquivo
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 4000)
}
