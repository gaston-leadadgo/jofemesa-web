<?php
/**
 * Cabecera, pie y elementos globales.
 *
 * Traducción de src/components/layout/{Header,Footer,BarraMovil,
 * DesplegableDelegaciones,DesplegableTelefonos}.tsx y de
 * src/components/marca/{ContadorFundacion,Antiguedad,RedesSociales}.tsx.
 *
 * Shortcodes (se colocan con el widget Shortcode; ver estructura/01, 02 y 04):
 *   [jm_contador_fundacion]                     Contador «años · meses · días» de la franja.
 *   [jm_antiguedad]                             «39 años · 6 meses · 19 días» en línea.
 *   [jm_desplegable_delegaciones]               Botón «Delegaciones» + panel (franja superior).
 *   [jm_desplegable_telefonos variante="panel|lista"]
 *                                               Teléfono de la cabecera con todos los números;
 *                                               «lista» = el <details> «Llamar a una delegación»
 *                                               del menú móvil.
 *   [jm_redes tamano="18" variante="pie|movil|franja"]
 *   [jm_dato clave="telefono|tel|email|lema|razon_social|cif|fundacion|fundacion_fecha|anios|anio|domicilio|nombre|web"]
 *   [jm_tel texto="" clase=""]                  Enlace tel: con el teléfono principal.
 *   [jm_delegaciones_pie]                       Delegaciones y sede con teléfono (pie).
 *   [jm_certificados]                           Certificados, homologaciones y afiliaciones (pie).
 *   [jm_menu_familias variante="panel|movil"]   Las familias con icono (desplegable de Alquiler).
 *   [jm_nav_movil menu=""]                      Navegación del panel móvil (menú de WP «jm-principal»).
 *   [jm_boton_menu]                             Hamburguesa que abre el panel #menu-movil.
 *   [jm_barra_movil]                            Barra fija inferior (además se imprime sola en wp_footer).
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ------------------------------------------------------------
   Ubicación de menú: el panel móvil lee de aquí
   ------------------------------------------------------------ */

add_action('after_setup_theme', function () {
    register_nav_menus([
        'jm-principal' => 'JOFEMESA · Menú principal (panel móvil)',
    ]);
});

/* ------------------------------------------------------------
   Iconos de interfaz (trazos de Lucide, los mismos que la web Next)
   ------------------------------------------------------------ */

function jm_icono_ui(string $nombre, float $tamano = 16, float $trazo = 2, string $clase = ''): string
{
    $trazos = [
        'telefono'  => '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
        'llave'     => '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>',
        'mensaje'   => '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',
        'pin'       => '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
        'chevron'   => '<path d="m6 9 6 6 6-6"/>',
        'flecha'    => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'menu'      => '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
        'cerrar'    => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        'correo'    => '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
    ];
    if (!isset($trazos[$nombre])) {
        return '';
    }
    return sprintf(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="%1$s" height="%1$s" fill="none" stroke="currentColor" stroke-width="%2$s" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"%3$s>%4$s</svg>',
        esc_attr((string) $tamano),
        esc_attr((string) $trazo),
        $clase ? ' class="' . esc_attr($clase) . '"' : '',
        $trazos[$nombre]
    );
}

/* ------------------------------------------------------------
   Datos: empresa, puntos de contacto, centros y familias
   ------------------------------------------------------------ */

function jm_empresa(): array
{
    return jm_datos('empresa.json');
}

/** Fecha de fundación (Y-m-d) del ajuste, validada. */
function jm_fundacion_iso(): string
{
    $iso = (string) jm_ajuste('fundacion');
    return preg_match('/^\d{4}-\d{2}-\d{2}$/', $iso) ? $iso : '1987-03-24';
}

/**
 * Delegaciones + sede de formación, en el orden de `jm_orden`.
 * Cada punto: id, nombre, localidad, telefono, tel, pais, central, sede.
 * Si no hay entradas `delegacion`, cae a empresa.json (puntosContacto)
 * y, si tampoco, a delegaciones.json + sedeFormacion.
 */
