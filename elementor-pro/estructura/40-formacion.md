# 40 · Página Formación (`/formacion/`)

Traducción de `src/app/(site)/formacion/page.tsx`, `components/formacion/CalendarioFormacion.tsx`
y `EnlaceCalendario.tsx`. Estilos: `assets/css/10-placa.css` (cabecera) y
`assets/css/50-formacion.css`. Comportamiento: `assets/js/50-formacion.js`.
Shortcodes: `includes/75-formacion.php`. Plantillas Loop Item: `42-loop-curso-y-convocatoria.md`
(móntalas ANTES que esta página).

## Dónde se crea

**Páginas → Añadir nueva** · título «Formación» · slug `formacion` · Plantilla
**Elementor Ancho completo**. Todos los contenedores en **Ancho completo**, sin nada
en Estilo ni Efectos de movimiento.

Imagen a subir a **Medios**: `recursos/imagenes/hero-formacion.jpg` (texto alternativo vacío: es decorativa).

## Etiqueta dinámica «Shortcode»

Varias cifras salen de la base de datos sin dejar de ser widgets nativos: en el campo
de texto pulsa el icono de etiquetas dinámicas → **Shortcode** → escribe el shortcode.
Se indica abajo como `⚡ Shortcode [..]`.

## Árbol de montaje

