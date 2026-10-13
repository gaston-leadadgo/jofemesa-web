# 20 · Catálogo de alquiler (/alquiler/ y archivo de familia)

Traducción de `src/app/(site)/alquiler/page.tsx`, `alquiler/[familia]/page.tsx`,
`components/alquiler/AlquilerCliente.tsx`, `PanelFiltros.tsx`,
`TiraCategorias.tsx` y `lib/catalog/index.ts`.
Estilos: `assets/css/40-catalogo.css` (+ `10-placa.css`). Comportamiento:
`assets/js/40-catalogo.js` (filtros), `42-comparador.js` (casilla y botón
Comparar), `44-modal.js` (la ficha se abre encima). Shortcodes:
`includes/70-catalogo.php`.

## Cómo funciona (en una línea por pieza)

| Pieza | Qué es | Por qué |
|---|---|---|
| Cabecera oscura | Nativa (patrón `jm-placa`) | Textos editables. |
| Tiras de familias y subcategorías | `[jm_catalogo_categorias]` | Recuentos, flechas que aparecen solo si hay contenido fuera de vista y estado activo según la URL: no hay widget que lo haga. |
| Panel de filtros técnicos | `[jm_catalogo_filtros]` | Casillas con recuento, opciones a cero deshabilitadas (no ocultas), hoja inferior en móvil. Imprime además el JSON con los datos de filtrado. |
| Contador, orden, buscador móvil, «Filtrar», chips | `[jm_catalogo_barra]` | Cambian con cada filtro. |
| Tarjetas | **Loop Grid nativo** (ID de consulta `jm_catalogo`, plantilla de 21-loop-tarjeta-maquina) | El cliente edita la tarjeta; se pintan TODAS en el HTML (rastreables) y el JS solo filtra, ordena y pagina de 24 en 24. |
| Estado vacío y «Ver N máquinas más» | `[jm_catalogo_pie]` | Sugerencias «Quitar el filtro de…» calculadas al vuelo. |
| Cifras de la cabecera | `[jm_catalogo_cifra]` dentro de un Título (etiqueta dinámica *Shortcode*) | Se recalculan solas al añadir máquinas. |

**URL (iguales que la web original, para el asesor y los WhatsApp):**
`?fam=elevacion&sub=tijeras-electricas&energia=electrico,hibrido&uso=interior&del=madrid&marca=Genie&hmin=10&hmax=16&carga=200&q=gs-4390&orden=altura-desc`.
`fam` admite el id (`manipulacion`) o el slug (`manutencion`). Se actualiza con
`replaceState`: volver atrás desde una ficha restaura la vista filtrada.

---

## A · Página «Alquiler» (/alquiler/)

**Páginas → Añadir nueva** · Título «Alquiler de maquinaria» · slug `alquiler` ·
Plantilla **Elementor Ancho completo** · Editar con Elementor.

> El slug `alquiler` coincide con la base de la taxonomía `familia`
> (`/alquiler/elevacion/`). WordPress resuelve antes la página que el término;
> si /alquiler/ diera 404, vuelve a guardar *Ajustes → Enlaces permanentes*.

```
① CABECERA (placa)
Contenedor · section · Ancho completo · Clases: jm-placa
├─ HTML · Clases: jm-placa__galon
│    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M20 10 L110 100 L20 190" stroke="currentColor" stroke-width="26"/><path d="M90 10 L180 100 L90 190" stroke="currentColor" stroke-width="26"/></svg>
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-placa__cuerpo
   └─ Contenedor · Ancho completo · Clases: jm-placa__rejilla
      ├─ Contenedor · Ancho completo · Clases: jm-placa__texto
      │  ├─ Título · p · Clases: jm-label jm-placa__kicker
      │  │    «Catálogo de alquiler»
      │  ├─ Título · h1 · Clases: jm-titular-placa jm-placa__titulo · Atributos: data-revelar|
      │  │    «La máquina que te falta, lista para salir a tu obra.»
      │  ├─ Editor de texto · Clases: jm-placa__lede jm-hereda · Atributos: data-revelar| · style|--retardo:1
      │  │    «Plataformas, manutención, tierras, energía, aire y herramienta, con flota, taller
      │  │     y camiones propios. Filtra por altura, alimentación, uso o fabricante y pide
      │  │     disponibilidad: te contesta la delegación que tiene la máquina.»
      │  └─ Contenedor · Ancho completo · Clases: jm-placa__botones · Atributos: data-revelar| · style|--retardo:2
      │     ├─ Botón · Clases: jm-btn jm-btn--acento
      │     │    «Consultar disponibilidad» · Enlace: /consultar-disponibilidad/ · Icono FA arrow-right · Después
      │     └─ Botón · Clases: jm-btn jm-btn--enlace
      │          «No sé qué máquina necesito» · Enlace: /asesor/
      └─ Contenedor · Ancho completo · Clases: jm-placa__datos
         ├─ Contenedor · jm-placa__dato
         │  ├─ Título · p · jm-placa__dato-k · «Referencias»
         │  └─ Título · p · jm-placa__dato-v · Etiqueta dinámica «Shortcode»: [jm_catalogo_cifra dato="referencias"]
         ├─ Contenedor · jm-placa__dato
         │  ├─ Título · p · jm-placa__dato-k · «Altura máxima»
         │  └─ Título · p · jm-placa__dato-v · «57 m»
         └─ Contenedor · jm-placa__dato
            ├─ Título · p · jm-placa__dato-k · «Delegaciones»
            └─ Título · p · jm-placa__dato-v · Etiqueta dinámica «Shortcode»: [jm_catalogo_cifra dato="delegaciones"]

② TIRAS DE CATEGORÍA (a todo el ancho)
Contenedor · div · Ancho completo · Clases: jm-catalogo-tiras
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-catalogo-tiras__interior
   └─ Shortcode · [jm_catalogo_categorias]

③ CATÁLOGO
Contenedor · div · Ancho completo · Clases: jm-contenedor jm-catalogo          ← SIN data-revelar (rompería el sticky y la hoja móvil)
├─ Contenedor · aside · Ancho completo · Clases: jm-catalogo__lateral
│  └─ Shortcode · [jm_catalogo_filtros]
└─ Contenedor · div · Ancho completo · Clases: jm-catalogo__principal
   ├─ Shortcode · [jm_catalogo_barra]
   ├─ Loop Grid · Clases: jm-rejilla-maquinas jm-catalogo-rejilla
   │    Atributos: data-jm-modal|/maquina/          ← la ficha se abre en modal sobre el listado
   │    Plantilla: «Tarjeta de máquina» (21-loop-tarjeta-maquina.md)
   │    Consulta: Fuente «Máquinas» · ID de consulta: jm_catalogo
   │    Columnas 3 / 2 / 1 (la rejilla real la pone la clase) · Elementos por página: 200
   │    Paginación: Ninguna · Igualar alturas: Sí · Nada en Estilo
   └─ Shortcode · [jm_catalogo_pie]
```

