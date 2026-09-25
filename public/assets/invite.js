// Motore di rendering dell'invito: usato sia dalla pagina pubblica sia dall'anteprima live del pannello
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const ICON_SND_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  const ICON_SND_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  const ICON_PIN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
  const ICON_PLANE = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>';

  let S = null;          // stato corrente (dati invito)
  let opts = {};         // { slug, preview, token }
  let lang = 'it';
  let audio = null, soundOn = false, cdTimer = null, guest = null;

  const T = k => (INV.i18n[lang] || INV.i18n.en)[k] || INV.i18n.en[k] || INV.i18n.it[k] || k;
  const dietName = id => lang === 'it' ? (INV.diets.find(d => d.id === id) || {}).it : ((INV.dietNames[lang] || {})[id] || INV.dietNames.en[id]);

  function fmtDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    try { return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d)); }
    catch (e) { const mn = (INV.months[lang] || INV.months.en)[m - 1]; return `${d} ${mn} ${y}`; }
  }
  function dateText() {
    const d = S.details;
    if (!d.date) return '';
    if (d.endDate && d.endDate !== d.date) {
      const [y1, m1] = d.date.split('-'), [y2, m2] = d.endDate.split('-');
      if (y1 === y2 && m1 === m2) return `${+d.date.split('-')[2]} – ${fmtDate(d.endDate)}`;
      return `${fmtDate(d.date)} – ${fmtDate(d.endDate)}`;
    }
    return fmtDate(d.date);
  }
  const isLight = hex => { const h = (hex || '#000').replace('#', ''); const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16); return ((n >> 16) * .299 + (n >> 8 & 255) * .587 + (n & 255) * .114) > 150; };
  const mapsUrl = v => v.maps || (v.address ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(v.address) : '');

  // ---------- BUSTA ----------
  function envelopeHTML() {
    const e = S.envelope;
    const tpl = e.mode === 'template' && INV.envelopeTemplates.find(t => t.id === e.template);
    if (tpl) {
      return `<div class="env-full" id="envelope" data-full="1"><video src="${tpl.video}" poster="${tpl.poster}" muted playsinline preload="auto"></video>
        <div class="env-full-hint"><span>${esc(T('tap'))}</span><i></i></div></div>`;
    }
    const col = /^#[0-9a-f]{6}$/i.test(e.color || '') ? e.color : (INV.envelopeColors.find(c => c.id === e.color) || INV.envelopeColors[1]).hex;
    const seal = INV.sealStyle(e);
    // busta personalizzata fotografica: stesso stile delle buste pronte, colore e sigillo a scelta
    const ce = INV.customEnv(e.style);
    if (ce) {
      return `<div class="env-full env-custom" id="envelope" data-full="1" data-tipx="${ce.tipX}" data-tipy="${ce.tipY}" style="--env:${col}">
        <video src="${ce.video}" poster="${ce.poster}" muted playsinline preload="auto"></video><div class="env-tint"></div>
        <div class="seal ${seal.tint ? 'tint' : ''}" style="background-image:url('${seal.img}');--sealink:${seal.ink};--sealc:${seal.tint || 'transparent'};--sealimg:url('${seal.img}')"><span>${esc(e.initials)}</span></div>
        <div class="env-full-hint"><span>${esc(T('tap'))}</span><i></i></div></div>`;
    }
    const theme = INV.themes.find(t => t.id === S.theme) || INV.themes[0];
    const emboss = `url('${(INV.flowers.find(f => f.id === 'classico')).img}')`;
    return `<div class="env-hint">${esc(T('tap'))}</div>
      <div class="envelope ${e.style === 'floreale' ? 'floral' : ''}" style="--env:${col};--emboss:${emboss}" id="envelope">
        <div class="body"></div>
        <div class="card" style="background-image:url('${theme.poster}')"></div>
        <div class="pocket"></div>
        <div class="flap"></div>
        <div class="seal ${seal.tint ? 'tint' : ''}" style="background-image:url('${seal.img}');--sealink:${seal.ink};--sealc:${seal.tint || 'transparent'};--sealimg:url('${seal.img}')"><span>${esc(e.initials)}</span></div>
      </div>`;
  }

  // ---------- INTRO ----------
  function introTextHTML() {
    const d = S.details;
    const hl = `<div class="hl" style="font-size:${d.headlineSize}px">${(d.headline || '').split('\n').map(l => `<div>${esc(l)}</div>`).join('')}</div>`;
    const dt = d.date ? `<div class="date" style="font-size:${d.dateSize}px">${esc(dateText())}</div>` : '';
    return d.datePos === 'above' ? dt + hl : hl + dt;
  }

  // ---------- BLOCCHI ----------
  const blockRender = {
    countdown: b => `<h2>${esc(b.data.title)}</h2><p class="sub">${esc(b.data.subtitle)}</p>
      <div class="cd" data-cd><div><b data-u="d">0</b><small>${T('days')}</small></div><div><b data-u="h">0</b><small>${T('hours')}</small></div><div><b data-u="m">0</b><small>${T('minutes')}</small></div><div><b data-u="s">0</b><small>${T('seconds')}</small></div></div>`,
    venue: b => {
      const days = b.data.days || [];
      const tabs = days.length > 1 ? `<div class="day-tabs">${days.map((d, i) => `<button type="button" data-day="${i}" class="${i ? '' : 'on'}">${esc(d.label || T('day') + ' ' + (i + 1))}</button>`).join('')}</div>` : '';
      return `<h2>${esc(b.data.title)}</h2>${tabs}` + days.map((v, i) => `<div class="card-w" data-dayp="${i}" ${i ? 'hidden' : ''}>
        ${v.image ? `<img class="venue-img" src="${esc(v.image)}" alt="">` : ''}
        ${v.address ? `<iframe class="map" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(v.address)}&z=14&output=embed"></iframe>` : ''}
        <div class="pad">${days.length === 1 && v.label ? `<div class="caps" style="opacity:.6">${esc(v.label)}</div>` : ''}
        <p style="font-size:22px;margin:6px 0 4px"><b style="font-weight:600">${esc(v.name)}</b></p><div class="caps" style="opacity:.75;line-height:1.6">${esc(v.address)}</div>
        ${mapsUrl(v) ? `<a class="btn-soft" href="${esc(mapsUrl(v))}" target="_blank" rel="noopener">${ICON_PIN}${T('openMaps')}</a>` : ''}</div></div>`).join('');
    },
    destination: b => `<h2>${esc(b.data.title)}</h2><p class="sub">${esc(b.data.place)}</p>${b.data.image ? `<img src="${esc(b.data.image)}" style="border-radius:10px;margin:0 auto 16px;max-height:300px;object-fit:cover;width:100%" alt="">` : ''}<p>${esc(b.data.text)}</p>${b.data.tips ? `<p style="font-size:16px;opacity:.75">${esc(b.data.tips)}</p>` : ''}`,
    drawing: b => b.data.image ? `<div class="draw"><img src="${esc(b.data.image)}" alt="">${b.data.caption ? `<p style="margin-top:12px">${esc(b.data.caption)}</p>` : ''}</div>` : `<p style="opacity:.4">Carica un disegno dal pannello</p>`,
    timeline: b => `<h2>${esc(b.data.title)}</h2><div class="tl">${(b.data.items || []).map(i => `<div class="it"><div class="t">${esc(i.time)}</div><div><div class="n">${esc(i.title)}</div>${i.text ? `<div class="d">${esc(i.text)}</div>` : ''}</div></div>`).join('')}</div>`,
    story: b => {
      const d = b.data, key = x => x.date || x.year || '';
      const items = (d.items || []).filter(x => x.title || x.text || x.image || key(x)).slice().sort((a, c) => key(a).localeCompare(key(c)));
      const when = x => { const v = key(x); return /^\d{4}-\d{2}-\d{2}$/.test(v) ? fmtDate(v) : v; };
      const step = (x, last) => `<div class="st-it ${last ? 'final' : ''}"><span class="st-dot"></span>
        ${when(x) ? `<div class="yr">${esc(when(x))}</div>` : ''}<p class="st-t">${esc(x.title)}</p>
        ${x.image ? `<img src="${esc(x.image)}" alt="" loading="lazy">` : ''}${x.text ? `<p class="st-x">${esc(x.text)}</p>` : ''}</div>`;
      const wed = d.showWedding !== false && S.details.date ? step({ date: S.details.date, title: d.weddingTitle || 'Il grande giorno', text: d.weddingText || '' }, true) : '';
      return `<h2>${esc(d.title)}</h2>${d.intro ? `<p style="font-style:italic;opacity:.8">${esc(d.intro)}</p>` : ''}<div class="story">${items.map(x => step(x)).join('')}${wed}</div>`;
    },
    gallery: b => {
      const imgs = b.data.images || [];
      if (!imgs.length) return `<h2>${esc(b.data.title)}</h2><p style="opacity:.4">Aggiungi le foto dal pannello</p>`;
      const many = imgs.length > 1;
      return `<h2>${esc(b.data.title)}</h2><div class="car" data-car>
        <div class="car-track">${imgs.map((u, i) => `<div class="car-slide"><img src="${esc(u)}" alt="" loading="${i < 2 ? 'eager' : 'lazy'}" draggable="false"></div>`).join('')}</div>
        ${many ? `<button type="button" class="car-btn prev" data-car-go="-1" aria-label="Foto precedente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button type="button" class="car-btn next" data-car-go="1" aria-label="Foto successiva"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
        <div class="car-dots">${imgs.map((_, i) => `<i class="${i ? '' : 'on'}" data-car-to="${i}"></i>`).join('')}</div><div class="car-count">1 / ${imgs.length}</div>` : ''}</div>`;
    },
    dress: b => `<h2>${esc(b.data.title)}</h2><p>${esc(b.data.text)}</p><div class="swatches">${(b.data.colors || []).map(c => `<i style="background:${esc(c)}"></i>`).join('')}</div>`,
    menu: b => `<h2>${esc(b.data.title)}</h2><div class="menu">${(b.data.courses || []).map(c => `<div class="c"><small>${esc(c.name)}</small><div>${esc(c.dish)}</div></div>`).join('')}</div>`,
    gift: b => `<h2>${esc(b.data.title)}</h2><p>${esc(b.data.text)}</p>${b.data.iban ? `<div class="iban">${esc(b.data.iban)}</div><div class="caps" style="opacity:.7">${T('holder')}: ${esc(b.data.holder)}</div><button type="button" class="btn-soft" data-copy="${esc(b.data.iban.replace(/\s/g, ''))}">${T('copy')} IBAN</button>` : ''}${b.data.link ? `<div><a class="btn-soft" href="${esc(b.data.link)}" target="_blank" rel="noopener">${T('giftOnline')}</a></div>` : ''}`,
    hotel: b => `<h2>${esc(b.data.title)}</h2>${(b.data.items || []).map(h => `<div class="card-w"><div class="pad"><p style="font-size:22px;margin:0 0 4px">${esc(h.name)}</p><div class="caps" style="opacity:.7">${esc(h.address)}</div>${h.note ? `<p style="font-size:16px;margin-top:8px">${esc(h.note)}</p>` : ''}${h.link ? `<a class="btn-soft" href="${esc(h.link)}" target="_blank" rel="noopener">${T('book')}</a>` : ''}</div></div>`).join('')}`,
    transport: b => `<h2>${esc(b.data.title)}</h2>${(b.data.items || []).map(t => `<div class="card-w"><div class="pad"><div class="caps" style="color:var(--accent)">${esc(t.mode)}</div><p style="margin:8px 0 0">${esc(t.text)}</p></div></div>`).join('')}`,
    boarding: b => { const d = b.data; return `<h2>${esc(d.title)}</h2><div class="bp"><div class="top"><span>${T('boarding')}</span><span>${esc(fmtDate(S.details.date))}</span></div>
      <div class="route"><div><b>${esc(d.fromCode)}</b><small>${esc(d.from)}</small></div><span class="plane">${ICON_PLANE}</span><div style="text-align:right"><b>${esc(d.toCode)}</b><small>${esc(d.to)}</small></div></div>
      <div class="meta"><div><small>${T('flight')}</small><b>${esc(d.flight)}</b></div><div><small>${T('gate')}</small><b>${esc(d.gate)}</b></div><div><small>${T('seat')}</small><b>${esc(d.seat)}</b></div></div></div>`; },
    todo: b => `<h2>${esc(b.data.title)}</h2><ul class="list-l">${(b.data.items || []).filter(Boolean).map(i => `<li>${esc(i)}</li>`).join('')}</ul>`,
    faq: b => `<h2>${esc(b.data.title)}</h2><div class="faq">${(b.data.items || []).map(i => `<details><summary>${esc(i.q)}</summary><p>${esc(i.a)}</p></details>`).join('')}</div>`,
    text: b => `${b.data.title ? `<h2>${esc(b.data.title)}</h2>` : ''}<p>${esc(b.data.text)}</p>`,
  };

  function blockHTML(b) {
    const type = INV.blockTypes[b.type];
    if (!type || !blockRender[b.type]) return '';
    const acc = b.accent || '';
    const style = acc ? `style="--accent:${acc};--accent-strong:${acc}"` : '';
    const icon = b.type !== 'drawing' ? `<img class="ico" src="/media/icons/icon-blk-${type.icon}.png" alt="">` : '';
    // conto alla rovescia con foto di sfondo (facoltativamente oscurata)
    const photo = b.type === 'countdown' && b.data.image;
    if (photo) {
      const dk = b.data.darken ? (b.data.darkness ?? 45) / 100 : 0;
      return `<section class="blk reveal photo ${b.data.darken ? 'dark' : ''} ${acc ? 'acc' : ''}" data-block="${b.id}" style="${acc ? `--accent:${acc};` : ''}--dk:${dk}"><div class="ph-bg ${b.data.bw ? 'bw' : ''}" style="background-image:url('${esc(b.data.image)}');background-position:${b.data.posX ?? 50}% ${b.data.posY ?? 50}%;transform:scale(${(b.data.zoom ?? 100) / 100});transform-origin:${b.data.posX ?? 50}% ${b.data.posY ?? 50}%"></div>${icon}${blockRender[b.type](b)}</section>`;
    }
    return `<section class="blk reveal ${acc ? 'tinted' : ''}" data-block="${b.id}" ${style}><i class="fl fl-l"></i><i class="fl fl-r"></i>${icon}${blockRender[b.type](b)}</section>`;
  }

  // ---------- RSVP ----------
  function rsvpHTML() {
    const r = S.rsvp;
    if (!r.enabled) return '';
    const max = guest ? Math.max(1, guest.total_guests) : 6;
    const diets = INV.diets.filter(d => r.diets[d.id]);
    const custom = (r.custom || []).map(q => {
      const lbl = `<label class="f">${esc(q.label)}${q.required ? ' *' : ` <span style="text-transform:none;letter-spacing:0;opacity:.6">(${T('optional')})</span>`}</label>`;
      if (q.type === 'text') return lbl + `<input type="text" name="q_${q.id}" ${q.required ? 'required' : ''}>`;
      if (q.type === 'yesno') return lbl + `<div class="opts"><label class="opt"><input type="radio" name="q_${q.id}" value="${T('yesShort')}" ${q.required ? 'required' : ''}>${T('yesShort')}</label><label class="opt"><input type="radio" name="q_${q.id}" value="${T('noShort')}">${T('noShort')}</label></div>`;
      return lbl + `<div class="opts">${(q.options || []).filter(Boolean).map(o => `<label class="opt"><input type="radio" name="q_${q.id}" value="${esc(o)}" ${q.required ? 'required' : ''}>${esc(o)}</label>`).join('')}</div>`;
    }).join('');
    const g = guest || {};
    return `<section class="blk rsvp reveal" data-block="rsvp"><i class="fl fl-l"></i><i class="fl fl-r"></i><img class="ico" src="/media/icons/icon-feat-guests.png" alt="">
      <h2>${esc(lang === S.languages.main ? r.title || T('rsvp') : T('rsvp'))}</h2>${r.deadline ? `<p class="sub">${T('replyBy')} ${esc(fmtDate(r.deadline))}</p>` : ''}
      <div id="rsvp-box"><form id="rsvp-form" novalidate>
        <label class="f">${T('name')} *</label><input type="text" name="name" required value="${esc(g.name)}">
        <p class="help" style="margin:14px 0 -8px">${T('contactHelp')}</p><label class="f">${T('email')}</label><input type="email" name="email" value="${esc(g.email)}">
        <label class="f">${T('phone')}</label><div class="row"><select name="phone_cc">${INV.countryCodes.map(c => `<option ${c === (g.phone_cc || '+39') ? 'selected' : ''}>${c}</option>`).join('')}</select><input type="tel" name="phone" value="${esc(g.phone)}"></div>
        <label class="f">${T('attend')} *</label>
        <div class="opts"><label class="opt"><input type="radio" name="attending" value="1" required>${T('yes')}</label><label class="opt"><input type="radio" name="attending" value="0">${T('no')}</label></div>
        <div id="yes-part" hidden>
          ${max > 1 ? `<label class="f">${T('guestsN')}</label><select name="count">${Array.from({ length: max }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}</select>` : '<input type="hidden" name="count" value="1">'}
          <div id="persons"></div>
          ${custom}
        </div>
        ${r.message ? `<label class="f">${T('message')} <span style="text-transform:none;letter-spacing:0;opacity:.6">(${T('optional')})</span></label><textarea name="message" placeholder="${T('messagePh')}"></textarea>` : ''}
        ${r.song ? `<div id="song-part" hidden><label class="f">${T('song')} <span style="text-transform:none;letter-spacing:0;opacity:.6">(${T('optional')})</span></label><input type="text" name="song" placeholder="${T('songPh')}"></div>` : ''}
        <div class="err" id="rsvp-err"></div>
        <button class="send" type="submit">${T('send')}</button>
      </form></div></section>`;
  }

  function personsHTML(n) {
    const r = S.rsvp;
    const diets = r.dietary ? INV.diets.filter(d => r.diets[d.id]) : [];
    let h = '';
    for (let i = 0; i < n; i++) {
      h += `<div class="person" data-p="${i}">${n > 1 ? `<label class="f">${T('guest')} ${i + 1}</label><input type="text" name="pname" placeholder="${T('guestName')}" value="${i === 0 ? esc($('#rsvp-form [name=name]')?.value || '') : ''}">` : ''}
        ${r.dietary && (diets.length || r.otherAllergies) ? `<label class="f">${T('diets')}</label><p class="help">${T('dietsHelp')}</p>
        <div class="opts">${diets.map(d => `<label class="opt"><input type="checkbox" name="diet" value="${d.id}">${esc(dietName(d.id))}</label>`).join('')}</div>
        ${r.otherAllergies ? `<label class="f">${T('other')}</label><input type="text" name="other" placeholder="${T('otherPh')}">` : ''}` : ''}</div>`;
    }
    return h;
  }

  function bindRsvp(root) {
    const f = $('#rsvp-form', root);
    if (!f) return;
    const upd = () => {
      const yes = f.attending.value === '1';
      $('#yes-part', f).hidden = !yes;
      const sp = $('#song-part', f); if (sp) sp.hidden = !yes;
      const n = +(f.count?.value || 1);
      const box = $('#persons', f);
      if (box.children.length !== n) box.innerHTML = personsHTML(n);
    };
    f.addEventListener('change', e => { if (['attending', 'count'].includes(e.target.name)) upd(); });
    upd();
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const err = $('#rsvp-err', f); err.textContent = '';
      const name = f.name.value.trim(), email = f.email.value.trim(), phone = f.phone.value.trim();
      if (!name || (!email && !phone) || !f.attending.value) { err.textContent = T('required') + ': ' + T('name') + ', ' + T('email') + ' / ' + T('phone') + ', ' + T('attend'); return; }
      const yes = f.attending.value === '1';
      const party = yes ? [...f.querySelectorAll('.person')].map((p, i) => ({
        name: (p.querySelector('[name=pname]')?.value.trim()) || (i === 0 ? name : `${T('guest')} ${i + 1}`),
        diets: [...p.querySelectorAll('[name=diet]:checked')].map(x => x.value),
        other: p.querySelector('[name=other]')?.value.trim() || '',
      })) : [];
      const custom = {};
      for (const q of S.rsvp.custom || []) {
        const v = f.querySelector(`[name="q_${q.id}"]:checked`)?.value ?? f.querySelector(`input[type=text][name="q_${q.id}"]`)?.value ?? '';
        if (yes && q.required && !v) { err.textContent = T('required') + ': ' + q.label; return; }
        custom[q.id] = v;
      }
      const body = { slug: opts.slug, token: opts.token, name, email, phone, phone_cc: f.phone_cc.value, attending: yes, party, message: f.message?.value || '', song: f.song?.value || '', custom };
      const btn = $('.send', f); btn.disabled = true; btn.textContent = T('sending');
      if (!opts.preview) {
        const res = await fetch('/api?a=rsvp.submit', { method: 'POST', body: JSON.stringify(body) }).then(r => r.json()).catch(() => ({ error: 'Errore di rete' }));
        if (res.error) { err.textContent = res.error; btn.disabled = false; btn.textContent = T('send'); return; }
      }
      $('#rsvp-box', root).innerHTML = `<div class="thanks">${esc(yes ? T('thanksYes') : T('thanksNo'))}</div>`;
    });
  }

  // ---------- RENDER COMPLETO ----------
  function paint(root) {
    const d = S.details, bs = S.blocksStyle;
    const theme = INV.themes.find(t => t.id === S.theme) || INV.themes[0];
    const hf = d.headlineFont === 'global' ? bs.font : d.headlineFont;
    INV.loadFonts([hf, bs.font, 'Pinyon Script', 'Montserrat']);
    root.style.setProperty('--hf', `'${hf}', serif`);
    root.style.setProperty('--bf', `'${bs.font}', serif`);
    root.style.setProperty('--tc', d.textColor);
    root.style.setProperty('--bc', bs.color);

    // intro: il video non si ricrea se il tema non cambia (evita che riparta)
    let intro = $('.intro', root);
    if (!intro || intro.dataset.theme !== theme.id) {
      intro?.remove();
      intro = document.createElement('div');
      intro.className = 'intro'; intro.dataset.theme = theme.id;
      intro.style.backgroundImage = `url('${theme.poster}')`;
      intro.innerHTML = `<video src="${theme.video}" poster="${theme.poster}" muted playsinline loop autoplay preload="auto"></video><div class="shade"></div><div class="txt"></div><div class="langs"></div><div class="scroll-hint">${T('scroll')}<i></i></div>`;
      root.prepend(intro);
    }
    intro.classList.toggle('light-txt', isLight(d.textColor));
    intro.classList.toggle('dark-txt', !isLight(d.textColor));
    $('.txt', intro).innerHTML = introTextHTML();
    $('.scroll-hint', intro).firstChild.textContent = T('scroll');

    const langs = [S.languages.main, ...(S.languages.extra || []).filter(l => l !== S.languages.main)];
    $('.langs', intro).innerHTML = langs.length < 2 ? '' : langs.length <= 4
      ? langs.map(l => `<button type="button" data-lang="${l}" class="${l === lang ? 'on' : ''}">${l.split('-')[0].toUpperCase()}</button>`).join('')
      : `<select data-langsel aria-label="${esc(T('chooseLang'))}">${langs.map(l => `<option value="${l}" ${l === lang ? 'selected' : ''}>${esc((INV.languages.find(x => x.id === l) || { name: l }).name)}</option>`).join('')}</select>`;
    // lingue da destra a sinistra
    root.dir = INV.rtl.includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    $('.langs', intro).hidden = langs.length < 2;

    let paper = $('.paper', root);
    if (!paper) { paper = document.createElement('div'); paper.className = 'paper'; root.appendChild(paper); }
    const fl = INV.flowers.find(f => f.id === bs.flowers);
    root.classList.toggle('has-flowers', !!fl?.img);
    root.style.setProperty('--flw', fl?.img ? `url('${fl.img}')` : 'none');
    paper.innerHTML = S.blocks.filter(b => b.visible).map(blockHTML).join('') + rsvpHTML()
      + `<div class="foot">${T('madeWith')}</div>`;
    bindRsvp(root);
    bindCarousels(root);
    tickCountdown(root);
    observeReveal(root);
  }

  function bindCarousels(root) {
    root.querySelectorAll('[data-car]').forEach(car => {
      const tr = car.querySelector('.car-track'), n = tr.children.length;
      const idx = () => Math.round(tr.scrollLeft / (tr.children[0]?.offsetWidth + 10 || 1));
      const upd = () => { const i = Math.min(n - 1, idx()); car.querySelectorAll('.car-dots i').forEach((d, k) => d.classList.toggle('on', k === i)); const c = car.querySelector('.car-count'); if (c) c.textContent = `${i + 1} / ${n}`;
        car.querySelector('.prev')?.classList.toggle('off', i === 0); car.querySelector('.next')?.classList.toggle('off', i === n - 1); };
      tr.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
      car.goTo = i => tr.scrollTo({ left: tr.children[Math.max(0, Math.min(n - 1, i))].offsetLeft - tr.offsetLeft - (tr.clientWidth - tr.children[0].offsetWidth) / 2, behavior: 'smooth' });
      car.step = d => car.goTo(idx() + d);
      upd();
    });
  }

  function tickCountdown(root) {
    clearInterval(cdTimer);
    const run = () => {
      const target = new Date((S.details.date || '2030-01-01') + 'T16:00:00').getTime();
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
      root.querySelectorAll('[data-cd] [data-u]').forEach(el => el.textContent = v[el.dataset.u]);
    };
    run(); cdTimer = setInterval(run, 1000);
  }

  function observeReveal(root) {
    if (opts.preview || !('IntersectionObserver' in window)) { root.querySelectorAll('.reveal').forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    root.querySelectorAll('.reveal').forEach(e => io.observe(e));
  }

  // ---------- AUDIO ----------
  function audioSrc() {
    if (S.audio.track === 'custom' && S.audio.custom) return S.audio.custom;
    return (INV.tracks.find(t => t.id === S.audio.track) || {}).src || '';
  }
  const audioStart = () => S.audio.starts?.[S.audio.track] || 0;
  function syncAudio() {
    const src = audioSrc();
    const btn = $('#snd');
    btn.hidden = !src;
    if (!src) { audio?.pause(); return; }
    if (!audio) {
      audio = new Audio();
      // ricomincia sempre dal punto di partenza scelto dalla coppia
      audio.addEventListener('ended', () => { audio.currentTime = audioStart(); audio.play().catch(() => {}); });
    }
    if (!audio.src.endsWith(src)) { audio.src = src; audio.dataset.fresh = '1'; if (soundOn) startPlay(); }
    btn.innerHTML = soundOn ? ICON_SND_ON : ICON_SND_OFF;
  }
  function startPlay() {
    if (audio.dataset.fresh) {
      audio.dataset.fresh = ''; const t = audioStart();
      if (audio.readyState >= 1) audio.currentTime = t; else audio.addEventListener('loadedmetadata', () => { audio.currentTime = t; }, { once: true });
    }
    audio.play().catch(() => {});
  }
  function setSound(on) {
    soundOn = on;
    syncAudio();
    if (!audio) return;
    on ? startPlay() : audio.pause();
    $('#snd').innerHTML = on ? ICON_SND_ON : ICON_SND_OFF;
  }

  // ---------- AVVIO ----------
  let settleT = null;
  function play(root) {
    root.classList.remove('played', 'settled'); void root.offsetWidth; root.classList.add('played');
    clearTimeout(settleT); settleT = setTimeout(() => root.classList.add('settled'), 2600);
  }
  function openEnvelope(root, instant) {
    const scr = $('#env-screen'), env = $('#envelope');
    const done = () => {
      scr.classList.add('gone'); document.body.classList.remove('locked');
      play(root);
      const v = $('.intro video', root); v && v.play().catch(() => {});
    };
    if (instant) { scr.classList.add('gone'); document.body.classList.remove('locked'); if (!root.classList.contains('played')) play(root); return; }
    if (env.dataset.full) {
      // busta template: parte il video di apertura, alla fine si passa all'invito
      if (env.classList.contains('open')) return;
      env.classList.add('open');
      const v = env.querySelector('video');
      let finished = false;
      const fin = () => { if (!finished) { finished = true; done(); } };
      v.addEventListener('timeupdate', () => { if (v.duration && v.currentTime > v.duration - .6) fin(); });
      v.addEventListener('ended', fin);
      v.play().catch(fin);
      setTimeout(fin, 9000);
      return;
    }
    env.classList.add('open');
    setTimeout(done, 1900);
  }

  function placeSeal(env) {
    const v = env.querySelector('video'), sl = env.querySelector('.seal');
    if (!v || !sl) return;
    const put = () => {
      const vw = v.videoWidth || 720, vh = v.videoHeight || 1280, W = env.clientWidth, H = env.clientHeight;
      const r = Math.max(W / vw, H / vh), ox = (W - vw * r) / 2, oy = (H - vh * r) / 2;
      sl.style.left = (ox + vw * r * env.dataset.tipx / 100) + 'px';
      sl.style.top = (oy + vh * r * env.dataset.tipy / 100) + 'px';
      sl.style.width = Math.min(W, H * .5625) * .27 + 'px';
    };
    put(); v.addEventListener('loadedmetadata', put); addEventListener('resize', put);
  }
  function showEnvelope() {
    const scr = $('#env-screen');
    scr.innerHTML = envelopeHTML();
    scr.classList.toggle('full', !!$('#envelope', scr).dataset.full);
    if ($('#envelope', scr).classList.contains('env-custom')) placeSeal($('#envelope', scr));
    scr.classList.remove('gone');
    document.body.classList.add('locked');
    $('#envelope').addEventListener('click', () => {
      if (!opts.preview) setSound(true);
      openEnvelope($('#inv'));
    });
  }

  window.Invite = {
    init(data, o) {
      S = data; opts = o || {}; lang = S.languages.main || 'it';
      const root = $('#inv');
      if (opts.preview) document.body.classList.add('preview');
      document.body.insertAdjacentHTML('beforeend', `<div class="env-screen gone" id="env-screen"></div><button class="snd" id="snd" type="button" aria-label="Audio"></button>`);
      $('#snd').addEventListener('click', () => setSound(!soundOn));
      root.addEventListener('change', e => { if (e.target.matches('[data-langsel]')) { lang = e.target.value; INV.loadLang(lang).then(() => paint(root)); } });
      root.addEventListener('click', e => {
        const l = e.target.closest('[data-lang]');
        if (l) { lang = l.dataset.lang; INV.loadLang(lang).then(() => paint(root)); return; }
        const day = e.target.closest('[data-day]');
        if (day) {
          const blk = day.closest('.blk');
          blk.querySelectorAll('[data-day]').forEach(b => b.classList.toggle('on', b === day));
          blk.querySelectorAll('[data-dayp]').forEach(p => p.hidden = p.dataset.dayp !== day.dataset.day);
        }
        const cg = e.target.closest('[data-car-go]'); if (cg) cg.closest('[data-car]').step(+cg.dataset.carGo);
        const ct = e.target.closest('[data-car-to]'); if (ct) ct.closest('[data-car]').goTo(+ct.dataset.carTo);
        const cp = e.target.closest('[data-copy]');
        if (cp) { navigator.clipboard?.writeText(cp.dataset.copy); cp.textContent = T('copied'); }
      });
      const start = async () => {
        await INV.loadLangs([S.languages.main, ...(S.languages.extra || [])]);
        paint(root); syncAudio();
        if (opts.preview) openEnvelope(root, true); else showEnvelope();
      };
      if (opts.token && !opts.preview) {
        fetch(`/api?a=guest.byToken&slug=${encodeURIComponent(opts.slug)}&token=${encodeURIComponent(opts.token)}`).then(r => r.json()).then(r => { guest = r.guest; start(); }).catch(start);
      } else start();

      if (opts.preview) {
        // messaggi dal pannello: aggiornamento live + vista richiesta
        window.addEventListener('message', ev => {
          const m = ev.data || {};
          if (m.type !== 'invitelle') return;
          if (m.data) {
            const langChanged = m.data.languages.main !== S.languages.main;
            S = m.data; if (langChanged || ![S.languages.main, ...(S.languages.extra || [])].includes(lang)) lang = S.languages.main;
            INV.loadLangs([S.languages.main, ...(S.languages.extra || [])]).then(() => { const y = window.scrollY; paint(root); syncAudio(); window.scrollTo(0, y); });
          }
          if (m.view === 'envelope') showEnvelope();
          else if (m.view) {
            if (!$('#env-screen').classList.contains('gone')) openEnvelope(root, true);
            if (m.view === 'intro') window.scrollTo({ top: 0, behavior: 'smooth' });
            else {
              const el = root.querySelector(`[data-block="${m.view}"]`);
              if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
            }
          }
          if (m.replay) { play(root); const v = $('.intro video', root); if (v) { v.currentTime = 0; v.play().catch(() => {}); } }
          if (m.sound !== undefined) setSound(m.sound);
        });
        parent.postMessage({ type: 'invitelle-ready' }, '*');
      }
    },
  };
})();
