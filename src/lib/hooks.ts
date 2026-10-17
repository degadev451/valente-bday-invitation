import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

/* ---------- Reduzir movimento ---------- */

const QUERY_MOVIMENTO = '(prefers-reduced-motion: reduce)'

function assinarMovimento(cb: () => void) {
  const mq = window.matchMedia(QUERY_MOVIMENTO)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    assinarMovimento,
    () => window.matchMedia(QUERY_MOVIMENTO).matches,
    () => false,
  )
}

/* ---------- Aba visível ---------- */

function assinarVisibilidade(cb: () => void) {
  document.addEventListener('visibilitychange', cb)
  return () => document.removeEventListener('visibilitychange', cb)
}

export function usePageVisible(): boolean {
  return useSyncExternalStore(
    assinarVisibilidade,
    () => document.visibilityState === 'visible',
    () => true,
  )
}

/* ---------- Elemento na tela ---------- */

export function useInView(ref: RefObject<Element | null>, rootMargin = '0px'): boolean {
  const [visivel, setVisivel] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return visivel
}

/* ---------- Relógio ---------- */

export function useNow(intervaloMs = 1000): number {
  const [agora, setAgora] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setAgora(Date.now()), intervaloMs)
    return () => window.clearInterval(id)
  }, [intervaloMs])
  return agora
}

/* ---------- Revelar ao rolar: um único IntersectionObserver para a página toda ---------- */

let observadorReveal: IntersectionObserver | null = null

function observador(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  observadorReveal ??= new IntersectionObserver(
    (entradas, io) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      }
    },
    // sem margem negativa: em telas muito altas o fim da página nunca cruzaria a linha
    { threshold: 0.12 },
  )
  return observadorReveal
}

export function useReveal(ref: RefObject<Element | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = observador()
    if (!io) {
      el.classList.add('is-visible')
      return
    }
    io.observe(el)
    return () => io.unobserve(el)
  }, [ref])
}

/* ---------- Topo pronto: fontes + imagens carregadas (ou 2s, o que vier primeiro) ---------- */

export function useHeroReady(ref: RefObject<HTMLElement | null>, limiteMs = 2000): boolean {
  const [pronto, setPronto] = useState(false)
  useEffect(() => {
    const el = ref.current
    let cancelado = false
    const marcar = () => {
      if (!cancelado) setPronto(true)
    }
    const timer = window.setTimeout(marcar, limiteMs)
    const imagens = el ? Array.from(el.querySelectorAll('img')) : []
    const esperas: Promise<unknown>[] = imagens.map((img) =>
      img.complete ? Promise.resolve() : img.decode().catch(() => undefined),
    )
    if (document.fonts?.ready) esperas.push(document.fonts.ready)
    Promise.all(esperas).then(marcar)
    return () => {
      cancelado = true
      window.clearTimeout(timer)
    }
  }, [ref, limiteMs])
  return pronto
}
