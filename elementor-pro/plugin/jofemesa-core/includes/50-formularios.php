<?php
/**
 * Formularios nativos de Elementor Pro: opciones dinámicas y validación.
 *
 * Funciona por ID de campo (Campo → Avanzado → ID), así que el cliente puede
 * cambiar etiquetas, orden y anchos sin romper nada mientras no toque los ID.
 *
 * Opciones que rellena el plugin (déjalas vacías en el widget):
 *   provincia     las 52 provincias + Portugal
 *   delegacion    las delegaciones operativas («La que mejor me cuadre» primero)
 *   curso         los 12 cursos + «Otro curso»
 *   convocatoria  las convocatorias futuras + «Otra fecha o curso a medida»
 *
 * Validación (mismos mensajes que la web original, src/lib/leads/schema.ts):
 *   telefono, fecha_inicio, fecha_fin, alumnos, curso, curso_medida,
 *   convocatoria, contacto, empresa, localidad.
 */

if (!defined('ABSPATH')) {
    exit;
}

const JM_PROVINCIAS = [
    'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
    'Badajoz', 'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria',
    'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada',
    'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Jaén', 'La Rioja',
    'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Melilla',
    'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca',
    'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona',
    'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora',
    'Zaragoza', 'Portugal',
];

/** Convocatorias futuras con todo lo que necesitan el select y el JS. */
function jm_convocatorias_futuras(): array
{
    static $cache = null;
    if ($cache !== null) {
        return $cache;
    }
    $dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    $meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    $q = new WP_Query([
        'post_type'      => 'convocatoria',
        'posts_per_page' => -1,
        'no_found_rows'  => true,
        'meta_query'     => ['fecha' => ['key' => 'jm_fecha', 'value' => wp_date('Ymd'), 'compare' => '>=', 'type' => 'NUMERIC']],
        'orderby'        => ['fecha' => 'ASC', 'title' => 'ASC'],
    ]);
    $cache = [];
    foreach ($q->posts as $p) {
        $f = (string) get_post_meta($p->ID, 'jm_fecha', true);
        if (strlen($f) !== 8) {
            continue;
        }
        $curso = (int) get_post_meta($p->ID, 'jm_curso', true);
        $sede = wp_get_post_terms($p->ID, 'sede_formacion');
        $ts = gmmktime(0, 0, 0, (int) substr($f, 4, 2), (int) substr($f, 6, 2), (int) substr($f, 0, 4));
        $dia = $dias[(int) gmdate('w', $ts)];
        $cache[] = [
            'id'        => $p->post_name,
            'curso'     => $curso ? get_post_field('post_name', $curso) : '',
            'fecha'     => substr($f, 0, 4) . '-' . substr($f, 4, 2) . '-' . substr($f, 6, 2),
            'sede'      => $sede ? $sede[0]->slug : '',
            'sedeNombre' => $sede ? $sede[0]->name : '',
            'inicio'    => get_post_meta($p->ID, 'jm_inicio', true),
            'fin'       => get_post_meta($p->ID, 'jm_fin', true),
            /* «Lunes 14 de diciembre · Puerto de Sagunto», como el original. */
            'etiqueta'  => mb_strtoupper(mb_substr($dia, 0, 1)) . mb_substr($dia, 1) . ' ' . (int) substr($f, 6, 2)
                . ' de ' . $meses[(int) substr($f, 4, 2) - 1] . ($sede ? ' · ' . $sede[0]->name : ''),
        ];
    }
    return $cache;
}

/** Líneas «Etiqueta|valor» que entiende el campo select de Elementor. */
function jm_opciones(array $pares): string
{
    $lineas = [];
    foreach ($pares as $valor => $etiqueta) {
        $lineas[] = str_replace('|', '/', $etiqueta) . '|' . $valor;
    }
    return implode("\n", $lineas);
}

$GLOBALS['jm_formulario_formacion'] = false;

