<?php
// Connessione SQLite + schema + dati di default di un invito
date_default_timezone_set('Europe/Rome');

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    if (!is_dir(__DIR__ . '/../data')) mkdir(__DIR__ . '/../data', 0775, true);
    $pdo = new PDO('sqlite:' . __DIR__ . '/../data/invitelle.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys = ON');
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS invites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            data TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS guests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invite_id INTEGER NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            email TEXT DEFAULT '',
            phone_cc TEXT DEFAULT '+39',
            phone TEXT DEFAULT '',
            total_guests INTEGER DEFAULT 1,
            status TEXT DEFAULT 'pending',
            token TEXT UNIQUE,
            answers TEXT DEFAULT '{}',
            in_list INTEGER DEFAULT 1,
            responded_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS album (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invite_id INTEGER NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
            file TEXT NOT NULL,
            thumb TEXT DEFAULT '',
            kind TEXT NOT NULL,
            mime TEXT DEFAULT '',
            size INTEGER DEFAULT 0,
            original TEXT DEFAULT '',
            uploader TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now','localtime'))
        );
        CREATE TABLE IF NOT EXISTS planning (
            invite_id INTEGER PRIMARY KEY REFERENCES invites(id) ON DELETE CASCADE,
            data TEXT NOT NULL,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    ");
    // chiave segreta dell'album (va nel QR): colonna aggiunta alle installazioni esistenti
    $cols = array_column($pdo->query('PRAGMA table_info(invites)')->fetchAll(), 'name');
    if (!in_array('album_key', $cols)) $pdo->exec("ALTER TABLE invites ADD COLUMN album_key TEXT DEFAULT ''");
    // codice segreto per far cancellare all'ospite solo i file caricati da lui
    $acols = array_column($pdo->query('PRAGMA table_info(album)')->fetchAll(), 'name');
    if (!in_array('del_token', $acols)) $pdo->exec("ALTER TABLE album ADD COLUMN del_token TEXT DEFAULT ''");
    return $pdo;
}

function album_key(int $inviteId): string {
    $st = db()->prepare('SELECT album_key FROM invites WHERE id = ?');
    $st->execute([$inviteId]);
    $k = (string) $st->fetchColumn();
    if ($k === '') { $k = uid(10); db()->prepare('UPDATE invites SET album_key = ? WHERE id = ?')->execute([$k, $inviteId]); }
    return $k;
}

// miniatura JPEG per le foto (GD); per i formati non gestiti (es. HEIC) si mostra l'originale
function make_thumb(string $src, string $dst, int $max = 480): bool {
    $info = @getimagesize($src);
    if (!$info) return false;
    $img = match ($info[2]) { IMAGETYPE_JPEG => @imagecreatefromjpeg($src), IMAGETYPE_PNG => @imagecreatefrompng($src), IMAGETYPE_WEBP => @imagecreatefromwebp($src), IMAGETYPE_GIF => @imagecreatefromgif($src), default => false };
    if (!$img) return false;
    if ($info[2] === IMAGETYPE_JPEG && function_exists('exif_read_data')) {
        $o = @exif_read_data($src)['Orientation'] ?? 1;
        if ($o == 3) $img = imagerotate($img, 180, 0); elseif ($o == 6) $img = imagerotate($img, -90, 0); elseif ($o == 8) $img = imagerotate($img, 90, 0);
    }
    $w = imagesx($img); $h = imagesy($img); $r = min(1, $max / max($w, $h));
    $t = imagecreatetruecolor((int) ($w * $r), (int) ($h * $r));
    imagecopyresampled($t, $img, 0, 0, 0, 0, (int) ($w * $r), (int) ($h * $r), $w, $h);
    return imagejpeg($t, $dst, 80);
}

function uid(int $len = 10): string {
    return substr(bin2hex(random_bytes($len)), 0, $len);
}

function slugify(string $s): string {
    $s = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
    $s = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $s));
    return trim($s, '-') ?: 'invito';
}

