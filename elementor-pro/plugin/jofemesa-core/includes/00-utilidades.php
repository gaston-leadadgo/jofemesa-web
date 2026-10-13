<?php
/**
 * Utilidades comunes, ajustes de empresa y carga de estilos y scripts.
 *
 * API para el resto de archivos:
 *   jm_datos($archivo)            Array del JSON de datos/ (cacheado por petición).
 *   jm_ajuste($clave, $defecto)   Ajuste de «JOFEMESA → Ajustes».
 *   jm_maquina($post_id = null)   Datos completos de una máquina (ver abajo).
 *   jm_svg($nombre)               SVG en línea de assets/iconos/{nombre}.svg.
 *   jm_tel($numero)               «91 361 31 31» → «+34913613131».
 *   jm_url_media($ruta)           Ruta del JSON → URL absoluta de origen.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ------------------------------------------------------------
   Datos
   ------------------------------------------------------------ */

function jm_datos(string $archivo): array
{
    static $cache = [];
    if (!isset($cache[$archivo])) {
        $ruta = JM_DIR . 'datos/' . basename($archivo);
        $json = is_readable($ruta) ? file_get_contents($ruta) : '';
        $cache[$archivo] = $json ? (json_decode($json, true) ?: []) : [];
    }
    return $cache[$archivo];
}

/** Ajustes de empresa con sus valores por defecto tomados de empresa.json. */
function jm_ajustes_por_defecto(): array
{
    $e = jm_datos('empresa.json');
    $redes = [];
    foreach (($e['redes'] ?? []) as $r) {
        $redes[$r['id']] = $r['url'];
    }
    return [
        'origen_media'      => 'https://jofemesa-web.vercel.app',
        'telefono'          => $e['telefonoPrincipal']['visible'] ?? '91 361 31 31',
        'email'             => $e['email'] ?? 'jofemesa@jofemesa.com',
        'fundacion'         => '1987-03-24',
        'linkedin'          => $redes['linkedin'] ?? '',
        'facebook'          => $redes['facebook'] ?? '',
        'instagram'         => $redes['instagram'] ?? '',
        'whatsapp'          => '',
        'telefono_formacion' => $e['sedeFormacion']['telefono'] ?? '',
        'email_formacion'   => $e['sedeFormacion']['email'] ?? '',
        'email_avisos'      => get_option('admin_email'),
    ];
}

function jm_ajuste(string $clave, $defecto = '')
{
    $guardados = get_option('jm_ajustes', []);
    $base = jm_ajustes_por_defecto();
    if (isset($guardados[$clave]) && $guardados[$clave] !== '') {
        return $guardados[$clave];
    }
    return $base[$clave] ?? $defecto;
}

/** «91 361 31 31» → «+34913613131»; deja intactos los que ya traen prefijo. */
function jm_tel(string $numero): string
{
    $limpio = preg_replace('/[^\d+]/', '', $numero);
    if ($limpio === '') {
        return '';
    }
    return str_starts_with($limpio, '+') ? $limpio : '+34' . $limpio;
}

function jm_url_media(?string $ruta): string
{
    if (!$ruta) {
        return '';
    }
    if (preg_match('#^https?://#', $ruta)) {
        return $ruta;
    }
    return untrailingslashit(jm_ajuste('origen_media')) . '/' . ltrim($ruta, '/');
}

/**
 * Todo lo de una máquina en un array: campos ACF + los JSON calculados que
 * guarda el importador (tarjeta, specs, comparador, destacados…).
 */
function jm_maquina($post_id = null): array
{
    $post_id = $post_id ?: get_the_ID();
    if (!$post_id || get_post_type($post_id) !== 'maquina') {
        return [];
    }
    static $cache = [];
    if (isset($cache[$post_id])) {
        return $cache[$post_id];
    }
    $json = static function ($clave) use ($post_id) {
        $v = get_post_meta($post_id, '_jmj_' . $clave, true);
        return $v ? (json_decode($v, true) ?: []) : [];
    };
    $ficha_id = (int) get_post_meta($post_id, 'jm_ficha_pdf', true);
    $foto_id = (int) get_post_thumbnail_id($post_id);
    $familias = wp_get_post_terms($post_id, 'familia');
    $familia = null;
    $subcategoria = null;
    foreach ($familias as $t) {
        if ($t->parent) {
            $subcategoria = $t;
        } else {
            $familia = $t;
        }
    }
    $cache[$post_id] = [
        'id'           => $post_id,
        'slug'         => get_post_meta($post_id, 'jm_slug', true) ?: get_post_field('post_name', $post_id),
        'url'          => get_permalink($post_id),
        'titulo'       => get_the_title($post_id),
        'marca'        => get_post_meta($post_id, 'jm_marca', true),
        'modelo'       => get_post_meta($post_id, 'jm_modelo', true),
        'descripcion'  => get_post_meta($post_id, 'jm_descripcion', true),
        'altura'       => get_post_meta($post_id, 'jm_altura', true),
        'carga'        => get_post_meta($post_id, 'jm_carga', true),
        'orden'        => (int) get_post_meta($post_id, 'jm_orden', true),
        'energia'      => get_post_meta($post_id, 'jm_energia', true),
        'energia_nombre' => get_post_meta($post_id, 'jm_energia_nombre', true),
        'familia'      => $familia ? $familia->slug : '',
        'familia_nombre' => $familia ? $familia->name : '',
        'subcategoria' => $subcategoria ? $subcategoria->slug : '',
        'subcategoria_nombre' => $subcategoria ? $subcategoria->name : get_post_meta($post_id, 'jm_subcategoria_nombre', true),
        'icono'        => get_post_meta($post_id, 'jm_icono', true),
        'foto'         => $foto_id ? wp_get_attachment_image_url($foto_id, 'large') : '',
        'foto_id'      => $foto_id,
        'foto_alt'     => $foto_id ? get_post_meta($foto_id, '_wp_attachment_image_alt', true) : '',
        'ficha_url'    => $ficha_id ? wp_get_attachment_url($ficha_id) : '',
        'ficha_bytes'  => (int) get_post_meta($post_id, 'jm_ficha_bytes', true),
        'destacados'   => array_values(array_filter(array_map('trim', explode("\n", (string) get_post_meta($post_id, 'jm_destacados', true))))),
        'aplicaciones' => array_values(array_filter(array_map('trim', explode("\n", (string) get_post_meta($post_id, 'jm_aplicaciones', true))))),
        'tarjeta'      => $json('tarjeta'),
        'specs'        => $json('specs'),
        'comparador'   => $json('comparador'),
        'relacionadas' => $json('relacionadas'),
        'entornos'     => $json('entornos'),
        'trabajos'     => $json('trabajos'),
        'busqueda'     => get_post_meta($post_id, '_jmj_busqueda', true),
        'gama'         => (bool) get_post_meta($post_id, 'jm_gama', true),
    ];
    return $cache[$post_id];
}

