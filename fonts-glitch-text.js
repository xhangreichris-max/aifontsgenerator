(function(){
  var GLITCH_EXTENDED = [
    makeRemixStyle({ name:'Circuit Break', category:'Glitch Extended', frame:{pre:'▓',post:'▓'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['▓','▒','░','▐','▌'], micro:{slash:true, underline:true, symbolChance:0.6} }),
    makeRemixStyle({ name:'Data Rot', category:'Glitch Extended', frame:{pre:'⌗',post:'⌗'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{}, palette:['⌗','⟊','◧','▣','⟴'], micro:{slash:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Pixel Death', category:'Glitch Extended', frame:{pre:'░',post:'░'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{O:'⊘',o:'⊘'}, palette:['░','▒','▓','▐','▏'], micro:{underline:true, slash:true, symbolChance:0.6} }),
    makeRemixStyle({ name:'Signal Lost', category:'Glitch Extended', frame:{pre:'⚠',post:'⚠'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{}, palette:['⚠','⛔','🚫','⌀'], micro:{tilde:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Virus Core', category:'Glitch Extended', frame:{pre:'☣︎',post:'☣︎'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{O:'⍥',o:'⍥',X:'⌗',x:'⌗'}, palette:['☣︎','⎔','⌬','⌁','⍥'], micro:{slash:true, underline:true, symbolChance:0.65} }),
    makeRemixStyle({ name:'Ghost Signal', category:'Glitch Extended', frame:{pre:'👻',post:'👻'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['👻','☠','💀','🕸'], micro:{dotVowels:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Null Byte', category:'Glitch Extended', frame:{pre:'⌀',post:'⌀'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{O:'⌀',o:'⌀'}, palette:['⌀','∅','◌','○'], micro:{slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Corrupt Feed', category:'Glitch Extended', frame:{pre:'📡',post:'📡'}, bases:{upper:'DOUBLE',lower:'FRAKTUR'}, overrides:{}, palette:['📡','⌗','⟊','▣'], micro:{tilde:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Static Noise', category:'Glitch Extended', frame:{pre:'〓',post:'〓'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['〓','≡','≣','▬','▭'], micro:{slash:true, symbolChance:0.6} }),
    makeRemixStyle({ name:'Kernel Panic', category:'Glitch Extended', frame:{pre:'💀',post:'💀'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{A:'Λ',E:'Ξ',I:'|'}, palette:['💀','☠','⚠','⛔'], micro:{underline:true, slash:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Phantom Wire', category:'Glitch Extended', frame:{pre:'⟆',post:'⟆'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{}, palette:['⟆','⌦','⌫','⟴','⟰'], micro:{slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Decay Protocol', category:'Glitch Extended', frame:{pre:'🔻',post:'🔻'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{O:'◉',o:'◉'}, palette:['🔻','▼','⬇','↯'], micro:{underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Error State', category:'Glitch Extended', frame:{pre:'[ERR]',post:'[ERR]'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['⌗','⟊','◧','▣'], micro:{slash:true, tilde:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Binary Ghost', category:'Glitch Extended', frame:{pre:'01',post:'10'}, bases:{upper:'FRAKTUR',lower:'DOUBLE'}, overrides:{O:'0',o:'0',I:'1',i:'1'}, palette:['▓','▒','░','▐'], micro:{slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Infected Core', category:'Glitch Extended', frame:{pre:'⛧',post:'⛧'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{}, palette:['⛧','☠','💀','🜏','🜍'], micro:{slash:true, underline:true, symbolChance:0.6} }),
  ];
  window.styles = (window.styles || []).concat(GLITCH_EXTENDED);
})();
