<?php
/**
 * Formación en el escritorio: el panel con el que el cliente gestiona
 * cursos, fechas (convocatorias) y sedes sin tocar Elementor.
 *
 *   1. Cálculos automáticos
 *      · «Convocatoria abierta / A medida» de cada curso según tenga fechas
 *        próximas (antes era una casilla manual que se olvidaba marcar).
 *      · Título y slug de cada convocatoria: «Curso · 14/12/2026 · Sede».
 *      · Valores por defecto de un curso nuevo (orden, nombre corto…).
 *   2. Menú «Formación»: Panel · Convocatorias · Cursos · Sedes · Guía.
 *   3. Panel (admin.php?page=jm-formacion): cifras, avisos, «Programar
 *      fechas» (varias de una vez), agenda con plazas y calendario.
 *   4. Listados y pantallas de edición: columnas útiles, filtros por curso
 *      y sede, vistas Próximas / Celebradas, editor clásico y ayudas.
 *
 * Estilos y JS: assets/admin/formacion.css y formacion.js (solo se cargan
 * en estas pantallas). La guía de uso está en 81-guia-formacion.php.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ============================================================
   1. CÁLCULOS AUTOMÁTICOS
   ============================================================ */

/**
 * Marca cada curso como «convocatoria abierta» ('1') si tiene al menos una
 * convocatoria publicada de hoy en adelante, y si no como «a medida» ('0').
 * Es lo que leen las consultas jm_cursos_convocatoria / jm_cursos_medida,
 * los chips del calendario y el formulario.
 */
function jm_fo_recalcular_cursos(): void
{
    if (!post_type_exists('curso') || !post_type_exists('convocatoria')) {
        return;
    }
    $hoy = wp_date('Ymd');
    $con_fechas = [];
    $futuras = get_posts([
        'post_type'        => 'convocatoria',
        'post_status'      => 'publish',
        'numberposts'      => -1,
        'fields'           => 'ids',
        'no_found_rows'    => true,
        'suppress_filters' => true,
        'meta_query'       => [['key' => 'jm_fecha', 'value' => $hoy, 'compare' => '>=', 'type' => 'NUMERIC']],
    ]);
    foreach ($futuras as $id) {
        $con_fechas[(int) get_post_meta($id, 'jm_curso', true)] = true;
    }
    $cursos = get_posts([
        'post_type'        => 'curso',
        'post_status'      => ['publish', 'draft', 'pending', 'private', 'future'],
        'numberposts'      => -1,
        'fields'           => 'ids',
        'suppress_filters' => true,
    ]);
    foreach ($cursos as $id) {
        $valor = isset($con_fechas[$id]) ? '1' : '0';
        if (get_post_meta($id, 'jm_convocatoria_abierta', true) !== $valor) {
            update_post_meta($id, 'jm_convocatoria_abierta', $valor);
        }
    }
    update_option('jm_fo_recalculado', $hoy, true);
}

/* Una vez al día (la primera visita del día): las fechas que ya pasaron
   dejan de contar sin que nadie toque nada. Opción autocargada: no cuesta
   ninguna consulta el resto de visitas. */
add_action('init', function () {
    if (get_option('jm_fo_recalculado') !== wp_date('Ymd')) {
        jm_fo_recalcular_cursos();
    }
}, 30);

/** Título legible de una convocatoria: «PEMP · 14/12/2026 · Puerto de Sagunto». */
function jm_fo_titulo_convocatoria(int $curso, string $fecha, int $sede): string
{
    $partes = [];
    $partes[] = $curso ? get_the_title($curso) : 'Sin curso';
    $iso = jm_fo_iso($fecha);
    $partes[] = $iso ? implode('/', array_reverse(explode('-', $iso))) : 'sin fecha';
    $termino = $sede ? get_term($sede, 'sede_formacion') : null;
    if ($termino instanceof WP_Term) {
        $partes[] = $termino->name;
    }
    return implode(' · ', $partes);
}

/** Slug con el formato de la web: «2026-12-14-pemp-sagunto». */
function jm_fo_slug_convocatoria(int $curso, string $fecha, int $sede): string
{
    $sede_slug = $sede ? (string) get_term_field('slug', $sede, 'sede_formacion') : '';
    return sanitize_title(trim(jm_fo_iso($fecha) . '-' . get_post_field('post_name', $curso) . '-' . $sede_slug, '-'));
}

/** Sede (ID de término) de una convocatoria. */
function jm_fo_sede_de(int $id): int
{
    $terminos = wp_get_post_terms($id, 'sede_formacion', ['fields' => 'ids']);
    return (!is_wp_error($terminos) && $terminos) ? (int) $terminos[0] : 0;
}

/**
 * Completa una convocatoria tras guardarla: título, slug estable
 * («2026-12-14-pemp-sagunto», el valor que viaja en el formulario),
 * referencia del campo Sede y «0 ocupadas» si hay plazas.
 */
function jm_fo_completar_convocatoria(int $id): void
{
    $post = get_post($id);
    if (!$post || $post->post_type !== 'convocatoria' || in_array($post->post_status, ['auto-draft', 'trash'], true)) {
        return;
    }
    $curso = (int) get_post_meta($id, 'jm_curso', true);
    $fecha = (string) get_post_meta($id, 'jm_fecha', true);
    $sede = jm_fo_sede_de($id);

    if ($sede && (int) get_post_meta($id, 'jm_sede', true) !== $sede) {
        jm_guardar_campo($id, 'jm_sede', $sede);
    }
    if (get_post_meta($id, 'jm_plazas', true) !== '' && get_post_meta($id, 'jm_ocupadas', true) === '') {
        jm_guardar_campo($id, 'jm_ocupadas', 0);
    }

    $cambios = [];
    $titulo = jm_fo_titulo_convocatoria($curso, $fecha, $sede);
    if ($post->post_title !== $titulo) {
        $cambios['post_title'] = $titulo;
    }
    /* WordPress pone como slug el ID (sin título) o el título automático:
       lo sustituimos una sola vez por el formato de la web. Después no
       cambia aunque cambie la fecha, para no romper solicitudes ya
       enviadas con ese valor. */
    $automatico = $post->post_name === ''
        || preg_match('/^\d+(-\d+)?$/', $post->post_name)
        || preg_replace('/-\d+$/', '', $post->post_name) === sanitize_title($post->post_title);
    if ($automatico && $post->post_status !== 'draft' && $curso && $fecha) {
        $cambios['post_name'] = wp_unique_post_slug(jm_fo_slug_convocatoria($curso, $fecha, $sede), $id, $post->post_status, 'convocatoria', 0);
    }
    if ($cambios) {
        remove_action('save_post', 'jm_fo_al_guardar', 20);
        wp_update_post(array_merge(['ID' => $id], wp_slash($cambios)));
        add_action('save_post', 'jm_fo_al_guardar', 20, 2);
    }
}

/** Un curso nuevo nunca queda a medias: nombre corto, título y orden. */
function jm_fo_completar_curso(int $id): void
{
    $post = get_post($id);
    if (!$post || $post->post_type !== 'curso' || in_array($post->post_status, ['auto-draft', 'trash'], true)) {
        return;
    }
    $titulo = trim($post->post_title);
    if ($titulo !== '') {
        foreach (['jm_nombre_corto', 'jm_titulo_largo'] as $campo) {
            if (trim((string) get_post_meta($id, $campo, true)) === '') {
                jm_guardar_campo($id, $campo, $titulo);
            }
        }
    }
    if (get_post_meta($id, 'jm_orden', true) === '') {
        $max = 0;
        foreach (get_posts(['post_type' => 'curso', 'post_status' => 'any', 'numberposts' => -1, 'fields' => 'ids', 'exclude' => [$id]]) as $otro) {
            $max = max($max, (int) get_post_meta($otro, 'jm_orden', true));
        }
        jm_guardar_campo($id, 'jm_orden', $max + 1);
    }
}

/* Prioridad 20: ACF guarda sus campos en save_post a prioridad 10. */
function jm_fo_al_guardar(int $id, WP_Post $post): void
{
    /* En el alta en bloque del panel cada convocatoria se completa a mano
       cuando ya tiene sede (jm_fo_crear) y se recalcula una vez al final. */
    if (wp_is_post_revision($id) || wp_is_post_autosave($id) || !empty($GLOBALS['jm_fo_lote'])) {
        return;
    }
    if ($post->post_type === 'convocatoria') {
        jm_fo_completar_convocatoria($id);
    } elseif ($post->post_type === 'curso') {
        jm_fo_completar_curso($id);
    } else {
        return;
    }
    jm_fo_recalcular_cursos();
}
add_action('save_post', 'jm_fo_al_guardar', 20, 2);

foreach (['trashed_post', 'untrashed_post'] as $jm_gancho) {
    add_action($jm_gancho, function ($id) {
        if (in_array(get_post_type($id), ['convocatoria', 'curso'], true) && empty($GLOBALS['jm_fo_lote'])) {
            jm_fo_recalcular_cursos();
        }
    });
}
add_action('after_delete_post', function ($id, $post) {
    if ($post instanceof WP_Post && in_array($post->post_type, ['convocatoria', 'curso'], true)) {
        jm_fo_recalcular_cursos();
    }
}, 10, 2);

/* Al restaurar de la papelera vuelve publicada (WordPress la dejaría en
   borrador y desaparecería de la web sin avisar). */
add_filter('wp_untrash_post_status', function ($nuevo, $id, $anterior) {
    return in_array(get_post_type($id), ['convocatoria', 'curso'], true) && $anterior ? $anterior : $nuevo;
}, 10, 3);

/* Ocupadas nunca por encima de las plazas totales. */
add_filter('acf/validate_value/name=jm_ocupadas', function ($valido, $valor) {
    if ($valido !== true || $valor === '' || $valor === null) {
        return $valido;
    }
    $plazas = $_POST['acf'][jm_clave_campo('convocatoria', 'jm_plazas')] ?? '';
    if ($plazas === '') {
        return 'Indica primero las plazas totales.';
    }
    return (int) $valor > (int) $plazas ? 'No puede haber más ocupadas que plazas totales (' . (int) $plazas . ').' : $valido;
}, 10, 2);

