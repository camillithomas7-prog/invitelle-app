<?php
// Pannello admin Invitelle (stessa logica del pannello corsi 3D WEB LAB):
// accesso admin con email+password creato al primo avvio, codici di accesso per ogni cliente, elenco inviti.
require_once __DIR__ . '/../lib/auth.php';
boot_session();

db()->exec("CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT)");
function setting(string $k, string $def = ''): string { $s = db()->prepare('SELECT v FROM settings WHERE k = ?'); $s->execute([$k]); $v = $s->fetchColumn(); return $v === false ? $def : (string) $v; }
function set_setting(string $k, string $v): void { db()->prepare('INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v')->execute([$k, $v]); }
function flash(?string $m = null, string $t = 'ok'): ?array { if ($m !== null) { $_SESSION['flash'] = [$m, $t]; return null; } $f = $_SESSION['flash'] ?? null; unset($_SESSION['flash']); return $f; }
function back(string $to): never { header('Location: ' . $to); exit; }

const DEFAULT_MSG = "Ciao {nome}!\nGrazie per il tuo ordine. Ecco il tuo codice per creare l'invito digitale del vostro matrimonio:\n\n{codice}\n\nEntra da qui: {link}\nInserisci il codice e inizia a personalizzarlo: tema, busta, musica, programma e conferme degli ospiti.\n\nA presto,\nInvitelle";

$site = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
$p = $_GET['p'] ?? 'home';

if ($p === 'logout') { unset($_SESSION['admin_id']); back('/admin'); }

/* ───────── accesso / primo avvio ───────── */
$admin = current_admin();
if (!$admin) {
    $first = (int) db()->query('SELECT COUNT(*) FROM admins')->fetchColumn() === 0;
    $err = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        check_csrf();
        $em = strtolower(trim((string) ($_POST['email'] ?? '')));
        $pw = (string) ($_POST['pass'] ?? '');
        if ($first) {
            if (!filter_var($em, FILTER_VALIDATE_EMAIL)) $err = 'Email non valida.';
            elseif (strlen($pw) < 8) $err = 'La password deve avere almeno 8 caratteri.';
            else {
                db()->prepare('INSERT INTO admins (email, pass_hash) VALUES (?, ?)')->execute([$em, password_hash($pw, PASSWORD_DEFAULT)]);
                session_regenerate_id(true); $_SESSION['admin_id'] = (int) db()->lastInsertId(); back('/admin');
            }
        } else {
            $s = db()->prepare('SELECT * FROM admins WHERE email = ?'); $s->execute([$em]); $a = $s->fetch();
            if ($a && password_verify($pw, $a['pass_hash'])) { session_regenerate_id(true); $_SESSION['admin_id'] = (int) $a['id']; back('/admin'); }
            usleep(400000); $err = 'Email o password non corrette.';
        }
    }
    ?><!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow">
    <title>Admin · Invitelle</title><link rel="icon" href="/media/logo-invitelle.png">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500&display=swap">
    <link rel="stylesheet" href="/assets/editor.css?v=<?= filemtime(__DIR__ . '/assets/editor.css') ?>">
    <style>.auth{max-width:400px;margin:0 auto;padding:12vh 16px 40px}.auth .brand{justify-content:center;margin-bottom:22px}.auth .brand img{width:44px;height:44px}.auth .brand b{font-size:28px}.err{background:var(--bad-bg);color:var(--bad);border-radius:9px;padding:10px 12px;font-size:13px;margin-bottom:12px}</style>
    </head><body><div class="auth"><div class="brand"><img src="/media/logo-invitelle.png" alt=""><b>Invitelle</b><span class="badge gray" style="margin-left:6px">Admin</span></div>
    <form class="panel" method="post"><h2><?= $first ? 'Crea il tuo accesso admin' : 'Pannello di gestione' ?></h2>
    <p class="lead"><?= $first ? 'È la prima volta che apri il pannello: scegli email e password. Verranno chieste solo a te.' : 'Accedi per generare i codici dei clienti e gestire gli inviti.' ?></p>
    <?php if ($err): ?><div class="err"><?= h($err) ?></div><?php endif; ?>
    <input type="hidden" name="csrf" value="<?= csrf() ?>">
    <label class="l">Email</label><input class="in" type="email" name="email" required autofocus autocomplete="username">
    <label class="l">Password</label><input class="in" type="password" name="pass" required autocomplete="<?= $first ? 'new-password' : 'current-password' ?>" <?= $first ? 'minlength="8"' : '' ?>>
    <?php if ($first): ?><p class="hint">Minimo 8 caratteri. Salvala nel gestore password.</p><?php endif; ?>
    <button class="btn pri" type="submit" style="width:100%;margin-top:16px;padding:12px"><?= $first ? 'Crea accesso' : 'Entra' ?></button></form></div></body></html>
    <?php exit;
}

