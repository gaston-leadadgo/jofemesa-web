<?php
/**
 * Rendimiento: fuera lo que se carga en cada página sin usarse.
 *
 * Medido en jofemesa.com el 05/11/2026: 35 hojas de estilo y 25 scripts por
 * página, tres peticiones a Google Fonts (dos de Elementor con TODOS los
 * pesos y cursivas de Archivo y Plus Jakarta Sans) y los JS de Contact
 * Form 7 en todas las páginas, aunque los formularios son los de Elementor.
 *
 *   · Google Fonts de Elementor: fuera. Las familias y pesos que usa la web
 *     ya los pide el plugin en una sola petición (00-utilidades.php).
 *   · Contact Form 7: sus CSS/JS solo donde haya un formulario de CF7.
 *   · Emojis de WordPress: fuera (script + estilos en cada página).
 *   · Preconexión a fonts.gstatic.com para que las fuentes lleguen antes.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_filter('elementor/frontend/print_google_fonts', '__return_false');

add_action('init', function () {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    add_filter('emoji_svg_url', '__return_false');
});

/** ¿La página actual tiene un formulario de Contact Form 7? */
function jm_pagina_usa_cf7(): bool
{
    if (!is_singular()) {
        return false;
    }
    $id = (int) get_queried_object_id();
    $contenido = (string) get_post_field('post_content', $id) . (string) get_post_meta($id, '_elementor_data', true);
    return str_contains($contenido, 'contact-form-7') || str_contains($contenido, 'wpcf7');
}

add_filter('wpcf7_load_js', function ($cargar) {
    return $cargar && jm_pagina_usa_cf7();
});
add_filter('wpcf7_load_css', function ($cargar) {
    return $cargar && jm_pagina_usa_cf7();
});

/* Las fuentes ya no vienen de Google (00-fuentes.css): fuera las
   preconexiones y el dns-prefetch a sus dominios. */
add_filter('wp_resource_hints', function (array $urls) {
    return array_values(array_filter($urls, function ($u) {
        $href = is_array($u) ? (string) ($u['href'] ?? '') : (string) $u;
        return !str_contains($href, 'fonts.googleapis.com') && !str_contains($href, 'fonts.gstatic.com');
    }));
}, 99);

/* jQuery: al pie de la página y sin jquery-migrate. En la cabecera
   bloqueaba el primer pintado (~1,5 s en PageSpeed móvil, 06/11/2026) y
   todo lo que lo usa (Elementor, el plugin) ya carga en el pie. En el
   escritorio y en el editor de Elementor no se toca nada. */
function jm_es_portada_publica(): bool
{
    return !is_admin() && !isset($_GET['elementor-preview']) && !(defined('REST_REQUEST') && REST_REQUEST);
}
add_action('wp_default_scripts', function ($scripts) {
    if (!jm_es_portada_publica() || empty($scripts->registered['jquery'])) {
        return;
    }
    $scripts->registered['jquery']->deps = array_values(array_diff($scripts->registered['jquery']->deps, ['jquery-migrate']));
});
add_action('wp_enqueue_scripts', function () {
    if (!jm_es_portada_publica()) {
        return;
    }
    foreach (['jquery', 'jquery-core', 'jquery-migrate'] as $h) {
        wp_scripts()->add_data($h, 'group', 1);
    }
}, 999);
