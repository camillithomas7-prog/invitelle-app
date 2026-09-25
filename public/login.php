<?php
// Login al pannello (al primo avvio: creazione della password)
require_once __DIR__ . '/../lib/auth.php';
if (isset($_GET['logout'])) { $_SESSION = []; session_destroy(); header('Location: /login'); exit; }

$setup = !admin_configured();
$err = '';
$next = $_GET['next'] ?? $_POST['next'] ?? '/';
if (!str_starts_with($next, '/') || str_starts_with($next, '//')) $next = '/';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pwd = (string) ($_POST['password'] ?? '');
    if ($setup) {
        if (strlen($pwd) < 8) $err = 'La password deve avere almeno 8 caratteri';
        elseif ($pwd !== ($_POST['password2'] ?? '')) $err = 'Le due password non coincidono';
        else { admin_set_password($pwd); session_regenerate_id(true); $_SESSION['invitelle_admin'] = true; header('Location: ' . $next); exit; }
    } else {
        usleep(400000); // rallenta i tentativi a raffica
        if (admin_check($pwd)) { session_regenerate_id(true); $_SESSION['invitelle_admin'] = true; header('Location: ' . $next); exit; }
        $err = 'Password non corretta';
    }
}
?><!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Accedi · Invitelle</title>
<link rel="icon" href="/media/logo-invitelle.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/editor.css?v=<?= filemtime(__DIR__ . '/assets/editor.css') ?>">
<style>
  .login { max-width: 380px; margin: 12vh auto 0; padding: 0 16px; }
  .login .brand { justify-content: center; margin-bottom: 22px; }
  .login .brand img { width: 44px; height: 44px; }
  .login .brand b { font-size: 28px; }
  .login .panel h2 { margin-bottom: 6px; }
  .err { background: var(--bad-bg); color: var(--bad); border-radius: 9px; padding: 9px 12px; font-size: 13px; margin-bottom: 12px; }
</style>
</head>
<body>
<div class="login">
  <div class="brand"><img src="/media/logo-invitelle.png" alt=""><b>Invitelle</b></div>
  <form class="panel" method="post">
    <h2><?= $setup ? 'Crea la password' : 'Accedi al pannello' ?></h2>
    <p class="lead"><?= $setup ? 'Primo accesso: scegli la password del pannello. Servirà per entrare le prossime volte.' : 'Inserisci la password per gestire i tuoi inviti.' ?></p>
    <?php if ($err): ?><div class="err"><?= h($err) ?></div><?php endif; ?>
    <input type="hidden" name="next" value="<?= h($next) ?>">
    <label class="l">Password</label>
    <input class="in" type="password" name="password" required autofocus autocomplete="<?= $setup ? 'new-password' : 'current-password' ?>">
    <?php if ($setup): ?>
      <label class="l">Ripeti la password</label>
      <input class="in" type="password" name="password2" required autocomplete="new-password">
    <?php endif; ?>
    <button class="btn pri" type="submit" style="width:100%;margin-top:16px;padding:12px"><?= $setup ? 'Crea password ed entra' : 'Entra' ?></button>
  </form>
</div>
</body>
</html>
