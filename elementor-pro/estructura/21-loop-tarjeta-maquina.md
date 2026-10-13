# 21 · Tarjeta de máquina (Loop Item)

Traducción de `components/maquina/TarjetaMaquina.tsx`, `ImagenMaquina.tsx`,
`EtiquetaEnergia.tsx` y `spec/DatoValor.tsx`. Estilos: `40-catalogo.css`.
La casilla y el botón Comparar los gobierna `42-comparador.js`.

La usan: el catálogo (20-alquiler), las relacionadas de la ficha
(22-ficha-maquina) y el carrusel de destacadas de la portada.

## Dónde se crea

**Plantillas → Theme Builder → Elemento de bucle (Loop Item) → Añadir nuevo** ·
nombre «Tarjeta de máquina» · Tipo de contenido para la vista previa: *Máquinas*.

## Lo que pone el plugin en cada tarjeta (sin tocar nada)

El filtro `post_class` añade a la tarjeta (y al `<body>` de la ficha):
`jm-maq-{slug}`, `jm-energia-{electrico|diesel|hibrido|gasolina}`,
`jm-traccion-4x4` (diésel/híbrida/gasolina 4x4), `jm-gama` y `jm-sin-foto`.
Con eso el CSS colorea la etiqueta de energía, añade «4x4», enseña la
pastilla «Gama» y cambia la foto por el dibujo técnico.

## Árbol de montaje

```
Contenedor · article · Ancho completo · Clases: jm-tarjeta jm-tarjeta-maquina
├─ Contenedor · div · Ancho completo · Clases: jm-tarjeta-maquina__cabecera
│  ├─ Contenedor · div · Ancho completo · Clases: jm-tarjeta-maquina__nombre
│  │  ├─ Título · p · Clases: jm-label-sm jm-tarjeta-maquina__marca
│  │  │    Etiqueta dinámica: ACF Field → jm_marca
│  │  ├─ Título · h3 · Clases: jm-title jm-tarjeta-maquina__modelo
│  │  │    Etiqueta dinámica: ACF Field → jm_modelo · Enlace: dinámico «URL de la entrada»
│  │  └─ Título · p · Clases: jm-tarjeta-maquina__sub
│  │       Etiqueta dinámica: ACF Field → jm_subcategoria_nombre
│  └─ Contenedor · div · Ancho completo · Clases: jm-tarjeta-maquina__chips
│     ├─ Título · span · Clases: jm-label-sm jm-chip-energia
│     │    Etiqueta dinámica: ACF Field → jm_energia_nombre           («Eléctrico», «Diésel»…)
│     └─ Título · span · Clases: jm-label-sm jm-chip-gama
│          «Gama»                                                     (solo se ve si la máquina es gama)
├─ Contenedor · div · Ancho completo · Clases: jm-panel jm-tarjeta-maquina__foto
│  ├─ Imagen · Clases: jm-foto-maquina
│  │    Imagen: dinámica «Imagen destacada» · Tamaño: Grande (1024)
│  │    Enlace: URL personalizada → dinámica «URL de la entrada»
│  └─ Shortcode · [jm_foto_pendiente]                                  (dibujo + «Foto pendiente» si no hay foto)
├─ Shortcode · [jm_tarjeta_datos]                                      (las 3 cifras con su estado)
├─ Título · p · Clases: jm-tarjeta-maquina__desc
│    Etiqueta dinámica: ACF Field → jm_descripcion
└─ Contenedor · div · Ancho completo · Clases: jm-tarjeta-maquina__acciones
   ├─ Contenedor · div · Ancho completo · Clases: jm-tarjeta-maquina__pareja
   │  ├─ Botón · Clases: jm-btn jm-btn--acento jm-btn--sm
   │  │    «Ficha» · Enlace: dinámico «URL de la entrada» · Icono FA arrow-right · Después
   │  └─ Botón · Clases: jm-btn jm-btn--sm jm-btn-comparar
   │       «Comparar» · Enlace: #comparar · Icono FA «columns» (o table-columns) · Antes
   └─ Botón · Clases: jm-btn jm-btn--tinta jm-btn--sm
        «Consultar disponibilidad» · Sin icono
        Enlace: dinámico ACF Field → jm_slug · Avanzado → Antes: /consultar-disponibilidad/?m=
```

La casilla cuadrada de comparar (arriba a la derecha de la foto) **no se
monta**: la inserta `42-comparador.js` en cada `.jm-tarjeta-maquina__foto`.
Al marcarla el botón pasa a «Añadida» (rojo suave); con 4 máquinas el resto
se bloquea.

## Por qué hay dos shortcodes

| Pieza | Por qué no es nativa |
|---|---|
| `[jm_tarjeta_datos]` | Las 3 cifras cambian según la familia (altura/carga/anchura, profundidad/cazo…) y se pintan según su estado: pendiente (cinta ámbar con ⚠), estimado (subrayado ámbar con aviso), no aplica (—). |
| `[jm_foto_pendiente]` | 83 máquinas no tienen foto: se dibuja el icono técnico de su subcategoría y «Foto pendiente». Atributo `compacto="si"` quita el texto. |

## Lista de comprobación

- [ ] La tarjeta no es un enlace gigante: modelo, foto, Ficha, Comparar y Consultar son objetivos distintos.
- [ ] «JLG NANO SP PLUS»: etiqueta verde «Eléctrico», cifras 4,5 m · 200 kg · 750 mm.
- [ ] Una diésel 4x4 dice «Diésel 4x4»; una gama de Manitou enseña «Gama».
- [ ] Una máquina sin foto enseña el dibujo gris y «Foto pendiente», sin imagen rota.
- [ ] El modelo largo se corta en dos líneas; la descripción en dos.
- [ ] «Consultar disponibilidad» lleva a `/consultar-disponibilidad/?m={slug}`.
- [ ] Comparar alterna «Comparar» / «Añadida» y la bandeja aparece abajo.
