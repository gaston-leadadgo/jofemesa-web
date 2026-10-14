/** Tarjeta de máquina (Loop Item) y ficha (Single) · estructura/21 y 22 */
import { c, h, b, sc, imgDestacada, w, campo, urlEntrada, fa } from "./lib.mjs";

const consultar = campo("jm_slug", { antes: "/consultar-disponibilidad/?m=" });

const tarjeta = () => [
  c("jm-tarjeta jm-tarjeta-maquina", [
    c("jm-tarjeta-maquina__cabecera", [
      c("jm-tarjeta-maquina__nombre", [
        h("p", "jm-label-sm jm-tarjeta-maquina__marca", "Marca", { etq: campo("jm_marca") }),
        h("h3", "jm-title jm-tarjeta-maquina__modelo", "Modelo", { etq: campo("jm_modelo"), enlaceDyn: urlEntrada() }),
        h("p", "jm-tarjeta-maquina__sub", "Subcategoría", { etq: campo("jm_subcategoria_nombre") }),
      ], { tag: "div" }),
      c("jm-tarjeta-maquina__chips", [
        h("span", "jm-label-sm jm-chip-energia", "Alimentación", { etq: campo("jm_energia_nombre") }),
        h("span", "jm-label-sm jm-chip-gama", "Gama"),
      ], { tag: "div" }),
    ], { tag: "div" }),
    c("jm-panel jm-tarjeta-maquina__foto", [
      imgDestacada("jm-foto-maquina", { enlaceEntrada: true }),
      sc("[jm_foto_pendiente]"),
    ], { tag: "div" }),
    sc("[jm_tarjeta_datos]"),
    h("p", "jm-tarjeta-maquina__desc", "Descripción", { etq: campo("jm_descripcion") }),
    c("jm-tarjeta-maquina__acciones", [
      c("jm-tarjeta-maquina__pareja", [
        b("jm-btn jm-btn--acento jm-btn--sm", "Ficha", "", { fa: fa("arrow-right"), pos: "despues", dynEnlace: urlEntrada() }),
        b("jm-btn jm-btn--sm jm-btn-comparar", "Comparar", "#comparar", { fa: fa("columns"), pos: "antes" }),
      ], { tag: "div" }),
      b("jm-btn jm-btn--tinta jm-btn--sm", "Consultar disponibilidad", "/consultar-disponibilidad/", { dynEnlace: consultar }),
    ], { tag: "div" }),
  ], { tag: "article" }),
];

const ficha = () => [
  c("jm-contenedor jm-ficha-pagina", [
    sc("[jm_migas]", "jm-ficha-migas"),
    c("jm-ficha", [
      c("jm-ficha__rejilla", [
        c("jm-ficha__media", [
          c("jm-ficha__foto", [imgDestacada("jm-foto-maquina"), sc("[jm_foto_pendiente]")], { tag: "div" }),
          sc('[jm_ficha parte="destacados"]'),
        ], { tag: "div" }),
        c("jm-ficha__datos", [
          h("p", "jm-label jm-ficha__sub", "Subcategoría", { etq: campo("jm_subcategoria_nombre") }),
          h("p", "jm-ficha__marca", "Marca", { etq: campo("jm_marca") }),
          h("h1", "jm-display-2 jm-ficha__modelo", "Modelo", { etq: campo("jm_modelo") }),
          h("p", "jm-lede jm-ficha__desc", "Descripción", { etq: campo("jm_descripcion") }),
          sc('[jm_ficha parte="gama"]'),
          c("jm-ficha__specs", [h("h2", "jm-label jm-ficha__specs-titulo", "Especificaciones"), sc("[jm_specs]")], { tag: "div" }),
          sc('[jm_ficha parte="aplicaciones"]'),
          c("jm-ficha__servicio", [
            h("h2", "jm-label jm-ficha__servicio-titulo", "Se sirve desde"),
            sc('[jm_ficha parte="delegaciones"]'),
            h("p", "jm-ficha__servicio-nota", "Con transporte propio entre delegaciones. La disponibilidad de la fecha la confirma la delegación que te atiende al responder tu solicitud."),
          ], { tag: "div" }),
          sc('[jm_ficha parte="nota"]'),
          c("jm-ficha__acciones", [
            b("jm-btn jm-btn--acento jm-btn--lg jm-btn--bloque", "Consultar disponibilidad", "/consultar-disponibilidad/", { dynEnlace: consultar }),
            c("jm-ficha__pareja", [
              sc('[jm_ficha parte="pdf"]'),
              b("jm-btn jm-btn--contorno jm-ficha__telefono", "91 361 31 31", "tel:+34913613131", {
                fa: fa("phone"), pos: "antes",
                dynTexto: ['[jm_dato clave="telefono"]'],
                dynEnlace: ['[jm_dato clave="tel"]', { antes: "tel:" }],
              }),
            ], { tag: "div" }),
            b("jm-btn jm-btn-comparar", "Añadir al comparador", "#comparar", { fa: fa("columns"), pos: "antes" }),
          ], { tag: "div" }),
        ], { tag: "div" }),
      ], { tag: "div" }),
    ], { tag: "div", attrs: { "data-jm-modal-contenido": "" } }),
    c("jm-ficha__relacionadas", [
      h("h2", "jm-display-3 jm-ficha__relacionadas-titulo", "Máquinas parecidas"),
      w("loop-grid", {
        _skin: "post",
        template_id: 630,
        posts_per_page: 3,
        post_query_post_type: "maquina",
        post_query_query_id: "jm_relacionadas",
        pagination_type: "",
        _css_classes: "jm-rejilla-maquinas jm-rejilla-relacionadas",
      }),
    ], { tag: "section" }),
    b("jm-btn jm-btn--enlace jm-ficha__volver", "Volver al catálogo", "/alquiler/", { fa: fa("arrow-left"), pos: "antes" }),
  ], { tag: "div" }),
];

export default { prefijo: "mq", secciones: { tarjeta, ficha } };
