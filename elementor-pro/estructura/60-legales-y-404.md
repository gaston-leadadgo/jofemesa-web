# 60 · Aviso legal, Privacidad, Cookies y 404

Traducción de `src/app/(site)/aviso-legal/page.tsx`, `privacidad/page.tsx` y `cookies/page.tsx`.
Estilos: `assets/css/60-paginas.css`. **Todo nativo**, sin shortcodes.

Las tres páginas: **Páginas → Añadir nueva** · Plantilla **Elementor Ancho completo** · slugs
`aviso-legal`, `privacidad`, `cookies` · **noindex** en el plugin SEO (el original las marca
`robots: index false`).

## Esqueleto común

```
Contenedor · Clases: jm-contenedor jm-legal
└─ Contenedor · Clases: jm-legal__cuerpo                              ← 70ch de ancho
   ├─ Título · h1 · Clases: jm-display-2 jm-legal__titulo · TÍTULO
   └─ Contenedor · Clases: jm-legal__secciones                         ← 2rem entre secciones
      └─ (secciones, abajo)

Sección normal:
Contenedor · section · Clases: jm-legal__seccion
├─ Título · h2 · Clases: jm-label jm-legal__h2 · RÓTULO
└─ Editor de texto · Clases: jm-legal__texto jm-hereda · PÁRRAFO(S)

Aviso amarillo:
Contenedor · section · Clases: jm-aviso-pendiente jm-aviso-pendiente--legal
├─ Título · p · Clases: jm-label-sm jm-aviso-pendiente__k · RÓTULO
└─ Editor de texto · Clases: jm-aviso-pendiente__texto jm-hereda · TEXTO
```

## Aviso legal («Aviso legal»)

1. Sección · «Titular del sitio» · en lugar del texto:
   ```
   Contenedor · Clases: jm-legal__dl
   └─ (×4) Contenedor · Clases: jm-legal__fila
      ├─ Título · p · jm-legal__k · CLAVE
      └─ Título · p · jm-legal__v · VALOR
   ```
   Razón social → «JOFEME S.A.» · CIF → «A33098948» · Domicilio social → «Avda. del Aluminio, 20 — Parque Empresarial del Principado de Asturias, 33490 Avilés» · Actividad → «Alquiler y venta de maquinaria industrial».
2. Aviso · «Pendiente de completar» · «Los datos de inscripción en el Registro Mercantil —tomo, folio y hoja— se incorporarán a este aviso legal en cuanto estén verificados. Si los necesitas antes, escríbenos a <a href="mailto:jofemesa@jofemesa.com">jofemesa@jofemesa.com</a> y te los facilitamos.»
3. Sección · «Condiciones de uso» · «Este sitio ofrece información sobre el catálogo de alquiler y venta. Las especificaciones técnicas que aparecen provienen de las fichas de los fabricantes y se indican como tales; las que aún no están confirmadas contra la unidad concreta de flota se muestran marcadas. Ninguna de ellas constituye oferta contractual: la disponibilidad, el precio y las condiciones se confirman por escrito antes de formalizar cualquier alquiler.»
4. Sección · «Propiedad intelectual» · tres párrafos (el tercero en otro Editor de texto con `jm-legal__texto jm-legal__texto--holgado jm-hereda`):
   - «Las marcas de los fabricantes que aparecen en este sitio pertenecen a sus respectivos titulares y se usan únicamente para identificar los equipos de la flota.»
   - «La fotografía de producto de este sitio —la que ilustra cada máquina del catálogo— es material propio de JOFEMESA, tomado de su propia flota. Las máquinas para las que todavía no hay fotografía se representan con un dibujo técnico hecho para esta web, nunca con fotografía de archivo de otra empresa.»
   - «Las imágenes de ambiente que acompañan a las cabeceras y a los bloques de servicio son ilustrativas y se han generado para esta web. No representan equipos ni instalaciones concretas de JOFEMESA y no constituyen descripción de producto.»

## Privacidad («Política de privacidad»)

