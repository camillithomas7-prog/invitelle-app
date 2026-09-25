<?php
// Pagina pubblica dell'album: /album/{slug}?k=chiave  — gli ospiti caricano foto e video dell'evento (dal QR sui tavoli)
require_once __DIR__ . '/../lib/db.php';
$inv = invite_by_slug($_GET['slug'] ?? '');
$ok = $inv && hash_equals(album_key((int) $inv['id']), (string) ($_GET['k'] ?? ''));
$d = $inv['data'] ?? [];
$al = $d['album'] ?? [];
$open = $ok && ($al['enabled'] ?? true) !== false;
$names = trim(preg_replace('/\s+/', ' ', preg_replace('/\b(ci sposiamo|sposi)\b/i', '', $d['details']['headline'] ?? '')));
$theme = $d['theme'] ?? 'amalfi';
$font = ($d['details']['headlineFont'] ?? 'Cinzel Decorative') === 'global' ? ($d['blocksStyle']['font'] ?? 'Cormorant Garamond') : ($d['details']['headlineFont'] ?? 'Cinzel Decorative');
?><!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Album · <?= h($names) ?></title>
<meta name="theme-color" content="#1d1714">
<link rel="icon" href="/media/logo-invitelle.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=<?= urlencode($font) ?>&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap">
<style>
  :root { --brand: #7a2331; --gold: #a8864f; --ink: #2b2522; --mute: #8a7f76; --paper: #fbf8f2; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Inter', system-ui, sans-serif; color: var(--ink); background: var(--paper); -webkit-font-smoothing: antialiased; }
  .hero { position: relative; min-height: 52vh; display: flex; align-items: flex-end; justify-content: center; text-align: center; color: #fff; padding: 40px 24px 40px; overflow: hidden; background: #2b2522; }
  .hero-bg { position: absolute; inset: 0; background-size: cover; background-repeat: no-repeat; }
  .hero::before { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(to bottom, rgba(20,14,12,.1), rgba(20,14,12,.72)); }
  .hero > div:not(.hero-bg) { z-index: 2; }
  .hero > div:not(.hero-bg) { position: relative; }
  .hero small { display: block; font-size: 11px; letter-spacing: .32em; text-transform: uppercase; opacity: .85; margin-bottom: 10px; }
  .hero h1 { font-family: '<?= h($font) ?>', serif; font-weight: 400; font-size: clamp(30px, 9vw, 46px); margin: 0; line-height: 1.1; }
  .hero p { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 20px; margin: 10px 0 0; opacity: .95; }
  main { max-width: 520px; margin: -22px auto 0; padding: 0 16px 60px; position: relative; z-index: 3; }
  .card { background: #fff; border-radius: 20px; padding: 22px; box-shadow: 0 14px 40px rgba(40,25,15,.12); }
  label.l { display: block; font-size: 12px; font-weight: 600; color: #4a413c; margin-bottom: 6px; }
  .in { width: 100%; padding: 13px 14px; border: 1px solid #e8dfd4; border-radius: 12px; font: inherit; font-size: 16px; background: #faf6f1; outline: none; }
  .in:focus { border-color: #c9a98f; background: #fff; }
  .pick { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; padding: 26px 16px; border: 2px dashed #d9ccbd; border-radius: 16px;
    background: #fcfaf7; cursor: pointer; text-align: center; transition: border-color .2s, background .2s; }
  .pick:hover, .pick.drag { border-color: var(--brand); background: #f8eff0; }
  .pick svg { width: 38px; height: 38px; color: var(--brand); }
  .pick b { font-size: 17px; }
  .pick span { font-size: 13px; color: var(--mute); }
  .btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; margin-top: 12px; padding: 15px; border-radius: 99px; border: 0; background: var(--brand); color: #fff; font: 600 15px 'Inter', sans-serif; cursor: pointer; }
  .btn.sec { background: #f1e8e0; color: var(--brand); }
  .btn svg { width: 18px; height: 18px; }
  .queue { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
  .q { display: flex; align-items: center; gap: 12px; padding: 8px; border: 1px solid #efe8df; border-radius: 12px; }
  .q .th { width: 50px; height: 50px; border-radius: 9px; background: #eee center/cover; flex: none; position: relative; overflow: hidden; }
  .q .th video { width: 100%; height: 100%; object-fit: cover; }
  .q .tx { flex: 1; min-width: 0; }
  .q .tx b { display: block; font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .q .tx small { font-size: 12px; color: var(--mute); }
  .bar { height: 5px; background: #f1ebe3; border-radius: 99px; overflow: hidden; margin-top: 6px; }
  .bar i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--gold), var(--brand)); transition: width .2s; }
  .q.done .bar i { background: #2e8b57; }
  .q.err .tx small { color: #c0392b; }
  .st { font-size: 18px; width: 24px; text-align: center; flex: none; }
  .done-box { text-align: center; padding: 18px 6px 4px; }
  .done-box h2 { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 400; font-size: 30px; margin: 0 0 6px; }
  .done-box p { color: var(--mute); margin: 0 0 6px; }
  .closed { text-align: center; padding: 30px 10px; }
  .closed h2 { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 400; font-size: 28px; margin: 0 0 8px; }
  .foot { text-align: center; font-size: 11px; letter-spacing: .25em; text-transform: uppercase; color: var(--mute); margin-top: 26px; }
  .del { width: 34px; height: 34px; border-radius: 50%; border: 0; background: #fbe7e5; color: #c0392b; display: flex; align-items: center; justify-content: center; flex: none; cursor: pointer; }
  .del svg { width: 16px; height: 16px; }
  .q.removing { opacity: .4; pointer-events: none; }
  .mine { margin-top: 22px; }
  .mine h3 { font-size: 13px; font-weight: 600; margin: 0 0 4px; }
  .mine p { font-size: 12px; color: var(--mute); margin: 0 0 10px; }
  [hidden] { display: none !important; }
</style>
</head>
<body>
<header class="hero">
  <?php $img = $al['image'] ?? ''; $px = (int) ($al['posX'] ?? 50); $py = (int) ($al['posY'] ?? ($img ? 50 : 30)); $z = (int) ($al['zoom'] ?? 100) / 100; ?>
  <div class="hero-bg" style="background-image:url('<?= h($img ?: "/media/themes/$theme.jpg") ?>');background-position:<?= $px ?>% <?= $py ?>%;transform:scale(<?= $z ?>);transform-origin:<?= $px ?>% <?= $py ?>%"></div>
  <div><small data-t="album">Album del matrimonio</small><h1><?= h($names ?: 'Il nostro matrimonio') ?></h1>
  <p data-t="lead"><?= h($al['cardText'] ?? 'Carica le foto e i video della festa') ?></p></div>
</header>
<main>
  <div class="card">
  <?php if (!$ok): ?>
    <div class="closed"><h2 data-t="badTitle">Link non valido</h2><p data-t="badText">Scansiona di nuovo il QR code che trovi sul tavolo.</p></div>
  <?php elseif (!$open): ?>
    <div class="closed"><h2 data-t="closedTitle">L'album è chiuso</h2><p data-t="closedText">Gli sposi non accettano più nuovi caricamenti. Grazie di cuore!</p></div>
  <?php else: ?>
    <div id="form">
      <?php if (($al['askName'] ?? true) !== false): ?>
        <label class="l" for="who" data-t="nameLbl">Il tuo nome (facoltativo)</label>
        <input class="in" id="who" autocomplete="name" data-tp="namePh" placeholder="es. Zia Carla">
      <?php endif; ?>
      <label class="pick" id="pick">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        <b data-t="pick">Scegli foto e video</b><span data-t="pickHint">Puoi selezionarne tanti insieme</span>
        <input type="file" id="files" accept="image/*,video/*" multiple hidden>
      </label>
      <div class="queue" id="queue"></div>
      <div class="mine" id="mine" hidden><h3 data-t="mineT">I tuoi caricamenti</h3><p data-t="mineP">Hai sbagliato foto? Tocca il cestino per eliminarla.</p><div class="queue" id="mine-list" style="margin-top:0"></div></div>
      <div class="done-box" id="done" hidden><h2 data-t="thanks">Grazie!</h2><p id="done-txt"></p>
        <button class="btn sec" id="more" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><span data-t="more">Carica altre foto</span></button></div>
    </div>
  <?php endif; ?>
  </div>
  <div class="foot">Invitelle</div>
</main>
<script>
// testi in italiano o inglese in base al telefono dell'ospite
const IT = (navigator.language || 'it').toLowerCase().startsWith('it');
const TXT = IT ? {} : { album: 'Wedding album', lead: 'Upload your photos and videos from the party', badTitle: 'Invalid link', badText: 'Please scan the QR code on your table again.',
  closedTitle: 'The album is closed', closedText: 'The couple are no longer accepting uploads. Thank you!', nameLbl: 'Your name (optional)', namePh: 'e.g. Aunt Carla',
  pick: 'Choose photos and videos', pickHint: 'You can select many at once', thanks: 'Thank you!', more: 'Upload more', up: 'Uploading...', ok: 'Uploaded', ko: 'Error', big: 'File too large',
  sent: n => `${n} files shared with the couple`, mineT: 'Your uploads', mineP: 'Wrong photo? Tap the bin to delete it.', delQ: 'Delete this file from the album?', deleted: 'Deleted' };
if (!IT) { document.documentElement.lang = 'en'; document.querySelectorAll('[data-t]').forEach(e => { if (TXT[e.dataset.t] && typeof TXT[e.dataset.t] === 'string') e.textContent = TXT[e.dataset.t]; });
  document.querySelectorAll('[data-tp]').forEach(e => e.placeholder = TXT[e.dataset.tp]); }
const L = k => TXT[k] || ({ delQ: 'Eliminare questo file dall\'album?', deleted: 'Eliminato', up: 'Caricamento...', ok: 'Caricato', ko: 'Errore', big: 'File troppo grande', sent: n => `${n} ${n === 1 ? 'file condiviso' : 'file condivisi'} con gli sposi` })[k];

const SLUG = <?= json_encode($inv['slug'] ?? '') ?>, KEY = <?= json_encode((string) ($_GET['k'] ?? '')) ?>;
const $ = s => document.querySelector(s);
const who = $('#who');
try { if (who) who.value = localStorage.getItem('invitelle-name') || ''; } catch (e) {}
who?.addEventListener('input', () => { try { localStorage.setItem('invitelle-name', who.value); } catch (e) {} });

let sent = 0, running = false;
const TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>';
const MKEY = 'invitelle-album-' + SLUG;
const mine = () => { try { return JSON.parse(localStorage.getItem(MKEY) || '[]'); } catch (e) { return []; } };
const saveMine = a => { try { localStorage.setItem(MKEY, JSON.stringify(a.slice(-300))); } catch (e) {} };
function addDelete(el, item) {
  const b = document.createElement('button'); b.className = 'del'; b.type = 'button'; b.title = L('delQ'); b.innerHTML = TRASH;
  b.onclick = async () => {
    if (!confirm(L('delQ'))) return;
    el.classList.add('removing');
    const r = await fetch('/api?a=album.guestDelete', { method: 'POST', body: JSON.stringify({ slug: SLUG, k: KEY, id: item.id, token: item.token }) }).then(r => r.json()).catch(() => ({ error: L('ko') }));
    if (r.ok) { saveMine(mine().filter(x => x.id !== item.id)); el.remove(); if (sent > 0) { sent--; $('#done-txt').textContent = L('sent')(sent); } if (!$('#mine-list').children.length) $('#mine').hidden = true; }
    else { el.classList.remove('removing'); alert(r.error || L('ko')); }
  };
  el.querySelector('.st').replaceWith(b);
}
// caricamenti fatti in precedenza da questo telefono
function showMine() {
  const list = mine(); if (!list.length) return;
  $('#mine').hidden = false;
  for (const it of list.slice().reverse()) {
    const el = document.createElement('div'); el.className = 'q done';
    el.innerHTML = `<div class="th"></div><div class="tx"><b></b><small></small></div><span class="st"></span>`;
    el.querySelector('b').textContent = it.name; el.querySelector('small').textContent = it.when || '';
    if (it.kind === 'video') el.querySelector('.th').innerHTML = `<video src="${it.thumb}#t=0.5" muted playsinline preload="metadata"></video>`; else el.querySelector('.th').style.backgroundImage = `url('${it.thumb}')`;
    $('#mine-list').appendChild(el); addDelete(el, it);
  }
}
const jobs = [];
const fmtMB = b => (b / 1048576).toFixed(b > 10485760 ? 0 : 1) + ' MB';
function add(files) {
  $('#done').hidden = true;
  for (const f of files) {
    if (!/^(image|video)\//.test(f.type) && !/\.(heic|heif|mov|mp4|jpe?g|png|webp)$/i.test(f.name)) continue;
    const el = document.createElement('div'); el.className = 'q';
    const url = URL.createObjectURL(f);
    el.innerHTML = `<div class="th">${f.type.startsWith('video') ? `<video src="${url}#t=0.5" muted playsinline preload="metadata"></video>` : ''}</div>
      <div class="tx"><b></b><small>${fmtMB(f.size)}</small><div class="bar"><i></i></div></div><span class="st"></span>`;
    el.querySelector('b').textContent = f.name;
    if (f.type.startsWith('image')) el.querySelector('.th').style.backgroundImage = `url('${url}')`;
    $('#queue').prepend(el);
    jobs.push({ f, el });
  }
  run();
}
function upload({ f, el }) {
  return new Promise(res => {
    const fd = new FormData(); fd.append('file', f); fd.append('slug', SLUG); fd.append('k', KEY); fd.append('name', who?.value || '');
    const x = new XMLHttpRequest(); x.open('POST', '/api?a=album.upload');
    el.querySelector('small').textContent = `${fmtMB(f.size)} · ${L('up')}`;
    x.upload.onprogress = e => { if (e.lengthComputable) el.querySelector('.bar i').style.width = (e.loaded / e.total * 100) + '%'; };
    x.onload = () => {
      let r = {}; try { r = JSON.parse(x.responseText); } catch (e) { r = { error: x.status === 413 ? L('big') : L('ko') }; }
      if (r.ok) {
        el.classList.add('done'); el.querySelector('.bar i').style.width = '100%'; el.querySelector('small').textContent = `${fmtMB(f.size)} · ${L('ok')}`; sent++;
        const item = { id: r.id, token: r.token, thumb: r.thumb, kind: r.kind, name: f.name, when: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        saveMine([...mine(), item]); addDelete(el, item);
      }
      else { el.classList.add('err'); el.querySelector('small').textContent = r.error || L('ko'); el.querySelector('.st').textContent = '!'; }
      res();
    };
    x.onerror = () => { el.classList.add('err'); el.querySelector('small').textContent = L('ko'); res(); };
    x.send(fd);
  });
}
async function run() {
  if (running) return; running = true;
  while (jobs.length) await upload(jobs.shift());
  running = false;
  if (sent) { $('#done').hidden = false; $('#done-txt').textContent = L('sent')(sent); }
}
if ($('#mine')) showMine();
$('#files')?.addEventListener('change', e => { add(e.target.files); e.target.value = ''; });
$('#more')?.addEventListener('click', () => $('#files').click());
const pick = $('#pick');
pick?.addEventListener('dragover', e => { e.preventDefault(); pick.classList.add('drag'); });
pick?.addEventListener('dragleave', () => pick.classList.remove('drag'));
pick?.addEventListener('drop', e => { e.preventDefault(); pick.classList.remove('drag'); add(e.dataTransfer.files); });
</script>
</body>
</html>
