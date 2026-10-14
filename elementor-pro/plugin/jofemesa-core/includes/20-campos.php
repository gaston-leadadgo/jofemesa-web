<?php
/**
 * Campos de cada tipo de contenido.
 *
 * Se registran como grupos locales de ACF (la versión gratuita basta): así
 * aparecen en el escritorio para editarlos y en las etiquetas dinámicas de
 * Elementor Pro («ACF Field», «ACF URL», «ACF File»…) sin crear nada a mano.
 *
 * Sin ACF los datos siguen guardados como metadatos normales y se leen con
 * la etiqueta dinámica nativa «Campo personalizado» de Elementor Pro.
 *
 * Los datos calculados (tarjeta, tabla de specs, comparador…) se guardan en
 * metadatos ocultos `_jmj_*` en JSON. No se editan a mano: salen de la web
 * de origen con el importador.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clave ACF de un campo: única por tipo de contenido o taxonomía
 * («field_curso_jm_descripcion»). Varios grupos repiten nombres
 * (jm_descripcion, jm_orden, jm_icono…) y con claves iguales ACF mezclaba
 * sus definiciones: el curso salía con las etiquetas de la máquina.
 */
function jm_clave_campo(string $contexto, string $nombre): string
{
    return 'field_' . $contexto . '_' . $nombre;
}

/** Atajo para describir un campo ACF. La clave definitiva la pone jm_grupos_de_campos. */
function jm_campo(string $nombre, string $etiqueta, string $tipo = 'text', array $extra = []): array
{
    return array_merge([
        'key'   => 'field_' . $nombre,
        'name'  => $nombre,
        'label' => $etiqueta,
        'type'  => $tipo,
    ], $extra);
}

