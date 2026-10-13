# 51 · Contacto (`/contacto/`)

Traducción de `src/app/(site)/contacto/page.tsx`. Estilos: `assets/css/10-placa.css` y
`assets/css/60-paginas.css`. Shortcodes: `includes/76-paginas.php`.

## Dónde se crea

1. **Loop Item «Delegación · contacto»** (Theme Builder → Loop Item; vista previa: Delegaciones).
2. **Página** «Contacto» · slug `contacto` · Plantilla **Elementor Ancho completo**.

## A · Loop Item «Delegación · contacto»

```
Contenedor · Clases: jm-deleg-c
├─ Contenedor · Dirección fila · Clases: jm-deleg-c__cabeza
│  ├─ Título · p · Clases: jm-deleg-c__nombre · Etiqueta dinámica: Título de la entrada
│  └─ Shortcode · [jm_delegacion_insignia variante="contacto"]     ← «PT» / «Sede»
└─ Shortcode · [jm_delegacion_contacto variante="compacto"]         ← teléfono y correo enlazados
```

## B · Página

```
① CABECERA (placa sin foto ni galón, solo texto)
Contenedor · section · Clases: jm-placa
└─ Contenedor · Clases: jm-contenedor jm-placa__cuerpo jm-placa__cuerpo--contacto
   ├─ Título · p · jm-label jm-placa__kicker · «Atención profesional directa»
   ├─ Título · h1 · jm-titular-placa jm-placa__titulo jm-placa__titulo--22 · data-revelar|
   │    «Hablas con la delegación que tiene la máquina»
   ├─ Editor de texto · jm-lede jm-contacto__lede jm-hereda
   │    «Un equipo de profesionales siempre a tu disposición. Llama a la delegación más cercana a tu obra o
   │     escríbenos y te contestamos desde la que te va a servir el equipo.»
   └─ Contenedor · jm-contacto__botones
      ├─ Botón · jm-btn jm-btn--contorno-claro jm-btn--h14 jm-btn--mono jm-contacto__boton
      │    «91 361 31 31» · tel:+34913613131 · FA «phone» Antes
      └─ Botón · jm-btn jm-btn--contorno-claro jm-btn--h14 jm-contacto__boton
           «jofemesa@jofemesa.com» · mailto:jofemesa@jofemesa.com · FA «envelope» Antes

② SEDE CENTRAL + CENTRALITA
Contenedor · section · Clases: jm-seccion jm-borde-abajo
└─ Contenedor · jm-contenedor jm-contacto__rejilla
   ├─ Contenedor · jm-contacto__col5
   │  ├─ Título · h2 · jm-display-3 · «Sede central»
   │  ├─ Contenedor · jm-contacto__central
   │  │  ├─ Título · p · jm-title jm-contacto__central-titulo · «JOFEME S.A.»
   │  │  └─ Contenedor · jm-contacto__dl
   │  │     ├─ Contenedor fila · jm-fila-icono → Icono jm-fila-icono__i FA map-marker-alt ·
   │  │     │    Editor de texto jm-fila-icono__dd jm-hereda:
   │  │     │    «<span class="jm-tinta">A-2 dirección Barcelona, km 15,300 (vía de servicio)</span><br>
   │  │     │     <span class="jm-value">28022</span> Madrid»
   │  │     ├─ Contenedor fila · jm-fila-icono → Icono FA phone ·
   │  │     │    Título p · jm-enlace-tel · «91 361 31 31» · Enlace tel:+34913613131
   │  │     ├─ Contenedor fila · jm-fila-icono → Icono FA envelope ·
   │  │     │    Título p · jm-enlace-correo · «jofemesamadrid@jofemesa.com» · mailto:jofemesamadrid@jofemesa.com
   │  │     └─ Contenedor fila · jm-fila-icono → Icono FA building ·
   │  │          Editor de texto · jm-contacto__domicilio jm-hereda
   │  │          «Domicilio social: Avda. del Aluminio, 20 — Parque Empresarial del Principado de Asturias,
   │  │           33490 Avilés. CIF <span class="jm-value">A33098948</span>.»
   │  └─ Título · p · jm-contacto__nota
   │       «No publicamos horarios que no podamos garantizar. Llama a la delegación y te lo confirmamos en el momento.»
   └─ Contenedor · jm-contacto__col7
      ├─ Título · h2 · jm-display-3 · «Teléfonos de delegación»
      ├─ Título · p · jm-contacto__intro
      │    «Cada delegación tiene su parque, su taller y su equipo comercial. Si sabes dónde está tu obra,
      │     llama directamente allí: te ahorra un paso.»
      ├─ Loop Grid · Clases: jm-centralita · Plantilla «Delegación · contacto»
      │    ID de consulta: jm_delegaciones · Elementos: 20 · Sin paginación
      └─ Botón · jm-btn jm-btn--enlace jm-contacto__todas · «Ver direcciones completas y el mapa»
           /delegaciones/ · arrow-right Después

③ ¿TE LLAMAMOS?
Contenedor · section · Clases: jm-seccion
└─ Contenedor · jm-contenedor jm-contacto__rejilla jm-contacto__rejilla--centro
   ├─ Contenedor · jm-contacto__col7
   │  ├─ Título · h2 · jm-display-2 jm-fo-titular--24 · «¿Prefieres que te llamemos nosotros?»
   │  └─ Editor de texto · jm-lede jm-contacto__cta-lede jm-hereda
   │       «Cuéntanos qué necesitas hacer, dónde y cuándo. Puedes elegir la delegación desde la que quieres
   │        que te atendamos, y si no lo sabes, la asignamos por la provincia de la obra.»
   └─ Contenedor · jm-contacto__col5 jm-contacto__cta-botones
      ├─ Botón · jm-btn jm-btn--acento jm-btn--h14 jm-btn--bloque · «Abrir el formulario» · /consultar-disponibilidad/
      └─ Botón · jm-btn jm-btn--contorno jm-btn--h14 jm-btn--bloque · «No sé qué máquina necesito» · /asesor/
```

> El lema «Un equipo de profesionales siempre a tu disposición» es `lemaEquipo` de empresa.json.
> En el h2 «¿Prefieres…» añade también la clase `jm-fo-titular--24` (ancho 24ch, de 50-formacion.css).

## Lista de comprobación

- [ ] La centralita lista 10 puntos (7 + Formación + 2 de Portugal) en el orden de `jm_orden`.
- [ ] Oporto y Lisboa llevan «PT»; Formación lleva «Sede».
- [ ] Los correos largos se cortan con «…» y no rompen la rejilla a 375 px.
- [ ] En escritorio: columnas 5/7 en la sección central y 7/5 (centrado vertical) en la última.
