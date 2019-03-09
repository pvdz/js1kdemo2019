f(b);

function f(
 b,
 A, B, C, D, E,

 a, c, d, e, f,
 g, h, i, j, k,
 l, m, n, u, v,
 x, y, o, p, q,
 r,
) {
b.innerHTML = `<textarea id=W>MOV 0 1</textarea><textarea id=Y>MOV 5 <5
SUB #5 4
ADD #6 4
ADD 3 2
JMP -4 0
DAT 0 2</textarea><pre id=P></pre>
`
v=A=>(A+8e9)%8e3
y=A=>c[v(A)]
x=(A,B,C)=>B=='#'?C:A+C+(B?y(A+C)[4]=v(y(A+C)[4]-(B=='<')):0)
u=(A,b,d=q=p=0)=>A.value.replace(/^(.{3})(?: +([#@<]?) *([^,\s;]*)(?:[ ,]+([#@<]?) *([^,\s;]*))?)? *(;.*)?$/gm,(m,A,B='',C,D='',E)=>q||A&&(q=A=='END')?p=C|0:c[v(b+d++)]=[A,B,C|0,D,E|0])|p
_=DAT=A=>h=-1
ADD=(B,A=1)=>m[4]=v(k?m[4]+i*A:(m[2]=v(l[2]+m[2]*A),l[4]+m[4]*A))
SUB=A=>ADD(A,-1)
CMP=A=>h+=k?i==m[4]:l+''==m
DJN=A=>h=--(D=='#'?n:m)[4]?A:h
JMP=A=>h=A
JMN=A=>h=m[4]?A:h
JMZ=A=>h=m[4]?h:A
MOV=A=>k?m[4]=i:c[v(j)]=[...l]
SLT=A=>h+=(k?i:l[4])<m[4]
SPL=A=>h=g.push(v(++h))&&A
;(P.onclick=Z=>(a=Z=>{
g=o%2?d:f
h=g.shift()
;[A,B,C,D,E]=n=y(h)
i=x(h,B,C)
j=x(h,D,E)
k=B=='#'
l=y(i)
m=y(j)
eval(A)(v(i-1))
h>=0&&SPL()
P.innerHTML=(g.length?--o?(r=setTimeout(a,1))&&[o,d.length,f.length]:'Time':o%2?'B!':'A!')+c.map((A,i)=>(i%150?'':'\n')+(d.includes(i)?`<b style='background-color:#109'>${A[0][0]}</b>`:f.includes(i)?`<b style='background-color:#900'>${A[0][0]}</b>`:A[0][0])).join('')
})(clearTimeout(r),c=Array(8e3).fill(o=8e4).map(
 _=>['_','#',0,'#',0]
),d=[u(W,0)],f=[u(Y,e=100+~~(Math.random()*7800))+e]))()
}

