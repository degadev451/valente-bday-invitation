import type { CSSProperties } from 'react'
import { config } from '../config'
import { diaCurto, hora } from '../lib/utils'
import { Character } from './Characters'
import { HeroName } from './HeroName'
import arabesco from '../assets/arabesco.webp'

const ordem = (i: number) => ({ '--i': i }) as CSSProperties

/** Versão digital do convite: cartão em arco com moldura dourada, como a arte original. */
export function Flyer() {
  return (
    <div className="flyer">
      <Character tipo="sol" className="flyer__sun" balao="top" />

      <p className="flyer__eyebrow hero-in" style={ordem(0)}>
        {config.celebracao}
      </p>

      <div className="hero-in hero-in--name" style={ordem(1)}>
        <HeroName nome={config.homenageada} />
      </div>

      <img
        className="flyer__ornament hero-in"
        style={ordem(3)}
        src={arabesco}
        width={229}
        height={35}
        alt=""
      />

      <p className="flyer__highlight hero-in" style={ordem(4)}>
        {config.destaque}
      </p>

      <p className="flyer__text hero-in" style={ordem(5)}>
        {config.textoConvite}
      </p>

      <p className="flyer__when hero-in" style={ordem(6)}>
        <svg className="icon" aria-hidden="true">
          <use href="#i-calendario" />
        </svg>
        <span>
          <strong>{diaCurto(config.inicio)}</strong>
          <span className="flyer__time">a partir das {hora(config.inicio)}</span>
        </span>
      </p>

      <a className="btn btn--primary flyer__cta hero-in" style={ordem(7)} href="#confirmar">
        Confirmar presença
      </a>
    </div>
  )
}
