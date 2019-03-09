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
  b,
  A, B, C, D, E,

  a, c, d, e, f,
  random, split, fill, length, style, onclick, map,
  pre,
  innerHTML, v, w, replace, shift,
  color,
  background, value,
  id,
  textarea
) {
b.innerHTML = `<textarea id=W>JMP   2    0</textarea><textarea id=Y>MOV 0 1</textarea><pre id=P></pre>`;v=n=>(n+8e9)%8e3;replace=(X,Y,Z)=>Y=='#'?Z:X+Z+(Y?shift(X+Z)[4]-=Y=='<':0);shift=n=>c[v(n)];innerHTML=(a,b,d=value=background=0)=>a.value.replace(/^(.{3})(?: +([#@<]?) *([^,\s;]*)(?:[ ,]+([#@<]?) *([^,\s;]*))?)? *(;.*)?$/gm,(m,A,B='',C,D='',E)=>value||A&&(value=A=='END')?background=C|0:c[v(b+d++)]=[A,B,C|0,D,E|0])|background;_=DAT=_=>split=-1;ADD=(x,_=1)=>map[4]=style?map[4]+fill*_:(map[2]=onclick[2]+map[2]*_,onclick[4]+map[4]*_);SUB=_=>ADD(_,-1);CMP=_=>split+=style?fill==map[4]:onclick+''==map;DJN=_=>split=--(D=='#'?pre:map)[4]?_:split;JMP=_=>split=_;JMN=_=>split=map[4]?_:split;JMZ=_=>split=map[4]?split:_;MOV=_=>style?map[4]=fill:c[v(length)]=[...onclick];SLT=_=>split+=(style?fill:onclick[4])<map[4];SPL=_=>split=random.push(v(++split))&&_;(P.onclick=_=>(textarea=_=>{random=color%2?d:f;split=random.shift();[A,B,C,D,E]=pre=shift(split);fill=replace(split,B,C);length=replace(split,D,E);style=B=='#';onclick=shift(fill);map=shift(length);eval(A)(fill-1);split>=0&&SPL();P.innerHTML=c.map((A,i)=>(i%150?'':'\n')+(d.includes(i)?`<b style='background-color:#109'>${A[0][0]}</b>`:f.includes(i)?`<b style='background-color:#900'>${A[0][0]}</b>`:A[0][0])).join('')+(random.length ?--color?setTimeout(textarea,1)&&`${color} ${d.length} `+f.length:'Timeout':color%2?'B wins':'A wins')})(clearTimeout(id),c=Array(8e3).fill(color=8e4).map(_=>'_#0#0'.split('')),d=[innerHTML(W,0)],f=[innerHTML(Y,e=100+~~(Math.random()*7800))+e]))()
}