/** Definición de todos los grupos. La usa también el importador. */
function jm_grupos_de_campos(): array
{
    $grupos = [
        [
            'key'      => 'group_jm_maquina',
            'title'    => 'Datos de la máquina',
            'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'maquina']]],
            'position' => 'acf_after_title',
            'fields'   => [
                jm_campo('jm_slug', 'Identificador (slug)', 'text', ['instructions' => 'Igual que la URL. Lo usan el comparador y el formulario. No lo cambies.', 'readonly' => 1]),
                jm_campo('jm_marca', 'Marca'),
                jm_campo('jm_modelo', 'Modelo'),
                jm_campo('jm_descripcion', 'Descripción corta', 'textarea', ['rows' => 3, 'instructions' => '25-50 palabras: uso + beneficio + característica.']),
                jm_campo('jm_subcategoria_nombre', 'Subcategoría (texto)', 'text', ['instructions' => 'Se rellena al importar desde la taxonomía Familia.']),
                jm_campo('jm_energia', 'Alimentación (clave)', 'select', ['choices' => ['electrico' => 'Eléctrico', 'diesel' => 'Diésel', 'hibrido' => 'Híbrido', 'gasolina' => 'Gasolina']]),
                jm_campo('jm_energia_nombre', 'Alimentación (texto)'),
                jm_campo('jm_altura', 'Altura de trabajo (m)', 'number', ['step' => 0.01]),
                jm_campo('jm_carga', 'Capacidad de carga (kg)', 'number', ['step' => 1]),
                jm_campo('jm_destacados', 'Puntos destacados', 'textarea', ['rows' => 4, 'instructions' => 'Uno por línea.']),
                jm_campo('jm_aplicaciones', 'Para qué se usa', 'textarea', ['rows' => 4, 'instructions' => 'Uno por línea.']),
                jm_campo('jm_ficha_pdf', 'Ficha técnica (PDF)', 'file', ['return_format' => 'url', 'mime_types' => 'pdf']),
                jm_campo('jm_ficha_bytes', 'Tamaño de la ficha (bytes)', 'number'),
                jm_campo('jm_icono', 'Icono de la subcategoría', 'text', ['instructions' => 'Nombre del dibujo (assets/iconos/maquina-*.svg).']),
                jm_campo('jm_orden', 'Orden de catálogo', 'number'),
                jm_campo('jm_destacada', 'Destacada en portada', 'true_false', ['ui' => 1]),
                jm_campo('jm_gama', 'Es una gama (no un modelo)', 'true_false', ['ui' => 1]),
            ],
        ],
        [
            'key'      => 'group_jm_curso',
            'title'    => 'Datos del curso',
            'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'curso']]],
            'position' => 'acf_after_title',
            'style'    => 'seamless',
            /* «Convocatoria abierta / A medida» ya no es un campo: lo calcula
               el plugin según el curso tenga o no fechas próximas
               (jm_fo_recalcular_cursos en 80-panel-formacion.php). */
            'fields'   => [
                jm_campo('jm_titulo_largo', 'Título completo', 'text', ['instructions' => 'El nombre oficial, tal cual el documento. Es el titular de la ficha. Vacío = el nombre de arriba.']),
                jm_campo('jm_nombre_corto', 'Nombre corto', 'text', ['instructions' => 'Para los botones de filtro del calendario. Vacío = el nombre de arriba.', 'placeholder' => 'PEMP', 'wrapper' => ['width' => '50']]),
                jm_campo('jm_norma', 'Norma', 'text', ['instructions' => 'Etiqueta junto al curso. Opcional.', 'placeholder' => 'UNE 58923', 'wrapper' => ['width' => '50']]),
                jm_campo('jm_certificacion', 'Certificación', 'text', ['instructions' => 'Quién lo certifica. Opcional.', 'placeholder' => 'AENOR', 'wrapper' => ['width' => '50']]),
                jm_campo('jm_normativa', 'Normativa que cumple', 'text', ['instructions' => 'Separa cada norma con « · ». Opcional.', 'placeholder' => 'UNE 58923 · ISO 18878', 'wrapper' => ['width' => '50']]),
                jm_campo('jm_duracion', 'Duración', 'text', ['placeholder' => '8 horas', 'wrapper' => ['width' => '33']]),
                jm_campo('jm_modalidad', 'Modalidad', 'text', ['placeholder' => 'Presencial', 'wrapper' => ['width' => '33']]),
                jm_campo('jm_orden', 'Orden', 'number', ['instructions' => 'Posición en los listados (1 = primero). Vacío = al final.', 'min' => 0, 'step' => 1, 'wrapper' => ['width' => '34']]),
                jm_campo('jm_descripcion', 'Descripción', 'textarea', ['rows' => 3, 'instructions' => 'Dos o tres frases: qué aprende el alumno y qué obtiene. Sale bajo el titular de la ficha.']),
                jm_campo('jm_para_quien', 'Para quién es', 'textarea', ['rows' => 2, 'instructions' => 'Una frase para la tarjeta del curso en la página de Formación.']),
            ],
        ],
        [
            'key'      => 'group_jm_convocatoria',
            'title'    => 'Datos de la convocatoria',
            'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'convocatoria']]],
            'position' => 'acf_after_title',
            'style'    => 'seamless',
            'fields'   => [
                /* Desplegable normal (no el buscador AJAX de «objeto de entrada»):
                   las opciones son los cursos, las pone jm_opciones_curso_acf. */
                jm_campo('jm_curso', 'Curso', 'select', ['choices' => [], 'return_format' => 'value', 'required' => 1, 'ui' => 0, 'allow_null' => 1, 'placeholder' => 'Elige un curso', 'wrapper' => ['width' => '50']]),
                /* Una sola sede y obligatoria. Guarda el término (save_terms),
                   que es lo que leen el calendario y los formularios. */
                jm_campo('jm_sede', 'Sede', 'taxonomy', ['taxonomy' => 'sede_formacion', 'field_type' => 'radio', 'allow_null' => 0, 'add_term' => 0, 'save_terms' => 1, 'load_terms' => 1, 'return_format' => 'id', 'multiple' => 0, 'required' => 1, 'instructions' => '¿Falta una sede? Créala en Formación → Sedes.', 'wrapper' => ['width' => '50']]),
                jm_campo('jm_fecha', 'Fecha', 'date_picker', ['display_format' => 'd/m/Y', 'return_format' => 'Ymd', 'first_day' => 1, 'required' => 1, 'wrapper' => ['width' => '34']]),
                jm_campo('jm_inicio', 'Hora de inicio', 'time_picker', ['display_format' => 'H:i', 'return_format' => 'H:i', 'default_value' => '07:30', 'wrapper' => ['width' => '33']]),
                jm_campo('jm_fin', 'Hora de fin', 'time_picker', ['display_format' => 'H:i', 'return_format' => 'H:i', 'default_value' => '15:30', 'wrapper' => ['width' => '33']]),
                jm_campo('jm_plazas', 'Plazas totales', 'number', ['instructions' => 'Opcional. Vacío = en la web sale «Consultar plazas».', 'min' => 0, 'step' => 1, 'wrapper' => ['width' => '50']]),
                jm_campo('jm_ocupadas', 'Plazas ocupadas', 'number', ['instructions' => 'Con 3 o menos libres sale «Últimas plazas»; sin libres, «Completo».', 'min' => 0, 'step' => 1, 'wrapper' => ['width' => '50']]),
            ],
        ],
        [
            'key'      => 'group_jm_delegacion',
            'title'    => 'Datos de la delegación',
            'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'delegacion']]],
            'position' => 'acf_after_title',
            'fields'   => [
                jm_campo('jm_tipo', 'Tipo', 'text', ['instructions' => 'Delegación, Sede de formación…']),
                jm_campo('jm_localidad', 'Localidad'),
                jm_campo('jm_direccion', 'Dirección'),
                jm_campo('jm_cp', 'Código postal'),
                jm_campo('jm_provincia', 'Provincia'),
                jm_campo('jm_pais', 'País', 'select', ['choices' => ['España' => 'España', 'Portugal' => 'Portugal']]),
                jm_campo('jm_telefono', 'Teléfono (como se lee)'),
                jm_campo('jm_tel', 'Teléfono (para enlazar)', 'text', ['instructions' => 'Formato +34XXXXXXXXX.']),
                jm_campo('jm_email', 'Correo', 'email'),
                jm_campo('jm_maps', 'Enlace de Google Maps', 'url'),
                jm_campo('jm_central', 'Es la central', 'true_false', ['ui' => 1]),
                jm_campo('jm_servicios', 'Servicios', 'textarea', ['rows' => 3, 'instructions' => 'Uno por línea.']),
                jm_campo('jm_horario', 'Horario', 'text', ['instructions' => 'Vacío = «Llámanos y te lo confirmamos». No publiques un horario que no se pueda garantizar.']),
                jm_campo('jm_orden', 'Orden', 'number'),
            ],
        ],
        [
            'key'      => 'group_jm_familia',
            'title'    => 'Datos de la familia',
            'location' => [[['param' => 'taxonomy', 'operator' => '==', 'value' => 'familia']]],
            'fields'   => [
                jm_campo('jm_nombre_largo', 'Nombre largo (catálogo general)'),
                jm_campo('jm_claim', 'Frase'),
                jm_campo('jm_descripcion', 'Descripción', 'textarea', ['rows' => 3]),
                jm_campo('jm_rango', 'Rango («Desde 4,5 m hasta 57 m»)'),
                jm_campo('jm_necesidad', 'Título de la tarjeta de portada'),
                jm_campo('jm_necesidad_desc', 'Texto de la tarjeta de portada', 'textarea', ['rows' => 2]),
                jm_campo('jm_icono', 'Icono', 'text', ['instructions' => 'Nombre del dibujo (assets/iconos/maquina-*.svg).']),
                jm_campo('jm_total', 'Número de referencias', 'number', ['readonly' => 1]),
                jm_campo('jm_orden', 'Orden', 'number'),
            ],
        ],
        [
            'key'      => 'group_jm_sede',
            'title'    => 'Datos de la sede',
            'location' => [[['param' => 'taxonomy', 'operator' => '==', 'value' => 'sede_formacion']]],
            'fields'   => [
                jm_campo('jm_tipo', 'Tipo', 'text', ['placeholder' => 'Sede de formación']),
                jm_campo('jm_zona', 'Zona', 'text', ['instructions' => 'Provincia o zona que sale junto al nombre.', 'placeholder' => 'Madrid']),
                jm_campo('jm_direccion', 'Dirección'),
                jm_campo('jm_cp', 'Código postal'),
                jm_campo('jm_localidad', 'Localidad'),
                jm_campo('jm_maps', 'Enlace de Google Maps', 'url'),
                jm_campo('jm_telefono', 'Teléfono'),
                jm_campo('jm_tel', 'Teléfono (para enlazar)'),
                jm_campo('jm_email', 'Correo', 'email'),
            ],
        ],
    ];
    foreach ($grupos as &$grupo) {
        $contexto = $grupo['location'][0][0]['value'];
        foreach ($grupo['fields'] as &$campo) {
            $campo['key'] = jm_clave_campo($contexto, $campo['name']);
        }
        unset($campo);
    }
    unset($grupo);
    return $grupos;
}

