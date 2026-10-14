/**
 * Formularios y sus páginas de gracias · estructura/52 (consultar disponibilidad) y 43 (solicitar formación).
 * Los ID de campo son los que lee includes/50-formularios.php y los JS: no cambiarlos.
 */
import { c, h, t, b, sc, html, w, fa, etiqueta } from "./lib.mjs";

/* Destinos de correo. En staging se genera con JM_CORREO_PRUEBAS=<correo> para que las pruebas
   no lleguen al cliente; antes de publicar se regenera sin la variable (o se cambia «Para» en el widget). */
const CORREO_SOLICITUDES = process.env.JM_CORREO_PRUEBAS || "jofemesa@jofemesa.com";
const CORREO_FORMACION = process.env.JM_CORREO_PRUEBAS || "formacion@jofemesa.com";

/* La acción «Redirigir» de Elementor solo acepta URL absolutas (FILTER_VALIDATE_URL).
   All-in-One WP Migration cambia el dominio al migrar. */
const SITIO = process.env.JM_SITIO || "https://jofemesa.kind-jones.51-83-41-165.plesk.page";

const HEX = '<svg viewBox="0 0 100 88" fill="none" aria-hidden="true"><path d="M27 2h46l25 42-25 42H27L2 44 27 2Z" fill="currentColor"/></svg>';
const CONSENTIMIENTO = 'Acepto que JOFEMESA use estos datos para responder a esta solicitud, según su <a href="/privacidad/">política de privacidad</a>.';
const parametro = (clave) => etiqueta("request-arg", { request_type: "get", param_name: clave });

let n = 0;
/** Campo del repetidor del formulario. */
function campo(id, tipo, etiquetaTexto = "", o = {}) {
  const f = {
    _id: `f${(++n).toString(16).padStart(6, "0")}`,
    custom_id: id,
    field_type: tipo,
    field_label: etiquetaTexto,
    width: o.ancho || "100",
  };
  if (o.obligatorio) f.required = "true";
  if (o.marcador) f.placeholder = o.marcador;
  if (o.opciones !== undefined) f.field_options = o.opciones;
  if (o.html !== undefined) f.field_html = o.html;
  if (o.valor !== undefined) f.field_value = o.valor;
  if (o.filas) f.rows = o.filas;
  if (o.min !== undefined) f.field_min = o.min;
  if (o.max !== undefined) f.field_max = o.max;
  if (tipo === "date") f.use_native_date = "yes";
  if (tipo === "acceptance") {
    f.acceptance_text = CONSENTIMIENTO;
    f.checked_by_default = "";
  }
  if (o.param) f.__dynamic__ = { field_value: parametro(o.param) };
  return f;
}

function formulario(clases, nombre, boton, campos, acciones) {
  return w("form", {
    _css_classes: clases,
    form_name: nombre,
    form_fields: campos,
    show_labels: "true",
    mark_required: "yes",
    button_text: boton,
    button_width: "100",
    submit_actions: ["save-to-database", "email", "redirect"],
    email_to: acciones.para,
    email_subject: acciones.asunto,
    email_content: "[all-fields]",
    email_from_name: "JOFEMESA",
    email_reply_to: '[field id="email"]',
    email_content_type: "html",
    redirect_to: acciones.redirigir,
    custom_messages: "yes",
    error_message: "Revisa los datos marcados.",
    invalid_message: "Revisa los datos marcados.",
    required_field_message: "Este campo es obligatorio.",
    success_message: "Solicitud enviada.",
  });
}

