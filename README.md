# 💦 Convite da Valentina — 12 anos · Pool party!

Site-convite animado em aquarela (tons pastel, flores e filete dourado), com contagem regressiva,
vídeo-convite, “quando e onde” e **confirmação de presença gravada numa planilha do Google**.

Feito com React 19 + Vite + TypeScript, sem bibliotecas de interface ou animação.

---

## O que tem no site

| Seção | O que faz |
| --- | --- |
| **Topo (convite)** | Cartão em arco com moldura dourada (igual à arte), nome da Valentina em caligrafia que “floresce” letra por letra, data, horário e botão **Confirmar presença**. Em volta: buquês da arte balançando com a brisa, manchas de aquarela, bolhas de sabão subindo da piscina, o **sol** no alto do arco e a **boia** boiando na água. |
| **Contagem regressiva** | Dias, horas, minutos e segundos em “bolhas” de aquarela; cada número que muda cai com uma ondinha. O sol fica ao lado, com os raios girando. No dia da festa vira “É hoje! 💦”; 6 h depois do fim, vira um agradecimento. |
| **Quando e onde** | Data por extenso, botões **Google Agenda** e **Outra agenda** (baixa um `.ics` com lembrete 1 dia antes), endereço com **Google Maps** e **Waze** e o aviso “Festa na piscina! Não esqueça o traje de banho.” |
| **Vídeo-convite** | Vídeo numa moldura com flores, botão de play próprio e legendas. Quando termina, chove pétalas. Link para **baixar o convite em imagem**. |
| **Confirmação** | Prazo por extenso (depois do prazo o texto muda, mas continua aceitando). Nome, vai / não vai, adultos e crianças com − / + (só aparecem no “sim”) e recadinho. A boia reage: **neutra** esperando, **feliz** pulando com coraçõezinhos no “sim”, **murchinha** com nuvem de chuva no “não”. Depois de enviar, mostra um resumo com o nome da pessoa e o link “Alterar minha resposta”. Quem já respondeu naquele celular vê o resumo direto. |
| **Rodapé** | O sol se pondo na piscina entre as flores, despedida, assinatura e créditos. |

### 🥚 Surpresas escondidas

1. **Toque no nome “Valentina”**: as letras pulam uma a uma, como uma onda na piscina, e soltam brilhos.
2. **Toque no sol**: ele gira, brilha e solta uma frase (são 4, em rodízio — “Protetor solar fator 12, hein! ☀️”…).
3. **Toque na boia**: ela dá um pulo com respingo e fala (“Me leva pra piscina? 💦”). Ela também fala sozinha logo depois da entrada.
4. **Estoure as bolhas de sabão** que sobem da piscina: cada uma explode em pétalas e gotinhas.
5. **Borboleta visitante**: de 15 em 15–20 segundos uma borboleta de aquarela atravessa a tela, sempre virada para onde está indo.
6. **Chuva de pétalas** ao escolher “Vou sim!”, ao enviar a confirmação positiva e no fim do vídeo.

> Com “reduzir movimento” ligado no celular/computador, o site aparece completo e parado:
> sem bolhas, borboleta, pétalas ou animações de entrada.

---

## Estrutura de pastas

```
index.html               <head>: título, descrição, prévia do WhatsApp (preenchidos a partir do config.ts)
vite.config.ts           monta o <head> e o build estático (base './')
src/config.ts            ⚙️ TODOS os dados editáveis (datas, prazo, endereço, mapa, URL da planilha…)
src/App.tsx              monta a página seção por seção
src/components/          Hero, HeroName, Characters, Balloons (bolhas), Flyer (cartão do convite),
                         Countdown, Details, VideoInvite, Rsvp, Stepper, Bubble (balão de fala),
                         Reveal, ConfettiProvider, SvgSprites, Visitor (borboleta), Footer
src/lib/                 confetti.ts (pétalas no canvas), calendar.ts, rsvp.ts, hooks.ts, utils.ts
src/styles.css           o único CSS do site (cores no :root)
src/assets/              recortes da arte (.webp), vídeo, legendas, poster e convite em imagem
public/                  favicon, apple-touch-icon e og-image.jpg (prévia do WhatsApp, 1200×630)
apps-script/Code.gs      backend da planilha (Google Apps Script)
assets/                  arquivos originais enviados (não são usados pelo site)
```

---

## Como rodar no computador

