# Prompt — site-convite animado para celebrações

> Copie tudo abaixo da linha, preencha os campos entre `{{ }}` e anexe a imagem do convite/tema
> (ou descreva o tema em texto). Funciona para aniversário, chá de bebê, batizado, casamento etc.

---

Crie um **site-convite animado** para uma celebração, com informações do evento, contagem regressiva,
vídeo/imagem do convite e **confirmação de presença gravada numa planilha do Google**.
Todo o texto do site deve estar em **português do Brasil**, com tom carinhoso e divertido.

## 1. Dados do evento (preencha)

- Tipo de celebração: aniversário 12 anos
- Homenageado(s): Valentina — destaque principal: Pool party!
- Início: 2026-11-29T12:00:00-03:00 · Fim estimado (só para a agenda): 2026-11-29T16:00:00-03:00
- Prazo para confirmar presença: 2026-11-10T23:59:59-03:00
- Endereço exibido: Rua Dr Alceu Cordeiro Fernandes, 170 - Pq. do Sol - Amparo, SP
- Texto de busca no mapa (inclua a cidade): Rua Dr Alceu Cordeiro Fernandes, 170 - Pq. do Sol - Amparo, SP
- Aviso especial do local (opcional): "Festa na piscina! Não esqueça o traje de banho."
- Texto do convite (2 frases curtas): "Esperamos você para uma tarde divertida de piscina, sol e celebração."
- Assinatura do rodapé: "Com carinho, família da Valentina 💛"
- Vídeo-convite (opcional): `assets/video-invitation.mp4` · Imagem do convite para download: `assets/invitation.jpg`
- Fuso horário: America/Sao_Paulo
- Campos da confirmação: nome (ou da família), vai/não vai, nº de adultos, nº de crianças, recadinho opcional

## 2. Tema visual — derive da imagem anexada ou desta descrição

Tema: Use a imagem indicada `assets/invitation.jpg`. Porém, mantenha-se estritamente no tema de cores pastel e
conceitos floral e aquarela, prezando por um estilo jovem e inspirado no verão.

Analise a referência (estilo da ilustração, cores, texturas, clima, personagens) e crie a
identidade visual do site **a partir dela**, sem reaproveitar escolhas de outros convites. Antes de
codar, apresente em poucas linhas a direção visual proposta. Defina e aplique de forma consistente:

- **Paleta** extraída da referência, como variáveis CSS no `:root`: fundos, superfícies, cor
  principal, cores de apoio, destaque e cor de texto. A mesma paleta vale para o efeito de
  comemoração e para os elementos decorativos. Garanta contraste legível nos textos.
- **Tipografia** do Google Fonts combinando com o clima do tema: uma fonte de destaque para títulos
  e o nome do homenageado, e uma fonte confortável de ler para o resto. Confira quais pesos a fonte
  realmente tem antes de usar negrito.
- **Linguagem visual**: traço, contornos, texturas, sombras, cantos, botões e campos seguem o
  estilo da referência (ex.: traço de desenho animado, aquarela, minimalista, vintage, papel
  recortado…). Os componentes devem parecer parte da mesma ilustração.
- **Elementos decorativos** do universo do tema, desenhados como **símbolos SVG inline
  reutilizáveis** (`<symbol>` + `<use href="#id">`) no mesmo estilo da arte. Use-os no cenário do
  topo, nas transições entre seções e nos detalhes.
- **Personagens/mascotes** (se o tema tiver): use **recortes PNG/WebP com fundo transparente tirados
  da própria arte fornecida** (não invente nem redesenhe personagens). Se faltar algum recorte, diga
  quais preciso fornecer. Ícones pequenos (calendário, local, play, relógio…) podem ser SVG inline
  no mesmo estilo.
- **Onde usar as artes** (adapte à quantidade disponível; um mesmo recorte pode servir a mais de um
  lugar, e se o tema não tiver personagens, use objetos ou ilustrações do tema):
  1. **Topo**: um ou mais personagens em cena, cada um com uma animação de repouso própria.
  2. **Ao longo da página**: uma presença por seção para acompanhar a leitura (ex.: junto à
     contagem, aos detalhes ou à transição entre seções).
  3. **Formulário**: três estados, **neutro** (esperando), **feliz** (respondeu "sim") e
     **triste** (respondeu "não").
  4. **Rodapé**: uma arte de despedida/carinho.

