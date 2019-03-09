// http://corewar.co.uk/standards/icws88.txt
// icws'88 syntax only, no '94+
// no labels, no vars (EQU) (sorry, too expensive)
// env variables not present (100b)
// no save/restore through hash (300b)
// more restrictions on input code (regex shortcuts)
// ops must be upper cased
// value normalization could break with high negatives


+function f(
  b,
  a,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  j,
  k,
  l,
  m,
  n,
  o,
  p,
  q,
  r,
  s,
  t,
  u,
  v,
  w,
  x,
  y,
  z,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z
) {
  b.innerHTML = `<textarea id=$$>
MOV     <7,     <11
DJN     -1,     11
MOV     #7,     261
MOV     #259,   264
MOV     #14,    264
SPL     251
JMP     2
DAT     0       7
SPL     @5
ADD     #8,     4
JMP     -2
DAT     0       259
DAT     0       14
DAT     0       2
END
</textarea><textarea id=$$$>
JMP   2    0
DAT   0    0
MOV   #12  -1
MOV   @-2  <5
DJN   -1   -3
SPL   @3   0
ADD   #653 2
JMZ   -5   -6
DAT   0    833
</textarea><pre id=$></pre>`,
  y = a => (a + 8e9) % 8e3,
  ($.onclick = (_=n=0) => (
    clearTimeout(n),
    G = H = 0,
    F = 8e4,
    U = a => d[y(a)],
    x = (a, e, I = O = M = 0) => a.value.replace(
      /^(.{3})(?: +([#@<]?) *(-?\d+)(?:[ ,]+([#@<]?) *(-?\d+))?)? *(;.*)?$/gm,
      (_, A = "", B = "", C = 0, D = "", E = 0) =>
        // console.log(A,B,C,D,E, { A, B, C: +C, D, E: +E })||
        O || A && (O = "END" == A) ? M = 0 | C : d[y(e + I++)] = { A, B, C: +C, D, E: +E, J:2 }
    ),
    d = Array(8e3)
      .fill()
      .map(_ => ({ A: "_", B: "#", C: 0, D: "#", E: 0, J:2 })),
    x($$, 0),
    g = [M],
    x($$$, h = 100 + ~~(7800 * Math.random())),
    j = [h + M],
    T = (a, e, b) =>
      // (console.log('val(',[a,e,b],')'))||
      // cache a+b?
      "#" == e
        ? b
        : "@" == e
        ? a + b + U(a + b).E
        : "<" == e
          ? (--U(a + b).E)
          : (a + b),
    (Z = _ => (
      // console.log('loop:',g,j),
      m = (l = (k = F % 2) ? g : j).shift(),
      ({A, B, C, D, E} = t = U(m)),
      // console.log('\n',k,'executing cell['+m+']:', t),
      o = T(m, B, C), // vala
      p = T(m, D, E), // valb
      q = "#" == B,
      r = U(o), // cella
      s = U(p), // cellb
      // console.log(A,B,C,D,E),
      {
        _: _ => (
          // console.log('warrior under suicided'),
          m = -1
        ),
        ADD: _ => q ? s.E += o : (s.C = r.C + s.C, s.E = r.E + s.E,s.J=k),
        DAT: _ => (
          // console.log('warrior suicided'),
          m = -1
        ),
        // broken because what is join here?
        CMP: _ => q ? o == s.E && ++m : ((r.A+r.B+r.C+','+r.D+r.E == s.A+s.B+s.C+','+s.D+s.E) && ++m),
        DJN: _ => (
          // console.log('djn', t, s.E-1, o, 'm becomes',("#" == D ? t.E-1 : s.E-1)?'jump to A (' + o + ')':m),
          s.J=k,
          ("#" == D ? --t.E : --s.E)?m=y(o-1):m
        ),
        JMP: K = _ => m = o - 1,
        JMN: _ => s.E && K(),
        JMZ: _ => s.E || K(),
        MOV: _ => q ? (s.E = o,s.J=k) : d[y(p)] = { ...r, J:k },
        SLT: _ => (q ? o : r.E) < s.E && ++m,
        SUB: _ => q ? (s.E -= o, s.J=k) : (s.C = r.C - s.C, s.E = r.E - s.E, S.J=k),
        SPL: _ => m = ~l.push(++m, o)
      }[A](),
      // console.log('m after:', m),
      m>=0 && l.push(++m),
      // console.log('m final:', m),
      N=new Set(g.map(y)),
      X=new Set(j.map(y)),
      // console.log(N,X),
      $.innerHTML =
        d
        .map(({ A: [a], J }, b) => (b % 150 ? '' : `
`) +
        {
          0:'<b style="color:red">'+a+'</b>',
          1:'<b style="color:blue">'+a+'</b>',
          2:a,
          3:'<b style="background-color:red">'+a+'</b>',
          4:'<b style="background-color:blue">'+a+'</b>',
        }[N.has(b)?4:X.has(b)?3:J])
        .join("") + (
          l.length
          ? --F
            ? (n=setTimeout(Z, 1), ` ${F} ${g.length} ${j.length}`)
            : "Timeout"
          : k
            ? "A wins"
            : "B wins"
        )
    ))()
  ))();
}(b)
