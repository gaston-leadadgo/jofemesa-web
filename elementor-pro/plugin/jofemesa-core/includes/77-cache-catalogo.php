<?php
/**
 * Caché de página completa para visitantes anónimos.
 *
 * El servidor de jofemesa.com tarda de 2 a 15 segundos en generar cada
 * página con Elementor (medido el 05/11/2026: Inicio 2,4 s, Servicios 5 s,
 * Formación 12 s, Alquiler 15 s). Aquí cada página se genera una vez, se
 * guarda como HTML en uploads/jm-cache/ y las visitas siguientes la reciben
 * tal cual, en milisegundos.
 *
 *   · Solo visitantes sin sesión y peticiones GET sin parámetros. Excepción:
 *     el catálogo (/alquiler/ y familias), cuyos filtros van en la URL pero
 *     se aplican en el navegador; ahí la clave es solo la ruta.
 *   · Las páginas con parámetros (?m=… del formulario, ?ref=… de gracias,
 *     búsquedas, vistas previas) nunca se guardan.
 *   · Caduca a medianoche: el calendario de Formación quita las fechas
 *     pasadas cada día.
 *   · Se vacía al guardar contenido (entradas, términos, Elementor, ajustes,
 *     menús, importaciones, actualización del plugin) y se vuelve a generar
 *     sola en segundo plano (precalentado), para que el primer visitante
 *     tampoco espere.
 *
 * Además, en toda página servida a anónimos los iconos repetidos de
 * Elementor (SVG en línea) se cambian por referencias a un único símbolo:
 * en Formación eran 1.300 SVG iguales (630 KB de HTML).
 *
 * Cabecera de control: X-JM-Cache: HIT | MISS | NO.
 */

if (!defined('ABSPATH')) {
    exit;
}

function jm_cache_dir(): string
{
    $subidas = wp_upload_dir();
    return trailingslashit($subidas['basedir']) . 'jm-cache/';
}

/** ¿Es una petición de visitante a una página pública? */
function jm_cache_es_publica(): bool
{
    if (is_user_logged_in() || is_admin() || wp_doing_ajax() || wp_doing_cron() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return false;
    }
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
        return false;
    }
    if (is_feed() || is_search() || is_preview() || is_404() || is_robots() || is_trackback()) {
        return false;
    }
    if (isset($_GET['preview']) || isset($_GET['elementor-preview']) || isset($_GET['ver_borrador'])) {
        return false;
    }
    return true;
}

function jm_cache_es_catalogo(): bool
{
    return is_page('alquiler') || is_tax('familia');
}

/** ¿Se puede guardar? Página pública y sin parámetros (salvo el catálogo). */
function jm_cache_aplica(): bool
{
    if (!jm_cache_es_publica()) {
        return false;
    }
    if (!empty($_GET) && !jm_cache_es_catalogo()) {
        return false;
    }
    return is_singular() || is_front_page() || is_tax() || is_post_type_archive();
}

function jm_cache_archivo(): string
{
    $ruta = strtok((string) ($_SERVER['REQUEST_URI'] ?? '/'), '?');
    /* Misma clave que drop-in/advanced-cache.php. Al actualizar el plugin la
       carpeta se vacía (upgrader_process_complete), así que no lleva versión. */
    return jm_cache_dir() . md5('jm|' . $ruta) . '.html';
}

/** Válido si es de hoy (hora de Madrid) y tiene menos de 24 h. */
function jm_cache_vigente(string $archivo): bool
{
    if (!is_readable($archivo)) {
        return false;
    }
    $t = (int) filemtime($archivo);
    return (time() - $t) < DAY_IN_SECONDS && wp_date('Ymd', $t) === wp_date('Ymd');
}

/**
 * Iconos de Elementor repetidos → un símbolo y referencias <use>.
 * Solo los que aparecen más de una vez; el resto se queda igual.
 */
