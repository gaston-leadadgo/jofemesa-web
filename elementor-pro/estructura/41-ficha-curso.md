# 41 · Ficha del curso (Single «curso», `/formacion/cursos/{slug}/`)

Traducción de `components/formacion/FichaCurso.tsx`, `ProximasCurso.tsx` y
`app/(site)/formacion/cursos/[curso]/page.tsx`. Estilos: `assets/css/50-formacion.css`.
Shortcodes: `includes/75-formacion.php`. La misma plantilla sirve para la página propia del
curso y para el **modal** que se abre desde `/formacion/` (44-modal.js carga la URL y se queda
con el nodo `[data-jm-modal-contenido]`).

## Dónde se crea

**Plantillas → Theme Builder → Single → Añadir nueva** · tipo «Entrada individual» ·
nombre «Ficha de curso» · Condición: **Incluir → Cursos → Todos**. Contenedores en
**Ancho completo**.

## Árbol de montaje

```
Contenedor · Clases: jm-contenedor jm-ficha-pagina
├─ Botón · Clases: jm-btn jm-volver jm-volver--ficha
│    «Todos los cursos de Formación» · Enlace: /formacion/#cursos · Icono FA «arrow-left» · Antes
└─ Contenedor · article · Clases: jm-ficha-curso · Atributos: data-jm-modal-contenido|
   ├─ Contenedor · header
   │  ├─ Shortcode · [jm_curso_chips variante="ficha"]
   │  ├─ Título · h1 · Clases: jm-ficha-curso__titulo · Etiqueta dinámica: ACF Field → jm_titulo_largo
   │  ├─ Título · p · Clases: jm-ficha-curso__desc · ACF Field → jm_descripcion
   │  └─ Contenedor · Clases: jm-ficha-curso__datos
   │     ├─ Contenedor · Clases: jm-ficha-curso__dato
   │     │  ├─ Lista de iconos · Clases: jm-meta jm-ficha-curso__k · FA «clock» · «Duración»
   │     │  └─ Título · p · Clases: jm-ficha-curso__v · ACF Field → jm_duracion
   │     ├─ Contenedor · Clases: jm-ficha-curso__dato
   │     │  ├─ Lista de iconos · jm-meta jm-ficha-curso__k · FA «users» · «Modalidad»
   │     │  └─ Título · p · jm-ficha-curso__v · ACF Field → jm_modalidad
   │     └─ Contenedor · Clases: jm-ficha-curso__dato jm-ficha-curso__dato--ancho
   │        ├─ Lista de iconos · jm-meta jm-ficha-curso__k · FA «balance-scale» · «Normativa»
   │        └─ Título · p · jm-ficha-curso__v · ⚡ Shortcode [jm_curso que="normativa"]
   └─ Contenedor · Clases: jm-ficha-curso__cuerpo
      ├─ Contenido de la entrada · Clases: jm-ficha-curso__preguntas      ← las preguntas (h3 + p)
      └─ Contenedor · aside · Clases: jm-ficha-curso__aside
         ├─ Shortcode · [jm_proximas_curso max="4"]                       ← no pinta nada en cursos a medida
         └─ Contenedor · Clases: jm-ficha-cta
            ├─ Título · p · Clases: jm-ficha-cta__titulo
            │    ⚡ Shortcode [jm_curso que="cta-titulo" abierta="¿Otra fecha o un grupo a formar?" medida="¿Quieres este curso?"]
            ├─ Título · p · Clases: jm-ficha-cta__texto
            │    «Cuéntanos cuántas personas y dónde, y Formación te prepara la propuesta.»
            ├─ Botón · Clases: jm-btn jm-btn--acento jm-btn--sm jm-btn--bloque jm-ficha-cta__boton
            │    «Solicitar información» · Enlace: ⚡ Shortcode [jm_curso que="url-solicitar"]
            │    Icono FA «arrow-right» · Después
            └─ Shortcode · [jm_tel_formacion variante="ficha" prefijo="Formación · "]
```

Notas:

- El **contenido** de cada curso lo escribe el importador: `<h3>pregunta</h3><p>…</p>`, con
  `<p class="jm-nota">` en las notas. El plugin reescribe el enlace «calendario de convocatorias
  abiertas» a `/formacion/#calendario-{curso}` para que el calendario quede filtrado.
- En el modal, el botón «← Todos los cursos» queda fuera (no está dentro de `data-jm-modal-contenido`).
  El título del modal y «Abrir la página del curso» los pone 44-modal.js.

| Pieza no nativa | Motivo |
|---|---|
| `[jm_curso_chips variante="ficha"]` | «Certificado por AENOR · UNE 58923» con insignia (solo si hay) + «Convocatoria abierta» / «A medida» según `jm_convocatoria_abierta`. |
| `[jm_proximas_curso]` | Próximas 4 fechas con «Solicitar plaza», «Ver las N fechas en el calendario» y estado vacío; el JS quita las pasadas si la página viene de caché. |
| `[jm_curso que="…"]` como etiqueta | Textos y URL que dependen de si el curso es de convocatoria (el texto se edita en los atributos). |
| `[jm_tel_formacion]` | Teléfono de Formación desde Ajustes. |

## Lista de comprobación

- [ ] Condición: Cursos → Todos. Abre `/formacion/cursos/plataformas/` y `/formacion/cursos/ipaf/`.
- [ ] En Plataformas sale «Próximas convocatorias»; en IPAF no, y el título del CTA es «¿Quieres este curso?».
- [ ] El atributo `data-jm-modal-contenido|` está en el contenedor *article* (no en el exterior).
- [ ] Desde la tarjeta de `/formacion/`, «Ver información del curso» abre el modal y «Ver en el calendario» lo cierra y filtra.
- [ ] A ≥ 768 px el lateral se queda fijo al bajar; a 375 px va debajo de las preguntas.
