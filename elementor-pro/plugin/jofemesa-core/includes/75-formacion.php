<?php
/**
 * Formación: piezas que ningún widget nativo sabe generar.
 *
 * Traducción de src/app/(site)/formacion/*, src/components/formacion/* y
 * src/lib/formacion/estado.ts. Estructura de montaje en
 * estructura/40-formacion.md, 41-ficha-curso.md, 42-loop-curso-y-convocatoria.md
 * y 43-solicitar-formacion.md.
 *
 * Dos clases de shortcode:
 *
 *   A) DE VALOR: devuelven texto o una URL, sin HTML alrededor. Se usan con
 *      la etiqueta dinámica «Shortcode» de Elementor Pro dentro de un widget
 *      nativo (Título, Botón, Lista de iconos…). Así el widget sigue siendo
 *      nativo y editable y solo el dato viene de aquí.
 *        [jm_conv que="…"]           dato de la convocatoria del Loop Item
 *        [jm_curso que="…"]          dato del curso (Loop Item o Single)
 *        [jm_formacion_cifra que="…"] cifras de la página (69, 12, 2)
 *        [jm_solicitar_titulo]       titular de /formacion/solicitar/
 *
 *   B) DE BLOQUE: HTML propio, con el widget Shortcode.
 *        [jm_calendario_filtros]     filtros, recuento y estado vacío
 *        [jm_convocatoria_fecha]     cuadro de fecha de la fila (+ datos para el JS)
 *        [jm_convocatoria_plazas]    estado de plazas («Últimas 3 plazas»)
 *        [jm_curso_chips]            chips de norma / certificación / tipo
 *        [jm_curso_enlace_calendario] «5 convocatorias» de la tarjeta
 *        [jm_proximas_curso]         próximas fechas en la ficha del curso
 *        [jm_tel_formacion]          teléfono de Formación enlazado
 *        [jm_formacion_referencia]   «Tu referencia» en la página de gracias
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ------------------------------------------------------------
   Fechas (partesFecha / nombreMes de content/es/formacion.ts)
   ------------------------------------------------------------ */

const JM_FO_MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const JM_FO_MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const JM_FO_DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** «20261013» o «2026-10-13» → «2026-10-13» (o '' si no es una fecha). */
function jm_fo_iso(string $fecha): string
{
    $d = preg_replace('/\D/', '', $fecha);
    if (strlen($d) !== 8) {
        return '';
    }
    return substr($d, 0, 4) . '-' . substr($d, 4, 2) . '-' . substr($d, 6, 2);
}

/** Partes de una fecha ISO, en UTC para que no cambie de día. */
function jm_fo_partes(string $iso): array
{
    [$a, $m, $d] = array_map('intval', explode('-', $iso) + [0, 1, 1]);
    $ts = gmmktime(0, 0, 0, max(1, $m), max(1, $d), $a);
    return [
        'dia'        => $d,
        'mes'        => JM_FO_MESES[max(1, $m) - 1],
        'mesCorto'   => JM_FO_MESES_CORTOS[max(1, $m) - 1],
        'diaSemana'  => JM_FO_DIAS[(int) gmdate('w', $ts)],
        'anio'       => $a,
        'claveMes'   => sprintf('%04d-%02d', $a, $m),
    ];
}

/** «2026-10» → «Octubre 2026». */
function jm_fo_nombre_mes(string $clave): string
{
    [$a, $m] = array_map('intval', explode('-', $clave) + [0, 1]);
    $mes = JM_FO_MESES[max(1, min(12, $m)) - 1];
    return mb_strtoupper(mb_substr($mes, 0, 1)) . mb_substr($mes, 1) . ' ' . $a;
}

/** Hoy en la zona del sitio, en ISO. */
function jm_fo_hoy(): string
{
    return wp_date('Y-m-d');
}

/* ------------------------------------------------------------
   Iconos (lucide-react, los mismos trazos que la web Next)
   ------------------------------------------------------------ */

