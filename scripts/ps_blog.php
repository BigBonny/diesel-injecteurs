<?php
/**
 * LeoBlog posts API endpoint for Next.js frontend
 * Place at: /var/www/clients/client0/web4/web/ps_blog.php  (same dir as ps_auth.php)
 * Access: http://192.162.69.186/ps_blog.php?token=DIESEL_BLOG_SECRET_2024
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
$prefix = _DB_PREFIX_;

// Count active posts that have a translation for this language
$total = (int)$db->getValue("
    SELECT COUNT(DISTINCT p.id_leoblog_post)
    FROM `{$prefix}leoblog_post` p
    INNER JOIN `{$prefix}leoblog_post_lang` pl
        ON p.id_leoblog_post = pl.id_leoblog_post AND pl.id_lang = {$id_lang}
    WHERE p.active = 1
        AND pl.meta_title != ''
");

// Fetch posts
$rows = $db->executeS("
    SELECT
        p.id_leoblog_post,
        p.date_add,
        pl.meta_title,
        pl.short_description,
        pl.content,
        pl.link_rewrite,
        pl.meta_keywords,
        (SELECT cl.name FROM `{$prefix}leoblog_cat_lang` cl
         INNER JOIN `{$prefix}leoblog_post_category` pc ON pc.id_leoblog_cat = cl.id_leoblog_cat
         WHERE pc.id_leoblog_post = p.id_leoblog_post AND cl.id_lang = {$id_lang}
         LIMIT 1) AS category_name,
        (SELECT cl2.link_rewrite FROM `{$prefix}leoblog_cat_lang` cl2
         INNER JOIN `{$prefix}leoblog_post_category` pc2 ON pc2.id_leoblog_cat = cl2.id_leoblog_cat
         WHERE pc2.id_leoblog_post = p.id_leoblog_post AND cl2.id_lang = {$id_lang}
         LIMIT 1) AS category_slug,
        (SELECT image FROM `{$prefix}leoblog_post_image` WHERE id_leoblog_post = p.id_leoblog_post AND cover = 1 LIMIT 1) AS image_file
    FROM `{$prefix}leoblog_post` p
    INNER JOIN `{$prefix}leoblog_post_lang` pl
        ON p.id_leoblog_post = pl.id_leoblog_post AND pl.id_lang = {$id_lang}
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
    // Format date
    if (!empty($row['date_add'])) {
        $ts = strtotime($row['date_add']);
        $row['date_formatted'] = $ts
            ? (date('d', $ts) . ' ' . $months[(int)date('n', $ts) - 1] . ' ' . date('Y', $ts))
            : $row['date_add'];
    } else {
        $row['date_formatted'] = '';
    }

    // Build image URL
    if (!empty($row['image_file'])) {
        $row['image_url'] = _PS_BASE_URL_ . '/modules/leoblog/views/img/' . $row['image_file'];
    } else {
        $row['image_url'] = null;
    }
    unset($row['image_file']);

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