/* ============================================================
   2. MENÚ «FORMACIÓN»
   ============================================================ */

add_action('admin_menu', function () {
    add_menu_page('Formación', 'Formación', 'edit_posts', 'jm-formacion', 'jm_fo_pantalla_panel', 'dashicons-welcome-learn-more', 22);
    add_submenu_page('jm-formacion', 'Panel de Formación', 'Panel', 'edit_posts', 'jm-formacion', 'jm_fo_pantalla_panel');
}, 9);

add_action('admin_menu', function () {
    add_submenu_page('jm-formacion', 'Sedes de formación', 'Sedes', 'manage_categories', 'edit-tags.php?taxonomy=sede_formacion&post_type=convocatoria');
    add_submenu_page('jm-formacion', 'Guía de uso de Formación', 'Guía de uso', 'edit_posts', 'jm-formacion-guia', 'jm_fo_pantalla_guia');
}, 11);

/* Orden del submenú: lo que más se usa, primero. */
add_action('admin_menu', function () {
    global $submenu;
    if (empty($submenu['jm-formacion'])) {
        return;
    }
    $orden = ['jm-formacion', 'edit.php?post_type=convocatoria', 'edit.php?post_type=curso', 'edit-tags.php?taxonomy=sede_formacion&post_type=convocatoria', 'jm-formacion-guia'];
    usort($submenu['jm-formacion'], static function ($a, $b) use ($orden) {
        $ia = array_search($a[2], $orden, true);
        $ib = array_search($b[2], $orden, true);
        return ($ia === false ? 99 : $ia) <=> ($ib === false ? 99 : $ib);
    });
}, 999);

/* Las sedes se marcan dentro de «Formación», no de «Entradas». */
add_filter('parent_file', function ($padre) {
    $pantalla = get_current_screen();
    return ($pantalla && $pantalla->taxonomy === 'sede_formacion') ? 'jm-formacion' : $padre;
});
add_filter('submenu_file', function ($sub) {
    $pantalla = get_current_screen();
    return ($pantalla && $pantalla->taxonomy === 'sede_formacion') ? 'edit-tags.php?taxonomy=sede_formacion&post_type=convocatoria' : $sub;
});

/* ============================================================
   3. PANTALLAS, ESTILOS Y JS
   ============================================================ */

/** ¿Es una pantalla de Formación? Devuelve cuál o ''. */
function jm_fo_pantalla(): string
{
    $pagina = isset($_GET['page']) ? sanitize_key(wp_unslash($_GET['page'])) : '';
    if ($pagina === 'jm-formacion') {
        return 'panel';
    }
    if ($pagina === 'jm-formacion-guia') {
        return 'guia';
    }
    $p = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$p) {
        return '';
    }
    if ($p->taxonomy === 'sede_formacion') {
        return 'sedes';
    }
    if (in_array($p->post_type, ['curso', 'convocatoria'], true)) {
        return ($p->base === 'edit' ? 'lista-' : 'editar-') . $p->post_type;
    }
    return '';
}

add_filter('admin_body_class', function ($clases) {
    return jm_fo_pantalla() ? $clases . ' jm-adm' : $clases;
});

add_action('admin_enqueue_scripts', function () {
    $pantalla = jm_fo_pantalla();
    if (!$pantalla) {
        return;
    }
    $base = JM_DIR . 'assets/admin/';
    wp_enqueue_style('jm-adm-tipos', 'https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap', [], null);
    wp_enqueue_style('jm-adm-formacion', JM_URL . 'assets/admin/formacion.css', ['jm-adm-tipos'], filemtime($base . 'formacion.css'));
    wp_enqueue_script('jm-adm-formacion', JM_URL . 'assets/admin/formacion.js', [], filemtime($base . 'formacion.js'), true);
    wp_localize_script('jm-adm-formacion', 'JM_FO', [
        'ajax'  => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('jm_fo'),
        'hoy'   => jm_fo_hoy(),
    ]);
});

