<?php
// API JSON del pannello e del modulo RSVP
require_once __DIR__ . '/../lib/auth.php';

$a = $_GET['a'] ?? '';
$in = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
// azioni aperte agli ospiti (invito, RSVP, album); tutto il resto richiede l'accesso (admin o codice cliente)
$public = ['rsvp.submit', 'guest.byToken', 'album.upload', 'album.guestDelete'];
if (!in_array($a, $public, true)) {
    if (!is_admin() && !current_code()) json_out(['error' => 'Accesso richiesto: rientra con il tuo codice'], 401);
    if (in_array($a, ['invite.create', 'invite.delete'], true) && !is_admin()) json_out(['error' => 'Solo l\'admin può farlo'], 403);
    // ogni azione su un invito: il cliente può toccare solo il suo
    if ($a !== 'upload') {
        $iid = (int) ($in['invite_id'] ?? $in['id'] ?? $_GET['invite_id'] ?? 0);
        if (!can_access_invite($iid)) json_out(['error' => 'Non hai accesso a questo invito'], 403);
    }
}

function guest_row(array $g): array {
    $g['answers'] = json_decode($g['answers'] ?: '{}', true) ?: new stdClass();
    $g['id'] = (int) $g['id'];
    $g['total_guests'] = (int) $g['total_guests'];
    return $g;
}

function guests_payload(int $inviteId): array {
    $st = db()->prepare('SELECT * FROM guests WHERE invite_id = ? ORDER BY id DESC');
    $st->execute([$inviteId]);
    $rows = array_map('guest_row', $st->fetchAll());
    $stats = ['pending' => 0, 'attending' => 0, 'declined' => 0, 'people' => 0];
    foreach ($rows as $r) {
        $stats[$r['status']]++;
        if ($r['status'] === 'attending') $stats['people'] += max(1, count($r['answers']['party'] ?? []) ?: $r['total_guests']);
    }
    return ['guests' => $rows, 'stats' => $stats];
}

function norm_phone(string $p): string {
    return preg_replace('/\D+/', '', $p);
}

