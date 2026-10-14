<?php
/**
 * Portada (Inicio) y asesor: shortcodes.
 *
 *   [jm_cifra que="…"]                    Una cifra viva (referencias, delegaciones, alturas…).
 *   [jm_buscador tono="oscuro|claro"]     El buscador del hero (Buscador.tsx).
 *   [jm_proxima_convocatoria]             Tarjeta «Próxima convocatoria» del hero de Formación.
 *   [jm_asesor variante="portada|pagina"] El asesor de tres preguntas (Asesor.tsx).
 *   [jm_mapa tono="claro|oscuro" animado="1"]  El mapa de delegaciones (Mapa.tsx).
 *   [jm_fabricantes variante="partners|autoridad"]  Fabricantes de la flota.
 *   [jm_delegaciones_lista]               Rejilla compacta de delegaciones de Cobertura.
 *
 * [jm_antiguedad] NO está aquí: lo registra 60-global.php (y lo anima 10-global.js).
 *
 * Todo lee primero WordPress (entradas y taxonomías del plugin) y, si aún no
 * se ha importado nada, cae a los JSON de datos/ para que la portada nunca
 * salga vacía.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ============================================================
   Utilidades de esta área
   ============================================================ */

/** Formato español: coma decimal y punto de millar siempre (format.ts). */
function jm_inicio_num($v): string
{
    if (!is_numeric($v)) {
        return (string) $v;
    }
    $v = (float) $v;
    $dec = (abs($v - round($v)) < 0.0001) ? 0 : (abs($v * 10 - round($v * 10)) < 0.0001 ? 1 : 2);
    return number_format($v, $dec, ',', '.');
}

/** Mes y día en español para las fechas ISO (partesFecha de formacion.ts). */
function jm_inicio_partes_fecha(string $iso): array
{
    $meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    $cortos = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    $dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    [$a, $m, $d] = array_map('intval', explode('-', $iso) + [0, 1, 1]);
    $ts = gmmktime(0, 0, 0, max(1, $m), max(1, $d), $a);
    return [
        'dia'       => $d,
        'mes'       => $meses[$m - 1] ?? '',
        'mesCorto'  => $cortos[$m - 1] ?? '',
        'diaSemana' => $dias[(int) gmdate('w', $ts)],
        'claveMes'  => sprintf('%04d-%02d', $a, $m),
    ];
}