function jm_puntos_contacto(): array
{
    static $cache = null;
    if ($cache !== null) {
        return $cache;
    }
    $puntos = [];

    if (post_type_exists('delegacion')) {
        $q = new WP_Query([
            'post_type'      => 'delegacion',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'no_found_rows'  => true,
            'meta_query'     => [
                'relation' => 'OR',
                'orden'    => ['key' => 'jm_orden', 'type' => 'NUMERIC'],
                'sin'      => ['key' => 'jm_orden', 'compare' => 'NOT EXISTS'],
            ],
            'orderby'        => ['orden' => 'ASC', 'menu_order' => 'ASC', 'title' => 'ASC'],
        ]);
        foreach ($q->posts as $p) {
            $m = static fn($k) => (string) get_post_meta($p->ID, $k, true);
            $tipo = $m('jm_tipo');
            $telefono = $m('jm_telefono');
            $puntos[] = [
                'id'        => $p->post_name,
                'nombre'    => get_the_title($p),
                'localidad' => $m('jm_localidad'),
                'telefono'  => $telefono,
                'tel'       => $m('jm_tel') ?: ($telefono ? jm_tel($telefono) : ''),
                'pais'      => $m('jm_pais') ?: 'España',
                'central'   => in_array(strtolower($m('jm_central')), ['1', 'true', 'si', 'sí', 'yes'], true),
                'sede'      => (bool) preg_match('/sede|formaci/i', $tipo),
            ];
        }
        wp_reset_postdata();
    }

    if (!$puntos) {
        $e = jm_empresa();
        $origen = $e['puntosContacto'] ?? [];
        if (!$origen) {
            $origen = jm_datos('delegaciones.json');
            if (!empty($e['sedeFormacion'])) {
                $origen[] = $e['sedeFormacion'];
            }
        }
        foreach ($origen as $d) {
            $puntos[] = [
                'id'        => (string) ($d['id'] ?? ''),
                'nombre'    => (string) ($d['nombre'] ?? ''),
                'localidad' => (string) ($d['localidad'] ?? ''),
                'telefono'  => (string) ($d['telefono'] ?? ''),
                'tel'       => (string) ($d['tel'] ?? ''),
                'pais'      => (string) ($d['pais'] ?? 'España'),
                'central'   => !empty($d['central']),
                'sede'      => !empty($d['tipo']),
            ];
        }
    }

    $cache = $puntos;
    return $cache;
}

/** Centros que no son delegación (distribuidor Takeuchi). Solo en empresa.json. */
function jm_centros(): array
{
    return jm_empresa()['centros'] ?? [];
}

/**
 * Las seis familias (términos raíz de `familia`, por `jm_orden`), con
 * nombre, url, icono, total y rango. Sin términos, cae a familias.json.
 */
function jm_familias_lista(): array
{
    static $cache = null;
    if ($cache !== null) {
        return $cache;
    }
    $lista = [];
    if (taxonomy_exists('familia')) {
        $terminos = get_terms([
            'taxonomy'   => 'familia',
            'parent'     => 0,
            'hide_empty' => false,
            'meta_key'   => 'jm_orden',
            'orderby'    => 'meta_value_num',
            'order'      => 'ASC',
        ]);
        if (!is_wp_error($terminos)) {
            foreach ($terminos as $t) {
                $url = get_term_link($t);
                $total = get_term_meta($t->term_id, 'jm_total', true);
                $lista[] = [
                    'nombre' => $t->name,
                    'url'    => is_wp_error($url) ? home_url('/alquiler/' . $t->slug . '/') : $url,
                    'icono'  => (string) get_term_meta($t->term_id, 'jm_icono', true),
                    'total'  => $total !== '' ? (int) $total : (int) $t->count,
                    'rango'  => (string) get_term_meta($t->term_id, 'jm_rango', true),
                ];
            }
        }
    }
    if (!$lista) {
        foreach (jm_datos('familias.json') as $f) {
            $lista[] = [
                'nombre' => (string) ($f['nombre'] ?? ''),
                'url'    => home_url('/alquiler/' . ($f['slug'] ?? '') . '/'),
                'icono'  => (string) ($f['icono'] ?? ''),
                'total'  => (int) ($f['total'] ?? 0),
                'rango'  => (string) ($f['rango'] ?? ''),
            ];
        }
    }
    $cache = $lista;
    return $cache;
}

function jm_icono_familia(string $icono, string $clase): string
{
    $svg = $icono ? jm_svg('maquina-' . $icono, $clase) : '';
    return $svg ?: '<span class="' . esc_attr($clase) . '" aria-hidden="true"></span>';
}

