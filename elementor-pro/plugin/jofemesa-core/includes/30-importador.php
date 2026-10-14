<?php
/**
 * Escritorio → JOFEMESA: ajustes de empresa e importador.
 *
 * El importador lee los JSON de datos/ (los genera
 * elementor-pro/scripts/exportar-datos.tsx desde la web Next.js) y crea o
 * actualiza términos y entradas. Es idempotente: se puede ejecutar las
 * veces que haga falta; cada entrada se busca por su slug y se actualiza.
 * Las fotos y fichas PDF se descargan del origen (por defecto el
 * despliegue de Vercel) solo si la máquina todavía no las tiene.
 *
 * También por consola:  wp jofemesa importar  [--paso=maquinas]
 */

if (!defined('ABSPATH')) {
    exit;
}

const JM_PASOS = [
    'terminos'      => 'Familias, alimentaciones, fabricantes, usos y sedes',
    'maquinas'      => 'Máquinas (datos)',
    'medios'        => 'Fotos y fichas técnicas (descarga)',
    'cursos'        => 'Cursos',
    'convocatorias' => 'Convocatorias',
    'delegaciones'  => 'Delegaciones y sede de formación',
    'plantillas'    => 'Plantillas del Theme Builder (vacías, con sus condiciones)',
];
const JM_LOTE = ['maquinas' => 25, 'medios' => 4];

/* ------------------------------------------------------------
   Menú
   ------------------------------------------------------------ */

add_action('admin_menu', function () {
    add_menu_page('JOFEMESA', 'JOFEMESA', 'manage_options', 'jofemesa', 'jm_pantalla_ajustes', 'dashicons-building', 3);
    add_submenu_page('jofemesa', 'Ajustes de empresa', 'Ajustes', 'manage_options', 'jofemesa', 'jm_pantalla_ajustes');
    add_submenu_page('jofemesa', 'Importar datos', 'Importar', 'manage_options', 'jofemesa-importar', 'jm_pantalla_importar');
});

function jm_pantalla_ajustes(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $campos = [
        'telefono'           => ['Teléfono principal', 'Como se lee: 91 361 31 31'],
        'email'              => ['Correo principal', ''],
        'telefono_formacion' => ['Teléfono de Formación', ''],
        'email_formacion'    => ['Correo de Formación', ''],
        'email_avisos'       => ['Correo que recibe las solicitudes', 'Destino por defecto de los formularios.'],
        'fundacion'          => ['Fecha de fundación', 'AAAA-MM-DD. Alimenta el contador de la franja superior.'],
        'linkedin'           => ['LinkedIn', ''],
        'facebook'           => ['Facebook', ''],
        'instagram'          => ['Instagram', ''],
        'whatsapp'           => ['WhatsApp Business', 'Número con prefijo (+34…). Si está vacío, la barra móvil sale sin el botón de WhatsApp.'],
        'origen_media'       => ['Origen de fotos y fichas', 'Web desde la que el importador descarga los medios.'],
    ];
    if (isset($_POST['jm_ajustes']) && check_admin_referer('jm_ajustes')) {
        $limpio = [];
        foreach ($campos as $clave => $_) {
            $v = wp_unslash($_POST['jm_ajustes'][$clave] ?? '');
            $limpio[$clave] = in_array($clave, ['linkedin', 'facebook', 'instagram', 'origen_media'], true)
                ? esc_url_raw($v)
                : sanitize_text_field($v);
        }
        update_option('jm_ajustes', $limpio);
        echo '<div class="notice notice-success"><p>Ajustes guardados.</p></div>';
    }
    echo '<div class="wrap"><h1>JOFEMESA · Ajustes de empresa</h1>';
    echo '<p>Estos datos los leen la cabecera, el pie, los formularios y los shortcodes <code>[jm_dato]</code>. Vacío = valor de la web de origen.</p>';
    echo '<form method="post">';
    wp_nonce_field('jm_ajustes');
    echo '<table class="form-table" role="presentation">';
    foreach ($campos as $clave => [$etiqueta, $ayuda]) {
        printf(
            '<tr><th scope="row"><label for="jm-%1$s">%2$s</label></th><td><input class="regular-text" id="jm-%1$s" name="jm_ajustes[%1$s]" value="%3$s" placeholder="%4$s">%5$s</td></tr>',
            esc_attr($clave),
            esc_html($etiqueta),
            esc_attr((get_option('jm_ajustes', [])[$clave] ?? '')),
            esc_attr((string) (jm_ajustes_por_defecto()[$clave] ?? '')),
            $ayuda ? '<p class="description">' . esc_html($ayuda) . '</p>' : ''
        );
    }
    echo '</table>';
    submit_button('Guardar ajustes');
    echo '</form></div>';
}

