<?php
/**
 * JOFEMESA · caché rápida (drop-in de WordPress).
 *
 * Lo instala y lo retira el plugin «JOFEMESA · Núcleo». No lo edites aquí:
 * se sobrescribe al actualizar el plugin.
 *
 * WordPress carga este archivo al principio de todo (con WP_CACHE activo),
 * antes de Elementor y del resto de plugins. Si la página ya está en
 * uploads/jm-cache/, se envía tal cual y WordPress ni arranca: en este
 * hosting, arrancar WordPress cuesta de 2 a 5 segundos por petición.
 *
 * Las reglas son las mismas que las de includes/77-cache-catalogo.php, que
 * es quien genera y vacía los archivos.
 */
// jm-cache-rapida

if (!defined('ABSPATH')) {
    return;
}

(function () {
    if (PHP_SAPI === 'cli' || ($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        return;
    }
    if (defined('WP_ADMIN') || defined('DOING_AJAX') || defined('DOING_CRON') || defined('REST_REQUEST')) {
        return;
    }
    $uri = (string) ($_SERVER['REQUEST_URI'] ?? '/');
    $ruta = (string) strtok($uri, '?');
    if ($ruta === '' || str_contains($ruta, '..')) {
        return;
    }
    if (preg_match('#^/(wp-admin|wp-login|wp-json|wp-content|wp-includes|xmlrpc|feed|wp-cron)#', $ruta) || str_ends_with($ruta, '.php') || str_ends_with($ruta, '.xml') || str_ends_with($ruta, '.txt')) {
        return;
    }
    /* Con parámetros solo el catálogo (sus filtros se aplican en el navegador). */
    if (str_contains($uri, '?') && !str_starts_with($ruta, '/alquiler/')) {
        return;
    }
    if (isset($_GET['preview']) || isset($_GET['elementor-preview']) || isset($_GET['s']) || isset($_GET['p']) || isset($_GET['page_id'])) {
        return;
    }
    foreach (array_keys($_COOKIE) as $galleta) {
        if (str_starts_with($galleta, 'wordpress_logged_in_') || str_starts_with($galleta, 'wp-postpass_') || str_starts_with($galleta, 'comment_author_')) {
            return;
        }
    }

    $archivo = WP_CONTENT_DIR . '/uploads/jm-cache/' . md5('jm|' . $ruta) . '.html';
    if (!is_readable($archivo)) {
        return;
    }
    $t = (int) filemtime($archivo);
    try {
        $zona = new DateTimeZone('{{ZONA}}');
    } catch (Exception $e) {
        $zona = new DateTimeZone('UTC');
    }
    $hoy = (new DateTimeImmutable('now', $zona))->format('Ymd');
    $dia = (new DateTimeImmutable('@' . $t))->setTimezone($zona)->format('Ymd');
    if ((time() - $t) >= 86400 || $dia !== $hoy) {
        return;
    }

    header('Content-Type: text/html; charset=UTF-8');
    header('X-JM-Cache: HIT-RAPIDA');
    header('Cache-Control: no-cache, must-revalidate, max-age=0');
    readfile($archivo);
    exit;
})();
