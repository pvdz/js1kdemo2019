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

  kill, core, warriorsA, offsetB, warriorsB,
  currentTurn, turnWarriors, currentWarrior, valA, valB, AisPound, cellA, cellB,
  wcell, g, _g, t,
  compile, norm, init, val, cell, unhash, tohash,
  turn, stepsTillDraw, corepart,
  globalStartToken, vars, ended, coreSize,
  addsub,
  timer
) {
  b.innerHTML = `<textarea id=W>
JMP   2    0
DAT   0    0
ADD   #2   -1
CMP   #2   -2
DAT   0    0
DJN   2    -4
DAT   0    0
DJN   -1   -6
JMP   3    0
DAT   0    0
DAT   0    1
JMN   2    -1
DAT   0    0
JMN   -1   -4
JMZ   2    -5
DAT   0    0
JMZ   -1   -6
MOV   7    1
DAT   8    9
SLT   -9   -10
SUB   #1   9
SPL   4    0
MOV   #0   -21
JMP   -21  0
JMP   1    0
MOV   4    <4
SUB   #4   3
ADD   #-6  3
ADD   2    1
DAT   0    -28
DAT   0    -1
</textarea><textarea id=Y>MOV 0 1</textarea><pre id=P></pre>`;
  norm = n => (n + 8e9) % 8e3;

  (P.onclick = _ => {
    clearTimeout(timer),
    stepsTillDraw = 8e4;

    cell = n => core[norm(n)];
    val = (X,Y,Z)=>Y=='#'?Z:Y=='@'?X+Z+cell(X+Z)[4]:Y=='<'?--cell(X+Z)[4]:X+Z;

    compile = (inputel, offset, counter = ended = globalStartToken = 0) =>
      inputel.value.replace(
        /^(.{3})(?: +([#@<]?) *([^,\s;]*)(?:[ ,]+([#@<]?) *([^,\s;]*))?)? *(;.*)?$/gm,
        (m, A='', B = '', C = 0, D = '', E = 0) =>
          ended || A &&
          // When END is found the rest is discarded. Set `ended` to true to shortcut remaining calls.
          (ended=A=='END') ?
            globalStartToken = C :
            // IF WE REACH HERE WE WILL COMPILE A CORE CELL at counter
            core[norm(offset + counter++)] = [A, B, +C, D, +E]
      )
      | globalStartToken;

    core=Array(8e3).fill().map(_=>'_#0#0'.split(''));

    warriorsA = [compile(W, 0)];
    warriorsB = [compile(Y, offsetB = 100 + ~~(Math.random() * 7800)) + offsetB];

    (again = _ => (
      currentTurn = stepsTillDraw % 2,
      turnWarriors = currentTurn ? warriorsA : warriorsB,
      currentWarrior = turnWarriors.shift(),
      [A, B, C, D, E] = wcell = cell(currentWarrior),
      valA = val(currentWarrior, B, C),
      valB = val(currentWarrior, D, E),
      AisPound = B == '#',
      cellA = cell(valA),
      cellB = cell(valB),

      addsub = _ => (AisPound ? cellB[4] += valA * _ : (cellB[2] = cellA[2] + cellB[2]*_, cellB[4] = cellA[4] + cellB[4]*_)),
      {
        _: _ => currentWarrior = -1,
        ADD: _ => addsub(1), // use functional with default
        DAT: _ => currentWarrior = -1,
        CMP: _ => (AisPound ? valA == cellB[4] : cellA+''==cellB) && ++currentWarrior,
        DJN: _ => (D == '#' ? --wcell[4] : --cellB[4]) && (currentWarrior = norm(valA - 1)),
        JMP: _ => currentWarrior = norm(valA - 1),
        JMN: _ => cellB[4] && (currentWarrior = norm(valA - 1)),
        JMZ: _ => cellB[4] || (currentWarrior = norm(valA - 1)),
        MOV: _ => (AisPound ? cellB[4] = valA : core[norm(valB)] = [...cellA]),
        SLT: _ => (AisPound ? valA : cellA[4]) < cellB[4] && ++currentWarrior,
        SUB: _ => addsub(-1),
        SPL: _ => (turnWarriors.push(++currentWarrior),currentWarrior=norm(valA-1)),
      }[A](),

      ++currentWarrior>0&&turnWarriors.push(currentWarrior),

      P.innerHTML = core.map(([[A]],i)=>i%150?A:'\n'+A).join('') + (
        turnWarriors.length
          ? --stepsTillDraw
            ? setTimeout(again, 1)&&` ${stepsTillDraw} ${warriorsA.length} ` + warriorsB.length
            : 'Timeout'
          : currentTurn
            ? 'B wins'
            : 'A wins'
      )
    ))();
  })();
}


// END
