/** Servicios · estructura/30-servicios.md */
import { c, h, t, b, sc, html, img, ico, lista, fa } from "./lib.mjs";

const GALON = '<svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M20 10 L110 100 L20 190" stroke="currentColor" stroke-width="26"/><path d="M90 10 L180 100 L90 190" stroke="currentColor" stroke-width="26"/></svg>';
const flecha = { icono: "flecha", pos: "despues" };
const tick = (texto) => ({ texto, fa: fa("check") });
const tel = (texto, num) => ({ texto, enlace: `tel:${num}`, fa: fa("phone") });

const SRV = [
  {
    id: "venta", icono: "maquina-carretilla", epigrafe: "Venta de maquinaria y recambios",
    resumen: "Carretillas nuevas y reacondicionadas, y recambios de cualquier marca.",
    titulo: "También vendemos la máquina, no solo la alquilamos",
    lede: "Carretillas elevadoras contrapesadas y de almacén, nuevas y reacondicionadas. Y recambios originales para maquinaria de cualquier marca, no solo de la que vendemos.",
    puntos: ["Carretillas contrapesadas y de almacén, nuevas y reacondicionadas", "Recambios para maquinaria nueva y reacondicionada de cualquier marca", "Asesoramiento sobre compra o alquiler según el uso real que le vayas a dar"],
    cta: ["Pedir presupuesto de venta", "/consultar-disponibilidad/?asunto=venta"],
    paneles: () => [
      c("jm-srv__panel", [
        img("jungheinrich", "jm-srv__logo", { alt: "Partner oficial de Jungheinrich" }),
        t("jm-srv__panel-texto jm-hereda", "Somos partner oficial de Jungheinrich y distribuimos todo su catálogo: contrapesadas eléctricas y diésel, mástil retráctil, trilaterales EKX y EFX, preparadoras de pedidos, transpaletas, apiladores y tractores de arrastre. También su gama reacondicionada JUNGSTARS."),
      ], { attrs: { "data-revelar": "escala" } }),
      c("jm-srv__panel", [
        h("p", "jm-label jm-srv__panel-label", "Distribuidor oficial"),
        h("p", "jm-title jm-srv__panel-titulo", "Distribuidor oficial Takeuchi"),
        h("p", "jm-srv__panel-dir", "Polígono Industrial Las Fronteras, C/ Mar Mediterráneo, 1, 28830 San Fernando de Henares, Madrid"),
        lista("jm-enlace-tel jm-srv__panel-tel", [tel("680 800 215", "+34680800215")]),
        h("p", "jm-enlace-correo jm-srv__panel-correo", "ventastakeuchi@jofemesa.com", { enlace: "mailto:ventastakeuchi@jofemesa.com" }),
      ], { attrs: { "data-revelar": "escala" } }),
    ],
  },
  {
    id: "mantenimiento", icono: "maquina-herramienta", epigrafe: "Mantenimiento y taller propio",
    resumen: "Mecánicos propios y furgones taller que se desplazan al tajo.",
    titulo: "Servicio técnico propio y asistencia móvil",
    lede: "Cada equipo pasa una revisión técnica antes de cada salida. Si durante el trabajo surge una incidencia, nuestros furgones taller se desplazan al tajo para resolverla. También mantenemos la máquina que no has alquilado con nosotros.",
    puntos: ["Mecánicos propios formados por los fabricantes de nuestra flota", "Furgones taller equipados para diagnóstico hidráulico y eléctrico", "Mantenimiento preventivo programado, con histórico de cada intervención", "Reparación de carretillas, palas, retroexcavadoras y plataformas de cualquier marca"],
    cta: ["Solicitar una intervención", "/consultar-disponibilidad/?asunto=mantenimiento"],
    paneles: () => [
      c("jm-srv__panel", [
        h("p", "jm-label jm-srv__panel-label", "Talleres propios"),
        c("jm-srv__talleres", [
          c("jm-srv__taller", [h("span", "jm-srv__taller-nombre", "Madrid"), h("span", "jm-srv__taller-tel", "91 361 31 31", { enlace: "tel:+34913613131" })], { fila: true }),
          c("jm-srv__taller", [h("span", "jm-srv__taller-nombre", "Sevilla"), h("span", "jm-srv__taller-tel", "955 77 63 63", { enlace: "tel:+34955776363" })], { fila: true }),
        ]),
        h("p", "jm-srv__panel-nota", "Y furgones taller que se desplazan al tajo desde cualquiera de las 9 delegaciones."),
      ], { attrs: { "data-revelar": "escala" } }),
    ],
  },
  {
    id: "transporte", icono: "maquina-camion", epigrafe: "Logística directa",
    resumen: "Camiones propios y entrega en la franja horaria que acordemos.",
    titulo: "Transporte y entrega coordinada en obra",
    lede: "Flota de camiones propia con rampas, góndolas rebajadas y camiones pluma. Coordinamos la entrega en la franja horaria acordada para que tus operarios tengan la máquina desde el primer minuto.",
    puntos: ["Descarga por conductores especializados en maquinaria pesada", "Puesta en marcha básica y comprobación de mandos en la entrega", "Retirada coordinada en cuanto termina el periodo de alquiler", "Rutas propias entre delegaciones de España y Portugal"],
    cta: ["Consultar transporte y plazo", "/consultar-disponibilidad/?asunto=transporte"],
    paneles: () => [
      c("jm-srv__panel", [
        h("p", "jm-label jm-srv__panel-label", "Rutas propias"),
        sc('[jm_mapa tono="claro"]', "jm-srv__mapa"),
        h("p", "jm-srv__panel-texto", "Camiones propios con base en las 9 delegaciones y rutas diarias entre ellas, también entre España y Portugal."),
        b("jm-btn jm-btn--enlace jm-srv__panel-enlace", "Ver las delegaciones", "/delegaciones/", flecha),
      ], { attrs: { "data-revelar": "escala" } }),
    ],
  },
  {
    id: "formacion", icono: "maquina-columna", epigrafe: "Formación de operadores",
    resumen: "Centro homologado IPAF y AENOR para operadores de PEMP y carretillas.",
    titulo: "Centro de formación homologado",
    lede: "Somos centro de formación homologado IPAF y contamos con los certificados de AENOR de formación de operadores de plataformas (UNE 58923) y de carretillas (UNE 58451). Tenemos central de formación propia en San Fernando de Henares.",
    puntos: ["Carné IPAF (PAL), reconocido en más de 65 países", "Certificación AENOR UNE 58923 para operadores de PEMP", "Certificación AENOR UNE 58451 para operadores de carretillas"],
    cta: ["Consultar convocatorias", "/formacion/#calendario"],
    homolog: [["IPAF", "Centro de formación homologado"], ["AENOR · UNE 58923", "Formación de operadores de PEMP"], ["AENOR · UNE 58451", "Formación de operadores de carretillas"]],
    aviso: "El calendario de convocatorias, el catálogo de cursos y la gestión de la bonificación de FUNDAE están en preparación. Mientras tanto, llámanos o escríbenos y te contamos las fechas disponibles.",
    paneles: () => [
      c("jm-srv__panel", [
        h("p", "jm-label jm-srv__panel-label", "Sede de formación"),
        h("p", "jm-srv__panel-dir jm-srv__panel-dir--ink", "Pol. Ind. Las Fronteras, C/ Mar Mediterráneo, 1"),
        h("p", "jm-srv__panel-dir", "28830 San Fernando de Henares (Madrid)"),
        lista("jm-enlace-tel jm-srv__panel-tel", [tel("649 755 883", "+34649755883")]),
        h("p", "jm-enlace-correo jm-srv__panel-correo", "formacion@jofemesa.com", { enlace: "mailto:formacion@jofemesa.com" }),
        b("jm-btn jm-btn--enlace jm-srv__panel-enlace", "Ver calendario de convocatorias", "/formacion/"),
      ], { attrs: { "data-revelar": "escala" } }),
    ],
  },
];