/* ---------- /consultar-disponibilidad/ ---------- */
const consultar = () => {
  n = 0;
  return [
    c("jm-contenedor jm-solicitud-pagina", [
      h("h1", "jm-display-2 jm-solicitud-pagina__titulo", "Dinos qué necesitas y qué día."),
      h("p", "jm-lede jm-solicitud-pagina__lede", "No hay pasarela de pago: el precio final depende del transporte, de la duración y de la disponibilidad real de cada delegación, así que lo confirmamos contigo."),
      c("jm-solicitud__cabecera", [
        sc("[jm_solicitud_asunto]"),
        h("h2", "jm-display-3 jm-solicitud__titulo", "Qué necesitas"),
        sc("[jm_maquinas_solicitud]"),
      ]),
      formulario("jm-form jm-form-solicitud", "Solicitud de alquiler", "Enviar la solicitud", [
        campo("maquinas", "hidden", "", { param: "m" }),
        campo("contexto", "hidden", "", { param: "contexto" }),
        campo("asunto", "hidden", "", { param: "asunto" }),
        campo("referencia", "hidden"),
        campo("fecha_inicio", "date", "Desde", { obligatorio: true, ancho: "50" }),
        campo("fecha_fin", "date", "Hasta", { obligatorio: true, ancho: "50" }),
        campo("provincia", "select", "Provincia de la obra", { obligatorio: true, ancho: "50", opciones: "" }),
        campo("localidad", "text", "Localidad", { obligatorio: true, ancho: "50" }),
        campo("direccion", "text", "Dirección de la obra"),
        campo("ayuda_direccion", "html", "", { html: "Si ya la sabes. Nos sirve para calcular el transporte." }),
        campo("delegacion", "select", "Delegación de referencia", { opciones: "" }),
        campo("ayuda_delegacion", "html", "", { html: "Si no eliges ninguna, la asignamos por la provincia de la obra." }),
        campo("titulo_quien", "html", "", { html: '<h2 class="jm-form-titulo">Quién lo pide</h2>' }),
        campo("empresa", "text", "Empresa", { obligatorio: true, ancho: "50" }),
        campo("cif", "text", "CIF o NIF", { obligatorio: true, ancho: "50" }),
        campo("contacto", "text", "Persona de contacto", { obligatorio: true, ancho: "50" }),
        campo("telefono", "tel", "Teléfono", { obligatorio: true, ancho: "50" }),
        campo("email", "email", "Correo electrónico", { obligatorio: true }),
        campo("notas", "textarea", "Algo más que debamos saber", { filas: 4, marcador: "Altura del tajo, acceso, si hace falta operador, horario de entrega…" }),
        campo("consentimiento", "acceptance", "", { obligatorio: true }),
        campo("hp", "honeypot"),
        campo("nota_envio", "html", "", { html: "Sin compromiso y sin pago online. Confirmamos disponibilidad, transporte y condiciones contigo antes de formalizar nada." }),
      ], {
        para: CORREO_SOLICITUDES,
        asunto: 'Solicitud [field id="referencia"] · [field id="empresa"]',
        redirigir: SITIO + '/consultar-disponibilidad/gracias/?ref=[field id="referencia"]',
      }),
    ]),
  ];
};

const graciasConsultar = () => [
  c("jm-contenedor jm-gracias", [
    c("jm-gracias__cuerpo", [
      html(HEX, "jm-gracias__hex"),
      h("h1", "jm-display-2 jm-gracias__titulo", "Solicitud recibida."),
      sc('[jm_referencia etiqueta="Tu referencia"]'),
      h("p", "jm-lede jm-gracias__lede", "La recibe la delegación que tiene la máquina y te llamamos para confirmar disponibilidad, transporte y condiciones. Si es urgente, llama y cita la referencia."),
      c("jm-gracias__botones", [
        b("jm-btn jm-btn--contorno jm-btn--lg jm-ficha__telefono", "91 361 31 31", "tel:+34913613131", {
          fa: fa("phone"), pos: "antes",
          dynTexto: ['[jm_dato clave="telefono"]'],
          dynEnlace: ['[jm_dato clave="tel"]', { antes: "tel:" }],
        }),
        b("jm-btn jm-btn--enlace", "Seguir viendo el catálogo", "/alquiler/"),
      ]),
    ]),
  ]),
];

/* ---------- /formacion/solicitar/ ---------- */
const INFO_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