function jm_fo_icono(string $nombre, int $tam = 16, float $grosor = 2, string $clase = ''): string
{
    $trazos = [
        'phone'     => '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
        'map-pin'   => '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
        'calendar'  => '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
        'arrow'     => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'badge'     => '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
        'x'         => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        'clock'     => '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        'navigation' => '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
        'info'      => '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    ];
    if (!isset($trazos[$nombre])) {
        return '';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' . $tam . '" height="' . $tam . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' . esc_attr((string) $grosor) . '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' . ($clase ? ' class="' . esc_attr($clase) . '"' : '') . '>' . $trazos[$nombre] . '</svg>';
}

/* ------------------------------------------------------------
   Datos: curso, convocatoria, sedes
   ------------------------------------------------------------ */

/** Todo lo de un curso (entrada `curso`). */
function jm_fo_curso(int $id = 0): array
{
    $id = $id ?: (int) get_the_ID();
    if (!$id || get_post_type($id) !== 'curso') {
        return [];
    }
    static $cache = [];
    if (isset($cache[$id])) {
        return $cache[$id];
    }
    $abierta = get_post_meta($id, 'jm_convocatoria_abierta', true);
    $cache[$id] = [
        'id'            => $id,
        'slug'          => (string) get_post_field('post_name', $id),
        'nombre'        => get_the_title($id),
        'corto'         => (string) get_post_meta($id, 'jm_nombre_corto', true),
        'norma'         => (string) get_post_meta($id, 'jm_norma', true),
        'certificacion' => (string) get_post_meta($id, 'jm_certificacion', true),
        'normativa'     => (string) get_post_meta($id, 'jm_normativa', true),
        'abierta'       => in_array($abierta, ['1', 1, true, 'si', 'sí', 'yes'], true),
        'url'           => (string) get_permalink($id),
    ];
    return $cache[$id];
}

/** Todo lo de una sede (término de `sede_formacion`). */
function jm_fo_sede($termino): array
{
    if (!$termino instanceof WP_Term) {
        return [];
    }
    $m = static fn ($k) => (string) get_term_meta($termino->term_id, $k, true);
    return [
        'slug'      => $termino->slug,
        'nombre'    => $termino->name,
        'zona'      => $m('jm_zona'),
        'direccion' => $m('jm_direccion'),
        'maps'      => $m('jm_maps'),
    ];
}

/** Todo lo de una convocatoria (entrada `convocatoria`). */
function jm_fo_convocatoria(int $id = 0): array
{
    $id = $id ?: (int) get_the_ID();
    if (!$id || get_post_type($id) !== 'convocatoria') {
        return [];
    }
    static $cache = [];
    if (isset($cache[$id])) {
        return $cache[$id];
    }
    $curso = jm_fo_curso((int) get_post_meta($id, 'jm_curso', true));
    $terminos = wp_get_post_terms($id, 'sede_formacion');
    $sede = (!is_wp_error($terminos) && $terminos) ? jm_fo_sede($terminos[0]) : [];
    $num = static function ($v) {
        return ($v === '' || $v === null || $v === false) ? null : (int) $v;
    };
    $cache[$id] = [
        'id'       => (string) get_post_field('post_name', $id),
        'fecha'    => jm_fo_iso((string) get_post_meta($id, 'jm_fecha', true)),
        'inicio'   => (string) get_post_meta($id, 'jm_inicio', true),
        'fin'      => (string) get_post_meta($id, 'jm_fin', true),
        'plazas'   => $num(get_post_meta($id, 'jm_plazas', true)),
        'ocupadas' => $num(get_post_meta($id, 'jm_ocupadas', true)),
        'curso'    => $curso,
        'sede'     => $sede,
    ];
    return $cache[$id];
}

/** Convocatorias futuras (por fecha). Reutiliza la de 50-formularios.php. */
function jm_fo_futuras(): array
{
    if (function_exists('jm_convocatorias_futuras')) {
        return jm_convocatorias_futuras();
    }
    static $cache = null;
    if ($cache !== null) {
        return $cache;
    }
    $q = new WP_Query([
        'post_type'      => 'convocatoria',
        'posts_per_page' => -1,
        'no_found_rows'  => true,
        'meta_query'     => ['fecha' => ['key' => 'jm_fecha', 'value' => wp_date('Ymd'), 'compare' => '>=', 'type' => 'NUMERIC']],
        'orderby'        => ['fecha' => 'ASC', 'title' => 'ASC'],
    ]);
    $cache = [];
    foreach ($q->posts as $p) {
        $c = jm_fo_convocatoria($p->ID);
        $cache[] = [
            'id'         => $c['id'],
            'curso'      => $c['curso']['slug'] ?? '',
            'fecha'      => $c['fecha'],
            'sede'       => $c['sede']['slug'] ?? '',
            'sedeNombre' => $c['sede']['nombre'] ?? '',
        ];
    }
    return $cache;
}

/** Sedes de formación, en el orden del término. */
function jm_fo_sedes(): array
{
    $terminos = get_terms(['taxonomy' => 'sede_formacion', 'hide_empty' => false, 'orderby' => 'term_id']);
    if (is_wp_error($terminos) || !$terminos) {
        return array_map(static fn ($s) => [
            'slug' => $s['id'], 'nombre' => $s['nombre'], 'zona' => $s['zona'],
            'direccion' => $s['direccion'], 'maps' => $s['maps'],
        ], jm_datos('sedes-formacion.json'));
    }
    return array_map('jm_fo_sede', $terminos);
}

/** Cursos con convocatoria abierta, por jm_orden (los chips del calendario). */
function jm_fo_cursos_abiertos(): array
{
    $q = new WP_Query([
        'post_type'      => 'curso',
        'posts_per_page' => -1,
        'no_found_rows'  => true,
        'meta_query'     => [
            'abierta' => ['key' => 'jm_convocatoria_abierta', 'value' => '1'],
            'orden'   => ['key' => 'jm_orden', 'type' => 'NUMERIC', 'compare' => 'EXISTS'],
        ],
        'orderby'        => ['orden' => 'ASC', 'title' => 'ASC'],
    ]);
    return array_map(static fn ($p) => jm_fo_curso($p->ID), $q->posts);
}

/**
 * Número de convocatorias publicadas en un año (todas, también las ya
 * celebradas, como `CONVOCATORIAS.length` en el original). Con `$curso`
 * (ID) cuenta solo las de ese curso.
 */
function jm_fo_total_convocatorias(string $anio = '', int $curso = 0): int
{
    $anio = preg_match('/^\d{4}$/', $anio) ? $anio : wp_date('Y');
    static $cache = [];
    $clave = $anio . '-' . $curso;
    if (!isset($cache[$clave])) {
        $meta = [['key' => 'jm_fecha', 'value' => [$anio . '0101', $anio . '1231'], 'compare' => 'BETWEEN', 'type' => 'NUMERIC']];
        if ($curso) {
            $meta[] = ['key' => 'jm_curso', 'value' => (string) $curso];
        }
        $cache[$clave] = count(get_posts([
            'post_type'      => 'convocatoria',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'no_found_rows'  => true,
            'meta_query'     => $meta,
        ]));
    }
    return $cache[$clave];
}

/** URL de la solicitud, con su parámetro. */
function jm_fo_url_solicitar(array $args = []): string
{
    $base = home_url('/formacion/solicitar/');
    return $args ? add_query_arg(array_map('rawurlencode', $args), $base) : $base;
}

/** URL del calendario con el curso ya filtrado (lo lee 50-formacion.js). */
function jm_fo_url_calendario(string $curso = ''): string
{
    return home_url('/formacion/') . '#calendario' . ($curso !== '' ? '-' . sanitize_title($curso) : '');
}

/* ------------------------------------------------------------
   A) Shortcodes de valor (etiqueta dinámica «Shortcode»)
   ------------------------------------------------------------ */

/**
 * [jm_conv que="curso|norma|horario|sede|zona|sede-zona|direccion|maps|url-curso|url-solicitar"]
 * Dato de la convocatoria actual (Loop Item «Fila de convocatoria»).
 */
function jm_sc_formacion_conv($atts): string
{
    $a = shortcode_atts(['que' => 'curso'], $atts, 'jm_conv');
    $c = jm_fo_convocatoria();
    if (!$c) {
        return '';
    }
    switch ($a['que']) {
        case 'curso':
            return esc_html($c['curso']['nombre'] ?? '');
        case 'norma':
            return esc_html($c['curso']['norma'] ?? '');
        case 'horario':
            return $c['inicio'] ? esc_html($c['inicio'] . ' – ' . $c['fin'] . ' h') : '';
        case 'sede':
            return esc_html($c['sede']['nombre'] ?? '');
        case 'zona':
            return esc_html($c['sede']['zona'] ?? '');
        case 'sede-zona':
            if (empty($c['sede'])) {
                return '';
            }
            return esc_html($c['sede']['nombre'])
                . ($c['sede']['zona'] ? ' <span class="jm-conv__zona">· ' . esc_html($c['sede']['zona']) . '</span>' : '');
        case 'direccion':
            return esc_html($c['sede']['direccion'] ?? '');
        case 'maps':
            return esc_url($c['sede']['maps'] ?? '');
        case 'url-curso':
            return esc_url($c['curso']['url'] ?? '');
        case 'url-solicitar':
            return esc_url(jm_fo_url_solicitar(['convocatoria' => $c['id']]));
    }
    return '';
}
add_shortcode('jm_conv', 'jm_sc_formacion_conv');

/**
 * [jm_curso que="nombre|corto|norma|normativa|tipo|convocatorias|cta-titulo|url|url-solicitar|url-calendario"]
 *   tipo:        «Convocatoria abierta» / «A medida» (atributos abierta / medida)
 *   cta-titulo:  «¿Otra fecha o un grupo a formar?» / «¿Quieres este curso?»
 *   convocatorias: «5 convocatorias» (vacío si no tiene)
 */
function jm_sc_formacion_curso($atts): string
{
    $a = shortcode_atts([
        'que'     => 'nombre',
        'abierta' => '',
        'medida'  => '',
        'anio'    => '',
    ], $atts, 'jm_curso');
    $c = jm_fo_curso();
    if (!$c) {
        return '';
    }
    switch ($a['que']) {
        case 'nombre':
            return esc_html($c['nombre']);
        case 'corto':
            return esc_html($c['corto']);
        case 'norma':
            return esc_html($c['norma']);
        case 'normativa':
            /* Se guarda separada por « · »; se aceptan también comas o saltos. */
            $partes = array_filter(array_map('trim', preg_split('/\s*(?:·|,|\n)\s*/u', $c['normativa'])));
            return esc_html(implode(' · ', $partes));
        case 'tipo':
            return esc_html($c['abierta'] ? ($a['abierta'] ?: 'Convocatoria abierta') : ($a['medida'] ?: 'A medida'));
        case 'cta-titulo':
            return esc_html($c['abierta'] ? ($a['abierta'] ?: '¿Otra fecha o un grupo a formar?') : ($a['medida'] ?: '¿Quieres este curso?'));
        case 'convocatorias':
            $n = $c['abierta'] ? jm_fo_total_convocatorias($a['anio'], $c['id']) : 0;
            return $n > 0 ? esc_html($n . ' convocatorias') : '';
        case 'url':
            return esc_url($c['url']);
        case 'url-solicitar':
            return esc_url(jm_fo_url_solicitar(['curso' => $c['slug']]));
        case 'url-calendario':
            return esc_url(jm_fo_url_calendario($c['slug']));
    }
    return '';
}
add_shortcode('jm_curso', 'jm_sc_formacion_curso');

/** [jm_formacion_cifra que="convocatorias|cursos|sedes" anio="2026"] */
function jm_sc_formacion_cifra($atts): string
{
    $a = shortcode_atts(['que' => 'convocatorias', 'anio' => ''], $atts, 'jm_formacion_cifra');
    switch ($a['que']) {
        case 'convocatorias':
            return esc_html((string) jm_fo_total_convocatorias($a['anio']));
        case 'cursos':
            return esc_html((string) (int) (wp_count_posts('curso')->publish ?? 0));
        case 'sedes':
            return esc_html((string) count(jm_fo_sedes()));
    }
    return '';
}
add_shortcode('jm_formacion_cifra', 'jm_sc_formacion_cifra');

/**
 * [jm_solicitar_titulo plaza="…" otro="…" defecto="…"]
 * El titular de /formacion/solicitar/ según la URL, como el original.
 */
function jm_sc_formacion_solicitar_titulo($atts): string
{
    $a = shortcode_atts([
        'plaza'   => 'Solicita tu plaza.',
        'otro'    => 'Cuéntanos el curso que necesitas y lo diseñamos.',
        'defecto' => 'Cuéntanos qué formación necesitas.',
    ], $atts, 'jm_solicitar_titulo');
    $conv = isset($_GET['convocatoria']) ? sanitize_title(wp_unslash((string) $_GET['convocatoria'])) : '';
    if ($conv !== '' && get_page_by_path($conv, OBJECT, 'convocatoria')) {
        return esc_html($a['plaza']);
    }
    $curso = isset($_GET['curso']) ? sanitize_key(wp_unslash((string) $_GET['curso'])) : '';
    return esc_html($curso === 'otro' ? $a['otro'] : $a['defecto']);
}
add_shortcode('jm_solicitar_titulo', 'jm_sc_formacion_solicitar_titulo');

/* ------------------------------------------------------------
   B) Shortcodes de bloque
   ------------------------------------------------------------ */

/**
 * [jm_calendario_filtros]
 * Chips de curso con recuento, selectores de sede y mes, «Quitar filtros»,
 * el recuento vivo y el estado vacío. El Loop Grid `jm_convocatorias` va
 * justo debajo, en la misma sección; 50-formacion.js lo filtra en cliente.
 */
function jm_sc_formacion_calendario_filtros($atts): string
{
    $a = shortcode_atts([
        'vacio_titulo' => 'No hay convocatorias con esos filtros.',
        'vacio_texto'  => 'Llámanos y te decimos cuándo es la próxima, o si podemos abrir una para tu empresa.',
    ], $atts, 'jm_calendario_filtros');

    $futuras = jm_fo_futuras();
    $cuenta = static function (string $curso = '') use ($futuras): int {
        return count(array_filter($futuras, static fn ($c) => $curso === '' || $c['curso'] === $curso));
    };
    $meses = array_values(array_unique(array_map(static fn ($c) => substr($c['fecha'], 0, 7), $futuras)));

    ob_start();
    ?>
    <div class="jm-cal" data-jm="calendario">
      <div class="jm-cal__filtros">
        <p class="jm-meta jm-cal__rotulo" id="jm-cal-tipo">Tipo de curso</p>
        <div class="jm-cal__chips" role="group" aria-labelledby="jm-cal-tipo">
          <button type="button" class="jm-cal__chip" data-curso="" aria-pressed="true">Todos <span class="jm-value jm-cal__chip-n"><?php echo esc_html((string) $cuenta()); ?></span></button>
          <?php foreach (jm_fo_cursos_abiertos() as $c) : ?>
            <button type="button" class="jm-cal__chip" data-curso="<?php echo esc_attr($c['slug']); ?>" aria-pressed="false"><?php echo esc_html($c['corto'] ?: $c['nombre']); ?> <span class="jm-value jm-cal__chip-n"><?php echo esc_html((string) $cuenta($c['slug'])); ?></span></button>
          <?php endforeach; ?>
        </div>

        <div class="jm-cal__selects">
          <label class="jm-cal__campo">
            <span class="jm-etiqueta-campo">Sede</span>
            <select id="filtro-sede" class="jm-cal__select" data-filtro="sede">
              <option value="">Todas las sedes</option>
              <?php foreach (jm_fo_sedes() as $s) : ?>
                <option value="<?php echo esc_attr($s['slug']); ?>"><?php echo esc_html($s['nombre'] . ($s['zona'] ? ' (' . $s['zona'] . ')' : '')); ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <label class="jm-cal__campo">
            <span class="jm-etiqueta-campo">Mes</span>
            <select id="filtro-mes" class="jm-cal__select" data-filtro="mes">
              <option value="">Todos los meses</option>
              <?php foreach ($meses as $m) : ?>
                <option value="<?php echo esc_attr($m); ?>"><?php echo esc_html(jm_fo_nombre_mes($m)); ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <button type="button" class="jm-cal__quitar" hidden><?php echo jm_fo_icono('x', 15, 2.25); // phpcs:ignore -- SVG propio ?> Quitar filtros</button>
        </div>
      </div>

      <p class="jm-cal__cuenta" aria-live="polite"><?php echo esc_html(count($futuras) === 1 ? '1 convocatoria abiertas' : count($futuras) . ' convocatorias abiertas'); ?></p>

      <div class="jm-cal__vacio"<?php echo $futuras ? ' hidden' : ''; ?>>
        <p class="jm-title"><?php echo esc_html($a['vacio_titulo']); ?></p>
        <p class="jm-cal__vacio-texto"><?php echo esc_html($a['vacio_texto']); ?></p>
      </div>
    </div>
    <?php
    return (string) ob_get_clean();
}
add_shortcode('jm_calendario_filtros', 'jm_sc_formacion_calendario_filtros');

/**
 * [jm_convocatoria_fecha]
 * El cuadro «13 / oct» y el día de la semana. Lleva además, oculto, el
 * marcador con los datos que el JS necesita para filtrar la fila.
 */
function jm_sc_formacion_convocatoria_fecha($atts): string
{
    $c = jm_fo_convocatoria();
    if (!$c || !$c['fecha']) {
        return '';
    }
    $f = jm_fo_partes($c['fecha']);
    $completo = $c['plazas'] !== null && $c['ocupadas'] !== null && $c['ocupadas'] >= $c['plazas'];
    $hoy = $c['fecha'] === jm_fo_hoy();
    return '<div class="jm-conv__fecha' . ($hoy ? ' jm-conv__fecha--hoy' : '') . '">'
        . '<span hidden data-jm-conv'
        . ' data-id="' . esc_attr($c['id']) . '"'
        . ' data-curso="' . esc_attr($c['curso']['slug'] ?? '') . '"'
        . ' data-sede="' . esc_attr($c['sede']['slug'] ?? '') . '"'
        . ' data-fecha="' . esc_attr($c['fecha']) . '"'
        . ($completo ? ' data-completo' : '') . '></span>'
        . '<span class="jm-conv__cuadro"><span class="jm-conv__dia">' . esc_html((string) $f['dia']) . '</span>'
        . '<span class="jm-conv__mes">' . esc_html($f['mesCorto']) . '</span></span>'
        . '<span class="jm-conv__semana">' . esc_html($hoy ? 'Hoy' : $f['diaSemana']) . '</span>'
        . '</div>';
}
add_shortcode('jm_convocatoria_fecha', 'jm_sc_formacion_convocatoria_fecha');

/**
 * [jm_convocatoria_plazas]
 * Vacío mientras Formación no gestione plazas y ocupación desde el panel.
 */
function jm_sc_formacion_convocatoria_plazas($atts): string
{
    $c = jm_fo_convocatoria();
    if (!$c || $c['plazas'] === null || $c['ocupadas'] === null || $c['plazas'] <= 0) {
        return '';
    }
    $libres = max(0, $c['plazas'] - $c['ocupadas']);
    $tono = $libres === 0 ? 'completo' : ($libres <= 3 ? 'ultimas' : 'libres');
    $texto = $libres === 0 ? 'Completo' : ($libres <= 3 ? 'Últimas ' . $libres . ' plazas' : $libres . ' plazas libres');
    $ancho = min(100, round($c['ocupadas'] / $c['plazas'] * 100));
    return '<span class="jm-plazas jm-plazas--' . esc_attr($tono) . '">'
        . '<span class="jm-plazas__texto">' . esc_html($texto) . '</span>'
        . '<span class="jm-plazas__barra" aria-hidden="true"><span style="width:' . esc_attr((string) $ancho) . '%"></span></span>'
        . '</span>';
}
add_shortcode('jm_convocatoria_plazas', 'jm_sc_formacion_convocatoria_plazas');

/**
 * [jm_curso_chips variante="tarjeta|ficha"]
 *   tarjeta: la norma, con la insignia si está certificado (nada si no hay norma).
 *   ficha:   «Certificado por AENOR · UNE 58923» + «Convocatoria abierta» / «A medida».
 */
function jm_sc_formacion_curso_chips($atts): string
{
    $a = shortcode_atts(['variante' => 'tarjeta', 'abierta' => 'Convocatoria abierta', 'medida' => 'A medida'], $atts, 'jm_curso_chips');
    $c = jm_fo_curso();
    if (!$c) {
        return '';
    }
    if ($a['variante'] === 'ficha') {
        $html = '<div class="jm-curso-chips">';
        $cert = implode(' · ', array_filter([$c['certificacion'], $c['norma']]));
        if ($cert !== '') {
            $html .= '<span class="jm-curso-chip jm-curso-chip--acento">'
                . ($c['certificacion'] ? jm_fo_icono('badge', 14, 2) : '') . esc_html($cert) . '</span>';
        }
        $html .= '<span class="jm-curso-chip jm-curso-chip--contorno">' . esc_html($c['abierta'] ? $a['abierta'] : $a['medida']) . '</span>';
        return $html . '</div>';
    }
    if ($c['norma'] === '') {
        return '';
    }
    return '<span class="jm-curso-chip jm-curso-chip--norma">'
        . ($c['certificacion'] ? jm_fo_icono('badge', 13, 2, 'jm-acento') : '')
        . esc_html($c['norma']) . '</span>';
}
add_shortcode('jm_curso_chips', 'jm_sc_formacion_curso_chips');

/**
 * [jm_curso_enlace_calendario anio=""]
 * «5 convocatorias» al pie de la tarjeta: solo en los cursos con
 * convocatoria abierta y si tienen alguna. Lleva al calendario filtrado.
 */
function jm_sc_formacion_curso_enlace_calendario($atts): string
{
    $a = shortcode_atts(['anio' => ''], $atts, 'jm_curso_enlace_calendario');
    $c = jm_fo_curso();
    if (!$c || !$c['abierta']) {
        return '';
    }
    $n = jm_fo_total_convocatorias($a['anio'], $c['id']);
    if ($n < 1) {
        return '';
    }
    return '<a class="jm-tcurso__convs" href="' . esc_url(jm_fo_url_calendario($c['slug'])) . '">'
        . jm_fo_icono('calendar', 15, 2) . esc_html($n . ' convocatorias') . '</a>';
}
add_shortcode('jm_curso_enlace_calendario', 'jm_sc_formacion_curso_enlace_calendario');

/**
 * [jm_proximas_curso max="4"]
 * Las próximas fechas del curso con su «Solicitar plaza» (ProximasCurso.tsx).
 * Solo en cursos con convocatoria abierta. El servidor pinta todas las
 * futuras; el JS esconde las que hayan pasado si la página viene de caché.
 */
function jm_sc_formacion_proximas_curso($atts): string
{
    $a = shortcode_atts([
        'max'    => '4',
        'titulo' => 'Próximas convocatorias',
        'vacio'  => 'No hay fechas abiertas ahora mismo. Pídenos información y te avisamos de la próxima.',
    ], $atts, 'jm_proximas_curso');
    $c = jm_fo_curso();
    if (!$c || !$c['abierta']) {
        return '';
    }
    $max = max(1, (int) $a['max']);
    $lista = array_values(array_filter(jm_fo_futuras(), static fn ($x) => $x['curso'] === $c['slug']));
    $total = count($lista);

    $html = '<div class="jm-proximas" data-jm="proximas-curso" data-max="' . esc_attr((string) $max) . '">';
    $html .= '<p class="jm-meta jm-proximas__titulo">' . jm_fo_icono('calendar', 14, 2, 'jm-acento') . esc_html($a['titulo']) . '</p>';
    $html .= '<p class="jm-proximas__vacio"' . ($total ? ' hidden' : '') . '>' . esc_html($a['vacio']) . '</p>';
    $html .= '<ul class="jm-proximas__lista">';
    foreach ($lista as $i => $x) {
        $f = jm_fo_partes($x['fecha']);
        $html .= '<li class="jm-proximas__item" data-fecha="' . esc_attr($x['fecha']) . '"' . ($i >= $max ? ' hidden' : '') . '>'
            . '<span class="jm-proximas__cuadro"><span class="jm-proximas__dia">' . esc_html((string) $f['dia']) . '</span>'
            . '<span class="jm-proximas__mes">' . esc_html($f['mesCorto']) . '</span></span>'
            . '<span class="jm-proximas__cuerpo"><span class="jm-proximas__semana">' . esc_html($f['diaSemana']) . '</span>'
            . '<span class="jm-proximas__sede">' . jm_fo_icono('map-pin', 11, 2) . esc_html($x['sedeNombre'] ?? '') . '</span></span>'
            . '<a class="jm-proximas__plaza" href="' . esc_url(jm_fo_url_solicitar(['convocatoria' => $x['id']])) . '">Solicitar plaza</a>'
            . '</li>';
    }
    $html .= '</ul>';
    $texto = $total > $max ? 'Ver las ' . $total . ' fechas en el calendario' : 'Ver en el calendario';
    $html .= '<a class="jm-proximas__todas" href="' . esc_url(jm_fo_url_calendario($c['slug'])) . '"' . ($total ? '' : ' hidden') . '>'
        . '<span class="jm-proximas__todas-texto">' . esc_html($texto) . '</span>' . jm_fo_icono('arrow', 14, 2.25) . '</a>';
    return $html . '</div>';
}
add_shortcode('jm_proximas_curso', 'jm_sc_formacion_proximas_curso');

/**
 * [jm_tel_formacion prefijo="Formación · " variante="placa|ficha|texto|boton"]
 * El teléfono de Formación (Ajustes → teléfono de formación), enlazado.
 *   placa: bajo los botones de la cabecera oscura.
 *   ficha: en la caja oscura de la ficha del curso.
 *   texto: en línea dentro de un párrafo (solicitar).
 *   boton: botón de contorno grande (página de gracias).
 */
function jm_sc_formacion_tel($atts): string
{
    $a = shortcode_atts(['prefijo' => '', 'variante' => 'texto'], $atts, 'jm_tel_formacion');
    $visible = (string) jm_ajuste('telefono_formacion');
    if ($visible === '') {
        return '';
    }
    $variantes = [
        'placa' => ['jm-placa__telefono', 16, 1.75],
        'ficha' => ['jm-tel-formacion jm-tel-formacion--ficha', 14, 2],
        'texto' => ['jm-tel-formacion jm-tel-formacion--texto', 16, 1.75],
        'boton' => ['jm-tel-formacion jm-tel-formacion--boton', 18, 1.75],
    ];
    [$clase, $tam, $grosor] = $variantes[$a['variante']] ?? $variantes['texto'];
    $enlace = '<a class="jm-tel-formacion__a" href="tel:' . esc_attr(jm_tel($visible)) . '">'
        . jm_fo_icono('phone', $tam, $grosor)
        . '<span class="jm-value">' . esc_html($a['prefijo'] . $visible) . '</span></a>';
    if ($a['variante'] === 'texto') {
        return '<span class="' . esc_attr($clase) . '">' . $enlace . '</span>';
    }
    return '<div class="' . esc_attr($clase) . '">' . $enlace . '</div>';
}
add_shortcode('jm_tel_formacion', 'jm_sc_formacion_tel');

/**
 * [jm_formacion_referencia etiqueta="Tu referencia"]
 * El bloque «Tu referencia» de la página de gracias, con el ?ref= que pone
 * la acción «Redirigir» del formulario. No pinta nada si no hay referencia.
 */
function jm_sc_formacion_referencia($atts): string
{
    $a = shortcode_atts(['etiqueta' => 'Tu referencia'], $atts, 'jm_formacion_referencia');
    $ref = isset($_GET['ref']) ? strtoupper(sanitize_text_field(wp_unslash((string) $_GET['ref']))) : '';
    if (!preg_match('/^[A-Z]{3}-\d{4}-\d{3,8}$/', $ref)) {
        return '';
    }
    return '<p class="jm-referencia"><span class="jm-label-sm jm-referencia__k">' . esc_html($a['etiqueta']) . '</span>'
        . '<span class="jm-value-lg jm-referencia__v">' . esc_html($ref) . '</span></p>';
}
add_shortcode('jm_formacion_referencia', 'jm_sc_formacion_referencia');

/* ------------------------------------------------------------
   Contenido del curso: el enlace al calendario lleva el curso
   ------------------------------------------------------------ */

/*
 * El importador escribe el «(vínculo)» del documento como enlace a
 * /formacion/#calendario. En el original, ese enlace deja el calendario
 * filtrado por el curso (EnlaceCalendario): aquí se reescribe a
 * #calendario-{curso}, que es lo que entiende 50-formacion.js.
 */
add_filter('the_content', function ($html) {
    if (get_post_type() !== 'curso' || strpos((string) $html, '#calendario"') === false) {
        return $html;
    }
    $slug = (string) get_post_field('post_name', get_the_ID());
    if ($slug === '') {
        return $html;
    }
    return str_replace('/formacion/#calendario"', '/formacion/#calendario-' . esc_attr($slug) . '"', (string) $html);
}, 20);