function jm_optimizar_html(string $html): string
{
    /* Logos del carrusel de fabricantes (pie, en todas las páginas): carga
       diferida nativa. El «lazyload» del widget usa el de Swiper y con el
       desplazamiento continuo dejaba los logos sin cargar. */
    $html = preg_replace('#<img class="swiper-slide-image"(?![^>]*\bloading=)#', '<img loading="lazy" decoding="async" class="swiper-slide-image"', $html);

    $html = jm_accesibilidad_html($html);

    /* Prioridad de descarga: WordPress da fetchpriority="high" a la primera
       imagen grande, que en esta web es el logo. La que de verdad pinta
       la pantalla (LCP) es la foto del hero o de la placa de cabecera. */
    foreach (['jm-hero__foto--alquiler', 'jm-placa__foto'] as $hero) {
        $p = strpos($html, $hero);
        $img = $p === false ? false : strpos($html, '<img ', $p);
        if ($img !== false && $img - $p < 3000) {
            $html = str_replace(' fetchpriority="high"', '', $html);
            $img = strpos($html, '<img ', (int) strpos($html, $hero));
            $html = substr_replace($html, '<img fetchpriority="high" ', $img, 5);
            break;
        }
    }
    /* La segunda portada del hero (Formación) entra a los segundos: que no
       compita con la primera. */
    $p = strpos($html, 'jm-hero__foto--formacion');
    $img = $p === false ? false : strpos($html, '<img ', $p);
    if ($img !== false && $img - $p < 3000) {
        $html = substr_replace($html, '<img fetchpriority="low" ', $img, 5);
    }

    if (str_contains($html, 'jm-catalogo-rejilla')) {
        $html = jm_catalogo_reserva($html, 'jm-catalogo-rejilla', JM_CATALOGO_VISIBLES);
    }
    /* Formación: el calendario (Loop Grid .jm-cal-lista) enseña 12 fechas;
       se dejan 16 montadas y el resto, hasta 265, en reserva. */
    if (str_contains($html, 'jm-cal-lista')) {
        $html = jm_catalogo_reserva($html, 'jm-cal-lista', 16);
    }

    /* 07-optimizar-html.php: tamaños de imagen, hero y hojas agrupadas. */
    $html = jm_tamanos_imagenes($html);
    $html = jm_diferir_segunda_portada($html);
    $html = jm_precargar_hero($html);
    $html = jm_combinar_css($html);

    $patron = '#<svg aria-hidden="true" class="(e-font-icon-svg [^"]+)" viewBox="([^"]+)" xmlns="http://www\.w3\.org/2000/svg">(.*?)</svg>#s';
    if (!preg_match_all($patron, $html, $m, PREG_SET_ORDER)) {
        return $html;
    }
    $cuenta = [];
    foreach ($m as $s) {
        $k = md5($s[2] . '|' . $s[3]);
        $cuenta[$k] = ($cuenta[$k] ?? 0) + 1;
    }
    $simbolos = [];
    $html = preg_replace_callback($patron, function ($s) use ($cuenta, &$simbolos) {
        $k = md5($s[2] . '|' . $s[3]);
        if ($cuenta[$k] < 2) {
            return $s[0];
        }
        $id = 'jmi-' . substr($k, 0, 10);
        if (!isset($simbolos[$id])) {
            $simbolos[$id] = '<symbol id="' . $id . '" viewBox="' . $s[2] . '">' . $s[3] . '</symbol>';
        }
        return '<svg aria-hidden="true" class="' . $s[1] . '" viewBox="' . $s[2] . '"><use href="#' . $id . '"></use></svg>';
    }, $html);
    if ($simbolos) {
        $sprite = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">' . implode('', $simbolos) . '</svg>';
        $html = preg_replace('#(<body[^>]*>)#', '$1' . $sprite, $html, 1);
    }
    return $html;
}

/**
 * Catálogo: de las ~200 tarjetas del Loop Grid, las JM_CATALOGO_VISIBLES
 * primeras quedan en la página y el resto va dentro de un <template>.
 *
 * El JS ya enseñaba 24 y ocultaba las demás, pero el navegador tenía que
 * montar las 196 igual: 14.400 elementos en /alquiler/ (medido el
 * 05/11/2026), lo que hundía la nota de PageSpeed en móvil. Lo que hay en
 * un <template> no se monta, no ocupa estilos ni descarga imágenes; el JS
 * del catálogo (40-catalogo.js) lo saca en cuanto un filtro, el orden o
 * «Ver más» lo necesitan.
 */
const JM_CATALOGO_VISIBLES = 24;

