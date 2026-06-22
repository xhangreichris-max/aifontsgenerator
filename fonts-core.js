/**
 * =================================================================
 * FONTIFIER FONTS DATABASE (fonts.js)
 * =================================================================
 * Unicode-safe helpers + style definitions + 40 Remix styles (20 original + 20 fusion)
 * Exposed as: window.applyMap, window.applyCombining, window.styles
 * =================================================================
 */

/* ─────────────────────────────────────────────────────────────────────────
   AUTHORIZED-HOST GATE  (owner maintenance note)
   ──────────────────────────────────────────────────────────────────────────
   The remix transform functions in this file only produce styled output
   when served from an authorized domain. On any other host they return the
   original unmodified text, silently — no errors thrown.

   Authorized hosts:
     aifontsgenerator.com  |  www.aifontsgenerator.com
     localhost              |  127.0.0.1   (local dev always works)

   To add a domain: update the _ah array immediately below.
   The _ga boolean is evaluated once at parse time and reused per call.
   ─────────────────────────────────────────────────────────────────────────*/
const _ah = ['aifontsgenerator.com', 'www.aifontsgenerator.com', 'localhost', '127.0.0.1'];
const _hv = (function() {
  try { return (typeof location !== 'undefined' && location.hostname) || ''; } catch(e) { return ''; }
})();
const _ga = _ah.indexOf(_hv) !== -1;

/* ------------------ Unicode-safe helpers ------------------ */

// Grapheme splitter (emoji-safe). Uses Intl.Segmenter if available.
function toGraphemes(str) {
  if (!str) return [];
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(seg.segment(str), s => s.segment);
  }
  // Fallback: Array.from handles code points (better than split(''))
  return Array.from(str);
}

// A–Z / digits? (decorate only these; leave emojis/symbols alone)
function isLetterOrDigit(ch) {
  return /\p{L}|\p{Nd}/u.test(ch);
}

// Map text using a map (don’t break emojis, keep case fallbacks)
function applyMap(text, map) {
  const parts = toGraphemes(text || '');
  let out = '';
  for (const ch of parts) {
    out += map[ch] ??
           (ch && map[ch.toLowerCase?.()]) ??
           (ch && map[ch.toUpperCase?.()]) ??
           ch;
  }
  return out.normalize('NFC');
}

// Apply combining marks **only** on letters/digits; leave emojis intact.
function applyCombining(text, marks, min = 1, max = 2) {
  const parts = toGraphemes(text || '');
  let out = '';
  for (const ch of parts) {
    if (!isLetterOrDigit(ch)) { out += ch; continue; }
    let c = ch;
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    for (let i = 0; i < n; i++) {
      c += marks[Math.floor(Math.random() * marks.length)];
    }
    out += c;
  }
  return out.normalize('NFC');
}

// Small utilities used by Remix styles
function thinSpace(s) { return '\u2009' + s + '\u2009'; }
function sanitizeVisible(s) {
  if (!s) return s;
  // strip controls + zero-width joiners (keep thin space we add)
  s = s.replace(/[\u0000-\u001F\u007F-\u009F\u200B\u200C\u200D]/g, '');
  // clamp absurd combining stacks
  s = s.replace(/([\u0300-\u036F]{3,})/g, m => m.slice(0, 2));
  if (s.length > 256) s = s.slice(0, 256);
  return s.normalize('NFC');
}

/* =========================================================
   Remix Builder: Base Alphabets + Style Composer
   ========================================================= */

