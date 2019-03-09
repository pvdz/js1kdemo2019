// http://corewar.co.uk/standards/icws88.txt
// icws'88 syntax only, no '94+
// no labels, no vars (EQU) (sorry, too expensive)
// env variables not present (100b)
// no save/restore through hash (300b)
// more restrictions on input code (regex shortcuts)
// ops must be upper cased
// value normalization could break with high negatives
f(b,eval);

function f(
  b,EV,
  // A, B, C, D, E,

           kill, core, offsetA, startA, warriorsA, offsetB, startB, warriorsB,
           currentTurn, turnWarriors, currentWarrior, valA, valB, AisPound, cellA, cellB,
           wcell, g, _g, t,
           compile, norm, init, val, cell, unhash, tohash,
           turn, stepsTillDraw, warriorCounterA, warriorCounterB, corepart,
           SKIP, JMP, DAT,
           globalStartToken, vars, ended, counter, coreSize,
           hash,obj
) {
  b.innerHTML = '<textarea id=W>MOV 0 1</textarea><textarea id=Y>MOV 0 1</textarea><pre id=P></pre>';
  hash = '#';
  norm = n => (n + 8e9) % 8e3;

  (P.onclick = _ => {
    turn = 0;
    stepsTillDraw = 8e4;
    warriorCounterA = 0;
    warriorCounterB = 0;

    cell = n => core[norm(n)];

    compile = (inputel, offset, X=counter = ended = globalStartToken = 0) =>
      inputel.value.replace(
        /^(.{3})(?: +([#@<]?) *([^,\s;]*)(?:[ ,]+([#@<]?) *([^,\s;]*))?)? *(;.*)?$/gm,
        (m, A='', B = '', C = 0, D = '', E = 0) =>
          ended || m && A &&
            // When END is found the rest is discarded. Set `ended` to true to shortcut remaining calls.
            (ended=A=='END') ?
              globalStartToken = C|0 :
              // IF WE REACH HERE WE WILL COMPILE A CORE CELL at counter
              obj = core[norm(offset + counter++)] = {A, B, C: +C, D, E: +E}
      );

    // for(core=[coreSize=8e3];coreSize--;)core[coreSize]={A:'_',B:hash,C:0,D:hash,E:0};
    core=Array(8e3).fill().map(_=>({A:'_',B:hash,C:0,D:hash,E:0}));

    compile(W, 0);
    startA = globalStartToken;
    warriorsA = [startA];
    compile(Y, offsetB = 100 + ~~(Math.random() * 7800));
    startB = globalStartToken;
    warriorsB = [offsetB + startB];

    val = (X,Y,Z)=>Y=='#'?Z:Y=='@'?X+Z+cell(X+Z).E:Y=='<'?--cell(X+Z).E:X+Z;
    // val = (X,Y,Z)=>({'#':_=>snum, '@':_=>offset + snum + cell(offset + snum).E, '<'_=>--cell(offset + snum).E, '':_=>offset + snum})[p]();
    // val = (X,Y,Z)=>{switch(Y){case'#':}}

    (again = _ => {
      currentTurn = turn % 2;
      turnWarriors = currentTurn ? warriorsA : warriorsB; 
      // y = x.shift();
      // [y,...x]=x
      currentWarrior = turnWarriors.shift();
      ({A, B, C, D, E} = wcell = cell(currentWarrior));
      valA = val(currentWarrior, B, C);
      valB = val(currentWarrior, D, E);
      AisPound = B == hash;
      cellA = cell(valA);
      cellB = cell(valB);

      compareCells = ({A,B,C,D,E}, {a,b,c,d,e}) => A+B+C+D+E == a+b+c+d+e,
      addsub = _ => (AisPound ? cellB.E += valA * _ : (cellB.C = cellA.C + cellB.C*c, cellB.E = cellA.E + cellB.E*e), cellB.X = currentTurn),

      ({
        _: _ => currentWarrior = -1,
        ADD: _ => addsub(1),
        DAT: _ => currentWarrior = -1,
        CMP: _ => AisPound ? (valA == cellB.E) && ++currentWarrior : compareCells(cellA,cellB) && SKIP(),
        DJN: _ => (cellB.X = currentTurn, D == hash ? --wcell.E : --cellB.E) && JMP(),
        JMP: JMP = _ => currentWarrior = norm(valA - 1),
        JMN: _ => cellB.E && JMP(),
        JMZ: _ => cellB.E || JMP(),
        MOV: _ => AisPound ? (cellB.E = valA, cellB.X = currentTurn) : core[norm(valB)] = {...cellA, X: currentTurn},
        SLT: _ => (AisPound ? valA : cellA.E) < cellB.E && ++currentWarrior,
        SUB: _ => addsub(-1),
        SPL: _ => currentWarrior=~!turnWarriors.push(++currentWarrior, valA), // x=~!y.push()  ===  -1
      })[A]();

      if (++currentWarrior>0) { // -1 if warrior dead or already post-processed
        turnWarriors.push(currentWarrior);
      }

      // P.style.wordWrap='break-word';P.style.whiteSpace='pre-wrap';P.innerHTML = core.map(s=>s.A[0]).join('');
      // P.innerHTML = core.map(s=>s.A[0]).join('').replace(/(.{150})/g,'$1\n');
      // P.innerHTML = core.map((s,i)=>(i%150?'':'\n')+s.A[0]).join('');
      P.innerHTML = core.map(({A:[A],X},i)=>i%150?X:'\n'+X).join('');
      // P.innerHTML = core.map(({A:[A]},i)=>(i%150?'':'\n')+A).join('');

      P.innerHTML += !turnWarriors.length ?
        (currentTurn ? 'B wins' : 'A wins') :
        --stepsTillDraw ?
          setTimeout(again, 1)&&` ${++turn} ${warriorsB.length} ` + warriorsB.length:
          'Timeout';
    })();
  })();
}


// END
