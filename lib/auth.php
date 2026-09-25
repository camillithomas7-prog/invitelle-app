<?php
// Accesso al pannello: una password per gli sposi/admin, salvata (hash) in data/admin.json
require_once __DIR__ . '/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(['lifetime' => 60 * 60 * 24 * 30, 'httponly' => true, 'samesite' => 'Lax', 'secure' => !empty($_SERVER['HTTPS'])]);
    session_start();
}

function admin_file(): string { return __DIR__ . '/../data/admin.json'; }
function admin_configured(): bool { return is_file(admin_file()); }
function is_admin(): bool { return !empty($_SESSION['invitelle_admin']); }

function admin_set_password(string $pwd): void {
    file_put_contents(admin_file(), json_encode(['hash' => password_hash($pwd, PASSWORD_DEFAULT)]));
    @chmod(admin_file(), 0600);
}

function admin_check(string $pwd): bool {
    $d = json_decode(@file_get_contents(admin_file()) ?: '{}', true);
    return !empty($d['hash']) && password_verify($pwd, $d['hash']);
}

// pagine del pannello: se non sei dentro, vai al login
function require_admin_page(): void {
    if (!is_admin()) { header('Location: /login?next=' . urlencode($_SERVER['REQUEST_URI'] ?? '/')); exit; }
}