function jm_pantalla_importar(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $n = static fn($f) => count(jm_datos($f));
    $nonce = wp_create_nonce('jm_importar');
    ?>
    <div class="wrap">
        <h1>JOFEMESA · Importar datos</h1>
        <p>Crea o actualiza <strong><?php echo esc_html($n('maquinas.json')); ?> máquinas</strong>,
            <strong><?php echo esc_html($n('cursos.json')); ?> cursos</strong>,
            <strong><?php echo esc_html($n('convocatorias.json')); ?> convocatorias</strong> y las delegaciones,
            con sus familias, fotos y fichas técnicas. Se puede repetir sin duplicar nada.</p>
        <p><strong>Ojo:</strong> en máquinas, familias y delegaciones los campos se sobrescriben con los datos de origen.
            Si has editado textos en el escritorio, impórtalo antes de editar o vuelve a hacer tus cambios después.<br>
            <strong>Cursos y convocatorias</strong> solo se crean si faltan: los que ya existen (los gestiona Formación) no se tocan nunca.</p>
        <p>Origen de fotos y fichas: <code><?php echo esc_html(jm_ajuste('origen_media')); ?></code>
            (se cambia en <a href="<?php echo esc_url(admin_url('admin.php?page=jofemesa')); ?>">Ajustes</a>).</p>
        <ol id="jm-pasos">
            <?php foreach (JM_PASOS as $id => $etiqueta) : ?>
                <li data-paso="<?php echo esc_attr($id); ?>"><?php echo esc_html($etiqueta); ?> · <span>pendiente</span>
                    · <button type="button" class="button-link" data-solo="<?php echo esc_attr($id); ?>">Solo este paso</button></li>
            <?php endforeach; ?>
        </ol>
        <p><button class="button button-primary" id="jm-importar">Importar todo</button>
            <label style="margin-left:1em"><input type="checkbox" id="jm-sin-medios"> Sin descargar fotos ni fichas</label></p>
        <pre id="jm-registro" style="max-height:320px;overflow:auto;background:#fff;border:1px solid #ccd0d4;padding:12px"></pre>
    </div>
    <script>
    (function () {
        var boton = document.getElementById('jm-importar');
        var registro = document.getElementById('jm-registro');
        var pasos = <?php echo wp_json_encode(array_keys(JM_PASOS)); ?>;
        function anotar(t) { registro.textContent += t + "\n"; registro.scrollTop = registro.scrollHeight; }
        function estado(paso, t) { var li = document.querySelector('[data-paso="' + paso + '"] span'); if (li) li.textContent = t; }
        async function ejecutar(paso, desde) {
            var datos = new FormData();
            datos.append('action', 'jm_importar');
            datos.append('_ajax_nonce', '<?php echo esc_js($nonce); ?>');
            datos.append('paso', paso);
            datos.append('desde', desde);
            var r = await fetch(ajaxurl, { method: 'POST', body: datos, credentials: 'same-origin' });
            var j = await r.json();
            if (!j.success) throw new Error((j.data && j.data.mensaje) || 'Error en ' + paso);
            return j.data;
        }
        async function correr(lista) {
            boton.disabled = true;
            var sinMedios = document.getElementById('jm-sin-medios').checked;
            try {
                for (var i = 0; i < lista.length; i++) {
                    var paso = lista[i];
                    if (sinMedios && paso === 'medios' && lista.length > 1) { estado(paso, 'omitido'); continue; }
                    var desde = 0;
                    while (desde !== null) {
                        estado(paso, 'en curso…');
                        var res = await ejecutar(paso, desde);
                        (res.registro || []).forEach(anotar);
                        estado(paso, res.hecho + ' de ' + res.total);
                        desde = res.siguiente;
                    }
                    estado(paso, 'hecho');
                }
                anotar(lista.length > 1 ? 'Importación terminada. Guarda los enlaces permanentes (Ajustes → Enlaces permanentes) si es la primera vez.' : 'Paso terminado.');
            } catch (e) {
                anotar('ERROR: ' + e.message + ' · Vuelve a pulsar: retoma sin duplicar.');
            }
            boton.disabled = false;
        }
        boton.addEventListener('click', function () { correr(pasos); });
        document.querySelectorAll('[data-solo]').forEach(function (b) {
            b.addEventListener('click', function () { correr([b.getAttribute('data-solo')]); });
        });
    })();
    </script>
    <?php
}

