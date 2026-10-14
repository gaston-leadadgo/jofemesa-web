/**
 * Ayudantes para escribir la estructura de Elementor (JSON) a partir de los
 * planos de estructura/*.md. Cada página o plantilla es un .mjs que exporta
 * secciones; `node construccion/generar.mjs <archivo>` escribe el JSON en
 * construccion/salida/ para importarlo con el conector (import-template).
 *
 * Reglas (CONVENCIONES.md): contenedores en ancho completo, clases en
 * Avanzado → Clases CSS, atributos «clave|valor», nada en la pestaña Estilo.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
/** Medios ya subidos al WordPress de montaje: nombre → { id, url }. */
export const M = JSON.parse(readFileSync(join(AQUI, "medios.json"), "utf8"));

let prefijo = "jm";
let cuenta = 0;
/** Prefijo de IDs por documento: así no chocan entre páginas y plantillas. */
export function empezar(p) {
  prefijo = p;
  cuenta = 0;
}
const id = () => (prefijo + (++cuenta).toString(16).padStart(5, "0")).slice(-7);

const atributos = (a) =>
  a ? Object.entries(a).map(([k, v]) => `${k}|${v}`).join("\n") : undefined;

const limpio = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== ""));

/** Etiqueta dinámica «Shortcode» de Elementor Pro, con Antes / Después. */
export function dinamico(shortcode, { antes, despues } = {}) {
  const ajustes = limpio({ shortcode, before: antes, after: despues });
  return `[elementor-tag id="${id()}" name="shortcode" settings="${encodeURIComponent(JSON.stringify(ajustes))}"]`;
}

/**
 * Contenedor. o: { tag, fila, attrs, idcss, enlace }
 */
export function c(clases, hijos = [], o = {}) {
  return {
    id: id(),
    elType: "container",
    isInner: false,
    settings: limpio({
      content_width: "full",
      css_classes: clases,
      html_tag: o.tag,
      flex_direction: o.fila ? "row" : undefined,
      _attributes: atributos(o.attrs),
      _element_id: o.idcss,
      link: o.enlace ? { url: o.enlace, is_external: "", nofollow: "" } : undefined,
    }),
    elements: hijos,
  };
}

const widget = (tipo, ajustes) => ({ id: id(), elType: "widget", widgetType: tipo, settings: limpio(ajustes), elements: [] });

/** Título. o: { dyn: [shortcode, {antes, despues}], enlace, attrs } */
export function h(tag, clases, texto, o = {}) {
  const s = {
    title: texto,
    header_size: tag,
    _css_classes: clases,
    _attributes: atributos(o.attrs),
    link: o.enlace ? { url: o.enlace, is_external: "", nofollow: "" } : undefined,
  };
  if (o.dyn) s.__dynamic__ = { title: dinamico(...o.dyn) };
  return widget("heading", s);
}

/** Editor de texto. Varios párrafos: pasar un array. */
export function t(clases, html, o = {}) {
  const cuerpo = (Array.isArray(html) ? html : [html]).map((p) => (p.startsWith("<") ? p : `<p>${p}</p>`)).join("");
  return widget("text-editor", { editor: cuerpo, _css_classes: clases, _attributes: atributos(o.attrs), _element_id: o.idcss });
}

/** Botón. o: { icono: nombre de M, pos: 'despues'|'antes', dynTexto, dynEnlace, attrs, idcss } */
export function b(clases, texto, enlace, o = {}) {
  const s = {
    text: texto,
    link: { url: enlace || "", is_external: o.nueva ? "on" : "", nofollow: "" },
    _css_classes: clases,
    _attributes: atributos(o.attrs),
    _element_id: o.idcss,
  };
  if (o.icono) {
    const m = M[o.icono];
    s.selected_icon = { value: { id: m.id, url: m.url }, library: "svg" };
    s.icon_align = o.pos === "antes" ? "row" : "row-reverse";
  }
  const dyn = {};
  if (o.dynTexto) dyn.text = dinamico(...o.dynTexto);
  if (o.dynEnlace) dyn.link = dinamico(...o.dynEnlace);
  if (Object.keys(dyn).length) s.__dynamic__ = dyn;
  return widget("button", s);
}

/** Widget Shortcode. */
export function sc(codigo, clases, o = {}) {
  return widget("shortcode", { shortcode: codigo, _css_classes: clases, _attributes: atributos(o.attrs) });
}

/** Imagen de la biblioteca (nombre en medios.json). */
export function img(nombre, clases, o = {}) {
  const m = M[nombre];
  return widget("image", {
    image: { id: m.id, url: m.url, alt: o.alt ?? m.alt ?? "" },
    image_size: "full",
    _css_classes: clases,
    link_to: o.enlace ? "custom" : "none",
    link: o.enlace ? { url: o.enlace, is_external: "", nofollow: "" } : undefined,
  });
}

/** Icono suelto con un SVG subido. */
export function ico(nombre, clases) {
  const m = M[nombre];
  return widget("icon", { selected_icon: { value: { id: m.id, url: m.url }, library: "svg" }, _css_classes: clases });
}

/** Lista de iconos (sin icono por defecto). items: [texto] o [{texto, enlace, icono}] */
export function lista(clases, items, o = {}) {
  return widget("icon-list", {
    view: o.enLinea ? "inline" : "traditional",
    _css_classes: clases,
    icon_list: items.map((it) => {
      const x = typeof it === "string" ? { texto: it } : it;
      const m = x.icono ? M[x.icono] : null;
      return limpio({
        _id: id(),
        text: x.texto,
        selected_icon: m ? { value: { id: m.id, url: m.url }, library: "svg" } : { value: "", library: "" },
        link: x.enlace ? { url: x.enlace, is_external: "", nofollow: "" } : undefined,
      });
    }),
  });
}

/** Widget HTML (solo cuando un plano lo pide expresamente). */
export function html(codigo, clases) {
  return widget("html", { html: codigo, _css_classes: clases });
}

/** Cualquier otro widget con sus ajustes tal cual. */
export function w(tipo, ajustes) {
  return widget(tipo, ajustes);
}
