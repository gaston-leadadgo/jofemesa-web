<?php
/**
 * Caché de página del catálogo: /alquiler/ y /alquiler/{familia}/.
 *
 * Los filtros trabajan sobre las tarjetas ya pintadas, así que estas
 * páginas imprimen las ~200 máquinas con el Loop Grid de Elementor. Sin
 * caché eso son unos 11 segundos de servidor en cada visita (medido el
 * 03/11/2026). Aquí la página se genera una vez y se guarda como HTML en
 * uploads/jm-cache/; las visitas siguientes la sirven tal cual.
 *
 * Solo para visitantes anónimos y peticiones GET. Los filtros van en la URL
 * pero se aplican en el navegador: el HTML es el mismo para cualquier
 * consulta, así que la clave es solo la ruta.
 *
 * Se vacía sola al guardar o borrar cualquier entrada (máquinas, páginas,
 * plantillas), al cambiar un término, al guardar en Elementor, al importar
 * y al actualizar el plugin. Y caduca a las 24 horas en cualquier caso.
 *
 * Cabecera de control: X-JM-Cache: HIT | MISS.
 */

if (!defined('ABSPATH')) {
    exit;
}

function jm_cache_dir(): string
{
    $subidas = wp_upload_dir();
    return trailingslashit($subidas['basedir']) . 'jm-cache/';
}

function jm_cache_aplica(): bool
{
    if (is_user_logged_in() || is_admin() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return false;
    }
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
        return false;
    }
    if (isset($_GET['preview']) || isset($_GET['elementor-preview']) || isset($_GET['s'])) {
        return false;
    }
    return is_page('alquiler') || is_tax('familia');
}

function jm_cache_archivo(): string
{
    $ruta = strtok((string) ($_SERVER['REQUEST_URI'] ?? '/'), '?');
    return jm_cache_dir() . md5(JM_VERSION . '|' . $ruta) . '.html';
}

add_action('template_redirect', function () {
    if (!jm_cache_aplica()) {
        return;
    }
    $archivo = jm_cache_archivo();
    if (is_readable($archivo) && (time() - (int) filemtime($archivo)) < DAY_IN_SECONDS) {
        header('X-JM-Cache: HIT');
        readfile($archivo);
        exit;
    }
    header('X-JM-Cache: MISS');
    ob_start(function (string $html) use ($archivo): string {
        if (http_response_code() === 200 && strlen($html) > 1000 && stripos($html, '</html>') !== false) {
            wp_mkdir_p(dirname($archivo));
            @file_put_contents($archivo, $html, LOCK_EX);
        }
        return $html;
    });
}, 0);

function jm_cache_vaciar(): void
{
    foreach ((array) glob(jm_cache_dir() . '*.html') as $archivo) {
        @unlink($archivo);
    }
}

/* Un solo vaciado por petición, al final: una importación toca miles de
   metadatos y no hace falta borrar la carpeta en cada uno. */
function jm_cache_marcar(): void
{
    static $marcado = false;
    if (!$marcado) {
        $marcado = true;
        add_action('shutdown', 'jm_cache_vaciar');
    }
}

add_action('save_post', function ($id) {
    if (!wp_is_post_revision($id)) {
        jm_cache_marcar();
    }
});
add_action('deleted_post', 'jm_cache_marcar');
add_action('trashed_post', 'jm_cache_marcar');
add_action('updated_post_meta', 'jm_cache_marcar');
add_action('added_post_meta', 'jm_cache_marcar');
add_action('edited_term', 'jm_cache_marcar');
add_action('created_term', 'jm_cache_marcar');
add_action('elementor/editor/after_save', 'jm_cache_marcar');
add_action('upgrader_process_complete', 'jm_cache_marcar');
add_action('update_option_jm_ajustes', 'jm_cache_marcar');
