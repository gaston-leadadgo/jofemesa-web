<?php
/**
 * «Solicitudes» de cada módulo: los envíos de los formularios de Elementor.
 *
 * Elementor Pro solo deja ver sus envíos (Elementor → Envíos) a quien
 * puede «manage_options», es decir, al administrador. Para que cada gestor
 * vea los de su módulo, estas pantallas leen la misma tabla de envíos
 * (wp_e_submissions) filtrada por formulario:
 *
 *   · Formación → Solicitudes: el formulario de /formacion/solicitar/.
 *   · Máquinas → Solicitudes:  el de /consultar-disponibilidad/.
 *
 * Se reconoce el formulario por la página donde está o, si se mueve, por
 * su nombre («…formación…» / «…alquiler…» o «…disponibilidad…»). Los demás
 * formularios (contacto…) solo los ve el administrador, en Elementor.
 *
 * Abrir una solicitud la marca como leída (también en Elementor).
 * «Eliminar» la manda a la papelera de Elementor, de donde el
 * administrador puede recuperarla.
 */

if (!defined('ABSPATH')) {
    exit;
}

const JM_SOL_MODULOS = [
    'formacion'  => [
        'permiso' => 'jm_solicitudes_formacion',
        'pagina'  => 'formacion/solicitar',
        'nombres' => ['formaci'],
        'padre'   => 'jm-formacion',
        'slug'    => 'jm-solicitudes-formacion',
        'titulo'  => 'Solicitudes de formación',
    ],
    'maquinaria' => [
        'permiso' => 'jm_solicitudes_maquinaria',
        'pagina'  => 'consultar-disponibilidad',
        'nombres' => ['alquiler', 'disponibilidad'],
        'padre'   => 'edit.php?post_type=maquina',
        'slug'    => 'jm-solicitudes-maquinaria',
        'titulo'  => 'Solicitudes de alquiler',
    ],
];

function jm_sol_tabla(): string
{
    global $wpdb;
    return $wpdb->prefix . 'e_submissions';
}

function jm_sol_hay_tabla(): bool
{
    global $wpdb;
    static $hay = null;
    if ($hay === null) {
        $hay = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', jm_sol_tabla())) === jm_sol_tabla();
    }
    return $hay;
}

/** Condición SQL de «es un envío de este formulario» (por página o por nombre). */
function jm_sol_condicion(string $modulo): string
{
    global $wpdb;
    $m = JM_SOL_MODULOS[$modulo];
    $o = [];
    $pagina = get_page_by_path($m['pagina']);
    if ($pagina) {
        $o[] = $wpdb->prepare('post_id = %d', $pagina->ID);
    }
    foreach ($m['nombres'] as $n) {
        $o[] = $wpdb->prepare('form_name LIKE %s', '%' . $wpdb->esc_like($n) . '%');
    }
    return '(' . implode(' OR ', $o ?: ['1=0']) . ')';
}

/** WHERE con los envíos del módulo, sin los de la papelera. Uno que encajase
    en los dos formularios (no debería) cuenta solo como de formación. */
function jm_sol_where(string $modulo): string
{
    $w = "status <> 'trash' AND " . jm_sol_condicion($modulo);
    if ($modulo === 'maquinaria') {
        $w .= ' AND NOT ' . jm_sol_condicion('formacion');
    }
    return $w;
}

/** Etiquetas de los campos («ID del campo» → «Etiqueta») del widget de formulario. */
function jm_sol_etiquetas(int $post_id, string $element_id): array
{
    static $cache = [];
    $k = $post_id . '|' . $element_id;
    if (isset($cache[$k])) {
        return $cache[$k];
    }
    $datos = json_decode((string) get_post_meta($post_id, '_elementor_data', true), true);
    $etiquetas = [];
    $buscar = static function ($nodos) use (&$buscar, $element_id, &$etiquetas) {
        foreach ((array) $nodos as $n) {
            if (($n['id'] ?? '') === $element_id) {
                foreach ((array) ($n['settings']['form_fields'] ?? []) as $c) {
                    $id = (string) ($c['custom_id'] ?? '');
                    $etiq = trim((string) ($c['field_label'] ?? ''));
                    if ($id !== '') {
                        $etiquetas[$id] = $etiq !== '' ? $etiq : ($c['placeholder'] ?? $id);
                    }
                }
                return true;
            }
            if (!empty($n['elements']) && $buscar($n['elements'])) {
                return true;
            }
        }
        return false;
    };
    $buscar($datos);
    return $cache[$k] = $etiquetas;
}

