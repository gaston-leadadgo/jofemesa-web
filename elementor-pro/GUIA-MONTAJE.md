# Guía de montaje · JOFEMESA en Elementor Pro (versión híbrida)

Esta guía lleva la web Next.js de JOFEMESA a WordPress + Elementor Pro **con
widgets nativos**: el cliente edita textos, imágenes, botones, máquinas,
cursos, convocatorias y delegaciones desde el panel, y el aspecto y el
movimiento son los de la web original.

Tuteando y en orden. Si algo te parece arbitrario, lee el porqué: es lo que te
permite decidir bien cuando te encuentres un caso que la guía no cubre.

---

## Antes de empezar

**Qué hay en el paquete** (`elementor-pro/`):

| Carpeta | Qué es |
|---|---|
| `dist/jofemesa-core.zip` | El plugin, listo para subir. |
| `plugin/jofemesa-core/` | El mismo plugin, sin comprimir (CSS, JS, PHP, iconos, logos y datos). |
| `estructura/` | Un plano por plantilla o página: el árbol de contenedores y widgets con sus textos, clases y atributos. |
| `recursos/` | Imágenes de portada e iconos para subir a la biblioteca de medios. |
| `scripts/` | Exportar datos desde la web Next, compilar el asesor, verificar y empaquetar. |
| `CONVENCIONES.md` | Las reglas de clases, ámbito, botones, datos dinámicos y JS. Léelo una vez. |

**Qué hace falta:** WordPress 6.4+, PHP 8.0+, el tema **Hello Elementor**,
**Elementor Pro** con licencia activa, **ACF** gratis y, muy recomendable,
**WP Mail SMTP**. Nada más: ni Contact Form 7, ni JetEngine, ni plugins de
filtros. Todo lo que no es nativo lo pone `jofemesa-core`.

**Tiempo honesto:** entre **16 y 22 horas** de montaje, más una jornada de
repaso. Son 19 planos, unas 15 páginas y 9 plantillas de Theme Builder.

**Recomendación que ahorra un día:** monta primero la **cabecera** y la
**ficha de máquina** (dos plantillas) y compruébalas en móvil y escritorio
antes de seguir. Si algo del método falla, se corrige una vez en el CSS del
plugin y sirve para todo lo demás. Descubrirlo en la primera plantilla cuesta
una hora; en la última, el día entero.

**No esperes que salga perfecto a la primera.** El paquete está verificado
(sintaxis de PHP, JS y CSS, y coherencia entre planos y código), pero no se ha
podido probar en un WordPress real. Lo normal es que pida un par de ajustes de
CSS al montarlo, casi siempre en el widget Menú y en el Loop Carousel, que
son los que más cambian entre versiones de Elementor. Abajo tienes por dónde
mirar.

---

## Por qué así (y no como la landing)

Tu método de landing pega el CSS original y monta encima. Aquí no se puede,
por dos razones:

1. **La web está hecha con Tailwind**: el aspecto no está en clases con
   nombre sino en utilidades dentro del marcado. Se ha reescrito como un
   sistema de clases `jm-` (`plugin/…/assets/css/`) con los mismos valores.
2. **El contenido son datos**: 145 máquinas, 12 cursos, 69 convocatorias, 10
   delegaciones. Montarlas a mano sería inmantenible. Por eso son **tipos de
   contenido** de WordPress, y el catálogo, las fichas y el calendario se
   montan con **Theme Builder + Loop Grid + etiquetas dinámicas**: un solo
   diseño de tarjeta sirve para las 145 máquinas.

Lo que no tiene equivalente nativo (filtros con recuentos, comparador,
asesor, carrusel del hero, tabla de especificaciones con sus estados) va en
**shortcodes** del plugin, que se colocan con el widget nativo *Shortcode*.
Cada plano justifica en una línea cada pieza que no es nativa.

**No hacen falta los snippets PHP de la versión landing.** Los tres que
llevaba (shortcodes en el widget HTML, `wpautop` de CF7 y honeypot) resuelven
problemas que aquí no existen: los shortcodes van en el widget *Shortcode*,
que sí los ejecuta; el formulario es el nativo de Elementor Pro, sin autop; y
el honeypot es su campo nativo. Todo el PHP necesario está dentro del plugin.

---

## Paso 0 · Ajustes globales

Sigue `estructura/00-ajustes-globales.md` entero. Lo crítico, por si lo lees
en diagonal:

- **Hello Elementor**, con su cabecera y pie desactivados.
- **Relleno 0 y separación 0** por defecto en *Ajustes del sitio → Diseño →
  Contenedor*. Si no, todo sale con aire de más.
- **Subida de SVG activada** en *Elementor → Ajustes → Avanzado*.
- Puntos de interrupción: móvil 767, tableta 1023.

Y las cuatro reglas de montaje, que valen para todos los planos:

1. Contenedores en **Ancho completo**, nunca *En caja*.
2. **Nada de Efectos de movimiento ni Animación de entrada.**
3. **Nada en la pestaña Estilo.** Todo va por *Avanzado → Clases CSS*.
4. Los atributos van en *Avanzado → Atributos*, uno por línea, `clave|valor`.

## Paso 1 · Instalar el plugin e importar los datos

1. *Plugins → Añadir nuevo → Subir plugin* → `dist/jofemesa-core.zip` → Activar.
2. *Ajustes → Enlaces permanentes* → **Guardar** (sin cambiar nada). Crea las
   URL `/maquina/…`, `/alquiler/{familia}/` y `/formacion/cursos/…`.
3. *JOFEMESA → Ajustes*: revisa teléfonos, correos, redes y la fecha de
   fundación. *WhatsApp* vacío = la barra móvil sale sin ese botón. (El
   destino de los formularios no se pone aquí: es la acción *Correo
   electrónico* de cada formulario, Paso 5.)
4. *JOFEMESA → Importar → Importar todo*. Unos minutos: crea 145 máquinas, 12
   cursos, 69 convocatorias y 10 delegaciones, y descarga 62 fotos y 62 fichas
   PDF desde el despliegue de Vercel. Si se corta, vuelve a pulsar: retoma
   sin duplicar.
5. Aparece el menú **Formación** (Panel, Convocatorias, Cursos, Sedes, Guía
   de uso). Ábrelo y comprueba que el panel muestra las convocatorias
   importadas. Es lo que usará el cliente: ver *Formación: lo que gestiona el
   cliente*, más abajo.

**Comprueba antes de seguir** que el plugin responde: abre cualquier página
del sitio, inspecciona y mira que el `<body>` lleva la clase `jm` y que se
cargan `jm-00-nucleo.js` y `jm-01-base.css`. Si no, no sigas: algo falla en
la instalación.

## Paso 2 · Subir los medios

A la biblioteca de medios (ver `00-ajustes-globales.md §5`):

- los logos de `plugin/jofemesa-core/assets/marca/`;
- los iconos de máquina de `plugin/jofemesa-core/assets/iconos/maquina-*.svg`;
- los iconos de `recursos/iconos/`;
- las fotos de `recursos/imagenes/`.

## Paso 3 · Plantillas de Theme Builder

En este orden, porque unas usan otras:

| # | Plantilla | Plano |
|---|---|---|
| 1 | Cabecera (todo el sitio) | `01-cabecera.md` + menú en `04-globales.md` |
| 2 | Pie (todo el sitio) | `02-pie.md` |
| 3 | Loop Item · Tarjeta de máquina | `21-loop-tarjeta-maquina.md` |
| 4 | Single · Ficha de máquina | `22-ficha-maquina.md` |
| 5 | Archive · Listado de familia | `20-alquiler.md` |
| 6 | Loop Items · Tarjeta de curso y fila de convocatoria | `42-loop-curso-y-convocatoria.md` |
| 7 | Single · Ficha de curso | `41-ficha-curso.md` |
| 8 | Loop Item · Tarjeta de delegación | `50-delegaciones.md` |
| 9 | Error 404 | `60-legales-y-404.md` |

## Paso 4 · Páginas

Plantilla **Elementor Ancho completo** en todas. La lista completa con sus URL
está en `00-ajustes-globales.md §6`. Orden recomendado: Alquiler, Comparador,
Consultar disponibilidad, Inicio, Asesor, Formación, Solicitar formación,
Servicios, Delegaciones, Contacto, legales y páginas de gracias.

Cada plano trae el **texto literal** de la web original. No lo reescribas al
montar: si el cliente quiere otro texto, se cambia después desde el panel.

## Paso 5 · Formularios

Los dos son el widget **Formulario** nativo:

- **Consultar disponibilidad** → `52-consultar-disponibilidad.md`
- **Solicitar formación** → `43-solicitar-formacion.md`

Lo que no se puede tocar es el **ID** de cada campo (*Campo → Avanzado →
ID*). El plugin rellena los desplegables (provincias, delegaciones, cursos,
convocatorias), valida con los mensajes de la web original y, antes de
enviar el correo, cambia los identificadores internos por texto legible. Las
etiquetas, el orden y los anchos sí se pueden cambiar.

Acciones tras enviar: **Recoger envíos** (quedan en *Elementor → Envíos*),
**Correo** a la dirección de *JOFEMESA → Ajustes*, **Webhook** opcional hacia
el CRM y **Redirigir** a la página de gracias con la referencia.

Prueba los dos formularios con datos reales y comprueba que **llega el
correo**. Si no llega, el 90 % de las veces es que falta WP Mail SMTP.

## Paso 6 · Comprobaciones

**Aspecto**