add_action('wp_ajax_jm_importar', function () {
    check_ajax_referer('jm_importar');
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['mensaje' => 'Sin permisos.'], 403);
    }
    @set_time_limit(120);
    $paso = sanitize_key($_POST['paso'] ?? '');
    $desde = (int) ($_POST['desde'] ?? 0);
    if (!isset(JM_PASOS[$paso])) {
        wp_send_json_error(['mensaje' => 'Paso desconocido.']);
    }
    try {
        wp_send_json_success(jm_importar_paso($paso, $desde));
    } catch (Throwable $e) {
        wp_send_json_error(['mensaje' => $e->getMessage()]);
    }
});

/* ------------------------------------------------------------
   Pasos
   ------------------------------------------------------------ */

/** @return array{hecho:int,total:int,siguiente:?int,registro:string[]} */
function jm_importar_paso(string $paso, int $desde = 0): array
{
    switch ($paso) {
        case 'terminos':
            return jm_importar_terminos();
        case 'maquinas':
            return jm_importar_maquinas($desde);
        case 'medios':
            return jm_importar_medios($desde);
        case 'cursos':
            return jm_importar_cursos();
        case 'convocatorias':
            return jm_importar_convocatorias();
        case 'delegaciones':
            return jm_importar_delegaciones();
        case 'plantillas':
            return jm_importar_plantillas();
    }
    return ['hecho' => 0, 'total' => 0, 'siguiente' => null, 'registro' => []];
}

/** Crea o actualiza un término y devuelve su ID. */
function jm_termino(string $taxonomia, string $slug, string $nombre, int $padre = 0, string $descripcion = ''): int
{
    $existente = get_term_by('slug', $slug, $taxonomia);
    $args = ['slug' => $slug, 'parent' => $padre, 'description' => $descripcion];
    if ($existente) {
        $r = wp_update_term($existente->term_id, $taxonomia, $args + ['name' => $nombre]);
    } else {
        $r = wp_insert_term($nombre, $taxonomia, $args);
    }
    if (is_wp_error($r)) {
        throw new RuntimeException($taxonomia . ' «' . $nombre . '»: ' . $r->get_error_message());
    }
    return (int) $r['term_id'];
}

/** Crea o actualiza una entrada por su slug y devuelve su ID. */
function jm_entrada(string $tipo, string $slug, string $titulo, array $extra = []): int
{
    $existente = get_page_by_path($slug, OBJECT, $tipo);
    $datos = array_merge([
        'post_type'   => $tipo,
        'post_name'   => $slug,
        'post_title'  => $titulo,
        'post_status' => 'publish',
    ], $extra);
    if ($existente) {
        $datos['ID'] = $existente->ID;
        $id = wp_update_post(wp_slash($datos), true);
    } else {
        $id = wp_insert_post(wp_slash($datos), true);
    }
    if (is_wp_error($id)) {
        throw new RuntimeException($tipo . ' «' . $titulo . '»: ' . $id->get_error_message());
    }
    return (int) $id;
}

