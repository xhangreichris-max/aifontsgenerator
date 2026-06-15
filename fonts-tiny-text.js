(function(){
  var TINY_EXTENDED = [
    makeRemixStyle({ name:'Nano Script', category:'Tiny Extended', frame:{pre:'·',post:'·'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['·','∙','•','◦'], micro:{dotVowels:true, symbolChance:0.3} }),
    makeRemixStyle({ name:'Micro Bold', category:'Tiny Extended', frame:{pre:'▪',post:'▪'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['▪','▫','▬','▭'], micro:{underline:true, symbolChance:0.3} }),
    makeRemixStyle({ name:'Atom Script', category:'Tiny Extended', frame:{pre:'⚛',post:'⚛'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{O:'⚛',o:'⚛'}, palette:['⚛','⌬','◬','△'], micro:{dotVowels:true, symbolChance:0.35} }),
    makeRemixStyle({ name:'Pixel Tiny', category:'Tiny Extended', frame:{pre:'░',post:'░'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['░','▒','▓','▐'], micro:{slash:true, symbolChance:0.35} }),
    makeRemixStyle({ name:'Speck Script', category:'Tiny Extended', frame:{pre:'⋅',post:'⋅'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{}, palette:['⋅','∙','·','•'], micro:{dotVowels:true, symbolChance:0.3} }),
    makeRemixStyle({ name:'Mini Fraktur', category:'Tiny Extended', frame:{pre:'⸙',post:'⸙'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['⸙','❖','◈','✦'], micro:{dotVowels:true, underline:true, symbolChance:0.35} }),
    makeRemixStyle({ name:'Compact Script', category:'Tiny Extended', frame:{pre:'｢',post:'｣'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['｢','｣','⌈','⌉'], micro:{dotVowels:true, symbolChance:0.3} }),
    makeRemixStyle({ name:'Whisper Text', category:'Tiny Extended', frame:{pre:'〈',post:'〉'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['〈','〉','⟨','⟩'], micro:{dotVowels:true, tilde:true, symbolChance:0.3} }),
    makeRemixStyle({ name:'Fine Print', category:'Tiny Extended', frame:{pre:'⌊',post:'⌋'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{}, palette:['⌊','⌋','⌈','⌉'], micro:{underline:true, symbolChance:0.3} }),
    makeRemixStyle({ name:'Grain Script', category:'Tiny Extended', frame:{pre:'∘',post:'∘'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{O:'∘',o:'∘'}, palette:['∘','○','◌','◦'], micro:{dotVowels:true, symbolChance:0.3} }),
    makeRemixStyle({ name:'Dust Script', category:'Tiny Extended', frame:{pre:'✦',post:'✦'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['✦','✧','⋆','·'], micro:{dotVowels:true, symbolChance:0.3} }),
    makeRemixStyle({ name:'Seed Script', category:'Tiny Extended', frame:{pre:'🌱',post:'🌱'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['🌱','🌿','❀','✦'], micro:{dotVowels:true, symbolChance:0.35} }),
    makeRemixStyle({ name:'Trace Script', category:'Tiny Extended', frame:{pre:'⟆',post:'⟆'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{}, palette:['⟆','⌦','⌫','◦'], micro:{slash:true, symbolChance:0.3} }),
    makeRemixStyle({ name:'Quiet Bold', category:'Tiny Extended', frame:{pre:'【',post:'】'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{}, palette:['【','】','〔','〕'], micro:{underline:true, symbolChance:0.3} }),
    makeRemixStyle({ name:'Cipher Tiny', category:'Tiny Extended', frame:{pre:'⌗',post:'⌗'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['⌗','⟊','◧','▣'], micro:{slash:true, dotVowels:true, symbolChance:0.35} }),
  ];
  window.styles = (window.styles || []).concat(TINY_EXTENDED);
})();
