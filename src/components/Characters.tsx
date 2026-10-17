import { useEffect, useRef, useState } from 'react'
import { Bubble } from './Bubble'
import { useConfetti } from './ConfettiProvider'
import { prefersReducedMotion } from '../lib/utils'
import solImg from '../assets/sol.webp'
import boiaImg from '../assets/boia.webp'

type Tipo = 'sol' | 'boia'

const PERSONAGENS: Record<
  Tipo,
  {
    src: string
    largura: number
    altura: number
    rotulo: string
    falas: string[]
    reacao: Keyframe[]
    duracao: number
  }
> = {
  sol: {
    src: solImg,
    largura: 149,
    altura: 116,
    rotulo: 'Sol do convite — toque para ouvir o que ele tem a dizer',
    falas: [
      'Protetor solar fator 12, hein! ☀️',
      'Hoje eu brilho só pra Valentina!',
      'Previsão do tempo: 100% de diversão 🌤️',
      'Já deixei a água quentinha pra você!',
    ],
    reacao: [
      { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' },
      { transform: 'scale(1.28) rotate(-14deg)', filter: 'brightness(1.18)', offset: 0.35 },
      { transform: 'scale(.94) rotate(10deg)', filter: 'brightness(1.08)', offset: 0.65 },
      { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' },
    ],
    duracao: 950,
  },
  boia: {
    src: boiaImg,
    largura: 456,
    altura: 232,
    rotulo: 'Boia da piscina — toque para dar um pulinho',
    falas: [
      'Me leva pra piscina? 💦',
      'Tô cheia de ar e de alegria!',
      'Quem chegar primeiro ganha um mergulho!',
      'Prometo não deixar ninguém afundar 🩷',
    ],
    reacao: [
      { transform: 'translateY(0) rotate(0deg) scale(1, 1)' },
      { transform: 'translateY(4px) rotate(0deg) scale(1.08, .88)', offset: 0.12 },
      { transform: 'translateY(-52px) rotate(-14deg) scale(.96, 1.06)', offset: 0.45 },
      { transform: 'translateY(0) rotate(4deg) scale(1.1, .86)', offset: 0.75 },
      { transform: 'translateY(0) rotate(0deg) scale(1, 1)' },
    ],
    duracao: 1050,
  },
}

interface CharacterProps {
  tipo: Tipo
  className?: string
  /** fala sozinho uma vez, depois deste atraso (ms), quando `ativo` ficar true */
  falarSozinhoEm?: number
  ativo?: boolean
  balao?: 'bottom' | 'top' | 'left' | 'right'
}

/** Personagem tocável: reage com uma animação, solta pétalas e fala num balão (falas em rodízio). */
export function Character({ tipo, className = '', falarSozinhoEm, ativo = true, balao = 'bottom' }: CharacterProps) {
  const p = PERSONAGENS[tipo]
  const { burstFrom } = useConfetti()
  const reacaoRef = useRef<HTMLSpanElement>(null)
  const indice = useRef(0)
  const esconder = useRef(0)
  const [fala, setFala] = useState('')

  const falar = () => {
    setFala(p.falas[indice.current % p.falas.length])
    indice.current += 1
    window.clearTimeout(esconder.current)
    esconder.current = window.setTimeout(() => setFala(''), 3600)
  }

  useEffect(() => () => window.clearTimeout(esconder.current), [])

  useEffect(() => {
    if (!ativo || falarSozinhoEm === undefined) return
    const id = window.setTimeout(() => {
      setFala(p.falas[0])
      indice.current = 1
      esconder.current = window.setTimeout(() => setFala(''), 3800)
    }, falarSozinhoEm)
    return () => window.clearTimeout(id)
  }, [ativo, falarSozinhoEm, p.falas])

  const tocar = () => {
    falar()
    if (prefersReducedMotion()) return
    reacaoRef.current?.animate(p.reacao, { duration: p.duracao, easing: 'cubic-bezier(.3,.7,.3,1)' })
    burstFrom(reacaoRef.current, tipo === 'boia' ? 22 : 18, tipo === 'boia' ? 0.9 : 0.7)
  }

  return (
    <div className={`character character--${tipo} ${className}`.trim()}>
      <button type="button" className="character__btn" aria-label={p.rotulo} onClick={tocar}>
        <span className="character__react" ref={reacaoRef}>
          <img
            className="character__img"
            src={p.src}
            width={p.largura}
            height={p.altura}
            alt=""
            draggable={false}
          />
        </span>
      </button>
      <Bubble text={fala} tail={balao} className="character__bubble" />
    </div>
  )
}