/** Iconos del escritorio (trazos de lucide, como la web). */
function jm_fo_adm_icono(string $nombre, int $tam = 16): string
{
    $trazos = [
        'plus'      => '<path d="M5 12h14"/><path d="M12 5v14"/>',
        'minus'     => '<path d="M5 12h14"/>',
        'pencil'    => '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
        'trash'     => '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
        'repeat'    => '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
        'external'  => '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
        'calendar'  => '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
        'calplus'   => '<path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M19 16v6"/><path d="M16 19h6"/>',
        'pin'       => '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
        'clock'     => '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        'book'      => '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
        'users'     => '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        'alert'     => '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
        'info'      => '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
        'check'     => '<path d="M20 6 9 17l-5-5"/>',
        'left'      => '<path d="m15 18-6-6 6-6"/>',
        'right'     => '<path d="m9 18 6-6-6-6"/>',
        'help'      => '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
        'grid'      => '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
        'list'      => '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    ];
    if (!isset($trazos[$nombre])) {
        return '';
    }
    return '<svg class="jm-adm-ico" xmlns="http://www.w3.org/2000/svg" width="' . $tam . '" height="' . $tam . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $trazos[$nombre] . '</svg>';
}

/** Cabecera común de todas las pantallas de Formación. */
function jm_fo_cabecera(string $activa): string
{
    $pestanas = [
        'panel'        => ['Panel', admin_url('admin.php?page=jm-formacion'), 'grid'],
        'convocatoria' => ['Convocatorias', admin_url('edit.php?post_type=convocatoria'), 'calendar'],
        'curso'        => ['Cursos', admin_url('edit.php?post_type=curso'), 'book'],
        'sedes'        => ['Sedes', admin_url('edit-tags.php?taxonomy=sede_formacion&post_type=convocatoria'), 'pin'],
        'guia'         => ['Guía de uso', admin_url('admin.php?page=jm-formacion-guia'), 'help'],
    ];
    $html = '<div class="jm-adm-cabecera"><div class="jm-adm-cabecera__marca">'
        . '<span class="jm-adm-cabecera__iso" aria-hidden="true"></span>'
        . '<span><strong>JOFEMESA</strong> Formación</span></div><nav class="jm-adm-cabecera__nav" aria-label="Formación">';
    foreach ($pestanas as $clave => [$texto, $url, $icono]) {
        $html .= '<a href="' . esc_url($url) . '"' . ($clave === $activa ? ' class="es-activa" aria-current="page"' : '') . '>'
            . jm_fo_adm_icono($icono, 15) . '<span>' . esc_html($texto) . '</span></a>';
    }
    $html .= '</nav><a class="jm-adm-cabecera__web" href="' . esc_url(home_url('/formacion/')) . '" target="_blank" rel="noopener">Ver en la web '
        . jm_fo_adm_icono('external', 14) . '</a></div>';
    return $html;
}

/* En listados, edición y sedes, la cabecera va encima del título de WordPress. */
add_action('all_admin_notices', function () {
    $pantalla = jm_fo_pantalla();
    if (!$pantalla || in_array($pantalla, ['panel', 'guia'], true)) {
        return;
    }
    $activa = $pantalla === 'sedes' ? 'sedes' : (str_ends_with($pantalla, 'curso') ? 'curso' : 'convocatoria');
    echo jm_fo_cabecera($activa); // phpcs:ignore -- HTML construido y escapado arriba.
    if ($pantalla === 'lista-convocatoria') {
        echo '<div class="jm-adm-consejo">' . jm_fo_adm_icono('calplus', 18)
            . '<p><strong>¿Varias fechas del mismo curso?</strong> Prográmalas de una vez desde el '
            . '<a href="' . esc_url(admin_url('admin.php?page=jm-formacion#nueva')) . '">Panel → Programar fechas</a>.</p></div>';
    }
});

/* ============================================================
   4. DATOS PARA EL PANEL
   ============================================================ */

/** Plazas de una convocatoria: null si no se gestionan. */
function jm_fo_plazas_estado(?int $plazas, ?int $ocupadas): ?array
{
    if ($plazas === null || $plazas <= 0) {
        return null;
    }
    $ocupadas = max(0, min($plazas, (int) $ocupadas));
    $libres = $plazas - $ocupadas;
    return [
        'plazas'   => $plazas,
        'ocupadas' => $ocupadas,
        'libres'   => $libres,
        'tono'     => $libres === 0 ? 'completo' : ($libres <= 3 ? 'ultimas' : 'ok'),
        'texto'    => $libres === 0 ? 'Completo' : ($libres <= 3 ? ($libres === 1 ? 'Última plaza' : 'Últimas ' . $libres . ' plazas') : $libres . ' libres'),
        'ancho'    => (int) round($ocupadas / $plazas * 100),
    ];
}

/** Todo lo que pinta el panel, en una sola pasada. */
function jm_fo_admin_datos(): array
{
    $hoy = str_replace('-', '', jm_fo_hoy());

    $cursos = [];
    $q = get_posts([
        'post_type'   => 'curso',
        'post_status' => ['publish', 'draft', 'private'],
        'numberposts' => -1,
        'meta_key'    => 'jm_orden',
        'orderby'     => ['meta_value_num' => 'ASC', 'title' => 'ASC'],
    ]);
    /* Cursos sin orden (no deberían quedar: jm_fo_completar_curso lo pone). */
    $sin_orden = get_posts(['post_type' => 'curso', 'post_status' => ['publish', 'draft', 'private'], 'numberposts' => -1, 'exclude' => wp_list_pluck($q, 'ID'), 'orderby' => 'title', 'order' => 'ASC']);
    foreach (array_merge($q, $sin_orden) as $p) {
        $cursos[$p->ID] = [
            'id'      => $p->ID,
            'nombre'  => get_the_title($p),
            'corto'   => (string) get_post_meta($p->ID, 'jm_nombre_corto', true) ?: get_the_title($p),
            'norma'   => (string) get_post_meta($p->ID, 'jm_norma', true),
            'estado'  => $p->post_status,
            'url'     => get_permalink($p),
            'editar'  => get_edit_post_link($p->ID, 'raw'),
            'proximas' => 0,
        ];
    }

    $sedes = [];
    $terminos = get_terms(['taxonomy' => 'sede_formacion', 'hide_empty' => false, 'orderby' => 'term_id']);
    foreach ((is_wp_error($terminos) ? [] : $terminos) as $t) {
        $sedes[$t->term_id] = [
            'id'       => $t->term_id,
            'nombre'   => $t->name,
            'zona'     => (string) get_term_meta($t->term_id, 'jm_zona', true),
            'editar'   => get_edit_term_link($t->term_id, 'sede_formacion', 'convocatoria'),
            'proximas' => 0,
        ];
    }

    $convocatorias = [];
    $entradas = get_posts([
        'post_type'        => 'convocatoria',
        'post_status'      => 'publish',
        'numberposts'      => -1,
        'suppress_filters' => true,
        'meta_key'         => 'jm_fecha',
        'orderby'          => ['meta_value_num' => 'ASC', 'title' => 'ASC'],
    ]);
    foreach ($entradas as $p) {
        $fecha = preg_replace('/\D/', '', (string) get_post_meta($p->ID, 'jm_fecha', true));
        $curso = (int) get_post_meta($p->ID, 'jm_curso', true);
        $sede = jm_fo_sede_de($p->ID);
        $num = static function ($v) {
            return ($v === '' || $v === null || $v === false) ? null : (int) $v;
        };
        $futura = $fecha >= $hoy;
        if ($futura && isset($cursos[$curso])) {
            $cursos[$curso]['proximas']++;
        }
        if ($futura && isset($sedes[$sede])) {
            $sedes[$sede]['proximas']++;
        }
        $convocatorias[] = [
            'id'       => $p->ID,
            'fecha'    => $fecha,
            'iso'      => jm_fo_iso($fecha),
            'futura'   => $futura,
            'curso'    => $curso,
            'sede'     => $sede,
            'inicio'   => (string) get_post_meta($p->ID, 'jm_inicio', true),
            'fin'      => (string) get_post_meta($p->ID, 'jm_fin', true),
            'plazas'   => $num(get_post_meta($p->ID, 'jm_plazas', true)),
            'ocupadas' => $num(get_post_meta($p->ID, 'jm_ocupadas', true)),
            'editar'   => get_edit_post_link($p->ID, 'raw'),
        ];
    }

    return ['hoy' => $hoy, 'cursos' => $cursos, 'sedes' => $sedes, 'convocatorias' => $convocatorias];
}

/** «hoy», «mañana», «en 6 días», «hace 3 días». */
function jm_fo_relativo(string $iso): string
{
    $dias = (int) round((strtotime($iso . ' 00:00:00 UTC') - strtotime(jm_fo_hoy() . ' 00:00:00 UTC')) / DAY_IN_SECONDS);
    if ($dias === 0) {
        return 'hoy';
    }
    if ($dias === 1) {
        return 'mañana';
    }
    if ($dias === -1) {
        return 'ayer';
    }
    return $dias > 0 ? 'en ' . $dias . ' días' : 'hace ' . abs($dias) . ' días';
}

/** «lun 19 oct» */
function jm_fo_fecha_corta(string $iso): string
{
    $p = jm_fo_partes($iso);
    return mb_substr($p['diaSemana'], 0, 3) . ' ' . $p['dia'] . ' ' . $p['mesCorto'];
}

/* ============================================================
   5. PANEL
   ============================================================ */

function jm_fo_pantalla_panel(): void
{
    if (!current_user_can('edit_posts')) {
        return;
    }
    $d = jm_fo_admin_datos();
    $hoy_iso = jm_fo_hoy();
    $proximas = array_values(array_filter($d['convocatorias'], static fn ($c) => $c['futura']));
    $en_30 = str_replace('-', '', wp_date('Y-m-d', strtotime('+30 days', current_time('timestamp', true))));
    $mes_que_viene = count(array_filter($proximas, static fn ($c) => $c['fecha'] <= $en_30));
    $cursos_con_fechas = count(array_filter($d['cursos'], static fn ($c) => $c['proximas'] > 0));
    $primera = $proximas[0] ?? null;
    $ultima = $proximas ? end($proximas) : null;

    $con_plazas = array_filter($proximas, static fn ($c) => jm_fo_plazas_estado($c['plazas'], $c['ocupadas']) !== null);
    $libres = array_sum(array_map(static fn ($c) => jm_fo_plazas_estado($c['plazas'], $c['ocupadas'])['libres'], $con_plazas));
    $completas = array_filter($con_plazas, static fn ($c) => jm_fo_plazas_estado($c['plazas'], $c['ocupadas'])['libres'] === 0);

    /* Avisos: solo lo que pide hacer algo. */
    $avisos = [];
    $rotas = array_filter($proximas, static fn ($c) => !isset($d['cursos'][$c['curso']]) || !isset($d['sedes'][$c['sede']]));
    if ($rotas) {
        $avisos[] = ['error', count($rotas) === 1 ? 'Hay 1 convocatoria próxima sin curso o sin sede: no se ve bien en la web.' : 'Hay ' . count($rotas) . ' convocatorias próximas sin curso o sin sede: no se ven bien en la web.', admin_url('edit.php?post_type=convocatoria'), 'Revisarlas'];
    }
    if (!$proximas && $d['cursos']) {
        $avisos[] = ['aviso', 'No hay ninguna fecha programada: el calendario de la web sale vacío y todos los cursos aparecen como «A medida».', '#nueva', 'Programar fechas'];
    } elseif ($ultima && $ultima['fecha'] < str_replace('-', '', wp_date('Y-m-d', strtotime('+21 days', current_time('timestamp', true))))) {
        $avisos[] = ['aviso', 'La última fecha programada es el ' . jm_fo_fecha_corta($ultima['iso']) . '. Programa las siguientes para que el calendario no se quede vacío.', '#nueva', 'Programar fechas'];
    }
    if ($completas) {
        $avisos[] = ['info', count($completas) === 1 ? '1 convocatoria está completa: en la web sale «Completo».' : count($completas) . ' convocatorias están completas: en la web sale «Completo».', '', ''];
    }

    /* Mensajes tras crear. */
    $creadas = isset($_GET['creadas']) ? (int) $_GET['creadas'] : -1;
    $repetidas = isset($_GET['repetidas']) ? (int) $_GET['repetidas'] : 0;
    $error = isset($_GET['error']) ? sanitize_key(wp_unslash($_GET['error'])) : '';
    $nuevas = isset($_GET['nuevas']) ? array_map('intval', explode(',', sanitize_text_field(wp_unslash($_GET['nuevas'])))) : [];

    /* Formulario precargado: ?curso=ID o ?repetir=ID de convocatoria. */
    $pre = ['curso' => 0, 'sede' => 0, 'inicio' => '07:30', 'fin' => '15:30', 'plazas' => ''];
    if (!empty($_GET['curso'])) {
        $pre['curso'] = (int) $_GET['curso'];
    }
    if (!empty($_GET['repetir']) && get_post_type((int) $_GET['repetir']) === 'convocatoria') {
        $r = (int) $_GET['repetir'];
        $pre = [
            'curso'  => (int) get_post_meta($r, 'jm_curso', true),
            'sede'   => jm_fo_sede_de($r),
            'inicio' => (string) get_post_meta($r, 'jm_inicio', true) ?: '07:30',
            'fin'    => (string) get_post_meta($r, 'jm_fin', true) ?: '15:30',
            'plazas' => (string) get_post_meta($r, 'jm_plazas', true),
        ];
    }
    if (count($d['sedes']) === 1 && !$pre['sede']) {
        $pre['sede'] = (int) array_key_first($d['sedes']);
    }

    $datos_js = [
        'cursos'        => array_map(static fn ($c) => ['n' => $c['nombre'], 'c' => $c['corto']], $d['cursos']),
        'sedes'         => array_map(static fn ($s) => ['n' => $s['nombre']], $d['sedes']),
        'convocatorias' => array_map(static fn ($c) => ['id' => $c['id'], 'f' => $c['iso'], 'c' => $c['curso'], 's' => $c['sede']], $d['convocatorias']),
    ];
    ?>
    <div class="wrap jm-adm-panel">
        <h1 class="screen-reader-text">Panel de Formación</h1>
        <?php echo jm_fo_cabecera('panel'); // phpcs:ignore ?>
        <hr class="wp-header-end">

        <header class="jm-adm-hero">
            <div>
                <p class="jm-adm-eyebrow">Panel de formación</p>
                <h2 class="jm-adm-hero__titulo">Cursos y convocatorias</h2>
                <p class="jm-adm-hero__texto">Lo que programes aquí se publica al momento en el calendario de la web, en la ficha de cada curso y en el formulario de solicitud.</p>
            </div>
            <div class="jm-adm-hero__acciones">
                <a class="jm-adm-btn jm-adm-btn--primario" href="#nueva" data-ir-a="nueva"><?php echo jm_fo_adm_icono('calplus', 18); // phpcs:ignore ?> Programar fechas</a>
                <a class="jm-adm-btn jm-adm-btn--claro" href="<?php echo esc_url(admin_url('post-new.php?post_type=curso')); ?>"><?php echo jm_fo_adm_icono('plus', 18); // phpcs:ignore ?> Nuevo curso</a>
            </div>
        </header>

        <?php if ($creadas >= 0 || $error) : ?>
            <div class="jm-adm-mensaje jm-adm-mensaje--<?php echo $error ? 'error' : 'ok'; ?>" role="status">
                <?php echo jm_fo_adm_icono($error ? 'alert' : 'check', 18); // phpcs:ignore ?>
                <p>
                    <?php
                    if ($error) {
                        $errores = [
                            'curso'   => 'Elige un curso.',
                            'sede'    => 'Elige una sede.',
                            'fechas'  => 'Añade al menos una fecha válida.',
                            'horario' => 'Revisa el horario: la hora de fin debe ser posterior a la de inicio.',
                            'permiso' => 'Tu usuario no puede publicar convocatorias.',
                        ];
                        echo esc_html($errores[$error] ?? 'No se ha podido guardar. Inténtalo de nuevo.');
                    } else {
                        echo esc_html($creadas === 1 ? 'Convocatoria creada y publicada.' : $creadas . ' convocatorias creadas y publicadas.');
                        if ($repetidas) {
                            echo ' ' . esc_html($repetidas === 1 ? '1 fecha ya existía y no se ha duplicado.' : $repetidas . ' fechas ya existían y no se han duplicado.');
                        }
                    }
                    ?>
                </p>
            </div>
        <?php endif; ?>

        <section class="jm-adm-cifras" aria-label="Resumen">
            <div class="jm-adm-cifra">
                <span class="jm-adm-cifra__k">Próximas convocatorias</span>
                <span class="jm-adm-cifra__v"><?php echo esc_html((string) count($proximas)); ?></span>
                <span class="jm-adm-cifra__s"><?php echo esc_html($mes_que_viene . ' en los próximos 30 días'); ?></span>
            </div>
            <div class="jm-adm-cifra">
                <span class="jm-adm-cifra__k">Próxima fecha</span>
                <?php if ($primera) : ?>
                    <span class="jm-adm-cifra__v jm-adm-cifra__v--texto"><?php echo esc_html(ucfirst(jm_fo_fecha_corta($primera['iso']))); ?></span>
                    <span class="jm-adm-cifra__s"><?php echo esc_html(($d['cursos'][$primera['curso']]['corto'] ?? 'Sin curso') . ' · ' . jm_fo_relativo($primera['iso'])); ?></span>
                <?php else : ?>
                    <span class="jm-adm-cifra__v jm-adm-cifra__v--texto">—</span>
                    <span class="jm-adm-cifra__s">Sin fechas programadas</span>
                <?php endif; ?>
            </div>
            <div class="jm-adm-cifra">
                <span class="jm-adm-cifra__k">Cursos con fechas</span>
                <span class="jm-adm-cifra__v"><?php echo esc_html($cursos_con_fechas . ' / ' . count($d['cursos'])); ?></span>
                <span class="jm-adm-cifra__s">El resto sale como «A medida»</span>
            </div>
            <div class="jm-adm-cifra">
                <span class="jm-adm-cifra__k">Plazas libres</span>
                <?php if ($con_plazas) : ?>
                    <span class="jm-adm-cifra__v"><?php echo esc_html((string) $libres); ?></span>
                    <span class="jm-adm-cifra__s"><?php echo esc_html('en ' . count($con_plazas) . (count($con_plazas) === 1 ? ' convocatoria con plazas' : ' convocatorias con plazas')); ?></span>
                <?php else : ?>
                    <span class="jm-adm-cifra__v jm-adm-cifra__v--texto">Sin gestionar</span>
                    <span class="jm-adm-cifra__s">En la web sale «Consultar plazas»</span>
                <?php endif; ?>
            </div>
        </section>

        <?php if ($avisos) : ?>
            <section class="jm-adm-avisos" aria-label="Avisos">
                <?php foreach ($avisos as [$tono, $texto, $url, $accion]) : ?>
                    <div class="jm-adm-aviso jm-adm-aviso--<?php echo esc_attr($tono); ?>">
                        <?php echo jm_fo_adm_icono($tono === 'info' ? 'info' : 'alert', 18); // phpcs:ignore ?>
                        <p><?php echo esc_html($texto); ?></p>
                        <?php if ($url) : ?>
                            <a href="<?php echo esc_url($url); ?>"<?php echo str_starts_with($url, '#') ? ' data-ir-a="' . esc_attr(substr($url, 1)) . '"' : ''; ?>><?php echo esc_html($accion); ?></a>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </section>
        <?php endif; ?>

        <div class="jm-adm-rejilla">
            <div class="jm-adm-col">

                <!-- PROGRAMAR FECHAS -->
                <section class="jm-adm-tarjeta" id="nueva" aria-labelledby="jm-fo-nueva-t">
                    <div class="jm-adm-tarjeta__cab">
                        <div>
                            <h2 id="jm-fo-nueva-t"><?php echo jm_fo_adm_icono('calplus', 20); // phpcs:ignore ?> Programar fechas</h2>
                            <p>Elige el curso y la sede y añade una o varias fechas: se crea una convocatoria por fecha.</p>
                        </div>
                    </div>
                    <?php if (!$d['cursos'] || !$d['sedes']) : ?>
                        <div class="jm-adm-vacio">
                            <p><?php echo esc_html(!$d['cursos'] ? 'Antes de programar fechas crea al menos un curso.' : 'Antes de programar fechas crea al menos una sede.'); ?></p>
                            <a class="jm-adm-btn jm-adm-btn--secundario" href="<?php echo esc_url(!$d['cursos'] ? admin_url('post-new.php?post_type=curso') : admin_url('edit-tags.php?taxonomy=sede_formacion&post_type=convocatoria')); ?>"><?php echo esc_html(!$d['cursos'] ? 'Crear un curso' : 'Crear una sede'); ?></a>
                        </div>
                    <?php else : ?>
                        <form class="jm-adm-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" data-programar>
                            <input type="hidden" name="action" value="jm_fo_crear">
                            <?php wp_nonce_field('jm_fo_crear'); ?>
                            <div class="jm-adm-campos jm-adm-campos--2">
                                <label class="jm-adm-campo">
                                    <span class="jm-adm-campo__k">Curso</span>
                                    <select name="curso" required data-campo="curso">
                                        <option value="">Elige un curso…</option>
                                        <?php foreach ($d['cursos'] as $c) : ?>
                                            <option value="<?php echo esc_attr((string) $c['id']); ?>" <?php selected($pre['curso'], $c['id']); ?>><?php echo esc_html($c['nombre'] . ($c['norma'] ? ' · ' . $c['norma'] : '') . ($c['estado'] !== 'publish' ? ' (borrador)' : '')); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </label>
                                <label class="jm-adm-campo">
                                    <span class="jm-adm-campo__k">Sede</span>
                                    <select name="sede" required data-campo="sede">
                                        <option value="">Elige una sede…</option>
                                        <?php foreach ($d['sedes'] as $s) : ?>
                                            <option value="<?php echo esc_attr((string) $s['id']); ?>" <?php selected($pre['sede'], $s['id']); ?>><?php echo esc_html($s['nombre'] . ($s['zona'] ? ' (' . $s['zona'] . ')' : '')); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </label>
                            </div>

                            <div class="jm-adm-campo">
                                <span class="jm-adm-campo__k" id="jm-fo-fechas-k">Fechas</span>
                                <div class="jm-adm-fechas" data-fechas>
                                    <div class="jm-adm-fechas__entrada">
                                        <input type="date" name="fechas[]" min="<?php echo esc_attr($hoy_iso); ?>" required aria-labelledby="jm-fo-fechas-k" data-fecha>
                                        <button type="button" class="jm-adm-btn jm-adm-btn--secundario" data-anadir hidden><?php echo jm_fo_adm_icono('plus', 16); // phpcs:ignore ?> Añadir fecha</button>
                                    </div>
                                    <ul class="jm-adm-chips" data-chips aria-live="polite"></ul>
                                </div>
                                <span class="jm-adm-campo__ayuda">Añade todas las que quieras, o púlsalas en el calendario de la derecha.</span>
                            </div>

                            <div class="jm-adm-campos jm-adm-campos--3">
                                <label class="jm-adm-campo">
                                    <span class="jm-adm-campo__k">Hora de inicio</span>
                                    <input type="time" name="inicio" value="<?php echo esc_attr($pre['inicio']); ?>" required data-campo="inicio">
                                </label>
                                <label class="jm-adm-campo">
                                    <span class="jm-adm-campo__k">Hora de fin</span>
                                    <input type="time" name="fin" value="<?php echo esc_attr($pre['fin']); ?>" required data-campo="fin">
                                </label>
                                <label class="jm-adm-campo">
                                    <span class="jm-adm-campo__k">Plazas <em>(opcional)</em></span>
                                    <input type="number" name="plazas" min="1" max="999" step="1" value="<?php echo esc_attr($pre['plazas']); ?>" placeholder="Consultar plazas" data-campo="plazas">
                                </label>
                            </div>

                            <div class="jm-adm-form__pie">
                                <p class="jm-adm-resumen" data-resumen aria-live="polite">Elige curso, sede y fechas.</p>
                                <button type="submit" class="jm-adm-btn jm-adm-btn--primario" data-enviar><?php echo jm_fo_adm_icono('check', 18); // phpcs:ignore ?> <span data-enviar-texto>Crear convocatorias</span></button>
                            </div>
                        </form>
                    <?php endif; ?>
                </section>

                <!-- AGENDA -->
                <section class="jm-adm-tarjeta" id="agenda" aria-labelledby="jm-fo-agenda-t">
                    <div class="jm-adm-tarjeta__cab">
                        <div>
                            <h2 id="jm-fo-agenda-t"><?php echo jm_fo_adm_icono('list', 20); // phpcs:ignore ?> Agenda</h2>
                            <p>Todas las convocatorias publicadas. Las celebradas dejan de verse en la web solas.</p>
                        </div>
                        <div class="jm-adm-filtros">
                            <div class="jm-adm-segmento" role="tablist" aria-label="Qué convocatorias ver">
                                <button type="button" role="tab" aria-selected="true" data-cuando="proxima">Próximas <span><?php echo esc_html((string) count($proximas)); ?></span></button>
                                <button type="button" role="tab" aria-selected="false" data-cuando="pasada">Celebradas <span><?php echo esc_html((string) (count($d['convocatorias']) - count($proximas))); ?></span></button>
                            </div>
                            <label class="screen-reader-text" for="jm-fo-f-curso">Filtrar por curso</label>
                            <select id="jm-fo-f-curso" data-filtro="curso">
                                <option value="">Todos los cursos</option>
                                <?php foreach ($d['cursos'] as $c) : ?>
                                    <option value="<?php echo esc_attr((string) $c['id']); ?>"><?php echo esc_html($c['corto']); ?></option>
                                <?php endforeach; ?>
                            </select>
                            <label class="screen-reader-text" for="jm-fo-f-sede">Filtrar por sede</label>
                            <select id="jm-fo-f-sede" data-filtro="sede">
                                <option value="">Todas las sedes</option>
                                <?php foreach ($d['sedes'] as $s) : ?>
                                    <option value="<?php echo esc_attr((string) $s['id']); ?>"><?php echo esc_html($s['nombre']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                    <div class="jm-adm-agenda" data-agenda>
                        <?php
                        /* Próximas en orden; celebradas de la más reciente a la más antigua. */
                        $grupos = ['proxima' => [], 'pasada' => []];
                        foreach ($d['convocatorias'] as $c) {
                            $grupos[$c['futura'] ? 'proxima' : 'pasada'][substr($c['iso'], 0, 7)][] = $c;
                        }
                        krsort($grupos['pasada']);
                        foreach ($grupos['pasada'] as &$lista) {
                            $lista = array_reverse($lista);
                        }
                        unset($lista);
                        foreach ($grupos as $cuando => $meses) :
                            foreach ($meses as $mes => $filas) :
                                ?>
                                <section class="jm-adm-mes" data-mes data-cuando="<?php echo esc_attr($cuando); ?>"<?php echo $cuando === 'pasada' ? ' hidden' : ''; ?>>
                                    <h3><?php echo esc_html(jm_fo_nombre_mes($mes)); ?> <span data-mes-n><?php echo esc_html((string) count($filas)); ?></span></h3>
                                    <ul>
                                        <?php foreach ($filas as $c) :
                                            $p = jm_fo_partes($c['iso']);
                                            $curso = $d['cursos'][$c['curso']] ?? null;
                                            $sede = $d['sedes'][$c['sede']] ?? null;
                                            $pl = jm_fo_plazas_estado($c['plazas'], $c['ocupadas']);
                                            ?>
                                            <li class="jm-adm-fila<?php echo in_array($c['id'], $nuevas, true) ? ' es-nueva' : ''; ?><?php echo $c['iso'] === $hoy_iso ? ' es-hoy' : ''; ?>"
                                                data-fila data-id="<?php echo esc_attr((string) $c['id']); ?>" data-curso="<?php echo esc_attr((string) $c['curso']); ?>" data-sede="<?php echo esc_attr((string) $c['sede']); ?>"
                                                data-inicio="<?php echo esc_attr($c['inicio']); ?>" data-fin="<?php echo esc_attr($c['fin']); ?>" data-plazas="<?php echo esc_attr((string) ($c['plazas'] ?? '')); ?>">
                                                <div class="jm-adm-fecha" aria-hidden="true">
                                                    <span class="jm-adm-fecha__sem"><?php echo esc_html(mb_substr($p['diaSemana'], 0, 3)); ?></span>
                                                    <span class="jm-adm-fecha__dia"><?php echo esc_html((string) $p['dia']); ?></span>
                                                    <span class="jm-adm-fecha__mes"><?php echo esc_html($p['mesCorto']); ?></span>
                                                </div>
                                                <div class="jm-adm-fila__info">
                                                    <p class="jm-adm-fila__curso">
                                                        <span class="screen-reader-text"><?php echo esc_html($p['diaSemana'] . ' ' . $p['dia'] . ' de ' . $p['mes'] . ': '); ?></span>
                                                        <?php if ($curso) : ?>
                                                            <a href="<?php echo esc_url($c['editar']); ?>"><?php echo esc_html($curso['nombre']); ?></a>
                                                            <?php if ($curso['norma']) : ?><span class="jm-adm-chip"><?php echo esc_html($curso['norma']); ?></span><?php endif; ?>
                                                        <?php else : ?>
                                                            <a class="jm-adm-falta" href="<?php echo esc_url($c['editar']); ?>">Sin curso: corrígela</a>
                                                        <?php endif; ?>
                                                    </p>
                                                    <p class="jm-adm-fila__meta">
                                                        <span><?php echo jm_fo_adm_icono('pin', 14); // phpcs:ignore ?> <?php echo $sede ? esc_html($sede['nombre']) : '<span class="jm-adm-falta">Sin sede</span>'; ?></span>
                                                        <span><?php echo jm_fo_adm_icono('clock', 14); // phpcs:ignore ?> <?php echo esc_html(($c['inicio'] ?: '—') . '–' . ($c['fin'] ?: '—')); ?></span>
                                                        <span class="jm-adm-fila__cuando"><?php echo esc_html(jm_fo_relativo($c['iso'])); ?></span>
                                                    </p>
                                                </div>
                                                <div class="jm-adm-plazas<?php echo $pl ? ' jm-adm-plazas--' . esc_attr($pl['tono']) : ' jm-adm-plazas--sin'; ?>" data-plazas-caja>
                                                    <?php if ($pl) : ?>
                                                        <div class="jm-adm-plazas__cab">
                                                            <span class="jm-adm-plazas__texto" data-plazas-texto><?php echo esc_html($pl['texto']); ?></span>
                                                            <span class="jm-adm-plazas__n"><span data-plazas-ocupadas><?php echo esc_html((string) $pl['ocupadas']); ?></span>/<?php echo esc_html((string) $pl['plazas']); ?></span>
                                                        </div>
                                                        <span class="jm-adm-plazas__barra" aria-hidden="true"><span data-plazas-barra style="width:<?php echo esc_attr((string) $pl['ancho']); ?>%"></span></span>
                                                        <?php if ($c['futura']) : ?>
                                                            <div class="jm-adm-plazas__botones">
                                                                <button type="button" data-ocupar="-1" aria-label="Liberar una plaza"><?php echo jm_fo_adm_icono('minus', 14); // phpcs:ignore ?></button>
                                                                <button type="button" data-ocupar="1" aria-label="Ocupar una plaza"><?php echo jm_fo_adm_icono('plus', 14); // phpcs:ignore ?></button>
                                                            </div>
                                                        <?php endif; ?>
                                                    <?php else : ?>
                                                        <span class="jm-adm-plazas__texto">Consultar plazas</span>
                                                    <?php endif; ?>
                                                </div>
                                                <div class="jm-adm-fila__acciones">
                                                    <button type="button" class="jm-adm-icono" data-repetir title="Programar otra fecha igual"><?php echo jm_fo_adm_icono('repeat', 16); // phpcs:ignore ?><span class="screen-reader-text">Programar otra fecha igual</span></button>
                                                    <a class="jm-adm-icono" href="<?php echo esc_url($c['editar']); ?>" title="Editar"><?php echo jm_fo_adm_icono('pencil', 16); // phpcs:ignore ?><span class="screen-reader-text">Editar</span></a>
                                                    <button type="button" class="jm-adm-icono jm-adm-icono--peligro" data-papelera title="Enviar a la papelera"><?php echo jm_fo_adm_icono('trash', 16); // phpcs:ignore ?><span class="screen-reader-text">Enviar a la papelera</span></button>
                                                </div>
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
                                </section>
                                <?php
                            endforeach;
                        endforeach;
                        ?>
                        <div class="jm-adm-vacio" data-agenda-vacia<?php echo $proximas ? ' hidden' : ''; ?>>
                            <?php echo jm_fo_adm_icono('calendar', 28); // phpcs:ignore ?>
                            <p data-agenda-vacia-texto>No hay convocatorias próximas.</p>
                        </div>
                    </div>
                </section>
            </div>

            <aside class="jm-adm-col jm-adm-col--lateral">
                <!-- CALENDARIO -->
                <section class="jm-adm-tarjeta jm-adm-tarjeta--calendario" aria-labelledby="jm-fo-cal-t">
                    <div class="jm-adm-cal" data-calendario>
                        <div class="jm-adm-cal__cab">
                            <h2 id="jm-fo-cal-t" data-cal-titulo>Calendario</h2>
                            <div>
                                <button type="button" class="jm-adm-icono" data-cal-mover="-1" aria-label="Mes anterior"><?php echo jm_fo_adm_icono('left', 16); // phpcs:ignore ?></button>
                                <button type="button" class="jm-adm-cal__hoy" data-cal-hoy>Hoy</button>
                                <button type="button" class="jm-adm-icono" data-cal-mover="1" aria-label="Mes siguiente"><?php echo jm_fo_adm_icono('right', 16); // phpcs:ignore ?></button>
                            </div>
                        </div>
                        <div class="jm-adm-cal__semana" aria-hidden="true"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div>
                        <div class="jm-adm-cal__dias" data-cal-dias role="grid"></div>
                        <p class="jm-adm-cal__leyenda"><span class="jm-adm-cal__punto"></span> Con convocatoria · Pulsa un día futuro para añadirlo a «Programar fechas».</p>
                    </div>
                </section>

                <!-- CURSOS -->
                <section class="jm-adm-tarjeta" aria-labelledby="jm-fo-cursos-t">
                    <div class="jm-adm-tarjeta__cab">
                        <div>
                            <h2 id="jm-fo-cursos-t"><?php echo jm_fo_adm_icono('book', 20); // phpcs:ignore ?> Cursos</h2>
                            <p>Con fechas próximas salen como «Convocatoria abierta»; sin ellas, como «A medida». Es automático.</p>
                        </div>
                    </div>
                    <ul class="jm-adm-lista">
                        <?php foreach ($d['cursos'] as $c) : ?>
                            <li>
                                <div class="jm-adm-lista__info">
                                    <a href="<?php echo esc_url($c['editar']); ?>" class="jm-adm-lista__nombre"><?php echo esc_html($c['nombre']); ?></a>
                                    <span class="jm-adm-pastilla jm-adm-pastilla--<?php echo $c['proximas'] ? 'ok' : 'neutra'; ?>">
                                        <?php echo esc_html($c['estado'] !== 'publish' ? 'Borrador' : ($c['proximas'] ? ($c['proximas'] === 1 ? '1 fecha' : $c['proximas'] . ' fechas') : 'A medida')); ?>
                                    </span>
                                </div>
                                <div class="jm-adm-lista__acciones">
                                    <button type="button" class="jm-adm-enlace" data-programar-curso="<?php echo esc_attr((string) $c['id']); ?>"><?php echo jm_fo_adm_icono('plus', 14); // phpcs:ignore ?> Fechas</button>
                                    <a class="jm-adm-enlace" href="<?php echo esc_url($c['url']); ?>" target="_blank" rel="noopener">Ficha <?php echo jm_fo_adm_icono('external', 13); // phpcs:ignore ?></a>
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                    <a class="jm-adm-btn jm-adm-btn--secundario jm-adm-btn--bloque" href="<?php echo esc_url(admin_url('post-new.php?post_type=curso')); ?>"><?php echo jm_fo_adm_icono('plus', 16); // phpcs:ignore ?> Nuevo curso</a>
                </section>

                <!-- SEDES -->
                <section class="jm-adm-tarjeta" aria-labelledby="jm-fo-sedes-t">
                    <div class="jm-adm-tarjeta__cab">
                        <div>
                            <h2 id="jm-fo-sedes-t"><?php echo jm_fo_adm_icono('pin', 20); // phpcs:ignore ?> Sedes</h2>
                        </div>
                    </div>
                    <ul class="jm-adm-lista">
                        <?php foreach ($d['sedes'] as $s) : ?>
                            <li>
                                <div class="jm-adm-lista__info">
                                    <a href="<?php echo esc_url($s['editar']); ?>" class="jm-adm-lista__nombre"><?php echo esc_html($s['nombre']); ?></a>
                                    <span class="jm-adm-lista__sub"><?php echo esc_html(($s['zona'] ? $s['zona'] . ' · ' : '') . ($s['proximas'] === 1 ? '1 fecha próxima' : $s['proximas'] . ' fechas próximas')); ?></span>
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                    <a class="jm-adm-btn jm-adm-btn--secundario jm-adm-btn--bloque" href="<?php echo esc_url(admin_url('edit-tags.php?taxonomy=sede_formacion&post_type=convocatoria')); ?>">Gestionar sedes</a>
                </section>

                <a class="jm-adm-ayuda" href="<?php echo esc_url(admin_url('admin.php?page=jm-formacion-guia')); ?>">
                    <?php echo jm_fo_adm_icono('help', 22); // phpcs:ignore ?>
                    <span><strong>¿Dudas?</strong> Guía paso a paso para crear cursos, programar fechas y gestionar plazas.</span>
                </a>
            </aside>
        </div>

        <div class="jm-adm-aviso-flotante" data-tostada role="status" aria-live="polite" hidden></div>
        <script type="application/json" id="jm-fo-datos"><?php echo wp_json_encode($datos_js); ?></script>
    </div>
    <?php
}

/* ------------------------------------------------------------
   Crear convocatorias (formulario del panel)
   ------------------------------------------------------------ */

add_action('admin_post_jm_fo_crear', function () {
    check_admin_referer('jm_fo_crear');
    $volver = static function (array $args) {
        wp_safe_redirect(add_query_arg($args, admin_url('admin.php?page=jm-formacion')) . (isset($args['creadas']) ? '#agenda' : '#nueva'));
        exit;
    };
    if (!current_user_can('publish_posts')) {
        $volver(['error' => 'permiso']);
    }
    $curso = isset($_POST['curso']) ? (int) $_POST['curso'] : 0;
    $sede = isset($_POST['sede']) ? (int) $_POST['sede'] : 0;
    $hora = static function ($clave, $defecto) {
        $v = isset($_POST[$clave]) ? sanitize_text_field(wp_unslash($_POST[$clave])) : '';
        return preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $v) ? $v : $defecto;
    };
    $inicio = $hora('inicio', '07:30');
    $fin = $hora('fin', '15:30');
    $plazas = isset($_POST['plazas']) && $_POST['plazas'] !== '' ? max(0, (int) $_POST['plazas']) : '';

    if (get_post_type($curso) !== 'curso') {
        $volver(['error' => 'curso', 'curso' => $curso]);
    }
    if (!$sede || !(get_term($sede, 'sede_formacion') instanceof WP_Term)) {
        $volver(['error' => 'sede', 'curso' => $curso]);
    }
    if ($fin <= $inicio) {
        $volver(['error' => 'horario', 'curso' => $curso]);
    }
    $fechas = [];
    foreach ((array) ($_POST['fechas'] ?? []) as $f) {
        $f = sanitize_text_field(wp_unslash((string) $f));
        if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $f, $m) && checkdate((int) $m[2], (int) $m[3], (int) $m[1])) {
            $fechas[$f] = true;
        }
    }
    if (!$fechas) {
        $volver(['error' => 'fechas', 'curso' => $curso]);
    }
    ksort($fechas);

    $GLOBALS['jm_fo_lote'] = true;
    $ids = [];
    $repetidas = 0;
    foreach (array_keys($fechas) as $iso) {
        $ymd = str_replace('-', '', $iso);
        $existe = get_posts([
            'post_type'   => 'convocatoria',
            'post_status' => 'publish',
            'numberposts' => 1,
            'fields'      => 'ids',
            'meta_query'  => [['key' => 'jm_curso', 'value' => (string) $curso], ['key' => 'jm_fecha', 'value' => $ymd]],
            'tax_query'   => [['taxonomy' => 'sede_formacion', 'terms' => [$sede]]],
        ]);
        if ($existe) {
            $repetidas++;
            continue;
        }
        $id = wp_insert_post([
            'post_type'   => 'convocatoria',
            'post_status' => 'publish',
            'post_title'  => jm_fo_titulo_convocatoria($curso, $ymd, $sede),
            'post_name'   => jm_fo_slug_convocatoria($curso, $ymd, $sede),
            'meta_input'  => jm_fo_meta_con_referencias([
                'jm_curso'    => $curso,
                'jm_fecha'    => $ymd,
                'jm_inicio'   => $inicio,
                'jm_fin'      => $fin,
                'jm_plazas'   => $plazas,
                'jm_ocupadas' => $plazas === '' ? '' : 0,
            ]),
        ], true);
        if (is_wp_error($id)) {
            continue;
        }
        wp_set_object_terms($id, [$sede], 'sede_formacion');
        jm_fo_completar_convocatoria($id);
        $ids[] = $id;
    }
    $GLOBALS['jm_fo_lote'] = false;
    jm_fo_recalcular_cursos();
    $volver(['creadas' => count($ids), 'repetidas' => $repetidas, 'nuevas' => implode(',', $ids)]);
});

