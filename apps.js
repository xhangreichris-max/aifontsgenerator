const DOM = {
  desktopInput: document.getElementById("input-text-desktop"),
  mobileInput: document.getElementById("input-text-mobile"),
  cardsRoot: document.getElementById("all-font-cards"),
  remixAllBtn: document.getElementById("btnRemixAll"),
  clearBtn: document.getElementById("btnClear"),
  remixAllBtnMobile: document.getElementById("btnRemixAllMobile"),
  clearBtnMobile: document.getElementById("btnClearMobile"),
  stickyInputBar: document.getElementById("stickyInputBar"),
  stickyInput: document.getElementById("input-text-sticky"),
  remixStickyBtn: document.getElementById("btnRemixSticky"),
  fontSizeSlider: document.getElementById("fontSizeSlider")
};

/* ======= DEFENSIVE INPUT ATTRIBUTES + SPACE CAPTURE ======= */
(function setupInputDefenses() {
  const ta = DOM.desktopInput;
  const taMobile = DOM.mobileInput || null;

  [ta, taMobile].forEach(t => {
    if (!t) return;
    try {
      t.setAttribute('wrap', 'soft');
      t.setAttribute('autocomplete', 'off');
      t.setAttribute('autocorrect', 'off');
      t.setAttribute('autocapitalize', 'off');
      t.setAttribute('spellcheck', 'false');
      t.setAttribute('inputmode', 'text');
      t.style.whiteSpace = 'pre-wrap';
    } catch (e) { }
  });

  function captureSpaceWhenFocused(e) {
    if (e.type !== 'keydown') return;
    const isSpace = e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar';
    if (!isSpace) return;
    const active = document.activeElement;
    const isEditing = (active === ta) || (taMobile && active === taMobile);
    if (isEditing) {
      e.stopImmediatePropagation?.();
      e.stopPropagation();
      return;
    }
  }
  document.addEventListener('keydown', captureSpaceWhenFocused, true);

  let composing = false;
  function onCompositionStart() { composing = true; }
  function onCompositionEnd() { composing = false; }
  if (ta) { ta.addEventListener('compositionstart', onCompositionStart); ta.addEventListener('compositionend', onCompositionEnd); }
  if (taMobile) { taMobile.addEventListener('compositionstart', onCompositionStart); taMobile.addEventListener('compositionend', onCompositionEnd); }
})();