function jm_importar_terminos(): array
{
    $registro = [];
    foreach (jm_datos('familias.json') as $i => $f) {
        $id = jm_termino('familia', $f['slug'], $f['nombre'], 0, $f['descripcion']);
        foreach ([
            'jm_nombre_largo' => $f['nombreLargo'], 'jm_claim' => $f['claim'], 'jm_descripcion' => $f['descripcion'],
            'jm_rango' => $f['rango'], 'jm_necesidad' => $f['necesidad'], 'jm_necesidad_desc' => $f['necesidadDesc'],
            'jm_icono' => $f['icono'], 'jm_total' => $f['total'], 'jm_orden' => $i, 'jm_id' => $f['id'],
        ] as $k => $v) {
            jm_guardar_campo_termino($id, $k, $v);
        }
        foreach ($f['subcategorias'] as $j => $s) {
            $sid = jm_termino('familia', $s['slug'], $s['nombre'], $id, $s['descripcion']);
            foreach (['jm_claim' => $s['claim'], 'jm_descripcion' => $s['descripcion'], 'jm_icono' => $s['icono'], 'jm_total' => $s['total'], 'jm_orden' => $j] as $k => $v) {
                jm_guardar_campo_termino($sid, $k, $v);
            }
        }
        $registro[] = 'Familia ' . $f['nombre'] . ' con ' . count($f['subcategorias']) . ' subcategorías';
    }
    foreach (['electrico' => 'Eléctrico', 'diesel' => 'Diésel', 'hibrido' => 'Híbrido', 'gasolina' => 'Gasolina'] as $slug => $nombre) {
        jm_termino('energia', $slug, $nombre);
    }
    foreach (['interior' => 'Interior', 'exterior' => 'Exterior'] as $slug => $nombre) {
        jm_termino('entorno', $slug, $nombre);
    }
    $marcas = array_unique(array_column(jm_datos('maquinas.json'), 'marca'));
    foreach ($marcas as $marca) {
        jm_termino('fabricante', sanitize_title($marca), $marca);
    }
    foreach (jm_datos('sedes-formacion.json') as $s) {
        $id = jm_termino('sede_formacion', $s['id'], $s['nombre']);
        foreach (['jm_tipo' => $s['tipo'], 'jm_zona' => $s['zona'], 'jm_direccion' => $s['direccion'], 'jm_cp' => $s['cp'], 'jm_localidad' => $s['localidad'], 'jm_maps' => $s['maps'], 'jm_telefono' => $s['telefono'], 'jm_tel' => $s['tel'], 'jm_email' => $s['email']] as $k => $v) {
            jm_guardar_campo_termino($id, $k, $v);
        }
    }
    $registro[] = count($marcas) . ' fabricantes, alimentaciones, usos y sedes de formación';
    return ['hecho' => 1, 'total' => 1, 'siguiente' => null, 'registro' => $registro];
}

/** ID de familia de Next → slug del término (manipulacion → manutencion…). */
function jm_slug_familia(string $id): string
{
    foreach (jm_datos('familias.json') as $f) {
        if ($f['id'] === $id) {
            return $f['slug'];
        }
    }
    return $id;
}

function jm_importar_maquinas(int $desde): array
{
    $todas = jm_datos('maquinas.json');
    $lote = array_slice($todas, $desde, JM_LOTE['maquinas']);
    $registro = [];
    foreach ($lote as $m) {
        $id = jm_entrada('maquina', $m['slug'], $m['titulo'], ['menu_order' => $m['orden']]);
        $campos = [
            'jm_slug' => $m['slug'], 'jm_marca' => $m['marca'], 'jm_modelo' => $m['modelo'],
            'jm_descripcion' => $m['descripcionCorta'], 'jm_subcategoria_nombre' => $m['subcategoriaNombre'],
            'jm_energia' => $m['energia'], 'jm_energia_nombre' => $m['energiaNombre'],
            'jm_altura' => $m['altura'] ?? '', 'jm_carga' => $m['carga'] ?? '',
            'jm_destacados' => implode("\n", $m['destacados']), 'jm_aplicaciones' => implode("\n", $m['aplicaciones']),
            'jm_ficha_bytes' => $m['ficha']['bytes'] ?? '', 'jm_icono' => $m['icono'], 'jm_orden' => $m['orden'],
            'jm_destacada' => $m['destacada'] ? '1' : '0', 'jm_gama' => $m['gama'] ? '1' : '0',
        ];
        foreach ($campos as $k => $v) {
            jm_guardar_campo($id, $k, $v);
        }
        foreach (['tarjeta', 'specs', 'comparador', 'relacionadas', 'entornos', 'trabajos', 'lineas', 'delegaciones'] as $k) {
            update_post_meta($id, '_jmj_' . $k, wp_slash(wp_json_encode($m[$k], JSON_UNESCAPED_UNICODE)));
        }
        update_post_meta($id, '_jmj_busqueda', $m['busqueda']);
        update_post_meta($id, '_jmj_en_alquiler', $m['enAlquiler'] ? '1' : '0');
        update_post_meta($id, '_jmj_origen_foto', $m['foto']['ruta'] ?? '');
        update_post_meta($id, '_jmj_origen_ficha', $m['ficha']['ruta'] ?? '');
        update_post_meta($id, '_jmj_alt_foto', $m['foto']['alt'] ?? '');

        $fam = get_term_by('slug', jm_slug_familia($m['familia']), 'familia');
        $sub = get_term_by('slug', $m['subcategoria'], 'familia');
        wp_set_object_terms($id, array_values(array_filter([$fam ? $fam->term_id : 0, $sub ? $sub->term_id : 0])), 'familia');
        wp_set_object_terms($id, [$m['energia']], 'energia');
        wp_set_object_terms($id, $m['entornos'], 'entorno');
        wp_set_object_terms($id, [sanitize_title($m['marca'])], 'fabricante');
    }
    $hecho = min($desde + count($lote), count($todas));
    $registro[] = 'Máquinas ' . ($desde + 1) . '–' . $hecho . ' de ' . count($todas);
    return ['hecho' => $hecho, 'total' => count($todas), 'siguiente' => $hecho < count($todas) ? $hecho : null, 'registro' => $registro];
}

