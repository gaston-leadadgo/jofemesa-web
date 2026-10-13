# 01 · Cabecera (franja + cabecera + menú móvil)

Traducción de `src/components/layout/Header.tsx`, `DesplegableDelegaciones.tsx`,
`DesplegableTelefonos.tsx`, `useDesplegable.ts` y `marca/ContadorFundacion.tsx`.
Estilos: `assets/css/20-global.css`. Comportamiento: `assets/js/10-global.js`.
Shortcodes: `includes/60-global.php`.

## Dónde se crea

**Plantillas → Theme Builder → Cabecera → Añadir nueva** · nombre «Cabecera JOFEMESA».
Condición: **Todo el sitio**. Los tres contenedores raíz van en este orden y los
tres en **Ancho completo**, sin nada en la pestaña Estilo.

> Antes de empezar: sube a **Medios** `assets/marca/logo-jofemesa.svg` (y el
> resto de la carpeta, que se usa en el pie). Si WordPress rechaza el SVG,
> activa *Elementor → Ajustes → Avanzado → Habilitar la carga de archivos SVG*.

## Árbol de montaje

```
Contenedor · div · Ancho completo · Clases: jm-franja                    ← franja oscura (se oculta < 768 px)
└─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-contenedor jm-franja__fila
   ├─ Shortcode · [jm_contador_fundacion]
   └─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-franja__derecha
      ├─ Shortcode · [jm_desplegable_delegaciones]
      └─ Título · Etiqueta HTML: span · Clases: jm-label-sm jm-franja__enlace
           Texto: «¿Qué máquina necesito?» · Enlace: /asesor/

Contenedor · header · Ancho completo · Clases: jm-cabecera               ← la barra blanca
│  Atributos: data-jm|cabecera
└─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-contenedor jm-cabecera__fila
   ├─ Imagen · Clases: jm-cabecera__logo
   │    Imagen: logo-jofemesa.svg · Tamaño: Completo
   │    Texto alternativo (en Medios): «JOFEMESA · Alquiler de maquinaria»
   │    Enlace: URL personalizada → / (portada)
   ├─ Menú (Mega Menu) · Clases: jm-menu                                  ← ver «Ajustes del widget Menú»
   │  ├─ Elemento «Inicio» · Enlace: /
   │  ├─ Elemento «Alquiler» · Enlace: /alquiler/ · Desplegable: Sí
   │  │  └─ (contenido del desplegable)
   │  │     Contenedor · Ancho completo · Clases: jm-menu__panel
   │  │     ├─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-menu__panel-cab
   │  │     │  ├─ Título · Etiqueta HTML: p · Clases: jm-label-sm jm-menu__panel-titulo
   │  │     │  │    Texto: «Familias de maquinaria»
   │  │     │  └─ Botón · Clases: jm-enlace-flecha
   │  │     │       Texto: «Catálogo completo» · Enlace: /alquiler/
   │  │     │       Icono: Font Awesome «arrow-right» · Posición: Después
   │  │     └─ Shortcode · [jm_menu_familias]
   │  ├─ Elemento «Servicios» · Enlace: /servicios/
   │  ├─ Elemento «Formación» · Enlace: /formacion/
   │  └─ Elemento «Contacto» · Enlace: /contacto/
   └─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-cabecera__acciones
      ├─ Shortcode · [jm_desplegable_telefonos]
      ├─ Botón · Clases: jm-btn jm-btn--acento jm-btn--sm jm-cabecera__cta
      │    Texto: «Consultar disponibilidad» · Enlace: /consultar-disponibilidad/ · Sin icono
      └─ Shortcode · [jm_boton_menu] · Clases: jm-cabecera__hamburguesa

Contenedor · div · Ancho completo · Clases: jm-menu-movil                 ← panel móvil (oculto hasta pulsar ☰)
│  Avanzado → ID CSS: menu-movil
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-menu-movil__cuerpo
   ├─ Shortcode · [jm_nav_movil]
   ├─ Botón · Clases: jm-btn jm-btn--acento jm-btn--lg jm-btn--bloque jm-menu-movil__cta
   │    Texto: «Consultar disponibilidad» · Enlace: /consultar-disponibilidad/
   ├─ Shortcode · [jm_desplegable_telefonos variante="lista"]
   └─ Shortcode · [jm_redes tamano="20" variante="movil"]
```

El orden importa: el panel de delegaciones cae por encima de la cabecera
(`jm-franja` z-index 50, `jm-cabecera` 40) y el panel móvil va **fuera** de
`jm-cabecera`, porque el desenfoque de fondo de la cabecera (`backdrop-filter`)
convertiría su `position: fixed` en relativo a la cabecera.

## Ajustes del widget Menú (Mega Menu)

Solo pestaña **Contenido** (la de Estilo se deja intacta; el aspecto lo pone `jm-menu`):