/* ------------------ Utilities ------------------ */
const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
function debounce(fn, ms = 160) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText =
      "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);padding:8px 12px;border-radius:10px;background:#10151b;color:#eef3f7;font:13px/1.2 system-ui,sans-serif;border:1px solid #1e2731;z-index:9999;opacity:0;transition:opacity .18s ease";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  setTimeout(() => (t.style.opacity = "0"), 950);
}
function escapeHTML(s = "") {
  return s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

/* ------------------ RNG / Hash ------------------ */
const mulberry32 = (a) => () => {
  let t = (a += 0x6D2B79F5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
function hashStr(s = "") {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
let GLOBAL_SEED = (Math.random() * 0xFFFFFFFF) >>> 0;

/* ------------------ Grapheme & Char Guards ------------------ */
const SEG = (typeof Intl !== "undefined" && Intl.Segmenter)
  ? new Intl.Segmenter("en", { granularity: "grapheme" })
  : null;
const GRAPHEME_CACHE = new Map();
const GRAPHEMES = s => {
  if (!s) return [];
  if (GRAPHEME_CACHE.has(s)) return GRAPHEME_CACHE.get(s);
  const result = SEG
    ? Array.from(SEG.segment(s), x => x.segment)
    : Array.from(s);
  // Only cache short strings — long ones are rare and eat memory
  if (s.length < 64) GRAPHEME_CACHE.set(s, result);
  return result;
};
const reAlphaNum = /\p{L}|\p{N}/u;
const hasEmoji = ch => /\p{Extended_Pictographic}/u.test(ch);

/* ------------------ Palettes / Frames / Marks ------------------ */
const PALETTES = {
  cuneiform: ["𒀭", "𒀹", "𒅗", "𒄿", "𒌋", "𒊭", "𒉿", "𒁹"],
  linearB: ["𐂀", "𐂁", "𐂂", "𐂃", "𐂄", "𐂅"],
  zodiac: ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"],
  alchemy: ["🜁", "🜂", "🜃", "🜄", "🜍", "🜏", "🝙"],
  geom: ["◇", "◆", "◈", "⌬", "◬", "◩", "◪", "⟡"],
  stars: ["✦", "✶", "✷", "✺", "✧", "❖", "⋆", "✹", "✸"],
  hearts: ["♥", "❥", "♡", "❤", "💖", "💗"],
  runes: ["ᚨ", "ᚢ", "ᚱ", "ᚲ", "ᚷ", "ᚺ", "ᛟ", "ᛏ", "ᛉ", "ᛞ"],
  flora: ["❀", "❁", "✿", "✾", "❋", "⚘", "🌸"],
  tech: ["▣", "◧", "◨", "⟊", "⌗", "⟴", "⟰"],
  occult: ["✠", "☥", "☩", "⛧", "†", "✟"],
};
const FRAMES = {
  ancient: [["𒀭", "𒀭"], ["𒀹", "𒀹"], ["❖", "❖"]],
  mystic: [["✧", "✧"], ["⋆", "⋆"], ["☾", "☽"]],
  dark: [["✠", "✠"], ["†", "†"], ["⛧", "⛧"]],
  ocean: [["༄", "༄"], ["🌊", "🌊"], ["☽", "☾"]],
  frost: [["❄︎", "❄︎"], ["☾", "☾"]],
  fire: [["🔥", "🔥"], ["✦", "✦"]],
  tech: [["◈", "◈"], ["▣", "▣"]],
  soft: [["❀", "❀"], ["♥", "♥"], ["✿", "✿"]],
  none: [],
};
const DIACRITICS = ["\u0307", "\u0323", "\u0331", "\u0304", "\u0335", "\u0346", "\u0357", "\u0332", "\u035B"];

/* ══════════════════════════════════════════════════════════
   FRAME ENGINE
   80 [[t]] templates — rotate every 5s, show 6 at a time
   Click any card = copy to clipboard
   Text updates live when user types
══════════════════════════════════════════════════════════ */

const FRAME_TEMPLATES = [
  // ── BATCH 1 ──
  '꧁༒☬ [[t]] ☬༒꧂',
  '★彡 [[t]] 彡★',
  '⎝⎝✧ALPHA✧⎠⎠ [[t]] ⎝⎝✧ALPHA✧⎠⎠',
  '🔥(✖ [[t]] ✖)🔥',
  '⚡️💀 [[t]] 💀⚡️',
  '▄︻デ══━一 [[t]] ━一',
  '(ง ͠° ͟ل͜ ͡°)ง [[t]] 💪',
  '👑➤ [[t]] ➤👑',
  '⸻𓆩 [[t]] 𓆪⸻',
  '⎝⎝✧KING✧⎠⎠ [[t]] ⎝⎝✧KING✧⎠⎠',
  '꧁༒☠️ [[t]] ☠️༒꧂',
  '🥷 [[t]] 🥷',
  '⚔️🛡️ [[t]] 🛡️⚔️',
  '💥《 [[t]] 》💥',
  '🕶️😎 [[t]] 😎🕶️',
  '༼つಠ益ಠ༽つ [[t]] ༼つಠ益ಠ༽つ',
  '✧༒☬ [[t]] ☬༒✧',
  '◥꧁ད [[t]] ཌ꧂◤',
  '≿≺✦≻≾ [[t]] ≿≺✦≻≾',
  '🎯PRO • [[t]] • PRO🎯',
  // ── BATCH 2 ──
  '🔱 [[t]] 🔱',
  '🪃💨 [[t]] 💨🪃',
  '🧨💣 [[t]] 💣🧨',
  '⫷⫸ [[t]] ⫷⫸',
  '░▒▓█ [[t]] █▓▒░',
  '₊˚ʚ [[t]] ɞ˚₊',
  '•͙✧˖°🌸 [[t]] 🌸°˖✧͙•',
  '꒰ᵕ̈꒱ [[t]] ꒰ᵕ̈꒱',
  '╰☆☆ [[t]] ☆☆╮',
  '🌙⋆｡ [[t]] ｡⋆🌙',
  '(づ｡◕‿‿◕｡)づ [[t]]',
  'ʕっ•ᴥ•ʔっ [[t]] ʕっ•ᴥ•ʔっ',
  '(ﾉ´ヮ`)ﾉ*: [[t]] :*ヽ(´ヮ`ヽ)',
  '٩(◕‿◕｡)۶ [[t]] ٩(◕‿◕｡)۶',
  '(づ ᴗ _ᴗ)づ [[t]]',
  '𓃰 [[t]] 𓃰',
  '𓂀 [[t]] 𓂀',
  '☥𓆙 [[t]] 𓆙☥',
  '卍 [[t]] 卍',
  '࿇ ══━━━ [[t]] ━━━══ ࿇',
  '◈━━━ [[t]] ━━━◈',
  '【 [[t]] 】',
  '⌈⌈ [[t]] ⌋⌋',
  '▸▸ [[t]] ◂◂',
  '⟦ [[t]] ⟧',
  '†ψ [[t]] ψ†',
  '⛧ [[t]] ⛧',
  '🕸️👻 [[t]] 👻🕸️',
  '𖤐 [[t]] 𖤐',
  '💀🖤 [[t]] 🖤💀',
  // ── BATCH 3 ──
  '🌊〜 [[t]] 〜🌊',
  '🍀✨ [[t]] ✨🍀',
  '🌋⚠️ [[t]] ⚠️🌋',
  '❄️🐺 [[t]] 🐺❄️',
  '🦅⚡ [[t]] ⚡🦅',
  '🎮⟆ [[t]] ⟆🎮',
  '🕹️▶ [[t]] ◀🕹️',
  '🏆꧂ [[t]] ꧁🏆',
  '💎⌬ [[t]] ⌬💎',
  '🃏⚄ [[t]] ⚄🃏',
  '∭ [[t]] ∭',
  '⊰ [[t]] ⊱',
  '⋞⋞ [[t]] ⋟⋟',
  '∰∯ [[t]] ∯∰',
  '⊛⊛ [[t]] ⊛⊛',
  '⦃ [[t]] ⦄',
  '⸂⸂ [[t]] ⸃⸃',
  '｢｢ [[t]] ｣｣',
  '⌦ [[t]] ⌫',
  '⦅ [[t]] ⦆',
  '🧿ꕤ [[t]] ꕤ🧿',
  '☽𖣔 [[t]] 𖣔☾',
  '𑁍𑁍 [[t]] 𑁍𑁍',
  '꩜ [[t]] ꩜',
  '⚚ [[t]] ⚚',
  '▛▀▀ [[t]] ▀▀▜',
  '⬛⬜ [[t]] ⬜⬛',
  '▓▓▓ [[t]] ▓▓▓',
  '⎮⎮ [[t]] ⎮⎮',
  '⏣ [[t]] ⏣',
];

const GAMER_NAMES = [
  'SHADOW', 'BLAZE', 'VENOM', 'REAPER', 'GHOST',
  'TITAN', 'STORM', 'ROGUE', 'VIPER', 'FROST',
  'CIPHER', 'NEXUS', 'WRAITH', 'PHANTOM', 'COBRA',
  'INFERNO', 'SAVAGE', 'HUNTER', 'STEALTH', 'TOXIC',
  'DRAGON', 'SNIPER', 'CHAOS', 'OMEGA', 'STRIKER',
  'FALCON', 'DEMON', 'LEGEND', 'OUTLAW', 'FURY',
  'SLAYER', 'REBEL', 'WARLORD', 'BANDIT', 'SPECTER',
  'ZERO', 'APEX', 'NOVA', 'DUSK', 'BLADE'
];

// Track which 6 templates are currently showing + current gamer name
let hotTemplates = [];
let hotGamerIdx = Math.floor(Math.random() * GAMER_NAMES.length);

function applyFrame(template, text) {
  return template.replace('[[t]]', text || '');
}

function pickSix() {
  // Pick 6 random unique templates from full pool
  const pool = [...FRAME_TEMPLATES];
  const picked = [];
  while (picked.length < 6 && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

function getFrameDisplayText() {
  if (state && state.text && state.text.trim()) return state.text.trim();
  return GAMER_NAMES[hotGamerIdx % GAMER_NAMES.length];
}

// Build the 6 hot-card DOM nodes once, then only update textContent after
function renderHotNow(forceRebuild = false) {
  const row = document.getElementById('frameRow');
  if (!row) return;

  const displayText = getFrameDisplayText();
  const existingCards = row.querySelectorAll('.hot-card');

  // Full rebuild on first render or forced
  if (forceRebuild || existingCards.length !== 6) {
    hotTemplates = pickSix();

    row.innerHTML = hotTemplates.map((tpl) => {
      return `<div class="hot-card" data-template="${tpl.replace(/"/g, '&quot;')}">
        <span class="hot-badge">HOT</span>
        <span class="hot-preview">${applyFrame(tpl, displayText)}</span>
        <span class="hot-copy-hint">CLICK TO COPY</span>
      </div>`;
    }).join('');

    // Attach click listeners once
    row.querySelectorAll('.hot-card').forEach(card => {
      card.addEventListener('click', () => {
        const text = card.querySelector('.hot-preview').textContent || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text)
            .then(() => toast('Copied!'))
            .catch(() => fallbackCopy(text));
        } else {
          fallbackCopy(text);
        }
        card.classList.add('hot-copied');
        setTimeout(() => card.classList.remove('hot-copied'), 1200);
      });
    });
    return;
  }

  // Soft update — just swap text + templates, no DOM rebuild, no flicker
  hotTemplates = pickSix();
  row.classList.add('hot-fading');

  setTimeout(() => {
    existingCards.forEach((card, i) => {
      const tpl = hotTemplates[i];
      if (!tpl) return;
      card.dataset.template = tpl;
      const preview = card.querySelector('.hot-preview');
      if (preview) preview.textContent = applyFrame(tpl, displayText);
    });
    row.classList.remove('hot-fading');
  }, 280);
}

// ── AUTO-ROTATE every 5 seconds ──────────────────────────
setInterval(() => {
  // Rotate gamer name each cycle
  hotGamerIdx = (hotGamerIdx + 1) % GAMER_NAMES.length;
  renderHotNow(false);
}, 5000);

const THINSP = ["\u2006", "\u2007", "\u2009", "\u200A", "\u202F"];

/* ------------------ Rules (per-category + name spices) ------------------ */
const BASE_RULES = {
  "Featured Styles": { di: 0.22, sp: 0.14, ls: 0.12, mid: 0.45, frame: 0.45, pal: ["cuneiform", "geom"], fr: "ancient" },
  "Exotic & International": { di: 0.14, sp: 0.12, ls: 0.10, mid: 0.30, frame: 0.25, pal: ["runes", "zodiac", "geom"], fr: "mystic" },
  "Algorithmic & Combining Marks": { di: 0.40, sp: 0.18, ls: 0.08, mid: 0.15, frame: 0.15, pal: ["stars"], fr: "none" },
  "Flourish Decorated": { di: 0.10, sp: 0.16, ls: 0.06, mid: 0.25, frame: 0.20, pal: ["hearts", "flora", "stars"], fr: "soft" },
  "Classic Styles": { di: 0.06, sp: 0.10, ls: 0.02, mid: 0.05, frame: 0.05, pal: ["stars"], fr: "none" },
  "Complex / Glitched": { di: 0.24, sp: 0.14, ls: 0.14, mid: 0.30, frame: 0.30, pal: ["alchemy", "geom", "tech"], fr: "tech" },
  Misc: { di: 0.10, sp: 0.10, ls: 0.06, mid: 0.20, frame: 0.15, pal: ["stars"], fr: "none" },
};
function applyNameSpice(rules, name = "") {
  name = (name || "").toLowerCase();
  const r = { ...rules };
  const bump = (k, v) => r[k] = (r[k] ?? 0) + v;
  if (/\b(ancient|hieroglyph|glyph)\b/.test(name)) { r.pal = ["cuneiform", "linearB", "geom"]; r.fr = "ancient"; bump("di", 0.04); bump("mid", 0.10); r.frame = Math.max(r.frame, 0.55); }
  if (/\b(runic|rune)\b/.test(name)) { r.pal = ["runes", "zodiac"]; r.fr = "mystic"; r.mid = Math.max(r.mid, 0.35); }
  if (/\b(vaporwave|full\s?width)\b/.test(name)) { r.pal = ["stars", "geom"]; r.fr = "soft"; r.sp = Math.max(r.sp, 0.22); }
  if (/\b(fraktur|medieval|demon)\b/.test(name)) { r.pal = ["occult", "alchemy"]; r.fr = "dark"; bump("di", 0.08); r.frame = Math.max(r.frame, 0.35); }
  if (/\b(alien|ufo|xeno)\b/.test(name)) { r.pal = ["tech", "geom", "zodiac"]; r.fr = "tech"; bump("ls", 0.06); }
  return r;
}
const RULES_CACHE = new Map();
function getRulesForStyle(style) {
  const key = (style.name || '') + '|' + (style.category || style.pack || '');
  if (RULES_CACHE.has(key)) return RULES_CACHE.get(key);
  const cat = style.category || style.pack || "Misc";
  const base = BASE_RULES[cat] || BASE_RULES.Misc;
  const result = applyNameSpice(base, style.name || "");
  RULES_CACHE.set(key, result);
  return result;
}

/* ------------------ Base render (map/transform) ------------------ */
function applyMapFallback(text, map) {
  return text
    .split("")
    .map((ch) => map?.[ch] ?? map?.[ch.toLowerCase()] ?? map?.[ch.toUpperCase()] ?? ch)
    .join("");
}
const APPLY_MAP = typeof window.applyMap === "function" ? window.applyMap : applyMapFallback;

function styleBase(style, text) {
  if (typeof style.transform === "function") return style.transform(text);
  if (style.map) return APPLY_MAP(text, style.map);
  return text;
}

/* ------------------ Decoration engine ------------------ */
function decorateWithRules(baseText, rng, rules) {
  const gs = GRAPHEMES(baseText);
  const len = gs.length || 1;

  const scale = len < 6 ? (0.5 + len / 12) : 1;

  const diRate = (rules.di || 0) * scale;
  const spRate = (rules.sp || 0) * scale;
  const lsRate = (rules.ls || 0) * scale;
  const midRate = (rules.mid || 0) * scale;
  const frameP = (rules.frame || 0);

  const palName = (rules.pal && rules.pal[(rng() * rules.pal.length) | 0]) || "stars";
  const palette = PALETTES[palName] || PALETTES.stars;

  let out = "";
  for (const g of gs) {
    out += g;
    if (!reAlphaNum.test(g) || hasEmoji(g)) continue;
    if (rng() < diRate) out += DIACRITICS[(rng() * DIACRITICS.length) | 0];
    if (rng() < spRate) out += THINSP[(rng() * THINSP.length) | 0];
    if (rng() < lsRate) {
      const sym = palette[(rng() * palette.length) | 0];
      const ts = THINSP[(rng() * THINSP.length) | 0];
      out += ts + sym + ts;
    }
  }

  if (len > 3 && rng() < midRate) {
    const bead = palette[(rng() * palette.length) | 0];
    const i = (len / 2) | 0;
    out = gs.slice(0, i).join("") + THINSP[0] + bead + THINSP[0] + gs.slice(i).join("");
  }

  const frameSet = FRAMES[rules.fr] || [];
  if (len >= 4 && frameSet.length && rng() < frameP) {
    const [L, R] = frameSet[(rng() * frameSet.length) | 0];
    out = L + THINSP[0] + out + THINSP[0] + R;
  }

  return out.normalize ? out.normalize("NFC") : out;
}

/* ------------------ Deterministic composer ------------------ */
// Output cache — keyed by style+text+seed+bump+ord
const OUTPUT_CACHE = new Map();
let LAST_GLOBAL_SEED = GLOBAL_SEED;

function styleOutput(style, text, seedBump, globalOrdinal) {
  const base = styleBase(style, text);
  if (style.pure) return base;
  if (!text || !text.trim()) return base;

  // Invalidate cache when GLOBAL_SEED changes (remix clicked)
  if (LAST_GLOBAL_SEED !== GLOBAL_SEED) {
    OUTPUT_CACHE.clear();
    LAST_GLOBAL_SEED = GLOBAL_SEED;
  }

  const cacheKey = `${style.name}|${text}|${seedBump}|${globalOrdinal}`;
  if (OUTPUT_CACHE.has(cacheKey)) return OUTPUT_CACHE.get(cacheKey);

  const keySeed = hashStr((style.category || style.pack || "") + "|" + (style.name || ""));
  const seed = (GLOBAL_SEED + keySeed + (seedBump | 0) + (globalOrdinal | 0)) >>> 0;
  const rng = mulberry32(seed);
  const rules = getRulesForStyle(style);
  const result = decorateWithRules(base, rng, rules);

  // Cap cache size to prevent memory bloat
  if (OUTPUT_CACHE.size > 500) OUTPUT_CACHE.clear();
  OUTPUT_CACHE.set(cacheKey, result);
  return result;
}

/* ------------------ Load & Normalize Styles ------------------ */
function dedupeStyles(list) {
  const seen = new Set();
  const out = [];
  list.forEach(s => {
    const name = (s.name || s.title || "Untitled").trim().toLowerCase();
    if (seen.has(name)) return;
    seen.add(name);
    out.push({ ...s, name: s.name || s.title || "Untitled" });
  });
  return out;
}

const RAW_A = Array.isArray(window.styles) ? window.styles : [];
const RAW_B = Array.isArray(window.FONT_STYLES) ? window.FONT_STYLES : [];
let ALL_STYLES = dedupeStyles([...RAW_A, ...RAW_B]);

// O(1) lookup map — replaces O(n) linear search
const STYLE_MAP = new Map();
ALL_STYLES.forEach(s => {
  STYLE_MAP.set((s.name || '').trim().toLowerCase(), s);
});

if (!ALL_STYLES.length) {
  console.warn('[AI Fonts] No styles found.');
}

/* ------------------ Style Lookup & Applying ------------------ */
function findStyle(name) {
  return STYLE_MAP.get((name || '').trim().toLowerCase()) || null;
}

function applyStyle(style, text) {
  return styleBase(style, text);
}

/* ------------------ Data & State ------------------ */
function getDefaultText(style) {
  if (state.text && state.text.trim()) {
    return state.text.trim();
  }

  const cat = (
    style.category ||
    style.pack ||
    ''
  ).toLowerCase();

  const name = (style.name || '').toLowerCase();

  // Match by category keywords
  if (cat.includes('classic') || cat.includes('clean') ||
      cat.includes('minimalist')) return 'Stylish Name';
  if (cat.includes('glitch') || cat.includes('corrupt') ||
      cat.includes('complex')) return 'Free Fire';
  if (cat.includes('exotic') || cat.includes('international'))
    return 'Your Name';
  if (cat.includes('remix') || cat.includes('fusion') ||
      cat.includes('creative') || cat.includes('mixed'))
    return 'PUBG Name';
  if (cat.includes('symbol')) return 'Instagram Bio';
  if (cat.includes('featured') || cat.includes('ancient'))
    return 'Cool Name';
  if (cat.includes('flourish') || cat.includes('decorated'))
    return 'Aesthetic Name';
  if (cat.includes('asian') || cat.includes('cjk'))
    return 'Gaming Name';
  if (cat.includes('attitude')) return 'Shadow';
  if (cat.includes('beautiful')) return 'Your Name';
  if (cat.includes('bold')) return 'BGMI Name';
  if (cat.includes('boxed')) return 'Username';
  if (cat.includes('crown')) return 'King Name';
  if (cat.includes('cute') || cat.includes('kawaii'))
    return 'Kawaii Name';
  if (cat.includes('flip') || cat.includes('mirror'))
    return 'Flip Text';
  if (cat.includes('gun') || cat.includes('weapon'))
    return 'Sniper';
  if (cat.includes('heart') || cat.includes('love'))
    return 'Love Name';
  if (cat.includes('line') || cat.includes('underline') ||
      cat.includes('strikethrough')) return 'Stylish Text';
  if (cat.includes('mood') || cat.includes('kaomoji'))
    return 'Gamer Name';
  if (cat.includes('russian') || cat.includes('cyrillic') ||
      cat.includes('slavic')) return 'Your Name';
  if (cat.includes('squiggle') || cat.includes('wave'))
    return 'Wavy Text';
  if (cat.includes('star')) return 'Star Name';
  if (cat.includes('ugly') || cat.includes('zalgo') ||
      cat.includes('chaos')) return 'Zalgo Text';

  // Match by style name keywords as fallback
  if (name.includes('fire') || name.includes('blaze'))
    return 'Free Fire';
  if (name.includes('king') || name.includes('crown') ||
      name.includes('royal')) return 'King Name';
  if (name.includes('cute') || name.includes('kawaii') ||
      name.includes('fluffy')) return 'Kawaii Name';

  return 'Stylish Name';
}

const state = { text: '' };

// Row cache — built once at boot, never re-queried
let ROW_CACHE = null;

function buildRowCache() {
  ROW_CACHE = Array.from(
    document.querySelectorAll('.font-row')
  ).map((row, ord) => {
    row.dataset.ord = ord;
    const styleName = row.getAttribute('data-style-name') || '';
    const style = findStyle(styleName) || null;
    const sample = row.querySelector('.font-sample') || null;
    return { row, style, sample, ord };
  });
}

let rafPending = false;

function updateAllRows() {
  if (rafPending) return;
  rafPending = true;

  requestAnimationFrame(() => {
    rafPending = false;
    if (!ROW_CACHE) return;

    const text = state.text;
    const CHUNK = 20;
    let idx = 0;

    function processChunk() {
      const end = Math.min(idx + CHUNK, ROW_CACHE.length);
      for (; idx < end; idx++) {
        const { row, style, sample } = ROW_CACHE[idx];
        if (!style || !sample) continue;
        if (row.classList.contains('lazy-pending')) continue;
        const bump = Number(row.dataset.bump) || 0;
        const renderText = (text && text.trim()) ? text : getDefaultText(style);
        sample.textContent = styleOutput(style, renderText, bump, idx);
      }
      if (idx < ROW_CACHE.length) {
        requestAnimationFrame(processChunk);
      }
    }

    processChunk();
  });
}

/* ------------------ Interactions ------------------ */
let stickyInput = null;

function syncInputs(v) {
  if (DOM.desktopInput && DOM.desktopInput.value !== v) DOM.desktopInput.value = v;
  if (DOM.mobileInput && DOM.mobileInput.value !== v) DOM.mobileInput.value = v;
  if (stickyInput && stickyInput.value !== v) stickyInput.value = v;
}

const handleInput = debounce((src) => {
  state.text = src.value;
  syncInputs(state.text);
  updateAllRows();

  // Update frame previews live without full rebuild
  const frameRow = document.getElementById('frameRow');
  if (frameRow) {
    const displayText = state.text.trim() || getFrameDisplayText();
    frameRow.querySelectorAll('.hot-card').forEach((card, i) => {
      const tpl = hotTemplates[i] || card.dataset.template;
      const preview = card.querySelector('.hot-preview');
      if (preview && tpl) preview.textContent = applyFrame(tpl, displayText);
    });
  }
}, 140);

DOM.desktopInput?.addEventListener("input", () => handleInput(DOM.desktopInput));
DOM.mobileInput?.addEventListener("input", () => handleInput(DOM.mobileInput));
DOM.stickyInput?.addEventListener("input", () => handleInput(DOM.stickyInput));

// Font size slider — CSS variable approach beats !important
DOM.fontSizeSlider?.addEventListener("input", (e) => {
  document.documentElement.style.setProperty('--font-sample-size', e.target.value + 'px');
});

// Touch-optimised slider for mobile
let sliderRect = null;
const sliderMin = 14;
const sliderMax = 48;
let sliderRafPending = false;

DOM.fontSizeSlider?.addEventListener("touchstart", (e) => {
  e.stopPropagation();
  sliderRect = DOM.fontSizeSlider.getBoundingClientRect();
}, { passive: true });

DOM.fontSizeSlider?.addEventListener("touchmove", (e) => {
  if (!sliderRect || sliderRafPending) return;
  sliderRafPending = true;
  const touch = e.touches[0];
  requestAnimationFrame(() => {
    sliderRafPending = false;
    if (!sliderRect) return;
    const ratio = Math.min(Math.max((touch.clientX - sliderRect.left) / sliderRect.width, 0), 1);
    const value = Math.round(sliderMin + ratio * (sliderMax - sliderMin));
    DOM.fontSizeSlider.value = value;
    document.documentElement.style.setProperty('--font-sample-size', value + 'px');
  });
}, { passive: true });

DOM.fontSizeSlider?.addEventListener("touchend", () => {
  sliderRect = null;
}, { passive: true });

// Font card click delegation — copy on row click, remix on remix btn
DOM.cardsRoot?.addEventListener('click', e => {
  const row = e.target.closest('.font-row');
  if (!row) return;

  const sample = row.querySelector('.font-sample');
  if (!sample) return;

  // ── REMIX ────────────────────────────────────────────

  // ── COPY (whole row click) ────────────────────────────
  const text = sample.textContent || '';

  function showRowCopied() {
    row.classList.add('row-copied');
    toast('Copied!');
    setTimeout(() => row.classList.remove('row-copied'), 900);
  }

  function legacyRowCopy(str) {
    const ta = document.createElement('textarea');
    ta.value = str;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (err) { }
    document.body.removeChild(ta);
    showRowCopied();
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showRowCopied).catch(() => legacyRowCopy(text));
  } else {
    legacyRowCopy(text);
  }
});

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); toast('Copied!'); } catch (e) { }
  document.body.removeChild(ta);
}

