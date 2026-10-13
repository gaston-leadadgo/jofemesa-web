# 00 · Ajustes globales, páginas y plantillas

Esto se hace **una vez**, antes de montar ninguna sección. Si te lo saltas, la
maquetación se descuadra y cuesta mucho encontrar el motivo.

---

## 1. Plugins y tema

| Qué | Dónde | Obligatorio |
|---|---|---|
| **Hello Elementor** (tema) | Apariencia → Temas → Añadir | Sí. Es el tema que menos estilos impone. |
| **Elementor** + **Elementor Pro** | Plugins | Sí. Pro hace falta para Theme Builder, Loop Grid/Carousel, Formulario, Menú y Atributos. |
| **Advanced Custom Fields** (gratis) | Plugins → Añadir nuevo → «ACF» | Sí. Muestra los campos de máquinas, cursos, convocatorias y delegaciones y alimenta las etiquetas dinámicas. No hay que crear ningún campo: los registra el plugin. |
| **JOFEMESA · Núcleo** (`dist/jofemesa-core.zip`) | Plugins → Añadir nuevo → Subir plugin | Sí. |
| **WP Mail SMTP** | Plugins | Muy recomendable: sin él, los correos de los formularios suelen acabar en spam o no salir. |
| Rank Math o Yoast | Plugins | Opcional (SEO). |

No hace falta Contact Form 7, ni JetEngine, ni JetSmartFilters, ni ningún
plugin de filtros: los filtros del catálogo y del calendario los hace el
núcleo.

## 2. Ajustes de WordPress

1. **Ajustes → Enlaces permanentes → «Nombre de la entrada»** → Guardar. (Hay
   que volver a guardar después de activar el plugin: es lo que crea las URL
   `/maquina/…`, `/alquiler/…` y `/formacion/cursos/…`.)
2. **Ajustes → Lectura → Tu página de inicio muestra → Una página estática**:
   Inicio.
3. **JOFEMESA → Ajustes**: revisa teléfono, correos, redes y la fecha de
   fundación (1987-03-24). Vacío = el valor de la web de origen.
4. **JOFEMESA → Importar → Importar todo.** Crea las 145 máquinas, 12
   cursos, 69 convocatorias, 10 delegaciones y descarga 62 fotos y 62 fichas.
   Tarda unos minutos. Si se corta, vuelve a pulsar: retoma sin duplicar.

## 3. Ajustes de Elementor

**Elementor → Ajustes → Funciones (Features):**

- Contenedor Flexbox: **Activo**.
- Optimizar el DOM / Carga de assets mejorada: activo (el adaptador funciona
  con y sin el div intermedio).
- Menú (Mega Menu), Loop, Carrusel anidado: **Activos**.

**Elementor → Ajustes → Avanzado:**

- Habilitar la subida de archivos SVG: **Sí** (los iconos de máquina y los
  logos son SVG).
- Cargar Google Fonts: puedes desactivarlo; el plugin carga las suyas.

**Sitio → Ajustes del sitio (desde el editor, menú de hamburguesa):**

- **Diseño → Contenedor:** ancho del contenido **1320 px**, **Relleno 0** en
  los cuatro lados, **Separación entre elementos 0**. Esto es lo más
  importante de todo el paso: el ritmo lo ponen las clases.
- **Diseño → Puntos de interrupción:** Móvil 767, Tableta 1023. (Coinciden
  con los del diseño: 768 y 1024.)
- **Tipografía global / Colores globales:** déjalos como vienen. El aspecto
  lo pone el plugin; si fijas tipografías aquí, compiten con él.
- **Ajustes del tema (Hello):** desactiva la cabecera y el pie del tema (los
  pone Theme Builder).

## 4. Las cuatro reglas de montaje

1. **Contenedores en «Ancho completo»**, nunca «En caja». El modo en caja mete
   un div extra que rompe las rejillas.
2. **Nada de Efectos de movimiento ni Animación de entrada.** El movimiento
   lo hace el plugin con el atributo `data-revelar`. Además, un `transform`
   en un contenedor padre rompe la cabecera fija.