/** El icono SVG de una pieza de interfaz (trazos de Lucide, ISC). */
function jm_inicio_icono(string $nombre, int $tam = 16, float $trazo = 2, string $clase = ''): string
{
    static $trazos = [
        'buscar'     => '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
        'flecha'     => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'telefono'   => '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
        'calendario' => '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
        'pin'        => '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    ];
    if (!isset($trazos[$nombre])) {
        return '';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' . $tam . '" height="' . $tam . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' . esc_attr((string) $trazo) . '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' . ($clase ? ' class="' . esc_attr($clase) . '"' : '') . '>' . $trazos[$nombre] . '</svg>';
}

/** IDs de las máquinas publicadas (cacheado por petición). */
function jm_inicio_ids_maquinas(): array
{
    static $ids = null;
    if ($ids === null) {
        $ids = post_type_exists('maquina') ? get_posts([
            'post_type'        => 'maquina',
            'post_status'      => 'publish',
            'posts_per_page'   => -1,
            'fields'           => 'ids',
            'no_found_rows'    => true,
            'suppress_filters' => true,
        ]) : [];
    }
    return $ids;
}

/** Las delegaciones de alquiler: sin la sede de formación (que también es `delegacion`). */
function jm_inicio_delegaciones(): array
{
    static $lista = null;
    if ($lista !== null) {
        return $lista;
    }
    $lista = [];
    if (post_type_exists('delegacion')) {
        $posts = get_posts([
            'post_type'        => 'delegacion',
            'post_status'      => 'publish',
            'posts_per_page'   => -1,
            'no_found_rows'    => true,
            'suppress_filters' => true,
            'meta_key'         => 'jm_orden',
            'orderby'          => ['meta_value_num' => 'ASC', 'menu_order' => 'ASC'],
        ]);
        foreach ($posts as $p) {
            $tipo = (string) get_post_meta($p->ID, 'jm_tipo', true);
            if (stripos($tipo, 'formaci') !== false) {
                continue;
            }
            $telefono = (string) get_post_meta($p->ID, 'jm_telefono', true);
            $lista[] = [
                'nombre'    => get_the_title($p),
                'localidad' => (string) get_post_meta($p->ID, 'jm_localidad', true),
                'pais'      => (string) get_post_meta($p->ID, 'jm_pais', true),
                'telefono'  => $telefono,
                'tel'       => (string) get_post_meta($p->ID, 'jm_tel', true) ?: jm_tel($telefono),
            ];
        }
    }
    if (!$lista) {
        foreach (jm_datos('delegaciones.json') as $d) {
            $lista[] = [
                'nombre'    => $d['nombre'] ?? '',
                'localidad' => $d['localidad'] ?? '',
                'pais'      => $d['pais'] ?? 'España',
                'telefono'  => $d['telefono'] ?? '',
                'tel'       => $d['tel'] ?? jm_tel($d['telefono'] ?? ''),
            ];
        }
    }
    return $lista;
}

/* ============================================================
   [jm_cifra] — las cifras que el original cuenta en código
   ============================================================ */

function jm_inicio_cifra_valor(string $que, string $familia = '')
{
    static $cache = [];
    $clave = $que . '|' . $familia;
    if (array_key_exists($clave, $cache)) {
        return $cache[$clave];
    }
    $json = jm_datos('maquinas.json');
    $ids = jm_inicio_ids_maquinas();
    $valor = '';

    switch ($que) {
        case 'referencias':
            $valor = $ids ? count($ids) : count($json);
            break;

        case 'delegaciones':
            $valor = count(jm_inicio_delegaciones());
            break;

        case 'familias':
            $terminos = taxonomy_exists('familia') ? get_terms(['taxonomy' => 'familia', 'parent' => 0, 'hide_empty' => false, 'fields' => 'ids']) : [];
            $valor = (!is_wp_error($terminos) && $terminos) ? count($terminos) : count(jm_datos('familias.json'));
            break;

        case 'familia':
            $valor = 0;
            $termino = ($familia && taxonomy_exists('familia')) ? get_term_by('slug', $familia, 'familia') : null;
            if ($termino && $ids) {
                $valor = count(get_posts([
                    'post_type'      => 'maquina',
                    'post_status'    => 'publish',
                    'posts_per_page' => -1,
                    'fields'         => 'ids',
                    'no_found_rows'  => true,
                    'tax_query'      => [['taxonomy' => 'familia', 'field' => 'term_id', 'terms' => $termino->term_id, 'include_children' => true]],
                ]));
            } else {
                foreach (jm_datos('familias.json') as $f) {
                    if (($f['slug'] ?? '') === $familia || ($f['id'] ?? '') === $familia) {
                        $valor = (int) ($f['total'] ?? 0);
                    }
                }
            }
            break;

        case 'altura-min':
        case 'altura-max':
            $alturas = [];
            if ($ids) {
                foreach ($ids as $id) {
                    $a = get_post_meta($id, 'jm_altura', true);
                    if (is_numeric($a) && (float) $a > 0) {
                        $alturas[] = (float) $a;
                    }
                }
            }
            if (!$alturas) {
                foreach ($json as $m) {
                    if (isset($m['altura']) && is_numeric($m['altura'])) {
                        $alturas[] = (float) $m['altura'];
                    }
                }
            }
            $valor = $alturas ? ($que === 'altura-min' ? min($alturas) : max($alturas)) : '';
            break;

        case 'destacadas':
            if ($ids) {
                $valor = 0;
                foreach ($ids as $id) {
                    if (has_post_thumbnail($id) && get_post_meta($id, 'jm_ficha_pdf', true)) {
                        $valor++;
                    }
                }
            } else {
                $valor = count(array_filter($json, static fn($m) => !empty($m['foto']) && !empty($m['ficha'])));
            }
            break;

        case 'anios':
            $desde = explode('-', (string) jm_ajuste('fundacion'));
            $hoy = explode('-', wp_date('Y-m-d'));
            $valor = (int) $hoy[0] - (int) $desde[0];
            if ((int) $hoy[1] < (int) ($desde[1] ?? 1) || ((int) $hoy[1] === (int) ($desde[1] ?? 1) && (int) $hoy[2] < (int) ($desde[2] ?? 1))) {
                $valor--;
            }
            break;

        case 'fundacion':
            /* Texto, no número: un año no lleva separador de miles («1987»). */
            $valor = substr((string) jm_ajuste('fundacion'), 0, 4);
            break;

        case 'equipos':
            $valor = jm_datos('empresa.json')['flota']['equipos'] ?? '';
            break;

        case 'telefono':
            $valor = jm_ajuste('telefono');
            break;

        case 'tel':
            $valor = jm_tel((string) jm_ajuste('telefono'));
            break;
    }
    $cache[$clave] = $valor;
    return $valor;
}

function jm_sc_cifra($atts): string
{
    $a = shortcode_atts(['que' => 'referencias', 'familia' => '', 'plural' => ''], $atts, 'jm_cifra');
    $v = jm_inicio_cifra_valor(sanitize_key($a['que']), sanitize_title($a['familia']));
    /* Solo se formatean los números de verdad: los textos («+5.000», «1987»)
       salen tal cual; is_numeric('+5.000') es cierto y daría «5». */
    $texto = (is_int($v) || is_float($v)) ? jm_inicio_num($v) : (string) $v;
    if ($a['plural'] !== '') {
        $formas = array_map('trim', explode(',', $a['plural']));
        $palabra = ((float) $v === 1.0) ? $formas[0] : ($formas[1] ?? $formas[0] . 's');
        return '<span class="jm-sin-corte">' . esc_html($texto . ' ' . $palabra) . '</span>';
    }
    return esc_html($texto);
}
add_shortcode('jm_cifra', 'jm_sc_cifra');

/* ============================================================
   [jm_buscador]
   ============================================================ */

function jm_sc_buscador($atts): string
{
    static $n = 0;
    $n++;
    $a = shortcode_atts(['tono' => 'oscuro'], $atts, 'jm_buscador');
    $oscuro = $a['tono'] !== 'claro';
    $accion = home_url('/alquiler/');

    /* Las sugerencias del campo: las subcategorías (taxonomía familia, hijas). */
    $sugerencias = [];
    if (taxonomy_exists('familia')) {
        $hijas = get_terms(['taxonomy' => 'familia', 'hide_empty' => false, 'childless' => true, 'parent' => '']);
        if (!is_wp_error($hijas)) {
            foreach ($hijas as $t) {
                if ($t->parent) {
                    $sugerencias[] = $t->name;
                }
            }
        }
    }
    if (!$sugerencias) {
        foreach (jm_datos('familias.json') as $f) {
            foreach (($f['subcategorias'] ?? []) as $s) {
                $sugerencias[] = $s['nombre'];
            }
        }
    }

    /* Los cuatro atajos de Buscador.tsx: no son un dato de ventas. */
    $atajos = [
        ['Tijera eléctrica', 'tijeras electricas'],
        ['Brazo diésel 4x4', 'brazos articulados diesel'],
        ['Manipulador telescópico', 'manipuladores telescopicos'],
        ['Retroexcavadora', 'retroexcavadoras'],
    ];

    $id = 'jm-busca-maquina-' . $n;
    $lista = 'jm-familias-sugeridas-' . $n;

    ob_start();
    ?>
<div class="jm-buscador<?php echo $oscuro ? ' jm-buscador--oscuro' : ''; ?>" data-jm="buscador">
  <form class="jm-buscador__caja" action="<?php echo esc_url($accion); ?>" method="get">
    <div class="jm-buscador__campo">
      <label for="<?php echo esc_attr($id); ?>" class="jm-sr">¿Qué máquina necesitas?</label>
      <?php echo jm_inicio_icono('buscar', 18, 1.75, 'jm-buscador__lupa'); // phpcs:ignore ?>
      <input id="<?php echo esc_attr($id); ?>" class="jm-buscador__input" type="search" name="q" placeholder="¿Qué máquina necesitas?" list="<?php echo esc_attr($lista); ?>" autocomplete="off">
      <datalist id="<?php echo esc_attr($lista); ?>">
        <?php foreach (array_unique($sugerencias) as $s) : ?>
        <option value="<?php echo esc_attr($s); ?>"></option>
        <?php endforeach; ?>
      </datalist>
    </div>
    <button type="submit" class="jm-buscador__boton">
      Ver disponibilidad
      <?php echo jm_inicio_icono('flecha', 18, 2, 'jm-buscador__flecha'); // phpcs:ignore ?>
    </button>
  </form>
  <p class="jm-buscador__nota">Sin precios online: te confirmamos disponibilidad y presupuesto por teléfono o email.</p>
  <div class="jm-buscador__atajos">
    <span class="jm-label-sm jm-buscador__rotulo">Empieza por</span>
    <div class="jm-buscador__pista">
      <?php foreach ($atajos as [$texto, $q]) : ?>
      <a class="jm-buscador__atajo" href="<?php echo esc_url(add_query_arg('q', rawurlencode($q), $accion)); ?>"><?php echo esc_html($texto); ?></a>
      <?php endforeach; ?>
    </div>
  </div>
</div>
    <?php
    return (string) ob_get_clean();
}
add_shortcode('jm_buscador', 'jm_sc_buscador');

/* ============================================================
   [jm_proxima_convocatoria]
   El servidor imprime las futuras; el navegador elige la primera >= hoy
   (la página puede estar en caché de un día para otro).
   ============================================================ */

function jm_inicio_convocatorias_futuras(): array
{
    $lista = [];
    $desde = wp_date('Ymd', time() - DAY_IN_SECONDS); // un día de margen por la zona del navegador

    if (post_type_exists('convocatoria')) {
        $posts = get_posts([
            'post_type'        => 'convocatoria',
            'post_status'      => 'publish',
            'posts_per_page'   => 120,
            'no_found_rows'    => true,
            'suppress_filters' => true,
            'meta_query'       => ['fecha' => ['key' => 'jm_fecha', 'value' => $desde, 'compare' => '>=', 'type' => 'NUMERIC']],
            'orderby'          => ['fecha' => 'ASC', 'title' => 'ASC'],
        ]);
        foreach ($posts as $p) {
            $f = preg_replace('/\D/', '', (string) get_post_meta($p->ID, 'jm_fecha', true));
            if (strlen($f) !== 8) {
                continue;
            }
            $curso = (int) get_post_meta($p->ID, 'jm_curso', true);
            $sedes = wp_get_post_terms($p->ID, 'sede_formacion');
            $lista[] = [
                'f' => substr($f, 0, 4) . '-' . substr($f, 4, 2) . '-' . substr($f, 6, 2),
                'c' => $curso ? get_the_title($curso) : '',
                'n' => $curso ? (string) get_post_meta($curso, 'jm_norma', true) : '',
                's' => (!is_wp_error($sedes) && $sedes) ? $sedes[0]->name : '',
            ];
        }
    }

    if (!$lista && !(post_type_exists('convocatoria') && wp_count_posts('convocatoria')->publish > 0)) {
        $cursos = [];
        foreach (jm_datos('cursos.json') as $c) {
            $cursos[$c['id']] = $c;
        }
        $sedes = [];
        foreach (jm_datos('sedes-formacion.json') as $s) {
            $sedes[$s['id']] = $s['nombre'];
        }
        $iso = wp_date('Y-m-d', time() - DAY_IN_SECONDS);
        foreach (jm_datos('convocatorias.json') as $cv) {
            if (($cv['fecha'] ?? '') < $iso) {
                continue;
            }
            $c = $cursos[$cv['curso']] ?? [];
            $lista[] = [
                'f' => $cv['fecha'],
                'c' => $c['nombre'] ?? $cv['curso'],
                'n' => $c['norma'] ?? '',
                's' => $sedes[$cv['sede']] ?? $cv['sede'],
            ];
        }
    }
    return $lista;
}

function jm_sc_proxima_convocatoria($atts): string
{
    $lista = jm_inicio_convocatorias_futuras();
    $hoy = wp_date('Y-m-d');
    $proximas = array_values(array_filter($lista, static fn($c) => $c['f'] >= $hoy));
    $sig = $proximas[0] ?? null;
    $enlace = home_url('/formacion/#calendario');

    $mas = 0;
    $p = ['dia' => '', 'mesCorto' => '', 'diaSemana' => '', 'claveMes' => ''];
    if ($sig) {
        $p = jm_inicio_partes_fecha($sig['f']);
        foreach ($proximas as $c) {
            if (jm_inicio_partes_fecha($c['f'])['claveMes'] === $p['claveMes']) {
                $mas++;
            }
        }
        $mas--;
    }

    ob_start();
    ?>
<div class="jm-proxima" data-jm="proxima-convocatoria"<?php echo $sig ? '' : ' hidden'; ?>>
  <script type="application/json" class="jm-proxima__datos"><?php echo wp_json_encode($lista, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP); ?></script>
  <div class="jm-proxima__tarjeta">
    <div class="jm-proxima__fecha">
      <span class="jm-proxima__dia" data-campo="dia"><?php echo esc_html((string) $p['dia']); ?></span>
      <span class="jm-proxima__mes" data-campo="mes"><?php echo esc_html($p['mesCorto']); ?></span>
    </div>
    <div class="jm-proxima__cuerpo">
      <p class="jm-meta jm-proxima__rotulo"><?php echo jm_inicio_icono('calendario', 13, 2, 'jm-proxima__ico'); // phpcs:ignore ?>Próxima convocatoria</p>
      <p class="jm-proxima__curso"><span data-campo="curso"><?php echo esc_html($sig['c'] ?? ''); ?></span><span class="jm-proxima__norma" data-campo="norma"><?php echo ($sig && $sig['n']) ? esc_html(' · ' . $sig['n']) : ''; ?></span></p>
      <p class="jm-proxima__sede"><?php echo jm_inicio_icono('pin', 13, 2, 'jm-proxima__ico'); // phpcs:ignore ?><span><span data-campo="sede"><?php echo esc_html($sig['s'] ?? ''); ?></span> · <span class="jm-proxima__semana" data-campo="semana"><?php echo esc_html($p['diaSemana']); ?></span></span></p>
    </div>
    <a class="jm-proxima__enlace" href="<?php echo esc_url($enlace); ?>"><span data-campo="mas"><?php echo esc_html($mas > 0 ? '+' . $mas . ' este mes' : 'Calendario'); ?></span><?php echo jm_inicio_icono('flecha', 14, 2.25); // phpcs:ignore ?></a>
  </div>
</div>
    <?php
    return (string) ob_get_clean();
}
add_shortcode('jm_proxima_convocatoria', 'jm_sc_proxima_convocatoria');

/* ============================================================
   [jm_asesor]
   ============================================================ */

/** Los datos de pintura de las máquinas que puede recomendar el motor. */
function jm_inicio_datos_asesor(): array
{
    $guardado = get_transient('jm_asesor_datos_v1');
    if (is_array($guardado) && !empty($guardado['maquinas'])) {
        return $guardado;
    }

    $etiquetas = [];
    foreach (jm_datos('specdefs.json') as $s) {
        $etiquetas[$s['key']] = $s['etiqueta'];
    }
    $datos_spec = static function (array $tarjeta) use ($etiquetas): array {
        $filas = [];
        foreach (array_slice($tarjeta, 0, 3) as $t) {
            $filas[] = [
                $etiquetas[$t['key'] ?? ''] ?? ($t['etiqueta'] ?? ''),
                $t['estado'] ?? 'confirmado',
                (string) ($t['texto'] ?? ''),
                (string) ($t['unidad'] ?? ''),
                (string) ($t['nota'] ?? ''),
                isset($t['valor']) && is_numeric($t['valor']) ? 1 : 0,
            ];
        }
        return $filas;
    };

    $maquinas = [];
    $iconos_usados = [];
    $ids = jm_inicio_ids_maquinas();
    if ($ids && function_exists('jm_maquina')) {
        foreach ($ids as $id) {
            $m = jm_maquina($id);
            if (!$m) {
                continue;
            }
            $maquinas[$m['slug']] = [
                't'  => $m['titulo'],
                'ma' => $m['marca'],
                'mo' => $m['modelo'],
                'u'  => $m['url'],
                'f'  => $m['foto'],
                'a'  => $m['foto_alt'] ?: $m['titulo'],
                's'  => $m['subcategoria_nombre'] ?: $m['marca'],
                'i'  => $m['icono'] ?: 'tijera',
                'd'  => $datos_spec((array) $m['tarjeta']),
            ];
            $iconos_usados[$m['icono'] ?: 'tijera'] = true;
        }
    } else {
        foreach (jm_datos('maquinas.json') as $m) {
            $maquinas[$m['slug']] = [
                't'  => $m['titulo'],
                'ma' => $m['marca'],
                'mo' => $m['modelo'],
                'u'  => home_url('/maquina/' . $m['slug'] . '/'),
                'f'  => !empty($m['foto']['ruta']) ? jm_url_media($m['foto']['ruta']) : '',
                'a'  => $m['foto']['alt'] ?? $m['titulo'],
                's'  => $m['subcategoriaNombre'] ?? $m['marca'],
                'i'  => $m['icono'] ?? 'tijera',
                'd'  => $datos_spec((array) ($m['tarjeta'] ?? [])),
            ];
            $iconos_usados[$m['icono'] ?? 'tijera'] = true;
        }
    }

    $iconos = [];
    foreach (array_keys($iconos_usados) as $ic) {
        $svg = jm_svg('maquina-' . $ic);
        if ($svg) {
            $iconos[$ic] = $svg;
        }
    }

    $datos = ['maquinas' => $maquinas, 'iconos' => $iconos];
    if ($ids) {
        set_transient('jm_asesor_datos_v1', $datos, 12 * HOUR_IN_SECONDS);
    }
    return $datos;
}

/* Si cambia una máquina, se rehacen los datos del asesor. */
foreach (['save_post_maquina', 'deleted_post', 'set_object_terms'] as $jm_gancho) {
    add_action($jm_gancho, static function () {
        delete_transient('jm_asesor_datos_v1');
    });
}

function jm_sc_asesor($atts): string
{
    static $datos_impresos = false;
    $a = shortcode_atts(['variante' => 'portada', 'alternativas' => '0'], $atts, 'jm_asesor');
    $variante = $a['variante'] === 'pagina' ? 'pagina' : 'portada';

    if (wp_script_is('jm-asesor-motor', 'registered')) {
        wp_enqueue_script('jm-asesor-motor');
    }

    $salida = '';
    if (!$datos_impresos) {
        $datos_impresos = true;
        $salida .= '<script type="application/json" id="jm-asesor-datos">'
            . wp_json_encode(jm_inicio_datos_asesor(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP)
            . '</script>';
    }

    ob_start();
    ?>
<div class="jm-asesor jm-asesor--<?php echo esc_attr($variante); ?>" data-jm="asesor" data-variante="<?php echo esc_attr($variante); ?>" data-alternativas="<?php echo $a['alternativas'] === '1' ? '1' : '0'; ?>">
  <div class="jm-asesor__panel" data-revelar="escala">
    <div class="jm-asesor__barra">
      <div class="jm-asesor__estado"><span class="jm-label jm-asesor__contador">0 de 3 contestadas</span></div>
    </div>
    <div class="jm-asesor__preguntas">
      <p class="jm-display-3 jm-asesor__enunciado">Tres respuestas y te decimos qué encaja</p>
      <p class="jm-asesor__intro">Elige la opción que más se parezca. Si no lo tienes claro, marca <em>No lo sé</em>: el asesor ensancha la búsqueda en vez de bloquearse.</p>
      <noscript><p class="jm-asesor__intro"><a class="jm-asesor__enlace-catalogo" href="<?php echo esc_url(home_url('/alquiler/')); ?>">Ver el catálogo completo</a></p></noscript>
    </div>
  </div>
</div>
    <?php
    return $salida . (string) ob_get_clean();
}
add_shortcode('jm_asesor', 'jm_sc_asesor');

/* ============================================================
   [jm_mapa]
   ============================================================ */

function jm_sc_mapa($atts): string
{
    $a = shortcode_atts(['tono' => 'claro', 'animado' => '0'], $atts, 'jm_mapa');
    $tono = $a['tono'] === 'oscuro' ? 'oscuro' : 'claro';
    $svg = jm_svg('mapa-delegaciones-' . $tono);
    if (!$svg) {
        return '';
    }
    /* El SVG ya trae role="img" y su aria-label: se le quita el aria-hidden que añade jm_svg. */
    $svg = preg_replace('/ aria-hidden="true" focusable="false"/', ' focusable="false"', $svg, 1);
    $clases = 'jm-mapa jm-mapa--' . $tono . ($a['animado'] === '1' ? ' jm-mapa--animado' : '');
    return '<div class="' . esc_attr($clases) . '">' . $svg . '</div>';
}
add_shortcode('jm_mapa', 'jm_sc_mapa');

/* ============================================================
   [jm_fabricantes]
   ============================================================ */

function jm_sc_fabricantes($atts): string
{
    $a = shortcode_atts(['variante' => 'autoridad', 'excluir' => ''], $atts, 'jm_fabricantes');
    $variante = $a['variante'] === 'partners' ? 'partners' : 'autoridad';
    /* En la banda de partners, Jungheinrich y Takeuchi ya tienen su tarjeta. */
    $excluir = $a['excluir'] !== '' ? $a['excluir'] : ($variante === 'partners' ? 'jungheinrich,takeuchi' : '');
    $fuera = array_filter(array_map('trim', explode(',', strtolower($excluir))));

    $html = '<ul class="jm-fabricantes jm-fabricantes--' . esc_attr($variante) . '">';
    foreach ((jm_datos('empresa.json')['fabricantes'] ?? []) as $f) {
        if (in_array(strtolower($f['nombre']), $fuera, true)) {
            continue;
        }
        $html .= '<li title="' . esc_attr($f['area'] ?? '') . '">' . esc_html($f['nombre']) . '</li>';
    }
    return $html . '</ul>';
}
add_shortcode('jm_fabricantes', 'jm_sc_fabricantes');

/* ============================================================
   [jm_delegaciones_lista] — la rejilla compacta de Cobertura
   ============================================================ */

function jm_sc_delegaciones_lista($atts): string
{
    $html = '<ul class="jm-cobertura__lista" data-escalonar>';
    foreach (jm_inicio_delegaciones() as $d) {
        $html .= '<li class="jm-cobertura__celda">'
            . '<div class="jm-cobertura__cabeza"><p class="jm-cobertura__nombre">' . esc_html($d['nombre']) . '</p>'
            . ($d['pais'] === 'Portugal' ? '<span class="jm-label-sm jm-cobertura__pais">PT</span>' : '')
            . '</div>'
            . ($d['localidad'] ? '<p class="jm-cobertura__localidad">' . esc_html($d['localidad']) . '</p>' : '')
            . ($d['telefono'] ? '<a class="jm-value jm-cobertura__tel" href="tel:' . esc_attr($d['tel']) . '">' . jm_inicio_icono('telefono', 13, 1.75) . esc_html($d['telefono']) . '</a>' : '')
            . '</li>';
    }
    return $html . '</ul>';
}
add_shortcode('jm_delegaciones_lista', 'jm_sc_delegaciones_lista');
