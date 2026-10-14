<?php
/**
 * Catálogo de alquiler, tarjeta de máquina, ficha, comparador y solicitud.
 *
 * Traducción de src/components/alquiler/*, maquina/*, ficha/*, comparador/*,
 * spec/DatoValor.tsx y forms/FormularioDisponibilidad.tsx.
 *
 * Shortcodes (estructura/20-, 21-, 22-, 23- y 52-*.md):
 *   [jm_catalogo_filtros familia=""]      Panel de filtros técnicos + datos JSON del catálogo.
 *   [jm_catalogo_categorias familia=""]   Tiras de familias y subcategorías.
 *   [jm_catalogo_barra]                   Contador, orden, buscador móvil, «Filtrar» y chips.
 *   [jm_catalogo_pie]                     Estado vacío con rescates y «Ver N máquinas más».
 *   [jm_catalogo_cifra dato="referencias|delegaciones" familia=""]
 *   [jm_tarjeta_datos]                    Las tres cifras de la tarjeta con su estado.
 *   [jm_foto_pendiente compacto="no"]     Dibujo técnico cuando la máquina no tiene foto.
 *   [jm_specs]                            Especificaciones agrupadas de la ficha.
 *   [jm_ficha parte="destacados|aplicaciones|delegaciones|gama|nota|pdf"]
 *   [jm_migas inicio="Alquiler"]          Solo si nadie lo ha registrado antes.
 *   [jm_comparador]                       Tabla comparativa (página /comparador/).
 *   [jm_maquinas_solicitud]               Máquinas elegidas en /consultar-disponibilidad/.
 *   [jm_solicitud_asunto]                 «Solicitud de …» cuando llega ?asunto=.
 *   [jm_referencia etiqueta="Tu referencia"]  Página de gracias.
 *
 * Hooks: post_class y body_class (jm-maq-{slug} y estado de la máquina),
 * wp_footer (índice de máquinas + bandeja del comparador), admin-ajax
 * `jm_comparador` (tabla para el JS), template_redirect (?asunto=formacion).
 */

if (!defined('ABSPATH')) {
    exit;
}

const JM_CAT_MAX_COMPARAR = 4;
const JM_CAT_CACHE = 'jm_cat_maquinas_v1';

/* ==========================================================================
   Iconos (lucide, los mismos trazos que la web original)
   ========================================================================== */

