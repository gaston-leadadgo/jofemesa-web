# 04 · Elementos globales

Lo que no es ni cabecera ni pie pero vive en todas las páginas: la barra
móvil, el menú de WordPress del panel móvil, los ajustes del sitio de
Elementor y los shortcodes de datos de empresa.

---

## 1. Barra móvil fija (Llamar / Consultar)

Traducción de `src/components/layout/BarraMovil.tsx`. **No se monta en
Elementor**: la imprime el plugin en `wp_footer` (`includes/60-global.php`).

Va fuera de Elementor porque:

- es una pieza fija que tiene que estar en todas las páginas, incluidas las
  que no reciben la plantilla de pie (404, búsqueda, una página que alguien
  monte sin pie);
- no tiene texto editable salvo dos rótulos («Llamar», «Consultar»);
- su enlace `tel:` sale del ajuste *Teléfono principal* y la columna de
  WhatsApp aparece sola si se rellena el ajuste `whatsapp` (hoy vacío, como en
  Next: «pendiente de que el cliente confirme un número»).

Qué imprime, al final del `<body>`:

```
div.jm-barra-movil__hueco            ← 64 px de hueco bajo el pie en móvil (0 desde 768 px)
div.jm-barra-movil.jm-no-imprimir    ← fija abajo, negra, solo < 768 px, respeta safe-area
└─ div.jm-barra-movil__rejilla (2 o 3 columnas)
   ├─ a[href=tel:+34913613131]  icono teléfono + «Llamar»
   ├─ a[href=https://wa.me/…]   icono mensaje + «WhatsApp»   (solo si hay número)
   └─ a[href=/consultar-disponibilidad/] (rojo)  icono llave + «Consultar»
```

- No se imprime en páginas con plantilla **Elementor Lienzo**, ni en la vista
  previa del editor.
- Para colocarla a mano en otro sitio: `[jm_barra_movil]` (entonces el plugin
  no la repite en `wp_footer`).
- Para apagarla en un tema hijo: `add_filter('jm_barra_movil', '__return_false');`

---

## 2. Menú de WordPress del panel móvil

**Apariencia → Menús → Crear un menú nuevo** · nombre «Principal» · Ubicación:
**JOFEMESA · Menú principal (panel móvil)** (`jm-principal`, la registra el plugin).

Lo pinta `[jm_nav_movil]` dentro del panel `#menu-movil` (ver `01-cabecera.md`).
El menú de escritorio es el widget Menú de Elementor y tiene sus elementos
propios: si cambias uno, cambia el otro.

| Orden | Elemento | Tipo | URL | Clases CSS (opción de pantalla «Clases CSS») |
|---|---|---|---|---|
| 1 | Inicio | Enlace personalizado | `/` | — |
| 2 | Alquiler | Enlace personalizado | `/alquiler/` | — |
| 2.1 | Elevación | **Familias** (término) · subelemento de Alquiler | `/alquiler/elevacion/` | — |
| 2.2 | Manutención de cargas | Familias · subelemento | `/alquiler/manutencion/` | — |
| 2.3 | Excavación y movimiento de tierras | Familias · subelemento | `/alquiler/movimiento-tierras/` | — |
| 2.4 | Energía e iluminación | Familias · subelemento | `/alquiler/energia/` | — |
| 2.5 | Aire comprimido y martillos | Familias · subelemento | `/alquiler/aire-martillos/` | — |
| 2.6 | Herramienta auxiliar | Familias · subelemento | `/alquiler/herramienta-auxiliar/` | — |
| 3 | Servicios | Página / enlace | `/servicios/` | — |
| 4 | Formación | Página / enlace | `/formacion/` | — |
| 5 | Contacto | Página / enlace | `/contacto/` | — |
| 6 | Delegaciones | Página / enlace | `/delegaciones/` | — |
| 7 | ¿Qué máquina necesito? | Página / enlace | `/asesor/` | `jm-sin-flecha` |
| 8 | Comparador | Página / enlace | `/comparador/` | `jm-sin-flecha` |

- Los subelementos de «Alquiler» se añaden desde la caja **Familias** (no
  como enlace personalizado): así el shortcode encuentra el icono de cada
  familia en su metadato `jm_icono`.
- `jm-sin-flecha` quita la flecha de la derecha, como en el original.
- Si no se asigna ningún menú a la ubicación, `[jm_nav_movil]` pinta
  exactamente esta misma lista (con las familias leídas de la taxonomía).
- «Noticias» no va (módulo apagado). Si se enciende: entre Formación y Contacto.

---

## 3. Ajustes del sitio de Elementor (kit)

*Elementor → Ajustes del sitio*:

| Sección | Ajuste | Valor | Por qué |
|---|---|---|---|
| Tipografía global | Fuentes del sistema | Dejar **sin** familia en Principal/Secundaria/Texto/Acento (o borrarlas) | Las fuentes (Archivo, Plus Jakarta Sans, Geist Mono) las carga el plugin y las aplica `body.jm`; si el kit pone otra, Elementor la pide a Google por duplicado. |
| Colores globales | Principal/Secundario/Texto/Acento | Opcional: `#e30613`, `#14171a`, `#4a545c`, `#e30613` | Solo para que el selector de color del panel muestre los de la marca; el CSS no los usa. |
| Diseño | Ancho del contenido | 1320 px | Igual que `--jm-ancho-placa`. |
| Diseño | Separación entre widgets / hueco por defecto | 0 | El ritmo lo ponen las clases. |
| Diseño | Relleno por defecto del contenedor | 0 en los cuatro lados | Ídem (el adaptador también lo fuerza). |
| Diseño → Puntos de ruptura | Móvil | 767 px | = `md` 768 del original. |
| Diseño → Puntos de ruptura | Tableta | 1023 px | = `lg` 1024 del original (por defecto Elementor usa 1024 y la tableta incluiría 1024 px). |
| Diseño → Puntos de ruptura | Pantalla ancha | 1440 px (activar si se usa) | = `xl`. |
| Fondo | — | Sin fondo | `body.jm` pone el blanco. |

*Elementor → Ajustes*:

| Ajuste | Valor |
|---|---|
| Funciones → Contenedor flexbox, Elementos anidados (necesario para el widget Menú), DOM optimizado, Carga de recursos mejorada | Activos |
| Avanzado → Cargar Google Fonts | Desactivado (las carga el plugin) |
| Avanzado → Carga de archivos SVG / sin filtrar | Activado (logos en SVG) |
| Avanzado → Font Awesome 4 Shim | Desactivado |

*Tema Hello Elementor*: la cabecera y el pie del tema quedan sustituidos por
las plantillas de Theme Builder. El enlace «Saltar al contenido» de Hello
(destino `#content`) sustituye al «Saltar al contenido» del layout de Next.

---

## 4. Shortcodes de datos de empresa

Para usar dentro de **Editor de texto** (ejecuta shortcodes) o con el widget Shortcode:

| Shortcode | Devuelve |
|---|---|
| `[jm_dato clave="telefono"]` | 91 361 31 31 (ajuste) |
| `[jm_dato clave="tel"]` | +34913613131 |
| `[jm_dato clave="email"]` | jofemesa@jofemesa.com (ajuste) |
| `[jm_dato clave="lema"]` | Llegamos lejos para estar cerca. |
| `[jm_dato clave="razon_social"]` | JOFEME S.A. |
| `[jm_dato clave="cif"]` | A33098948 |
| `[jm_dato clave="fundacion"]` | 1987 (año del ajuste de fundación) |
| `[jm_dato clave="fundacion_fecha"]` | 24/03/1987 |
| `[jm_dato clave="anios"]` | años cumplidos hoy |
| `[jm_dato clave="anio"]` | año en curso |
| `[jm_dato clave="domicilio"]` · `nombre` · `web` | de `empresa.json` |
| `[jm_tel]` · `[jm_tel texto="Llámanos" clase="…"]` | enlace `tel:` con el teléfono principal |
| `[jm_antiguedad]` | «39 años» en el HTML; el navegador lo cambia a «39 años · 6 meses · 19 días» (Antiguedad.tsx) |

---

## 5. Lo que no se porta

- **BarraProgreso** (el filete rojo de carga arriba): no se porta. En Next
  existía porque la navegación es de cliente y entre el clic y la página
  nueva no pasaba nada visible. En WordPress cada enlace es una carga
  completa: el navegador ya enseña su indicador de carga y la página
  anterior se queda en pantalla hasta que llega la nueva. Una barra en JS no
  sobreviviría a la recarga y solo añadiría peso.
- **Saltar al contenido** propio: lo da Hello Elementor (ver §3).

---

## Lista de comprobación

- [ ] Menú «Principal» creado y asignado a la ubicación «JOFEMESA · Menú principal (panel móvil)».
- [ ] Familias añadidas como subelementos de «Alquiler» desde la caja Familias.
- [ ] `jm-sin-flecha` en «¿Qué máquina necesito?» y «Comparador».
- [ ] Puntos de ruptura del kit: móvil 767, tableta 1023.
- [ ] Google Fonts de Elementor desactivado; tipografías del kit vacías.
- [ ] En un móvil, la barra «Llamar / Consultar» está fija abajo y el pie no queda tapado.
- [ ] En una página «Lienzo» la barra no aparece.