/* ------------------------------------------------------------
   AJAX del panel: plazas, papelera y deshacer
   ------------------------------------------------------------ */

/** Metadatos de convocatoria + la referencia `_campo` → clave que necesita ACF. */
function jm_fo_meta_con_referencias(array $valores): array
{
    $meta = [];
    foreach ($valores as $nombre => $valor) {
        $meta[$nombre] = $valor;
        $meta['_' . $nombre] = jm_clave_campo('convocatoria', $nombre);
    }
    return $meta;
}

/** Comprueba nonce, permiso y tipo; devuelve el ID o corta con error. */
function jm_fo_ajax_convocatoria(string $permiso = 'edit_post'): int
{
    check_ajax_referer('jm_fo', 'nonce');
    $id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
    if (get_post_type($id) !== 'convocatoria' || !current_user_can($permiso, $id)) {
        wp_send_json_error(['mensaje' => 'No tienes permiso para cambiar esta convocatoria.'], 403);
    }
    return $id;
}

add_action('wp_ajax_jm_fo_ocupadas', function () {
    $id = jm_fo_ajax_convocatoria();
    $plazas = get_post_meta($id, 'jm_plazas', true);
    if ($plazas === '' || (int) $plazas <= 0) {
        wp_send_json_error(['mensaje' => 'Esta convocatoria no tiene plazas totales.'], 400);
    }
    $ocupadas = (int) get_post_meta($id, 'jm_ocupadas', true) + (isset($_POST['delta']) && (int) $_POST['delta'] < 0 ? -1 : 1);
    $ocupadas = max(0, min((int) $plazas, $ocupadas));
    jm_guardar_campo($id, 'jm_ocupadas', $ocupadas);
    wp_send_json_success(jm_fo_plazas_estado((int) $plazas, $ocupadas));
});

