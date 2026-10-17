import { config } from '../config'
import { novoId } from './utils'

export interface Resposta {
  nome: string
  vem: boolean
  adultos: number
  criancas: number
  recado: string
}

export interface RespostaSalva extends Resposta {
  id: string
  enviadoEm: string
}

const CHAVE_ID = `${config.chaveAparelho}:id`
const CHAVE_RESPOSTA = `${config.chaveAparelho}:resposta`

function ler(chave: string): string | null {
  try {
    return localStorage.getItem(chave)
  } catch {
    return null
  }
}

function gravar(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, valor)
  } catch {
    /* modo privado: segue sem lembrar */
  }
}

/** ID único deste aparelho: é ele que permite alterar a resposta sem duplicar a linha. */
export function idDoAparelho(): string {
  let id = ler(CHAVE_ID)
  if (!id) {
    id = novoId()
    gravar(CHAVE_ID, id)
  }
  return id
}

export function respostaSalva(): RespostaSalva | null {
  const bruto = ler(CHAVE_RESPOSTA)
  if (!bruto) return null
  try {
    const r = JSON.parse(bruto) as RespostaSalva
    return typeof r.nome === 'string' && typeof r.vem === 'boolean' ? r : null
  } catch {
    return null
  }
}

const espera = (ms: number) => new Promise((r) => window.setTimeout(r, ms))

/** Envia para a planilha (Apps Script). `website` é o honeypot anti-robô. */
export async function enviarResposta(resposta: Resposta, website = ''): Promise<RespostaSalva> {
  const salva: RespostaSalva = {
    ...resposta,
    adultos: resposta.vem ? resposta.adultos : 0,
    criancas: resposta.vem ? resposta.criancas : 0,
    id: idDoAparelho(),
    enviadoEm: new Date().toISOString(),
  }

  if (!config.urlPlanilha) {
    console.info(
      '%c[convite] Modo demonstração: config.urlPlanilha está vazia, a resposta NÃO foi para a planilha.',
      'color:#b0566e;font-weight:bold',
      salva,
    )
    await espera(900)
  } else {
    const corpo = new URLSearchParams({
      id: salva.id,
      nome: salva.nome,
      vem: salva.vem ? 'sim' : 'nao',
      adultos: String(salva.adultos),
      criancas: String(salva.criancas),
      recado: salva.recado,
      website,
    })
    try {
      const r = await fetch(config.urlPlanilha, { method: 'POST', body: corpo })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const json = (await r.json().catch(() => ({ ok: true }))) as { ok?: boolean; erro?: string }
      if (json.ok === false) throw new Error(json.erro || 'A planilha recusou a resposta')
    } catch (erro) {
      // O navegador às vezes bloqueia a LEITURA da resposta (CORS) mesmo com o envio feito.
      // Reenviamos sem ler: o upsert pelo ID na planilha garante que não duplica.
      if (erro instanceof TypeError) {
        await fetch(config.urlPlanilha, { method: 'POST', body: corpo, mode: 'no-cors' })
      } else {
        throw erro
      }
    }
  }

  gravar(CHAVE_RESPOSTA, JSON.stringify(salva))
  return salva
}
