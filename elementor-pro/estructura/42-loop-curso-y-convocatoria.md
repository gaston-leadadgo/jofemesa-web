# 42 · Loop Items: «Tarjeta de curso» y «Fila de convocatoria»

Traducción de `TarjetaCurso` (en `formacion/page.tsx`) y de `Fila` / `Plazas`
(`components/formacion/CalendarioFormacion.tsx`). Estilos: `assets/css/50-formacion.css`.
Shortcodes: `includes/75-formacion.php`. Se usan en `40-formacion.md`.

## Dónde se crean

**Plantillas → Theme Builder → Loop Item → Añadir nueva** (una por plantilla).
En *Ajustes de la página* (rueda dentada) del Loop Item: **Vista previa → Tipo de entrada**
«Cursos» para la primera y «Convocatorias» para la segunda (solo para ver datos al montar).
Contenedor raíz en **Ancho completo**.

## Etiqueta dinámica «Shortcode»

`⚡ Shortcode [..]` = en el campo (texto o enlace) pulsa el icono de etiquetas dinámicas →
**Shortcode** → escribe el shortcode. El widget sigue siendo nativo; solo el dato viene del plugin.

---

## A · «Tarjeta de curso»

```
Contenedor · article · Clases: jm-tarjeta jm-tcurso
├─ Contenedor · Dirección fila · Clases: jm-tcurso__cabeza
│  ├─ Icono · Clases: jm-pastilla-icono · FA «graduation-cap»
│  └─ Shortcode · [jm_curso_chips variante="tarjeta"]
├─ Título · h4 · Clases: jm-tcurso__nombre · Etiqueta dinámica: Título de la entrada
├─ Título · p · Clases: jm-tcurso__para · Etiqueta dinámica: ACF Field → jm_para_quien
├─ Lista de iconos · Clases: jm-tcurso__duracion
│    · Icono: FA «clock» (regular) · Texto: Etiqueta dinámica ACF Field → jm_duracion
└─ Contenedor · Dirección fila · Clases: jm-tcurso__pie
   ├─ Botón · Clases: jm-btn jm-tcurso__info jm-abrir-modal
   │    «Ver información del curso» · Enlace: Etiqueta dinámica «URL de la entrada»
   │    Icono: FA «info-circle» · Antes
   └─ Shortcode · [jm_curso_enlace_calendario]
```

| Pieza no nativa | Motivo |
|---|---|
| `[jm_curso_chips variante="tarjeta"]` | Chip de norma con la insignia solo si el curso está certificado, y nada si no hay norma. |
| `[jm_curso_enlace_calendario]` | «5 convocatorias»: cuenta las del año, solo en cursos de convocatoria abierta, y enlaza a `/formacion/#calendario-{curso}` para dejar el calendario filtrado. |

---

## B · «Fila de convocatoria»

```
Contenedor · Clases: jm-conv
├─ Shortcode · [jm_convocatoria_fecha]                        ← columna de fecha (cuadro + día)
├─ Contenedor · Clases: jm-conv__curso
│  ├─ Título · p · Clases: jm-conv__curso-nombre · ⚡ Shortcode [jm_conv que="curso"]
│  ├─ Contenedor · Dirección fila · Clases: jm-conv__meta
│  │  ├─ Título · span · Clases: jm-conv__norma · ⚡ Shortcode [jm_conv que="norma"]
│  │  └─ Lista de iconos · Clases: jm-conv__horario
│  │       · FA «clock» (regular) · Texto: ⚡ Shortcode [jm_conv que="horario"]   («07:30 – 15:30 h»)
│  └─ Shortcode · [jm_convocatoria_plazas] · Clases: jm-conv__plazas
├─ Contenedor · Clases: jm-conv__sede
│  ├─ Lista de iconos · Clases: jm-conv__sede-nombre
│  │    · FA «map-marker-alt» · Texto: ⚡ Shortcode [jm_conv que="sede-zona"]   («San Fernando de Henares · Madrid»)
│  ├─ Título · p · Clases: jm-conv__direccion · ⚡ Shortcode [jm_conv que="direccion"]
│  └─ Botón · Clases: jm-btn jm-conv__maps · «Ver en Maps»
│       Enlace: ⚡ Shortcode [jm_conv que="maps"] · Abrir en pestaña nueva
│       Icono: FA «location-arrow» · Antes
└─ Contenedor · Clases: jm-conv__acciones
   ├─ Botón · Clases: jm-btn jm-btn--sm jm-btn--contorno jm-conv__info jm-abrir-modal
   │    «Ver información del curso» · Enlace: ⚡ Shortcode [jm_conv que="url-curso"]
   │    Icono: FA «info-circle» · Antes
   ├─ Botón · Clases: jm-btn jm-btn--sm jm-btn--acento jm-conv__plaza
   │    «Solicitar plaza» · Enlace: ⚡ Shortcode [jm_conv que="url-solicitar"]
   │    Icono: FA «arrow-right» · Después
   └─ Título · span · Clases: jm-conv__sin-plazas · «Sin plazas»     ← solo se ve si la convocatoria está completa
```

Valores de `[jm_conv que="…"]`: `curso`, `norma`, `horario`, `sede`, `zona`, `sede-zona`,
`direccion`, `maps`, `url-curso`, `url-solicitar` (→ `/formacion/solicitar/?convocatoria={id}`).

| Pieza no nativa | Motivo |
|---|---|
| `[jm_convocatoria_fecha]` | Día, mes corto y día de la semana calculados de `jm_fecha`; además deja el marcador oculto `data-jm-conv` (curso, sede, fecha, completo) con el que el JS filtra, agrupa por mes y marca «Hoy». |
| `[jm_convocatoria_plazas]` | «12 plazas libres» / «Últimas 3 plazas» / «Completo» y la barra: cálculo con `jm_plazas` − `jm_ocupadas`. Vacío mientras no se gestionen. |
| `[jm_conv …]` como etiqueta dinámica | El nombre y la norma son del **curso relacionado** (`jm_curso`) y la sede es un **término** con metadatos: ninguna etiqueta nativa llega ahí. |

## Lista de comprobación

- [ ] Las dos plantillas se llaman exactamente «Tarjeta de curso» y «Fila de convocatoria».
- [ ] La etiqueta dinámica **Shortcode** está disponible en los campos *Enlace* de los botones (Elementor Pro ≥ 3.6). Si en tu versión no aparece, avísame: se cambia por un shortcode de bloque.
- [ ] La norma vacía (cursos sin norma) no deja una pastilla roja vacía.
- [ ] En la vista previa del Loop Item la fila muestra fecha, curso, horario, sede y los dos botones.
- [ ] Ningún widget lleva nada en Estilo.
