// Efeito de comemoração: pétalas de aquarela, brilhos dourados e gotinhas de piscina,
// desenhados num <canvas> de tela cheia. Sem bibliotecas.

import { prefersReducedMotion, rand } from './utils'

type Tipo = 'petala' | 'brilho' | 'gota'

interface Particula {
  tipo: Tipo
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  tam: number
  cor: string
  vida: number
  vidaMax: number
  fase: number
}

const MAX_PARTICULAS = 420

/** Lê a paleta do :root, para o efeito usar as mesmas cores do site. */
function lerPaleta() {
  const css = getComputedStyle(document.documentElement)
  const cor = (nome: string, padrao: string) => css.getPropertyValue(nome).trim() || padrao
  return {
    petalas: [
      cor('--c-rose', '#e9a9b5'),
      cor('--c-blush-deep', '#f2c4cb'),
      cor('--c-periwinkle', '#8fa8d8'),
      cor('--c-sky-deep', '#b4cbea'),
      cor('--c-peach', '#f6cfb8'),
    ],
    brilhos: [cor('--c-gold', '#c9a06a'), cor('--c-gold-light', '#e6c999')],
    gotas: [cor('--c-water', '#9cc9ea'), cor('--c-sky-deep', '#b4cbea')],
  }
}

export class Comemoracao {
  private ctx: CanvasRenderingContext2D
  private particulas: Particula[] = []
  private raf = 0
  private ultimo = 0
  private dpr = 1
  private chuvaAte = 0
  private paleta = lerPaleta()

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D indisponível')
    this.ctx = ctx
    this.redimensionar()
    window.addEventListener('resize', this.redimensionar)
  }

  destruir() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
    window.removeEventListener('resize', this.redimensionar)
  }

  private redimensionar = () => {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = Math.round(window.innerWidth * this.dpr)
    this.canvas.height = Math.round(window.innerHeight * this.dpr)
  }

  /** Explosão num ponto da tela (coordenadas da janela). */
  burst(x: number, y: number, quantidade = 26, forca = 1) {
    if (prefersReducedMotion()) return
    this.paleta = lerPaleta()
    for (let i = 0; i < quantidade; i++) {
      const ang = rand(0, Math.PI * 2)
      const vel = rand(2, 7.5) * forca
      const r = Math.random()
      const tipo: Tipo = r < 0.55 ? 'petala' : r < 0.8 ? 'brilho' : 'gota'
      this.adicionar(tipo, x, y, Math.cos(ang) * vel, Math.sin(ang) * vel - 2.2 * forca)
    }
    this.iniciar()
  }

  /** Chuva de pétalas e brilhos pela tela toda, durante `ms` milissegundos. */
  rain(ms = 2600) {
    if (prefersReducedMotion()) return
    this.paleta = lerPaleta()
    this.chuvaAte = Math.max(this.chuvaAte, performance.now() + ms)
    this.iniciar()
  }

  private adicionar(tipo: Tipo, x: number, y: number, vx: number, vy: number) {
    if (this.particulas.length >= MAX_PARTICULAS) return
    const p = this.paleta
    const cores = tipo === 'petala' ? p.petalas : tipo === 'brilho' ? p.brilhos : p.gotas
    this.particulas.push({
      tipo,
      x,
      y,
      vx,
      vy,
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.12, 0.12),
      tam: tipo === 'petala' ? rand(6, 12) : tipo === 'brilho' ? rand(3, 6.5) : rand(3, 5.5),
      cor: cores[Math.floor(Math.random() * cores.length)],
      vida: 0,
      vidaMax: tipo === 'brilho' ? rand(50, 90) : rand(140, 240),
      fase: rand(0, Math.PI * 2),
    })
  }

  private iniciar() {
    if (this.raf) return
    this.ultimo = performance.now()
    this.raf = requestAnimationFrame(this.quadro)
  }

  private quadro = (agora: number) => {
    const dt = Math.min(3, (agora - this.ultimo) / 16.667)
    this.ultimo = agora
    const largura = window.innerWidth
    const altura = window.innerHeight

    if (agora < this.chuvaAte) {
      const n = Math.max(1, Math.round((largura / 260) * dt))
      for (let i = 0; i < n; i++) {
        const tipo: Tipo = Math.random() < 0.82 ? 'petala' : 'brilho'
        this.adicionar(tipo, rand(-20, largura + 20), rand(-40, -10), rand(-0.6, 0.6), rand(1, 2.4))
      }
    }

    const ctx = this.ctx
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, largura, altura)

    const vivas: Particula[] = []
    for (const p of this.particulas) {
      p.vida += dt
      if (p.tipo === 'petala') {
        p.vx *= 0.985 ** dt
        p.vy = Math.min(p.vy + 0.07 * dt, 1.9)
        p.x += (p.vx + Math.sin(p.vida * 0.06 + p.fase) * 0.9) * dt
      } else if (p.tipo === 'gota') {
        p.vx *= 0.99 ** dt
        p.vy += 0.22 * dt
        p.x += p.vx * dt
      } else {
        p.vx *= 0.94 ** dt
        p.vy = p.vy * 0.94 ** dt + 0.03 * dt
        p.x += p.vx * dt
      }
      p.y += p.vy * dt
      p.rot += p.vr * dt
      if (p.vida < p.vidaMax && p.y < altura + 30) {
        vivas.push(p)
        this.desenhar(p)
      }
    }
    this.particulas = vivas

    if (vivas.length || agora < this.chuvaAte) {
      this.raf = requestAnimationFrame(this.quadro)
    } else {
      // Nada na tela: para o requestAnimationFrame.
      ctx.clearRect(0, 0, largura, altura)
      this.raf = 0
    }
  }

  private desenhar(p: Particula) {
    const ctx = this.ctx
    const restante = 1 - p.vida / p.vidaMax
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.globalAlpha = Math.min(1, restante * 2.2)

    if (p.tipo === 'petala') {
      // pétala: elipse com ponta, "virando" no ar (escala em x)
      ctx.rotate(p.rot)
      ctx.scale(Math.abs(Math.cos(p.vida * 0.05 + p.fase)) * 0.75 + 0.25, 1)
      ctx.fillStyle = p.cor
      ctx.beginPath()
      ctx.moveTo(0, -p.tam)
      ctx.bezierCurveTo(p.tam * 0.75, -p.tam * 0.5, p.tam * 0.6, p.tam * 0.7, 0, p.tam)
      ctx.bezierCurveTo(-p.tam * 0.6, p.tam * 0.7, -p.tam * 0.75, -p.tam * 0.5, 0, -p.tam)
      ctx.fill()
      // veio claro, efeito aquarela
      ctx.globalAlpha *= 0.45
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.ellipse(-p.tam * 0.15, -p.tam * 0.2, p.tam * 0.18, p.tam * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()
    } else if (p.tipo === 'brilho') {
      // brilho dourado de 4 pontas que pisca
      const s = p.tam * (0.7 + 0.3 * Math.sin(p.vida * 0.4 + p.fase))
      ctx.rotate(p.rot)
      ctx.fillStyle = p.cor
      ctx.beginPath()
      ctx.moveTo(0, -s * 2)
      ctx.quadraticCurveTo(s * 0.25, -s * 0.25, s * 2, 0)
      ctx.quadraticCurveTo(s * 0.25, s * 0.25, 0, s * 2)
      ctx.quadraticCurveTo(-s * 0.25, s * 0.25, -s * 2, 0)
      ctx.quadraticCurveTo(-s * 0.25, -s * 0.25, 0, -s * 2)
      ctx.fill()
    } else {
      // gota d'água esticada na direção do movimento
      ctx.rotate(Math.atan2(p.vy, p.vx) + Math.PI / 2)
      ctx.fillStyle = p.cor
      ctx.beginPath()
      ctx.moveTo(0, p.tam * 1.9)
      ctx.bezierCurveTo(p.tam, p.tam * 0.4, p.tam, -p.tam, 0, -p.tam)
      ctx.bezierCurveTo(-p.tam, -p.tam, -p.tam, p.tam * 0.4, 0, p.tam * 1.9)
      ctx.fill()
      ctx.globalAlpha *= 0.7
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(-p.tam * 0.3, -p.tam * 0.2, p.tam * 0.28, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}