| Ajuste | Valor |
|---|---|
| Diseño / Disposición | Horizontal |
| Abrir desplegable | **Al pasar el ratón** (el botón del chevron lo abre también con teclado y clic) |
| Punto de ruptura del menú desplegable | **Ninguno** (el menú de móvil es el panel `#menu-movil`; `jm-menu` se oculta por CSS por debajo de 1024 px, el `lg` del original) |
| Icono del desplegable | Font Awesome «chevron-down» en los dos estados (el CSS lo gira 180° al abrir y lo pone en rojo) |
| Ancho del contenido | **Ajustado al contenido** · Posición: izquierda/inicio |
| Desplegable en «Inicio», «Servicios», «Formación», «Contacto» | No |

«Noticias» **no** se añade: el módulo está apagado (`MODULOS.noticias = false`).
Si se enciende, se añade el elemento «Noticias» (/noticias/) entre «Formación» y
«Contacto», aquí, en el pie y en el menú de WordPress del panel móvil.

El enlace activo (texto negro con filete rojo debajo) lo pone `10-global.js`
con la misma regla que `activa()` de Header.tsx: la portada solo si es exacta;
el resto también en sus subrutas (en `/alquiler/elevacion/` se marca
«Alquiler»), con `aria-current="page"`. El `aria-label` del `<nav>` pasa a
«Navegación principal».

## Qué es nativo y qué es shortcode

| Pieza | Tipo | Por qué |
|---|---|---|
| Logo, «¿Qué máquina necesito?», menú principal, cabecera del desplegable, «Consultar disponibilidad» (×2) | **Nativo** | Textos y enlaces editables desde el panel. |
| `[jm_contador_fundacion]` | Shortcode | La cuenta años·meses·días se calcula en el navegador con la fecha de *Ajustes* y se anima con CSS (`@property`); ningún widget hace eso. |
| `[jm_desplegable_delegaciones]` | Shortcode | Lee las entradas `delegacion` (orden `jm_orden`), las agrupa España/Portugal con insignias Central/Sede y teléfono; necesita un `<button>` real con `aria-expanded`/`aria-controls`. |
| `[jm_desplegable_telefonos]` | Shortcode | Mismo motivo: los números salen de las delegaciones y de *Ajustes*; cada fila es un único enlace `tel:` de 44 px. |
| `[jm_menu_familias]` | Shortcode | Icono SVG de máquina, URL del término y «N referencias · rango» salen de los metadatos de `familia` (`jm_icono`, `jm_total`, `jm_rango`): así no se desincronizan del catálogo. |
| `[jm_boton_menu]` | Shortcode | El widget Botón genera un `<a>`; la hamburguesa tiene que ser `<button>` con `aria-expanded`, `aria-controls="menu-movil"` y el cambio ☰/✕. |
| `[jm_nav_movil]` | Shortcode | Pinta el menú de WordPress «jm-principal» (ver `04-globales.md`) con flecha, las familias con icono bajo «Alquiler» y el enlace activo; el widget de menú de Elementor esconde los submenús tras un clic y no lleva iconos de término. |
| `[jm_desplegable_telefonos variante="lista"]` | Shortcode | El `<details>` «Llamar a una delegación» con todos los teléfonos (mismos datos que el desplegable). |
| `[jm_redes …]` | Shortcode | Logos SVG propios (LinkedIn, Facebook, Instagram) con las URLs de *Ajustes*. |

## Comportamiento (lo pone `10-global.js`)

- **Compactación**: con `data-jm|cabecera`, al bajar más de 120 px la
  cabecera pasa de 60→56 px (móvil) y 72→60 px (desde 768 px).
- **Pegajosa**: el envoltorio de Theme Builder (`.elementor-location-header`)
  es `sticky` con `top: -37px` desde 768 px: la franja se va con el scroll y la
  barra blanca se queda. Con la barra de administración de WP se compensa.
- **Desplegables**: se abren con clic; se cierran con Escape (el foco vuelve
  al botón), clic fuera, al salir el foco del bloque, al pulsar un enlace del
  panel y al abrir el otro desplegable. Abrir el de teléfonos cierra el menú móvil.
- **Menú móvil**: el botón alterna la clase `jm-abierto` en `#menu-movil`,
  bloquea el scroll del fondo, se cierra con Escape, al pulsar un enlace y al
  pasar a escritorio. En el editor de Elementor el panel se ve en su sitio
  (con borde discontinuo) para poder editarlo.

## Lista de comprobación

- [ ] Plantilla de Cabecera con condición «Todo el sitio»; tres contenedores raíz en Ancho completo.
- [ ] `data-jm|cabecera` en el contenedor `jm-cabecera`; ID CSS `menu-movil` en `jm-menu-movil`.
- [ ] Widget Menú: punto de ruptura «Ninguno», abrir «Al pasar el ratón», ancho «Ajustado al contenido».
- [ ] Nada en la pestaña Estilo de ningún widget; ningún Efecto de movimiento.
- [ ] Por debajo de 768 px no se ve la franja ni el CTA; por debajo de 1024 px no se ve el menú y sí la hamburguesa.
- [ ] Desde 1440 px el teléfono muestra «91 361 31 31» y chevron; por debajo, solo el icono en un cuadrado.
- [ ] El contador pasa de «Especialistas en maquinaria desde 1987» a «39 años · N meses · N días».
- [ ] Escape cierra cualquier panel abierto; Tab fuera de un desplegable lo cierra.
- [ ] En `/alquiler/elevacion/` «Alquiler» sale subrayado en rojo.
