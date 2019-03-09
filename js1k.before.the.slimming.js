// http://corewar.co.uk/standards/icws88.txt

f(b, eval);

function f(f, E,
   kill, core, offsetA, startA, warriorsA, offsetB, startB, warriorsB,
           ta, turnWarriors, currentWarrior, ROcurrentWarriorAdr, valA, valB, AisPound, cellA, cellB,
           wcell,a,b,c,d,e,g,_g,t,
           compile,norm,init,val,cell,coreloop,unhash,tohash,
           turn,stepsLeft,warriorCounterA,warriorCounterB,labels,corepart,
           SKIP,JMP,DAT,
           start,vars,lines,ended,counter,prevlabel
) {
// ~ 625 b
  f.innerHTML = `
<style>
*{font:8px/10px monospace}
pre{height:850px;width:500px;float:left}
#W,#Y{height:400px;width:200px;color:white}
#W,i{background:#f00}
#Y,b{background:#00f}
</style>
<button id=I>Init</button>
<button id=S>Step</button>
<button id=T>Run</button>
<button id=D>js1k</button>
<button id=K>Stop</button>
<pre id=C></pre>

<textarea id=W>
MOV <7 <11
DJN -1 11
MOV #7 261
MOV #259 264
MOV #14 264
SPL 251 0
JMP 2 0
DAT 0 7
SPL @5 0
ADD #8 4
JMP -2 0
DAT 0 259
DAT 0 14
DAT 0 2
</textarea>
<textarea id=Y>
JMP 2 0
DAT 0 0
MOV #12 -1
MOV @-2 <5
DJN -1 -3
SPL @3 0
ADD #653 2
JMZ -5 -6
DAT 0 833
END 0
</textarea>
`;

  norm = n => (n + 8e9) % 8e3;

  init = _ => {
    turn = 0;
    stepsLeft = 8e4;
    warriorCounterA = 0;
    warriorCounterB = 0;

    val = (offset, p, snum) => (p === '#') ? snum : (p === '@') ? offset + snum + cell(offset + snum).e : (p === '<') ? --cell(offset + snum).e : offset + snum;

    cell = n => core[norm(n)];

    compile = (input, offset) => {
      // this is about 100 uncompressible bytes...
      labels = {CORESIZE: 8e3, MAXCYCLES: 8e4, MAXPROCESSES: 8e3, WARRIORS: 2, MAXLENGTH: 100, MINDISTANCE: 100, VERSION: 1};
      start = 0;

      vars = {}; // vars are extrapolated (can be any string). referring to vars replaces the varname with the whole string at compile time, no questions asked.

      lines = [];
      ended = false;

      counter = -1; // offset=0
      prevlabel=0;
      // ~425 b
      input.toUpperCase().replace(
        /^[ \t]*(?:([\w\d_]+):?(?:[ \t]+|$))?(?:(?:\b(_|DJN|JMP|JMZ|JMN|MOV|SPL|SUB|DAT|ADD|CMP|EQU|END)\b)(?:[ \t]+([#@<]?)[ \t]*([\w\d_-]+(?:[+\-*\/<>!&|<>=]+[\w\d_-]+)*))?(?:[ \t,]+([#@<]?)[ \t]*([\w\d_-]+(?:[+\-*\/<>!&|<>=]+[\w\d_-]+)*)?)?)?[ \t]*(?:;.*)?$/gm,
        // TODO: can do ...rest and slice (or not even) but if I'm going to drop optional groups that's trickier
        (m, label = prevlabel, op, moda, vala, modb, valb) =>
          ended || m &&
          (
            // When END is found the rest is discarded. Set `ended` to true to shortcut remaining calls.
            // (It ends up in the label group, which is acceptable for me)
            (ended = {[op]:1,[label]:1}.END) ? start = vala || 0 :
              // if a label has its own line move it to the next call with an op. if this was an empty line then
              // propagate the previous label (or undefined, making it a noop, which is fine too)
              !op ? prevlabel = label :
                // log EQU vars in this step, do not add them to the list, they are pseudo instructions (compile time only)
                op == 'EQU' ? (vars[label] = (moda || '') + vala) :
                  (
                    // IF WE REACH HERE WE WILL COMPILE A CORE CELL at counter
                    ++counter,
                      // if a label is present set its index now. Also clear the prev label so we dont override it next time
                      (label+0!==label) ? labels[label] = prevlabel = counter : 1,
                      lines.push(
                        // DAT has an exception where if it has one operand, it is to be interpreted as the B operand
                        // create list of lines
                        op != 'DAT' || valb ? [op, moda, vala, modb, valb] : [op, '', '0', moda, vala]
                      )
                  )
          )
      );
      g = (s, i) => _g(_g(s, vars, i), labels, 0);
      _g = (s, o, i) => s.replace(/\b[\w\d_]+\b/g, s => s in o ? o[s] - i : s);

      lines
      .map(([a, b = '', vala = '0', d = '', valb = '0'], i) =>
        core[norm(i + offset)] = {
          a,
          b,
          c: E(g(vala), i),
          d,
          e: E(g(valb), i),
        }
      );

      // start can be a label or numeric offset. dont make it harder then it needs to be.
      start = labels[start] || +start;

      return start;
    }

    core = new Array(8e3).fill(0).map(_ => ({a: '_', b: '#', c: 0, d: '#', e: 0}));
    offsetA = 0;
    startA = compile(W.value, offsetA);
    warriorsA = [{i: 0, a: offsetA + startA}];
    offsetB = 100 + ~~(Math.random() * 7800);
    startB = compile(Y.value, offsetB);
    warriorsB = [{i: 0, a: offsetB + startB}];

    ~ 800 b
    coreloop = s => {
      ta = turn % 2;
      turnWarriors = ta ? warriorsA : warriorsB;
      currentWarrior = turnWarriors.shift();
      ROcurrentWarriorAdr = currentWarrior.a;
      wcell = cell(ROcurrentWarriorAdr);
      ({a, b, c, d, e} = wcell);
      valA = val(ROcurrentWarriorAdr, b, c);
      valB = val(ROcurrentWarriorAdr, d, e);
      AisPound = b === '#';
      cellA = cell(valA);
      cellB = cell(valB);

      SKIP = _ => ++currentWarrior.a;
      ({
        _: DAT=_ => currentWarrior = 0,
        ADD: _ => AisPound ? cellB.e += valA : (cellB.c = cellA.c + cellB.c, cellB.e = cellA.e + cellB.e),
        DAT,
        CMP: _ => AisPound ? (valA === cellB.e) && SKIP() : ((cellA.join(',') === cellB.join(',')) && SKIP()),
        DJN: _ => ((d == '#') ? --wcell.e : --cellB.e) != 0 && JMP(),
        JMP: JMP =_ => currentWarrior.a = valA - 1,
        JMN: _ => 0 != cellB.e && JMP(),
        JMZ: _ => 0 == cellB.e && JMP(),
        MOV: _ => AisPound ? cellB.e = valA : (core[norm(valB)] = {...cellA}, (core[norm(valB)].a === '_') && (core[norm(valB)].a = 'DAT')),
        SLT: _ => AisPound ? valA < cellB.e && SKIP() : (cellA.e < cellB.e && SKIP()),
        SUB: _ => AisPound ? cellB.e -= valA : (cellB.c = cellA.c - cellB.c, cellB.e = cellA.e - cellB.e),
        SPL: _ => currentWarrior = !(SKIP(), turnWarriors.push(currentWarrior, {
          i: turnWarriors === warriorsA ? ++warriorCounterA : ++warriorCounterB,
          a: valA
        })),
      })[a]();

      if (currentWarrior) { // null if warrior dead or already post-processed
        SKIP(turnWarriors.push(currentWarrior));
      }

      if (!s) C.innerHTML = core.map((s, i) =>
        (
          (warriorsA.some(w => i == norm(w.a))?`<i>${s.a[0]}</i>`:warriorsB.some(w => i == norm(w.a))?`<b>${s.a[0]}</b>`:s.a[0])+
          (i && (i % 100) === 0 ? '\n' : '')
        )
      ).join('');

      ++turn;

      (!turnWarriors.length) ? kill(C.innerHTML += ta ? 'B wins':'A wins') : (--stepsLeft <= 0 && kill(debugA.value = C.innerHTML += 'Timeout'))
    }

    S.onclick = _ => t = coreloop();
    T.onclick = _ => t = setInterval(coreloop, 1);
    K.onclick = kill=_ => t = clearInterval(t) || init();
    D.onclick = i => {
      for (i=1e3; i--;) coreloop(i);
    }

    // hash stuff ~300
    tohash = o => core.slice(o, o + 100).map(({a, b, c, d, e}) => a + ` ${b + c} ` + d + e).join('\n').replace(/\n_.*/g, '');
    location.hash = btoa(
      tohash(offsetA) + `\nEND ${startA}%${tohash(offsetB)}\nEND ` + startB
    );
  }

  I.onclick = init;

  let hash = location.hash.slice(1);
  // Correct me if I'm wrong but without assignment, parens, dots, and square brackets you can't do much in js... (-> eval)
  if (hash) {
    unhash = _ => atob(hash).replace(/[^A-Z0-9@#<% \n-]/g, '').split('%')
    W.value = unhash()[0];
    Y.value = unhash()[1];
  }

  init();
  T.onclick();
}


// END
