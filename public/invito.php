<?php
// Pagina pubblica dell'invito: /i/{slug}  (?g=token per il link personale, ?preview=1 per l'anteprima del pannello)
require_once __DIR__ . '/../lib/db.php';
$inv = invite_by_slug($_GET['slug'] ?? '');
if (!$inv) { http_response_code(404); echo 'Invito non trovato'; exit; }
$d = $inv['data'];
$preview = !empty($_GET['preview']);
$title = trim(preg_replace('/\s+/', ' ', $d['details']['headline'] ?? 'Invito'));
$theme = $d['theme'] ?? 'amalfi';
?><!doctype html>
<html lang="<?= h($d['languages']['main'] ?? 'it') ?>">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title><?= h($title) ?></title>
<meta property="og:title" content="<?= h($title) ?>">
<meta property="og:description" content="Sei invitato! Apri la busta per scoprire tutti i dettagli.">
<meta property="og:image" content="/media/themes/<?= h($theme) ?>.jpg">
<link rel="icon" href="/media/seals/<?= h($d['envelope']['seal'] ?? 'rosso') ?>.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/assets/invite.css?v=<?= filemtime(__DIR__ . '/assets/invite.css') ?>">
</head>
<body>
<main class="inv" id="inv"></main>
<script src="/assets/catalog.js?v=<?= filemtime(__DIR__ . '/assets/catalog.js') ?>"></script>
<script src="/assets/invite.js?v=<?= filemtime(__DIR__ . '/assets/invite.js') ?>"></script>
<script>
Invite.init(<?= json_encode($d, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>, {
  slug: <?= json_encode($inv['slug']) ?>, preview: <?= $preview ? 'true' : 'false' ?>, token: <?= json_encode($_GET['g'] ?? '') ?>
});
</script>
</body>
</html>
