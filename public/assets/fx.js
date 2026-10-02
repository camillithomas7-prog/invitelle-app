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
  class Atmos {
    constructor(host, opt = {}) {
      this.host = host; this.scale = opt.scale || 1; this.minArea = opt.minArea; this.light = !!opt.light;
      this.c = document.createElement('canvas'); this.c.className = opt.cls || 'atmos';
      host.appendChild(this.c);
      this.x = this.c.getContext('2d'); this.ps = []; this.mode = 'none'; this.on = false; this.vis = true; this.shoot = null;
      this.resize = this.resize.bind(this); this.loop = this.loop.bind(this);
      addEventListener('resize', this.resize);
      if ('IntersectionObserver' in window) { this.io = new IntersectionObserver(es => { this.vis = es[0].isIntersecting; if (this.vis) this.kick(); }); this.io.observe(host); }
      this.onVis = () => this.kick(); document.addEventListener('visibilitychange', this.onVis);
    }
    set(mode, colors, amount = 'medium') {
      if (reduce) mode = 'none';
      const key = mode + colors + amount;
      if (key === this.key) return;
      this.key = key; this.mode = mode; this.colors = colors; this.amount = AMOUNT[amount] || 1; this.c.hidden = mode === 'none';
      this.resize(); this.seed(); this.kick();
    }
    resize() {
      const r = this.host.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      this.w = r.width; this.h = r.height; this.c.width = r.width * dpr; this.c.height = r.height * dpr;
      this.x.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    seed() {
      const area = Math.max(this.minArea || .35, (this.w * this.h) / (420 * 860));
      const n = Math.round((BASE[this.mode] || 0) * this.amount * Math.min(1.4, area));
      this.ps = Array.from({ length: n }, () => this.make(true));
    }
    make(any) {
      const w = this.w || 400, h = this.h || 800, m = this.mode, s = this.scale;
      const p = { x: R() * w, y: any ? R() * h : 0, t: R() * TAU };
      if (m === 'oro') Object.assign(p, { y: any ? p.y : h + 10, r: (.6 + R() * 2.2) * s, vy: -(.12 + R() * .35), vx: (R() - .5) * .12, tw: .02 + R() * .04, glint: R() < .3 });
      if (m === 'petali') Object.assign(p, { y: any ? p.y : -20, r: (6 + R() * 7) * s, vy: .45 + R() * .7, vx: .2 + R() * .5, rot: R() * TAU, vr: (R() - .5) * .04, flip: R() * TAU, col: this.colors[(R() * this.colors.length) | 0] });
      if (m === 'lucciole') Object.assign(p, { r: (1.2 + R() * 1.8) * s, vx: (R() - .5) * .3, vy: (R() - .5) * .3, tw: .015 + R() * .03 });
      if (m === 'neve') Object.assign(p, { y: any ? p.y : -6, r: (.8 + R() * 2.6) * s, vy: .35 + R() * .8, vx: (R() - .5) * .3 });
      if (m === 'cuori') Object.assign(p, { y: any ? p.y : h + 20, r: (7 + R() * 8) * s, vy: -(.3 + R() * .45), sw: 12 + R() * 18, col: ['#e98b9a', '#d9667a', '#f2b3bd', '#d7ad5c'][(R() * 4) | 0], a: .7 + R() * .3 });
      if (m === 'stelle') Object.assign(p, { y: R() * h * .75, r: (.5 + R() * 1.6) * s, tw: .5 + R() * 2.2, big: R() < .12 });
      if (m === 'foglie') Object.assign(p, { y: any ? p.y : -20, r: (10 + R() * 8) * s, vy: .4 + R() * .55, vx: .15 + R() * .45, rot: R() * TAU, vr: (R() - .5) * .05, flip: R() * TAU, col: ['#7d8a52', '#97a46a', '#5f6e3c', '#b4b98a'][(R() * 4) | 0] });
      if (m === 'coriandoli') Object.assign(p, { y: any ? p.y : -12, r: (4 + R() * 4.5) * s, vy: .5 + R() * .8, vx: (R() - .5) * .4, rot: R() * TAU, vr: (R() - .5) * .08, flip: R() * TAU, vf: .05 + R() * .08, hue: R() });
      return p;
    }
    kick() { if (!this.on && this.mode !== 'none' && this.vis && !document.hidden) { this.on = true; requestAnimationFrame(this.loop); } }
    destroy() { this.on = false; this.mode = 'none'; removeEventListener('resize', this.resize); document.removeEventListener('visibilitychange', this.onVis); this.io?.disconnect(); }
    loop() {
      if (!this.c.isConnected) { this.destroy(); return; }
      if (this.mode === 'none' || !this.vis || document.hidden) { this.on = false; return; }
      const x = this.x, w = this.w, h = this.h;
      x.clearRect(0, 0, w, h);
      if (this.mode === 'stelle') this.shooting(x, w, h);
      for (let i = 0; i < this.ps.length; i++) {
        const p = this.ps[i]; p.t += .016;
        const out = this[this.mode](x, p, w, h);
        if (out) this.ps[i] = this.make(false);
      }
      requestAnimationFrame(this.loop);
    }
    soft(x) { x.shadowColor = 'rgba(70,40,25,.28)'; x.shadowBlur = 4 * this.scale; x.shadowOffsetY = 1.2 * this.scale; }
    glow(x, px, py, r, a, c1, c2) {
      const g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, `rgba(${c1},${a})`); g.addColorStop(.35, `rgba(${c2},${a * .4})`); g.addColorStop(1, `rgba(${c2},0)`);
      x.fillStyle = g; x.beginPath(); x.arc(px, py, r, 0, TAU); x.fill();
    }
    sparkle(x, px, py, r, a, col = '255,246,220') {
      x.save(); x.translate(px, py); x.fillStyle = `rgba(${col},${a})`;
      x.beginPath(); x.moveTo(0, -r); x.quadraticCurveTo(r * .12, -r * .12, r, 0); x.quadraticCurveTo(r * .12, r * .12, 0, r);
      x.quadraticCurveTo(-r * .12, r * .12, -r, 0); x.quadraticCurveTo(-r * .12, -r * .12, 0, -r); x.fill(); x.restore();
    }
    oro(x, p, w, h) {
      p.x += p.vx + Math.sin(p.t * .7) * .15; p.y += p.vy;
      const a = .45 + Math.sin(p.t * p.tw * 60) * .4;
      this.glow(x, p.x, p.y, p.r * 4.5, a * .8, '255,226,160', '214,168,80');
      x.fillStyle = `rgba(196,150,62,${a * .9})`; x.beginPath(); x.arc(p.x, p.y, p.r * .75, 0, TAU); x.fill();
      x.fillStyle = `rgba(255,250,235,${a})`; x.beginPath(); x.arc(p.x - p.r * .2, p.y - p.r * .2, p.r * .35, 0, TAU); x.fill();
      if (p.glint && a > .5) this.sparkle(x, p.x, p.y, p.r * 5 * (a - .3), a, '255,240,200');
      return p.y < -20;
    }
    petali(x, p, w, h) {
      p.x += p.vx + Math.sin(p.t) * .6; p.y += p.vy; p.rot += p.vr; p.flip += .03;
      x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.scale(1, Math.max(.25, Math.abs(Math.cos(p.flip))));
      const g = x.createLinearGradient(0, -p.r, 0, p.r); g.addColorStop(0, '#ffffff'); g.addColorStop(.35, p.col); g.addColorStop(1, p.col);
      x.globalAlpha = .95; x.fillStyle = g; this.soft(x);
      x.beginPath(); x.moveTo(0, -p.r); x.bezierCurveTo(p.r * .9, -p.r * .6, p.r * .7, p.r * .6, 0, p.r); x.bezierCurveTo(-p.r * .7, p.r * .6, -p.r * .9, -p.r * .6, 0, -p.r); x.fill();
      x.restore();
      return p.y > h + 20 || p.x > w + 20;
    }
    lucciole(x, p, w, h) {
      p.vx += (R() - .5) * .04; p.vy += (R() - .5) * .04; p.vx *= .98; p.vy *= .98; p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10; if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
      const a = Math.max(0, Math.sin(p.t * p.tw * 60)) * .9;
      this.glow(x, p.x, p.y, p.r * 6, a, this.light ? '226,176,74' : '255,240,170', this.light ? '214,160,60' : '255,214,110');
      if (this.light) { x.fillStyle = `rgba(190,138,40,${a})`; x.beginPath(); x.arc(p.x, p.y, p.r * .7, 0, TAU); x.fill(); }
    }
    neve(x, p, w, h) {
      p.x += p.vx + Math.sin(p.t * .8 + p.r) * .35; p.y += p.vy;
      if (this.light) { this.glow(x, p.x, p.y, p.r * 2.2, .55 + p.r / 10, '150,170,198', '190,205,225'); x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.arc(p.x, p.y, p.r * .6, 0, TAU); x.fill(); }
      else this.glow(x, p.x, p.y, p.r * 1.8, .55 + p.r / 8, '255,255,255', '255,255,255');
      return p.y > h + 10;
    }
    cuori(x, p, w, h) {
      p.y += p.vy; const px = p.x + Math.sin(p.t * .9) * p.sw * .3;
      const fade = Math.min(1, (h - p.y) / 80, p.y / 120);
      x.save(); x.translate(px, p.y); x.rotate(Math.sin(p.t * .9) * .25); x.globalAlpha = Math.max(0, p.a * fade); this.soft(x);
      const hg = x.createLinearGradient(0, -p.r, 0, p.r); hg.addColorStop(0, '#fff'); hg.addColorStop(.4, p.col); hg.addColorStop(1, p.col); x.fillStyle = hg;
      const r = p.r; x.beginPath(); x.moveTo(0, r * .35);
      x.bezierCurveTo(-r * 1.1, -r * .35, -r * .45, -r * 1.05, 0, -r * .45); x.bezierCurveTo(r * .45, -r * 1.05, r * 1.1, -r * .35, 0, r * .35); x.fill();
      x.restore();
      return p.y < -20;
    }
    stelle(x, p, w, h) {
      const a = .25 + (Math.sin(p.t * p.tw) * .5 + .5) * .75;
      const c = this.light ? '196,152,64' : '255,255,255';
      this.glow(x, p.x, p.y, p.r * 3, a * .9, c, this.light ? '214,180,110' : '220,230,255');
      if (p.big || this.light) this.sparkle(x, p.x, p.y, p.r * (p.big ? 5 : 3) * a, a * .9, c);
    }
    shooting(x, w, h) {
      if (!this.shoot && R() < .006) this.shoot = { x: w * (.3 + R() * .7), y: R() * h * .35, v: 7 + R() * 5, life: 0 };
      const s = this.shoot; if (!s) return;
      s.life += 1; s.x -= s.v; s.y += s.v * .45;
      const a = Math.max(0, 1 - s.life / 45);
      const g = x.createLinearGradient(s.x, s.y, s.x + 70, s.y - 32); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.strokeStyle = this.light ? `rgba(196,152,64,${a})` : g; x.lineWidth = 1.6 * this.scale; x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x + 70, s.y - 32); x.stroke();
      if (a <= 0) this.shoot = null;
    }
    foglie(x, p, w, h) {
      p.x += p.vx + Math.sin(p.t * .8) * .7; p.y += p.vy; p.rot += p.vr; p.flip += .025;
      x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.scale(Math.max(.3, Math.abs(Math.cos(p.flip))), 1);
      x.globalAlpha = .92; x.fillStyle = p.col; this.soft(x); const r = p.r;
      x.beginPath(); x.moveTo(0, -r); x.quadraticCurveTo(r * .38, 0, 0, r); x.quadraticCurveTo(-r * .38, 0, 0, -r); x.fill();
      x.shadowColor = 'transparent'; x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = .7; x.beginPath(); x.moveTo(0, -r * .85); x.lineTo(0, r * .85); x.stroke();
      x.restore();
      return p.y > h + 20 || p.x > w + 20;
    }
    coriandoli(x, p, w, h) {
      p.x += p.vx + Math.sin(p.t) * .4; p.y += p.vy; p.rot += p.vr; p.flip += p.vf;
      const f = Math.cos(p.flip), l = 62 + Math.abs(f) * 22;
      x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.scale(1, Math.max(.12, Math.abs(f)));
      const cg = x.createLinearGradient(-p.r, -p.r, p.r, p.r);
      cg.addColorStop(0, `hsl(${40 + p.hue * 6}, 70%, ${l - 22}%)`); cg.addColorStop(.5, `hsl(45, 85%, ${Math.min(92, l + 8)}%)`); cg.addColorStop(1, `hsl(${38 + p.hue * 6}, 65%, ${l - 26}%)`);
      x.fillStyle = cg; x.globalAlpha = .95; this.soft(x);
      x.fillRect(-p.r, -p.r * .6, p.r * 2, p.r * 1.2); x.restore();
      return p.y > h + 12;
    }
  }

  // ---------- SCORRIMENTO: parallasse + linee che si disegnano ----------
  let root = null, motion = 'cinema', ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  function frame() {
    ticking = false;
    if (!root || motion !== 'cinema') return;
    const vh = innerHeight, y = scrollY;
    const intro = root.querySelector('.intro');
    if (intro) {
      const k = Math.min(1, y / (intro.offsetHeight || vh));
      intro.style.setProperty('--sy', k.toFixed(4));
    }
    // foto che scorrono più lente della pagina
    root.querySelectorAll('[data-par]').forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const c = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.translate = `0 ${(c * -14).toFixed(2)}%`;
    });
    // linee del programma e della storia che crescono mentre si scorre
    root.querySelectorAll('[data-draw]').forEach(el => {
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (vh * .72 - r.top) / (r.height || 1)));
      el.style.setProperty('--p', p.toFixed(4));
      el.querySelectorAll('[data-lit]').forEach(it => {
        const t = (it.offsetTop + 14) / (el.offsetHeight || 1);
        it.classList.toggle('lit', p >= t);
      });
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
    const ps = Array.from({ length: 140 }, () => {
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
        intro.atmos.set(motion === 'none' ? 'none' : m, cols, fx.amount);
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
        host.atmos.set(motion === 'none' || b === 'none' ? 'none' : bm, bc, b === 'same' ? (fx.bodyAmount || fx.amount) : fx.bodyAmount);
        splitLines(intro.querySelector('.txt'));
      }
      r.querySelectorAll('.car-track').forEach(t => {
        coverflow(t);
        if (!t.fxBound) { t.fxBound = 1; t.addEventListener('scroll', () => requestAnimationFrame(() => coverflow(t)), { passive: true }); }
      });
      if (!window.__fxScroll) { window.__fxScroll = 1; addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); }
      onScroll();
    },
    burst,
    Atmos, MODES, pickMode,
    update: frame,
  };
})();
