import { useEffect, useRef, useState, type FormEvent } from 'react'
import { config } from '../config'
import { baixarIcs, linkGoogleAgenda } from '../lib/calendar'
import { enviarResposta, respostaSalva, type RespostaSalva } from '../lib/rsvp'
import { nomeCarinhoso, plural, prazoPorExtenso } from '../lib/utils'
import { Bubble } from './Bubble'
import { useConfetti } from './ConfettiProvider'
import { Reveal } from './Reveal'
import { Stepper } from './Stepper'
import { useNow } from '../lib/hooks'
import boiaImg from '../assets/boia.webp'

type Escolha = '' | 'sim' | 'nao'
type Humor = 'neutro' | 'feliz' | 'triste'

const FALAS: Record<Humor, string> = {
  neutro: 'Tô boiando de ansiedade pela sua resposta! 🫧',
  feliz: 'Ebaaa! Já tô enchendo de ar pra te esperar! 💦',
  triste: 'Ahh, fiquei murchinha… mas obrigada por avisar 💙',
}

const NOME_MIN = 2
const NOME_MAX = 80
const RECADO_MAX = 500
const PRAZO = new Date(config.prazoConfirmacao).getTime()

const pessoas = (adultos: number, criancas: number) =>
  plural(adultos, 'adulto', 'adultos') + (criancas ? ` e ${plural(criancas, 'criança', 'crianças')}` : '')