- [ ] La franja negra superior: contador de años·meses·días, Delegaciones y «¿Qué máquina necesito?».
- [ ] La cabecera se queda fija y se compacta al bajar.
- [ ] El desplegable de Alquiler muestra las 6 familias con su icono, rango y número.
- [ ] Las fotos de máquina se ven **enteras**, con su logotipo, nunca recortadas.
- [ ] Botones rojos con esquina redonda; las flechas del hero, rojas.
- [ ] Pie con redes sociales bajo el correo y la franja roja con los legales.

**Animaciones** (recarga desde arriba y baja despacio)

- [ ] El hero cambia de portada cada 8 s con cortina y cuchilla roja; se para al pasar el ratón.
- [ ] Los bloques entran al hacer scroll; con *reducir movimiento* activado en el sistema, todo aparece quieto.
- [ ] El mapa de delegaciones se dibuja y caen los puntos de norte a sur.

**Funcionamiento**

- [ ] Catálogo: filtrar por familia, alimentación, altura y texto; los números se actualizan; «quitar filtro» cuando no hay resultados; la URL guarda los filtros.
- [ ] La ficha se abre en modal desde el listado sin perder el scroll; recargar la URL abre la ficha completa.
- [ ] Comparar 2-4 máquinas: la bandeja aparece abajo; la tabla resalta el mejor valor por fila.
- [ ] El asesor recomienda al responder las tres preguntas (prueba «Trabajar en altura · hasta 10 m · interior»).
- [ ] Calendario de Formación: filtrar por curso, sede y mes; las convocatorias pasadas no salen.
- [ ] «Ver información del curso» abre la ficha del curso en modal.
- [ ] Los dos formularios envían, llega el correo y aparecen en *Elementor → Envíos*.
- [ ] «¿No está tu curso?» abre el formulario con «Otro curso» y pide describirlo.

**Móvil**

- [ ] Sin scroll horizontal en ninguna página (prueba a 375 px).
- [ ] Barra inferior Llamar / Consultar visible; la franja superior, oculta.
- [ ] El menú móvil abre, cierra y deja llamar a cada delegación.

**Edición** (esto es lo que justifica la versión híbrida)

- [ ] Cambia un titular de la portada: se ve igual, solo cambia el texto.
- [ ] Cambia la foto de una portada del hero.
- [ ] Edita la descripción de una máquina en *Máquinas*: cambia en la tarjeta y en la ficha.
- [ ] Programa dos fechas de un curso «A medida» en *Formación → Panel → Programar fechas*: aparecen en el calendario y en el formulario, y el curso pasa solo a «Convocatoria abierta».
- [ ] Envía una de esas fechas a la papelera desde la agenda y pulsa *Deshacer*: vuelve publicada.

---

## Cuando algo no sale

| Síntoma | Causa y solución |
|---|---|
| Todo se ve amontonado, sin colores ni tipografía | El plugin no carga o el `<body>` no lleva la clase `jm`. Mira que esté activo y que el tema no quite `body_class()`. |
| Hay más aire del que debería entre bloques | No se hizo el paso 0: relleno y separación por defecto a 0 en *Ajustes del sitio → Diseño*. |
| Una rejilla sale en una sola columna | El contenedor está en *En caja*. Pásalo a *Ancho completo*. |
| Un titular sale con un tamaño raro | Le falta la clase tipográfica (`jm-display-2`…) o tiene algo en la pestaña Estilo. Quítalo. |
| Un botón se ve como texto plano | Le falta la clase base `jm-btn` además de la variante: son dos clases. |
| Un botón se queda de color raro al pulsarlo | El tema pinta `:focus`. Comprueba que el tema es Hello Elementor. |
| La cabecera no se queda fija | Un contenedor padre tiene un efecto de movimiento o una transformación. Quítalo. |
| Las animaciones no arrancan y todo se ve quieto | Normal si el sistema tiene *reducir movimiento*. Si no, mira la consola: un 404 de `jm-*.js`. |
| Un shortcode sale como texto `[jm_…]` | Está en un widget de Texto o HTML. Va en el widget **Shortcode**. |
| El catálogo sale vacío | El Loop Grid no tiene `jm_catalogo` en *Consulta → ID de consulta*, o la importación no terminó. |
| Las tarjetas no se filtran | Falta `[jm_catalogo_filtros]` en la página: es el que imprime los datos del filtro. |
| Faltan fotos en algunas máquinas | 64 máquinas **no tienen foto** todavía (ver el listado de material pendiente): salen con el dibujo de su subcategoría. Si falta en una que sí la tiene, repite la importación. |
| La ficha se abre como página y no en modal | El botón «Ficha» no está dentro de un contenedor con `data-jm-modal` ni lleva la clase `jm-abrir-modal`. |
| Los desplegables de curso o provincia del formulario salen vacíos | El ID del campo no es exactamente `curso`, `convocatoria`, `provincia` o `delegacion`. |
| El formulario envía pero no llega el correo | Falta WP Mail SMTP o el correo de destino está mal en *JOFEMESA → Ajustes*. |
| Las URL `/maquina/…` dan 404 | No se guardaron los enlaces permanentes después de activar el plugin. |
| El menú de escritorio se ve con estilos de Elementor | El widget Menú no lleva la clase del plano (`01-cabecera.md`) o se tocó su pestaña Estilo. |