function jm_insignia(string $texto, string $variante = 'central'): string
{
    return '<span class="jm-insignia jm-insignia--' . esc_attr($variante) . '">' . esc_html($texto) . '</span>';
}

/* ------------------------------------------------------------
   [jm_contador_fundacion] y [jm_antiguedad]
   ------------------------------------------------------------ */

/** Años, meses y días desde la fundación (mismas reglas que antiguedad.ts). */
function jm_desglose_fundacion(): array
{
    [$a, $m, $d] = array_map('intval', explode('-', jm_fundacion_iso()));
    $hoy = current_datetime();
    $anios = (int) $hoy->format('Y') - $a;
    $meses = (int) $hoy->format('n') - $m;
    $dias = (int) $hoy->format('j') - $d;
    if ($dias < 0) {
        $meses -= 1;
        $dias += (int) $hoy->modify('last day of previous month')->format('j');
    }
    if ($meses < 0) {
        $anios -= 1;
        $meses += 12;
    }
    return ['anios' => $anios, 'meses' => $meses, 'dias' => $dias];
}

function jm_sc_contador_fundacion(): string
{
    $iso = jm_fundacion_iso();
    /* Como en Next, el HTML lleva la frase fija y la cuenta la pinta el
       navegador con SU fecha: la página puede venir de una caché. */
    return '<p class="jm-contador jm-meta" data-jm="contador-fundacion" data-fundacion="' . esc_attr($iso) . '">'
        . '<span class="jm-contador__pulso" aria-hidden="true"><span class="jm-contador__onda"></span><span class="jm-contador__punto"></span></span>'
        . '<span class="jm-contador__texto">Especialistas en maquinaria desde ' . esc_html(substr($iso, 0, 4)) . '</span>'
        . '</p>';
}
add_shortcode('jm_contador_fundacion', 'jm_sc_contador_fundacion');

function jm_sc_antiguedad($atts = []): string
{
    $atts = shortcode_atts(['clase' => ''], $atts, 'jm_antiguedad');
    $anios = jm_desglose_fundacion()['anios'];
    return '<span class="jm-antiguedad ' . esc_attr($atts['clase']) . '" data-jm="antiguedad" data-fundacion="' . esc_attr(jm_fundacion_iso()) . '">'
        . esc_html($anios . ' años') . '</span>';
}
add_shortcode('jm_antiguedad', 'jm_sc_antiguedad');

/* ------------------------------------------------------------
   [jm_desplegable_delegaciones]
   ------------------------------------------------------------ */

