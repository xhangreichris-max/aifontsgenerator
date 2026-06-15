(function(){
  var ZALGO_EXTENDED = [
    makeRemixStyle({ name:'Void Scream', category:'Zalgo Extended', frame:{pre:'𖤐',post:'𖤐'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['𖤐','⛧','☠','💀','🜏'], micro:{slash:true, underline:true, tilde:true, symbolChance:0.7} }),
    makeRemixStyle({ name:'Abyss Crawler', category:'Zalgo Extended', frame:{pre:'👁',post:'👁'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{O:'👁',o:'👁'}, palette:['👁','🕸','☠','⛧'], micro:{dotVowels:true, slash:true, underline:true, symbolChance:0.65} }),
    makeRemixStyle({ name:'Demon Script', category:'Zalgo Extended', frame:{pre:'🜏',post:'🜍'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['🜏','🜍','🝫','🝟','⛧'], micro:{slash:true, underline:true, symbolChance:0.7} }),
    makeRemixStyle({ name:'Hell Overflow', category:'Zalgo Extended', frame:{pre:'🔥',post:'🔥'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{A:'Λ',V:'∇'}, palette:['🔥','☠','⛧','🜂','✠'], micro:{tilde:true, underline:true, symbolChance:0.65} }),
    makeRemixStyle({ name:'Soul Shatter', category:'Zalgo Extended', frame:{pre:'💔',post:'💔'}, bases:{upper:'DOUBLE',lower:'FRAKTUR'}, overrides:{}, palette:['💔','🖤','☠','⛧','𖤐'], micro:{slash:true, tilde:true, symbolChance:0.6} }),
    makeRemixStyle({ name:'Cursed Rune', category:'Zalgo Extended', frame:{pre:'ᚦ',post:'ᚦ'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['ᚦ','ᚾ','ᛉ','ᛟ','ᚨ'], micro:{dotVowels:true, slash:true, symbolChance:0.6} }),
    makeRemixStyle({ name:'Dark Matter', category:'Zalgo Extended', frame:{pre:'◉',post:'◉'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{O:'◉',o:'◉'}, palette:['◉','●','◈','⊛'], micro:{underline:true, slash:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Eldritch Mark', category:'Zalgo Extended', frame:{pre:'⟁',post:'⟁'}, bases:{upper:'FRAKTUR',lower:'DOUBLE'}, overrides:{}, palette:['⟁','⌬','◬','△','▲'], micro:{tilde:true, dotVowels:true, symbolChance:0.6} }),
    makeRemixStyle({ name:'Necrotic Sigil', category:'Zalgo Extended', frame:{pre:'☽',post:'☾'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['☽','☾','⛧','𖤐','🜏'], micro:{slash:true, underline:true, symbolChance:0.65} }),
    makeRemixStyle({ name:'Plague Script', category:'Zalgo Extended', frame:{pre:'☣︎',post:'☣︎'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{}, palette:['☣︎','☠','💀','⛔','⚠'], micro:{slash:true, tilde:true, symbolChance:0.7} }),
    makeRemixStyle({ name:'Void Pulse', category:'Zalgo Extended', frame:{pre:'〰',post:'〰'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{}, palette:['〰','∿','〜','⌇'], micro:{tilde:true, underline:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Haunted Glyph', category:'Zalgo Extended', frame:{pre:'🕸',post:'🕸'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{}, palette:['🕸','🕷','👻','💀','☠'], micro:{dotVowels:true, slash:true, symbolChance:0.6} }),
    makeRemixStyle({ name:'Rift Script', category:'Zalgo Extended', frame:{pre:'⋮',post:'⋮'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{I:'|',i:'|',l:'|'}, palette:['⋮','⋯','⋰','⋱'], micro:{slash:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Shadow Tear', category:'Zalgo Extended', frame:{pre:'🖤',post:'🖤'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['🖤','💀','⛧','𖤐','🌑'], micro:{tilde:true, slash:true, symbolChance:0.65} }),
    makeRemixStyle({ name:'Chaos Bind', category:'Zalgo Extended', frame:{pre:'⛓',post:'⛓'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['⛓','🔒','⚙','⛧'], micro:{slash:true, underline:true, tilde:true, symbolChance:0.7} }),
  ];
  window.styles = (window.styles || []).concat(ZALGO_EXTENDED);
})();