const cabecera = () => [
  c("jm-placa", [
    html(GALON, "jm-placa__galon"),
    c("jm-contenedor jm-placa__cuerpo", [
      c("jm-placa__rejilla", [
        c("jm-placa__texto", [
          h("p", "jm-label jm-placa__kicker", "Servicios integrales de soporte"),
          h("h1", "jm-titular-placa jm-placa__titulo", "Respaldo técnico, transporte y formación", { attrs: { "data-revelar": "" } }),
          t("jm-placa__lede jm-hereda", "No solo alquilamos. Vendemos carretillas y recambios, mantenemos maquinaria de cualquier marca, la llevamos a pie de obra y formamos a quien la va a manejar.", { attrs: { "data-revelar": "", style: "--retardo:1" } }),
          c("jm-placa__botones", [b("jm-btn jm-btn--acento", "Pedir información", "/consultar-disponibilidad/?asunto=servicios", flecha)], { attrs: { "data-revelar": "", style: "--retardo:2" } }),
        ]),
        c("jm-placa__datos", [
          ["Servicios", "4"], ["Talleres propios", "2"], ["Homologaciones", "3"],
        ].map(([k, v]) => c("jm-placa__dato", [h("p", "jm-placa__dato-k", k), h("p", "jm-placa__dato-v", v)])), { attrs: { "data-escalonar": "" } }),
      ]),
    ]),
  ], { tag: "section" }),
  c("jm-srv-indice-seccion", [
    c("jm-contenedor jm-srv-indice", [
      c("jm-srv-indice__rejilla", SRV.map((s, i) =>
        c("jm-srv-tarjeta", [
          c("jm-srv-tarjeta__cabeza", [ico(s.icono, "jm-srv-tarjeta__icono"), h("span", "jm-srv-tarjeta__num", `0${i + 1}`)], { fila: true }),
          h("span", "jm-title jm-srv-tarjeta__titulo", s.epigrafe),
          h("span", "jm-srv-tarjeta__resumen", s.resumen),
          h("span", "jm-srv-tarjeta__pie", "Ver el detalle"),
        ], { tag: "a", enlace: `#${s.id}` })), { attrs: { "data-escalonar": "" } }),
    ]),
  ], { tag: "section" }),
];