3. **No toques la pestaña Estilo.** Todo el aspecto viene de las clases de
   *Avanzado → Clases CSS*. Así el cliente puede cambiar un titular pero no su
   tamaño.
4. **Los atributos** (`data-jm`, `data-revelar`…) van en *Avanzado →
   Atributos*, uno por línea, con el formato `clave|valor`.

## 5. Medios que hay que subir a la biblioteca

| Archivo | Para |
|---|---|
| `plugin/jofemesa-core/assets/marca/*.svg` | Logotipos (cabecera, pie) |
| `plugin/jofemesa-core/assets/iconos/maquina-*.svg` | Iconos de familia y subcategoría (widget Icono → Subir SVG) |
| `recursos/imagenes/*` | Fotos de portada, Formación y Servicios |

Las fotos y fichas de las máquinas **no** se suben a mano: las descarga el
importador.

## 6. Páginas

Plantilla de todas: **Elementor Ancho completo** (con cabecera y pie de Theme
Builder). Crea las páginas con este título y esta URL:

| Página | URL | Plano |
|---|---|---|
| Inicio | `/` | `10-inicio.md` |
| Alquiler de maquinaria | `/alquiler/` | `20-alquiler.md` |
| Comparador | `/comparador/` | `23-comparador.md` |
| ¿Qué máquina necesito? | `/asesor/` | `24-asesor.md` |
| Servicios | `/servicios/` | `30-servicios.md` |
| Formación | `/formacion/` | `40-formacion.md` |
| Solicitar formación (hija de Formación) | `/formacion/solicitar/` | `43-solicitar-formacion.md` |
| Solicitud de formación recibida (hija de Solicitar) | `/formacion/solicitar/gracias/` | `43-solicitar-formacion.md` |
| Delegaciones | `/delegaciones/` | `50-delegaciones.md` |
| Contacto | `/contacto/` | `51-contacto.md` |
| Consultar disponibilidad | `/consultar-disponibilidad/` | `52-consultar-disponibilidad.md` |
| Solicitud recibida (hija de Consultar) | `/consultar-disponibilidad/gracias/` | `52-consultar-disponibilidad.md` |
| Aviso legal · Privacidad · Cookies | `/aviso-legal/` `/privacidad/` `/cookies/` | `60-legales-y-404.md` |

## 7. Plantillas de Theme Builder

| Plantilla | Tipo | Condición | Plano |
|---|---|---|---|
| Cabecera | Cabecera | Todo el sitio | `01-cabecera.md` |
| Pie | Pie de página | Todo el sitio | `02-pie.md` |
| Tarjeta de máquina | Elemento de bucle (Loop Item) · Fuente: Máquinas | — | `21-loop-tarjeta-maquina.md` |
| Ficha de máquina | Individual (Single) · Máquinas | Todas las máquinas | `22-ficha-maquina.md` |
| Listado de familia | Archivo · Familias | Todas las familias | `20-alquiler.md` |
| Tarjeta de curso / fila de convocatoria | Loop Item · Cursos / Convocatorias | — | `42-loop-curso-y-convocatoria.md` |
| Ficha de curso | Single · Cursos | Todos los cursos | `41-ficha-curso.md` |
| Tarjeta de delegación | Loop Item · Delegaciones | — | `50-delegaciones.md` |
| Página 404 | Error 404 | — | `60-legales-y-404.md` |

## 8. Menú

**Apariencia → Menús → «Principal»** (lo usa el widget Menú de la cabecera):
ver `04-globales.md`.

## Comprobación

- [ ] Hello Elementor activo; Elementor, Elementor Pro, ACF y JOFEMESA activos.
- [ ] Enlaces permanentes guardados *después* de activar JOFEMESA.
- [ ] La importación termina sin errores y en *Máquinas* hay 145 entradas, 62 con foto.
- [ ] En *Ajustes del sitio → Diseño* el relleno y la separación por defecto están a 0.
- [ ] Al abrir cualquier página, el `<body>` lleva la clase `jm` (inspeccionar).
