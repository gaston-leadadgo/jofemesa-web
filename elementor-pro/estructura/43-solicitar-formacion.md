# 43 · Solicitar formación (`/formacion/solicitar/`) y su página de gracias

Traducción de `app/(site)/formacion/solicitar/page.tsx`, `…/gracias/page.tsx` y
`components/forms/FormularioFormacion.tsx`. Estilos: `assets/css/50-formacion.css` (maquetación
y piezas propias) + `45-formularios.css` (aspecto genérico `jm-form`). Lógica: `assets/js/50-formacion.js`.
Opciones y validación del servidor: `includes/50-formularios.php` (por ID de campo).

---

## 1 · Página «Solicitar formación»

**Páginas → Añadir nueva** · título «Solicitar formación» · slug `solicitar` · **Superior: Formación**
(URL `/formacion/solicitar/`) · Plantilla **Elementor Ancho completo**.

```
Contenedor · Clases: jm-contenedor jm-solicitar
├─ Botón · Clases: jm-btn jm-volver jm-volver--solicitar
│    «Volver al calendario de formación» · Enlace: /formacion/#calendario · FA «arrow-left» · Antes
├─ Título · p · Clases: jm-label jm-acento · «Departamento de Formación»
├─ Título · h1 · Clases: jm-display-2 jm-solicitar__titulo
│    ⚡ Shortcode [jm_solicitar_titulo]
│    (con ?convocatoria= → «Solicita tu plaza.»; con ?curso=otro → «Cuéntanos el curso que necesitas
│     y lo diseñamos.»; si no → «Cuéntanos qué formación necesitas.» Los tres se editan con los
│     atributos plaza="…" otro="…" defecto="…")
├─ Editor de texto · Clases: jm-lede jm-solicitar__lede jm-hereda
│    «Formación revisa la solicitud y te llama para confirmar la plaza, el precio y lo que tienes que
│     llevar. Si lo prefieres, llama directamente: [jm_tel_formacion variante="texto"].»
├─ Formulario · Clases: jm-form jm-form-formacion            ← ver §2
└─ Editor de texto · Clases: jm-form-formacion__nota jm-hereda
     «Sin pago online. Formación te confirma la plaza, el precio y lo que tienes que llevar el día del curso.»
     (el JS lo coloca bajo el botón Enviar)
```

## 2 · Widget Formulario

Ajustes generales: **Nombre del formulario** «Solicitud de formación» · Etiqueta: Mostrar ·
Marca de obligatorio: Sí · Tamaño de campos: el que traiga el kit (lo pisa `jm-form`).
**Botón**: texto «Enviar la solicitud de formación», ancho 100 %, sin icono.
**Mensajes** (Ajustes adicionales → Mensajes personalizados): deja los de `50-formularios.php`.

Campos en **este orden** (el JS los reparte en dos columnas por ID; en móvil van seguidos).
«Ancho» es la columna de Elementor; en escritorio manda el CSS.

| # | ID (Avanzado) | Tipo | Etiqueta literal | Opciones / contenido | Oblig. | Ancho | Valor por defecto |
|---|---|---|---|---|---|---|---|
| 1 | `bloque_curso` | HTML | — | `<h2 class="jm-form__bloque jm-display-3">El curso</h2>` | — | 100 | — |
| 2 | `curso` | Selección | Curso | (vacío: lo rellena el plugin con «Elige un curso», los 12 cursos por orden y «Otro curso: diseñadlo para nosotros\|otro») | Sí | 100 | ⚡ Parámetro de solicitud → GET `curso` |
| 3 | `info_curso` | HTML | — | `<a class="jm-form__info jm-abrir-modal" data-jm-info-curso href="/formacion/"><svg …info…/>Ver información del curso</a>` (ver nota 1) | — | 100 | — |
| 4 | `convocatoria` | Selección | Convocatoria | (vacío: el plugin pone todas las futuras «Martes 13 de octubre · San Fernando de Henares\|{id}» + «Otra fecha o curso a medida para mi grupo\|») | No | 100 | ⚡ Parámetro de solicitud → GET `convocatoria` |
| 5 | `aviso_medida` | HTML | — | `<p class="jm-form__aviso">Este curso no tiene convocatoria abierta: se imparte a medida. Formación te propone fecha y lugar.</p>` | — | 100 | — |
| 6 | `curso_medida` | Área de texto (4 filas) | ¿Qué formación necesitas? | Marcador: «Por ejemplo: manejo de grúa autocargante para cuatro operarios, con nuestras propias máquinas.» | No (el JS lo hace obligatorio con «otro»; el plugin lo valida) | 100 | — |
| 7 | `ayuda_curso_medida` | HTML | — | `El equipo o la tarea, y si hay alguna norma o certificado que necesitéis. Formación diseña el curso y te propone fecha, lugar y precio.` | — | 100 | — |
| 8 | `lugar` | Radio | ¿Dónde prefieres la formación? | `En vuestras instalaciones\|jofemesa`<br>`En las de mi empresa\|cliente`<br>`Aconsejadme\|indiferente` · Disposición: no en línea | No | 100 | `indiferente` |
| 9 | `alumnos` | Número | Personas | Mín. 1 · Máx. 500 | Sí | 100 | `1` |
| 10 | `localidad` | Texto | Localidad | — | No | 100 | — |
| 11 | `ayuda_localidad` | HTML | — | `Si la formación es en tu empresa.` | — | 100 | — |
| 12 | `bloque_quien` | HTML | — | `<h2 class="jm-form__bloque jm-display-3">Quién lo pide</h2>` | — | 100 | — |
| 13 | `contacto` | Texto | Nombre y apellidos | — | Sí | 100 | — |
| 14 | `telefono` | Teléfono | Teléfono | — | Sí | 50 | — |
| 15 | `email` | Correo electrónico | Correo electrónico | — | Sí | 50 | — |
| 16 | `empresa` | Texto | Empresa | — | No | 50 | — |
| 17 | `ayuda_empresa` | HTML | — | `Si te forma tu empresa.` | — | 50 | — |
| 18 | `cif` | Texto | CIF o NIF | — | No | 50 | — |
| 19 | `ayuda_cif` | HTML | — | `Para la factura. Puedes dárnoslo después.` | — | 50 | — |
| 20 | `notas` | Área de texto (4 filas) | Algo más que debamos saber | Marcador: «Nombres de los alumnos, si necesitáis el curso en otro horario, el tipo de carretilla…» | No | 100 | — |
| 21 | `consentimiento` | Aceptación | (sin etiqueta) | Texto: `Acepto que JOFEMESA use estos datos para responder a esta solicitud, según su <a href="/privacidad/">política de privacidad</a>.` | Sí | 100 | No marcado |
| 22 | `referencia` | Oculto | — | lo rellena el JS: `FOR-AAAA-DDDNN` | — | — | — |
| 23 | (sin ID fijo) | Honeypot | — | — | — | — | — |

