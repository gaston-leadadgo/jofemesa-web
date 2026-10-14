/** Delegaciones · estructura/50-delegaciones.md */
import { c, h, t, b, sc, html, lista, w, fa, etiqueta, campo } from "./lib.mjs";

const GALON = '<svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M20 10 L110 100 L20 190" stroke="currentColor" stroke-width="26"/><path d="M90 10 L180 100 L90 190" stroke="currentColor" stroke-width="26"/></svg>';
const icoFa = (f, clases) => w("icon", { selected_icon: f, _css_classes: clases });

/* ---------- Loop Item · Delegación · tarjeta ---------- */
const tarjeta = () => [
  c("jm-deleg", [
    c("jm-deleg__cuerpo", [
      c("jm-deleg__cabeza", [
        c("jm-deleg__nombre-caja", [
          sc("[jm_delegacion_provincia]"),
          h("h3", "jm-display-3 jm-deleg__nombre", "Delegación", { etq: etiqueta("post-title") }),
        ]),
        sc("[jm_delegacion_insignia]", "jm-deleg__insignias"),
      ], { fila: true }),
      c("jm-deleg__dl", [
        c("jm-fila-icono", [
          icoFa(fa("map-marker-alt"), "jm-fila-icono__i"),
          c("jm-fila-icono__dd", [
            h("span", "jm-sr", "Dirección"),
            h("p", "jm-deleg__direccion", "Dirección", { etq: campo("jm_direccion") }),
            c("jm-deleg__cp-loc", [
              h("span", "jm-deleg__cp", "CP", { etq: campo("jm_cp") }),
              h("span", "", "Localidad", { etq: campo("jm_localidad") }),
            ], { fila: true }),
            b("jm-btn jm-deleg__llegar", "Cómo llegar", "", { fa: fa("location-arrow"), pos: "antes", nueva: true, dynEnlace: campo("jm_maps") }),
          ]),
        ], { fila: true }),
        sc("[jm_delegacion_contacto]"),
      ]),
      sc("[jm_delegacion_servicios]"),
    ]),
    sc("[jm_delegacion_boton]", "jm-deleg__pie"),
  ], { tag: "article" }),
];

/* ---------- Página /delegaciones/ ---------- */
const grupo = (titulo, consulta, clases) =>
  c(clases, [
    c("jm-contenedor", [
      h("h2", "jm-display-3 jm-deleg-grupo__titulo", titulo, { attrs: { "data-revelar": "" } }),
      w("loop-grid", {
        _skin: "post",
        template_id: 633,
        posts_per_page: 20,
        post_query_post_type: "delegacion",
        post_query_query_id: consulta,
        pagination_type: "",
        _css_classes: "jm-deleg-rejilla",
      }),
    ]),
  ], { tag: "section" });

const cifra = (v, k) => c("jm-deleg-cifras__item", [h("p", "jm-deleg-cifras__v", v), h("p", "jm-label-sm jm-deleg-cifras__k", k)]);

const pagina = () => [
  c("jm-placa", [
    html(GALON, "jm-placa__galon"),
    c("jm-contenedor jm-placa__cuerpo", [
      c("jm-placa__rejilla", [
        c("jm-placa__texto", [
          h("p", "jm-label jm-placa__kicker", "Cobertura territorial ibérica"),
          h("h1", "jm-titular-placa jm-placa__titulo", "9 delegaciones propias y una sede de formación", { attrs: { "data-revelar": "" } }),
          t("jm-placa__lede jm-hereda", "Flota, taller y camiones propios en cada una. Llegamos lejos para estar cerca. Si tu obra está lejos de todas ellas, tenemos rutas de transporte diarias entre delegaciones: llámanos y te decimos plazo.", { attrs: { "data-revelar": "", style: "--retardo:1" } }),
          c("jm-placa__botones", [
            b("jm-btn jm-btn--acento", "Pedir una máquina", "/consultar-disponibilidad/", { fa: fa("arrow-right"), pos: "despues" }),
          ], { fila: true, attrs: { "data-revelar": "", style: "--retardo:2" } }),
        ]),
        c("jm-placa__aside jm-deleg-aside", [
          sc('[jm_mapa tono="oscuro" animado="1"]'),
          c("jm-deleg-cifras", [cifra("7", "España"), cifra("2", "Portugal"), cifra("1", "Sede formación")]),
        ], { attrs: { "data-revelar": "escala" } }),
      ]),
    ]),
  ], { tag: "section" }),
  grupo("España", "jm_delegaciones_espana", "jm-seccion jm-borde-abajo"),
  grupo("Portugal", "jm_delegaciones_portugal", "jm-seccion jm-borde-abajo"),
  c("jm-seccion", [
    c("jm-contenedor", [
      h("h2", "jm-display-3", "Otros centros"),
      h("p", "jm-centros__intro", "Con teléfono y correo propios; también figura en nuestro catálogo general."),
      c("jm-centros", [
        c("jm-centro", [
          h("h3", "jm-title jm-centro__titulo", "Distribuidor oficial Takeuchi"),
          t("jm-centro__dir jm-hereda", 'Polígono Industrial Las Fronteras, C/ Mar Mediterráneo, 1<br><span class="jm-value">28830</span> San Fernando de Henares, Madrid'),
          lista("jm-enlace-tel jm-centro__tel", [{ texto: "680 800 215", enlace: "tel:+34680800215", fa: fa("phone") }]),
          h("p", "jm-enlace-correo jm-centro__correo", "ventastakeuchi@jofemesa.com", { enlace: "mailto:ventastakeuchi@jofemesa.com" }),
        ]),
      ]),
    ]),
  ], { tag: "section" }),
];

export default { prefijo: "de", secciones: { tarjeta, pagina } };