function jm_sc_desplegable_delegaciones(): string
{
    static $n = 0;
    $n++;
    $id = 'jm-panel-delegaciones-' . $n;
    $puntos = jm_puntos_contacto();
    $delegaciones = array_filter($puntos, static fn($p) => !$p['sede']);
    $sedes = array_filter($puntos, static fn($p) => $p['sede']);
    $espana = array_filter($puntos, static fn($p) => $p['pais'] !== 'Portugal');
    $portugal = array_filter($puntos, static fn($p) => $p['pais'] === 'Portugal');

    $titulo = count($delegaciones) . ' delegaciones' . (count($sedes) === 1 ? ' y una sede de formación' : '');
    $url = home_url('/delegaciones/');

    $grupo = static function (string $nombre, array $lista, string $extra = '') use ($url): string {
        if (!$lista) {
            return '';
        }
        $html = '<div class="jm-panel-delegaciones__grupo' . ($extra ? ' ' . esc_attr($extra) : '') . '">'
            . '<p class="jm-meta jm-panel-delegaciones__pais">' . esc_html($nombre) . '</p><ul class="jm-panel-delegaciones__lista">';
        foreach ($lista as $d) {
            $html .= '<li class="jm-panel-delegaciones__item">'
                . jm_icono_ui('pin', 15, 2, 'jm-panel-delegaciones__pin')
                . '<div class="jm-panel-delegaciones__datos">'
                . '<a class="jm-panel-delegaciones__nombre" href="' . esc_url($url . '#' . $d['id']) . '">' . esc_html($d['nombre'])
                . ($d['central'] ? jm_insignia('Central') : '')
                . ($d['sede'] ? jm_insignia('Sede', 'sede') : '')
                . '</a>';
            if ($d['localidad'] && $d['localidad'] !== $d['nombre']) {
                $html .= '<p class="jm-panel-delegaciones__localidad">' . esc_html($d['localidad']) . '</p>';
            }
            if ($d['tel']) {
                $html .= '<a class="jm-value jm-panel-delegaciones__tel" href="' . esc_attr('tel:' . $d['tel']) . '">'
                    . jm_icono_ui('telefono', 12, 2) . esc_html($d['telefono']) . '</a>';
            }
            $html .= '</div></li>';
        }
        return $html . '</ul></div>';
    };

    return '<div class="jm-desplegable jm-desplegable--delegaciones" data-jm="desplegable">'
        . '<button type="button" class="jm-desplegable__boton jm-delegaciones__boton jm-label-sm" data-jm-boton aria-expanded="false" aria-controls="' . esc_attr($id) . '">'
        . jm_icono_ui('pin', 14, 2, 'jm-delegaciones__pin') . 'Delegaciones'
        . jm_icono_ui('chevron', 13, 2.25, 'jm-desplegable__chevron')
        . '</button>'
        . '<div id="' . esc_attr($id) . '" class="jm-desplegable__panel jm-panel-delegaciones" data-jm-panel hidden>'
        . '<div class="jm-panel-delegaciones__cab"><p class="jm-panel-delegaciones__titulo">' . esc_html($titulo) . '</p>'
        . '<a class="jm-panel-delegaciones__mapa" href="' . esc_url($url) . '">Ver mapa y direcciones' . jm_icono_ui('flecha', 14, 2.25) . '</a></div>'
        . '<div class="jm-panel-delegaciones__cuerpo">'
        . $grupo('España', $espana)
        . $grupo('Portugal', $portugal, 'jm-panel-delegaciones__grupo--sep')
        . '</div></div></div>';
}
add_shortcode('jm_desplegable_delegaciones', 'jm_sc_desplegable_delegaciones');

/* ------------------------------------------------------------
   [jm_desplegable_telefonos variante="panel|lista"]
   ------------------------------------------------------------ */

function jm_fila_telefono(string $tel, string $visible, string $nombre, string $detalle = '', bool $central = false): string
{
    return '<a class="jm-telefonos__fila" href="' . esc_attr('tel:' . $tel) . '">'
        . '<span class="jm-telefonos__quien"><span class="jm-telefonos__nombre">' . esc_html($nombre) . '</span>'
        . ($central ? jm_insignia('Central') : '')
        . ($detalle ? '<span class="jm-telefonos__detalle">' . esc_html($detalle) . '</span>' : '')
        . '</span><span class="jm-value jm-telefonos__numero-fila">' . esc_html($visible) . '</span></a>';
}

