import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from './src/config.ts'

/** Imagem do topo que é pré-carregada no <head> (a primeira que aparece). */
const PRIMEIRA_IMAGEM = 'flores-te'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Preenche o <head> com os dados do config.ts (título, descrição, Open Graph…). */
function conviteHead(): Plugin {
  return {
    name: 'convite-head',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        // Netlify define URL no build; o config.ts tem prioridade.
        const siteUrl = (config.site.url || process.env.URL || '').replace(/\/+$/, '')
        if (!siteUrl && ctx.bundle) {
          console.warn(
            '\n⚠️  config.site.url está vazio: a prévia do WhatsApp pode ficar sem imagem (og:image precisa de URL absoluta).\n',
          )
        }
        const ogImage = siteUrl
          ? `${siteUrl}/${config.site.imagemCompartilhamento}`
          : `./${config.site.imagemCompartilhamento}`

        let preload = `/src/assets/${PRIMEIRA_IMAGEM}.webp`
        if (ctx.bundle) {
          const asset = Object.keys(ctx.bundle).find(
            (f) => f.includes(`${PRIMEIRA_IMAGEM}`) && f.endsWith('.webp'),
          )
          if (asset) preload = `./${asset}`
        }

        const valores: Record<string, string> = {
          TITULO: config.site.titulo,
          DESCRICAO: config.site.descricao,
          COR_TEMA: config.site.corTema,
          OG_IMAGE: ogImage,
          OG_URL: siteUrl ? `${siteUrl}/` : './',
          PRELOAD: preload,
        }
        return html.replace(/%CONVITE_(\w+)%/g, (_, chave: string) =>
          escapeHtml(valores[chave] ?? ''),
        )
      },
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), conviteHead()],
  build: {
    assetsInlineLimit: 0,
  },
})
