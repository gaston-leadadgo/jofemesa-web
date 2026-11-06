<?php
/**
 * Accesibilidad y «Navegación agéntica» (Lighthouse 13).
 *
 * PageSpeed mide en «Navegación agéntica» que el árbol de accesibilidad
 * esté bien formado (lo que leen los lectores de pantalla y los agentes de
 * IA), la estabilidad visual y el llms.txt. Medido el 06/11/2026 con axe:
 *
 *   · link-name: el logo de la cabecera enlaza a Inicio con alt vacío, así
 *     que el enlace no tenía nombre.
 *   · aria-required-children: Elementor pone role="list" a la rejilla de
 *     sus Loop Grid / Loop Carousel, pero las tarjetas no son elementos de
 *     lista (son <article> o diapositivas de Swiper).
 *   · Sin región principal: el «Ir al contenido» del tema apuntaba a un
 *     #content que no existe y la página no tenía role="main".
 *   · Dos cabeceras (banner): la plantilla de cabecera y su contenedor.
 *
 * Todo se corrige al servir la página (jm_optimizar_html), sin tocar las
 * plantillas de Elementor, que siguen editándose igual.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* Logo sin alt → «JOFEMESA». También en el escritorio y en el editor. */
add_filter('wp_get_attachment_image_attributes', function ($attr, $adjunto) {
    if (empty($attr['alt']) && $adjunto && str_contains((string) get_attached_file($adjunto->ID), 'logo-jofemesa')) {
        $attr['alt'] = 'JOFEMESA · Alquiler de maquinaria';
    }
    return $attr;
}, 10, 2);

function jm_accesibilidad_html(string $html): string
{
    /* Enlace del logo: si aún llega con alt vacío (caché, otra imagen), se le
       da nombre al propio enlace. */
    $html = preg_replace(
        '#(<a href="(?:/|https?://[^"/]+/?)")(>\s*<img[^>]*alt=""[^>]*logo-jofemesa)#',
        '$1 aria-label="JOFEMESA · Inicio"$2',
        $html
    );
    $html = preg_replace('#(<img[^>]*logo-jofemesa[^>]*?)alt=""#', '$1alt="JOFEMESA · Alquiler de maquinaria"', $html);

    /* Rejillas de Loop: fuera role="list" (y role="listitem" en las tarjetas). */
    $html = preg_replace('#(class="[^"]*\belementor-loop-container\b[^"]*")\s+role="list"#', '$1', $html);
    $html = preg_replace('#(<[a-z]+ [^>]*\be-loop-item\b[^>]*?)\s+role="listitem"#', '$1', $html);

    /* Región principal: el contenido de la página (no cabecera ni pie). */
    if (!str_contains($html, 'role="main"') && !preg_match('#<main[\s>]#', $html)) {
        $html = preg_replace(
            '#<div data-elementor-type="(wp-page|wp-post|single-post|single-page|single|archive|search-results|error-404)"#',
            '<div id="content" role="main" tabindex="-1" data-elementor-type="$1"',
            $html,
            1
        );
    }

    /* Una sola cabecera: el contenedor <header> dentro de la plantilla de
       cabecera no es otra región. */
    if (str_contains($html, 'data-elementor-type="header"')) {
        $html = preg_replace('#<header class="elementor-element #', '<header role="none" class="elementor-element ', $html);
    }

    return $html;
}

/* ------------------------------------------------------------
   /llms.txt: resumen de la web para agentes de IA
   ------------------------------------------------------------ */

add_action('init', function () {
    $ruta = (string) wp_parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);
    if ($ruta !== '/llms.txt') {
        return;
    }
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: public, max-age=86400');
    echo jm_llms_txt();
    exit;
}, 0);

function jm_llms_txt(): string
{
    $u = static fn(string $r) => home_url($r);
    $l = [];
    $l[] = '# JOFEMESA · Alquiler de maquinaria';
    $l[] = '';
    $l[] = '> ' . wp_strip_all_tags((string) get_bloginfo('description')) . '. JOFEME S.A., alquiler de maquinaria desde ' . substr((string) jm_ajuste('fundacion'), 0, 4) . ': plataformas elevadoras, manutención de cargas, excavación y movimiento de tierras, energía e iluminación y aire comprimido. Venta de maquinaria y recambios, servicio técnico propio, transporte y formación homologada de operadores.';
    $l[] = '';
    $l[] = 'Teléfono: ' . jm_ajuste('telefono') . '. Para pedir disponibilidad o precio usa el formulario de consulta; no hay compra ni pago online.';
    $l[] = '';
    $l[] = '## Alquiler de maquinaria';
    $l[] = '';
    $l[] = '- [Catálogo completo](' . $u('/alquiler/') . '): todas las máquinas, con filtros por familia, altura, alimentación, uso y fabricante.';
    foreach (jm_datos('familias.json') as $f) {
        if (empty($f['total'])) {
            continue;
        }
        $l[] = '- [' . $f['nombre'] . '](' . $u('/alquiler/' . $f['slug'] . '/') . '): ' . wp_strip_all_tags((string) $f['descripcion']);
    }
    $l[] = '- [Consultar disponibilidad](' . $u('/consultar-disponibilidad/') . '): formulario para pedir una o varias máquinas, con fechas y lugar de la obra.';
    $l[] = '';
    $l[] = '## Formación';
    $l[] = '';
    $l[] = '- [Formación de operadores](' . $u('/formacion/') . '): cursos, calendario de convocatorias abiertas y sedes.';
    $l[] = '- [Solicitar formación](' . $u('/formacion/solicitar/') . '): formulario para pedir plaza o un curso a medida.';
    $l[] = '';
    $l[] = '## Empresa';
    $l[] = '';
    $l[] = '- [Servicios](' . $u('/servicios/') . '): venta de maquinaria y recambios, mantenimiento y taller, transporte y formación.';
    $l[] = '- [Delegaciones](' . $u('/delegaciones/') . '): direcciones, teléfonos y horarios de cada delegación.';
    $l[] = '- [Contacto](' . $u('/contacto/') . ')';
    return implode("\n", $l) . "\n";
}