/** Descarga un archivo del origen y lo adjunta a la entrada. */
function jm_descargar(string $ruta, int $post_id, string $nombre, string $titulo): int
{
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';
    $tmp = download_url(jm_url_media($ruta), 90);
    if (is_wp_error($tmp)) {
        throw new RuntimeException('No se pudo descargar ' . $ruta . ': ' . $tmp->get_error_message());
    }
    $id = media_handle_sideload(['name' => $nombre, 'tmp_name' => $tmp], $post_id, $titulo);
    if (is_wp_error($id)) {
        @unlink($tmp);
        throw new RuntimeException('No se pudo guardar ' . $nombre . ': ' . $id->get_error_message());
    }
    return (int) $id;
}

function jm_importar_medios(int $desde): array
{
    $con_medios = array_values(array_filter(jm_datos('maquinas.json'), static fn($m) => $m['foto'] || $m['ficha']));
    $lote = array_slice($con_medios, $desde, JM_LOTE['medios']);
    $registro = [];
    foreach ($lote as $m) {
        $id = jm_maquina_por_slug($m['slug']);
        if (!$id) {
            continue;
        }
        if ($m['foto'] && !has_post_thumbnail($id)) {
            $ext = pathinfo($m['foto']['ruta'], PATHINFO_EXTENSION) ?: 'webp';
            $foto = jm_descargar($m['foto']['ruta'], $id, $m['slug'] . '.' . $ext, $m['titulo']);
            update_post_meta($foto, '_wp_attachment_image_alt', $m['foto']['alt']);
            set_post_thumbnail($id, $foto);
            $registro[] = 'Foto · ' . $m['titulo'];
        }
        if ($m['ficha'] && !get_post_meta($id, 'jm_ficha_pdf', true)) {
            $pdf = jm_descargar($m['ficha']['ruta'], $id, $m['slug'] . '.pdf', 'Ficha técnica ' . $m['titulo']);
            jm_guardar_campo($id, 'jm_ficha_pdf', $pdf);
            jm_guardar_campo($id, 'jm_ficha_bytes', (int) filesize(get_attached_file($pdf)));
            $registro[] = 'Ficha · ' . $m['titulo'];
        }
    }
    $hecho = min($desde + count($lote), count($con_medios));
    return ['hecho' => $hecho, 'total' => count($con_medios), 'siguiente' => $hecho < count($con_medios) ? $hecho : null, 'registro' => $registro];
}

