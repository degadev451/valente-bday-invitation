// ⚙️ Todos os dados editáveis do convite ficam aqui.
// Para outra festa, troque estes valores (e as imagens em src/assets) — não precisa mexer na lógica.
// Este arquivo também é lido pelo vite.config.ts para montar o <head> (título, prévia do WhatsApp…),
// por isso ele não pode importar imagens nem nada do navegador.

export const config = {
  /** Nome que aparece em destaque no topo. */
  homenageada: 'Valentina',
  /** Motivo da celebração (aparece acima do nome). */
  celebracao: 'Aniversário de 12 anos',
  /** Destaque do convite (aparece logo abaixo do nome). */
  destaque: 'Pool party!',
  /** Texto curtinho do convite. */
  textoConvite: 'Esperamos você para uma tarde divertida de piscina, sol e celebração.',

  /** Início e fim (o fim é só para a agenda). Sempre com o fuso no final (-03:00). */
  inicio: '2026-11-29T12:00:00-03:00',
  fim: '2026-11-29T16:00:00-03:00',
  /** Até quando pedimos a confirmação de presença. */
  prazoConfirmacao: '2026-11-10T23:59:59-03:00',
  /** Fuso usado para escrever datas e horários. */
  fuso: 'America/Sao_Paulo',
  /** Quantas horas depois do fim a contagem vira "obrigado por vir". */
  horasAteAgradecer: 6,

  /** Endereço exibido no site. */
  endereco: 'Rua Dr Alceu Cordeiro Fernandes, 170 - Pq. do Sol - Amparo, SP',
  /** Texto usado para buscar no Google Maps e no Waze (inclua a cidade). */
  buscaMapa: 'Rua Dr Alceu Cordeiro Fernandes, 170 - Pq. do Sol - Amparo, SP',
  /** Aviso especial do local (deixe '' para esconder). */
  avisoLocal: 'Festa na piscina! Não esqueça o traje de banho.',

  /** Assinatura do rodapé. */
  assinatura: 'Com carinho, família da Valentina 💛',

  /**
   * URL do Apps Script publicado (termina em /exec). Veja o passo a passo no README.
   * Vazia = modo demonstração: o formulário finge que enviou e avisa no console.
   */
  urlPlanilha: 'https://script.google.com/macros/s/AKfycbzjIE1UceBFur0xZdICnBoLkUla97782TdsrNOMYyE2TelVYaXCPmSA2cHl59TqqJb1tw/exec',

  /** Nome da chave usada para lembrar a resposta neste aparelho (troque para cada festa). */
  chaveAparelho: 'convite-valentina-12-anos',

  /** Agenda (Google Agenda e arquivo .ics). */
  agenda: {
    titulo: 'Pool party da Valentina — 12 anos 💦',
    descricao:
      'Aniversário de 12 anos da Valentina! Tarde de piscina, sol e celebração. Não esqueça o traje de banho. 🌸',
    arquivo: 'pool-party-valentina.ics',
  },

  /** Compartilhamento (WhatsApp, redes) e <head>. */
  site: {
    /**
     * Endereço público do site, sem barra no final (ex.: 'https://valentina12.netlify.app').
     * Necessário para a imagem aparecer na prévia do WhatsApp. No Netlify ligado ao repositório,
     * se ficar vazio, o endereço do site é usado automaticamente.
     */
    url: '',
    titulo: 'Valentina 12 anos · Pool party! 💦',
    descricao:
      'Você está convidado(a) para a pool party de 12 anos da Valentina! Domingo, 29 de novembro, às 12h. Confirme sua presença 🌸',
    corTema: '#f7dcdf',
    imagemCompartilhamento: 'og-image.jpg',
  },
} as const

export type Config = typeof config
