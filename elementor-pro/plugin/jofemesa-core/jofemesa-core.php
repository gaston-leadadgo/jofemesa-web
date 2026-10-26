<?php
/**
 * Plugin Name:       JOFEMESA · Núcleo
 * Description:       Catálogo de maquinaria, formación y delegaciones de JOFEMESA para Elementor Pro: tipos de contenido, campos, importador, estilos, scripts y shortcodes.
 * Version:           1.2.6
 * Requires at least: 6.4
 * Requires PHP:      8.0
 * Author:            LeadAdGo
 * Text Domain:       jofemesa
 */

if (!defined('ABSPATH')) {
    exit;
}

define('JM_VERSION', '1.2.6');
define('JM_DIR', plugin_dir_path(__FILE__));
define('JM_URL', plugin_dir_url(__FILE__));

/*
 * Cada archivo de includes/ se carga en orden alfabético. El prefijo
 * numérico marca la dependencia: 00 utilidades, 10 tipos, 20 campos,
 * 30 importador, 40 consultas, 50 formularios, 60+ shortcodes por área.
 */
$jm_archivos = glob(JM_DIR . 'includes/*.php') ?: [];
sort($jm_archivos);
foreach ($jm_archivos as $jm_archivo) {
    require_once $jm_archivo;
}

register_activation_hook(__FILE__, function () {
    jm_registrar_tipos();
    flush_rewrite_rules();
});
register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
