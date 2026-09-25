<?php
// Router per il server PHP integrato: php -S localhost:8486 -t public router.php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . '/public' . $path;

if ($path !== '/' && is_file($file) && !str_ends_with($path, '.php')) return false;

if (preg_match('#^/i/([a-z0-9-]+)/?$#', $path, $m)) {
    $_GET['slug'] = $m[1];
    require __DIR__ . '/public/invito.php';
    return true;
}
if (preg_match('#^/album/([a-z0-9-]+)/?$#', $path, $m)) {
    $_GET['slug'] = $m[1];
    require __DIR__ . '/public/album.php';
    return true;
}
if ($path === '/' || $path === '/index.php') { require __DIR__ . '/public/index.php'; return true; }
if ($path === '/login') { require __DIR__ . '/public/login.php'; return true; }
if ($path === '/editor') { require __DIR__ . '/public/editor.php'; return true; }
if ($path === '/api') { require __DIR__ . '/public/api.php'; return true; }

http_response_code(404);
echo 'Pagina non trovata';