/** Busca una máquina por su slug de la web Next (= post_name). */
function jm_maquina_por_slug(string $slug): int
{
    $p = get_page_by_path(sanitize_title($slug), OBJECT, 'maquina');
    return $p ? (int) $p->ID : 0;
}

/* ------------------------------------------------------------
   SVG en línea
   ------------------------------------------------------------ */

function jm_svg(string $nombre, string $clase = ''): string
{
    $ruta = JM_DIR . 'assets/iconos/' . sanitize_file_name($nombre) . '.svg';
    if (!is_readable($ruta)) {
        return '';
    }
    $svg = file_get_contents($ruta);
    $svg = preg_replace('/<\?xml.*?\?>/s', '', $svg);
    $extra = ' aria-hidden="true" focusable="false"' . ($clase ? ' class="' . esc_attr($clase) . '"' : '');
    return preg_replace('/<svg\b/', '<svg' . $extra, $svg, 1);
}

/** Formato de tamaño de archivo: 1240086 → «1,2 MB». */
function jm_tamano(int $bytes): string
{
    if ($bytes <= 0) {
        return '';
    }
    if ($bytes < 1024 * 1024) {
        return number_format_i18n($bytes / 1024, 0) . ' KB';
    }
    return number_format_i18n($bytes / 1048576, 1) . ' MB';
}

/* ------------------------------------------------------------
   Clase de ámbito, tipografías, CSS y JS
   ------------------------------------------------------------ */

add_filter('body_class', function ($clases) {
    $clases[] = 'jm';
    return $clases;
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'jm-tipos',
        'https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
        [],
        null
    );

    /* Todos los CSS de assets/css en orden alfabético, encadenados: así el
       adaptador (90-) siempre carga después de los componentes. Dependen
       de los de Elementor para cargar detrás de ellos. */
    $previo = wp_style_is('elementor-frontend', 'registered') ? ['elementor-frontend'] : [];
    $css = glob(JM_DIR . 'assets/css/*.css') ?: [];
    sort($css);
    foreach ($css as $archivo) {
        $id = 'jm-' . basename($archivo, '.css');
        wp_enqueue_style($id, JM_URL . 'assets/css/' . basename($archivo), $previo, filemtime($archivo));
        $previo = [$id];
    }

    /* JS: todos menos el motor del asesor, que lo pide su shortcode. */
    $js = glob(JM_DIR . 'assets/js/*.js') ?: [];
    sort($js);
    $previo = [];
    foreach ($js as $archivo) {
        $nombre = basename($archivo, '.js');
        if ($nombre === 'asesor-motor') {
            wp_register_script('jm-asesor-motor', JM_URL . 'assets/js/asesor-motor.js', [], filemtime($archivo), true);
            continue;
        }
        $id = 'jm-' . $nombre;
        wp_enqueue_script($id, JM_URL . 'assets/js/' . basename($archivo), $previo, filemtime($archivo), true);
        $previo = ['jm-00-nucleo'];
    }

    wp_localize_script('jm-00-nucleo', 'JM_DATOS', [
        'inicio'    => home_url('/'),
        'ajax'      => admin_url('admin-ajax.php'),
        'telefono'  => jm_ajuste('telefono'),
        'tel'       => jm_tel(jm_ajuste('telefono')),
        'fundacion' => jm_ajuste('fundacion'),
        'rutas'     => [
            'alquiler'      => home_url('/alquiler/'),
            'comparador'    => home_url('/comparador/'),
            'solicitud'     => home_url('/consultar-disponibilidad/'),
            'formacion'     => home_url('/formacion/'),
            'solicitarCurso' => home_url('/formacion/solicitar/'),
        ],
    ]);
}, 20);

/* El atributo `data-motor` se pone desde JS; si el JS no llega, la página
   se ve entera. Esto solo evita el parpadeo poniendo la marca antes de
   pintar cuando el navegador NO pide movimiento reducido. */
add_action('wp_head', function () {
    /* Red de seguridad: si en 3 s el núcleo JS no ha arrancado (404, error),
       se quita la marca y todo se ve. Una página en blanco es peor que una
       página sin animación. */
    echo "<script>(function(d){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.setAttribute('data-motor','');setTimeout(function(){if(!window.JM)d.removeAttribute('data-motor');},3000);})(document.documentElement);</script>\n";
}, 1);
