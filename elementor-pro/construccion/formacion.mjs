/** Formación · estructura/40-formacion.md y 42-loop-curso-y-convocatoria.md */
import { c, h, t, b, sc, html, img, ico, lista, w, fa, etiqueta, dinamico, campo, urlEntrada, sellos } from "./lib.mjs";

const flechaFa = { fa: fa("arrow-right"), pos: "despues" };
const icoFa = (f, clases) => w("icon", { selected_icon: f, _css_classes: clases });

/** Lista de iconos de un solo elemento con texto dinámico. */
const listaDyn = (clases, f, etq, enLinea = false) =>
  w("icon-list", {
    view: enLinea ? "inline" : "traditional",
    _css_classes: clases,
    icon_list: [{ _id: `d${Math.random().toString(16).slice(2, 8)}`, text: "Dato", selected_icon: f, __dynamic__: { text: etq } }],
  });

const conv = (que) => dinamico(`[jm_conv que="${que}"]`);

/* ---------- Loop Item · Tarjeta de curso ---------- */
const tarjetaCurso = () => [
  c("jm-tarjeta jm-tcurso", [
    c("jm-tcurso__cabeza", [icoFa(fa("graduation-cap"), "jm-pastilla-icono"), sc('[jm_curso_chips variante="tarjeta"]')], { fila: true }),
    h("h4", "jm-tcurso__nombre", "Nombre del curso", { etq: etiqueta("post-title") }),
    h("p", "jm-tcurso__para", "Para quién", { etq: campo("jm_para_quien") }),
    listaDyn("jm-tcurso__duracion", fa("clock", "far"), campo("jm_duracion")),
    c("jm-tcurso__pie", [
      b("jm-btn jm-tcurso__info jm-abrir-modal", "Ver información del curso", "", { fa: fa("info-circle"), pos: "antes", dynEnlace: urlEntrada() }),
      sc("[jm_curso_enlace_calendario]"),
    ], { fila: true }),
  ], { tag: "article" }),
];

/* ---------- Loop Item · Fila de convocatoria ---------- */
const filaConvocatoria = () => [
  c("jm-conv", [
    sc("[jm_convocatoria_fecha]"),
    c("jm-conv__curso", [
      h("p", "jm-conv__curso-nombre", "Curso", { etq: conv("curso") }),
      c("jm-conv__meta", [
        h("span", "jm-conv__norma", "Norma", { etq: conv("norma") }),
        listaDyn("jm-conv__horario", fa("clock", "far"), conv("horario")),
      ], { fila: true }),
      sc("[jm_convocatoria_plazas]", "jm-conv__plazas"),
    ]),
    c("jm-conv__sede", [
      listaDyn("jm-conv__sede-nombre", fa("map-marker-alt"), conv("sede-zona")),
      h("p", "jm-conv__direccion", "Dirección", { etq: conv("direccion") }),
      b("jm-btn jm-conv__maps", "Ver en Maps", "", { fa: fa("location-arrow"), pos: "antes", nueva: true, dynEnlace: conv("maps") }),
    ]),
    c("jm-conv__acciones", [
      b("jm-btn jm-btn--sm jm-btn--contorno jm-conv__info jm-abrir-modal", "Ver información del curso", "", { fa: fa("info-circle"), pos: "antes", dynEnlace: conv("url-curso") }),
      b("jm-btn jm-btn--sm jm-btn--acento jm-conv__plaza", "Solicitar plaza", "/formacion/solicitar/", { ...flechaFa, dynEnlace: conv("url-solicitar") }),
      h("span", "jm-conv__sin-plazas", "Sin plazas"),
    ]),
  ]),
];

/* ---------- Página /formacion/ ---------- */
const loop = (plantilla, consulta, clases, porPagina = 20, tipo = "curso") =>
  w("loop-grid", {
    _skin: "post",
    template_id: plantilla,
    posts_per_page: porPagina,
    post_query_post_type: tipo,
    post_query_query_id: consulta,
    _css_classes: clases,
  });

const SEDES = [
  ["San Fernando de Henares", "Sede de formación", "Pol. Ind. Las Fronteras, C/ Mar Adriático con Mar Mediterráneo, 1<br><span class=\"jm-value\">28830</span> San Fernando de Henares (Madrid)", ["649 755 883", "+34649755883"], "https://maps.app.goo.gl/rEFVwDXHP6VVntpP7"],
  ["Puerto de Sagunto", "Delegación de Valencia", "Pol. Ind. Parc Sagunt, C/ Braç de la Creu, s/n<br><span class=\"jm-value\">46520</span> Puerto de Sagunto (Valencia)", ["962 680 581", "+34962680581"], "https://maps.app.goo.gl/PvgK3FYxzyomvngw9"],
];

