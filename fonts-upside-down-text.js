(function(){
  // Every style here starts from the true 180° flip (flipUpsideDown) and then
  // adds its own frame, symbols and marks. Overrides apply to the flipped text,
  // so they are keyed on flipped characters (O stays O; ∀ is a turned A).
  var flip = flipUpsideDown;
  var FLIP_EXTENDED = [
    makeRemixStyle({ name:'Gravity Flip', category:'Flip Extended', frame:{pre:'↕',post:'↕'}, baseTransform:flip, overrides:{}, palette:['↕','↑','↓','⇕'], micro:{tilde:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Anti-Gravity', category:'Flip Extended', frame:{pre:'🌀',post:'🌀'}, baseTransform:flip, overrides:{O:'🌀',o:'🌀'}, palette:['🌀','↺','↻','⟳'], micro:{tilde:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Invert Frame', category:'Flip Extended', frame:{pre:'▽',post:'△'}, baseTransform:flip, overrides:{'∀':'▽','Λ':'△'}, palette:['▽','△','▼','▲'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Upend Bars', category:'Flip Extended', frame:{pre:'⊥',post:'⊤'}, baseTransform:flip, overrides:{'┴':'⊥'}, palette:['⊥','⊤','⌐','¬'], micro:{slash:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Topsy Turvy', category:'Flip Extended', frame:{pre:'🙃',post:'🙃'}, baseTransform:flip, overrides:{}, palette:['🙃','↕','↔','⟺'], micro:{tilde:true, dotVowels:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Zero-G', category:'Flip Extended', frame:{pre:'🚀',post:'🚀'}, baseTransform:flip, overrides:{O:'⊙',o:'⊙'}, palette:['🚀','⭐','🌌','⚡'], micro:{underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Portal Shift', category:'Flip Extended', frame:{pre:'🌀',post:'⟳'}, baseTransform:flip, overrides:{}, palette:['🌀','⟳','↺','⟲'], micro:{tilde:true, slash:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Flip Frame', category:'Flip Extended', frame:{pre:'⌐',post:'¬'}, baseTransform:flip, overrides:{}, palette:['⌐','¬','⊥','⊤'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Down Under', category:'Flip Extended', frame:{pre:'🦘',post:'🦘'}, baseTransform:flip, overrides:{}, palette:['🦘','⭐','🌏','⬇'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Rune Flip', category:'Flip Extended', frame:{pre:'ᚦ',post:'ᚦ'}, baseTransform:flip, overrides:{}, palette:['ᚦ','ᛟ','ᚱ','ᚾ','⊥'], micro:{slash:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Inverse Arrows', category:'Flip Extended', frame:{pre:'◁',post:'▷'}, baseTransform:flip, overrides:{}, palette:['◁','▷','⇐','⇒'], micro:{tilde:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Backflip', category:'Flip Extended', frame:{pre:'🤸',post:'🤸'}, baseTransform:flip, overrides:{}, palette:['🤸','⚡','↕','🌀'], micro:{tilde:true, dotVowels:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Wormhole', category:'Flip Extended', frame:{pre:'🕳',post:'🕳'}, baseTransform:flip, overrides:{O:'🕳',o:'🕳'}, palette:['🕳','🌀','⊙','◌'], micro:{slash:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Revolt', category:'Flip Extended', frame:{pre:'✊',post:'✊'}, baseTransform:flip, overrides:{}, palette:['✊','⚡','🔥','↕'], micro:{underline:true, slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Flip Chaos', category:'Flip Extended', frame:{pre:'💫',post:'💫'}, baseTransform:flip, overrides:{}, palette:['💫','🌀','⭐','↺'], micro:{tilde:true, underline:true, symbolChance:0.5} }),
  ];
  window.styles = (window.styles || []).concat(FLIP_EXTENDED);
})();
