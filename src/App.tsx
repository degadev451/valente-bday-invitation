import { useEffect } from 'react'
import { ConfettiProvider } from './components/ConfettiProvider'
import { Countdown } from './components/Countdown'
import { Details } from './components/Details'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Rsvp } from './components/Rsvp'
import { SvgSprites } from './components/SvgSprites'
import { VideoInvite } from './components/VideoInvite'
import { Visitor } from './components/Visitor'

export function App() {
  // Links como /#confirmar: rola até a seção depois que o React montou a página.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <ConfettiProvider>
      <SvgSprites />
      <a className="skip-link" href="#confirmar">
        Pular para a confirmação de presença
      </a>
      <Hero />
      <main>
        <Countdown />
        <Details />
        <VideoInvite />
        <Rsvp />
      </main>
      <Footer />
      <Visitor />
    </ConfettiProvider>
  )
}