/** Las preguntas del curso, como HTML del contenido de la entrada. */
function jm_html_preguntas(array $curso): string
{
    $html = '';
    $enlace = '<a href="' . esc_url(home_url('/formacion/#calendario')) . '">calendario de convocatorias abiertas</a>';
    foreach ($curso['preguntas'] as $q) {
        $html .= '<h3>' . esc_html($q['p']) . "</h3>\n";
        foreach ($q['r'] as $parrafo) {
            $clase = str_starts_with($parrafo, 'Nota:') ? ' class="jm-nota"' : '';
            $texto = str_replace('{calendario}', '%%CAL%%', esc_html($parrafo));
            $html .= '<p' . $clase . '>' . str_replace('%%CAL%%', $enlace, $texto) . "</p>\n";
        }
    }
    return $html;
}

/*
 * Cursos y convocatorias: a partir de la primera importación los gestiona
 * Formación desde el escritorio (Formación → Panel). Por eso estos dos pasos
 * SOLO CREAN lo que falta y nunca sobrescriben un curso o una convocatoria
 * que ya existe (aunque esté en la papelera): repetir la importación no
 * puede deshacer el trabajo del cliente.
 */
function jm_existe_entrada(string $tipo, string $slug): bool
{
    return (bool) get_posts([
        'post_type'   => $tipo,
        'name'        => $slug,
        'post_status' => ['publish', 'draft', 'pending', 'private', 'future', 'trash'],
        'numberposts' => 1,
        'fields'      => 'ids',
    ]);
}

function jm_importar_cursos(): array
{
    $cursos = jm_datos('cursos.json');
    $nuevos = 0;
    /* El importador ya escribe todos los datos: sin los automatismos del
       panel al guardar (80-panel-formacion.php), que verían la entrada antes
       de tener sus campos. */
    $GLOBALS['jm_fo_lote'] = true;
    foreach ($cursos as $c) {
        if (jm_existe_entrada('curso', $c['id'])) {
            continue;
        }
        $id = jm_entrada('curso', $c['id'], $c['nombre'], ['post_content' => jm_html_preguntas($c), 'menu_order' => $c['orden']]);
        foreach ([
            'jm_titulo_largo' => $c['titulo'], 'jm_nombre_corto' => $c['corto'], 'jm_norma' => $c['norma'] ?? '',
            'jm_certificacion' => $c['certificacion'] ?? '', 'jm_normativa' => implode(' · ', $c['normativa']),
            'jm_duracion' => $c['duracion'], 'jm_modalidad' => $c['modalidad'], 'jm_descripcion' => $c['descripcion'],
            'jm_para_quien' => $c['paraQuien'], 'jm_orden' => $c['orden'],
        ] as $k => $v) {
            jm_guardar_campo($id, $k, $v);
        }
        $nuevos++;
    }
    $GLOBALS['jm_fo_lote'] = false;
    $texto = $nuevos . ' cursos creados';
    if ($nuevos < count($cursos)) {
        $texto .= ' · ' . (count($cursos) - $nuevos) . ' ya existían y no se han tocado';
    }
    return ['hecho' => count($cursos), 'total' => count($cursos), 'siguiente' => null, 'registro' => [$texto]];
}

function jm_importar_convocatorias(): array
{
    $sedes = [];
    foreach (jm_datos('sedes-formacion.json') as $s) {
        $sedes[$s['id']] = $s['nombre'];
    }
    $lista = jm_datos('convocatorias.json');
    $nuevas = 0;
    $GLOBALS['jm_fo_lote'] = true;
    foreach ($lista as $cv) {
        if (jm_existe_entrada('convocatoria', $cv['id'])) {
            continue;
        }
        $curso = get_page_by_path($cv['curso'], OBJECT, 'curso');
        if (!$curso) {
            throw new RuntimeException('Falta el curso «' . $cv['curso'] . '»: importa primero los cursos.');
        }
        [$a, $m, $d] = explode('-', $cv['fecha']);
        $titulo = $curso->post_title . ' · ' . $d . '/' . $m . '/' . $a . ' · ' . ($sedes[$cv['sede']] ?? $cv['sede']);
        $id = jm_entrada('convocatoria', $cv['id'], $titulo);
        foreach ([
            'jm_curso' => $curso->ID, 'jm_fecha' => $a . $m . $d, 'jm_inicio' => $cv['inicio'], 'jm_fin' => $cv['fin'],
            'jm_plazas' => $cv['plazas'] ?? '', 'jm_ocupadas' => $cv['ocupadas'] ?? '',
        ] as $k => $v) {
            jm_guardar_campo($id, $k, $v);
        }
        wp_set_object_terms($id, [$cv['sede']], 'sede_formacion');
        $termino = get_term_by('slug', $cv['sede'], 'sede_formacion');
        if ($termino) {
            jm_guardar_campo($id, 'jm_sede', (int) $termino->term_id);
        }
        $nuevas++;
    }
    $GLOBALS['jm_fo_lote'] = false;
    /* «Convocatoria abierta / A medida» de cada curso sale de sus fechas. */
    if (function_exists('jm_fo_recalcular_cursos')) {
        jm_fo_recalcular_cursos();
    }
    $texto = $nuevas . ' convocatorias creadas';
    if ($nuevas < count($lista)) {
        $texto .= ' · ' . (count($lista) - $nuevas) . ' ya existían y no se han tocado';
    }
    return ['hecho' => count($lista), 'total' => count($lista), 'siguiente' => null, 'registro' => [$texto]];
}

