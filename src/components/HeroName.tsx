import { useRef, type CSSProperties } from 'react'
import { useConfetti } from './ConfettiProvider'
import { prefersReducedMotion } from '../lib/utils'

/**
 * Nome da homenageada em caligrafia dourada e rosada.
 * Entrada: cada letra "floresce" como tinta molhada no papel.
 * Surpresa: tocar no nome faz as letras pularem como uma onda na piscina.
 */
export function HeroName({ nome }: { nome: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const { burstFrom } = useConfetti()

  const onda = () => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const letras = el.querySelectorAll<HTMLElement>('.hero-name__l')
    letras.forEach((l, i) => {
      l.animate(
        [
          { transform: 'translateY(0) rotate(0) scale(1)' },
          { transform: `translateY(-0.28em) rotate(${i % 2 ? 9 : -9}deg) scale(1.12)`, offset: 0.4 },
          { transform: 'translateY(0.04em) rotate(0) scale(.97)', offset: 0.75 },
          { transform: 'translateY(0) rotate(0) scale(1)' },
        ],
        { duration: 700, delay: i * 65, easing: 'cubic-bezier(.3,.7,.3,1)' },
      )
    })
    burstFrom(el, 20, 0.75)
  }

  return (
    <h1 className="hero-name" ref={ref}>
      <button type="button" className="hero-name__btn" onClick={onda}>
        <span className="sr-only">{nome}</span>
        <span className="hero-name__letters" aria-hidden="true">
          {Array.from(nome).map((letra, i) => (
            <span className="hero-name__l" key={i} style={{ '--li': i } as CSSProperties}>
              {letra}
            </span>
          ))}
        </span>
      </button>
      {['a', 'b', 'c'].map((k) => (
        <svg className={`hero-name__spark hero-name__spark--${k}`} aria-hidden="true" key={k}>
          <use href="#brilho" />
        </svg>
      ))}
    </h1>
  )
}
