(function(){
  var BOLD_EXTENDED = [
    makeRemixStyle({ name:'Iron Fist', category:'Bold Extended', frame:{pre:'⚔',post:'⚔'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['⚔','🛡','⚡','🔱'], micro:{underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Titan Bold', category:'Bold Extended', frame:{pre:'💪',post:'💪'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['💪','⚡','🔥','💥'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'War Cry', category:'Bold Extended', frame:{pre:'⚡',post:'⚡'}, bases:{upper:'FULL',lower:'DOUBLE'}, overrides:{}, palette:['⚡','🔥','💥','⚔'], micro:{underline:true, slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Steel Frame', category:'Bold Extended', frame:{pre:'【',post:'】'}, bases:{upper:'DOUBLE',lower:'FULL'}, overrides:{}, palette:['◈','▣','◧','⌬'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Apex Strike', category:'Bold Extended', frame:{pre:'▲',post:'▲'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{A:'△',V:'▽'}, palette:['▲','△','▴','▵'], micro:{underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Warlord', category:'Bold Extended', frame:{pre:'👑',post:'👑'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{K:'♚',Q:'♛'}, palette:['👑','⚔','🛡','🔱'], micro:{underline:true, dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Thunder Bold', category:'Bold Extended', frame:{pre:'⚡',post:'⚡'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['⚡','🌩','💥','🔥'], micro:{underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Siege Bold', category:'Bold Extended', frame:{pre:'🏰',post:'🏰'}, bases:{upper:'DOUBLE',lower:'FULL'}, overrides:{}, palette:['🏰','⚔','🛡','🔱'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Beast Mode', category:'Bold Extended', frame:{pre:'🦁',post:'🦁'}, bases:{upper:'FULL',lower:'DOUBLE'}, overrides:{}, palette:['🦁','⚡','🔥','💥'], micro:{underline:true, slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Nova Blast', category:'Bold Extended', frame:{pre:'💥',post:'💥'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{O:'⊛',o:'⊛'}, palette:['💥','⚡','🌟','✦'], micro:{underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Omega Bold', category:'Bold Extended', frame:{pre:'Ω',post:'Ω'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{O:'Ω',o:'ω'}, palette:['Ω','Φ','Σ','Δ','Λ'], micro:{underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Fortress', category:'Bold Extended', frame:{pre:'▓▓',post:'▓▓'}, bases:{upper:'DOUBLE',lower:'FULL'}, overrides:{}, palette:['▓','▒','░','▐'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Colossus', category:'Bold Extended', frame:{pre:'⊛',post:'⊛'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['⊛','◉','●','⊙'], micro:{underline:true, dotVowels:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Raid Bold', category:'Bold Extended', frame:{pre:'🎯',post:'🎯'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['🎯','⚔','🏹','💀'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Dragon Fist', category:'Bold Extended', frame:{pre:'🐉',post:'🐉'}, bases:{upper:'FULL',lower:'DOUBLE'}, overrides:{}, palette:['🐉','🔥','⚡','✦'], micro:{underline:true, slash:true, symbolChance:0.5} }),
  ];
  window.styles = (window.styles || []).concat(BOLD_EXTENDED);
})();