1. Aviso · «Borrador de trabajo» · «Este texto describe lo que el formulario de la web hace realmente, para que sirva de base. La versión definitiva la tiene que revisar el asesor legal de JOFEME S.A. antes de publicar.»
2. «Quién trata tus datos» · «JOFEME S.A., con CIF A33098948 y domicilio en Avda. del Aluminio, 20 — Parque Empresarial del Principado de Asturias, 33490 Avilés.»
3. «Qué datos recogemos y para qué» · «Solo lo que hace falta para responder a una solicitud de disponibilidad: la máquina o máquinas que te interesan, las fechas de alquiler, la provincia y localidad de la obra, y los datos de contacto de la empresa que la solicita (nombre, CIF, persona de contacto, teléfono y correo). Si has usado el asesor, se adjunta también el resumen de tus tres respuestas, porque le ahorra una llamada al equipo comercial.»
4. «Base legal» · «Tu consentimiento, que das marcando la casilla del formulario, y el interés legítimo en atender una solicitud comercial que has iniciado tú.»
5. «Con quién se comparten» · «La solicitud llega a la delegación que tiene la máquina, que es quien puede confirmar la disponibilidad. No se ceden datos a terceros con fines publicitarios.»
6. «Tus derechos» · «Puedes pedir acceso, rectificación, supresión, limitación, portabilidad y oposición escribiendo a la dirección de contacto de cualquiera de nuestras delegaciones. También puedes reclamar ante la Agencia Española de Protección de Datos.»
7. «Qué no hacemos» · «Esta web no cobra nada, no tiene pasarela de pago y no pide datos bancarios ni de tarjeta en ningún momento. Si alguna página te los pide diciendo que es de JOFEMESA, no es nuestra.»

> ⚠ El texto 3 solo habla del formulario de alquiler; la web ya tiene también el de **formación**
> (curso, alumnos, localidad, empresa opcional). Literal del original, pero conviene que el asesor lo amplíe.

## Cookies («Política de cookies»)

1. Sección · «Estado actual» · Editor de texto: «Tal y como está construida hoy, esta web <strong>no instala ninguna cookie de seguimiento</strong>. Por eso no verás un aviso de cookies: no hay nada que consentir. Guardamos dos cosas en el propio navegador, que no salen de tu dispositivo y no identifican a nadie:»
   y debajo, en la misma sección:
   ```
   Contenedor · Clases: jm-legal__dl jm-legal__dl--suelto
   ├─ Contenedor · jm-legal__fila jm-legal__fila--apilada
   │  ├─ Título · p · jm-legal__k jm-legal__k--mono · «jofemesa.comparador.v1»
   │  └─ Título · p · jm-legal__v jm-legal__v--suave
   │       «Las máquinas que has marcado para comparar, para que no se pierdan al cambiar de página. Almacenamiento local, no cookie.»
   └─ Contenedor · jm-legal__fila jm-legal__fila--apilada
      ├─ Título · p · jm-legal__k jm-legal__k--mono · «Respuestas del asesor»
      └─ Título · p · jm-legal__v jm-legal__v--suave
           «Van en la propia dirección de la página, para que puedas compartir el resultado o volver atrás.»
   ```
2. Aviso · «Antes de publicar» · «En el momento en que se añada medición (Google Analytics, Google Ads, Meta Pixel o cualquier etiqueta de terceros), esta página deja de ser cierta y hace falta un banner de consentimiento real, con bloqueo previo. Conviene decidirlo antes del lanzamiento y no después.»

> ⚠ En WordPress el nombre real de la clave del comparador lo decide `40-catalogo.js`
> (`JM.guardar` usa el prefijo `jm:`). Compruébalo y corrige «jofemesa.comparador.v1» si cambia.
> WordPress tampoco instala cookies propias para visitantes anónimos, pero algunos plugins sí: revísalo.

## 404 (nuevo: no existe en la web Next)

La web Next no tiene página 404 propia (usa la de Next, «This page could not be found.»).
Propuesta mínima con el mismo sistema; **textos nuevos, a validar con el cliente**.

**Plantillas → Theme Builder → Single → Página 404** · Condición: Página 404.

```
Contenedor · Clases: jm-contenedor jm-404
└─ Contenedor · Clases: jm-404__cuerpo
   ├─ Título · p · jm-label jm-acento · «Error 404»
   ├─ Título · h1 · jm-display-2 jm-404__titulo · «Esta página no existe.»
   ├─ Editor de texto · jm-lede jm-404__lede jm-hereda
   │    «Puede que el enlace esté mal escrito o que la página se haya movido. Busca la máquina en el
   │     catálogo o llámanos y te ayudamos.»
   └─ Contenedor · jm-404__botones
      ├─ Botón · jm-btn jm-btn--acento · «Ver el catálogo» · /alquiler/ · arrow-right Después
      └─ Botón · jm-btn jm-btn--enlace · «Volver a la portada» · /
```

## Lista de comprobación

- [ ] Las tres páginas en noindex y enlazadas desde el pie.
- [ ] Filas de «Titular del sitio» en dos columnas desde 768 px (clave de 12rem).
- [ ] Avisos con filete amarillo a la izquierda.
- [ ] `/no-existe/` muestra la plantilla 404.
