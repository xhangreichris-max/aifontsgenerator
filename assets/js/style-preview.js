/* style-preview.js — reusable canvas font preview component ("ink studio")
 * All page-specific config comes from data attributes on #style-preview.
 * Shared state lives on window.StylePreviewState so later features (Month 2)
 * can read/extend it without another rewrite.
 */
(function () {
  'use strict';

  /* ── Seeded RNG — same text/font/preset always renders identically ──────
   * mulberry32 generator seeded via an FNV-1a string hash. */
  var __seed = 123456;
  function setSeed(s) {
    var h = 2166136261;
    s = String(s == null ? '' : s);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    __seed = (h >>> 0) || 1;
  }
  function rnd() {
    var t = __seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  var rr = function (a, b) { return a + rnd() * (b - a); };
  var pick = function (a) { return a[Math.floor(rnd() * a.length)] || a[0]; };
  var clamp = function (n, a, b) { return Math.max(a, Math.min(b, n)); };

  var WATERMARK_TEXT = '✦ aifontsgenerator.com ✦';
  var CANVAS_W = 560;
  var CANVAS_H = 220;

  // Chicano-only "proof sheet" canvas — every other style page built from
  // this shared file keeps the 560×220 canvas above untouched.
  var CHICANO_CANVAS_W = 640;
  var CHICANO_CANVAS_H = 400;

  var BG_MODE_LABELS = {
    paper: 'Paper',
    transfer: 'Transfer',
    flash: 'Flash Sheet',
    velvet: 'Velvet',
    skin: 'Skin'
  };

  var INK_COLORS = [
    {
      key: 'classic',
      label: 'Classic',
      dot: '#2B2B33',
      inkColor: '#2B2B33',
      bleedColor: 'rgba(28, 22, 40, 0.28)',
      paperStroke: '#2B2B33',
      skinAlpha: 0.88
    },
    {
      key: 'blood',
      label: 'Blood Red',
      dot: '#7A1F1F',
      inkColor: '#7A1F1F',
      bleedColor: 'rgba(80, 15, 15, 0.28)',
      paperStroke: '#7A1F1F',
      skinAlpha: 0.85
    },
    {
      key: 'gold',
      label: 'Gold',
      dot: '#B8912F',
      inkColor: '#B8912F',
      bleedColor: 'rgba(100, 75, 20, 0.22)',
      paperStroke: '#B8912F',
      skinAlpha: 0.82,
      paperLineWidth: 2.4,
      skipShadowOnPaper: true
    },
    {
      key: 'white',
      label: 'White',
      dot: '#F2E8DC',
      inkColor: '#F2E8DC',
      bleedColor: 'rgba(200, 190, 175, 0.20)',
      paperStroke: '#F2E8DC',
      paperOuterStroke: '#999999',
      skinAlpha: 0.92,
      isWhite: true
    },
    {
      key: 'navy',
      label: 'Navy',
      dot: '#1A2B5C',
      inkColor: '#1A2B5C',
      bleedColor: 'rgba(15, 22, 55, 0.30)',
      paperStroke: '#1A2B5C',
      skinAlpha: 0.87
    },
    {
      key: 'forest',
      label: 'Forest',
      dot: '#1A4A2E',
      inkColor: '#1A4A2E',
      bleedColor: 'rgba(12, 40, 22, 0.28)',
      paperStroke: '#1A4A2E',
      skinAlpha: 0.85
    },
    {
      key: 'smoke',
      label: 'Smoke',
      dot: '#5A5A6A',
      inkColor: '#5A5A6A',
      bleedColor: 'rgba(50, 50, 65, 0.22)',
      paperStroke: '#5A5A6A',
      skinAlpha: 0.80
    },
    {
      key: 'sepia',
      label: 'Sepia',
      dot: '#6B4423',
      inkColor: '#6B4423',
      bleedColor: 'rgba(60, 35, 15, 0.26)',
      paperStroke: '#6B4423',
      skinAlpha: 0.83
    }
  ];

  function getInkColor(key) {
    for (var i = 0; i < INK_COLORS.length; i++) {
      if (INK_COLORS[i].key === key) return INK_COLORS[i];
    }
    return INK_COLORS[0];
  }

  var VIBE_MAP = {
    'old english': 'BLACKLETTER',
    'script': 'SCRIPT',
    'display': 'DISPLAY',
    'serif': 'SERIF'
  };

  // Local (non-Google-Fonts) TTFs — license-cleared subset only. Each
  // filename maps to a single named bucket, which becomes the card's
  // "category"/vibe-tag directly (already matches the vibe-tag vocabulary
  // used by the Google-Fonts cards, e.g. "Script"/"Serif").
  var LOCAL_FONT_BUCKETS = [
    { name: 'Script', pattern: /brock/i },
    { name: 'Serif', pattern: /crimson/i },
    { name: 'Medieval', pattern: /dragon/i }
  ];

  var LOCAL_FONT_NAMES = {
    'BrockScript.ttf': 'Brock Script',
    'crimson-italic-webfont.ttf': 'Crimson Italic',
    'dragonwi.ttf': 'Dragonwick'
  };

  /* ── Artist Remix (Unicode substitution + combining marks) ───────────────
   * Glyph data is hand-verified clean Unicode (not copy-pasted from any
   * mojibake'd source). Only the "chicano" bucket is used on this page;
   * the rest ship for reuse by future style pages. */
  var GLYPH_POOLS = {
    chicano: {
      a: ['á','à','â','ä'],
      e: ['é','è','ê','ë'],
      i: ['í','ì','î','ï'],
      o: ['ó','ò','ô','ö','ø'],
      u: ['ú','ù','û','ü'],
      s: ['ś','š'],
      n: ['ń','ň'],
      r: ['ŕ','ř'],
      y: ['ý','ÿ'],
      f: ['ƒ']
    },
    gothic: {
      A: ['Ⱥ','Á','Â','Ä'],
      E: ['Ė','Ê','Ë','È'],
      I: ['Í','Ï','Ì','Ī'],
      O: ['Ø','Ö','Ô','Ò'],
      U: ['Ů','Ü','Û','Ù'],
      S: ['Ś','Š','Ṣ'],
      T: ['Ŧ','Ț','Ṯ'],
      H: ['Ħ','Ḥ'],
      N: ['Ń','Ň'],
      R: ['Ŕ','Ř']
    },
    trad: {
      A: ['Á','À'], O: ['Ö','Ø'],
      S: ['Ś'], E: ['È','Ë'], T: ['Ŧ']
    },
    ritual: {
      A: ['Ā','Ⱥ'], E: ['Ē','Ė'], I: ['Ī','Í'],
      O: ['Ō','Ø'], U: ['Ū','Ů'], N: ['Ŋ','Ń'],
      S: ['Ṣ','Š'], T: ['Ŧ','Ț'], R: ['Ř','Ŕ']
    },
    horror: {
      A: ['Å','Ⱥ','Ä'], E: ['Ě','Ë','Ę'],
      I: ['Ï','Į'], O: ['Ø','Ö'],
      S: ['Š','Ș'], T: ['Ŧ','Ț'], X: ['Ẍ']
    },
    fineline: {
      A: ['À'], E: ['È'], I: ['Ì'],
      O: ['Ò'], U: ['Ù']
    }
  };
  var COMBINING_SOFT   = ['̄', '̇'];
  var COMBINING_SHARP  = ['́', '̀'];
  var COMBINING_RUGGED = ['̶', '̸'];

  function compileUnicode(text, style, level01) {
    var pool = GLYPH_POOLS[style] || {};
    var marks = (style === 'horror')
      ? COMBINING_SOFT.concat(COMBINING_SHARP, COMBINING_RUGGED)
      : COMBINING_SOFT.concat(COMBINING_SHARP);

    var chars = Array.from(String(text == null ? '' : text));
    var intensity = clamp(level01, 0, 1);

    return chars.map(function (ch) {
      if (ch === ' ') return ch;

      var upper = ch.toUpperCase();
      var lower = ch.toLowerCase();
      var key = pool[upper] ? upper : (pool[lower] ? lower : null);
      var out = ch;

      if (key && rnd() < (0.08 + intensity * 0.62)) out = pick(pool[key]);

      var markChance = (0.01 + intensity * 0.08) * (style === 'horror' ? 1.2 : 1.0);
      if (rnd() < markChance && /[A-Za-z]/.test(out)) {
        out = out + pick(marks);
        if (intensity > 0.75 && rnd() < 0.35) out = out + pick(marks);
      }
      return out;
    }).join('').normalize('NFC');
  }

  /* ── Live unicode-cluster converter (unicode-clusters-section) ───────────
   * Codepoint-offset math over the Mathematical Alphanumeric Symbols block,
   * not literal maps — with the small set of reserved-hole exceptions that
   * fall back to the legacy Letterlike Symbols block. Only mobile-safe
   * ranges are used (Math Alphanumeric U+1D400-U+1D7FF, Fullwidth, IPA/
   * Phonetic Extensions small caps, Circled Latin) — all broadly supported
   * since Android 7 / iOS 10. */
  var UNI = (function () {
    var RANGES = {
      script:         [0x1D49C, 0x1D4B6],
      boldscript:     [0x1D4D0, 0x1D4EA],
      fraktur:        [0x1D504, 0x1D51E],
      boldfraktur:    [0x1D56C, 0x1D586],
      boldsans:       [0x1D5D4, 0x1D5EE],
      bold:           [0x1D400, 0x1D41A],
      italic:         [0x1D434, 0x1D44E],
      bolditalic:     [0x1D468, 0x1D482],
      sansitalic:     [0x1D608, 0x1D622],
      sansbolditalic: [0x1D63C, 0x1D656],
      doublestruck:   [0x1D538, 0x1D552],
      monospaceuni:   [0x1D670, 0x1D68A]
    };

    // Reserved holes in the plain Script/Fraktur/Double-Struck/Italic
    // blocks — these codepoints don't exist in the math blocks, so use the
    // legacy Letterlike Symbols equivalents instead. The bold variants of
    // each block have no such holes.
    var EXCEPTIONS = {
      script: {
        'B': 'ℬ', 'E': 'ℰ', 'F': 'ℱ',
        'H': 'ℋ', 'I': 'ℐ', 'L': 'ℒ',
        'M': 'ℳ', 'R': 'ℛ',
        'e': 'ℯ', 'g': 'ℊ', 'o': 'ℴ'
      },
      fraktur: {
        'C': 'ℭ', 'H': 'ℌ', 'I': 'ℑ',
        'R': 'ℜ', 'Z': 'ℨ'
      },
      doublestruck: {
        'C': 'ℂ', 'H': 'ℍ', 'N': 'ℕ',
        'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'Z': 'ℤ'
      },
      italic: {
        'h': 'ℎ'
      }
    };

    var SMALLCAPS = {
      a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ',
      h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
      o: 'ᴏ', p: 'ᴘ', q: 'Q', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ',
      v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
    };

    // Lowercase-only, regardless of input case (matches smallcaps'
    // behavior) — there is no dedicated uppercase circled-Latin block in
    // wide mobile use, so capitalized names still read as lowercase dots.
    var CIRCLED_LOWER = 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ';

    // IPA-style upside-down flips — reversed at the string level in
    // convert(), so this only needs single-char substitutions.
    var MIRROR_FLIP = {
      a:'ɐ', b:'q', c:'ɔ', d:'p', e:'ǝ', f:'ɟ', g:'ɓ', h:'ɥ', i:'ᴉ',
      j:'ɾ', k:'ʞ', l:'l', m:'ɯ', n:'u', o:'o', p:'d', q:'b', r:'ɹ',
      s:'s', t:'ʇ', u:'n', v:'ʌ', w:'ʍ', x:'x', y:'ʎ', z:'z',
      A:'∀', B:'q', C:'Ɔ', D:'p', E:'Ǝ', F:'Ⅎ', G:'פ', H:'H', I:'I',
      J:'ɾ', K:'ʞ', L:'˥', M:'W', N:'N', O:'O', P:'d', Q:'Q', R:'ɹ',
      S:'S', T:'┴', U:'∩', V:'Λ', W:'M', X:'X', Y:'⅄', Z:'Z'
    };

    // Genuine combining diacritical marks only (General Category Mn) — the
    // brief's own draft mixed in two precomposed Latin-Extended-B letters
    // (U+022F, U+0229), which aren't combining marks and would render as a
    // doubled glyph next to the base letter instead of overlaid on it.
    var Z_MARKS = ['̀', '́', '̂', '̇'];

    function mapChar(ch, style) {
      var code = ch.codePointAt(0);

      if (style === 'fullwidth') {
        if (ch === ' ') return '　';
        if (code >= 0x21 && code <= 0x7E) return String.fromCodePoint(code + 0xFEE0);
        return ch;
      }

      if (style === 'smallcaps') {
        return SMALLCAPS[ch.toLowerCase()] || ch;
      }

      if (style === 'circled') {
        var lowerCode = ch.toLowerCase().codePointAt(0);
        if (lowerCode >= 97 && lowerCode <= 122) return CIRCLED_LOWER[lowerCode - 97];
        return ch;
      }

      var ex = EXCEPTIONS[style];
      if (ex && ex[ch]) return ex[ch];

      var range = RANGES[style];
      if (!range) return ch;
      if (code >= 65 && code <= 90) return String.fromCodePoint(range[0] + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(range[1] + (code - 97));
      return ch; // digits, spaces, symbols pass through
    }

    function convert(text, style) {
      var safeText = String(text == null ? '' : text);

      // String-level transforms (not per-char codepoint offsets).
      if (style === 'spaced') {
        return Array.from(safeText.toUpperCase()).join(' ');
      }

      if (style === 'mirror') {
        return Array.from(safeText).reverse().map(function (ch) {
          return MIRROR_FLIP[ch] || ch;
        }).join('');
      }

      if (style === 'zalgo') {
        return Array.from(safeText).map(function (ch, i) {
          var code = ch.codePointAt(0);
          var isLetter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
          return isLetter ? (ch + Z_MARKS[i % Z_MARKS.length]) : ch;
        }).join('');
      }

      return Array.from(safeText).map(function (ch) {
        return mapChar(ch, style);
      }).join('');
    }

    return { convert: convert };
  })();

  // Per-cluster ornament framing, applied after conversion when the
  // "Artist framing" toggle is checked.
  var CLUSTER_ORNAMENTS = {
    script:      function (t) { return '༺ ' + t + ' ༻'; },
    boldscript:  function (t) { return '♰ ' + t + ' ♰'; },
    fraktur:     function (t) { return '† ' + t + ' †'; },
    boldfraktur: function (t) { return '⛧ ' + t; },
    fullwidth:   function (t) { return t; },
    boldsans:    function (t) { return '▪ ' + t + ' ▪'; },
    smallcaps:   function (t) { return '· ' + t + ' ·'; }
  };

  /* Re-converts every tagged .cluster-sample. Each card has its own
   * data-signature name (e.g. "Sofia" for the script card) — while the
   * user text input is empty, cards show their own signature name instead
   * of a shared generic placeholder; typing overrides all of them with
   * the same converted text. The hardcoded per-card signature text baked
   * into the built HTML is the SEO fallback for Googlebot; this only
   * overwrites it client-side. */
  function updateUnicodeClusters() {
    var raw = State.text || '';
    var useSignature = raw.trim() === '';
    var toggle = document.getElementById('ornament-toggle');
    var ornaments = !!(toggle && toggle.checked);

    document.querySelectorAll('.cluster-sample[data-style]').forEach(function (el) {
      var style = el.dataset.style;
      var signature = el.dataset.signature || 'Your Name';
      var source = useSignature ? signature : raw;

      var out = UNI.convert(source, style);
      if (ornaments && CLUSTER_ORNAMENTS[style]) out = CLUSTER_ORNAMENTS[style](out);

      var span = el.querySelector('.sample-text');
      var btn = el.querySelector('.sample-copy-btn');
      if (span) span.textContent = out;
      if (btn) btn.dataset.text = out;
    });
  }

  // The ornament-toggle checkbox and every .cluster-sample's data-style
  // now ship as static markup in template-style.html — just wire the
  // existing checkbox's change event.
  function wireOrnamentToggle() {
    var toggle = document.getElementById('ornament-toggle');
    if (toggle) toggle.addEventListener('change', updateUnicodeClusters);
  }

  window.StylePreviewState = window.StylePreviewState || {
    text: 'Your Name',
    // bgMode replaces the old boolean skinMode — 'paper' | 'transfer' |
    // 'flash' | 'velvet' | 'skin'. The legacy 2-state Paper/Skin toggle
    // (mode-segmented, bottom-bar bb-paper/bb-skin) still works — it just
    // writes 'paper' or 'skin' into this same field (see setBgMode()).
    bgMode: 'paper',
    skinTone: 'medium', // 'light' | 'medium' | 'deep' — only used when bgMode === 'skin'
    inkPreset: 'classic'
  };
  var State = window.StylePreviewState;

  var container, pageSlug, showSkinToggle;
  /* Gate for chicano-only behavior (Chicano Studio redesign) — every other
   * style page built from this shared file must render exactly as before. */
  var isChicano = false;
  var debounceTimer = null;
  var cardEntries = [];
  /* Generic offscreen-canvas cache for every cacheable background (transfer
   * paper, flash sheet, velvet, skin-per-tone). Keyed by type+size+tone so
   * switching tone/size never serves a stale bitmap; never regenerated on
   * keystroke. Flat paper isn't cached — a single fillRect is cheap enough
   * to just redraw. */
  var bgCache = new Map();
  var revealObserver = null;
  var reduceMotion = null;

  /* Infinite-scroll state — single source of truth for the batched font
   * queue. `queue` is the full, ordered font list (from pages-config.json,
   * already sorted Script-first/Fine-Line-last); cards are appended in
   * `batchSize` chunks as the sentinel enters the viewport. */
  var IS = {
    queue: [],
    loadedCount: 0,
    batchSize: 4,
    loading: false,
    exhausted: false,
    observer: null,
    sentinel: null,
    indicator: null
  };

  /* metadataDensity() is keyed on the card's live CSS width, but nothing
   * re-renders when the browser window is resized (only text/ink/slider/
   * bg-selector interactions trigger renderAllLoaded()) — so if a user
   * resizes after load, the proof-sheet chrome density silently goes stale
   * until their next interaction. Chicano-only: every other page has no
   * width-dependent rendering, so a resize listener there would just be a
   * wasted re-render. Debounced since 'resize' fires continuously while
   * dragging a window edge. */
  function wireChicanoResizeRerender() {
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderAllLoaded, 200);
    }, { passive: true });
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */

  function init() {
    container = document.getElementById('style-preview');
    if (!container) return;

    pageSlug = container.dataset.slug || 'style';
    showSkinToggle = container.dataset.showSkin === 'true';
    var localFontsPath = container.dataset.localFontsPath || '';

    isChicano = pageSlug === 'chicano-font-generator';
    // First card load: 3 cards not 4 on chicano only — every other style
    // page keeps its existing batch size.
    if (isChicano) IS.batchSize = 3;

    buildFontQueue();
    if (!IS.queue.length) return;

    wireTextInput();
    buildInkChips();
    buildBottomInkRow();
    wireModeSegmented();
    wireBgSelector();
    wireBottomSurfaceControls();
    syncBottomBar();
    wireCardSliders();
    buildAISection();
    wireOrnamentToggle();
    updateUnicodeClusters();
    if (isChicano) {
      buildOflFooterBadge();
      wireChicanoResizeRerender();
    }

    loadGoogleFonts(IS.queue);

    loadLocalFonts(localFontsPath).then(function () {
      setupScrollObserver();
      return loadNextBatch();
    });
  }

  /* Parses the ordered font queue from data-fonts. Local (non-Google) fonts
   * are also listed here (name = the FontFace family registered in
   * loadLocalFonts, e.g. "Brock Script") so they take their configured
   * position in the queue instead of being appended after the fact. */
  function buildFontQueue() {
    try {
      IS.queue = JSON.parse(container.dataset.fonts || '[]');
    } catch (e) {
      IS.queue = [];
    }
  }

  /* Injects one combined Google Fonts <link> (weight 400+700) for every
   * source:"google" entry in the queue. Purely additive/non-blocking —
   * template-style.html's build-time {{STYLE_FONT_LINKS}} tag already
   * covers weight 400 for the same families; this just adds 700 and gives
   * ensureFontsReady() a document.fonts-visible face to check/load. */
  function loadGoogleFonts(fontConfigs) {
    var googleFonts = fontConfigs
      .filter(function (fc) { return fc.source === 'google'; })
      .map(function (fc) { return fc.name.replace(/ /g, '+'); });

    if (!googleFonts.length) return;

    var families = googleFonts.map(function (f) {
      return 'family=' + f + ':wght@400;700';
    }).join('&');

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?' + families + '&display=swap';
    document.head.appendChild(link);
  }

  /* Waits (up to 3s) for a batch's fonts to be usable before their cards
   * render, so a slow network shows the loading indicator instead of a
   * blank/fallback-font canvas. Never blocks forever — races the timeout. */
  function ensureFontsReady(fontConfigs) {
    var TIMEOUT_MS = 3000;
    var testText = 'Sofia';

    var checks = fontConfigs.map(function (fc) {
      var fontStr = '16px "' + fc.name + '"';
      if (document.fonts.check(fontStr, testText)) return Promise.resolve();
      return document.fonts.load(fontStr, testText).catch(function () {
        console.warn('Font load failed: ' + fc.name);
      });
    });

    return Promise.race([
      Promise.all(checks),
      new Promise(function (resolve) { setTimeout(resolve, TIMEOUT_MS); })
    ]);
  }

  /* Thin divider spanning all grid columns, inserted whenever the batch
   * crosses into a new font category. */
  function insertCategoryHeader(grid, category) {
    var el = document.createElement('div');
    el.className = 'cat-header';
    el.setAttribute('aria-label', category + ' font styles');
    el.textContent = '✦ ' + category.toUpperCase();
    grid.appendChild(el);
  }

  /* Loads the next `batchSize` fonts from the queue, waits for them to be
   * ready, then builds + renders their cards. Guarded by IS.loading so the
   * IntersectionObserver callback can never fire it twice concurrently. */
  function loadNextBatch() {
    IS.loading = true;
    if (IS.indicator) IS.indicator.style.display = 'block';

    var start = IS.loadedCount;
    var end = start + IS.batchSize;
    var nextFonts = IS.queue.slice(start, end);

    if (!nextFonts.length) {
      IS.exhausted = true;
      cleanupScroll();
      return Promise.resolve();
    }

    return ensureFontsReady(nextFonts).then(function () {
      var prevFont = IS.queue[start - 1];
      var firstFont = nextFonts[0];
      var firstCardIsFirstInCategory = (start === 0 || !prevFont || prevFont.category !== firstFont.category);
      if (firstCardIsFirstInCategory) {
        insertCategoryHeader(container, firstFont.category);
      }

      var newEntries = [];
      nextFonts.forEach(function (fontConfig, i) {
        var isFirstInCategory = (i === 0)
          ? firstCardIsFirstInCategory
          : (fontConfig.category !== nextFonts[i - 1].category);
        if (i > 0 && isFirstInCategory) {
          insertCategoryHeader(container, fontConfig.category);
        }
        var entry = buildCard(fontConfig, isFirstInCategory);
        cardEntries.push(entry);
        newEntries.push(entry);
        container.appendChild(entry.card);
        renderCard(entry.canvas, entry.font);
      });

      revealNewCards(newEntries);

      IS.loadedCount += nextFonts.length;

      if (IS.loadedCount >= IS.queue.length) {
        IS.exhausted = true;
        cleanupScroll();
      } else {
        if (IS.indicator) IS.indicator.style.display = 'none';
        IS.loading = false;
      }
    });
  }

  function cleanupScroll() {
    if (IS.observer) IS.observer.disconnect();
    if (IS.sentinel) { IS.sentinel.remove(); IS.sentinel = null; }
    if (IS.indicator) IS.indicator.style.display = 'none';
    IS.loading = false;
  }

  function setupScrollObserver() {
    IS.sentinel = document.getElementById('scroll-sentinel');
    IS.indicator = document.getElementById('load-indicator');
    if (!IS.sentinel) return;

    // Mobile loads batches closer to the viewport than desktop — checked
    // once at setup (matches how IS.batchSize is fixed at init, not
    // re-evaluated on resize).
    var isMobileViewport = window.innerWidth <= 768;

    IS.observer = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      if (!entry.isIntersecting) return;
      if (IS.loading) return;
      if (IS.exhausted) { cleanupScroll(); return; }
      loadNextBatch();
    }, {
      root: null,
      rootMargin: (isMobileViewport ? '200px' : '300px') + ' 0px',
      threshold: 0
    });

    IS.observer.observe(IS.sentinel);
  }

  /* AI "coming soon" card lives in its own section (outside the font grid)
   * and is unrelated to font batching — built once, up front. */
  function buildAISection() {
    var aiSection = document.getElementById('ai-teaser-section');
    if (!aiSection) return;
    var aiTitle = aiSection.dataset.aiTitle || 'AI Lettering';
    var aiSub = aiSection.dataset.aiSub || 'Real AI-generated lettering — coming soon';
    var aiCard = buildAICard(aiTitle, aiSub);
    aiSection.appendChild(aiCard);
    var entry = { card: aiCard };
    cardEntries.push(entry);
    revealNewCards([entry]);
  }

  /* Chicano only: the per-card OFL badge is removed (buildCard skips
   * appending it); this single footer note replaces it. Styled in
   * style-preview.css under the chicano-scoped block. */
  function buildOflFooterBadge() {
    var footer = document.querySelector('footer');
    if (!footer || footer.querySelector('.footer-ofl-badge')) return;
    var badge = document.createElement('div');
    badge.className = 'footer-ofl-badge';
    badge.textContent = 'OFL — All fonts free for commercial use';
    footer.appendChild(badge);
  }

  /* Sorts manifest filenames into named buckets by regex, e.g. so
   * "BrockScript.ttf" becomes a "Script"-category card and "dragonwi.ttf"
   * becomes a "Medieval"-category card. Unmatched filenames are dropped. */
  function buildLocalBuckets(manifestList) {
    var buckets = {};
    manifestList.forEach(function (filename) {
      var bucket = LOCAL_FONT_BUCKETS.find(function (b) {
        return b.pattern.test(filename);
      });
      if (!bucket) return;
      if (!buckets[bucket.name]) buckets[bucket.name] = [];
      buckets[bucket.name].push(filename);
    });
    return buckets;
  }

  /* Loads local (non-Google-Fonts) TTFs listed in `<localFontsPath>manifest.json`
   * via the FontFace API and resolves to font descriptors in the same shape
   * as the Google-Fonts entries in `fonts`, so they render as ordinary cards.
   * Resolves to [] if no path is configured or anything fails to load —
   * this is purely additive and must never block the page's normal fonts. */
  function loadLocalFonts(localFontsPath) {
    if (!localFontsPath) return Promise.resolve([]);

    return fetch(localFontsPath + 'manifest.json')
      .then(function (res) { return res.ok ? res.json() : []; })
      .then(function (manifestList) {
        var buckets = buildLocalBuckets(manifestList);
        var entries = [];
        Object.keys(buckets).forEach(function (category) {
          buckets[category].forEach(function (filename) {
            entries.push({ filename: filename, category: category });
          });
        });

        var facePromises = entries.map(function (entry) {
          var family = LOCAL_FONT_NAMES[entry.filename] || entry.filename.replace(/\.[^.]+$/, '');
          var face = new FontFace(family, 'url("' + localFontsPath + entry.filename + '")');
          return face.load().then(function (loadedFace) {
            document.fonts.add(loadedFace);
            return {
              name: family,
              label: family,
              category: entry.category
            };
          }).catch(function () {
            return null;
          });
        });

        return Promise.all(facePromises).then(function (results) {
          return results.filter(Boolean);
        });
      })
      .catch(function () {
        return [];
      });
  }

  /* ── UI construction ──────────────────────────────────────────────────── */

  function wireTextInput() {
    var input = document.getElementById('style-text-input');
    var counter = document.getElementById('style-char-counter');
    if (!input) return;

    function updateCounter() {
      if (counter) counter.textContent = input.value.length + '/' + (input.maxLength || 30);
    }

    State.text = input.value || '';
    updateCounter();

    input.addEventListener('input', function () {
      updateCounter();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        State.text = input.value || '';
        renderAllLoaded();
        updateUnicodeClusters();
      }, 150);
    });
  }

  function buildInkChips() {
    var chipsContainer = document.getElementById('ink-chips');
    if (!chipsContainer) return;
    chipsContainer.innerHTML = '';

    INK_COLORS.forEach(function (ink) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'ink-chip';
      chip.dataset.ink = ink.key;
      chip.setAttribute('aria-label', ink.label);

      var dot = document.createElement('span');
      dot.className = 'ink-dot';
      dot.style.background = ink.dot;

      var name = document.createElement('span');
      name.className = 'ink-name';
      name.textContent = ink.label;

      chip.appendChild(dot);
      chip.appendChild(name);

      chip.addEventListener('click', function () {
        chipsContainer.querySelectorAll('.ink-chip').forEach(function (c) {
          c.classList.remove('active');
        });
        chip.classList.add('active');
        State.inkPreset = ink.key;
        renderAllLoaded();
      });

      chipsContainer.appendChild(chip);
    });

    var defaultChip = chipsContainer.querySelector('[data-ink="classic"]');
    if (defaultChip) defaultChip.classList.add('active');
  }

  /* Mobile-only ink row inside the sticky bottom bar — the desktop chip
   * row (.ink-scroll-wrapper) is hidden below 768px, so this is the only
   * ink-preset control visible on mobile. Only built when the page
   * actually loads narrow; not rebuilt on resize (matches the rest of this
   * file — no viewport-change listeners elsewhere either). */
  function buildBottomInkRow() {
    if (window.innerWidth > 768) return;
    var row = document.getElementById('bb-ink-scroll');
    if (!row) return;

    INK_COLORS.forEach(function (ink) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'bb-ink-dot';
      dot.dataset.ink = ink.key;
      dot.setAttribute('aria-label', ink.label);
      dot.style.background = ink.dot;
      if (ink.key === 'white') {
        dot.style.border = '2px solid #555';
      }

      dot.addEventListener('click', function () {
        row.querySelectorAll('.bb-ink-dot').forEach(function (d) {
          d.classList.remove('active');
        });
        dot.classList.add('active');
        State.inkPreset = ink.key;
        renderAllLoaded();

        // Keep the (hidden-on-mobile) desktop ink chips in sync too, in
        // case the viewport is later resized up without a reload.
        document.querySelectorAll('.ink-chip').forEach(function (c) {
          c.classList.toggle('active', c.dataset.ink === ink.key);
        });
      });

      row.appendChild(dot);
    });

    var defaultDot = row.querySelector('[data-ink="classic"]');
    if (defaultDot) defaultDot.classList.add('active');
  }

  /* Delegated on the grid container (not per-slider) — attached once in
   * init(), so it keeps working as batches of cards are appended by
   * loadNextBatch() later. Renders immediately — no debounce — the
   * per-pixel erosion pass is cheap enough for direct slider feedback. */
  function wireCardSliders() {
    container.addEventListener('input', function (e) {
      if (!e.target.matches('.card-remix, .card-age')) return;
      var cardEl = e.target.closest('.style-card');
      if (!cardEl) return;
      var entry = cardEntries.find(function (en) { return en.card === cardEl; });
      if (entry && entry.canvas) renderCard(entry.canvas, entry.font);
    });
  }

  /* Single entry point for every background-mode control (legacy 2-state
   * Paper/Skin toggle — desktop and mobile — plus the chicano bg-selector).
   * Whichever control the user touches, this updates State.bgMode, keeps
   * every OTHER control in sync, and re-renders. */
  function setBgMode(mode) {
    State.bgMode = mode;
    syncBgControls(mode);
    renderAllLoaded();
  }

  function syncBgControls(mode) {
    var legacyMode = mode === 'skin' ? 'skin' : 'paper';

    var control = document.getElementById('mode-segmented');
    if (control) {
      control.querySelectorAll('.mode-seg').forEach(function (seg) {
        var isMatch = seg.dataset.mode === legacyMode;
        seg.classList.toggle('is-active', isMatch);
        seg.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });
    }

    var bgSelector = document.querySelector('.bg-selector');
    if (bgSelector) {
      bgSelector.querySelectorAll('.bg-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.bg === mode);
      });
      var skinTones = document.getElementById('skin-tones');
      if (skinTones) skinTones.style.display = mode === 'skin' ? 'flex' : 'none';
    }

    // Mobile bottom-bar mirror of .bg-selector (see wireBottomSurfaceControls).
    var bbSurface = document.getElementById('bb-surface-scroll');
    if (bbSurface) {
      bbSurface.querySelectorAll('.bb-surface-chip').forEach(function (chip) {
        chip.classList.toggle('active', chip.dataset.bg === mode);
      });
      var bbSkinTones = document.getElementById('bb-skin-tones');
      if (bbSkinTones) bbSkinTones.style.display = mode === 'skin' ? 'flex' : 'none';
    }
  }

  /* Keeps the desktop (#skin-tones) and bottom-bar (#bb-skin-tones) tone
   * dots in sync no matter which one the user actually touched. */
  function syncSkinToneDots(tone) {
    [document.querySelectorAll('#skin-tones .tone-dot'),
     document.querySelectorAll('#bb-skin-tones .bb-tone-dot')].forEach(function (dots) {
      dots.forEach(function (d) { d.classList.toggle('active', d.dataset.tone === tone); });
    });
  }

  function wireModeSegmented() {
    var control = document.getElementById('mode-segmented');
    if (!showSkinToggle) {
      var controls = document.querySelector('.preview-controls');
      if (controls) controls.style.display = 'none';
      return;
    }
    if (!control) return;
    var segs = control.querySelectorAll('.mode-seg');
    segs.forEach(function (seg) {
      seg.addEventListener('click', function () {
        setBgMode(seg.dataset.mode === 'skin' ? 'skin' : 'paper');
      });
    });
  }

  /* Chicano-only background selector (Paper/Transfer/Flash Sheet/Velvet/Skin
   * + skin tone dots). Markup lives in the shared template unconditionally
   * (matching how mode-segmented already works) but is only wired — and
   * left visible — on the chicano page. */
  function wireBgSelector() {
    var selector = document.querySelector('.bg-selector');
    if (!selector) return;
    if (!isChicano) {
      selector.style.display = 'none';
      return;
    }

    selector.querySelectorAll('.bg-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setBgMode(btn.dataset.bg);
      });
    });

    document.querySelectorAll('#skin-tones .tone-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        State.skinTone = dot.dataset.tone;
        syncSkinToneDots(dot.dataset.tone);
        renderAllLoaded();
      });
    });

    syncBgControls(State.bgMode);
    syncSkinToneDots(State.skinTone);
  }

  /* Mobile bottom-bar mirror of wireBgSelector's surface controls (see
   * .bb-surface-scroll in template-style.html). Chicano-only, same as the
   * desktop bg-selector it mirrors — every click routes through the same
   * setBgMode()/syncBgControls() single source of truth, so this row and
   * the desktop bg-selector always agree regardless of which one the user
   * actually touches. */
  function wireBottomSurfaceControls() {
    if (window.innerWidth > 768) return;
    var surface = document.getElementById('bb-surface-scroll');
    if (!surface) return;
    if (!isChicano) {
      surface.style.display = 'none';
      return;
    }

    surface.querySelectorAll('.bb-surface-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        setBgMode(chip.dataset.bg);
      });
    });

    var bbSkinTones = document.getElementById('bb-skin-tones');
    if (bbSkinTones) {
      bbSkinTones.querySelectorAll('.bb-tone-dot').forEach(function (dot) {
        dot.addEventListener('click', function () {
          State.skinTone = dot.dataset.tone;
          syncSkinToneDots(dot.dataset.tone);
          renderAllLoaded();
        });
      });
    }
  }

  /* Mobile-only duplicate text input + scroll-to-top, fixed to the bottom
   * of the viewport (the originals are hidden below 768px). Purely a UI
   * mirror — writes into the same State/#style-text-input the desktop
   * controls use, so renderCard() never needs to know which input produced
   * the current text. (Surface/ink controls are wired separately — see
   * wireBottomSurfaceControls() and buildBottomInkRow().) */
  function syncBottomBar() {
    if (window.innerWidth > 768) return;

    var bottomInput = document.getElementById('bottom-text-input');
    var topInput = document.getElementById('style-text-input');
    var scrollBtn = document.getElementById('scroll-top-btn');

    if (!bottomInput || !topInput) return;

    var bottomDebounceTimer = null;
    bottomInput.addEventListener('input', function () {
      topInput.value = bottomInput.value;
      State.text = bottomInput.value;
      clearTimeout(bottomDebounceTimer);
      bottomDebounceTimer = setTimeout(function () {
        renderAllLoaded();
        updateUnicodeClusters();
      }, 150);
    });

    if (scrollBtn) {
      window.addEventListener('scroll', function () {
        scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
      }, { passive: true });

      scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function deriveVibeTag(category) {
    var key = category.trim().toLowerCase();
    if (VIBE_MAP[key]) return VIBE_MAP[key];
    var words = category.trim().split(/\s+/);
    return words[words.length - 1].toUpperCase();
  }

  function buildCard(f, isFirstInCategory) {
    var card = document.createElement('div');
    card.className = 'style-card';
    if (isChicano && f.category) {
      card.setAttribute('data-category', f.category);
      if (isFirstInCategory) card.classList.add('style-card--hero');
    }

    var label = document.createElement('div');
    label.className = 'style-card-label';

    var nameEl = document.createElement('span');
    nameEl.className = 'style-card-name';
    nameEl.textContent = f.label;
    label.appendChild(nameEl);

    if (f.category) {
      var vibe = document.createElement('span');
      vibe.className = 'style-card-vibe';
      vibe.textContent = deriveVibeTag(f.category);
      label.appendChild(vibe);
    }

    var dpr = window.devicePixelRatio || 1;
    var canvas = document.createElement('canvas');
    var cardCanvasW = isChicano ? CHICANO_CANVAS_W : CANVAS_W;
    var cardCanvasH = isChicano ? CHICANO_CANVAS_H : CANVAS_H;
    canvas.width = cardCanvasW * dpr;
    canvas.height = cardCanvasH * dpr;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.display = 'block';
    canvas.style.borderRadius = '4px';
    // Box aspect ratio is owned by CSS (base 8:5 matching the drawing
    // buffer, overridden per category — see style-preview.css), with
    // object-fit:cover so a category ratio that diverges from the buffer's
    // native 8:5 crops instead of stretching/distorting the proof sheet.

    var badge = document.createElement('div');
    badge.className = 'style-license-badge';
    badge.textContent = 'OFL — Free for commercial use';

    var btnRow = document.createElement('div');
    btnRow.className = 'style-card-btns';

    var copyBtn = document.createElement('button');
    // Chicano: "Export →" as the primary CTA; other pages keep "Copy as Image".
    copyBtn.className = isChicano ? 'style-btn style-btn--primary' : 'style-btn';
    copyBtn.textContent = isChicano ? 'Export →' : 'Copy as Image';
    // Chicano exports/copies always use the full-density proof-sheet
    // composite (see buildChicanoExportCanvas), independent of whatever
    // density the on-screen card is currently showing — the live canvas
    // itself is untouched either way.
    copyBtn.addEventListener('click', (function (c, font, btn) {
      return function () { copyCanvas(isChicano ? buildChicanoExportCanvas(c, font) : c, font, btn); };
    })(canvas, f, copyBtn));

    var dlBtn = document.createElement('button');
    dlBtn.className = isChicano ? 'style-btn style-btn--secondary' : 'style-btn';
    dlBtn.textContent = 'Download PNG';
    dlBtn.addEventListener('click', (function (c, font) {
      return function () { downloadCanvas(isChicano ? buildChicanoExportCanvas(c, font) : c, font); };
    })(canvas, f));

    btnRow.appendChild(copyBtn);
    btnRow.appendChild(dlBtn);

    card.appendChild(label);
    card.appendChild(canvas);
    card.appendChild(buildCardSliders());
    // Chicano: license note lives once in the page footer (buildOflFooterBadge),
    // not repeated on every card.
    if (!isChicano) card.appendChild(badge);
    card.appendChild(btnRow);

    return { card: card, canvas: canvas, font: f };
  }

  /* Per-card Artist Remix / Tattoo Age sliders — each card renders using
   * its own slider values (read directly off the DOM in renderCard), not a
   * shared global state, so different cards can show different remix/age
   * levels side by side. */
  function buildCardSliders() {
    var wrap = document.createElement('div');
    wrap.className = 'card-sliders';

    var remixRow = document.createElement('div');
    remixRow.className = 'slider-row';
    var remixIcon = document.createElement('span');
    remixIcon.className = 'slider-icon';
    // Chicano: silent control-dot instead of an emoji glyph.
    if (isChicano) {
      var remixDot = document.createElement('span');
      remixDot.className = 'control-dot control-dot--remix';
      remixIcon.appendChild(remixDot);
    } else {
      remixIcon.textContent = '🎨';
    }
    var remixTrack = document.createElement('div');
    remixTrack.className = 'slider-track';
    var remixSlider = document.createElement('input');
    remixSlider.type = 'range';
    remixSlider.className = 'card-remix';
    remixSlider.min = '0';
    remixSlider.max = '100';
    remixSlider.value = '0';
    remixSlider.setAttribute('aria-label', 'Artist Remix');
    remixTrack.appendChild(remixSlider);
    var remixVal = document.createElement('span');
    remixVal.className = 'slider-val remix-val';
    remixVal.textContent = '0%';
    remixRow.appendChild(remixIcon);
    remixRow.appendChild(remixTrack);
    remixRow.appendChild(remixVal);

    var ageRow = document.createElement('div');
    ageRow.className = 'slider-row';
    var ageIcon = document.createElement('span');
    ageIcon.className = 'slider-icon';
    if (isChicano) {
      var ageDot = document.createElement('span');
      ageDot.className = 'control-dot control-dot--age';
      ageIcon.appendChild(ageDot);
    } else {
      ageIcon.textContent = '⏳';
    }
    var ageTrack = document.createElement('div');
    ageTrack.className = 'slider-track';
    var ageSlider = document.createElement('input');
    ageSlider.type = 'range';
    ageSlider.className = 'card-age';
    ageSlider.min = '0';
    ageSlider.max = '80';
    ageSlider.value = '0';
    ageSlider.setAttribute('aria-label', 'Tattoo Age');
    ageTrack.appendChild(ageSlider);
    var ageVal = document.createElement('span');
    ageVal.className = 'slider-val age-val';
    ageVal.textContent = 'Fresh';
    ageRow.appendChild(ageIcon);
    ageRow.appendChild(ageTrack);
    ageRow.appendChild(ageVal);

    wrap.appendChild(remixRow);
    wrap.appendChild(ageRow);
    return wrap;
  }

  function buildAICard(title, sub) {
    var card = document.createElement('div');
    card.className = 'style-card style-card--ai';

    var label = document.createElement('div');
    label.className = 'style-card-label style-card-label--ai';
    var vibe = document.createElement('span');
    vibe.className = 'style-card-vibe';
    vibe.textContent = 'AI ENGINE';
    label.appendChild(vibe);
    card.appendChild(label);

    var icon = document.createElement('div');
    icon.className = 'ai-card-icon';
    icon.textContent = '✦'; // sparkle

    var h3 = document.createElement('h3');
    h3.className = 'ai-card-title';
    h3.textContent = title;

    var p = document.createElement('p');
    p.className = 'ai-card-sub';
    p.textContent = sub;

    var form = document.createElement('form');
    form.className = 'ai-notify-form';

    var emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'ai-notify-email';
    emailInput.placeholder = 'your@email.com';
    emailInput.required = true;

    var submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'ai-notify-btn';
    submitBtn.textContent = 'Notify Me';

    form.appendChild(emailInput);
    form.appendChild(submitBtn);

    var confirm = document.createElement('p');
    confirm.className = 'ai-notify-confirm';
    confirm.style.display = 'none';
    confirm.textContent = "You’re on the list!";

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = emailInput.value.trim();
      if (email) {
        try {
          var emails = JSON.parse(localStorage.getItem('waitlist_emails') || '[]');
          if (emails.indexOf(email) === -1) emails.push(email);
          localStorage.setItem('waitlist_emails', JSON.stringify(emails));
        } catch (err) { /* localStorage unavailable */ }
        form.style.display = 'none';
        confirm.style.display = 'block';
      }
    });

    card.appendChild(icon);
    card.appendChild(h3);
    card.appendChild(p);
    card.appendChild(form);
    card.appendChild(confirm);

    return card;
  }

  /* ── Staggered first-reveal (skipped on every re-render after) ──────────── */

  /* Called per batch (font cards) or once (the AI card) as they're added,
   * rather than once globally — infinite scroll means not all cards exist
   * at the same time, so a single one-shot pass over cardEntries can't
   * observe cards that haven't been built yet. Reuses one shared observer
   * across all calls. */
  function revealNewCards(entries) {
    if (reduceMotion === null) {
      reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      entries.forEach(function (entry) { entry.card.classList.add('is-visible'); });
      return;
    }

    entries.forEach(function (entry, i) {
      entry.card.style.transitionDelay = (i * 60) + 'ms';
    });

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (obsEntries) {
        obsEntries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            revealObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
    }

    entries.forEach(function (entry) { revealObserver.observe(entry.card); });
  }

  /* ── Canvas rendering ─────────────────────────────────────────────────── */

  /* Re-renders every card currently in the DOM (text/ink/mode changes).
   * Cards not yet loaded will simply pick up the current State when their
   * batch arrives, since renderCard() always reads State directly. */
  function renderAllLoaded() {
    cardEntries.forEach(function (entry) {
      if (entry.canvas) renderCard(entry.canvas, entry.font);
    });
  }

  function renderCard(canvas, f) {
    var dpr = window.devicePixelRatio || 1;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    var cardEl = canvas.closest('.style-card');
    var remixSliderEl = cardEl ? cardEl.querySelector('.card-remix') : null;
    var ageSliderEl = cardEl ? cardEl.querySelector('.card-age') : null;
    var remixValEl = cardEl ? cardEl.querySelector('.remix-val') : null;
    var ageValEl = cardEl ? cardEl.querySelector('.age-val') : null;

    var remixLevel = (parseInt((remixSliderEl && remixSliderEl.value) || '0', 10) || 0) / 100;
    var age = parseInt((ageSliderEl && ageSliderEl.value) || '0', 10) || 0;

    var rawText = State.text;
    var isEmpty = !rawText;
    var baseText = rawText || 'Your name here';

    // Seeded per card (text + font + preset) so re-renders with identical
    // inputs are pixel-identical; age/remix values deliberately excluded
    // from the seed so dragging either slider progresses smoothly against
    // the same underlying random sequence instead of reshuffling it.
    setSeed(rawText + '|' + f.name + '|' + pageSlug + '|' + State.inkPreset);

    var compiledText = (!isEmpty && remixLevel > 0)
      ? compileUnicode(baseText, 'chicano', remixLevel)
      : baseText;

    if (remixValEl) {
      // Chicano: zero state reads "Off" instead of "0%".
      var remixZeroLabel = isChicano ? 'Off' : '0%';
      remixValEl.textContent = remixLevel > 0
        ? (compiledText !== baseText ? compiledText.slice(0, 12) : Math.round(remixLevel * 100) + '%')
        : remixZeroLabel;
      if (isChicano) remixValEl.classList.toggle('is-active', remixLevel > 0);
    }

    if (ageValEl) {
      if (age === 0) ageValEl.textContent = 'Fresh';
      else if (age < 15) ageValEl.textContent = '~' + Math.floor(age / 4) + 'mo';
      else if (age < 50) ageValEl.textContent = '~' + Math.floor(age / 8) + 'yr';
      else ageValEl.textContent = 'Aged';
    }

    ctx.clearRect(0, 0, w, h);
    // Chicano renders its own background (Layer A of the proof-sheet
    // composite, see renderChicanoProofSheet) — every other page keeps the
    // original single-layer background dispatch.
    if (!isChicano) renderBackground(ctx, w, h);

    // Minimal chrome (chicano skin/velvet) lays lettering out in a taller
    // band than full chrome (see renderChicanoProofSheet) since it has no
    // metadata strips competing for space — scale font-size baseline/
    // ceiling/floor by that band's height ratio so lettering actually grows
    // to fill it. No-op (bandScale=1) for every non-chicano page and for
    // chicano's own full-chrome backgrounds. 268 (not 280) — the footer
    // block's extra font-name row ate 12px of what used to be lettering
    // room.
    var bandScale = (isChicano && !usesProofChrome(State.bgMode)) ? (268 / 200) : 1;

    // The canvas's on-screen CSS size on a phone is much smaller than its
    // device-pixel drawing buffer (canvas.width is CHICANO_CANVAS_W*dpr,
    // never under ~640 in practice — not a usable "small canvas" signal),
    // so lettering sized to the same width fraction as desktop reads small
    // on an actual mobile screen. Widen the fill target and raise the size
    // floor for that case — display path only; export forces its own
    // full-size render via computeChicanoRenderOpts and is untouched.
    var isSmallCanvas = isChicano && window.innerWidth <= 768;

    var fontFamily = '"' + f.name + '", Georgia, serif';
    var fontSize = Math.round(80 * bandScale * dpr);
    var hardMinFontSize = Math.round(48 * bandScale * dpr);
    var minFontSize = isSmallCanvas ? Math.round(hardMinFontSize * 1.15) : hardMinFontSize;
    var maxFontSize = Math.round(160 * bandScale * dpr);
    var maxWidth = Math.round((CANVAS_W - 48) * dpr);
    var fillTarget = Math.round(CANVAS_W * (isSmallCanvas ? 0.88 : 0.6) * dpr);
    var step = Math.max(1, Math.round(dpr));

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.font = fontSize + 'px ' + fontFamily;

    // Shrink to fit the safe width.
    while (fontSize > minFontSize && ctx.measureText(compiledText).width > maxWidth) {
      fontSize -= step;
      ctx.font = fontSize + 'px ' + fontFamily;
    }

    // A long word pinned against the raised mobile floor can still overflow
    // maxWidth — keep shrinking past it down to the original floor so
    // nothing clips. No-op on desktop (minFontSize === hardMinFontSize
    // already, loop condition never true).
    while (fontSize > hardMinFontSize && ctx.measureText(compiledText).width > maxWidth) {
      fontSize -= step;
      ctx.font = fontSize + 'px ' + fontFamily;
    }

    // Short words should still read big — grow until they fill the target
    // fraction of canvas width, without ever exceeding the safe width.
    if (compiledText.length < 8) {
      while (fontSize < maxFontSize && ctx.measureText(compiledText).width < fillTarget) {
        var nextSize = fontSize + step;
        ctx.font = nextSize + 'px ' + fontFamily;
        if (ctx.measureText(compiledText).width > maxWidth) {
          ctx.font = fontSize + 'px ' + fontFamily;
          break;
        }
        fontSize = nextSize;
      }
    }

    // Erosion is visually heavier on the smaller canvases mobile renders
    // at — cap the effect (not the slider itself, which still reads 0-80)
    // so max-age text stays legible on small screens.
    var effectiveAge = (window.innerWidth <= 768) ? Math.min(age, 50) : age;

    if (isChicano) {
      renderChicanoProofSheet(canvas, ctx, w, h, f, {
        fontFamily: fontFamily,
        fontSize: fontSize,
        compiledText: compiledText,
        isEmpty: isEmpty,
        rawText: rawText,
        remixLevel: remixLevel,
        age: age,
        effectiveAge: effectiveAge
      }, undefined, 1); // display path: no density override, RESOLUTION reads 1X
      return;
    }

    drawInkText(ctx, w, h, fontFamily, fontSize, compiledText, isEmpty, h / 2, CANVAS_W);

    if (!isEmpty && effectiveAge > 0) {
      applyErosion(ctx, w, h, effectiveAge);
    }

    // Watermark drawn last, on top of everything, bottom-right corner only.
    // Velvet needs its own (light) watermark tint — a dark one is invisible
    // on a near-black background.
    var watermarkMode = State.bgMode === 'skin' ? 'skin' : (State.bgMode === 'velvet' ? 'velvet' : 'paper');
    drawWatermark(ctx, w, h, watermarkMode);
  }

  function renderPaperBackground(ctx, w, h) {
    ctx.fillStyle = '#FAFAF8';
    ctx.fillRect(0, 0, w, h);
  }

  /* ── Background dispatch + generic cache ──────────────────────────────────
   * 'paper' is a single flat fillRect — cheap enough to redraw every time.
   * Everything else is rendered once per (type, size, tone) into an
   * offscreen canvas and reused via drawImage — see chicano-canvas-recipes.md
   * for the exact per-background recipes. */

  function getCachedBackground(type, w, h, tone, renderFn) {
    var key = type + '|' + w + '|' + h + '|' + (tone || '');
    var cached = bgCache.get(key);
    if (cached) return cached;
    var off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    renderFn(off.getContext('2d'), w, h);
    bgCache.set(key, off);
    return off;
  }

  function renderBackground(ctx, w, h) {
    var bg = State.bgMode;
    if (bg === 'transfer') {
      ctx.drawImage(getCachedBackground('transfer', w, h, null, renderTransferPaper), 0, 0);
    } else if (bg === 'flash') {
      ctx.drawImage(getCachedBackground('flash', w, h, null, renderFlashSheet), 0, 0);
    } else if (bg === 'velvet') {
      ctx.drawImage(getCachedBackground('velvet', w, h, null, renderBlackVelvet), 0, 0);
    } else if (bg === 'skin') {
      var tone = State.skinTone || 'medium';
      var inkKey = State.inkPreset || 'classic';
      // Deep skin + gold ink needs thinned-out pore noise (see renderSkinTone)
      // so the low-alpha gold text stays readable — that combo needs its own
      // cache entry, distinct from plain "deep".
      var skinCacheKey = (tone === 'deep' && inkKey === 'gold') ? (tone + '|gold') : tone;
      ctx.drawImage(getCachedBackground('skin', w, h, skinCacheKey, function (c, ww, hh) {
        renderSkinTone(c, ww, hh, tone, inkKey);
      }), 0, 0);
    } else {
      renderPaperBackground(ctx, w, h);
    }
  }

  /* ── Text-on-skin / text-on-paper ink treatment ──────────────────────────
   * Skin mode: three-pass ink bleed (wide soft halo → mid halo → crisp top)
   * plus a whisper-thin skin-tone overlay across the text box, so the ink
   * reads as diffused under skin rather than printed on top of it.
   * Paper mode: soft drop shadow fill + a clean dark outline stroke on top —
   * reads like hand-lettering rather than a flat digital fill.
   * Text is always straight/centered — arc-along-skin was removed after it
   * caused letter overlap; a proper per-character layout can come back later.
   */

  /* cy (vertical text center, in actual device px) and refW (logical
   * reference width used for dpr-scaling line widths/shadow blur) default
   * to the legacy non-chicano values when omitted, so every existing call
   * site keeps rendering exactly as before. */
  function drawInkText(ctx, w, h, fontFamily, fontSize, text, isEmpty, cy, refW) {
    var ink = getInkColor(State.inkPreset);
    var font = fontSize + 'px ' + fontFamily;
    if (cy == null) cy = h / 2;
    if (refW == null) refW = CANVAS_W;
    var dprScale = w / refW;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isEmpty) {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = ink.inkColor;
      ctx.fillText(text, w / 2, cy);
      ctx.restore();
      return;
    }

    if (State.bgMode === 'skin') {
      // Same 3-pass bleed for all 8 ink colors — only bleedColor/skinAlpha
      // (from INK_COLORS) vary per preset; the pass structure itself
      // (shadowBlur 8/3/0, alpha 0.35/0.70/skinAlpha) is unchanged. Every
      // non-skin background (paper, transfer, flash, velvet) shares the
      // paper-style treatment below — the recipes only redefine the
      // background layer, not a per-background ink algorithm.
      ctx.save();
      ctx.fillStyle = ink.inkColor;
      // Defensive: the bleed passes must never carry a directional offset —
      // ink under skin should diffuse evenly, not look lit from an angle
      // (see FIX 3). Explicit even though nothing in this branch sets a
      // nonzero offset today.
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Pass 1 — deep bleed
      ctx.shadowBlur = 8 * dprScale;
      ctx.shadowColor = ink.bleedColor;
      ctx.globalAlpha = 0.35;
      ctx.fillText(text, w / 2, cy);

      // Pass 2 — mid diffusion
      ctx.shadowBlur = 3 * dprScale;
      ctx.shadowColor = ink.bleedColor;
      ctx.globalAlpha = 0.70;
      ctx.fillText(text, w / 2, cy);

      // Pass 3 — crisp top layer. Gold on deep skin needs more weight than
      // its default skinAlpha (0.82) — it reads too transparent there.
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.globalAlpha = (ink.key === 'gold' && State.skinTone === 'deep') ? 0.90 : ink.skinAlpha;
      ctx.fillText(text, w / 2, cy);

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.restore();

      drawSkinOverInk(ctx, w, h, font, text, cy);
    } else if (ink.skipShadowOnPaper) {
      // Gold: shadow reads muddy on light/warm colors. Outline only.
      ctx.save();
      ctx.lineWidth = (ink.paperLineWidth || 1.8) * dprScale;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeStyle = ink.paperStroke;
      ctx.strokeText(text, w / 2, cy);
      ctx.restore();
    } else {
      ctx.save();

      // Soft drop shadow pass (ink-color fill). Paper family keeps its
      // directional offset unchanged. Velvet drops the offset — a shadow
      // that falls to one side reads as ink lit from an angle sitting on
      // top of the surface, not embedded under it; a symmetric blur-only
      // halo matches the skin bleed treatment's intent instead (see FIX 3).
      var isVelvet = (State.bgMode === 'velvet');
      ctx.shadowBlur = 4 * dprScale;
      ctx.shadowOffsetX = isVelvet ? 0 : (1 * dprScale);
      ctx.shadowOffsetY = isVelvet ? 0 : (1.5 * dprScale);
      ctx.shadowColor = 'rgba(43, 35, 25, 0.18)';
      ctx.fillStyle = ink.inkColor;
      ctx.fillText(text, w / 2, cy);

      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowColor = 'transparent';
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;

      if (ink.isWhite) {
        // On velvet specifically, white ink reads a little thin against the
        // near-black background — an extra soft body pass first, then a
        // crisp fill on top of the usual strokes, gives it more weight
        // without losing the elegant edge the strokes provide.
        if (State.bgMode === 'velvet') {
          ctx.shadowBlur = 1 * dprScale;
          ctx.globalAlpha = 0.30;
          ctx.fillStyle = ink.inkColor;
          ctx.fillText(text, w / 2, cy);
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        }

        // White on an off-white paper bg is otherwise invisible — a thin
        // grey outer stroke gives it a visible edge, with the true ink
        // color stroked thinner on top.
        ctx.lineWidth = 2.4 * dprScale;
        ctx.strokeStyle = ink.paperOuterStroke || '#999999';
        ctx.strokeText(text, w / 2, cy);

        ctx.lineWidth = 1.2 * dprScale;
        ctx.strokeStyle = 'rgba(242,232,220,0.6)';
        ctx.strokeText(text, w / 2, cy);

        if (State.bgMode === 'velvet') {
          // Final crisp fill pass — the added body weight for velvet.
          ctx.fillStyle = ink.inkColor;
          ctx.globalAlpha = 0.96;
          ctx.fillText(text, w / 2, cy);
          ctx.globalAlpha = 1.0;
        }
      } else {
        // Clean outline on top, no shadow — fixes uneven stroke width.
        ctx.lineWidth = 1.8 * dprScale;
        ctx.strokeStyle = ink.paperStroke;
        ctx.strokeText(text, w / 2, cy);
      }

      ctx.restore();
    }
  }

  /* A whisper of skin tone laid back over the text box after the ink passes
   * — center fully transparent, fading to a faint warm edge — so the skin
   * reads as sitting slightly over the ink rather than the reverse. */
  function drawSkinOverInk(ctx, w, h, font, text, cy) {
    ctx.save();
    ctx.font = font;
    var textWidth = ctx.measureText(text).width;
    var cx = w / 2;
    if (cy == null) cy = h / 2;
    var outerRadius = textWidth * 0.6;

    var overlay = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius);
    overlay.addColorStop(0, 'rgba(210,168,120,0)');
    overlay.addColorStop(1, 'rgba(210,168,120,0.07)');
    ctx.fillStyle = overlay;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  /* ── Tattoo aging (age slider) ────────────────────────────────────────── */

  function applyErosion(ctx, w, h, age) {
    if (age <= 0) return;
    var img = ctx.getImageData(0, 0, w, h);
    var d = img.data;

    var breakChance = age * 0.0014;
    var fadeChance = age * 0.008;

    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 20) {
        var r = rnd();
        if (r < breakChance) {
          d[i + 3] = 0;
        } else if (r < fadeChance) {
          d[i + 3] = Math.max(0, d[i + 3] - 60);
          d[i] = Math.min(255, d[i] + 18);
          d[i + 1] = Math.min(255, d[i + 1] + 26);
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  /* Reserved for fineline-style cards (none exist on this page yet) — kept
   * alongside applyErosion so a future fineline card can call it without
   * another extraction pass. */
  function applyMicroErosion(ctx, w, h, strength01) {
    var s = clamp(strength01, 0, 1);
    if (s <= 0) return;

    var img = ctx.getImageData(0, 0, w, h);
    var d = img.data;

    var chip = 0.002 + s * 0.010;
    var fade = 0.006 + s * 0.020;

    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 10) {
        var r = rnd();
        if (r < chip) {
          d[i + 3] = 0;
        } else if (r < fade) {
          d[i + 3] = Math.max(0, d[i + 3] - 25);
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  /* ── Chicano Studio canvas backgrounds — from chicano-canvas-recipes.md ──
   * All cached (see getCachedBackground) — never regenerated per keystroke,
   * only when canvas size, background type, or skin tone changes. */

  /* Per-tone skin config — geometry (gradient center, noise dot count,
   * band/highlight layout) is identical to the original medium-only
   * implementation; only the recipe's specified colors/alphas vary per
   * tone. `stops` are [offset, color] pairs applied to the base radial
   * gradient in order. */
  var SKIN_TONES = {
    light: {
      stops: [[0, '#F2DFC8'], [0.40, '#E8CEAD'], [0.75, '#D4B090'], [1.00, '#C4A07A']],
      noiseColor: '120,85,55',
      noiseAlphaMin: 0.015,
      noiseAlphaMax: 0.035,
      shadowRgba: 'rgba(80, 50, 30, 0.15)',
      sheenColor: '255, 245, 230',
      sheenAlpha: 0.12
    },
    medium: {
      stops: [[0, '#E8C4A0'], [0.55, '#D9AE85'], [1.00, '#C69670']],
      noiseColor: '139,90,60',
      noiseAlphaMin: null, // uses the original mobile-aware formula, unchanged
      noiseAlphaMax: null,
      shadowRgba: 'rgba(90, 55, 30, 0.22)',
      sheenColor: '255, 235, 200',
      sheenAlpha: 0.10
    },
    deep: {
      stops: [[0, '#A0714A'], [0.40, '#8A5E38'], [0.75, '#6E4828'], [1.00, '#5A3A1E']],
      noiseColor: '40,22,8',
      noiseAlphaMin: 0.02,
      noiseAlphaMax: 0.05,
      shadowRgba: 'rgba(25, 14, 5, 0.22)',
      sheenColor: '180, 130, 80',
      sheenAlpha: 0.08
    }
  };

  function parseRgba(str) {
    var m = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/.exec(str);
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: +m[4] } : { r: 0, g: 0, b: 0, a: 0 };
  }

  /* 4-stop soft falloff for the skin shadow bands, replacing the old hard
   * 2-stop (full-alpha -> transparent) gradient that read as a visible edge.
   * edgeAtStart=true: full alpha at gradient position 0 (the canvas edge),
   * fading toward transparent at position 1 (toward center) — used for the
   * top band. edgeAtStart=false is the mirrored curve for the bottom band
   * (transparent near center at position 0, full alpha at the edge at
   * position 1). Color/alpha values are the same existing per-tone
   * shadowRgba — only the stop distribution changes. */
  function addSoftBandStops(gradient, shadowRgbaStr, edgeAtStart) {
    var c = parseRgba(shadowRgbaStr);
    var full = c.a;
    function rgba(a) { return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a.toFixed(3) + ')'; }
    if (edgeAtStart) {
      gradient.addColorStop(0.00, rgba(full));
      gradient.addColorStop(0.25, rgba(full * 0.70));
      gradient.addColorStop(0.50, rgba(full * 0.38));
      gradient.addColorStop(0.75, rgba(full * 0.12));
      gradient.addColorStop(1.00, rgba(0));
    } else {
      gradient.addColorStop(0.00, rgba(0));
      gradient.addColorStop(0.25, rgba(full * 0.12));
      gradient.addColorStop(0.50, rgba(full * 0.38));
      gradient.addColorStop(0.75, rgba(full * 0.70));
      gradient.addColorStop(1.00, rgba(full));
    }
  }

  function renderSkinTone(ctx, w, h, tone, inkPreset) {
    var cfg = SKIN_TONES[tone] || SKIN_TONES.medium;
    // Deep skin + gold ink: gold's low-alpha bleed pass gets lost in the
    // normal pore-noise density — thin the noise out for this combo only.
    var noiseAlphaMultiplier = (tone === 'deep' && inkPreset === 'gold') ? 0.45 : 1;

    // 1. Base gradient — light falling on a forearm, off-centre. Geometry
    // unchanged from the original skin background; only stop colors vary.
    var cx = w * 0.55;
    var cy = h * 0.40;
    var maxR = Math.sqrt(Math.pow(Math.max(cx, w - cx), 2) + Math.pow(Math.max(cy, h - cy), 2));
    var base = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    cfg.stops.forEach(function (stop) { base.addColorStop(stop[0], stop[1]); });
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // 2. Skin noise — pores/grain, density normalised to the base canvas size.
    // Per-tone base count (not just mobile/desktop) — dark skin needs far
    // less structural noise for ink of any color to stay readable on it.
    var isMobile = window.innerWidth <= 768;
    var dotCount = tone === 'deep' ? 350
                  : tone === 'light' ? 600
                  : 800; // medium — unchanged
    var count = Math.round(dotCount * (w * h) / (CANVAS_W * CANVAS_H));
    for (var i = 0; i < count; i++) {
      var x = rnd() * w;
      var y = rnd() * h;
      var alpha = (cfg.noiseAlphaMin != null)
        ? (cfg.noiseAlphaMin + rnd() * (cfg.noiseAlphaMax - cfg.noiseAlphaMin))
        : (isMobile ? (0.01 + rnd() * 0.03) : (0.02 + rnd() * 0.04));
      alpha *= noiseAlphaMultiplier;
      ctx.fillStyle = 'rgba(' + cfg.noiseColor + ',' + alpha.toFixed(3) + ')';
      ctx.fillRect(x, y, 1, 1);
    }

    // 3. Shadow bands top/bottom — suggests the curve of an arm. A hard
    // 2-stop (full-alpha -> transparent) gradient produced a visible edge
    // where the falloff started; a 4-stop curve helped but still terminated
    // too abruptly at 1280px width. Bands extended to 60% of height (top and
    // bottom bands now overlap slightly in the middle — harmless, both are
    // near-zero alpha there) with a longer 5-stop tail for a genuinely
    // gradual falloff.
    var bandH = h * 0.60;
    var topBand = ctx.createLinearGradient(0, 0, 0, bandH);
    addSoftBandStops(topBand, cfg.shadowRgba, true);
    ctx.fillStyle = topBand;
    ctx.fillRect(0, 0, w, bandH);

    var botBand = ctx.createLinearGradient(0, h - bandH, 0, h);
    addSoftBandStops(botBand, cfg.shadowRgba, false);
    ctx.fillStyle = botBand;
    ctx.fillRect(0, h - bandH, w, bandH);

    // Light dither over the band regions only, to break up any residual
    // banding the smoother gradient still leaves — more, dimmer dots break
    // banding better than fewer bright ones. Area-scaled like every other
    // noise layer in this file so density stays consistent between display
    // size and the 2x export canvas.
    var ditherCount = Math.round(500 * (w * h) / (CHICANO_CANVAS_W * CHICANO_CANVAS_H));
    for (var bd = 0; bd < ditherCount; bd++) {
      var bx = rnd() * w;
      var by = (rnd() < 0.5) ? rnd() * bandH : (h - rnd() * bandH);
      var ba = 0.006 + rnd() * 0.012;
      ctx.fillStyle = 'rgba(' + cfg.noiseColor + ',' + ba.toFixed(3) + ')';
      ctx.fillRect(bx, by, 1, 1);
    }

    // 4. Center highlight — arm peak. The real source of the reported
    // banding: the old 3-stop gradient started AT peak alpha exactly on the
    // fillRect's own top edge (y = h*0.2), with nothing outside the rect to
    // fade in from — a hard rectangular seam, not a gradient smoothness
    // issue at all (the shadow-band fixes above were the wrong layer). Now
    // ramps 0 -> peak -> 0.4*peak -> 0 across the full fillRect (0 to h*0.5)
    // so there's no discontinuity at either edge; peak position (~0.2h)
    // unchanged from the original.
    var peak = cfg.sheenAlpha;
    var highlight = ctx.createLinearGradient(0, 0, 0, h * 0.5);
    highlight.addColorStop(0.00, 'rgba(' + cfg.sheenColor + ',0)');
    highlight.addColorStop(0.40, 'rgba(' + cfg.sheenColor + ',' + peak.toFixed(3) + ')');
    highlight.addColorStop(0.70, 'rgba(' + cfg.sheenColor + ',' + (peak * 0.4).toFixed(3) + ')');
    highlight.addColorStop(1.00, 'rgba(' + cfg.sheenColor + ',0)');
    ctx.fillStyle = highlight;
    ctx.fillRect(0, 0, w, h * 0.5);
  }

  // Kept for backward compatibility (recipe explicitly asks for this) —
  // nothing in this file calls it after the renderBackground() dispatch was
  // added, but external code may still reference it by name.
  function renderSkinBackground(ctx, w, h) {
    renderSkinTone(ctx, w, h, 'medium');
  }

  /* a) Tattoo transfer paper — purple thermal transfer paper. */
  function renderTransferPaper(ctx, w, h) {
    var cx = w / 2, cy = h / 2;

    // Layer 1 — base gradient
    var base = ctx.createRadialGradient(cx, cy * 0.4, 0, cx, cy, w * 0.85);
    base.addColorStop(0.0, '#E8E0F0');
    base.addColorStop(0.5, '#D8CCEA');
    base.addColorStop(1.0, '#C8BAE0');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // Layer 2 — paper grain (density bumped for more visible texture)
    var grainCount = Math.round(1200 * (w * h) / (CANVAS_W * CANVAS_H));
    for (var i = 0; i < grainCount; i++) {
      var gx = rnd() * w, gy = rnd() * h;
      var gr = 0.4 + rnd() * 0.4;
      var ga = 0.02 + rnd() * 0.045;
      ctx.fillStyle = 'rgba(80, 60, 120, ' + ga.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 3 — fiber lines (faint horizontal-ish paper fibers)
    var fiberCount = 12 + Math.floor(rnd() * 7); // 12–18
    ctx.strokeStyle = 'rgba(100, 80, 140, 0.06)';
    ctx.lineWidth = 0.5;
    for (var fi = 0; fi < fiberCount; fi++) {
      var fy = rnd() * h;
      var fx = rnd() * w;
      var flen = 8 + rnd() * 32;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + flen, fy + (rnd() - 0.5) * 2);
      ctx.stroke();
    }

    // Layer 4 — pressure streaks (diagonal, suggests where paper was pressed)
    var streakCount = 5 + Math.floor(rnd() * 3); // 5–7
    ctx.fillStyle = 'rgba(200, 190, 220, 0.04)';
    for (var si = 0; si < streakCount; si++) {
      var sy = rnd() * h;
      var sAngle = (2 + rnd() * 6) * (Math.PI / 180) * (rnd() < 0.5 ? 1 : -1);
      var sWidth = 2 + rnd() * 4;
      ctx.save();
      ctx.translate(w / 2, sy);
      ctx.rotate(sAngle);
      ctx.fillRect(-w, -sWidth / 2, w * 2, sWidth);
      ctx.restore();
    }

    // Layer 5 — edge darkening vignette
    var vignette = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.7);
    vignette.addColorStop(0.0, 'rgba(0,0,0,0)');
    vignette.addColorStop(0.7, 'rgba(0,0,0,0)');
    vignette.addColorStop(1.0, 'rgba(40,20,60,0.18)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  /* b) Flash sheet paper — clean white Bristol board studio paper. */
  function renderFlashSheet(ctx, w, h) {
    // Layer 1 — base paper
    ctx.fillStyle = '#FAFAF8';
    ctx.fillRect(0, 0, w, h);

    // Layer 2 — paper texture grain
    var grainCount = Math.round(400 * (w * h) / (CANVAS_W * CANVAS_H));
    for (var i = 0; i < grainCount; i++) {
      var gx = rnd() * w, gy = rnd() * h;
      var gr = 0.3 + rnd() * 0.3;
      var ga = 0.008 + rnd() * 0.017;
      ctx.fillStyle = 'rgba(40, 35, 25, ' + ga.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 3 — construction marks (artist's faint layout guides)
    var markCount = 2 + Math.floor(rnd() * 2); // 2–3
    ctx.strokeStyle = 'rgba(60, 55, 45, 0.04)';
    ctx.lineWidth = 0.5;
    for (var mi = 0; mi < markCount; mi++) {
      ctx.beginPath();
      if (rnd() < 0.5) {
        var my = rnd() * h;
        ctx.moveTo(0, my);
        ctx.lineTo(w, my + (rnd() - 0.5) * h * 0.3);
      } else {
        var mx = rnd() * w;
        ctx.moveTo(mx, 0);
        ctx.lineTo(mx + (rnd() - 0.5) * w * 0.3, h);
      }
      ctx.stroke();
    }

    // Layer 4 — corner ruler ticks
    ctx.strokeStyle = 'rgba(80, 75, 65, 0.08)';
    ctx.lineWidth = 0.5;
    var tickCount = 6 + Math.floor(rnd() * 3); // 6–8
    var corners = [
      { x: 0, y: 0, dx: 1, dy: 1 },
      { x: w, y: 0, dx: -1, dy: 1 },
      { x: 0, y: h, dx: 1, dy: -1 },
      { x: w, y: h, dx: -1, dy: -1 }
    ];
    corners.forEach(function (c) {
      for (var t = 0; t < tickCount; t++) {
        var offset = 3 + t * 3;
        // Horizontal tick along the nearest horizontal edge
        ctx.beginPath();
        ctx.moveTo(c.x + c.dx * offset, c.y);
        ctx.lineTo(c.x + c.dx * offset, c.y + c.dy * 10);
        ctx.stroke();
        // Vertical tick along the nearest vertical edge
        ctx.beginPath();
        ctx.moveTo(c.x, c.y + c.dy * offset);
        ctx.lineTo(c.x + c.dx * 10, c.y + c.dy * offset);
        ctx.stroke();
      }
    });

    // Layer 5 — corner shadow (paper sitting on a surface)
    corners.forEach(function (c) {
      var shadow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, w * 0.3);
      shadow.addColorStop(0.0, 'rgba(30,25,20,0.12)');
      shadow.addColorStop(0.6, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadow;
      ctx.fillRect(0, 0, w, h);
    });
  }

  /* c) Black velvet — dark studio display cloth, max-contrast thumbnail. */
  function renderBlackVelvet(ctx, w, h) {
    var cx = w / 2, cy = h / 2;

    // Layer 1 — matte black base
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, w, h);

    // Layer 2 — soft vignette (deepens edges, pulls focus to center)
    var vignette = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.75);
    vignette.addColorStop(0.0, 'rgba(0,0,0,0)');
    vignette.addColorStop(0.6, 'rgba(0,0,0,0)');
    vignette.addColorStop(1.0, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Layer 3 — subtle off-center spotlight
    var spotX = cx * 0.9, spotY = cy * 0.7;
    var spotlight = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, w * 0.55);
    spotlight.addColorStop(0.0, 'rgba(255,250,240,0.06)');
    spotlight.addColorStop(1.0, 'rgba(0,0,0,0)');
    ctx.fillStyle = spotlight;
    ctx.fillRect(0, 0, w, h);

    // Layer 4 — fine dust (no grain overlay — velvet is smooth)
    var dustCount = Math.round(120 * (w * h) / (CANVAS_W * CANVAS_H));
    for (var i = 0; i < dustCount; i++) {
      var dx = rnd() * w, dy = rnd() * h;
      var dr = 0.3 + rnd() * 0.7;
      var da = 0.01 + rnd() * 0.05;
      ctx.fillStyle = 'rgba(255, 255, 255, ' + da.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* Bottom-right corner mark only — no rotation, drawn last so it always
   * sits on top of both the skin/paper background and the ink text. */
  function drawWatermark(ctx, w, h, mode) {
    ctx.save();

    var margin = 12;
    var fontStack = '"Pinyon Script", "Space Grotesk", sans-serif';
    var fontSize = Math.max(11, w * 0.022);

    ctx.font = '400 ' + fontSize + 'px ' + fontStack;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';

    if (mode === 'skin') {
      // On skin: dark warm brown, readable against the gradient.
      ctx.fillStyle = 'rgba(15, 8, 3, 0.58)';
    } else if (mode === 'velvet') {
      // On black velvet: a dark watermark is invisible — use a light one.
      ctx.fillStyle = 'rgba(240, 235, 225, 0.45)';
    } else {
      // On paper (flat, transfer, flash): dark ink color, clearly visible.
      ctx.fillStyle = 'rgba(20, 15, 10, 0.52)';
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
    ctx.fillText(WATERMARK_TEXT, w - margin, h - margin);
    ctx.restore();
  }

  /* ── Chicano Studio proof sheet ────────────────────────────────────────────
   * Canvas-only redesign: each chicano card composites three layers.
   *   Layer A (cached per bgMode+size+tone): paper/texture/registration marks,
   *     or the existing transfer/flash/velvet/skin backgrounds unchanged.
   *   Layer B (cached per the metadata that actually changes it): the two
   *     metadata strips + the brand footer block.
   *   Layer C (drawn every render, never cached): the lettering itself,
   *     via the existing drawInkText()/applyErosion() — untouched otherwise.
   * Every other style page never enters this section (isChicano gate lives
   * in renderCard()). */

  function pad2(n) {
    n = Math.max(0, Math.round(n || 0));
    return (n < 10 ? '0' : '') + n;
  }

  // Positions a 1-device-px-wide stroke on a pixel boundary so it renders
  // crisp instead of anti-aliased/blurry across two pixels.
  function crispLinePos(v) {
    return Math.round(v) + 0.5;
  }

  /* Manual letter-spacing — canvas has no native letterSpacing support in
   * older engines. Draws char-by-char with a fixed advance and returns the
   * total tracked width (also usable for centering/right-alignment). */
  function measureTracked(ctx, text, tracking) {
    var total = 0;
    for (var i = 0; i < text.length; i++) {
      total += ctx.measureText(text[i]).width;
      if (i < text.length - 1) total += tracking;
    }
    return total;
  }

  function drawTracked(ctx, text, x, y, tracking, align) {
    var total = measureTracked(ctx, text, tracking);
    var savedAlign = ctx.textAlign;
    ctx.textAlign = 'left';
    var startX = (align === 'center') ? (x - total / 2) : (align === 'right') ? (x - total) : x;

    var cursor = startX;
    for (var i = 0; i < text.length; i++) {
      ctx.fillText(text[i], cursor, y);
      cursor += ctx.measureText(text[i]).width + tracking;
    }
    ctx.textAlign = savedAlign;
    return total;
  }

  /* Deterministic 8-hex-char id for the SEED metadata field — same FNV-1a
   * approach as setSeed(), but a pure function that doesn't touch the
   * actual RNG state (__seed), so reading it never disturbs texture/erosion
   * randomness elsewhere. */
  function hashSeed(seedString) {
    var h = 2166136261;
    var s = String(seedString == null ? '' : seedString);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    h = h >>> 0;
    var hex = ('00000000' + h.toString(16).toUpperCase()).slice(-8);
    return hex.slice(0, 4) + '-' + hex.slice(4, 8);
  }

  // Full chrome (registration marks + both metadata strips + footer) makes
  // sense on paper-family backgrounds; on skin/velvet it would look absurd —
  // nobody prints a spec sheet onto an arm.
  function usesProofChrome(bgMode) {
    return bgMode === 'paper' || bgMode === 'transfer' || bgMode === 'flash';
  }

  // canvasWidthCss = the card's actual on-screen CSS width (not the
  // dpr-scaled canvas.width attribute), since that's what determines
  // whether metadata text physically fits.
  //
  // Thresholds are calibrated to this page's real #style-preview grid, not
  // the 560/400 the spec assumed. That grid is capped at max-width:900px and
  // stays 2 columns until the 768px mobile breakpoint, so the single most
  // common width — any desktop viewport ≥900px — always measures ~370–392px
  // (never ≥400). At the literal 400 threshold, "full chrome" was
  // effectively dead code outside one edge case (single-column layout right
  // at the 768px breakpoint, ~654px). Lowering the floor to 320 — comfortably
  // between the measured mobile cluster (~246–276px) and desktop cluster
  // (~370–392px) — makes 'compact' (2 header + 2 footer fields, plenty of
  // room per field) the normal desktop experience instead of bare 'minimal'.
  // 'full' stays at 560 since cramming 3 header + 5 footer fields into a
  // ~392px-wide card risks longer values (e.g. "Grenze Gotisch",
  // "Flash Sheet") overflowing their column — drawMetadataHeader/Footer
  // don't clip or wrap.
  function metadataDensity(canvasWidthCss) {
    if (canvasWidthCss >= 560) return 'full';
    if (canvasWidthCss >= 320) return 'compact';
    return 'minimal';
  }

  /* ── Bristol paper texture (chicano 'paper' bgMode only) ─────────────────
   * Flash Sheet and Transfer Paper keep their own existing recipes
   * untouched — this new treatment only replaces the flat #FAFAF8 used by
   * plain "paper" mode. */

  function drawPaperBase(ctx, w, h) {
    ctx.fillStyle = '#F7F5F0';
    ctx.fillRect(0, 0, w, h);
  }

  function drawPaperTooth(ctx, w, h) {
    var count = Math.round(750 * (w * h) / (CHICANO_CANVAS_W * CHICANO_CANVAS_H));
    for (var i = 0; i < count; i++) {
      var x = rnd() * w, y = rnd() * h;
      var r = 0.25 + rnd() * 0.25;
      var a = 0.015 + rnd() * 0.015;
      ctx.fillStyle = 'rgba(115,98,76,' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPaperFibers(ctx, w, h) {
    var count = 18 + Math.floor(rnd() * 7); // 18–24
    ctx.strokeStyle = 'rgba(115,98,76,0.02)';
    ctx.lineWidth = 0.5;
    for (var i = 0; i < count; i++) {
      var x = rnd() * w, y = rnd() * h;
      var len = 20 + rnd() * 100;
      var angle = (90 + (rnd() - 0.5) * 12) * (Math.PI / 180); // near-vertical, ±6°
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
  }

  function drawPaperVignette(ctx, w, h) {
    var cx = w / 2, cy = h / 2;
    var maxR = Math.sqrt(cx * cx + cy * cy);
    var vignette = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    vignette.addColorStop(0.0, 'rgba(125,108,84,0)');
    vignette.addColorStop(0.65, 'rgba(125,108,84,0)');
    vignette.addColorStop(1.0, 'rgba(125,108,84,0.05)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  /* Print registration targets at the four inner corners — canvas chrome,
   * distinct from (and in addition to) the CSS #CCFF00 corner accent on
   * .card, which is untouched. Full-chrome backgrounds are always light,
   * so isDark is only wired for completeness/future reuse. */
  function drawRegistrationMarks(ctx, w, h, isDark) {
    var scale = w / CHICANO_CANVAS_W;
    var inset = 28 * scale; // 20px outer margin + 8px inset
    var r = 4 * scale;
    var armLen = 7 * scale;
    var color = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)';
    var corners = [[inset, inset], [w - inset, inset], [inset, h - inset], [w - inset, h - inset]];

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, scale);
    corners.forEach(function (c) {
      var cx = c[0], cy = c[1];
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - armLen, cy);
      ctx.lineTo(cx + armLen, cy);
      ctx.moveTo(cx, cy - armLen);
      ctx.lineTo(cx, cy + armLen);
      ctx.stroke();
    });
    ctx.restore();
  }

  /* ── Metadata chrome ──────────────────────────────────────────────────── */

  function drawMetadataHeader(ctx, w, h, meta, density, isDark) {
    var scale = w / CHICANO_CANVAS_W;
    var margin = 20 * scale;
    // Registration marks sit at inset 28 (20 margin + 8) with a 7px
    // crosshair arm, occupying roughly x 21-35 (and the mirrored zone on the
    // right) — the old metadata content, starting at margin+14=34, sat right
    // on top of that. contentInset (52) keeps text clear of the marks;
    // the horizontal rules still span the full margin-to-margin width.
    var contentInset = 52 * scale;
    var innerW = w - contentInset * 2;
    var labelY = 32 * scale;
    var valueY = 52 * scale;
    var ruleY = crispLinePos(66 * scale);

    var labelColor = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.42)';
    var valueColor = isDark ? '#E8E4DA' : '#222222';
    var ruleColor = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)';
    var sepColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)';

    var labelSize = Math.max(8 * scale, (density === 'full' ? 10 : density === 'compact' ? 9 : 8) * scale);
    var valueSize = (density === 'full' ? 15 : density === 'compact' ? 13 : 11) * scale;

    var fields;
    if (density === 'full') {
      fields = [
        { label: 'FONT', value: meta.fontLabel },
        { label: 'INK COLOR', value: meta.inkLabel },
        { label: 'BACKGROUND', value: meta.bgLabel }
      ];
    } else if (density === 'compact') {
      fields = [
        { label: 'FONT', value: meta.fontLabel },
        { label: 'INK', value: meta.inkLabel }
      ];
    } else {
      fields = [{ label: 'FONT', value: meta.fontLabel }];
    }

    var colW = innerW / fields.length;

    ctx.save();
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    fields.forEach(function (field, i) {
      var colX = contentInset + colW * i;
      var textX = colX + 14 * scale;

      ctx.font = labelSize + 'px "Space Grotesk", sans-serif';
      ctx.fillStyle = labelColor;
      drawTracked(ctx, field.label.toUpperCase(), textX, labelY, 1.8 * scale, 'left');

      ctx.font = '500 ' + valueSize + 'px "Space Grotesk", sans-serif';
      ctx.fillStyle = valueColor;
      drawTracked(ctx, String(field.value).toUpperCase(), textX, valueY, 1.2 * scale, 'left');

      if (i > 0) {
        var sepX = crispLinePos(colX);
        var sepCY = (labelY + valueY) / 2;
        var sepHalf = 13 * scale;
        ctx.strokeStyle = sepColor;
        ctx.lineWidth = Math.max(1, scale);
        ctx.beginPath();
        ctx.moveTo(sepX, sepCY - sepHalf);
        ctx.lineTo(sepX, sepCY + sepHalf);
        ctx.stroke();
      }
    });

    ctx.strokeStyle = ruleColor;
    ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath();
    ctx.moveTo(margin, ruleY);
    ctx.lineTo(w - margin, ruleY);
    ctx.stroke();

    ctx.restore();
  }

  function drawMetadataFooter(ctx, w, h, meta, density, isDark) {
    if (density === 'minimal') return; // bottom strip hidden entirely below 400px

    var scale = w / CHICANO_CANVAS_W;
    var margin = 20 * scale;
    // See drawMetadataHeader — same registration-mark clearance rationale.
    var contentInset = 52 * scale;
    var innerW = w - contentInset * 2;
    var ruleY = crispLinePos(266 * scale);
    var labelY = 282 * scale;
    var valueY = 302 * scale;

    var labelColor = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.42)';
    var valueColor = isDark ? '#E8E4DA' : '#222222';
    var ruleColor = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)';
    var sepColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)';

    var labelSize = (density === 'full' ? 10 : 9) * scale;
    var valueSize = (density === 'full' ? 15 : 13) * scale;

    var fields = (density === 'full')
      ? [
          { label: 'ARTIST REMIX', value: meta.remixLabel },
          { label: 'TATTOO AGE', value: meta.ageLabel },
          { label: 'INK STYLE', value: meta.inkStyle },
          { label: 'RESOLUTION', value: meta.resolution },
          { label: 'SEED', value: meta.seedHex }
        ]
      : [
          { label: 'ARTIST REMIX', value: meta.remixLabel },
          { label: 'TATTOO AGE', value: meta.ageLabel }
        ];

    var colW = innerW / fields.length;

    ctx.save();
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    ctx.strokeStyle = ruleColor;
    ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath();
    ctx.moveTo(margin, ruleY);
    ctx.lineTo(w - margin, ruleY);
    ctx.stroke();

    fields.forEach(function (field, i) {
      var colX = contentInset + colW * i;
      var textX = colX + 14 * scale;

      ctx.font = labelSize + 'px "Space Grotesk", sans-serif';
      ctx.fillStyle = labelColor;
      drawTracked(ctx, field.label.toUpperCase(), textX, labelY, 1.8 * scale, 'left');

      ctx.font = '500 ' + valueSize + 'px "Space Grotesk", sans-serif';
      ctx.fillStyle = valueColor;
      drawTracked(ctx, String(field.value).toUpperCase(), textX, valueY, 1.2 * scale, 'left');

      if (i > 0) {
        var sepX = crispLinePos(colX);
        var sepCY = (labelY + valueY) / 2;
        var sepHalf = 13 * scale;
        ctx.strokeStyle = sepColor;
        ctx.lineWidth = Math.max(1, scale);
        ctx.beginPath();
        ctx.moveTo(sepX, sepCY - sepHalf);
        ctx.lineTo(sepX, sepCY + sepHalf);
        ctx.stroke();
      }
    });

    ctx.restore();
  }

  /* Brand footer — "AIFONTS GENERATOR" / "aifontsgenerator.com" — shown on
   * every chicano card regardless of chrome level (full chrome gets it
   * below the bottom metadata strip; minimal chrome gets it as the only
   * chrome element besides the lettering).
   *
   * fullChrome / fontLabel: minimal chrome (skin/velvet) has no metadata
   * header, so there's nowhere else a shared preview shows which font it
   * is — one extra line, the font name, goes above the brand line in that
   * case only (see FIX 4). Full chrome already shows FONT in its header
   * strip, so this stays a no-op there. */
  function drawWatermarkBlock(ctx, w, h, isDark, fullChrome, fontLabel) {
    var scale = w / CHICANO_CANVAS_W;
    var margin = 20 * scale;
    var brandY = 346 * scale;
    var domainY = 364 * scale;
    var showFontName = !fullChrome && !!fontLabel;

    // Minimal chrome (skin/velvet) inserts an extra row (the font name)
    // above the brand line — the rule has to move up to clear it, or it
    // cuts straight through the text. Full chrome never shows a font-name
    // line here (FONT is already in its header strip), so its rule stays at
    // the original position, unaffected.
    var ruleY = crispLinePos(showFontName ? (brandY - 58 * scale) : (brandY - 20 * scale));
    var fontNameY = brandY - 34 * scale;

    var ruleColor = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)';
    var brandColor = isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.32)';
    var domainColor = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.28)';

    ctx.save();
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';

    if (showFontName) {
      // isDark distinguishes velvet from skin unambiguously here — paper/
      // flash/transfer are always fullChrome and never reach this branch.
      var fontNameColor = isDark
        ? 'rgba(255,255,255,0.42)'    // velvet — same tone as metadata labels
        : 'rgba(101, 67, 33, 0.50)';  // skin — warm brown, not paper's plain black
      ctx.font = (10 * scale) + 'px "Space Grotesk", sans-serif';
      ctx.fillStyle = fontNameColor;
      drawTracked(ctx, fontLabel.toUpperCase(), w / 2, fontNameY, 2.4 * scale, 'center');
    }

    ctx.strokeStyle = ruleColor;
    ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath();
    ctx.moveTo(margin, ruleY);
    ctx.lineTo(w - margin, ruleY);
    ctx.stroke();

    ctx.font = (11 * scale) + 'px "Space Grotesk", sans-serif';
    ctx.fillStyle = brandColor;
    drawTracked(ctx, 'AIFONTS GENERATOR', w / 2, brandY, 3.2 * scale, 'center');

    ctx.font = (10 * scale) + 'px "Space Grotesk", sans-serif';
    ctx.fillStyle = domainColor;
    var domainText = 'aifontsgenerator.com';
    var domainWidth = measureTracked(ctx, domainText, 1.6 * scale);
    drawTracked(ctx, domainText, w / 2, domainY, 1.6 * scale, 'center');

    var ornamentGap = 14 * scale;
    ctx.fillText('✦', w / 2 - domainWidth / 2 - ornamentGap, domainY);
    ctx.fillText('✦', w / 2 + domainWidth / 2 + ornamentGap, domainY);

    ctx.restore();
  }

  /* ── Layer compositing ────────────────────────────────────────────────── */

  /* Raw Layer A drawing — no caching. Shared by the cached wrapper below
   * (normal live-preview path) and the export path (which deliberately
   * paints a fresh, discarded Layer A at the export's own resolution rather
   * than reusing — or polluting — the display-size cache; see
   * buildChicanoExportCanvas). inkKey defaults to State.inkPreset so the
   * live path's behavior is unchanged; export passes its own opts-derived
   * value explicitly. */
  function paintLayerA(ctx, w, h, bgMode, tone, inkKey) {
    if (!usesProofChrome(bgMode)) {
      if (bgMode === 'skin') {
        renderSkinTone(ctx, w, h, tone, inkKey || State.inkPreset || 'classic');
        return;
      }
      renderBlackVelvet(ctx, w, h);
      return;
    }

    if (bgMode === 'paper') {
      drawPaperBase(ctx, w, h);
      drawPaperTooth(ctx, w, h);
      drawPaperFibers(ctx, w, h);
      drawPaperVignette(ctx, w, h);
    } else if (bgMode === 'transfer') {
      renderTransferPaper(ctx, w, h);
    } else {
      renderFlashSheet(ctx, w, h);
    }
    drawRegistrationMarks(ctx, w, h, false);
  }

  /* Layer A — static per (bgMode, size, tone). Skin/velvet reuse the exact
   * same cached bitmaps renderBackground() already produces (including
   * skin's deep+gold cache-key special case) — zero change to their
   * existing caching. Paper/transfer/flash get a new cache entry: their
   * base texture plus registration marks, composited once and reused. */
  function buildLayerA(w, h, bgMode, tone) {
    if (!usesProofChrome(bgMode)) {
      if (bgMode === 'skin') {
        var inkKey = State.inkPreset || 'classic';
        var skinCacheKey = (tone === 'deep' && inkKey === 'gold') ? (tone + '|gold') : tone;
        return getCachedBackground('skin', w, h, skinCacheKey, function (c, ww, hh) {
          paintLayerA(c, ww, hh, bgMode, tone, inkKey);
        });
      }
      return getCachedBackground('velvet', w, h, null, function (c, ww, hh) {
        paintLayerA(c, ww, hh, bgMode, tone);
      });
    }

    return getCachedBackground('chicanoFull-' + bgMode, w, h, null, function (c, ww, hh) {
      paintLayerA(c, ww, hh, bgMode, tone);
    });
  }

  /* Raw Layer B drawing — no caching. Shared by the cached wrapper below
   * (normal live-preview path) and the export path (which deliberately
   * skips the cache — see buildChicanoExportCanvas). */
  function paintLayerB(ctx, w, h, meta, density, isDark, fullChrome) {
    if (fullChrome) {
      drawMetadataHeader(ctx, w, h, meta, density, isDark);
      drawMetadataFooter(ctx, w, h, meta, density, isDark);
    }
    drawWatermarkBlock(ctx, w, h, isDark, fullChrome, meta.fontLabel);
  }

  /* Layer B — the metadata strips + footer. Cached by every value that
   * actually appears on it (including the seed hash, which changes with
   * the typed text) so identical states reuse a bitmap; it naturally
   * rebuilds when text changes since SEED must track it live, but that
   * rebuild is cheap (~20 draw calls) — unlike Layer A's texture, it isn't
   * the expensive part this caching is protecting. */
  function buildLayerB(w, h, meta, density, isDark, fullChrome) {
    var key = 'chicanoB|' + w + '|' + h + '|' + density + '|' + (isDark ? 1 : 0) + '|' + (fullChrome ? 1 : 0) + '|' +
      meta.fontLabel + '|' + meta.inkLabel + '|' + meta.bgLabel + '|' +
      meta.remixLabel + '|' + meta.ageLabel + '|' + meta.inkStyle + '|' +
      meta.resolution + '|' + meta.seedHex;
    var cached = bgCache.get(key);
    if (cached) return cached;

    var off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    paintLayerB(off.getContext('2d'), w, h, meta, density, isDark, fullChrome);
    bgCache.set(key, off);
    return off;
  }

  /* Composites Layer A, Layer B, then draws the lettering (Layer C) fresh
   * every call. Called from renderCard() only when isChicano.
   *
   * densityOverride: when set (currently only 'full', from the export path
   * — see buildChicanoExportCanvas), skips the live CSS-width lookup and
   * forces that density instead. It also switches Layer A and Layer B to
   * fresh, uncached paints at whatever resolution (w, h) actually is — a
   * one-off export composite has no business persisting a bitmap sized/
   * densitied for one card into the shared display-time cache, and display
   * size's cached Layer A must never be reused at export resolution (that
   * would just upscale low-res texture, not render it sharp).
   *
   * resolutionScale: the RESOLUTION metadata field, in "NX" form — passed
   * in explicitly by each caller (1 from renderCard, 2 from
   * buildChicanoExportCanvas) rather than derived from devicePixelRatio, so
   * it always describes the artifact's actual scale, not the viewer's
   * screen. Defaults to 1 (display). */
  function renderChicanoProofSheet(canvas, ctx, w, h, f, opts, densityOverride, resolutionScale) {
    var bgMode = State.bgMode;
    var tone = State.skinTone || 'medium';
    var fullChrome = usesProofChrome(bgMode);
    var isDark = bgMode === 'velvet';
    var scale = w / CHICANO_CANVAS_W;
    var dpr = window.devicePixelRatio || 1;

    if (densityOverride) {
      // Fresh, uncached, at export resolution — see the note above.
      paintLayerA(ctx, w, h, bgMode, tone, State.inkPreset);
    } else {
      ctx.drawImage(buildLayerA(w, h, bgMode, tone), 0, 0);
    }

    var ink = getInkColor(State.inkPreset);
    var seedString = opts.rawText + '|' + f.name + '|' + pageSlug + '|' + State.inkPreset;

    var meta = {
      fontLabel: f.label,
      inkLabel: ink.label,
      bgLabel: BG_MODE_LABELS[bgMode] || 'Paper',
      remixLabel: pad2(Math.round(opts.remixLevel * 100)) + '%',
      ageLabel: pad2(opts.age) + '%',
      // "OUTLINE" mirrors the existing skipShadowOnPaper flag (gold on any
      // non-skin background renders stroke-only, no fill) — the same flag
      // drawInkText() already branches on.
      inkStyle: (ink.skipShadowOnPaper && bgMode !== 'skin') ? 'OUTLINE' : 'SOLID',
      resolution: (resolutionScale || 1) + 'X',
      seedHex: hashSeed(seedString)
    };

    var density;
    if (densityOverride) {
      density = densityOverride;
      // Fresh, uncached — see the densityOverride note above.
      paintLayerB(ctx, w, h, meta, density, isDark, fullChrome);
    } else {
      var cssWidth = canvas.getBoundingClientRect().width || (w / dpr);
      density = metadataDensity(cssWidth);
      ctx.drawImage(buildLayerB(w, h, meta, density, isDark, fullChrome), 0, 0);
    }

    // Lettering band — full chrome centers within the dedicated band between
    // the header/footer strips (y 66→266, i.e. top 66 + height 200, in the
    // 640×400 logical space). Minimal chrome (skin/velvet) has no metadata
    // strips at all, so it gets a taller band (top 40 + height 268) instead
    // of centering on the whole canvas — leaves room for the footer block
    // below (268, not 280 — the footer's extra font-name row needs 12px of
    // what used to be lettering room) while still using far more of the
    // available vertical space than the full-chrome band would (see FIX 2).
    // computeChicanoRenderOpts() sizes opts.fontSize against this same band
    // height so lettering actually scales up to fill it, not just recenter
    // within unchanged sizing.
    var cy;
    if (fullChrome) {
      cy = (66 + 100) * scale;
      if (f.category === 'Script') cy -= 4 * scale;
    } else {
      cy = (40 + 134) * scale;
    }

    drawInkText(ctx, w, h, opts.fontFamily, opts.fontSize, opts.compiledText, opts.isEmpty, cy, CHICANO_CANVAS_W);

    if (!opts.isEmpty && opts.effectiveAge > 0) {
      applyErosion(ctx, w, h, opts.effectiveAge);
    }
  }

  /* Pure computation half of renderCard()'s chicano branch — font-fit sizing,
   * compiled/remix text, seed, effective age — with no DOM writes and no
   * drawing. Kept separate from renderCard() (rather than refactoring it to
   * call this) so nothing about the live, non-chicano render path is
   * touched; used by both the live chicano render and the export-composite
   * path below so they can never compute a different font size/compiled
   * text for the same settings.
   *
   * forcedScale: when passed (export only, always 2 — see
   * buildChicanoExportCanvas), used instead of the live window's
   * devicePixelRatio to size the font/measurements, so the resulting
   * fontSize is proportioned for the actual 1280×800 export canvas instead
   * of whatever the viewer's screen happens to be. ctx.measureText() only
   * depends on the font string, not which canvas the context belongs to, so
   * reusing the live canvas's context here purely for measurement is safe
   * regardless of forcedScale. */
  function computeChicanoRenderOpts(canvas, f, forcedScale) {
    var dpr = forcedScale || window.devicePixelRatio || 1;
    var ctx = canvas.getContext('2d');

    var cardEl = canvas.closest('.style-card');
    var remixSliderEl = cardEl ? cardEl.querySelector('.card-remix') : null;
    var ageSliderEl = cardEl ? cardEl.querySelector('.card-age') : null;

    var remixLevel = (parseInt((remixSliderEl && remixSliderEl.value) || '0', 10) || 0) / 100;
    var age = parseInt((ageSliderEl && ageSliderEl.value) || '0', 10) || 0;

    var rawText = State.text;
    var isEmpty = !rawText;
    var baseText = rawText || 'Your name here';

    setSeed(rawText + '|' + f.name + '|' + pageSlug + '|' + State.inkPreset);

    var compiledText = (!isEmpty && remixLevel > 0)
      ? compileUnicode(baseText, 'chicano', remixLevel)
      : baseText;

    // See the matching comment in renderCard() — same band-height-driven
    // scaling, kept identical here so the export composite's font size
    // never diverges from what the live minimal-chrome card would compute.
    var bandScale = usesProofChrome(State.bgMode) ? 1 : (268 / 200);

    var fontFamily = '"' + f.name + '", Georgia, serif';
    var fontSize = Math.round(80 * bandScale * dpr);
    var minFontSize = Math.round(48 * bandScale * dpr);
    var maxFontSize = Math.round(160 * bandScale * dpr);
    var maxWidth = Math.round((CANVAS_W - 48) * dpr);
    var fillTarget = Math.round(CANVAS_W * 0.6 * dpr);
    var step = Math.max(1, Math.round(dpr));

    ctx.font = fontSize + 'px ' + fontFamily;
    while (fontSize > minFontSize && ctx.measureText(compiledText).width > maxWidth) {
      fontSize -= step;
      ctx.font = fontSize + 'px ' + fontFamily;
    }
    if (compiledText.length < 8) {
      while (fontSize < maxFontSize && ctx.measureText(compiledText).width < fillTarget) {
        var nextSize = fontSize + step;
        ctx.font = nextSize + 'px ' + fontFamily;
        if (ctx.measureText(compiledText).width > maxWidth) {
          ctx.font = fontSize + 'px ' + fontFamily;
          break;
        }
        fontSize = nextSize;
      }
    }

    var effectiveAge = (window.innerWidth <= 768) ? Math.min(age, 50) : age;

    return {
      fontFamily: fontFamily,
      fontSize: fontSize,
      compiledText: compiledText,
      isEmpty: isEmpty,
      rawText: rawText,
      remixLevel: remixLevel,
      age: age,
      effectiveAge: effectiveAge
    };
  }

  /* Export composite (chicano only) — same lettering/erosion approach as the
   * live card (same seed → deterministic, reproducible pattern), full
   * 'full'-density metadata chrome, and always rendered at a fixed 2x scale
   * (1280×800) regardless of the viewer's own devicePixelRatio or the card's
   * on-screen CSS width — the downloaded/copied PNG is a standalone
   * artifact, always viewed at its own native size, not the card preview's.
   *
   * Built at real 1280×800 pixels (not a 640×400 canvas + ctx.scale(2,2))
   * so it goes through the exact same w/CHICANO_CANVAS_W scale-derivation
   * every drawing function already uses for retina (dpr=2) display
   * rendering — texture/registration-mark/metadata geometry all come out
   * genuinely sharp at 2x, not just a blurry upscale of 1x content.
   *
   * Layer A and Layer B are both painted fresh directly onto this canvas
   * (via renderChicanoProofSheet's densityOverride branch) — never built
   * through buildLayerA/buildLayerB's cache, so this one-off 1280×800
   * bitmap never reuses (or pollutes) the display-size cache entries.
   *
   * Built on a fresh, separate canvas; the live display canvas is never
   * touched, so the on-screen card keeps showing exactly what it showed
   * before export. */
  function buildChicanoExportCanvas(canvas, f) {
    var EXPORT_SCALE = 2;
    var opts = computeChicanoRenderOpts(canvas, f, EXPORT_SCALE);

    var exportCanvas = document.createElement('canvas');
    exportCanvas.width = CHICANO_CANVAS_W * EXPORT_SCALE;   // 1280
    exportCanvas.height = CHICANO_CANVAS_H * EXPORT_SCALE;  // 800
    var exportCtx = exportCanvas.getContext('2d');
    exportCtx.imageSmoothingEnabled = true;
    exportCtx.imageSmoothingQuality = 'high';

    renderChicanoProofSheet(exportCanvas, exportCtx, exportCanvas.width, exportCanvas.height, f, opts, 'full', EXPORT_SCALE);
    return exportCanvas;
  }

  /* ── Export actions ───────────────────────────────────────────────────── */

  function copyCanvas(canvas, f, btn) {
    if (!navigator.clipboard || !window.ClipboardItem) {
      fallbackDownload(canvas, f);
      return;
    }
    canvas.toBlob(function (blob) {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        .then(function () {
          flashBtn(btn, 'Copied ✓');
        })
        .catch(function () {
          fallbackDownload(canvas, f);
        });
    }, 'image/png');
  }

  function downloadCanvas(canvas, f) {
    var safeName = f.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    var safeText = (State.text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    var presetSlug = State.inkPreset || 'classic';
    var filename = pageSlug + '-' + safeName + '-' + presetSlug + (safeText ? '-' + safeText : '') + '.png';
    var a = document.createElement('a');
    a.download = filename;
    a.href = canvas.toDataURL('image/png');
    a.click();
  }

  function fallbackDownload(canvas, f) {
    downloadCanvas(canvas, f);
  }

  function flashBtn(btn, msg) {
    var orig = btn.textContent;
    btn.textContent = msg;
    btn.classList.add('is-copied');
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('is-copied');
    }, 1500);
  }

  /* ── Bootstrap ────────────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
