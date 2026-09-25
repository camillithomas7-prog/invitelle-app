// Strumenti di pianificazione: budget, checklist, disposizione tavoli
// Si aggancia al pannello tramite window.Planner.init(ctx), dove ctx espone api, toast, guests(), inviteId, setSaving
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const eur = n => '€ ' + Math.round(+n || 0).toLocaleString('it-IT');
  const uid = () => Math.random().toString(36).slice(2, 8);
  const WHEN = [['12', 'Da 12 mesi prima'], ['9', '9 mesi prima'], ['6', '6 mesi prima'], ['3', '3 mesi prima'], ['1', 'L\'ultimo mese'], ['0', 'La settimana del matrimonio']];
  const PALETTE = ['#7a2331', '#a8864f', '#5e9e7a', '#4a7fb5', '#c0566a', '#d4a82a', '#2f5d4a', '#a58bd6', '#e0824a', '#8a7f76'];
  const DIET = { glutine: 'Senza glutine', lattosio: 'Senza lattosio', vegetariano: 'Vegetariano', vegano: 'Vegano', frutta_secca: 'Allergia frutta secca', pesce: 'Allergia pesce' };

  let ctx, P = null, sub = 'budget', ckFilter = 'all', pick = null, poolSearch = '', saveT = null;

  const get = path => path.split('.').reduce((o, k) => o?.[k], P);
  const set = (path, v) => { const ks = path.split('.'); const last = ks.pop(); ks.reduce((o, k) => o[k], P)[last] = v; };
  function save() {
    ctx.setSaving(true);
    clearTimeout(saveT);
    saveT = setTimeout(async () => { const r = await ctx.api('planning.save', { invite_id: ctx.inviteId, data: P }); ctx.setSaving(false, r.error); }, 500);
  }

  // ---------- persone da sistemare ai tavoli ----------
  function people() {
    const out = [];
    for (const g of ctx.guests()) {
      if (g.status === 'declined') continue;
      const party = g.answers?.party || [];
      const n = party.length || g.total_guests || 1;
      for (let i = 0; i < n; i++) {
        const p = party[i];
        const first = g.name.split(/\s+/)[0];
        out.push({
          key: `g${g.id}-${i}`, name: p?.name || (i === 0 ? g.name : `${first} +${i}`),
          status: g.status, diets: [...(p?.diets || []).map(d => DIET[d] || d), p?.other].filter(Boolean),
        });
      }
    }
    for (const x of P.extras || []) out.push({ key: `x${x.id}`, name: x.name, status: 'extra', diets: [], extra: x.id });
    return out;
  }

  // ---------- BUDGET ----------
  function budgetHTML() {
    const B = P.budget, cats = B.categories;
    const cost = c => +c.actual || +c.estimated || 0;
    const est = cats.reduce((a, c) => a + (+c.estimated || 0), 0);
    const tot = cats.reduce((a, c) => a + cost(c), 0);
    const paid = cats.reduce((a, c) => a + (+c.paid || 0), 0);
    const left = (+B.total || 0) - tot;
    const guestsN = ctx.guests().filter(g => g.status !== 'declined').reduce((a, g) => a + (g.answers?.party?.length || g.total_guests || 1), 0);
    const pct = B.total ? Math.min(100, tot / B.total * 100) : 0;
    const sorted = cats.map((c, i) => ({ c, i, v: cost(c) })).filter(x => x.v > 0).sort((a, b) => b.v - a.v);
    let acc = 0;
    const stops = sorted.map((x, j) => { const a = acc; acc += x.v / (tot || 1) * 100; return `${PALETTE[j % PALETTE.length]} ${a}% ${acc}%`; }).join(',');
    return `<div class="pl-sum">
        <div class="pl-kpi main"><small>Budget totale</small><div class="rowx"><span>€</span><input class="in" type="number" min="0" step="100" data-pk="budget.total" value="${+B.total || 0}"></div></div>
        <div class="pl-kpi"><small>Costi previsti</small><b>${eur(tot)}</b><em>preventivi ${eur(est)}</em></div>
        <div class="pl-kpi"><small>Già pagato</small><b style="color:var(--ok)">${eur(paid)}</b><em>da pagare ${eur(Math.max(0, tot - paid))}</em></div>
        <div class="pl-kpi"><small>${left >= 0 ? 'Ancora disponibile' : 'Fuori budget'}</small><b style="color:${left >= 0 ? 'var(--ok)' : 'var(--bad)'}">${eur(Math.abs(left))}</b><em>${guestsN ? `${eur(tot / guestsN)} a ospite` : ''}</em></div>
      </div>
      <div class="pl-bar ${left < 0 ? 'over' : ''}"><i style="width:${pct}%"></i></div>
      <p class="hint" style="margin-bottom:18px">Hai impegnato il ${Math.round(B.total ? tot / B.total * 100 : 0)}% del budget</p>
      <div class="pl-chart"><div class="donut" style="background:conic-gradient(${stops || '#eee 0 100%'})"><span>${eur(tot)}</span></div>
        <div class="legend">${sorted.slice(0, 8).map((x, j) => `<div><i style="background:${PALETTE[j % PALETTE.length]}"></i>${esc(x.c.name)}<b>${Math.round(x.v / (tot || 1) * 100)}%</b></div>`).join('')}</div></div>
      <div class="pl-table">
        <div class="pl-th"><span>Voce</span><span>Preventivo</span><span>Costo effettivo</span><span>Pagato</span><span></span></div>
        ${cats.map((c, i) => { const cc = cost(c), pp = cc ? Math.min(100, (+c.paid || 0) / cc * 100) : 0; return `<div class="pl-tr">
          <input class="in" data-pk="budget.categories.${i}.name" value="${esc(c.name)}">
          <input class="in num" type="number" min="0" data-pk="budget.categories.${i}.estimated" value="${+c.estimated || ''}" placeholder="0">
          <input class="in num" type="number" min="0" data-pk="budget.categories.${i}.actual" value="${+c.actual || ''}" placeholder="—">
          <input class="in num" type="number" min="0" data-pk="budget.categories.${i}.paid" value="${+c.paid || ''}" placeholder="0">
          <button type="button" class="ibtn del" data-pa="rm" data-p="budget.categories" data-i="${i}" title="Elimina">${ICON.trash}</button>
          <div class="pl-mini"><i style="width:${pp}%"></i></div>
          <input class="in note" data-pk="budget.categories.${i}.note" value="${esc(c.note)}" placeholder="Note (fornitore, scadenza acconto...)">
        </div>`; }).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button type="button" class="btn sm" data-pa="add-cat">${ICON.plus} Aggiungi voce</button>
        <a class="btn sm" href="/api?a=budget.csv&invite_id=${ctx.inviteId}">${ICON.down} Esporta CSV</a></div>`;
  }

  // ---------- CHECKLIST ----------
  function checklistHTML() {
    const L = P.checklist;
    const done = L.filter(t => t.done).length;
    const vis = t => ckFilter === 'all' || (ckFilter === 'todo' ? !t.done : t.done);
    return `<div class="pl-prog"><div><b>${done} di ${L.length}</b> attività completate</div><div class="pl-bar"><i style="width:${L.length ? done / L.length * 100 : 0}%"></i></div></div>
      <div class="filters" style="margin:14px 0 6px">${[['all', 'Tutte'], ['todo', 'Da fare'], ['done', 'Fatte']].map(([k, l]) => `<button type="button" data-pa="ck-filter" data-f="${k}" class="${ckFilter === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      ${WHEN.map(([w, label]) => {
        const items = L.map((t, i) => ({ t, i })).filter(x => x.t.when === w && vis(x.t));
        if (!items.length) return '';
        const all = L.filter(t => t.when === w), d = all.filter(t => t.done).length;
        return `<div class="ck-g"><div class="ck-h">${label}<span>${d}/${all.length}</span></div>${items.map(({ t, i }) => `<div class="ck-it ${t.done ? 'done' : ''}">
          <label class="ck-box"><input type="checkbox" data-pk="checklist.${i}.done" ${t.done ? 'checked' : ''}><span>${ICON.check}</span></label>
          <input class="ck-t" data-pk="checklist.${i}.title" value="${esc(t.title)}">
          <input class="in ck-d" type="date" data-pk="checklist.${i}.due" value="${esc(t.due)}" title="Scadenza">
          <button type="button" class="ibtn del" data-pa="rm" data-p="checklist" data-i="${i}">${ICON.trash}</button></div>`).join('')}</div>`;
      }).join('')}
      <div class="box soft" style="margin-top:16px"><b style="font-size:13px">Nuova attività</b><div class="rowx" style="margin-top:8px;flex-wrap:wrap">
        <input class="in" id="ck-new" placeholder="es. Scegliere i confetti" style="min-width:200px">
        <select class="in" id="ck-when" style="flex:0 0 200px">${WHEN.map(([w, l]) => `<option value="${w}">${l}</option>`).join('')}</select>
        <button type="button" class="btn pri" data-pa="ck-add">${ICON.plus} Aggiungi</button></div></div>`;
  }

  // ---------- TAVOLI ----------
  function tableSVG(t) {
    const n = +t.seats, filled = t.people.length;
    const dots = [];
    if (t.shape === 'round') {
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 - Math.PI / 2; dots.push([60 + Math.cos(a) * 47, 60 + Math.sin(a) * 47]); }
      return `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="31" class="tb"/>${dots.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="8" class="${i < filled ? 'st on' : 'st'}"/>`).join('')}<text x="60" y="65">${filled}/${n}</text></svg>`;
    }
    const side = Math.ceil(n / 2);
    for (let i = 0; i < n; i++) { const top = i < side, k = top ? i : i - side, cnt = top ? side : n - side; dots.push([20 + (k + .5) * (120 / cnt), top ? 26 : 94]); }
    return `<svg viewBox="0 0 160 120"><rect x="14" y="40" width="132" height="40" rx="6" class="tb"/>${dots.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="8" class="${i < filled ? 'st on' : 'st'}"/>`).join('')}<text x="80" y="65">${filled}/${n}</text></svg>`;
  }

  function tablesHTML() {
    const ppl = people(), byKey = Object.fromEntries(ppl.map(p => [p.key, p]));
    // pulizia: rimuove persone non più presenti (ospite eliminato o che ha declinato)
    let dirty = false;
    P.tables.forEach(t => { const f = t.people.filter(k => byKey[k]); if (f.length !== t.people.length) { t.people = f; dirty = true; } });
    if (dirty) save();
    const seated = new Set(P.tables.flatMap(t => t.people));
    const pool = ppl.filter(p => !seated.has(p.key) && (!poolSearch || p.name.toLowerCase().includes(poolSearch.toLowerCase())));
    const seats = P.tables.reduce((a, t) => a + +t.seats, 0);
    const chip = (p, tIdx) => `<div class="chip ${p.status} ${pick === p.key ? 'sel' : ''}" draggable="true" data-person="${p.key}" title="${esc(p.diets.join(', '))}">
      <span class="av">${esc(p.name.trim().charAt(0).toUpperCase())}</span><span class="nm">${esc(p.name)}</span>
      ${p.diets.length ? `<span class="dt" title="${esc(p.diets.join(', '))}">${ICON.fork}</span>` : ''}
      ${p.status === 'pending' ? '<span class="pd" title="Non ha ancora confermato">?</span>' : ''}
      ${tIdx !== undefined ? `<button type="button" data-pa="unseat" data-t="${tIdx}" data-k="${p.key}" title="Togli dal tavolo">✕</button>` : ''}
      ${p.extra && tIdx === undefined ? `<button type="button" data-pa="rm-extra" data-id="${p.extra}" title="Elimina">✕</button>` : ''}</div>`;
    return `<div class="pl-sum three">
        <div class="pl-kpi"><small>Persone</small><b>${ppl.length}</b><em>confermati e in attesa</em></div>
        <div class="pl-kpi"><small>Già sedute</small><b style="color:var(--ok)">${seated.size}</b><em>${ppl.length - seated.size} da sistemare</em></div>
        <div class="pl-kpi"><small>Posti a tavola</small><b>${seats}</b><em>${P.tables.length} tavoli${seats < ppl.length ? ` · mancano ${ppl.length - seats} posti` : ''}</em></div></div>
      <p class="hint" style="margin:0 0 14px">Trascina le persone sui tavoli, oppure tocca un nome e poi il tavolo. Le persone arrivano dalla scheda Ospiti: chi non partecipa viene tolto in automatico.</p>
      <div class="seat-wrap">
        <div class="pool" data-drop="pool"><div class="pool-h"><b>Da sistemare (${ppl.length - seated.size})</b></div>
          <input class="in" id="pool-search" placeholder="Cerca..." value="${esc(poolSearch)}" style="margin-bottom:8px">
          <div class="chips">${pool.map(p => chip(p)).join('') || '<p class="hint">Tutti seduti</p>'}</div>
          <div class="rowx" style="margin-top:10px"><input class="in" id="extra-name" placeholder="Persona extra (es. fotografo)"><button type="button" class="btn sm" data-pa="add-extra">${ICON.plus}</button></div></div>
        <div class="tables">${P.tables.map((t, i) => { const over = t.people.length > t.seats; return `<div class="tcard ${over ? 'over' : ''} ${pick ? 'pickable' : ''}" data-drop="${i}">
          <div class="tc-h"><input class="in" data-pk="tables.${i}.name" value="${esc(t.name)}">
            <button type="button" class="ibtn del" data-pa="rm" data-p="tables" data-i="${i}" title="Elimina tavolo">${ICON.trash}</button></div>
          <div class="tc-o"><select class="in" data-pk="tables.${i}.shape"><option value="round" ${t.shape === 'round' ? 'selected' : ''}>Rotondo</option><option value="rect" ${t.shape === 'rect' ? 'selected' : ''}>Rettangolare</option></select>
            <select class="in" data-pk="tables.${i}.seats">${Array.from({ length: 23 }, (_, k) => k + 2).map(k => `<option ${k === +t.seats ? 'selected' : ''}>${k}</option>`).join('')}</select><span class="hint" style="margin:0">posti</span></div>
          <div class="tc-v">${tableSVG(t)}</div>
          ${over ? `<p class="hint" style="color:var(--bad);margin:0 0 6px">${t.people.length - t.seats} persone in più dei posti</p>` : ''}
          <div class="chips">${t.people.map(k => byKey[k] && chip(byKey[k], i)).join('')}</div></div>`; }).join('')}
          <button type="button" class="tadd" data-pa="add-table">${ICON.plus}<span>Aggiungi tavolo</span></button></div>
      </div>
      <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn" data-pa="print">${ICON.print} Stampa il tableau</button>
        <button type="button" class="btn" data-pa="auto">Sistema automaticamente i restanti</button></div>`;
  }

  function printTableau() {
    const byKey = Object.fromEntries(people().map(p => [p.key, p]));
    const w = window.open('', '_blank');
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Tableau</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital@0;1&family=Pinyon+Script&display=swap">
      <style>body{font-family:'Cormorant Garamond',serif;color:#2b2522;padding:30px;text-align:center}h1{font-family:'Pinyon Script',cursive;font-weight:400;font-size:54px;margin:0 0 30px}
      .g{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}.t{border:1px solid #d8c9b5;padding:18px;break-inside:avoid}.t h2{font-weight:400;font-style:italic;font-size:26px;margin:0 0 10px;border-bottom:1px solid #eee;padding-bottom:8px}.t div{font-size:18px;line-height:1.6}.d{font-size:12px;color:#8a7f76}</style></head>
      <body><h1>${esc(ctx.title())}</h1><div class="g">${P.tables.map(t => `<div class="t"><h2>${esc(t.name)}</h2>${t.people.map(k => byKey[k] ? `<div>${esc(byKey[k].name)}${byKey[k].diets.length ? ` <span class="d">(${esc(byKey[k].diets.join(', '))})</span>` : ''}</div>` : '').join('')}</div>`).join('')}</div>
      <script>setTimeout(()=>print(),600)<\/script></body></html>`);
    w.document.close();
  }

  function seat(key, tIdx) {
    P.tables.forEach(t => t.people = t.people.filter(k => k !== key));
    if (tIdx !== 'pool') P.tables[+tIdx].people.push(key);
    pick = null; save(); ctx.render();
  }

  // ---------- RENDER ----------
  const SUBS = [['budget', 'Budget', 'budget'], ['checklist', 'Checklist', 'checklist'], ['tables', 'Disposizione tavoli', 'chair']];
  function html() {
    if (!P) return `<h2>Pianificazione</h2><p class="lead">Caricamento...</p>`;
    const body = sub === 'budget' ? budgetHTML() : sub === 'checklist' ? checklistHTML() : tablesHTML();
    return `<h2>Strumenti di pianificazione</h2><p class="lead">Budget, checklist e disposizione dei tavoli: tutto privato, gli ospiti non lo vedono.</p>
      <div class="pl-subs">${SUBS.map(([k, l, ic]) => `<button type="button" data-pa="sub" data-s="${k}" class="${sub === k ? 'on' : ''}"><img src="/media/icons/icon-tool-${ic}.png" alt="">${l}</button>`).join('')}</div>${body}`;
  }

  function bind(panel) {
    // trascinamento persone
    panel.querySelectorAll('[data-person]').forEach(c => c.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', c.dataset.person); c.classList.add('dragging'); }));
    panel.querySelectorAll('[data-drop]').forEach(z => {
      z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('drop-on'); });
      z.addEventListener('dragleave', () => z.classList.remove('drop-on'));
      z.addEventListener('drop', e => { e.preventDefault(); z.classList.remove('drop-on'); const k = e.dataTransfer.getData('text/plain'); if (k) seat(k, z.dataset.drop); });
    });
  }

  function onInput(el) {
    if (el.id === 'pool-search') { poolSearch = el.value; ctx.render(); const s = document.getElementById('pool-search'); s.focus(); s.setSelectionRange(s.value.length, s.value.length); return true; }
    const k = el.dataset.pk; if (!k) return false;
    let v = el.type === 'checkbox' ? el.checked : el.type === 'number' ? (el.value === '' ? 0 : +el.value) : el.value;
    if (k.endsWith('.seats')) v = +v;
    set(k, v); save();
    if (el.type === 'checkbox' || el.tagName === 'SELECT') ctx.render();
    return true;
  }
  function onChange(el) {
    if (!el.dataset.pk) return false;
    if (el.type === 'number' || el.type === 'date') ctx.render();   // aggiorna totali e ordinamenti a fine modifica
    return true;
  }

  function onClick(e) {
    const person = e.target.closest('[data-person]');
    const btn = e.target.closest('[data-pa]');
    if (!btn && person) { pick = pick === person.dataset.person ? null : person.dataset.person; ctx.render(); return true; }
    if (!btn && pick) { const z = e.target.closest('[data-drop]'); if (z) { seat(pick, z.dataset.drop); return true; } }
    if (!btn) return false;
    const A = btn.dataset.pa, i = +btn.dataset.i;
    switch (A) {
      case 'sub': sub = btn.dataset.s; pick = null; break;
      case 'rm': if (!confirm('Eliminare questa voce?')) return true; get(btn.dataset.p).splice(i, 1); save(); break;
      case 'add-cat': P.budget.categories.push({ id: uid(), name: 'Nuova voce', estimated: 0, actual: 0, paid: 0, note: '' }); save(); break;
      case 'ck-filter': ckFilter = btn.dataset.f; break;
      case 'ck-add': { const t = document.getElementById('ck-new').value.trim(); if (!t) { ctx.toast('Scrivi l\'attività'); return true; }
        P.checklist.push({ id: uid(), title: t, when: document.getElementById('ck-when').value, done: false, due: '' }); save(); } break;
      case 'add-table': P.tables.push({ id: uid(), name: `Tavolo ${P.tables.length}`, shape: 'round', seats: 8, people: [] }); save(); break;
      case 'unseat': e.stopPropagation(); seat(btn.dataset.k, 'pool'); return true;
      case 'add-extra': { const n = document.getElementById('extra-name').value.trim(); if (!n) return true; (P.extras ||= []).push({ id: uid(), name: n }); save(); } break;
      case 'rm-extra': e.stopPropagation(); P.extras = P.extras.filter(x => x.id !== btn.dataset.id); save(); break;
      case 'print': printTableau(); return true;
      case 'auto': {
        // riempie i posti liberi tenendo insieme i gruppi dello stesso ospite
        const seated = new Set(P.tables.flatMap(t => t.people));
        const groups = {};
        people().filter(p => !seated.has(p.key)).forEach(p => (groups[p.key.split('-')[0]] ||= []).push(p.key));
        for (const g of Object.values(groups)) {
          const t = P.tables.find(t => t.seats - t.people.length >= g.length) || P.tables.find(t => t.seats > t.people.length);
          if (!t) break;
          g.forEach(k => { if (t.people.length < t.seats) t.people.push(k); });
        }
        save(); ctx.toast('Ospiti sistemati: controlla e sposta chi vuoi');
      } break;
      default: return false;
    }
    ctx.render();
    return true;
  }

  let ICON = {};
  window.Planner = {
    async init(c) { ctx = c; ICON = c.icons; P = await ctx.api('planning.get', null, `&invite_id=${ctx.inviteId}`); },
    html, bind, onInput, onChange, onClick,
  };
})();
