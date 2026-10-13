# 99 · Shortcodes del plugin

Generado desde el código con `node elementor-pro/scripts/documentar-shortcodes.mjs`. No lo edites a mano.

Se colocan con el widget **Shortcode** de Elementor. Los que devuelven solo texto o una URL se pueden usar
también como **etiqueta dinámica → Shortcode** dentro de un widget nativo (título, texto, enlace de botón).

| Shortcode | Atributos | Dónde se usa | Archivo |
|---|---|---|---|
| `[jm_contador_fundacion]` | — | 01-cabecera | `60-global.php` |
| `[jm_antiguedad]` | `clase` | 04-globales, 10-inicio | `60-global.php` |
| `[jm_desplegable_delegaciones]` | — | 01-cabecera | `60-global.php` |
| `[jm_desplegable_telefonos]` | `variante` (por defecto panel) | 01-cabecera | `60-global.php` |
| `[jm_redes]` | `tamano` (por defecto 15), `variante` (por defecto pie) | 01-cabecera, 02-pie | `60-global.php` |
| `[jm_dato]` | `clave` | 02-pie, 04-globales, 10-inicio, 22-ficha-maquina, 52-consultar-disponibilidad | `60-global.php` |
| `[jm_tel]` | `texto`, `clase` | 04-globales, 40-formacion, 41-ficha-curso, 43-solicitar-formacion | `60-global.php` |
| `[jm_delegaciones_pie]` | — | 02-pie | `60-global.php` |
| `[jm_certificados]` | — | 02-pie | `60-global.php` |
| `[jm_menu_familias]` | `variante` (por defecto panel) | 01-cabecera | `60-global.php` |
| `[jm_nav_movil]` | `menu` | 01-cabecera, 04-globales | `60-global.php` |
| `[jm_boton_menu]` | `panel` (por defecto menu-movil) | 01-cabecera | `60-global.php` |
| `[jm_barra_movil]` | — | 04-globales | `60-global.php` |
| `[jm_cifra]` | `que` (por defecto referencias), `familia`, `plural` | 10-inicio, 24-asesor | `65-inicio.php` |
| `[jm_buscador]` | `tono` (por defecto oscuro) | 10-inicio | `65-inicio.php` |
| `[jm_proxima_convocatoria]` | — | 10-inicio | `65-inicio.php` |
| `[jm_asesor]` | `variante` (por defecto portada), `alternativas` (por defecto 0) | 10-inicio, 24-asesor | `65-inicio.php` |
| `[jm_mapa]` | `tono` (por defecto claro), `animado` (por defecto 0) | 10-inicio, 30-servicios, 50-delegaciones | `65-inicio.php` |
| `[jm_fabricantes]` | `variante` (por defecto autoridad), `excluir` | 10-inicio | `65-inicio.php` |
| `[jm_delegaciones_lista]` | — | 10-inicio | `65-inicio.php` |
| `[jm_migas]` | `inicio` (por defecto Alquiler) | 20-alquiler, 22-ficha-maquina | `70-catalogo.php` |
| `[jm_referencia]` | `etiqueta` (por defecto Tu referencia) | 52-consultar-disponibilidad | `70-catalogo.php` |
| `[jm_catalogo_filtros]` | `familia` | 20-alquiler | `70-catalogo.php` |
| `[jm_catalogo_categorias]` | `familia` | 20-alquiler | `70-catalogo.php` |
| `[jm_catalogo_barra]` | — | 20-alquiler | `70-catalogo.php` |
| `[jm_catalogo_pie]` | — | 20-alquiler | `70-catalogo.php` |
| `[jm_catalogo_cifra]` | `dato` (por defecto referencias), `familia` | 20-alquiler | `70-catalogo.php` |
| `[jm_tarjeta_datos]` | — | 21-loop-tarjeta-maquina | `70-catalogo.php` |
| `[jm_foto_pendiente]` | `compacto` (por defecto no) | 21-loop-tarjeta-maquina, 22-ficha-maquina | `70-catalogo.php` |
| `[jm_specs]` | — | 22-ficha-maquina | `70-catalogo.php` |
| `[jm_ficha]` | `parte` | 22-ficha-maquina | `70-catalogo.php` |
| `[jm_comparador]` | — | 23-comparador | `70-catalogo.php` |
| `[jm_maquinas_solicitud]` | — | 52-consultar-disponibilidad | `70-catalogo.php` |
| `[jm_solicitud_asunto]` | — | 52-consultar-disponibilidad | `70-catalogo.php` |
| `[jm_conv]` | `que` (por defecto curso) | 42-loop-curso-y-convocatoria | `75-formacion.php` |
| `[jm_curso]` | `que` (por defecto nombre), `abierta`, `medida`, `anio` | 41-ficha-curso, 42-loop-curso-y-convocatoria | `75-formacion.php` |
| `[jm_formacion_cifra]` | `que` (por defecto convocatorias), `anio` | 40-formacion | `75-formacion.php` |
| `[jm_solicitar_titulo]` | `plaza` (por defecto Solicita tu plaza.), `otro` (por defecto Cuéntanos el curso que necesitas y lo diseñamos.), `defecto` (por defecto Cuéntanos qué formación necesitas.) | 43-solicitar-formacion | `75-formacion.php` |
| `[jm_calendario_filtros]` | `vacio_titulo` (por defecto No hay convocatorias con esos filtros.), `vacio_texto` (por defecto Llámanos y te decimos cuándo es la próxima) | 40-formacion | `75-formacion.php` |
| `[jm_convocatoria_fecha]` | — | 42-loop-curso-y-convocatoria | `75-formacion.php` |
| `[jm_convocatoria_plazas]` | — | 42-loop-curso-y-convocatoria | `75-formacion.php` |
| `[jm_curso_chips]` | `variante` (por defecto tarjeta), `abierta` (por defecto Convocatoria abierta), `medida` (por defecto A medida) | 41-ficha-curso, 42-loop-curso-y-convocatoria | `75-formacion.php` |
| `[jm_curso_enlace_calendario]` | `anio` | 42-loop-curso-y-convocatoria | `75-formacion.php` |
| `[jm_proximas_curso]` | `max` (por defecto 4), `titulo` (por defecto Próximas convocatorias), `vacio` (por defecto No hay fechas abiertas ahora mismo. Pídenos información y te avisamos de la próxima.) | 41-ficha-curso | `75-formacion.php` |
| `[jm_tel_formacion]` | `prefijo`, `variante` (por defecto texto) | 40-formacion, 41-ficha-curso, 43-solicitar-formacion | `75-formacion.php` |
| `[jm_formacion_referencia]` | `etiqueta` (por defecto Tu referencia) | 43-solicitar-formacion | `75-formacion.php` |
| `[jm_delegacion_provincia]` | — | 50-delegaciones | `76-paginas.php` |
| `[jm_delegacion_insignia]` | `variante` (por defecto ficha) | 50-delegaciones, 51-contacto | `76-paginas.php` |
| `[jm_delegacion_contacto]` | `variante` (por defecto ficha), `horario` (por defecto Llámanos y te confirmamos el horario) | 50-delegaciones, 51-contacto | `76-paginas.php` |
| `[jm_delegacion_servicios]` | — | 50-delegaciones | `76-paginas.php` |
| `[jm_delegacion_boton]` | `pedir` (por defecto Pedir máquina en ), `sede` (por defecto Ver cursos y convocatorias) | 50-delegaciones | `76-paginas.php` |