function default_invite(): array {
    $b = fn($type, $data, $accent = '') => ['id' => uid(8), 'type' => $type, 'visible' => true, 'accent' => $accent, 'data' => $data];
    return [
        'theme' => 'amalfi',
        'envelope' => ['mode' => 'template', 'template' => 'ricamo', 'initials' => 'G & M', 'style' => 'ceralacca', 'color' => 'crema', 'seal' => 'rosso'],
        'details' => [
            'date' => '2027-06-19', 'endDate' => '', 'dateSize' => 19, 'datePos' => 'below',
            'headline' => "Giulia\n&\nMarco\n\nci sposiamo",
            'headlineFont' => 'Cinzel Decorative', 'headlineSize' => 30, 'textColor' => '#1c1c1c',
        ],
        'blocksStyle' => ['font' => 'Cormorant Garamond', 'color' => '#1c1c1c', 'flowers' => 'classico'],
        'blocks' => [
            $b('countdown', ['title' => 'Conto alla rovescia', 'subtitle' => 'Non vediamo l\'ora di festeggiare con voi', 'image' => '', 'bw' => false, 'darken' => true, 'darkness' => 45]),
            $b('venue', ['title' => 'Il luogo', 'days' => [[
                'label' => 'Sabato 19 giugno', 'name' => 'Villa Cimbrone', 'address' => 'Via Santa Chiara 26, 84010 Ravello SA, Italia',
                'maps' => '', 'image' => '',
            ]]]),
            $b('timeline', ['title' => 'Programma della giornata', 'items' => [
                ['time' => '16:00', 'title' => 'Cerimonia', 'text' => 'Nel giardino della villa'],
                ['time' => '17:30', 'title' => 'Aperitivo', 'text' => 'Terrazza dell\'Infinito'],
                ['time' => '20:00', 'title' => 'Cena', 'text' => 'Sotto il pergolato'],
                ['time' => '22:30', 'title' => 'Taglio della torta e festa', 'text' => ''],
            ]]),
            $b('dress', ['title' => 'Dress code', 'text' => 'Elegante estivo. Vi suggeriamo scarpe comode: il giardino è su terrazze.', 'colors' => ['#e9dcc4', '#b7c7a4', '#d9a5a0', '#8fa9c4']]),
            $b('gift', ['title' => 'Lista nozze', 'text' => 'La vostra presenza è il regalo più bello. Se desiderate contribuire al nostro viaggio di nozze:', 'iban' => 'IT60 X054 2811 1010 0000 0123 456', 'holder' => 'Giulia Rossi e Marco Bianchi', 'link' => '']),
            $b('faq', ['title' => 'Domande frequenti', 'items' => [
                ['q' => 'Posso portare un accompagnatore?', 'a' => 'Il numero di posti è indicato nel vostro invito personale.'],
                ['q' => 'C\'è parcheggio?', 'a' => 'Sì, un parcheggio riservato si trova a 200 metri dalla villa.'],
            ]]),
        ],
        'audio' => ['track' => 'dolce-piano', 'custom' => ''],
        'languages' => ['main' => 'it', 'extra' => ['en']],
        'rsvp' => [
            'enabled' => true, 'title' => 'Conferma la tua presenza', 'message' => true, 'song' => true, 'deadline' => '2027-05-01',
            'dietary' => true,
            'diets' => ['glutine' => true, 'lattosio' => true, 'vegetariano' => true, 'vegano' => true, 'frutta_secca' => true, 'pesce' => true],
            'otherAllergies' => true,
            'custom' => [['id' => uid(6), 'label' => 'Portata principale', 'required' => false, 'type' => 'choice', 'options' => ['Carne', 'Pesce', 'Vegetariano']]],
        ],
        'album' => ['enabled' => true, 'askName' => true, 'cardTitle' => 'Condividi i tuoi scatti', 'cardText' => 'Inquadra il codice e carica le foto e i video della festa'],
        'whatsapp' => "Ciao {nome}!\nAbbiamo il piacere di invitarti al nostro matrimonio.\nApri qui il tuo invito: {link}",
    ];
}

