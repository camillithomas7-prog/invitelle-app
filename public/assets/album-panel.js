// Scheda "Album foto" del pannello: QR da stampare per i tavoli + archivio di foto e video caricati dagli ospiti
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let ctx, info = null, list = null, filter = 'all', sel = new Set(), pollT = null, lastCount = -1;

  const url = () => info ? `${location.origin}/album/${info.slug}?k=${info.key}` : '';
  const mb = b => b > 1073741824 ? (b / 1073741824).toFixed(1) + ' GB' : (b / 1048576).toFixed(b > 104857600 ? 0 : 1) + ' MB';
  const names = () => (ctx.S().details.headline || '').split('\n').map(x => x.trim()).filter(x => x && !/^(ci sposiamo|sposi)$/i.test(x)).join(' ').replace(/\s+/g, ' ');
  const dateTxt = () => { const d = ctx.S().details.date; if (!d) return ''; const [y, m, g] = d.split('-').map(Number); return new Intl.DateTimeFormat('it', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, g)); };

  async function load() {
    const [i, l] = await Promise.all([info ? info : ctx.api('album.info', null, `&invite_id=${ctx.inviteId}`), ctx.api('album.list', null, `&invite_id=${ctx.inviteId}`)]);
    info = i; list = l;
  }

  // ---------- cartoncino con QR (canvas) ----------
  async function drawCard(canvas) {
    const S = ctx.S(), A = S.album, W = 1200, H = 1700;
    const hf = S.details.headlineFont === 'global' ? S.blocksStyle.font : S.details.headlineFont;
    await Promise.all([`400 90px "${hf}"`, 'italic 400 70px "Cormorant Garamond"', '600 30px "Inter"'].map(f => document.fonts.load(f).catch(() => {})));
    canvas.width = W; canvas.height = H;
    const c = canvas.getContext('2d');
    c.fillStyle = '#fbf8f2'; c.fillRect(0, 0, W, H);
    c.strokeStyle = '#a8864f'; c.lineWidth = 4; c.strokeRect(46, 46, W - 92, H - 92);
    c.lineWidth = 1.5; c.strokeRect(64, 64, W - 128, H - 128);
    c.textAlign = 'center'; c.fillStyle = '#7a2331';
    c.font = '600 26px Inter'; c.letterSpacing = '8px';
    c.fillText('ALBUM DEL MATRIMONIO', W / 2, 190); c.letterSpacing = '0px';
    c.fillStyle = '#2b2522';
    let fs = 96; c.font = `400 ${fs}px "${hf}"`;
    const nm = names() || 'Il nostro matrimonio';
    while (c.measureText(nm).width > W - 220 && fs > 40) { fs -= 4; c.font = `400 ${fs}px "${hf}"`; }
    c.fillText(nm, W / 2, 310);
    c.fillStyle = '#7a2331'; c.font = 'italic 400 64px "Cormorant Garamond"';
    c.fillText(A.cardTitle || 'Condividi i tuoi scatti', W / 2, 420);
    // QR
    const qr = qrcode(0, 'M'); qr.addData(url()); qr.make();
    const n = qr.getModuleCount(), box = 720, cell = Math.floor(box / (n + 8)), size = cell * (n + 8), x0 = Math.round((W - size) / 2), y0 = 500;
    c.fillStyle = '#fff'; c.shadowColor = 'rgba(60,40,20,.15)'; c.shadowBlur = 30; c.shadowOffsetY = 10;
    roundRect(c, x0, y0, size, size, 28); c.fill(); c.shadowColor = 'transparent';
    c.fillStyle = '#2b2522';
    for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) if (qr.isDark(r, q)) c.fillRect(x0 + (q + 4) * cell, y0 + (r + 4) * cell, cell, cell);
    // testo sotto
    c.fillStyle = '#2b2522'; c.font = 'italic 400 44px "Cormorant Garamond"';
    wrap(c, A.cardText || 'Inquadra il codice e carica le foto e i video della festa', W / 2, y0 + size + 90, W - 260, 54);
    c.fillStyle = '#8a7f76'; c.font = '500 26px Inter'; c.letterSpacing = '6px';
    c.fillText(dateTxt().toUpperCase(), W / 2, H - 130); c.letterSpacing = '0px';
  }
  function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function wrap(c, text, x, y, max, lh) {
    const words = text.split(' '); let line = '';
    for (const w of words) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > max && line) { c.fillText(line, x, y); line = w; y += lh; } else line = t; }
    c.fillText(line, x, y);
  }

  function printCards() {
    const img = document.getElementById('al-card').toDataURL('image/png');
    const w = window.open('', '_blank');
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>QR album da stampare</title><style>
      @page { size: A4; margin: 8mm; } body { margin: 0; } .g { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
      img { width: 100%; display: block; outline: 0.3mm dashed #bbb; outline-offset: 2mm; } p { font: 11px sans-serif; color: #888; text-align: center; margin: 4mm 0 0; }</style></head>
      <body><div class="g">${'<img src="' + img + '">'.repeat(4)}</div><p>Ritaglia lungo le linee tratteggiate e metti un cartoncino su ogni tavolo</p>
      <script>window.onload = () => setTimeout(() => print(), 300)<\/script></body></html>`);
    w.document.close();
  }

  // ---------- HTML ----------
  function html() {
    if (!info || !list) { load().then(() => ctx.rerender()); return `<h2>Album foto e video</h2><p class="lead">Caricamento...</p>`; }
    const S = ctx.S(), A = S.album;
    const items = list.items.filter(i => filter === 'all' || i.kind === filter);
    const sw = (k, on) => `<label class="sw"><input type="checkbox" data-k="album.${k}" ${on !== false ? 'checked' : ''}><span></span></label>`;
    return `<h2>Album foto e video</h2><p class="lead">Stampa il QR e mettilo sui tavoli: gli ospiti lo inquadrano con il telefono e caricano foto e video della festa. Tutto arriva qui, nel vostro archivio.</p>
      <div class="al-top">
        <div class="al-card-w"><canvas id="al-card"></canvas></div>
        <div class="al-side">
          <div class="pl-sum three" style="margin-bottom:14px">
            <div class="pl-kpi"><small>Foto</small><b>${list.photos}</b></div>
            <div class="pl-kpi"><small>Video</small><b>${list.videos}</b></div>
            <div class="pl-kpi"><small>Spazio</small><b style="font-size:17px;padding-top:4px">${mb(list.bytes)}</b></div></div>
          <div class="al-actions">
            <button type="button" class="btn pri" data-al="png">${ctx.icons.down} Scarica il QR (PNG)</button>
            <button type="button" class="btn" data-al="print">${ctx.icons.print} Stampa 4 cartoncini (A4)</button>
            <button type="button" class="btn" data-al="copy">${ctx.icons.copy} Copia link album</button>
            <a class="btn" href="${esc(url())}" target="_blank" rel="noopener">${ctx.icons.ext} Apri la pagina degli ospiti</a></div>
          <label class="l">Titolo sul cartoncino</label><input class="in" data-k="album.cardTitle" value="${esc(A.cardTitle)}">
          <label class="l">Istruzioni sul cartoncino</label><input class="in" data-k="album.cardText" value="${esc(A.cardText)}">
          <div class="box" style="margin-top:14px">
            <div class="tog"><div class="tx"><b>Caricamenti aperti</b><small>Spegnilo dopo la festa per chiudere l'album</small></div>${sw('enabled', A.enabled)}</div>
            <div class="tog"><div class="tx"><b>Chiedi il nome</b><small>Gli ospiti possono scrivere chi sono (facoltativo)</small></div>${sw('askName', A.askName)}</div></div>
          <div class="box" style="margin-top:14px"><b style="font-size:14px">Foto di copertina della pagina ospiti</b>
            <p class="hint" style="margin:2px 0 10px">È la foto che vedono in alto quando inquadrano il QR. Se non la scegli, usiamo quella del tema.</p>
            ${ctx.field('album', ['image', '', 'image'])}${ctx.field('album', ['image', 'Inquadratura', 'focus', '5/6', 'image'])}
            ${A.image ? `<a class="btn sm" href="${esc(url())}" target="_blank" rel="noopener" style="margin-top:10px">${ctx.icons.eye} Guarda la pagina ospiti</a>` : ''}</div>
          <button type="button" class="btn sm" data-al="regen" style="margin-top:4px">Genera un nuovo QR</button>
          <p class="hint">Il vecchio QR smette di funzionare: utile se il link finisce nelle mani sbagliate.</p>
        </div></div>
      <div class="sec" style="margin-top:22px"><div class="al-bar">
        <h3 style="margin:0">Archivio <span class="hint" style="margin:0 0 0 6px;font-family:Inter">${list.items.length} file · si aggiorna da solo</span></h3>
        <div class="filters" style="margin:0">${[['all', 'Tutti'], ['photo', 'Foto'], ['video', 'Video']].map(([k, l]) => `<button type="button" data-al="filter" data-f="${k}" class="${filter === k ? 'on' : ''}">${l}</button>`).join('')}</div>
        <span class="sp" style="flex:1"></span>
        ${sel.size ? `<span class="hint" style="margin:0">${sel.size} selezionati</span>
          <a class="btn sm" href="/api?a=album.zip&invite_id=${ctx.inviteId}&ids=${[...sel].join(',')}">${ctx.icons.down} Scarica selezionati</a>
          <button type="button" class="btn sm" data-al="del-sel" style="color:var(--bad)">${ctx.icons.trash} Elimina</button>
          <button type="button" class="btn sm" data-al="clear">Annulla</button>` : ''}
        ${list.items.length ? `<a class="btn sm pri" href="/api?a=album.zip&invite_id=${ctx.inviteId}">${ctx.icons.down} Scarica tutto (ZIP)</a>` : ''}</div>
        ${items.length ? `<div class="al-grid">${items.map(i => `<div class="al-it ${sel.has(+i.id) ? 'sel' : ''}" data-al="open" data-id="${i.id}">
            ${i.kind === 'video' ? `<video src="${esc(i.file)}#t=0.5" muted playsinline preload="metadata"></video><span class="al-play">${ctx.icons.play}</span>` : `<img src="${esc(i.thumb || i.file)}" loading="lazy" alt="">`}
            <label class="al-chk" data-al="toggle" data-id="${i.id}"><input type="checkbox" ${sel.has(+i.id) ? 'checked' : ''}></label>
            <div class="al-meta">${esc(i.uploader || 'Ospite')} · ${esc(i.created_at.slice(11, 16))}</div></div>`).join('')}</div>`
          : `<div class="al-empty">${list.items.length ? 'Nessun file in questa categoria' : 'Ancora nessuna foto: appena gli ospiti inquadrano il QR, i loro scatti compaiono qui.'}</div>`}</div>`;
  }

  function bind() {
    const cv = document.getElementById('al-card');
    if (cv && info) drawCard(cv);
    clearInterval(pollT);
    pollT = setInterval(async () => {
      if (!document.getElementById('al-card')) return clearInterval(pollT);
      const l = await ctx.api('album.list', null, `&invite_id=${ctx.inviteId}`);
      if (l.items && l.items.length !== list.items.length) { list = l; ctx.rerender(); }
    }, 12000);
  }

  function lightbox(id) {
    const i = list.items.find(x => +x.id === +id); if (!i) return;
    const m = document.createElement('div'); m.className = 'modal al-lb';
    m.innerHTML = `<div class="al-lb-in">${i.kind === 'video' ? `<video src="${esc(i.file)}" controls autoplay playsinline></video>` : `<img src="${esc(i.file)}" alt="">`}
      <div class="al-lb-bar"><span>${esc(i.uploader || 'Ospite')} · ${esc(i.created_at.slice(0, 16).replace(' ', ' alle '))} · ${mb(i.size)}</span>
      <span style="flex:1"></span><a class="btn sm" href="${esc(i.file)}" download="${esc(i.original || '')}">${ctx.icons.down} Scarica</a>
      <button class="btn sm" data-del style="color:var(--bad)">${ctx.icons.trash} Elimina</button><button class="btn sm" data-close>Chiudi</button></div></div>`;
    document.body.appendChild(m);
    m.addEventListener('click', async e => {
      if (e.target === m || e.target.closest('[data-close]')) m.remove();
      if (e.target.closest('[data-del]') && confirm('Eliminare questo file dall\'album?')) { await ctx.api('album.delete', { invite_id: ctx.inviteId, ids: [+id] }); m.remove(); await load(); ctx.rerender(); }
    });
  }

  async function onClick(e) {
    const b = e.target.closest('[data-al]'); if (!b) return false;
    const A = b.dataset.al;
    if (A === 'toggle') { e.stopPropagation(); e.preventDefault(); const id = +b.dataset.id; sel.has(id) ? sel.delete(id) : sel.add(id); ctx.rerender(); return true; }
    switch (A) {
      case 'png': document.getElementById('al-card').toBlob(bl => { const a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = 'qr-album-matrimonio.png'; a.click(); }); break;
      case 'print': printCards(); break;
      case 'copy': navigator.clipboard.writeText(url()); ctx.toast('Link dell\'album copiato'); break;
      case 'regen': if (confirm('Generare un nuovo QR? Quello già stampato smetterà di funzionare.')) { const r = await ctx.api('album.regen', { invite_id: ctx.inviteId }); info.key = r.key; ctx.rerender(); ctx.toast('Nuovo QR creato: ricordati di ristamparlo'); } break;
      case 'filter': filter = b.dataset.f; ctx.rerender(); break;
      case 'clear': sel.clear(); ctx.rerender(); break;
      case 'del-sel': if (confirm(`Eliminare ${sel.size} file dall'album?`)) { await ctx.api('album.delete', { invite_id: ctx.inviteId, ids: [...sel] }); sel.clear(); await load(); ctx.rerender(); } break;
      case 'open': if (sel.size) { const id = +b.dataset.id; sel.has(id) ? sel.delete(id) : sel.add(id); ctx.rerender(); } else lightbox(b.dataset.id); break;
      default: return false;
    }
    return true;
  }

  window.AlbumPanel = {
    init(c) { ctx = c; },
    html, bind, onClick,
    redrawCard() { const cv = document.getElementById('al-card'); if (cv && info) drawCard(cv); },
  };
})();