/* ───────── azioni ───────── */
$made = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $a = $_POST['action'] ?? '';
    $ret = '/admin?p=' . urlencode($_POST['ret'] ?? $p) . (!empty($_POST['q']) ? '&q=' . urlencode($_POST['q']) : '');
    if ($a === 'gen') {
        $n = max(1, min(200, (int) ($_POST['qty'] ?? 1)));
        $lab = trim((string) ($_POST['label'] ?? '')); $ord = trim((string) ($_POST['order_ref'] ?? ''));
        $em = trim((string) ($_POST['email'] ?? '')); $exp = trim((string) ($_POST['expires_at'] ?? '')) ?: null;
        $link = (int) ($_POST['invite_id'] ?? 0) ?: null;
        $ins = db()->prepare('INSERT INTO codes (code, label, order_ref, email, expires_at, invite_id) VALUES (?,?,?,?,?,?)');
        for ($i = 0; $i < $n; $i++) for ($t = 0; $t < 12; $t++) {
            $c = generate_code();
            try { $ins->execute([$c, $lab, $ord, $em, $exp, $i === 0 ? $link : null]); $made[] = $c; break; } catch (PDOException $e) {}
        }
        $_SESSION['made'] = $made;
        flash(count($made) === 1 ? 'Codice generato.' : count($made) . ' codici generati.');
        back('/admin?p=codici');
    } elseif ($a === 'toggle') {
        db()->prepare("UPDATE codes SET status = CASE status WHEN 'active' THEN 'revoked' ELSE 'active' END WHERE id = ?")->execute([(int) $_POST['id']]);
        flash('Stato del codice aggiornato.');
    } elseif ($a === 'edit') {
        db()->prepare('UPDATE codes SET label = ?, order_ref = ?, email = ?, expires_at = ? WHERE id = ?')
            ->execute([trim((string) $_POST['label']), trim((string) $_POST['order_ref']), trim((string) $_POST['email']), trim((string) $_POST['expires_at']) ?: null, (int) $_POST['id']]);
        flash('Codice aggiornato.'); $ret = '/admin?p=codici';
    } elseif ($a === 'del') {
        $s = db()->prepare('SELECT * FROM codes WHERE id = ?'); $s->execute([(int) $_POST['id']]); $c = $s->fetch();
        if ($c && !empty($_POST['with_invite']) && $c['invite_id']) db()->prepare('DELETE FROM invites WHERE id = ?')->execute([$c['invite_id']]);
        db()->prepare('DELETE FROM codes WHERE id = ?')->execute([(int) $_POST['id']]);
        flash(!empty($_POST['with_invite']) ? 'Codice e invito eliminati.' : 'Codice eliminato (l\'invito resta nell\'elenco inviti).');
    } elseif ($a === 'new_invite') {
        $id = create_invite(true); back('/editor?id=' . $id);
    } elseif ($a === 'del_invite') {
        db()->prepare('DELETE FROM invites WHERE id = ?')->execute([(int) $_POST['id']]);
        flash('Invito eliminato.');
    } elseif ($a === 'msg') {
        set_setting('msg', trim((string) $_POST['msg']) ?: DEFAULT_MSG); flash('Messaggio salvato.'); $ret = '/admin?p=impostazioni';
    } elseif ($a === 'pass') {
        if (!password_verify((string) $_POST['old'], $admin['pass_hash'])) flash('La password attuale non è corretta.', 'err');
        elseif (strlen((string) $_POST['new']) < 8) flash('La nuova password deve avere almeno 8 caratteri.', 'err');
        else { db()->prepare('UPDATE admins SET pass_hash = ? WHERE id = ?')->execute([password_hash((string) $_POST['new'], PASSWORD_DEFAULT), $admin['id']]); flash('Password cambiata.'); }
        $ret = '/admin?p=impostazioni';
    }
    back($ret);
}
$made = $_SESSION['made'] ?? []; unset($_SESSION['made']);
$f = flash();
$msgTpl = setting('msg', DEFAULT_MSG);
$fill = fn(array $c) => strtr($msgTpl, ['{nome}' => $c['label'] ? explode(' ', trim($c['label']))[0] : '', '{codice}' => $c['code'], '{link}' => $site . '/']);

