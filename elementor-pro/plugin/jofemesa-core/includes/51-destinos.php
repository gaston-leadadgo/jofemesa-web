<?php
/**
 * A quién llega cada solicitud (petición del cliente, 18/11/2026).
 *
 *   · Alquiler: al correo de la delegación elegida en el formulario. Si no
 *     eligen ninguna, a la que atiende la provincia de la obra (campo
 *     «Provincias que atiende» de cada delegación). El formulario ya la
 *     marca sola al elegir la provincia (43-solicitud.js).
 *   · Formación: al correo de la sede de la convocatoria elegida
 *     (Formación → Sedes → «Correo»). Sin convocatoria (curso a medida),
 *     al «Correo de Formación» de JOFEMESA → Ajustes.
 *   · Si no se puede saber, al correo puesto en el propio formulario
 *     (Elementor → Acciones después del envío → Correo electrónico → Para).
 *
 * Los correos se cambian en cada delegación o sede, sin tocar el formulario.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Reparto inicial: delegación más cercana a la capital de cada provincia. */
const JM_PROVINCIAS_INICIALES = [
    'madrid'     => ['Madrid', 'Ávila', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Segovia', 'Soria', 'Toledo'],
    'asturias'   => ['Asturias', 'A Coruña', 'Cantabria', 'León', 'Lugo', 'Ourense', 'Pontevedra'],
    'valladolid' => ['Valladolid', 'Álava', 'Burgos', 'Guipúzcoa', 'La Rioja', 'Navarra', 'Palencia', 'Salamanca', 'Vizcaya', 'Zamora'],
    'valencia'   => ['Valencia', 'Baleares', 'Barcelona', 'Castellón', 'Girona', 'Huesca', 'Lleida', 'Tarragona', 'Teruel', 'Zaragoza'],
    'alicante'   => ['Alicante', 'Albacete', 'Murcia'],
    'sevilla'    => ['Sevilla', 'Badajoz', 'Cáceres', 'Cádiz', 'Córdoba', 'Huelva', 'Las Palmas', 'Santa Cruz de Tenerife'],
    'malaga'     => ['Málaga', 'Almería', 'Ceuta', 'Granada', 'Jaén', 'Melilla'],
    'lisboa'     => ['Portugal'],
];

/* Rellena «Provincias que atiende» una vez, solo donde esté vacío. */
add_action('admin_init', function () {
    if (get_option('jm_provincias_20261118') || !current_user_can('manage_options')) {
        return;
    }
    foreach (JM_PROVINCIAS_INICIALES as $slug => $provincias) {
        $p = get_page_by_path($slug, OBJECT, 'delegacion');
        if ($p && trim((string) get_post_meta($p->ID, 'jm_provincias', true)) === '') {
            jm_guardar_campo($p->ID, 'jm_provincias', implode("\n", $provincias));
        }
    }
    update_option('jm_provincias_20261118', 1, false);
});

/** provincia (normalizada) → ['id', 'nombre', 'email'] de la delegación que la atiende. */
function jm_destinos_provincias(): array
{
    static $mapa = null;
    if ($mapa !== null) {
        return $mapa;
    }
    $mapa = [];
    foreach (get_posts(['post_type' => 'delegacion', 'numberposts' => -1, 'post_status' => 'publish', 'orderby' => 'menu_order', 'order' => 'ASC']) as $p) {
        $lineas = preg_split('/\r\n|\r|\n|,/', (string) get_post_meta($p->ID, 'jm_provincias', true));
        foreach (array_filter(array_map('trim', $lineas)) as $prov) {
            $mapa[$prov] = $mapa[$prov] ?? ['id' => $p->ID, 'nombre' => $p->post_title, 'email' => (string) get_post_meta($p->ID, 'jm_email', true)];
        }
    }
    return $mapa;
}

function jm_destino_correo_valido(string $c): string
{
    $lista = array_filter(array_map('trim', explode(',', $c)), 'is_email');
    return implode(', ', $lista);
}

/* Se decide antes de que 50-formularios.php cambie el curso y la
   convocatoria por su texto (prioridad 5), con los valores originales. */
add_action('elementor_pro/forms/process', function ($record) {
    $GLOBALS['jm_destino_correo'] = '';
    $campos = $record->get('fields');

    /* Alquiler: delegación elegida o, si no, la de la provincia. */
    if (isset($campos['delegacion'])) {
        $elegida = trim((string) ($campos['delegacion']['value'] ?? ''));
        $p = $elegida !== '' ? jm_delegacion_por_titulo($elegida) : null;
        if (!$p && !empty($campos['provincia']['value'])) {
            $d = jm_destinos_provincias()[trim((string) $campos['provincia']['value'])] ?? null;
            if ($d) {
                $p = get_post($d['id']);
                $texto = $d['nombre'] . ' (asignada por la provincia de la obra)';
                $record->update_field('delegacion', 'value', $texto);
                $record->update_field('delegacion', 'raw_value', $d['nombre']);
            }
        }
        if ($p) {
            $GLOBALS['jm_destino_correo'] = jm_destino_correo_valido((string) get_post_meta($p->ID, 'jm_email', true));
        }
        return;
    }

    /* Formación: sede de la convocatoria o, sin ella, el correo de Formación. */
    if (isset($campos['curso']) || isset($campos['convocatoria'])) {
        $conv = trim((string) ($campos['convocatoria']['value'] ?? ''));
        $correo = '';
        if ($conv !== '') {
            $c = get_page_by_path($conv, OBJECT, 'convocatoria');
            $sede = $c ? wp_get_post_terms($c->ID, 'sede_formacion') : [];
            if ($sede && !is_wp_error($sede)) {
                $correo = (string) get_term_meta($sede[0]->term_id, 'jm_email', true);
            }
        }
        $GLOBALS['jm_destino_correo'] = jm_destino_correo_valido($correo ?: (string) jm_ajuste('email_formacion'));
    }
}, 1);

/** Delegación por su título exacto (el valor del desplegable). */
function jm_delegacion_por_titulo(string $titulo): ?WP_Post
{
    foreach (get_posts(['post_type' => 'delegacion', 'numberposts' => -1, 'post_status' => 'publish']) as $p) {
        if ($p->post_title === $titulo) {
            return $p;
        }
    }
    return null;
}

/* Solo el aviso interno (acción «Correo electrónico»): se reconoce porque
   su «Para» es el del formulario. Un segundo correo al cliente no se toca. */
add_filter('elementor_pro/forms/wp_mail_fields', function ($campos, $record) {
    $destino = (string) ($GLOBALS['jm_destino_correo'] ?? '');
    if ($destino === '' || ($campos['email_to'] ?? '') !== ($record->get_form_settings('email_to') ?? '')) {
        return $campos;
    }
    $campos['email_to'] = $destino;
    return $campos;
}, 10, 2);

/* ------------------------------------------------------------
   Usuarios pedidos por el cliente (18/11/2026)
   ------------------------------------------------------------ */

/* Se crean una vez, al entrar un administrador en el escritorio, si no
   existe ya alguien con ese correo. Cada uno recibe el correo de WordPress
   para elegir su contraseña (nadie más la conoce). */
add_action('admin_init', function () {
    if (get_option('jm_usuarios_20261118') || !current_user_can('create_users')) {
        return;
    }
    $usuarios = [
        ['login' => 'administrador-web', 'email' => 'marketing@jofemesa.com', 'nombre' => 'Administrador', 'apellido' => 'web', 'rol' => 'administrator'],
        ['login' => 'sara-niebla', 'email' => 'formacion@jofemesa.com', 'nombre' => 'Sara', 'apellido' => 'Niebla', 'rol' => 'jm_gestor_formacion'],
    ];
    foreach ($usuarios as $u) {
        if (email_exists($u['email']) || username_exists($u['login'])) {
            continue;
        }
        $id = wp_insert_user([
            'user_login'   => $u['login'],
            'user_email'   => $u['email'],
            'user_pass'    => wp_generate_password(24),
            'first_name'   => $u['nombre'],
            'last_name'    => $u['apellido'],
            'display_name' => $u['nombre'] . ' ' . $u['apellido'],
            'role'         => $u['rol'],
        ]);
        if (!is_wp_error($id)) {
            wp_new_user_notification($id, null, 'user');
        }
    }
    update_option('jm_usuarios_20261118', 1, false);
});
