(function(){
  var LETTER_EXTENDED = [
    makeRemixStyle({ name:'Crystal Clear', category:'Letter Extended', frame:{pre:'◇',post:'◇'}, bases:{upper:'DOUBLE',lower:'SCRIPT'}, overrides:{}, palette:['◇','◈','◆','◉'], micro:{symbolChance:0.4} }),
    makeRemixStyle({ name:'Midnight Script', category:'Letter Extended', frame:{pre:'✦',post:'✦'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{}, palette:['✦','★','✧','☆'], micro:{symbolChance:0.45} }),
    makeRemixStyle({ name:'Iron Letter', category:'Letter Extended', frame:{pre:'⚔',post:'⚔'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['⚔','⚡','🔱'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Royal Glyph', category:'Letter Extended', frame:{pre:'👑',post:'👑'}, bases:{upper:'DOUBLE',lower:'SCRIPT'}, overrides:{}, palette:['👑','✦','⚜'], micro:{symbolChance:0.45} }),
    makeRemixStyle({ name:'Dark Fraktur', category:'Letter Extended', frame:{pre:'☽',post:'☾'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['☽','⛧','✟'], micro:{symbolChance:0.4} }),
    makeRemixStyle({ name:'Neon Mono', category:'Letter Extended', frame:{pre:'▌',post:'▐'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['▌','▐','▶','◀'], micro:{symbolChance:0.35} }),
    makeRemixStyle({ name:'Stardust', category:'Letter Extended', frame:{pre:'✨',post:'✨'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{}, palette:['✨','⭐','🌟','💫'], micro:{dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Shadow Bold', category:'Letter Extended', frame:{pre:'▓',post:'▓'}, bases:{upper:'FULL',lower:'DOUBLE'}, overrides:{}, palette:['▓','▒','░'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Cosmic Drift', category:'Letter Extended', frame:{pre:'🌌',post:'🌌'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['🌌','⭐','🌟','✦'], micro:{symbolChance:0.45} }),
    makeRemixStyle({ name:'Void Fraktur', category:'Letter Extended', frame:{pre:'⬛',post:'⬛'}, bases:{upper:'FRAKTUR',lower:'SCRIPT'}, overrides:{}, palette:['⬛','⬜','▪','▫'], micro:{symbolChance:0.35} }),
  ];
  window.styles = (window.styles || []).concat(LETTER_EXTENDED);
})();