// Remix All
function remixAll() {
  GLOBAL_SEED = (GLOBAL_SEED + Math.floor(Math.random() * 10000) + 1) >>> 0;
  updateAllRows();
  toast("Regenerated");
}
DOM.remixAllBtn?.addEventListener("click", remixAll);
DOM.remixAllBtnMobile?.addEventListener("click", remixAll);
DOM.remixStickyBtn?.addEventListener("click", remixAll);

// Clear
function clearAll() {
  state.text = "";
  syncInputs("");
  updateAllRows();
}
DOM.clearBtn?.addEventListener("click", clearAll);
DOM.clearBtnMobile?.addEventListener("click", clearAll);

/* ------------------ Deal New Styles ------------------ */

function initFloatingButtons() {
  const floatBtns = document.getElementById('floatBtns');
  const scrollTopBtn = document.getElementById('floatScrollTop');
  const rerollBtn = document.getElementById('btnShuffle');
  const heroEl = document.querySelector('section.hero');

  if (!floatBtns || !heroEl) return;

  const obs = new IntersectionObserver(([entry]) => {
    floatBtns.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0 });
  obs.observe(heroEl);

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (rerollBtn) {
    rerollBtn.addEventListener('click', () => {
      rerollBtn.classList.add('spinning');
      setTimeout(() => rerollBtn.classList.remove('spinning'), 500);
      remixAll();
    });
  }
}