const bloques = () => SRV.map((s, i) =>
  c(`jm-seccion jm-borde-abajo jm-srv${i % 2 ? " jm-hundido" : ""}`, [
    c("jm-contenedor", [
      c("jm-srv__rejilla", [
        c("jm-srv__texto", [
          c("jm-srv__epigrafe", [ico(s.icono, "jm-srv__icono"), h("p", "jm-label jm-srv__label", s.epigrafe)], { fila: true }),
          h("h2", "jm-display-2 jm-srv__titulo", s.titulo),
          t("jm-lede jm-srv__lede jm-hereda", s.lede),
          lista("jm-ticks jm-srv__puntos", s.puntos.map(tick)),
          ...(s.homolog ? [c("jm-srv__homolog", s.homolog.map(([k, v]) => c("jm-srv__homolog-item", [h("p", "jm-srv__homolog-k", k), h("p", "jm-srv__homolog-v", v)])))] : []),
          ...(s.aviso ? [t("jm-aviso-pendiente jm-srv__aviso jm-hereda", s.aviso)] : []),
          c("jm-srv__ctas", [
            b("jm-btn jm-btn--acento jm-btn--h14", s.cta[0], s.cta[1], flecha),
            b("jm-btn jm-btn--contorno jm-btn--h14 jm-btn--mono jm-srv__tel", "91 361 31 31", "tel:+34913613131", { fa: fa("phone"), pos: "antes" }),
          ]),
        ], { attrs: { "data-revelar": "" } }),
        c("jm-srv__lado", s.paneles()),
      ]),
    ]),
  ], { tag: "section", idcss: s.id }));

const cierre = () => [
  c("jm-seccion", [
    c("jm-contenedor jm-srv-cta__cuerpo", [
      h("h2", "jm-display-3", "¿Necesitas un plan a medida para tu empresa?"),
      t("jm-lede jm-srv-cta__lede jm-hereda", "Consúltanos sobre transporte agrupado, mantenimiento de flota o convocatorias de formación para grupos de operadores."),
      b("jm-btn jm-btn--acento jm-btn--lg jm-srv-cta__boton", "Pedir información de servicios", "/consultar-disponibilidad/?asunto=servicios"),
    ]),
  ], { tag: "section" }),
];

export default { prefijo: "sv", secciones: { cabecera, bloques, cierre } };