function jm_importar_delegaciones(): array
{
    $puntos = jm_datos('empresa.json')['puntosContacto'] ?? [];
    foreach ($puntos as $i => $p) {
        $id = jm_entrada('delegacion', $p['id'], $p['nombre'], ['menu_order' => $i]);
        foreach ([
            'jm_tipo' => $p['tipo'] ?? 'Delegación', 'jm_localidad' => $p['localidad'] ?? '', 'jm_direccion' => $p['direccion'] ?? '',
            'jm_cp' => $p['cp'] ?? '', 'jm_provincia' => $p['provincia'] ?? '', 'jm_pais' => $p['pais'] ?? 'España',
            'jm_telefono' => $p['telefono'] ?? '', 'jm_tel' => $p['tel'] ?? '', 'jm_email' => $p['email'] ?? '',
            'jm_maps' => $p['maps'] ?? jm_url_maps($p), 'jm_central' => !empty($p['central']) ? '1' : '0', 'jm_orden' => $i,
            'jm_servicios' => implode("\n", $p['servicios'] ?? []),
        ] as $k => $v) {
            jm_guardar_campo($id, $k, $v);
        }
    }
    return ['hecho' => count($puntos), 'total' => count($puntos), 'siguiente' => null, 'registro' => [count($puntos) . ' delegaciones y sedes']];
}

/**
 * Plantillas vacías del Theme Builder con sus condiciones (ver
 * estructura/00-ajustes-globales.md §7). Solo crea las que faltan: si ya
 * existe una con la misma clave, no la toca (su contenido es el montaje).
 */
const JM_PLANTILLAS = [
    'cabecera'           => ['Cabecera', 'header', ['include/general'], ''],
    'pie'                => ['Pie', 'footer', ['include/general'], ''],
    'ficha-maquina'      => ['Ficha de máquina', 'single-post', ['include/singular/maquina'], 'maquina'],
    'listado-familia'    => ['Listado de familia', 'archive', ['include/archive/familia'], ''],
    'ficha-curso'        => ['Ficha de curso', 'single-post', ['include/singular/curso'], 'curso'],
    'error-404'          => ['Página 404', 'error-404', ['include/singular/not_found404'], ''],
    'tarjeta-maquina'    => ['Tarjeta de máquina', 'loop-item', [], 'maquina'],
    'tarjeta-curso'      => ['Tarjeta de curso', 'loop-item', [], 'curso'],
    'fila-convocatoria'  => ['Fila de convocatoria', 'loop-item', [], 'convocatoria'],
    'tarjeta-delegacion' => ['Tarjeta de delegación', 'loop-item', [], 'delegacion'],
    'contacto-delegacion' => ['Delegación · contacto', 'loop-item', [], 'delegacion'],
];

/**
 * Rehace la caché de condiciones del Theme Builder cuando el importador lo
 * pide o cuando está vacía habiendo plantillas con condiciones (por ejemplo,
 * tras una migración). Sin esa caché, cabecera, pie y fichas no se aplican.
 */
