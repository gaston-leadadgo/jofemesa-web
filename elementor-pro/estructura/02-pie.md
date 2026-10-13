# 02 · Pie

Traducción de `src/components/layout/Footer.tsx` (+ `marca/RedesSociales.tsx`
y la filigrana de `marca/Hexagono.tsx`). Estilos: `assets/css/20-global.css` §7.
Shortcodes: `includes/60-global.php`.

## Dónde se crea

**Plantillas → Theme Builder → Pie de página → Añadir nuevo** · nombre «Pie JOFEMESA».
Condición: **Todo el sitio**. Todos los contenedores en **Ancho completo**.

Elementor ya envuelve la plantilla en `<footer class="elementor-location-footer">`:
el contenedor raíz va como `div` para no anidar dos `<footer>`.

## Árbol de montaje

```
Contenedor · div · Ancho completo · Clases: jm-pie                       ← fondo negro + hexágono de filigrana (CSS)
├─ Contenedor · Ancho completo · Clases: jm-contenedor jm-pie__cuerpo
│  └─ Contenedor · Ancho completo · Clases: jm-pie__rejilla              ← 1 col · 2 col (768) · 12 col (1024)
│     │
│     ├─ Contenedor · Clases: jm-pie__col jm-pie__marca                  ← 3/12
│     │  ├─ Imagen · Clases: jm-pie__logo · Imagen: logo-jofemesa-blanco.svg
│     │  │    Texto alternativo: «JOFEMESA · Alquiler de maquinaria» · Sin enlace
│     │  ├─ Título · Etiqueta HTML: p · Clases: jm-pie__lema
│     │  │    Texto: «Llegamos lejos para estar cerca.»
│     │  ├─ Editor de texto · Clases: jm-pie__razon jm-hereda
│     │  │    Texto: [jm_dato clave="razon_social"] · CIF [jm_dato clave="cif"]. Alquiler de maquinaria desde [jm_dato clave="fundacion"].
│     │  ├─ Lista de iconos · Disposición: En línea · Clases: jm-pie__correo
│     │  │    Elemento: Texto «jofemesa@jofemesa.com» · Icono: Font Awesome «envelope» (regular)
│     │  │    Enlace: mailto:jofemesa@jofemesa.com
│     │  └─ Shortcode · [jm_redes tamano="18" variante="pie"]
│     │
│     ├─ Contenedor · Etiqueta HTML: nav · Clases: jm-pie__col jm-pie__familias       ← 3/12
│     │  │  Atributos: aria-label|Familias de maquinaria
│     │  ├─ Título (h2) · Clases: jm-label jm-pie__titulo · Texto: «Maquinaria»
│     │  └─ Lista de iconos · Sin icono · Clases: jm-pie__lista
│     │       «Elevación» → /alquiler/elevacion/
│     │       «Manutención de cargas» → /alquiler/manutencion/
│     │       «Excavación y movimiento de tierras» → /alquiler/movimiento-tierras/
│     │       «Energía e iluminación» → /alquiler/energia/
│     │       «Aire comprimido y martillos» → /alquiler/aire-martillos/
│     │       «Herramienta auxiliar» → /alquiler/herramienta-auxiliar/
│     │
│     ├─ Contenedor · Etiqueta HTML: nav · Clases: jm-pie__col jm-pie__secciones      ← 2/12
│     │  │  Atributos: aria-label|Secciones
│     │  ├─ Título (h2) · Clases: jm-label jm-pie__titulo · Texto: «Secciones»
│     │  ├─ Lista de iconos · Sin icono · Clases: jm-pie__lista
│     │  │    «Alquiler de maquinaria» → /alquiler/
│     │  │    «Venta y recambios» → /servicios/#venta
│     │  │    «Mantenimiento» → /servicios/#mantenimiento
│     │  │    «Transporte a obra» → /servicios/#transporte
│     │  │    «Formación y calendario» → /formacion/
│     │  │    «Delegaciones» → /delegaciones/
│     │  │    «Contacto» → /contacto/
│     │  ├─ Título (h2) · Clases: jm-label jm-pie__titulo jm-pie__titulo--sep · Texto: «Herramientas»
│     │  └─ Lista de iconos · Sin icono · Clases: jm-pie__lista
│     │       «¿Qué máquina necesito?» → /asesor/
│     │       «Comparador» → /comparador/
│     │       «Consultar disponibilidad» → /consultar-disponibilidad/
│     │
│     └─ Contenedor · Clases: jm-pie__col jm-pie__delegaciones           ← 4/12
│        ├─ Título (h2) · Clases: jm-label jm-pie__titulo · Texto: «Delegaciones y sede»
│        ├─ Shortcode · [jm_delegaciones_pie]
│        └─ Contenedor · Dirección: fila · Clases: jm-pie__certificados
│           ├─ Título (h2) · Clases: jm-label-sm jm-pie__certificados-titulo · Texto: «Certificados»
│           └─ Shortcode · [jm_certificados]
│
└─ Contenedor · Ancho completo · Clases: jm-pie__faldon                  ← el faldón rojo
   └─ Contenedor · Ancho completo · Clases: jm-contenedor jm-pie__faldon-fila
      ├─ Editor de texto · Clases: jm-pie__copy jm-hereda
      │    Texto: © [jm_dato clave="anio"] [jm_dato clave="razon_social"] · Todos los derechos reservados.
      └─ Lista de iconos · Disposición: En línea · Sin icono · Clases: jm-pie__legales
           «Aviso legal» → /aviso-legal/
           «Privacidad» → /privacidad/
           «Cookies» → /cookies/
```