Precisa do [Node.js](https://nodejs.org) 20 ou mais novo.

```bash
npm install
```

```bash
npm run dev
```

Abra o endereço que aparecer (geralmente `http://localhost:5173`).

Para testar **no celular** (mesmo Wi‑Fi do computador):

```bash
npm run dev:network
```

e abra no celular o endereço “Network” que aparecer (ex.: `http://192.168.0.10:5173`).

Outros comandos: `npm run build` (gera a pasta `dist/`), `npm run preview` (abre o build),
`npm run lint` e `npm run typecheck`.

> Enquanto `urlPlanilha` estiver vazia, o formulário roda em **modo demonstração**: finge que enviou
> e avisa no console do navegador. Nada vai para a planilha.

---

## Passo a passo: planilha do Google + Apps Script

1. Acesse [sheets.new](https://sheets.new) para criar uma planilha nova. Dê um nome, por exemplo
   “Confirmações — Valentina 12 anos”.
2. **Fuso horário**: menu **Arquivo → Configurações → Fuso horário → (GMT-03:00) São Paulo** → Salvar.
3. Menu **Extensões → Apps Script**. Apague tudo o que estiver no editor e cole o conteúdo inteiro de
   [`apps-script/Code.gs`](apps-script/Code.gs). Clique no 💾 (Salvar).
4. No editor, em **Configurações do projeto** (ícone de engrenagem), marque o fuso
   **America/Sao_Paulo**.
5. Volte ao editor, escolha a função **`configurar`** na lista ao lado do botão ▶ e clique em
   **Executar**. O Google vai pedir autorização:
   - “Revisar permissões” → escolha sua conta;
   - se aparecer “O Google não verificou este app”, clique em **Avançado → Acessar (não seguro)**
     (é normal: o script é seu);
   - **Permitir**.
   As abas **Confirmações** (cabeçalho colorido e congelado) e **Resumo** (com as contas prontas)
   vão aparecer na planilha.
6. Clique em **Implantar → Nova implantação**. No ícone de engrenagem escolha **App da Web** e preencha:
   - Descrição: `Convite`
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   Clique em **Implantar** e copie a **URL do app da Web** (termina em **`/exec`**).
7. Teste: cole a URL no navegador. Deve aparecer “💦 Funcionando!…”.
8. Abra `src/config.ts` e cole a URL em `urlPlanilha: 'https://script.google.com/macros/s/…/exec'`.
9. Rode o site, confirme presença e veja a linha aparecer na planilha. Clique em
   “Alterar minha resposta”, mude algo e envie de novo: **a mesma linha é atualizada** (cada aparelho
   tem um ID próprio, coluna “ID”).

### Mudei o `Code.gs`. Como atualizar sem trocar a URL?

**Implantar → Gerenciar implantações** → lápis ✏️ na implantação existente → em “Versão” escolha
**Nova versão** → **Implantar**. A URL `/exec` continua a mesma. (Se você criar uma *nova
implantação*, a URL muda e precisa ser trocada no `config.ts`.)

### Segurança da planilha

- Campo invisível “website” (honeypot): robôs que preenchem tudo são ignorados.
- Nome obrigatório (2 a 80 caracteres), recado até 500, adultos 1–20 e crianças 0–20.
- Textos que começam com `= + - @` ganham um apóstrofo, para não virarem fórmula.
- `LockService` evita duas respostas escrevendo ao mesmo tempo.

---

## Como publicar o site (grátis)

### Opção 1 — Netlify ligado ao repositório (recomendado)

1. Suba esta pasta para um repositório no GitHub.
2. Em [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project** →
   escolha o repositório. O arquivo `netlify.toml` já diz tudo: comando `npm run build`, pasta `dist`.
3. Pronto! A cada alteração enviada ao GitHub, o site é atualizado sozinho.
   O Netlify informa o endereço do site durante o build, então a imagem da prévia do WhatsApp já sai
   com o endereço certo.

### Opção 2 — Netlify Drop (arrastar e soltar)

1. Coloque o endereço final do site em `site.url` no `src/config.ts`
   (ex.: `'https://valentina12.netlify.app'`). Na primeira vez, publique uma vez para descobrir o
   endereço, preencha e publique de novo.
2. Rode `npm run build`.
3. Arraste a pasta **`dist/`** para [app.netlify.com/drop](https://app.netlify.com/drop).

O site funciona em qualquer hospedagem estática, inclusive dentro de uma subpasta.

---

## Prévia bonita no WhatsApp

- A imagem é `public/og-image.jpg` (1200×630). Para trocar, substitua o arquivo mantendo o nome e o tamanho.
- Título e descrição: `site.titulo` e `site.descricao` no `src/config.ts`.
- O WhatsApp exige o **endereço completo** da imagem: preencha `site.url` (ou use o Netlify ligado ao
  repositório, que preenche sozinho).
- O WhatsApp guarda a prévia em cache. Depois de mudar, teste com o endereço + `?v=2` no final, ou use o
  [Depurador de compartilhamento do Facebook](https://developers.facebook.com/tools/debug/) para atualizar.
- O site tem `noindex, nofollow`: não aparece no Google (é um convite particular, com endereço).

---

## Onde personalizar

| Quero mudar… | Onde |
| --- | --- |
| Nome, datas, prazo, endereço, busca do mapa, aviso, assinatura, URL da planilha, textos da agenda e da prévia | `src/config.ts` |
| Textos de cada seção (títulos, falas da boia e do sol, mensagens do formulário) | arquivos em `src/components/` (ex.: falas em `Characters.tsx` e `Rsvp.tsx`) |
| Cores | variáveis no começo de `src/styles.css` (`:root`) — o efeito de pétalas usa as mesmas cores |
| Fontes | link do Google Fonts no `index.html` e `--f-script` / `--f-body` no `styles.css` |
| Artes, vídeo, convite em imagem | `src/assets/` (mantenha os mesmos nomes de arquivo) |
| Legendas do vídeo | `src/assets/video-convite.vtt` |
| Ícone da aba e do iPhone | `public/favicon.png` e `public/apple-touch-icon.png` |

Para outra festa, troque o `config.ts` (inclusive `chaveAparelho`, para não misturar respostas
guardadas nos celulares), as imagens e, se quiser, os textos dos componentes. Não precisa mexer na lógica.

---

## Créditos

- **Arte**: ilustração em aquarela do convite da Valentina (`assets/invitation.jpg` e
  `assets/video-invitation.mp4`). Os buquês, a boia, o sol, o arabesco e a fita do site são recortes
  dessa mesma arte, com fundo transparente. Ícones, bolhas, borboleta e ondas são SVG desenhados no
  mesmo estilo.
- **Fontes**: [Great Vibes](https://fonts.google.com/specimen/Great+Vibes) (caligrafia, só peso 400) e
  [Nunito](https://fonts.google.com/specimen/Nunito), ambas do Google Fonts (licença SIL Open Font).