function jm_catalogo_reserva(string $html, string $ancla = 'jm-catalogo-rejilla', int $visibles = JM_CATALOGO_VISIBLES): string
{
    /* La primera tarjeta DESPUÉS del widget ancla: en Formación hay otros
       Loop Grid (los cursos) antes del calendario. */
    $desdeAncla = strpos($html, $ancla);
    if ($desdeAncla === false) {
        return $html;
    }
    $marca = strpos($html, 'data-elementor-type="loop-item"', $desdeAncla);
    if ($marca === false) {
        return $html;
    }
    $inicio = strrpos(substr($html, 0, $marca), '<div');
    if ($inicio === false || !preg_match_all('#<div\b|</div\s*>#i', $html, $t, PREG_OFFSET_CAPTURE, $inicio)) {
        return $html;
    }
    $items = [];
    $prof = 0;
    $abierto = null;
    foreach ($t[0] as [$etiqueta, $pos]) {
        $cierra = $etiqueta[1] === '/';
        if (!$cierra) {
            if ($prof === 0) {
                /* Un hermano que no es tarjeta: fin de la rejilla. */
                if (!str_starts_with(substr($html, $pos, 200), '<div data-elementor-type="loop-item"')) {
                    break;
                }
                $abierto = $pos;
            }
            $prof++;
            continue;
        }
        if ($prof === 0) {
            break; /* cierre del contenedor de la rejilla */
        }
        $prof--;
        if ($prof === 0 && $abierto !== null) {
            $items[] = [$abierto, $pos + strlen($etiqueta)];
            $abierto = null;
        }
    }
    if (count($items) <= $visibles || $prof !== 0) {
        return $html;
    }
    $desde = $items[$visibles][0];
    $hasta = end($items)[1];
    return substr($html, 0, $desde)
        . '<template class="jm-reserva">' . substr($html, $desde, $hasta - $desde) . '</template>'
        . substr($html, $hasta);
}

add_action('template_redirect', function () {
    if (!jm_cache_es_publica()) {
        return;
    }
    if (!jm_cache_aplica()) {
        header('X-JM-Cache: NO');
        ob_start(function (string $html): string {
            return stripos($html, '</html>') !== false ? jm_optimizar_html($html) : $html;
        });
        return;
    }
    $archivo = jm_cache_archivo();
    if (jm_cache_vigente($archivo)) {
        header('X-JM-Cache: HIT');
        readfile($archivo);
        exit;
    }
    header('X-JM-Cache: MISS');
    ob_start(function (string $html) use ($archivo): string {
        if (stripos($html, '</html>') === false) {
            return $html;
        }
        $html = jm_optimizar_html($html);
        if (http_response_code() === 200 && strlen($html) > 1000) {
            wp_mkdir_p(dirname($archivo));
            @file_put_contents($archivo . '.tmp', $html, LOCK_EX);
            @rename($archivo . '.tmp', $archivo);
        }
        return $html;
    });
}, 0);

/* ------------------------------------------------------------
   Vaciado
   ------------------------------------------------------------ */

function jm_cache_vaciar(): void
{
    foreach ((array) glob(jm_cache_dir() . '*.html') as $archivo) {
        @unlink($archivo);
    }
    jm_cache_programar_calentado(30);
}

/* Un solo vaciado por petición, al final: una importación toca miles de
   datos y no hace falta borrar la carpeta en cada uno. */
function jm_cache_marcar(): void
{
    static $marcado = false;
    if (!$marcado) {
        $marcado = true;
        add_action('shutdown', 'jm_cache_vaciar');
    }
}

add_action('save_post', function ($id) {
    if (wp_is_post_revision($id) || wp_is_post_autosave($id)) {
        return;
    }
    $tipo = get_post_type($id);
    if (in_array($tipo, ['customize_changeset', 'oembed_cache', 'user_request', 'wp_global_styles'], true)) {
        return;
    }
    jm_cache_marcar();
});
add_action('deleted_post', 'jm_cache_marcar');
add_action('trashed_post', 'jm_cache_marcar');
add_action('transition_post_status', function ($nuevo, $viejo) {
    if ($nuevo !== $viejo && $nuevo !== 'auto-draft' && $viejo !== 'new') {
        jm_cache_marcar();
    }
}, 10, 2);
/* Metadatos: solo los del plugin. Antes vaciaba con CUALQUIER metadato, y
   WordPress y Elementor escriben metadatos internos al abrir el editor o
   regenerar CSS: la caché casi nunca llegaba a servirse. */
