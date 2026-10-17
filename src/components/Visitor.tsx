import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/hooks'
import { rand } from '../lib/utils'

/** Visitante ocasional: uma borboleta de aquarela atravessa a tela de tempos em tempos. */
export function Visitor() {
  const reduzir = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (reduzir || !el) return
    let timer = 0
    let anim: Animation | null = null

    const voar = () => {
      if (document.visibilityState === 'visible') {
        const W = window.innerWidth
        const H = window.innerHeight
        const paraDireita = Math.random() < 0.5
        const x0 = paraDireita ? -70 : W + 70
        const x1 = paraDireita ? W + 70 : -70
        const yBase = rand(H * 0.18, H * 0.62)
        const amplitude = rand(30, 80)
        const ondas = rand(1.2, 2.4)
        const fase = rand(0, Math.PI * 2)
        const deriva = rand(-50, 30)
        const passos = 14
        const pontos = Array.from({ length: passos + 1 }, (_, i) => {
          const t = i / passos
          return {
            x: x0 + (x1 - x0) * t,
            y: yBase + Math.sin(t * Math.PI * 2 * ondas + fase) * amplitude + t * deriva,
          }
        })
        const quadros: Keyframe[] = pontos.map((pt, i) => {
          const prox = pontos[Math.min(i + 1, passos)]
          const ant = pontos[Math.max(i - 1, 0)]
          // virada para onde está indo (o desenho aponta para cima: +90° = direita)
          const ang = (Math.atan2(prox.y - ant.y, prox.x - ant.x) * 180) / Math.PI + 90
          return { transform: `translate(${pt.x}px, ${pt.y}px) rotate(${ang}deg)`, offset: i / passos }
        })
        el.classList.add('is-flying')
        anim = el.animate(quadros, { duration: rand(8000, 11000), easing: 'linear' })
        anim.onfinish = () => el.classList.remove('is-flying')
      }
      timer = window.setTimeout(voar, rand(15000, 20000))
    }

    timer = window.setTimeout(voar, 7000)
    return () => {
      window.clearTimeout(timer)
      anim?.cancel()
    }
  }, [reduzir])

  if (reduzir) return null
  return (
    <div className="visitor" ref={ref} aria-hidden="true">
      <svg className="visitor__wings" viewBox="0 0 80 80" width="46" height="46">
        <use href="#borboleta" />
      </svg>
    </div>
  )
}
