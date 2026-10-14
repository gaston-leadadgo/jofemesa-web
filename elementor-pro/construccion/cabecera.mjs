/** Cabecera (Theme Builder) · estructura/01-cabecera.md */
import { c, h, b, sc, img, w } from "./lib.mjs";

const ITEMS = [
  ["Inicio", "/", false],
  ["Alquiler", "/alquiler/", true],
  ["Servicios", "/servicios/", false],
  ["Formación", "/formacion/", false],
  ["Contacto", "/contacto/", false],
];

const chevron = { value: "fas fa-chevron-down", library: "fa-solid" };

const menu = () => {
  const m = w("mega-menu", {
    menu_name: "Principal",
    menu_items: ITEMS.map(([titulo, url, desplegable], i) => ({
      _id: `jmmenu${i}`,
      item_title: titulo,
      item_link: { url, is_external: "", nofollow: "" },
      item_dropdown_content: desplegable ? "yes" : "no",
    })),
    content_width: "fit_to_content",
    content_horizontal_position: "left",
    item_layout: "horizontal",
    open_on: "hover",
    breakpoint_selector: "none",
    menu_item_icon: chevron,
    menu_item_icon_active: chevron,
    _css_classes: "jm-menu",
  });
  /* Un contenedor por elemento del menú; solo «Alquiler» tiene desplegable. */
  m.elements = ITEMS.map(([titulo, , desplegable]) =>
    desplegable
      ? c("jm-menu__panel", [
          c("jm-menu__panel-cab", [
            h("p", "jm-label-sm jm-menu__panel-titulo", "Familias de maquinaria"),
            b("jm-enlace-flecha", "Catálogo completo", "/alquiler/", { icono: "flecha", pos: "despues" }),
          ], { fila: true }),
          sc("[jm_menu_familias]"),
        ])
      : c("", []),
  );
  m.elements.forEach((e, i) => (e.settings._title = ITEMS[i][0]));
  return m;
};

const cabecera = () => [
  c("jm-franja", [
    c("jm-contenedor jm-franja__fila", [
      sc("[jm_contador_fundacion]"),
      c("jm-franja__derecha", [
        sc("[jm_desplegable_delegaciones]"),
        h("span", "jm-label-sm jm-franja__enlace", "¿Qué máquina necesito?", { enlace: "/asesor/" }),
      ], { fila: true }),
    ], { fila: true }),
  ], { tag: "div" }),
  c("jm-cabecera", [
    c("jm-contenedor jm-cabecera__fila", [
      img("logo", "jm-cabecera__logo", { enlace: "/" }),
      menu(),
      c("jm-cabecera__acciones", [
        sc("[jm_desplegable_telefonos]"),
        b("jm-btn jm-btn--acento jm-btn--sm jm-cabecera__cta", "Consultar disponibilidad", "/consultar-disponibilidad/"),
        sc("[jm_boton_menu]", "jm-cabecera__hamburguesa"),
      ], { fila: true }),
    ], { fila: true }),
  ], { tag: "header", attrs: { "data-jm": "cabecera" } }),
  c("jm-menu-movil", [
    c("jm-contenedor jm-menu-movil__cuerpo", [
      sc("[jm_nav_movil]"),
      b("jm-btn jm-btn--acento jm-btn--lg jm-btn--bloque jm-menu-movil__cta", "Consultar disponibilidad", "/consultar-disponibilidad/"),
      sc('[jm_desplegable_telefonos variante="lista"]'),
      sc('[jm_redes tamano="20" variante="movil"]'),
    ]),
  ], { tag: "div", idcss: "menu-movil" }),
];

export default { prefijo: "ca", secciones: { cabecera } };