const solicitar = () => {
  n = 0;
  return [
    c("jm-contenedor jm-solicitar", [
      b("jm-btn jm-volver jm-volver--solicitar", "Volver al calendario de formación", "/formacion/#calendario", { fa: fa("arrow-left"), pos: "antes" }),
      h("p", "jm-label jm-acento", "Departamento de Formación"),
      h("h1", "jm-display-2 jm-solicitar__titulo", "Cuéntanos qué formación necesitas.", { dyn: ["[jm_solicitar_titulo]"] }),
      t("jm-lede jm-solicitar__lede jm-hereda", 'Formación revisa la solicitud y te llama para confirmar la plaza, el precio y lo que tienes que llevar. Si lo prefieres, llama directamente: [jm_tel_formacion variante="texto"].'),
      formulario("jm-form jm-form-formacion", "Solicitud de formación", "Enviar la solicitud de formación", [
        campo("bloque_curso", "html", "", { html: '<h2 class="jm-form__bloque jm-display-3">El curso</h2>' }),
        campo("curso", "select", "Curso", { obligatorio: true, opciones: "", param: "curso" }),
        campo("info_curso", "html", "", { html: `<a class="jm-form__info jm-abrir-modal" data-jm-info-curso href="/formacion/">${INFO_SVG}Ver información del curso</a>` }),
        campo("convocatoria", "select", "Convocatoria", { opciones: "", param: "convocatoria" }),
        campo("aviso_medida", "html", "", { html: '<p class="jm-form__aviso">Este curso no tiene convocatoria abierta: se imparte a medida. Formación te propone fecha y lugar.</p>' }),
        campo("curso_medida", "textarea", "¿Qué formación necesitas?", { filas: 4, marcador: "Por ejemplo: manejo de grúa autocargante para cuatro operarios, con nuestras propias máquinas." }),
        campo("ayuda_curso_medida", "html", "", { html: "El equipo o la tarea, y si hay alguna norma o certificado que necesitéis. Formación diseña el curso y te propone fecha, lugar y precio." }),
        campo("lugar", "radio", "¿Dónde prefieres la formación?", { opciones: "En vuestras instalaciones|jofemesa\nEn las de mi empresa|cliente\nAconsejadme|indiferente", valor: "indiferente" }),
        campo("alumnos", "number", "Personas", { obligatorio: true, min: 1, max: 500, valor: "1" }),
        campo("localidad", "text", "Localidad"),
        campo("ayuda_localidad", "html", "", { html: "Si la formación es en tu empresa." }),
        campo("bloque_quien", "html", "", { html: '<h2 class="jm-form__bloque jm-display-3">Quién lo pide</h2>' }),
        campo("contacto", "text", "Nombre y apellidos", { obligatorio: true }),
        campo("telefono", "tel", "Teléfono", { obligatorio: true, ancho: "50" }),
        campo("email", "email", "Correo electrónico", { obligatorio: true, ancho: "50" }),
        campo("empresa", "text", "Empresa", { ancho: "50" }),
        campo("ayuda_empresa", "html", "", { html: "Si te forma tu empresa.", ancho: "50" }),
        campo("cif", "text", "CIF o NIF", { ancho: "50" }),
        campo("ayuda_cif", "html", "", { html: "Para la factura. Puedes dárnoslo después.", ancho: "50" }),
        campo("notas", "textarea", "Algo más que debamos saber", { filas: 4, marcador: "Nombres de los alumnos, si necesitáis el curso en otro horario, el tipo de carretilla…" }),
        campo("consentimiento", "acceptance", "", { obligatorio: true }),
        campo("referencia", "hidden"),
        campo("hp", "honeypot"),
      ], {
        para: CORREO_FORMACION,
        asunto: 'Nueva solicitud de formación [field id="referencia"]',
        redirigir: SITIO + '/formacion/solicitar/gracias/?ref=[field id="referencia"]',
      }),
      t("jm-form-formacion__nota jm-hereda", "Sin pago online. Formación te confirma la plaza, el precio y lo que tienes que llevar el día del curso."),
    ]),
  ];
};

const graciasFormacion = () => [
  c("jm-contenedor jm-gracias", [
    c("jm-gracias__cuerpo", [
      html(HEX, "jm-gracias__hex"),
      h("h1", "jm-display-2 jm-gracias__titulo", "Solicitud recibida."),
      sc("[jm_formacion_referencia]"),
      t("jm-lede jm-gracias__lede jm-hereda", "La recibe el departamento de Formación y te llama para confirmar la plaza, el precio y lo que tienes que llevar el día del curso. Si es urgente, llama y cita la referencia."),
      c("jm-gracias__botones", [
        sc('[jm_tel_formacion variante="boton"]'),
        b("jm-btn jm-btn--enlace jm-gracias__volver", "Volver a Formación", "/formacion/"),
      ]),
    ]),
  ]),
];

export default { prefijo: "fm", secciones: { consultar, graciasConsultar, solicitar, graciasFormacion } };
