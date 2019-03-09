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
  turnWarriors, currentWarrior, valA, valB, AisPound, cellA, cellB,
  wcell, g, _g, t,
  compile, norm, init, val, cell, unhash, tohash,
   stepsTillDraw, corepart,
  globalStartToken, vars, ended, coreSize,
  ADD,
  timer,
  set, again
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
</textarea><textarea id=Y>MOV 0 1</textarea>
<pre id=P></pre>
`;
  norm=n=>(n+8e9)%8e3
  val=(X,Y,Z)=>Y=='#'?Z:X+Z+(Y?cell(X+Z)[4]-=Y=='<':0)
  cell=n=>core[norm(n)]
  compile=(inputel,offset,counter=ended=globalStartToken=0)=>inputel.value.replace(/^(.{3})(?: +([#@<]?) *([^,\s;]*)(?:[ ,]+([#@<]?) *([^,\s;]*))?)? *(;.*)?$/gm,(m,A,B='',C,D='',E)=>ended||A&&(ended=A=='END')?globalStartToken=C|0:core[norm(offset+counter++)]=[A,B,C|0,D,E|0])|globalStartToken
  _=DAT=_=>currentWarrior=-1
  ADD=(x,_=1)=>cellB[4]=AisPound?cellB[4]+valA*_:(cellB[2]=cellA[2]+cellB[2]*_,cellA[4]+cellB[4]*_)
  SUB=_=>ADD(_,-1)
  CMP=_=>currentWarrior+=AisPound?valA==cellB[4]:cellA+''==cellB
  DJN=_=>currentWarrior=--(D=='#'?wcell:cellB)[4]?_:currentWarrior
  JMP=_=>currentWarrior=_
  JMN=_=>currentWarrior=cellB[4]?_:currentWarrior
  JMZ=_=>currentWarrior=cellB[4]?currentWarrior:_
  MOV=_=>AisPound?cellB[4]=valA:core[norm(valB)]=[...cellA]
  SLT=_=>currentWarrior+=(AisPound?valA:cellA[4])<cellB[4]
  SPL=_=>currentWarrior=turnWarriors.push(norm(++currentWarrior))&&_;
  (P.onclick=_=>{
    clearTimeout(timer)
    stepsTillDraw=8e4
    core=Array(8e3).fill().map(_=>'_#0#0'.split(''))
    warriorsA=[compile(W,0)]
    warriorsB=[compile(Y,offsetB=100+~~(Math.random()*7800))+offsetB];
    (again=_=>{
      turnWarriors=stepsTillDraw%2?warriorsA:warriorsB
      currentWarrior=turnWarriors.shift();
      [A,B,C,D,E]=wcell=cell(currentWarrior)
      valA=val(currentWarrior,B,C)
      valB=val(currentWarrior,D,E)
      AisPound=B=='#'
      cellA=cell(valA)
      cellB=cell(valB)
      eval(A)(valA-1)
      currentWarrior>=0&&SPL()
      P.innerHTML=core.map((A,i)=>(i%150?'':'\n')+(warriorsA.includes(i)?`<b style='background-color:#109'>${A[0][0]}</b>`:warriorsB.includes(i)?`<b style='background-color:#900'>${A[0][0]}</b>`:A[0][0])).join('')
      +(turnWarriors.length ?--stepsTillDraw?setTimeout(again,1)&&`${stepsTillDraw} ${warriorsA.length} `+warriorsB.length:'Timeout':stepsTillDraw%2?'B wins':'A wins')
    })()
  })()
}

