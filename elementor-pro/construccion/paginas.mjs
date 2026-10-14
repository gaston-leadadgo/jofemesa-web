/**
 * Resto de páginas · estructura/23 (comparador), 24 (asesor), 51 (contacto), 60 (legales y 404).
 */
import { c, h, t, b, sc, html, lista, w, fa, etiqueta, dinamico } from "./lib.mjs";

const GALON = '<svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M20 10 L110 100 L20 190" stroke="currentColor" stroke-width="26"/><path d="M90 10 L180 100 L90 190" stroke="currentColor" stroke-width="26"/></svg>';
const icoFa = (f, clases) => w("icon", { selected_icon: f, _css_classes: clases });
const flecha = { fa: fa("arrow-right"), pos: "despues" };

/* ID del Loop Item «Delegación · contacto»: lo crea el importador (paso Plantillas). */
const LOOP_CONTACTO = Number(process.env.JM_LOOP_CONTACTO || 693);

/* ---------- /comparador/ ---------- */
const comparador = () => [
  c("jm-contenedor jm-comparador-pagina", [
    h("h1", "jm-label jm-comparador-pagina__titulo", "Comparador de maquinaria"),
    c("jm-comparador-cuerpo", [sc("[jm_comparador]")], {
      attrs: { "data-jm-modal-contenido": "", "data-jm-modal-titulo": "Comparador de maquinaria", "data-jm-modal-enlace": "" },
    }),
  ]),
];

/* ---------- /asesor/ ---------- */
const dato = (k, v, o = {}) => c("jm-placa__dato", [h("span", "jm-placa__dato-k", k), h("span", "jm-placa__dato-v", v, o)]);

const asesor = () => [
  c("jm-placa", [
    html(GALON, "jm-placa__galon"),
    c("jm-contenedor jm-placa__cuerpo", [
      c("jm-placa__rejilla", [
        c("jm-placa__texto", [
          h("p", "jm-label jm-placa__kicker", "Asistente de selección guiada"),
          h("h1", "jm-titular-placa jm-placa__titulo", "No sabes qué máquina pedir. Normal.", { attrs: { "data-revelar": "" } }),
          t("jm-placa__lede jm-hereda", 'Hay [jm_cifra que="referencias"] referencias en [jm_cifra que="familias"] familias, y la diferencia entre dos tijeras de la misma altura puede ser que una pase por tu puerta y la otra no. Contesta tres preguntas y te decimos qué encaja, y por qué.', { attrs: { "data-revelar": "", style: "--retardo:1" } }),
        ]),
        c("jm-placa__datos", [
          dato("Preguntas", "3"),
          dato("Referencias", "145", { dyn: ['[jm_cifra que="referencias"]'] }),
          dato("Tiempo", "Un minuto"),
        ], { attrs: { "data-escalonar": "" } }),
      ]),
    ]),
  ], { tag: "section" }),
  c("jm-contenedor", [sc('[jm_asesor variante="pagina"]')], { tag: "section" }),
];

/* ---------- /contacto/ ---------- */
const contactoDelegacion = () => [
  c("jm-deleg-c", [
    c("jm-deleg-c__cabeza", [
      h("p", "jm-deleg-c__nombre", "Delegación", { etq: etiqueta("post-title") }),
      sc('[jm_delegacion_insignia variante="contacto"]'),
    ], { fila: true }),
    sc('[jm_delegacion_contacto variante="compacto"]'),
  ]),
];

const filaIcono = (f, hijo) => c("jm-fila-icono", [icoFa(f, "jm-fila-icono__i"), hijo], { fila: true });