Notas de fidelidad:

- Sin punto detrás de la razón social en el faldón: ya acaba en «S.A.».
- «Noticias» no aparece en «Secciones» (módulo apagado). Si se enciende, va
  entre «Delegaciones» y «Contacto» → /noticias/.
- El Editor de texto **sí** ejecuta shortcodes dentro del párrafo
  (`[jm_dato …]`); el widget Título no. Por eso la razón social y el año van
  en Editor de texto.

## Qué es nativo y qué es shortcode

| Pieza | Tipo | Por qué |
|---|---|---|
| Logo, lema, columnas de enlaces, títulos, correo, legales | **Nativo** | Editables desde el panel. |
| Razón social, CIF, año de fundación y año en curso | `[jm_dato]` dentro de un Editor de texto | Salen de *Ajustes* / `empresa.json`; el año del © cambia solo. |
| `[jm_redes tamano="18" variante="pie"]` | Shortcode | Logos SVG propios con las URLs de *Ajustes*; los iconos de marca de la biblioteca no coinciden con los trazos del original. |
| `[jm_delegaciones_pie]` | Shortcode | Lee las entradas `delegacion` en orden `jm_orden` (con la sede de Formación); nombre arriba y teléfono debajo, todo un enlace `tel:`. Una delegación nueva aparece sola. |
| `[jm_certificados]` | Shortcode | ISO, homologaciones y afiliaciones de `empresa.json`, con su descripción en `title`. |
| Hexágono de filigrana | CSS (`.jm-pie::before`) | Ornamento sin contenido: no merece un widget. |

## Lista de comprobación

- [ ] Plantilla de Pie con condición «Todo el sitio»; raíz `div` con `jm-pie`.
- [ ] Rejilla: 1 columna en móvil, 2 desde 768 px y 3/3/2/4 desde 1024 px.
- [ ] Contenedores de enlaces con etiqueta `nav` y `aria-label`.
- [ ] Ningún widget con estilos propios ni iconos en las listas de enlaces.
- [ ] El © muestra el año actual y «JOFEME S.A.» sin punto doble.
- [ ] Las delegaciones salen en dos columnas desde 1024 px con su teléfono.
- [ ] En móvil queda hueco bajo el faldón para la barra fija (lo imprime el plugin).
