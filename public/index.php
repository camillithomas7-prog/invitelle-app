<?php
// Accesso del cliente con il solo codice ricevuto con l'ordine (niente registrazione, niente password)
require_once __DIR__ . '/../lib/auth.php';
boot_session();
if (isset($_GET['esci'])) {
    $wasAdmin = !empty($_SESSION['as_client']);
    unset($_SESSION['code_id'], $_SESSION['as_client']);
    header('Location: ' . ($wasAdmin ? '/admin?p=codici' : '/')); exit;
}
if (current_code()) { header('Location: /editor'); exit; }

$err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    // freno ai tentativi a raffica
    $_SESSION['tries'] = ($_SESSION['tries'] ?? 0) + 1;
    $_SESSION['t0'] = $_SESSION['t0'] ?? time();
    if (time() - $_SESSION['t0'] > 300) { $_SESSION['tries'] = 1; $_SESSION['t0'] = time(); }
    if ($_SESSION['tries'] > 8) {
        $err = 'Troppi tentativi. Riprova fra qualche minuto.';
    } else {
        $c = find_code((string) ($_POST['code'] ?? ''));
        if (!$c) $err = 'Codice non riconosciuto. Controlla di averlo copiato per intero.';
        elseif ($c['status'] !== 'active') $err = 'Questo codice è stato disattivato. Scrivici e lo sistemiamo.';
        elseif ($c['expires_at'] && $c['expires_at'] < date('Y-m-d')) $err = 'Questo codice è scaduto.';
        else {
            // il primo accesso crea l'invito del cliente, se non c'è ancora
            if (!$c['invite_id'] || !invite_by_id((int) $c['invite_id'])) {
                $iid = create_invite(false, $c['label'] ?: 'invito');
                db()->prepare('UPDATE codes SET invite_id = ? WHERE id = ?')->execute([$iid, $c['id']]);
            }
            db()->prepare("UPDATE codes SET uses = uses + 1, last_used_at = datetime('now','localtime'), first_used_at = COALESCE(first_used_at, datetime('now','localtime')) WHERE id = ?")->execute([$c['id']]);
            session_regenerate_id(true);
            $_SESSION['code_id'] = (int) $c['id'];
            unset($_SESSION['tries'], $_SESSION['t0']);
            header('Location: /editor'); exit;
        }
    }
}
?><!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Accedi al tuo invito · Invitelle</title>
<link rel="icon" href="/media/logo-invitelle.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/editor.css?v=<?= filemtime(__DIR__ . '/assets/editor.css') ?>">
<style>
  body { min-height: 100vh; background: linear-gradient(rgba(247,243,238,.86), rgba(247,243,238,.95)), url('/media/themes/amalfi.jpg') center/cover fixed; }
  .auth { max-width: 420px; margin: 0 auto; padding: 11vh 16px 40px; }
  .auth .brand { justify-content: center; margin-bottom: 24px; }
  .auth .brand img { width: 46px; height: 46px; }
  .auth .brand b { font-size: 30px; }
  .auth .panel { box-shadow: 0 20px 50px rgba(60,40,20,.12); }
  .codein { width: 100%; padding: 15px 14px; border: 1px solid var(--line); border-radius: 12px; background: #faf6f1; font: 600 21px 'Inter', monospace; letter-spacing: .12em; text-align: center; text-transform: uppercase; outline: none; }
  .codein:focus { border-color: #c9a98f; background: #fff; }
  .err { background: var(--bad-bg); color: var(--bad); border-radius: 9px; padding: 10px 12px; font-size: 13px; margin-bottom: 12px; }
  .foot { text-align: center; font-size: 12.5px; color: var(--mute); margin-top: 16px; line-height: 1.6; }
</style>
</head>
<body>
<div class="auth">
  <div class="brand"><img src="/media/logo-invitelle.png" alt=""><b>Invitelle</b></div>
  <form class="panel" method="post" autocomplete="off">
    <h2>Crea il tuo invito</h2>
    <p class="lead">Inserisci il codice che hai ricevuto insieme all'ordine. Non serve registrarsi né creare una password.</p>
    <?php if ($err): ?><div class="err"><?= h($err) ?></div><?php endif; ?>
    <input type="hidden" name="csrf" value="<?= csrf() ?>">
    <label class="l" for="code">Codice di accesso</label>
    <input class="codein" id="code" name="code" placeholder="INV-XXXX-XXXX" maxlength="20" required autofocus autocapitalize="characters" spellcheck="false">
    <button class="btn pri" type="submit" style="width:100%;margin-top:16px;padding:13px;font-size:14px">Entra nel mio invito</button>
    <div class="foot">Il codice è nella mail di conferma dell'ordine.</div>
  </form>
</div>
<script>
// formatta il codice mentre lo digiti: INV-ABCD-EFGH
const f = document.getElementById('code');
f.addEventListener('input', e => {
  let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (v.startsWith('INV')) v = v.slice(3);
  let o = 'INV'; if (v.length) o += '-' + v.slice(0, 4); if (v.length > 4) o += '-' + v.slice(4, 8);
  e.target.value = o;
});
f.addEventListener('focus', e => { if (!e.target.value) e.target.value = 'INV-'; });
</script>
</body>
</html>
