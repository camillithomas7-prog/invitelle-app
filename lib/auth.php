<?php
// Accessi (stessa logica del pannello corsi 3D WEB LAB):
//  - admin: email + password, creati al primo accesso a /admin
//  - cliente: entra con il solo codice (INV-XXXX-XXXX) e vede solo il suo invito
require_once __DIR__ . '/db.php';

function boot_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_set_cookie_params(['lifetime' => 60 * 60 * 24 * 30, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off']);
    session_name('invitelle');
    session_start();
}

/* ───────── admin ───────── */
function current_admin(): ?array {
    boot_session();
    if (empty($_SESSION['admin_id'])) return null;
    $s = db()->prepare('SELECT * FROM admins WHERE id = ?');
    $s->execute([$_SESSION['admin_id']]);
    return $s->fetch() ?: null;
}
function is_admin(): bool { return current_admin() !== null; }
function require_admin_page(): array {
    $a = current_admin();
    if (!$a) { header('Location: /admin'); exit; }
    return $a;
}

/* ───────── cliente: accesso con il solo codice ───────── */
function current_code(): ?array {
    boot_session();
    if (empty($_SESSION['code_id'])) return null;
    $s = db()->prepare("SELECT * FROM codes WHERE id = ? AND status = 'active'");
    $s->execute([$_SESSION['code_id']]);
    $c = $s->fetch();
    if (!$c || ($c['expires_at'] && $c['expires_at'] < date('Y-m-d'))) { unset($_SESSION['code_id']); return null; }
    return $c;
}

function normalize_code(string $raw): string { return strtoupper(preg_replace('/[^A-Z0-9]/i', '', $raw)); }
function find_code(string $raw): ?array {
    $n = normalize_code($raw);
    if ($n === '') return null;
    // accetta il codice anche senza prefisso "INV"
    foreach (db()->query('SELECT * FROM codes')->fetchAll() as $c) {
        $k = normalize_code($c['code']);
        if ($k === $n || $k === 'INV' . $n) return $c;
    }
    return null;
}
function generate_code(): string {
    $al = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // niente 0/O/1/I
    $p = function (int $n) use ($al) { $o = ''; for ($i = 0; $i < $n; $i++) $o .= $al[random_int(0, strlen($al) - 1)]; return $o; };
    return 'INV-' . $p(4) . '-' . $p(4);
}

/* ───────── chi può toccare quale invito ───────── */
function can_access_invite(int $inviteId): bool {
    if ($inviteId <= 0) return false;
    if (is_admin()) return true;
    $c = current_code();
    return $c && (int) $c['invite_id'] === $inviteId;
}

/* ───────── CSRF per i form del pannello admin ───────── */
function csrf(): string {
    boot_session();
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
    return $_SESSION['csrf'];
}
function check_csrf(): void {
    boot_session();
    if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) { http_response_code(419); exit('Sessione scaduta, ricarica la pagina.'); }
}
