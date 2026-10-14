<?php
/**
 * Formación → Guía de uso. El manual del cliente dentro del escritorio.
 * La misma guía, para enviar o imprimir, está en
 * elementor-pro/MANUAL-FORMACION.md: si cambias una, cambia la otra.
 */

if (!defined('ABSPATH')) {
    exit;
}

function jm_fo_pantalla_guia(): void
{
    if (!current_user_can('edit_posts')) {
        return;
    }
    $panel = admin_url('admin.php?page=jm-formacion');
    $pasos = [
        'organizacion' => 'Cómo está organizado',
        'fechas'       => 'Programar fechas',
        'cambiar'      => 'Cambiar o anular una fecha',
        'plazas'       => 'Plazas',
        'curso'        => 'Crear o editar un curso',
        'sedes'        => 'Sedes',
        'automatico'   => 'Lo que se hace solo',
        'dudas'        => 'Preguntas frecuentes',
    ];
    ?>
    <div class="wrap jm-adm-panel jm-adm-guia">
        <h1 class="screen-reader-text">Guía de uso de Formación</h1>
        <?php echo jm_fo_cabecera('guia'); // phpcs:ignore ?>
        <hr class="wp-header-end">

        <header class="jm-adm-hero">
            <div>
                <p class="jm-adm-eyebrow">Guía de uso</p>
                <h2 class="jm-adm-hero__titulo">Cómo gestionar la formación</h2>
                <p class="jm-adm-hero__texto">Todo lo de Formación se gestiona desde este menú. No hace falta abrir Elementor ni tocar el diseño: la web se actualiza sola con lo que guardes aquí.</p>
            </div>
            <div class="jm-adm-hero__acciones">
                <a class="jm-adm-btn jm-adm-btn--primario" href="<?php echo esc_url($panel); ?>"><?php echo jm_fo_adm_icono('grid', 18); // phpcs:ignore ?> Ir al panel</a>
            </div>
        </header>

        <div class="jm-adm-guia__cuerpo">
            <nav class="jm-adm-guia__indice" aria-label="Índice de la guía">
                <p class="jm-adm-eyebrow">En esta guía</p>
                <ol>
                    <?php foreach ($pasos as $ancla => $texto) : ?>
                        <li><a href="#<?php echo esc_attr($ancla); ?>"><?php echo esc_html($texto); ?></a></li>
                    <?php endforeach; ?>
                </ol>
            </nav>

            <div class="jm-adm-guia__texto">
                <section id="organizacion" class="jm-adm-tarjeta">
                    <h2><span class="jm-adm-guia__n">1</span> Cómo está organizado</h2>
                    <div class="jm-adm-guia__rejilla">
                        <div><strong><?php echo jm_fo_adm_icono('grid', 16); // phpcs:ignore ?> Panel</strong><p>El día a día: programar fechas, ver la agenda, ajustar plazas y el calendario del mes.</p></div>
                        <div><strong><?php echo jm_fo_adm_icono('calendar', 16); // phpcs:ignore ?> Convocatorias</strong><p>Cada fecha concreta de un curso en una sede. Es lo que sale en el calendario de la web.</p></div>
                        <div><strong><?php echo jm_fo_adm_icono('book', 16); // phpcs:ignore ?> Cursos</strong><p>La ficha de cada curso: nombre, norma, duración, descripción y preguntas frecuentes.</p></div>
                        <div><strong><?php echo jm_fo_adm_icono('pin', 16); // phpcs:ignore ?> Sedes</strong><p>Los centros donde se imparte: nombre, dirección y enlace al mapa.</p></div>
                    </div>
                </section>

                <section id="fechas" class="jm-adm-tarjeta">
                    <h2><span class="jm-adm-guia__n">2</span> Programar fechas</h2>
                    <p>Una <strong>convocatoria</strong> es un curso en una fecha y una sede. Puedes crear varias de una vez:</p>
                    <ol class="jm-adm-guia__pasos">
                        <li>Abre <a href="<?php echo esc_url($panel . '#nueva'); ?>">Formación → Panel</a> y busca <strong>Programar fechas</strong>.</li>
                        <li>Elige el <strong>curso</strong> y la <strong>sede</strong>.</li>
                        <li>Añade las <strong>fechas</strong>: elige un día y pulsa <em>Añadir fecha</em>, o pulsa directamente los días en el calendario de la derecha. Puedes añadir todas las que quieras; para quitar una, pulsa su ×.</li>
                        <li>Revisa el <strong>horario</strong> (por defecto 07:30–15:30) y, si quieres, las <strong>plazas</strong>.</li>
                        <li>Pulsa <strong>Crear convocatorias</strong>. Se publican al momento y aparecen resaltadas en la agenda.</li>
                    </ol>
                    <p class="jm-adm-guia__truco"><?php echo jm_fo_adm_icono('repeat', 16); // phpcs:ignore ?> <span><strong>Atajo:</strong> en la agenda, el botón <em>Programar otra fecha igual</em> rellena el formulario con el mismo curso, sede, horario y plazas. Solo tienes que elegir el día.</span></p>
                    <p>Si una fecha ya existe para ese curso y esa sede, no se duplica: el panel te avisa.</p>
                </section>

                <section id="cambiar" class="jm-adm-tarjeta">
                    <h2><span class="jm-adm-guia__n">3</span> Cambiar o anular una fecha</h2>
                    <ul class="jm-adm-guia__lista">
                        <li><strong>Cambiar el día, la hora o la sede:</strong> en la agenda pulsa el lápiz, cambia lo que necesites y pulsa <em>Actualizar</em>. El título se rehace solo.</li>
                        <li><strong>Anular una fecha:</strong> pulsa la papelera. Desaparece de la web al instante. Si te equivocas, pulsa <em>Deshacer</em> en el aviso que aparece abajo, o recupérala desde <em>Convocatorias → Papelera</em>.</li>
                        <li><strong>Una fecha ya celebrada</strong> no hay que borrarla: deja de verse en la web sola. Queda en la pestaña <em>Celebradas</em> como histórico.</li>
                    </ul>
                </section>

                <section id="plazas" class="jm-adm-tarjeta">
                    <h2><span class="jm-adm-guia__n">4</span> Plazas</h2>
                    <p>Las plazas son <strong>opcionales</strong>. Si una convocatoria no tiene plazas totales, la web muestra «Consultar plazas».</p>
                    <p>Si indicas las plazas totales, en la agenda aparece una barra con los botones <strong>−</strong> y <strong>+</strong> para ir apuntando las que se ocupan. La web cambia el mensaje sola:</p>
                    <div class="jm-adm-guia__plazas">
                        <span class="jm-adm-plazas jm-adm-plazas--ok jm-adm-plazas--mini"><span class="jm-adm-plazas__cab"><span class="jm-adm-plazas__texto">8 libres</span><span class="jm-adm-plazas__n">4/12</span></span><span class="jm-adm-plazas__barra"><span style="width:33%"></span></span></span>
                        <span class="jm-adm-plazas jm-adm-plazas--ultimas jm-adm-plazas--mini"><span class="jm-adm-plazas__cab"><span class="jm-adm-plazas__texto">Últimas 3 plazas</span><span class="jm-adm-plazas__n">9/12</span></span><span class="jm-adm-plazas__barra"><span style="width:75%"></span></span></span>
                        <span class="jm-adm-plazas jm-adm-plazas--completo jm-adm-plazas--mini"><span class="jm-adm-plazas__cab"><span class="jm-adm-plazas__texto">Completo</span><span class="jm-adm-plazas__n">12/12</span></span><span class="jm-adm-plazas__barra"><span style="width:100%"></span></span></span>
                    </div>
                </section>

                <section id="curso" class="jm-adm-tarjeta">
                    <h2><span class="jm-adm-guia__n">5</span> Crear o editar un curso</h2>
                    <ol class="jm-adm-guia__pasos">
                        <li>Ve a <a href="<?php echo esc_url(admin_url('post-new.php?post_type=curso')); ?>">Formación → Cursos → Añadir curso</a>.</li>
                        <li>Escribe el <strong>nombre del curso</strong> arriba. Es el que se ve en las tarjetas y en el formulario.</li>
                        <li>Rellena los <strong>datos del curso</strong>. Solo el nombre es imprescindible; si dejas vacíos el <em>título completo</em> o el <em>nombre corto</em>, se usa el nombre.</li>
                        <li>Debajo, en el editor, escribe las <strong>preguntas frecuentes</strong> de la ficha: cada pregunta con el formato <em>Encabezado 3</em> y su respuesta en párrafos normales.</li>
                        <li>Pulsa <strong>Publicar</strong> y después <strong>Programar fechas</strong> en la caja de la derecha.</li>
                    </ol>
                    <p class="jm-adm-guia__truco"><?php echo jm_fo_adm_icono('info', 16); // phpcs:ignore ?> <span><strong>Convocatoria abierta o A medida:</strong> no tienes que marcarlo. Un curso con fechas próximas sale en «Convocatorias abiertas»; sin fechas, en «Resto de cursos» como «A medida». Cambia solo.</span></p>
                    <p><strong>No cambies el slug</strong> (la parte final de la dirección) de un curso publicado: cambiaría su URL y se perderían los enlaces que ya apuntan a él.</p>
                </section>

                <section id="sedes" class="jm-adm-tarjeta">
                    <h2><span class="jm-adm-guia__n">6</span> Sedes</h2>
                    <p>En <a href="<?php echo esc_url(admin_url('edit-tags.php?taxonomy=sede_formacion&post_type=convocatoria')); ?>">Formación → Sedes</a> puedes añadir una sede nueva o corregir la dirección y el enlace de Google Maps de una existente. La sede nueva aparece al momento en <em>Programar fechas</em>.</p>
                    <p>No borres una sede que tenga convocatorias: esas fechas se quedarían sin sede.</p>
                </section>

                <section id="automatico" class="jm-adm-tarjeta">
                    <h2><span class="jm-adm-guia__n">7</span> Lo que se hace solo</h2>
                    <ul class="jm-adm-guia__lista jm-adm-guia__lista--check">
                        <li>Las fechas pasadas desaparecen de la web al día siguiente.</li>
                        <li>Cada curso pasa de «Convocatoria abierta» a «A medida» (y al revés) según tenga fechas.</li>
                        <li>El formulario de solicitud ofrece siempre los cursos y las fechas que estén publicados.</li>
                        <li>El título de cada convocatoria se escribe solo: «Curso · fecha · sede».</li>
                        <li>El panel te avisa si se acaba la programación o si una fecha se ha quedado sin curso o sin sede.</li>
                    </ul>
                </section>

                <section id="dudas" class="jm-adm-tarjeta">
                    <h2><span class="jm-adm-guia__n">8</span> Preguntas frecuentes</h2>
                    <dl class="jm-adm-guia__faq">
                        <dt>He creado una fecha y no la veo en la web.</dt>
                        <dd>Comprueba que está publicada (no en borrador) y que la fecha es de hoy en adelante. Si la web usa caché, puede tardar unos minutos.</dd>
                        <dt>¿Dónde llegan las solicitudes de plaza?</dt>
                        <dd>Llegan por correo a formacion@jofemesa.com con una referencia (FOR-…) y además quedan guardadas en <em>Elementor → Envíos</em>. Para cambiar el correo de destino, avisa a la agencia.</dd>
                        <dt>¿Puedo cambiar el diseño de la ficha de un curso?</dt>
                        <dd>El diseño es común a todos los cursos y lo mantiene la agencia. Tú cambias los textos desde aquí y se aplican en el diseño.</dd>
                        <dt>He borrado algo por error.</dt>
                        <dd>Todo lo que se borra va a la papelera durante 30 días. Desde la papelera, pulsa <em>Restaurar</em> y vuelve a estar publicado.</dd>
                    </dl>
                </section>
            </div>
        </div>
    </div>
    <?php
}
