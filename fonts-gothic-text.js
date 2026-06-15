(function(){
  var GOTHIC_EXTENDED = [
    makeRemixStyle({ name:'Cathedral Script', category:'Gothic Extended', frame:{pre:'✠',post:'✠'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['✠','☩','✟','†','⛧'], micro:{dotVowels:true, underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Monastery Ink', category:'Gothic Extended', frame:{pre:'†',post:'†'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['†','✟','☩','✠'], micro:{dotVowels:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Iron Throne', category:'Gothic Extended', frame:{pre:'♔',post:'♛'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{K:'♔',Q:'♛',R:'♜'}, palette:['♔','♛','♜','♝','♞'], micro:{underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Raven Quill', category:'Gothic Extended', frame:{pre:'🦅',post:'🦅'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['🦅','⛧','✠','†'], micro:{dotVowels:true, slash:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Dark Codex', category:'Gothic Extended', frame:{pre:'📜',post:'📜'}, bases:{upper:'FRAKTUR',lower:'DOUBLE'}, overrides:{}, palette:['📜','✠','†','☩'], micro:{dotVowels:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Gargoyle Text', category:'Gothic Extended', frame:{pre:'👁',post:'👁'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{O:'👁',o:'👁'}, palette:['👁','⛧','✠','𖤐'], micro:{underline:true, dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Siege Tower', category:'Gothic Extended', frame:{pre:'🏰',post:'🏰'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{}, palette:['🏰','⚔','🛡','✠'], micro:{underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Black Vellum', category:'Gothic Extended', frame:{pre:'🖤',post:'🖤'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['🖤','✠','†','⛧','𖤐'], micro:{dotVowels:true, tilde:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Knight Script', category:'Gothic Extended', frame:{pre:'⚔',post:'⚔'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['⚔','🛡','✠','♔'], micro:{underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Templar Bold', category:'Gothic Extended', frame:{pre:'✞',post:'✞'}, bases:{upper:'FRAKTUR',lower:'DOUBLE'}, overrides:{}, palette:['✞','✟','✠','☩','†'], micro:{underline:true, dotVowels:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Cloister Ink', category:'Gothic Extended', frame:{pre:'⸙',post:'⸙'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['⸙','✠','†','☩','❖'], micro:{dotVowels:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Dungeon Script', category:'Gothic Extended', frame:{pre:'⛓',post:'⛓'}, bases:{upper:'FRAKTUR',lower:'MONO'}, overrides:{}, palette:['⛓','🔒','⚙','⚔'], micro:{slash:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Obsidian Codex', category:'Gothic Extended', frame:{pre:'🌑',post:'🌑'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['🌑','⛧','✠','𖤐','🜏'], micro:{dotVowels:true, tilde:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Wyvern Script', category:'Gothic Extended', frame:{pre:'🐲',post:'🐲'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['🐲','🔥','⚔','✠'], micro:{underline:true, slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Altar Text', category:'Gothic Extended', frame:{pre:'🕯',post:'🕯'}, bases:{upper:'FRAKTUR',lower:'DOUBLE'}, overrides:{}, palette:['🕯','✠','†','☩','⛧'], micro:{dotVowels:true, underline:true, symbolChance:0.45} }),
  ];
  window.styles = (window.styles || []).concat(GOTHIC_EXTENDED);
})();
