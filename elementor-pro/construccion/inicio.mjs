/** Portada · estructura/10-inicio.md */
import { c, h, t, b, sc, img, ico, lista } from "./lib.mjs";

const flecha = { icono: "flecha", pos: "despues" };

const hero = () => [
  c("jm-hero jm-oscuro", [
    c("jm-hero__portada jm-hero__portada--inicial", [
      img("hero-alquiler", "jm-fondo-img jm-hero__foto jm-hero__foto--alquiler"),
      c("jm-contenedor jm-hero__texto", [
        c("jm-hero__columna", [
          c("jm-hero__kicker jm-entra-0", [
            h("span", "jm-label jm-hero__pastilla", "Desde 1987 especialistas en maquinaria"),
            h("span", "jm-label jm-hero__zona", "España y Portugal"),
          ], { fila: true }),
          h("h1", "jm-display-1 jm-hero__titulo jm-entra-1", "Alquiler de maquinaria para que tu obra no se pare."),
          t("jm-hero__lede jm-hereda jm-entra-2", 'Plataformas elevadoras, manipuladores, carretillas, movimiento de tierras y energía. [jm_cifra que="referencias"] referencias y [jm_cifra que="delegaciones"] delegaciones propias con flota, taller y camiones.'),
          sc('[jm_buscador tono="oscuro"]', "jm-hero__buscador jm-entra-3"),
          c("jm-hero__enlaces jm-entra-4", [
            b("jm-btn jm-btn--enlace jm-hero__enlace-acento", "No sé qué máquina necesito", "/asesor/", flecha),
            b("jm-btn jm-btn--enlace jm-hero__enlace-suave", "Ver todo el catálogo", "/alquiler/"),
          ], { fila: true }),
        ]),
      ]),
    ], { attrs: { "data-jm-portada": "alquiler" } }),
    c("jm-hero__portada", [
      img("hero-formacion", "jm-fondo-img jm-hero__foto jm-hero__foto--formacion"),
      c("jm-contenedor jm-hero__texto", [
        c("jm-hero__columna", [
          c("jm-hero__kicker jm-entra-0", [h("span", "jm-label jm-hero__pastilla", "Departamento de Formación")], { fila: true }),
          h("h2", "jm-display-1 jm-hero__titulo jm-hero__titulo--corto jm-entra-1", "Formación de operadores para trabajar seguro."),
          t("jm-hero__lede jm-hereda jm-entra-2", "Plataformas elevadoras, carretillas, trabajos en altura, andamios y espacios confinados. Convocatorias cada semana en Madrid y en Valencia."),
          c("jm-hero__botones jm-entra-3", [
            b("jm-btn jm-btn--acento", "Ver convocatorias", "/formacion/#calendario", flecha),
            b("jm-btn jm-btn--contorno-claro jm-hero__btn-claro", "Catálogo de cursos", "/formacion/#cursos"),
          ], { fila: true }),
          sc("[jm_proxima_convocatoria]", "jm-hero__proxima jm-entra-4"),
        ]),
      ]),
    ], { attrs: { "data-jm-portada": "formacion" } }),
  ], { tag: "section", attrs: { "data-jm": "hero", "aria-label": "Portadas de JOFEMESA" } }),
];

const partners = () => [
  c("jm-partners", [
    c("jm-contenedor jm-partners__cuerpo", [
      c("jm-celdas jm-partners__rejilla", [
        c("jm-partners__tarjeta", [
          h("p", "jm-label jm-partners__insignia", "Partner oficial"),
          img("jungheinrich", "jm-partners__logo"),
          t("jm-partners__texto jm-hereda", "Distribuimos todo el catálogo de Jungheinrich en manutención: contrapesadas eléctricas y diésel, mástil retráctil, trilaterales EKX y EFX, preparadoras de pedidos, transpaletas, apiladores y tractores de arrastre. También su gama reacondicionada JUNGSTARS."),
          b("jm-btn jm-btn--enlace jm-partners__enlace", "Ver venta y recambios", "/servicios/#venta", flecha),
        ]),
        c("jm-partners__tarjeta", [
          h("p", "jm-label jm-partners__insignia", "Distribuidor oficial"),
          h("p", "jm-partners__marca", "Takeuchi"),
          t("jm-partners__texto jm-hereda", "Distribución oficial de Takeuchi en retroexcavadoras y miniexcavadoras, con venta, recambio original y servicio técnico propio. Centro en San Fernando de Henares, Madrid."),
          b("jm-btn jm-btn--enlace jm-partners__enlace", "Ver el centro Takeuchi", "/servicios/#venta", flecha),
        ]),
      ]),
      c("jm-tira-fabricantes jm-partners__fabricantes", [
        h("h3", "jm-label", "Nuestros fabricantes"),
        sc('[jm_fabricantes variante="partners"]'),
      ]),
    ]),
  ], { tag: "section" }),
];