function jm_sc_desplegable_telefonos($atts = []): string
{
    $atts = shortcode_atts(['variante' => 'panel'], $atts, 'jm_desplegable_telefonos');
    $puntos = array_filter(jm_puntos_contacto(), static fn($p) => $p['tel'] !== '');

    /* Variante «lista»: el <details> del menú móvil. Nativo, funciona sin
       JavaScript y no roba altura al menú hasta que se abre. */
    if ($atts['variante'] === 'lista') {
        $html = '<details class="jm-llamar"><summary class="jm-llamar__resumen">'
            . jm_icono_ui('telefono', 18, 1.75) . 'Llamar a una delegación'
            . jm_icono_ui('chevron', 16, 2.25, 'jm-llamar__chevron') . '</summary><ul class="jm-llamar__lista">';
        foreach ($puntos as $d) {
            $html .= '<li><a class="jm-llamar__fila" href="' . esc_attr('tel:' . $d['tel']) . '">'
                . '<span class="jm-llamar__nombre">' . esc_html($d['nombre']) . ($d['central'] ? jm_insignia('Central') : '') . '</span>'
                . '<span class="jm-value jm-llamar__numero">' . esc_html($d['telefono']) . '</span></a></li>';
        }
        return $html . '</ul></details>';
    }

    static $n = 0;
    $n++;
    $id = 'jm-panel-telefonos-' . $n;
    $principal = (string) jm_ajuste('telefono');

    $html = '<div class="jm-desplegable jm-desplegable--telefonos" data-jm="desplegable" data-cierra-menu>'
        . '<button type="button" class="jm-desplegable__boton jm-telefonos__boton" data-jm-boton aria-expanded="false" aria-controls="' . esc_attr($id) . '"'
        . ' aria-label="' . esc_attr('Teléfonos de las delegaciones. Central: ' . $principal) . '">'
        . jm_icono_ui('telefono', 18, 1.75)
        . '<span class="jm-value jm-telefonos__numero">' . esc_html($principal) . '</span>'
        . jm_icono_ui('chevron', 14, 2.25, 'jm-desplegable__chevron jm-telefonos__chevron')
        . '</button>'
        . '<div id="' . esc_attr($id) . '" class="jm-desplegable__panel jm-panel-telefonos" data-jm-panel hidden>'
        . '<p class="jm-panel-telefonos__titulo">¿A qué delegación llamas?</p>'
        . '<div class="jm-panel-telefonos__cuerpo"><ul>';

    $sede = null;
    foreach ($puntos as $d) {
        if ($d['sede']) {
            $sede = $sede ?: $d;
            continue;
        }
        $html .= '<li>' . jm_fila_telefono($d['tel'], $d['telefono'], $d['nombre'], $d['pais'] === 'Portugal' ? 'Portugal' : '', $d['central']) . '</li>';
    }
    $html .= '</ul><p class="jm-meta jm-panel-telefonos__otros">Otros centros</p><ul>';

    $tel_formacion = $sede ? $sede['telefono'] : (string) jm_ajuste('telefono_formacion');
    if ($tel_formacion) {
        $html .= '<li>' . jm_fila_telefono($sede ? $sede['tel'] : jm_tel($tel_formacion), $tel_formacion, 'Formación', 'Sede · cursos') . '</li>';
    }
    foreach (jm_centros() as $c) {
        if (empty($c['telefono'])) {
            continue;
        }
        $html .= '<li>' . jm_fila_telefono((string) ($c['tel'] ?? jm_tel($c['telefono'])), (string) $c['telefono'], (string) $c['nombre']) . '</li>';
    }
    return $html . '</ul></div></div></div>';
}
add_shortcode('jm_desplegable_telefonos', 'jm_sc_desplegable_telefonos');

/* ------------------------------------------------------------
   [jm_redes tamano="18" variante="pie"]
   ------------------------------------------------------------ */

function jm_sc_redes($atts = []): string
{
    $atts = shortcode_atts(['tamano' => '15', 'variante' => 'pie'], $atts, 'jm_redes');
    $tam = max(10, min(48, (int) $atts['tamano']));
    $redes = [
        'linkedin'  => ['LinkedIn', '<path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>'],
        'facebook'  => ['Facebook', '<path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>'],
        'instagram' => ['Instagram', '<g fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.3"/><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none"/></g>'],
    ];
    $items = '';
    foreach ($redes as $clave => [$nombre, $dibujo]) {
        $url = (string) jm_ajuste($clave);
        if ($url === '') {
            continue;
        }
        $items .= '<li><a class="jm-redes__enlace" href="' . esc_url($url) . '" target="_blank" rel="noopener noreferrer"'
            . ' aria-label="' . esc_attr('JOFEMESA en ' . $nombre . ' (se abre en una pestaña nueva)') . '" title="' . esc_attr($nombre) . '">'
            . '<svg viewBox="0 0 24 24" width="' . $tam . '" height="' . $tam . '" aria-hidden="true" focusable="false">' . $dibujo . '</svg></a></li>';
    }
    if ($items === '') {
        return '';
    }
    return '<ul class="jm-redes jm-redes--' . esc_attr(sanitize_html_class($atts['variante'])) . '" aria-label="Redes sociales de JOFEMESA">' . $items . '</ul>';
}
add_shortcode('jm_redes', 'jm_sc_redes');

/* ------------------------------------------------------------
   [jm_dato clave="…"] y [jm_tel]
   ------------------------------------------------------------ */