function jm_sol_valores(int $id): array
{
    global $wpdb;
    $filas = $wpdb->get_results($wpdb->prepare("SELECT `key`, value FROM {$wpdb->prefix}e_submissions_values WHERE submission_id = %d ORDER BY id", $id), ARRAY_A);
    $v = [];
    foreach ($filas as $f) {
        $v[(string) $f['key']] = (string) $f['value'];
    }
    return $v;
}

/** Nombre y contacto para la lista: los primeros campos con pinta de serlo. */
function jm_sol_resumen(array $v): array
{
    $pick = static function (array $claves) use ($v) {
        foreach ($v as $k => $val) {
            foreach ($claves as $c) {
                if ($val !== '' && stripos($k, $c) !== false) {
                    return $val;
                }
            }
        }
        return '';
    };
    return [
        'nombre'   => $pick(['nombre', 'name', 'contacto']),
        'empresa'  => $pick(['empresa', 'company']),
        'email'    => $pick(['email', 'correo']),
        'telefono' => $pick(['telefono', 'tel', 'phone']),
    ];
}

/* ---------- Menús ---------- */

add_action('admin_menu', function () {
    if (!jm_sol_hay_tabla()) {
        return;
    }
    foreach (JM_SOL_MODULOS as $modulo => $m) {
        $nuevas = current_user_can($m['permiso']) ? jm_sol_sin_leer($modulo) : 0;
        $burbuja = $nuevas ? ' <span class="awaiting-mod">' . (int) $nuevas . '</span>' : '';
        add_submenu_page($m['padre'], $m['titulo'], 'Solicitudes' . $burbuja, $m['permiso'], $m['slug'], function () use ($modulo) {
            jm_sol_pantalla($modulo);
        });
    }
}, 12);

function jm_sol_sin_leer(string $modulo): int
{
    global $wpdb;
    return (int) $wpdb->get_var('SELECT COUNT(*) FROM ' . jm_sol_tabla() . ' WHERE is_read = 0 AND ' . jm_sol_where($modulo));
}

/* ---------- Acciones: eliminar y exportar ---------- */

add_action('admin_init', function () {
    $pagina = (string) ($_GET['page'] ?? '');
    $modulo = null;
    foreach (JM_SOL_MODULOS as $k => $m) {
        if ($m['slug'] === $pagina) {
            $modulo = $k;
        }
    }
    if (!$modulo || !jm_sol_hay_tabla() || !current_user_can(JM_SOL_MODULOS[$modulo]['permiso'])) {
        return;
    }
    global $wpdb;
    $accion = (string) ($_GET['accion'] ?? '');

    if ($accion === 'eliminar' && isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        check_admin_referer('jm_sol_eliminar_' . $id);
        $wpdb->query($wpdb->prepare('UPDATE ' . jm_sol_tabla() . " SET status = 'trash' WHERE id = %d AND " . jm_sol_where($modulo), $id));
        wp_safe_redirect(admin_url('admin.php?page=' . JM_SOL_MODULOS[$modulo]['slug'] . '&eliminada=1'));
        exit;
    }

    if ($accion === 'exportar') {
        check_admin_referer('jm_sol_exportar');
        $filas = $wpdb->get_results('SELECT * FROM ' . jm_sol_tabla() . ' WHERE ' . jm_sol_where($modulo) . ' ORDER BY created_at DESC', ARRAY_A);
        $todas = [];
        $columnas = [];
        foreach ($filas as $f) {
            $v = jm_sol_valores((int) $f['id']);
            $etiq = jm_sol_etiquetas((int) $f['post_id'], (string) $f['element_id']);
            $fila = ['Fecha' => $f['created_at']];
            foreach ($v as $k => $val) {
                $col = $etiq[$k] ?? $k;
                $fila[$col] = $val;
                $columnas[$col] = true;
            }
            $todas[] = $fila;
        }
        $columnas = array_merge(['Fecha'], array_keys($columnas));
        nocache_headers();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="solicitudes-' . $modulo . '-' . wp_date('Y-m-d') . '.csv"');
        $out = fopen('php://output', 'w');
        fwrite($out, "\xEF\xBB\xBF");
        fputcsv($out, $columnas, ';');
        foreach ($todas as $fila) {
            fputcsv($out, array_map(static fn ($c) => $fila[$c] ?? '', $columnas), ';');
        }
        fclose($out);
        exit;
    }
});

/* ---------- Pantalla ---------- */