add_action('wp_ajax_jm_fo_papelera', function () {
    $id = jm_fo_ajax_convocatoria('delete_post');
    if (!wp_trash_post($id)) {
        wp_send_json_error(['mensaje' => 'No se ha podido enviar a la papelera.'], 500);
    }
    wp_send_json_success(['titulo' => get_the_title($id)]);
});

add_action('wp_ajax_jm_fo_restaurar', function () {
    $id = jm_fo_ajax_convocatoria('delete_post');
    if (!wp_untrash_post($id)) {
        wp_send_json_error(['mensaje' => 'No se ha podido restaurar.'], 500);
    }
    wp_send_json_success([]);
});

/* ============================================================
   6. LISTADOS
   ============================================================ */

/* ---------- Convocatorias ---------- */

add_filter('manage_convocatoria_posts_columns', function () {
    return [
        'cb'          => '<input type="checkbox">',
        'jm_fecha'    => 'Fecha',
        'jm_curso'    => 'Curso',
        'jm_sede'     => 'Sede',
        'jm_horario'  => 'Horario',
        'jm_plazas'   => 'Plazas',
    ];
});

add_filter('list_table_primary_column', function ($columna, $pantalla) {
    return $pantalla === 'edit-convocatoria' ? 'jm_fecha' : $columna;
}, 10, 2);