const contacto = () => [
  c("jm-placa", [
    c("jm-contenedor jm-placa__cuerpo jm-placa__cuerpo--contacto", [
      h("p", "jm-label jm-placa__kicker", "Atención profesional directa"),
      h("h1", "jm-titular-placa jm-placa__titulo jm-placa__titulo--22", "Hablas con la delegación que tiene la máquina", { attrs: { "data-revelar": "" } }),
      t("jm-lede jm-contacto__lede jm-hereda", "Un equipo de profesionales siempre a tu disposición. Llama a la delegación más cercana a tu obra o escríbenos y te contestamos desde la que te va a servir el equipo."),
      c("jm-contacto__botones", [
        b("jm-btn jm-btn--contorno-claro jm-btn--h14 jm-btn--mono jm-contacto__boton", "91 361 31 31", "tel:+34913613131", { fa: fa("phone"), pos: "antes" }),
        b("jm-btn jm-btn--contorno-claro jm-btn--h14 jm-contacto__boton", "jofemesa@jofemesa.com", "mailto:jofemesa@jofemesa.com", { fa: fa("envelope"), pos: "antes" }),
      ]),
    ]),
  ], { tag: "section" }),
  c("jm-seccion jm-borde-abajo", [
    c("jm-contenedor jm-contacto__rejilla", [
      c("jm-contacto__col5", [
        h("h2", "jm-display-3", "Sede central"),
        c("jm-contacto__central", [
          h("p", "jm-title jm-contacto__central-titulo", "JOFEME S.A."),
          c("jm-contacto__dl", [
            filaIcono(fa("map-marker-alt"), t("jm-fila-icono__dd jm-hereda", '<span class="jm-tinta">A-2 dirección Barcelona, km 15,300 (vía de servicio)</span><br><span class="jm-value">28022</span> Madrid')),
            filaIcono(fa("phone"), h("p", "jm-enlace-tel", "91 361 31 31", { enlace: "tel:+34913613131" })),
            filaIcono(fa("envelope"), h("p", "jm-enlace-correo", "jofemesamadrid@jofemesa.com", { enlace: "mailto:jofemesamadrid@jofemesa.com" })),
            filaIcono(fa("building"), t("jm-contacto__domicilio jm-hereda", 'Domicilio social: Avda. del Aluminio, 20 — Parque Empresarial del Principado de Asturias, 33490 Avilés. CIF <span class="jm-value">A33098948</span>.')),
          ]),
        ]),
        h("p", "jm-contacto__nota", "No publicamos horarios que no podamos garantizar. Llama a la delegación y te lo confirmamos en el momento."),
      ]),
      c("jm-contacto__col7", [
        h("h2", "jm-display-3", "Teléfonos de delegación"),
        h("p", "jm-contacto__intro", "Cada delegación tiene su parque, su taller y su equipo comercial. Si sabes dónde está tu obra, llama directamente allí: te ahorra un paso."),
        w("loop-grid", {
          _skin: "post",
          template_id: LOOP_CONTACTO,
          posts_per_page: 20,
          post_query_post_type: "delegacion",
          post_query_query_id: "jm_delegaciones",
          pagination_type: "",
          _css_classes: "jm-centralita",
        }),
        b("jm-btn jm-btn--enlace jm-contacto__todas", "Ver direcciones completas y el mapa", "/delegaciones/", flecha),
      ]),
    ]),
  ], { tag: "section" }),
  c("jm-seccion", [
    c("jm-contenedor jm-contacto__rejilla jm-contacto__rejilla--centro", [
      c("jm-contacto__col7", [
        h("h2", "jm-display-2 jm-fo-titular--24", "¿Prefieres que te llamemos nosotros?"),
        t("jm-lede jm-contacto__cta-lede jm-hereda", "Cuéntanos qué necesitas hacer, dónde y cuándo. Puedes elegir la delegación desde la que quieres que te atendamos, y si no lo sabes, la asignamos por la provincia de la obra."),
      ]),
      c("jm-contacto__col5 jm-contacto__cta-botones", [
        b("jm-btn jm-btn--acento jm-btn--h14 jm-btn--bloque", "Abrir el formulario", "/consultar-disponibilidad/"),
        b("jm-btn jm-btn--contorno jm-btn--h14 jm-btn--bloque", "No sé qué máquina necesito", "/asesor/"),
      ]),
    ]),
  ], { tag: "section" }),
];

/* ---------- Legales ---------- */
const legal = (titulo, secciones) => [
  c("jm-contenedor jm-legal", [
    c("jm-legal__cuerpo", [
      h("h1", "jm-display-2 jm-legal__titulo", titulo),
      c("jm-legal__secciones", secciones),
    ]),
  ]),
];
const seccion = (rotulo, ...cuerpo) =>
  c("jm-legal__seccion", [h("h2", "jm-label jm-legal__h2", rotulo), ...cuerpo.map((x) => (typeof x === "string" ? t("jm-legal__texto jm-hereda", x) : x))], { tag: "section" });
const aviso = (rotulo, texto) =>
  c("jm-aviso-pendiente jm-aviso-pendiente--legal", [h("p", "jm-label-sm jm-aviso-pendiente__k", rotulo), t("jm-aviso-pendiente__texto jm-hereda", texto)], { tag: "section" });
const fila = (k, v) => c("jm-legal__fila", [h("p", "jm-legal__k", k), h("p", "jm-legal__v", v)]);
const filaApilada = (k, v) => c("jm-legal__fila jm-legal__fila--apilada", [h("p", "jm-legal__k jm-legal__k--mono", k), h("p", "jm-legal__v jm-legal__v--suave", v)]);

const DOMICILIO = "Avda. del Aluminio, 20 — Parque Empresarial del Principado de Asturias, 33490 Avilés";

