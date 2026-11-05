<?php
/**
 * Redirecciones 301 de URLs que cambiaron.
 *
 * La familia de compresores pasó de /alquiler/aire-martillos/ a
 * /alquiler/aire-comprimido/ el 05/11/2026 (el cliente cambió el slug al
 * renombrarla «Aire comprimido»). La antigua estaba enlazada y puede estar
 * indexada, así que se redirige con todo lo que cuelgue de ella.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('template_redirect', function () {
    if (!is_404()) {
        return;
    }
    $ruta = (string) wp_parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);
    $cambios = [
        '/alquiler/aire-martillos' => '/alquiler/aire-comprimido',
    ];
    foreach ($cambios as $antes => $despues) {
        if ($ruta === $antes || str_starts_with($ruta, $antes . '/')) {
            $resto = substr($ruta, strlen($antes));
            wp_safe_redirect(home_url($despues . ($resto !== '' ? $resto : '/')), 301);
            exit;
        }
    }
}, 1);
