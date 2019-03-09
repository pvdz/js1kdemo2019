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
  // J,
  K,
  L,
  M,
  // $N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  // X,
  Y,
  Z
) {
  b.innerHTML = `<textarea id=$$>
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
END 1
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
        O || A && (O = "END" == A) ? M = 0 | C : d[y(e + I++)] = { A, B, C: +C, D, E: +E }
    ),
    d = Array(8e3)
      .fill()
      .map(_ => ({ A: "_", B: "#", C: 0, D: "#", E: 0 })),
    x($$, 0),
    g = [M],
    x($$$, h = 100 + ~~(7800 * Math.random())),
    j = [h + M],
    T = (a, e, b) =>
      // cache a+b?
      "#" == e
        ? b
        : "@" == e
        ? a + b + U(a + b).E
        : "<" == e
          ? --U(a + b).E
          : a + b,
    (Z = _ => (
      // console.log('loop:',g,j),
      m = (l = (k = F % 2) ? g : j).shift(),
      // console.log(m),
      ({A, B, C, D, E} = t = U(m)),
      o = T(m, B, C),
      p = T(m, D, E),
      q = "#" == B,
      r = U(o),
      s = U(p),
      // console.log('op:', A),
      {
        _: _ => m = -1,
        ADD: _ => q ? s.E += o : (s.C = r.C + s.C, s.E = r.E + s.E),
        DAT: _ => m = -1,
        CMP: _ => q ? o == s.E && ++m : r.join(",") == s.join(",") && ++m,
        DJN: _ => ("#" == D ? --t.E : --s.E) && K(),
        JMP: K = _ => m = o - 1,
        JMN: _ => s.E && K(),
        JMZ: _ => s.E || K(),
        MOV: _ => q ? s.E = o : d[y(p)] = { ...r },
        SLT: _ => (q ? o : r.E) < s.E && ++m,
        SUB: _ => q ? s.E -= o : (s.C = r.C - s.C, s.E = r.E - s.E),
        SPL: _ => m = ~l.push(++m, o)
      }[A](),
      m>=0 && l.push(++m),
      // console.log('after:',g,j),
      $.innerHTML = 
        d
        .map(({ A: [a] }, b) => b % 150 ? a : `
` + a)
        .join("") + (
          l.length
          ? --F
            ? (n=setTimeout(Z, 1), F)
            : "Timeout"
          : k
            ? "B wins"
            : "A wins"
        )
    ))()
  ))();
}(b)
