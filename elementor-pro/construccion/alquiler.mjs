/** Catálogo de alquiler: página /alquiler/ y archivo de familia · estructura/20-alquiler.md */
import { c, h, t, b, sc, html, w, etiqueta, dinamico } from "./lib.mjs";

const GALON = '<svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M20 10 L110 100 L20 190" stroke="currentColor" stroke-width="26"/><path d="M90 10 L180 100 L90 190" stroke="currentColor" stroke-width="26"/></svg>';
const flecha = { icono: "flecha", pos: "despues" };
const meta = (clave) => etiqueta("archive-meta", { key: clave });

const dato = (k, v, o = {}) =>
  c("jm-placa__dato", [h("p", "jm-placa__dato-k", k), h("p", "jm-placa__dato-v", v, o)]);

/** Tiras + catálogo: iguales en la página y en el archivo. */
const catalogo = () => [
  c("jm-catalogo-tiras", [c("jm-contenedor jm-catalogo-tiras__interior", [sc("[jm_catalogo_categorias]")])], { tag: "div" }),
  c("jm-contenedor jm-catalogo", [
    c("jm-catalogo__lateral", [sc("[jm_catalogo_filtros]")], { tag: "aside" }),
    c("jm-catalogo__principal", [
      sc("[jm_catalogo_barra]"),
      w("loop-grid", {
        _skin: "post",
        template_id: 630,
        columns: 3,
        columns_tablet: 2,
        columns_mobile: 1,
        posts_per_page: 200,
        equal_height: "yes",
        post_query_post_type: "maquina",
        post_query_query_id: "jm_catalogo",
        pagination_type: "",
        _css_classes: "jm-rejilla-maquinas jm-catalogo-rejilla",
        _attributes: "data-jm-modal|/maquina/",
      }),
      sc("[jm_catalogo_pie]"),
    ], { tag: "div" }),
  ], { tag: "div" }),
];

const pagina = () => [
  c("jm-placa", [
    html(GALON, "jm-placa__galon"),
    c("jm-contenedor jm-placa__cuerpo", [
      c("jm-placa__rejilla", [
        c("jm-placa__texto", [
          h("p", "jm-label jm-placa__kicker", "Catálogo de alquiler"),
          h("h1", "jm-titular-placa jm-placa__titulo", "La máquina que te falta, lista para salir a tu obra.", { attrs: { "data-revelar": "" } }),
          t("jm-placa__lede jm-hereda", "Plataformas, manutención, tierras, energía, aire y herramienta, con flota, taller y camiones propios. Filtra por altura, alimentación, uso o fabricante y pide disponibilidad: te contesta la delegación que tiene la máquina.", { attrs: { "data-revelar": "", style: "--retardo:1" } }),
          c("jm-placa__botones", [
            b("jm-btn jm-btn--acento", "Consultar disponibilidad", "/consultar-disponibilidad/", flecha),
            b("jm-btn jm-btn--enlace", "No sé qué máquina necesito", "/asesor/"),
          ], { attrs: { "data-revelar": "", style: "--retardo:2" } }),
        ]),
        c("jm-placa__datos", [
          dato("Referencias", "145", { dyn: ['[jm_catalogo_cifra dato="referencias"]'] }),
          dato("Altura máxima", "57 m"),
          dato("Delegaciones", "9", { dyn: ['[jm_catalogo_cifra dato="delegaciones"]'] }),
        ]),
      ]),
    ]),
  ], { tag: "section" }),
  ...catalogo(),
];

const archivo = () => [
  c("jm-placa", [
    html(GALON, "jm-placa__galon"),
    c("jm-contenedor jm-placa__cuerpo", [
      sc("[jm_migas]", "jm-placa__migas"),
      c("jm-placa__rejilla", [
        c("jm-placa__texto", [
          h("p", "jm-label jm-placa__kicker", "Familia", { etq: meta("jm_nombre_largo") }),
          h("h1", "jm-titular-placa jm-placa__titulo", "Frase de la familia", { etq: meta("jm_claim") }),
          w("text-editor", { editor: "<p>Descripción de la familia</p>", _css_classes: "jm-placa__lede jm-hereda", __dynamic__: { editor: meta("jm_descripcion") } }),
          c("jm-placa__botones", [
            b("jm-btn jm-btn--acento", "Consultar disponibilidad", "/consultar-disponibilidad/", {
              ...flecha,
              dynEnlace: dinamico('[jm_termino campo="jm_nombre_largo" url="si"]', { antes: "/consultar-disponibilidad/?contexto=" }),
            }),
            b("jm-btn jm-btn--enlace", "No sé cuál necesito", "/asesor/"),
          ]),
        ]),
        c("jm-placa__datos", [
          dato("Referencias", "80", { dyn: ['[jm_catalogo_cifra dato="referencias"]'] }),
          dato("Rango", "Rango", { etq: meta("jm_rango") }),
          dato("Delegaciones", "9", { dyn: ['[jm_catalogo_cifra dato="delegaciones"]'] }),
        ]),
      ]),
    ]),
  ], { tag: "section" }),
  ...catalogo(),
];

export default { prefijo: "al", secciones: { pagina, archivo } };
