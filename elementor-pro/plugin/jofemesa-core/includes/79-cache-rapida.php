<?php
/**
 * Instala la caché rápida: wp-content/advanced-cache.php + WP_CACHE.
 *
 * Con la caché de 77-cache-catalogo.php las páginas ya no se generan en
 * cada visita, pero WordPress seguía arrancando entero (Elementor, ACF…)
 * antes de servir el archivo: 2 a 5 s en este hosting (medido el
 * 05/11/2026). El drop-in sirve el archivo antes de que arranque nada.
 *
 * Se instala solo al entrar en el escritorio tras activar o actualizar el
 * plugin. Si ya hay un advanced-cache.php de otro plugin de caché, no lo
 * toca. Al desactivar el plugin se retira el drop-in.
 *
 * Estado: JOFEMESA → Ajustes muestra un aviso si no se pudo instalar.
 */

if (!defined('ABSPATH')) {
    exit;
}

const JM_RAPIDA_MARCA = 'jm-cache-rapida';

function jm_rapida_destino(): string
{
    return WP_CONTENT_DIR . '/advanced-cache.php';
}

function jm_rapida_wp_config(): string
{
    if (file_exists(ABSPATH . 'wp-config.php')) {
        return ABSPATH . 'wp-config.php';
    }
    $arriba = dirname(ABSPATH) . '/wp-config.php';
    return (file_exists($arriba) && !file_exists(dirname(ABSPATH) . '/wp-settings.php')) ? $arriba : '';
}

/** Devuelve '' si todo bien, o el motivo por el que no se pudo. */
function jm_rapida_instalar(): string
{
    $destino = jm_rapida_destino();
    if (file_exists($destino) && !str_contains((string) file_get_contents($destino), JM_RAPIDA_MARCA)) {
        return 'Ya hay un advanced-cache.php de otro plugin de caché; no se ha tocado.';
    }
    $plantilla = (string) @file_get_contents(JM_DIR . 'drop-in/advanced-cache.php');
    if ($plantilla === '') {
        return 'Falta la plantilla drop-in/advanced-cache.php en el plugin.';
    }
    $zona = wp_timezone_string();
    if (!preg_match('#^[A-Za-z_]+(/[A-Za-z_]+)*$#', $zona)) {
        $zona = 'Europe/Madrid';
    }
    $codigo = str_replace('{{ZONA}}', $zona, $plantilla);
    if ((string) @file_get_contents($destino) !== $codigo && @file_put_contents($destino, $codigo, LOCK_EX) === false) {
        return 'No se pudo escribir wp-content/advanced-cache.php (permisos).';
    }

    if (defined('WP_CACHE') && WP_CACHE) {
        return '';
    }
    $config = jm_rapida_wp_config();
    if ($config === '' || !is_writable($config)) {
        return 'No se pudo activar WP_CACHE: wp-config.php no se puede escribir. Añade define(\'WP_CACHE\', true); al principio de wp-config.php.';
    }
    $texto = (string) file_get_contents($config);
    if (preg_match('#define\s*\(\s*[\'"]WP_CACHE[\'"]#', $texto)) {
        return 'wp-config.php ya define WP_CACHE como false; cámbialo a true para activar la caché rápida.';
    }
    $nuevo = preg_replace('#^<\?php\s*#', "<?php\ndefine('WP_CACHE', true); // JOFEMESA · caché rápida\n", $texto, 1, $hechos);
    if (!$hechos || @file_put_contents($config, $nuevo, LOCK_EX) === false) {
        return 'No se pudo activar WP_CACHE en wp-config.php.';
    }
    return '';
}

function jm_rapida_retirar(): void
{
    $destino = jm_rapida_destino();
    if (file_exists($destino) && str_contains((string) file_get_contents($destino), JM_RAPIDA_MARCA)) {
        @unlink($destino);
    }
}

add_action('admin_init', function () {
    if (!current_user_can('manage_options') || get_option('jm_rapida_version') === JM_VERSION) {
        return;
    }
    $error = jm_rapida_instalar();
    update_option('jm_rapida_version', JM_VERSION, false);
    update_option('jm_rapida_error', $error, false);
    jm_cache_marcar();
});

add_action('admin_notices', function () {
    $error = (string) get_option('jm_rapida_error', '');
    if ($error !== '' && current_user_can('manage_options')) {
        echo '<div class="notice notice-warning"><p><strong>JOFEMESA · caché rápida:</strong> ' . esc_html($error) . '</p></div>';
    }
});

register_deactivation_hook(JM_DIR . 'jofemesa-core.php', function () {
    jm_rapida_retirar();
    delete_option('jm_rapida_version');
});
