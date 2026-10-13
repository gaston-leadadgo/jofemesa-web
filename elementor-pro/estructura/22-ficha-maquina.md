# 22 · Ficha de máquina (/maquina/{slug}/) y modal

Traducción de `src/app/(site)/maquina/[slug]/page.tsx`,
`components/ficha/FichaMaquina.tsx`, `BotonComparar.tsx`, `ModalShell.tsx` y la
ruta interceptada `@modal/(.)maquina/[slug]`. Estilos: `41-ficha.css`.
Comportamiento: `44-modal.js` (modal), `42-comparador.js` (botón Comparar).

## Dónde se crea

**Plantillas → Theme Builder → Entrada individual (Single) → Añadir nueva** ·
«Ficha de máquina». Condición: **Incluir → Máquinas → Todo**.

## Una sola plantilla, dos usos

- **Página**: al recargar, pegar la URL o entrar Google se sirve completa,
  con migas, relacionadas y «Volver al catálogo».
- **Modal**: desde el catálogo (Loop Grid con `data-jm-modal|/maquina/`),
  `44-modal.js` descarga esta misma página, extrae el nodo marcado con
  `data-jm-modal-contenido` y lo enseña en un `<dialog>` con la barra del
  original (título «Marca Modelo», «Abrir la ficha», pantalla completa, ✕).
  Cambia la URL con `pushState`; Atrás, Escape, la ✕ y el fondo cierran.
  Las migas, las relacionadas y «Volver» quedan fuera del nodo, así que no
  salen en el modal (igual que en Next). Dentro del modal la rejilla pasa a
  dos columnas desde 768 px (11fr/9fr) y el modelo baja a `display-3`.

## Árbol de montaje

```
Contenedor · div · Ancho completo · Clases: jm-contenedor jm-ficha-pagina
├─ Shortcode · [jm_migas] · Clases: jm-ficha-migas                     → «Alquiler / Elevación / NANO SP PLUS»
├─ Contenedor · div · Ancho completo · Clases: jm-ficha
│  │  Atributos: data-jm-modal-contenido|
│  └─ Contenedor · div · Ancho completo · Clases: jm-ficha__rejilla
│     ├─ Contenedor · div · Ancho completo · Clases: jm-ficha__media
│     │  ├─ Contenedor · div · Ancho completo · Clases: jm-ficha__foto
│     │  │  ├─ Imagen · Clases: jm-foto-maquina
│     │  │  │    Imagen: dinámica «Imagen destacada» · Tamaño: Grande · Sin enlace
│     │  │  └─ Shortcode · [jm_foto_pendiente]
│     │  └─ Shortcode · [jm_ficha parte="destacados"]                   (lista con check verde)
│     └─ Contenedor · div · Ancho completo · Clases: jm-ficha__datos
│        ├─ Título · p · Clases: jm-label jm-ficha__sub
│        │    Etiqueta dinámica: ACF Field → jm_subcategoria_nombre
│        ├─ Título · p · Clases: jm-ficha__marca
│        │    Etiqueta dinámica: ACF Field → jm_marca
│        ├─ Título · h1 · Clases: jm-display-2 jm-ficha__modelo
│        │    Etiqueta dinámica: ACF Field → jm_modelo
│        ├─ Título · p · Clases: jm-lede jm-ficha__desc
│        │    Etiqueta dinámica: ACF Field → jm_descripcion
│        ├─ Shortcode · [jm_ficha parte="gama"]                         (aviso «gama completa», solo si lo es)
│        ├─ Contenedor · div · Ancho completo · Clases: jm-ficha__specs
│        │  ├─ Título · h2 · Clases: jm-label jm-ficha__specs-titulo · «Especificaciones»
│        │  └─ Shortcode · [jm_specs]
│        ├─ Shortcode · [jm_ficha parte="aplicaciones"]                 (incluye su título «Para qué se usa»)
│        ├─ Contenedor · div · Ancho completo · Clases: jm-ficha__servicio
│        │  ├─ Título · h2 · Clases: jm-label jm-ficha__servicio-titulo · «Se sirve desde»
│        │  ├─ Shortcode · [jm_ficha parte="delegaciones"]
│        │  └─ Título · p · Clases: jm-ficha__servicio-nota
│        │       «Con transporte propio entre delegaciones. La disponibilidad de la fecha la confirma
│        │        la delegación que te atiende al responder tu solicitud.»
│        ├─ Shortcode · [jm_ficha parte="nota"]                         (nota del asesor, si la hay)
│        └─ Contenedor · div · Ancho completo · Clases: jm-ficha__acciones
│           ├─ Botón · Clases: jm-btn jm-btn--acento jm-btn--lg jm-btn--bloque
│           │    «Consultar disponibilidad» · Sin icono
│           │    Enlace: dinámico ACF Field → jm_slug · Antes: /consultar-disponibilidad/?m=
│           ├─ Contenedor · div · Ancho completo · Clases: jm-ficha__pareja
│           │  ├─ Shortcode · [jm_ficha parte="pdf"]                     («Ficha técnica (1,0 MB)», solo si hay PDF)
│           │  └─ Botón · Clases: jm-btn jm-btn--contorno jm-ficha__telefono
│           │       Texto: etiqueta dinámica «Shortcode» [jm_dato clave="telefono"] · Icono FA phone · Antes
│           │       Enlace: etiqueta dinámica «Shortcode» [jm_dato clave="tel"] · Avanzado → Antes: tel:
│           └─ Botón · Clases: jm-btn jm-btn-comparar
│                «Añadir al comparador» · Enlace: #comparar · Icono FA «columns» · Antes
├─ Contenedor · section · Ancho completo · Clases: jm-ficha__relacionadas
│  ├─ Título · h2 · Clases: jm-display-3 jm-ficha__relacionadas-titulo · «Máquinas parecidas»
│  └─ Loop Grid · Clases: jm-rejilla-maquinas jm-rejilla-relacionadas
│       Plantilla: «Tarjeta de máquina» · Consulta: ID de consulta jm_relacionadas
│       Elementos por página: 3 · Paginación: Ninguna
└─ Botón · Clases: jm-btn jm-btn--enlace jm-ficha__volver
     «Volver al catálogo» · Enlace: /alquiler/ · Icono FA arrow-left · Antes
```

