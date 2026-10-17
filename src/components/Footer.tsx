import { config } from '../config'
import { Reveal } from './Reveal'
import solImg from '../assets/sol.webp'

/** Rodapé: o sol se pondo na piscina, despedida e assinatura. */
export function Footer() {
  return (
    <footer className="footer">
      <svg className="section__wave" aria-hidden="true">
        <use href="#divisor" />
      </svg>

      <Reveal className="footer__art" aria-hidden="true">
        <div className="footer__sunset">
          <img className="footer__sun" src={solImg} width={149} height={116} alt="" loading="lazy" />
          <svg className="footer__water" viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0 30Q180 0 360 30T720 30T1080 30T1440 30V80H0Z" />
          </svg>
        </div>
      </Reveal>

      <div className="footer__inner">
        <Reveal as="p" className="footer__farewell" delay={100}>
          Mal podemos esperar para celebrar com você!
        </Reveal>
        <Reveal as="p" className="footer__signature" delay={180}>
          {config.assinatura}
        </Reveal>
        <a className="footer__top" href="#topo">
          Voltar ao convite
          <svg className="footer__top-icon" aria-hidden="true">
            <use href="#i-bolha-sobe" />
          </svg>
        </a>
        <p className="footer__credits">
          © {new Date(config.inicio).getFullYear()} família da {config.homenageada}. Arte de uso pessoal, feita com
          carinho para esta festa.
        </p>
      </div>
    </footer>
  )
}
