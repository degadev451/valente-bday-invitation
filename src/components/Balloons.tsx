import { useEffect, useRef } from 'react'
import { useConfetti } from './ConfettiProvider'
import { rand } from '../lib/utils'

const MAX_NA_TELA = 6

/**
 * Elementos de ambiente interativos do topo: bolhas de sabão que sobem da piscina
 * em tamanhos, posições e velocidades aleatórios. Tocou, estourou (com pétalas e gotinhas)!
 * As bolhas são criadas direto no DOM para não re-renderizar o React a cada quadro.
 */
export function Balloons({ ativo }: { ativo: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const animacoes = useRef(new Set<Animation>())
  const { burst } = useConfetti()

  useEffect(() => {
    const caixa = ref.current
    if (!caixa) return
    const anims = animacoes.current

    if (!ativo) {
      anims.forEach((a) => a.pause())
      return
    }
    anims.forEach((a) => a.play())

    let timer = 0
    const criar = () => {
      if (anims.size < MAX_NA_TELA) {
        const tam = Math.round(rand(18, 50))
        const altura = caixa.clientHeight
        const bolha = document.createElement('span')
        bolha.className = 'ambient-bubble'
        bolha.style.width = bolha.style.height = `${tam}px`
        bolha.style.left = `${rand(3, 92)}%`
        bolha.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><use href="#bolha"/></svg>'
        caixa.appendChild(bolha)

        const deriva = rand(-40, 40)
        const balanco = rand(10, 26)
        const subida = altura * rand(0.7, 0.98)
        const quadros: Keyframe[] = Array.from({ length: 9 }, (_, i) => {
          const t = i / 8
          const x = Math.sin(t * Math.PI * 3) * balanco + deriva * t
          return {
            transform: `translate(${x}px, ${-subida * t}px) scale(${0.6 + Math.min(t * 3, 0.4)})`,
            opacity: t < 0.08 ? t / 0.08 : t > 0.88 ? (1 - t) / 0.12 : 1,
          }
        })
        const anim = bolha.animate(quadros, { duration: rand(9000, 15000), easing: 'linear' })
        anims.add(anim)
        const sumir = () => {
          anims.delete(anim)
          bolha.remove()
        }
        anim.onfinish = sumir
        bolha.addEventListener(
          'pointerdown',
          (ev) => {
            ev.preventDefault()
            const r = bolha.getBoundingClientRect()
            burst(r.left + r.width / 2, r.top + r.height / 2, 12, 0.55)
            anim.pause()
            bolha.classList.add('is-popping')
            anims.delete(anim)
            window.setTimeout(() => {
              anim.cancel()
              bolha.remove()
            }, 220)
          },
          { once: true },
        )
      }
      timer = window.setTimeout(criar, rand(1000, 2100))
    }
    timer = window.setTimeout(criar, 600)
    return () => window.clearTimeout(timer)
  }, [ativo, burst])

  useEffect(() => {
    const anims = animacoes.current
    return () => anims.forEach((a) => a.cancel())
  }, [])

  return <div className="hero__bubbles" ref={ref} aria-hidden="true" />
}
