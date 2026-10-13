# 52 · Consultar disponibilidad (/consultar-disponibilidad/) y gracias

Traducción de `src/app/(site)/consultar-disponibilidad/page.tsx`,
`gracias/page.tsx`, `components/forms/FormularioDisponibilidad.tsx` y
`lib/leads/*`. Estilos: `45-formularios.css` (aspecto genérico `jm-form`, que
reutiliza el formulario de formación, + lo propio de esta página).
Comportamiento: `43-solicitud.js`. Validación y opciones de los desplegables:
`includes/50-formularios.php` (por ID de campo: **no cambies los ID**).

## Qué hace el JS sobre el formulario nativo

- Lista de máquinas elegidas: las de `?m=` y, si no hay, las de la bandeja
  del comparador; cada una con miniatura y ✕. Mantiene el campo oculto
  `maquinas` (slugs separados por coma) y la URL `?m=`.
- Rellena `referencia` con `SOL-AAAA-DDDNN` (año, día del año y dos cifras).
- Fechas: mínimo hoy; «Hasta» nunca antes de «Desde».
- `?del=madrid` (tarjetas de /delegaciones/) selecciona «Madrid».
- `?asunto=venta|recambios|mantenimiento|transporte|servicios`: pastilla
  «Solicitud de …» y el titular «Qué necesitas» pasa a «Cuándo y dónde».
  `?asunto=formacion` redirige a /formacion/solicitar/ (PHP).
- CIF/NIF: aviso ámbar si no cuadra el dígito de control (no bloquea).
- Escritorio: dos columnas (qué se pide 5/12 · quién lo pide 7/12); mete la
  cabecera de la izquierda dentro del formulario. Sin JS: una columna.
- Resumen «Faltan N datos por revisar.» con el foco, y «Enviando…» en el botón.

## A · Página

**Páginas → Añadir nueva** · «Consultar disponibilidad» · slug
`consultar-disponibilidad` · Plantilla **Elementor Ancho completo**.

```
Contenedor · div · Ancho completo · Clases: jm-contenedor jm-solicitud-pagina
├─ Título · h1 · Clases: jm-display-2 jm-solicitud-pagina__titulo
│    «Dinos qué necesitas y qué día.»
├─ Título · p · Clases: jm-lede jm-solicitud-pagina__lede
│    «No hay pasarela de pago: el precio final depende del transporte, de la duración y de la
│     disponibilidad real de cada delegación, así que lo confirmamos contigo.»
├─ Contenedor · div · Ancho completo · Clases: jm-solicitud__cabecera        ← el JS lo mete en la columna izquierda
│  ├─ Shortcode · [jm_solicitud_asunto]                                      (solo con ?asunto=)
│  ├─ Título · h2 · Clases: jm-display-3 jm-solicitud__titulo · «Qué necesitas»
│  └─ Shortcode · [jm_maquinas_solicitud]                                    (lista / vacío / «Lo que nos contaste en el asesor»)
└─ Formulario · Clases: jm-form jm-form-solicitud
     Nombre del formulario: «Solicitud de alquiler»
     Diseño: Etiquetas Mostrar · Marca obligatorios: Sí · Columnas por defecto · Nada en Estilo
```

### Campos (en este orden)

| # | ID | Tipo | Etiqueta (literal) | Obl. | Ancho | Valor por defecto / opciones |
|---|---|---|---|---|---|---|
| 1 | `maquinas` | Oculto | — | | 100 | Etiqueta dinámica «Parámetro de solicitud» · Tipo GET · Clave `m` |
| 2 | `contexto` | Oculto | — | | 100 | «Parámetro de solicitud» · GET · `contexto` |
| 3 | `asunto` | Oculto | — | | 100 | «Parámetro de solicitud» · GET · `asunto` |
| 4 | `referencia` | Oculto | — | | 100 | vacío (lo rellena el JS) |
| 5 | `fecha_inicio` | Fecha | Desde | Sí | 50 | Tipo de entrada: **Nativo HTML5** |
| 6 | `fecha_fin` | Fecha | Hasta | Sí | 50 | Nativo HTML5 |
| 7 | `provincia` | Selección | Provincia de la obra | Sí | 50 | Opciones vacías (las pone el plugin: «Elige provincia» + 52 + Portugal) |
| 8 | `localidad` | Texto | Localidad | Sí | 50 | |
| 9 | `direccion` | Texto | Dirección de la obra | | 100 | |
| 10 | `ayuda_direccion` | HTML | — | | 100 | `Si ya la sabes. Nos sirve para calcular el transporte.` |
| 11 | `delegacion` | Selección | Delegación de referencia | | 100 | Opciones vacías (plugin: «La que mejor me cuadre» + delegaciones). Valor por defecto: vacío (el JS lee `?del=`) |
| 12 | `ayuda_delegacion` | HTML | — | | 100 | `Si no eliges ninguna, la asignamos por la provincia de la obra.` |
| 13 | `titulo_quien` | HTML | — | | 100 | `<h2 class="jm-form-titulo">Quién lo pide</h2>` |
| 14 | `empresa` | Texto | Empresa | Sí | 50 | |
| 15 | `cif` | Texto | CIF o NIF | Sí | 50 | |
| 16 | `contacto` | Texto | Persona de contacto | Sí | 50 | |
| 17 | `telefono` | Teléfono | Teléfono | Sí | 50 | |
| 18 | `email` | Correo electrónico | Correo electrónico | Sí | 100 | |
| 19 | `notas` | Área de texto | Algo más que debamos saber | | 100 | Filas 4 · Marcador: `Altura del tajo, acceso, si hace falta operador, horario de entrega…` |
| 20 | `consentimiento` | Aceptación | (vacía) | Sí | 100 | Texto: `Acepto que JOFEMESA use estos datos para responder a esta solicitud, según su <a href="/privacidad/">política de privacidad</a>.` · Marcado por defecto: No |
| 21 | — | Honeypot | — | | | Campo nativo antispam (sustituye al `_trampa` del original) |
| 22 | `nota_envio` | HTML | — | | 100 | `Sin compromiso y sin pago online. Confirmamos disponibilidad, transporte y condiciones contigo antes de formalizar nada.` (va **después** del botón: colócalo el último en la lista y el JS lo deja tras el envío) |

