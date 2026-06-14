/* =========================================================
   +20 Symbol–Alphabet Fusion Remix Styles (NEW)
   ========================================================= */

const FUSION_STYLES = [
  // 51
  makeRemixStyle({
    name: 'Astral Rune — Zodiac Seal',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '♐', post: '♌' },
    bases: { upper:'DOUBLE', lower:'SCRIPT' },
    overrides: { O:'⊙', o:'⊙', S:'Ϟ', s:'ϟ' },
    palette: ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'],
    micro: { dotVowels:true, underline:true, symbolChance:0.45 }
  }),
  // 52
  makeRemixStyle({
    name: 'Obscura Flame — Tifinagh Ember',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: 'ⴰ', post: '🔥' },
    bases: { upper:'FRAKTUR', lower:'SCRIPT' },
    overrides: { A:'ⴰ', B:'ⴱ', E:'ⴻ', H:'ⵀ', I:'ⵉ', K:'ⴽ', L:'ⵍ', O:'ⵓ', U:'ⵓ', V:'ⵖ', W:'ⵡ', Y:'ⵢ', Z:'ⵣ' },
    palette: ['ⵣ','ⵔ','ⵇ','ⴷ','ⴳ'],
    micro: { symbolChance:0.5, slash:true }
  }),
  // 53
  makeRemixStyle({
    name: 'Venin Crown — Alchemical Sigil',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '🜂', post: '🜁' },
    bases: { upper:'MONO', lower:'MONO' },
    overrides: { O:'🜔', o:'🜔', A:'🜃', a:'🜃', E:'🜁', e:'🜁' },
    palette: ['🜍','🜏','🜔','🜚','🜃','🜄'],
    micro: { underline:true, symbolChance:0.55 }
  }),
  // 54
  makeRemixStyle({
    name: 'Royal Gambit — Chess Fang',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '♔', post: '♕' },
    bases: { upper:'DOUBLE', lower:'SCRIPT' },
    overrides: { K:'♚', Q:'♛', B:'♝', N:'♞', R:'♜', P:'♟' },
    palette: ['♔','♕','♖','♗','♘','♙','♚','♛','♜','♝','♞','♟'],
    micro: { symbolChance:0.5, dotVowels:true }
  }),
  // 55
  makeRemixStyle({
    name: 'Jade Lotus — Mahjong Bloom',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '🀄', post: '🀚' },
    bases: { upper:'SCRIPT', lower:'SCRIPT' },
    overrides: {},
    palette: ['🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏','🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘','🀙'],
    micro: { symbolChance:0.6, dotVowels:true }
  }),
  // 56
  makeRemixStyle({
    name: 'Ancient Oracle — Phoenician Sigil',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '𐤀', post: '𐤅' },
    bases: { upper:'FRAKTUR', lower:'FRAKTUR' },
    overrides: { A:'𐤀', B:'𐤁', G:'𐤂', D:'𐤃', H:'𐤄', W:'𐤅', Z:'𐤆', Ḥ:'𐤇', Ṭ:'𐤈', Y:'𐤉', K:'𐤊', L:'𐤋', M:'𐤌', N:'𐤍', S:'𐤎', ʿ:'𐤏', P:'𐤐', Ṣ:'𐤑', Q:'𐤒', R:'𐤓', Š:'𐤔', T:'𐤕' },
    palette: ['𐤀','𐤁','𐤂','𐤃','𐤄','𐤅','𐤆','𐤇','𐤈','𐤉','𐤊','𐤋','𐤌','𐤍','𐤎','𐤏','𐤐','𐤑','𐤒','𐤓','𐤔','𐤕'],
    micro: { symbolChance:0.35, underline:true }
  }),
  // 57
  makeRemixStyle({
    name: 'Twilight Mirror — Gothic Veil',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '⛧', post: '⛧' },
    bases: { upper:'FRAKTUR', lower:'SCRIPT' },
    overrides: {},
    palette: ['✟','☩','✠','✞'],
    micro: { symbolChance:0.45, slash:true }
  }),
  // 58
  makeRemixStyle({
    name: 'Solar Relic — Old Italic Flame',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '𐌀', post: '🔥' },
    bases: { upper:'DOUBLE', lower:'DOUBLE' },
    overrides: { A:'𐌀', B:'𐌁', C:'𐌂', D:'𐌃', E:'𐌄', F:'𐌅', G:'𐌆', H:'𐌇', I:'𐌈', K:'𐌊', L:'𐌋', M:'𐌌', N:'𐌍', O:'𐌏', P:'𐌐', Q:'𐌒', R:'𐌓', S:'𐌔', T:'𐌕', U:'𐌖', V:'𐌖', X:'𐌗', Z:'𐌙' },
    palette: ['𐌀','𐌁','𐌂','𐌃','𐌄','𐌅','𐌆','𐌇','𐌈','𐌊','𐌋','𐌌','𐌍','𐌏','𐌐','𐌒','𐌓','𐌔','𐌕','𐌖','𐌗','𐌙'],
    micro: { symbolChance:0.4, dotVowels:true }
  }),
  // 59
  makeRemixStyle({
    name: 'Frozen Zodiac — Ice Rune',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '❄︎', post: '❄︎' },
    bases: { upper:'MONO', lower:'MONO' },
    overrides: { O:'♒', o:'♒', A:'♑', a:'♑' },
    palette: ['♑','♒','♓','❆','❄︎'],
    micro: { symbolChance:0.5 }
  }),
  // 60
  makeRemixStyle({
    name: 'Sacred Bloom — Lotus Mark',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '☸', post: '☸' },
    bases: { upper:'SCRIPT', lower:'SCRIPT' },
    overrides: {},
    palette: ['☸','✿','❀','🪷'],
    micro: { symbolChance:0.55, dotVowels:true }
  }),
  // 61
  makeRemixStyle({
    name: 'Infernal Sigil — Hell Rune',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '🜏', post: '🜍' },
    bases: { upper:'FRAKTUR', lower:'FRAKTUR' },
    overrides: {},
    palette: ['🜏','🜍','🝫','🝟'],
    micro: { symbolChance:0.5, underline:true }
  }),
  // 62
  makeRemixStyle({
    name: 'Crown of Ages — Time Relic',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '⌛', post: '⌛' },
    bases: { upper:'DOUBLE', lower:'SCRIPT' },
    overrides: { O:'◌̄', o:'◌̄' },
    palette: ['⌛','⏳','⧗','🕰'],
    micro: { symbolChance:0.45, tilde:true }
  }),
  // 63
  makeRemixStyle({
    name: 'Starveil Echo — Cosmic Song',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '✧', post: '✧' },
    bases: { upper:'SCRIPT', lower:'SCRIPT' },
    overrides: {},
    palette: ['✧','✦','⋆','✶','✷'],
    micro: { symbolChance:0.6, dotVowels:true }
  }),
  // 64
  makeRemixStyle({
    name: 'Venom Halo — Toxic Glyph',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '☣︎', post: '☣︎' },
    bases: { upper:'MONO', lower:'MONO' },
    overrides: { O:'⍥', o:'⍥' },
    palette: ['☣︎','⎔','⌬','⌁'],
    micro: { symbolChance:0.55, slash:true }
  }),
  // 65
  makeRemixStyle({
    name: 'Mystic Crown — Celestial Fang',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '☾', post: '☾' },
    bases: { upper:'DOUBLE', lower:'SCRIPT' },
    overrides: {},
    palette: ['☾','☽','✺','⋆'],
    micro: { symbolChance:0.5, dotVowels:true }
  }),
  // 66
  makeRemixStyle({
    name: 'Dragon Rune — Ember Fang',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '🐉', post: '🐉' },
    bases: { upper:'FRAKTUR', lower:'SCRIPT' },
    overrides: {},
    palette: ['🐉','🔥','🜂','✠'],
    micro: { symbolChance:0.5, underline:true }
  }),
  // 67
  makeRemixStyle({
    name: 'Void Relic — Black Star',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '✦', post: '✦' },
    bases: { upper:'MONO', lower:'DOUBLE' },
    overrides: { O:'●', o:'●' },
    palette: ['✦','●','◈','◇'],
    micro: { symbolChance:0.5 }
  }),
  // 68
  makeRemixStyle({
    name: 'Phantom Lotus — Spirit Petal',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '👁', post: '👁' },
    bases: { upper:'SCRIPT', lower:'SCRIPT' },
    overrides: {},
    palette: ['👁','🪷','✧','◦'],
    micro: { symbolChance:0.55, dotVowels:true }
  }),
  // 69
  makeRemixStyle({
    name: 'Arcane Spiral — Chaos Sigil',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '⟲', post: '⟲' },
    bases: { upper:'DOUBLE', lower:'DOUBLE' },
    overrides: {},
    palette: ['⟲','⟳','↻','↺','⤿','⤾'],
    micro: { symbolChance:0.45, tilde:true }
  }),
  // 70
  makeRemixStyle({
    name: 'Throne of Ash — Ember Crown',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '🔥', post: '🔥' },
    bases: { upper:'FULL', lower:'SCRIPT' },
    overrides: { O:'⦿', o:'⦿' },
    palette: ['🔥','✠','⛧','⛓'],
    micro: { symbolChance:0.55, underline:true }
  }),
];

