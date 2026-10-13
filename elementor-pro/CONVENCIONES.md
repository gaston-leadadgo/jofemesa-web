# Convenciones del paquete Elementor de JOFEMESA

Este documento es la referencia común para todo lo que hay en `elementor-pro/`:
quien monte la web en Elementor Pro, quien la mantenga y quien escriba CSS, JS
o shortcodes nuevos. Si algo contradice este documento, manda este documento.

---

## 1. Arquitectura en una frase

**Elementor Pro pone la estructura y el texto; el plugin `jofemesa-core` pone
los datos, el aspecto y el movimiento.**

| Pieza | Dónde vive | Quién la edita |
|---|---|---|
| Textos, titulares, botones, imágenes de las páginas | Widgets nativos de Elementor | El cliente, desde el panel |
| Máquinas, cursos, convocatorias, delegaciones | Tipos de contenido del plugin (ACF) | El cliente, desde el escritorio de WP |
| Aspecto (colores, tipos, rejillas, tarjetas) | `assets/css/*.css` del plugin | Nadie desde el panel (a propósito) |
| Interacción (carrusel, filtros, comparador, asesor…) | `assets/js/*.js` del plugin | Nadie desde el panel |
| Piezas que ningún widget nativo sabe generar | Shortcodes `[jm_…]` del plugin | Se colocan con el widget **Shortcode** |

Ningún widget lleva estilos de la pestaña **Estilo**. Todo el aspecto viene de
clases en **Avanzado → Clases CSS**. Así el cliente puede cambiar un titular
pero no su tamaño, y no puede romper el diseño al editar.

---

## 2. El ámbito: `body.jm`

El plugin añade la clase `jm` al `<body>` en todo el sitio. **Todo selector del
paquete empieza por `body.jm`**. Con eso:

- `body.jm h2` vale (0,1,2): gana a las reglas de Elementor por clase
  (`.elementor-heading-title`, 0,1,0) y a las del kit global
  (`.elementor-kit-N h2`, 0,1,1). Sin `!important`.
- Nada se sale a otros plugins o a la administración.

Excepción: los `@keyframes`, `@font-face` y `:root` no se prefijan.

---

## 3. Nombres de clase

Prefijo `jm-` siempre. BEM ligero: `jm-bloque`, `jm-bloque__parte`,
`jm-bloque--variante`.

### Clases de sistema (en `01-base.css`, úsalas antes de inventar otras)

| Clase | Equivale en Next | Uso |
|---|---|---|
| `jm-contenedor` | `container-placa` | Contenedor interior: ancho máximo 1320 px y márgenes laterales |
| `jm-seccion` / `jm-seccion-sm` | `section-y` / `section-y-sm` | Relleno vertical de sección |
| `jm-oscuro` | `bg-inverse` + `data-surface="dark"` | Superficie oscura: cambia el color del texto y del foco |
| `jm-hundido` | `bg-sunken` | Fondo gris claro |
| `jm-ambiente-claro` / `jm-ambiente-oscuro` | `ambient-light` / `ambient-dark` | Los dos fondos con degradado |
| `jm-display-1/2/3`, `jm-title`, `jm-lede` | iguales | Escala tipográfica |
| `jm-label`, `jm-label-sm`, `jm-meta`, `jm-value`, `jm-value-lg` | iguales | Etiquetas y cifras |
| `jm-tarjeta`, `jm-panel` | `tarjeta`, `panel` | Superficies |
| `jm-btn` + `jm-btn--acento` / `--tinta` / `--contorno` / `--contorno-claro` / `--enlace` | botones | Ver §5 |
| `jm-acento`, `jm-texto-2`, `jm-texto-3` | `text-accent`, `text-ink-2`, `text-ink-3` | Color de texto puntual |
| `jm-filete` | `filete-anim` | Filete rojo que se dibuja al entrar |

### Clases de utilidad del adaptador (en `03-adaptador.css`)

| Clase | Para qué |
|---|---|
| `jm-plano` | El envoltorio exterior del widget desaparece del árbol de cajas (`display: contents`). Para cuando el widget tiene que ser literalmente un hijo más de una rejilla o un flex. |
| `jm-hereda` | El `<p>` interior hereda tipografía y color del envoltorio. |
| `jm-fondo-img` | Imagen a sangre como capa de fondo de su contenedor. |

---

## 4. El problema de los envoltorios (y cómo lo resuelve el adaptador)

Elementor no pone tu clase en la etiqueta real, sino dos niveles por encima:

```html
<div class="elementor-element elementor-widget-heading  jm-display-2">   ← tu clase
  <div class="elementor-widget-container">                              ← (no siempre existe)
    <h2 class="elementor-heading-title">Texto</h2>                      ← la etiqueta real
```

El adaptador pone `.elementor-widget-container` en `display: contents` y
traduce las cuatro estructuras que difieren: botón, lista de iconos, icono e
imagen. Consecuencias al escribir CSS:

- **Las clases tipográficas se aplican al envoltorio y el texto las hereda.**
  Por eso `jm-display-2` funciona puesto en el widget Título: el `<h2>`
  hereda `font-*` porque el adaptador le pone `font: inherit`.
- **Nada de selectores de hijo directo (`>`), hermano (`+`, `~`) ni de
  posición (`:first-child`, `:nth-child`) sobre widgets.** Siguen viendo los
  divs intermedios. Si hace falta, apunta al envoltorio:
  `.jm-rejilla > .elementor-element:nth-child(2)`.
- **Contenedores en «Ancho completo», nunca «En caja».** El modo en caja mete
  un `.e-con-inner` que rompe las rejillas.