Nota 1 — icono del enlace «Ver información del curso» (pégalo dentro del `<a>`):
`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`

Los campos HTML `ayuda_X` los mueve el JS dentro del campo X (texto de ayuda con `aria-describedby`).

### Acciones tras enviar (por este orden)

1. **Recoger envíos**.
2. **Correo electrónico** · Para: `formacion@jofemesa.com` · Asunto: `Nueva solicitud de formación [field id="referencia"]` ·
   Mensaje: `[all-fields]` · De: el del sitio · Responder a: `[field id="email"]`.
3. **Redirigir** · `/formacion/solicitar/gracias/?ref=[field id="referencia"]`.

### Comportamiento (50-formacion.js, igual que FormularioFormacion.tsx)

- Con `?convocatoria={id}` preselecciona su curso y su fecha; con `?curso={slug}` el curso (y la fecha queda en «Otra fecha…»).
- **Convocatoria** solo con cursos de convocatoria abierta, filtrada por curso y fecha ≥ hoy; al cambiar de curso se preselecciona la primera fecha.
- **Aviso a medida** con cursos sin convocatoria; **¿Qué formación necesitas?** (obligatorio) con «otro».
- **¿Dónde…?** y **Localidad** solo si hay curso y no hay fecha elegida.
- «Ver información del curso» apunta a la ficha del curso elegido (abre el modal).
- Aviso de CIF/NIF con dígito de control incorrecto (no bloquea). Botón «Enviando…» mientras espera.
- Los campos ocultos se desactivan: no se envían ni se validan.

---

## 3 · Página de gracias

**Páginas → Añadir nueva** · título «Solicitud de formación recibida» · slug `gracias` ·
**Superior: Solicitar formación** (URL `/formacion/solicitar/gracias/`) · Ancho completo ·
en tu plugin SEO marca **noindex**.

```
Contenedor · Clases: jm-contenedor jm-gracias
└─ Contenedor · Clases: jm-gracias__cuerpo
   ├─ HTML · Clases: jm-gracias__hex
   │    <svg viewBox="0 0 100 88" fill="none" aria-hidden="true"><path d="M27 2h46l25 42-25 42H27L2 44 27 2Z" fill="currentColor"/></svg>
   ├─ Título · h1 · Clases: jm-display-2 jm-gracias__titulo · «Solicitud recibida.»
   ├─ Shortcode · [jm_formacion_referencia]                  ← «Tu referencia FOR-2026-28637» (solo si llega ?ref=)
   ├─ Editor de texto · Clases: jm-lede jm-gracias__lede jm-hereda
   │    «La recibe el departamento de Formación y te llama para confirmar la plaza, el precio y lo que
   │     tienes que llevar el día del curso. Si es urgente, llama y cita la referencia.»
   └─ Contenedor · Clases: jm-gracias__botones
      ├─ Shortcode · [jm_tel_formacion variante="boton"]
      └─ Botón · Clases: jm-btn jm-btn--enlace jm-gracias__volver · «Volver a Formación» · /formacion/
```

| Pieza no nativa | Motivo |
|---|---|
| `[jm_solicitar_titulo]` | El titular depende de los parámetros de la URL. |
| `[jm_tel_formacion]` | Teléfono de Formación desde Ajustes. |
| `[jm_formacion_referencia]` | Lee y valida `?ref=` y no pinta nada si no hay. |

## Lista de comprobación

- [ ] Los ID de campo son **exactamente** los de la tabla (minúsculas, con guion bajo).
- [ ] `/formacion/solicitar/?convocatoria=2026-10-16-plataformas-sagunto` → «Solicita tu plaza.», curso y fecha elegidos, sin «¿Dónde…?».
- [ ] `/formacion/solicitar/?curso=ipaf` → aviso a medida, «¿Dónde…?» y Localidad visibles.
- [ ] `/formacion/solicitar/?curso=otro` → titular «Cuéntanos el curso…» y el área obligatoria.
- [ ] El envío llega a formacion@jofemesa.com con la referencia y redirige a gracias con `?ref=`.
- [ ] En escritorio, dos columnas (El curso | Quién lo pide); en móvil una.
