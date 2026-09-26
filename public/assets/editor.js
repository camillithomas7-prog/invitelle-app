// Pannello di creazione dell'invito Invitelle
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const I = {
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
    tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    mail: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
    phone: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    theme: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1 0 1.5-.8 1.5-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16a6 6 0 0 0 6-6C22 6 17.5 2 12 2z"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.9 17.9A10 10 0 0 1 12 20c-7 0-11-8-11-8a18 18 0 0 1 5-5.9M9.9 4.2A9 9 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.2 3.2M1 1l22 22"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.8-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>',
    grip: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
    userPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>',
    msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    fork: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    img: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>',
    play: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>',
    pause: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zM12 0a12 12 0 0 0-10.3 18L0 24l6.2-1.6A12 12 0 1 0 12 0z"/></svg>',
  };

  let S = window.__INVITE.data;
  if (!S.blocksStyle.iconColor) S.blocksStyle.iconColor = '#a8864f';
  S.album = Object.assign({ cardStyle: 'avorio', enabled: true, askName: true, cardTitle: 'Condividi i tuoi scatti', cardText: 'Inquadra il codice e carica le foto e i video della festa' }, S.album || {});
  // aggiorna i blocchi "La nostra storia" creati con la versione precedente
  (S.blocks || []).filter(b => b.type === 'story').forEach(b => {
    const def = INV.blockTypes.story.def(), d = b.data;
    const old = (d.items || []).length === 1 && d.items[0].year === '2019' && d.items[0].title === 'Il primo incontro' && !d.items[0].text && !d.items[0].image;
    if (old) { d.items = def.items; window.__migrated = true; }
    for (const k of ['intro', 'showWedding', 'weddingTitle', 'weddingText']) if (d[k] === undefined) { d[k] = def[k]; window.__migrated = true; }
  });
  const ID = window.__INVITE.id;
  let SLUG = window.__INVITE.slug;
  let tab = 'theme', openBlock = null, addOpen = false, guestsData = null, gFilter = 'all', gSearch = '', editGuest = null, showCustomMsg = false;
  const frame = $('#pv-frame');
  const panel = $('#panel');

  // ---------- stato, salvataggio, anteprima ----------
  const get = (path) => path.split('.').reduce((o, k) => o?.[k], S);
  const set = (path, val) => {
    const ks = path.split('.'); const last = ks.pop();
    const o = ks.reduce((o, k) => o[k], S); o[last] = val;
  };
  let saveT = null, pvT = null;
  function changed(rerender) {
    $('#save-state').classList.add('busy'); $('#save-state span').textContent = 'Salvataggio...';
    clearTimeout(saveT); saveT = setTimeout(save, 600);
    clearTimeout(pvT); pvT = setTimeout(() => post({ data: S }), 120);
    if (rerender) render();
    $('.top .name').textContent = (S.details.headline || '').replace(/\s+/g, ' ').trim();
  }
  async function save() {
    saveT = null;
    const r = await api('invite.save', { id: ID, data: S });
    $('#save-state').classList.toggle('busy', !!r.error);
    $('#save-state span').textContent = r.error ? 'Errore di salvataggio' : 'Salvato';
  }
  async function api(a, body, qs = '') {
    const opt = body instanceof FormData ? { method: 'POST', body } : body ? { method: 'POST', body: JSON.stringify(body) } : {};
    try {
      const r = await fetch(`/api?a=${a}${qs}`, opt);
      if (r.status === 401) { location.href = '/'; return { error: 'Accesso richiesto' }; }
      return await r.json();
    } catch (e) { return { error: 'Errore di rete' }; }
  }
  let frameReady = false, pending = null;
  function post(msg) {
    if (!frameReady) { pending = Object.assign(pending || {}, msg); return; }
    frame.contentWindow.postMessage(Object.assign({ type: 'invitelle' }, msg), '*');
    $('#pv-full-frame') && $('#pv-full-frame').contentWindow.postMessage(Object.assign({ type: 'invitelle' }, msg), '*');
  }
  function onFrameReady() { frameReady = true; post(Object.assign({ data: S, view: viewFor() }, pending || {})); pending = null; }
  window.addEventListener('message', e => {
    if (e.data?.type === 'invitelle-ready' && e.source === frame.contentWindow) onFrameReady();
  });
  // l'iframe può aver finito di caricare prima che questo script fosse pronto
  try { if (frame.contentWindow.Invite) onFrameReady(); } catch (e) {}
  frame.addEventListener('load', () => { if (!frameReady) onFrameReady(); });
  function viewFor() {
    if (tab === 'envelope') return 'envelope';
    if (tab === 'rsvp' || tab === 'guests') return 'rsvp';
    if (tab === 'blocks' && openBlock) return openBlock;
    return 'intro';
  }
  function toast(t) {
    const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d);
    setTimeout(() => d.remove(), 2200);
  }
  const inviteUrl = (token) => `${location.origin}/i/${SLUG}${token ? '?g=' + token : ''}`;

  // ---------- componenti ----------
  const sw = (path, on) => `<label class="sw"><input type="checkbox" data-k="${path}" ${on ? 'checked' : ''}><span></span></label>`;
  const tog = (icon, title, desc, path) => `<div class="tog"><div class="ic">${I[icon] || ''}</div><div class="tx"><b>${title}</b>${desc ? `<small>${desc}</small>` : ''}</div>${sw(path, get(path))}</div>`;
  const inp = (path, ph = '', type = 'text') => `<input class="in" type="${type}" data-k="${path}" value="${esc(get(path))}" placeholder="${esc(ph)}">`;
  const area = (path, ph = '') => `<textarea class="in" data-k="${path}" placeholder="${esc(ph)}">${esc(get(path))}</textarea>`;
  // colore libero: tavolozza completa (qualsiasi colore e sfumatura) + codice esadecimale
  const RAINBOW = 'conic-gradient(#f44, #fb3, #ee4, #4d6, #4cf, #46f, #b4f, #f4a, #f44)';
  const isHex = v => /^#[0-9a-f]{6}$/i.test(v || '');
  const customPick = (path, isCustom, label = 'Personalizzato') => {
    const v = get(path);
    return `<label class="cpick ${isCustom ? 'on' : ''}" title="Scegli qualsiasi colore"><i style="background:${isCustom ? v : RAINBOW}"></i><span>${label}</span>
      <input type="color" data-k="${path}" value="${isHex(v) ? v : '#b76e79'}"></label>
      ${isCustom ? `<input class="in hex" data-hex="${path}" value="${esc(v)}" maxlength="7" spellcheck="false">` : ''}`;
  };
  const colorRow = (path) => { const v = get(path), custom = !INV.colors.some(c => c.id === v);
    return `<div class="colors">${INV.colors.map(c => `<button type="button" data-set="${path}" data-v="${c.id}" class="${v === c.id ? 'on' : ''}"><i style="background:${c.id}"></i>${c.name}</button>`).join('')}${customPick(path, custom)}</div>`; };
  const fontGrid = (path, global) => `<div class="fonts">${global ? `<button type="button" data-set="${path}" data-v="global" class="${get(path) === 'global' ? 'on' : ''}"><b style="font-family:'Cinzel'">Aa</b><small>Come i blocchi</small></button>` : ''}${INV.fonts.map(f => `<button type="button" data-set="${path}" data-v="${f}" class="${get(path) === f ? 'on' : ''}"><b style="font-family:'${f}'">Aa</b><small>${f}</small></button>`).join('')}</div>`;
  const upload = (path, label = 'Carica immagine') => {
    const v = get(path);
    return `<div class="upl"><div class="th" style="${v ? `background-image:url('${esc(v)}')` : ''}">${v ? '' : I.img}</div><div>
      <label class="btn sm">${I.upload}<span>${label}</span><input type="file" accept="image/*" data-upload="${path}"></label>
      ${v ? `<button type="button" class="btn sm" data-set="${path}" data-v="">Rimuovi</button>` : ''}</div></div>`;
  };

  // ---------- TAB: TEMA ----------
  function tabTheme() {
    return `<h2>Scegli il tema</h2><p class="lead">Puoi cambiare tema quando vuoi. Passa sopra una card per vedere l'animazione.</p>
      <div class="themes">${INV.themes.map(t => `<button type="button" class="theme ${S.theme === t.id ? 'on' : ''}" data-set="theme" data-v="${t.id}">
        <div class="vid" style="background-image:url('${t.poster}')"><video src="${t.video}" poster="${t.poster}" muted loop playsinline preload="none"></video>
        <span class="play">${I.play}</span>${t.popular ? '<span class="pop">Popolare</span>' : ''}${S.theme === t.id ? `<span class="chk">${I.check}</span>` : ''}</div>
        <div class="meta"><b>${esc(t.name)}</b><small>${esc(t.desc)}</small></div></button>`).join('')}
        </div>`;
  }

  // ---------- TAB: BUSTA ----------
  function tabEnvelope() {
    const e = S.envelope;
    const custom = e.mode !== 'template';
    const col = isHex(e.color) ? e.color : (INV.envelopeColors.find(c => c.id === e.color) || INV.envelopeColors[1]).hex;
    const seal = INV.sealStyle(e);
    const cards = INV.envelopeTemplates.map(t => `<button type="button" class="theme ${!custom && e.template === t.id ? 'on' : ''}" data-action="env-tpl" data-id="${t.id}">
        <div class="vid" style="background-image:url('${t.poster}')"><video src="${t.video}" poster="${t.poster}" muted loop playsinline preload="none"></video>
        <span class="play">${I.play}</span>${t.popular ? '<span class="pop">Popolare</span>' : ''}${!custom && e.template === t.id ? `<span class="chk">${I.check}</span>` : ''}</div>
        <div class="meta"><b>${esc(t.name)}</b><small>${esc(t.desc)}</small></div></button>`).join('')
      + `<button type="button" class="theme ${custom ? 'on' : ''}" data-action="env-custom">
        ${(() => { const ce = INV.customEnv(e.style);
          return `<div class="vid env-photo" style="--env:${col};background-image:url('${ce.poster}')"><div class="env-tint"></div>
          <div class="em-seal ${seal.tint ? 'tint' : ''}" style="left:${ce.tipX}%;top:${ce.tipY}%;background-image:url('${seal.img}');--sealc:${seal.tint || 'transparent'};--sealimg:url('${seal.img}')"><span style="color:${seal.ink}">${esc(e.initials)}</span></div>
          ${custom ? `<span class="chk">${I.check}</span>` : ''}</div>`; })()}
        <div class="meta"><b>Busta personalizzata</b><small>Le vostre iniziali sul sigillo, colori a scelta</small></div></button>`;
    const customHTML = custom ? `
      <div class="sec"><h3>1. Inserisci le iniziali</h3>${inp('envelope.initials', 'es. G & M')}<p class="hint">Le iniziali compariranno sul sigillo della busta</p></div>
      <div class="sec"><h3>2. Stile della carta</h3><div class="env-styles">${Object.entries(INV.customEnvelopes).map(([k, ce]) => `<button type="button" class="env-st ${(INV.customEnvelopes[e.style] ? e.style : 'ceralacca') === k ? 'on' : ''}" data-set="envelope.style" data-v="${k}">
        <div class="env-photo" style="--env:${col};background-image:url('${ce.poster}');--pos:${ce.tipX}% ${ce.tipY}%"><div class="env-tint"></div></div><span>${ce.name}</span></button>`).join('')}</div></div>
      <div class="sec"><h3>3. Colore della busta</h3><div class="env-cols">${INV.envelopeColors.map(c => `<button type="button" data-set="envelope.color" data-v="${c.id}" class="${e.color === c.id ? 'on' : ''}"><i style="background:${c.hex}"></i>${c.name}</button>`).join('')}
        <div class="env-custom ${isHex(e.color) ? 'on' : ''}">${customPick('envelope.color', isHex(e.color))}</div></div></div>
      <div class="sec"><h3>4. Colore del sigillo</h3><div class="seals">${INV.seals.map(x => `<button type="button" class="seal-c ${e.seal === x.id ? 'on' : ''}" data-set="envelope.seal" data-v="${x.id}">
        <div class="sv" style="background-image:url('${x.img}')"><span style="color:${x.ink}">${esc(e.initials)}</span></div>${e.seal === x.id ? `<span class="chk">${I.check}</span>` : ''}<b>${x.name}</b></button>`).join('')}
        ${(() => { const cs = INV.sealStyle({ ...e, seal: 'custom', sealColor: isHex(e.sealColor) ? e.sealColor : '#6b8f71' }); const on = e.seal === 'custom';
          return `<label class="seal-c ${on ? 'on' : ''}" title="Scegli qualsiasi colore"><div class="sv tint" style="background-image:url('${cs.img}');--sealc:${cs.tint};--sealimg:url('${cs.img}')"><span style="color:${cs.ink}">${esc(e.initials)}</span></div>
            ${on ? `<span class="chk">${I.check}</span>` : ''}<b><i class="rb" style="background:${RAINBOW}"></i> Personalizzato</b><input type="color" data-action="seal-color" value="${isHex(e.sealColor) ? e.sealColor : '#6b8f71'}"></label>`; })()}</div>
        ${e.seal === 'custom' ? `<div class="rowx" style="margin-top:10px"><span class="hint" style="margin:0">Codice colore</span><input class="in hex" data-hex="envelope.sealColor" value="${esc(e.sealColor || '')}" maxlength="7" spellcheck="false"></div>` : ''}</div>`
      : `<div class="box soft" style="margin-top:4px;font-size:13px">L'ospite vede la busta a tutto schermo: tocca e parte il video dell'apertura, poi si apre l'invito con il vostro tema.</div>`;
    return `<h2>Apertura della busta</h2><p class="lead">La prima cosa che vedono gli ospiti. Scegli una busta già pronta con l'apertura animata, oppure crea la tua busta personalizzata.</p>
      <div class="themes">${cards}</div>${customHTML}
      <div class="sec"><button type="button" class="btn" data-action="show-envelope">${I.eye} Rivedi l'apertura della busta</button></div>`;
  }

  // ---------- TAB: DETTAGLI ----------
  function tabDetails() {
    const d = S.details;
    return `<h2>Dettagli</h2><p class="lead">Data e testo di apertura che compaiono sopra il video del tema.</p>
      <div class="sec"><h3><span class="dot"></span>Data</h3>
        <div class="row2"><div><label class="l">Data</label>${inp('details.date', '', 'date')}</div><div><label class="l">Data di fine <span style="font-weight:400;color:var(--mute)">(facoltativa)</span></label>${inp('details.endDate', '', 'date')}</div></div>
        <p class="hint">Per eventi di più giorni inserisci una data di fine: verrà mostrato l'intervallo.</p>
        <label class="l">Dimensione data</label><div class="range"><input type="range" min="12" max="34" data-k="details.dateSize" value="${d.dateSize}"><output>${d.dateSize}px</output></div>
        <label class="l">Posizione della data</label><div class="seg"><button type="button" data-set="details.datePos" data-v="above" class="${d.datePos === 'above' ? 'on' : ''}">Sopra il titolo</button><button type="button" data-set="details.datePos" data-v="below" class="${d.datePos === 'below' ? 'on' : ''}">Sotto il titolo</button></div></div>
      <div class="sec"><h3><span class="dot"></span>Titolo di apertura</h3>${area('details.headline', 'Giulia\n&\nMarco')}
        <p class="hint">Premi Invio per andare a capo: ogni riga appare su una riga separata dell'invito.<br>Meno è meglio: lascia parlare il tema animato.</p>
        <label class="l">Font del titolo</label>${fontGrid('details.headlineFont', true)}
        <label class="l">Dimensione del titolo</label><div class="range"><input type="range" min="16" max="56" data-k="details.headlineSize" value="${d.headlineSize}"><output>${d.headlineSize}px</output></div>
        <label class="l">Colore del testo</label>${colorRow('details.textColor')}</div>`;
  }

  // ---------- TAB: BLOCCHI ----------
  const F = { // descrittori dei campi per tipo di blocco
    countdown: [['title', 'Titolo'], ['subtitle', 'Sottotitolo'], ['image', 'Foto di sfondo', 'image'], ['image', 'Posizione della foto', 'focus', null, 'image'],
      ['bw', 'Bianco e nero', 'toggle', 'Trasforma la foto a colori in bianco e nero', 'image'],
      ['darken', 'Oscura la foto', 'toggle', 'Rende più leggibili titolo e numeri sopra la foto', 'image'], ['darkness', 'Quanto oscurare', 'range', [10, 85, '%'], 'darken']],
    venue: [['title', 'Titolo'], ['days', 'Luoghi', 'list', [['label', 'Giorno / etichetta', 'text', 'es. Sabato 19 giugno'], ['name', 'Nome del luogo'], ['address', 'Indirizzo'], ['maps', 'Link Google Maps', 'maps'], ['image', 'Immagine del luogo', 'image']], 'Aggiungi luogo', { label: 'Nuovo giorno', name: '', address: '', maps: '', image: '' }]],
    destination: [['title', 'Titolo'], ['place', 'Luogo'], ['text', 'Descrizione', 'area'], ['image', 'Immagine', 'image'], ['tips', 'Informazioni utili', 'area']],
    drawing: [['image', 'Disegno o illustrazione', 'image'], ['caption', 'Didascalia']],
    timeline: [['title', 'Titolo'], ['items', 'Momenti', 'list', [['time', 'Ora', 'text', '16:00'], ['title', 'Momento'], ['text', 'Dettaglio']], 'Aggiungi momento', { time: '', title: '', text: '' }]],
    story: [['title', 'Titolo'], ['intro', 'Frase introduttiva', 'area'],
      ['items', 'Le tappe della vostra storia', 'list', [['date', 'Data', 'date'], ['title', 'Titolo della tappa', 'text', 'es. Il primo appuntamento'], ['text', 'Racconta cosa è successo', 'area'], ['image', 'Foto', 'image']], 'Aggiungi tappa', { date: '', title: '', text: '', image: '' }],
      ['showWedding', 'Ultima tappa: il giorno del matrimonio', 'toggle', 'Chiude la storia con la data delle nozze (dalla scheda Dettagli)'],
      ['weddingTitle', 'Titolo dell\'ultima tappa', 'text', '', 'showWedding'], ['weddingText', 'Testo dell\'ultima tappa', 'area', '', 'showWedding']],
    gallery: [['title', 'Titolo'], ['images', 'Foto', 'images']],
    dress: [['title', 'Titolo'], ['text', 'Descrizione', 'area'], ['colors', 'Palette colori suggerita', 'colors']],
    menu: [['title', 'Titolo'], ['courses', 'Portate', 'list', [['name', 'Portata'], ['dish', 'Piatto', 'area']], 'Aggiungi portata', { name: '', dish: '' }]],
    gift: [['title', 'Titolo'], ['text', 'Messaggio', 'area'], ['iban', 'IBAN'], ['holder', 'Intestatario'], ['link', 'Link lista nozze online']],
    hotel: [['title', 'Titolo'], ['items', 'Hotel', 'list', [['name', 'Nome hotel'], ['address', 'Indirizzo'], ['link', 'Link prenotazione'], ['note', 'Nota (es. codice sconto)']], 'Aggiungi hotel', { name: '', address: '', link: '', note: '' }]],
    transport: [['title', 'Titolo'], ['items', 'Opzioni', 'list', [['mode', 'Mezzo'], ['text', 'Dettagli', 'area']], 'Aggiungi opzione', { mode: '', text: '' }]],
    boarding: [['title', 'Titolo'], ['row', '', 'row', [['from', 'Partenza'], ['fromCode', 'Codice']]], ['row', '', 'row', [['to', 'Arrivo'], ['toCode', 'Codice']]], ['row', '', 'row3', [['flight', 'Volo'], ['gate', 'Gate'], ['seat', 'Posto']]]],
    todo: [['title', 'Titolo'], ['items', 'Voci', 'strings']],
    faq: [['title', 'Titolo'], ['items', 'Domande', 'list', [['q', 'Domanda'], ['a', 'Risposta', 'area']], 'Aggiungi domanda', { q: '', a: '' }]],
    text: [['title', 'Titolo (facoltativo)'], ['text', 'Testo', 'area']],
  };

  function field(base, f) {
    const [key, label, kind = 'text', sub, addLabel, tpl] = f;
    const p = `${base}.${key}`;
    if (kind === 'row' || kind === 'row3') return `<div class="${kind === 'row' ? 'row2' : 'row3'}">${sub.map(s => `<div>${field(base, s)}</div>`).join('')}</div>`;
    const L = label ? `<label class="l">${label}</label>` : '';
    // toggle/range/focus: il 5° valore è il campo da cui dipendono (mostrati solo se quel campo è attivo)
    if (['toggle', 'range', 'focus', 'text', 'area'].includes(kind) && typeof f[4] === 'string' && f[4] && !get(`${base}.${f[4]}`)) return '';
    if (kind === 'focus') {
      const d = get(base), x = d.posX ?? 50, y = d.posY ?? 50, z = d.zoom ?? 100;
      return L + `<div class="focus-wrap"><div class="focus" data-focus="${base}" title="Trascina per spostare la foto" ${f[3] ? `style="aspect-ratio:${f[3]}"` : ''}>
          <div class="fc-img ${d.bw ? 'bw' : ''}" style="background-image:url('${esc(d.image)}');background-position:${x}% ${y}%;transform:scale(${z / 100});transform-origin:${x}% ${y}%"></div>
          ${d.darken ? `<div class="fc-dk" style="background:rgba(15,10,8,${(d.darkness ?? 45) / 100})"></div>` : ''}
          <div class="fc-hint">Trascina per spostare</div></div>
        <div class="focus-ctl"><label class="l" style="margin-top:0">Zoom</label>
          <div class="range"><input type="range" min="100" max="250" data-k="${base}.zoom" value="${z}"><output>${z}%</output></div>
          <p class="hint">Trascina la foto nel riquadro per scegliere quale parte vedono gli ospiti.</p>
          <button type="button" class="btn sm" data-action="focus-reset" data-p="${base}" style="margin-top:10px">Centra di nuovo</button></div></div>`;
    }
    if (kind === 'toggle') return `<div class="pill-t" style="margin-top:12px"><span><b style="font-size:13px">${label}</b>${f[3] ? `<br><small style="color:var(--mute)">${f[3]}</small>` : ''}</span>${sw(p, get(p))}</div>`;
    if (kind === 'range') { const [mn, mx, u] = f[3]; const v = get(p) ?? Math.round((mn + mx) / 2);
      return L + `<div class="range"><input type="range" min="${mn}" max="${mx}" data-k="${p}" value="${v}"><output>${v}${u}</output></div>`; }
    if (kind === 'area') return L + area(p);
    if (kind === 'date') return L + `<input class="in" type="date" data-k="${p}" value="${esc(get(p) || '')}" style="max-width:220px">${!get(p) && get(p.replace(/\.date$/, '.year')) ? `<span class="hint" style="margin-left:8px">prima: ${esc(get(p.replace(/\.date$/, '.year')))}</span>` : ''}`;
    if (kind === 'image') return L + upload(p);
    if (kind === 'maps') return L + `<div class="rowx">${inp(p, 'https://maps.google.com/...')}<button type="button" class="btn sm" data-action="auto-maps" data-p="${base}">Genera</button></div><p class="hint">Si genera automaticamente dall'indirizzo.</p>`;
    if (kind === 'images') {
      const arr = get(p) || [];
      return L + `<div class="gal-ed">${arr.map((u, i) => `<div style="background-image:url('${esc(u)}')"><button type="button" data-action="rm-item" data-p="${p}" data-i="${i}">✕</button></div>`).join('')}
        <label>+<input type="file" accept="image/*" multiple data-upload-add="${p}" hidden></label></div>`;
    }
    if (kind === 'colors') {
      const arr = get(p) || [];
      return L + `<div class="sw-ed">${arr.map((c, i) => `<span><input type="color" data-k="${p}.${i}" value="${esc(c)}"><button type="button" data-action="rm-item" data-p="${p}" data-i="${i}">✕</button></span>`).join('')}
        <button type="button" class="btn sm" data-action="add-item" data-p="${p}" data-tpl='"#d9c9b0"'>${I.plus} Colore</button></div>`;
    }
    if (kind === 'strings') {
      const arr = get(p) || [];
      return L + arr.map((s, i) => `<div class="rowx" style="margin-bottom:6px">${inp(`${p}.${i}`)}<button type="button" class="ibtn del" data-action="rm-item" data-p="${p}" data-i="${i}">${I.trash}</button></div>`).join('')
        + `<button type="button" class="btn sm" data-action="add-item" data-p="${p}" data-tpl='""'>${I.plus} Aggiungi voce</button>`;
    }
    if (kind === 'list') {
      const arr = get(p) || [];
      return L + (key === 'items' && base.endsWith('.data') && get(base.replace(/\.data$/, '.type')) === 'story' ? '<p class="hint" style="margin:-2px 0 6px">Nell\'invito le tappe vengono messe in ordine di data automaticamente.</p>' : '') + arr.map((it, i) => `<div class="rep"><div class="rep-h"><span>${i + 1}</span><span>
          ${i > 0 ? `<button type="button" class="ibtn" data-action="mv-item" data-p="${p}" data-i="${i}" data-d="-1" title="Sposta su">↑</button>` : ''}
          <button type="button" class="ibtn del" data-action="rm-item" data-p="${p}" data-i="${i}">${I.trash}</button></span></div>
          ${sub.map(s => field(`${p}.${i}`, s)).join('')}</div>`).join('')
        + `<button type="button" class="btn sm" data-action="add-item" data-p="${p}" data-tpl='${esc(JSON.stringify(tpl))}'>${I.plus} ${addLabel}</button>`;
    }
    return L + inp(p, f[3] || '');
  }

  function blockTitle(b) {
    const t = b.data?.title || b.data?.caption || '';
    return t && t !== INV.blockTypes[b.type].name ? `<small>${esc(t)}</small>` : '';
  }

  function iconPicker(path, type, cur, accent) {
    const col = accent || S.blocksStyle.iconColor || '#a8864f';
    return `<label class="l">Icona</label><div class="icons-pick">${[0, 1, 2, 3, 4, 5].map(v => `<button type="button" class="${(+cur || 0) === v ? 'on' : ''}" data-set="${path}" data-v="${v}" title="${v ? 'Linea ' + v : 'Classica 3D'}">${INV.iconHTML(type, v, col, 'ip')}</button>`).join('')}</div>
      <p class="hint">La prima è l'icona classica 3D; le altre sono a linea sottile e prendono il colore delle icone.</p>`;
  }
  function tabBlocks() {
    const bs = S.blocksStyle;
    const list = S.blocks.map((b, i) => {
      const bt = INV.blockTypes[b.type]; if (!bt) return '';
      const open = openBlock === b.id;
      return `<div class="blk-i ${b.visible ? '' : 'hid'}" draggable="true" data-bi="${i}">
        <div class="blk-h" data-action="toggle-block" data-id="${b.id}"><span class="grip" title="Trascina per riordinare">${I.grip}</span>
          <img src="/media/icons/icon-blk-${bt.icon}.png" alt=""><b>${bt.name}${blockTitle(b)}</b>
          <button type="button" class="ibtn" data-action="vis-block" data-i="${i}" title="${b.visible ? 'Nascondi' : 'Mostra'}">${b.visible ? I.eye : I.eyeOff}</button>
          <button type="button" class="ibtn del" data-action="del-block" data-i="${i}" title="Elimina">${I.trash}</button></div>
        ${open ? `<div class="blk-b">${(F[b.type] || []).map(f => field(`blocks.${i}.data`, f)).join('')}
          ${b.type !== 'drawing' ? iconPicker(`blocks.${i}.icon`, b.type, b.icon, b.accent) : ''}
          <label class="l">Colore del blocco</label><div class="accents">${INV.accents.map(a => `<button type="button" class="${a ? '' : 'none'} ${b.accent === a ? 'on' : ''}" style="${a ? `background:${a}` : ''}" data-set="blocks.${i}.accent" data-v="${a}">${a ? '' : '✕'}</button>`).join('')}
            <label class="acc-pick ${b.accent && !INV.accents.includes(b.accent) ? 'on' : ''}" title="Scegli qualsiasi colore" style="background:${b.accent && !INV.accents.includes(b.accent) ? b.accent : RAINBOW}"><input type="color" data-k="blocks.${i}.accent" value="${isHex(b.accent) ? b.accent : '#a8864f'}"></label></div>
          ${b.accent && !INV.accents.includes(b.accent) ? `<input class="in hex" style="margin-top:8px;width:110px" data-hex="blocks.${i}.accent" value="${esc(b.accent)}" maxlength="7" spellcheck="false">` : ''}
          <p class="hint">Colora il titolo, i riquadri e i dettagli di questo blocco. Con ✕ usa i colori generali dei blocchi.</p></div>` : ''}
      </div>`;
    }).join('');
    return `<h2>Blocchi</h2><p class="lead">Le sezioni che gli ospiti vedono scorrendo l'invito.</p>
      <div class="sec"><h3>Font <span style="font-family:Inter;font-size:12px;color:var(--mute);font-weight:400">(per i blocchi)</span></h3>${fontGrid('blocksStyle.font')}
        <label class="l">Colore del testo <span style="font-weight:400;color:var(--mute)">(per i blocchi)</span></label>${colorRow('blocksStyle.color')}
        <label class="l">Colore delle icone <span style="font-weight:400;color:var(--mute)">(icone a linea)</span></label>${colorRow('blocksStyle.iconColor')}
        <div class="rowx" style="margin-top:10px;gap:8px;flex-wrap:wrap"><span class="hint" style="margin:0">Stessa icona per tutti i blocchi:</span>${[0, 1, 2, 3, 4, 5].map(v => `<button type="button" class="btn sm" data-action="icons-all" data-v="${v}">${v ? 'Linea ' + v : 'Classica 3D'}</button>`).join('')}</div></div>
      <div class="sec"><div class="box soft"><b style="font-size:13px">Bordi floreali</b><p class="hint" style="margin:2px 0 10px">Decorazioni floreali ai lati dei blocchi</p>
        <div class="flow">${INV.flowers.map(f => `<button type="button" data-set="blocksStyle.flowers" data-v="${f.id}" class="${bs.flowers === f.id ? 'on' : ''}"><div style="${f.img ? `background-image:url('${f.img}')` : ''}">${f.img ? '' : '✕'}</div>${f.name}</button>`).join('')}</div></div></div>
      <div class="sec"><h3>Blocchi attivi</h3><p class="hint" style="margin:-6px 0 12px">Trascina per riordinare · Clicca per modificare · Occhio per nascondere</p>
        <div class="blocks" id="blocks">${list}</div>
        <div style="margin-top:14px"><button type="button" class="btn ${addOpen ? '' : 'pri'}" data-action="add-open">${I.plus} Aggiungi blocco</button></div>
        ${addOpen ? `<div class="add-grid">${Object.entries(INV.blockTypes).map(([k, t]) => `<button type="button" data-action="add-block" data-t="${k}"><img src="/media/icons/icon-blk-${t.icon}.png" alt="">${t.name}</button>`).join('')}</div>` : ''}</div>`;
  }

  // ---------- TAB: AUDIO ----------
  let previewAudio = null, previewId = null;
  const trackSrc = id => id === 'custom' ? S.audio.custom : (INV.tracks.find(t => t.id === id) || {}).src;
  const seekTo = (au, t) => { if (au.readyState >= 1) au.currentTime = t; else au.addEventListener('loadedmetadata', () => { au.currentTime = t; }, { once: true }); };
  const fmtT = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  function tabAudio() {
    const a = S.audio;
    const row = (id, name, desc, icon, playable) => `<div class="track ${a.track === id ? 'on' : ''}" data-set="audio.track" data-v="${id}">
      <div class="ti">${I[icon]}</div><div class="tx"><b>${name}</b><small>${desc}${a.starts?.[id] ? ` · parte da ${fmtT(a.starts[id])}` : ''}</small></div>
      ${playable ? `<button type="button" class="btn sm" data-action="preview-track" data-id="${id}">${previewId === id ? I.pause + ' Pausa' : I.play + ' Anteprima'}</button>` : ''}
      ${a.track === id ? `<span class="ok">${I.check}</span>` : ''}</div>`;
    const sel = a.track !== 'none' && trackSrc(a.track);
    const start = a.starts?.[a.track] || 0;
    const startBox = sel ? `<div class="sec start-box" style="margin-top:18px"><h3>Da che punto parte la canzone</h3>
        <p class="hint" style="margin:-6px 0 12px">Trascina il cursore o clicca sull'onda: la senti mentre scegli. Gli ospiti la sentiranno partire da qui.</p>
        <div class="wave" id="wave"><canvas></canvas><div class="wv-sel"></div><div class="wv-start"></div><div class="wv-head"></div><div class="wv-load">Caricamento dell'onda...</div></div>
        <div class="rowx" style="margin-top:10px">
          <button type="button" class="btn pri sm" data-action="start-play" id="start-play" style="flex:none">${I.play} Ascolta da qui</button>
          <input type="range" id="start-range" min="0" max="${a.durations?.[a.track] || 300}" step="0.1" value="${start}" style="flex:1;accent-color:var(--brand)">
          <b id="start-lbl" class="start-lbl">${fmtT(start)}</b></div>
        <div class="rowx" style="margin-top:8px;gap:6px;flex-wrap:wrap">
          ${[-10, -1, 1, 10].map(d => `<button type="button" class="btn sm" data-action="start-nudge" data-d="${d}">${d > 0 ? '+' : '−'}${Math.abs(d)} s</button>`).join('')}
          <button type="button" class="btn sm" data-action="start-nudge" data-d="reset">Dall'inizio</button>
          <span class="hint" style="margin:0 0 0 auto" id="start-dur"></span></div></div>` : '';
    return `<h2>Musica di sottofondo</h2><p class="lead">Scegli la musica che parte quando gli ospiti aprono la busta. Possono disattivarla quando vogliono.</p>
      <div class="tracks">${row('none', 'Nessun audio', 'Invito silenzioso', 'mute', false)}
      ${INV.tracks.map(t => row(t.id, t.name, t.desc, 'music', true)).join('')}
      ${a.custom ? row('custom', 'La tua canzone', a.customName || 'File caricato', 'music', true) : ''}</div>
      ${startBox}
      <div class="sec" style="margin-top:18px"><h3>Musica personalizzata <span class="prem">Premium</span></h3>
        <p class="hint" style="margin-top:-6px">Carica la vostra canzone: MP3, WAV, OGG · max 20 MB</p>
        <label class="btn" style="margin-top:10px">${I.upload} Carica MP3<input type="file" accept="audio/*" data-upload-audio hidden></label></div>`;
  }

  // ---------- punto di partenza della musica: onda + ascolto live ----------
  let startAudio = null, startSrc = '', headRaf = 0, startSaveT = null;
  const peaksCache = {};
  function stopStartAudio() { startAudio?.pause(); cancelAnimationFrame(headRaf); const b = $('#start-play'); if (b) b.innerHTML = I.play + ' Ascolta da qui'; }
  function ensureStartAudio(src) {
    if (startAudio && startSrc === src) return startAudio;
    stopStartAudio(); startAudio = new Audio(src); startSrc = src; startAudio.preload = 'auto';
    return startAudio;
  }
  function setStart(t, hear) {
    const id = S.audio.track, dur = S.audio.durations?.[id] || 0;
    t = Math.max(0, Math.min(dur ? dur - 1 : t, Math.round(t * 10) / 10));
    (S.audio.starts ||= {})[id] = t;
    const r = $('#start-range'); if (r) r.value = t;
    const l = $('#start-lbl'); if (l) l.textContent = fmtT(t);
    drawMarkers();
    clearTimeout(startSaveT); startSaveT = setTimeout(() => changed(), 250);
    if (hear) { const au = ensureStartAudio(trackSrc(id)); previewAudio?.pause(); previewId = null; seekTo(au, t); au.play().catch(() => {}); animateHead(); }
  }
  function animateHead() {
    cancelAnimationFrame(headRaf);
    const b = $('#start-play'); if (b) b.innerHTML = I.pause + ' Pausa';
    const tick = () => {
      const h = $('#wave .wv-head'), dur = S.audio.durations?.[S.audio.track];
      if (h && dur && startAudio && !startAudio.paused) { h.style.left = (startAudio.currentTime / dur * 100) + '%'; h.style.display = 'block'; headRaf = requestAnimationFrame(tick); }
      else if (h) { h.style.display = 'none'; if (b && startAudio?.paused) b.innerHTML = I.play + ' Ascolta da qui'; }
    };
    tick();
  }
  function drawMarkers() {
    const w = $('#wave'), dur = S.audio.durations?.[S.audio.track];
    if (!w || !dur) return;
    const p = (S.audio.starts?.[S.audio.track] || 0) / dur * 100;
    w.querySelector('.wv-start').style.left = p + '%';
    w.querySelector('.wv-sel').style.left = p + '%';
  }
  async function initWave() {
    const w = $('#wave'); if (!w) return;
    const id = S.audio.track, src = trackSrc(id);
    const canvas = w.querySelector('canvas');
    const draw = (peaks) => {
      const dpr = window.devicePixelRatio || 1, W = w.clientWidth, H = w.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      const c = canvas.getContext('2d'); c.scale(dpr, dpr);
      const n = peaks.length, bw = W / n;
      c.fillStyle = '#c9b6a4';
      peaks.forEach((v, i) => { const h = Math.max(2, v * (H - 8)); c.fillRect(i * bw + .5, (H - h) / 2, Math.max(1, bw - 1.5), h); });
      w.querySelector('.wv-load').hidden = true;
      drawMarkers();
    };
    if (peaksCache[src]) draw(peaksCache[src]);
    else {
      try {
        const buf = await fetch(src).then(r => r.arrayBuffer());
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const ab = await ac.decodeAudioData(buf); ac.close?.();
        const data = ab.getChannelData(0), N = 180, step = Math.floor(data.length / N);
        let peaks = []; for (let i = 0; i < N; i++) { let m = 0; for (let j = i * step; j < (i + 1) * step; j += 16) m = Math.max(m, Math.abs(data[j])); peaks.push(m); }
        const mx = Math.max(...peaks) || 1; peaks = peaks.map(v => v / mx);
        peaksCache[src] = peaks;
        if (!S.audio.durations?.[id] || Math.abs(S.audio.durations[id] - ab.duration) > .5) {
          (S.audio.durations ||= {})[id] = Math.round(ab.duration * 10) / 10; changed();
          const r = $('#start-range'); if (r) r.max = S.audio.durations[id];
        }
        if ($('#wave') === w) draw(peaks);
      } catch (e) { w.querySelector('.wv-load').textContent = 'Onda non disponibile: usa il cursore'; }
    }
    const dd = $('#start-dur'); if (dd && S.audio.durations?.[id]) dd.textContent = `Durata ${fmtT(S.audio.durations[id])}`;
    const seekFromEvent = e => { const r = w.getBoundingClientRect(); setStart((e.clientX - r.left) / r.width * (S.audio.durations?.[id] || 0), true); };
    let down = false;
    w.addEventListener('pointerdown', e => { down = true; w.setPointerCapture(e.pointerId); seekFromEvent(e); });
    w.addEventListener('pointermove', e => { if (down) seekFromEvent(e); });
    w.addEventListener('pointerup', () => { down = false; });
    const range = $('#start-range');
    range?.addEventListener('input', () => setStart(+range.value, true));
  }

  // ---------- TAB: LINGUE ----------
  let langSearch = '';
  function tabLanguages() {
    const L = S.languages, ex = new Set(L.extra || []);
    const byId = id => INV.languages.find(l => l.id === id) || { id, name: id, it: id };
    const label = l => l.name === l.it ? l.name : `${l.name} <small>${l.it}</small>`;
    const sorted = [...INV.languages].sort((a, b) => a.it.localeCompare(b.it, 'it'));
    return `<h2>Lingue</h2><p class="lead">${INV.languages.length} lingue disponibili. I testi fissi dell'invito (pulsanti, conto alla rovescia, date, modulo RSVP) vengono tradotti automaticamente. Gli ospiti possono cambiare lingua in alto a destra.</p>
      <div class="sec"><h3>Lingua principale</h3>
        <select class="in" data-action="lang-main" style="max-width:360px">${sorted.map(l => `<option value="${l.id}" ${L.main === l.id ? 'selected' : ''}>${l.it}${l.name !== l.it ? ` · ${l.name}` : ''}</option>`).join('')}</select>
        <p class="hint">È la lingua con cui si apre l'invito.</p></div>
      <div class="sec"><h3>Lingue aggiuntive</h3>
        <div class="lang-chips">${[...ex].filter(id => id !== L.main).map(id => `<span class="lchip">${byId(id).name}<button type="button" data-action="lang-rm" data-l="${id}" title="Togli">✕</button></span>`).join('') || '<span class="hint" style="margin:0">Nessuna lingua aggiuntiva: l\'invito sarà solo in ' + byId(L.main).it.toLowerCase() + '.</span>'}</div>
        <input class="in" id="lang-search" placeholder="Cerca una lingua (es. arabo, 日本語, portoghese)..." value="${esc(langSearch)}" style="margin:12px 0 8px">
        <div class="lang-list" id="lang-list">${sorted.filter(l => l.id !== L.main).map(l => `<label class="lang-it" data-q="${esc((l.it + ' ' + l.name + ' ' + l.id).toLowerCase())}">
          <input type="checkbox" data-action="lang-extra" data-l="${l.id}" ${ex.has(l.id) ? 'checked' : ''}><span>${label(l)}</span>${INV.rtl.includes(l.id) ? '<em>da destra a sinistra</em>' : ''}</label>`).join('')}</div>
        <p class="hint">I testi che scrivete voi (titoli, descrizioni) restano come li avete scritti. Con più di 4 lingue gli ospiti le scelgono da un menu.</p></div>`;
  }

  // ---------- TAB: RSVP ----------
  function tabRsvp() {
    const r = S.rsvp;
    const qs = (r.custom || []).map((q, i) => `<div class="rep"><div class="rep-h"><span>Domanda ${i + 1}</span><span>
        ${i > 0 ? `<button type="button" class="ibtn" data-action="mv-item" data-p="rsvp.custom" data-i="${i}" data-d="-1">↑</button>` : ''}
        <button type="button" class="ibtn del" data-action="rm-item" data-p="rsvp.custom" data-i="${i}">${I.trash}</button></span></div>
      ${inp(`rsvp.custom.${i}.label`, 'Testo della domanda')}
      <div class="row2" style="margin-top:8px"><select class="in" data-k="rsvp.custom.${i}.type">
        <option value="choice" ${q.type === 'choice' ? 'selected' : ''}>Scelta multipla</option><option value="text" ${q.type === 'text' ? 'selected' : ''}>Risposta breve</option><option value="yesno" ${q.type === 'yesno' ? 'selected' : ''}>Sì / No</option></select>
        <div class="pill-t">Obbligatoria ${sw(`rsvp.custom.${i}.required`, q.required)}</div></div>
      ${q.type === 'choice' ? `<label class="l">Opzioni</label>${(q.options || []).map((o, j) => `<div class="rowx" style="margin-bottom:6px"><span style="color:var(--mute)">○</span>${inp(`rsvp.custom.${i}.options.${j}`)}<button type="button" class="ibtn del" data-action="rm-item" data-p="rsvp.custom.${i}.options" data-i="${j}">${I.trash}</button></div>`).join('')}
        <button type="button" class="btn sm" data-action="add-item" data-p="rsvp.custom.${i}.options" data-tpl='""'>${I.plus} Opzione</button>` : ''}</div>`).join('');
    return `<h2>Domande RSVP</h2><p class="lead">Scegli quali domande vedranno gli ospiti nel modulo di conferma.</p>
      <div class="box"><div class="tog"><div class="ic">${I.users}</div><div class="tx"><b>Modulo RSVP attivo</b><small>Mostra il modulo di conferma in fondo all'invito</small></div>${sw('rsvp.enabled', r.enabled)}</div>
        <label class="l">Titolo del modulo</label>${inp('rsvp.title')}
        ${iconPicker('rsvp.icon', 'rsvp', S.rsvp.icon)}</div>
      <div class="box"><h3 class="serif" style="margin:0 0 4px;font-size:16px">Domande standard</h3>
        <div class="box soft" style="margin:10px 0 4px;font-size:12px"><b>Numero di ospiti</b><br><span style="color:var(--mute)">Si gestisce per ogni ospite nella scheda Ospiti: imposta "Posti" maggiore di 1 per permettere accompagnatori. Il modulo chiederà il numero solo a chi ne ha diritto.</span></div>
        ${tog('msg', 'Messaggio personale', 'Gli ospiti possono lasciarvi un messaggio', 'rsvp.message')}
        ${tog('music', 'Richiesta canzone', 'Gli ospiti suggeriscono canzoni per la festa', 'rsvp.song')}
        <div class="tog"><div class="ic">${I.cal}</div><div class="tx"><b>Rispondi entro il</b><small>Mostra una scadenza per confermare</small></div><input class="in" style="width:160px" type="date" data-k="rsvp.deadline" value="${esc(r.deadline)}"></div></div>
      <div class="box"><div class="tog" style="padding-top:0"><div class="ic">${I.fork}</div><div class="tx"><b>Esigenze alimentari</b><small>Scegli quali opzioni mostrare</small></div>${sw('rsvp.dietary', r.dietary)}</div>
        ${r.dietary ? `<div class="grid2" style="margin-top:6px">${INV.diets.map(d => `<div class="pill-t">${d.it}${sw(`rsvp.diets.${d.id}`, r.diets[d.id])}</div>`).join('')}</div>
        <div class="tog" style="margin-top:8px"><div class="tx"><b>Altre allergie</b><small>Campo libero per altre esigenze</small></div>${sw('rsvp.otherAllergies', r.otherAllergies)}</div>` : ''}</div>
      <div class="box"><h3 class="serif" style="margin:0 0 4px;font-size:16px">${I.plus.replace('<svg', '<svg width="14" height="14"')} Domande personalizzate</h3><p class="hint" style="margin:0 0 6px">Aggiungi le tue domande al modulo RSVP</p>
        ${qs}<button type="button" class="btn sm" data-action="add-item" data-p="rsvp.custom" data-tpl='${esc(JSON.stringify({ label: '', required: false, type: 'choice', options: ['', ''] }))}'>${I.plus} Aggiungi domanda</button></div>`;
  }

  // ---------- TAB: OSPITI ----------
  function waLink(g, text) {
    const num = (g.phone_cc + g.phone).replace(/\D/g, '');
    const msg = text.replace(/\{nome\}/g, g.name.split(' ')[0]).replace(/\{link\}/g, inviteUrl(g.token)).replace(/\{scadenza\}/g, S.rsvp.deadline ? new Date(S.rsvp.deadline).toLocaleDateString('it-IT') : '');
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }
  const REMINDER = 'Ciao {nome}! Ti ricordiamo di confermare la tua presenza al nostro matrimonio entro il {scadenza}. Basta un minuto: {link}';
  const dietLabel = id => (INV.diets.find(d => d.id === id) || {}).it || id;

  function tabGuests() {
    if (!guestsData) { loadGuests(); return `<h2>Ospiti e RSVP</h2><p class="lead">Caricamento...</p>`; }
    const st = guestsData.stats;
    let gs = guestsData.guests;
    if (gFilter !== 'all') gs = gs.filter(g => g.status === gFilter);
    if (gSearch) gs = gs.filter(g => (g.name + g.email + g.phone).toLowerCase().includes(gSearch.toLowerCase()));
    const pend = guestsData.guests.filter(g => g.status === 'pending' && g.phone).length;
    const eg = editGuest || { name: '', email: '', phone_cc: '+39', phone: '', total_guests: 1 };
    const custom = S.rsvp.custom || [];
    const guestItem = g => {
      const a = g.answers || {};
      const lbl = { pending: 'In attesa', attending: 'Partecipa', declined: 'Non partecipa' }[g.status];
      const ans = g.status !== 'pending' && (a.party?.length || a.message || a.song || Object.values(a.custom || {}).some(Boolean)) ? `<div class="g-ans">
        ${(a.party || []).map(p => `<div><b>${esc(p.name)}</b>: ${[...(p.diets || []).map(dietLabel), p.other].filter(Boolean).map(esc).join(', ') || 'nessuna allergia'}</div>`).join('')}
        ${custom.filter(q => a.custom?.[q.id]).map(q => `<div>${esc(q.label)}: <b>${esc(a.custom[q.id])}</b></div>`).join('')}
        ${a.song ? `<div>Canzone: <b>${esc(a.song)}</b></div>` : ''}${a.message ? `<div>Messaggio: <i>"${esc(a.message)}"</i></div>` : ''}</div>` : '';
      return `<div class="g-it"><div class="g-top"><span style="color:${g.status === 'attending' ? 'var(--ok)' : g.status === 'declined' ? 'var(--bad)' : 'var(--warn)'}">${g.status === 'attending' ? '✓' : g.status === 'declined' ? '✕' : '◷'}</span>
        <b>${esc(g.name)}</b><span class="badge ${g.status}">${lbl}</span>${g.total_guests > 1 ? `<span class="badge gray">${g.total_guests} posti</span>` : ''}${g.in_list ? '' : '<span class="badge gray">Non in lista</span>'}
        <span class="act">${g.phone ? `<a class="ibtn wa" href="${waLink(g, S.whatsapp)}" target="_blank" rel="noopener" title="Invia su WhatsApp">${I.wa}</a>` : ''}
          <button type="button" class="ibtn" data-action="copy-guest-link" data-t="${g.token}" title="Copia link personale">${I.link}</button>
          <button type="button" class="ibtn" data-action="edit-guest" data-id="${g.id}" title="Modifica">${I.edit}</button>
          <button type="button" class="ibtn del" data-action="del-guest" data-id="${g.id}" title="Elimina">${I.trash}</button></span></div>
        <div class="g-meta">${g.email ? `<span>${I.mail} ${esc(g.email)}</span>` : ''}${g.phone ? `<span>${I.phone} ${esc(g.phone_cc)} ${esc(g.phone)}</span>` : ''}${g.responded_at ? `<span>Risposto il ${new Date(g.responded_at.replace(' ', 'T')).toLocaleDateString('it-IT')}</span>` : ''}</div>${ans}</div>`;
    };
    return `<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px"><div><h2>Ospiti e RSVP</h2>
        <p class="lead" style="margin-bottom:16px">Aggiungi gli ospiti per seguire le risposte. Le conferme vengono abbinate automaticamente tramite email o telefono.</p></div>
        <a class="btn" href="/api?a=guests.csv&invite_id=${ID}">${I.down} Esporta CSV</a></div>
      <div class="stats"><div class="stat p"><b>${st.pending}</b><small>In attesa</small></div><div class="stat a"><b>${st.attending}</b><small>Partecipano${st.people ? ` · ${st.people} pers.` : ''}</small></div><div class="stat d"><b>${st.declined}</b><small>Non partecipano</small></div></div>
      <div class="cta-box g" style="flex-wrap:wrap"><div class="ci">${I.send}</div><div class="tx"><b>Invia con WhatsApp</b><small>Clicca l'icona WhatsApp accanto a ogni ospite per inviargli il suo invito personale</small></div>
        <button type="button" class="btn ok sm" data-action="custom-msg">Personalizza messaggio</button>
        ${showCustomMsg ? `<div style="width:100%"><textarea class="in" data-k="whatsapp" style="margin-top:10px">${esc(S.whatsapp)}</textarea><p class="hint">Usa {nome} per il nome dell'ospite e {link} per il suo link personale.</p></div>` : ''}
        <div class="tip" style="width:100%;margin-bottom:0"><b>Consiglio:</b> apri prima web.whatsapp.com in un'altra scheda del browser, poi clicca il pulsante di invio accanto a ogni ospite.</div></div>
      <div class="cta-box y"><div class="ci">${I.bell}</div><div class="tx"><b>Invia promemoria</b><small>${pend} ospiti in attesa con telefono</small></div><button type="button" class="btn warn sm" data-action="reminders" ${pend ? '' : 'disabled'}>${I.bell} Invia promemoria</button></div>
      <div class="box soft" id="guest-form"><b style="display:flex;align-items:center;gap:8px;font-size:14px">${I.userPlus.replace('<svg', '<svg width="16" height="16"')} ${editGuest ? 'Modifica ospite' : 'Aggiungi ospite'}</b>
        <p class="hint" style="margin:2px 0 10px">Serve email o telefono per abbinare la risposta RSVP</p>
        <div class="row2"><input class="in" id="g-name" placeholder="Nome ospite *" value="${esc(eg.name)}"><input class="in" id="g-email" type="email" placeholder="Email" value="${esc(eg.email)}"></div>
        <div class="rowx" style="margin-top:8px"><select class="in" id="g-cc" style="flex:0 0 90px">${INV.countryCodes.map(c => `<option ${c === eg.phone_cc ? 'selected' : ''}>${c}</option>`).join('')}</select><input class="in" id="g-phone" type="tel" placeholder="Telefono" value="${esc(eg.phone)}"></div>
        <div class="rowx" style="margin-top:8px"><span style="font-size:13px;flex:none">Posti totali:</span><select class="in" id="g-total" style="flex:0 0 80px">${Array.from({ length: 10 }, (_, i) => `<option ${i + 1 === +eg.total_guests ? 'selected' : ''}>${i + 1}</option>`).join('')}</select>
          ${editGuest ? `<select class="in" id="g-status" style="flex:0 0 160px">${[['pending', 'In attesa'], ['attending', 'Partecipa'], ['declined', 'Non partecipa']].map(([v, l]) => `<option value="${v}" ${eg.status === v ? 'selected' : ''}>${l}</option>`).join('')}</select>` : ''}</div>
        <p class="hint">* Nome + (email o telefono) obbligatori</p>
        <div style="display:flex;gap:8px;margin-top:10px"><button type="button" class="btn pri" data-action="save-guest">${I.plus} ${editGuest ? 'Salva modifiche' : 'Aggiungi ospite'}</button>${editGuest ? '<button type="button" class="btn" data-action="cancel-guest">Annulla</button>' : ''}</div></div>
      <div class="filters">${[['all', 'Tutti'], ['pending', 'In attesa'], ['attending', 'Partecipano'], ['declined', 'Non partecipano']].map(([k, l]) => `<button type="button" data-action="g-filter" data-f="${k}" class="${gFilter === k ? 'on' : ''}">${l}</button>`).join('')}
        <input class="in" id="g-search" placeholder="Cerca ospite..." value="${esc(gSearch)}"></div>
      <p class="hint">Mostrati ${gs.length} di ${guestsData.guests.length} ospiti</p>
      <div class="g-list">${gs.map(guestItem).join('') || '<p class="hint">Nessun ospite</p>'}</div>`;
  }
  async function loadGuests() { guestsData = await api('guests.list', null, `&invite_id=${ID}`); if (tab === 'guests') render(); }

  // ---------- TAB: LINK PERSONALIZZATO ----------
  function tabUrl() {
    return `<h2>Link personalizzato</h2><p class="lead">Scegli l'indirizzo del vostro invito. Ogni ospite riceve anche un link personale (scheda Ospiti) che precompila il suo RSVP.</p>
      <label class="l">Il vostro link</label><div class="rowx"><span style="color:var(--mute);font-size:13px;flex:none">${location.host}/i/</span><input class="in" id="slug-in" value="${esc(SLUG)}"><button type="button" class="btn pri" data-action="save-slug">Salva</button></div>
      <p class="hint" id="slug-msg">Solo lettere minuscole, numeri e trattini. Es. giulia-e-marco-2027</p>
      <div class="box soft" style="margin-top:18px"><b style="font-size:13px">Link attuale</b><div class="rowx" style="margin-top:8px"><input class="in" readonly value="${esc(inviteUrl())}">
        <button type="button" class="btn" data-action="copy-link">${I.copy} Copia</button><a class="btn" href="${esc(inviteUrl())}" target="_blank" rel="noopener">${I.ext} Apri</a></div></div>`;
  }

  const TABS = [
    ['theme', 'Tema', tabTheme, I.theme], ['envelope', 'Busta', tabEnvelope], ['details', 'Dettagli', tabDetails], ['blocks', () => `Blocchi (${S.blocks.length})`, tabBlocks],
    ['audio', 'Audio', tabAudio], ['languages', 'Lingue', tabLanguages, I.globe], ['rsvp', 'RSVP', tabRsvp, I.help],
    ['guests', () => `Ospiti${guestsData ? ` (${guestsData.guests.length})` : ''}`, tabGuests], ['url', 'Link personalizzato', tabUrl, I.link],
    ['album', 'Album foto', () => AlbumPanel.html(), I.camera],
    ['tools', 'Pianificazione', () => Planner.html(), I.tools],
  ];

  function render() {
    const fonts = [...INV.fonts, 'Pinyon Script'];
    INV.loadFonts(fonts);
    // in Pianificazione niente anteprima: il pannello usa tutta la larghezza
    document.body.classList.toggle('wide', tab === 'tools' || tab === 'album');
    $('#tabs').innerHTML = TABS.map(([k, l, , ic]) => `<button type="button" data-tab="${k}" class="${tab === k ? 'on' : ''}">${ic || ''}${typeof l === 'function' ? l() : l}</button>`).join('');
    const y = window.scrollY;
    const fx = document.activeElement?.dataset?.k;
    panel.innerHTML = TABS.find(t => t[0] === tab)[2]();
    window.scrollTo(0, y);
    if (fx) { const el = panel.querySelector(`[data-k="${CSS.escape(fx)}"]`); if (el && el.type !== 'checkbox') { el.focus(); if (el.setSelectionRange && el.type === 'text') el.setSelectionRange(el.value.length, el.value.length); } }
    bindDrag();
    if (tab === 'tools') Planner.bind(panel);
    if (tab === 'album') AlbumPanel.bind();
    if (tab === 'audio') initWave(); else stopStartAudio();
    if (tab === 'languages' && langSearch) { const q = langSearch.toLowerCase().trim(); panel.querySelectorAll('.lang-it').forEach(x => x.hidden = !x.dataset.q.includes(q)); }
    panel.querySelectorAll('[data-focus]').forEach(bindFocus);
    panel.querySelectorAll('.theme').forEach(c => {
      const v = c.querySelector('video');
      if (!v) return;
      c.addEventListener('mouseenter', () => v.play().catch(() => {}));
      c.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
    });
  }

  // ---------- posizione della foto (trascina per inquadrare) ----------
  function bindFocus(box) {
    const base = box.dataset.focus, img = box.querySelector('.fc-img');
    let start = null;
    const apply = () => { const d = get(base); img.style.backgroundPosition = `${d.posX}% ${d.posY}%`; img.style.transformOrigin = `${d.posX}% ${d.posY}%`; };
    box.addEventListener('pointerdown', e => { const d = get(base); start = { x: e.clientX, y: e.clientY, px: d.posX ?? 50, py: d.posY ?? 50 }; box.setPointerCapture(e.pointerId); box.classList.add('dragging'); });
    box.addEventListener('pointermove', e => {
      if (!start) return;
      const r = box.getBoundingClientRect(), d = get(base), k = 100 / ((d.zoom ?? 100) / 100);
      d.posX = Math.round(Math.max(0, Math.min(100, start.px - (e.clientX - start.x) / r.width * k)));
      d.posY = Math.round(Math.max(0, Math.min(100, start.py - (e.clientY - start.y) / r.height * k)));
      apply(); changed();
    });
    const end = () => { start = null; box.classList.remove('dragging'); };
    box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
  }

  // ---------- trascinamento blocchi ----------
  function bindDrag() {
    let from = null;
    panel.querySelectorAll('.blk-i').forEach(el => {
      el.draggable = false;
      el.querySelector('.grip').addEventListener('mousedown', () => { el.draggable = true; });
      el.addEventListener('mouseup', () => { el.draggable = false; });
      el.addEventListener('dragstart', e => { from = +el.dataset.bi; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
      el.addEventListener('dragend', () => { el.classList.remove('dragging'); el.draggable = false; });
      el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('over'); });
      el.addEventListener('dragleave', () => el.classList.remove('over'));
      el.addEventListener('drop', e => {
        e.preventDefault(); el.classList.remove('over');
        const to = +el.dataset.bi; if (from === null || from === to) return;
        const [m] = S.blocks.splice(from, 1); S.blocks.splice(to, 0, m); changed(true);
        post({ view: m.id });
      });
    });
  }

  // ---------- eventi ----------
  function parseVal(el) {
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'range' || el.type === 'number') return +el.value;
    return el.value;
  }
  panel.addEventListener('input', e => {
    const el = e.target;
    if (el.id === 'lang-search') { langSearch = el.value; const q = langSearch.toLowerCase().trim(); panel.querySelectorAll('.lang-it').forEach(x => x.hidden = q && !x.dataset.q.includes(q)); return; }
    if (el.id === 'g-search') { gSearch = el.value; render(); const s = $('#g-search'); s.focus(); s.setSelectionRange(s.value.length, s.value.length); return; }
    if (tab === 'tools' && Planner.onInput(el)) return;
    if (el.dataset.action === 'seal-color') { S.envelope.seal = 'custom'; S.envelope.sealColor = el.value; changed(); post({ data: S, view: 'envelope' }); return; }
    if (el.dataset.hex) {
      let v = el.value.trim(); if (v && v[0] !== '#') v = '#' + v;
      if (isHex(v)) { set(el.dataset.hex, v.toLowerCase()); changed(); if (el.dataset.hex.startsWith('envelope')) post({ data: S, view: 'envelope' }); }
      return;
    }
    const k = el.dataset.k; if (!k) return;
    set(k, parseVal(el));
    if (k.startsWith('album.card')) AlbumPanel.redrawCard();
    if (el.type === 'range' && k.endsWith('.zoom')) { const img = el.closest('.focus-wrap')?.querySelector('.fc-img'); if (img) img.style.transform = `scale(${el.value / 100})`; }
    if (el.type === 'range') el.nextElementSibling.textContent = el.value + (el.nextElementSibling.textContent.endsWith('%') ? '%' : 'px');
    const structural = el.type === 'checkbox' || el.tagName === 'SELECT' || k === 'envelope.initials';
    changed(structural);
    if (k.startsWith('envelope')) post({ data: S, view: 'envelope' });
  });

  panel.addEventListener('change', async e => {
    const el = e.target;
    if (tab === 'tools' && Planner.onChange(el)) return;
    if (el.type === 'color' || el.dataset.hex) { render(); return; }   // tavolozza chiusa: aggiorna selezione e anteprime
    if (el.dataset.action === 'lang-main') {
      S.languages.main = el.value; S.languages.extra = (S.languages.extra || []).filter(l => l !== el.value); changed(true); return;
    }
    if (el.dataset.action === 'lang-extra') {
      const ex = new Set(S.languages.extra || []); el.checked ? ex.add(el.dataset.l) : ex.delete(el.dataset.l);
      S.languages.extra = [...ex]; changed(true); return;
    }
    const files = el.files; if (!files?.length) return;
    const up = async f => { const fd = new FormData(); fd.append('file', f); const r = await api('upload', fd); if (r.error) toast(r.error); return r.url; };
    if (el.dataset.upload) { toast('Caricamento...'); const u = await up(files[0]); if (u) {
      set(el.dataset.upload, u);
      // prima foto nel conto alla rovescia: parte già oscurata per leggere bene i numeri
      const m = el.dataset.upload.match(/^blocks\.(\d+)\.data\.image$/);
      if (m && S.blocks[m[1]].type === 'countdown' && S.blocks[m[1]].data.darken === undefined) Object.assign(S.blocks[m[1]].data, { darken: true, darkness: 45 });
      changed(true); } }
    if (el.dataset.uploadAdd) { toast('Caricamento...'); for (const f of files) { const u = await up(f); if (u) get(el.dataset.uploadAdd).push(u); } changed(true); }
    if (el.dataset.uploadAudio !== undefined) {
      toast('Caricamento...');
      const fd = new FormData(); fd.append('file', files[0]); const r = await api('upload', fd);
      if (r.error) { toast(r.error); return; }
      S.audio.custom = r.url; S.audio.customName = files[0].name.replace(/\.[^.]+$/, ''); S.audio.track = 'custom';
      (S.audio.starts ||= {}).custom = 0; if (S.audio.durations) delete S.audio.durations.custom;
      changed(true); toast('Canzone caricata: scegli da che punto parte');
    }
  });

  document.addEventListener('click', async e => {
    const tb = e.target.closest('[data-tab]');
    if (tb) { tab = tb.dataset.tab; render(); post({ view: viewFor() }); if (tab === 'guests') loadGuests(); return; }
    if (tab === 'tools' && panel.contains(e.target) && Planner.onClick(e)) return;
    if (tab === 'album' && panel.contains(e.target) && e.target.closest('[data-al]')) { AlbumPanel.onClick(e); return; }
    const st = e.target.closest('[data-set]');
    if (st && !e.target.closest('[data-action]')) {
      set(st.dataset.set, st.dataset.v); changed(true);
      if (st.dataset.set.startsWith('envelope')) post({ data: S, view: 'envelope' });
      if (st.dataset.set === 'theme') post({ replay: true });
      return;
    }
    const ac = e.target.closest('[data-action]'); if (!ac) return;
    const A = ac.dataset.action, i = +ac.dataset.i;
    switch (A) {
      case 'toggle-block': if (e.target.closest('.ibtn')) return; { const id = ac.dataset.id; openBlock = openBlock === id ? null : id; render(); if (openBlock) post({ view: openBlock }); } break;
      case 'vis-block': S.blocks[i].visible = !S.blocks[i].visible; changed(true); break;
      case 'del-block': if (confirm('Eliminare questo blocco?')) { S.blocks.splice(i, 1); changed(true); } break;
      case 'add-open': addOpen = !addOpen; render(); break;
      case 'add-block': { const t = ac.dataset.t; const b = { id: Math.random().toString(36).slice(2, 10), type: t, visible: true, accent: '', data: INV.blockTypes[t].def() };
        S.blocks.push(b); openBlock = b.id; addOpen = false; changed(true); setTimeout(() => post({ view: b.id }), 300); } break;
      case 'add-item': get(ac.dataset.p).push(JSON.parse(ac.dataset.tpl)); changed(true); break;
      case 'rm-item': get(ac.dataset.p).splice(i, 1); changed(true); break;
      case 'mv-item': { const arr = get(ac.dataset.p); const d = +ac.dataset.d; [arr[i + d], arr[i]] = [arr[i], arr[i + d]]; changed(true); } break;
      case 'auto-maps': { const v = get(ac.dataset.p); if (!v.address) { toast('Inserisci prima l\'indirizzo'); break; } v.maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(v.address); changed(true); } break;
      case 'show-envelope': post({ data: S, view: 'envelope' }); break;
      case 'env-tpl': S.envelope.mode = 'template'; S.envelope.template = ac.dataset.id; changed(true); post({ data: S, view: 'envelope' }); break;
      case 'env-custom': S.envelope.mode = 'custom'; changed(true); post({ data: S, view: 'envelope' }); break;
      case 'preview-track': {
        e.stopPropagation(); const id = ac.dataset.id;
        if (previewId === id) { previewAudio.pause(); previewId = null; }
        else { previewAudio?.pause(); stopStartAudio(); previewAudio = new Audio(trackSrc(id)); seekTo(previewAudio, S.audio.starts?.[id] || 0); previewAudio.play(); previewId = id; previewAudio.onended = () => { previewId = null; render(); }; }
        render(); } break;
      case 'start-play': {
        if (startAudio && !startAudio.paused) { stopStartAudio(); break; }
        setStart(S.audio.starts?.[S.audio.track] || 0, true); } break;
      case 'start-nudge': {
        const cur = S.audio.starts?.[S.audio.track] || 0;
        setStart(ac.dataset.d === 'reset' ? 0 : cur + +ac.dataset.d, true); } break;
      case 'focus-reset': Object.assign(get(ac.dataset.p), { posX: 50, posY: 50, zoom: 100 }); changed(true); break;
      case 'lang-rm': S.languages.extra = (S.languages.extra || []).filter(l => l !== ac.dataset.l); changed(true); break;
      case 'icons-all': { const v = +ac.dataset.v; S.blocks.forEach(b => b.icon = v); S.rsvp.icon = v; changed(true); toast(v ? 'Icone a linea applicate a tutti i blocchi' : 'Icone classiche 3D ripristinate'); } break;
      case 'custom-msg': showCustomMsg = !showCustomMsg; render(); break;
      case 'reminders': {
        const list = guestsData.guests.filter(g => g.status === 'pending' && g.phone);
        const m = document.createElement('div'); m.className = 'modal';
        m.innerHTML = `<div class="mc"><h3 class="serif">Invia promemoria</h3><p class="hint" style="margin-bottom:12px">Clicca su ogni ospite per aprire WhatsApp con il promemoria già scritto.</p>
          <textarea class="in" id="rem-txt">${esc(S.reminder || REMINDER)}</textarea><p class="hint">{nome}, {scadenza} e {link} vengono sostituiti automaticamente.</p>
          <div class="g-list" id="rem-list"></div><div style="text-align:right;margin-top:14px"><button class="btn" data-close>Chiudi</button></div></div>`;
        document.body.appendChild(m);
        const draw = () => { m.querySelector('#rem-list').innerHTML = list.map(g => `<div class="g-it g-top"><b>${esc(g.name)}</b><span class="badge pending">In attesa</span><span class="act"><a class="btn ok sm" target="_blank" rel="noopener" href="${waLink(g, S.reminder || REMINDER)}">${I.wa.replace('<svg', '<svg width="14" height="14"')} Invia</a></span></div>`).join(''); };
        draw();
        m.querySelector('#rem-txt').addEventListener('input', ev => { S.reminder = ev.target.value; draw(); changed(); });
        m.addEventListener('click', ev => { if (ev.target === m || ev.target.hasAttribute('data-close')) m.remove(); });
      } break;
      case 'save-guest': {
        const g = { id: editGuest?.id, name: $('#g-name').value, email: $('#g-email').value, phone_cc: $('#g-cc').value, phone: $('#g-phone').value, total_guests: +$('#g-total').value, status: $('#g-status')?.value };
        const r = await api('guests.save', { invite_id: ID, guest: g });
        if (r.error) { toast(r.error); break; }
        guestsData = r; editGuest = null; render(); toast('Ospite salvato');
      } break;
      case 'edit-guest': editGuest = guestsData.guests.find(g => g.id === +ac.dataset.id); render(); $('#guest-form').scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
      case 'cancel-guest': editGuest = null; render(); break;
      case 'del-guest': if (confirm('Eliminare questo ospite?')) { guestsData = await api('guests.delete', { invite_id: ID, id: +ac.dataset.id }); render(); } break;
      case 'g-filter': gFilter = ac.dataset.f; render(); break;
      case 'copy-guest-link': navigator.clipboard.writeText(inviteUrl(ac.dataset.t)); toast('Link personale copiato'); break;
      case 'copy-link': navigator.clipboard.writeText(inviteUrl()); toast('Link copiato'); break;
      case 'save-slug': {
        const r = await api('invite.slug', { id: ID, slug: $('#slug-in').value });
        if (r.error) { $('#slug-msg').textContent = r.error; $('#slug-msg').style.color = 'var(--bad)'; break; }
        SLUG = r.slug; document.querySelectorAll('a[href^="/i/"]').forEach(a => a.href = `/i/${SLUG}`); frameReady = false; frame.src = `/i/${SLUG}?preview=1`; render(); toast('Link aggiornato');
      } break;
      case 'pv-refresh': post({ replay: true, view: 'intro' }); break;
      case 'pv-full': {
        const m = document.createElement('div'); m.className = 'pv-full';
        m.innerHTML = `<button class="x" type="button">✕</button><div class="phone"><iframe id="pv-full-frame" src="/i/${SLUG}"></iframe></div>`;
        document.body.appendChild(m); m.querySelector('.x').onclick = () => m.remove();
      } break;
      case 'pv-copy': navigator.clipboard.writeText(inviteUrl()); toast('Link copiato'); break;
      case 'pv-mobile': $('.pv').classList.toggle('show'); break;
    }
  });

  // salva prima di uscire
  window.addEventListener('beforeunload', () => { if (saveT) navigator.sendBeacon?.('/api?a=invite.save', JSON.stringify({ id: ID, data: S })); });

  AlbumPanel.init({ api, toast, inviteId: ID, icons: I, S: () => S, rerender: () => render(), field, save: () => changed() });
  Planner.init({
    api, toast, render: () => render(), inviteId: ID, icons: I,
    guests: () => guestsData?.guests || [],
    title: () => (S.details.headline || '').replace(/\s+/g, ' ').trim(),
    setSaving(busy, err) { $('#save-state').classList.toggle('busy', busy || !!err); $('#save-state span').textContent = err ? 'Errore di salvataggio' : busy ? 'Salvataggio...' : 'Salvato'; },
  }).then(() => { if (tab === 'tools') render(); });
  render();
  loadGuests();
  if (window.__migrated) changed();
})();