add_action('manage_convocatoria_posts_custom_column', function ($columna, $id) {
    switch ($columna) {
        case 'jm_fecha':
            $iso = jm_fo_iso((string) get_post_meta($id, 'jm_fecha', true));
            if (!$iso) {
                echo '<a class="row-title" href="' . esc_url(get_edit_post_link($id)) . '">Sin fecha</a>';
                break;
            }
            $p = jm_fo_partes($iso);
            $pasada = $iso < jm_fo_hoy();
            printf(
                '<a class="row-title jm-adm-col-fecha%s" href="%s"><span class="jm-adm-fecha jm-adm-fecha--mini" aria-hidden="true"><span class="jm-adm-fecha__dia">%s</span><span class="jm-adm-fecha__mes">%s</span></span><span><strong>%s</strong><small>%s</small></span></a>',
                $pasada ? ' es-pasada' : '',
                esc_url(get_edit_post_link($id)),
                esc_html((string) $p['dia']),
                esc_html($p['mesCorto']),
                esc_html(ucfirst($p['diaSemana']) . ' ' . $p['dia'] . ' de ' . $p['mes'] . ' de ' . $p['anio']),
                esc_html($pasada ? 'Celebrada' : jm_fo_relativo($iso))
            );
            if (get_post_status($id) === 'draft') {
                echo ' <span class="jm-adm-pastilla jm-adm-pastilla--neutra">Borrador</span>';
            }
            break;
        case 'jm_curso':
            $curso = (int) get_post_meta($id, 'jm_curso', true);
            if (get_post_type($curso) !== 'curso') {
                echo '<span class="jm-adm-falta">Sin curso</span>';
                break;
            }
            $norma = (string) get_post_meta($curso, 'jm_norma', true);
            echo '<a href="' . esc_url(add_query_arg('jm_curso', $curso)) . '">' . esc_html(get_the_title($curso)) . '</a>';
            if ($norma) {
                echo ' <span class="jm-adm-chip">' . esc_html($norma) . '</span>';
            }
            break;
        case 'jm_sede':
            $sede = jm_fo_sede_de((int) $id);
            echo $sede
                ? '<a href="' . esc_url(add_query_arg('jm_sede', $sede)) . '">' . esc_html((string) get_term_field('name', $sede, 'sede_formacion')) . '</a>'
                : '<span class="jm-adm-falta">Sin sede</span>';
            break;
        case 'jm_horario':
            $inicio = (string) get_post_meta($id, 'jm_inicio', true);
            $fin = (string) get_post_meta($id, 'jm_fin', true);
            echo esc_html(($inicio ?: '—') . ' – ' . ($fin ?: '—'));
            break;
        case 'jm_plazas':
            $plazas = get_post_meta($id, 'jm_plazas', true);
            $estado = jm_fo_plazas_estado($plazas === '' ? null : (int) $plazas, (int) get_post_meta($id, 'jm_ocupadas', true));
            if (!$estado) {
                echo '<span class="jm-adm-tenue">Consultar plazas</span>';
                break;
            }
            printf(
                '<span class="jm-adm-plazas jm-adm-plazas--%s jm-adm-plazas--mini"><span class="jm-adm-plazas__cab"><span class="jm-adm-plazas__texto">%s</span><span class="jm-adm-plazas__n">%d/%d</span></span><span class="jm-adm-plazas__barra"><span style="width:%d%%"></span></span></span>',
                esc_attr($estado['tono']),
                esc_html($estado['texto']),
                (int) $estado['ocupadas'],
                (int) $estado['plazas'],
                (int) $estado['ancho']
            );
            break;
    }
}, 10, 2);

