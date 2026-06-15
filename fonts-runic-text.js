(function(){
  var RUNIC_EXTENDED = [
    makeRemixStyle({ name:'Viking Rune', category:'Runic Extended', frame:{pre:'ᚨ',post:'ᚨ'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{A:'ᚨ',T:'ᛏ',R:'ᚱ',S:'ᛋ',N:'ᚾ'}, palette:['ᚨ','ᚢ','ᚱ','ᚲ','ᚷ'], micro:{underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Futhark Storm', category:'Runic Extended', frame:{pre:'⚡',post:'⚡'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{T:'ᛏ',R:'ᚱ',O:'ᛟ',S:'ᛋ'}, palette:['ᛏ','ᛟ','ᚱ','ᛋ','ᚾ'], micro:{slash:true, underline:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Odin Mark', category:'Runic Extended', frame:{pre:'ᛟ',post:'ᛟ'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{O:'ᛟ',o:'ᛟ',W:'ᚹ',w:'ᚹ'}, palette:['ᛟ','ᚹ','ᚾ','ᛞ','ᚨ'], micro:{dotVowels:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Thor Script', category:'Runic Extended', frame:{pre:'🔨',post:'🔨'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{T:'ᛏ',H:'ᚺ'}, palette:['🔨','⚡','ᛏ','ᚺ','ᚾ'], micro:{underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Rune Stone', category:'Runic Extended', frame:{pre:'🪨',post:'🪨'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{A:'ᚨ',R:'ᚱ',N:'ᚾ',S:'ᛋ'}, palette:['ᚨ','ᚱ','ᚾ','ᛋ','ᛏ'], micro:{underline:true, slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Frost Rune', category:'Runic Extended', frame:{pre:'❄︎',post:'❄︎'}, bases:{upper:'FRAKTUR',lower:'DOUBLE'}, overrides:{I:'ᛁ',i:'ᛁ'}, palette:['❄︎','ᛁ','ᚾ','ᛟ','❆'], micro:{dotVowels:true, tilde:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Mead Hall', category:'Runic Extended', frame:{pre:'🍺',post:'🍺'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['ᚨ','ᚢ','ᚱ','ᚲ','ᚷ','ᚺ'], micro:{dotVowels:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Longship', category:'Runic Extended', frame:{pre:'⚓',post:'⚓'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{}, palette:['⚓','🌊','ᛟ','ᚱ','ᚾ'], micro:{underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Valhalla', category:'Runic Extended', frame:{pre:'⚔',post:'⚔'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{V:'ᚹ',W:'ᚹ'}, palette:['⚔','🛡','ᚨ','ᛏ','ᚾ'], micro:{underline:true, slash:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Seidr Script', category:'Runic Extended', frame:{pre:'☽',post:'☾'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['☽','☾','ᛟ','ᚾ','✦'], micro:{dotVowels:true, tilde:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Berserker', category:'Runic Extended', frame:{pre:'🐺',post:'🐺'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{B:'ᛒ',b:'ᛒ'}, palette:['🐺','⚡','ᚱ','ᛏ','⚔'], micro:{slash:true, underline:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Elder Mark', category:'Runic Extended', frame:{pre:'ᚦ',post:'ᚦ'}, bases:{upper:'FRAKTUR',lower:'DOUBLE'}, overrides:{}, palette:['ᚦ','ᚾ','ᛉ','ᛟ','ᚨ'], micro:{dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Skald Script', category:'Runic Extended', frame:{pre:'📯',post:'📯'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['📯','ᚨ','ᚾ','ᛟ','✦'], micro:{dotVowels:true, underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Druid Rune', category:'Runic Extended', frame:{pre:'🌿',post:'🌿'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{}, palette:['🌿','ᛟ','ᚱ','☽','✦'], micro:{dotVowels:true, tilde:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Ulfhednar', category:'Runic Extended', frame:{pre:'🐉',post:'🐉'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{}, palette:['🐉','⚔','ᛏ','ᚨ','🔥'], micro:{slash:true, underline:true, symbolChance:0.6} }),
  ];
  window.styles = (window.styles || []).concat(RUNIC_EXTENDED);
})();