function jm_cat_icono(string $nombre, int $tam = 16, float $grosor = 2, string $clase = ''): string
{
    static $trazos = [
        'buscar'     => '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
        'x'          => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        'filtros'    => '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
        'flecha'     => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'izquierda'  => '<path d="m15 18-6-6 6-6"/>',
        'derecha'    => '<path d="m9 18 6-6-6-6"/>',
        'check'      => '<path d="M20 6 9 17l-5-5"/>',
        'columnas'   => '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/>',
        'capas'      => '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
        'alerta'     => '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
        'descargar'  => '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
        'imprimir'   => '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
        'mas'        => '<path d="M5 12h14"/><path d="M12 5v14"/>',
        'chispas'    => '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    ];
    if (!isset($trazos[$nombre])) {
        return '';
    }
    return '<svg class="jm-ico' . ($clase ? ' ' . esc_attr($clase) : '') . '" width="' . $tam . '" height="' . $tam
        . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' . esc_attr((string) $grosor)
        . '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $trazos[$nombre] . '</svg>';
}

/** El hexágono relleno de los estados vacíos (marca/Hexagono.tsx). */
function jm_cat_hexagono(string $clase): string
{
    return '<svg class="' . esc_attr($clase) . '" viewBox="0 0 100 88" fill="none" aria-hidden="true" focusable="false"><path d="M27 2h46l25 42-25 42H27L2 44 27 2Z" fill="currentColor"/></svg>';
}

/* ==========================================================================
   Datos
   ========================================================================== */

/** La máquina tal cual viene de maquinas.json (tracción y nota del asesor no están en ACF). */
function jm_cat_json(string $slug): array
{
    static $indice = null;
    if ($indice === null) {
        $indice = [];
        foreach (jm_datos('maquinas.json') as $m) {
            $indice[$m['slug']] = $m;
        }
    }
    return $indice[$slug] ?? [];
}

/** Slug del término de familia → id de Next (manutencion → manipulacion). */
function jm_cat_familia_id(string $slug): string
{
    static $mapa = null;
    if ($mapa === null) {
        $mapa = [];
        foreach (jm_datos('familias.json') as $f) {
            $mapa[$f['slug']] = $f['id'];
            $mapa[$f['id']] = $f['id'];
        }
        $terminos = get_terms(['taxonomy' => 'familia', 'hide_empty' => false, 'parent' => 0]);
        if (!is_wp_error($terminos)) {
            foreach ($terminos as $t) {
                $id = (string) get_term_meta($t->term_id, 'jm_id', true);
                $mapa[$t->slug] = $id ?: ($mapa[$t->slug] ?? $t->slug);
            }
        }
    }
    return $mapa[$slug] ?? $slug;
}

function jm_cat_numero($v): ?float
{
    if ($v === '' || $v === null || !is_numeric($v)) {
        return null;
    }
    return (float) $v;
}

/**
 * Todas las máquinas de alquiler en orden de catálogo, con lo que necesitan
 * los filtros, la bandeja y la solicitud. Cacheado (se vacía al guardar).
 */
function jm_cat_maquinas(): array
{
    static $memoria = null;
    if ($memoria !== null) {
        return $memoria;
    }
    $cache = get_transient(JM_CAT_CACHE);
    if (is_array($cache)) {
        return $memoria = $cache;
    }
    $q = new WP_Query([
        'post_type'      => 'maquina',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'no_found_rows'  => true,
        'meta_query'     => [['key' => '_jmj_en_alquiler', 'value' => '1']],
        'meta_key'       => 'jm_orden',
        'orderby'        => 'meta_value_num',
        'order'          => 'ASC',
    ]);
    if (function_exists('update_post_thumbnail_cache')) {
        update_post_thumbnail_cache($q);
    }
    $lista = [];
    foreach ($q->posts as $p) {
        $m = jm_maquina($p->ID);
        if (!$m) {
            continue;
        }
        $del = json_decode((string) get_post_meta($p->ID, '_jmj_delegaciones', true), true);
        $lista[] = [
            'id'   => (int) $p->ID,
            's'    => (string) $m['slug'],
            'u'    => (string) $m['url'],
            'ma'   => (string) $m['marca'],
            'mo'   => (string) $m['modelo'],
            'f'    => $m['familia'] ? jm_cat_familia_id($m['familia']) : '',
            'sub'  => (string) $m['subcategoria'],
            'subn' => (string) $m['subcategoria_nombre'],
            'e'    => (string) $m['energia'],
            'en'   => array_values((array) $m['entornos']),
            'del'  => is_array($del) ? array_values($del) : [],
            'h'    => jm_cat_numero($m['altura']),
            'c'    => jm_cat_numero($m['carga']),
            'b'    => (string) $m['busqueda'],
            'o'    => (int) $m['orden'],
            'mini' => $m['foto_id'] ? (string) wp_get_attachment_image_url($m['foto_id'], 'thumbnail') : '',
            'i'    => (string) ($m['icono'] ?: 'tijera'),
        ];
    }
    set_transient(JM_CAT_CACHE, $lista, 12 * HOUR_IN_SECONDS);
    return $memoria = $lista;
}

function jm_cat_vaciar_cache(): void
{
    delete_transient(JM_CAT_CACHE);
}
add_action('save_post_maquina', 'jm_cat_vaciar_cache');
add_action('edited_familia', 'jm_cat_vaciar_cache');
add_action('created_familia', 'jm_cat_vaciar_cache');
add_action('deleted_post', function ($id) {
    if (get_post_type($id) === 'maquina') {
        jm_cat_vaciar_cache();
    }
});
foreach (['added_post_meta', 'updated_post_meta', 'deleted_post_meta'] as $jm_gancho) {
    add_action($jm_gancho, function ($meta_id, $post_id) {
        if (get_post_type($post_id) === 'maquina') {
            jm_cat_vaciar_cache();
        }
    }, 10, 2);
}

/** Familias con sus subcategorías y recuentos (términos de WP; si no hay, familias.json). */
function jm_cat_familias(): array
{
    static $familias = null;
    if ($familias !== null) {
        return $familias;
    }
    $n_fam = [];
    $n_sub = [];
    foreach (jm_cat_maquinas() as $m) {
        $n_fam[$m['f']] = ($n_fam[$m['f']] ?? 0) + 1;
        if ($m['sub']) {
            $n_sub[$m['sub']] = ($n_sub[$m['sub']] ?? 0) + 1;
        }
    }
    $familias = [];
    $terminos = get_terms(['taxonomy' => 'familia', 'hide_empty' => false, 'parent' => 0]);
    if (!is_wp_error($terminos) && $terminos) {
        $orden = static fn($t) => (int) get_term_meta($t->term_id, 'jm_orden', true);
        usort($terminos, static fn($a, $b) => $orden($a) <=> $orden($b));
        foreach ($terminos as $t) {
            $id = jm_cat_familia_id($t->slug);
            $subs = get_terms(['taxonomy' => 'familia', 'hide_empty' => false, 'parent' => $t->term_id]);
            $subs = is_wp_error($subs) ? [] : $subs;
            usort($subs, static fn($a, $b) => $orden($a) <=> $orden($b));
            $link = get_term_link($t);
            $familias[] = [
                'id'     => $id,
                'slug'   => $t->slug,
                'nombre' => $t->name,
                'largo'  => (string) get_term_meta($t->term_id, 'jm_nombre_largo', true),
                'icono'  => (string) get_term_meta($t->term_id, 'jm_icono', true),
                'url'    => is_wp_error($link) ? home_url('/alquiler/' . $t->slug . '/') : $link,
                'n'      => $n_fam[$id] ?? 0,
                'subs'   => array_map(static fn($s) => ['slug' => $s->slug, 'nombre' => $s->name, 'n' => $n_sub[$s->slug] ?? 0], $subs),
            ];
        }
        return $familias;
    }
    foreach (jm_datos('familias.json') as $f) {
        $familias[] = [
            'id'     => $f['id'],
            'slug'   => $f['slug'],
            'nombre' => $f['nombre'],
            'largo'  => $f['nombreLargo'],
            'icono'  => $f['icono'],
            'url'    => home_url('/alquiler/' . $f['slug'] . '/'),
            'n'      => $n_fam[$f['id']] ?? 0,
            'subs'   => array_map(static fn($s) => ['slug' => $s['slug'], 'nombre' => $s['nombre'], 'n' => $n_sub[$s['slug']] ?? 0], $f['subcategorias']),
        ];
    }
    return $familias;
}

/**
 * Familia (y subcategoría) fija de la página: atributo `familia`, o el
 * término del archivo que se está viendo.
 */
function jm_cat_contexto(array $atts = []): array
{
    $ctx = ['familia' => '', 'slug' => '', 'sub' => ''];
    $forzada = sanitize_title($atts['familia'] ?? '');
    if ($forzada) {
        $ctx['familia'] = jm_cat_familia_id($forzada);
    } else {
        $o = get_queried_object();
        if ($o instanceof WP_Term && $o->taxonomy === 'familia') {
            if ($o->parent) {
                $padre = get_term($o->parent, 'familia');
                $ctx['familia'] = ($padre && !is_wp_error($padre)) ? jm_cat_familia_id($padre->slug) : '';
                $ctx['sub'] = $o->slug;
            } else {
                $ctx['familia'] = jm_cat_familia_id($o->slug);
            }
        }
    }
    foreach (jm_cat_familias() as $f) {
        if ($f['id'] === $ctx['familia']) {
            $ctx['slug'] = $f['slug'];
        }
    }
    return $ctx;
}

/** `?m=a,b,c` (o repetido) → slugs limpios. */
function jm_cat_slugs($valor, int $max = 0): array
{
    $bruto = is_array($valor) ? $valor : [(string) $valor];
    $slugs = [];
    foreach ($bruto as $trozo) {
        foreach (explode(',', (string) $trozo) as $s) {
            $s = sanitize_title(trim($s));
            if ($s !== '' && !in_array($s, $slugs, true)) {
                $slugs[] = $s;
            }
        }
    }
    return $max ? array_slice($slugs, 0, $max) : $slugs;
}

function jm_cat_get(string $clave): string
{
    return isset($_GET[$clave]) && !is_array($_GET[$clave]) ? sanitize_text_field(wp_unslash($_GET[$clave])) : '';
}

/** Nombres de delegación por id (delegaciones.json, con el título de WP si existe). */
function jm_cat_delegaciones(): array
{
    static $mapa = null;
    if ($mapa !== null) {
        return $mapa;
    }
    $mapa = [];
    foreach (jm_datos('delegaciones.json') as $d) {
        $mapa[$d['id']] = $d['nombre'];
    }
    foreach (get_posts(['post_type' => 'delegacion', 'numberposts' => -1, 'post_status' => 'publish']) as $p) {
        if (isset($mapa[$p->post_name])) {
            $mapa[$p->post_name] = $p->post_title;
        }
    }
    return $mapa;
}

/* ==========================================================================
   Clases de la máquina (Loop Item, Single y <body>)
   ========================================================================== */

function jm_cat_clases_maquina(int $post_id): array
{
    $m = jm_maquina($post_id);
    if (!$m) {
        return [];
    }
    $clases = ['jm-maq-' . sanitize_html_class($m['slug'])];
    if ($m['energia']) {
        $clases[] = 'jm-energia-' . sanitize_html_class($m['energia']);
    }
    $json = jm_cat_json($m['slug']);
    if (($json['traccion'] ?? '') === '4x4' && $m['energia'] !== 'electrico') {
        $clases[] = 'jm-traccion-4x4';
    }
    if ($m['gama']) {
        $clases[] = 'jm-gama';
    }
    if (!$m['foto_id']) {
        $clases[] = 'jm-sin-foto';
    }
    return $clases;
}

add_filter('post_class', function ($clases, $clase, $post_id) {
    if (get_post_type($post_id) === 'maquina') {
        $clases = array_merge((array) $clases, jm_cat_clases_maquina((int) $post_id));
    }
    return $clases;
}, 10, 3);

add_filter('body_class', function ($clases) {
    if (is_singular('maquina')) {
        $clases = array_merge($clases, jm_cat_clases_maquina((int) get_queried_object_id()));
    }
    return $clases;
});

/* ==========================================================================
   Dato con su estado (spec/DatoValor.tsx)
   ========================================================================== */

function jm_cat_dato(?array $d, string $extra = ''): string
{
    $clase = $extra ? ' ' . esc_attr($extra) : '';
    if (!$d || ($d['estado'] ?? '') === 'no_aplica') {
        return '<span class="jm-value jm-dato jm-dato--na' . $clase . '" title="No aplica a este tipo de máquina">—</span>';
    }
    if ($d['estado'] === 'pendiente') {
        $nota = ($d['nota'] ?? '') ?: 'Te lo confirmamos al responder la solicitud.';
        return '<span class="jm-pendiente jm-dato' . $clase . '" title="' . esc_attr($nota) . '">'
            . jm_cat_icono('alerta', 12) . 'Pendiente</span>';
    }
    $estimado = $d['estado'] === 'estimado';
    $titulo = $estimado
        ? (($d['nota'] ?? '') ?: 'Dato sin confirmar contra la unidad de flota. Lo comprobamos al responder tu solicitud.')
        : ($d['nota'] ?? '');
    $unidad = (string) ($d['unidad'] ?? '');
    return '<span class="jm-value jm-dato' . ($estimado ? ' jm-estimado' : '') . $clase . '"'
        . ($titulo ? ' title="' . esc_attr($titulo) . '"' : '') . '>'
        . esc_html((string) ($d['texto'] ?? ''))
        . ($unidad !== '' ? '<span class="jm-dato__unidad">' . esc_html($unidad) . '</span>' : '')
        . '</span>';
}

/** Número comparable de un dato (numeroDe en Next): solo confirmados y estimados. */
function jm_cat_valor(?array $d): ?float
{
    if (!$d || !in_array($d['estado'] ?? '', ['confirmado', 'estimado'], true)) {
        return null;
    }
    return isset($d['valor']) && is_numeric($d['valor']) ? (float) $d['valor'] : null;
}

/** Foto de máquina o, si no hay, su dibujo técnico (maquina/ImagenMaquina.tsx). */
function jm_cat_imagen(array $m, string $tam = 'medium', bool $compacto = true): string
{
    if (!empty($m['foto_id'])) {
        return wp_get_attachment_image((int) $m['foto_id'], $tam, false, [
            'class'   => 'jm-imagen-maquina__img',
            'alt'     => $m['foto_alt'] ?: $m['titulo'],
            'loading' => 'lazy',
        ]);
    }
    return jm_cat_dibujo($m, $compacto);
}

function jm_cat_dibujo(array $m, bool $compacto): string
{
    $icono = $m['icono'] ?: 'tijera';
    $etiqueta = 'Dibujo técnico de ' . trim($m['marca'] . ' ' . $m['modelo']);
    return '<span class="jm-foto-pendiente' . ($compacto ? ' jm-foto-pendiente--compacta' : '') . '">'
        . '<span class="jm-foto-pendiente__dibujo" role="img" aria-label="' . esc_attr($etiqueta) . '">' . jm_svg('maquina-' . $icono) . '</span>'
        . ($compacto ? '' : '<span class="jm-label-sm jm-foto-pendiente__texto">Foto pendiente</span>')
        . '</span>';
}

/* ==========================================================================
   Shortcodes
   ========================================================================== */

add_action('init', function () {
    $propios = [
        'jm_catalogo_filtros'    => 'jm_sc_catalogo_filtros',
        'jm_catalogo_categorias' => 'jm_sc_catalogo_categorias',
        'jm_catalogo_barra'      => 'jm_sc_catalogo_barra',
        'jm_catalogo_pie'        => 'jm_sc_catalogo_pie',
        'jm_catalogo_cifra'      => 'jm_sc_catalogo_cifra',
        'jm_tarjeta_datos'       => 'jm_sc_tarjeta_datos',
        'jm_foto_pendiente'      => 'jm_sc_foto_pendiente',
        'jm_specs'               => 'jm_sc_specs',
        'jm_ficha'               => 'jm_sc_ficha',
        'jm_comparador'          => 'jm_sc_comparador',
        'jm_maquinas_solicitud'  => 'jm_sc_maquinas_solicitud',
        'jm_solicitud_asunto'    => 'jm_sc_solicitud_asunto',
    ];
    foreach ($propios as $tag => $fn) {
        add_shortcode($tag, $fn);
    }
    /* Pueden venir de otro archivo: solo se registran si nadie lo ha hecho. */
    if (!shortcode_exists('jm_migas')) {
        add_shortcode('jm_migas', 'jm_sc_migas_catalogo');
    }
    if (!shortcode_exists('jm_referencia')) {
        add_shortcode('jm_referencia', 'jm_sc_referencia');
    }
}, 20);

/* ---------- Tramos y etiquetas (lib/filters/params.ts) ---------- */

function jm_cat_tramos(): array
{
    return [
        ['label' => 'Hasta 6 m', 'min' => null, 'max' => 6],
        ['label' => '6 – 10 m', 'min' => 6, 'max' => 10],
        ['label' => '10 – 16 m', 'min' => 10, 'max' => 16],
        ['label' => '16 – 28 m', 'min' => 16, 'max' => 28],
        ['label' => 'Más de 28 m', 'min' => 28, 'max' => null],
    ];
}

const JM_CAT_ENERGIAS = ['electrico' => 'Eléctrica', 'diesel' => 'Diésel', 'hibrido' => 'Híbrida', 'gasolina' => 'Gasolina'];
const JM_CAT_USOS = ['interior' => 'Interior', 'exterior' => 'Exterior'];
const JM_CAT_ORDENES = [
    'relevancia'  => 'Orden del catálogo',
    'altura-asc'  => 'Altura, de menor a mayor',
    'altura-desc' => 'Altura, de mayor a menor',
    'carga-desc'  => 'Capacidad de carga',
];

/** Fabricantes de todo el catálogo, en orden alfabético español. */
function jm_cat_marcas(): array
{
    $marcas = array_values(array_unique(array_column(jm_cat_maquinas(), 'ma')));
    if (!$marcas) {
        $marcas = array_values(array_unique(array_column(jm_datos('maquinas.json'), 'marca')));
    }
    if (class_exists('Collator')) {
        (new Collator('es_ES'))->sort($marcas);
    } else {
        usort($marcas, static fn($a, $b) => strcasecmp(remove_accents($a), remove_accents($b)));
    }
    return $marcas;
}

/* ---------- [jm_catalogo_filtros] ---------- */

function jm_sc_catalogo_filtros($atts): string
{
    $atts = shortcode_atts(['familia' => ''], $atts, 'jm_catalogo_filtros');
    $ctx = jm_cat_contexto($atts);
    $todas = jm_cat_maquinas();
    $base = $ctx['familia'] ? array_values(array_filter($todas, static fn($m) => $m['f'] === $ctx['familia'])) : $todas;
    $marcas = jm_cat_marcas();

    $subs = [];
    $familias = [];
    foreach (jm_cat_familias() as $f) {
        $familias[] = ['id' => $f['id'], 'slug' => $f['slug'], 'nombre' => $f['nombre']];
        foreach ($f['subs'] as $s) {
            $subs[$s['slug']] = $s['nombre'];
        }
    }
    $datos = [
        'fija'     => ['familia' => $ctx['familia'] ?: null, 'sub' => $ctx['sub'] ?: null],
        'familias' => $familias,
        'subs'     => $subs,
        'marcas'   => $marcas,
        'tramos'   => jm_cat_tramos(),
        'maquinas' => array_map(static fn($m) => [
            'id' => $m['id'], 's' => $m['s'], 'f' => $m['f'], 'sub' => $m['sub'], 'e' => $m['e'], 'en' => $m['en'],
            'del' => $m['del'], 'ma' => $m['ma'], 'h' => $m['h'], 'c' => $m['c'], 'b' => $m['b'], 'o' => $m['o'],
        ], $base),
    ];

    $cuenta = static function (callable $test) use ($base): int {
        return count(array_filter($base, $test));
    };

    ob_start();
    ?>
<div class="jm-cat-filtros" data-jm="catalogo" id="jm-cat-filtros">
<script type="application/json" id="jm-catalogo-datos"><?php echo wp_json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP); ?></script>
<button type="button" class="jm-boton jm-cat-filtros__velo" data-jm-cerrar-filtros tabindex="-1" aria-label="Cerrar filtros"></button>
<div class="jm-cat-filtros__hoja" aria-labelledby="jm-cat-filtros-titulo">
<div class="jm-cat-filtros__cabecera">
<h2 class="jm-label jm-cat-filtros__titulo" id="jm-cat-filtros-titulo">Filtros técnicos</h2>
<button type="button" class="jm-boton jm-cat-filtros__cerrar" data-jm-cerrar-filtros aria-label="Cerrar filtros"><?php echo jm_cat_icono('x', 22, 2); ?></button>
</div>
<div class="jm-cat-filtros__cuerpo">
<div class="jm-cat-panel">

<div class="jm-cat-panel__bloque">
<label for="jm-cat-q" class="jm-label jm-cat-panel__etiqueta">Búsqueda por modelo</label>
<div class="jm-cat-buscar jm-cat-buscar--panel">
<?php echo jm_cat_icono('buscar', 17, 1.75, 'jm-cat-buscar__ico'); ?>
<input id="jm-cat-q" type="search" class="jm-cat-buscar__campo" data-jm-q placeholder="GS-4390, Manitou, tijera diésel…" autocomplete="off">
</div>
</div>

<details open class="jm-cat-grupo">
<summary class="jm-label jm-cat-grupo__titulo">Tipo de energía<span class="jm-cat-grupo__mas" aria-hidden="true">+</span></summary>
<div class="jm-cat-grupo__cuerpo"><ul class="jm-cat-opciones">
<?php foreach (JM_CAT_ENERGIAS as $id => $etq) :
    $n = $cuenta(static fn($m) => $m['e'] === $id); ?>
<li><label class="jm-cat-opcion<?php echo $n ? '' : ' jm-cat-opcion--vacia'; ?>">
<input type="checkbox" class="jm-sr" data-jm-faceta="energia" value="<?php echo esc_attr($id); ?>"<?php disabled(!$n); ?>>
<span class="jm-cat-opcion__caja" aria-hidden="true"><?php echo jm_cat_check(); ?></span>
<span class="jm-cat-opcion__texto"><?php echo esc_html($etq); ?></span>
<span class="jm-value jm-cat-opcion__n" data-jm-n><?php echo (int) $n; ?></span>
</label></li>
<?php endforeach; ?>
</ul></div>
</details>

<details open class="jm-cat-grupo">
<summary class="jm-label jm-cat-grupo__titulo">Altura de trabajo<span class="jm-cat-grupo__mas" aria-hidden="true">+</span></summary>
<div class="jm-cat-grupo__cuerpo"><ul class="jm-cat-opciones">
<?php foreach (jm_cat_tramos() as $i => $t) : ?>
<li><label class="jm-cat-opcion jm-cat-opcion--radio">
<input type="radio" class="jm-sr" name="jm-cat-altura" data-jm-tramo="<?php echo (int) $i; ?>">
<span class="jm-cat-opcion__caja jm-cat-opcion__caja--radio" aria-hidden="true"></span>
<span class="jm-cat-opcion__texto"><?php echo esc_html($t['label']); ?></span>
</label></li>
<?php endforeach; ?>
</ul>
<p class="jm-cat-grupo__nota">Las máquinas que no tienen altura de trabajo —carretillas, excavadoras, compactación— quedan fuera de este filtro.</p>
</div>
</details>

<details open class="jm-cat-grupo">
<summary class="jm-label jm-cat-grupo__titulo">Uso<span class="jm-cat-grupo__mas" aria-hidden="true">+</span></summary>
<div class="jm-cat-grupo__cuerpo"><ul class="jm-cat-opciones">
<?php foreach (JM_CAT_USOS as $id => $etq) :
    $n = $cuenta(static fn($m) => in_array($id, $m['en'], true)); ?>
<li><label class="jm-cat-opcion<?php echo $n ? '' : ' jm-cat-opcion--vacia'; ?>">
<input type="checkbox" class="jm-sr" data-jm-faceta="uso" value="<?php echo esc_attr($id); ?>"<?php disabled(!$n); ?>>
<span class="jm-cat-opcion__caja" aria-hidden="true"><?php echo jm_cat_check(); ?></span>
<span class="jm-cat-opcion__texto"><?php echo esc_html($etq); ?></span>
<span class="jm-value jm-cat-opcion__n" data-jm-n><?php echo (int) $n; ?></span>
</label></li>
<?php endforeach; ?>
</ul></div>
</details>

<details open class="jm-cat-grupo">
<summary class="jm-label jm-cat-grupo__titulo">Fabricante<span class="jm-cat-grupo__mas" aria-hidden="true">+</span></summary>
<div class="jm-cat-grupo__cuerpo">
<label class="jm-cat-marca"><span class="jm-sr">Fabricante</span>
<select class="jm-cat-select" data-jm-marca>
<option value="">Todos los fabricantes</option>
<?php foreach ($marcas as $marca) :
    $n = $cuenta(static fn($m) => $m['ma'] === $marca); ?>
<option value="<?php echo esc_attr($marca); ?>"<?php disabled(!$n); ?>><?php echo esc_html($marca . ' (' . $n . ')'); ?></option>
<?php endforeach; ?>
</select>
</label>
</div>
</details>

<div class="jm-cat-panel__bloque">
<div class="jm-cat-asesor">
<p class="jm-cat-asesor__titulo"><?php echo jm_cat_icono('chispas', 16, 2, 'jm-cat-asesor__ico'); ?>¿Dudas con la maquinaria?</p>
<p class="jm-cat-asesor__texto">Cuéntanos la altura y el tipo de suelo en tres preguntas y te decimos qué encaja.</p>
<a href="<?php echo esc_url(home_url('/asesor/')); ?>" class="jm-cat-asesor__boton">Iniciar asistente<?php echo jm_cat_icono('flecha', 16); ?></a>
</div>
</div>

</div>
</div>
<div class="jm-cat-filtros__pie">
<button type="button" class="jm-boton jm-cat-filtros__borrar" data-jm-limpiar>Borrar</button>
<button type="button" class="jm-boton jm-cat-filtros__ver" data-jm-cerrar-filtros>Ver <span data-jm-cuenta><?php echo count($base); ?></span> <span data-jm-unidad><?php echo count($base) === 1 ? 'máquina' : 'máquinas'; ?></span></button>
</div>
</div>
</div>
    <?php
    return (string) ob_get_clean();
}