El botón Comparar de la ficha cambia a «En el comparador» (negro) al pulsarlo;
con 4 máquinas queda deshabilitado con el aviso «Ya hay 4 máquinas en el
comparador». Lo resuelve el JS con la clase `jm-maq-{slug}` del `<body>` (o
del nodo del modal); no hace falta ningún atributo.

## Por qué hay shortcodes

| Shortcode | Por qué |
|---|---|
| `[jm_specs]` | Tabla agrupada (Prestaciones, Capacidades, Dimensiones, Motorización) con el estado de cada dato y la nota final, que cambia si hay estimados. Lleva `data-jm-slug`. |
| `[jm_ficha parte="destacados"]` | El campo es «una por línea»; se pinta como lista con check verde. |
| `[jm_ficha parte="aplicaciones"]` | Igual, en chips; si no hay, no sale ni el título. |
| `[jm_ficha parte="delegaciones"]` | Las delegaciones que sirven la máquina (dato importado). |
| `[jm_ficha parte="gama"]` / `parte="nota"` | Bloques condicionales. |
| `[jm_ficha parte="pdf"]` | Sin PDF no se dibuja (nunca una descarga rota) y lleva el peso del archivo. |
| `[jm_migas]` | `inicio="Alquiler"`. |

## Lista de comprobación

- [ ] /maquina/jlg-nano-sp-plus/ carga como página completa con migas, relacionadas y «Volver al catálogo».
- [ ] Desde /alquiler/ la ficha se abre en modal; «Abrir la ficha» lleva a la página; Atrás, Escape, ✕ y clic fuera cierran.
- [ ] Pantalla completa (≥ 768 px) ocupa toda la ventana y el cuerpo sigue haciendo scroll.
- [ ] Una máquina con datos estimados enseña el subrayado ámbar y la frase «Las subrayadas en ámbar…».
- [ ] Una máquina sin PDF no tiene botón de ficha técnica; con PDF dice «Ficha técnica (x MB)».
- [ ] «Añadir al comparador» ↔ «En el comparador» y la bandeja lo refleja.
- [ ] El Single NO lleva Efectos de movimiento; si se usa `data-revelar`, el modal lo muestra entero igualmente.
