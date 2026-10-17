interface BubbleProps {
  /** texto da fala; vazio = balão escondido */
  text: string
  /** de que lado fica o "biquinho" do balão */
  tail?: 'bottom' | 'top' | 'left' | 'right'
  className?: string
}

/** Balão de fala em papel aquarelado. Leitores de tela anunciam a fala com educação. */
export function Bubble({ text, tail = 'bottom', className = '' }: BubbleProps) {
  return (
    <span
      className={`bubble bubble--${tail} ${text ? 'is-open' : ''} ${className}`.trim()}
      aria-live="polite"
      role="status"
    >
      {text && (
        <span className="bubble__text" key={text}>
          {text}
        </span>
      )}
    </span>
  )
}
