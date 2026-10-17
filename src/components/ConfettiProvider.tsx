import { createContext, use, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Comemoracao } from '../lib/confetti'

interface ConfettiApi {
  /** Explosão num ponto da tela. */
  burst: (x: number, y: number, quantidade?: number, forca?: number) => void
  /** Explosão saindo do centro de um elemento. */
  burstFrom: (el: Element | null, quantidade?: number, forca?: number) => void
  /** Chuva de pétalas pela tela. */
  rain: (ms?: number) => void
}

const ConfettiContext = createContext<ConfettiApi>({
  burst: () => {},
  burstFrom: () => {},
  rain: () => {},
})

export const useConfetti = () => use(ConfettiContext)

export function ConfettiProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const motor = useRef<Comemoracao | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    try {
      motor.current = new Comemoracao(canvasRef.current)
    } catch {
      motor.current = null
    }
    return () => {
      motor.current?.destruir()
      motor.current = null
    }
  }, [])

  const api = useMemo<ConfettiApi>(
    () => ({
      burst: (x, y, q, f) => motor.current?.burst(x, y, q, f),
      burstFrom: (el, q, f) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        motor.current?.burst(r.left + r.width / 2, r.top + r.height / 2, q, f)
      },
      rain: (ms) => motor.current?.rain(ms),
    }),
    [],
  )

  return (
    <ConfettiContext value={api}>
      {children}
      <canvas ref={canvasRef} className="celebration" aria-hidden="true" />
    </ConfettiContext>
  )
}