## 3. Stack e arquitetura

- **React 19 + Vite + TypeScript**, npm, lint com **oxlint**. Sem bibliotecas de UI/animação:
  animações em CSS + Web Animations API + um `<canvas>` próprio para o efeito de comemoração.
- **Mobile first de verdade**: o CSS base é o do celular; telas maiores só recebem ajustes com
  `@media (min-width: …)`. Sem rolagem horizontal. Teste em ~360px de largura.
- Build **estático** com `base: './'` (funciona em qualquer hospedagem, inclusive subpasta).
- Estrutura:
  ```
  index.html               <head>: título, descrição, Open Graph, fontes, preload da 1ª imagem
  src/config.ts            ⚙️ TODOS os dados editáveis (datas, prazo, endereço, busca do mapa, URL da planilha)
  src/App.tsx              monta a página seção por seção
  src/components/          Hero, HeroName, Characters, Balloons, Flyer, Countdown, Details,
                           VideoInvite, Rsvp, Stepper, Bubble, Reveal, ConfettiProvider, SvgSprites, Footer
  src/lib/                 confetti.ts, calendar.ts, rsvp.ts, hooks.ts, utils.ts
  src/styles.css           um único CSS global, classes estilo BEM; componentes só usam className
  src/assets/              recortes dos personagens (.webp), vídeo e imagem do convite
  public/                  favicon, apple-touch-icon, og-image.jpg (1200×630)
  apps-script/Code.gs      backend da planilha
  ```
- Scripts: `dev`, `dev:network` (`vite --host`, para testar no celular), `build` (`tsc -b && vite build`),
  `lint`, `typecheck`, `preview`.

## 4. Seções da página (em ordem)

A **estrutura e o comportamento** abaixo são fixos; **a aparência, os elementos decorativos, as
animações e os textos** de cada seção devem ser criados a partir do tema (seção 2). Não copie
elementos de outros convites: escolha o que faz sentido no universo do tema e, antes de codar,
apresente em poucas linhas o que pensou para cada seção.

### 4.1 Topo / convite (`<header>`)
- Ocupa a primeira tela do celular e funciona como a **versão digital do convite**: o nome do
  homenageado em destaque, o motivo da celebração, o texto do convite, data e horário, e um
  botão principal **"Confirmar presença"** que leva à âncora `#confirmar`.
- O conteúdo fica num elemento central (cartão, moldura, placa, faixa…) com formato inspirado na
  referência, e não num retângulo genérico.
- Em volta, um **cenário do tema** com camadas de profundidade (fundo, elementos intermediários,
  primeiro plano) e alguns **elementos de ambiente em movimento contínuo e discreto**.
- Os personagens/mascotes do tema aparecem em cena, cada um com uma animação própria de repouso.
- **Entrada coreografada:** os itens do convite aparecem em sequência (atrasos escalonados), com um
  efeito especial no nome do homenageado. A coreografia só começa quando **fontes e imagens do topo
  carregaram** (ou após 2s, o que vier primeiro), para não "pular" na tela.
- Um indicador animado convidando a rolar para baixo.
- Uma transição decorativa entre o topo e o restante da página, no estilo do tema.

### 4.2 Contagem regressiva
- Dias, horas, minutos e segundos até o início, com destaque visual a cada número que muda e um
  personagem/elemento animado do tema ao lado.
- Três estados, com textos criados para o tema: **antes** (contagem), **durante** (substitui os
  números por uma mensagem de "é hoje") e **depois** (~6h após o fim, agradecimento).

### 4.3 Quando e onde
- Um bloco para **data/horário** com os botões **Google Agenda** e **Outra agenda** (baixa um `.ics`
  com lembrete 1 dia antes) e outro para o **local** com os botões **Google Maps** e **Waze**,
  montados a partir do texto de busca.
- Se houver aviso especial do local, mostre-o como nota de destaque com um ícone do tema.

