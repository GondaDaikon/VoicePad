class Spline {

  constructor (ps = []) {
    this.p = ps;
    this.m = ps.length;
    this.n = this.m - 1;
  }

  calc (t = 0) {
    let
      {min, max, abs} = Math,
      {p, m, n} = this,
      Pos = {},
      x = 0, y = 0,
      t0 = min (max (0, t), 1) * m - 1;
      
    for (let i = -2; i < m + 2; i += 1) {
      let
        t1 = abs (t0 - i),
        t2,
        j = min (max (0, i), n),
        cn = t1 < 1
          ? (t2 = 3 * t1 * t1, t1 * t2 - 2 * t2 + 4) / 6
          : (t1 < 2)
            ? (t2 = t1 - 2, t2 * t2 * t2 / -6)
            : 0;
      x += p[j].x * cn;
      y += p[j].y * cn;
    }
    Pos.x = x;
    Pos.y = y
    return Pos;  
  }
}
