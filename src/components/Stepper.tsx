interface StepperProps {
  id: string
  rotulo: string
  /** "adulto" / "criança" — usado nos rótulos dos botões ("Mais um adulto") */
  item: { um: string; artigo: 'um' | 'uma' }
  valor: number
  min: number
  max: number
  onChange: (n: number) => void
}

/** Contador com botões − / + grandes para o dedo. */
export function Stepper({ id, rotulo, item, valor, min, max, onChange }: StepperProps) {
  const menos = item.artigo === 'um' ? `Menos um ${item.um}` : `Menos uma ${item.um}`
  const mais = item.artigo === 'um' ? `Mais um ${item.um}` : `Mais uma ${item.um}`
  return (
    <div className="stepper" role="group" aria-labelledby={`${id}-rotulo`}>
      <span className="stepper__label" id={`${id}-rotulo`}>
        {rotulo}
      </span>
      <div className="stepper__controls">
        <button
          type="button"
          className="stepper__btn"
          aria-label={menos}
          disabled={valor <= min}
          onClick={() => onChange(Math.max(min, valor - 1))}
        >
          <svg aria-hidden="true">
            <use href="#i-menos" />
          </svg>
        </button>
        <output className="stepper__value" id={id} aria-live="polite">
          {valor}
        </output>
        <button
          type="button"
          className="stepper__btn"
          aria-label={mais}
          disabled={valor >= max}
          onClick={() => onChange(Math.min(max, valor + 1))}
        >
          <svg aria-hidden="true">
            <use href="#i-mais" />
          </svg>
        </button>
      </div>
    </div>
  )
}