```
① CABECERA (placa)
Contenedor · section · Clases: jm-placa
├─ Imagen · Clases: jm-fondo-img jm-placa__foto · Imagen: hero-formacion.jpg · Tamaño: Completo
├─ HTML · Clases: jm-placa__velo · Contenido: (vacío)            ← el degradado
└─ Contenedor · Clases: jm-contenedor jm-placa__cuerpo
   └─ Contenedor · Clases: jm-placa__rejilla
      └─ Contenedor · Clases: jm-placa__texto
         ├─ Título · p · Clases: jm-label jm-placa__kicker
         │    «Departamento de Formación»
         ├─ Título · h1 · Clases: jm-titular-placa jm-placa__titulo · Atributos: data-revelar|
         │    «Formación de operadores, con la máquina delante.»
         ├─ Editor de texto · Clases: jm-placa__lede jm-hereda · Atributos: data-revelar| y style|--retardo:1
         │    «Cursos certificados de plataformas elevadoras, carretillas, trabajos en altura, andamios y
         │     espacios confinados, con convocatorias cada semana en Madrid y en Valencia.»
         ├─ Contenedor · Dirección fila · Clases: jm-placa__botones · Atributos: data-revelar| y style|--retardo:2
         │  ├─ Botón · Clases: jm-btn jm-btn--acento · «Ver convocatorias» · Enlace: #calendario
         │  │    Icono: arrow-right (FA) · Después
         │  └─ Botón · Clases: jm-btn jm-btn--enlace · «Catálogo de cursos» · Enlace: #cursos
         │       Icono: arrow-right (FA) · Después
         └─ Shortcode · [jm_tel_formacion variante="placa" prefijo="Formación · "]

② AUTORIDAD
Contenedor · section · Clases: jm-fo-autoridad-seccion · Atributos: aria-label|Formación certificada
└─ Contenedor · Clases: jm-contenedor jm-fo-autoridad · Atributos: data-escalonar|
   ├─ Contenedor · Clases: jm-fo-autoridad__item
   │  ├─ Título · span · Clases: jm-sr · «Certificación AENOR»
   │  ├─ Título · span · Clases: jm-fo-autoridad__v · «AENOR»
   │  └─ Título · span · Clases: jm-fo-autoridad__t
   │       «Cursos certificados en UNE 58923 (plataformas) y UNE 58451 (carretillas)»
   ├─ Contenedor · Clases: jm-fo-autoridad__item
   │  ├─ Título · span · jm-sr · «Homologación IPAF»
   │  ├─ Título · span · jm-fo-autoridad__v · «IPAF»
   │  └─ Título · span · jm-fo-autoridad__t · «Centro homologado. Programa certificado por Bureau Veritas (ISO 18878)»
   ├─ Contenedor · Clases: jm-fo-autoridad__item
   │  ├─ Título · span · jm-sr · «Convocatorias en 2026»
   │  ├─ Título · span · jm-fo-autoridad__v · ⚡ Shortcode [jm_formacion_cifra que="convocatorias"]
   │  └─ Título · span · jm-fo-autoridad__t · «Convocatorias en 2026, cada semana en Madrid y en Valencia»
   └─ Contenedor · Clases: jm-fo-autoridad__item
      ├─ Título · span · jm-sr · «Cursos»
      ├─ Título · span · jm-fo-autoridad__v · ⚡ Shortcode [jm_formacion_cifra que="cursos"]
      └─ Editor de texto · Clases: jm-fo-autoridad__t jm-hereda
           «Cursos en catálogo y [jm_formacion_cifra que="sedes"] sedes de formación propias»

③ ÍNDICE FIJO
Contenedor · nav · Clases: jm-indice · Atributos: aria-label|En esta página
└─ Contenedor · Dirección fila · Clases: jm-contenedor jm-indice__pista
   ├─ Botón · Clases: jm-btn jm-indice__enlace · «Cursos» · #cursos
   ├─ Botón · Clases: jm-btn jm-indice__enlace · «Convocatorias» · #calendario
   ├─ Botón · Clases: jm-btn jm-indice__enlace · «Sedes» · #sedes
   └─ Botón · Clases: jm-btn jm-indice__enlace · «Legislación» · #legislacion

④ CATÁLOGO
Contenedor · section · ID CSS: cursos · Clases: jm-fseccion jm-borde-abajo jm-ancla-indice
└─ Contenedor · Clases: jm-contenedor
   ├─ Título · p · Clases: jm-label jm-acento · «Catálogo de cursos»
   ├─ Título · h2 · Clases: jm-display-2 jm-fo-titular jm-fo-titular--36
   │    «Si no encuentras el curso que necesitas, lo diseñamos exclusivamente para ti.»
   ├─ Contenedor · Clases: jm-cursos__sub
   │  ├─ Título · h3 · Clases: jm-display-3 · «Convocatorias abiertas»
   │  └─ Título · p · Clases: jm-cursos__sub-nota
   │       «Fechas fijas cada semana en San Fernando de Henares y Puerto de Sagunto»
   ├─ Contenedor · Clases: jm-cursos-rejilla
   │  ├─ Loop Grid · Clases: jm-plano
   │  │    Plantilla: «Tarjeta de curso» · Consulta: Fuente «Cursos», ID de consulta jm_cursos_convocatoria
   │  │    Elementos por página: 20 · Paginación: Ninguna · Columnas: (da igual, manda el CSS)
   │  └─ Contenedor · Clases: jm-tcurso-oscura                     ← sexta casilla
   │     ├─ Contenedor · (sin clase)
   │     │  ├─ Icono · Clases: jm-tcurso-oscura__icono · FA «calendar-alt»
   │     │  ├─ Título · p · Clases: jm-tcurso-oscura__cifra · ⚡ Shortcode [jm_formacion_cifra que="convocatorias"]
   │     │  └─ Editor de texto · Clases: jm-tcurso-oscura__texto jm-hereda
   │     │       «convocatorias en 2026, todas de 07:30 a 15:30, en San Fernando de Henares y Puerto de Sagunto.»
   │     └─ Botón · Clases: jm-btn jm-btn--acento jm-btn--h12 · «Ver el calendario»
   │          Enlace: #calendario-todos · Icono arrow-right · Después
   ├─ Contenedor · Clases: jm-cursos__sub jm-cursos__sub--medida
   │  ├─ Título · h3 · jm-display-3 · «Resto de cursos»
   │  └─ Título · p · jm-cursos__sub-nota · «A medida, en tus instalaciones o en las nuestras»
   └─ Contenedor · Clases: jm-cursos-rejilla jm-cursos-rejilla--4
      ├─ Loop Grid · Clases: jm-plano · Plantilla «Tarjeta de curso» · ID de consulta jm_cursos_medida
      └─ Contenedor · Clases: jm-tcurso-oscura jm-tcurso-oscura--medida
         ├─ Contenedor
         │  ├─ Icono · jm-tcurso-oscura__icono · FA «wrench»
         │  ├─ Título · p · jm-tcurso-oscura__titulo · «¿No está tu curso?»
         │  └─ Editor de texto · jm-tcurso-oscura__texto jm-hereda
         │       «Lo diseñamos para tu equipo, con tus máquinas y en tus instalaciones o en las nuestras.»
         └─ Botón · jm-btn jm-btn--acento jm-btn--h12 · «Cuéntanos qué necesitas»
              Enlace: /formacion/solicitar/?curso=otro · Icono arrow-right · Después

⑤ CALENDARIO
Contenedor · section · ID CSS: calendario · Clases: jm-fseccion jm-borde-abajo jm-hundido jm-ancla-indice
└─ Contenedor · Clases: jm-contenedor
   ├─ Título · p · jm-label jm-acento · «Calendario de formaciones»
   ├─ Título · h2 · jm-display-2 jm-fo-titular jm-fo-titular--24 · «Convocatorias abiertas.»
   ├─ Editor de texto · Clases: jm-fo-intro jm-hereda
   │    «Todas las jornadas son de 07:30 a 15:30. Abre la información de cada curso o pide tu plaza
   │     desde la convocatoria, y el equipo de Formación te confirma la inscripción.»
   └─ Contenedor · Clases: jm-cal-zona
      ├─ Shortcode · [jm_calendario_filtros]
      └─ Loop Grid · Clases: jm-cal-lista
           Plantilla: «Fila de convocatoria» · Fuente «Convocatorias» · ID de consulta jm_convocatorias
           Elementos por página: 200 · Paginación: Ninguna

⑥ SEDES
Contenedor · section · ID CSS: sedes · Clases: jm-fseccion jm-borde-abajo jm-ancla-indice
└─ Contenedor · Clases: jm-contenedor
   ├─ Título · p · jm-label jm-acento · «Dónde se imparten»
   ├─ Título · h2 · jm-display-2 jm-fo-titular · «Sedes de formación.»
   └─ Contenedor · Clases: jm-sedes
      ├─ Contenedor · Clases: jm-tarjeta jm-sede                       (SEDE 1)
      │  ├─ Contenedor
      │  │  ├─ Título · p · jm-meta jm-sede__tipo · «Sede de formación»
      │  │  └─ Título · h3 · jm-sede__nombre · «San Fernando de Henares»
      │  ├─ Contenedor · Clases: jm-sede__dir
      │  │  ├─ Icono · Clases: jm-sede__pin · FA «map-marker-alt»
      │  │  └─ Editor de texto · Clases: jm-hereda
      │  │       «Pol. Ind. Las Fronteras, C/ Mar Adriático con Mar Mediterráneo, 1<br>
      │  │        <span class="jm-value">28830</span> San Fernando de Henares (Madrid)»
      │  ├─ Lista de iconos · Disposición: en línea · Clases: jm-lista-linea jm-sede__contacto
      │  │    · FA phone · «649 755 883» · Enlace tel:+34649755883
      │  │    · FA envelope · «formacion@jofemesa.com» · Enlace mailto:formacion@jofemesa.com
      │  └─ Botón · Clases: jm-btn jm-btn--contorno jm-btn--h12 jm-btn--bloque jm-sede__llegar
      │       «Cómo llegar» · Enlace: https://maps.app.goo.gl/rEFVwDXHP6VVntpP7 (pestaña nueva, nofollow no)
      │       Icono: FA «location-arrow» · Antes
      └─ Contenedor · Clases: jm-tarjeta jm-sede                       (SEDE 2, igual)
           «Delegación de Valencia» · «Puerto de Sagunto»
           «Pol. Ind. Parc Sagunt, C/ Braç de la Creu, s/n<br><span class="jm-value">46520</span> Puerto de Sagunto (Valencia)»
           Teléfono «962 680 581» → tel:+34962680581 · Correo formacion@jofemesa.com
           Cómo llegar → https://maps.app.goo.gl/PvgK3FYxzyomvngw9

⑦ LEGISLACIÓN
Contenedor · section · ID CSS: legislacion · Clases: jm-fseccion jm-ancla-indice
└─ Contenedor · Clases: jm-contenedor jm-legis
   ├─ Contenedor · Clases: jm-legis__intro
   │  ├─ Título · p · jm-label jm-acento · «Legislación de referencia»
   │  ├─ Título · h2 · jm-display-3 jm-fo-titular · «Por qué la formación no es opcional.»
   │  └─ Editor de texto · jm-legis__texto jm-hereda
   │       «La normativa obliga a que quien maneja estos equipos esté formado para hacerlo. Estas son las
   │        referencias en las que se apoyan nuestros cursos.»
   └─ Contenedor · Clases: jm-legis__lista
      └─ (×5) Contenedor · Dirección fila · Clases: jm-legis__item
         ├─ Icono · Clases: jm-legis__icono · FA «balance-scale»
         └─ Contenedor
            ├─ Título · p · jm-legis__ref · «REF <span class="jm-legis__tit">· TÍTULO</span>»
            └─ Título · p · jm-legis__nota · «NOTA»
```