function jm_sc_dato($atts = []): string
{
    $atts = shortcode_atts(['clave' => ''], $atts, 'jm_dato');
    $e = jm_empresa();
    $emp = $e['empresa'] ?? [];
    $iso = jm_fundacion_iso();
    switch ($atts['clave']) {
        case 'telefono':
            $v = jm_ajuste('telefono');
            break;
        case 'tel':
            $v = jm_tel((string) jm_ajuste('telefono'));
            break;
        case 'email':
            $v = jm_ajuste('email');
            break;
        case 'lema':
            $v = $e['lema'] ?? '';
            break;
        case 'razon_social':
            $v = $emp['razonSocial'] ?? '';
            break;
        case 'cif':
            $v = $emp['cif'] ?? '';
            break;
        case 'fundacion':
            $v = substr($iso, 0, 4);
            break;
        case 'fundacion_fecha':
            $v = implode('/', array_reverse(explode('-', $iso)));
            break;
        case 'anios':
            $v = jm_desglose_fundacion()['anios'];
            break;
        case 'anio':
            $v = wp_date('Y');
            break;
        case 'domicilio':
            $v = $emp['domicilioSocial'] ?? '';
            break;
        case 'nombre':
            $v = $emp['nombre'] ?? 'JOFEMESA';
            break;
        case 'web':
            $v = $emp['web'] ?? '';
            break;
        default:
            $v = '';
    }
    return esc_html((string) $v);
}
add_shortcode('jm_dato', 'jm_sc_dato');

function jm_sc_tel($atts = []): string
{
    $atts = shortcode_atts(['texto' => '', 'clase' => ''], $atts, 'jm_tel');
    $visible = (string) jm_ajuste('telefono');
    return '<a class="jm-tel ' . esc_attr($atts['clase']) . '" href="' . esc_attr('tel:' . jm_tel($visible)) . '">'
        . esc_html($atts['texto'] !== '' ? $atts['texto'] : $visible) . '</a>';
}
add_shortcode('jm_tel', 'jm_sc_tel');

/* ------------------------------------------------------------
   Pie: [jm_delegaciones_pie] y [jm_certificados]
   ------------------------------------------------------------ */

function jm_sc_delegaciones_pie(): string
{
    $html = '<ul class="jm-pie-delegaciones">';
    foreach (jm_puntos_contacto() as $d) {
        $abre = $d['tel'] ? '<a class="jm-pie-delegaciones__enlace" href="' . esc_attr('tel:' . $d['tel']) . '">' : '<span class="jm-pie-delegaciones__enlace">';
        $cierra = $d['tel'] ? '</a>' : '</span>';
        $html .= '<li class="jm-pie-delegaciones__item">' . $abre
            . '<span class="jm-pie-delegaciones__nombre">' . esc_html($d['nombre']) . '</span>'
            . ($d['telefono'] ? '<span class="jm-value jm-pie-delegaciones__tel">' . jm_icono_ui('telefono', 12, 2) . esc_html($d['telefono']) . '</span>' : '')
            . $cierra . '</li>';
    }
    return $html . '</ul>';
}
add_shortcode('jm_delegaciones_pie', 'jm_sc_delegaciones_pie');

function jm_sc_certificados(): string
{
    $e = jm_empresa();
    $todos = array_merge($e['certificaciones'] ?? [], $e['homologaciones'] ?? [], $e['afiliaciones'] ?? []);
    if (!$todos) {
        return '';
    }
    $html = '<ul class="jm-certificados">';
    foreach ($todos as $c) {
        $html .= '<li class="jm-value jm-certificados__item" title="' . esc_attr($c['descripcion'] ?? '') . '">' . esc_html($c['nombre'] ?? '') . '</li>';
    }
    return $html . '</ul>';
}
add_shortcode('jm_certificados', 'jm_sc_certificados');

/* ------------------------------------------------------------
   [jm_menu_familias variante="panel|movil"]
   ------------------------------------------------------------ */