/* ───────── layout ───────── */
$tabs = ['home' => 'Panoramica', 'codici' => 'Codici clienti', 'inviti' => 'Inviti', 'impostazioni' => 'Impostazioni'];
?><!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title><?= h($tabs[$p] ?? 'Admin') ?> · Admin Invitelle</title><link rel="icon" href="/media/logo-invitelle.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/editor.css?v=<?= filemtime(__DIR__ . '/assets/editor.css') ?>">
<style>
  .adm { max-width: 1240px; margin: 0 auto; padding: 18px 20px 70px; }
  .anav { display: flex; gap: 4px; flex-wrap: wrap; background: #efe8df; padding: 5px; border-radius: 12px; margin-bottom: 18px; }
  .anav a { padding: 8px 14px; border-radius: 8px; text-decoration: none; color: #6d625a; font-size: 13px; }
  .anav a.on { background: var(--card); color: var(--ink); font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
  .flash { padding: 11px 14px; border-radius: 10px; margin-bottom: 16px; font-size: 13px; background: var(--ok-bg); color: #1f6b41; border: 1px solid #c6e6d0; }
  .flash.err { background: var(--bad-bg); color: var(--bad); border-color: #f3cdc8; }
  table.t { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.t th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--mute); font-weight: 600; padding: 8px 10px; border-bottom: 1px solid var(--line); }
  table.t td { padding: 11px 10px; border-bottom: 1px solid var(--line2); vertical-align: top; }
  table.t tr:hover td { background: #fcfaf7; }
  .code { font: 600 14px ui-monospace, Menlo, monospace; letter-spacing: .06em; background: #f5efe7; padding: 4px 8px; border-radius: 7px; cursor: pointer; white-space: nowrap; }
  .acts { display: flex; gap: 5px; flex-wrap: wrap; }
  .acts form { display: inline; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 18px; }
  .grid2 { display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 18px; align-items: start; }
  .tbl-wrap { overflow-x: auto; }
  @media (max-width: 900px) { .grid2 { grid-template-columns: 1fr; } .kpis { grid-template-columns: 1fr 1fr; } }
</style></head><body>
<header class="top"><a class="brand" href="/admin"><img src="/media/logo-invitelle.png" alt=""><b>Invitelle</b></a><span class="badge gray">Admin</span>
  <span class="sp"></span><span class="name"><?= h($admin['email']) ?></span><a class="btn" href="/admin?p=logout">Esci</a></header>
<div class="adm">
<nav class="anav"><?php foreach ($tabs as $k => $l): ?><a href="/admin?p=<?= $k ?>" class="<?= $p === $k ? 'on' : '' ?>"><?= $l ?></a><?php endforeach; ?></nav>
<?php if ($f): ?><div class="flash <?= $f[1] === 'err' ? 'err' : '' ?>"><?= h($f[0]) ?></div><?php endif; ?>

<?php if ($p === 'home'):
  $k = db()->query("SELECT (SELECT COUNT(*) FROM codes) c, (SELECT COUNT(*) FROM codes WHERE status='active') ca, (SELECT COUNT(*) FROM codes WHERE first_used_at IS NOT NULL) cu,
    (SELECT COUNT(*) FROM invites) i, (SELECT COUNT(*) FROM guests) g, (SELECT COUNT(*) FROM guests WHERE status='attending') ga, (SELECT COUNT(*) FROM album) al")->fetch();
  $last = db()->query("SELECT c.*, i.slug FROM codes c LEFT JOIN invites i ON i.id = c.invite_id WHERE c.last_used_at IS NOT NULL ORDER BY c.last_used_at DESC LIMIT 8")->fetchAll(); ?>
  <div class="kpis">
    <div class="pl-kpi"><small>Codici attivi</small><b><?= (int) $k['ca'] ?></b><em><?= (int) $k['c'] ?> generati in totale</em></div>
    <div class="pl-kpi"><small>Clienti entrati</small><b><?= (int) $k['cu'] ?></b><em><?= max(0, (int) $k['c'] - (int) $k['cu']) ?> non ancora entrati</em></div>
    <div class="pl-kpi"><small>Inviti</small><b><?= (int) $k['i'] ?></b><em><?= (int) $k['g'] ?> ospiti · <?= (int) $k['ga'] ?> confermati</em></div>
    <div class="pl-kpi"><small>Foto e video album</small><b><?= (int) $k['al'] ?></b><em>caricati dagli ospiti</em></div>
  </div>
  <div class="panel"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><h2 style="margin:0">Ultimi accessi dei clienti</h2><span class="sp" style="flex:1"></span><a class="btn pri" href="/admin?p=codici">+ Genera codice</a></div>
    <?php if (!$last): ?><p class="hint">Nessun cliente è ancora entrato. Genera un codice e mandalo al cliente dopo l'ordine.</p><?php else: ?>
    <div class="tbl-wrap"><table class="t"><tr><th>Cliente</th><th>Codice</th><th>Ultimo accesso</th><th>Accessi</th><th></th></tr>
    <?php foreach ($last as $c): ?><tr><td><b><?= h($c['label'] ?: '—') ?></b><br><span class="hint" style="margin:0"><?= h($c['order_ref']) ?></span></td><td><span class="code"><?= h($c['code']) ?></span></td>
      <td><?= h(substr($c['last_used_at'], 0, 16)) ?></td><td><?= (int) $c['uses'] ?></td>
      <td><?php if ($c['invite_id']): ?><a class="btn sm" href="/editor?id=<?= (int) $c['invite_id'] ?>">Apri invito</a><?php endif; ?></td></tr><?php endforeach; ?></table></div><?php endif; ?></div>

<?php elseif ($p === 'codici'):
  $q = trim((string) ($_GET['q'] ?? ''));
  $sql = "SELECT c.*, i.slug, (SELECT COUNT(*) FROM guests g WHERE g.invite_id = c.invite_id) ng, (SELECT COUNT(*) FROM guests g WHERE g.invite_id = c.invite_id AND g.status = 'attending') na
          FROM codes c LEFT JOIN invites i ON i.id = c.invite_id";
  $par = [];
  if ($q !== '') { $sql .= ' WHERE c.code LIKE ? OR c.label LIKE ? OR c.order_ref LIKE ? OR c.email LIKE ? OR i.slug LIKE ?'; $par = array_fill(0, 5, "%$q%"); }
  $st = db()->prepare($sql . ' ORDER BY c.id DESC LIMIT 500'); $st->execute($par); $rows = $st->fetchAll();
  $ed = null; if ($eid = (int) ($_GET['edit'] ?? 0)) { $s = db()->prepare('SELECT * FROM codes WHERE id = ?'); $s->execute([$eid]); $ed = $s->fetch(); }
  $forInvite = (int) ($_GET['invite'] ?? 0); ?>
  <h2 style="margin:0 0 4px">Codici clienti</h2><p class="hint" style="margin:0 0 16px">Il cliente entra solo con questo codice su <b><?= h($site) ?>/</b> e vede solo il suo invito. Niente registrazione, niente password.</p>
  <?php if ($made): ?><div class="box" style="border-color:#c6e6d0;background:#f3faf5"><b style="color:#1f6b41">Codici appena generati</b>
    <textarea id="new" class="in" rows="<?= min(8, max(2, count($made))) ?>" readonly style="margin-top:8px;font:600 16px ui-monospace,monospace;letter-spacing:.08em"><?= h(implode("\n", $made)) ?></textarea>
    <button class="btn sm" style="margin-top:8px" onclick="navigator.clipboard.writeText(document.getElementById('new').value);this.textContent='Copiati'">Copia tutti</button></div><?php endif; ?>
  <div class="grid2">
    <form class="panel" method="post"><h3 class="serif" style="margin:0 0 12px;font-size:18px"><?= $ed ? 'Modifica codice' : 'Genera codice' ?></h3>
      <input type="hidden" name="csrf" value="<?= csrf() ?>"><input type="hidden" name="action" value="<?= $ed ? 'edit' : 'gen' ?>">
      <?php if ($ed): ?><input type="hidden" name="id" value="<?= (int) $ed['id'] ?>"><p style="margin:0 0 6px"><span class="code"><?= h($ed['code']) ?></span></p><?php endif; ?>
      <?php if ($forInvite && !$ed): ?><input type="hidden" name="invite_id" value="<?= $forInvite ?>"><div class="box soft" style="font-size:12px">Il codice verrà collegato all'invito <b>#<?= $forInvite ?></b> già esistente.</div><?php endif; ?>
      <label class="l">Nome cliente</label><input class="in" name="label" value="<?= h($ed['label'] ?? '') ?>" placeholder="es. Giulia Rossi">
      <label class="l">Numero ordine</label><input class="in" name="order_ref" value="<?= h($ed['order_ref'] ?? '') ?>" placeholder="es. #1042">
      <label class="l">Email cliente</label><input class="in" type="email" name="email" value="<?= h($ed['email'] ?? '') ?>" placeholder="per mandargli il codice">
      <div class="row2"><div><label class="l">Scadenza <span style="font-weight:400;color:var(--mute)">(facoltativa)</span></label><input class="in" type="date" name="expires_at" value="<?= h($ed['expires_at'] ?? '') ?>"></div>
        <?php if (!$ed && !$forInvite): ?><div><label class="l">Quanti codici</label><input class="in" type="number" name="qty" min="1" max="200" value="1"></div><?php endif; ?></div>
      <button class="btn pri" style="width:100%;margin-top:14px" type="submit"><?= $ed ? 'Salva modifiche' : 'Genera codice' ?></button>
      <?php if ($ed): ?><a class="btn" style="width:100%;margin-top:8px" href="/admin?p=codici">Annulla</a><?php endif; ?>
      <p class="hint">Ogni codice crea automaticamente il suo invito al primo accesso del cliente.</p></form>
    <div class="panel"><form method="get" class="rowx" style="margin-bottom:12px"><input type="hidden" name="p" value="codici"><input class="in" name="q" value="<?= h($q) ?>" placeholder="Cerca per codice, cliente, ordine, email..."><button class="btn">Cerca</button></form>
      <?php if (!$rows): ?><p class="hint">Nessun codice<?= $q ? ' per questa ricerca' : ' ancora' ?>.</p><?php else: ?>
      <div class="tbl-wrap"><table class="t"><tr><th>Codice</th><th>Cliente</th><th>Stato</th><th>Invito</th><th></th></tr>
      <?php foreach ($rows as $c): $scad = $c['expires_at'] && $c['expires_at'] < date('Y-m-d');
        $mail = $fill($c); $gm = 'https://mail.google.com/mail/?view=cm&fs=1&to=' . rawurlencode($c['email']) . '&su=' . rawurlencode('Il tuo codice Invitelle') . '&body=' . rawurlencode($mail); ?>
        <tr><td><span class="code" title="Clicca per copiare" onclick="navigator.clipboard.writeText('<?= h($c['code']) ?>');this.style.background='#e6f4ea'"><?= h($c['code']) ?></span></td>
          <td><b><?= h($c['label'] ?: '—') ?></b><br><span class="hint" style="margin:0"><?= h(trim($c['order_ref'] . ' ' . $c['email'])) ?></span></td>
          <td><?php if ($c['status'] !== 'active'): ?><span class="badge declined">Revocato</span><?php elseif ($scad): ?><span class="badge declined">Scaduto</span><?php else: ?><span class="badge attending">Attivo</span><?php endif; ?>
            <br><span class="hint" style="margin:4px 0 0;display:block"><?= $c['first_used_at'] ? 'Entrato ' . (int) $c['uses'] . ' volte · ultima ' . h(substr($c['last_used_at'], 0, 10)) : 'Mai entrato' ?></span></td>
          <td><?php if ($c['invite_id'] && $c['slug']): ?><a href="/i/<?= h($c['slug']) ?>" target="_blank">/i/<?= h($c['slug']) ?></a><br><span class="hint" style="margin:0"><?= (int) $c['ng'] ?> ospiti · <?= (int) $c['na'] ?> confermati</span><?php else: ?><span class="hint" style="margin:0">Si crea al primo accesso</span><?php endif; ?></td>
          <td><div class="acts">
            <?php if ($c['invite_id']): ?><a class="btn sm" href="/editor?id=<?= (int) $c['invite_id'] ?>">Apri</a><?php endif; ?>
            <button class="btn sm" type="button" onclick="navigator.clipboard.writeText(<?= h(json_encode($mail, JSON_UNESCAPED_UNICODE)) ?>);this.textContent='Copiato'">Copia messaggio</button>
            <?php if ($c['email']): ?><a class="btn sm" href="<?= h($gm) ?>" target="_blank" rel="noopener">Gmail</a><?php endif; ?>
            <a class="btn sm" href="/admin?p=codici&edit=<?= (int) $c['id'] ?>">Modifica</a>
            <form method="post"><input type="hidden" name="csrf" value="<?= csrf() ?>"><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int) $c['id'] ?>"><input type="hidden" name="q" value="<?= h($q) ?>"><button class="btn sm"><?= $c['status'] === 'active' ? 'Revoca' : 'Riattiva' ?></button></form>
            <form method="post" onsubmit="const w=confirm('Eliminare anche l\'invito del cliente? OK = elimina codice e invito, Annulla = elimina solo il codice');this.with_invite.value=w?1:'';return confirm('Confermi l\'eliminazione del codice <?= h($c['code']) ?>?')"><input type="hidden" name="csrf" value="<?= csrf() ?>"><input type="hidden" name="action" value="del"><input type="hidden" name="id" value="<?= (int) $c['id'] ?>"><input type="hidden" name="with_invite" value=""><button class="btn sm" style="color:var(--bad)">Elimina</button></form>
          </div></td></tr>
      <?php endforeach; ?></table></div><?php endif; ?></div></div>

<?php elseif ($p === 'inviti'):
  $rows = db()->query("SELECT i.*, (SELECT code FROM codes c WHERE c.invite_id = i.id LIMIT 1) code, (SELECT label FROM codes c WHERE c.invite_id = i.id LIMIT 1) cliente,
    (SELECT COUNT(*) FROM guests g WHERE g.invite_id = i.id) ng, (SELECT COUNT(*) FROM guests g WHERE g.invite_id = i.id AND g.status='attending') na, (SELECT COUNT(*) FROM album a WHERE a.invite_id = i.id) nal
    FROM invites i ORDER BY i.updated_at DESC")->fetchAll(); ?>
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><div><h2 style="margin:0">Inviti</h2><p class="hint" style="margin:2px 0 0">Tutti gli inviti, dei clienti e di prova. Da qui puoi aprirli e modificarli come admin.</p></div><span class="sp" style="flex:1"></span>
    <form method="post"><input type="hidden" name="csrf" value="<?= csrf() ?>"><input type="hidden" name="action" value="new_invite"><button class="btn pri">+ Invito di prova</button></form></div>
  <div class="inv-grid" style="margin-top:0"><?php foreach ($rows as $r): $d = json_decode($r['data'], true); ?>
    <div class="inv-c" style="cursor:default"><a href="/editor?id=<?= (int) $r['id'] ?>" style="text-decoration:none;color:inherit"><div class="cv" style="background-image:url('/media/themes/<?= h($d['theme'] ?? 'amalfi') ?>.jpg')"><div style="color:<?= h($d['details']['textColor'] ?? '#1c1c1c') ?>"><?= h(trim($d['details']['headline'] ?? '')) ?></div></div></a>
      <div class="mt"><b>/i/<?= h($r['slug']) ?></b><small><?= $r['cliente'] ? 'Cliente: ' . h($r['cliente']) : ($r['code'] ? h($r['code']) : 'Invito senza codice') ?> · <?= (int) $r['ng'] ?> ospiti · <?= (int) $r['na'] ?> confermati · <?= (int) $r['nal'] ?> foto</small>
        <div class="acts" style="margin-top:10px"><a class="btn sm pri" href="/editor?id=<?= (int) $r['id'] ?>">Modifica</a><a class="btn sm" href="/i/<?= h($r['slug']) ?>" target="_blank">Vedi</a>
          <?php if (!$r['code']): ?><a class="btn sm" href="/admin?p=codici&invite=<?= (int) $r['id'] ?>">Crea codice</a><?php endif; ?>
          <form method="post" onsubmit="return confirm('Eliminare questo invito con ospiti, risposte e album?')"><input type="hidden" name="csrf" value="<?= csrf() ?>"><input type="hidden" name="action" value="del_invite"><input type="hidden" name="id" value="<?= (int) $r['id'] ?>"><button class="btn sm" style="color:var(--bad)">Elimina</button></form></div></div></div>
  <?php endforeach; ?></div>

<?php elseif ($p === 'impostazioni'): ?>
  <div class="grid2" style="grid-template-columns:1fr 1fr">
    <form class="panel" method="post"><h2>Messaggio per il cliente</h2><p class="lead">È il testo copiato con "Copia messaggio" e precompilato su Gmail. Usa {nome}, {codice} e {link}.</p>
      <input type="hidden" name="csrf" value="<?= csrf() ?>"><input type="hidden" name="action" value="msg"><textarea class="in" name="msg" rows="11"><?= h($msgTpl) ?></textarea>
      <button class="btn pri" style="margin-top:12px">Salva messaggio</button></form>
    <form class="panel" method="post"><h2>Cambia password</h2><p class="lead">Accesso admin: <b><?= h($admin['email']) ?></b></p>
      <input type="hidden" name="csrf" value="<?= csrf() ?>"><input type="hidden" name="action" value="pass">
      <label class="l">Password attuale</label><input class="in" type="password" name="old" required autocomplete="current-password">
      <label class="l">Nuova password</label><input class="in" type="password" name="new" required minlength="8" autocomplete="new-password">
      <button class="btn pri" style="margin-top:12px">Cambia password</button></form></div>
<?php endif; ?>
</div></body></html>
