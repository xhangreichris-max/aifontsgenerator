(function(){
  var STRIKETHROUGH_EXTENDED = [
    makeRemixStyle({ name:'Redacted Bold', category:'Strikethrough Extended', frame:{pre:'██',post:'██'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['██','▓▓','░░','▒▒'], micro:{slash:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Classified', category:'Strikethrough Extended', frame:{pre:'[CLASSIFIED]',post:'[CLASSIFIED]'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['⌗','⟊','◧','▣'], micro:{slash:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Delete Script', category:'Strikethrough Extended', frame:{pre:'⌫',post:'⌦'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{}, palette:['⌫','⌦','⌧','✘'], micro:{slash:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Void Out', category:'Strikethrough Extended', frame:{pre:'✗',post:'✗'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{O:'⊗',o:'⊗'}, palette:['✗','✘','⌧','⊗'], micro:{slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Censor Bar', category:'Strikethrough Extended', frame:{pre:'▬',post:'▬'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['▬','▭','▀','▄'], micro:{slash:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Error Line', category:'Strikethrough Extended', frame:{pre:'⚠',post:'⚠'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['⚠','⛔','🚫','⌀'], micro:{tilde:true, slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'X Factor', category:'Strikethrough Extended', frame:{pre:'❌',post:'❌'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{X:'❌',x:'❌'}, palette:['❌','✘','✗','⊗'], micro:{slash:true, symbolChance:0.55} }),
    makeRemixStyle({ name:'Scratch Out', category:'Strikethrough Extended', frame:{pre:'〰',post:'〰'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{}, palette:['〰','∿','〜','⌇'], micro:{tilde:true, slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Revoke', category:'Strikethrough Extended', frame:{pre:'🚫',post:'🚫'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{O:'🚫',o:'🚫'}, palette:['🚫','⛔','⌀','✗'], micro:{slash:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Corrupt Log', category:'Strikethrough Extended', frame:{pre:'📋',post:'📋'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['📋','⌗','⟊','▣'], micro:{slash:true, tilde:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Black Mark', category:'Strikethrough Extended', frame:{pre:'🖊',post:'🖊'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{}, palette:['🖊','✏','📝','⌗'], micro:{underline:true, slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Null Script', category:'Strikethrough Extended', frame:{pre:'∅',post:'∅'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{O:'∅',o:'∅'}, palette:['∅','⌀','○','◌'], micro:{slash:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Strike Bold', category:'Strikethrough Extended', frame:{pre:'⚡',post:'⚡'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['⚡','💥','⚠','✗'], micro:{slash:true, underline:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Overruled', category:'Strikethrough Extended', frame:{pre:'⊘',post:'⊘'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{O:'⊘',o:'⊘'}, palette:['⊘','⌀','∅','⊗'], micro:{slash:true, tilde:true, symbolChance:0.5} }),
    makeRemixStyle({ name:'Ghost Line', category:'Strikethrough Extended', frame:{pre:'👻',post:'👻'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{}, palette:['👻','☠','💀','✗'], micro:{slash:true, underline:true, symbolChance:0.5} }),
  ];
  window.styles = (window.styles || []).concat(STRIKETHROUGH_EXTENDED);
})();