Botón: Texto **«Enviar la solicitud»** · Tamaño: el que sea (lo pisa el CSS) ·
Ancho de columna 100 · Sin icono.

Los campos de autocompletado: en *Avanzado* de cada campo no hace falta nada;
Elementor ya pone `type="email"`/`tel`.

### Acciones tras el envío

1. **Recoger envíos** (Submissions).
2. **Correo electrónico** · Para: el correo de avisos (*JOFEMESA → Ajustes*) ·
   Asunto: `Solicitud [field id="referencia"] · [field id="empresa"]` ·
   Mensaje: `[all-fields]` · Responder a: `[field id="email"]`.
3. **Webhook** (opcional): URL del CRM.
4. **Redirigir** · `/consultar-disponibilidad/gracias/?ref=[field id="referencia"]`.

Mensajes (Formulario → Opciones adicionales → Mensajes personalizados): Error
«Revisa los datos marcados.»; los errores por campo los pone
`50-formularios.php` con los textos del original.

## B · Página de gracias

**Páginas → Añadir nueva** · «Solicitud recibida» · slug `gracias` · **Superior:
Consultar disponibilidad** (URL `/consultar-disponibilidad/gracias/`) ·
Ancho completo · *noindex*.

```
Contenedor · div · Ancho completo · Clases: jm-contenedor jm-gracias
└─ Contenedor · div · Ancho completo · Clases: jm-gracias__cuerpo
   ├─ Icono · Clases: jm-gracias__hex · SVG subido «hexagono-relleno.svg»
   │    (<svg viewBox="0 0 100 88"><path d="M27 2h46l25 42-25 42H27L2 44 27 2Z" fill="currentColor"/></svg>)
   ├─ Título · h1 · Clases: jm-display-2 jm-gracias__titulo · «Solicitud recibida.»
   ├─ Shortcode · [jm_referencia]                                     («Tu referencia» + SOL-…; nada si no hay ?ref=)
   ├─ Título · p · Clases: jm-lede jm-gracias__lede
   │    «La recibe la delegación que tiene la máquina y te llamamos para confirmar
   │     disponibilidad, transporte y condiciones. Si es urgente, llama y cita la referencia.»
   └─ Contenedor · div · Ancho completo · Clases: jm-gracias__botones
      ├─ Botón · Clases: jm-btn jm-btn--contorno jm-btn--lg jm-ficha__telefono
      │    Texto: etiqueta dinámica «Shortcode» [jm_dato clave="telefono"] · Icono FA phone · Antes
      │    Enlace: etiqueta dinámica «Shortcode» [jm_dato clave="tel"] · Antes: tel:
      └─ Botón · Clases: jm-btn jm-btn--enlace · «Seguir viendo el catálogo» · /alquiler/
```

`[jm_referencia]` · atributo `etiqueta="Tu referencia"`. Solo acepta el
formato `ABC-AAAA-NNN…` (SOL- o FOR-), así que no pinta texto arbitrario.

## Lista de comprobación

- [ ] `/consultar-disponibilidad/?m=jlg-nano-sp-plus` enseña la máquina con miniatura; la ✕ la quita y limpia `?m=`.
- [ ] Sin `?m=` y con 2 máquinas en la bandeja, salen esas 2.
- [ ] Sin máquinas: «No has seleccionado ninguna máquina todavía…» con enlace al catálogo.
- [ ] `?contexto=…` (desde el asesor) muestra «Lo que nos contaste en el asesor».
- [ ] `?asunto=transporte`: pastilla «Solicitud de Transporte y entrega en obra» y titular «Cuándo y dónde».
- [ ] `?asunto=formacion` redirige a /formacion/solicitar/.
- [ ] `?del=malaga` deja elegida «Málaga».
- [ ] Las fechas no admiten días pasados; «Hasta» no admite antes de «Desde».
- [ ] CIF «B12345678» mal escrito → aviso ámbar, el envío sigue permitido.
- [ ] Enviar vacío: errores bajo cada campo + resumen «Faltan N datos por revisar.» con el foco.
- [ ] Envío correcto → /consultar-disponibilidad/gracias/?ref=SOL-2026-… con la referencia en pantalla.
- [ ] Escritorio: dos columnas; móvil: una, con fechas y nombre/CIF de dos en dos desde 768 px.