const garantia = (icono, titulo, texto) =>
  c("jm-garantia", [ico(icono, "jm-icono-linea"), h("p", "jm-label jm-garantia__titulo", titulo), t("jm-garantia__texto jm-hereda", texto)]);

const garantias = () => [
  c("jm-garantias", [
    c("jm-contenedor jm-pila", [
      c("jm-celdas jm-garantias__rejilla", [
        garantia("boxes", "Amplia flota", '[jm_cifra que="referencias"] referencias en catálogo, de [jm_cifra que="altura-min"] a [jm_cifra que="altura-max"] m de altura de trabajo.'),
        garantia("shield-check", "Seguridad", "Equipos revisados antes de cada salida y cumplimiento normativo documentado."),
        garantia("map-pin", "Cobertura", '[jm_cifra que="delegaciones"] delegaciones propias en España y Portugal, con transporte propio.'),
        garantia("calendar-clock", "Experiencia", 'Desde el 24 de marzo de [jm_cifra que="fundacion"]. [jm_cifra que="anios"] años alquilando maquinaria.'),
      ], { attrs: { "data-escalonar": "" } }),
      c("jm-garantias__sellos", [
        h("p", "jm-label-sm", "Certificados"),
        lista("jm-garantias__sellos-lista", ["ISO 9001", "ISO 14001", "ISO 45001", "IPAF", "AENOR · UNE 58923", "AENOR · UNE 58451"], { enLinea: true }),
      ], { fila: true }),
    ]),
  ], { tag: "section" }),
];

const FAMILIAS = [
  ["elevacion", "maquina-tijera", "Trabajos en altura", "Equipos para llegar donde el trabajo te necesita, desde espacios reducidos hasta grandes alturas.", "Desde 4,5 m hasta 57 m"],
  ["manutencion", "maquina-manipulador", "Mover y elevar cargas", "Carretillas y manipuladores para transportar, elevar y posicionar cargas con mayor eficacia.", "Hasta 7.000 kg y 21 m"],
  ["movimiento-tierras", "maquina-excavadora", "Excavar, mover tierra y compactar", "Equipos para excavar, cargar, desplazar, preparar el terreno y compactarlo.", "De 1,2 a 19 toneladas"],
  ["energia", "maquina-grupo", "Energía e iluminación", "Grupos electrógenos y torres de luz para llevar suministro allí donde la red no llega.", "De 5 a 300 kVA"],
  ["aire-martillos", "maquina-compresor", "Aire y demolición", "Compresores, picadores y rompedores para cuando el trabajo pide potencia.", "De 2 a 11 m³/min"],
  ["herramienta-auxiliar", "maquina-herramienta", "Herramienta de obra", "Corte, perforación, demolición ligera y nivelación para cerrar el trabajo que la máquina grande no hace.", "Demolición, corte y perforación"],
];

const necesidades = () => [
  c("jm-necesidades jm-seccion", [
    c("jm-contenedor jm-pila", [
      c("jm-cabecera-seccion", [
        c("jm-cabecera-seccion__texto", [
          h("p", "jm-label", "Catálogo de alquiler"),
          h("h2", "jm-display-2 jm-tinta jm-mt-3 jm-ch-28", "Dinos qué tienes que hacer. Nosotros ponemos la máquina."),
          t("jm-lede jm-texto-2 jm-mt-4 jm-ch-52 jm-hereda", 'Seis familias y [jm_cifra que="referencias"] referencias en un solo catálogo, filtrable por altura, carga, alimentación y terreno.'),
        ], { attrs: { "data-revelar": "" } }),
        b("jm-btn jm-btn--enlace", "Ver el catálogo completo", "/alquiler/", flecha),
      ]),
      c("jm-celdas jm-necesidades__rejilla", FAMILIAS.map(([slug, icono, titulo, texto, rango]) =>
        c("jm-necesidad", [
          ico(icono, "jm-necesidad__icono"),
          c("jm-necesidad__cuerpo", [
            h("span", "jm-title jm-necesidad__titulo", titulo),
            t("jm-necesidad__texto jm-hereda", texto),
            t("jm-meta jm-necesidad__meta jm-hereda", `${rango} · [jm_cifra que="familia" familia="${slug}" plural="referencia,referencias"]`),
          ]),
          ico("flecha", "jm-necesidad__flecha"),
        ], { tag: "a", enlace: `/alquiler/${slug}/` })), { attrs: { "data-escalonar": "" } }),
    ]),
  ], { tag: "section", idcss: "familias" }),
];

