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
  A, B, C, D, E,

  kill, core, offsetA, startA, warriorsA, offsetB, startB, warriorsB,
  currentTurn, turnWarriors, currentWarrior, valA, valB, AisPound, cellA, cellB,
  wcell, g, _g, t,
  compile, norm, init, val, cell, unhash, tohash,
  turn, stepsTillDraw, warriorCounterA, warriorCounterB, corepart,
  SKIP,
  globalStartToken, vars, ended, counter, coreSize,
  hash,obj,
  abcde, addsub
) {
  b.innerHTML = `<textarea id=W>
DAT 0 0
ADD #2 -1
CMP #2 -2
DAT 0 0
DJN 2 -4
DAT 0 0
DJN -1 -6
JMP 3 0
DAT 0 0
DAT 0 1
JMN 2 -1
DAT 0 0
JMN -1 -4
JMZ 2 -5
DAT 0 0
JMZ -1 -6
MOV 7 1
DAT 8 9
SLT -9 -10
SUB #1 9
SPL 4 0
MOV #0 -21
JMP -21 0
JMP 1 0
MOV 4 <4
SUB #4 3
ADD #-6 3
ADD 2 1
DAT 0 -28
DAT 0 -1
END 1
</textarea><textarea id=Y>MOV 0 1</textarea><pre id=P></pre>`;
  hash = '#';
  norm = n => (n + 8e9) % 8e3;

  (P.onclick = _ => {
    turn = 0;
    stepsTillDraw = 8e4;
    warriorCounterA = 0;
    warriorCounterB = 0;

    cell = n => core[norm(n)];

    compile = (inputel, offset) => (
      counter = ended = globalStartToken = 0,
        inputel.value.replace(
          /^(.{3})(?: +([#@<]?) *([^,\s;]*)(?:[ ,]+([#@<]?) *([^,\s;]*))?)? *(;.*)?$/gm,
          (m, A='', B = '', C = 0, D = '', E = 0) =>
            ended || m && A &&
            // When END is found the rest is discarded. Set `ended` to true to shortcut remaining calls.
            (ended=A=='END') ?
              globalStartToken = C|0 :
              // IF WE REACH HERE WE WILL COMPILE A CORE CELL at counter
              obj = core[norm(offset + counter++)] = {A, B, C: +C, D, E: +E}
        )
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
      // y=x.shift()
      // [y,...x]=x
      // y=x.slice(0,1)[0]
      currentWarrior = turnWarriors.shift();
      ({A, B, C, D, E} = wcell = cell(currentWarrior));
      valA = val(currentWarrior, B, C);
      valB = val(currentWarrior, D, E);
      AisPound = B == hash;
      cellA = cell(valA);
      cellB = cell(valB);

      // addsub = _ => (AisPound ? cellB.E += valA * _ : (cellB.C = cellA.C + cellB.C*c, cellB.E = cellA.E + cellB.E*e), cellB.X = currentTurn),
      // ({
      //   _: _ => currentWarrior = -1,
      //   ADD: _ => addsub(1),
      //   DAT: _ => currentWarrior = -1,
      //   CMP: _ => AisPound ? (valA == cellB.E) && ++currentWarrior : compareCells(cellA,cellB) && SKIP(),
      //   DJN: _ => (cellB.X = currentTurn, D == hash ? --wcell.E : --cellB.E) && JMP(),
      //   JMP: JMP = _ => currentWarrior = norm(valA - 1),
      //   JMN: _ => cellB.E && JMP(),
      //   JMZ: _ => cellB.E || JMP(),
      //   MOV: _ => AisPound ? (cellB.E = valA, cellB.X = currentTurn) : core[norm(valB)] = {...cellA, X: currentTurn},
      //   SLT: _ => (AisPound ? valA : cellA.E) < cellB.E && ++currentWarrior,
      //   SUB: _ => addsub(-1),
      //   SPL: _ => currentWarrior=~!turnWarriors.push(++currentWarrior, valA), // x=~!y.push()  ===  -1
      // })[A]();

      abcde = o => o=>o.A+o.B+o.C+o.D+o.E,
        addsub = _ => AisPound ? cellB.E += valA * _ : (cellB.C = cellA.C + cellB.C*_, cellB.E = cellA.E + cellB.E*_),
        ({
          _: _ => currentWarrior = -1,
          ADD: _ => addsub(1),
          DAT: _ => currentWarrior = -1,
          CMP: _ => (AisPound ? valA == cellB.E : abcde(cellA) == abcde(cellB)) && ++currentWarrior,
          DJN: _ => (D == hash ? --wcell.E : --cellB.E) && (currentWarrior = norm(valA - 1)),
          JMP: _ => currentWarrior = norm(valA - 1),
          JMN: _ => cellB.E && (currentWarrior = norm(valA - 1)),
          JMZ: _ => cellB.E || (currentWarrior = norm(valA - 1)),
          MOV: _ => AisPound ? cellB.E = valA : core[norm(valB)] = {...cellA},
          SLT: _ => (AisPound ? valA < cellB.E : cellA.E < cellB.E) && ++currentWarrior,
          SUB: _ => addsub(-1),
          SPL: _ => (turnWarriors.push(++currentWarrior),currentWarrior=norm(valA-1)),
        })[A]();

      if (currentWarrior>=0) { // null if warrior dead or already post-processed
        turnWarriors.push(++currentWarrior);
      }

      // P.style.wordWrap='break-word';P.style.whiteSpace='pre-wrap';P.innerHTML = core.map(s=>s.A[0]).join('');
      // P.innerHTML = core.map(s=>s.A[0]).join('').replace(/(.{150})/g,'$1\n');
      // P.innerHTML = core.map((s,i)=>(i%150?'':'\n')+s.A[0]).join('');
      P.innerHTML = core.map(({A:[A]},i)=>i%150?A:'\n'+A).join('');
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