## B · Plantilla de archivo de familia (/alquiler/{familia}/)

**Plantillas → Theme Builder → Archivo → Añadir nueva** · «Archivo de familia».
Condición: **Incluir → Archivos → Familias y subcategorías → Todo**.

Mismo árbol que la página, con estos cambios en la cabecera:

```
Contenedor · section · Clases: jm-placa
├─ Imagen · Clases: jm-fondo-img jm-placa__foto        (opcional: foto de obra de la familia)
├─ HTML · Clases: jm-placa__velo · (vacío)            (solo si hay foto; si no, el HTML jm-placa__galon)
└─ Contenedor · jm-contenedor jm-placa__cuerpo
   ├─ Shortcode · [jm_migas] · Clases: jm-placa__migas                 → «Alquiler / Elevación»
   └─ Contenedor · jm-placa__rejilla
      ├─ Contenedor · jm-placa__texto
      │  ├─ Título · p · jm-label jm-placa__kicker · Etiqueta dinámica: ACF Field → jm_nombre_largo (término)
      │  ├─ Título · h1 · jm-titular-placa jm-placa__titulo · Etiqueta dinámica: ACF Field → jm_claim
      │  ├─ Editor de texto · jm-placa__lede jm-hereda · Etiqueta dinámica: ACF Field → jm_descripcion
      │  └─ Contenedor · jm-placa__botones
      │     ├─ Botón · jm-btn jm-btn--acento · «Consultar disponibilidad» · arrow-right Después
      │     │    Enlace dinámico: ACF Field jm_nombre_largo · Avanzado → Antes: /consultar-disponibilidad/?contexto=
      │     └─ Botón · jm-btn jm-btn--enlace · «No sé cuál necesito» · /asesor/
      └─ Contenedor · jm-placa__datos
         ├─ jm-placa__dato · «Referencias» · [jm_catalogo_cifra dato="referencias"]   (cuenta solo esa familia)
         ├─ jm-placa__dato · «Rango» · Etiqueta dinámica: ACF Field → jm_rango
         └─ jm-placa__dato · «Delegaciones» · [jm_catalogo_cifra dato="delegaciones"]
```

② y ③ idénticos: los shortcodes detectan solos la familia del archivo
(`jm_catalogo` ya devuelve solo esa familia). En un archivo de **subcategoría**
la subcategoría queda fija.

## Shortcodes de esta página

| Shortcode | Atributos | Notas |
|---|---|---|
| `[jm_catalogo_filtros]` | `familia=""` (slug, para forzarla fuera de un archivo) | Uno por página. Contiene el `<script id="jm-catalogo-datos">`. |
| `[jm_catalogo_categorias]` | `familia=""` | Familias = enlaces a su URL de campaña; subcategorías = filtro `?sub=`. |
| `[jm_catalogo_barra]` | — | |
| `[jm_catalogo_pie]` | — | |
| `[jm_catalogo_cifra]` | `dato="referencias\|delegaciones"`, `familia=""` | Devuelve solo el número. |
| `[jm_migas]` | `inicio="Alquiler"` | Se registra aquí solo si nadie lo ha hecho antes. |

## Lista de comprobación

- [ ] /alquiler/ muestra 145 tarjetas sin JS y 24 + «Ver 24 máquinas más» con JS.
- [ ] El contador dice «145 máquinas»; marcar «Eléctrica» actualiza contador, recuentos y URL (`?energia=electrico`).
- [ ] Las opciones con 0 salen en gris y deshabilitadas, no desaparecen.
- [ ] «Hasta 6 m» + «Excavación» deja la lista vacía y ofrece «Quitar el filtro de altura → N».
- [ ] `/alquiler/?fam=elevacion&hmin=10&hmax=16` (enlace del asesor) llega filtrado y con Elevación activa en la tira.
- [ ] En /alquiler/elevacion/ la tira marca Elevación, salen sus subcategorías y la cabecera cuenta 80.
- [ ] Móvil (< 1024): «Filtrar» abre la hoja inferior; «Ver N máquinas» la cierra; Escape también.
- [ ] Las flechas de la tira solo aparecen si hay categorías fuera de vista.
- [ ] Pulsar «Ficha» o el modelo abre la ficha en modal; Atrás la cierra y el scroll y los filtros siguen igual.
- [ ] Ningún contenedor del catálogo lleva Efectos de movimiento, transform ni `data-revelar`.
