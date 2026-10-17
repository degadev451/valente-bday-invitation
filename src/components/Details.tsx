import { config } from '../config'
import { baixarIcs, linkGoogleAgenda, linkMaps, linkWaze } from '../lib/calendar'
import { capitalizar, dataPorExtenso, hora } from '../lib/utils'
import { Reveal } from './Reveal'
import floresBd from '../assets/flores-bd.webp'
import fita from '../assets/fita.webp'

/** Quando e onde: data com botões de agenda, endereço com Maps e Waze, e o aviso da piscina. */
export function Details() {
  return (
    <section className="section section--paper details" id="quando-e-onde" aria-labelledby="detalhes-titulo">
      <svg className="section__wave" aria-hidden="true">
        <use href="#divisor" />
      </svg>
      <img className="details__flowers" src={floresBd} width={425} height={554} alt="" loading="lazy" aria-hidden="true" />

      <div className="section__inner">
        <Reveal as="p" className="section__eyebrow">
          Anote aí
        </Reveal>
        <Reveal as="h2" className="section__title" id="detalhes-titulo" delay={80}>
          Quando e onde
        </Reveal>
        <Reveal delay={120} aria-hidden="true">
          <img className="section__ribbon" src={fita} width={312} height={36} alt="" loading="lazy" />
        </Reveal>

        <div className="details__grid">
          <Reveal as="article" className="card" delay={140} aria-labelledby="quando-titulo">
            <svg className="card__icon" aria-hidden="true">
              <use href="#i-calendario" />
            </svg>
            <h3 className="card__title" id="quando-titulo">
              Quando
            </h3>
            <p className="card__main">{capitalizar(dataPorExtenso(config.inicio))}</p>
            <p className="card__sub">
              <svg className="icon icon--sm" aria-hidden="true">
                <use href="#i-relogio" />
              </svg>
              A partir das {hora(config.inicio)} (até umas {hora(config.fim)})
            </p>
            <div className="card__actions">
              <a className="btn btn--soft" href={linkGoogleAgenda()} target="_blank" rel="noopener noreferrer">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-agenda" />
                </svg>
                Google Agenda
              </a>
              <button type="button" className="btn btn--soft" onClick={baixarIcs}>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-calendario" />
                </svg>
                Outra agenda
              </button>
            </div>
            <p className="card__hint">“Outra agenda” baixa um arquivo com lembrete 1 dia antes.</p>
          </Reveal>

          <Reveal as="article" className="card" delay={220} aria-labelledby="onde-titulo">
            <svg className="card__icon" aria-hidden="true">
              <use href="#i-local" />
            </svg>
            <h3 className="card__title" id="onde-titulo">
              Onde
            </h3>
            <address className="card__main card__address">{config.endereco}</address>
            <div className="card__actions">
              <a className="btn btn--soft" href={linkMaps()} target="_blank" rel="noopener noreferrer">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-mapa" />
                </svg>
                Google Maps
              </a>
              <a className="btn btn--soft" href={linkWaze()} target="_blank" rel="noopener noreferrer">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-carro" />
                </svg>
                Waze
              </a>
            </div>
          </Reveal>
        </div>

        {config.avisoLocal && (
          <Reveal as="aside" className="note" delay={160} aria-label="Aviso importante">
            <svg className="note__icon" aria-hidden="true">
              <use href="#i-boia" />
            </svg>
            <p>{config.avisoLocal}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
