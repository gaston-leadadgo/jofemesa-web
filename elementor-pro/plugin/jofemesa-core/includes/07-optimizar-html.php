<?php
/**
 * Optimizaciones del HTML servido a visitantes (las llama jm_optimizar_html
 * en 77-cache-catalogo.php, así que quedan guardadas en la caché).
 *
 * Origen: informe de PageSpeed móvil de Inicio del 06/11/2026 (74 puntos):
 *   · «Solicitudes que bloquean el renderizado — 1.220 ms»: 22 hojas de
 *     estilo sueltas de Elementor y el tema, Google Fonts y jQuery.
 *   · «Mejorar la entrega de imágenes — 956 KiB»: tarjetas de 768 px
 *     pintadas a 280 px, logos de 2.000 px pintados a 120 px y la segunda
 *     portada del hero descargándose a la vez que la primera.
 *   · LCP 4,8 s: la foto del hero se descubría tarde.
 *
 * Nada de esto toca las plantillas: en Elementor todo se edita igual.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ------------------------------------------------------------
   1 · Hojas de estilo locales agrupadas en una
   ------------------------------------------------------------ */

/**
 * Las <link rel=stylesheet> locales de la cabecera, en tramos seguidos
 * (sin un <style> en medio, para no alterar el orden de la cascada), se
 * juntan en un archivo por tramo en uploads/jm-cache/css/. Las de media
 * distinto de «all» entran envueltas en su @media.
 */
function jm_combinar_css(string $html): string
{
    $fin = stripos($html, '</head>');
    if ($fin === false) {
        return $html;
    }
    $cabeza = substr($html, 0, $fin);
    if (!preg_match_all('#<link\b[^>]*\brel=[\'"]stylesheet[\'"][^>]*>|<style\b[^>]*>.*?</style>#is', $cabeza, $m, PREG_OFFSET_CAPTURE)) {
        return $html;
    }
    $inicio = home_url('/');
    $tramos = [];
    $actual = [];
    foreach ($m[0] as [$etiqueta, $pos]) {
        $local = null;
        if (stripos($etiqueta, '<link') === 0 && preg_match('#\bhref=[\'"]([^\'"]+)[\'"]#', $etiqueta, $h)) {
            $url = html_entity_decode($h[1]);
            if (str_starts_with($url, $inicio) || (str_starts_with($url, '/') && !str_starts_with($url, '//'))) {
                $media = preg_match('#\bmedia=[\'"]([^\'"]*)[\'"]#', $etiqueta, $md) ? trim($md[1]) : 'all';
                $local = ['tag' => $etiqueta, 'pos' => $pos, 'url' => $url, 'media' => $media === '' ? 'all' : $media];
            }
        }
        if ($local) {
            $actual[] = $local;
            continue;
        }
        if (count($actual) > 1) {
            $tramos[] = $actual;
        }
        $actual = [];
    }
    if (count($actual) > 1) {
        $tramos[] = $actual;
    }
    if (!$tramos) {
        return $html;
    }
    $dir = jm_cache_dir() . 'css/';
    $base_url = trailingslashit(wp_upload_dir()['baseurl']) . 'jm-cache/css/';
    /* De atrás hacia delante para que las posiciones sigan valiendo. */
    foreach (array_reverse($tramos) as $tramo) {
        $clave = md5(implode('|', array_column($tramo, 'url')));
        $archivo = $dir . $clave . '.css';
        if (!is_readable($archivo)) {
            $css = '';
            foreach ($tramo as $l) {
                $trozo = jm_css_local($l['url']);
                if ($trozo === null) {
                    continue 2; /* un archivo ilegible: este tramo se queda como está */
                }
                $css .= "/* " . basename((string) strtok($l['url'], '?')) . " */\n";
                $css .= $l['media'] === 'all' ? $trozo : '@media ' . $l['media'] . "{\n" . $trozo . "\n}";
                $css .= "\n";
            }
            wp_mkdir_p($dir);
            @file_put_contents($archivo . '.tmp', $css, LOCK_EX);
            @rename($archivo . '.tmp', $archivo);
        }
        $nueva = "<link rel='stylesheet' id='jm-agrupado-" . substr($clave, 0, 8) . "-css' href='" . esc_url($base_url . $clave . '.css?v=' . filemtime($archivo)) . "' media='all' />";
        $primero = $tramo[0];
        $ultimo = end($tramo);
        $desde = $primero['pos'];
        $hasta = $ultimo['pos'] + strlen($ultimo['tag']);
        /* Lo que hay entre los <link> (saltos de línea) se descarta; no hay
           otras etiquetas porque el tramo es seguido. */
        $entre = substr($html, $desde, $hasta - $desde);
        $resto = preg_replace('#<link\b[^>]*\brel=[\'"]stylesheet[\'"][^>]*>#i', '', $entre);
        if (trim($resto) !== '') {
            continue;
        }
        $html = substr($html, 0, $desde) . $nueva . substr($html, $hasta);
    }
    return $html;
}

