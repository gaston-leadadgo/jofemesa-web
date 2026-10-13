<?php
/**
 * Consultas de Loop Grid / Loop Carousel por «ID de consulta».
 *
 * En el widget: Consulta → Fuente = el tipo de contenido que toque, y en
 * «ID de consulta» uno de estos nombres. El plugin rehace la consulta con
 * el criterio de la web original (orden de catálogo, solo futuras, etc.).
 *
 *   jm_catalogo              Máquinas de alquiler, orden de catálogo, todas.
 *                            En un archivo de familia, solo esa familia.
 *   jm_destacadas            Máquinas con foto y ficha: destacadas primero.
 *   jm_relacionadas          Las relacionadas de la máquina que se está viendo.
 *   jm_cursos_convocatoria   Cursos con convocatoria abierta.
 *   jm_cursos_medida         Cursos a medida.
 *   jm_convocatorias         Convocatorias de hoy en adelante, por fecha.
 *   jm_delegaciones          Delegaciones y sede, en su orden.
 *   jm_delegaciones_espana   Solo España.
 *   jm_delegaciones_portugal Solo Portugal.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Orden numérico por un campo, con desempate por título. */
function jm_ordenar_por(WP_Query $q, string $campo, string $sentido = 'ASC'): void
{
    $meta = (array) $q->get('meta_query');
    $meta['jm_orden_clausula'] = ['key' => $campo, 'type' => 'NUMERIC', 'compare' => 'EXISTS'];
    $q->set('meta_query', $meta);
    $q->set('orderby', ['jm_orden_clausula' => $sentido, 'title' => 'ASC']);
}

add_action('elementor/query/jm_catalogo', function (WP_Query $q) {
    $q->set('post_type', 'maquina');
    $q->set('posts_per_page', -1);
    $q->set('no_found_rows', true);
    $q->set('meta_query', [
        'relation' => 'AND',
        ['key' => '_jmj_en_alquiler', 'value' => '1'],
    ]);
    jm_ordenar_por($q, 'jm_orden');
    $termino = get_queried_object();
    if ($termino instanceof WP_Term && $termino->taxonomy === 'familia') {
        $q->set('tax_query', [[
            'taxonomy'         => 'familia',
            'field'            => 'term_id',
            'terms'            => [$termino->term_id],
            'include_children' => true,
        ]]);
    }
});

add_action('elementor/query/jm_destacadas', function (WP_Query $q) {
    $q->set('post_type', 'maquina');
    $q->set('posts_per_page', -1);
    $q->set('meta_query', [
        'relation'  => 'AND',
        ['key' => '_thumbnail_id', 'compare' => 'EXISTS'],
        ['key' => 'jm_ficha_pdf', 'value' => '', 'compare' => '!='],
        'destacada' => ['key' => 'jm_destacada', 'compare' => 'EXISTS'],
        'orden'     => ['key' => 'jm_orden', 'type' => 'NUMERIC', 'compare' => 'EXISTS'],
    ]);
    $q->set('orderby', ['destacada' => 'DESC', 'orden' => 'ASC']);
});

add_action('elementor/query/jm_relacionadas', function (WP_Query $q) {
    $actual = get_queried_object_id();
    $slugs = json_decode((string) get_post_meta($actual, '_jmj_relacionadas', true), true) ?: [];
    $ids = array_values(array_filter(array_map('jm_maquina_por_slug', $slugs)));
    $q->set('post_type', 'maquina');
    $q->set('post__in', $ids ?: [0]);
    $q->set('orderby', 'post__in');
    $q->set('posts_per_page', count($ids) ?: 1);
});

foreach (['jm_cursos_convocatoria' => '1', 'jm_cursos_medida' => '0'] as $jm_id => $jm_abierta) {
    add_action('elementor/query/' . $jm_id, function (WP_Query $q) use ($jm_abierta) {
        $q->set('post_type', 'curso');
        $q->set('posts_per_page', -1);
        $q->set('meta_query', [['key' => 'jm_convocatoria_abierta', 'value' => $jm_abierta]]);
        jm_ordenar_por($q, 'jm_orden');
    });
}

add_action('elementor/query/jm_convocatorias', function (WP_Query $q) {
    $q->set('post_type', 'convocatoria');
    $q->set('posts_per_page', -1);
    $q->set('no_found_rows', true);
    $q->set('meta_query', [
        'fecha' => ['key' => 'jm_fecha', 'value' => wp_date('Ymd'), 'compare' => '>=', 'type' => 'NUMERIC'],
    ]);
    $q->set('orderby', ['fecha' => 'ASC', 'title' => 'ASC']);
});

foreach (['jm_delegaciones' => null, 'jm_delegaciones_espana' => 'España', 'jm_delegaciones_portugal' => 'Portugal'] as $jm_id => $jm_pais) {
    add_action('elementor/query/' . $jm_id, function (WP_Query $q) use ($jm_pais) {
        $q->set('post_type', 'delegacion');
        $q->set('posts_per_page', -1);
        $q->set('meta_query', $jm_pais ? [['key' => 'jm_pais', 'value' => $jm_pais]] : []);
        jm_ordenar_por($q, 'jm_orden');
    });
}

/* Las convocatorias pasadas se ocultan también en cliente (el JS sabe la
   fecha del navegador): la página puede estar en caché de un día para
   otro y el servidor no puede saberlo. */