### 4.4 Vídeo-convite (opcional)
- Player com moldura no estilo do tema, `poster` estático, `preload="none"`, `playsInline` e um
  botão de play próprio (controles nativos só depois do play). Quando o vídeo terminar, dispare o
  efeito de comemoração (seção 5).
- Link para baixar o convite em imagem.

### 4.5 Confirmação de presença (`#confirmar`)
- Nota com o **prazo por extenso** (`Intl.DateTimeFormat` pt-BR no fuso configurado). Depois do
  prazo, o texto muda para um aviso gentil de que ainda dá para responder (o formulário continua
  aceitando).
- Um personagem do tema acompanha o formulário e **reage à escolha** (estado neutro, feliz para
  "sim", triste para "não"), com uma fala curta num balão.
- Campos (conforme a seção 1). No modelo padrão: nome (mín. 2, máx. 80 caracteres), escolha
  **vai / não vai** em botões grandes (radios estilizados), **adultos e crianças com botões − / +**
  (1–20 e 0–20) que só aparecem, com animação de abrir, quando a resposta é "sim" (`inert` quando
  fechado), recadinho opcional (máx. 500).
- Validação com mensagens amigáveis e foco no primeiro campo com erro.
- **Honeypot** anti-robô (campo `website` invisível).
- Botão desabilitado com texto de "enviando" durante o envio; mensagem de erro amigável se falhar.
- Ao enviar: salva a resposta no `localStorage` com um **ID único por aparelho**
  (`crypto.randomUUID` com fallback) e troca o formulário por um **resumo personalizado** (chama a
  pessoa pelo nome, ou só pelo primeiro nome se for longo, e repete as quantidades no caso de
  "sim"), com o efeito de comemoração no "sim", botão para salvar na agenda e link **"Alterar
  minha resposta"**, que volta ao formulário preenchido.
- Quem já respondeu naquele aparelho vê direto o resumo ao abrir o site.

### 4.6 Rodapé
- Fechamento afetivo com uma arte do tema, uma frase de despedida, a assinatura e uma linha de
  créditos/direitos da arte.

### 4.7 Global
- **Revelar ao rolar**: componente `<Reveal as="…">` com um único `IntersectionObserver` para a
  página toda. Os elementos surgem uma vez só, com atraso opcional via `--rd`.
- Links com âncora (ex.: `/#confirmar`) rolam até a seção depois que o React monta.
- Fundos alternados entre as seções, usando a paleta do tema, para dar ritmo à página.

## 5. Interações e surpresas

Defina para o tema **uma versão de cada padrão abaixo** (o quê, a animação e as falas). Os
exemplos entre parênteses só ilustram a ideia; não são para copiar.

- **Efeito de comemoração** reutilizável, desenhado num `<canvas>` de tela cheia
  (`pointer-events: none`) com partículas no estilo do tema (confete, pétalas, estrelas, bolhas…)
  e nas cores da paleta. Duas funções: `burst(x, y, quantidade, força)` (explosão num ponto) e
  `rain(ms)` (chuva pela tela). Deve respeitar o `devicePixelRatio` (máx. 2), parar o
  `requestAnimationFrame` quando não houver partículas e ser exposto por Context do React.
- **Personagens tocáveis**: cada personagem do topo é um `<button>` que, ao toque, faz uma reação
  animada e mostra num balão uma fala de uma lista curta (3–4 frases bem-humoradas do tema, em
  rodízio). Um deles pode falar sozinho alguns segundos depois da entrada.
- **Elementos de ambiente interativos**: itens do tema que surgem no topo de tempos em tempos, em
  posições, tamanhos e velocidades aleatórios (com limite de quantidade na tela) e que reagem ao
  toque com uma pequena explosão do efeito de comemoração (ex.: algo que estoura, brilha ou foge).
  Ficam pausados quando o topo sai da tela ou a aba fica oculta.
- **Visitante ocasional**: um elemento que de vez em quando atravessa a tela inteira numa trajetória
  orgânica, virado para o lado em que se move (Web Animations API, intervalo de ~15–20s).
