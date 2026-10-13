<?php
/**
 * Tipos de contenido y taxonomías.
 *
 * Las URL reproducen las de la web Next.js para no perder enlaces ni SEO:
 *   /maquina/{slug}/                 ficha de máquina
 *   /alquiler/{familia}/             listado de una familia
 *   /formacion/cursos/{curso}/       ficha de curso
 * Las convocatorias y las delegaciones no tienen página propia: se pintan
 * en listados (Loop Grid) y en desplegables.
 */

if (!defined('ABSPATH')) {
    exit;
}

function jm_registrar_tipos(): void
{
    $etiquetas = static function (string $singular, string $plural, bool $femenino = true): array {
        $nuevo = $femenino ? 'Nueva' : 'Nuevo';
        return [
            'name'               => $plural,
            'singular_name'      => $singular,
            'add_new'            => 'Añadir ' . mb_strtolower($singular),
            'add_new_item'       => 'Añadir ' . mb_strtolower($singular),
            'edit_item'          => 'Editar ' . mb_strtolower($singular),
            'new_item'           => $nuevo . ' ' . mb_strtolower($singular),
            'view_item'          => 'Ver ' . mb_strtolower($singular),
            'search_items'       => 'Buscar ' . mb_strtolower($plural),
            'not_found'          => 'No hay ' . mb_strtolower($plural),
            'all_items'          => 'Todas las ' . mb_strtolower($plural),
            'menu_name'          => $plural,
        ];
    };

    register_post_type('maquina', [
        'labels'        => $etiquetas('Máquina', 'Máquinas'),
        'public'        => true,
        'show_in_rest'  => true,
        'menu_icon'     => 'dashicons-hammer',
        'menu_position' => 21,
        'has_archive'   => false,
        'rewrite'       => ['slug' => 'maquina', 'with_front' => false],
        'supports'      => ['title', 'thumbnail', 'custom-fields', 'elementor'],
    ]);

    register_post_type('curso', [
        'labels'        => $etiquetas('Curso', 'Cursos', false),
        'public'        => true,
        'show_in_rest'  => true,
        'menu_icon'     => 'dashicons-welcome-learn-more',
        'menu_position' => 22,
        'has_archive'   => false,
        'rewrite'       => ['slug' => 'formacion/cursos', 'with_front' => false],
        'supports'      => ['title', 'editor', 'thumbnail', 'custom-fields', 'elementor'],
    ]);

    /* Públicas para que aparezcan en el selector de fuente del Loop Grid,
       pero sin página propia: se excluyen de la búsqueda y del sitemap y
       su URL redirige al listado (ver jm_redirigir_sin_ficha). */
    register_post_type('convocatoria', [
        'labels'              => $etiquetas('Convocatoria', 'Convocatorias'),
        'public'              => true,
        'publicly_queryable'  => true,
        'exclude_from_search' => true,
        'show_in_rest'        => true,
        'show_in_menu'        => 'edit.php?post_type=curso',
        'has_archive'         => false,
        'rewrite'             => ['slug' => 'convocatoria', 'with_front' => false],
        'supports'            => ['title', 'custom-fields'],
    ]);

    register_post_type('delegacion', [
        'labels'              => $etiquetas('Delegación', 'Delegaciones'),
        'public'              => true,
        'publicly_queryable'  => true,
        'exclude_from_search' => true,
        'show_in_rest'        => true,
        'menu_icon'           => 'dashicons-location',
        'menu_position'       => 23,
        'has_archive'         => false,
        'rewrite'             => ['slug' => 'delegacion', 'with_front' => false],
        'supports'            => ['title', 'custom-fields', 'page-attributes'],
    ]);

    register_taxonomy('familia', ['maquina'], [
        'labels'            => [
            'name'          => 'Familias y subcategorías',
            'singular_name' => 'Familia',
            'menu_name'     => 'Familias',
            'parent_item'   => 'Familia',
            'add_new_item'  => 'Añadir familia o subcategoría',
        ],
        'hierarchical'      => true,
        'public'            => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'rewrite'           => ['slug' => 'alquiler', 'with_front' => false, 'hierarchical' => false],
    ]);

    foreach ([
        'energia'    => ['Alimentación', 'Alimentaciones'],
        'fabricante' => ['Fabricante', 'Fabricantes'],
        'entorno'    => ['Uso', 'Usos'],
    ] as $tax => [$singular, $plural]) {
        register_taxonomy($tax, ['maquina'], [
            'labels'            => ['name' => $plural, 'singular_name' => $singular],
            'hierarchical'      => false,
            'public'            => false,
            'show_ui'           => true,
            'show_in_rest'      => true,
            'show_admin_column' => true,
            'rewrite'           => false,
        ]);
    }

    register_taxonomy('sede_formacion', ['convocatoria'], [
        'labels'            => ['name' => 'Sedes de formación', 'singular_name' => 'Sede de formación'],
        'hierarchical'      => false,
        'public'            => false,
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'rewrite'           => false,
    ]);
}
add_action('init', 'jm_registrar_tipos');

/* Convocatorias y delegaciones no tienen ficha: su URL lleva al listado. */
add_action('template_redirect', function () {
    if (is_singular('convocatoria')) {
        wp_safe_redirect(home_url('/formacion/#calendario'), 301);
        exit;
    }
    if (is_singular('delegacion')) {
        wp_safe_redirect(home_url('/delegaciones/#' . get_post_field('post_name')), 301);
        exit;
    }
});

/* Orden de catálogo en el escritorio y en los archivos de familia. */
add_action('pre_get_posts', function (WP_Query $q) {
    if (is_admin() || !$q->is_main_query()) {
        return;
    }
    if ($q->is_tax('familia')) {
        $q->set('posts_per_page', -1);
        $q->set('meta_key', 'jm_orden');
        $q->set('orderby', 'meta_value_num');
        $q->set('order', 'ASC');
    }
});

/* La clase jm-maq-{slug} en cada máquina la añade 70-catalogo.php. */
