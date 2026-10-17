import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useReveal } from '../lib/hooks'

interface RevealProps {
  as?: ElementType
  className?: string
  /** atraso em ms (vira a variável CSS --rd) */
  delay?: number
  children?: ReactNode
  [prop: string]: unknown
}

/** Surge uma única vez quando entra na tela (um só IntersectionObserver para a página toda). */
export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  const style = { ...(rest.style as CSSProperties), '--rd': `${delay}ms` } as CSSProperties
  return (
    <Tag ref={ref} {...rest} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </Tag>
  )
}