---

## 5. Botones

Widget **Botón** con dos clases: `jm-btn` y una variante. El adaptador traslada
el aspecto al `<a class="elementor-button">` real.

| Variante | Aspecto |
|---|---|
| `jm-btn--acento` | Rojo JOFEMESA, texto blanco. El CTA principal. |
| `jm-btn--tinta` | Negro, texto blanco («Consultar disponibilidad» en tarjeta). |
| `jm-btn--contorno` | Borde gris, fondo blanco. |
| `jm-btn--contorno-claro` | Borde blanco translúcido, sobre fondo oscuro. |
| `jm-btn--enlace` | Texto subrayado con flecha, sin caja. |
| `jm-btn--sm` / `jm-btn--lg` | Alto 44 / 56 px (por defecto 52). |
| `jm-btn--bloque` | Ancho completo. |

El icono del botón (flecha) se elige en el propio widget: biblioteca de iconos
→ *Arrow Right* (Font Awesome) o el SVG subido `flecha.svg`, posición *Después*.

---

## 6. Datos dinámicos

Las máquinas, cursos, convocatorias y delegaciones son entradas de WordPress.
En plantillas de Theme Builder y en Loop Items se usan con **etiquetas
dinámicas** (icono de base de datos junto a cada campo):

### Máquina (`maquina`)

| Dato | Etiqueta dinámica | Campo |
|---|---|---|
| Marca | ACF Field | `jm_marca` |
| Modelo | ACF Field | `jm_modelo` |
| Marca + modelo | Título de la entrada | — |
| Descripción corta | ACF Field | `jm_descripcion` |
| Foto | Imagen destacada | — |
| Ficha técnica PDF | ACF File (URL) | `jm_ficha_pdf` |
| Altura de trabajo / carga (cifras) | ACF Field | `jm_altura`, `jm_carga` |
| Subcategoría (texto) | ACF Field | `jm_subcategoria_nombre` |
| Slug | ACF Field | `jm_slug` |
| Enlace a la ficha | URL de la entrada | — |

Taxonomías: `familia` (jerárquica: familia → subcategoría), `energia`,
`fabricante`, `entorno`.

### Curso (`curso`)

`jm_titulo_largo`, `jm_nombre_corto`, `jm_norma`, `jm_certificacion`,
`jm_normativa`, `jm_duracion`, `jm_modalidad`, `jm_descripcion`,
`jm_para_quien`, `jm_convocatoria_abierta` (sí/no). Las preguntas
frecuentes del curso son el **contenido** de la entrada (widget
*Contenido de la entrada*).

### Convocatoria (`convocatoria`)

`jm_fecha` (Y-m-d), `jm_curso` (objeto de entrada → curso), `jm_inicio`,
`jm_fin`, `jm_plazas`, `jm_ocupadas`. Taxonomía `sede_formacion`.

### Delegación (`delegacion`)

`jm_localidad`, `jm_direccion`, `jm_cp`, `jm_provincia`, `jm_pais`,
`jm_telefono`, `jm_tel`, `jm_email`, `jm_maps`, `jm_central`,
`jm_tipo`, `jm_orden`.

### Ajustes de empresa

*Escritorio → JOFEMESA → Ajustes*: teléfono principal, correo, redes, fecha
de fundación, URL de origen de las fotos. Se leen con shortcodes
(`[jm_dato clave="telefono"]`).

---

## 7. Shortcodes

Se colocan con el widget **Shortcode** (no con el widget HTML). Cada uno
documenta sus atributos en `estructura/` donde se usa. Lista completa en
`estructura/99-shortcodes.md`.

Regla para escribir uno nuevo: devuelve HTML con clases `jm-`, escapa todo
con `esc_html` / `esc_attr` / `esc_url`, y si necesita JS, marca su raíz con
`data-jm="nombre-del-modulo"`.

---

## 8. JavaScript

Un archivo por módulo en `assets/js/`, todos cargados en todo el sitio (son
pequeños y cada uno sale sin hacer nada si no encuentra su raíz). Sin jQuery y
sin dependencias. Patrón:

```js
(function () {
  "use strict";
  function iniciar(raiz) { /* … */ }
  JM.enCada('[data-jm="carrusel-hero"]', iniciar);
})();
```

`JM` lo define `00-nucleo.js`: `JM.enCada(selector, fn)` (ejecuta al cargar y
cuando Elementor repinta un widget en el editor), `JM.datos` (lo que imprime el
plugin en `window.JM_DATOS`), `JM.hoy()`, `JM.guardar/leer` (localStorage con
try/catch) y `JM.reducido` (prefers-reduced-motion).

Los atributos `data-*` que el JS necesita sobre widgets nativos se ponen en
**Avanzado → Atributos** (función de Elementor Pro), con el formato
`data-jm|carrusel-hero`.

---

## 9. Movimiento

- **Nada de Efectos de movimiento ni Animación de entrada de Elementor.** El
  revelado al hacer scroll lo hace `jm` con el atributo `data-revelar`
  (Avanzado → Atributos: `data-revelar|` vacío, o `data-revelar|izquierda`,
  `data-revelar|escala`, `data-revelar|linea`; retraso con
  `style|--retardo:2`).
- Los estados ocultos solo existen con `html[data-motor]`, que pone el JS. Sin
  JS, o con *reducir movimiento*, todo se ve entero y quieto.
- Un `transform` en un contenedor padre rompe el `position: fixed` y el
  `sticky` de sus hijos. No uses transformaciones de Elementor en
  contenedores.
