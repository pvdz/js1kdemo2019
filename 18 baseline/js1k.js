f(b);

function f(
  b,
  A, B, C, D, E,

  c, d, e, f,
  g, h, i, j, k, l, m,
  n,
  u, v, x, y,
  G,
  I, K,
  M,
  O
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
v=n=>(n+8e9)%8e3;x=(X,Y,Z)=>Y=='#'?Z:X+Z+(Y?y(X+Z)[4]-=Y=='<':0);y=n=>c[v(n)];u=(a,b,d=K=I=0)=>a.value.replace(/^(.{3})(?: +([#@<]?) *([^,\s;]*)(?:[ ,]+([#@<]?) *([^,\s;]*))?)? *(;.*)?$/gm,(m,A,B='',C,D='',E)=>K||A&&(K=A=='END')?I=C|0:c[v(b+d++)]=[A,B,C|0,D,E|0])|I;_=DAT=_=>h=-1;ADD=(x,_=1)=>m[4]=k?m[4]+i*_:(m[2]=l[2]+m[2]*_,l[4]+m[4]*_);SUB=_=>ADD(_,-1);CMP=_=>h+=k?i==m[4]:l+''==m;DJN=_=>h=--(D=='#'?n:m)[4]?_:h;JMP=_=>h=_;JMN=_=>h=m[4]?_:h;JMZ=_=>h=m[4]?h:_;MOV=_=>k?m[4]=i:c[v(j)]=[...l];SLT=_=>h+=(k?i:l[4])<m[4];SPL=_=>h=g.push(v(++h))&&_;(P.onclick=_=>(O=_=>{g=G%2?d:f;h=g.shift();[A,B,C,D,E]=n=y(h);i=x(h,B,C);j=x(h,D,E);k=B=='#';l=y(i);m=y(j);eval(A)(i-1);h>=0&&SPL();P.innerHTML=c.map((A,i)=>(i%150?'':'\n')+(d.includes(i)?`<b style='background-color:#109'>${A[0][0]}</b>`:f.includes(i)?`<b style='background-color:#900'>${A[0][0]}</b>`:A[0][0])).join('')+(g.length ?--G?(M=setTimeout(O,1))&&`${G} ${d.length} `+f.length:'Timeout':G%2?'B wins':'A wins')})(clearTimeout(M),c=Array(8e3).fill(G=8e4).map(_=>'_#0#0'.split('')),d=[u(W,0)],f=[u(Y,e=100+~~(Math.random()*7800))+e]))()
}

