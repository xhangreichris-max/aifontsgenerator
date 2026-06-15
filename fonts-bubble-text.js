(function(){
  var BUBBLE_EXTENDED = [
    makeRemixStyle({ name:'Candy Pop', category:'Bubble Extended', frame:{pre:'🍬',post:'🍬'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['🍬','🍭','🍡','🍩'], micro:{dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Pastel Dream', category:'Bubble Extended', frame:{pre:'🌸',post:'🌸'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['🌸','❀','🌺','🌻','✿'], micro:{dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Star Puff', category:'Bubble Extended', frame:{pre:'⭐',post:'⭐'}, bases:{upper:'DOUBLE',lower:'FULL'}, overrides:{}, palette:['⭐','✦','✧','⋆','✶'], micro:{dotVowels:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Cloud Nine', category:'Bubble Extended', frame:{pre:'☁',post:'☁'}, bases:{upper:'FULL',lower:'DOUBLE'}, overrides:{O:'○',o:'○'}, palette:['☁','⛅','🌤','✦'], micro:{dotVowels:true, tilde:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Sakura Bubble', category:'Bubble Extended', frame:{pre:'🌷',post:'🌷'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['🌷','🌸','🌺','❀','✿'], micro:{dotVowels:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Bunny Soft', category:'Bubble Extended', frame:{pre:'🐰',post:'🐰'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['🐰','🌸','✦','💕'], micro:{dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Honey Script', category:'Bubble Extended', frame:{pre:'🍯',post:'🍯'}, bases:{upper:'DOUBLE',lower:'FULL'}, overrides:{}, palette:['🍯','🌻','⭐','✦'], micro:{dotVowels:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Mochi Pop', category:'Bubble Extended', frame:{pre:'🍡',post:'🍡'}, bases:{upper:'FULL',lower:'DOUBLE'}, overrides:{}, palette:['🍡','🌸','💜','💗'], micro:{dotVowels:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Rainbow Puff', category:'Bubble Extended', frame:{pre:'🌈',post:'🌈'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['🌈','⭐','✦','🌸'], micro:{dotVowels:true, tilde:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Kitten Script', category:'Bubble Extended', frame:{pre:'🐱',post:'🐱'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['🐱','🌸','💕','✦'], micro:{dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Dewdrop', category:'Bubble Extended', frame:{pre:'💧',post:'💧'}, bases:{upper:'DOUBLE',lower:'FULL'}, overrides:{O:'💧',o:'💧'}, palette:['💧','🌊','○','◌'], micro:{dotVowels:true, tilde:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Sugar Rush', category:'Bubble Extended', frame:{pre:'🍭',post:'🍭'}, bases:{upper:'FULL',lower:'DOUBLE'}, overrides:{}, palette:['🍭','🍬','🍩','⭐'], micro:{dotVowels:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Sparkle Cute', category:'Bubble Extended', frame:{pre:'✨',post:'✨'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['✨','⭐','✦','✧','⋆'], micro:{dotVowels:true, underline:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Petal Script', category:'Bubble Extended', frame:{pre:'🪷',post:'🪷'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['🪷','🌸','❀','✿','🌺'], micro:{dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Fluffy Cloud', category:'Bubble Extended', frame:{pre:'🌙',post:'🌙'}, bases:{upper:'DOUBLE',lower:'FULL'}, overrides:{}, palette:['🌙','⭐','✦','☁','✧'], micro:{dotVowels:true, tilde:true, symbolChance:0.5} }),
  ];
  window.styles = (window.styles || []).concat(BUBBLE_EXTENDED);
})();
