(function(){
  var MIRROR_EXTENDED = [
    makeRemixStyle({ name:'Quantum Flip', category:'Mirror Extended', frame:{pre:'◁',post:'▷'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['◁','▷','◈','⟺'], micro:{slash:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Glass Script', category:'Mirror Extended', frame:{pre:'🪞',post:'🪞'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['🪞','◈','○','◌'], micro:{dotVowels:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Parallel', category:'Mirror Extended', frame:{pre:'⟺',post:'⟺'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['⟺','⟷','↔','⇔'], micro:{underline:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Void Mirror', category:'Mirror Extended', frame:{pre:'◉',post:'◉'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{O:'◉',o:'◉'}, palette:['◉','●','○','◌','⊙'], micro:{slash:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Echo Script', category:'Mirror Extended', frame:{pre:'〜',post:'〜'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{}, palette:['〜','∿','〰','⌇'], micro:{tilde:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Twin Flame', category:'Mirror Extended', frame:{pre:'🔥',post:'🔥'}, bases:{upper:'FULL',lower:'DOUBLE'}, overrides:{}, palette:['🔥','✦','⚡','🌟'], micro:{underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Reflex Bold', category:'Mirror Extended', frame:{pre:'↯',post:'↯'}, bases:{upper:'DOUBLE',lower:'FULL'}, overrides:{}, palette:['↯','⚡','↻','↺'], micro:{underline:true, slash:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Shadow Copy', category:'Mirror Extended', frame:{pre:'🌑',post:'🌕'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{}, palette:['🌑','🌕','◐','◑'], micro:{dotVowels:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Prism Text', category:'Mirror Extended', frame:{pre:'💎',post:'💎'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{}, palette:['💎','◈','⌬','◇'], micro:{dotVowels:true, underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Duality', category:'Mirror Extended', frame:{pre:'☯',post:'☯'}, bases:{upper:'FULL',lower:'MONO'}, overrides:{O:'☯',o:'☯'}, palette:['☯','◐','◑','⊙'], micro:{dotVowels:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Reverse Flux', category:'Mirror Extended', frame:{pre:'⇌',post:'⇌'}, bases:{upper:'MONO',lower:'FULL'}, overrides:{}, palette:['⇌','⇔','↔','⟺'], micro:{slash:true, underline:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Crystal Script', category:'Mirror Extended', frame:{pre:'🔮',post:'🔮'}, bases:{upper:'DOUBLE',lower:'MONO'}, overrides:{}, palette:['🔮','💎','◈','✦'], micro:{dotVowels:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Mirage', category:'Mirror Extended', frame:{pre:'🌊',post:'🌊'}, bases:{upper:'FULL',lower:'FULL'}, overrides:{}, palette:['🌊','〜','∿','〰'], micro:{tilde:true, symbolChance:0.4} }),
    makeRemixStyle({ name:'Paradox', category:'Mirror Extended', frame:{pre:'∞',post:'∞'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{O:'∞',o:'∞'}, palette:['∞','∅','∇','∆'], micro:{dotVowels:true, slash:true, symbolChance:0.45} }),
    makeRemixStyle({ name:'Phase Shift', category:'Mirror Extended', frame:{pre:'⚛',post:'⚛'}, bases:{upper:'MONO',lower:'DOUBLE'}, overrides:{}, palette:['⚛','⌬','◬','△'], micro:{slash:true, underline:true, symbolChance:0.5} }),
  ];
  window.styles = (window.styles || []).concat(MIRROR_EXTENDED);
})();