/* ------------------ Boot ------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const initial = DOM.desktopInput?.value ||
  DOM.mobileInput?.value || '';
  state.text = initial;
  // Do NOT call updateAllRows here —
  // lazy loading handles initial render
  // with getDefaultText per category
  syncInputs(initial);

  // STICKY BAR
  const stickyBar = document.getElementById('stickyBar');
  stickyInput = document.getElementById('sticky-input');
  const stickyGenBtn = document.getElementById('btnStickyGenerate');
  const heroEl = document.querySelector('section.hero');

  if (heroEl) {
    const heroObs = new IntersectionObserver(([entry]) => {
      if (stickyBar) stickyBar.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0, rootMargin: '0px' });
    heroObs.observe(heroEl);
  }

  if (stickyInput) {
    stickyInput.addEventListener('input', () => {
      if (DOM.desktopInput) DOM.desktopInput.value = stickyInput.value;
      if (DOM.mobileInput) DOM.mobileInput.value = stickyInput.value;
      handleInput(DOM.desktopInput || DOM.mobileInput);
    });
  }

  if (stickyGenBtn) {
    stickyGenBtn.addEventListener('click', () => {
      if (stickyInput && DOM.desktopInput) DOM.desktopInput.value = stickyInput.value;
      remixAll();
    });
  }

  // MOBILE BOTTOM BAR
  const mobileBottomInput = document.getElementById('input-text-mobile-bottom');
  const mobileClearBtn = document.getElementById('btnMobileClear');
  const mobileGenerateBtn = document.getElementById('btnMobileGenerate');

  if (mobileBottomInput) {
    mobileBottomInput.addEventListener('input', () => {
      state.text = mobileBottomInput.value;
      syncInputs(mobileBottomInput.value);
      updateAllRows();
    });
  }

  if (mobileClearBtn) {
    mobileClearBtn.addEventListener('click', () => {
      state.text = '';
      if (mobileBottomInput) mobileBottomInput.value = '';
      syncInputs('');
      updateAllRows();
    });
  }

  if (mobileGenerateBtn) {
    mobileGenerateBtn.addEventListener('click', () => {
      if (mobileBottomInput) {
        state.text = mobileBottomInput.value;
        syncInputs(state.text);
      }
      remixAll();
    });
  }

  if (DOM.desktopInput && mobileBottomInput) {
    DOM.desktopInput.addEventListener('input', () => {
      if (mobileBottomInput.value !== DOM.desktopInput.value) {
        mobileBottomInput.value = DOM.desktopInput.value;
      }
    });
  }

  // LAZY LOADING
  document.querySelectorAll('.font-row').forEach(row => row.classList.add('lazy-pending'));
  buildRowCache();

  initFloatingButtons();

  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const rows = card.querySelectorAll('.font-row.lazy-pending');
      if (!rows.length) { lazyObserver.unobserve(card); return; }

      requestAnimationFrame(() => {
        rows.forEach(row => {
          const styleName = row.dataset.styleName;
          if (!styleName) return;
          const style = findStyle(styleName);
          if (!style) {
            // Style not loaded yet — mark for re-render
            // when fonts-extra.js loads
            row.dataset.needsRender = 'true';
            row.classList.add('lazy-pending');
            return;
          }
          row.dataset.needsRender = 'false';
          const sample = row.querySelector('.font-sample');
          if (!sample) return;
          const ord = Number(row.dataset.ord || 0);
          const bump = Number(row.dataset.bump) || 0;
          const lazyText = state.text && state.text.trim() ? state.text.trim() : getDefaultText(style);
    const safelazyText = lazyText && lazyText.trim() ? lazyText : 'Stylish Name';
    sample.textContent = styleOutput(style, safelazyText, bump, ord);
          row.classList.remove('lazy-pending');
        });
      });

      lazyObserver.unobserve(card);
    });
  }, { rootMargin: '200px 0px', threshold: 0 });

  document.querySelectorAll('.font-card').forEach(card => lazyObserver.observe(card));

  // Lazy load fonts-extra.js when user reaches card 7+
  let extraFontsLoaded = false;
  const extraCards = Array.from(
    document.querySelectorAll('.font-card')
  ).slice(6);

  const extraFontsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || extraFontsLoaded) return;
      extraFontsLoaded = true;
      extraFontsObserver.disconnect();

      const script = document.createElement('script');
      script.src = 'fonts-extra.js';
      window._onExtraStylesLoaded = () => {
  // Merge new styles into ALL_STYLES and STYLE_MAP
  const RAW_EXTRA = Array.isArray(window.FONT_STYLES)
    ? window.FONT_STYLES : [];
  const RAW_WIN = Array.isArray(window.styles)
    ? window.styles : [];

  const merged = dedupeStyles([
    ...ALL_STYLES,
    ...RAW_WIN,
    ...RAW_EXTRA
  ]);

  merged.forEach(s => {
    STYLE_MAP.set((s.name || '').trim().toLowerCase(), s);
  });
  ALL_STYLES = merged;

  // First pass — target rows that explicitly need render
  const needsRender = document.querySelectorAll(
    '.font-row[data-needs-render="true"]'
  );
  needsRender.forEach((row, i) => {
    const styleName = row.getAttribute('data-style-name') || '';
    if (!styleName) return;
    const style = STYLE_MAP.get(styleName.trim().toLowerCase());
    if (!style) return;
    const sample = row.querySelector('.font-sample');
    if (!sample) return;
    const ord = Number(row.dataset.ord || 0);
    const bump = Number(row.dataset.bump) || 0;
    const lazyText = state.text && state.text.trim() ? state.text.trim() : getDefaultText(style);
    const safelazyText = lazyText && lazyText.trim() ? lazyText : 'Stylish Name';
    sample.textContent = styleOutput(style, safelazyText, bump, ord);
    row.classList.remove('lazy-pending');
    row.dataset.needsRender = 'false';
  });

  // Re-render EVERY row — not just visible ones
  // This fixes rows that lazy-loaded before fonts-extra
  // was ready and got plain text fallback
  const allRows = document.querySelectorAll('.font-row');
  allRows.forEach((row, i) => {
    const styleName = row.getAttribute('data-style-name') || '';
    if (!styleName) return;
    const style = STYLE_MAP.get(styleName.trim().toLowerCase());
    if (!style) return;
    const sample = row.querySelector('.font-sample');
    if (!sample) return;
    const ord = Number(row.dataset.ord || i);
    const bump = Number(row.dataset.bump) || 0;
    // Only re-render if still showing plain/fallback text
    // or if style was previously null
    const lazyText = state.text && state.text.trim() ? state.text.trim() : getDefaultText(style);
    const safelazyText = lazyText && lazyText.trim() ? lazyText : 'Stylish Name';
    sample.textContent = styleOutput(style, safelazyText, bump, ord);
    row.classList.remove('lazy-pending');
  });

  // Rebuild cache and update all
  buildRowCache();
  OUTPUT_CACHE.clear();
  updateAllRows();
};
      document.head.appendChild(script);
    });
  }, { rootMargin: '1200px 0px', threshold: 0 });

  extraCards.forEach(card => extraFontsObserver.observe(card));

  // Boot frames
  renderHotNow(true);
});

(function() {
  var siteURL = 'https://aifontsgenerator.com';
  var lastCopiedText = '';

  // Track last copied text from font rows
  document.addEventListener('click', function(e) {
    var row = e.target.closest('.font-row');
    if (row) {
      var sample = row.querySelector('.font-sample');
      if (sample) lastCopiedText = sample.textContent.trim();
    }
  });

  function getShareText() {
    var text = lastCopiedText || 'Check out AI Fonts Generator';
    return text + ' — ' + siteURL;
  }

  function flashCopied(btn) {
    btn.classList.add('copied');
    setTimeout(function() { btn.classList.remove('copied'); }, 1500);
  }

  // WHATSAPP
  var wa = document.getElementById('shareWhatsApp');
  if (wa) wa.addEventListener('click', function() {
    var msg = encodeURIComponent(getShareText());
    window.open('https://wa.me/?text=' + msg, '_blank');
    flashCopied(wa);
  });

  // INSTAGRAM — no direct share API, copy to clipboard instead
  var ig = document.getElementById('shareInstagram');
  if (ig) ig.addEventListener('click', function() {
    navigator.clipboard.writeText(getShareText()).then(function() {
      flashCopied(ig);
      alert('Copied! Paste it into your Instagram bio or story.');
    });
  });

  // DISCORD — copy to clipboard
  var dc = document.getElementById('shareDiscord');
  if (dc) dc.addEventListener('click', function() {
    navigator.clipboard.writeText(getShareText()).then(function() {
      flashCopied(dc);
      alert('Copied! Paste it into Discord.');
    });
  });

  // TIKTOK — copy to clipboard
  var tt = document.getElementById('shareTikTok');
  if (tt) tt.addEventListener('click', function() {
    navigator.clipboard.writeText(getShareText()).then(function() {
      flashCopied(tt);
      alert('Copied! Paste it into your TikTok bio.');
    });
  });

  // GAMING — copy styled text only (no site URL)
  var gm = document.getElementById('shareGaming');
  if (gm) gm.addEventListener('click', function() {
    var text = lastCopiedText || 'AI Fonts Generator — aifontsgenerator.com';
    navigator.clipboard.writeText(text).then(function() {
      flashCopied(gm);
      alert('Copied! Paste it into your game name field.');
    });
  });

})();

(function() {
  var siteURL = 'https://aifontsgenerator.com';
  var copiedStyles = [];

  function buildChallengeMessage() {
    var lines = ['⚔️ FONT BATTLE — Can you beat this?\n'];
    copiedStyles.forEach(function(s) { lines.push(s); });
    lines.push('\nPick YOUR best font style 👇');
    lines.push(siteURL);
    lines.push('#FontBattle');
    return lines.join('\n');
  }

  function flashBtn(btn) {
    btn.style.borderColor = '#C4A052';
    btn.style.color = '#C4A052';
    setTimeout(function() {
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 1200);
  }

  // Track font row copies
  document.addEventListener('click', function(e) {
    var row = e.target.closest('.font-row');
    if (!row) return;
    var sample = row.querySelector('.font-sample');
    if (!sample) return;
    var text = sample.textContent.trim();
    if (!text || copiedStyles.indexOf(text) !== -1) return;
    copiedStyles.push(text);

    var floatBtn = document.getElementById('challengeFloat');
    if (floatBtn) {
      floatBtn.style.display = 'block';
      setTimeout(function() { floatBtn.classList.add('show'); }, 10);
    }
  });

  // Challenge float button click
  var challengeFloat = document.getElementById('challengeFloat');
  if (challengeFloat) {
    challengeFloat.addEventListener('click', function() {
      startBattleSequence();
    });
  }

  function startBattleSequence() {
    var overlay = document.getElementById('challengeOverlay');
    var swordL = document.getElementById('swordL');
    var swordR = document.getElementById('swordR');
    var burst = document.getElementById('clashBurst');
    var card = document.getElementById('battleCard');
    var preview = document.getElementById('battleStylesPreview');

    // Reset card
    card.classList.remove('visible');
    preview.innerHTML = '';

    overlay.classList.add('active');

    // Swords fly in
    setTimeout(function() {
      swordL.style.transition = 'all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)';
      swordL.style.opacity = '1';
      swordL.style.transform = 'rotate(-45deg) translateX(0)';
      swordR.style.transition = 'all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)';
      swordR.style.opacity = '1';
      swordR.style.transform = 'rotate(135deg) translateX(0)';
    }, 80);

    // Clash burst + screen flash
    setTimeout(function() {
      burst.style.opacity = '1';
      var sparks = burst.querySelectorAll('.clash-spark');
      sparks.forEach(function(s, i) {
        s.style.transition = 'opacity 0.1s, transform 0.3s ease';
        s.style.opacity = '1';
        var rad = (i * 45) * Math.PI / 180;
        var tx = Math.sin(rad) * 36;
        var ty = -Math.cos(rad) * 36;
        s.style.transform = 'translate(' + tx + 'px,' + ty + 'px) rotate(' + (i*45) + 'deg)';
      });
      document.body.style.transition = 'background 0.05s';
      document.body.style.background = '#1a1400';
      setTimeout(function() { document.body.style.background = ''; }, 90);
    }, 400);

    // Swords + burst fade
    setTimeout(function() {
      swordL.style.transition = 'opacity 0.2s';
      swordR.style.transition = 'opacity 0.2s';
      swordL.style.opacity = '0';
      swordR.style.opacity = '0';
      burst.style.opacity = '0';
      // Reset sword positions for next time
      setTimeout(function() {
        swordL.style.transition = 'none';
        swordR.style.transition = 'none';
        swordL.style.transform = 'rotate(-45deg) translateX(-160px)';
        swordR.style.transform = 'rotate(135deg) translateX(160px)';
      }, 250);
    }, 660);

    // Card slides in
    setTimeout(function() {
      card.classList.add('visible');
    }, 760);

    // Style rows appear one by one (max 4 shown)
    var displayStyles = copiedStyles.slice(-4);
    displayStyles.forEach(function(style, i) {
      setTimeout(function() {
        var row = document.createElement('div');
        row.className = 'battle-style-row';
        row.textContent = style;
        preview.appendChild(row);
        setTimeout(function() { row.classList.add('appear'); }, 30);
      }, 980 + (i * 150));
    });
  }

  // Platform share buttons
  document.getElementById('battleWhatsApp').addEventListener('click', function() {
    window.open('https://wa.me/?text=' + encodeURIComponent(buildChallengeMessage()), '_blank');
    flashBtn(this);
  });
  document.getElementById('battleDiscord').addEventListener('click', function() {
    navigator.clipboard.writeText(buildChallengeMessage()).then(function() {
      alert('Copied! Paste into Discord.');
    });
    flashBtn(document.getElementById('battleDiscord'));
  });
  document.getElementById('battleTikTok').addEventListener('click', function() {
    navigator.clipboard.writeText(buildChallengeMessage()).then(function() {
      alert('Copied! Paste into TikTok.');
    });
    flashBtn(document.getElementById('battleTikTok'));
  });
  document.getElementById('battleInsta').addEventListener('click', function() {
    navigator.clipboard.writeText(buildChallengeMessage()).then(function() {
      alert('Copied! Paste into Instagram.');
    });
    flashBtn(document.getElementById('battleInsta'));
  });

  // Close button
  document.getElementById('battleCloseBtn').addEventListener('click', function() {
    document.getElementById('challengeOverlay').classList.remove('active');
    document.getElementById('battleCard').classList.remove('visible');
  });

  // Close on overlay click outside card
  document.getElementById('challengeOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
      document.getElementById('battleCard').classList.remove('visible');
    }
  });

})();