const LEGIS = [
  ["Ley 31/1995", "Prevención de Riesgos Laborales", "Obliga a la empresa a garantizar la formación de cada trabajador en los riesgos de su puesto (art. 19)."],
  ["Real Decreto 1215/1997", "Utilización de equipos de trabajo", "Los equipos con riesgos específicos solo pueden manejarlos trabajadores con formación adecuada."],
  ["Real Decreto 2177/2004", "Trabajos temporales en altura", "Modifica el RD 1215/1997 para escaleras de mano, andamios y técnicas de acceso con cuerdas."],
  ["UNE 58923", "Formación del operador de PEMP", "Norma de referencia para la formación de operadores de plataformas elevadoras móviles de personal."],
  ["UNE 58451", "Formación de operadores de carretillas", "Norma de referencia para la formación de operadores de carretillas de manutención."],
];

const pagina = () => [
  c("jm-placa", [
    img("hero-formacion", "jm-fondo-img jm-placa__foto", { alt: "" }),
    html("", "jm-placa__velo"),
    c("jm-contenedor jm-placa__cuerpo", [
      c("jm-placa__rejilla", [
        c("jm-placa__texto", [
          h("p", "jm-label jm-placa__kicker", "Departamento de Formación"),
          h("h1", "jm-titular-placa jm-placa__titulo", "Formación de operadores, con la máquina delante.", { attrs: { "data-revelar": "" } }),
          t("jm-placa__lede jm-hereda", "Cursos certificados de plataformas elevadoras, carretillas, trabajos en altura, andamios y espacios confinados, con convocatorias cada semana en Madrid y en Valencia.", { attrs: { "data-revelar": "", style: "--retardo:1" } }),
          c("jm-placa__botones", [
            b("jm-btn jm-btn--acento", "Ver convocatorias", "#calendario", flechaFa),
            b("jm-btn jm-btn--enlace", "Catálogo de cursos", "#cursos", flechaFa),
          ], { fila: true, attrs: { "data-revelar": "", style: "--retardo:2" } }),
          sc('[jm_tel_formacion variante="placa" prefijo="Formación · "]'),
        ]),
      ]),
    ]),
  ], { tag: "section" }),
  c("jm-fo-autoridad-seccion", [
    c("jm-contenedor jm-fo-autoridad", [
      c("jm-fo-autoridad__item", [h("span", "jm-sr", "Certificación AENOR"), h("span", "jm-fo-autoridad__v", "AENOR"), h("span", "jm-fo-autoridad__t", "Cursos certificados en UNE 58923 (plataformas) y UNE 58451 (carretillas)")]),
      c("jm-fo-autoridad__item", [h("span", "jm-sr", "Homologación IPAF"), h("span", "jm-fo-autoridad__v", "IPAF"), h("span", "jm-fo-autoridad__t", "Centro homologado. Programa certificado por Bureau Veritas (ISO 18878)")]),
      c("jm-fo-autoridad__item", [h("span", "jm-sr", "Convocatorias en 2026 y 2027", { dyn: ['[jm_formacion_cifra que="anios"]', { antes: "Convocatorias en " }] }), h("span", "jm-fo-autoridad__v", "293", { dyn: ['[jm_formacion_cifra que="convocatorias" anio="todos"]'] }), h("span", "jm-fo-autoridad__t", "Convocatorias en 2026 y 2027, cada semana en Madrid y en Valencia", { dyn: ['[jm_formacion_cifra que="anios"]', { antes: "Convocatorias en ", despues: ", cada semana en Madrid y en Valencia" }] })]),
      c("jm-fo-autoridad__item", [h("span", "jm-sr", "Cursos"), h("span", "jm-fo-autoridad__v", "12", { dyn: ['[jm_formacion_cifra que="cursos"]'] }), t("jm-fo-autoridad__t jm-hereda", 'Cursos en catálogo y [jm_formacion_cifra que="sedes"] sedes de formación propias')]),
    ], { attrs: { "data-escalonar": "" } }),
    sellos("jm-contenedor jm-fo-sellos", ["aenor-une-58923", "aenor-une-58451", "ipaf-centro-formacion"], 52, [h("p", "jm-label-sm", "Certificados y homologaciones")], "border-top: 1px solid var(--jm-rule, #e4e4e7); padding-top: 20px; padding-bottom: 20px;"),
  ], { tag: "section", attrs: { "aria-label": "Formación certificada" } }),
  c("jm-indice", [
    c("jm-contenedor jm-indice__pista", [
      b("jm-btn jm-indice__enlace", "Cursos", "#cursos"),
      b("jm-btn jm-indice__enlace", "Convocatorias", "#calendario"),
      b("jm-btn jm-indice__enlace", "Sedes", "#sedes"),
      b("jm-btn jm-indice__enlace", "Legislación", "#legislacion"),
    ], { fila: true }),
  ], { tag: "nav", attrs: { "aria-label": "En esta página" } }),
  c("jm-fseccion jm-borde-abajo jm-ancla-indice", [
    c("jm-contenedor", [
      h("p", "jm-label jm-acento", "Catálogo de cursos"),
      h("h2", "jm-display-2 jm-fo-titular jm-fo-titular--36", "Si no encuentras el curso que necesitas, lo diseñamos exclusivamente para ti."),
      c("jm-cursos__sub", [h("h3", "jm-display-3", "Convocatorias abiertas"), h("p", "jm-cursos__sub-nota", "Fechas fijas cada semana en San Fernando de Henares y Puerto de Sagunto")]),
      c("jm-cursos-rejilla", [
        loop(631, "jm_cursos_convocatoria", "jm-plano"),
        c("jm-tcurso-oscura", [
          c("", [
            icoFa(fa("calendar-alt"), "jm-tcurso-oscura__icono"),
            h("p", "jm-tcurso-oscura__cifra", "293", { dyn: ['[jm_formacion_cifra que="convocatorias" anio="todos"]'] }),
            t("jm-tcurso-oscura__texto jm-hereda", 'convocatorias en [jm_formacion_cifra que="anios"], todas de 07:30 a 15:30, en San Fernando de Henares y Puerto de Sagunto.'),
          ]),
          b("jm-btn jm-btn--acento jm-btn--h12", "Ver el calendario", "#calendario-todos", flechaFa),
        ]),
      ]),
      c("jm-cursos__sub jm-cursos__sub--medida", [h("h3", "jm-display-3", "Resto de cursos"), h("p", "jm-cursos__sub-nota", "A medida, en tus instalaciones o en las nuestras")]),
      c("jm-cursos-rejilla jm-cursos-rejilla--4", [
        loop(631, "jm_cursos_medida", "jm-plano"),
        c("jm-tcurso-oscura jm-tcurso-oscura--medida", [
          c("", [
            icoFa(fa("wrench"), "jm-tcurso-oscura__icono"),
            h("p", "jm-tcurso-oscura__titulo", "¿No está tu curso?"),
            t("jm-tcurso-oscura__texto jm-hereda", "Lo diseñamos para tu equipo, con tus máquinas y en tus instalaciones o en las nuestras."),
          ]),
          b("jm-btn jm-btn--acento jm-btn--h12", "Cuéntanos qué necesitas", "/formacion/solicitar/?curso=otro", flechaFa),
        ]),
      ]),
    ]),
  ], { tag: "section", idcss: "cursos" }),
  c("jm-fseccion jm-borde-abajo jm-hundido jm-ancla-indice", [
    c("jm-contenedor", [
      h("p", "jm-label jm-acento", "Calendario de formaciones"),
      h("h2", "jm-display-2 jm-fo-titular jm-fo-titular--24", "Convocatorias abiertas."),
      t("jm-fo-intro jm-hereda", "Todas las jornadas son de 07:30 a 15:30. Abre la información de cada curso o pide tu plaza desde la convocatoria, y el equipo de Formación te confirma la inscripción."),
      c("jm-cal-zona", [sc("[jm_calendario_filtros]"), loop(632, "jm_convocatorias", "jm-cal-lista", 200, "convocatoria")]),
    ]),
  ], { tag: "section", idcss: "calendario" }),
  c("jm-fseccion jm-borde-abajo jm-ancla-indice", [
    c("jm-contenedor", [
      h("p", "jm-label jm-acento", "Dónde se imparten"),
      h("h2", "jm-display-2 jm-fo-titular", "Sedes de formación."),
      c("jm-sedes", SEDES.map(([nombre, tipo, dir, [tel, telE164], maps]) =>
        c("jm-tarjeta jm-sede", [
          c("", [h("p", "jm-meta jm-sede__tipo", tipo), h("h3", "jm-sede__nombre", nombre)]),
          c("jm-sede__dir", [icoFa(fa("map-marker-alt"), "jm-sede__pin"), t("jm-hereda", dir)]),
          lista("jm-lista-linea jm-sede__contacto", [
            { texto: tel, enlace: `tel:${telE164}`, fa: fa("phone") },
            { texto: "formacion@jofemesa.com", enlace: "mailto:formacion@jofemesa.com", fa: fa("envelope") },
          ], { enLinea: true }),
          b("jm-btn jm-btn--contorno jm-btn--h12 jm-btn--bloque jm-sede__llegar", "Cómo llegar", maps, { fa: fa("location-arrow"), pos: "antes", nueva: true }),
        ]))),
    ]),
  ], { tag: "section", idcss: "sedes" }),
  c("jm-fseccion jm-ancla-indice", [
    c("jm-contenedor jm-legis", [
      c("jm-legis__intro", [
        h("p", "jm-label jm-acento", "Legislación de referencia"),
        h("h2", "jm-display-3 jm-fo-titular", "Por qué la formación no es opcional."),
        t("jm-legis__texto jm-hereda", "La normativa obliga a que quien maneja estos equipos esté formado para hacerlo. Estas son las referencias en las que se apoyan nuestros cursos."),
      ]),
      c("jm-legis__lista", LEGIS.map(([ref, tit, nota]) =>
        c("jm-legis__item", [
          icoFa(fa("balance-scale"), "jm-legis__icono"),
          c("", [h("p", "jm-legis__ref", `${ref} <span class="jm-legis__tit">· ${tit}</span>`), h("p", "jm-legis__nota", nota)]),
        ], { fila: true }))),
    ]),
  ], { tag: "section", idcss: "legislacion" }),
];

