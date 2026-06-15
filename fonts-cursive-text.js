(function () {

  /* ── Two new base alphabets not in fonts-core BASES ── */
  const SCRIPT_NORMAL_U = {
    A:'𝒜',B:'ℬ',C:'𝒞',D:'𝒟',E:'ℰ',F:'ℱ',G:'𝒢',H:'ℋ',I:'ℐ',J:'𝒥',
    K:'𝒦',L:'ℒ',M:'ℳ',N:'𝒩',O:'𝒪',P:'𝒫',Q:'𝒬',R:'ℛ',S:'𝒮',T:'𝒯',
    U:'𝒰',V:'𝒱',W:'𝒲',X:'𝒳',Y:'𝒴',Z:'𝒵'
  };
  const SCRIPT_NORMAL_L = {
    a:'𝒶',b:'𝒷',c:'𝒸',d:'𝒹',e:'ℯ',f:'𝒻',g:'ℊ',h:'𝒽',i:'𝒾',j:'𝒿',
    k:'𝓀',l:'𝓁',m:'𝓂',n:'𝓃',o:'ℴ',p:'𝓅',q:'𝓆',r:'𝓇',s:'𝓈',t:'𝓉',
    u:'𝓊',v:'𝓋',w:'𝓌',x:'𝓍',y:'𝓎',z:'𝓏'
  };

  const BOLD_ITALIC_U = {
    A:'𝑨',B:'𝑩',C:'𝑪',D:'𝑫',E:'𝑬',F:'𝑭',G:'𝑮',H:'𝑯',I:'𝑰',J:'𝑱',
    K:'𝑲',L:'𝑳',M:'𝑴',N:'𝑵',O:'𝑶',P:'𝑷',Q:'𝑸',R:'𝑹',S:'𝑺',T:'𝑻',
    U:'𝑼',V:'𝑽',W:'𝑾',X:'𝑿',Y:'𝒀',Z:'𝒁'
  };
  const BOLD_ITALIC_L = {
    a:'𝒂',b:'𝒃',c:'𝒄',d:'𝒅',e:'𝒆',f:'𝒇',g:'𝒈',h:'𝒉',i:'𝒊',j:'𝒋',
    k:'𝒌',l:'𝒍',m:'𝒎',n:'𝒏',o:'𝒐',p:'𝒑',q:'𝒒',r:'𝒓',s:'𝒔',t:'𝒕',
    u:'𝒖',v:'𝒗',w:'𝒘',x:'𝒙',y:'𝒚',z:'𝒛'
  };

  /* ── Register new bases into BASES so makeRemixStyle can use them ── */
  if (typeof BASES !== 'undefined') {
    BASES['SCRIPT_NORMAL'] = { U: SCRIPT_NORMAL_U, L: SCRIPT_NORMAL_L };
    BASES['BOLD_ITALIC']   = { U: BOLD_ITALIC_U,   L: BOLD_ITALIC_L   };
  }

  /* ── 15 Cursive Extended styles ── */
  var CURSIVE_EXTENDED = [

    /* ── scriptNormal styles (lighter flowing script) ── */

    makeRemixStyle({
      name: 'Velvet Script',
      category: 'Cursive Extended',
      frame: { pre: '✦', post: '✦' },
      bases: { upper: 'SCRIPT_NORMAL', lower: 'SCRIPT_NORMAL' },
      overrides: {},
      palette: ['✦','✧','⋆','✶','✷'],
      micro: { dotVowels: true, symbolChance: 0.4 }
    }),

    makeRemixStyle({
      name: 'Pearl Script',
      category: 'Cursive Extended',
      frame: { pre: '◦', post: '◦' },
      bases: { upper: 'SCRIPT_NORMAL', lower: 'SCRIPT_NORMAL' },
      overrides: { O:'⊙', o:'⊙' },
      palette: ['◦','○','◌','⊙','◎'],
      micro: { dotVowels: true, symbolChance: 0.3 }
    }),

    makeRemixStyle({
      name: 'Rose Quill',
      category: 'Cursive Extended',
      frame: { pre: '❀', post: '❀' },
      bases: { upper: 'SCRIPT_NORMAL', lower: 'SCRIPT_NORMAL' },
      overrides: {},
      palette: ['❀','✿','❁','⚘','❋','🌸'],
      micro: { dotVowels: true, symbolChance: 0.5 }
    }),

    makeRemixStyle({
      name: 'Lunar Ink',
      category: 'Cursive Extended',
      frame: { pre: '☾', post: '☽' },
      bases: { upper: 'SCRIPT_NORMAL', lower: 'SCRIPT_NORMAL' },
      overrides: {},
      palette: ['☾','☽','✦','⋆','✧','🌙'],
      micro: { dotVowels: true, tilde: true, symbolChance: 0.4 }
    }),

    makeRemixStyle({
      name: 'Silk Flow',
      category: 'Cursive Extended',
      frame: { pre: '｢', post: '｣' },
      bases: { upper: 'SCRIPT_NORMAL', lower: 'SCRIPT_NORMAL' },
      overrides: {},
      palette: ['✧','⋆','✦','❖'],
      micro: { dotVowels: true, symbolChance: 0.3 }
    }),

    /* ── boldItalic styles (bold slanted) ── */

    makeRemixStyle({
      name: 'Storm Script',
      category: 'Cursive Extended',
      frame: { pre: '⚡', post: '⚡' },
      bases: { upper: 'BOLD_ITALIC', lower: 'BOLD_ITALIC' },
      overrides: {},
      palette: ['⚡','✦','⋆','✶'],
      micro: { underline: true, symbolChance: 0.4 }
    }),

    makeRemixStyle({
      name: 'Ember Italic',
      category: 'Cursive Extended',
      frame: { pre: '🔥', post: '🔥' },
      bases: { upper: 'BOLD_ITALIC', lower: 'BOLD_ITALIC' },
      overrides: {},
      palette: ['🔥','✦','🜂','⚡','✠'],
      micro: { underline: true, symbolChance: 0.45 }
    }),

    makeRemixStyle({
      name: 'Frost Italic',
      category: 'Cursive Extended',
      frame: { pre: '❄︎', post: '❄︎' },
      bases: { upper: 'BOLD_ITALIC', lower: 'BOLD_ITALIC' },
      overrides: {},
      palette: ['❄︎','❆','✦','⋆','☽'],
      micro: { dotVowels: true, symbolChance: 0.4 }
    }),

    makeRemixStyle({
      name: 'Crown Italic',
      category: 'Cursive Extended',
      frame: { pre: '♔', post: '♕' },
      bases: { upper: 'BOLD_ITALIC', lower: 'BOLD_ITALIC' },
      overrides: { K:'♚', Q:'♛' },
      palette: ['♔','♕','♖','♗','♘','♙'],
      micro: { dotVowels: true, underline: true, symbolChance: 0.5 }
    }),

    makeRemixStyle({
      name: 'Obsidian Italic',
      category: 'Cursive Extended',
      frame: { pre: '◈', post: '◈' },
      bases: { upper: 'BOLD_ITALIC', lower: 'BOLD_ITALIC' },
      overrides: {},
      palette: ['◈','▣','◧','⟡','⌬'],
      micro: { underline: true, slash: true, symbolChance: 0.4 }
    }),

    /* ── Mixed upper/lower base styles (most unique) ── */

    makeRemixStyle({
      name: 'Midnight Quill',
      category: 'Cursive Extended',
      frame: { pre: '✠', post: '✠' },
      bases: { upper: 'BOLD_ITALIC', lower: 'SCRIPT_NORMAL' },
      overrides: {},
      palette: ['✠','☩','✟','†','⛧'],
      micro: { dotVowels: true, underline: true, symbolChance: 0.45 }
    }),

    makeRemixStyle({
      name: 'Ink Flow',
      category: 'Cursive Extended',
      frame: { pre: '❦', post: '❦' },
      bases: { upper: 'SCRIPT_NORMAL', lower: 'BOLD_ITALIC' },
      overrides: {},
      palette: ['❦','❧','✿','❀','⚘'],
      micro: { underline: true, symbolChance: 0.35 }
    }),

    makeRemixStyle({
      name: 'Blossom Pen',
      category: 'Cursive Extended',
      frame: { pre: '🌸', post: '🌸' },
      bases: { upper: 'SCRIPT_NORMAL', lower: 'BOLD_ITALIC' },
      overrides: {},
      palette: ['🌸','❀','✿','🪷','⚘'],
      micro: { dotVowels: true, symbolChance: 0.45 }
    }),

    makeRemixStyle({
      name: 'Golden Pen',
      category: 'Cursive Extended',
      frame: { pre: '⸙', post: '⸙' },
      bases: { upper: 'BOLD_ITALIC', lower: 'SCRIPT_NORMAL' },
      overrides: { A:'𝒜', S:'𝒮' },
      palette: ['⸙','⟡','◈','❖','✦'],
      micro: { dotVowels: true, altI: true, symbolChance: 0.4 }
    }),

    makeRemixStyle({
      name: 'Thorned Script',
      category: 'Cursive Extended',
      frame: { pre: '⛧', post: '⛧' },
      bases: { upper: 'BOLD_ITALIC', lower: 'SCRIPT_NORMAL' },
      overrides: {},
      palette: ['⛧','✠','†','☩','🜂'],
      micro: { slash: true, underline: true, symbolChance: 0.5 }
    }),

  ];

  /* ── Append to window.styles ── */
  window.styles = (window.styles || []).concat(CURSIVE_EXTENDED);

})();