- **Nome do homenageado interativo**: tocar no nome dispara uma animação lúdica nas letras.
- **Momentos de comemoração**: o efeito de comemoração aparece ao escolher "sim", ao enviar a
  confirmação positiva, ao fim do vídeo e nas reações dos personagens.
- Liste no README quais são as surpresas escondidas do site.

## 6. Planilha do Google (Apps Script) — `apps-script/Code.gs`
- `doPost` recebe `application/x-www-form-urlencoded`, usa `LockService`, ignora se o honeypot vier
  preenchido, valida nome, limita tamanhos e números, e **neutraliza fórmulas** (texto começando
  com `= + - @` ganha apóstrofo).
- **Upsert pelo ID**: se o ID já existe, atualiza a linha; senão, adiciona. Nunca duplica.
- Aba **Confirmações** (Data/hora, Nome, Vem?, Adultos, Crianças, Recadinho, ID) com cabeçalho
  colorido e congelado; aba **Resumo** com fórmulas: respostas recebidas, famílias que vêm, adultos,
  crianças e total de convidados.
- `doGet` responde uma mensagem de "funcionando" (para testar a URL); função `configurar()` para
  rodar uma vez pelo editor e autorizar.
- No front (`src/lib/rsvp.ts`): `fetch` POST; se o navegador bloquear a leitura por CORS
  (`TypeError`), reenviar com `mode: 'no-cors'` (o upsert evita duplicar).
- Se `urlPlanilha` estiver vazia, o formulário roda em **modo demonstração** (simula sucesso e
  avisa no console).

## 7. Acessibilidade, performance e cuidados
- HTML semântico (`header`, `main`, `section` com `aria-labelledby`, `footer`), `lang="pt-BR"`,
  textos alternativos nas artes informativas e `alt=""`/`aria-hidden` nas decorativas.
- Personagens clicáveis são `<button>` com `aria-label`; balões de fala com `aria-live="polite"`;
  steppers com rótulos ("Mais um adulto"); `:focus-visible` bem visível.
- **`prefers-reduced-motion: reduce`**: site completo e estático — sem elementos de ambiente, visitante,
  efeito de comemoração ou animações de entrada; tudo já visível.
- Imagens em **WebP** com `width`/`height` declarados, `loading="lazy"` fora do topo, `preload` da
  primeira imagem do topo no `<head>`; loops pausam com a aba oculta/fora da tela.
- `overflow-x: hidden` no body, `100svh`, `viewport-fit=cover`, sem destaque azul de toque.

## 8. Compartilhamento e publicação
- `<head>`: título e descrição do evento, `theme-color`, **Open Graph** completo (`og:title`,
  `og:description`, `og:image` **com URL absoluta** 1200×630, `og:url`, `og:locale=pt_BR`,
  `twitter:card=summary_large_image`) para a prévia ficar bonita no WhatsApp; favicon e
  apple-touch-icon com um personagem.
- `<meta name="robots" content="noindex, nofollow">` (convite particular com endereço).
- Hospedagem estática gratuita (Netlify ligado ao repositório, ou Netlify Drop com a pasta `dist/`).

## 9. README (em português, para leigos)
Tabela "O que tem no site" por seção, lista de easter eggs, estrutura de pastas, como rodar
(`npm install`, `npm run dev`, `npm run dev:network`), **passo a passo para criar a planilha e
publicar o Apps Script** (fuso São Paulo, autorização, "Qualquer pessoa", copiar a URL `/exec`,
republicar com "Nova versão" sem mudar a URL), como publicar o site, como ajustar a prévia do
WhatsApp, onde personalizar (config, textos, cores) e créditos da arte/fontes.

## 10. Critérios de aceite
- `npm run build` e `npm run lint` sem erros.
- Em 360px: nada corta, nada rola na horizontal, botões fáceis de tocar.
- Enviar a confirmação cria a linha na planilha; alterar a resposta atualiza a mesma linha.
- Google Agenda, `.ics`, Maps e Waze abrem com os dados certos.
- Com "reduzir movimento" ativado, o conteúdo aparece completo e parado.
- Toda informação editável do evento fica em `src/config.ts` (e textos nos componentes) —
  trocar de festa não exige mexer na lógica.