/** Contenido de una hoja local con sus url() relativas hechas absolutas. */
function jm_css_local(string $url): ?string
{
    $ruta = (string) wp_parse_url($url, PHP_URL_PATH);
    $base = (string) wp_parse_url(home_url('/'), PHP_URL_PATH);
    $relativa = ltrim(substr($ruta, strlen(rtrim($base, '/'))), '/');
    $archivo = ABSPATH . $relativa;
    if (!str_ends_with($ruta, '.css') || !is_readable($archivo)) {
        return null;
    }
    $css = (string) file_get_contents($archivo);
    $css = preg_replace('#@charset\s+[^;]+;#i', '', $css);
    $carpeta = home_url(trailingslashit(dirname('/' . $relativa)));
    return preg_replace_callback('#url\(\s*([\'"]?)([^\'")]+)\1\s*\)#i', function ($u) use ($carpeta) {
        $r = trim($u[2]);
        if (preg_match('#^(data:|https?:|//|/|\#)#i', $r)) {
            return $u[0];
        }
        return 'url("' . $carpeta . $r . '")';
    }, $css);
}

/* ------------------------------------------------------------
   2 · Foto del hero: precarga; segunda portada, después
   ------------------------------------------------------------ */

function jm_precargar_hero(string $html): string
{
    if (!preg_match('#<img fetchpriority="high" [^>]*>#', $html, $m)) {
        return $html;
    }
    $tag = $m[0];
    if (!preg_match('#\bsrc="([^"]+)"#', $tag, $src) || str_ends_with($src[1], '.svg')) {
        return $html;
    }
    $attrs = ' href="' . $src[1] . '"';
    if (preg_match('#\bsrcset="([^"]+)"#', $tag, $ss)) {
        $attrs .= ' imagesrcset="' . $ss[1] . '"';
    }
    if (preg_match('#\bsizes="([^"]+)"#', $tag, $sz)) {
        $attrs .= ' imagesizes="' . $sz[1] . '"';
    }
    $precarga = '<link rel="preload" as="image"' . $attrs . ' fetchpriority="high">';
    return preg_replace('#(<head\b[^>]*>)#i', '$1' . $precarga, $html, 1);
}

/**
 * La portada de Formación del hero entra a los segundos: su imagen se
 * deja sin src hasta que la página ha cargado (00-nucleo.js la repone),
 * para que no compita con la primera, que es el LCP.
 */
function jm_diferir_segunda_portada(string $html): string
{
    $p = strpos($html, 'jm-hero__foto--formacion');
    $img = $p === false ? false : strpos($html, '<img ', $p);
    if ($img === false || $img - $p > 3000) {
        return $html;
    }
    $cierre = strpos($html, '>', $img);
    $tag = substr($html, $img, $cierre - $img + 1);
    $nuevo = preg_replace(['# src="#', '# srcset="#', '# sizes="#'], [' data-jm-src="', ' data-jm-srcset="', ' data-jm-sizes="'], $tag);
    $nuevo = str_replace('<img ', '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" ', $nuevo);
    return substr($html, 0, $img) . $nuevo . substr($html, $cierre + 1);
}

/* ------------------------------------------------------------
   3 · Cada imagen con el tamaño con que se pinta
   ------------------------------------------------------------ */

/**
 * `sizes` según dónde está la imagen (WordPress pone «100vw hasta el ancho
 * del archivo», así que el navegador elegía siempre la versión grande):
 *   · tarjetas de máquina (Loop Grid / carrusel) … ~280–440 px
 *   · logos de distribuidores (jm-partners__logo) … ~200 px
 *   · sellos y certificados (jm-sello) ………………… ~52 px
 *   · logos del carrusel de fabricantes ………………… ~120 px (el widget los
 *     pone a tamaño completo y sin srcset: se le añade el de la imagen)
 */