function jm_sc_menu_familias($atts = []): string
{
    $atts = shortcode_atts(['variante' => 'panel'], $atts, 'jm_menu_familias');
    $familias = jm_familias_lista();
    if (!$familias) {
        return '';
    }
    if ($atts['variante'] === 'movil') {
        $html = '<ul class="jm-familias-movil">';
        foreach ($familias as $f) {
            $html .= '<li><a class="jm-familias-movil__enlace" href="' . esc_url($f['url']) . '">'
                . jm_icono_familia($f['icono'], 'jm-familias-movil__icono') . esc_html($f['nombre']) . '</a></li>';
        }
        return $html . '</ul>';
    }
    $html = '<ul class="jm-familias-menu">';
    foreach ($familias as $f) {
        $detalle = $f['total'] . ' referencias' . ($f['rango'] ? ' · ' . $f['rango'] : '');
        $html .= '<li class="jm-familias-menu__item"><a class="jm-familias-menu__enlace" href="' . esc_url($f['url']) . '">'
            . jm_icono_familia($f['icono'], 'jm-familias-menu__icono')
            . '<span class="jm-familias-menu__texto"><span class="jm-familias-menu__nombre">' . esc_html($f['nombre']) . '</span>'
            . '<span class="jm-label-sm jm-familias-menu__detalle">' . esc_html($detalle) . '</span></span></a></li>';
    }
    return $html . '</ul>';
}
add_shortcode('jm_menu_familias', 'jm_sc_menu_familias');

/* ------------------------------------------------------------
   [jm_nav_movil] y [jm_boton_menu]
   ------------------------------------------------------------ */

/** Estructura por defecto del panel móvil (la de Header.tsx). */
function jm_nav_movil_por_defecto(): array
{
    $hijos = [];
    foreach (jm_familias_lista() as $f) {
        $hijos[] = ['titulo' => $f['nombre'], 'url' => $f['url'], 'icono' => $f['icono']];
    }
    $i = static fn($t, $u, $flecha = true, $h = []) => ['titulo' => $t, 'url' => home_url($u), 'flecha' => $flecha, 'hijos' => $h];
    return [
        $i('Inicio', '/'),
        $i('Alquiler', '/alquiler/', true, $hijos),
        $i('Servicios', '/servicios/'),
        $i('Formación', '/formacion/'),
        $i('Contacto', '/contacto/'),
        $i('Delegaciones', '/delegaciones/'),
        $i('¿Qué máquina necesito?', '/asesor/', false),
        $i('Comparador', '/comparador/', false),
    ];
}

/** Lee el menú de WordPress y lo deja en la misma forma que el de defecto. */
function jm_nav_movil_desde_menu(string $menu = ''): array
{
    $menu_id = 0;
    if ($menu !== '') {
        $obj = wp_get_nav_menu_object($menu);
        $menu_id = $obj ? (int) $obj->term_id : 0;
    } else {
        $ubicaciones = get_nav_menu_locations();
        $menu_id = (int) ($ubicaciones['jm-principal'] ?? 0);
    }
    $items = $menu_id ? wp_get_nav_menu_items($menu_id) : [];
    if (!$items) {
        return [];
    }
    $raiz = [];
    $hijos = [];
    foreach ($items as $it) {
        if ((int) $it->menu_item_parent === 0) {
            $raiz[] = $it;
        } else {
            $hijos[(int) $it->menu_item_parent][] = $it;
        }
    }
    $salida = [];
    foreach ($raiz as $it) {
        $clases = array_filter((array) $it->classes);
        $sub = [];
        foreach ($hijos[(int) $it->ID] ?? [] as $h) {
            $icono = ($h->type === 'taxonomy' && $h->object === 'familia') ? (string) get_term_meta((int) $h->object_id, 'jm_icono', true) : '';
            $sub[] = ['titulo' => $h->title, 'url' => $h->url, 'icono' => $icono];
        }
        $salida[] = [
            'titulo' => $it->title,
            'url'    => $it->url,
            'flecha' => !in_array('jm-sin-flecha', $clases, true),
            'hijos'  => $sub,
        ];
    }
    return $salida;
}

function jm_sc_nav_movil($atts = []): string
{
    $atts = shortcode_atts(['menu' => ''], $atts, 'jm_nav_movil');
    $items = jm_nav_movil_desde_menu((string) $atts['menu']) ?: jm_nav_movil_por_defecto();
    $html = '<nav class="jm-nav-movil" aria-label="Navegación principal"><ul class="jm-nav-movil__lista">';
    foreach ($items as $it) {
        $html .= '<li><a class="jm-nav-movil__enlace' . ($it['flecha'] ? '' : ' jm-nav-movil__enlace--simple') . '" href="' . esc_url($it['url']) . '">'
            . esc_html($it['titulo'])
            . ($it['flecha'] ? jm_icono_ui('flecha', 17, 2, 'jm-nav-movil__flecha') : '')
            . '</a>';
        if ($it['hijos']) {
            $html .= '<ul class="jm-familias-movil">';
            foreach ($it['hijos'] as $h) {
                $html .= '<li><a class="jm-familias-movil__enlace" href="' . esc_url($h['url']) . '">'
                    . jm_icono_familia($h['icono'], 'jm-familias-movil__icono') . esc_html($h['titulo']) . '</a></li>';
            }
            $html .= '</ul>';
        }
        $html .= '</li>';
    }
    return $html . '</ul></nav>';
}
add_shortcode('jm_nav_movil', 'jm_sc_nav_movil');

