// Símbolos SVG reutilizáveis no estilo da arte: aquarela suave + filete dourado.
// Uso: <svg><use href="#divisor" /></svg>. As cores vêm das variáveis CSS do :root.

export function SvgSprites() {
  return (
    <svg className="sprites" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="g-bolha" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".15" />
          <stop offset=".7" stopOpacity=".25" style={{ stopColor: 'var(--c-sky-deep)' }} />
          <stop offset=".88" stopOpacity=".45" style={{ stopColor: 'var(--c-rose)' }} />
          <stop offset="1" stopOpacity=".7" style={{ stopColor: 'var(--c-gold-light)' }} />
        </radialGradient>

        <linearGradient id="g-ouro" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--c-gold-light)' }} />
          <stop offset=".55" style={{ stopColor: 'var(--c-gold)' }} />
          <stop offset="1" style={{ stopColor: 'var(--c-gold-deep)' }} />
        </linearGradient>
      </defs>

      {/* ---------- Elementos decorativos ---------- */}

      <symbol id="respingos" viewBox="0 0 100 100">
        <g fill="url(#g-ouro)">
          <circle cx="12" cy="18" r="2.6" />
          <circle cx="30" cy="8" r="1.4" />
          <circle cx="44" cy="26" r="3.4" />
          <circle cx="62" cy="12" r="1.2" />
          <circle cx="80" cy="30" r="2.2" />
          <circle cx="20" cy="48" r="1.3" />
          <circle cx="56" cy="52" r="1.8" />
          <circle cx="88" cy="58" r="1.2" />
          <circle cx="34" cy="74" r="2.4" />
          <circle cx="70" cy="80" r="1.5" />
          <circle cx="10" cy="88" r="1.1" />
          <circle cx="50" cy="94" r="1" />
        </g>
      </symbol>

      <symbol id="bolha" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="29" fill="url(#g-bolha)" />
        <circle cx="32" cy="32" r="29" fill="none" strokeOpacity=".35" strokeWidth="1.2" style={{ stroke: 'var(--c-periwinkle)' }} />
        <path d="M14 26a19 19 0 0 1 13-13" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" fill="none" opacity=".9" />
        <circle cx="45" cy="47" r="2.6" fill="#fff" opacity=".7" />
      </symbol>

      <symbol id="brilho" viewBox="0 0 40 40">
        <path d="M20 0q2.6 17.4 20 20-17.4 2.6-20 20Q17.4 22.6 0 20 17.4 17.4 20 0Z" fill="url(#g-ouro)" />
      </symbol>

      <symbol id="coracao" viewBox="0 0 40 36">
        <path d="M20 34S2 23 2 11C2 5 6.5 2 11 2c4 0 7 2.5 9 6 2-3.5 5-6 9-6 4.5 0 9 3 9 9 0 12-18 23-18 23Z" fill="currentColor" />
        <path d="M9 9c1.5-2 4-2.5 6-1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".7" />
      </symbol>

      <symbol id="nuvem" viewBox="0 0 80 60">
        <path d="M18 36a12 12 0 0 1 3-23.6A16 16 0 0 1 51 10a13 13 0 0 1 11 26Z" opacity=".85" style={{ fill: 'var(--c-sky-deep)' }} />
        <path d="M24 30a9 9 0 0 1 4-15" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity=".7" />
        <g style={{ fill: 'var(--c-periwinkle)' }}>
          <path d="M26 44c2 3 2 6 0 7s-3-1-2-3l2-4Z" />
          <path d="M40 46c2 3 2 6 0 7s-3-1-2-3l2-4Z" />
          <path d="M54 43c2 3 2 6 0 7s-3-1-2-3l2-4Z" />
        </g>
      </symbol>

      {/* borboleta vista de cima, cabeça para cima (x=0..80) */}
      <symbol id="borboleta" viewBox="0 0 80 80">
        <g className="borboleta__asas">
          <path d="M40 38C30 18 12 8 6 16c-6 9 6 24 34 26Z" opacity=".85" style={{ fill: 'var(--c-rose)' }} />
          <path d="M40 38C50 18 68 8 74 16c6 9-6 24-34 26Z" opacity=".85" style={{ fill: 'var(--c-rose)' }} />
          <path d="M40 42C26 44 14 56 20 64c6 7 18-2 20-18Z" opacity=".8" style={{ fill: 'var(--c-periwinkle)' }} />
          <path d="M40 42C54 44 66 56 60 64c-6 7-18-2-20-18Z" opacity=".8" style={{ fill: 'var(--c-periwinkle)' }} />
          <circle cx="16" cy="20" r="3.4" fill="#fff" opacity=".6" />
          <circle cx="64" cy="20" r="3.4" fill="#fff" opacity=".6" />
          <path d="M40 38C30 18 12 8 6 16M40 38C50 18 68 8 74 16" stroke="url(#g-ouro)" strokeWidth="1" fill="none" />
        </g>
        <ellipse cx="40" cy="44" rx="2.6" ry="14" style={{ fill: 'var(--c-gold-deep)' }} />
        <path d="M39 31c-2-6-6-9-9-10M41 31c2-6 6-9 9-10" strokeWidth="1.1" fill="none" strokeLinecap="round" style={{ stroke: 'var(--c-gold-deep)' }} />
      </symbol>

      {/* transição entre seções: três camadas de água/tinta + filete dourado */}
      <symbol id="divisor" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0 52C180 18 330 20 520 46s360 42 560 12 300-30 360-20V120H0Z" fill="currentColor" opacity=".35" />
        <path d="M0 70C210 44 380 52 560 72s380 30 560 4 270-24 320-14V120H0Z" fill="currentColor" opacity=".6" />
        <path d="M0 88C200 66 420 76 620 92s400 18 560-2 230-16 260-10V120H0Z" fill="currentColor" />
        <path d="M0 70C210 44 380 52 560 72s380 30 560 4 270-24 320-14" fill="none" strokeWidth="1.4" opacity=".55" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--c-gold)' }} />
      </symbol>

      {/* ---------- Ícones (mancha de aquarela + traço dourado) ---------- */}

      <symbol id="i-calendario" viewBox="0 0 32 32">
        <path d="M5 10c0-3 2-4 5-4h13c3 0 4 2 4 4v14c0 3-2 4-4 4H9c-3 0-4-2-4-4Z" opacity=".7" style={{ fill: 'var(--c-blush-deep)' }} />
        <g fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--c-gold-deep)' }}>
          <rect x="5" y="7" width="22" height="20" rx="3.5" />
          <path d="M5 13h22M11 4v5M21 4v5" />
          <path d="M11 18h2M15.5 18h2M20 18h1.5M11 22h2M15.5 22h2" />
        </g>
      </symbol>

      <symbol id="i-relogio" viewBox="0 0 32 32">
        <circle cx="17" cy="17" r="11" opacity=".8" style={{ fill: 'var(--c-sky)' }} />
        <g fill="none" strokeWidth="1.7" strokeLinecap="round" style={{ stroke: 'var(--c-gold-deep)' }}>
          <circle cx="16" cy="16" r="11" />
          <path d="M16 9v7l4.5 3" />
        </g>
      </symbol>

      <symbol id="i-local" viewBox="0 0 32 32">
        <ellipse cx="17" cy="27" rx="8" ry="2.6" opacity=".9" style={{ fill: 'var(--c-sky)' }} />
        <path d="M16 3a9 9 0 0 1 9 9c0 7-9 16-9 16S7 19 7 12a9 9 0 0 1 9-9Z" opacity=".75" style={{ fill: 'var(--c-blush-deep)' }} />
        <g fill="none" strokeWidth="1.7" strokeLinejoin="round" style={{ stroke: 'var(--c-gold-deep)' }}>
          <path d="M16 3a9 9 0 0 1 9 9c0 7-9 16-9 16S7 19 7 12a9 9 0 0 1 9-9Z" />
          <circle cx="16" cy="12" r="3.2" />
        </g>
      </symbol>

      <symbol id="i-boia" viewBox="0 0 32 32">
        <ellipse cx="16" cy="25" rx="13" ry="4" opacity=".55" style={{ fill: 'var(--c-water)' }} />
        <circle cx="16" cy="15" r="10.5" style={{ fill: 'var(--c-blush-deep)' }} />
        <circle cx="16" cy="15" r="4.6" style={{ fill: 'var(--c-paper)' }} />
        <g fill="#fff" opacity=".9">
          <path d="M8 9.5 12.2 12 10.8 13.8 6.6 12.2Z" />
          <path d="M24 9.5 19.8 12 21.2 13.8 25.4 12.2Z" />
          <path d="M14.5 25.4h3v-5.3h-3Z" />
        </g>
        <g fill="none" strokeWidth="1.5" style={{ stroke: 'var(--c-gold-deep)' }}>
          <circle cx="16" cy="15" r="10.5" />
          <circle cx="16" cy="15" r="4.6" />
        </g>
      </symbol>

      <symbol id="i-play" viewBox="0 0 32 32">
        <path d="M11 7.5c0-1.6 1.7-2.5 3-1.7l12 8.4c1.2.8 1.2 2.6 0 3.4l-12 8.4c-1.3.8-3-.1-3-1.7Z" fill="currentColor" />
      </symbol>

      <symbol id="i-download" viewBox="0 0 32 32">
        <circle cx="17" cy="17" r="11" opacity=".8" style={{ fill: 'var(--c-sky)' }} />
        <g fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--c-gold-deep)' }}>
          <path d="M16 6v14M10 14.5l6 6 6-6M7 26h18" />
        </g>
      </symbol>

      <symbol id="i-mapa" viewBox="0 0 32 32">
        <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M4 8l7-3 10 3 7-3v19l-7 3-10-3-7 3Z" />
          <path d="M11 5v19M21 8v19" />
        </g>
      </symbol>

      <symbol id="i-carro" viewBox="0 0 32 32">
        <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 20v-4l2.5-6.5c.5-1.3 1.4-2 2.8-2h9.4c1.4 0 2.3.7 2.8 2L26 16v4Z" />
          <path d="M6 16h20M6 20v3M26 20v3" />
          <circle cx="10.5" cy="18" r=".6" />
          <circle cx="21.5" cy="18" r=".6" />
        </g>
      </symbol>

      <symbol id="i-agenda" viewBox="0 0 32 32">
        <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="5" y="7" width="22" height="20" rx="3.5" />
          <path d="M5 13h22M11 4v5M21 4v5M16 16.5v7M12.5 20h7" />
        </g>
      </symbol>

      {/* bolha subindo da piscina, com a setinha dentro: "de volta ao topo" */}
      <symbol id="i-bolha-sobe" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="11.5" fill="url(#g-bolha)" />
        <circle cx="16" cy="16" r="11.5" opacity=".35" style={{ fill: 'var(--c-water)' }} />
        <path d="M9.4 13.6a7.4 7.4 0 0 1 4-4.4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity=".95" />
        <circle cx="22.4" cy="22" r="1.2" fill="#fff" opacity=".8" />
        <g fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--c-gold-deep)' }}>
          <circle cx="16" cy="16" r="11.5" />
          <path d="M12 17.8l4-4 4 4" />
        </g>
      </symbol>

      {/* gotinha caindo na piscina, com a setinha dentro: "vem mergulhar" */}
      <symbol id="i-gota" viewBox="0 0 32 32">
        <path d="M16 2.5S6.5 13 6.5 19.5a9.5 9.5 0 0 0 19 0C25.5 13 16 2.5 16 2.5Z" style={{ fill: 'var(--c-paper)' }} />
        <path d="M16 2.5S6.5 13 6.5 19.5a9.5 9.5 0 0 0 19 0C25.5 13 16 2.5 16 2.5Z" fill="url(#g-bolha)" />
        <path d="M10.6 19a5.6 5.6 0 0 1 2.2-4.2" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity=".9" />
        <g fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--c-gold-deep)' }}>
          <path d="M16 2.5S6.5 13 6.5 19.5a9.5 9.5 0 0 0 19 0C25.5 13 16 2.5 16 2.5Z" />
          <path d="M12.2 19l3.8 3.8 3.8-3.8" />
        </g>
      </symbol>

      <symbol id="i-lapis" viewBox="0 0 32 32">
        <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 26l1.5-6L21 6.5a2.8 2.8 0 0 1 4 4L11.5 24.5Z" />
          <path d="M18.5 9l4.5 4.5" />
        </g>
      </symbol>

      <symbol id="i-mais" viewBox="0 0 32 32">
        <path d="M16 8v16M8 16h16" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </symbol>

      <symbol id="i-menos" viewBox="0 0 32 32">
        <path d="M8 16h16" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </symbol>
    </svg>
  )
}
