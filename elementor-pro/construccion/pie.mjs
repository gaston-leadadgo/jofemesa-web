/** Pie (Theme Builder) · estructura/02-pie.md */
import { c, h, t, sc, img, lista, w } from "./lib.mjs";

const enlaces = (pares) => pares.map(([texto, enlace]) => ({ texto, enlace }));

const pie = () => [
  c("jm-pie", [
    c("jm-contenedor jm-pie__cuerpo", [
      c("jm-pie__rejilla", [
        c("jm-pie__col jm-pie__marca", [
          img("logo-blanco", "jm-pie__logo", { alt: "JOFEMESA · Alquiler de maquinaria" }),
          h("p", "jm-pie__lema", "Llegamos lejos para estar cerca."),
          t("jm-pie__razon jm-hereda", '[jm_dato clave="razon_social"] · CIF [jm_dato clave="cif"]. Alquiler de maquinaria desde [jm_dato clave="fundacion"].'),
          w("icon-list", {
            view: "inline",
            _css_classes: "jm-pie__correo",
            icon_list: [{
              _id: "jmcorreo",
              text: "jofemesa@jofemesa.com",
              selected_icon: { value: "far fa-envelope", library: "fa-regular" },
              link: { url: "mailto:jofemesa@jofemesa.com", is_external: "", nofollow: "" },
            }],
          }),
          sc('[jm_redes tamano="18" variante="pie"]'),
        ]),
        c("jm-pie__col jm-pie__familias", [
          h("h2", "jm-label jm-pie__titulo", "Maquinaria"),
          lista("jm-pie__lista", enlaces([
            ["Elevación", "/alquiler/elevacion/"],
            ["Manutención de cargas", "/alquiler/manutencion/"],
            ["Excavación y movimiento de tierras", "/alquiler/movimiento-tierras/"],
            ["Energía e iluminación", "/alquiler/energia/"],
            ["Aire comprimido y martillos", "/alquiler/aire-martillos/"],
            ["Herramienta auxiliar", "/alquiler/herramienta-auxiliar/"],
          ])),
        ], { tag: "nav", attrs: { "aria-label": "Familias de maquinaria" } }),
        c("jm-pie__col jm-pie__secciones", [
          h("h2", "jm-label jm-pie__titulo", "Secciones"),
          lista("jm-pie__lista", enlaces([
            ["Alquiler de maquinaria", "/alquiler/"],
            ["Venta y recambios", "/servicios/#venta"],
            ["Mantenimiento", "/servicios/#mantenimiento"],
            ["Transporte a obra", "/servicios/#transporte"],
            ["Formación y calendario", "/formacion/"],
            ["Delegaciones", "/delegaciones/"],
            ["Contacto", "/contacto/"],
          ])),
          h("h2", "jm-label jm-pie__titulo jm-pie__titulo--sep", "Herramientas"),
          lista("jm-pie__lista", enlaces([
            ["¿Qué máquina necesito?", "/asesor/"],
            ["Comparador", "/comparador/"],
            ["Consultar disponibilidad", "/consultar-disponibilidad/"],
          ])),
        ], { tag: "nav", attrs: { "aria-label": "Secciones" } }),
        c("jm-pie__col jm-pie__delegaciones", [
          h("h2", "jm-label jm-pie__titulo", "Delegaciones y sede"),
          sc("[jm_delegaciones_pie]"),
          c("jm-pie__certificados", [
            h("h2", "jm-label-sm jm-pie__certificados-titulo", "Certificados"),
            sc("[jm_certificados]"),
          ], { fila: true }),
        ]),
      ]),
    ]),
    c("jm-pie__faldon", [
      c("jm-contenedor jm-pie__faldon-fila", [
        t("jm-pie__copy jm-hereda", '© [jm_dato clave="anio"] [jm_dato clave="razon_social"] · Todos los derechos reservados.'),
        lista("jm-pie__legales", enlaces([["Aviso legal", "/aviso-legal/"], ["Privacidad", "/privacidad/"], ["Cookies", "/cookies/"]]), { enLinea: true }),
      ]),
    ]),
  ], { tag: "div" }),
];

export default { prefijo: "pi", secciones: { pie } };
