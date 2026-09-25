<?php
// Pannello di creazione dell'invito: /editor?id=N
require_once __DIR__ . '/../lib/auth.php';
// admin: qualsiasi invito (?id=). Cliente: solo il suo, qualunque id arrivi
// vista cliente aperta dall'admin: stesso pannello del cliente, con la barra per tornare all'admin
boot_session();
$asClient = !empty($_SESSION['as_client']) && is_admin() && current_code();
$isAdmin = is_admin() && !$asClient;
$code = $isAdmin ? null : current_code();
if (!$isAdmin && !$code) { header('Location: /'); exit; }
$inv = invite_by_id($isAdmin ? (int) ($_GET['id'] ?? 0) : (int) $code['invite_id']);
if (!$inv) { header('Location: ' . ($isAdmin ? '/admin?p=inviti' : '/')); exit; }
$v = fn($f) => filemtime(__DIR__ . "/assets/$f");
$name = trim(preg_replace('/\s+/', ' ', $inv['data']['details']['headline'] ?? ''));
?><!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Crea il tuo invito · Invitelle</title>
<link rel="icon" href="/media/logo-invitelle.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/editor.css?v=<?= $v('editor.css') ?>">
</head>
<body>
<?php if ($asClient): ?><div class="as-client">Stai vedendo il pannello come il cliente <b><?= h($code['label'] ?: $code['code']) ?></b> (codice <?= h($code['code']) ?>) · <a href="/admin?p=fine-cliente">Torna all'admin</a></div><?php endif; ?>
<header class="top">
  <a class="brand" href="<?= $isAdmin ? '/admin' : '/editor' ?>"><img src="/media/logo-invitelle.png" alt=""><b>Invitelle</b></a>
  <span class="name"><?= h($name) ?></span>
  <span class="sp"></span>
  <span class="save-state" id="save-state"><i></i><span>Salvato</span></span>
  <?php if ($isAdmin): ?><a class="btn" href="/admin?p=inviti"><span class="lbl">Pannello admin</span></a>
  <?php else: ?><a class="btn" href="/?esci=1"><span class="lbl">Esci</span></a><?php endif; ?>
  <a class="btn pri" href="/i/<?= h($inv['slug']) ?>" target="_blank" rel="noopener" id="open-inv">Apri invito</a>
</header>

<div class="wrap">
  <div>
    <nav class="tabs" id="tabs"></nav>
    <section class="panel" id="panel"></section>
  </div>

  <aside class="pv">
    <div class="pv-top"><button type="button" class="btn" data-action="pv-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copia link</button>
      <button type="button" class="btn m-close" data-action="pv-mobile" style="margin-left:auto">Chiudi anteprima</button></div>
    <div class="pv-card">
      <div class="pv-h"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Anteprima live<span class="sp"></span>
        <button type="button" class="ibtn" data-action="pv-refresh" title="Riproduci di nuovo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.8-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/></svg></button>
        <button type="button" class="ibtn" data-action="pv-full" title="Schermo intero (come lo vede l'ospite)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button>
        <button type="button" class="ibtn" data-action="show-envelope" title="Mostra la busta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg></button>
        <a class="ibtn" href="/i/<?= h($inv['slug']) ?>" target="_blank" rel="noopener" title="Apri in una nuova scheda"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg></a>
      </div>
      <div class="phone"><iframe id="pv-frame" src="/i/<?= h($inv['slug']) ?>?preview=1" title="Anteprima invito"></iframe></div>
    </div>
  </aside>
</div>
<button type="button" class="btn pri m-pv" data-action="pv-mobile">Anteprima</button>

<script>window.__INVITE = <?= json_encode(['id' => (int) $inv['id'], 'slug' => $inv['slug'], 'data' => $inv['data']], JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>;</script>
<script src="/assets/catalog.js?v=<?= $v('catalog.js') ?>"></script>
<script src="/assets/qrcode.js"></script>
<script src="/assets/album-panel.js?v=<?= $v('album-panel.js') ?>"></script>
<script src="/assets/planner.js?v=<?= $v('planner.js') ?>"></script>
<script src="/assets/editor.js?v=<?= $v('editor.js') ?>"></script>
</body>
</html>
