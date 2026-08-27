/* fonts-freaky-text.js — page slug: freaky-text (freaky-text.html)
 * Load order: must load AFTER fonts-core.js (uses its toGraphemes,
 * isLetterOrDigit, sanitizeVisible, makeRemixStyle globals).
 * Total styles: 23.
 *
 * Freaky Chaos Case / Freaky Vowel Drag / Freaky Stutter are seeded off
 * hashText(input) rather than Math.random() -- this is intentional, not
 * a bug: stable output per input text is the intended UX for these three,
 * confirmed and kept as-is during review.
 */
(function () {

  function seededRandom(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashText(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function spaceOut(text, sep, wordGap) {
    if (!text) return text;
    const parts = toGraphemes(text);
    let out = '';
    for (let i = 0; i < parts.length; i++) {
      const ch = parts[i];
      if (/\s/.test(ch)) { out += wordGap; continue; }
      out += ch;
      const next = parts[i + 1];
      if (next !== undefined && !/\s/.test(next)) out += sep;
    }
    return out;
  }

  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const az = 'abcdefghijklmnopqrstuvwxyz';
  const d10 = '0123456789';

  function buildMap(upperStr, lowerStr, digitStr) {
    const m = {};
    const U = Array.from(upperStr || '');
    const L = Array.from(lowerStr || '');
    const D = Array.from(digitStr || '');
    for (let i = 0; i < 26; i++) {
      if (U[i]) m[AZ[i]] = U[i];
      if (L[i]) m[az[i]] = L[i];
    }
    for (let i = 0; i < 10; i++) if (D[i]) m[d10[i]] = D[i];
    return m;
  }

  function applyCharMap(text, map) {
    return toGraphemes(text).map(ch => map[ch] ?? ch).join('');
  }

  function weaveMarks(text, marks, rand, chance) {
    return toGraphemes(text).map((ch, i) => {
      if (!isLetterOrDigit(ch)) return ch;
      if (rand() > chance) return ch;
      return ch + marks[i % marks.length];
    }).join('');
  }

  const MAX_LEN = 256;
  function clampLen(s) { return s.length > MAX_LEN ? s.slice(0, MAX_LEN) : s; }

  const FULLWIDTH_UP = 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ';
  const FULLWIDTH_LO = 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ';
  const FULLWIDTH_D  = '０１２３４５６７８９';

  const BOLDSANS_UP = '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭';
  const BOLDSANS_LO = '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇';
  const BOLDSANS_D  = '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵';

  const MONO_UP = '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉';
  const MONO_LO = '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣';
  const MONO_D  = '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿';

  const SCRIPT_UP = '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵';
  const SCRIPT_LO = '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏';

  const MAP_BOLDSANS  = buildMap(BOLDSANS_UP, BOLDSANS_LO, BOLDSANS_D);
  const MAP_MONO      = buildMap(MONO_UP, MONO_LO, MONO_D);
  const MAP_SCRIPT    = buildMap(SCRIPT_UP, SCRIPT_LO, '');

  /* Separator/mark codepoints are built via String.fromCharCode rather than
   * \uXXXX literals -- avoids the manual-retype transcription errors this
   * file's escapes caused earlier in review; runtime-identical either way. */
  const HAIR  = String.fromCharCode(0x200A);
  const THIN  = String.fromCharCode(0x2009);
  const SPACE = String.fromCharCode(0x0020);
  const EN    = String.fromCharCode(0x2002);
  const EM    = String.fromCharCode(0x2003);
  const DOT   = String.fromCharCode(0x00B7);
  const ARROW = String.fromCharCode(0x2192);

  function mk(name, transform) {
    return { name: name, category: 'Freaky Extended', transform: transform, tags: ['freaky', 'spaced'] };
  }

  function freakyExpand(t) {
    if (!t) return t;
    const ladder = [HAIR, THIN, SPACE, EN, EM];
    const parts = toGraphemes(t);
    let out = '';
    let idx = 0;
    for (let i = 0; i < parts.length; i++) {
      const ch = parts[i];
      if (/\s/.test(ch)) { out += EM; idx = 0; continue; }
      out += ch;
      const next = parts[i + 1];
      if (next !== undefined && !/\s/.test(next)) {
        out += ladder[idx % ladder.length];
        idx++;
      }
    }
    return out;
  }

  function freakyVowelDrag(t) {
    if (!t) return t;
    const rand = seededRandom(hashText(t) ^ 0x27D4EB2F);
    const parts = toGraphemes(t);
    let out = '';
    for (let i = 0; i < parts.length; i++) {
      const ch = parts[i];
      out += ch;
      if (/[aeiouAEIOU]/.test(ch) && rand() < 0.6) {
        out += ch.repeat(1 + Math.floor(rand() * 2));
      }
    }
    return clampLen(out);
  }

  function freakyStutter(t) {
    if (!t) return t;
    const rand = seededRandom(hashText(t) ^ 0x165667B1);
    const words = t.split(' ');
    const out = words.map(function (w) {
      if (!w) return w;
      const first = Array.from(w)[0];
      if (/[a-zA-Z]/.test(first) && rand() < 0.7) return first + '-' + w;
      return w;
    }).join(' ');
    return clampLen(out);
  }

  const SPACING_STYLES = [
    mk('Freaky Spaced', function (t) { return spaceOut(t, SPACE, EM); }),
    mk('Freaky Thin Space', function (t) { return spaceOut(t, THIN, EN); }),
    mk('Freaky Wide Gap', function (t) { return spaceOut(t, EN, EM + EM); }),
    mk('Freaky Dot Split', function (t) { return spaceOut(t, DOT, SPACE); }),
    mk('Freaky Underscore Link', function (t) { return spaceOut(t, '_', SPACE); }),
    mk('Freaky Arrow Chain', function (t) { return spaceOut(t, ARROW, SPACE); }),
    mk('Freaky Pipe Split', function (t) { return spaceOut(t, '|', ' '); }),
    mk('Freaky Expand', freakyExpand),
  ];

  const CASE_STYLES = [
    mk('Freaky Mocking', function (t) {
      let flip = false;
      return toGraphemes(t).map(function (ch) {
        if (!/[a-zA-Z]/.test(ch)) return ch;
        flip = !flip;
        return flip ? ch.toLowerCase() : ch.toUpperCase();
      }).join('');
    }),
    mk('Freaky Chaos Case', function (t) {
      const rand = seededRandom(hashText(t) ^ 0x9E3779B9);
      return toGraphemes(t).map(function (ch) {
        if (!/[a-zA-Z]/.test(ch)) return ch;
        return rand() < 0.5 ? ch.toLowerCase() : ch.toUpperCase();
      }).join('');
    }),
    mk('Freaky Spaced Caps', function (t) { return spaceOut(t.toUpperCase(), THIN, EN); }),
  ];

  const CORRUPT_STYLES = [
    mk('Freaky Slash', function (t) {
      const rand = seededRandom(hashText(t) ^ 0x2545F491);
      return sanitizeVisible(weaveMarks(t, [String.fromCharCode(0x0338)], rand, 0.8));
    }),
    mk('Freaky Static', function (t) {
      const rand = seededRandom(hashText(t) ^ 0x85EBCA6B);
      const marks = [String.fromCharCode(0x0301), String.fromCharCode(0x0316), String.fromCharCode(0x0300), String.fromCharCode(0x0317)];
      return sanitizeVisible(weaveMarks(t, marks, rand, 0.55));
    }),
  ];

  const SYMBOL_STYLES = [
    makeRemixStyle({ name: 'Freaky Sparkle', category: 'Freaky Extended', frame: { pre: '✧', post: '✧' }, bases: { upper: 'SCRIPT', lower: 'SCRIPT' }, overrides: {}, palette: ['✧', '✦', '⋆', '˚', '·'], micro: { dotVowels: true, symbolChance: 0.5 } }),
    makeRemixStyle({ name: 'Freaky Star Frame', category: 'Freaky Extended', frame: { pre: '⋆｡°', post: '°｡⋆' }, bases: { upper: 'DOUBLE', lower: 'DOUBLE' }, overrides: {}, palette: ['✩', '✧', '⋆', '˚'], micro: { dotVowels: true, symbolChance: 0.45 } }),
    makeRemixStyle({ name: 'Freaky Bracket', category: 'Freaky Extended', frame: { pre: '꒰', post: '꒱' }, bases: { upper: 'FULL', lower: 'FULL' }, overrides: {}, palette: ['·', '˚', '✿'], micro: { symbolChance: 0.35 } }),
    makeRemixStyle({ name: 'Freaky Chaos Mark', category: 'Freaky Extended', frame: { pre: '⚡', post: '⚡' }, bases: { upper: 'MONO', lower: 'MONO' }, overrides: {}, palette: ['⚡', '✦', '◈', '▸'], micro: { slash: true, symbolChance: 0.5 } }),
    makeRemixStyle({ name: 'Freaky Heart', category: 'Freaky Extended', frame: { pre: '♡', post: '♡' }, bases: { upper: 'SCRIPT', lower: 'SCRIPT' }, overrides: {}, palette: ['♡', '˚', '✧', '·'], micro: { dotVowels: true, symbolChance: 0.5 } }),
  ];

  const COMBO_STYLES = [
    mk('Freaky Cursive Spaced', function (t) { return spaceOut(applyCharMap(t, MAP_SCRIPT), THIN, EN); }),
    mk('Freaky Bold Spaced', function (t) { return spaceOut(applyCharMap(t, MAP_BOLDSANS), THIN, EN); }),
    mk('Freaky Mono Spaced', function (t) { return spaceOut(applyCharMap(t, MAP_MONO), HAIR, THIN); }),
  ];

  const REPEAT_STYLES = [
    mk('Freaky Vowel Drag', freakyVowelDrag),
    mk('Freaky Stutter', freakyStutter),
  ];

  var FREAKY_EXTENDED = []
    .concat(SPACING_STYLES)
    .concat(CASE_STYLES)
    .concat(CORRUPT_STYLES)
    .concat(SYMBOL_STYLES)
    .concat(COMBO_STYLES)
    .concat(REPEAT_STYLES);

  window.styles = (window.styles || []).concat(FREAKY_EXTENDED);

})();
