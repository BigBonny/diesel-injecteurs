<?php
/**
 * LeoBlog posts API endpoint for Next.js frontend
 * Place at: /var/www/clients/client0/web4/web/ps_blog.php  (same dir as ps_auth.php)
 * Access: http://192.162.69.186/ps_blog.php?token=DIESEL_BLOG_SECRET_2024
 *
 * Actual DB tables (prefix=new_):
 *   new_leoblog_blog       — id_leoblog_blog, id_leoblogcat, date_add, active, image, author_name
 *   new_leoblog_blog_lang  — id_leoblog_blog, id_lang, meta_title, description, content, link_rewrite
 *   new_leoblogcat         — id_leoblogcat
 *   new_leoblogcat_lang    — id_leoblogcat, id_lang, title, link_rewrite
 */
error_reporting(0);
define('_PS_ROOT_DIR_', dirname(__FILE__));
require_once(_PS_ROOT_DIR_ . '/config/config.inc.php');

$secret = 'DIESEL_BLOG_SECRET_2024';
$token  = isset($_GET['token']) ? $_GET['token'] : '';
if ($token !== $secret) {
    http_response_code(403);
    die(json_encode(['error' => 'Unauthorized']));
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$id_lang = (int)(isset($_GET['id_lang']) ? $_GET['id_lang'] : Configuration::get('PS_LANG_DEFAULT'));
$page    = max(1, (int)(isset($_GET['page'])  ? $_GET['page']  : 1));
$limit   = min(50, max(1, (int)(isset($_GET['limit']) ? $_GET['limit'] : 12)));
$offset  = ($page - 1) * $limit;

$db = Db::getInstance();

// Count active posts with a translation
$total = (int)$db->getValue("
    SELECT COUNT(*)
    FROM `new_leoblog_blog` p
    INNER JOIN `new_leoblog_blog_lang` pl
        ON p.id_leoblog_blog = pl.id_leoblog_blog AND pl.id_lang = {$id_lang}
    WHERE p.active = 1
        AND pl.meta_title != ''
");

// Fetch posts with category name
$rows = $db->executeS("
    SELECT
        p.id_leoblog_blog,
        p.date_add,
        p.image,
        p.author_name,
        pl.meta_title,
        pl.description      AS short_description,
        pl.content,
        pl.link_rewrite,
        cl.title            AS category_name,
        cl.link_rewrite     AS category_slug
    FROM `new_leoblog_blog` p
    INNER JOIN `new_leoblog_blog_lang` pl
        ON p.id_leoblog_blog = pl.id_leoblog_blog AND pl.id_lang = {$id_lang}
    LEFT JOIN `new_leoblogcat_lang` cl
        ON p.id_leoblogcat = cl.id_leoblogcat AND cl.id_lang = {$id_lang}
    WHERE p.active = 1
        AND pl.meta_title != ''
    ORDER BY p.date_add DESC
    LIMIT {$limit} OFFSET {$offset}
");

if (!is_array($rows)) {
    $rows = [];
}

// French month names
$months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

foreach ($rows as &$row) {
    // Rename PK field to match frontend interface
    $row['id_leoblog_post'] = $row['id_leoblog_blog'];
    unset($row['id_leoblog_blog']);

    // Format date
    if (!empty($row['date_add'])) {
        $ts = strtotime($row['date_add']);
        $row['date_formatted'] = $ts
            ? (date('d', $ts) . ' ' . $months[(int)date('n', $ts) - 1] . ' ' . date('Y', $ts))
            : $row['date_add'];
    } else {
        $row['date_formatted'] = '';
    }

    // Build image URL — LeoBlog stores images in modules/leoblog/views/img/
    if (!empty($row['image'])) {
        $row['image_url'] = _PS_BASE_URL_ . '/modules/leoblog/views/img/' . $row['image'];
    } else {
        $row['image_url'] = null;
    }
    unset($row['image']);

    // Estimate read time (~200 words/min)
    $wordCount = !empty($row['content']) ? str_word_count(strip_tags($row['content'])) : 0;
    $row['read_time'] = max(1, (int)round($wordCount / 200)) . ' min';

    // Strip HTML from short_description
    $row['short_description'] = !empty($row['short_description'])
        ? trim(strip_tags($row['short_description']))
        : '';
}
unset($row);

echo json_encode([
    'success' => true,
    'total'   => $total,
    'page'    => $page,
    'limit'   => $limit,
    'posts'   => $rows,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