$jm_meta_vacia = function ($mid, $objeto, $clave) {
    if (is_string($clave) && (str_starts_with($clave, 'jm_') || $clave === '_elementor_data' || $clave === '_thumbnail_id')) {
        jm_cache_marcar();
    }
};
add_action('updated_post_meta', $jm_meta_vacia, 10, 3);
add_action('added_post_meta', $jm_meta_vacia, 10, 3);
add_action('deleted_post_meta', $jm_meta_vacia, 10, 3);
add_action('edited_term', 'jm_cache_marcar');
add_action('created_term', 'jm_cache_marcar');
add_action('delete_term', 'jm_cache_marcar');
add_action('elementor/editor/after_save', 'jm_cache_marcar');
add_action('elementor/core/files/clear_cache', 'jm_cache_marcar');
add_action('wp_update_nav_menu', 'jm_cache_marcar');
add_action('upgrader_process_complete', 'jm_cache_marcar');
add_action('activated_plugin', 'jm_cache_marcar');
add_action('deactivated_plugin', 'jm_cache_marcar');
add_action('update_option_jm_ajustes', 'jm_cache_marcar');

/* ------------------------------------------------------------
   Precalentado: generar las páginas antes de que llegue nadie
   ------------------------------------------------------------ */

function jm_cache_programar_calentado(int $segundos): void
{
    if (!wp_next_scheduled('jm_cache_calentar', [0])) {
        wp_schedule_single_event(time() + $segundos, 'jm_cache_calentar', [0]);
    }
}

/** Primero las páginas y familias; después las fichas de máquina. */
function jm_cache_urls(): array
{
    $urls = [home_url('/')];
    foreach (get_posts(['post_type' => 'page', 'post_status' => 'publish', 'posts_per_page' => -1, 'fields' => 'ids', 'orderby' => 'menu_order']) as $id) {
        $urls[] = get_permalink($id);
    }
    if (taxonomy_exists('familia')) {
        foreach (get_terms(['taxonomy' => 'familia', 'hide_empty' => true]) as $t) {
            $enlace = get_term_link($t);
            if (!is_wp_error($enlace)) {
                $urls[] = $enlace;
            }
        }
    }
    /* Las 196 fichas de máquina no: se guardan al primer visitante. Calentarlas
       todas tenía al servidor ocupado varios minutos en cada vaciado, y este
       hosting limita los procesos PHP simultáneos (las demás visitas esperaban). */
    foreach (['curso'] as $tipo) {
        if (post_type_exists($tipo)) {
            foreach (get_posts(['post_type' => $tipo, 'post_status' => 'publish', 'posts_per_page' => -1, 'fields' => 'ids', 'orderby' => 'ID', 'order' => 'ASC']) as $id) {
                $urls[] = get_permalink($id);
            }
        }
    }
    return array_values(array_unique(array_filter($urls)));
}

/* Tandas de 15 URL por ejecución, encadenadas, para no pasar del tiempo
   máximo de PHP del hosting. */
add_action('jm_cache_calentar', function ($desde = 0) {
    if (function_exists('set_time_limit')) {
        @set_time_limit(300);
    }
    $urls = jm_cache_urls();
    $tanda = array_slice($urls, (int) $desde, 15);
    $limite = time() + 240;
    $hechas = 0;
    foreach ($tanda as $url) {
        if (time() > $limite) {
            break;
        }
        wp_remote_get($url, [
            'timeout'    => 45,
            'sslverify'  => false,
            'user-agent' => 'JOFEMESA-precalentado',
            'headers'    => ['Cache-Control' => 'no-cache'],
        ]);
        $hechas++;
        /* Respiro entre páginas: deja libre un proceso PHP para las visitas. */
        usleep(1500000);
    }
    $siguiente = (int) $desde + $hechas;
    if ($siguiente < count($urls)) {
        wp_schedule_single_event(time() + 5, 'jm_cache_calentar', [$siguiente]);
    }
});

/* Cada noche, pasada la medianoche (hora de Madrid), se regenera todo:
   la caché del día anterior ya no vale. */
add_action('init', function () {
    if (!wp_next_scheduled('jm_cache_calentar_diario')) {
        $manana = new DateTimeImmutable('tomorrow 00:05', wp_timezone());
        wp_schedule_event($manana->getTimestamp(), 'daily', 'jm_cache_calentar_diario');
    }
});
add_action('jm_cache_calentar_diario', function () {
    jm_cache_programar_calentado(1);
});