const avisoLegal = () => legal("Aviso legal", [
  seccion("Titular del sitio", c("jm-legal__dl", [
    fila("Razón social", "JOFEME S.A."),
    fila("CIF", "A33098948"),
    fila("Domicilio social", DOMICILIO),
    fila("Actividad", "Alquiler y venta de maquinaria industrial"),
  ])),
  aviso("Pendiente de completar", 'Los datos de inscripción en el Registro Mercantil —tomo, folio y hoja— se incorporarán a este aviso legal en cuanto estén verificados. Si los necesitas antes, escríbenos a <a href="mailto:jofemesa@jofemesa.com">jofemesa@jofemesa.com</a> y te los facilitamos.'),
  seccion("Condiciones de uso", "Este sitio ofrece información sobre el catálogo de alquiler y venta. Las especificaciones técnicas que aparecen provienen de las fichas de los fabricantes y se indican como tales; las que aún no están confirmadas contra la unidad concreta de flota se muestran marcadas. Ninguna de ellas constituye oferta contractual: la disponibilidad, el precio y las condiciones se confirman por escrito antes de formalizar cualquier alquiler."),
  seccion("Propiedad intelectual",
    t("jm-legal__texto jm-hereda", [
      "Las marcas de los fabricantes que aparecen en este sitio pertenecen a sus respectivos titulares y se usan únicamente para identificar los equipos de la flota.",
      "La fotografía de producto de este sitio —la que ilustra cada máquina del catálogo— es material propio de JOFEMESA, tomado de su propia flota. Las máquinas para las que todavía no hay fotografía se representan con un dibujo técnico hecho para esta web, nunca con fotografía de archivo de otra empresa.",
    ]),
    t("jm-legal__texto jm-legal__texto--holgado jm-hereda", "Las imágenes de ambiente que acompañan a las cabeceras y a los bloques de servicio son ilustrativas y se han generado para esta web. No representan equipos ni instalaciones concretas de JOFEMESA y no constituyen descripción de producto."),
  ),
]);

const privacidad = () => legal("Política de privacidad", [
  aviso("Borrador de trabajo", "Este texto describe lo que el formulario de la web hace realmente, para que sirva de base. La versión definitiva la tiene que revisar el asesor legal de JOFEME S.A. antes de publicar."),
  seccion("Quién trata tus datos", `JOFEME S.A., con CIF A33098948 y domicilio en ${DOMICILIO}.`),
  seccion("Qué datos recogemos y para qué", "Solo lo que hace falta para responder a una solicitud de disponibilidad: la máquina o máquinas que te interesan, las fechas de alquiler, la provincia y localidad de la obra, y los datos de contacto de la empresa que la solicita (nombre, CIF, persona de contacto, teléfono y correo). Si has usado el asesor, se adjunta también el resumen de tus tres respuestas, porque le ahorra una llamada al equipo comercial."),
  seccion("Base legal", "Tu consentimiento, que das marcando la casilla del formulario, y el interés legítimo en atender una solicitud comercial que has iniciado tú."),
  seccion("Con quién se comparten", "La solicitud llega a la delegación que tiene la máquina, que es quien puede confirmar la disponibilidad. No se ceden datos a terceros con fines publicitarios."),
  seccion("Tus derechos", "Puedes pedir acceso, rectificación, supresión, limitación, portabilidad y oposición escribiendo a la dirección de contacto de cualquiera de nuestras delegaciones. También puedes reclamar ante la Agencia Española de Protección de Datos."),
  seccion("Qué no hacemos", "Esta web no cobra nada, no tiene pasarela de pago y no pide datos bancarios ni de tarjeta en ningún momento. Si alguna página te los pide diciendo que es de JOFEMESA, no es nuestra."),
]);

const cookies = () => legal("Política de cookies", [
  seccion("Estado actual",
    "Tal y como está construida hoy, esta web <strong>no instala ninguna cookie de seguimiento</strong>. Por eso no verás un aviso de cookies: no hay nada que consentir. Guardamos dos cosas en el propio navegador, que no salen de tu dispositivo y no identifican a nadie:",
    c("jm-legal__dl jm-legal__dl--suelto", [
      /* Clave real en WordPress: 00-nucleo.js guarda con el prefijo «jm:». */
      filaApilada("jm:comparador", "Las máquinas que has marcado para comparar, para que no se pierdan al cambiar de página. Almacenamiento local, no cookie."),
      filaApilada("Respuestas del asesor", "Van en la propia dirección de la página, para que puedas compartir el resultado o volver atrás."),
    ]),
  ),
  aviso("Antes de publicar", "En el momento en que se añada medición (Google Analytics, Google Ads, Meta Pixel o cualquier etiqueta de terceros), esta página deja de ser cierta y hace falta un banner de consentimiento real, con bloqueo previo. Conviene decidirlo antes del lanzamiento y no después."),
]);

/* ---------- 404 (textos nuevos, a validar con el cliente) ---------- */
const error404 = () => [
  c("jm-contenedor jm-404", [
    c("jm-404__cuerpo", [
      h("p", "jm-label jm-acento", "Error 404"),
      h("h1", "jm-display-2 jm-404__titulo", "Esta página no existe."),
      t("jm-lede jm-404__lede jm-hereda", "Puede que el enlace esté mal escrito o que la página se haya movido. Busca la máquina en el catálogo o llámanos y te ayudamos."),
      c("jm-404__botones", [
        b("jm-btn jm-btn--acento", "Ver el catálogo", "/alquiler/", flecha),
        b("jm-btn jm-btn--enlace", "Volver a la portada", "/"),
      ]),
    ]),
  ]),
];

export default {
  prefijo: "pg",
  secciones: { comparador, asesor, contactoDelegacion, contacto, avisoLegal, privacidad, cookies, error404 },
};