/** Opciones del campo Curso de la convocatoria: ID => nombre (· norma). */
add_filter('acf/load_field/name=jm_curso', function ($campo) {
    $campo['choices'] = [];
    $cursos = get_posts([
        'post_type'   => 'curso',
        'post_status' => ['publish', 'draft', 'private'],
        'numberposts' => -1,
        'meta_key'    => 'jm_orden',
        'orderby'     => ['meta_value_num' => 'ASC', 'title' => 'ASC'],
    ]);
    foreach ($cursos as $c) {
        $norma = (string) get_post_meta($c->ID, 'jm_norma', true);
        $campo['choices'][$c->ID] = get_the_title($c) . ($norma ? ' · ' . $norma : '') . ($c->post_status !== 'publish' ? ' (borrador)' : '');
    }
    return $campo;
});

add_action('acf/include_fields', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }
    foreach (jm_grupos_de_campos() as $grupo) {
        acf_add_local_field_group($grupo);
    }
});

/* Sin ACF, los campos siguen visibles en la API y en «Campo personalizado». */
add_action('init', function () {
    foreach (jm_grupos_de_campos() as $grupo) {
        $valor = $grupo['location'][0][0];
        if ($valor['param'] !== 'post_type') {
            continue;
        }
        foreach ($grupo['fields'] as $c) {
            register_post_meta($valor['value'], $c['name'], [
                'single'       => true,
                'show_in_rest' => true,
                'type'         => in_array($c['type'], ['number'], true) ? 'number' : 'string',
            ]);
        }
    }
}, 20);

/**
 * Guarda un valor de campo. Escribe también la referencia `_campo` → clave
 * que usa ACF para encontrar la definición, así get_field() y las etiquetas
 * dinámicas lo leen bien aunque el valor llegue por el importador.
 */
function jm_guardar_campo(int $post_id, string $nombre, $valor): void
{
    update_post_meta($post_id, $nombre, $valor);
    update_post_meta($post_id, '_' . $nombre, jm_clave_campo((string) get_post_type($post_id), $nombre));
}

function jm_guardar_campo_termino(int $term_id, string $nombre, $valor): void
{
    update_term_meta($term_id, $nombre, $valor);
    $termino = get_term($term_id);
    update_term_meta($term_id, '_' . $nombre, jm_clave_campo($termino instanceof WP_Term ? $termino->taxonomy : '', $nombre));
}