Los cinco elementos de legislación (literal, en este orden):

| REF | TÍTULO | NOTA |
|---|---|---|
| Ley 31/1995 | Prevención de Riesgos Laborales | Obliga a la empresa a garantizar la formación de cada trabajador en los riesgos de su puesto (art. 19). |
| Real Decreto 1215/1997 | Utilización de equipos de trabajo | Los equipos con riesgos específicos solo pueden manejarlos trabajadores con formación adecuada. |
| Real Decreto 2177/2004 | Trabajos temporales en altura | Modifica el RD 1215/1997 para escaleras de mano, andamios y técnicas de acceso con cuerdas. |
| UNE 58923 | Formación del operador de PEMP | Norma de referencia para la formación de operadores de plataformas elevadoras móviles de personal. |
| UNE 58451 | Formación de operadores de carretillas | Norma de referencia para la formación de operadores de carretillas de manutención. |

## Qué no es nativo y por qué

| Pieza | Motivo |
|---|---|
| `[jm_tel_formacion]` | El teléfono de Formación sale de *JOFEMESA → Ajustes* y se repite en cuatro páginas: se cambia en un sitio. |
| `[jm_formacion_cifra]` (como etiqueta dinámica) | 69 convocatorias / 12 cursos / 2 sedes se cuentan solos. El widget sigue siendo nativo. |
| `[jm_calendario_filtros]` | Chips con recuento, selects de sede y mes, «Quitar filtros», recuento vivo y estado vacío: estado interactivo sin widget equivalente. |

