(function(){
  var FLIP_EXTENDED = [
    makeRemixStyle({ name:'Gravity Flip', category:'Flip Extended', frame:{pre:'↕',post:'↕'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['↕','↑','↓','⇕'], micro:{tilde:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Anti-Gravity', category:'Flip Extended', frame:{pre:'🌀',post:'🌀'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{O:'🌀',o:'🌀'}, palette:['🌀','↺','↻','⟳'], micro:{tilde:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Invert Bold', category:'Flip Extended', frame:{pre:'▽',post:'△'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{A:'△',V:'▽'}, palette:['▽','△','▼','▲'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Upend Script', category:'Flip Extended', frame:{pre:'⊥',post:'⊤'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{T:'⊤',t:'⊤'}, palette:['⊥','⊤','⌐','¬'], micro:{slash:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Topsy Turvy', category:'Flip Extended', frame:{pre:'🙃',post:'🙃'}, bases:{upper:'DOUBLE',lower:'FULL'}, overrides:{}, palette:['🙃','↕','↔','⟺'], micro:{tilde:true, dotVowels:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Zero-G', category:'Flip Extended', frame:{pre:'🚀',post:'🚀'}, bases:{upper:'FULL',lower:'MONO'}, overrides:{O:'⊙',o:'⊙'}, palette:['🚀','⭐','🌌','⚡'], micro:{underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Portal Shift', category:'Flip Extended', frame:{pre:'🌀',post:'⟳'}, bases:{upper:'MONO',lower:'FULL'}, overrides:{}, palette:['🌀','⟳','↺','⟲'], micro:{tilde:true, slash:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Flip Frame', category:'Flip Extended', frame:{pre:'⌐',post:'¬'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['⌐','¬','⊥','⊤'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Down Under', category:'Flip Extended', frame:{pre:'🦘',post:'🦘'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['🦘','⭐','🌏','⬇'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Upside Rune', category:'Flip Extended', frame:{pre:'ᚦ',post:'ᚦ'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{}, palette:['ᚦ','ᛟ','ᚱ','ᚾ','⊥'], micro:{slash:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Inverse Script', category:'Flip Extended', frame:{pre:'◁',post:'▷'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{}, palette:['◁','▷','⇐','⇒'], micro:{tilde:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Backflip', category:'Flip Extended', frame:{pre:'🤸',post:'🤸'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['🤸','⚡','↕','🌀'], micro:{tilde:true, dotVowels:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Wormhole', category:'Flip Extended', frame:{pre:'🕳',post:'🕳'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{O:'🕳',o:'🕳'}, palette:['🕳','🌀','⊙','◌'], micro:{slash:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Revolt Script', category:'Flip Extended', frame:{pre:'✊',post:'✊'}, bases:{upper:'MONO',lower:'FULL'}, overrides:{}, palette:['✊','⚡','🔥','↕'], micro:{underline:true, slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Flip Chaos', category:'Flip Extended', frame:{pre:'💫',post:'💫'}, bases:{upper:'FULL',lower:'DOUBLE'}, overrides:{}, palette:['💫','🌀','⭐','↺'], micro:{tilde:true, underline:true, symbolChance:0.5} }),
  ];
  window.styles = (window.styles || []).concat(FLIP_EXTENDED);
})();