add_filter('elementor_pro/forms/render/item', function ($item) {
    $id = $item['custom_id'] ?? '';
    switch ($id) {
        case 'provincia':
            $item['field_options'] = jm_opciones(['' => 'Elige provincia'] + array_combine(JM_PROVINCIAS, JM_PROVINCIAS));
            break;

        case 'delegacion':
            $pares = ['' => 'La que mejor me cuadre'];
            $q = new WP_Query(['post_type' => 'delegacion', 'posts_per_page' => -1, 'meta_key' => 'jm_orden', 'orderby' => 'meta_value_num', 'order' => 'ASC']);
            foreach ($q->posts as $d) {
                if (get_post_meta($d->ID, 'jm_tipo', true) === 'Sede de formación') {
                    continue;
                }
                $loc = get_post_meta($d->ID, 'jm_localidad', true);
                $pares[$d->post_title] = $d->post_title . ($loc && $loc !== $d->post_title ? ' · ' . $loc : '');
            }
            $item['field_options'] = jm_opciones($pares);
            break;

        case 'curso':
            $pares = ['' => 'Elige un curso'];
            $q = new WP_Query(['post_type' => 'curso', 'posts_per_page' => -1, 'meta_key' => 'jm_orden', 'orderby' => 'meta_value_num', 'order' => 'ASC']);
            foreach ($q->posts as $c) {
                $norma = get_post_meta($c->ID, 'jm_norma', true);
                $abierta = get_post_meta($c->ID, 'jm_convocatoria_abierta', true) === '1';
                $pares[$c->post_name] = $c->post_title . ($abierta && $norma ? ' (' . $norma . ')' : '');
            }
            $pares['otro'] = 'Otro curso: diseñadlo para nosotros';
            $item['field_options'] = jm_opciones($pares);
            $GLOBALS['jm_formulario_formacion'] = true;
            break;

        case 'convocatoria':
            $pares = [];
            foreach (jm_convocatorias_futuras() as $cv) {
                $pares[$cv['id']] = $cv['etiqueta'];
            }
            $pares[''] = 'Otra fecha o curso a medida para mi grupo';
            $item['field_options'] = jm_opciones($pares);
            $GLOBALS['jm_formulario_formacion'] = true;
            break;
    }
    return $item;
}, 10, 1);

/* El JS del formulario de formación filtra las convocatorias por curso y
   oculta las pasadas: necesita saber de qué curso es cada una. */
add_action('wp_footer', function () {
    if (empty($GLOBALS['jm_formulario_formacion'])) {
        return;
    }
    $cursos = [];
    $q = new WP_Query(['post_type' => 'curso', 'posts_per_page' => -1]);
    foreach ($q->posts as $c) {
        $cursos[$c->post_name] = [
            'nombre'  => $c->post_title,
            'abierta' => get_post_meta($c->ID, 'jm_convocatoria_abierta', true) === '1',
            'norma'   => get_post_meta($c->ID, 'jm_norma', true),
            'url'     => get_permalink($c),
        ];
    }
    echo '<script type="application/json" id="jm-datos-formacion">'
        . wp_json_encode(['convocatorias' => jm_convocatorias_futuras(), 'cursos' => $cursos], JSON_UNESCAPED_UNICODE | JSON_HEX_TAG)
        . "</script>\n";
});

/* ------------------------------------------------------------
   Validación
   ------------------------------------------------------------ */

