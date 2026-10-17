import { useRef } from 'react'
import { Balloons } from './Balloons'
import { Character } from './Characters'
import { Flyer } from './Flyer'
import { useHeroReady, useInView, usePageVisible, useReducedMotion } from '../lib/hooks'
import floresTe from '../assets/flores-te.webp'
import floresTd from '../assets/flores-td.webp'

/** Topo: o convite em arco no meio de um jardim de aquarela à beira da piscina. */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const pronto = useHeroReady(ref)
  const naTela = useInView(ref)
  const abaVisivel = usePageVisible()
  const reduzir = useReducedMotion()

  return (
    <header
      ref={ref}
      id="topo"
      className={`hero ${pronto ? 'is-ready' : ''} ${naTela && abaVisivel ? '' : 'is-paused'}`}
    >
      {/* fundo: manchas de aquarela, respingos dourados e o brilho do sol */}
      <div className="hero__backdrop" aria-hidden="true">
        <span className="hero__wash hero__wash--rose" />
        <span className="hero__wash hero__wash--sky" />
        <span className="hero__wash hero__wash--peach" />
        <svg className="hero__splash hero__splash--a">
          <use href="#respingos" />
        </svg>
        <svg className="hero__splash hero__splash--b">
          <use href="#respingos" />
        </svg>
      </div>

      {/* plano intermediário: buquês da arte balançando com a brisa */}
      <div className="hero__florals" aria-hidden="true">
        <img
          className="hero__floral hero__floral--tl"
          src={floresTe}
          width={494}
          height={559}
          alt=""
          fetchPriority="high"
        />
        <img className="hero__floral hero__floral--tr" src={floresTd} width={515} height={578} alt="" />
      </div>

      {!reduzir && <Balloons ativo={pronto && naTela && abaVisivel} />}

      <div className="hero__stage">
        <Flyer />
      </div>

      {/* primeiro plano: a piscina e a boia */}
      <div className="hero__pool">
        <div className="hero__water" aria-hidden="true">
          <svg className="hero__wave hero__wave--back" viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0 30Q180 0 360 30T720 30T1080 30T1440 30V80H0Z" />
          </svg>
          <svg className="hero__wave hero__wave--front" viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0 34Q180 10 360 34T720 34T1080 34T1440 34V80H0Z" />
            <path className="hero__wave-line" d="M0 34Q180 10 360 34T720 34T1080 34T1440 34" />
          </svg>
          <span className="hero__caustics" />
        </div>
        <Character tipo="boia" className="hero__boia" balao="bottom" ativo={pronto} falarSozinhoEm={3200} />
      </div>

      <a className="hero__scroll" href="#contagem" aria-label="Role para baixo">
        <svg className="hero__scroll-icon" aria-hidden="true">
          <use href="#i-gota" />
        </svg>
        <span className="hero__scroll-ripple" aria-hidden="true" />
      </a>
    </header>
  )
}