function jm_tamanos_imagenes(string $html): string
{
    if (!preg_match_all('#<img\b[^>]*>#', $html, $m, PREG_OFFSET_CAPTURE)) {
        return $html;
    }
    static $srcsets = [];
    $salida = '';
    $ultimo = 0;
    foreach ($m[0] as [$tag, $pos]) {
        $nuevo = $tag;
        $contexto = substr($html, max(0, $pos - 1200), min(1200, $pos));
        $clase = '';
        $c = strrpos($contexto, 'class="elementor-element ');
        if ($c !== false) {
            $fin = strpos($contexto, '"', $c + 7);
            $clase = substr($contexto, $c, $fin === false ? 200 : $fin - $c);
        }
        $sizes = null;
        if (str_contains($tag, 'swiper-slide-image') && !str_contains($tag, 'srcset=')) {
            if (preg_match('#\bsrc="([^"]+)"#', $tag, $s)) {
                if (!array_key_exists($s[1], $srcsets)) {
                    $id = attachment_url_to_postid($s[1]);
                    $srcsets[$s[1]] = $id ? (string) wp_get_attachment_image_srcset($id, 'full') : '';
                }
                if ($srcsets[$s[1]] !== '') {
                    $nuevo = str_replace('<img ', '<img srcset="' . esc_attr($srcsets[$s[1]]) . '" ', $nuevo);
                    $sizes = '140px';
                }
            }
        } elseif (!str_contains($tag, 'srcset=')) {
            $sizes = null;
        } elseif (str_contains($clase, 'jm-sello')) {
            $sizes = '64px';
        } elseif (str_contains($clase, 'jm-partners__logo')) {
            $sizes = '220px';
        } elseif (str_contains($tag, 'size-large') && jm_dentro_de_tarjeta($html, $pos)) {
            $sizes = '(max-width: 767px) calc(100vw - 64px), 400px';
        }
        if ($sizes !== null) {
            $nuevo = preg_match('#\bsizes="[^"]*"#', $nuevo)
                ? preg_replace('#\bsizes="[^"]*"#', 'sizes="' . $sizes . '"', $nuevo, 1)
                : str_replace('<img ', '<img sizes="' . $sizes . '" ', $nuevo);
        }
        $salida .= substr($html, $ultimo, $pos - $ultimo) . $nuevo;
        $ultimo = $pos + strlen($tag);
    }
    return $salida . substr($html, $ultimo);
}

/** ¿La posición cae dentro de una tarjeta de Loop (y no después de ella)? */
function jm_dentro_de_tarjeta(string $html, int $pos): bool
{
    $desde = max(0, $pos - 10000);
    $tramo = substr($html, $desde, $pos - $desde);
    $abre = strrpos($tramo, 'data-elementor-type="loop-item"');
    if ($abre === false) {
        return false;
    }
    $dentro = substr($tramo, $abre);
    return preg_match_all('#<div\b#', $dentro) >= preg_match_all('#</div\s*>#', $dentro);
}

/* ------------------------------------------------------------
   4 · Tamaño intermedio para las tarjetas (600 px)
   ------------------------------------------------------------ */

/* WordPress solo tenía 300 y 768 px: un móvil (tarjeta de ~330 px a
   densidad 1,75) acababa siempre en la de 768. Con 600 px descarga la
   mitad. Las fotos ya subidas se completan solas en segundo plano. */
add_action('after_setup_theme', function () {
    add_image_size('jm-tarjeta', 600, 600, false);
});

function jm_tamanos_pendientes(int $limite): array
{
    global $wpdb;
    $ids = $wpdb->get_col(
        "SELECT DISTINCT pm.meta_value FROM {$wpdb->postmeta} pm
         JOIN {$wpdb->posts} p ON p.ID = pm.post_id
         WHERE pm.meta_key = '_thumbnail_id' AND p.post_type = 'maquina' AND p.post_status = 'publish'"
    );
    $pendientes = [];
    foreach ($ids as $id) {
        $meta = wp_get_attachment_metadata((int) $id);
        if (is_array($meta) && empty($meta['sizes']['jm-tarjeta']) && (int) ($meta['width'] ?? 0) > 600) {
            $pendientes[] = (int) $id;
            if (count($pendientes) >= $limite) {
                break;
            }
        }
    }
    return $pendientes;
}

add_action('jm_generar_tamanos', function () {
    if (function_exists('set_time_limit')) {
        @set_time_limit(120);
    }
    require_once ABSPATH . 'wp-admin/includes/image.php';
    $tanda = jm_tamanos_pendientes(8);
    foreach ($tanda as $id) {
        wp_update_image_subsizes($id);
        usleep(300000);
    }
    if ($tanda) {
        wp_schedule_single_event(time() + 30, 'jm_generar_tamanos');
    } else {
        update_option('jm_tamanos_hechos', JM_VERSION, false);
        jm_cache_marcar(); /* las páginas vuelven a generarse con el srcset nuevo */
    }
});

add_action('admin_init', function () {
    if (get_option('jm_tamanos_hechos') !== JM_VERSION && !wp_next_scheduled('jm_generar_tamanos')) {
        wp_schedule_single_event(time() + 10, 'jm_generar_tamanos');
    }
});