## Comportamiento (50-formacion.js)

- Oculta las convocatorias pasadas con la fecha del navegador, marca la de hoy («Hoy», cuadro rojo).
- Filtra por curso (chips, alternan), sede y mes; recuentos por chip; «N convocatorias abiertas / con estos filtros».
- Agrupa por mes con un `<h3>` «Octubre 2026 · 12» delante de cada grupo.
- Enlaces `…#calendario-{curso}` (tarjetas, ficha, modal) dejan el calendario filtrado y bajan hasta él;
  `#calendario-todos` lo limpia. Desde otra página funcionan igual al cargar.

## Lista de comprobación

- [ ] Plantilla «Elementor Ancho completo»; todos los contenedores en Ancho completo.
- [ ] IDs CSS `cursos`, `calendario`, `sedes`, `legislacion` (sin `#`).
- [ ] Los tres Loop Grid con su ID de consulta y sin paginación.
- [ ] El índice se queda pegado bajo la cabecera al bajar (ningún contenedor padre con transform).
- [ ] Al pulsar «5 convocatorias» en la tarjeta de Plataformas, el calendario queda filtrado.
- [ ] «Quitar filtros» aparece solo con algún filtro y lo deja todo como al cargar.
- [ ] Filtrar una sede y un mes sin resultados muestra «No hay convocatorias con esos filtros.»
- [ ] «Ver información del curso» abre el modal (clase `jm-abrir-modal`).
- [ ] A 375 px no hay desplazamiento horizontal; el índice se desliza dentro de su pista.