function jm_sc_boton_menu($atts = []): string
{
    $atts = shortcode_atts(['panel' => 'menu-movil'], $atts, 'jm_boton_menu');
    return '<button type="button" class="jm-boton-menu" data-jm="boton-menu" aria-expanded="false" aria-controls="' . esc_attr($atts['panel']) . '" aria-label="Abrir menú">'
        . jm_icono_ui('menu', 20, 1.75, 'jm-boton-menu__abrir')
        . jm_icono_ui('cerrar', 20, 1.75, 'jm-boton-menu__cerrar')
        . '</button>';
}
add_shortcode('jm_boton_menu', 'jm_sc_boton_menu');

/* ------------------------------------------------------------
   Barra móvil: [jm_barra_movil] + impresión automática en wp_footer
   ------------------------------------------------------------ */

function jm_barra_movil_html(): string
{
    $tel = jm_tel((string) jm_ajuste('telefono'));
    $whatsapp = preg_replace('/\D/', '', (string) jm_ajuste('whatsapp'));
    $columnas = $whatsapp ? 3 : 2;

    $html = '<div class="jm-barra-movil__hueco" aria-hidden="true"></div>'
        . '<div class="jm-barra-movil jm-no-imprimir">'
        . '<div class="jm-barra-movil__rejilla jm-barra-movil__rejilla--' . $columnas . '">'
        . '<a class="jm-barra-movil__accion" href="' . esc_attr('tel:' . $tel) . '">' . jm_icono_ui('telefono', 20, 1.75) . '<span class="jm-label-sm">Llamar</span></a>';
    if ($whatsapp) {
        $html .= '<a class="jm-barra-movil__accion" href="' . esc_url('https://wa.me/' . $whatsapp) . '">' . jm_icono_ui('mensaje', 20, 1.75) . '<span class="jm-label-sm">WhatsApp</span></a>';
    }
    $html .= '<a class="jm-barra-movil__accion jm-barra-movil__accion--acento" href="' . esc_url(home_url('/consultar-disponibilidad/')) . '">'
        . jm_icono_ui('llave', 20, 1.75) . '<span class="jm-label-sm">Consultar</span></a>'
        . '</div></div>';
    return $html;
}

function jm_sc_barra_movil(): string
{
    $GLOBALS['jm_barra_movil_impresa'] = true;
    return jm_barra_movil_html();
}
add_shortcode('jm_barra_movil', 'jm_sc_barra_movil');

/*
 * La barra va FUERA de Elementor, en wp_footer: es una pieza fija que
 * tiene que estar en todas las páginas aunque una plantilla de pie no se
 * aplique (404, búsquedas, páginas con «Elementor ancho completo» sin pie),
 * no tiene texto que editar más allá de dos rótulos, y su enlace tel: sale
 * del ajuste de teléfono. No se imprime en plantillas «Lienzo» (sin
 * cabecera ni pie), ni en el editor, ni si ya se puso con el shortcode.
 * Se apaga con: add_filter('jm_barra_movil', '__return_false');
 */
add_action('wp_footer', function () {
    if (!empty($GLOBALS['jm_barra_movil_impresa']) || is_admin()) {
        return;
    }
    if (isset($_GET['elementor-preview'])) { // phpcs:ignore WordPress.Security.NonceVerification
        return;
    }
    if (is_singular() && get_page_template_slug() === 'elementor_canvas') {
        return;
    }
    if (!apply_filters('jm_barra_movil', true)) {
        return;
    }
    echo jm_barra_movil_html(); // phpcs:ignore WordPress.Security.EscapeOutput -- escapado al construir.
}, 5);