/* ---------- Single · Ficha de curso (estructura/41) ---------- */
const dato = (etiquetaTexto, f, etq, ancho = false) =>
  c(`jm-ficha-curso__dato${ancho ? " jm-ficha-curso__dato--ancho" : ""}`, [
    lista("jm-meta jm-ficha-curso__k", [{ texto: etiquetaTexto, fa: f }]),
    h("p", "jm-ficha-curso__v", etiquetaTexto, { etq }),
  ]);

const fichaCurso = () => [
  c("jm-contenedor jm-ficha-pagina", [
    b("jm-btn jm-volver jm-volver--ficha", "Todos los cursos de Formación", "/formacion/#cursos", { fa: fa("arrow-left"), pos: "antes" }),
    c("jm-ficha-curso", [
      c("", [
        sc('[jm_curso_chips variante="ficha"]'),
        h("h1", "jm-ficha-curso__titulo", "Título del curso", { etq: campo("jm_titulo_largo") }),
        h("p", "jm-ficha-curso__desc", "Descripción", { etq: campo("jm_descripcion") }),
        c("jm-ficha-curso__datos", [
          dato("Duración", fa("clock", "far"), campo("jm_duracion")),
          dato("Modalidad", fa("users"), campo("jm_modalidad")),
          dato("Normativa", fa("balance-scale"), dinamico('[jm_curso que="normativa"]'), true),
        ]),
      ], { tag: "header" }),
      c("jm-ficha-curso__cuerpo", [
        w("theme-post-content", { _css_classes: "jm-ficha-curso__preguntas" }),
        c("jm-ficha-curso__aside", [
          sc('[jm_proximas_curso max="4"]'),
          c("jm-ficha-cta", [
            h("p", "jm-ficha-cta__titulo", "¿Otra fecha o un grupo a formar?", {
              etq: dinamico('[jm_curso que="cta-titulo" abierta="¿Otra fecha o un grupo a formar?" medida="¿Quieres este curso?"]'),
            }),
            h("p", "jm-ficha-cta__texto", "Cuéntanos cuántas personas y dónde, y Formación te prepara la propuesta."),
            b("jm-btn jm-btn--acento jm-btn--sm jm-btn--bloque jm-ficha-cta__boton", "Solicitar información", "/formacion/solicitar/", {
              ...flechaFa, dynEnlace: dinamico('[jm_curso que="url-solicitar"]'),
            }),
            sc('[jm_tel_formacion variante="ficha" prefijo="Formación · "]'),
          ]),
        ], { tag: "aside" }),
      ]),
    ], { tag: "article", attrs: { "data-jm-modal-contenido": "" } }),
  ]),
];

export default { prefijo: "fo", secciones: { tarjetaCurso, filaConvocatoria, pagina, fichaCurso } };