/* El desplegable «Todas las fechas» filtra por fecha de publicación, que
   aquí no significa nada: se quita para no confundir con la del curso. */
add_filter('disable_months_dropdown', function ($quitar, $tipo) {
    return in_array($tipo, ['convocatoria', 'curso'], true) ? true : $quitar;
}, 10, 2);

add_filter('manage_edit-convocatoria_sortable_columns', function ($columnas) {
    $columnas['jm_fecha'] = 'jm_fecha';
    return $columnas;
});

/** Vista del listado de convocatorias: proximas (por defecto), pasadas o todas. */
function jm_fo_vista_convocatorias(): string
{
    $v = isset($_GET['jm_cuando']) ? sanitize_key(wp_unslash($_GET['jm_cuando'])) : 'proximas';
    return in_array($v, ['proximas', 'pasadas', 'todas'], true) ? $v : 'proximas';
}

add_action('pre_get_posts', function (WP_Query $q) {
    if (!is_admin() || !$q->is_main_query() || $q->get('post_type') !== 'convocatoria') {
        return;
    }
    $estado = isset($_GET['post_status']) ? sanitize_key(wp_unslash($_GET['post_status'])) : '';
    $meta = [];
    $vista = jm_fo_vista_convocatorias();
    if (in_array($estado, ['', 'all', 'publish'], true) && $vista !== 'todas') {
        $meta['fecha'] = ['key' => 'jm_fecha', 'value' => wp_date('Ymd'), 'compare' => $vista === 'proximas' ? '>=' : '<', 'type' => 'NUMERIC'];
    } else {
        $meta['fecha'] = ['key' => 'jm_fecha', 'compare' => 'EXISTS'];
    }
    if (!empty($_GET['jm_curso'])) {
        $meta[] = ['key' => 'jm_curso', 'value' => (string) (int) $_GET['jm_curso']];
    }
    $q->set('meta_query', $meta);
    if (!empty($_GET['jm_sede'])) {
        $q->set('tax_query', [['taxonomy' => 'sede_formacion', 'terms' => [(int) $_GET['jm_sede']]]]);
    }
    $orden = isset($_GET['order']) && strtolower((string) $_GET['order']) === 'desc' ? 'DESC' : (isset($_GET['order']) ? 'ASC' : ($vista === 'proximas' ? 'ASC' : 'DESC'));
    $q->set('orderby', ['fecha' => $orden, 'title' => 'ASC']);
});

add_filter('views_edit-convocatoria', function ($vistas) {
    $hoy = wp_date('Ymd');
    $cuenta = static function ($compare) use ($hoy) {
        return count(get_posts([
            'post_type'   => 'convocatoria',
            'post_status' => 'publish',
            'numberposts' => -1,
            'fields'      => 'ids',
            'meta_query'  => $compare ? [['key' => 'jm_fecha', 'value' => $hoy, 'compare' => $compare, 'type' => 'NUMERIC']] : [],
        ]));
    };
    $estado = isset($_GET['post_status']) ? sanitize_key(wp_unslash($_GET['post_status'])) : '';
    $actual = in_array($estado, ['', 'all', 'publish'], true) ? jm_fo_vista_convocatorias() : '';
    $base = admin_url('edit.php?post_type=convocatoria');
    $nuevas = [];
    foreach (['proximas' => ['Próximas', '>='], 'pasadas' => ['Celebradas', '<'], 'todas' => ['Todas', '']] as $clave => [$texto, $compare]) {
        $nuevas[$clave] = sprintf(
            '<a href="%s"%s>%s <span class="count">(%d)</span></a>',
            esc_url(add_query_arg('jm_cuando', $clave, $base)),
            $actual === $clave ? ' class="current" aria-current="page"' : '',
            esc_html($texto),
            $cuenta($compare)
        );
    }
    foreach (['draft', 'pending', 'private', 'trash'] as $clave) {
        if (isset($vistas[$clave])) {
            $nuevas[$clave] = $vistas[$clave];
        }
    }
    return $nuevas;
});

add_action('restrict_manage_posts', function ($tipo) {
    if ($tipo !== 'convocatoria') {
        return;
    }
    $curso = isset($_GET['jm_curso']) ? (int) $_GET['jm_curso'] : 0;
    $sede = isset($_GET['jm_sede']) ? (int) $_GET['jm_sede'] : 0;
    echo '<input type="hidden" name="jm_cuando" value="' . esc_attr(jm_fo_vista_convocatorias()) . '">';
    echo '<label class="screen-reader-text" for="jm-filtro-curso">Curso</label><select name="jm_curso" id="jm-filtro-curso"><option value="">Todos los cursos</option>';
    foreach (get_posts(['post_type' => 'curso', 'numberposts' => -1, 'orderby' => 'title', 'order' => 'ASC']) as $c) {
        printf('<option value="%d"%s>%s</option>', (int) $c->ID, selected($curso, $c->ID, false), esc_html(get_the_title($c)));
    }
    echo '</select><label class="screen-reader-text" for="jm-filtro-sede">Sede</label><select name="jm_sede" id="jm-filtro-sede"><option value="">Todas las sedes</option>';
    $sedes = get_terms(['taxonomy' => 'sede_formacion', 'hide_empty' => false]);
    foreach ((is_wp_error($sedes) ? [] : $sedes) as $s) {
        printf('<option value="%d"%s>%s</option>', (int) $s->term_id, selected($sede, $s->term_id, false), esc_html($s->name));
    }
    echo '</select>';
});

/* Sin «Edición rápida» (no tiene los campos de la convocatoria) y con
   «Programar otra igual», que abre el panel con el formulario relleno. */
add_filter('post_row_actions', function ($acciones, $post) {
    if ($post->post_type === 'convocatoria') {
        unset($acciones['inline hide-if-no-js'], $acciones['view']);
        if ($post->post_status !== 'trash') {
            $acciones = ['repetir' => '<a href="' . esc_url(admin_url('admin.php?page=jm-formacion&repetir=' . $post->ID . '#nueva')) . '">Programar otra igual</a>'] + $acciones;
        }
    }
    if ($post->post_type === 'curso') {
        unset($acciones['inline hide-if-no-js']);
        if ($post->post_status !== 'trash') {
            $acciones['fechas'] = '<a href="' . esc_url(admin_url('admin.php?page=jm-formacion&curso=' . $post->ID . '#nueva')) . '">Programar fechas</a>';
        }
    }
    return $acciones;
}, 10, 2);

/* ---------- Cursos ---------- */

add_filter('manage_curso_posts_columns', function () {
    return [
        'cb'          => '<input type="checkbox">',
        'title'       => 'Curso',
        'jm_norma'    => 'Norma',
        'jm_duracion' => 'Duración',
        'jm_fechas'   => 'Próximas fechas',
        'jm_estado'   => 'En la web',
        'jm_orden'    => 'Orden',
    ];
});

add_action('manage_curso_posts_custom_column', function ($columna, $id) {
    switch ($columna) {
        case 'jm_norma':
        case 'jm_duracion':
            $v = (string) get_post_meta($id, $columna, true);
            echo $v !== '' ? esc_html($v) : '<span class="jm-adm-tenue">—</span>';
            break;
        case 'jm_orden':
            echo esc_html((string) get_post_meta($id, 'jm_orden', true));
            break;
        case 'jm_fechas':
            $n = count(get_posts([
                'post_type'   => 'convocatoria',
                'post_status' => 'publish',
                'numberposts' => -1,
                'fields'      => 'ids',
                'meta_query'  => [['key' => 'jm_curso', 'value' => (string) $id], ['key' => 'jm_fecha', 'value' => wp_date('Ymd'), 'compare' => '>=', 'type' => 'NUMERIC']],
            ]));
            echo $n
                ? '<a href="' . esc_url(admin_url('edit.php?post_type=convocatoria&jm_curso=' . $id)) . '">' . esc_html($n === 1 ? '1 fecha' : $n . ' fechas') . '</a>'
                : '<a class="jm-adm-tenue" href="' . esc_url(admin_url('admin.php?page=jm-formacion&curso=' . $id . '#nueva')) . '">Programar</a>';
            break;
        case 'jm_estado':
            if (get_post_status($id) !== 'publish') {
                echo '<span class="jm-adm-pastilla jm-adm-pastilla--neutra">' . esc_html(get_post_status_object(get_post_status($id))->label ?? 'No publicado') . '</span>';
                break;
            }
            $abierta = get_post_meta($id, 'jm_convocatoria_abierta', true) === '1';
            echo '<span class="jm-adm-pastilla jm-adm-pastilla--' . ($abierta ? 'ok' : 'neutra') . '">' . esc_html($abierta ? 'Convocatoria abierta' : 'A medida') . '</span>';
            break;
    }
}, 10, 2);