const asesor = () => [
  c("jm-asesor-banda jm-ambiente-oscuro jm-oscuro jm-seccion", [
    c("jm-contenedor jm-pila", [
      c("jm-asesor-banda__cabeza", [
        h("h2", "jm-display-2 jm-asesor-banda__titulo", "No sabes qué máquina pedir. Normal."),
        t("jm-lede jm-asesor-banda__lede jm-hereda", "Contesta tres preguntas sobre el trabajo que tienes delante y te decimos qué equipos de nuestro parque encajan, y por qué."),
      ], { attrs: { "data-revelar": "" } }),
      sc('[jm_asesor variante="portada"]'),
    ]),
  ], { tag: "section", idcss: "asesor" }),
];

/* El Loop Carousel se añade cuando exista la plantilla «Tarjeta de máquina». */
const destacadas = () => [
  c("jm-destacadas jm-seccion", [
    c("jm-contenedor jm-pila", [
      c("jm-cabecera-seccion jm-cabecera-seccion--4", [
        c("jm-cabecera-seccion__texto", [
          h("p", "jm-label", "Con ficha y foto oficial"),
          h("h2", "jm-display-2 jm-tinta jm-mt-3 jm-ch-24", "62 máquinas que puedes decidir sin llamar", { dyn: ['[jm_cifra que="destacadas"]', { despues: " máquinas que puedes decidir sin llamar" }] }),
          t("jm-lede jm-texto-2 jm-mt-4 jm-ch-52 jm-hereda", "Fotografía de nuestra propia flota y ficha técnica del fabricante, para comparar cifras antes de pedir nada."),
        ], { attrs: { "data-revelar": "" } }),
        c("jm-destacadas__acciones", [b("jm-btn jm-btn--enlace", "Ver todo el catálogo", "/alquiler/", flecha)], { fila: true }),
      ]),
      h("p", "jm-label-sm jm-destacadas__pie jm-solo-movil", "Arrastra para ver el resto"),
    ]),
  ], { tag: "section", attrs: { "data-jm": "destacadas" } }),
];

const cobertura = () => [
  c("jm-cobertura jm-ambiente-oscuro jm-oscuro jm-seccion", [
    c("jm-contenedor jm-pila", [
      c("jm-cobertura__rejilla", [
        c("jm-cobertura__texto", [
          c("jm-cabecera-seccion__texto", [
            h("p", "jm-label", "Cobertura ibérica"),
            h("h2", "jm-display-2 jm-mt-3 jm-ch-22", "Más cerca de donde empieza el trabajo"),
            t("jm-lede jm-mt-4 jm-ch-52 jm-hereda", 'Cuando pides una máquina la confirma una persona de la delegación que la tiene, no un formulario automático. <span class="jm-texto-inv">[jm_dato clave="lema"]</span>'),
          ], { attrs: { "data-revelar": "" } }),
          sc("[jm_delegaciones_lista]"),
          c("jm-cobertura__botones", [
            b("jm-btn jm-btn--acento", "Consultar disponibilidad", "/consultar-disponibilidad/"),
            b("jm-btn jm-btn--enlace jm-enlace-claro", "Direcciones y teléfonos", "/delegaciones/", flecha),
          ]),
        ]),
        c("jm-cobertura__mapa", [sc('[jm_mapa tono="oscuro"]')], { attrs: { "data-revelar": "escala" } }),
      ]),
      t("jm-cobertura__pie jm-hereda", "No publicamos horarios que no podamos garantizar: llama a la delegación y te lo confirmamos en el momento."),
    ]),
  ], { tag: "section" }),
];

const PILARES = [
  ["clock", "Desde 1987", "Empezamos en Avilés y hoy servimos desde nueve delegaciones propias. Décadas junto a profesionales que necesitan maquinaria para avanzar sin contratiempos.", "Solidez empresarial"],
  ["wrench", "Servicio técnico propio", "Mecánicos, taller y furgones de asistencia móvil. Una incidencia con la máquina no debería convertirse en un problema mayor.", "Talleres y unidades móviles"],
  ["shield-check", "Procesos certificados", "Gestión auditada según ISO 9001, 14001 y 45001, con revisión del equipo antes de cada salida.", "ISO 9001 · ISO 14001 · ISO 45001"],
  ["award", "Marcas de referencia", "Genie, JLG, Haulotte, Manitou, Takeuchi, JCB, Bomag, Hamm, Atlas Copco. Y partner oficial de Jungheinrich en manutención.", "Flota de marca oficial"],
];
const CIFRAS = [["Equipos en flota", "equipos", "+5.000"], ["Referencias en catálogo", "referencias", "145"], ["Delegaciones propias", "delegaciones", "9"], ["Familias de maquinaria", "familias", "6"]];