## Qué es distinto respecto al original

No lo escondas al cliente: dicho antes es una decisión, descubierto después
parece un fallo.

- **La ficha de máquina y la del curso** se abren en un modal propio que pide
  la página por debajo; el resultado es el mismo, pero tarda lo que tarda en
  cargar una página (en Next ya estaba en memoria).
- **El formulario de alquiler** se ve en una columna hasta que carga el JS
  (después, en dos). Los errores son los de Elementor, campo a campo, sin el
  resumen agrupado arriba.
- **El antispam** de «campo trampa + 3 segundos» pasa al honeypot nativo de
  Elementor.
- **El carrusel de máquinas destacadas** es el Loop Carousel de Elementor: el
  número de tarjetas visibles se fija por punto de ruptura, no con los anchos
  exactos de la web Next.
- **Sin JavaScript**, el asesor no se ve (solo su enunciado y un enlace al
  catálogo). En Next venía prerenderizado.
- **La barra de progreso al cambiar de página** no existe: en WordPress cada
  enlace recarga la página y el navegador ya muestra la suya.
- **Los iconos de los widgets nativos** son de Font Awesome; los que pinta el
  plugin siguen siendo los de la web original.

## Formación: lo que gestiona el cliente

El equipo de Formación gestiona cursos, fechas y sedes desde el menú
**Formación** del escritorio, sin abrir Elementor:

- **Panel**: cifras, avisos (programación a punto de acabarse, fechas sin
  curso o sin sede, convocatorias completas), *Programar fechas* (varias de
  una vez, también pulsando días del calendario), agenda con plazas − / +,
  *Programar otra igual* y papelera con *Deshacer*.
- **Convocatorias** y **Cursos**: listados con columnas útiles, filtros por
  curso y sede y vistas *Próximas* / *Celebradas*.
- **Guía de uso**: el manual dentro del escritorio.

Lo que hace solo el plugin (`80-panel-formacion.php`): «Convocatoria abierta /
A medida» según haya fechas próximas, el título y el slug de cada
convocatoria, los valores por defecto de un curso nuevo y el recálculo
diario. Cursos y convocatorias usan el editor clásico y no tienen
*Editar con Elementor*: su diseño es la plantilla del Theme Builder.

**Al entregar:** crea al equipo de Formación un usuario con rol *Editor* y
envíales `MANUAL-FORMACION.md` (o pásalo a PDF). Es el mismo texto que
*Formación → Guía de uso*.

## Pendiente del lado del cliente

- **Logos de AENOR e IPAF** originales (ver *datos pendientes* de la web).
- **Textos que conviene que revisen**, marcados en los planos:
  - Servicios dice que el calendario de formación «está en preparación», y ya existe (`30-servicios.md`).
  - La política de privacidad no menciona el formulario de formación (`60-legales-y-404.md`).
  - La página 404 es nueva: sus textos están por validar.
- **Política de privacidad**: los dos formularios recogen datos personales y
  enlazan a `/privacidad/`. Esa página tiene que estar publicada con su texto
  antes de abrir la web: un formulario que enlaza a una página vacía es un
  incumplimiento del RGPD, no un detalle pendiente.
- **Fotos de 64 máquinas** (ver `jofemesa-material-fotografico-pendiente.pdf`; se regenera con
  `python scripts/material-fotografico-pendiente.py` cada vez que llega material).

## Mantenimiento: cómo actualizar los datos desde la web Next

Si el catálogo cambia en la web Next (máquinas nuevas, fotos, fichas):

```bash
cd JOFEMESA-WEB/elementor-pro
npm install          # solo la primera vez
npm run todo         # exporta datos, compila el asesor, verifica y genera el zip
```

Sube el zip nuevo (*Plugins → Añadir nuevo → Subir* → reemplazar) y pulsa
*JOFEMESA → Importar*. Ojo: en máquinas, familias y delegaciones la
importación **sobrescribe** los campos de las entradas existentes. Si el
cliente ya edita esos datos desde WordPress, a partir de ese momento la fuente
de verdad es WordPress y no conviene reimportar.

**Cursos y convocatorias nunca se sobrescriben**: el importador solo crea los
que faltan (los busca por slug, también en la papelera). Así una
reimportación no deshace lo que Formación haya cambiado en el panel.
