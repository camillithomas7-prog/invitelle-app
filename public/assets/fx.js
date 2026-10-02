// Effetti premium dell'invito: atmosfera a particelle, parallasse, linee che si disegnano scorrendo, festa all'RSVP.
// Tutto opzionale: S.fx.motion = 'cinema' | 'soft' | 'none'
// S.fx.particles = 'auto' | 'oro' | 'petali' | 'lucciole' | 'neve' | 'cuori' | 'stelle' | 'foglie' | 'coriandoli' | 'none', S.fx.amount = 'light' | 'medium' | 'strong'
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const R = Math.random, TAU = Math.PI * 2;

  // atmosfera automatica in base al tema scelto (colori dei petali presi dalla scena)
  const AUTO = {
    amalfi: ['petali', ['#e0457b', '#f07aa0', '#fbd3e0']], ciliegi: ['petali', ['#f6c1d1', '#fbe0e8', '#ffffff']],
    glicine: ['petali', ['#b9a2e0', '#d8c9f2', '#ffffff']], lavanda: ['petali', ['#9d7cc9', '#c7b2e6', '#e9defa']],
    parigi: ['petali', ['#d9667a', '#f2a7b4', '#fde4ea']], marrakech: ['petali', ['#c2304a', '#e46b7f', '#f7b7c2']],
    inverno: ['neve'], dolomiti: ['stelle'], bosco: ['lucciole'], puglia: ['foglie'], serra: ['lucciole'], venezia: ['lucciole'],
    reggia: ['coriandoli'], toscana: ['oro'], como: ['oro'], santorini: ['petali', ['#ffffff', '#f3f6fb', '#dfe9f5']],
  };
  const PETALS_DEF = ['#efbcc4', '#f6d6da', '#ffffff', '#e6a5ae'];
  const MODES = [
    { id: 'auto', name: 'Automatica', desc: 'Scelta in base al tema' },
    { id: 'oro', name: 'Polvere d\'oro', desc: 'Bagliori dorati e scintille' },
    { id: 'petali', name: 'Petali', desc: 'Petali che cadono nel vento' },
    { id: 'lucciole', name: 'Lucciole', desc: 'Luci calde che danzano' },
    { id: 'cuori', name: 'Cuori', desc: 'Piccoli cuori che salgono' },
    { id: 'stelle', name: 'Cielo stellato', desc: 'Stelle che brillano e stelle cadenti' },
    { id: 'foglie', name: 'Foglie d\'ulivo', desc: 'Foglioline che volteggiano' },
    { id: 'coriandoli', name: 'Coriandoli d\'oro', desc: 'Lamine dorate che scendono' },
    { id: 'neve', name: 'Neve', desc: 'Fiocchi soffici' },
    { id: 'none', name: 'Nessuna', desc: 'Solo il video' },
  ];
  const AMOUNT = { light: .55, medium: 1, strong: 1.7 };
  const BASE = { oro: 55, petali: 26, lucciole: 32, neve: 80, cuori: 24, stelle: 70, foglie: 22, coriandoli: 42 };

  function pickMode(fx, theme) {
    const p = fx.particles || 'auto';
    if (p !== 'auto') return [p, p === 'petali' && AUTO[theme]?.[0] === 'petali' ? AUTO[theme][1] : PETALS_DEF];
    const a = AUTO[theme] || ['oro'];
    return [a[0], a[1] || PETALS_DEF];
  }

  // ---------- PARTICELLE ----------
  // Prestazioni (telefoni): ogni forma è disegnata UNA volta in uno "sprite" (con sfumature e ombra già cotte),
  // poi a ogni fotogramma si fa solo drawImage. Niente gradienti né shadowBlur nel ciclo, risoluzione limitata.
  const mobile = matchMedia('(max-width: 700px), (pointer: coarse)').matches;
  const SPR = {};
  function sprite(key, size, draw) {
    if (SPR[key]) return SPR[key];
    const c = document.createElement('canvas'); c.width = c.height = size;
    draw(c.getContext('2d'), size / 2); return (SPR[key] = c);
  }
  const glowSpr = (c1, c2, core) => sprite('g' + c1 + c2 + (core || ''), 64, (x, m) => {
    const g = x.createRadialGradient(m, m, 0, m, m, m);
    g.addColorStop(0, `rgba(${c1},1)`); g.addColorStop(.3, `rgba(${c2},.45)`); g.addColorStop(1, `rgba(${c2},0)`);
    x.fillStyle = g; x.fillRect(0, 0, m * 2, m * 2);
    if (core) { x.fillStyle = `rgba(${core},.95)`; x.beginPath(); x.arc(m, m, m * .17, 0, TAU); x.fill(); x.fillStyle = 'rgba(255,250,235,.95)'; x.beginPath(); x.arc(m - 3, m - 3, m * .07, 0, TAU); x.fill(); }
  });
  const sparkSpr = (c) => sprite('s' + c, 64, (x, m) => {
    x.fillStyle = `rgba(${c},1)`; x.beginPath(); x.moveTo(m, 2); x.quadraticCurveTo(m + 4, m - 4, 62, m); x.quadraticCurveTo(m + 4, m + 4, m, 62);
    x.quadraticCurveTo(m - 4, m + 4, 2, m); x.quadraticCurveTo(m - 4, m - 4, m, 2); x.fill();
  });
  const shadow = x => { x.shadowColor = 'rgba(70,40,25,.3)'; x.shadowBlur = 5; x.shadowOffsetY = 2; };
  const petalSpr = col => sprite('p' + col, 64, (x, m) => {
    shadow(x); const r = 22, g = x.createLinearGradient(0, m - r, 0, m + r); g.addColorStop(0, '#fff'); g.addColorStop(.35, col); g.addColorStop(1, col);
    x.fillStyle = g; x.beginPath(); x.moveTo(m, m - r); x.bezierCurveTo(m + r * .9, m - r * .6, m + r * .7, m + r * .6, m, m + r); x.bezierCurveTo(m - r * .7, m + r * .6, m - r * .9, m - r * .6, m, m - r); x.fill();
  });
  const heartSpr = col => sprite('h' + col, 64, (x, m) => {
    shadow(x); const r = 24, g = x.createLinearGradient(0, m - r, 0, m + r); g.addColorStop(0, '#fff'); g.addColorStop(.4, col); g.addColorStop(1, col);
    x.fillStyle = g; x.beginPath(); x.moveTo(m, m + r * .5);
    x.bezierCurveTo(m - r * 1.1, m - r * .2, m - r * .45, m - r * .9, m, m - r * .3); x.bezierCurveTo(m + r * .45, m - r * .9, m + r * 1.1, m - r * .2, m, m + r * .5); x.fill();
  });
  const leafSpr = col => sprite('l' + col, 64, (x, m) => {
    shadow(x); const r = 26; x.fillStyle = col;
    x.beginPath(); x.moveTo(m, m - r); x.quadraticCurveTo(m + r * .38, m, m, m + r); x.quadraticCurveTo(m - r * .38, m, m, m - r); x.fill();
    x.shadowColor = 'transparent'; x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(m, m - r * .85); x.lineTo(m, m + r * .85); x.stroke();
  });
  const foilSpr = k => sprite('c' + k, 64, (x, m) => {
    shadow(x); const l = 60 + k * 8, g = x.createLinearGradient(m - 20, m - 14, m + 20, m + 14);
    g.addColorStop(0, `hsl(40, 70%, ${l - 22}%)`); g.addColorStop(.5, `hsl(46, 85%, ${Math.min(92, l + 10)}%)`); g.addColorStop(1, `hsl(38, 65%, ${l - 26}%)`);
    x.fillStyle = g; x.fillRect(m - 20, m - 12, 40, 24);
  });

  class Atmos {
    constructor(host, opt = {}) {
      this.host = host; this.scale = opt.scale || 1; this.minArea = opt.minArea; this.light = !!opt.light;
      this.c = document.createElement('canvas'); this.c.className = opt.cls || 'atmos';
      host.appendChild(this.c);
      this.x = this.c.getContext('2d'); this.ps = []; this.mode = 'none'; this.on = false; this.vis = true; this.shoot = null; this.last = 0;
      this.resize = this.resize.bind(this); this.loop = this.loop.bind(this);
      if ('ResizeObserver' in window) { this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(host); } else addEventListener('resize', this.resize);
      if ('IntersectionObserver' in window) { this.io = new IntersectionObserver(es => { this.vis = es[0].isIntersecting; if (this.vis) this.kick(); }); this.io.observe(host); }
      this.onVis = () => this.kick(); document.addEventListener('visibilitychange', this.onVis);
    }
    set(mode, colors, amount = 'medium') {
      if (reduce) mode = 'none';
      const key = mode + colors + amount + this.light;
      if (key === this.key) return;
      this.key = key; this.mode = mode; this.colors = colors || PETALS_DEF; this.amount = AMOUNT[amount] || 1; this.c.hidden = mode === 'none';
      this.resize(); this.seed(); this.kick();
    }
    resize() {
      const r = this.host.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2);
      if (!r.width || !r.height) return;
      const changed = Math.abs(r.width - (this.w || 0)) > 1 || Math.abs(r.height - (this.h || 0)) > 60;
      this.w = r.width; this.h = r.height; this.dpr = dpr;
      if (changed || !this.c.width) { this.c.width = Math.round(r.width * dpr); this.c.height = Math.round(r.height * dpr); }
    }
    seed() {
      const area = Math.max(this.minArea || .35, ((this.w || 400) * (this.h || 800)) / (420 * 860));
      const n = Math.round((BASE[this.mode] || 0) * this.amount * Math.min(1.4, area) * (mobile ? .75 : 1));
      this.ps = Array.from({ length: n }, () => this.make(true));
    }
    make(any) {
      const w = this.w || 400, h = this.h || 800, m = this.mode, s = this.scale, pick = a => a[(R() * a.length) | 0];
      const p = { x: R() * w, y: any ? R() * h : 0, t: R() * TAU };
      if (m === 'oro') Object.assign(p, { y: any ? p.y : h + 10, r: (.8 + R() * 2.2) * s, vy: -(.12 + R() * .35), vx: (R() - .5) * .12, tw: .02 + R() * .04, glint: R() < .3 });
      if (m === 'petali') Object.assign(p, { y: any ? p.y : -20, r: (6 + R() * 7) * s, vy: .45 + R() * .7, vx: .2 + R() * .5, rot: R() * TAU, vr: (R() - .5) * .04, flip: R() * TAU, spr: petalSpr(pick(this.colors)) });
      if (m === 'lucciole') Object.assign(p, { r: (1.2 + R() * 1.8) * s, vx: (R() - .5) * .3, vy: (R() - .5) * .3, tw: .015 + R() * .03 });
      if (m === 'neve') Object.assign(p, { y: any ? p.y : -6, r: (.8 + R() * 2.6) * s, vy: .35 + R() * .8, vx: (R() - .5) * .3 });
      if (m === 'cuori') Object.assign(p, { y: any ? p.y : h + 20, r: (7 + R() * 8) * s, vy: -(.3 + R() * .45), sw: 12 + R() * 18, spr: heartSpr(pick(['#e98b9a', '#d9667a', '#f2b3bd', '#d7ad5c'])), a: .7 + R() * .3 });
      if (m === 'stelle') Object.assign(p, { y: R() * h * .75, r: (.5 + R() * 1.6) * s, tw: .5 + R() * 2.2, big: R() < .12 });
      if (m === 'foglie') Object.assign(p, { y: any ? p.y : -20, r: (10 + R() * 8) * s, vy: .4 + R() * .55, vx: .15 + R() * .45, rot: R() * TAU, vr: (R() - .5) * .05, flip: R() * TAU, spr: leafSpr(pick(['#7d8a52', '#97a46a', '#5f6e3c', '#b4b98a'])) });
      if (m === 'coriandoli') Object.assign(p, { y: any ? p.y : -12, r: (4 + R() * 4.5) * s, vy: .5 + R() * .8, vx: (R() - .5) * .4, rot: R() * TAU, vr: (R() - .5) * .08, flip: R() * TAU, vf: .05 + R() * .08, spr: foilSpr((R() * 4) | 0) });
      return p;
    }
    kick() { if (!this.on && this.mode !== 'none' && this.vis && !document.hidden) { this.on = true; requestAnimationFrame(this.loop); } }
    destroy() { this.on = false; this.mode = 'none'; this.ro?.disconnect(); removeEventListener('resize', this.resize); document.removeEventListener('visibilitychange', this.onVis); this.io?.disconnect(); }
    loop(now) {
      if (!this.c.isConnected) { this.destroy(); return; }
      if (this.mode === 'none' || !this.vis || document.hidden) { this.on = false; return; }
      requestAnimationFrame(this.loop);
      // sul telefono 30 fotogrammi al secondo bastano e dimezzano il lavoro
      if (mobile && now && now - this.last < 30) return;
      const k = this.last && now ? Math.min(3, (now - this.last) / 16.7) : 1; this.last = now || 0;
      const x = this.x, w = this.w, h = this.h, d = this.dpr || 1;
      x.setTransform(d, 0, 0, d, 0, 0); x.globalAlpha = 1; x.clearRect(0, 0, w, h);
      if (this.mode === 'stelle') this.shooting(x, w, h, k);
      for (let i = 0; i < this.ps.length; i++) {
        const p = this.ps[i]; p.t += .016 * k;
        if (this[this.mode](x, p, w, h, k, d)) this.ps[i] = this.make(false);
      }
      x.globalAlpha = 1;
    }
    dot(x, spr, px, py, r, a) { x.globalAlpha = a; x.drawImage(spr, px - r, py - r, r * 2, r * 2); }
    // forma ruotata e schiacciata (petali, foglie, coriandoli): trasformazione diretta, niente save/restore
    shape(x, d, spr, px, py, r, rot, sx, sy, a) {
      const c = Math.cos(rot), s = Math.sin(rot);
      x.setTransform(d * c * sx, d * s * sx, -d * s * sy, d * c * sy, d * px, d * py);
      x.globalAlpha = a; x.drawImage(spr, -r, -r, r * 2, r * 2);
      x.setTransform(d, 0, 0, d, 0, 0);
    }
    oro(x, p, w, h, k) {
      p.x += (p.vx + Math.sin(p.t * .7) * .15) * k; p.y += p.vy * k;
      const a = .45 + Math.sin(p.t * p.tw * 60) * .4;
      this.dot(x, glowSpr('255,226,160', '214,168,80', '196,150,62'), p.x, p.y, p.r * 4.5, Math.max(0, a));
      if (p.glint && a > .5) this.dot(x, sparkSpr('255,240,200'), p.x, p.y, p.r * 5 * (a - .3), a);
      return p.y < -20;
    }
    petali(x, p, w, h, k, d) {
      p.x += (p.vx + Math.sin(p.t) * .6) * k; p.y += p.vy * k; p.rot += p.vr * k; p.flip += .03 * k;
      this.shape(x, d, p.spr, p.x, p.y, p.r * 1.45, p.rot, 1, Math.max(.25, Math.abs(Math.cos(p.flip))), .95);
      return p.y > h + 20 || p.x > w + 20;
    }
    lucciole(x, p, w, h, k) {
      p.vx += (R() - .5) * .04; p.vy += (R() - .5) * .04; p.vx *= .98; p.vy *= .98; p.x += p.vx * k; p.y += p.vy * k;
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10; if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
      const a = Math.max(0, Math.sin(p.t * p.tw * 60)) * .9;
      if (a > .02) this.dot(x, this.light ? glowSpr('226,176,74', '214,160,60', '190,138,40') : glowSpr('255,240,170', '255,214,110'), p.x, p.y, p.r * 6, a);
    }
    neve(x, p, w, h, k) {
      p.x += (p.vx + Math.sin(p.t * .8 + p.r) * .35) * k; p.y += p.vy * k;
      if (this.light) this.dot(x, glowSpr('150,170,198', '190,205,225', '255,255,255'), p.x, p.y, p.r * 2.4, .7 + p.r / 10);
      else this.dot(x, glowSpr('255,255,255', '255,255,255'), p.x, p.y, p.r * 1.8, .55 + p.r / 8);
      return p.y > h + 10;
    }
    cuori(x, p, w, h, k, d) {
      p.y += p.vy * k; const px = p.x + Math.sin(p.t * .9) * p.sw * .3;
      const fade = Math.min(1, (h - p.y) / 80, p.y / 120);
      if (fade > 0) this.shape(x, d, p.spr, px, p.y, p.r * 1.35, Math.sin(p.t * .9) * .25, 1, 1, p.a * fade);
      return p.y < -20;
    }
    stelle(x, p) {
      const a = .25 + (Math.sin(p.t * p.tw) * .5 + .5) * .75;
      const c = this.light ? '196,152,64' : '255,255,255';
      this.dot(x, glowSpr(c, this.light ? '214,180,110' : '220,230,255'), p.x, p.y, p.r * 3, a * .9);
      if (p.big || this.light) this.dot(x, sparkSpr(c), p.x, p.y, p.r * (p.big ? 5 : 3) * a, a * .9);
    }
    shooting(x, w, h, k) {
      if (!this.shoot && R() < .006 * k) this.shoot = { x: w * (.3 + R() * .7), y: R() * h * .35, v: 7 + R() * 5, life: 0 };
      const s = this.shoot; if (!s) return;
      s.life += k; s.x -= s.v * k; s.y += s.v * .45 * k;
      const a = Math.max(0, 1 - s.life / 45);
      x.globalAlpha = a; x.strokeStyle = this.light ? 'rgb(196,152,64)' : '#fff'; x.lineWidth = 1.6 * this.scale; x.lineCap = 'round';
      x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x + 70, s.y - 32); x.stroke();
      this.dot(x, sparkSpr(this.light ? '196,152,64' : '255,255,255'), s.x, s.y, 6 * this.scale, a);
      if (a <= 0) this.shoot = null;
    }
    foglie(x, p, w, h, k, d) {
      p.x += (p.vx + Math.sin(p.t * .8) * .7) * k; p.y += p.vy * k; p.rot += p.vr * k; p.flip += .025 * k;
      this.shape(x, d, p.spr, p.x, p.y, p.r * 1.25, p.rot, Math.max(.3, Math.abs(Math.cos(p.flip))), 1, .92);
      return p.y > h + 20 || p.x > w + 20;
    }
    coriandoli(x, p, w, h, k, d) {
      p.x += (p.vx + Math.sin(p.t) * .4) * k; p.y += p.vy * k; p.rot += p.vr * k; p.flip += p.vf * k;
      this.shape(x, d, p.spr, p.x, p.y, p.r * 1.6, p.rot, 1, Math.max(.12, Math.abs(Math.cos(p.flip))), .95);
      return p.y > h + 12;
    }
  }

  // ---------- SCORRIMENTO: parallasse + linee che si disegnano ----------
  // gli elementi e le soglie si calcolano una volta (apply/resize); a ogni fotogramma prima si legge, poi si scrive
  let root = null, motion = 'cinema', ticking = false, cache = null;
  function measure() {
    if (!root) return;
    cache = {
      intro: root.querySelector('.intro'),
      par: [...root.querySelectorAll('[data-par]')],
      draw: [...root.querySelectorAll('[data-draw]')].map(el => ({ el, its: [...el.querySelectorAll('[data-lit]')].map(it => ({ it, t: (it.offsetTop + 14) / (el.offsetHeight || 1), on: it.classList.contains('lit') })) })),
    };
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  function frame() {
    ticking = false;
    if (!root || motion !== 'cinema') return;
    if (!cache) measure();
    const vh = innerHeight, y = scrollY;
    // letture
    const ih = cache.intro ? (cache.intro.offsetHeight || vh) : vh;
    const pr = cache.par.map(el => el.parentElement.getBoundingClientRect());
    const dr = cache.draw.map(d => d.el.getBoundingClientRect());
    // scritture
    if (cache.intro && y < ih * 1.2) cache.intro.style.setProperty('--sy', Math.min(1, y / ih).toFixed(3));
    cache.par.forEach((el, i) => {
      const r = pr[i]; if (r.bottom < -100 || r.top > vh + 100) return;
      el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) / vh * -14).toFixed(2)}%`;
    });
    cache.draw.forEach((d, i) => {
      const r = dr[i]; if (r.bottom < -vh || r.top > vh * 2) return;
      const p = Math.max(0, Math.min(1, (vh * .72 - r.top) / (r.height || 1)));
      d.el.style.setProperty('--p', p.toFixed(3));
      d.its.forEach(o => { const on = p >= o.t; if (on !== o.on) { o.on = on; o.it.classList.toggle('lit', on); } });
    });
  }

  function coverflow(track) {
    const c = track.scrollLeft + track.clientWidth / 2;
    [...track.children].forEach(s => {
      const d = Math.min(1, Math.abs(s.offsetLeft + s.offsetWidth / 2 - c) / track.clientWidth);
      s.style.setProperty('--d', d.toFixed(3));
    });
  }

  // ---------- FESTA: petali/coriandoli quando un ospite conferma ----------
  function burst(fromEl, colors) {
    if (reduce) return;
    const c = document.createElement('canvas'); c.className = 'burst';
    document.body.appendChild(c);
    const dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; const x = c.getContext('2d'); x.scale(dpr, dpr);
    const r = fromEl?.getBoundingClientRect() || { left: W / 2, top: H / 2, width: 0, height: 0 };
    const ox = r.left + r.width / 2, oy = r.top + r.height / 2;
    const cols = colors || ['#d9b779', '#f3dfb4', '#ffffff', '#e8b7b9', '#b88f4f'];
    const ps = Array.from({ length: mobile ? 90 : 140 }, () => {
      const a = -Math.PI / 2 + (Math.random() - .5) * 2.2, v = 6 + Math.random() * 11;
      return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 3 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, f: Math.random() * 6, col: cols[(Math.random() * cols.length) | 0], shape: Math.random() < .5 };
    });
    const t0 = performance.now();
    (function tick(t) {
      const e = (t - t0) / 1000;
      x.clearRect(0, 0, W, H);
      ps.forEach(p => {
        p.vy += .22; p.vx *= .985; p.vy *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.f += .12;
        x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.scale(1, Math.abs(Math.cos(p.f)) * .8 + .2);
        x.globalAlpha = Math.max(0, 1 - Math.max(0, e - 2.2) / 1.2); x.fillStyle = p.col;
        if (p.shape) { x.beginPath(); x.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.28); x.fill(); } else x.fillRect(-p.r / 2, -p.r, p.r, p.r * 2);
        x.restore();
      });
      if (e < 3.5) requestAnimationFrame(tick); else c.remove();
    })(t0);
  }

  // ---------- titolo: ogni riga si "scrive" da sinistra a destra ----------
  function splitLines(txt) {
    txt.querySelectorAll('.hl > div').forEach((d, i) => { d.style.setProperty('--li', i); d.classList.add('ink'); });
  }

  window.InvFx = {
    reduce,
    atmos: null,
    // chiamato a ogni disegno dell'invito
    apply(r, S) {
      root = r;
      const fx = Object.assign({ motion: 'cinema', particles: 'auto' }, S.fx || {});
      motion = reduce ? 'none' : fx.motion;
      r.classList.remove('fx-cinema', 'fx-soft', 'fx-none');
      r.classList.add('fx-' + motion);
      const intro = r.querySelector('.intro');
      if (intro) {
        if (!intro.atmos) intro.atmos = new Atmos(intro);
        const [m, cols] = pickMode(fx, S.theme);
        intro.atmos.set(m, cols, fx.amount);   // l'atmosfera è indipendente dalle animazioni (si spegne solo con "riduci movimento" del telefono)
      }
      // atmosfera dentro l'invito: livello fermo sullo schermo dietro ai blocchi (none | same | effetto)
      const paper = r.querySelector('.paper');
      if (paper) {
        let host = paper.querySelector(':scope > .atmos-body');
        if (!host) { host = document.createElement('div'); host.className = 'atmos-body'; paper.prepend(host); }
        const bg = (S.blocksStyle || {}).bg || '#fbf8f2', n = parseInt(bg.slice(1), 16);
        const light = ((n >> 16) * .299 + (n >> 8 & 255) * .587 + (n & 255) * .114) > 150;
        if (!host.atmos || host.atmos.light !== light) { host.atmos?.destroy(); host.querySelector('canvas')?.remove(); host.atmos = new Atmos(host, { light, cls: 'atmos atmos-b' }); }
        const b = fx.body || 'none';
        const [bm, bc] = b === 'same' ? pickMode(fx, S.theme) : pickMode({ particles: b }, S.theme);
        host.atmos.set(b === 'none' ? 'none' : bm, bc, b === 'same' ? (fx.bodyAmount || fx.amount) : fx.bodyAmount);
      }
      if (intro) splitLines(intro.querySelector('.txt'));
      cache = null; requestAnimationFrame(measure);
      r.querySelectorAll('.paper img').forEach(img => { if (!img.complete) img.addEventListener('load', () => { cache = null; onScroll(); }, { once: true }); });
      r.querySelectorAll('.car-track').forEach(t => {
        coverflow(t);
        if (!t.fxBound) { t.fxBound = 1; t.addEventListener('scroll', () => requestAnimationFrame(() => coverflow(t)), { passive: true }); }
      });
      if (!window.__fxScroll) { window.__fxScroll = 1; addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', () => { cache = null; onScroll(); }); addEventListener('load', () => { cache = null; onScroll(); }); }
      onScroll();
    },
    burst,
    Atmos, MODES, pickMode,
    update: () => { cache = null; frame(); },
  };
})();