switch ($a) {
    case 'invite.create':
        json_out(['id' => create_invite(true)]);

    case 'invite.save':
        $id = (int) ($in['id'] ?? 0);
        if (!invite_by_id($id)) json_out(['error' => 'Invito non trovato'], 404);
        db()->prepare('UPDATE invites SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            ->execute([json_encode($in['data'], JSON_UNESCAPED_UNICODE), $id]);
        json_out(['ok' => true]);

    case 'invite.slug':
        $id = (int) ($in['id'] ?? 0);
        $slug = slugify($in['slug'] ?? '');
        if (strlen($slug) < 3) json_out(['error' => 'Il link deve avere almeno 3 caratteri'], 400);
        $other = invite_by_slug($slug);
        if ($other && (int) $other['id'] !== $id) json_out(['error' => 'Questo link è già usato da un altro invito'], 409);
        db()->prepare('UPDATE invites SET slug = ? WHERE id = ?')->execute([$slug, $id]);
        json_out(['slug' => $slug]);

    case 'invite.delete':
        db()->prepare('DELETE FROM invites WHERE id = ?')->execute([(int) ($in['id'] ?? 0)]);
        json_out(['ok' => true]);

    case 'upload':
        $f = $_FILES['file'] ?? null;
        if (!$f && ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) json_out(['error' => 'File troppo grande (max 20 MB)'], 400);
        if (in_array($f['error'] ?? 0, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE])) json_out(['error' => 'File troppo grande (max 20 MB)'], 400);
        if (!$f || $f['error'] !== UPLOAD_ERR_OK) json_out(['error' => 'Caricamento non riuscito'], 400);
        $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
        $ok = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp3', 'wav', 'ogg', 'm4a'];
        if (!in_array($ext, $ok)) json_out(['error' => 'Formato non supportato'], 400);
        if ($f['size'] > 20 * 1024 * 1024) json_out(['error' => 'File troppo grande (max 20 MB)'], 400);
        $dir = __DIR__ . '/uploads';
        if (!is_dir($dir)) mkdir($dir, 0775, true);
        $name = uid(14) . '.' . $ext;
        move_uploaded_file($f['tmp_name'], "$dir/$name");
        json_out(['url' => "/uploads/$name", 'name' => $f['name']]);

    case 'planning.get':
        json_out(planning_get((int) ($_GET['invite_id'] ?? 0)));

    case 'planning.save':
        $id = (int) ($in['invite_id'] ?? 0);
        if (!invite_by_id($id)) json_out(['error' => 'Invito non trovato'], 404);
        db()->prepare('INSERT INTO planning (invite_id, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(invite_id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP')
            ->execute([$id, json_encode($in['data'], JSON_UNESCAPED_UNICODE)]);
        json_out(['ok' => true]);

    case 'budget.csv':
        $p = planning_get((int) ($_GET['invite_id'] ?? 0));
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="budget-matrimonio.csv"');
        $out = fopen('php://output', 'w');
        fwrite($out, "\xEF\xBB\xBF");
        fputcsv($out, ['Voce', 'Preventivo', 'Costo effettivo', 'Pagato', 'Da pagare', 'Note'], ';', '"', '');
        $tot = [0, 0, 0];
        foreach ($p['budget']['categories'] as $c) {
            $cost = $c['actual'] ?: $c['estimated'];
            fputcsv($out, [$c['name'], $c['estimated'], $c['actual'], $c['paid'], max(0, $cost - $c['paid']), $c['note']], ';', '"', '');
            $tot[0] += $c['estimated']; $tot[1] += $c['actual']; $tot[2] += $c['paid'];
        }
        fputcsv($out, ['TOTALE', $tot[0], $tot[1], $tot[2], '', 'Budget: ' . $p['budget']['total']], ';', '"', '');
        exit;

    // ---------- ALBUM FOTO E VIDEO DEGLI OSPITI ----------
    case 'album.info':
        $id = (int) ($_GET['invite_id'] ?? 0);
        $inv = invite_by_id($id);
        if (!$inv) json_out(['error' => 'Invito non trovato'], 404);
        json_out(['key' => album_key($id), 'slug' => $inv['slug']]);

    case 'album.regen':
        $id = (int) ($in['invite_id'] ?? 0);
        db()->prepare('UPDATE invites SET album_key = ? WHERE id = ?')->execute([uid(10), $id]);
        json_out(['key' => album_key($id)]);

    case 'album.upload':
        $inv = invite_by_slug($_POST['slug'] ?? '');
        if (!$inv || !hash_equals(album_key((int) $inv['id']), (string) ($_POST['k'] ?? ''))) json_out(['error' => 'Link dell\'album non valido'], 403);
        if (($inv['data']['album']['enabled'] ?? true) === false) json_out(['error' => 'Gli sposi hanno chiuso l\'album'], 403);
        $f = $_FILES['file'] ?? null;
        if (!$f && ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) json_out(['error' => 'File troppo grande'], 400);
        if (!$f || $f['error'] !== UPLOAD_ERR_OK) json_out(['error' => in_array($f['error'] ?? 0, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE]) ? 'File troppo grande' : 'Caricamento non riuscito'], 400);
        $mime = mime_content_type($f['tmp_name']) ?: '';
        $kind = str_starts_with($mime, 'image/') ? 'photo' : (str_starts_with($mime, 'video/') ? 'video' : '');
        if (!$kind) json_out(['error' => 'Puoi caricare solo foto e video'], 400);
        $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION)) ?: ($kind === 'photo' ? 'jpg' : 'mp4');
        $allowed = $kind === 'photo' ? ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif', 'avif'] : ['mp4', 'mov', 'm4v', 'webm', '3gp', 'avi', 'mkv'];
        if (!in_array($ext, $allowed, true)) $ext = $kind === 'photo' ? 'jpg' : 'mp4';
        $dir = __DIR__ . "/uploads/album/{$inv['id']}";
        if (!is_dir($dir)) mkdir($dir, 0775, true);
        $name = uid(16);
        move_uploaded_file($f['tmp_name'], "$dir/$name.$ext");
        $thumb = '';
        if ($kind === 'photo' && make_thumb("$dir/$name.$ext", "$dir/$name.thumb.jpg")) $thumb = "/uploads/album/{$inv['id']}/$name.thumb.jpg";
        $tok = uid(20);
        db()->prepare('INSERT INTO album (invite_id, file, thumb, kind, mime, size, original, uploader, del_token) VALUES (?,?,?,?,?,?,?,?,?)')
            ->execute([$inv['id'], "/uploads/album/{$inv['id']}/$name.$ext", $thumb, $kind, $mime, $f['size'], mb_substr($f['name'], 0, 120), mb_substr(trim($_POST['name'] ?? ''), 0, 60), $tok]);
        json_out(['ok' => true, 'kind' => $kind, 'id' => (int) db()->lastInsertId(), 'token' => $tok, 'thumb' => $thumb ?: "/uploads/album/{$inv['id']}/$name.$ext"]);

    case 'album.guestDelete':
        // l'ospite cancella un file che ha caricato lui (serve il codice ricevuto al caricamento)
        $inv = invite_by_slug($in['slug'] ?? '');
        if (!$inv || !hash_equals(album_key((int) $inv['id']), (string) ($in['k'] ?? ''))) json_out(['error' => 'Link non valido'], 403);
        $st = db()->prepare('SELECT * FROM album WHERE id = ? AND invite_id = ?');
        $st->execute([(int) ($in['id'] ?? 0), $inv['id']]);
        $r = $st->fetch();
        if (!$r) json_out(['ok' => true, 'gone' => true]);
        if (!$r['del_token'] || !hash_equals($r['del_token'], (string) ($in['token'] ?? ''))) json_out(['error' => 'Puoi eliminare solo i file caricati da te'], 403);
        @unlink(__DIR__ . $r['file']); if ($r['thumb']) @unlink(__DIR__ . $r['thumb']);
        db()->prepare('DELETE FROM album WHERE id = ?')->execute([$r['id']]);
        json_out(['ok' => true]);

    case 'album.list':
        $st = db()->prepare('SELECT * FROM album WHERE invite_id = ? ORDER BY id DESC');
        $st->execute([(int) ($_GET['invite_id'] ?? 0)]);
        $items = $st->fetchAll();
        json_out(['items' => $items, 'photos' => count(array_filter($items, fn($i) => $i['kind'] === 'photo')), 'videos' => count(array_filter($items, fn($i) => $i['kind'] === 'video')), 'bytes' => array_sum(array_column($items, 'size'))]);

    case 'album.delete':
        $id = (int) ($in['invite_id'] ?? 0);
        $ids = array_map('intval', $in['ids'] ?? []);
        foreach ($ids as $aid) {
            $st = db()->prepare('SELECT * FROM album WHERE id = ? AND invite_id = ?'); $st->execute([$aid, $id]);
            if ($r = $st->fetch()) { @unlink(__DIR__ . $r['file']); if ($r['thumb']) @unlink(__DIR__ . $r['thumb']); db()->prepare('DELETE FROM album WHERE id = ?')->execute([$aid]); }
        }
        json_out(['ok' => true]);

    case 'album.zip':
        $id = (int) ($_GET['invite_id'] ?? 0);
        $inv = invite_by_id($id);
        $ids = array_filter(array_map('intval', explode(',', $_GET['ids'] ?? '')));
        $st = db()->prepare('SELECT * FROM album WHERE invite_id = ? ORDER BY id');
        $st->execute([$id]);
        $rows = array_filter($st->fetchAll(), fn($r) => !$ids || in_array((int) $r['id'], $ids));
        if (!$rows) { http_response_code(404); exit('Nessun file'); }
        $tmp = tempnam(sys_get_temp_dir(), 'alb');
        $zip = new ZipArchive(); $zip->open($tmp, ZipArchive::OVERWRITE);
        $n = 0;
        foreach ($rows as $r) {
            $n++;
            $who = $r['uploader'] ? '-' . preg_replace('/[^A-Za-z0-9]+/', '_', $r['uploader']) : '';
            $zip->addFile(__DIR__ . $r['file'], ($r['kind'] === 'photo' ? 'foto/' : 'video/') . sprintf('%04d', $n) . $who . '.' . pathinfo($r['file'], PATHINFO_EXTENSION));
        }
        $zip->close();
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="album-' . ($inv['slug'] ?? 'matrimonio') . '.zip"');
        header('Content-Length: ' . filesize($tmp));
        readfile($tmp); unlink($tmp);
        exit;

    case 'guests.list':
        json_out(guests_payload((int) ($_GET['invite_id'] ?? 0)));

    case 'guests.save':
        $g = $in['guest'] ?? [];
        $inviteId = (int) ($in['invite_id'] ?? 0);
        if (trim($g['name'] ?? '') === '') json_out(['error' => 'Il nome è obbligatorio'], 400);
        if (trim($g['email'] ?? '') === '' && trim($g['phone'] ?? '') === '') json_out(['error' => 'Serve almeno email o telefono'], 400);
        $vals = [trim($g['name']), trim($g['email'] ?? ''), $g['phone_cc'] ?? '+39', norm_phone($g['phone'] ?? ''), max(1, (int) ($g['total_guests'] ?? 1))];
        if (!empty($g['id'])) {
            $status = in_array($g['status'] ?? '', ['pending', 'attending', 'declined']) ? $g['status'] : 'pending';
            db()->prepare('UPDATE guests SET name=?, email=?, phone_cc=?, phone=?, total_guests=?, status=?, in_list=1 WHERE id=? AND invite_id=?')
                ->execute([...$vals, $status, (int) $g['id'], $inviteId]);
        } else {
            db()->prepare('INSERT INTO guests (invite_id, name, email, phone_cc, phone, total_guests, token) VALUES (?,?,?,?,?,?,?)')
                ->execute([$inviteId, ...$vals, uid(12)]);
        }
        json_out(guests_payload($inviteId));

    case 'guests.delete':
        $inviteId = (int) ($in['invite_id'] ?? 0);
        db()->prepare('DELETE FROM guests WHERE id = ? AND invite_id = ?')->execute([(int) ($in['id'] ?? 0), $inviteId]);
        json_out(guests_payload($inviteId));

    case 'guests.csv':
        $inviteId = (int) ($_GET['invite_id'] ?? 0);
        $inv = invite_by_id($inviteId);
        $p = guests_payload($inviteId);
        $custom = $inv['data']['rsvp']['custom'] ?? [];
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="ospiti-' . ($inv['slug'] ?? 'invito') . '.csv"');
        $out = fopen('php://output', 'w');
        fwrite($out, "\xEF\xBB\xBF");
        $labels = ['pending' => 'In attesa', 'attending' => 'Partecipa', 'declined' => 'Non partecipa'];
        fputcsv($out, array_merge(['Nome', 'Email', 'Telefono', 'Posti', 'Stato', 'Persone e allergie', 'Messaggio', 'Canzone'], array_column($custom, 'label'), ['Risposto il', 'In lista']), ';', '"', '');
        foreach ($p['guests'] as $g) {
            $a = (array) $g['answers'];
            $dn = ['glutine' => 'senza glutine', 'lattosio' => 'senza lattosio', 'vegetariano' => 'vegetariano', 'vegano' => 'vegano', 'frutta_secca' => 'allergia frutta secca', 'pesce' => 'allergia pesce'];
            $party = implode(' | ', array_map(fn($x) => ($x['name'] ?? '') . (empty($x['diets']) && empty($x['other']) ? '' : ' (' . implode(', ', array_filter(array_merge(array_map(fn($d) => $dn[$d] ?? $d, $x['diets'] ?? []), [$x['other'] ?? '']))) . ')'), $a['party'] ?? []));
            $row = [$g['name'], $g['email'], $g['phone'] ? $g['phone_cc'] . ' ' . $g['phone'] : '', $g['total_guests'], $labels[$g['status']], $party, $a['message'] ?? '', $a['song'] ?? ''];
            foreach ($custom as $q) $row[] = $a['custom'][$q['id']] ?? '';
            $row[] = $g['responded_at'] ?? '';
            $row[] = $g['in_list'] ? 'Sì' : 'No (aggiunto da RSVP)';
            fputcsv($out, $row, ';', '"', '');
        }
        exit;

    case 'rsvp.submit':
        $inv = invite_by_slug($in['slug'] ?? '');
        if (!$inv) json_out(['error' => 'Invito non trovato'], 404);
        $name = trim($in['name'] ?? '');
        $email = strtolower(trim($in['email'] ?? ''));
        $phone = norm_phone($in['phone'] ?? '');
        if ($name === '' || ($email === '' && $phone === '')) json_out(['error' => 'Inserisci nome ed email o telefono'], 400);
        $status = !empty($in['attending']) ? 'attending' : 'declined';
        $answers = json_encode([
            'party' => $in['party'] ?? [], 'message' => $in['message'] ?? '', 'song' => $in['song'] ?? '', 'custom' => $in['custom'] ?? new stdClass(),
        ], JSON_UNESCAPED_UNICODE);

        // abbinamento: link personale → email → telefono
        $guest = null;
        if (!empty($in['token'])) {
            $st = db()->prepare('SELECT * FROM guests WHERE token = ? AND invite_id = ?');
            $st->execute([$in['token'], $inv['id']]);
            $guest = $st->fetch() ?: null;
        }
        if (!$guest && $email !== '') {
            $st = db()->prepare('SELECT * FROM guests WHERE lower(email) = ? AND invite_id = ?');
            $st->execute([$email, $inv['id']]);
            $guest = $st->fetch() ?: null;
        }
        if (!$guest && $phone !== '') {
            $st = db()->prepare("SELECT * FROM guests WHERE phone != '' AND invite_id = ?");
            $st->execute([$inv['id']]);
            foreach ($st->fetchAll() as $r) {
                if (str_ends_with($phone, $r['phone']) || str_ends_with($r['phone'], $phone)) { $guest = $r; break; }
            }
        }
        if ($guest) {
            db()->prepare("UPDATE guests SET status=?, answers=?, responded_at=datetime('now','localtime'), email=CASE WHEN email = '' THEN ? ELSE email END, phone=CASE WHEN phone = '' THEN ? ELSE phone END WHERE id=?")
                ->execute([$status, $answers, $email, $phone, $guest['id']]);
        } else {
            db()->prepare("INSERT INTO guests (invite_id, name, email, phone_cc, phone, total_guests, status, token, answers, in_list, responded_at) VALUES (?,?,?,?,?,?,?,?,?,0,datetime('now','localtime'))")
                ->execute([$inv['id'], $name, $email, $in['phone_cc'] ?? '+39', $phone, max(1, count($in['party'] ?? [])), $status, uid(12), $answers]);
        }
        json_out(['ok' => true, 'status' => $status]);

    case 'guest.byToken':
        $st = db()->prepare('SELECT g.name, g.email, g.phone_cc, g.phone, g.total_guests, g.status, g.answers FROM guests g JOIN invites i ON i.id = g.invite_id WHERE g.token = ? AND i.slug = ?');
        $st->execute([$_GET['token'] ?? '', $_GET['slug'] ?? '']);
        $g = $st->fetch();
        if ($g) $g['answers'] = json_decode($g['answers'], true);
        json_out(['guest' => $g ?: null]);

    default:
        json_out(['error' => 'Azione sconosciuta'], 404);
}