function jm_sol_pantalla(string $modulo): void
{
    $m = JM_SOL_MODULOS[$modulo];
    if (!current_user_can($m['permiso'])) {
        return;
    }
    global $wpdb;
    $base = admin_url('admin.php?page=' . $m['slug']);
    echo '<div class="wrap jm-sol"><h1 class="wp-heading-inline">' . esc_html($m['titulo']) . '</h1>';

    /* Detalle */
    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        $f = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . jm_sol_tabla() . ' WHERE id = %d AND ' . jm_sol_where($modulo), $id), ARRAY_A);
        echo ' <a class="page-title-action" href="' . esc_url($base) . '">← Volver a la lista</a><hr class="wp-header-end">';
        if (!$f) {
            echo '<p>Esta solicitud no existe o no es de este módulo.</p></div>';
            return;
        }
        if (!(int) $f['is_read']) {
            $wpdb->update(jm_sol_tabla(), ['is_read' => 1], ['id' => $id]);
        }
        $v = jm_sol_valores($id);
        $etiq = jm_sol_etiquetas((int) $f['post_id'], (string) $f['element_id']);
        echo '<p>Recibida el <strong>' . esc_html(mysql2date('j \d\e F \d\e Y, H:i', $f['created_at'])) . '</strong>'
            . ($f['form_name'] ? ' · Formulario «' . esc_html($f['form_name']) . '»' : '') . '</p>';
        echo '<table class="widefat striped" style="max-width:900px"><tbody>';
        foreach ($v as $k => $val) {
            $txt = esc_html($val);
            if (is_email($val)) {
                $txt = '<a href="mailto:' . esc_attr($val) . '">' . $txt . '</a>';
            } elseif (preg_match('/^\+?[\d\s]{9,}$/', $val)) {
                $txt = '<a href="tel:' . esc_attr(preg_replace('/\s+/', '', $val)) . '">' . $txt . '</a>';
            }
            echo '<tr><th style="width:30%">' . esc_html($etiq[$k] ?? $k) . '</th><td>' . nl2br($txt) . '</td></tr>';
        }
        echo '</tbody></table>';
        $borrar = wp_nonce_url(add_query_arg(['accion' => 'eliminar', 'id' => $id], $base), 'jm_sol_eliminar_' . $id);
        echo '<p><a class="button button-link-delete" href="' . esc_url($borrar) . '" onclick="return confirm(\'¿Eliminar esta solicitud?\')">Eliminar solicitud</a></p></div>';
        return;
    }

    /* Lista */
    $exportar = wp_nonce_url(add_query_arg('accion', 'exportar', $base), 'jm_sol_exportar');
    echo ' <a class="page-title-action" href="' . esc_url($exportar) . '">Exportar a Excel (CSV)</a><hr class="wp-header-end">';
    if (isset($_GET['eliminada'])) {
        echo '<div class="notice notice-success is-dismissible"><p>Solicitud eliminada.</p></div>';
    }
    $por_pagina = 25;
    $pag = max(1, (int) ($_GET['paged'] ?? 1));
    $where = jm_sol_where($modulo);
    $total = (int) $wpdb->get_var('SELECT COUNT(*) FROM ' . jm_sol_tabla() . ' WHERE ' . $where);
    $filas = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . jm_sol_tabla() . ' WHERE ' . $where . ' ORDER BY created_at DESC LIMIT %d OFFSET %d', $por_pagina, ($pag - 1) * $por_pagina), ARRAY_A);

    echo '<p>' . $total . ' ' . ($total === 1 ? 'solicitud' : 'solicitudes') . '. Las que están en negrita aún no se han abierto.</p>';
    echo '<table class="widefat striped"><thead><tr><th>Fecha</th><th>Nombre</th><th>Empresa</th><th>Correo</th><th>Teléfono</th><th></th></tr></thead><tbody>';
    if (!$filas) {
        echo '<tr><td colspan="6">Todavía no hay solicitudes.</td></tr>';
    }
    foreach ($filas as $f) {
        $r = jm_sol_resumen(jm_sol_valores((int) $f['id']));
        $url = add_query_arg('id', (int) $f['id'], $base);
        $peso = (int) $f['is_read'] ? '' : ' style="font-weight:600"';
        echo '<tr' . $peso . '><td>' . esc_html(mysql2date('d/m/Y H:i', $f['created_at'])) . '</td>'
            . '<td><a href="' . esc_url($url) . '">' . esc_html($r['nombre'] ?: '(sin nombre)') . '</a></td>'
            . '<td>' . esc_html($r['empresa']) . '</td><td>' . esc_html($r['email']) . '</td><td>' . esc_html($r['telefono']) . '</td>'
            . '<td><a class="button button-small" href="' . esc_url($url) . '">Ver</a></td></tr>';
    }
    echo '</tbody></table>';
    $paginas = (int) ceil($total / $por_pagina);
    if ($paginas > 1) {
        echo '<div class="tablenav"><div class="tablenav-pages">' . paginate_links([
            'base'    => add_query_arg('paged', '%#%', $base),
            'format'  => '',
            'current' => $pag,
            'total'   => $paginas,
        ]) . '</div></div>';
    }
    echo '</div>';
}
