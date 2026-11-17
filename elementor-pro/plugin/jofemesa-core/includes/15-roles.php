<?php
/**
 * Usuarios y permisos por módulo (petición del cliente, 17/11/2026).
 *
 *   · Administrador: todo, como siempre.
 *   · Gestor de Formación: menú «Formación» (panel, convocatorias, cursos,
 *     sedes, guía y solicitudes de formación) y la biblioteca de medios.
 *   · Gestor de Maquinaria: «Máquinas» (fichas, familias, alimentaciones,
 *     fabricantes, usos y solicitudes de alquiler) y la biblioteca de medios.
 *
 * Cada gestor crea, edita y borra solo lo de su módulo. Delegaciones,
 * páginas de Elementor, plantillas, ajustes y plugins quedan para el
 * administrador. Los usuarios se dan de alta en Usuarios → Añadir nuevo,
 * eligiendo el perfil en «Perfil».
 *
 * Para separar los módulos, cada tipo de contenido tiene sus propios
 * permisos (capability_type en 10-tipos.php): edit_maquinas,
 * edit_convocatorias, edit_cursos, edit_delegaciones…
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Permisos primitivos de un tipo con capability_type [singular, plural]. */
function jm_capacidades_tipo(string $plural): array
{
    $c = [];
    foreach (['edit', 'edit_others', 'edit_private', 'edit_published', 'publish', 'read_private', 'delete', 'delete_others', 'delete_private', 'delete_published'] as $accion) {
        $c[] = $accion . '_' . $plural;
    }
    return $c;
}

/** Las taxonomías de un módulo se gestionan con el permiso de editar ese módulo. */
function jm_capacidades_taxonomia(string $plural): array
{
    return [
        'manage_terms' => 'edit_' . $plural,
        'edit_terms'   => 'edit_' . $plural,
        'delete_terms' => 'edit_' . $plural,
        'assign_terms' => 'edit_' . $plural,
    ];
}

const JM_ROLES_VERSION = '1';

/** Permisos de cada perfil (además de «read» y «upload_files»). */
function jm_roles_permisos(): array
{
    return [
        'jm_gestor_formacion'  => array_merge(jm_capacidades_tipo('convocatorias'), jm_capacidades_tipo('cursos'), ['jm_solicitudes_formacion']),
        'jm_gestor_maquinaria' => array_merge(jm_capacidades_tipo('maquinas'), ['jm_solicitudes_maquinaria']),
    ];
}

/* Crea o actualiza los perfiles una vez por versión de esta tabla. El
   administrador (y el editor, que antes ya editaba estos tipos) reciben
   todos los permisos nuevos para no perder nada. */
add_action('init', function () {
    if (get_option('jm_roles_version') === JM_ROLES_VERSION) {
        return;
    }
    $nombres = [
        'jm_gestor_formacion'  => 'Gestor de Formación',
        'jm_gestor_maquinaria' => 'Gestor de Maquinaria',
    ];
    foreach (jm_roles_permisos() as $rol => $permisos) {
        remove_role($rol);
        add_role($rol, $nombres[$rol], array_fill_keys(array_merge(['read', 'upload_files'], $permisos), true));
    }
    $todos = array_merge(
        jm_capacidades_tipo('maquinas'),
        jm_capacidades_tipo('cursos'),
        jm_capacidades_tipo('convocatorias'),
        jm_capacidades_tipo('delegaciones'),
        ['jm_solicitudes_formacion', 'jm_solicitudes_maquinaria']
    );
    foreach (['administrator', 'editor'] as $nombre) {
        $rol = get_role($nombre);
        if (!$rol) {
            continue;
        }
        foreach ($todos as $permiso) {
            /* El editor no gestiona delegaciones ni ve solicitudes: solo el administrador. */
            if ($nombre === 'editor' && (str_ends_with($permiso, '_delegaciones') || str_starts_with($permiso, 'jm_solicitudes'))) {
                continue;
            }
            $rol->add_cap($permiso);
        }
    }
    update_option('jm_roles_version', JM_ROLES_VERSION, true);
}, 1);

/** ¿El usuario actual es solo gestor (sin permisos de administrador)? */
function jm_es_gestor(): bool
{
    $u = wp_get_current_user();
    return $u->exists() && !current_user_can('manage_options')
        && (bool) array_intersect(['jm_gestor_formacion', 'jm_gestor_maquinaria'], (array) $u->roles);
}

/* Escritorio limpio para los gestores: sin avisos de otros plugins, sin
   el menú de Elementor ni el «Nuevo» de la barra con cosas que no pueden
   crear. Tras entrar van directos a su módulo. */
add_action('admin_menu', function () {
    if (!jm_es_gestor()) {
        return;
    }
    remove_menu_page('tools.php');
    remove_menu_page('edit-comments.php');
}, 999);

add_action('admin_bar_menu', function ($barra) {
    if (!jm_es_gestor()) {
        return;
    }
    foreach (['comments', 'new-post', 'new-page', 'new-elementor_library', 'elementor_inspector', 'elementor_notes'] as $nodo) {
        $barra->remove_node($nodo);
    }
}, 999);

add_filter('login_redirect', function ($destino, $pedido, $usuario) {
    if (!$usuario instanceof WP_User || $usuario->has_cap('manage_options')) {
        return $destino;
    }
    if (in_array('jm_gestor_formacion', (array) $usuario->roles, true)) {
        return admin_url('admin.php?page=jm-formacion');
    }
    if (in_array('jm_gestor_maquinaria', (array) $usuario->roles, true)) {
        return admin_url('edit.php?post_type=maquina');
    }
    return $destino;
}, 10, 3);
