(function(){
  var CREEPY_EXTENDED = [
    makeRemixStyle({ name:'Haunted Ink', category:'Creepy Extended', frame:{pre:'👻',post:'👻'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['👻','🕸','💀','☠','🌑'], micro:{dotVowels:true, underline:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Blood Scrawl', category:'Creepy Extended', frame:{pre:'🩸',post:'🩸'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{}, palette:['🩸','💀','☠','⛧'], micro:{slash:true, underline:true, symbolChance:0.6} }),
    makeRemixStyle({ name:'Grave Script', category:'Creepy Extended', frame:{pre:'✟',post:'✟'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['✟','☩','✠','†','⛧'], micro:{dotVowels:true, slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Spider Vein', category:'Creepy Extended', frame:{pre:'🕷',post:'🕷'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{}, palette:['🕷','🕸','☠','💀'], micro:{underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Midnight Terror', category:'Creepy Extended', frame:{pre:'🌑',post:'🌑'}, bases:{upper:'FRAKTUR',lower:'DOUBLE'}, overrides:{O:'🌑',o:'🌑'}, palette:['🌑','☾','☽','⛧','𖤐'], micro:{tilde:true, dotVowels:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Bone Script', category:'Creepy Extended', frame:{pre:'💀',post:'💀'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['💀','☠','🦴','✟'], micro:{slash:true, underline:true, symbolChance:0.6} }),
    makeRemixStyle({ name:'Cursed Whisper', category:'Creepy Extended', frame:{pre:'〰',post:'〰'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['〰','∿','〜','⌇','☽'], micro:{tilde:true, dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Wraith Mark', category:'Creepy Extended', frame:{pre:'⌀',post:'⌀'}, bases:{upper:'DOUBLE',lower:'FRAKTUR'}, overrides:{}, palette:['⌀','◌','○','◎','⊙'], micro:{slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Crypt Text', category:'Creepy Extended', frame:{pre:'⚰',post:'⚰'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{}, palette:['⚰','💀','☠','✟','†'], micro:{underline:true, slash:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Hollow Eye', category:'Creepy Extended', frame:{pre:'👁',post:'👁'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{O:'👁',o:'👁'}, palette:['👁','◉','⊙','○'], micro:{dotVowels:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Hex Script', category:'Creepy Extended', frame:{pre:'⛧',post:'⛧'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['⛧','🜏','🜍','✠','†'], micro:{slash:true, underline:true, symbolChance:0.6} }),
    makeRemixStyle({ name:'Shadow Rot', category:'Creepy Extended', frame:{pre:'🌒',post:'🌘'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['🌒','🌑','🌘','☾','☽'], micro:{tilde:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Phantom Scratch', category:'Creepy Extended', frame:{pre:'✗',post:'✗'}, bases:{upper:'FRAKTUR',lower:'DOUBLE'}, overrides:{}, palette:['✗','✘','⌧','⊗'], micro:{slash:true, tilde:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Dread Sigil', category:'Creepy Extended', frame:{pre:'𖤐',post:'𖤐'}, bases:{upper:'DOUBLE',lower:'FRAKTUR'}, overrides:{}, palette:['𖤐','⛧','☠','🜏','🝫'], micro:{underline:true, slash:true, symbolChance:0.65} }),
    makeRemixStyle({ name:'Veil Script', category:'Creepy Extended', frame:{pre:'🕯',post:'🕯'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['🕯','🌑','☾','⛧','👁'], micro:{dotVowels:true, tilde:true, symbolChance:0.55} }),
  ];
  window.styles = (window.styles || []).concat(CREEPY_EXTENDED);
})();
