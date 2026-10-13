<?php
/**
 * Servicios, Delegaciones y Contacto: piezas no nativas.
 *
 * Estructura de montaje en estructura/30-servicios.md, 50-delegaciones.md y
 * 51-contacto.md. Todo lo demás de esas páginas son widgets nativos.
 *
 *   (El mapa es [jm_mapa] de 65-inicio.php.)
 *   [jm_delegacion_provincia]                    «Asturias» sobre el nombre, solo si dice algo
 *   [jm_delegacion_insignia variante="ficha|contacto"]  Central / Sede / PT + ancla #slug
 *   [jm_delegacion_contacto variante="ficha|compacto"]  teléfono, correo y horario
 *   [jm_delegacion_servicios]                    las píldoras de servicios
 *   [jm_delegacion_boton]                        «Pedir máquina en …» o «Ver cursos y convocatorias»
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Iconos lucide de estas páginas (mismos trazos que la web Next). */
function jm_pg_icono(string $nombre, int $tam = 17, float $grosor = 1.75, string $clase = ''): string
{
    $trazos = [
        'phone'    => '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
        'mail'     => '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
        'clock'    => '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        'arrow'    => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'cap'      => '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    ];
    if (!isset($trazos[$nombre])) {
        return '';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' . $tam . '" height="' . $tam . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' . esc_attr((string) $grosor) . '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' . ($clase ? ' class="' . esc_attr($clase) . '"' : '') . '>' . $trazos[$nombre] . '</svg>';
}

/** Datos de la delegación actual (Loop Item). */
function jm_pg_delegacion(int $id = 0): array
{
    $id = $id ?: (int) get_the_ID();
    if (!$id || get_post_type($id) !== 'delegacion') {
        return [];
    }
    $m = static fn ($k) => (string) get_post_meta($id, $k, true);
    return [
        'id'        => $id,
        'slug'      => (string) get_post_field('post_name', $id),
        'nombre'    => get_the_title($id),
        'provincia' => $m('jm_provincia'),
        'pais'      => $m('jm_pais'),
        'telefono'  => $m('jm_telefono'),
        'tel'       => $m('jm_tel') ?: jm_tel($m('jm_telefono')),
        'email'     => $m('jm_email'),
        'horario'   => $m('jm_horario'),
        'central'   => in_array($m('jm_central'), ['1', 'true', 'si', 'sí'], true),
        'sede'      => $m('jm_tipo') === 'Sede de formación',
        'servicios' => array_values(array_filter(array_map('trim', explode("\n", $m('jm_servicios'))))),
    ];
}

/** [jm_delegacion_provincia] La provincia, solo cuando no repite el nombre. */
function jm_sc_paginas_delegacion_provincia($atts): string
{
    $d = jm_pg_delegacion();
    if (!$d || $d['provincia'] === '' || $d['provincia'] === $d['nombre']) {
        return '';
    }
    return '<p class="jm-label-sm jm-deleg__provincia">' . esc_html($d['provincia']) . '</p>';
}
add_shortcode('jm_delegacion_provincia', 'jm_sc_paginas_delegacion_provincia');

/**
 * [jm_delegacion_insignia variante="ficha|contacto"]
 *   ficha:    «Central» (roja) o «Sede» (negra, con birrete). Deja además
 *             el ancla #{slug} a la que redirige la URL de la delegación.
 *   contacto: «PT» en las de Portugal y «Sede» en la de formación.
 */
function jm_sc_paginas_delegacion_insignia($atts): string
{
    $a = shortcode_atts(['variante' => 'ficha'], $atts, 'jm_delegacion_insignia');
    $d = jm_pg_delegacion();
    if (!$d) {
        return '';
    }
    $html = '';
    if ($a['variante'] === 'contacto') {
        if ($d['pais'] === 'Portugal') {
            $html .= '<span class="jm-label-sm jm-dinsignia jm-dinsignia--pt">PT</span>';
        }
        if ($d['sede']) {
            $html .= '<span class="jm-label-sm jm-dinsignia jm-dinsignia--sede-suave">Sede</span>';
        }
        return $html;
    }
    $html .= '<span class="jm-deleg__ancla" id="' . esc_attr($d['slug']) . '" aria-hidden="true"></span>';
    if ($d['central']) {
        $html .= '<span class="jm-label-sm jm-dinsignia jm-dinsignia--central">Central</span>';
    }
    if ($d['sede']) {
        $html .= '<span class="jm-label-sm jm-dinsignia jm-dinsignia--sede">' . jm_pg_icono('cap', 13, 2) . 'Sede</span>';
    }
    return $html;
}
add_shortcode('jm_delegacion_insignia', 'jm_sc_paginas_delegacion_insignia');

/**
 * [jm_delegacion_contacto variante="ficha|compacto" horario="…"]
 *   ficha:    filas de teléfono, correo y horario (con sus iconos).
 *   compacto: teléfono y correo, para la centralita de /contacto.
 */
function jm_sc_paginas_delegacion_contacto($atts): string
{
    $a = shortcode_atts([
        'variante' => 'ficha',
        'horario'  => 'Llámanos y te confirmamos el horario',
    ], $atts, 'jm_delegacion_contacto');
    $d = jm_pg_delegacion();
    if (!$d) {
        return '';
    }
    if ($a['variante'] === 'compacto') {
        return '<div class="jm-deleg-c__datos">'
            . ($d['telefono'] ? '<a class="jm-value jm-deleg-c__tel" href="tel:' . esc_attr($d['tel']) . '">' . jm_pg_icono('phone', 13) . esc_html($d['telefono']) . '</a>' : '')
            . ($d['email'] ? '<a class="jm-deleg-c__email" href="mailto:' . esc_attr($d['email']) . '">' . esc_html($d['email']) . '</a>' : '')
            . '</div>';
    }
    $fila = static function (string $icono, string $etiqueta, string $contenido): string {
        return '<div class="jm-deleg__fila"><span class="jm-sr">' . esc_html($etiqueta) . '</span>'
            . jm_pg_icono($icono, 17, 1.75, 'jm-deleg__icono')
            . '<div class="jm-deleg__dd">' . $contenido . '</div></div>';
    };
    $html = '<div class="jm-deleg__datos">';
    if ($d['telefono']) {
        $html .= $fila('phone', 'Teléfono', '<a class="jm-value jm-deleg__tel" href="tel:' . esc_attr($d['tel']) . '">' . esc_html($d['telefono']) . '</a>');
    }
    if ($d['email']) {
        $html .= $fila('mail', 'Correo', '<a class="jm-deleg__email" href="mailto:' . esc_attr($d['email']) . '">' . esc_html($d['email']) . '</a>');
    }
    $html .= $fila('clock', 'Horario', '<span class="jm-deleg__horario">' . esc_html($d['horario'] ?: $a['horario']) . '</span>');
    return $html . '</div>';
}
add_shortcode('jm_delegacion_contacto', 'jm_sc_paginas_delegacion_contacto');

/** [jm_delegacion_servicios] Las píldoras de servicios (campo jm_servicios, una por línea). */
function jm_sc_paginas_delegacion_servicios($atts): string
{
    $d = jm_pg_delegacion();
    if (!$d || !$d['servicios']) {
        return '';
    }
    $html = '<ul class="jm-deleg__servicios">';
    foreach ($d['servicios'] as $s) {
        $html .= '<li>' . esc_html($s) . '</li>';
    }
    return $html . '</ul>';
}
add_shortcode('jm_delegacion_servicios', 'jm_sc_paginas_delegacion_servicios');

/**
 * [jm_delegacion_boton pedir="Pedir máquina en " sede="Ver cursos y convocatorias"]
 * La sede de formación no alquila: su botón lleva a /formacion/.
 */
function jm_sc_paginas_delegacion_boton($atts): string
{
    $a = shortcode_atts([
        'pedir' => 'Pedir máquina en ',
        'sede'  => 'Ver cursos y convocatorias',
    ], $atts, 'jm_delegacion_boton');
    $d = jm_pg_delegacion();
    if (!$d) {
        return '';
    }
    if ($d['sede']) {
        return '<a class="jm-btn jm-btn--tinta jm-btn--bloque jm-btn--h12 jm-deleg__boton jm-deleg__boton--sede" href="' . esc_url(home_url('/formacion/')) . '">'
            . esc_html($a['sede']) . jm_pg_icono('arrow', 16, 2) . '</a>';
    }
    $url = add_query_arg('del', rawurlencode($d['slug']), home_url('/consultar-disponibilidad/'));
    return '<a class="jm-btn jm-btn--acento jm-btn--bloque jm-btn--h12 jm-deleg__boton" href="' . esc_url($url) . '">'
        . esc_html($a['pedir'] . $d['nombre']) . jm_pg_icono('arrow', 16, 2) . '</a>';
}
add_shortcode('jm_delegacion_boton', 'jm_sc_paginas_delegacion_boton');
