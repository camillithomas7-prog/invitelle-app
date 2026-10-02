// Effetti premium dell'invito: atmosfera a particelle, parallasse, linee che si disegnano scorrendo, festa all'RSVP.
// Tutto opzionale: S.fx.motion = 'cinema' | 'soft' | 'none', S.fx.particles = 'auto' | 'oro' | 'petali' | 'lucciole' | 'neve' | 'none'
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // atmosfera automatica in base al tema scelto (colori dei petali presi dalla scena)
  const AUTO = {
    amalfi: ['petali', ['#e0457b', '#f07aa0', '#fbd3e0']], ciliegi: ['petali', ['#f6c1d1', '#fbe0e8', '#ffffff']],
    glicine: ['petali', ['#b9a2e0', '#d8c9f2', '#ffffff']], lavanda: ['petali', ['#9d7cc9', '#c7b2e6', '#e9defa']],
    parigi: ['petali', ['#d9667a', '#f2a7b4', '#fde4ea']], marrakech: ['petali', ['#c2304a', '#e46b7f', '#f7b7c2']],
    inverno: ['neve'], dolomiti: ['oro'], bosco: ['lucciole'], puglia: ['lucciole'], serra: ['lucciole'], venezia: ['lucciole'],
  };
  const PETALS_DEF = ['#f4d9d6', '#fbeeea', '#ffffff'];

  function pickMode(fx, theme) {
    const p = fx.particles || 'auto';
    if (p !== 'auto') return [p, PETALS_DEF];
    const a = AUTO[theme] || ['oro'];
    return [a[0], a[1] || PETALS_DEF];
  }

  // ---------- PARTICELLE ----------
  class Atmos {
    constructor(host) {
      this.host = host;
      this.c = document.createElement('canvas'); this.c.className = 'atmos';
      host.appendChild(this.c);
      this.x = this.c.getContext('2d'); this.ps = []; this.mode = 'none'; this.on = false; this.vis = true;
      this.resize = this.resize.bind(this); this.loop = this.loop.bind(this);
      addEventListener('resize', this.resize);
      if ('IntersectionObserver' in window) new IntersectionObserver(es => { this.vis = es[0].isIntersecting; if (this.vis) this.kick(); }).observe(host);
      document.addEventListener('visibilitychange', () => this.kick());
    }
    set(mode, colors) {
      if (reduce) mode = 'none';
      if (mode === this.mode && String(colors) === String(this.colors)) return;
      this.mode = mode; this.colors = colors; this.c.hidden = mode === 'none';
      this.resize(); this.seed(); this.kick();
    }
    resize() {
      const r = this.host.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      this.w = r.width; this.h = r.height; this.c.width = r.width * dpr; this.c.height = r.height * dpr;
      this.x.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    seed() {
      const n = { oro: 46, petali: 22, lucciole: 30, neve: 70 }[this.mode] || 0;
      this.ps = Array.from({ length: n }, () => this.make(true));
    }
    make(any) {
      const w = this.w || 400, h = this.h || 800, m = this.mode, R = Math.random;
      const p = { x: R() * w, y: any ? R() * h : 0, t: R() * 6.28, life: R() };
      if (m === 'oro') Object.assign(p, { y: any ? p.y : h + 10, r: .6 + R() * 2.2, vy: -(.12 + R() * .35), vx: (R() - .5) * .12, tw: .02 + R() * .04 });
      if (m === 'petali') Object.assign(p, { y: any ? p.y : -20, r: 6 + R() * 7, vy: .45 + R() * .7, vx: .2 + R() * .5, rot: R() * 6.28, vr: (R() - .5) * .04, flip: R() * 6.28, col: this.colors[(R() * this.colors.length) | 0] });
      if (m === 'lucciole') Object.assign(p, { r: 1.2 + R() * 1.8, vx: (R() - .5) * .3, vy: (R() - .5) * .3, tw: .015 + R() * .03, y: any ? p.y : R() * h });
      if (m === 'neve') Object.assign(p, { y: any ? p.y : -6, r: .8 + R() * 2.6, vy: .35 + R() * .8, vx: (R() - .5) * .3 });
      return p;
    }
    kick() { if (!this.on && this.mode !== 'none' && this.vis && !document.hidden) { this.on = true; requestAnimationFrame(this.loop); } }
    loop() {
      if (this.mode === 'none' || !this.vis || document.hidden) { this.on = false; return; }
      const x = this.x, w = this.w, h = this.h;
      x.clearRect(0, 0, w, h);
      for (let i = 0; i < this.ps.length; i++) {
        const p = this.ps[i]; p.t += .016;
        if (this.mode === 'oro') {
          p.x += p.vx + Math.sin(p.t * .7) * .15; p.y += p.vy;
          const a = .35 + Math.sin(p.t * p.tw * 60) * .35;
          const g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          g.addColorStop(0, `rgba(255,236,190,${a})`); g.addColorStop(.35, `rgba(232,196,120,${a * .45})`); g.addColorStop(1, 'rgba(232,196,120,0)');
          x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, p.r * 4, 0, 6.28); x.fill();
          if (p.y < -20) this.ps[i] = this.make(false);
        } else if (this.mode === 'petali') {
          p.x += p.vx + Math.sin(p.t) * .6; p.y += p.vy; p.rot += p.vr; p.flip += .03;
          x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.scale(1, Math.max(.25, Math.abs(Math.cos(p.flip))));
          x.globalAlpha = .9; x.fillStyle = p.col;
          x.beginPath(); x.moveTo(0, -p.r); x.bezierCurveTo(p.r * .9, -p.r * .6, p.r * .7, p.r * .6, 0, p.r); x.bezierCurveTo(-p.r * .7, p.r * .6, -p.r * .9, -p.r * .6, 0, -p.r); x.fill();
          x.globalAlpha = .25; x.fillStyle = '#fff'; x.beginPath(); x.ellipse(-p.r * .15, -p.r * .2, p.r * .18, p.r * .5, .3, 0, 6.28); x.fill();
          x.restore();
          if (p.y > h + 20 || p.x > w + 20) this.ps[i] = this.make(false);
        } else if (this.mode === 'lucciole') {
          p.vx += (Math.random() - .5) * .04; p.vy += (Math.random() - .5) * .04; p.vx *= .98; p.vy *= .98;
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10; if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
          const a = Math.max(0, Math.sin(p.t * p.tw * 60)) * .9;
          const g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
          g.addColorStop(0, `rgba(255,240,170,${a})`); g.addColorStop(.3, `rgba(255,214,110,${a * .35})`); g.addColorStop(1, 'rgba(255,214,110,0)');
          x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, p.r * 6, 0, 6.28); x.fill();
        } else if (this.mode === 'neve') {
          p.x += p.vx + Math.sin(p.t * .8 + p.r) * .35; p.y += p.vy;
          x.fillStyle = `rgba(255,255,255,${.5 + p.r / 6})`; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.28); x.fill();
          if (p.y > h + 10) this.ps[i] = this.make(false);
        }
      }
      requestAnimationFrame(this.loop);
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
        intro.atmos.set(motion === 'none' ? 'none' : m, cols);
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
    update: frame,
  };
})();