/* =========================
   NEW, UNIQUE FONT PACKS
   ========================= */

(function(){
  // --- helpers ---
  const mapString = (txt, map) =>
    txt.split('').map(ch => map[ch] ?? ch).join('');

  // Diacritic engines (novel looks; keep base letters = good cross-app support)
  const weave = (txt, seq) => {
    let i = 0;
    return txt.split('').map(ch=>{
      if (!/\S/.test(ch)) return ch;
      const deco = seq[i++ % seq.length];
      return ch + deco;
    }).join('');
  };

  // THIN, HAIR, NNBSP for airy spacing where wanted
  const spacer = (txt, s = '\u200A') => txt.split('').join(s);

  // Base ASCII sets for maps
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const az = 'abcdefghijklmnopqrstuvwxyz';
  const d10 = '0123456789';

  // 1) MICROCAPS HYBRID (rare small-cap letters + IPA forms)
  const MICROCAPS_UP = [...'ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᵠᴿˢᵀᵁⱽᵂˣʎᶻ'];
  // fallback patches where small-caps don’t exist (Q→ᵠ, Y→ʎ etc.)

  const microcapsMap = {};
  for (let i=0;i<26;i++) microcapsMap[AZ[i]] = MICROCAPS_UP[i] || AZ[i];
  // make lowercase look like true small caps too
  const MICROCAPS_LOW = {
    a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ꜰ', g:'ɢ', h:'ʜ', i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ',
    m:'ᴍ', n:'ɴ', o:'ᴏ', p:'ᴘ', q:'ǫ', r:'ʀ', s:'s', t:'ᴛ', u:'ᴜ', v:'ᴠ', w:'ᴡ', x:'x', y:'ʏ', z:'ᴢ'
  };
  Object.assign(microcapsMap, MICROCAPS_LOW);
  // digits: keep as is (readability)
  d10.split('').forEach(d=>microcapsMap[d]=d);

  // 2) SQUARED ENCLOSURE (🄰 🄱 …) with fallback to Ⓐ/fullwidth
  // Note: 🄰.. block coverage is decent on modern OS; fallback provided.
  const squared = '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉';
  const circled = 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ';
  const fullUp = [...'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ'];
  const fullLo = [...'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'];

  const squaredMap = {};
  for (let i=0;i<26;i++){
    squaredMap[AZ[i]] = (squared[i] ?? circled[i]) || fullUp[i];
    squaredMap[az[i]] = (circled[i] ?? fullLo[i]) || fullLo[i];
  }
  // digits → enclosed ⓪①… fallback fullwidth
  const circDigits = '⓪①②③④⑤⑥⑦⑧⑨';
  d10.split('').forEach((d,i)=> squaredMap[d] = circDigits[i] || '０１２３４５６７８９'[i]);

  // 3) WIREFRAME DOUBLE (Mathematical double-struck, but FULL set)
  const dblUp = [...'𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ'];
  const dblLo = [...'𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫'];
  const dblDigits = [...'𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'];
  const doubleMap = {};
  for (let i=0;i<26;i++){ doubleMap[AZ[i]]=dblUp[i]; doubleMap[az[i]]=dblLo[i]; }
  d10.split('').forEach((d,i)=> doubleMap[d]=dblDigits[i]);

  // 4) BOX-MONO TIGHT (Mathematical monospace, consistent & clean)
  const monoUp = [...'𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉'];
  const monoLo = [...'𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣'];
  const monoDigits = [...'𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'];
  const monoMap = {};
  for (let i=0;i<26;i++){ monoMap[AZ[i]]=monoUp[i]; monoMap[az[i]]=monoLo[i]; }
  d10.split('').forEach((d,i)=> monoMap[d]=monoDigits[i]);

  // 5) AURA HALO (novel: alternating dot-above ◌̇ and ring-above ◌̊)
  const AURA_SEQ = ['\u0307', '\u030A']; // ̇, ̊
  const auraHalo = txt => weave(txt, AURA_SEQ);

  // 6) SHADOW UNDERLINE (novel: combining double macron below ◌̿ blends nicely)
  const SHADOW_SEQ = ['\u0333', '\u0331']; // ◌̳, ◌̱
  const shadowUnderline = txt => weave(txt, SHADOW_SEQ);

  // 7) STITCHED (thin spacing + low tilde below for a stitched vibe)
  const STITCH_SEQ = ['\u0330', '\u0324']; // ◌̰ , ◌̤
  const stitched = txt => spacer(weave(txt, STITCH_SEQ), '\u2009'); // thin space

  // 8) EDGE-GLINT (rare: caron + dot below alternating → crisp, “edgy” look)
  const GLINT_SEQ = ['\u030C', '\u0323']; // ̌ , ̣
  const glint = txt => weave(txt, GLINT_SEQ);


  // === PACK REGISTRATIONS ===
  const NEW_STYLES = [
    {
      name: "Microcaps Hybrid",
      pack: "microcaps-hybrid",
      note: "True small-cap feel using rare IPA forms; great for compact bios.",
      transform: txt => mapString(txt, microcapsMap)
    },
    {
      name: "Squared Enclosure",
      pack: "squared-enclose",
      note: "🄰-style boxed caps with graceful fallbacks to Ⓐ / fullwidth.",
      transform: txt => mapString(txt, squaredMap)
    },
    {
      name: "Wireframe Double",
      pack: "wire-doublestruck",
      note: "Full A-Z/a-z/0-9 double-struck—clean, hollow vibe.",
      transform: txt => mapString(txt, doubleMap)
    },
    {
      name: "Box-Mono Tight",
      pack: "boxy-mono-tight",
      note: "Monospaced math alphabet—industrial labels, gamer tags.",
      transform: txt => mapString(txt, monoMap)
    },
    {
      name: "Aura Halo",
      pack: "aura-halo",
      note: "Alternating dot & ring above for a soft halo aesthetic.",
      transform: auraHalo
    },
    {
      name: "Shadow Underline",
      pack: "shadow-underline",
      note: "Alternating heavy/soft baselines for a sunk-ink effect.",
      transform: shadowUnderline
    },
    {
      name: "Stitched Thin",
      pack: "stitched-thin",
      note: "Thin spacing + low tildes/dots under—textile stitch feel.",
      transform: stitched
    },
    {
      name: "Edge Glint",
      pack: "edge-glint",
      note: "Caron + dot-below pattern adds a metallic, edgy sparkle.",
      transform: glint
    },
  ];

  // expose
  window.FONT_STYLES = (window.FONT_STYLES || []).concat(NEW_STYLES);
})();

const extraStyles = [...FUSION_STYLES];
window.styles = window.styles ? [...window.styles, ...extraStyles] : extraStyles;
if (window._onExtraStylesLoaded) window._onExtraStylesLoaded();
