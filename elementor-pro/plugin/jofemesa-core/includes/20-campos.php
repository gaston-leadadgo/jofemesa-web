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

/** Atajo para describir un campo ACF. */
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
    return [
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
            'fields'   => [
                jm_campo('jm_titulo_largo', 'Título completo', 'text', ['instructions' => 'Tal cual el documento de Formación.']),
                jm_campo('jm_nombre_corto', 'Nombre para chips y filtros'),
                jm_campo('jm_norma', 'Norma (chip)'),
                jm_campo('jm_certificacion', 'Certificación'),
                jm_campo('jm_normativa', 'Normativa que cumple', 'text', ['instructions' => 'Separada por « · ».']),
                jm_campo('jm_duracion', 'Duración'),
                jm_campo('jm_modalidad', 'Modalidad'),
                jm_campo('jm_descripcion', 'Descripción', 'textarea', ['rows' => 3]),
                jm_campo('jm_para_quien', 'Para quién (tarjeta)', 'textarea', ['rows' => 2]),
                jm_campo('jm_convocatoria_abierta', 'Tiene convocatoria abierta', 'true_false', ['ui' => 1]),
                jm_campo('jm_orden', 'Orden', 'number'),
            ],
        ],
        [
            'key'      => 'group_jm_convocatoria',
            'title'    => 'Datos de la convocatoria',
            'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'convocatoria']]],
            'position' => 'acf_after_title',
            'fields'   => [
                jm_campo('jm_curso', 'Curso', 'post_object', ['post_type' => ['curso'], 'return_format' => 'id', 'required' => 1]),
                jm_campo('jm_fecha', 'Fecha', 'date_picker', ['display_format' => 'd/m/Y', 'return_format' => 'Ymd', 'first_day' => 1, 'required' => 1]),
                jm_campo('jm_inicio', 'Hora de inicio', 'text', ['default_value' => '07:30', 'wrapper' => ['width' => '50']]),
                jm_campo('jm_fin', 'Hora de fin', 'text', ['default_value' => '15:30', 'wrapper' => ['width' => '50']]),
                jm_campo('jm_plazas', 'Plazas totales', 'number', ['instructions' => 'Vacío = «Consultar plazas».', 'wrapper' => ['width' => '50']]),
                jm_campo('jm_ocupadas', 'Plazas ocupadas', 'number', ['wrapper' => ['width' => '50']]),
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
                jm_campo('jm_tipo', 'Tipo'),
                jm_campo('jm_zona', 'Zona'),
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
}

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
    update_post_meta($post_id, '_' . $nombre, 'field_' . $nombre);
}

function jm_guardar_campo_termino(int $term_id, string $nombre, $valor): void
{
    update_term_meta($term_id, $nombre, $valor);
    update_term_meta($term_id, '_' . $nombre, 'field_' . $nombre);
}