add_action('pre_get_posts', function (WP_Query $q) {
    if (!is_admin() || !$q->is_main_query() || $q->get('post_type') !== 'curso' || !empty($_GET['orderby'])) {
        return;
    }
    $q->set('meta_query', ['orden' => ['key' => 'jm_orden', 'type' => 'NUMERIC', 'compare' => 'EXISTS']]);
    $q->set('orderby', ['orden' => 'ASC', 'title' => 'ASC']);
});

/* ============================================================
   7. PANTALLAS DE EDICIÓN
   ============================================================ */

/* Editor clásico: más directo para estos formularios de datos. */
add_filter('use_block_editor_for_post_type', function ($usar, $tipo) {
    return in_array($tipo, ['curso', 'convocatoria'], true) ? false : $usar;
}, 10, 2);

add_action('add_meta_boxes', function ($tipo) {
    if (!in_array($tipo, ['curso', 'convocatoria'], true)) {
        return;
    }
    remove_meta_box('postcustom', $tipo, 'normal');
    if ($tipo === 'convocatoria') {
        remove_meta_box('slugdiv', $tipo, 'normal');
        add_meta_box('jm_fo_vista', 'Así se verá en la web', 'jm_fo_caja_vista', 'convocatoria', 'side', 'high');
    } else {
        add_meta_box('jm_fo_fechas', 'Fechas de este curso', 'jm_fo_caja_fechas', 'curso', 'side', 'high');
    }
}, 20);

function jm_fo_caja_vista(WP_Post $post): void
{
    $c = jm_fo_convocatoria($post->ID);
    if (!$c || !$c['fecha']) {
        echo '<p class="jm-adm-tenue">Rellena curso, sede y fecha y pulsa «Publicar»: aquí verás cómo queda la fila del calendario.</p>';
        return;
    }
    $p = jm_fo_partes($c['fecha']);
    $pl = jm_fo_plazas_estado($c['plazas'], $c['ocupadas']);
    ?>
    <div class="jm-adm-vista">
        <div class="jm-adm-fecha" aria-hidden="true">
            <span class="jm-adm-fecha__sem"><?php echo esc_html(mb_substr($p['diaSemana'], 0, 3)); ?></span>
            <span class="jm-adm-fecha__dia"><?php echo esc_html((string) $p['dia']); ?></span>
            <span class="jm-adm-fecha__mes"><?php echo esc_html($p['mesCorto']); ?></span>
        </div>
        <div>
            <p class="jm-adm-vista__curso"><?php echo esc_html($c['curso']['nombre'] ?? 'Sin curso'); ?></p>
            <p class="jm-adm-vista__meta"><?php echo esc_html(($c['sede']['nombre'] ?? 'Sin sede') . ' · ' . $c['inicio'] . '–' . $c['fin']); ?></p>
            <p class="jm-adm-vista__plazas"><?php echo esc_html($pl ? $pl['texto'] : 'Consultar plazas'); ?></p>
        </div>
    </div>
    <p class="jm-adm-vista__nota">
        <?php echo esc_html($c['fecha'] < jm_fo_hoy() ? 'Esta fecha ya pasó: no se muestra en la web.' : 'Visible en el calendario y en el formulario de solicitud hasta el día del curso.'); ?>
    </p>
    <p><a href="<?php echo esc_url(admin_url('admin.php?page=jm-formacion#agenda')); ?>">← Volver al panel</a></p>
    <?php
}

function jm_fo_caja_fechas(WP_Post $post): void
{
    if ($post->post_status === 'auto-draft') {
        echo '<p class="jm-adm-tenue">Publica el curso y después programa sus fechas desde aquí o desde el panel.</p>';
        return;
    }
    $abierta = get_post_meta($post->ID, 'jm_convocatoria_abierta', true) === '1';
    $futuras = get_posts([
        'post_type'   => 'convocatoria',
        'post_status' => 'publish',
        'numberposts' => 6,
        'meta_key'    => 'jm_fecha',
        'orderby'     => 'meta_value_num',
        'order'       => 'ASC',
        'meta_query'  => [['key' => 'jm_curso', 'value' => (string) $post->ID], ['key' => 'jm_fecha', 'value' => wp_date('Ymd'), 'compare' => '>=', 'type' => 'NUMERIC']],
    ]);
    echo '<p><span class="jm-adm-pastilla jm-adm-pastilla--' . ($abierta ? 'ok' : 'neutra') . '">' . esc_html($abierta ? 'Convocatoria abierta' : 'A medida') . '</span></p>';
    echo '<p class="jm-adm-tenue">' . esc_html($abierta
        ? 'Sale en «Convocatorias abiertas» porque tiene fechas próximas.'
        : 'Sale en «Resto de cursos» porque no tiene fechas próximas. Cambia solo en cuanto programes una.') . '</p>';
    if ($futuras) {
        echo '<ul class="jm-adm-mini-agenda">';
        foreach ($futuras as $f) {
            $iso = jm_fo_iso((string) get_post_meta($f->ID, 'jm_fecha', true));
            $sede = jm_fo_sede_de($f->ID);
            printf(
                '<li><a href="%s"><strong>%s</strong> %s</a></li>',
                esc_url(get_edit_post_link($f->ID)),
                esc_html(jm_fo_fecha_corta($iso)),
                esc_html($sede ? (string) get_term_field('name', $sede, 'sede_formacion') : '')
            );
        }
        echo '</ul>';
    }
    printf(
        '<p><a class="jm-adm-btn jm-adm-btn--primario jm-adm-btn--bloque" href="%s">%s Programar fechas</a></p><p><a href="%s" target="_blank" rel="noopener">Ver la ficha en la web ↗</a></p>',
        esc_url(admin_url('admin.php?page=jm-formacion&curso=' . $post->ID . '#nueva')),
        jm_fo_adm_icono('calplus', 16), // phpcs:ignore
        esc_url(get_permalink($post))
    );
}

/* Ayuda sobre el formato de las preguntas, encima del editor del curso. */
add_action('edit_form_after_title', function (WP_Post $post) {
    if ($post->post_type !== 'curso') {
        return;
    }
    echo '<div class="jm-adm-nota-editor">' . jm_fo_adm_icono('info', 18) . '<div><strong>Preguntas frecuentes de la ficha (debajo).</strong> '
        . 'Escribe cada pregunta con el formato <em>Encabezado 3</em> y su respuesta en párrafos normales debajo. '
        . 'Un párrafo que empiece por «Nota:» sale destacado. Para enlazar al calendario, enlaza el texto a <code>/formacion/#calendario</code>: '
        . 'la web lo abre ya filtrado por este curso.</div></div>';
}, 20);

/* Mensajes al guardar, en el idioma del cliente. */
add_filter('post_updated_messages', function ($mensajes) {
    $panel = ' <a href="' . esc_url(admin_url('admin.php?page=jm-formacion#agenda')) . '">Volver al panel</a>';
    $mensajes['convocatoria'] = [
        1  => 'Convocatoria actualizada. Los cambios ya se ven en la web.' . $panel,
        4  => 'Convocatoria actualizada.' . $panel,
        6  => 'Convocatoria publicada: ya sale en el calendario y en el formulario.' . $panel,
        7  => 'Convocatoria guardada.',
        10 => 'Borrador guardado: no se verá en la web hasta que lo publiques.',
    ];
    $ficha = isset($GLOBALS['post']) ? ' <a href="' . esc_url(get_permalink($GLOBALS['post'])) . '" target="_blank" rel="noopener">Ver la ficha</a>' : '';
    $mensajes['curso'] = [
        1  => 'Curso actualizado.' . $ficha,
        4  => 'Curso actualizado.',
        6  => 'Curso publicado.' . $ficha . ' Ahora programa sus fechas desde el panel.',
        7  => 'Curso guardado.',
        10 => 'Borrador guardado: no se verá en la web hasta que lo publiques.',
    ];
    return $mensajes;
});

add_filter('enter_title_here', function ($texto, $post) {
    return $post->post_type === 'curso' ? 'Nombre del curso (p. ej. «Carretillas elevadoras»)' : $texto;
}, 10, 2);

/* ============================================================
   8. ESCRITORIO DE WORDPRESS: próximas fechas de un vistazo
   ============================================================ */

add_action('wp_dashboard_setup', function () {
    if (!current_user_can('edit_posts')) {
        return;
    }
    wp_add_dashboard_widget('jm_fo_escritorio', 'Formación · próximas convocatorias', function () {
        $futuras = get_posts([
            'post_type'   => 'convocatoria',
            'post_status' => 'publish',
            'numberposts' => 5,
            'meta_key'    => 'jm_fecha',
            'orderby'     => 'meta_value_num',
            'order'       => 'ASC',
            'meta_query'  => [['key' => 'jm_fecha', 'value' => wp_date('Ymd'), 'compare' => '>=', 'type' => 'NUMERIC']],
        ]);
        if (!$futuras) {
            echo '<p>No hay convocatorias próximas.</p>';
        } else {
            echo '<ul>';
            foreach ($futuras as $f) {
                $iso = jm_fo_iso((string) get_post_meta($f->ID, 'jm_fecha', true));
                printf('<li><a href="%s"><strong>%s</strong></a> · %s</li>', esc_url(get_edit_post_link($f->ID)), esc_html(jm_fo_fecha_corta($iso)), esc_html(get_the_title((int) get_post_meta($f->ID, 'jm_curso', true))));
            }
            echo '</ul>';
        }
        printf('<p><a class="button button-primary" href="%s">Abrir el panel de Formación</a></p>', esc_url(admin_url('admin.php?page=jm-formacion')));
    });
});