/* ------------------------------------------------------------
   5 · JavaScript de Elementor diferido hasta el primer gesto
   ------------------------------------------------------------ */

/**
 * PageSpeed móvil de Inicio (06/11/2026, 66 puntos): «Total Blocking Time
 * 810 ms». Lo que bloquea es evaluar ~600 KB de JS en el móvil emulado:
 * jQuery, Elementor y Elementor Pro, Swiper y el motor del asesor. Nada de
 * eso hace falta para PINTAR la página (el HTML ya llega completo desde la
 * caché): solo para menús, carruseles, formularios y el asesor.
 *
 * Esos scripts se sirven con type="jm/diferido" (el navegador no los
 * descarga ni ejecuta) y un cargador los ejecuta, en su orden original, al
 * primer gesto del visitante: mover el ratón, tocar, desplazarse o teclear.
 * El clic que despertó la carga (p. ej. el botón del menú móvil) se repite
 * cuando Elementor ya está listo.
 *
 * Se quedan como están: los datos JSON, las reglas de precarga, el núcleo
 * del plugin (jm.min.js, que pinta el hero, el revelado, el catálogo y el
 * calendario sin depender de jQuery) y el script de fondos diferidos de
 * Elementor. Solo afecta a la página que ve el visitante: en el escritorio
 * y en el editor no se toca nada.
 */
function jm_diferir_js(string $html): string
{
    if (!str_contains($html, 'elementor-frontend-js') || str_contains($html, 'jm/diferido')) {
        return $html;
    }
    $n = 0;
    $html = preg_replace_callback('#<script\b([^>]*)>(.*?)</script>#is', function ($m) use (&$n) {
        $attrs = $m[1];
        $cuerpo = $m[2];
        if (preg_match('#\btype=[\'"]([^\'"]+)[\'"]#i', $attrs, $t) && !in_array(strtolower($t[1]), ['text/javascript', 'application/javascript'], true)) {
            return $m[0]; /* JSON, ld+json, speculationrules… */
        }
        $conservar = str_contains($attrs, 'jofemesa-core/assets/dist/jm.min.js')
            || str_contains($attrs, 'jofemesa-core/assets/js/00-nucleo.js')
            || str_contains($attrs, 'id="jm-00-nucleo-js-extra"')
            || str_contains($cuerpo, 'data-motor')
            || str_contains($cuerpo, 'lazyloadRunObserver');
        if ($conservar) {
            return $m[0];
        }
        $n++;
        $attrs = preg_replace('#\s+type=[\'"][^\'"]*[\'"]#i', '', $attrs);
        return '<script type="jm/diferido"' . $attrs . '>' . $cuerpo . '</script>';
    }, $html);
    if (!$n) {
        return $html;
    }

    $cargador = <<<'JS'
(function(){var G=["keydown","mousedown","mousemove","touchstart","pointerdown","wheel","scroll","focusin"],o={passive:true,capture:true},e=0,C=[];
function quitar(){G.forEach(function(g){window.removeEventListener(g,ir,o);});}
function clic(v){if(e===2)return;var t=v.target,a=t&&t.closest?t.closest("a[href]"):null;if(a){var h=a.getAttribute("href")||"";if(h.charAt(0)!=="#"&&h.indexOf("javascript:")!==0)return;}v.preventDefault();v.stopImmediatePropagation();if(C.indexOf(t)<0)C.push(t);}
function fin(){e=2;document.removeEventListener("click",clic,true);var j=window.jQuery;if(j){j(function(){setTimeout(function(){j(window).trigger("load");},0);});}document.dispatchEvent(new CustomEvent("jm:js-diferido"));setTimeout(function(){C.forEach(function(t){if(t.isConnected)t.click();});C=[];},350);}
function ir(){if(e)return;e=1;quitar();document.addEventListener("click",clic,true);var L=Array.prototype.slice.call(document.querySelectorAll('script[type="jm/diferido"]'));
(function sig(){var v=L.shift();if(!v){fin();return;}var s=document.createElement("script");Array.prototype.forEach.call(v.attributes,function(a){if(a.name!=="type")s.setAttribute(a.name,a.value);});
if(v.src){s.async=false;s.onload=s.onerror=sig;v.parentNode.replaceChild(s,v);}else{s.text=v.text;v.parentNode.replaceChild(s,v);sig();}})();}
G.forEach(function(g){window.addEventListener(g,ir,o);});
document.addEventListener("click",function(v){if(!e){ir();clic(v);}},true);
if(location.hash&&location.hash.length>1)ir();})();
JS;
    $fin = strripos($html, '</body>');
    $script = '<script id="jm-cargador-js">' . $cargador . "</script>\n";
    return $fin === false ? $html . $script : substr_replace($html, $script, $fin, 0);
}