// Base Alphabets (A–Z / a–z)
const BASES = {
  SCRIPT: {
    U: {A:'𝓐',B:'𝓑',C:'𝓒',D:'𝓓',E:'𝓔',F:'𝓕',G:'𝓖',H:'𝓗',I:'𝓘',J:'𝓙',K:'𝓚',L:'𝓛',M:'𝓜',N:'𝓝',O:'𝓞',P:'𝓟',Q:'𝓠',R:'𝓡',S:'𝓢',T:'𝓣',U:'𝓤',V:'𝓥',W:'𝓦',X:'𝓧',Y:'𝓨',Z:'𝓩'},
    L: {a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃'}
  },
  FRAKTUR: {
    U: {A:'𝔄',B:'𝔅',C:'ℭ',D:'𝔇',E:'𝔈',F:'𝔉',G:'𝔊',H:'ℌ',I:'ℑ',J:'𝔍',K:'𝔎',L:'𝔏',M:'𝔐',N:'𝔑',O:'𝒪',P:'𝔓',Q:'𝔔',R:'ℜ',S:'𝔖',T:'𝔗',U:'𝔘',V:'𝔙',W:'𝔚',X:'𝔛',Y:'𝔜',Z:'ℨ'},
    L: {a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷'}
  },
  DOUBLE: {
    U: {A:'𝔸',B:'𝔹',C:'ℂ',D:'𝔻',E:'𝔼',F:'𝔽',G:'𝔾',H:'ℍ',I:'𝕀',J:'𝕁',K:'𝕂',L:'𝕃',M:'𝕄',N:'ℕ',O:'𝕆',P:'ℙ',Q:'ℚ',R:'ℝ',S:'𝕊',T:'𝕋',U:'𝕌',V:'𝕍',W:'𝕎',X:'𝕏',Y:'𝕐',Z:'ℤ'},
    L: {a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫'}
  },
  MONO: {
    U: {A:'𝙰',B:'𝙱',C:'𝙲',D:'𝙳',E:'𝙴',F:'𝙵',G:'𝙶',H:'𝙷',I:'𝙸',J:'𝙹',K:'𝙺',L:'𝙻',M:'𝙼',N:'𝙽',O:'𝙾',P:'𝙿',Q:'𝚀',R:'𝚁',S:'𝚂',T:'𝚃',U:'𝚄',V:'𝚅',W:'𝚆',X:'𝚇',Y:'𝚈',Z:'𝚉'},
    L: {a:'𝚊',b:'𝚋',c:'𝚌',d:'𝚍',e:'𝚎',f:'𝚏',g:'𝚐',h:'𝚑',i:'𝚒',j:'𝚓',k:'𝚔',l:'𝚕',m:'𝚖',n:'𝚗',o:'𝚘',p:'𝚙',q:'𝚚',r:'𝚛',s:'𝚜',t:'𝚝',u:'𝚞',v:'𝚟',w:'𝚠',x:'𝚡',y:'𝚢',z:'𝚣'}
  },
  FULL: {
    U: {A:'Ａ',B:'Ｂ',C:'Ｃ',D:'Ｄ',E:'Ｅ',F:'Ｆ',G:'Ｇ',H:'Ｈ',I:'Ｉ',J:'Ｊ',K:'Ｋ',L:'Ｌ',M:'Ｍ',N:'Ｎ',O:'Ｏ',P:'Ｐ',Q:'Ｑ',R:'Ｒ',S:'Ｓ',T:'Ｔ',U:'Ｕ',V:'Ｖ',W:'Ｗ',X:'Ｘ',Y:'Ｙ',Z:'Ｚ'},
    L: {a:'ａ',b:'ｂ',c:'ｃ',d:'ｄ',e:'ｅ',f:'ｆ',g:'ｇ',h:'ｈ',i:'ｉ',j:'ｊ',k:'ｋ',l:'ｌ',m:'ｍ',n:'ｎ',o:'ｏ',p:'ｐ',q:'ｑ',r:'ｒ',s:'ｓ',t:'ｔ',u:'ｕ',v:'ｖ',w:'ｗ',x:'ｘ',y:'ｙ',z:'ｚ'}
  }
};

// Compose a full 52-letter map from chosen bases + overrides
function composeMap({ upperBase = 'SCRIPT', lowerBase = 'SCRIPT', overrides = {} }) {
  const U = {...BASES[upperBase].U};
  const L = {...BASES[lowerBase].L};
  return {...U, ...L, ...overrides};
}

// Build a Remix style object
function makeRemixStyle({
  name, category = 'Creative & Mixed Styles',
  frame = { pre:'', post:'' },
  bases = { upper:'SCRIPT', lower:'SCRIPT' },
  overrides = {},
  palette = [],
  micro = {}
}) {
  const map = composeMap({ upperBase: bases.upper, lowerBase: bases.lower, overrides });
  return {
    name, category, map,
    transform(text) {
      if (!text) return text;
      if (!_ga) return text;

      // 1) Base mapping
      let core = applyMap(text, map);

      // 2) Micro tweaks only on letters/digits
      const grams = toGraphemes(core).map(ch => {
        let t = ch;
        if (isLetterOrDigit(ch)) {
          if (micro.dotVowels && /[AEIOUaeiou𝓪𝓮𝓲𝓸𝓾]/u.test(ch) && Math.random() < 0.12) t += '\u0307'; // dot above
          if (micro.underline && Math.random() < 0.08) t += '\u0332'; // underline
          if (micro.altI && /[iI𝓲]/u.test(ch) && Math.random() < 0.30) t = 'ı'; // dotless i
          if (micro.tilde && Math.random() < 0.08) t += '\u0303';
          if (micro.slash && Math.random() < 0.06) t += '\u0335';
        }
        return t;
      });

      core = grams.join('');
      core = sanitizeVisible(core);

      // 3) Tasteful symbol insertion
      if (micro.allowSymbol !== false && (micro.symbolChance ?? 0.6) > Math.random() && Array.isArray(palette) && palette.length) {
        const sym = palette[Math.floor(Math.random() * palette.length)];
        const byWord = core.split(/\b/);
        if (byWord.length > 2) {
          byWord.splice(Math.floor(byWord.length / 2), 0, thinSpace(sym));
          core = byWord.join('');
        } else {
          core = sym + thinSpace(core) + sym;
        }
      }

      core = core.normalize('NFC');
      return (frame.pre || '') + thinSpace(core) + (frame.post || '');
    },
    tags: ['unique','remix','readable']
  };
}

/* =========================================================
   Your custom maps (from your previous file)
   ========================================================= */

const glitchHopMap = {
  'A': 'A', 'B': '🅑', 'C': 'C', 'D': 'Ꮄ', 'E': '𝙀', 'F': 'F', 'G': '𝓖', 'H': 'H\u0336',
  'I': '🇮', 'J': 'ʝ', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': '𝙾', 'P': 'ｱ',
  'Q': 'Q', 'R': 'Ɽ', 'S': '丂', 'T': '𝒯', 'U': 'U', 'V': 'ᐯ', 'W': '🇼', 'X': 'א',
  'Y': '░Y░', 'Z': '𝚉'
};

const bracketMixMap = {
  'A': '𝘼', 'B': '⦑B⦒', 'C': 'C', 'D': '𝘿', 'E': '𝘌', 'F': '𝙵', 'G': 'ᧁ', 'H': '🅷',
  'I': 'ⓘ', 'J': '🄹', 'K': '𝔎', 'L': 'ㄥ', 'M': 'M', 'N': 'ℕ', 'O': 'օ', 'P': 'P⃝',
  'Q': 'ᑫ', 'R': '𝑅', 'S': '𝕊', 'T': 'T', 'U': '𝐔', 'V': 'V\u0336', 'W': 'ฬ', 'X': '⦑X⦒',
  'Y': 'Y', 'Z': '⦑Z⦒'
};

const cursedScriptMap = {
  'A': 'A\u0337', 'B': 'B⃝', 'C': 'ƈ', 'D': 'ɖ', 'E': '𝐄', 'F': 'F\u0336', 'G': 'G', 'H': '𝘏',
  'I': 'i', 'J': 'J', 'K': '𝒦', 'L': 'ⓛ', 'M': 'Ｍ', 'N': 'N', 'O': 'ₒ', 'P': '🄿',
  'Q': 'ᕴ', 'R': 'R\u0337', 'S': '⦑S⦒', 'T': 'T\u0337', 'U': '🆄', 'V': 'V', 'W': 'ω',
  'X': 'x', 'Y': '¥', 'Z': 'Z'
};

const digitalDecayMap = {
  'A': 'A\u0336', 'B': 'ᗷ', 'C': 'ᄃ', 'D': '░D░', 'E': '乇', 'F': 'ᠻ', 'G': '🇬', 'H': 'H',
  'I': '𝐼', 'J': 'ʝ', 'K': 'K⃝', 'L': 'ℓ', 'M': 'M', 'N': 'ℕ', 'O': 'ට', 'P': '⦏P̂⦎',
  'Q': 'Q\u0336', 'R': '⦑R⦒', 'S': '🅂', 'T': 'Ꮦ', 'U': '𝘜', 'V': '۷', 'W': '᭙',
  'X': '𝓧', 'Y': 'Ꭹ', 'Z': 'Z\u0334'
};

const royalMixMap = {
  'A': 'ค', 'B': 'ᴮ', 'C': '匚', 'D': 'D⃝', 'E': '𝙴', 'F': '£', 'G': 'Ⓖ', 'H': 'Ή',
  'I': 'ℑ', 'J': 'ᒚ', 'K': '𝙺', 'L': '𝙻', 'M': '🄼', 'N': '𝔑', 'O': 'O', 'P': 'Ꭾ',
  'Q': 'Q\u0337', 'R': 'r', 'S': '░S░', 'T': '𝕋', 'U': '⦑U⦒', 'V': 'V\u0334', 'W': 'W\u0336',
  'X': '⫸⫷', 'Y': 'у', 'Z': '𝒵'
};

const elegantGlitchMap = {
  'A': 'ǟ', 'B': 'B', 'C': '𝙲', 'D': 'D', 'E': '𝘌', 'F': '⦑F⦒', 'G': 'G\u0334', 'H': '░H░',
  'I': '𝕀', 'J': '🇯', 'K': '𝐊', 'L': 'ⓛ', 'M': '𝕄', 'N': 'ᘉ', 'O': '𝓞', 'P': 'ᑭ',
  'Q': '𝐐', 'R': '᥅', 'S': 'Ｓ', 'T': 'T', 'U': 'ᵁ', 'V': '⦏V̂⦎', 'W': '𝓦',
  'X': '᙭', 'Y': 'Y', 'Z': 'չ'
};

const wierdMap = {
  'A': '𒀀', 'B': '𒁀', 'C': 'ℭ', 'D': '𒁓', 'E': '𝔈', 'F': '𐎣',
  'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𒁇',
  'M': '𐎠', 'N': '㞓', 'O': '𝔒', 'P': '𝔓', 'Q': '𒌒', 'R': 'Я',
  'S': '𒂍', 'T': '𒈦', 'U': '𝔘', 'V': '𐎏', 'W': '𝔚', 'X': '𒉽',
  'Y': '𒌨', 'Z': '𒑣'
};

const decorMap = {
  'A': '₳', 'B': '฿', 'C': '₵', 'D': 'Đ', 'E': 'Ɇ', 'F': '₣',
  'G': '₲', 'H': 'Ⱨ', 'I': 'Ł', 'J': 'J', 'K': '₭', 'L': 'Ⱡ',
  'M': '₥', 'N': '₦', 'O': 'Ø', 'P': '₱', 'Q': 'Q', 'R': 'Ɽ',
  'S': '₴', 'T': '₮', 'U': 'Ʉ', 'V': 'V', 'W': '₩', 'X': 'Ӿ',
  'Y': 'Ɏ', 'Z': 'Ⱬ'
};

const alienMap = {
  'A': 'ꁲ', 'B': 'ꋰ', 'C': 'ꀯ', 'D': 'ꂠ', 'E': 'ꈼ', 'F': 'ꄞ',
  'G': 'ꁅ', 'H': 'ꍩ', 'I': 'ꂑ', 'J': '꒻', 'K': 'ꀗ', 'L': '꒒',
  'M': 'ꂵ', 'N': 'ꋊ', 'O': 'ꂦ', 'P': 'ꉣ', 'Q': 'ꁷ', 'R': 'ꌅ',
  'S': 'ꌚ', 'T': 'ꋖ', 'U': 'ꐇ', 'V': 'ꀰ', 'W': 'ꅏ', 'X': 'ꇒ',
  'Y': 'ꐞ', 'Z': 'ꁴ'
};

const neonMap = {
  'A': 'ᾰ', 'B': '♭', 'C': 'ḉ', 'D': 'ᖱ', 'E': 'ḙ', 'F': 'ḟ',
  'G': '❡', 'H': 'ℏ', 'I': '!', 'J': '♩', 'K': 'к', 'L': 'ℓ',
  'M': 'Պ', 'N': 'ℵ', 'O': '✺', 'P': '℘', 'Q': 'ǭ', 'R': 'Ի',
  'S': 'ṧ', 'T': 'т', 'U': 'ṳ', 'V': 'ṽ', 'W': 'ω', 'X': '✘',
  'Y': '⑂', 'Z': 'ℨ'
};

const coolMap = {
  'A': 'A̷̺͋', 'B': 'Ḃ̵̹', 'C': 'C̶͔͆', 'D': 'D̷͍̊', 'E': 'E̵͎̕', 'F': 'F̸̢͐',
  'G': 'G̸̗̓', 'H': 'Ḩ̵̂', 'I': 'I̴̯̋', 'J': 'J̴̳̅', 'K': 'Ǩ̸͔', 'L': 'L̴̮̿',
  'M': 'M̴̼͐', 'N': 'N̷̺̏', 'O': 'Ó̸̜', 'P': 'P̸̦̈́', 'Q': 'Q̶̬͛', 'R': 'R̴͎͝',
  'S': 'S̷͚̆', 'T': 'Ť̶̳', 'U': 'U̸͉͛', 'V': 'V̴̦͌', 'W': 'W̸̲͠', 'X': 'X̵̼̍',
  'Y': 'Y̶͖̅', 'Z': 'Z̶̥̑'
};

const koolMap = {
  'A': 'Ⱥ', 'B': 'β', 'C': '↻', 'D': 'Ꭰ', 'E': 'Ɛ', 'F': 'Ƒ',
  'G': 'Ɠ', 'H': 'Ƕ', 'I': 'į', 'J': 'ل', 'K': 'Ҡ', 'L': 'Ꝉ',
  'M': 'Ɱ', 'N': 'ហ', 'O': 'ට', 'P': 'φ', 'Q': 'Ҩ', 'R': 'འ',
  'S': 'Ϛ', 'T': 'Ͳ', 'U': 'Ա', 'V': 'Ỽ', 'W': 'చ', 'X': 'ჯ',
  'Y': 'Ӌ', 'Z': 'ɀ'
};

/* =========================================================
   Base styles (your original styles)
   ========================================================= */

const BASE_STYLES = [
  // --- Featured Styles ---
  {
    name: 'Ancient Glyphs',
    category: 'Featured Styles',
    map: { 'A': '𖤬', 'B': 'ꔪ', 'C': 'ꛕ', 'D': '𖤀', 'E': '𖤟', 'F': 'ꘘ', 'G': 'ꚽ', 'H': 'ꛅ', 'I': 'ꛈ', 'J': 'ꚠ', 'K': '𖤰', 'L': 'ꚳ', 'M': '𖢑', 'N': 'ꛘ', 'O': '𖣠', 'P': 'ㄗ', 'Q': 'ꚩ', 'R': '𖦪', 'S': 'ꕷ', 'T': '𖢧', 'U': 'ꚶ', 'V': 'ꚴ', 'W': 'ꛃ', 'X': '𖤗', 'Y': 'ꚲ', 'Z': 'ꛉ' },
    tags: ['exotic', 'gamer', 'safe']
  },
  {
    name: 'Hieroglyphic Mix',
    category: 'Featured Styles',
    map: { 'A': 'ᗋ', 'B': 'ᗾ', 'C': 'ᕩ', 'D': 'ᗥ', 'E': 'ᗴ', 'F': 'Ϝ', 'G': 'G', 'H': 'ꃙ', 'I': 'ꉁ', 'J': 'ꂖ', 'K': 'Ƙ', 'L': 'ᒫ', 'M': 'ꉙ', 'N': 'ꉌ', 'O': 'ꇩ', 'P': 'ᕾ', 'Q': 'ᕴ', 'R': 'ꔶ', 'S': 'ꍛ', 'T': '𐏕', 'U': 'ᕰ', 'V': 'ᘙ', 'W': 'ᘺ', 'X': 'ꇨ', 'Y': 'ꖃ', 'Z': '𑢪' },
    tags: ['exotic', 'gamer', 'safe']
  },
  {
    name:'CJK Radicals',
    category: 'Featured Styles',
    map: { 'A': '鿕', 'a': '𐐨', 'B': '⻖', 'C': 'で', 'D': 'ぬ', 'E': '乲', 'F': '乎', 'G': '⻢', 'H': 'ぜ', 'I': '⻈', 'J': 'ブ', 'K': '⽔', 'L': '乳', 'M': '丛', 'N': '乗', 'O': 'ロ', 'P': '⺺', 'Q': 'ꀹ', 'R': '⺠', 'S': 'ぶ', 'T': '⻱', 'U': 'ひ', 'V': 'ㇾ', 'W': '丗', 'X': '⼢', 'Y': 'ㆩ', 'Z': 'ゑ' },
    tags: ['exotic', 'safe']
  },

  // --- Creative & Mixed Styles ---
  {
    name: 'Cyborg Construct',
    category: 'Creative & Mixed Styles',
    transform: text => {
      const vowels = 'AEIOUaeiou';
      const runicMap = {'A':'ᚨ','B':'ᛒ','C':'ᚲ','D':'ᛞ','E':'ᛖ','F':'ᚠ','G':'ᚷ','H':'ᚺ','I':'ᛁ','J':'ᛃ','K':'ᚲ','L':'ᛚ','M':'ᛗ','N':'ᚾ','O':'ᛟ','P':'ᛈ','Q':'ᛩ','R':'ᚱ','S':'ᛊ','T':'ᛏ','U':'ᚢ','V':'ᚡ','W':'ᚹ','X':'ᛪ','Y':'ᛦ','Z':'ᛉ'};
      const mono = {'a':'𝚊','b':'𝚋','c':'𝚌','d':'𝚍','e':'𝚎','f':'𝚏','g':'𝚐','h':'𝚑','i':'𝚒','j':'𝚓','k':'𝚔','l':'𝚕','m':'𝚖','n':'𝚗','o':'𝚘','p':'𝚙','q':'𝚚','r':'𝚛','s':'𝚜','t':'𝚝','u':'𝚞','v':'𝚟','w':'𝚠','x':'𝚡','y':'𝚢','z':'𝚣','A':'𝙰','B':'𝙱','C':'𝙲','D':'𝙳','E':'𝙴','F':'𝙵','G':'𝙶','H':'𝙷','I':'𝙸','J':'𝙹','K':'𝙺','L':'𝙻','M':'𝙼','N':'𝙽','O':'𝙾','P':'𝙿','Q':'𝚀','R':'𝚁','S':'𝚂','T':'𝚃','U':'𝚄','V':'𝚅','W':'𝚆','X':'𝚇','Y':'𝚈','Z':'𝚉'};
      let res = '';
      for (const ch of toGraphemes(text || '')) res += vowels.includes(ch) ? (runicMap[ch.toUpperCase()] || ch) : (mono[ch] || ch);
      return res.normalize('NFC');
    },
    tags: ['cyber', 'gamer', 'readable', 'safe']
  },
  {
    name: 'Demonic Script',
    category: 'Creative & Mixed Styles',
    transform: text => {
      const marks = ['\u031b', '\u0317', '\u0338', '\u0321', '\u0322'];
      const frak = { 'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱', 'G': '𝕲', 'H': '𝕳', 'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹', 'O': '𝕺', 'P': '𝕻', 'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁', 'W': '𝖂', 'X': '𝖃', 'Y': '𝖄', 'Z': '𝖅', 'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍', 'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕', 'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝', 'y': '𝖞', 'z': '𝖟' };
      let base = applyMap(text, frak), out = '';
      for (const ch of toGraphemes(base)) {
        let t = ch;
        if (ch.trim() !== '' && Math.random() < 0.4 && isLetterOrDigit(ch)) t += marks[Math.floor(Math.random()*marks.length)];
        out += t;
      }
      return out.normalize('NFC');
    },
    tags: ['glitch', 'gamer', 'unreadable']
  },
  {
    name: 'Bubble Pop',
    category: 'Creative & Mixed Styles',
    transform: text => {
      const circ = {'a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'𝓏','A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ'};
      let res = '', i = 0;
      for (const ch of toGraphemes(text || '')) {
        if (ch.trim() === '') { res += ch; continue; }
        res += (i % 2 === 0) ? (circ[ch] || ch) : ch; i++;
      }
      return res.normalize('NFC');
    },
    tags: ['cute', 'aesthetic', 'readable', 'safe']
  },
  {
    name: 'Super/Subscript Mix',
    category: 'Creative & Mixed Styles',
    transform: text => toGraphemes(text || '').map(ch => {
      const r = Math.random();
      if (r < 0.33) return ({'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','q':'۹','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ'})[ch.toLowerCase?.()] || ch;
      if (r < 0.66) return ({'a':'ₐ','b':'♭','c':'꜀','d':'Ꮷ','e':'ₑ','f':'բ','g':'₉','h':'ₕ','i':'ᵢ','j':'ⱼ','k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ','o':'ₒ','p':'ₚ','q':'૧','r':'ᵣ','s':'ₛ','t':'ₜ','u':'ᵤ','v':'ᵥ','w':'w','x':'ₓ','y':'ᵧ','z':'₂'})[ch.toLowerCase?.()] || ch;
      return ch;
    }).join('').normalize('NFC'),
    tags: ['cute', 'small', 'readable']
  },
  {
    name: 'Vaporwave',
    category: 'Creative & Mixed Styles',
    transform: text => applyMap(text, {'a':'ａ','b':'ｂ','c':'ｃ','d':'ｄ','e':'ｅ','f':'ｆ','g':'ｇ','h':'ｈ','i':'ｉ','j':'ｊ','k':'ｋ','l':'ｌ','m':'ｍ','n':'ｎ','o':'ｏ','p':'ｐ','q':'ｑ','r':'ｒ','s':'ｓ','t':'ｔ','u':'ｕ','v':'ｖ','w':'ｗ','x':'ｘ','y':'ｙ','z':'ｚ','A':'Ａ','B':'Ｂ','C':'Ｃ','D':'Ｄ','E':'Ｅ','F':'Ｆ','G':'Ｇ','H':'Ｈ','I':'Ｉ','J':'Ｊ','K':'Ｋ','L':'Ｌ','M':'Ｍ','N':'Ｎ','O':'Ｏ','P':'Ｐ','Q':'Ｑ','R':'Ｒ','S':'Ｓ','T':'Ｔ','U':'Ｕ','V':'Ｖ','W':'Ｗ','X':'Ｘ','Y':'Ｙ','Z':'Ｚ'}).split('').join(' '),
    tags: ['aesthetic', 'wide', 'readable', 'safe']
  },

  // --- Algorithmic & Combining Marks ---
  {
    name: 'Corrupted Glitch',
    category: 'Algorithmic & Combining Marks',
    transform: text => applyCombining(text, [
      '\u030d','\u030e','\u0304','\u0305','\u033f','\u0311','\u0306','\u0310',
      '\u0352','\u0357','\u0358','\u0325','\u0324','\u0323','\u0326','\u032e',
      '\u0330','\u0331','\u0332','\u0333','\u0334','\u0335','\u0336','\u034f',
      '\u035c','\u035d','\u035e','\u035f','\u0360','\u0361','\u0362'
    ], 3, 8),
    tags: ['glitch', 'gamer', 'unreadable']
  },
  {
    name: 'Encased',
    category: 'Algorithmic & Combining Marks',
    transform: text => toGraphemes(text || '').map(ch => (ch.trim() === '' ? ch : (isLetterOrDigit(ch) ? ch + '\u0305\u0332' : ch))).join('').normalize('NFC'),
    tags: ['clean', 'readable']
  },
  {
    name: 'Ethereal Sparkles',
    category: 'Algorithmic & Combining Marks',
    transform: text => {
      const spark = ['\u030a', '\u0359', '\u0307', '\u0323', '\u0358', '\u02da', '\u02d9'];
      let out = '';
      for (const ch of toGraphemes(text || '')) {
        if (ch.trim() === '' || !isLetterOrDigit(ch)) { out += ch; continue; }
        let t = ch;
        if (Math.random() < 0.6) {
          const n = Math.floor(Math.random()*2)+1;
          for (let i=0;i<n;i++) t += spark[Math.floor(Math.random()*spark.length)];
        }
        out += t;
      }
      return out.normalize('NFC');
    },
    tags: ['cute', 'aesthetic']
  },

  // --- Exotic & International Styles ---


  // --- Flourish Decorated ---
  { name: 'Skull & Stars', category: 'Flourish Decorated', transform: text => `꧁༒☠💥✨${applyMap(text, {'a':'𝘢','b':'𝘣','c':'𝘤','d':'𝘥','e':'𝘦','f':'𝘧','g':'𝘨','h':'𝘩','i':'𝘪','j':'𝘫','k':'𝘬','l':'𝘭','m':'𝘮','n':'𝘯','o':'𝘰','p':'𝘱','q':'𝘲','r':'𝘳','s':'𝘴','t':'𝘵','u':'𝘶','v':'𝘷','w':'𝘸','x':'𝘹','y':'𝘺','z':'𝘻','A':'𝘈','B':'𝘉','C':'𝘊','D':'𝘋','E':'𝘌','F':'𝘍','G':'𝘎','H':'𝘏','I':'𝘐','J':'𝘑','K':'𝘒','L':'𝘓','M':'𝘔','N':'𝘕','O':'𝘖','P':'𝘗','Q':'𝘘','R':'𝘙','S':'𝘚','T':'𝘛','U':'𝘜','V':'𝘝','W':'𝘞','X':'𝘟','Y':'𝘠','Z':'𝘡'})}✨💥☠༒꧂`, tags: ['gamer', 'emoji'] },
  { name: 'Heart Wings', category: 'Flourish Decorated', transform: text => `෴❤️෴ ${applyMap(text, {'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'ℯ','f':'𝒻','g':'ℊ','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝓃','o':'ℴ','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏','A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵'})} ෴❤️෴`, tags: ['cute', 'aesthetic', 'emoji'] },
  { name: 'Fire Brackets', category: 'Flourish Decorated', transform: text => `🔥(✖ ${applyMap(text, {'a':'ค','A':'ค','b':'๒','B':'๒','c':'ς','C':'ς','d':'๔','D':'๔','e':'є','E':'є','f':'Ŧ','F':'Ŧ','g':'ﻮ','G':'ﻮ','h':'ђ','H':'ђ','i':'เ','I':'เ','j':'ן','J':'ן','k':'к','K':'к','l':'ɭ','L':'ɭ','m':'๓','M':'๓','n':'ภ','N':'ภ','o':'๏','O':'๏','p':'ק','P':'ק','q':'ợ','Q':'ợ','r':'г','R':'г','s':'ร','S':'ร','t':'Շ','T':'Շ','u':'ย','U':'ย','v':'ש','V':'ש','w':'ฬ','W':'ฬ','x':'א','X':'א','y':'ץ','Y':'ץ','z':'չ','Z':'չ'})} ✖)🔥`, tags: ['gamer', 'emoji'] },
  { name: 'Pastel Hearts', category: 'Flourish Decorated', transform: text => `(◍•ᴗ•◍) ミ💖 ${applyMap(text, {'A':'🄰','B':'🄱','C':'🄲','D':'𝟄','E':'🄴','F':'𝟄','G':'𝖄','H':'🄷','I':'🄸','J':'🄹','K':'🄺','L':'🄻','M':'𝄼','N':'𝟄','O':'𝄾','P':'🄿','Q':'🅀','R':'🅁','S':'🅂','T':'🅃','U':'🅄','V':'🅅','W':'🆆','X':'🅇','Y':'🅈','Z':'🅉'})} 💖彡`, tags: ['cute', 'aesthetic', 'emoji'] },
  { name: 'Heavy Frame', category: 'Flourish Decorated', transform: text => `╔═${'═'.repeat((text||'').length)}═╗\n║  ${text}  ║\n╚═${'═'.repeat((text||'').length)}═╝`, tags: ['clean'] },
  { name: 'Sparkle Throw', category: 'Flourish Decorated', transform: text => `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ${text} ✧ﾟ･:*ヽ(◕ヮ◕ヽ)`, tags: ['cute', 'aesthetic', 'emoji'] },
  {
    name: 'Symbolic Hearts',
    category: 'Flourish Decorated',
    transform: text => {
      const map = { 'a': 'α', 'b': 'в', 'c': '¢', 'd': '∂', 'e': 'є', 'f': 'ƒ', 'g': 'g', 'h': 'н', 'i': 'ι', 'j': 'נ', 'k': 'к', 'l': 'ℓ', 'm': 'м', 'n': 'η', 'o': 'σ', 'p': 'ρ', 'q': 'q', 'r': 'я', 's': 'ѕ', 't': 'т', 'u': 'υ', 'v': 'ν', 'w': 'ω', 'x': 'χ', 'y': 'у', 'z': 'z' };
      const prefix = '♥ﮩ٨ـﮩﮩ٨ـﮩﮩ ';
      const suffix = ' ﮩﮩـ٨ﮩﮩـ٨ﮩ♥';
      return prefix + applyMap(text, map) + suffix;
    },
    tags: ['aesthetic', 'emoji']
  },
  {
    name: 'Eclectic Mix',
    category: 'Flourish Decorated',
    transform: text => {
      const map = { 'A': 'α', 'B': 'ᵇ', 'C': 'ⓒ', 'D': 'Ｄ', 'E': 'Ⓔ', 'F': 'ℱ', 'G': 'Ꮆ', 'H': '卄', 'I': '𝐈', 'J': '𝓳', 'K': '𝕜', 'L': 'Ĺ', 'M': 'Ｍ', 'N': '𝐧', 'O': 'Ỗ', 'P': 'Ƥ', 'Q': 'q', 'R': '𝐫', 'S': '𝓼', 'T': '𝐓', 'U': 'ย', 'V': 'ⓥ', 'W': 'ｗ', 'X': '𝔁', 'Y': '𝐲', 'Z': 'ｚ' };
      const prefix = '`•.,¸¸,.•´¯ ';
      const suffix = ' ¯`•.,¸¸,.•´';
      return prefix + applyMap(text, map) + suffix;
    },
    tags: ['aesthetic']
  },
  {
    name: 'Ornate Emblem',
    category: 'Flourish Decorated',
    transform: text => {
      const map = { 'A': 'ⓐ', 'B': 'в', 'C': '匚', 'D': '∂', 'E': 'ᵉ', 'F': 'Ŧ', 'G': '𝐆', 'H': '𝐡', 'I': 'ι', 'J': '𝐉', 'K': 'Ҝ', 'L': 'ｌ', 'M': 'м', 'N': 'Ⓝ', 'O': 'ㄖ', 'P': 'ρ', 'Q': '𝓺', 'R': '尺', 'S': '𝓼', 'T': 'Ｔ', 'U': 'Ⓤ', 'V': 'ש', 'W': 'ω', 'X': '𝔵', 'Y': 'ｙ', 'Z': 'ž' };
      const prefix = '-·=»‡«=·- ';
      const suffix = ' -·=»‡«=·-';
      return prefix + applyMap(text, map) + suffix;
    },
    tags: ['gamer', 'aesthetic']
  },

  // --- Classic Styles ---
  { name:'Bold', category: 'Classic Styles', map: {'a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷','k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝗦','t':'𝗧','u':'𝗨','v':'𝗩','w':'𝗪','x':'𝗫','y':'𝗬','z':'𝗭','A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭'}, tags: ['bold', 'readable', 'safe'] },
  { name:'Italic', category: 'Classic Styles', map: {'a':'𝘢','b':'𝘣','c':'𝘤','d':'𝘥','e':'𝘦','f':'𝘧','g':'𝘨','h':'𝘩','i':'𝘪','j':'𝘫','k':'𝘬','l':'𝘭','m':'𝘮','n':'𝘯','o':'𝘰','p':'𝘱','q':'𝘲','r':'𝘳','s':'𝘴','t':'𝘵','u':'𝘶','v':'𝘷','w':'𝘸','x':'𝘹','y':'𝘺','z':'𝘻','A':'𝘈','B':'𝘉','C':'𝘊','D':'𝘋','E':'𝘌','F':'𝘍','G':'𝘎','H':'𝘏','I':'𝘐','J':'𝘑','K':'𝘒','L':'𝘓','M':'𝘔','N':'𝘕','O':'𝘖','P':'𝘗','Q':'𝘘','R':'𝘙','S':'𝘚','T':'𝘛','U':'𝘜','V':'𝘝','W':'𝘞','X':'𝘟','Y':'𝘠','Z':'𝘡'}, tags: ['italic', 'readable', 'safe'] },
  { name:'Cursive', category: 'Classic Styles', map: {'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'ℯ','f':'𝒻','g':'ℊ','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝓃','o':'ℴ','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏','A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵'}, tags: ['cursive', 'aesthetic', 'readable', 'safe'] },
  { name:'Double Struck', category: 'Classic Styles', map: {'a':'𝕒','b':'𝕓','c':'𝕔','d':'𝕕','e':'𝕖','f':'𝕗','g':'𝕘','h':'𝕙','i':'𝕚','j':'𝕛','k':'𝕜','l':'𝕝','m':'𝕞','n':'𝕟','o':'𝕠','p':'𝕡','q':'𝑞','r':'𝕣','s':'𝕤','t':'𝕥','u':'𝕦','v':'𝕧','w':'𝕨','x':'𝕩','y':'𝕪','z':'𝕫','A':'𝔸','B':'𝔹','C':'ℂ','D':'𝔻','E':'𝔼','F':'𝔽','G':'𝔾','H':'ℍ','I':'𝕀','J':'𝕁','K':'𝕂','L':'𝕃','M':'𝕄','N':'ℕ','O':'𝕆','P':'ℙ','Q':'ℚ','R':'ℝ','S':'𝕊','T':'𝕋','U':'𝕌','V':'𝕍','W':'𝕎','X':'𝕏','Y':'𝕐','Z':'ℤ'}, tags: ['bold', 'clean', 'readable', 'safe'] },
  { name:'Fraktur', category: 'Classic Styles', map: {'a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧','k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱','u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷','A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'ℌ','I':'ℑ','J':'𝔍','K':'𝔎','L':'𝔏','M':'𝔐','N':'𝔑','O':'𝒪','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'ℨ'}, tags: ['gamer', 'readable'] },
  { name:'Medieval', category: 'Classic Styles', map: {'a':'𝖆','b':'𝖇','c':'𝖈','d':'𝖉','e':'𝖊','f':'𝖋','g':'𝖌','h':'𝖍','i':'𝖎','j':'𝖏','k':'𝖐','l':'𝖑','m':'𝖒','n':'𝖓','o':'𝖔','p':'𝖕','q':'𝖖','r':'𝖗','s':'𝖘','t':'𝖙','u':'𝖚','v':'𝖛','w':'𝖜','x':'𝖝','y':'𝖞','z':'𝖟','A':'𝕬','B':'𝕭','C':'𝕮','D':'𝕯','E':'𝕰','F':'𝕱','G':'𝕲','H':'𝕳','I':'𝕴','J':'𝕵','K':'𝕶','L':'𝕷','M':'𝕸','N':'𝕹','O':'𝕺','P':'𝕻','Q':'𝕼','R':'𝕽','S':'𝕾','T':'𝕿','U':'𝖀','V':'𝖁','W':'𝖂','X':'𝖃','Y':'𝖄','Z':'𝖅'}, tags: ['bold', 'gamer', 'readable'] },
  { name:'Monospace', category: 'Classic Styles', map: {'a':'𝚊','b':'𝚋','c':'𝚌','d':'𝚍','e':'𝚎','f':'𝚏','g':'𝚐','h':'𝚑','i':'𝚒','j':'𝚓','k':'𝚔','l':'𝚕','m':'𝚖','n':'𝚗','o':'𝚘','p':'𝚙','q':'𝚚','r':'𝚛','s':'𝚜','t':'𝚝','u':'𝚞','v':'𝚟','w':'𝚠','x':'𝚡','y':'𝚢','z':'𝚣','A':'𝙰','B':'𝙱','C':'𝙲','D':'𝙳','E':'𝙴','F':'𝙵','G':'𝙶','H':'𝙷','I':'𝙸','J':'𝙹','K':'𝙺','L':'𝙻','M':'𝙼','N':'𝙽','O':'𝙾','P':'𝙿','Q':'𝚀','R':'𝚁','S':'𝚂','T':'𝚃','U':'𝚄','V':'𝚅','W':'𝚆','X':'𝚇','Y':'𝚈','Z':'𝚉'}, tags: ['clean', 'readable', 'safe'] },
  { name:'Circled', category: 'Classic Styles', map: {'a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'ⓩ','A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ'}, tags: ['bubbly', 'cute', 'readable', 'safe'] },
  { name:'Full Width', category: 'Classic Styles', map: {'a':'ａ','b':'ｂ','c':'ｃ','d':'ｄ','e':'ｅ','f':'ｆ','g':'ｇ','h':'ｈ','i':'ｉ','j':'ｊ','k':'ｋ','l':'ｌ','m':'ｍ','n':'ｎ','o':'ｏ','p':'ｐ','q':'ｑ','r':'ｒ','s':'ｓ','t':'ｔ','u':'ｕ','v':'ｖ','w':'ｗ','x':'ｘ','y':'ｙ','z':'ｚ','A':'Ａ','B':'Ｂ','C':'Ｃ','D':'Ｄ','E':'Ｅ','F':'Ｆ','G':'Ｇ','H':'Ｈ','I':'Ｉ','J':'Ｊ','K':'Ｋ','L':'Ｌ','M':'Ｍ','N':'Ｎ','O':'Ｏ','P':'Ｐ','Q':'Ｑ','R':'Ｒ','S':'Ｓ','T':'Ｔ','U':'Ｕ','V':'Ｖ','W':'Ｗ','X':'Ｘ','Y':'Ｙ','Z':'Ｚ'}, tags: ['wide', 'aesthetic', 'readable', 'safe'] },

  {
    name: 'Signature',
    category: 'Exotic & International Styles',
    map: {
      'A': '꧁', 'B': '༒', 'C': '༻', 'D': '☬',
      'E': 'ད', 'F': '𐌀', 'G': '𐌁', 'H': '𐌂',
      'I': '𐌃', 'J': '𐌄', 'K': '𐌅', 'L': 'Ᏽ',
      'M': '𐋅', 'N': '𐌉', 'O': 'Ꮦ', 'P': '𐌊',
      'Q': '𐌋', 'R': '𐌌', 'S': '𐌍', 'T': 'Ꝋ',
      'U': '𐌓', 'V': '𐌒', 'W': '𐌐', 'X': '𐌔',
      'Y': '𐌕', 'Z': '𐌵'
    },
    tags: ['exotic', 'readable', 'safe']
  },
  {
    name: 'Voltage Cage',
    category: 'Exotic & International Styles',
    transform: text => {
      const marks = ['\u033C', '\u0330'];
      let i = 0;
      let out = '';
      for (const ch of toGraphemes(text || '')) {
        if (isLetterOrDigit(ch)) {
          out += '\u29FC' + ch + marks[i++ % 2] + '\u29FD';
        } else {
          out += ch;
        }
      }
      return '⚡💀 ' + out + ' ⚡💀';
    },
    tags: ['gamer', 'cyber', 'readable', 'safe']
  },
  {
    name: 'Ancient Seal',
    category: 'Exotic & International Styles',
    transform: text => {
      const map = {
        'A': '𖤬', 'B': 'ꔪ', 'C': 'ꛕ', 'D': '𖤀',
        'E': '𖤟', 'F': 'ꘘ', 'G': 'ꚽ', 'H': 'ꛅ',
        'I': 'ꛈ', 'J': 'ꚠ', 'K': '𖤰', 'L': 'ꚳ',
        'M': '𖢑', 'N': 'ꛘ', 'O': '𖣠', 'P': 'ㄗ',
        'Q': 'ꚩ', 'R': '𖦪', 'S': 'ꕷ', 'T': '𖢧',
        'U': 'ꚶ', 'V': 'ꚴ', 'W': 'ꛃ', 'X': '𖤗',
        'Y': 'ꚲ', 'Z': 'ꛉ'
      };
      return '⎝⎝✦⎠⎠ ' + applyMap(text, map) + ' ⎝⎝✦⎠⎠';
    },
    tags: ['exotic', 'gamer', 'safe']
  },
  {
    name: 'Radar Lock',
    category: 'Exotic & International Styles',
    transform: text => {
      const marks = '\u0352\u035B\u033E';
      let out = '';
      for (const ch of toGraphemes(text || '')) {
        if (isLetterOrDigit(ch)) {
          out += ch + marks;
        } else {
          out += ch;
        }
      }
      return '◈⟨⟨ ' + out + ' ⟩⟩◈';
    },
    tags: ['gamer', 'cyber', 'readable', 'safe']
  },
  {
    name: 'Quill Strike',
    category: 'Exotic & International Styles',
    transform: text => {
      let out = '';
      for (const ch of toGraphemes(text || '')) {
        if (isLetterOrDigit(ch)) {
          out += '\u300E' + ch + '\u300F';
        } else {
          out += ch;
        }
      }
      return '⚔️彡 ' + out + ' 彡⚔️';
    },
    tags: ['gamer', 'aesthetic', 'readable', 'safe']
  },
  {
    name: 'Death March',
    category: 'Exotic & International Styles',
    transform: text => {
      const gs = toGraphemes(text || '');
      const out = gs
        .map((ch, i) =>
          isLetterOrDigit(ch)
            ? ch + (i < gs.length - 1 ? '\u244A' : '')
            : ch
        )
        .join('');
      return '\u300E\u2020\u300F ' + out + ' \u300E\u2020\u300F';
    },
    tags: ['gamer', 'dark', 'readable', 'safe']
  },
  {
    name: 'Hellenic Code',
    category: 'Exotic & International Styles',
    map: {
      'A': '𝛂', 'B': '𝛃', 'C': '𝛓', 'D': '𝛅',
      'E': '𝛆', 'F': '𝒇', 'G': '𝒈', 'H': '𝛌',
      'I': '𝒊', 'J': '𝒋', 'K': '𝛋', 'L': '𝛊',
      'M': '𝒎', 'N': '𝛈', 'O': '𝛉', 'P': '𝛒',
      'Q': '𝛗', 'R': '𝛄', 'S': '𝒔', 'T': '𝛕',
      'U': '𝛍', 'V': '𝛎', 'W': '𝛡', 'X': '𝛘',
      'Y': '𝛙', 'Z': '𝒛',
      'a': '𝛂', 'b': '𝛃', 'c': '𝛓', 'd': '𝛅',
      'e': '𝛆', 'f': '𝒇', 'g': '𝒈', 'h': '𝛌',
      'i': '𝒊', 'j': '𝒋', 'k': '𝛋', 'l': '𝛊',
      'm': '𝒎', 'n': '𝛈', 'o': '𝛉', 'p': '𝛒',
      'q': '𝛗', 'r': '𝛄', 's': '𝒔', 't': '𝛕',
      'u': '𝛍', 'v': '𝛎', 'w': '𝛡', 'x': '𝛘',
      'y': '𝛙', 'z': '𝒛'
    },
    tags: ['exotic', 'aesthetic', 'readable', 'safe']
  },
  {
    name: 'Rogue Alphabet',
    category: 'Exotic & International Styles',
    map: {
      'A': 'Δ', 'B': 'ß', 'C': 'Ć', 'D': 'Đ',
      'E': '€', 'F': 'Ƒ', 'G': 'Ǥ', 'H': 'Ħ',
      'I': 'Ɨ', 'J': 'Ĵ', 'K': 'Ҝ', 'L': 'Ł',
      'M': 'Μ', 'N': 'Ň', 'O': 'Ø', 'P': 'Ƥ',
      'Q': 'Ϙ', 'R': 'Ř', 'S': 'Ş', 'T': 'Ŧ',
      'U': 'Ü', 'V': 'V̶', 'W': 'Ŵ', 'X': 'Ж',
      'Y': '¥', 'Z': 'Ž',
      'a': 'α', 'b': 'ƀ', 'c': 'ç', 'd': 'đ',
      'e': 'ě', 'f': 'ƒ', 'g': 'ĝ', 'h': 'ħ',
      'i': 'î', 'j': 'ĵ', 'k': 'ķ', 'l': 'ł',
      'm': 'ɱ', 'n': 'ñ', 'o': 'ø', 'p': 'ƥ',
      'q': 'ϙ', 'r': 'ř', 's': 'ş', 't': 'ŧ',
      'u': 'ü', 'v': 'v̶', 'w': 'ŵ', 'x': 'ж',
      'y': 'ÿ', 'z': 'ž'
    },
    tags: ['exotic', 'readable', 'gamer', 'safe']
  },
  {
    name: 'Double Underline',
    category: 'Exotic & International Styles',
    transform: text => {
      let out = '';
      for (const ch of toGraphemes(text || '')) {
        if (isLetterOrDigit(ch)) {
          out += ch + '\u0333';
        } else {
          out += ch;
        }
      }
      return '₊˚⊹ ' + out + ' ⊹˚₊';
    },
    tags: ['aesthetic', 'cute', 'readable', 'safe']
  },
  {
    name: 'IPA Rage',
    category: 'Exotic & International Styles',
    transform: text => {
      const map = {
        'A': 'ǟ', 'B': 'ɮ', 'C': 'ƈ', 'D': 'ɖ',
        'E': 'ɛ', 'F': 'ʄ', 'G': 'ɢ', 'H': 'ʜ',
        'I': 'ɪ', 'J': 'ʝ', 'K': 'ĸ', 'L': 'ʟ',
        'M': 'ɱ', 'N': 'ռ', 'O': 'օ', 'P': 'ք',
        'Q': 'զ', 'R': 'ʀ', 'S': 'ֆ', 'T': 'ȶ',
        'U': 'ʊ', 'V': 'ʋ', 'W': 'ա', 'X': 'ҳ',
        'Y': 'ʏ', 'Z': 'ȥ',
        'a': 'ǟ', 'b': 'ɮ', 'c': 'ƈ', 'd': 'ɖ',
        'e': 'ɛ', 'f': 'ʄ', 'g': 'ɢ', 'h': 'ʜ',
        'i': 'ɪ', 'j': 'ʝ', 'k': 'ĸ', 'l': 'ʟ',
        'm': 'ɱ', 'n': 'ռ', 'o': 'օ', 'p': 'ք',
        'q': 'զ', 'r': 'ʀ', 's': 'ֆ', 't': 'ȶ',
        'u': 'ʊ', 'v': 'ʋ', 'w': 'ա', 'x': 'ҳ',
        'y': 'ʏ', 'z': 'ȥ'
      };
      return '༼つಠ益ಠ༽つ ' + applyMap(text, map) + ' ༼つಠ益ಠ༽つ';
    },
    tags: ['exotic', 'gamer', 'readable', 'safe']
  },

  // --- Complex & Symbolic ---
  { name: 'Glitch Hop', category: 'Complex / Glitched', map: glitchHopMap, tags: ['glitch', 'gamer', 'unreadable'] },
  { name: 'Bracket Mix', category: 'Complex / Glitched', map: bracketMixMap, tags: ['cyber', 'gamer', 'readable'] },
  { name: 'Cursed Script', category: 'Complex / Glitched', map: cursedScriptMap, tags: ['glitch', 'unreadable'] },
  { name: 'Digital Decay', category: 'Complex / Glitched', map: digitalDecayMap, tags: ['glitch', 'cyber', 'unreadable'] },
  { name: 'Royal Mix', category: 'Complex / Glitched', map: royalMixMap, tags: ['aesthetic', 'cute'] },
  { name: 'Elegant Glitch', category: 'Complex / Glitched', map: elegantGlitchMap, tags: ['glitch', 'aesthetic', 'readable'] },
  { name: 'Wierd', category: 'Complex / Glitched', map: wierdMap, tags: ['exotic', 'unreadable'] },
  { name: 'Decor', category: 'Complex / Glitched', map: decorMap, tags: ['clean', 'readable', 'safe'] },
  { name: 'Alien', category: 'Complex / Glitched', map: alienMap, tags: ['gamer', 'cyber', 'exotic', 'readable', 'safe'] },
  { name: 'Neon', category: 'Complex / Glitched', map: neonMap, tags: ['aesthetic', 'unreadable'] },
  { name: 'Cool', category: 'Complex / Glitched', map: coolMap, tags: ['glitch', 'gamer', 'unreadable'] },
  { name: 'Kool', category: 'Complex / Glitched', map: koolMap, tags: ['exotic', 'readable'] },
];

/* =========================================================
   20 Ultra-Unique Remix Styles (original)
   ========================================================= */

const REMIX_STYLES = [
  makeRemixStyle({ name: 'Quantum Spell', frame:{pre:'⟁',post:'⟁'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{ W:'𝔚', w:'𝔀', X:'𝔛', x:'𝔁', Y:'𝔜', y:'𝔂', Z:'ℨ', z:'𝔃', O:'𝓞', o:'𝓸' }, palette:['⌬','◬','⟡'], micro:{ dotVowels:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Starlit Ice', frame:{pre:'❄︎',post:'❄︎'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{ A:'Ａ',E:'Ｅ',I:'Ｉ',O:'Ｏ',U:'Ｕ',a:'ａ',e:'ｅ',i:'ｉ',o:'ｏ',u:'ｕ' }, palette:['☾','✦','❆'], micro:{ dotVowels:true, symbolChance:0.5 } }),
  makeRemixStyle({ name: 'Blood Rune', frame:{pre:'𖤐',post:'𖤐'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{ O:'𝒪', o:'𝔬' }, palette:['☨','✠','†'], micro:{ underline:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Ember Strike', frame:{pre:'🔥',post:'🔥'}, bases:{upper:'DOUBLE',lower:'SCRIPT'}, overrides:{ X:'𝔛', x:'𝔁', V:'𝓥' }, palette:['✦','⚑','⚡'], micro:{ dotVowels:true, symbolChance:0.5 } }),
  makeRemixStyle({ name: 'Toxic Pulse', frame:{pre:'☣︎',post:'☣︎'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{ O:'Ø', o:'ø', E:'Ξ', e:'ξ', A:'Δ', a:'Δ', Y:'¥', y:'ყ' }, palette:['⌁','⌬','⎔'], micro:{ underline:true, symbolChance:0.5 } }),
  makeRemixStyle({ name: 'Cosmic Bloom', frame:{pre:'✧',post:'✧'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{}, palette:['✺','✸','✶'], micro:{ dotVowels:true, symbolChance:0.6 } }),
  makeRemixStyle({ name: 'Shadow Circuit', frame:{pre:'⚫',post:'⚫'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{ O:'𝙾', o:'ø', A:'𝙰', E:'𝙴', X:'𝚇', x:'𝚡' }, palette:['▣','◧','◨'], micro:{ underline:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Solar Sigil', frame:{pre:'☀︎',post:'☀︎'}, bases:{upper:'DOUBLE',lower:'SCRIPT'}, overrides:{ T:'𝕋', R:'ℝ' }, palette:['☩','☼','✷'], micro:{ dotVowels:true, symbolChance:0.5 } }),
  makeRemixStyle({ name: 'Necro Warden', frame:{pre:'☠︎',post:'☠︎'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['☥','⚰︎','✟'], micro:{ underline:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Lunar Bloom', frame:{pre:'☽',post:'☾'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{}, palette:['✧','☄︎','✦'], micro:{ dotVowels:true, symbolChance:0.55 } }),
  makeRemixStyle({ name: 'Frost Bite', frame:{pre:'❄︎',post:'❄︎'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{ O:'Ｏ', o:'ｏ' }, palette:['☾','✶','❆'], micro:{ dotVowels:true, symbolChance:0.45 } }),
  makeRemixStyle({ name: 'Arcane Tide', frame:{pre:'𓆉',post:'𓆉'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{}, palette:['☸︎','༄','⋆'], micro:{ dotVowels:true, symbolChance:0.6 } }),
  makeRemixStyle({ name: 'Iron Howl', frame:{pre:'⛓',post:'⛓'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{ V:'𝚅', W:'𝚆', X:'𝚇', Y:'𝚈' }, palette:['⟟','⛓','⛨'], micro:{ underline:true, symbolChance:0.35 } }),
  makeRemixStyle({ name: 'Burning Sigil', frame:{pre:'✠',post:'✠'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{ A:'𝔸', a:'𝕒', E:'𝔼', e:'𝕖' }, palette:['†','☉','☍'], micro:{ dotVowels:true, symbolChance:0.45 } }),
  makeRemixStyle({ name: 'Abyss Crown', frame:{pre:'🌊',post:'🌊'}, bases:{upper:'FULL',lower:'SCRIPT'}, overrides:{ O:'Ｏ', o:'ｏ', N:'Ｎ', n:'ｎ' }, palette:['❪','❫','⟢'], micro:{ dotVowels:true, symbolChance:0.55 } }),
  makeRemixStyle({ name: 'Ghost Pulse', frame:{pre:'👁',post:'👁'}, bases:{upper:'MONO',lower:'SCRIPT'}, overrides:{ O:'Ø', o:'ø' }, palette:['▫','▪','◦'], micro:{ underline:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Thunder Crest', frame:{pre:'⚡',post:'⚡'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{ O:'𝕆', o:'𝕠', S:'𝕊', s:'𝕤' }, palette:['✦','⯈','➤'], micro:{ symbolChance:0.5 } }),
  makeRemixStyle({ name: 'Dream Weaver', frame:{pre:'✿',post:'✿'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{}, palette:['🫧','⋆','❀'], micro:{ dotVowels:true, symbolChance:0.6 } }),
  makeRemixStyle({ name: 'Obsidian Flame', frame:{pre:'⛧',post:'⛧'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{ O:'𝒪', o:'𝔬' }, palette:['✟','❖','☗'], micro:{ underline:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Soul Key', frame:{pre:'☽',post:'☽'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{ G:'𝓖', g:'𝓰', K:'𝓚', k:'𝓴' }, palette:['⚷','⌘','✧'], micro:{ dotVowels:true, symbolChance:0.55 } }),
];
const EXTRA_STYLES = [

    // ══════════════════════════════════════
    // ATTITUDE
    // ══════════════════════════════════════
    {
        name: 'Slavic Strike',
        category: 'Attitude',
        map: {
            'A': 'Ą', 'B': 'Ɓ', 'C': 'Ƈ', 'D': 'Ɗ', 'E': 'Ɛ', 'F': 'Ƒ', 'G': 'Ɠ', 'H': 'Ƕ',
            'I': 'Ɩ', 'J': 'Ɉ', 'K': 'Ƙ', 'L': 'Ƚ', 'M': 'Ɱ', 'N': 'Ɲ', 'O': 'Ɵ', 'P': 'Ƥ',
            'Q': 'Ɋ', 'R': 'Ɍ', 'S': 'Ş', 'T': 'Ƭ', 'U': 'Ʊ', 'V': 'Ʋ', 'W': 'Ɯ', 'X': 'Ӿ',
            'Y': 'Ƴ', 'Z': 'Ƶ',
            'a': 'ą', 'b': 'ɓ', 'c': 'ƈ', 'd': 'ɗ', 'e': 'ɛ', 'f': 'ƒ', 'g': 'ɠ', 'h': 'ƕ',
            'i': 'ɩ', 'j': 'ɉ', 'k': 'ƙ', 'l': 'ƚ', 'm': 'ɱ', 'n': 'ɲ', 'o': 'ɵ', 'p': 'ƥ',
            'q': 'ɋ', 'r': 'ɍ', 's': 'ş', 't': 'ƭ', 'u': 'ʊ', 'v': 'ʋ', 'w': 'ɯ', 'x': 'ӿ',
            'y': 'ƴ', 'z': 'ƶ'
        },
        tags: ['gamer', 'exotic', 'readable', 'safe']
    },
    {
        name: 'Thorned',
        category: 'Attitude',
        map: {
            'A': 'Ⱥ', 'B': 'Ƀ', 'C': 'Ȼ', 'D': 'Đ', 'E': 'Ɇ', 'F': 'Ƒ', 'G': 'Ǥ', 'H': 'Ħ',
            'I': 'Ɨ', 'J': 'Ɉ', 'K': 'Ꝁ', 'L': 'Ł', 'M': 'Ɱ', 'N': 'Ň', 'O': 'Ø', 'P': 'Ᵽ',
            'Q': 'Ꝗ', 'R': 'Ɽ', 'S': 'Ȿ', 'T': 'Ŧ', 'U': 'Ʉ', 'V': 'Ꝟ', 'W': 'Ⱳ', 'X': 'Ӿ',
            'Y': 'Ɏ', 'Z': 'Ƶ',
            'a': 'ⱥ', 'b': 'ƀ', 'c': 'ȼ', 'd': 'đ', 'e': 'ɇ', 'f': 'ƒ', 'g': 'ǥ', 'h': 'ħ',
            'i': 'ɨ', 'j': 'ɉ', 'k': 'ꝁ', 'l': 'ł', 'm': 'ɱ', 'n': 'ň', 'o': 'ø', 'p': 'ᵽ',
            'q': 'ꝗ', 'r': 'ɽ', 's': 'ȿ', 't': 'ŧ', 'u': 'ʉ', 'v': 'ꝟ', 'w': 'ⱳ', 'x': 'ӿ',
            'y': 'ɏ', 'z': 'ƶ'
        },
        tags: ['gamer', 'readable', 'safe']
    },
    {
        name: 'Warzone',
        category: 'Attitude',
        transform: text => {
            const map = {
                'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇',
                'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏',
                'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗',
                'Y': '𝐘', 'Z': '𝐙',
                'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡',
                'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩',
                'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱',
                'y': '𝐲', 'z': '𝐳'
            };
            return '⚔️ ' + applyMap(text, map) + ' ⚔️';
        },
        tags: ['gamer', 'bold', 'readable', 'safe']
    },
    {
        name: 'Iron Fist',
        category: 'Attitude',
        transform: text => {
            const map = {
                'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯',
                'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷',
                'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿',
                'Y': '𝒀', 'Z': '𝒁',
                'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉',
                'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑',
                'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙',
                'y': '𝒚', 'z': '𝒛'
            };
            return '👊 ' + applyMap(text, map) + ' 👊';
        },
        tags: ['gamer', 'bold', 'readable', 'safe']
    },
    {
        name: 'Blood Oath',
        category: 'Attitude',
        transform: text => {
            const map = {
                'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱', 'G': '𝕲', 'H': '𝕳',
                'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹', 'O': '𝕺', 'P': '𝕻',
                'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁', 'W': '𝖂', 'X': '𝖃',
                'Y': '𝖄', 'Z': '𝖅',
                'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍',
                'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕',
                'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝',
                'y': '𝖞', 'z': '𝖟'
            };
            return '☠️ ' + applyMap(text, map) + ' ☠️';
        },
        tags: ['gamer', 'dark', 'readable']
    },

    // ══════════════════════════════════════
    // CUTE
    // ══════════════════════════════════════
    {
        name: 'Sweet Italic',
        category: 'Cute',
        transform: text => {
            const map = {
                'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏',
                'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗',
                'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟',
                'Y': '𝘠', 'Z': '𝘡',
                'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩',
                'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱',
                'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹',
                'y': '𝘺', 'z': '𝘻'
            };
            return '🌸 ' + applyMap(text, map) + ' 🌸';
        },
        tags: ['cute', 'aesthetic', 'readable', 'safe']
    },
    {
        name: 'Fluffy',
        category: 'Cute',
        transform: text => {
            const map = {
                'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ',
                'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫',
                'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳',
                'Y': '𝒴', 'Z': '𝒵',
                'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽',
                'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅',
                'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
                'y': '𝓎', 'z': '𝓏'
            };
            return '💖 ' + applyMap(text, map) + ' 💖';
        },
        tags: ['cute', 'aesthetic', 'readable', 'safe']
    },
    {
        name: 'Bubble Cute',
        category: 'Cute',
        transform: text => {
            const map = {
                'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ',
                'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ',
                'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ',
                'Y': 'Ⓨ', 'Z': 'Ⓩ',
                'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ',
                'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ',
                'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ',
                'y': 'ⓨ', 'z': 'ⓩ'
            };
            return '(◕ᴗ◕✿) ' + applyMap(text, map) + ' ✿';
        },
        tags: ['cute', 'bubbly', 'readable', 'safe']
    },
    {
        name: 'Kawaii Small',
        category: 'Cute',
        transform: text => {
            const map = {
                'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ',
                'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ',
                'q': 'q', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ',
                'y': 'ʸ', 'z': 'ᶻ',
                'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ᶠ', 'G': 'ᴳ', 'H': 'ᴴ',
                'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ',
                'Q': 'Q', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ',
                'Y': 'ʸ', 'Z': 'ᶻ'
            };
            return '₊˚ʚ ' + applyMap(text, map) + ' ɞ˚₊';
        },
        tags: ['cute', 'small', 'readable', 'safe']
    },
    {
        name: 'Rose Script',
        category: 'Cute',
        transform: text => {
            const map = {
                'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗',
                'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟',
                'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧',
                'Y': '𝓨', 'Z': '𝓩',
                'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱',
                'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹',
                'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁',
                'y': '𝔂', 'z': '𝔃'
            };
            return '🌹 ' + applyMap(text, map) + ' 🌹';
        },
        tags: ['cute', 'cursive', 'aesthetic', 'readable', 'safe']
    },

    // ══════════════════════════════════════
    // ASIAN
    // ══════════════════════════════════════
    {
        name: 'CJK Strike',
        category: 'Asian',
        map: {
            'A': '卂', 'B': '乃', 'C': '匚', 'D': 'ᗪ', 'E': '乇', 'F': '千', 'G': 'Ꮆ', 'H': '卄',
            'I': '丨', 'J': 'ﾌ', 'K': 'Ҝ', 'L': '乚', 'M': '爪', 'N': '刀', 'O': 'ㄖ', 'P': '卩',
            'Q': 'Ɋ', 'R': '尺', 'S': '丂', 'T': 'ㄒ', 'U': 'ㄩ', 'V': 'ᐯ', 'W': '山', 'X': '乂',
            'Y': 'ㄚ', 'Z': '乙',
            'a': '卂', 'b': '乃', 'c': '匚', 'd': 'ᗪ', 'e': '乇', 'f': '千', 'g': 'Ꮆ', 'h': '卄',
            'i': '丨', 'j': 'ﾌ', 'k': 'Ҝ', 'l': '乚', 'm': '爪', 'n': '刀', 'o': 'ㄖ', 'p': '卩',
            'q': 'Ɋ', 'r': '尺', 's': '丂', 't': 'ㄒ', 'u': 'ㄩ', 'v': 'ᐯ', 'w': '山', 'x': '乂',
            'y': 'ㄚ', 'z': '乙'
        },
        tags: ['asian', 'exotic', 'gamer', 'readable']
    },
    {
        name: 'Tokyo Drift',
        category: 'Asian',
        map: {
            'A': 'ア', 'B': 'ム', 'C': 'ᄃ', 'D': '刀', 'E': 'ヨ', 'F': 'キ', 'G': 'ム', 'H': 'ハ',
            'I': '工', 'J': 'ノ', 'K': 'ズ', 'L': 'レ', 'M': 'ﾶ', 'N': 'ℕ', 'O': 'の', 'P': 'ア',
            'Q': 'ϙ', 'R': '尺', 'S': '丂', 'T': 'ｲ', 'U': 'ひ', 'V': '√', 'W': 'ﾘ', 'X': '乂',
            'Y': 'ﾘ', 'Z': '乙',
            'a': 'ア', 'b': 'ム', 'c': 'ᄃ', 'd': '刀', 'e': 'ヨ', 'f': 'キ', 'g': 'ム', 'h': 'ハ',
            'i': '工', 'j': 'ノ', 'k': 'ズ', 'l': 'レ', 'm': 'ﾶ', 'n': 'η', 'o': 'の', 'p': 'ア',
            'q': 'ϙ', 'r': '尺', 's': '丂', 't': 'ｲ', 'u': 'ひ', 'v': '√', 'w': 'ﾘ', 'x': '乂',
            'y': 'ﾘ', 'z': '乙'
        },
        tags: ['asian', 'exotic', 'gamer', 'readable']
    },
    {
        name: 'Ninja',
        category: 'Asian',
        transform: text => {
            const map = {
                'A': '卂', 'B': '乃', 'C': '匚', 'D': 'ᗪ', 'E': '乇', 'F': '千', 'G': 'Ꮆ', 'H': '卄',
                'I': '丨', 'J': 'ﾌ', 'K': 'Ҝ', 'L': '乚', 'M': '爪', 'N': '刀', 'O': 'ㄖ', 'P': '卩',
                'Q': 'Ɋ', 'R': '尺', 'S': '丂', 'T': 'ㄒ', 'U': 'ㄩ', 'V': 'ᐯ', 'W': '山', 'X': '乂',
                'Y': 'ㄚ', 'Z': '乙',
                'a': '卂', 'b': '乃', 'c': '匚', 'd': 'ᗪ', 'e': '乇', 'f': '千', 'g': 'Ꮆ', 'h': '卄',
                'i': '丨', 'j': 'ﾌ', 'k': 'Ҝ', 'l': '乚', 'm': '爪', 'n': '刀', 'o': 'ㄖ', 'p': '卩',
                'q': 'Ɋ', 'r': '尺', 's': '丂', 't': 'ㄒ', 'u': 'ㄩ', 'v': 'ᐯ', 'w': '山', 'x': '乂',
                'y': 'ㄚ', 'z': '乙'
            };
            return '忍 ' + applyMap(text, map) + ' 忍';
        },
        tags: ['asian', 'gamer', 'readable']
    },
    {
        name: 'Eastern Bold',
        category: 'Asian',
        map: {
            'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ',
            'I': 'Ｉ', 'J': 'Ｊ', 'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ',
            'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ', 'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ',
            'Y': 'Ｙ', 'Z': 'Ｚ',
            'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ',
            'i': 'ｉ', 'j': 'ｊ', 'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ',
            'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ', 'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ',
            'y': 'ｙ', 'z': 'ｚ'
        },
        tags: ['asian', 'fullwidth', 'readable', 'safe']
    },

    // ══════════════════════════════════════
    // RUSSIAN / CYRILLIC
    // ══════════════════════════════════════
    {
        name: 'Cyrillic Strike',
        category: 'Russian',
        map: {
            'A': 'Д', 'B': 'Б', 'C': 'С', 'D': 'Д', 'E': 'Э', 'F': 'Ғ', 'G': 'Ԍ', 'H': 'Н',
            'I': 'И', 'J': 'Ј', 'K': 'К', 'L': 'Г', 'M': 'М', 'N': 'И', 'O': 'О', 'P': 'Р',
            'Q': 'Ϙ', 'R': 'Я', 'S': 'Ѕ', 'T': 'Т', 'U': 'Ц', 'V': 'Щ', 'W': 'Ш', 'X': 'Ж',
            'Y': 'Ч', 'Z': 'З',
            'a': 'а', 'b': 'б', 'c': 'с', 'd': 'д', 'e': 'э', 'f': 'ғ', 'g': 'ԍ', 'h': 'н',
            'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'г', 'm': 'м', 'n': 'и', 'o': 'о', 'p': 'р',
            'q': 'ϙ', 'r': 'я', 's': 'ѕ', 't': 'т', 'u': 'ц', 'v': 'щ', 'w': 'ш', 'x': 'ж',
            'y': 'ч', 'z': 'з'
        },
        tags: ['russian', 'exotic', 'readable', 'safe']
    },
    {
        name: 'Soviet Bold',
        category: 'Russian',
        map: {
            'A': 'Λ', 'B': 'β', 'C': 'С', 'D': 'Ð', 'E': 'Σ', 'F': 'Ƒ', 'G': 'Ꮆ', 'H': 'Η',
            'I': 'Ι', 'J': 'Ĵ', 'K': 'Κ', 'L': 'Λ', 'M': 'Μ', 'N': 'Ν', 'O': 'Θ', 'P': 'Ρ',
            'Q': 'Ω', 'R': 'Я', 'S': 'Ѕ', 'T': 'Τ', 'U': 'Υ', 'V': 'Ʋ', 'W': 'Ш', 'X': 'Χ',
            'Y': 'Ч', 'Z': 'Ζ',
            'a': 'λ', 'b': 'β', 'c': 'с', 'd': 'ð', 'e': 'σ', 'f': 'ƒ', 'g': 'ɢ', 'h': 'η',
            'i': 'ι', 'j': 'ĵ', 'k': 'κ', 'l': 'λ', 'm': 'μ', 'n': 'ν', 'o': 'θ', 'p': 'ρ',
            'q': 'ω', 'r': 'я', 's': 'ѕ', 't': 'τ', 'u': 'υ', 'v': 'ʋ', 'w': 'ш', 'x': 'χ',
            'y': 'ч', 'z': 'ζ'
        },
        tags: ['russian', 'exotic', 'readable', 'safe']
    },
    {
        name: 'Red Army',
        category: 'Russian',
        transform: text => {
            const map = {
                'A': 'Д', 'B': 'Б', 'C': 'С', 'D': 'Д', 'E': 'Э', 'F': 'Ғ', 'G': 'Ԍ', 'H': 'Н',
                'I': 'И', 'J': 'Ј', 'K': 'К', 'L': 'Г', 'M': 'М', 'N': 'И', 'O': 'О', 'P': 'Р',
                'Q': 'Ϙ', 'R': 'Я', 'S': 'Ѕ', 'T': 'Т', 'U': 'Ц', 'V': 'Щ', 'W': 'Ш', 'X': 'Ж',
                'Y': 'Ч', 'Z': 'З',
                'a': 'а', 'b': 'б', 'c': 'с', 'd': 'д', 'e': 'э', 'f': 'ғ', 'g': 'ԍ', 'h': 'н',
                'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'г', 'm': 'м', 'n': 'и', 'o': 'о', 'p': 'р',
                'q': 'ϙ', 'r': 'я', 's': 'ѕ', 't': 'т', 'u': 'ц', 'v': 'щ', 'w': 'ш', 'x': 'ж',
                'y': 'ч', 'z': 'з'
            };
            return '★ ' + applyMap(text, map) + ' ★';
        },
        tags: ['russian', 'gamer', 'readable']
    },
    {
        name: 'Slavic Mix',
        category: 'Russian',
        transform: text => {
            const map = {
                'A': 'Λ', 'B': 'β', 'C': 'ϲ', 'D': 'Ď', 'E': 'Σ', 'F': 'Ƒ', 'G': 'Ğ', 'H': 'Н',
                'I': 'Ї', 'J': 'Ĵ', 'K': 'Ҡ', 'L': 'Ĺ', 'M': 'М', 'N': 'Ñ', 'O': 'Ö', 'P': 'Р',
                'Q': 'Ϙ', 'R': 'Ȓ', 'S': 'Š', 'T': 'Ţ', 'U': 'Ü', 'V': 'Ѵ', 'W': 'Ш', 'X': 'Ж',
                'Y': 'Ÿ', 'Z': 'Ź',
                'a': 'λ', 'b': 'β', 'c': 'ϲ', 'd': 'ď', 'e': 'σ', 'f': 'ƒ', 'g': 'ğ', 'h': 'н',
                'i': 'ї', 'j': 'ĵ', 'k': 'ҡ', 'l': 'ĺ', 'm': 'м', 'n': 'ñ', 'o': 'ö', 'p': 'р',
                'q': 'ϙ', 'r': 'ȓ', 's': 'š', 't': 'ţ', 'u': 'ü', 'v': 'ѵ', 'w': 'ш', 'x': 'ж',
                'y': 'ÿ', 'z': 'ź'
            };
            return '҉ ' + applyMap(text, map) + ' ҉';
        },
        tags: ['russian', 'exotic', 'readable']
    },

    // ══════════════════════════════════════
    // LINES — combining mark variants
    // ══════════════════════════════════════
    {
        name: 'Strikethrough',
        category: 'Lines',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u0336' : ch;
            }
            return out;
        },
        tags: ['lines', 'clean', 'readable', 'safe']
    },
    {
        name: 'Double Strikethrough',
        category: 'Lines',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u0335' : ch;
            }
            return out;
        },
        tags: ['lines', 'clean', 'readable', 'safe']
    },
    {
        name: 'Underline Bold',
        category: 'Lines',
        transform: text => {
            const map = {
                'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇',
                'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏',
                'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗',
                'Y': '𝐘', 'Z': '𝐙',
                'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡',
                'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩',
                'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱',
                'y': '𝐲', 'z': '𝐳'
            };
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                const mapped = map[ch] || ch;
                out += isLetterOrDigit(ch) ? mapped + '\u0332' : ch;
            }
            return out;
        },
        tags: ['lines', 'bold', 'readable', 'safe']
    },
    {
        name: 'Overline',
        category: 'Lines',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u0305' : ch;
            }
            return out;
        },
        tags: ['lines', 'clean', 'readable', 'safe']
    },
    {
        name: 'Double Overline',
        category: 'Lines',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u033F' : ch;
            }
            return out;
        },
        tags: ['lines', 'clean', 'readable', 'safe']
    },
    {
        name: 'Tilde Wave',
        category: 'Lines',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u0334' : ch;
            }
            return out;
        },
        tags: ['lines', 'aesthetic', 'readable', 'safe']
    },
    {
        name: 'Slash Through',
        category: 'Lines',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u0337' : ch;
            }
            return out;
        },
        tags: ['lines', 'glitch', 'readable', 'safe']
    },
    {
        name: 'Cross Hatch',
        category: 'Lines',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u0336' + '\u0305' : ch;
            }
            return out;
        },
        tags: ['lines', 'glitch', 'readable']
    },
    {
        name: 'Underline Dots',
        category: 'Lines',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u0332' + '\u0307' : ch;
            }
            return out;
        },
        tags: ['lines', 'aesthetic', 'readable']
    },

    // ══════════════════════════════════════
    // GUN / WEAPON
    // ══════════════════════════════════════
    {
        name: 'Bullet Trail',
        category: 'Gun',
        transform: text => {
            const map = {
                'A': 'Д', 'B': 'Б', 'C': 'С', 'D': 'Д', 'E': 'Э', 'F': 'Ғ', 'G': 'Ԍ', 'H': 'Н',
                'I': 'И', 'J': 'Ĵ', 'K': 'К', 'L': 'Г', 'M': 'М', 'N': 'Ν', 'O': 'О', 'P': 'Р',
                'Q': 'Ω', 'R': 'Я', 'S': 'Ş', 'T': 'Т', 'U': 'Ц', 'V': 'Щ', 'W': 'Ш', 'X': 'Ж',
                'Y': 'Ч', 'Z': 'З',
                'a': 'а', 'b': 'б', 'c': 'с', 'd': 'д', 'e': 'э', 'f': 'ғ', 'g': 'ԍ', 'h': 'н',
                'i': 'и', 'j': 'ĵ', 'k': 'к', 'l': 'г', 'm': 'м', 'n': 'ν', 'o': 'о', 'p': 'р',
                'q': 'ω', 'r': 'я', 's': 'ş', 't': 'т', 'u': 'ц', 'v': 'щ', 'w': 'ш', 'x': 'ж',
                'y': 'ч', 'z': 'з'
            };
            return '▄︻デ══━一 ' + applyMap(text, map) + ' ━一';
        },
        tags: ['gun', 'gamer', 'readable']
    },
    {
        name: 'Sniper',
        category: 'Gun',
        transform: text => {
            const map = {
                'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
                'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
                'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
                'Y': '𝗬', 'Z': '𝗭',
                'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
                'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
                'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
                'y': '𝘆', 'z': '𝘇'
            };
            return '🎯 ' + applyMap(text, map) + ' 🎯';
        },
        tags: ['gun', 'gamer', 'bold', 'readable', 'safe']
    },
    {
        name: 'AK Frame',
        category: 'Gun',
        transform: text => {
            return '꧁▄︻デ══━一 ' + text + ' ━一▄︻デ꧂';
        },
        pure: true,
        tags: ['gun', 'gamer', 'frame']
    },
    {
        name: 'Combat',
        category: 'Gun',
        transform: text => {
            const map = {
                'A': 'Ⱥ', 'B': 'Ƀ', 'C': 'Ȼ', 'D': 'Đ', 'E': 'Ɇ', 'F': 'Ƒ', 'G': 'Ǥ', 'H': 'Ħ',
                'I': 'Ɨ', 'J': 'Ɉ', 'K': 'Ƙ', 'L': 'Ł', 'M': 'Ɱ', 'N': 'Ň', 'O': 'Ø', 'P': 'Ᵽ',
                'Q': 'Ꝗ', 'R': 'Ɽ', 'S': 'Ȿ', 'T': 'Ŧ', 'U': 'Ʉ', 'V': 'Ꝟ', 'W': 'Ⱳ', 'X': 'Ӿ',
                'Y': 'Ɏ', 'Z': 'Ƶ',
                'a': 'ⱥ', 'b': 'ƀ', 'c': 'ȼ', 'd': 'đ', 'e': 'ɇ', 'f': 'ƒ', 'g': 'ǥ', 'h': 'ħ',
                'i': 'ɨ', 'j': 'ɉ', 'k': 'ƙ', 'l': 'ł', 'm': 'ɱ', 'n': 'ň', 'o': 'ø', 'p': 'ᵽ',
                'q': 'ꝗ', 'r': 'ɽ', 's': 'ȿ', 't': 'ŧ', 'u': 'ʉ', 'v': 'ꝟ', 'w': 'ⱳ', 'x': 'ӿ',
                'y': 'ɏ', 'z': 'ƶ'
            };
            return '(ง ͠° ͟ل͜ ͡°)ง ' + applyMap(text, map) + ' 💪';
        },
        tags: ['gun', 'gamer', 'readable']
    },

    // ══════════════════════════════════════
    // HEART DECORATION
    // ══════════════════════════════════════
    {
        name: 'Heart Script',
        category: 'Heart',
        transform: text => {
            const map = {
                'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ',
                'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫',
                'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳',
                'Y': '𝒴', 'Z': '𝒵',
                'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽',
                'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅',
                'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
                'y': '𝓎', 'z': '𝓏'
            };
            return '♥ ' + applyMap(text, map) + ' ♥';
        },
        tags: ['heart', 'cute', 'aesthetic', 'readable', 'safe']
    },
    {
        name: 'Love Bold',
        category: 'Heart',
        transform: text => {
            const map = {
                'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
                'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
                'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
                'Y': '𝗬', 'Z': '𝗭',
                'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
                'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
                'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
                'y': '𝘆', 'z': '𝘇'
            };
            return '❤️ ' + applyMap(text, map) + ' ❤️';
        },
        tags: ['heart', 'bold', 'cute', 'readable', 'safe']
    },
    {
        name: 'Cupid',
        category: 'Heart',
        transform: text => {
            return '♡´･ᴗ･`♡ ' + text + ' ♡´･ᴗ･`♡';
        },
        pure: true,
        tags: ['heart', 'cute', 'frame']
    },
    {
        name: 'Valentine',
        category: 'Heart',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u0332' : ch;
            }
            return '💖 ' + out + ' 💖';
        },
        tags: ['heart', 'lines', 'cute', 'readable']
    },

    // ══════════════════════════════════════
    // STAR DECORATION
    // ══════════════════════════════════════
    {
        name: 'Star Frame',
        category: 'Star',
        transform: text => {
            return '★彡 ' + text + ' 彡★';
        },
        pure: true,
        tags: ['star', 'frame', 'gamer']
    },
    {
        name: 'Galaxy Script',
        category: 'Star',
        transform: text => {
            const map = {
                'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ',
                'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫',
                'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳',
                'Y': '𝒴', 'Z': '𝒵',
                'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽',
                'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅',
                'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
                'y': '𝓎', 'z': '𝓏'
            };
            return '✦ ' + applyMap(text, map) + ' ✦';
        },
        tags: ['star', 'aesthetic', 'readable', 'safe']
    },
    {
        name: 'Nova',
        category: 'Star',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u0307' : ch;
            }
            return '✨ ' + out + ' ✨';
        },
        tags: ['star', 'aesthetic', 'readable', 'safe']
    },
    {
        name: 'Stellar Bold',
        category: 'Star',
        transform: text => {
            const map = {
                'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇',
                'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏',
                'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗',
                'Y': '𝐘', 'Z': '𝐙',
                'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡',
                'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩',
                'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱',
                'y': '𝐲', 'z': '𝐳'
            };
            return '⭐ ' + applyMap(text, map) + ' ⭐';
        },
        tags: ['star', 'bold', 'readable', 'safe']
    },

    // ══════════════════════════════════════
    // CROWN
    // ══════════════════════════════════════
    {
        name: 'Crown Frame',
        category: 'Crown',
        transform: text => {
            return '👑 ' + text + ' 👑';
        },
        pure: true,
        tags: ['crown', 'frame', 'gamer']
    },
    {
        name: 'Royal Script',
        category: 'Crown',
        transform: text => {
            const map = {
                'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗',
                'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟',
                'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧',
                'Y': '𝓨', 'Z': '𝓩',
                'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱',
                'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹',
                'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁',
                'y': '𝔂', 'z': '𝔃'
            };
            return '👑➤ ' + applyMap(text, map) + ' ➤👑';
        },
        tags: ['crown', 'cursive', 'readable', 'safe']
    },
    {
        name: 'King Bold',
        category: 'Crown',
        transform: text => {
            const map = {
                'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱', 'G': '𝕲', 'H': '𝕳',
                'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹', 'O': '𝕺', 'P': '𝕻',
                'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁', 'W': '𝖂', 'X': '𝖃',
                'Y': '𝖄', 'Z': '𝖅',
                'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍',
                'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕',
                'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝',
                'y': '𝖞', 'z': '𝖟'
            };
            return '⎝⎝✧KING✧⎠⎠ ' + applyMap(text, map) + ' ⎝⎝✧KING✧⎠⎠';
        },
        tags: ['crown', 'gamer', 'dark', 'readable']
    },
    {
        name: 'Emperor',
        category: 'Crown',
        transform: text => {
            return '◥꧁ད ' + text + ' ཌ꧂◤';
        },
        pure: true,
        tags: ['crown', 'frame', 'gamer']
    },

    // ══════════════════════════════════════
    // FLIP & MIRROR
    // ══════════════════════════════════════
    {
        name: 'Flip Upside Down',
        category: 'Flip & Mirror',
        map: {
            'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
            'i': 'ı', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
            'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
            'y': 'ʎ', 'z': 'z',
            'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H',
            'I': 'I', 'J': 'ɾ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ',
            'Q': 'Q', 'R': 'ᴚ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X',
            'Y': '⅄', 'Z': 'Z'
        },
        tags: ['flip', 'fun', 'readable', 'safe']
    },
    {
        name: 'Mirror Reverse',
        category: 'Flip & Mirror',
        transform: text => {
            const map = {
                'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'ʇ', 'g': 'ϱ', 'h': 'ʜ',
                'i': 'i', 'j': 'į', 'k': 'ʞ', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'q',
                'q': 'p', 'r': 'ɿ', 's': 'ƨ', 't': 'ƚ', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x',
                'y': 'y', 'z': 'ƹ',
                'A': 'A', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ꟻ', 'G': 'Ꮁ', 'H': 'H',
                'I': 'I', 'J': 'Ⴑ', 'K': 'ꓘ', 'L': '⅃', 'M': 'M', 'N': 'И', 'O': 'O', 'P': 'ꟼ',
                'Q': 'Ϙ', 'R': 'Я', 'S': 'Ƨ', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X',
                'Y': 'Y', 'Z': 'Ƹ'
            };
            return applyMap(text, map);
        },
        tags: ['flip', 'fun', 'readable', 'safe']
    },
    {
        name: 'Reverse Order',
        category: 'Flip & Mirror',
        transform: text => {
            return toGraphemes(text || '').reverse().join('');
        },
        tags: ['flip', 'fun', 'readable']
    },

    // ══════════════════════════════════════
    // SQUIGGLE / WAVE
    // ══════════════════════════════════════
    {
        name: 'Wave Mark',
        category: 'Squiggle',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u0330' : ch;
            }
            return out;
        },
        tags: ['squiggle', 'aesthetic', 'readable']
    },
    {
        name: 'Zigzag',
        category: 'Squiggle',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u035C' : ch;
            }
            return out;
        },
        tags: ['squiggle', 'aesthetic', 'readable']
    },
    {
        name: 'Spiral',
        category: 'Squiggle',
        transform: text => {
            let i = 0;
            const marks = ['\u0330', '\u032D', '\u0331', '\u032E'];
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + marks[i++ % marks.length] : ch;
            }
            return out;
        },
        tags: ['squiggle', 'aesthetic', 'readable']
    },
    {
        name: 'Curly Bold',
        category: 'Squiggle',
        transform: text => {
            const map = {
                'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
                'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
                'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
                'Y': '𝗬', 'Z': '𝗭',
                'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
                'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
                'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
                'y': '𝘆', 'z': '𝘇'
            };
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                const m = map[ch] || ch;
                out += isLetterOrDigit(ch) ? m + '\u0330' : ch;
            }
            return out;
        },
        tags: ['squiggle', 'bold', 'readable']
    },

    // ══════════════════════════════════════
    // BEAUTIFUL / FLORAL
    // ══════════════════════════════════════
    {
        name: 'Floral Script',
        category: 'Beautiful',
        transform: text => {
            const map = {
                'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ',
                'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫',
                'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳',
                'Y': '𝒴', 'Z': '𝒵',
                'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽',
                'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅',
                'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
                'y': '𝓎', 'z': '𝓏'
            };
            return '❀ ' + applyMap(text, map) + ' ❀';
        },
        tags: ['beautiful', 'aesthetic', 'cursive', 'readable', 'safe']
    },
    {
        name: 'Blossom',
        category: 'Beautiful',
        transform: text => {
            let out = '';
            for (const ch of toGraphemes(text || '')) {
                out += isLetterOrDigit(ch) ? ch + '\u030A' : ch;
            }
            return '🌸 ' + out + ' 🌸';
        },
        tags: ['beautiful', 'aesthetic', 'cute', 'readable']
    },
    {
        name: 'Butterfly',
        category: 'Beautiful',
        transform: text => {
            const map = {
                'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗',
                'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟',
                'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧',
                'Y': '𝓨', 'Z': '𝓩',
                'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱',
                'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹',
                'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁',
                'y': '𝔂', 'z': '𝔃'
            };
            return '🦋 ' + applyMap(text, map) + ' 🦋';
        },
        tags: ['beautiful', 'cursive', 'aesthetic', 'readable', 'safe']
    },
    {
        name: 'Elegant Serif',
        category: 'Beautiful',
        map: {
            'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻',
            'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃',
            'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋',
            'Y': '𝑌', 'Z': '𝑍',
            'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ',
            'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝',
            'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥',
            'y': '𝑦', 'z': '𝑧'
        },
        tags: ['beautiful', 'italic', 'readable', 'safe']
    },

    // ══════════════════════════════════════
    // UGLY / CRAZY ZALGO
    // ══════════════════════════════════════
    {
        name: 'Zalgo Light',
        category: 'Ugly',
        transform: text => applyCombining(text, [
            '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0306', '\u0307', '\u0308',
            '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u0310', '\u0311'
        ], 1, 3),
        tags: ['glitch', 'ugly', 'unreadable']
    },
    {
        name: 'Zalgo Heavy',
        category: 'Ugly',
        transform: text => applyCombining(text, [
            '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310',
            '\u0352', '\u0357', '\u0358', '\u0325', '\u0324', '\u0323', '\u0326', '\u032e',
            '\u0330', '\u0331', '\u0332', '\u0333', '\u0334', '\u0335', '\u0336', '\u034f',
            '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0361', '\u0362'
        ], 4, 12),
        tags: ['glitch', 'ugly', 'unreadable']
    },
    {
        name: 'Chaos',
        category: 'Ugly',
        transform: text => applyCombining(text, [
            '\u0300', '\u0301', '\u0308', '\u030A', '\u0332', '\u0336', '\u0337',
            '\u0307', '\u0323', '\u0331'
        ], 2, 5),
        tags: ['glitch', 'ugly', 'unreadable']
    },
    {
        name: 'Unstable',
        category: 'Ugly',
        transform: text => {
            const glitch = ['\u0336', '\u0337', '\u0338'];
            let out = '';
            let i = 0;
            for (const ch of toGraphemes(text || '')) {
                if (isLetterOrDigit(ch)) {
                    out += ch + glitch[i++ % glitch.length];
                } else {
                    out += ch;
                }
            }
            return out;
        },
        tags: ['glitch', 'readable', 'safe']
    },

    // ══════════════════════════════════════
    // MOOD / KAOMOJI FRAMES
    // ══════════════════════════════════════
    {
        name: 'Angry Kaomoji',
        category: 'Mood',
        transform: text => {
            return '(ง ͠° ͟ل͜ ͡°)ง ' + text + ' 💢';
        },
        pure: true,
        tags: ['mood', 'gamer', 'frame']
    },
    {
        name: 'Happy Kaomoji',
        category: 'Mood',
        transform: text => {
            return '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ' + text + ' ✧ﾟ･:*';
        },
        pure: true,
        tags: ['mood', 'cute', 'frame']
    },
    {
        name: 'Sad Kaomoji',
        category: 'Mood',
        transform: text => {
            return '(ಥ_ಥ) ' + text + ' ･ω･';
        },
        pure: true,
        tags: ['mood', 'cute', 'frame']
    },
    {
        name: 'Cool Kaomoji',
        category: 'Mood',
        transform: text => {
            return '(•̀ᴗ•́)و ★ ' + text + ' ★';
        },
        pure: true,
        tags: ['mood', 'cute', 'frame']
    },

    // ══════════════════════════════════════
    // BOXED / SQUARE
    // ══════════════════════════════════════
    {
        name: 'Squared Caps',
        category: 'Boxed',
        map: {
            'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷',
            'I': '🄸', 'J': '🄹', 'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿',
            'Q': '🅀', 'R': '🅁', 'S': '🅂', 'T': '🅃', 'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇',
            'Y': '🅈', 'Z': '🅉',
            'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷',
            'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿',
            'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇',
            'y': '🅈', 'z': '🅉'
        },
        tags: ['boxed', 'clean', 'readable', 'safe']
    },
    {
        name: 'Filled Box',
        category: 'Boxed',
        map: {
            'A': '🅐', 'B': '🅑', 'C': '🅒', 'D': '🅓', 'E': '🅔', 'F': '🅕', 'G': '🅖', 'H': '🅗',
            'I': '🅘', 'J': '🅙', 'K': '🅚', 'L': '🅛', 'M': '🅜', 'N': '🅝', 'O': '🅞', 'P': '🅟',
            'Q': '🅠', 'R': '🅡', 'S': '🅢', 'T': '🅣', 'U': '🅤', 'V': '🅥', 'W': '🅦', 'X': '🅧',
            'Y': '🅨', 'Z': '🅩',
            'a': '🅐', 'b': '🅑', 'c': '🅒', 'd': '🅓', 'e': '🅔', 'f': '🅕', 'g': '🅖', 'h': '🅗',
            'i': '🅘', 'j': '🅙', 'k': '🅚', 'l': '🅛', 'm': '🅜', 'n': '🅝', 'o': '🅞', 'p': '🅟',
            'q': '🅠', 'r': '🅡', 's': '🅢', 't': '🅣', 'u': '🅤', 'v': '🅥', 'w': '🅦', 'x': '🅧',
            'y': '🅨', 'z': '🅩'
        },
        tags: ['boxed', 'clean', 'readable', 'safe']
    },
    {
        name: 'Corner Frame',
        category: 'Boxed',
        transform: text => {
            return '⌜' + text + '⌝';
        },
        pure: true,
        tags: ['boxed', 'frame', 'clean']
    },

    // ══════════════════════════════════════
    // BOLD VARIANTS
    // ══════════════════════════════════════
    {
        name: 'Ultra Bold',
        category: 'Bold',
        map: {
            'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
            'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
            'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
            'Y': '𝗬', 'Z': '𝗭',
            'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
            'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
            'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
            'y': '𝘆', 'z': '𝘇'
        },
        tags: ['bold', 'clean', 'readable', 'safe']
    },
    {
        name: 'Bold Italic',
        category: 'Bold',
        map: {
            'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯',
            'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷',
            'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿',
            'Y': '𝒀', 'Z': '𝒁',
            'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉',
            'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑',
            'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙',
            'y': '𝒚', 'z': '𝒛'
        },
        tags: ['bold', 'italic', 'readable', 'safe']
    },
    {
        name: 'Bold Script',
        category: 'Bold',
        map: {
            'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗',
            'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟',
            'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧',
            'Y': '𝓨', 'Z': '𝓩',
            'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱',
            'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹',
            'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁',
            'y': '𝔂', 'z': '𝔃'
        },
        tags: ['bold', 'cursive', 'readable', 'safe']
    },
    {
        name: 'Sans Bold',
        category: 'Bold',
        map: {
            'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃',
            'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋',
            'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓',
            'Y': '𝙔', 'Z': '𝙕',
            'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝',
            'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥',
            'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭',
            'y': '𝙮', 'z': '𝙯'
        },
        tags: ['bold', 'italic', 'readable', 'safe']
    },

];

const styles = [...BASE_STYLES, ...REMIX_STYLES, ...EXTRA_STYLES];
window.applyMap = applyMap;
window.applyCombining = applyCombining;
window.styles = window.styles ? [...window.styles, ...styles] : styles;
