// http://corewar.co.uk/standards/icws88.txt
// icws'88 syntax only, no '94+
// env variables not present (100b)
// no save/restore through hash (300b)
// more restrictions on input code (regex shortcuts)
// syntax is case sensitive (labels/vars/ops), ops must be upper cased
// value normalization could break with high negatives
f(b,eval);

function f(
  b,EV,
  // A, B, C, D, E,

           kill, core, offsetA, startA, warriorsA, offsetB, startB, warriorsB,
           currentTurn, turnWarriors, currentWarrior, ROcurrentWarriorAdr, valA, valB, AisPound, cellA, cellB,
           wcell, g, _g, t,
           compile, norm, init, val, cell, unhash, tohash,
           turn, stepsTillDraw, warriorCounterA, warriorCounterB, labels, corepart,
           SKIP, JMP, DAT,
           globalStartToken, vars, ended, counter, coreSize,
           hash
) {
  b.innerHTML = '<textarea id=W>foo MOV 0 1\nEND foo</textarea><textarea id=Y>MOV 0 1</textarea><pre id=P></pre>';
  hash = '#';
  norm = n => (n + 8e9) % 8e3;

  (P.onclick = _ => {
    turn = 0;
    stepsTillDraw = 8e4;
    warriorCounterA = 0;
    warriorCounterB = 0;

    cell = n => core[norm(n)];

    compile = (inputel, offset) => (
      labels = {},
      counter = ended = globalStartToken = 0,
      vars = {},
      inputel.value.replace(
        /^ *(?:([\w\d_]+):? +|$)?(?:(\b_|DJN|JMP|JMZ|JMN|MOV|SPL|SUB|DAT|ADD|CMP|EQU|END\b)(?: +([#@<]?) *([^,\s;]*)(?:[ ,]+([#@<]?) *([^,\s;]*))?)?)? *(;.*)?$/gm,
        // TODO: can do ...rest and slice (or not even) but if I'm going to drop optional groups that's trickier
        (m, label='', A='', B = '', C = '0', D = '', E) =>
          ended || m &&
          (
            // When END is found the rest is discarded. Set `ended` to true to shortcut remaining calls.
            // (It ends up in the label group, which is acceptable for me)
            (ended=(A+label)=='END') ? globalStartToken = C ? labels[C] : +C :
              // if a label has its own line move it to the next call with an op. if this was an empty line then
              // propagate the previous label (or undefined, making it a noop, which is fine too)
              // log EQU vars in this step, do not add them to the list, they are pseudo instructions (compile time only)
              A == 'EQU' ? (vars[label] = B + C) :
                A && (
                  // IF WE REACH HERE WE WILL COMPILE A CORE CELL at counter
                  // if a label is present set its index now. Also clear the prev label so we dont override it next time
                  (label + 0 !== label) ? labels[label] = counter : 1,
                  core[norm(offset + counter++)] = (
                    // DAT has an exception where if it has one operand, it is to be interpreted as the B operand
                    // create list of linesd
                    A != 'DAT' || E ? {A, B, C, D, E: E || '0'} : {A, B: '', C: '0', D: B, E: C}
                  )
                )
          )
      ),
      g = (s, i) => EV(_g(_g(''+s, vars, i), labels, 0)),
      _g = (s, o, i) => s.replace(/[\w\d_]+/g, s => s in o ? o[s] - i : s),
      core.map((O,i) => (O.C = g(O.C, i-offset), O.E = g(O.E, i-offset)))
    );

    // for(core=[coreSize=8e3];coreSize--;)core[coreSize]={A:'_',B:hash,C:0,D:hash,E:0};
    core=Array(8e3).fill().map(_=>({A:'_',B:hash,C:0,D:hash,E:0}));

    compile(W, offsetA = 0);
    startA = globalStartToken;
    warriorsA = [{i: 0, a: offsetA + startA}];
    compile(Y, offsetB = 100 + ~~(Math.random() * 7800));
    startB = globalStartToken;
    warriorsB = [{i: 0, a: offsetB + startB}];

    val = (X,Y,Z)=>Y=='#'?Z:Y=='@'?X+Z+cell(X+Z).E:Y=='<'?--cell(X+Z).E:X+Z;
    // val = (X,Y,Z)=>({'#':_=>snum, '@':_=>offset + snum + cell(offset + snum).E, '<'_=>--cell(offset + snum).E, '':_=>offset + snum})[p]();
    // val = (X,Y,Z)=>{switch(Y){case'#':}}

    (again = _ => {
      currentTurn = turn % 2;
      turnWarriors = currentTurn ? warriorsA : warriorsB;
      // y = x.shift();
      // [y,...x]=x
      currentWarrior = turnWarriors.shift();
      ROcurrentWarriorAdr = currentWarrior.a;
      ({A, B, C, D, E} = wcell = cell(ROcurrentWarriorAdr));
      valA = val(ROcurrentWarriorAdr, B, C);
      valB = val(ROcurrentWarriorAdr, D, E);
      AisPound = B == hash;
      cellA = cell(valA);
      cellB = cell(valB);


      SKIP = _ => ++currentWarrior.a;
      ({
        _: DAT = _ => currentWarrior = 0,
        ADD: _ => AisPound ? cellB.E += valA : (cellB.C = cellA.C + cellB.C, cellB.E = cellA.E + cellB.E),
        DAT,
        CMP: _ => AisPound ? (valA == cellB.E) && SKIP() : ((cellA.join(',') == cellB.join(',')) && SKIP()),
        DJN: _ => ((D == hash) ? --wcell.E : --cellB.E) != 0 && JMP(),
        JMP: JMP = _ => currentWarrior.a = valA - 1,
        JMN: _ => cellB.E && JMP(),
        JMZ: _ => cellB.E || JMP(),
        MOV: _ => AisPound ? cellB.E = valA : core[norm(valB)] = {...cellA},
        SLT: _ => AisPound ? valA < cellB.E && SKIP() : (cellA.E < cellB.E && SKIP()),
        SUB: _ => AisPound ? cellB.E -= valA : (cellB.C = cellA.C - cellB.C, cellB.E = cellA.E - cellB.E),
        SPL: _ => currentWarrior = !(SKIP(), turnWarriors.push(currentWarrior, {
          i: currentTurn ? ++warriorCounterA : ++warriorCounterB,
          a: valA
        })),
      })[A]();

      if (currentWarrior) { // null if warrior dead or already post-processed
        SKIP(turnWarriors.push(currentWarrior));
      }

      // P.style.wordWrap='break-word';P.style.whiteSpace='pre-wrap';P.innerHTML = core.map(s=>s.A[0]).join('');
      // P.innerHTML = core.map(s=>s.A[0]).join('').replace(/(.{150})/g,'$1\n');
      // P.innerHTML = core.map((s,i)=>(i%150?'':'\n')+s.A[0]).join('');
      P.innerHTML = core.map(({A:[A]},i)=>i%150?A:'\n'+A).join('');
      // P.innerHTML = core.map(({A:[A]},i)=>(i%150?'':'\n')+A).join('');

      P.innerHTML += !turnWarriors.length ?
        (currentTurn ? 'B wins' : 'A wins') :
        --stepsTillDraw ?
          setTimeout(again, 1)&&++turn :
          'Timeout';
    })();
  })();
}


// END