export function Rsvp() {
  const [salva, setSalva] = useState<RespostaSalva | null>(() => respostaSalva())
  const [editando, setEditando] = useState(() => !respostaSalva())

  const [nome, setNome] = useState(salva?.nome ?? '')
  const [vem, setVem] = useState<Escolha>(salva ? (salva.vem ? 'sim' : 'nao') : '')
  const [adultos, setAdultos] = useState(salva?.vem ? salva.adultos || 1 : 1)
  const [criancas, setCriancas] = useState(salva?.vem ? salva.criancas : 0)
  const [recado, setRecado] = useState(salva?.recado ?? '')
  const [website, setWebsite] = useState('')

  const [erros, setErros] = useState<{ nome?: string; vem?: string }>({})
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState('')

  const nomeRef = useRef<HTMLInputElement>(null)
  const simRef = useRef<HTMLInputElement>(null)
  const boiaRef = useRef<HTMLDivElement>(null)
  const resumoRef = useRef<HTMLHeadingElement>(null)
  const focarResumo = useRef(false)
  const { burstFrom, rain } = useConfetti()

  const prazoPassou = useNow(60_000) > PRAZO
  const humor: Humor = editando ? (vem === 'sim' ? 'feliz' : vem === 'nao' ? 'triste' : 'neutro') : salva?.vem ? 'feliz' : 'triste'

  useEffect(() => {
    if (!editando && focarResumo.current) {
      focarResumo.current = false
      resumoRef.current?.focus({ preventScroll: true })
      resumoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [editando])

  const escolher = (valor: Escolha, origem: HTMLElement) => {
    setVem(valor)
    setErros((e) => ({ ...e, vem: undefined }))
    if (valor === 'sim') {
      burstFrom(origem, 22, 0.85)
      burstFrom(boiaRef.current, 14, 0.6)
    }
  }

  const validar = () => {
    const n = nome.trim()
    const novos: typeof erros = {}
    if (!n) novos.nome = 'Conta pra gente seu nome (ou o da família) 🌸'
    else if (n.length < NOME_MIN) novos.nome = 'O nome precisa de pelo menos 2 letrinhas.'
    else if (n.length > NOME_MAX) novos.nome = `Use no máximo ${NOME_MAX} caracteres, por favor.`
    if (!vem) novos.vem = 'Escolha se você vem ou não, tá bom?'
    setErros(novos)
    if (novos.nome) nomeRef.current?.focus()
    else if (novos.vem) simRef.current?.focus()
    return !novos.nome && !novos.vem
  }

  const enviar = async (ev: FormEvent) => {
    ev.preventDefault()
    if (enviando || !validar()) return
    setEnviando(true)
    setErroEnvio('')
    try {
      const r = await enviarResposta(
        {
          nome: nome.trim().replace(/\s+/g, ' '),
          vem: vem === 'sim',
          adultos,
          criancas,
          recado: recado.trim().slice(0, RECADO_MAX),
        },
        website,
      )
      setSalva(r)
      focarResumo.current = true
      setEditando(false)
      if (r.vem) {
        rain(2800)
        burstFrom(boiaRef.current, 30, 1.1)
      }
    } catch (e) {
      console.error('[convite] Falha ao enviar a confirmação', e)
      setErroEnvio(
        'Ops! A resposta não chegou na nossa planilha. Confira sua internet e tente de novo, por favor 💙',
      )
    } finally {
      setEnviando(false)
    }
  }

  const alterar = () => {
    if (salva) {
      setNome(salva.nome)
      setVem(salva.vem ? 'sim' : 'nao')
      setAdultos(salva.vem ? Math.max(1, salva.adultos) : 1)
      setCriancas(salva.vem ? salva.criancas : 0)
      setRecado(salva.recado)
    }
    setEditando(true)
    window.setTimeout(() => nomeRef.current?.focus(), 50)
  }

  return (
    <section className="section section--paper rsvp" id="confirmar" aria-labelledby="rsvp-titulo">
      <svg className="section__wave" aria-hidden="true">
        <use href="#divisor" />
      </svg>

      <div className="section__inner">
        <Reveal as="p" className="section__eyebrow">
          Confirmação de presença
        </Reveal>
        <Reveal as="h2" className="section__title" id="rsvp-titulo" delay={80}>
          Você vem mergulhar?
        </Reveal>
        <Reveal as="p" className={`rsvp__deadline ${prazoPassou ? 'is-late' : ''}`} delay={140}>
          {prazoPassou ? (
            <>
              O prazo era <strong>{prazoPorExtenso(config.prazoConfirmacao)}</strong>, mas ainda dá
              tempo de responder! Conta pra gente assim que puder 💛
            </>
          ) : (
            <>
              Confirme até <strong>{prazoPorExtenso(config.prazoConfirmacao)}</strong>, por favor.
              Assim a gente prepara tudo com carinho 🌸
            </>
          )}
        </Reveal>

        <Reveal className="rsvp__card" delay={200}>
          <div className={`rsvp__buddy rsvp__buddy--${humor}`} ref={boiaRef}>
            <Bubble text={FALAS[humor]} tail="bottom" className="rsvp__bubble" />
            <div className="rsvp__buddy-art" aria-hidden="true">
              <svg className="rsvp__cloud">
                <use href="#nuvem" />
              </svg>
              <svg className="rsvp__heart rsvp__heart--a">
                <use href="#coracao" />
              </svg>
              <svg className="rsvp__heart rsvp__heart--b">
                <use href="#coracao" />
              </svg>
              <img className="rsvp__boia" src={boiaImg} width={456} height={232} alt="" loading="lazy" />
            </div>
          </div>

          {editando || !salva ? (
            <form className="form" onSubmit={enviar} noValidate>
              <div className={`field ${erros.nome ? 'has-error' : ''}`}>
                <label className="field__label" htmlFor="rsvp-nome">
                  Seu nome (ou da família)
                </label>
                <input
                  ref={nomeRef}
                  id="rsvp-nome"
                  className="field__input"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  maxLength={NOME_MAX}
                  placeholder="Ex.: Família Oliveira"
                  value={nome}
                  aria-invalid={erros.nome ? true : undefined}
                  aria-describedby={erros.nome ? 'rsvp-nome-erro' : undefined}
                  onChange={(e) => {
                    setNome(e.target.value)
                    if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                  }}
                />
                {erros.nome && (
                  <p className="field__error" id="rsvp-nome-erro">
                    {erros.nome}
                  </p>
                )}
              </div>

              <fieldset
                className={`choice ${erros.vem ? 'has-error' : ''}`}
                aria-describedby={erros.vem ? 'rsvp-vem-erro' : undefined}
              >
                <legend className="field__label">Você vem?</legend>
                <div className="choice__options">
                  <label className="choice__opt choice__opt--sim">
                    <input
                      ref={simRef}
                      type="radio"
                      name="vem"
                      value="sim"
                      checked={vem === 'sim'}
                      onChange={(e) => escolher('sim', e.currentTarget.parentElement ?? e.currentTarget)}
                    />
                    <span className="choice__card">
                      <span className="choice__emoji" aria-hidden="true">
                        🏊‍♀️
                      </span>
                      <span className="choice__text">Vou sim!</span>
                    </span>
                  </label>
                  <label className="choice__opt choice__opt--nao">
                    <input
                      type="radio"
                      name="vem"
                      value="nao"
                      checked={vem === 'nao'}
                      onChange={(e) => escolher('nao', e.currentTarget)}
                    />
                    <span className="choice__card">
                      <span className="choice__emoji" aria-hidden="true">
                        🥲
                      </span>
                      <span className="choice__text">Não vou poder</span>
                    </span>
                  </label>
                </div>
                {erros.vem && (
                  <p className="field__error" id="rsvp-vem-erro">
                    {erros.vem}
                  </p>
                )}
              </fieldset>

              <div className={`rsvp__guests ${vem === 'sim' ? 'is-open' : ''}`} inert={vem !== 'sim'}>
                <div className="rsvp__guests-inner">
                  <p className="rsvp__guests-title">Quantas pessoas vêm com você (contando você)?</p>
                  <div className="rsvp__steppers">
                    <Stepper
                      id="rsvp-adultos"
                      rotulo="Adultos"
                      item={{ um: 'adulto', artigo: 'um' }}
                      valor={adultos}
                      min={1}
                      max={20}
                      onChange={setAdultos}
                    />
                    <Stepper
                      id="rsvp-criancas"
                      rotulo="Crianças"
                      item={{ um: 'criança', artigo: 'uma' }}
                      valor={criancas}
                      min={0}
                      max={20}
                      onChange={setCriancas}
                    />
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="rsvp-recado">
                  Recadinho para a {config.homenageada} <span className="field__optional">(opcional)</span>
                </label>
                <textarea
                  id="rsvp-recado"
                  className="field__input field__input--area"
                  name="recado"
                  rows={3}
                  maxLength={RECADO_MAX}
                  placeholder="Deixe um carinho, uma dúvida ou um aviso 💌"
                  value={recado}
                  aria-describedby="rsvp-recado-conta"
                  onChange={(e) => setRecado(e.target.value)}
                />
                <p className="field__count" id="rsvp-recado-conta">
                  {recado.length}/{RECADO_MAX}
                </p>
              </div>

              {/* honeypot anti-robô: pessoas não veem nem preenchem */}
              <div className="hp" aria-hidden="true">
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              {erroEnvio && (
                <p className="form__error" role="alert">
                  {erroEnvio}
                </p>
              )}

              <button className="btn btn--primary form__submit" type="submit" disabled={enviando}>
                {enviando ? 'Enviando…' : salva ? 'Atualizar resposta' : 'Enviar confirmação'}
              </button>
            </form>
          ) : (
            <div className="summary">
              <h3 className="summary__title" ref={resumoRef} tabIndex={-1}>
                {salva.vem ? `Oba, ${nomeCarinhoso(salva.nome)}! 🎉` : `Que pena, ${nomeCarinhoso(salva.nome)}! 💙`}
              </h3>
              {salva.vem ? (
                <p className="summary__text">
                  Presença confirmada! Vamos esperar <strong>{pessoas(salva.adultos, salva.criancas)}</strong>{' '}
                  com a piscina prontinha. Não esqueça o traje de banho! 👙
                </p>
              ) : (
                <p className="summary__text">
                  Obrigada por avisar. Vamos sentir sua falta, mas a {config.homenageada} manda um
                  abraço daqui da piscina!
                </p>
              )}
              {salva.recado && (
                <blockquote className="summary__quote">
                  <p>“{salva.recado}”</p>
                  <footer>Seu recadinho chegou direitinho 💌</footer>
                </blockquote>
              )}
              {salva.vem && (
                <div className="summary__actions">
                  <a className="btn btn--primary" href={linkGoogleAgenda()} target="_blank" rel="noopener noreferrer">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-agenda" />
                    </svg>
                    Salvar na agenda
                  </a>
                  <button type="button" className="link link--small" onClick={baixarIcs}>
                    ou baixar para outra agenda
                  </button>
                </div>
              )}
              <button type="button" className="link summary__edit" onClick={alterar}>
                <svg className="icon icon--sm" aria-hidden="true">
                  <use href="#i-lapis" />
                </svg>
                Alterar minha resposta
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