function jm_cat_check(): string
{
    return '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

/* ---------- [jm_catalogo_categorias] ---------- */

function jm_cat_tira(string $etiqueta, string $contenido, string $extra = ''): string
{
    $min = function_exists('mb_strtolower') ? mb_strtolower($etiqueta) : strtolower($etiqueta);
    return '<div class="jm-tira" data-jm="tira"' . $extra . '>'
        . '<div class="jm-tira__pista" role="group" aria-label="' . esc_attr($etiqueta) . '">' . $contenido . '</div>'
        . '<div class="jm-tira__borde jm-tira__borde--izq" aria-hidden="true"></div>'
        . '<div class="jm-tira__borde jm-tira__borde--der" aria-hidden="true"></div>'
        . '<button type="button" class="jm-boton jm-tira__flecha jm-tira__flecha--izq" hidden aria-label="' . esc_attr('Ver ' . $min . ' anteriores') . '">' . jm_cat_icono('izquierda', 17, 2.25) . '</button>'
        . '<button type="button" class="jm-boton jm-tira__flecha jm-tira__flecha--der" hidden aria-label="' . esc_attr('Ver más ' . $min) . '">' . jm_cat_icono('derecha', 17, 2.25) . '</button>'
        . '</div>';
}

function jm_sc_catalogo_categorias($atts): string
{
    $atts = shortcode_atts(['familia' => ''], $atts, 'jm_catalogo_categorias');
    $ctx = jm_cat_contexto($atts);
    $familias = jm_cat_familias();
    $activa = $ctx['familia'];
    if (!$activa && jm_cat_get('fam')) {
        $activa = jm_cat_familia_id(sanitize_title(jm_cat_get('fam')));
    }
    $sub_activa = $ctx['sub'] ?: sanitize_title(jm_cat_get('sub'));
    $total = count(jm_cat_maquinas());

    $enlaces = '<a href="' . esc_url(home_url('/alquiler/')) . '" class="jm-tira__fam" data-jm-fam=""' . (!$activa ? ' aria-current="page"' : '') . '>'
        . 'Todas<span class="jm-value jm-tira__n">' . (int) $total . '</span></a>';
    foreach ($familias as $f) {
        $enlaces .= '<a href="' . esc_url($f['url']) . '" class="jm-tira__fam" data-jm-fam="' . esc_attr($f['id']) . '"'
            . ($activa === $f['id'] ? ' aria-current="page"' : '') . '>'
            . '<span class="jm-tira__icono">' . jm_svg('maquina-' . ($f['icono'] ?: 'tijera')) . '</span>'
            . esc_html($f['nombre']) . '<span class="jm-value jm-tira__n">' . (int) $f['n'] . '</span></a>';
    }

    $html = '<div class="jm-tiras" data-jm-tiras' . ($ctx['familia'] ? ' data-fija="' . esc_attr($ctx['familia']) . '"' : '') . '>';
    $html .= jm_cat_tira('Familias de maquinaria', $enlaces);
    foreach ($familias as $f) {
        $botones = '<button type="button" class="jm-boton jm-tira__sub jm-tira__sub--todas" data-jm-sub="" aria-pressed="' . ($sub_activa ? 'false' : 'true') . '">Todas</button>';
        foreach ($f['subs'] as $s) {
            $botones .= '<button type="button" class="jm-boton jm-tira__sub" data-jm-sub="' . esc_attr($s['slug']) . '"'
                . ' aria-pressed="' . ($sub_activa === $s['slug'] ? 'true' : 'false') . '"' . ($s['n'] ? '' : ' disabled') . '>'
                . esc_html($s['nombre']) . '<span class="jm-value jm-tira__n jm-tira__n--sub">' . (int) $s['n'] . '</span></button>';
        }
        $html .= jm_cat_tira('Subcategorías', $botones, ' data-jm-subs="' . esc_attr($f['id']) . '"' . ($activa === $f['id'] ? '' : ' hidden'));
    }
    return $html . '</div>';
}

/* ---------- [jm_catalogo_barra] ---------- */

function jm_sc_catalogo_barra($atts): string
{
    $ctx = jm_cat_contexto((array) $atts);
    $n = $ctx['familia'] ? count(array_filter(jm_cat_maquinas(), static fn($m) => $m['f'] === $ctx['familia'])) : count(jm_cat_maquinas());
    $opciones = '';
    foreach (JM_CAT_ORDENES as $v => $t) {
        $opciones .= '<option value="' . esc_attr($v) . '">' . esc_html($t) . '</option>';
    }
    return '<div class="jm-cat-barra" data-jm-cat="barra">'
        . '<div class="jm-cat-barra__fila">'
        . '<p class="jm-value jm-cat-barra__cuenta" aria-live="polite"><span data-jm-cuenta>' . (int) $n . '</span> <span class="jm-cat-barra__unidad" data-jm-unidad>' . ($n === 1 ? 'máquina' : 'máquinas') . '</span></p>'
        . '<label class="jm-cat-barra__orden"><span class="jm-label-sm jm-cat-barra__ordenar">Ordenar</span>'
        . '<select class="jm-cat-select jm-cat-select--orden" data-jm-orden aria-label="Ordenar resultados">' . $opciones . '</select></label>'
        . '</div>'
        . '<div class="jm-cat-barra__movil">'
        . '<div class="jm-cat-buscar jm-cat-buscar--movil"><label for="jm-cat-q-movil" class="jm-sr">Buscar por marca o modelo</label>'
        . jm_cat_icono('buscar', 16, 1.75, 'jm-cat-buscar__ico')
        . '<input id="jm-cat-q-movil" type="search" class="jm-cat-buscar__campo" data-jm-q placeholder="Buscar marca o modelo" autocomplete="off"></div>'
        . '<button type="button" class="jm-boton jm-cat-barra__filtrar" data-jm-abrir-filtros aria-controls="jm-cat-filtros">'
        . jm_cat_icono('filtros', 18, 1.75) . 'Filtrar<span class="jm-value jm-cat-barra__activos" data-jm-activos hidden></span></button>'
        . '</div>'
        . '<ul class="jm-cat-chips" data-jm-chips hidden></ul>'
        . '</div>';
}

/* ---------- [jm_catalogo_pie] ---------- */

function jm_sc_catalogo_pie(): string
{
    return '<div class="jm-cat-pie" data-jm-cat="pie">'
        . '<div class="jm-cat-vacio" data-jm-vacio hidden>'
        . jm_cat_hexagono('jm-cat-vacio__hex')
        . '<p class="jm-title jm-cat-vacio__titulo">Ninguna máquina con esos filtros.</p>'
        . '<div data-jm-rescates hidden><p class="jm-cat-vacio__texto">Quitando uno de estos vuelves a tener resultados:</p>'
        . '<ul class="jm-cat-vacio__lista" data-jm-rescates-lista></ul></div>'
        . '<p class="jm-cat-vacio__ayuda">O deja que te ayudemos: <a href="' . esc_url(home_url('/asesor/')) . '">dinos qué trabajo tienes</a> y te decimos qué máquina encaja.</p>'
        . '</div>'
        . '<div class="jm-cat-mas" data-jm-mas hidden>'
        . '<button type="button" class="jm-boton jm-cat-mas__boton" data-jm-ver-mas>Ver <span data-jm-mas-n>24</span> máquinas más</button>'
        . '<p class="jm-label-sm jm-cat-mas__cuenta"><span data-jm-mas-vis>24</span> de <span data-jm-mas-total>0</span></p>'
        . '</div>'
        . '</div>';
}

/* ---------- [jm_catalogo_cifra] ---------- */

function jm_sc_catalogo_cifra($atts): string
{
    $atts = shortcode_atts(['dato' => 'referencias', 'familia' => ''], $atts, 'jm_catalogo_cifra');
    if ($atts['dato'] === 'delegaciones') {
        $n = 0;
        foreach (get_posts(['post_type' => 'delegacion', 'numberposts' => -1, 'post_status' => 'publish']) as $p) {
            if (get_post_meta($p->ID, 'jm_tipo', true) !== 'Sede de formación') {
                $n++;
            }
        }
        return (string) ($n ?: count(jm_datos('delegaciones.json')));
    }
    $ctx = jm_cat_contexto($atts);
    $todas = jm_cat_maquinas();
    return (string) ($ctx['familia'] ? count(array_filter($todas, static fn($m) => $m['f'] === $ctx['familia'])) : count($todas));
}

/* ---------- [jm_tarjeta_datos] ---------- */

function jm_sc_tarjeta_datos(): string
{
    $m = jm_maquina();
    if (!$m || !$m['tarjeta']) {
        return '';
    }
    $html = '<dl class="jm-panel jm-tarjeta-datos">';
    foreach (array_slice($m['tarjeta'], 0, 3) as $d) {
        $html .= '<div class="jm-tarjeta-datos__item"><dt class="jm-tarjeta-datos__k">' . esc_html($d['etiqueta'] ?? '') . '</dt>'
            . '<dd class="jm-tarjeta-datos__v">' . jm_cat_dato($d) . '</dd></div>';
    }
    return $html . '</dl>';
}

/* ---------- [jm_foto_pendiente] ---------- */

function jm_sc_foto_pendiente($atts): string
{
    $atts = shortcode_atts(['compacto' => 'no'], $atts, 'jm_foto_pendiente');
    $m = jm_maquina();
    if (!$m || $m['foto_id']) {
        return '';
    }
    return jm_cat_dibujo($m, $atts['compacto'] === 'si' || $atts['compacto'] === 'sí');
}

/* ---------- [jm_specs] ---------- */

function jm_sc_specs(): string
{
    $m = jm_maquina();
    if (!$m) {
        return '';
    }
    $hay_estimadas = false;
    $html = '<div class="jm-specs" data-jm-slug="' . esc_attr($m['slug']) . '">';
    foreach ((array) $m['specs'] as $g) {
        $filas = array_filter((array) ($g['filas'] ?? []), static fn($f) => ($f['estado'] ?? '') !== 'no_aplica');
        if (!$filas) {
            continue;
        }
        $html .= '<div class="jm-specs__grupo"><h3 class="jm-label-sm jm-specs__grupo-titulo">' . esc_html($g['grupoNombre'] ?? $g['grupo'] ?? '') . '</h3><dl class="jm-specs__lista">';
        foreach ($filas as $f) {
            $hay_estimadas = $hay_estimadas || ($f['estado'] ?? '') === 'estimado';
            $html .= '<div class="jm-specs__fila"><dt class="jm-specs__k">' . esc_html($f['etiqueta'] ?? '') . '</dt><dd class="jm-specs__v">' . jm_cat_dato($f) . '</dd></div>';
        }
        $html .= '</dl></div>';
    }
    $html .= '<p class="jm-specs__nota">Las cifras salen del Catálogo General de Maquinaria de JOFEMESA y de la ficha técnica del fabricante.'
        . ($hay_estimadas
            ? ' Las subrayadas en ámbar están sin confirmar contra la unidad concreta: las comprobamos al responder tu solicitud.'
            : ' La disponibilidad y las cotas de acceso las confirmamos al responder tu solicitud.')
        . '</p>';
    return $html . '</div>';
}

/* ---------- [jm_ficha parte="…"] ---------- */

/** «1,0 MB» / «850 KB», igual que FichaMaquina.tsx. */
function jm_cat_peso(int $bytes): string
{
    if ($bytes <= 0) {
        return '';
    }
    if ($bytes > 1048576) {
        return str_replace('.', ',', number_format($bytes / 1048576, 1, '.', '')) . ' MB';
    }
    return (string) round($bytes / 1024) . ' KB';
}

function jm_sc_ficha($atts): string
{
    $atts = shortcode_atts(['parte' => ''], $atts, 'jm_ficha');
    $m = jm_maquina();
    if (!$m) {
        return '';
    }
    $json = jm_cat_json($m['slug']);
    switch ($atts['parte']) {
        case 'destacados':
            if (!$m['destacados']) {
                return '';
            }
            $html = '<ul class="jm-ficha-destacados">';
            foreach ($m['destacados'] as $d) {
                $html .= '<li>' . jm_cat_icono('check', 17, 2.5, 'jm-ficha-destacados__ico') . '<span>' . esc_html($d) . '</span></li>';
            }
            return $html . '</ul>';

        case 'aplicaciones':
            if (!$m['aplicaciones']) {
                return '';
            }
            $html = '<div class="jm-ficha-aplicaciones"><h2 class="jm-label jm-ficha-aplicaciones__titulo">Para qué se usa</h2><ul class="jm-ficha-aplicaciones__lista">';
            foreach ($m['aplicaciones'] as $a) {
                $html .= '<li>' . esc_html($a) . '</li>';
            }
            return $html . '</ul></div>';

        case 'delegaciones':
            $ids = json_decode((string) get_post_meta($m['id'], '_jmj_delegaciones', true), true);
            $ids = is_array($ids) ? $ids : ($json['delegaciones'] ?? []);
            $nombres = jm_cat_delegaciones();
            $html = '<ul class="jm-ficha-delegaciones">';
            foreach ($ids as $d) {
                if (isset($nombres[$d])) {
                    $html .= '<li><span class="jm-ficha-delegaciones__marca" aria-hidden="true"></span>' . esc_html($nombres[$d]) . '</li>';
                }
            }
            return $html . '</ul>';

        case 'gama':
            if (!$m['gama']) {
                return '';
            }
            return '<p class="jm-ficha-gama">' . jm_cat_icono('capas', 17, 2, 'jm-ficha-gama__ico')
                . '<span>Esta ficha es la <strong>gama completa</strong>, no una unidad concreta. El catálogo de JOFEMESA publica esta familia por rangos, así que aquí verás el máximo de la gama: dinos qué necesitas mover y a qué altura y te decimos el modelo exacto.</span></p>';

        case 'nota':
            $nota = (string) ($json['notaAsesor'] ?? '');
            return $nota ? '<p class="jm-ficha-nota">' . esc_html($nota) . '</p>' : '';

        case 'pdf':
            /* Sin PDF no se dibuja: nunca una descarga rota. */
            if (!$m['ficha_url']) {
                return '';
            }
            $peso = jm_cat_peso((int) $m['ficha_bytes']);
            return '<a href="' . esc_url($m['ficha_url']) . '" download class="jm-btn jm-btn--contorno jm-ficha-pdf">'
                . jm_cat_icono('descargar', 18, 1.75) . 'Ficha técnica'
                . ($peso ? '<span class="jm-value jm-ficha-pdf__peso">(' . esc_html($peso) . ')</span>' : '') . '</a>';
    }
    return '';
}

/* ---------- [jm_migas] ---------- */

function jm_sc_migas_catalogo($atts): string
{
    $atts = shortcode_atts(['inicio' => 'Alquiler'], $atts, 'jm_migas');
    $sep = '<span class="jm-migas__sep" aria-hidden="true">/</span>';
    $partes = [];
    $actual = '';
    $alquiler = '<a href="' . esc_url(home_url('/alquiler/')) . '">' . esc_html($atts['inicio']) . '</a>';

    if (is_singular('maquina')) {
        $m = jm_maquina((int) get_queried_object_id());
        $partes[] = $alquiler;
        if ($m && $m['familia']) {
            $t = get_term_by('slug', $m['familia'], 'familia');
            $link = $t ? get_term_link($t) : '';
            if ($link && !is_wp_error($link)) {
                $partes[] = '<a href="' . esc_url($link) . '">' . esc_html($t->name) . '</a>';
            }
        }
        $actual = $m ? $m['modelo'] : get_the_title();
    } elseif (is_tax('familia')) {
        $t = get_queried_object();
        $partes[] = $alquiler;
        if ($t->parent) {
            $padre = get_term($t->parent, 'familia');
            $link = ($padre && !is_wp_error($padre)) ? get_term_link($padre) : '';
            if ($link && !is_wp_error($link)) {
                $partes[] = '<a href="' . esc_url($link) . '">' . esc_html($padre->name) . '</a>';
            }
        }
        $actual = $t->name;
    } else {
        $actual = $atts['inicio'];
    }
    $partes[] = '<span aria-current="page">' . esc_html($actual) . '</span>';
    return '<nav aria-label="Migas de pan" class="jm-migas jm-label-sm">' . implode($sep, $partes) . '</nav>';
}

/* ==========================================================================
   Comparador
   ========================================================================== */

function jm_cat_tabla_comparador(array $slugs): string
{
    $maquinas = [];
    foreach (array_slice($slugs, 0, JM_CAT_MAX_COMPARAR) as $s) {
        $id = jm_maquina_por_slug($s);
        $m = $id ? jm_maquina($id) : [];
        if ($m) {
            $maquinas[] = $m;
        }
    }
    $alquiler = esc_url(home_url('/alquiler/'));
    $solicitud = home_url('/consultar-disponibilidad/');

    if (!$maquinas) {
        return '<div class="jm-comp-vacio">' . jm_cat_hexagono('jm-comp-vacio__hex')
            . '<p class="jm-title">Marca dos o más máquinas para compararlas.</p>'
            . '<p class="jm-comp-vacio__texto">En cada tarjeta del catálogo hay una casilla arriba a la derecha. Marca las que estés dudando y aquí verás sus fichas técnicas una junto a otra.</p>'
            . '<a href="' . $alquiler . '" class="jm-btn jm-btn--acento jm-comp-vacio__boton">Ir al catálogo</a></div>';
    }

    /* Una fila entra si alguna máquina tiene ahí un dato de verdad. */
    $filas = array_filter(jm_datos('specdefs.json'), static function ($def) use ($maquinas) {
        foreach ($maquinas as $m) {
            $d = $m['comparador'][$def['key']] ?? null;
            if ($d && ($d['estado'] ?? '') !== 'no_aplica') {
                return true;
            }
        }
        return false;
    });

    $html = '<div class="jm-comp-herramientas jm-no-imprimir">'
        . '<button type="button" class="jm-boton jm-comp-enlace" data-jm-imprimir>' . jm_cat_icono('imprimir', 16, 1.75) . 'Imprimir la comparación</button>'
        . '<button type="button" class="jm-boton jm-comp-enlace" data-jm-vaciar>Vaciar</button></div>';

    $html .= '<div class="jm-comp-marco"><table class="jm-comp-tabla"><caption class="jm-sr">Comparación técnica de ' . count($maquinas) . ' máquinas</caption><thead><tr>'
        . '<th scope="col" class="jm-comp-tabla__esquina"><span class="jm-label">Especificación</span></th>';
    foreach ($maquinas as $m) {
        $html .= '<th scope="col" class="jm-comp-tabla__maquina">'
            . '<div class="jm-comp-tabla__foto">' . jm_cat_imagen($m, 'medium', true) . '</div>'
            . '<p class="jm-label-sm jm-comp-tabla__sub">' . esc_html($m['subcategoria_nombre']) . '</p>'
            . '<p class="jm-comp-tabla__marca">' . esc_html($m['marca']) . '</p>'
            . '<a href="' . esc_url($m['url']) . '" class="jm-title jm-comp-tabla__modelo">' . esc_html($m['modelo']) . '</a>'
            . '<a href="' . esc_url(add_query_arg('m', $m['slug'], $solicitud)) . '" class="jm-btn jm-btn--acento jm-btn--sm jm-no-imprimir jm-comp-tabla__consultar">Consultar disponibilidad</a>'
            . '<button type="button" class="jm-boton jm-comp-enlace jm-comp-enlace--sm jm-no-imprimir" data-jm-quitar="' . esc_attr($m['slug']) . '">' . jm_cat_icono('x', 14, 2.5) . 'Quitar</button>'
            . '</th>';
    }
    $html .= '</tr></thead><tbody>';

    foreach ($filas as $def) {
        $mejores = [];
        if (!empty($def['mejor']) && count($maquinas) >= 2) {
            $nums = array_map(static fn($m) => jm_cat_valor($m['comparador'][$def['key']] ?? null), $maquinas);
            $validos = array_filter($nums, static fn($n) => $n !== null);
            if (count($validos) >= 2) {
                $objetivo = $def['mejor'] === 'mayor' ? max($validos) : min($validos);
                foreach ($nums as $i => $n) {
                    if ($n !== null && $n === $objetivo) {
                        $mejores[$i] = true;
                    }
                }
            }
        }
        $html .= '<tr><th scope="row" class="jm-comp-tabla__k"><span>' . esc_html($def['etiqueta']) . '</span></th>';
        foreach ($maquinas as $i => $m) {
            $top = isset($mejores[$i]);
            $html .= '<td class="jm-comp-tabla__v"><span class="jm-comp-tabla__celda">'
                . jm_cat_dato($m['comparador'][$def['key']] ?? null, $top ? 'jm-dato--mejor' : '')
                . ($top ? '<span class="jm-label-sm jm-comp-tabla__max">' . ($def['mejor'] === 'mayor' ? 'Máx.' : 'Mín.') . '</span>' : '')
                . '</span></td>';
        }
        $html .= '</tr>';
    }
    $html .= '</tbody></table></div>';

    if (count($maquinas) === 1) {
        $html .= '<p class="jm-comp-una">Añade al menos una máquina más para poder comparar. <a href="' . $alquiler . '">Ir al catálogo</a></p>';
    } else {
        $todas = implode(',', array_column($maquinas, 'slug'));
        $html .= '<div class="jm-comp-final jm-no-imprimir"><a href="' . esc_url($solicitud . '?m=' . $todas) . '" class="jm-btn jm-btn--acento jm-comp-final__boton">Consultar disponibilidad de las ' . count($maquinas) . '</a></div>';
    }
    return $html;
}

function jm_sc_comparador(): string
{
    $slugs = jm_cat_slugs($_GET['m'] ?? '', JM_CAT_MAX_COMPARAR);
    return '<div class="jm-comparador" data-jm="comparador" data-m="' . esc_attr(implode(',', $slugs)) . '">'
        . '<div class="jm-comparador__anadir jm-no-imprimir">'
        . '<div class="jm-anadir" data-jm-anadir>'
        . '<div class="jm-anadir__campo"><label for="jm-anadir-q" class="jm-sr">Buscar una máquina para añadir a la comparación</label>'
        . jm_cat_icono('buscar', 17, 1.75, 'jm-anadir__ico')
        . '<input id="jm-anadir-q" type="search" class="jm-anadir__input" role="combobox" aria-expanded="false" aria-controls="jm-anadir-lista" aria-autocomplete="list" autocomplete="off" placeholder="Añadir máquina a la comparación (' . count($slugs) . '/' . JM_CAT_MAX_COMPARAR . ')"></div>'
        . '<ul id="jm-anadir-lista" class="jm-anadir__lista" role="listbox" aria-label="Máquinas" hidden></ul>'
        . '</div>'
        . '<p class="jm-anadir-lleno" data-jm-lleno hidden>Ya tienes ' . JM_CAT_MAX_COMPARAR . ' máquinas, que es el máximo que cabe en una tabla legible. Quita una para añadir otra.</p>'
        . '</div>'
        . '<div class="jm-comparador__tabla" data-jm-tabla>' . jm_cat_tabla_comparador($slugs) . '</div>'
        . '</div>';
}

/* El JS pide la tabla al cambiar la selección (añadir, quitar, bandeja). */
function jm_cat_ajax_comparador(): void
{
    $slugs = jm_cat_slugs(wp_unslash($_GET['m'] ?? ''), JM_CAT_MAX_COMPARAR);
    header('Content-Type: text/html; charset=utf-8');
    echo jm_cat_tabla_comparador($slugs); // phpcs:ignore WordPress.Security.EscapeOutput -- HTML escapado dentro.
    wp_die();
}
add_action('wp_ajax_jm_comparador', 'jm_cat_ajax_comparador');
add_action('wp_ajax_nopriv_jm_comparador', 'jm_cat_ajax_comparador');

/* ==========================================================================
   Índice de máquinas y bandeja del comparador (en todas las páginas)
   ========================================================================== */

add_action('wp_footer', function () {
    if (is_admin()) {
        return;
    }
    $indice = [
        'base'     => JM_URL . 'assets/iconos/',
        'max'      => JM_CAT_MAX_COMPARAR,
        'maquinas' => array_map(static fn($m) => [
            's' => $m['s'], 'ma' => $m['ma'], 'mo' => $m['mo'], 'u' => $m['u'], 'mini' => $m['mini'], 'i' => $m['i'], 'subn' => $m['subn'],
        ], jm_cat_maquinas()),
    ];
    echo '<script type="application/json" id="jm-indice-maquinas">' . wp_json_encode($indice, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP) . "</script>\n";

    /* En el propio comparador la bandeja sería redundante. */
    if (is_page('comparador')) {
        return;
    }
    $comparador = esc_url(home_url('/comparador/'));
    echo '<div class="jm-bandeja jm-no-imprimir" data-jm="bandeja" role="region" aria-label="Máquinas seleccionadas para comparar" hidden>'
        . '<div class="jm-contenedor jm-bandeja__fila">'
        . '<p class="jm-label-sm jm-bandeja__titulo">Comparar<span class="jm-bandeja__n" data-jm-n>0/' . JM_CAT_MAX_COMPARAR . '</span></p>'
        . '<ul class="jm-bandeja__lista" data-jm-lista></ul>'
        . '<button type="button" class="jm-boton jm-bandeja__vaciar" data-jm-vaciar>Vaciar</button>'
        . '<a href="' . $comparador . '" class="jm-btn jm-btn--acento jm-bandeja__ir jm-abrir-modal" data-jm-ir data-jm-modal-titulo="Comparador de maquinaria" data-jm-modal-enlace="">'
        . 'Comparar<span class="jm-value jm-bandeja__ir-n" data-jm-ir-n></span>' . jm_cat_icono('flecha', 18) . '</a>'
        . '</div></div>' . "\n";
}, 5);

/* ==========================================================================
   Solicitud de alquiler
   ========================================================================== */

function jm_cat_asuntos(): array
{
    return [
        'venta'         => 'Venta de maquinaria y recambios',
        'recambios'     => 'Recambios',
        'mantenimiento' => 'Mantenimiento y servicio técnico',
        'transporte'    => 'Transporte y entrega en obra',
        'servicios'     => 'Servicios a medida',
    ];
}

/* `?m=` lleva máquinas (slugs), pero `m` es también la query var de WordPress
   para archivos por fecha: con un slug con cifras («genie-gr-15») WordPress
   la leía como fecha y /comparador/ o /consultar-disponibilidad/ daban 404.
   Si no es una fecha (solo cifras), se quita de la consulta; los shortcodes
   siguen leyendo $_GET['m']. */
add_filter('request', function (array $qv): array {
    if (isset($qv['m']) && !ctype_digit((string) $qv['m'])) {
        unset($qv['m']);
    }
    return $qv;
});

/* Formación tiene su propio formulario: los enlaces antiguos llegan allí. */
add_action('template_redirect', function () {
    if (is_page('consultar-disponibilidad') && jm_cat_get('asunto') === 'formacion') {
        wp_safe_redirect(home_url('/formacion/solicitar/'));
        exit;
    }
});

function jm_sc_solicitud_asunto(): string
{
    $asuntos = jm_cat_asuntos();
    $asunto = jm_cat_get('asunto');
    if (!isset($asuntos[$asunto])) {
        return '';
    }
    return '<p class="jm-label jm-solicitud-asunto" data-jm-asunto data-titulo="Cuándo y dónde"><span class="jm-texto-3">Solicitud de</span>' . esc_html($asuntos[$asunto]) . '</p>';
}

function jm_cat_item_solicitud(array $m): string
{
    $nombre = trim($m['marca'] . ' ' . $m['modelo']);
    return '<li class="jm-solicitud-maquinas__item" data-slug="' . esc_attr($m['slug']) . '">'
        . '<span class="jm-solicitud-maquinas__foto">' . jm_cat_imagen($m, 'thumbnail', true) . '</span>'
        . '<span class="jm-solicitud-maquinas__nombre"><span class="jm-label-sm jm-solicitud-maquinas__marca">' . esc_html($m['marca']) . '</span>'
        . '<span class="jm-solicitud-maquinas__modelo">' . esc_html($m['modelo']) . '</span></span>'
        . '<button type="button" class="jm-boton jm-solicitud-maquinas__quitar" data-jm-quitar="' . esc_attr($m['slug']) . '" aria-label="' . esc_attr('Quitar ' . $nombre . ' de la solicitud') . '">' . jm_cat_icono('x', 18, 2) . '</button>'
        . '</li>';
}

function jm_sc_maquinas_solicitud(): string
{
    $items = '';
    foreach (jm_cat_slugs($_GET['m'] ?? '', 20) as $s) {
        $id = jm_maquina_por_slug($s);
        $m = $id ? jm_maquina($id) : [];
        if ($m) {
            $items .= jm_cat_item_solicitud($m);
        }
    }
    $contexto = jm_cat_get('contexto');
    $html = '<div class="jm-solicitud-maquinas" data-jm="solicitud" data-delegaciones="' . esc_attr(wp_json_encode(jm_cat_delegaciones(), JSON_UNESCAPED_UNICODE)) . '">'
        . '<ul class="jm-solicitud-maquinas__lista" data-jm-lista' . ($items ? '' : ' hidden') . '>' . $items . '</ul>'
        . '<div class="jm-solicitud-maquinas__vacio" data-jm-vacio' . ($items ? ' hidden' : '') . '><p>No has seleccionado ninguna máquina todavía. Puedes enviar la solicitud igualmente y te asesoramos, o <a href="' . esc_url(home_url('/alquiler/')) . '">elegir en el catálogo</a>.</p></div>';
    if ($contexto !== '') {
        $html .= '<div class="jm-solicitud-contexto"><p class="jm-label-sm jm-solicitud-contexto__k">Lo que nos contaste en el asesor</p><p class="jm-solicitud-contexto__v">' . esc_html($contexto) . '</p></div>';
    }
    return $html . '</div>';
}

/* ---------- [jm_referencia] ---------- */

function jm_sc_referencia($atts): string
{
    $atts = shortcode_atts(['etiqueta' => 'Tu referencia'], $atts, 'jm_referencia');
    $ref = strtoupper(jm_cat_get('ref'));
    if (!preg_match('/^[A-Z]{3}-\d{4}-\d{3,6}$/', $ref)) {
        return '';
    }
    return '<p class="jm-referencia"><span class="jm-label-sm jm-referencia__k">' . esc_html($atts['etiqueta']) . '</span>'
        . '<span class="jm-value-lg jm-referencia__v">' . esc_html($ref) . '</span></p>';
}

/**
 * [jm_termino campo="jm_nombre_largo" url="si"]
 * Nombre o metadato del término del archivo (familia o subcategoría). Con
 * url="si" sale codificado para ir dentro de un enlace (etiqueta dinámica
 * Shortcode del botón «Consultar disponibilidad» del listado de familia).
 */
function jm_sc_termino($atts): string
{
    $a = shortcode_atts(['campo' => 'name', 'url' => ''], $atts, 'jm_termino');
    $termino = get_queried_object();
    if (!$termino instanceof WP_Term) {
        return '';
    }
    $valor = $a['campo'] === 'name' ? $termino->name : (string) get_term_meta($termino->term_id, sanitize_key($a['campo']), true);
    return $a['url'] !== '' ? rawurlencode($valor) : esc_html($valor);
}
add_shortcode('jm_termino', 'jm_sc_termino');
