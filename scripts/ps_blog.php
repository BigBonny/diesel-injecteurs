<?php
/**
 * LeoBlog posts API endpoint for Next.js frontend
 * Place at: /var/www/clients/client0/web4/web/ps_blog.php  (same dir as ps_auth.php)
 * Uses raw PDO — no PS bootstrap needed.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$secret = 'DIESEL_BLOG_SECRET_2024';
$token  = isset($_GET['token']) ? $_GET['token'] : '';
if ($token !== $secret) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// DB credentials (hardcoded — same server, no security risk)
$db_host = '127.0.0.1';
$db_name = 'c0db_user_diesel';
$db_user = 'c0user_diesel';
$db_pass = 'FBVoc!Ztz45';
$shop_url = 'http://192.162.69.186';

try {
    $pdo = new PDO(
        "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4",
        $db_user, $db_pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed: ' . $e->getMessage()]);
    exit;
}

$id_lang   = max(1, (int)(isset($_GET['id_lang']) ? $_GET['id_lang'] : 1));
$page      = max(1, (int)(isset($_GET['page'])    ? $_GET['page']    : 1));
$limit     = min(50, max(1, (int)(isset($_GET['limit']) ? $_GET['limit'] : 12)));
$offset    = ($page - 1) * $limit;
$single_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

function formatRow(&$row, $months, $shop_url) {
    $row['id_leoblog_post'] = $row['id_leoblog_blog'];
    unset($row['id_leoblog_blog']);
    $ts = !empty($row['date_add']) ? strtotime($row['date_add']) : 0;
    $row['date_formatted'] = $ts
        ? (date('d', $ts) . ' ' . $months[(int)date('n', $ts) - 1] . ' ' . date('Y', $ts))
        : ($row['date_add'] ?? '');
    $row['image_url'] = !empty($row['image'])
        ? $shop_url . '/modules/leoblog/views/img/' . $row['image']
        : null;
    unset($row['image']);
    $wc = !empty($row['content']) ? str_word_count(strip_tags($row['content'])) : 0;
    $row['read_time'] = max(1, (int)round($wc / 200)) . ' min';
    $row['short_description'] = !empty($row['short_description'])
        ? trim(strip_tags($row['short_description']))
        : '';
}

// Single post fetch
if ($single_id > 0) {
    $stmt = $pdo->prepare("
        SELECT p.id_leoblog_blog, p.date_add, p.image, p.author_name,
               pl.meta_title, pl.description AS short_description, pl.content, pl.link_rewrite,
               cl.title AS category_name, cl.link_rewrite AS category_slug
        FROM `new_leoblog_blog` p
        INNER JOIN `new_leoblog_blog_lang` pl
            ON p.id_leoblog_blog = pl.id_leoblog_blog AND pl.id_lang = :id_lang
        LEFT JOIN `new_leoblogcat_lang` cl
            ON p.id_leoblogcat = cl.id_leoblogcat AND cl.id_lang = :id_lang2
        WHERE p.id_leoblog_blog = :id AND p.active = 1
        LIMIT 1
    ");
    $stmt->execute([':id_lang' => $id_lang, ':id_lang2' => $id_lang, ':id' => $single_id]);
    $row = $stmt->fetch();
    if (!$row) {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found', 'id' => $single_id, 'id_lang' => $id_lang]);
        exit;
    }
    formatRow($row, $months, $shop_url);
    echo json_encode(['success' => true, 'post' => $row], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Count active posts
$countStmt = $pdo->prepare("
    SELECT COUNT(*) FROM `new_leoblog_blog` p
    INNER JOIN `new_leoblog_blog_lang` pl
        ON p.id_leoblog_blog = pl.id_leoblog_blog AND pl.id_lang = :id_lang
    WHERE p.active = 1 AND pl.meta_title != ''
");
$countStmt->execute([':id_lang' => $id_lang]);
$total = (int)$countStmt->fetchColumn();

// Fetch posts list
$stmt = $pdo->prepare("
    SELECT p.id_leoblog_blog, p.date_add, p.image, p.author_name,
           pl.meta_title, pl.description AS short_description, pl.content, pl.link_rewrite,
           cl.title AS category_name, cl.link_rewrite AS category_slug
    FROM `new_leoblog_blog` p
    INNER JOIN `new_leoblog_blog_lang` pl
        ON p.id_leoblog_blog = pl.id_leoblog_blog AND pl.id_lang = :id_lang
    LEFT JOIN `new_leoblogcat_lang` cl
        ON p.id_leoblogcat = cl.id_leoblogcat AND cl.id_lang = :id_lang2
    WHERE p.active = 1 AND pl.meta_title != ''
    ORDER BY p.date_add DESC
    LIMIT :lim OFFSET :off
");
$stmt->bindValue(':id_lang',  $id_lang, PDO::PARAM_INT);
$stmt->bindValue(':id_lang2', $id_lang, PDO::PARAM_INT);
$stmt->bindValue(':lim',      $limit,   PDO::PARAM_INT);
$stmt->bindValue(':off',      $offset,  PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

foreach ($rows as &$row) {
    formatRow($row, $months, $shop_url);
}
unset($row);

echo json_encode([
    'success' => true,
    'total'   => $total,
    'page'    => $page,
    'limit'   => $limit,
    'posts'   => $rows,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