// Strumenti di pianificazione (privati: non finiscono mai nella pagina pubblica dell'invito)
function default_planning(): array {
    $cat = fn($name, $est) => ['id' => uid(6), 'name' => $name, 'estimated' => $est, 'actual' => 0, 'paid' => 0, 'note' => ''];
    $t = fn($title, $when) => ['id' => uid(6), 'title' => $title, 'when' => $when, 'done' => false, 'due' => ''];
    return [
        'budget' => [
            'total' => 35000,
            'categories' => [
                $cat('Location e ricevimento', 13500), $cat('Fotografo e video', 3000), $cat('Abito della sposa', 2500), $cat('Abito dello sposo', 900),
                $cat('Fiori e allestimenti', 2200), $cat('Musica e intrattenimento', 1500), $cat('Partecipazioni e grafica', 300), $cat('Fedi nuziali', 1200),
                $cat('Trucco e parrucco', 500), $cat('Bomboniere', 800), $cat('Torta nuziale', 600), $cat('Cerimonia (chiesa o comune)', 400),
                $cat('Trasporti', 500), $cat('Viaggio di nozze', 4000), $cat('Imprevisti', 1000),
            ],
        ],
        'checklist' => [
            $t('Stabilire il budget complessivo', '12'), $t('Scegliere la data', '12'), $t('Stilare una prima lista invitati', '12'), $t('Scegliere e prenotare la location', '12'),
            $t('Scegliere rito civile o religioso', '12'), $t('Scegliere i testimoni', '12'),
            $t('Prenotare fotografo e videomaker', '9'), $t('Scegliere il catering', '9'), $t('Prenotare musica o DJ', '9'), $t('Iniziare a cercare l\'abito', '9'), $t('Creare la lista nozze', '9'),
            $t('Inviare il save the date', '6'), $t('Scegliere il fiorista', '6'), $t('Prenotare il viaggio di nozze', '6'), $t('Prenotare trucco e parrucco', '6'), $t('Organizzare hotel per gli ospiti', '6'),
            $t('Inviare gli inviti digitali Invitelle', '3'), $t('Ordinare le fedi', '3'), $t('Scegliere la torta', '3'), $t('Definire il menù e la degustazione', '3'), $t('Scegliere le bomboniere', '3'), $t('Preparare i documenti (pubblicazioni)', '3'),
            $t('Sollecitare le conferme RSVP', '1'), $t('Comunicare il numero ospiti al catering', '1'), $t('Definire la disposizione dei tavoli', '1'), $t('Prova trucco e acconciatura', '1'), $t('Ultima prova dell\'abito', '1'), $t('Preparare la scaletta della giornata', '1'),
            $t('Confermare orari con tutti i fornitori', '0'), $t('Preparare le buste per i pagamenti', '0'), $t('Consegnare il tableau alla location', '0'), $t('Riposarsi e godersi il momento', '0'),
        ],
        'tables' => [
            ['id' => uid(6), 'name' => 'Tavolo degli sposi', 'shape' => 'rect', 'seats' => 8, 'people' => []],
            ['id' => uid(6), 'name' => 'Tavolo 1', 'shape' => 'round', 'seats' => 8, 'people' => []],
            ['id' => uid(6), 'name' => 'Tavolo 2', 'shape' => 'round', 'seats' => 8, 'people' => []],
            ['id' => uid(6), 'name' => 'Tavolo 3', 'shape' => 'round', 'seats' => 8, 'people' => []],
        ],
        'extras' => [],
    ];
}

function planning_get(int $inviteId): array {
    $st = db()->prepare('SELECT data FROM planning WHERE invite_id = ?');
    $st->execute([$inviteId]);
    $d = $st->fetchColumn();
    return $d ? json_decode($d, true) : default_planning();
}

function invite_by_id(int $id): ?array {
    $st = db()->prepare('SELECT * FROM invites WHERE id = ?');
    $st->execute([$id]);
    $r = $st->fetch();
    if (!$r) return null;
    $r['data'] = json_decode($r['data'], true);
    return $r;
}

function invite_by_slug(string $slug): ?array {
    $st = db()->prepare('SELECT * FROM invites WHERE slug = ?');
    $st->execute([$slug]);
    $r = $st->fetch();
    if (!$r) return null;
    $r['data'] = json_decode($r['data'], true);
    return $r;
}

function create_invite(): int {
    $data = default_invite();
    $slug = 'giulia-e-marco';
    $n = 1;
    while (invite_by_slug($slug)) $slug = 'giulia-e-marco-' . (++$n);
    db()->prepare('INSERT INTO invites (slug, data) VALUES (?, ?)')->execute([$slug, json_encode($data, JSON_UNESCAPED_UNICODE)]);
    $id = (int) db()->lastInsertId();
    // ospiti di esempio
    $g = db()->prepare('INSERT INTO guests (invite_id, name, email, phone_cc, phone, total_guests, status, token, answers, responded_at) VALUES (?,?,?,?,?,?,?,?,?,?)');
    $g->execute([$id, 'Luca e Sara Ferri', 'luca.ferri@example.com', '+39', '3331234567', 2, 'attending', uid(12), json_encode(['party' => [['name' => 'Luca', 'diets' => []], ['name' => 'Sara', 'diets' => ['vegetariano']]], 'message' => 'Non vediamo l\'ora!', 'song' => 'Perfect - Ed Sheeran']), date('Y-m-d H:i:s')]);
    $g->execute([$id, 'Nonna Anna', '', '+39', '3339876543', 1, 'pending', uid(12), '{}', null]);
    $g->execute([$id, 'Paolo Conti', 'paolo@example.com', '+39', '', 1, 'pending', uid(12), '{}', null]);
    return $id;
}

function json_out($data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function h($s): string {
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}
