import { config } from '../config'
import { useNow } from '../lib/hooks'
import { diaCurto, hora, plural } from '../lib/utils'
import { Reveal } from './Reveal'
import solImg from '../assets/sol.webp'

const INICIO = new Date(config.inicio).getTime()
const AGRADECER = new Date(config.fim).getTime() + config.horasAteAgradecer * 3_600_000

const UNIDADES = [
  { chave: 'dias', um: 'dia', varios: 'dias' },
  { chave: 'horas', um: 'hora', varios: 'horas' },
  { chave: 'minutos', um: 'minuto', varios: 'minutos' },
  { chave: 'segundos', um: 'segundo', varios: 'segundos' },
] as const

function partes(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
  }
}

export function Countdown() {
  const agora = useNow(1000)
  const estado = agora < INICIO ? 'antes' : agora < AGRADECER ? 'durante' : 'depois'
  const p = partes(INICIO - agora)

  return (
    <section className="section section--blush countdown" id="contagem" aria-labelledby="contagem-titulo">
      <svg className="section__wave" aria-hidden="true">
        <use href="#divisor" />
      </svg>

      <div className="section__inner">
        <Reveal as="p" className="section__eyebrow">
          {estado === 'antes' ? 'Contagem para o mergulho' : estado === 'durante' ? 'Chegou o dia' : 'Foi lindo'}
        </Reveal>
        <Reveal as="h2" className="section__title" id="contagem-titulo" delay={80}>
          {estado === 'antes' ? 'Falta pouquinho!' : estado === 'durante' ? 'É hoje! 💦' : 'Obrigada! 💛'}
        </Reveal>

        <Reveal className="countdown__sun" delay={160} aria-hidden="true">
          <img src={solImg} width={149} height={116} alt="" loading="lazy" />
        </Reveal>

        {estado === 'antes' && (
          <>
            <Reveal as="ol" className="countdown__grid" delay={220}>
              {UNIDADES.map((u, i) => {
                const valor = p[u.chave]
                return (
                  <li className={`countdown__unit countdown__unit--${i}`} key={u.chave}>
                    <span className="countdown__ring" key={`r${valor}`} aria-hidden="true" />
                    <span className="countdown__num" key={`n${valor}`} aria-hidden="true">
                      {String(valor).padStart(2, '0')}
                    </span>
                    <span className="countdown__label" aria-hidden="true">
                      {valor === 1 ? u.um : u.varios}
                    </span>
                  </li>
                )
              })}
            </Reveal>
            <p className="sr-only">
              Faltam {plural(p.dias, 'dia', 'dias')}, {plural(p.horas, 'hora', 'horas')} e{' '}
              {plural(p.minutos, 'minuto', 'minutos')} para a festa.
            </p>
            <Reveal as="p" className="countdown__caption" delay={300}>
              É o tempinho que falta para a pool party mais refrescante do ano! O sol já está contando as horas com a gente.
              <br />
              <strong>
                {diaCurto(config.inicio)}, às {hora(config.inicio)}
              </strong>
            </Reveal>
          </>
        )}

        {estado === 'durante' && (
          <Reveal as="p" className="countdown__message" delay={200}>
            Pode separar a toalha e o protetor: a festa da {config.homenageada} está acontecendo
            agora! Corre que a água está uma delícia. 🌸
          </Reveal>
        )}

        {estado === 'depois' && (
          <Reveal as="p" className="countdown__message" delay={200}>
            Obrigada por deixar o dia da {config.homenageada} ainda mais ensolarado! Cada mergulho,
            risada e abraço ficou guardado no coração. 💛
          </Reveal>
        )}
      </div>
    </section>
  )
}
