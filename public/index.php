<?php
// I miei inviti: elenco + creazione
require_once __DIR__ . '/../lib/auth.php';
require_admin_page();
if (($_GET['new'] ?? '') === '1') { header('Location: /editor?id=' . create_invite()); exit; }
$rows = db()->query('SELECT i.*, (SELECT COUNT(*) FROM guests g WHERE g.invite_id = i.id) AS n_guests,
  (SELECT COUNT(*) FROM guests g WHERE g.invite_id = i.id AND g.status = \'attending\') AS n_yes FROM invites i ORDER BY updated_at DESC')->fetchAll();
?><!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>I miei inviti · Invitelle</title>
<link rel="icon" href="/media/logo-invitelle.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&family=Cinzel+Decorative&display=swap">
<link rel="stylesheet" href="/assets/editor.css?v=<?= filemtime(__DIR__ . '/assets/editor.css') ?>">
</head>
<body>
<header class="top"><a class="brand" href="/"><img src="/media/logo-invitelle.png" alt=""><b>Invitelle</b></a><span class="sp"></span><a class="btn" href="/login?logout=1">Esci</a><a class="btn pri" href="/?new=1">+ Nuovo invito</a></header>
<main class="home">
  <h1>I miei inviti</h1>
  <p style="color:var(--mute);margin:0">Crea il vostro invito digitale animato, invialo su WhatsApp e raccogli le conferme in un unico posto.</p>
  <div class="inv-grid">
    <a class="new-c" href="/?new=1" style="text-decoration:none"><span>+</span>Crea un nuovo invito</a>
    <?php foreach ($rows as $r): $d = json_decode($r['data'], true); ?>
      <a class="inv-c" href="/editor?id=<?= (int) $r['id'] ?>">
        <div class="cv" style="background-image:url('/media/themes/<?= h($d['theme'] ?? 'amalfi') ?>.jpg')"><div style="color:<?= h($d['details']['textColor'] ?? '#1c1c1c') ?>"><?= h(trim($d['details']['headline'] ?? '')) ?></div></div>
        <div class="mt"><b>/i/<?= h($r['slug']) ?></b><small><?= (int) $r['n_guests'] ?> ospiti · <?= (int) $r['n_yes'] ?> confermati</small></div>
      </a>
    <?php endforeach; ?>
  </div>
</main>
</body>
</html>