const autoridad = () => [
  c("jm-autoridad jm-seccion", [
    c("jm-contenedor jm-pila", [
      c("jm-autoridad__rejilla", [
        c("jm-autoridad__texto", [
          h("p", "jm-label jm-acento", "Garantía técnica y solvencia"),
          h("h2", "jm-display-2 jm-tinta jm-mt-3 jm-ch-24", "La máquina importa. Lo que hay detrás, todavía más."),
          t("jm-lede jm-texto-2 jm-mt-4 jm-ch-54 jm-hereda", "Una obra, una instalación o una línea de producción no pueden depender solo de una ficha técnica. Detrás del equipo necesitas experiencia, mantenimiento y gente que sepa de maquinaria."),
          c("jm-celdas jm-autoridad__cifras", CIFRAS.map(([rotulo, que, ahora]) =>
            c("jm-autoridad__cifra", [h("span", "jm-label-sm", rotulo), h("span", "jm-value-lg", ahora, { dyn: [`[jm_cifra que="${que}"]`] })]))),
        ], { attrs: { "data-revelar": "" } }),
        c("jm-autoridad__tarjeta jm-ambiente-oscuro jm-oscuro", [
          c("jm-autoridad__tarjeta-cabeza", [
            h("p", "jm-label-sm", "Experiencia acumulada"),
            sc("[jm_antiguedad]", "jm-autoridad__antiguedad"),
            h("p", "jm-value jm-autoridad__desde", "desde el 24 · 03 · 1987"),
          ]),
          t("jm-autoridad__parrafo jm-hereda", '[jm_dato clave="razon_social"] nació en Avilés como taller de manutención y hoy alquila, vende y mantiene maquinaria en toda la península.'),
          b("jm-btn jm-btn--enlace jm-enlace-claro", "Ver las 9 delegaciones", "/delegaciones/", { ...flecha, dynTexto: ['[jm_cifra que="delegaciones"]', { antes: "Ver las ", despues: " delegaciones" }] }),
        ], { attrs: { "data-revelar": "escala" } }),
      ]),
      c("jm-celdas jm-autoridad__pilares", PILARES.map(([icono, titulo, texto, pie]) =>
        c("jm-pilar", [ico(icono, "jm-icono-linea"), h("h3", "jm-title jm-pilar__titulo", titulo), t("jm-pilar__texto jm-hereda", texto), h("p", "jm-label-sm jm-pilar__pie", pie)])), { attrs: { "data-escalonar": "" } }),
      c("jm-tira-fabricantes jm-autoridad__fabricantes", [h("h3", "jm-label", "Nuestros fabricantes"), sc('[jm_fabricantes variante="autoridad"]')]),
    ]),
  ], { tag: "section" }),
];

const cierre = () => [
  c("jm-cierre jm-oscuro", [
    c("jm-contenedor jm-seccion-sm jm-cierre__cuerpo", [
      h("p", "jm-label", "Sin compromiso"),
      h("h2", "jm-display-2 jm-cierre__titulo", "Dinos qué necesitas y qué día. Te confirmamos disponibilidad."),
      t("jm-lede jm-cierre__lede jm-hereda", "Confirmamos disponibilidad, transporte y condiciones contigo antes de formalizar nada. Sin pasarela de pago y sin letra pequeña."),
      c("jm-cierre__botones", [
        b("jm-btn jm-btn--acento jm-btn--lg", "Consultar disponibilidad", "/consultar-disponibilidad/"),
        b("jm-btn jm-btn--lg jm-cierre__tel", "91 361 31 31", "tel:+34913613131", {
          icono: "phone", pos: "antes",
          dynTexto: ['[jm_dato clave="telefono"]'],
          dynEnlace: ['[jm_dato clave="tel"]', { antes: "tel:" }],
        }),
      ]),
    ]),
  ], { tag: "section" }),
];

export default {
  prefijo: "in",
  secciones: { hero, partners, garantias, necesidades, asesor, destacadas, cobertura, autoridad, cierre },
};