add_action('admin_init', function () {
    if (!class_exists('\ElementorPro\Modules\ThemeBuilder\Module')) {
        return;
    }
    $pedido = get_option('jm_regenerar_condiciones');
    if (!$pedido && get_option('elementor_pro_theme_builder_conditions')) {
        return;
    }
    if (!$pedido && !get_posts(['post_type' => 'elementor_library', 'numberposts' => 1, 'fields' => 'ids', 'meta_key' => '_elementor_conditions'])) {
        return;
    }
    $gestor = \ElementorPro\Modules\ThemeBuilder\Module::instance()->get_conditions_manager();
    if (method_exists($gestor, 'get_cache')) {
        $gestor->get_cache()->regenerate();
    }
    delete_option('jm_regenerar_condiciones');
});

function jm_importar_plantillas(): array
{
    if (!post_type_exists('elementor_library')) {
        throw new RuntimeException('Elementor no está activo.');
    }
    $registro = [];
    foreach (JM_PLANTILLAS as $clave => [$titulo, $tipo, $condiciones, $fuente]) {
        $existe = get_posts([
            'post_type'   => 'elementor_library',
            'post_status' => 'any',
            'numberposts' => 1,
            'fields'      => 'ids',
            'meta_key'    => '_jm_plantilla',
            'meta_value'  => $clave,
        ]);
        if ($existe) {
            $registro[] = $titulo . ': ya existía (ID ' . $existe[0] . ')';
            continue;
        }
        $id = wp_insert_post(['post_type' => 'elementor_library', 'post_status' => 'publish', 'post_title' => $titulo], true);
        if (is_wp_error($id)) {
            throw new RuntimeException($titulo . ': ' . $id->get_error_message());
        }
        update_post_meta($id, '_jm_plantilla', $clave);
        update_post_meta($id, '_elementor_template_type', $tipo);
        update_post_meta($id, '_elementor_edit_mode', 'builder');
        update_post_meta($id, '_elementor_data', '[]');
        if (defined('ELEMENTOR_VERSION')) {
            update_post_meta($id, '_elementor_version', ELEMENTOR_VERSION);
        }
        wp_set_object_terms($id, $tipo, 'elementor_library_type');
        if ($condiciones) {
            update_post_meta($id, '_elementor_conditions', $condiciones);
        }
        if ($fuente) {
            /* Fuente del Loop Item y vista previa de la plantilla individual. */
            $muestra = get_posts(['post_type' => $fuente, 'numberposts' => 1, 'fields' => 'ids']);
            $ajustes = $tipo === 'loop-item'
                ? ['source' => $fuente]
                : ['preview_type' => 'single/' . $fuente, 'preview_id' => $muestra ? (string) $muestra[0] : ''];
            update_post_meta($id, '_elementor_page_settings', $ajustes);
        }
        $registro[] = $titulo . ': creada (ID ' . $id . ')';
    }
    /* La caché de condiciones de Elementor Pro se rehace en la siguiente
       carga del escritorio (jm_regenerar_condiciones): en esta misma
       petición Elementor aún recuerda las plantillas recién creadas como
       páginas normales y las descartaría. */
    update_option('jm_regenerar_condiciones', 1, false);
    $registro[] = 'Las condiciones se activan al cargar cualquier pantalla del escritorio.';
    return ['hecho' => count(JM_PLANTILLAS), 'total' => count(JM_PLANTILLAS), 'siguiente' => null, 'registro' => $registro];
}

/** Igual que src/lib/utils/maps.ts: búsqueda de Google Maps por dirección. */
function jm_url_maps(array $p): string
{
    $partes = array_filter([$p['direccion'] ?? '', $p['cp'] ?? '', $p['localidad'] ?? '', $p['pais'] ?? '']);
    return 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode(implode(', ', $partes));
}

/* ------------------------------------------------------------
   WP-CLI
   ------------------------------------------------------------ */

if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('jofemesa importar', function ($args, $opciones) {
        $pasos = isset($opciones['paso']) ? [$opciones['paso']] : array_keys(JM_PASOS);
        foreach ($pasos as $paso) {
            if (!isset(JM_PASOS[$paso])) {
                WP_CLI::error('Paso desconocido: ' . $paso);
            }
            $desde = 0;
            while ($desde !== null) {
                $r = jm_importar_paso($paso, $desde);
                foreach ($r['registro'] as $linea) {
                    WP_CLI::log($linea);
                }
                $desde = $r['siguiente'];
            }
            WP_CLI::success(JM_PASOS[$paso]);
        }
        flush_rewrite_rules();
    });
}
