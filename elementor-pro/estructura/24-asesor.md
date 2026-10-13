# 24 · Asesor («¿Qué máquina necesito?»)

Traducción de `src/app/(site)/asesor/page.tsx` y de `src/components/asesor/Asesor.tsx`
(`AsesorUrl`). Cabecera: la placa de `assets/css/10-placa.css`. Panel:
`assets/css/31-asesor.css` + `assets/js/31-asesor.js` + el motor
`assets/js/asesor-motor.js` (la misma función `recomendar()` de la web Next),
que encola el shortcode `[jm_asesor]` de `includes/65-inicio.php`.

## Dónde se crea

**Páginas → Añadir nueva** · título «¿Qué máquina necesito?» · slug `asesor`
(URL `/asesor/`) · plantilla **Elementor Ancho completo**.
SEO (Yoast/Rank Math): descripción «Tres respuestas y te decimos qué maquinaria
de nuestro parque encaja con tu trabajo, tu altura y tu terreno. Sin llamar y
sin describir la obra a ciegas.»

Si la página se sirve con caché de página completa, excluye `/asesor/` con
parámetros: el estado vive en la URL (`?trabajo=&parametro=&entorno=`), pero
lo lee el navegador, así que la caché no rompe nada; solo lo indicamos porque
el original se servía «por petición».

## Árbol de montaje

```
Contenedor · section · Ancho completo · Clases: jm-placa                      ← placa oscura
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-placa__cuerpo
   └─ Contenedor · Ancho completo · Clases: jm-placa__rejilla
      ├─ Contenedor · Ancho completo · Clases: jm-placa__texto
      │  ├─ Título · p · Clases: jm-label jm-placa__kicker
      │  │    «Asistente de selección guiada»
      │  ├─ Título · h1 · Clases: jm-titular-placa jm-placa__titulo
      │  │    Atributos: data-revelar|
      │  │    «No sabes qué máquina pedir. Normal.»
      │  └─ Editor de texto · Clases: jm-placa__lede jm-hereda
      │       Atributos: data-revelar| · style|--retardo:1
      │       «Hay [jm_cifra que="referencias"] referencias en [jm_cifra que="familias"] familias,
      │       y la diferencia entre dos tijeras de la misma altura puede ser que una pase por tu
      │       puerta y la otra no. Contesta tres preguntas y te decimos qué encaja, y por qué.»
      └─ Contenedor · Ancho completo · Clases: jm-placa__datos
         │  Atributos: data-escalonar|
         ├─ Contenedor · Clases: jm-placa__dato
         │  ├─ Título · span · Clases: jm-placa__dato-k · «Preguntas»
         │  └─ Título · span · Clases: jm-placa__dato-v · «3»
         ├─ Contenedor · Clases: jm-placa__dato
         │  ├─ Título · span · Clases: jm-placa__dato-k · «Referencias»
         │  └─ Título · span · Clases: jm-placa__dato-v · etiqueta dinámica Shortcode [jm_cifra que="referencias"]
         └─ Contenedor · Clases: jm-placa__dato
            ├─ Título · span · Clases: jm-placa__dato-k · «Tiempo»
            └─ Título · span · Clases: jm-placa__dato-v · «Un minuto»

Contenedor · section · Ancho completo · Clases: jm-contenedor
└─ Shortcode · [jm_asesor variante="pagina"]
```

La placa no lleva foto ni botones (el original no los pasa): sin foto, añade
como primer hijo de `jm-placa` el **HTML** del galón (`jm-placa__galon`) si la
guía de la placa lo indica; es decorativo y opcional.

## Qué hace `[jm_asesor variante="pagina"]`

| Atributo | Valores | Efecto |
|---|---|---|
| `variante` | `pagina` | Estado en la URL con `pushState`; el botón atrás recorre el asistente; el resultado se comparte por enlace. Relleno vertical de 2,5 rem (`py-10`). |
| | `portada` (por defecto) | Estado local, para la portada. |
| `alternativas` | `0` (por defecto) / `1` | Con `1`, debajo de las recomendadas añade «También pueden servirte». El original **no** las enseña. |

Imprime una sola vez por página el JSON `#jm-asesor-datos` con lo que hace
falta para pintar cada fila (título, marca, modelo, enlace, foto, subcategoría,
dibujo SVG si no hay foto y las tres cifras de la tarjeta con su estado:
confirmado, estimado, pendiente o no aplica). Se guarda 12 h en un transitorio
que se borra al guardar una máquina.

Comportamiento (igual que `Asesor.tsx`):

- Barra: «N de 3 contestadas» con tres canales que se llenan; «Atrás» y
  «Empezar de nuevo» desde la primera respuesta.
- Tres selectores a la vez. El segundo depende del primero y arranca
  bloqueado con «Contesta primero qué trabajo tienes». Cambiar de trabajo
  borra solo la exigencia.
- Debajo, la descripción de cada opción elegida.
- Con las tres: «Esto es lo que te encaja» + «N de nuestro parque» (y
  «· nada encajaba exacto, esto es lo más cercano» si el motor relajó la
  búsqueda), hasta cuatro filas con foto, subcategoría, marca y modelo, tres
  cifras y tres razones; o «Nada encaja del todo» con el teléfono.
- «Consultar disponibilidad» → `/consultar-disponibilidad/?contexto=…&m=slug1,slug2…`
  y «Ver estas máquinas en el catálogo» → `/alquiler/?…` con los filtros del motor.
- El foco viaja al enunciado nuevo en cada paso.

## Qué es nativo y qué no

| Pieza | Cómo | Por qué |
|---|---|---|
| Placa, titulares y cifras | Widgets nativos (+ `[jm_cifra]`) | El cliente edita los textos. |
| El asistente | Shortcode `[jm_asesor]` + JS | Formulario dependiente con lógica de recomendación propia (motor compilado de la web Next). Ningún widget lo hace. |

## Lista de comprobación

- [ ] `/asesor/` con plantilla *Elementor Ancho completo*, contenedores en *Ancho completo*.
- [ ] Al elegir trabajo, la URL pasa a `?trabajo=…`; el botón atrás del navegador lo deshace.
- [ ] Abrir `/asesor/?trabajo=altura&parametro=…&entorno=interior-limpio` enseña directamente el resultado.
- [ ] Las filas enlazan a la ficha de cada máquina; las que no tienen foto muestran el dibujo gris.
- [ ] «Ver estas máquinas en el catálogo» abre el catálogo con los filtros aplicados.
- [ ] Sin JavaScript se ve el enunciado y un enlace al catálogo.