add_action('elementor_pro/forms/validation', function ($record, $ajax) {
    $campos = $record->get('fields');
    $valor = static fn(string $id) => isset($campos[$id]) ? trim((string) $campos[$id]['value']) : null;
    $error = static function (string $id, string $mensaje) use ($ajax, $campos) {
        if (isset($campos[$id])) {
            $ajax->add_error($id, $mensaje);
        }
    };
    $hoy = wp_date('Y-m-d');

    $tel = $valor('telefono');
    if ($tel !== null && !preg_match('/^(?:\+34|0034)?[6789]\d{8}$/', preg_replace('/[\s.\-()]/', '', $tel))) {
        /* Portugal: +351 y nueve cifras. El original solo aceptaba España;
           se admite Portugal porque hay dos delegaciones allí. */
        if (!preg_match('/^\+351\d{9}$/', preg_replace('/[\s.\-()]/', '', $tel))) {
            $error('telefono', 'Revisa el teléfono: nueve dígitos, fijo o móvil.');
        }
    }

    foreach (['contacto' => '¿Con quién hablamos?', 'localidad' => 'Indica la localidad de la obra.'] as $id => $msg) {
        $v = $valor($id);
        if ($v !== null && $v !== '' && mb_strlen($v) < 2) {
            $error($id, $msg);
        }
    }
    $empresa = $valor('empresa');
    if ($empresa !== null && isset($campos['fecha_inicio']) && mb_strlen($empresa) < 2) {
        $error('empresa', 'Necesitamos el nombre de la empresa.');
    }

    $ini = $valor('fecha_inicio');
    $fin = $valor('fecha_fin');
    if ($ini) {
        if ($ini < $hoy) {
            $error('fecha_inicio', 'La fecha de inicio no puede ser pasada.');
        }
        if ($fin && $fin < $ini) {
            $error('fecha_fin', 'La fecha de fin tiene que ser posterior a la de inicio.');
        }
    }

    $alumnos = $valor('alumnos');
    if ($alumnos !== null) {
        if ($alumnos === '' || !preg_match('/^\d+$/', $alumnos)) {
            $error('alumnos', 'Dinos cuántas personas se van a formar.');
        } elseif ((int) $alumnos < 1) {
            $error('alumnos', 'Al menos una persona.');
        } elseif ((int) $alumnos > 500) {
            $error('alumnos', 'Para más de 500 personas, llámanos.');
        }
    }

    $curso = $valor('curso');
    if ($curso !== null) {
        $existe = $curso === 'otro' || ($curso !== '' && get_page_by_path($curso, OBJECT, 'curso'));
        if (!$existe) {
            $error('curso', 'Elige el curso que te interesa.');
        }
        if ($curso === 'otro' && mb_strlen((string) $valor('curso_medida')) < 5) {
            $error('curso_medida', 'Cuéntanos qué formación necesitas: el equipo, la tarea o lo que tenéis que aprender.');
        }
        $conv = $valor('convocatoria');
        if ($conv && $curso !== 'otro') {
            $encontrada = null;
            foreach (jm_datos_convocatoria_por_id($conv) as $c) {
                $encontrada = $c;
            }
            if (!$encontrada || $encontrada['curso'] !== $curso) {
                $error('convocatoria', 'Esa convocatoria no es de este curso. Elige otra fecha.');
            } elseif ($encontrada['fecha'] < $hoy) {
                $error('convocatoria', 'Esa convocatoria ya ha pasado. Elige otra fecha.');
            }
        }
    }
}, 10, 2);

/** La convocatoria por su slug, sea pasada o futura. */
function jm_datos_convocatoria_por_id(string $slug): array
{
    $p = get_page_by_path(sanitize_title($slug), OBJECT, 'convocatoria');
    if (!$p) {
        return [];
    }
    $f = (string) get_post_meta($p->ID, 'jm_fecha', true);
    $curso = (int) get_post_meta($p->ID, 'jm_curso', true);
    return [[
        'curso' => $curso ? get_post_field('post_name', $curso) : '',
        'fecha' => strlen($f) === 8 ? substr($f, 0, 4) . '-' . substr($f, 4, 2) . '-' . substr($f, 6, 2) : '',
    ]];
}

/* Antes de las acciones (correo, envíos, webhook): el curso, la convocatoria
   y las máquinas pasan de slug a texto legible, que es lo que tiene que leer
   quien recibe la solicitud. */
add_action('elementor_pro/forms/process', function ($record) {
    $campos = $record->get('fields');
    if (isset($campos['curso']['value']) && $campos['curso']['value'] !== 'otro') {
        $c = get_page_by_path($campos['curso']['value'], OBJECT, 'curso');
        if ($c) {
            $record->update_field('curso', 'value', $c->post_title);
            $record->update_field('curso', 'raw_value', $c->post_title);
        }
    }
    if (!empty($campos['convocatoria']['value'])) {
        foreach (jm_convocatorias_futuras() as $cv) {
            if ($cv['id'] === $campos['convocatoria']['value']) {
                $texto = $cv['etiqueta'] . ', ' . $cv['inicio'] . '–' . $cv['fin'] . ' h';
                $record->update_field('convocatoria', 'value', $texto);
                $record->update_field('convocatoria', 'raw_value', $texto);
            }
        }
    }
    if (!empty($campos['maquinas']['value'])) {
        $nombres = [];
        foreach (array_filter(array_map('trim', explode(',', $campos['maquinas']['value']))) as $slug) {
            $id = jm_maquina_por_slug($slug);
            $nombres[] = $id ? get_the_title($id) : $slug;
        }
        $record->update_field('maquinas', 'value', implode(', ', $nombres));
    }
}, 5);
