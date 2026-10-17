import { useRef, useState } from 'react'
import { config } from '../config'
import { useConfetti } from './ConfettiProvider'
import { Reveal } from './Reveal'
import video from '../assets/video-convite.mp4'
import poster from '../assets/video-poster.webp'
import legendas from '../assets/video-convite.vtt?url'
import conviteJpg from '../assets/convite-valentina.jpg'

/** Vídeo-convite numa moldura de aquarela, com play próprio e chuva de pétalas no final. */
export function VideoInvite() {
  const ref = useRef<HTMLVideoElement>(null)
  const [tocando, setTocando] = useState(false)
  const { rain, burstFrom } = useConfetti()

  const play = () => {
    setTocando(true)
    ref.current?.play().catch(() => setTocando(true))
  }

  const fim = () => {
    rain(3200)
    burstFrom(ref.current, 30, 1)
  }

  return (
    <section className="section section--sky video" id="video" aria-labelledby="video-titulo">
      <svg className="section__wave" aria-hidden="true">
        <use href="#divisor" />
      </svg>

      <div className="section__inner">
        <Reveal as="p" className="section__eyebrow">
          Aperte o play
        </Reveal>
        <Reveal as="h2" className="section__title" id="video-titulo" delay={80}>
          O convite em movimento
        </Reveal>

        <Reveal className="video__frame" delay={160}>
          <div className="video__screen">
            <video
              ref={ref}
              className="video__player"
              src={video}
              poster={poster}
              preload="none"
              playsInline
              controls={tocando}
              width={832}
              height={1104}
              onPlay={() => setTocando(true)}
              onEnded={fim}
              aria-label={`Vídeo-convite do aniversário da ${config.homenageada}`}
            >
              <track kind="captions" src={legendas} srcLang="pt-BR" label="Português" />
            </video>
            {!tocando && (
              <button type="button" className="video__play" onClick={play}>
                <span className="video__play-disc">
                  <svg className="video__play-icon" aria-hidden="true">
                    <use href="#i-play" />
                  </svg>
                </span>
                <span className="video__play-label">Assistir ao convite</span>
              </button>
            )}
          </div>
        </Reveal>

        <Reveal as="p" className="video__download" delay={220}>
          <a
            className="link"
            href={conviteJpg}
            download={`convite-${config.homenageada.toLowerCase()}.jpg`}
          >
            <svg className="icon" aria-hidden="true">
              <use href="#i-download" />
            </svg>
            Baixar o convite em imagem
          </a>
        </Reveal>
      </div>
    </section>
  )
}
