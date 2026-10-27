/**
 * Exporta los datos de la web Next.js al plugin `jofemesa-core`.
 *
 *   npx tsx elementor-pro/scripts/exportar-datos.tsx
 *
 * Todo lo que en Next se calcula en tiempo de render (las tres cifras de la
 * tarjeta, la tabla de especificaciones agrupada, las relacionadas, el texto
 * con que se busca) sale aquí ya calculado. Así WordPress pinta exactamente lo
 * mismo sin reprogramar esa lógica en PHP. Volver a ejecutarlo y reimportar es
 * la forma de sincronizar cualquier cambio del catálogo.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

import {
  ALQUILER,
  CATALOGO,
  FAMILIAS,
  FAMILIA_POR_ID,
  SUBCATEGORIA_POR_SLUG,
  relacionadas,
  specsAgrupadas,
  specsDestacadas,
} from "@/lib/catalog";
/* numeroDe se importa de su archivo: con tsx 4.23 la reexportación
   `export * from "./types"` no se ve desde un .tsx. */
import { SPEC_DEFS, numeroDe, type SpecDef, type SpecValor, type IconoId } from "@/lib/catalog/types";
import { num } from "@/lib/utils/format";
import { IconoMaquina } from "@/components/marca/IconoMaquina";
import { Mapa } from "@/components/marca/Mapa";
import {
  AFILIACIONES,
  CENTROS,
  CERTIFICACIONES,
  DELEGACIONES,
  EMAIL_PRINCIPAL,
  EMPRESA,
  FABRICANTES_FLOTA,
  FLOTA,
  HOMOLOGACIONES,
  LEMA,
  LEMA_EQUIPO,
  PUNTOS_CONTACTO,
  REDES,
  SEDE_FORMACION,
  TELEFONO_PRINCIPAL,
} from "@/content/es/empresa";
import { CONVOCATORIAS } from "@/content/es/convocatorias";
import {
  CURSOS,
  LEGISLACION,
  ORDEN_A_MEDIDA,
  ORDEN_CURSOS,
  SEDES_CURSO,
  TODOS_LOS_CURSOS,
} from "@/content/es/formacion";
import { SERVICIOS } from "@/content/es/servicios";

const RAIZ = join(process.cwd(), "elementor-pro");
const DATOS = join(RAIZ, "plugin", "jofemesa-core", "datos");
const ICONOS = join(RAIZ, "plugin", "jofemesa-core", "assets", "iconos");
mkdirSync(DATOS, { recursive: true });
mkdirSync(ICONOS, { recursive: true });

const escribir = (nombre: string, datos: unknown) =>
  writeFileSync(join(DATOS, nombre), JSON.stringify(datos, null, 1) + "\n", "utf8");

/* ------------------------------------------------------------
   Especificaciones, ya en texto
   ------------------------------------------------------------ */

const FUENTES: Record<string, string> = {
  "catalogo-jofemesa": "Dato del Catálogo General de Maquinaria de JOFEMESA",
  "jofemesa.com": "Dato publicado en jofemesa.com",
  "ficha-pdf": "Dato de la ficha técnica del fabricante",
  "nomenclatura-modelo": "Dato deducido de la designación del modelo",
  fabricante: "Dato del catálogo público del fabricante",
};
const GRUPOS: Record<string, string> = {
  prestaciones: "Prestaciones",
  capacidades: "Capacidades",
  dimensiones: "Dimensiones",
  motorizacion: "Motorización",
};

/** El mismo criterio que `DatoValor`: texto, unidad, estado y la nota del título. */
function dato(def: SpecDef, d: SpecValor | undefined) {
  if (!d || d.estado === "no_aplica")
    return { estado: "no_aplica", texto: "—", unidad: "", nota: "No aplica a este tipo de máquina" };
  if (d.estado === "pendiente")
    return {
      estado: "pendiente",
      texto: "Pendiente",
      unidad: "",
      nota: d.nota ?? "Te lo confirmamos al responder la solicitud.",
    };
  const texto = typeof d.valor === "number" ? num(d.valor) : String(d.valor);
  const unidad = def.unidad && typeof d.valor === "number" ? def.unidad : "";
  return {
    estado: d.estado,
    texto,
    unidad,
    valor: typeof d.valor === "number" ? d.valor : null,
    nota:
      d.estado === "estimado"
        ? (d.nota ?? "Dato sin confirmar contra la unidad de flota. Lo comprobamos al responder tu solicitud.")
        : FUENTES[d.fuente],
  };
}

const DEF = Object.fromEntries(SPEC_DEFS.map((d) => [d.key, d]));
const ENERGIA: Record<string, string> = {
  electrico: "Eléctrico",
  diesel: "Diésel",
  hibrido: "Híbrido",
  gasolina: "Gasolina",
};

const maquinas = CATALOGO.map((m) => {
  const fam = FAMILIA_POR_ID[m.familia];
  const sub = SUBCATEGORIA_POR_SLUG[m.subcategoriaSlug];
  const foto = m.imagenes[0] ?? null;
  return {
    slug: m.slug,
    marca: m.marca,
    modelo: m.modelo,
    titulo: `${m.marca} ${m.modelo}`,
    familia: m.familia,
    familiaNombre: fam.nombre,
    subcategoria: m.subcategoriaSlug,
    subcategoriaNombre: sub?.nombre ?? "",
    icono: sub?.icono ?? fam.icono,
    lineas: m.lineas,
    condicionVenta: m.condicionVenta ?? null,
    gama: Boolean(m.gama),
    destacada: m.destacada,
    orden: m.orden,
    energia: m.facetas.energia,
    energiaNombre: ENERGIA[m.facetas.energia],
    entornos: m.facetas.entornos,
    traccion: m.facetas.traccion,
    requiereFormacion: m.facetas.requiereFormacion,
    delegaciones: m.delegaciones,
    descripcionCorta: m.descripcionCorta,
    aplicaciones: m.aplicaciones,
    destacados: m.destacados,
    trabajos: m.trabajos,
    notaAsesor: m.notaAsesor ?? null,
    altura: numeroDe(m.specs.alturaTrabajo) ?? null,
    carga: numeroDe(m.specs.capacidadCarga) ?? null,
    foto: foto && { ruta: foto.src, alt: foto.alt, ancho: foto.ancho, alto: foto.alto },
    ficha: m.fichaTecnica && { ruta: m.fichaTecnica.src, bytes: m.fichaTecnica.bytes },
    /** Las tres cifras de la tarjeta. */
    tarjeta: specsDestacadas(m).map((k) => {
      const d = dato(DEF[k], m.specs[k]);
      return {
        key: k,
        etiqueta: DEF[k].etiquetaCorta ?? DEF[k].etiqueta,
        ...d,
        texto: DEF[k].compacto && d.valor === null && d.texto !== "—" && d.texto !== "Pendiente" ? DEF[k].compacto(d.texto) : d.texto,
      };
    }),
    /** La tabla de la ficha: solo lo que aplica, por grupos. */
    specs: [...specsAgrupadas(m).entries()].map(([grupo, filas]) => ({
      grupo,
      grupoNombre: GRUPOS[grupo] ?? grupo,
      filas: filas.map(({ def, dato: d }) => ({ key: def.key, etiqueta: def.etiqueta, ...dato(def, d) })),
    })),
    /** Todas, incluidas las que no aplican: las usa el comparador. */
    comparador: Object.fromEntries(SPEC_DEFS.map((def) => [def.key, dato(def, m.specs[def.key])])),
    relacionadas: relacionadas(m).map((o) => o.slug),
    enAlquiler: ALQUILER.includes(m),
    busqueda: [m.marca, m.modelo, m.descripcionCorta, sub?.nombre ?? "", fam.nombre, ...m.aplicaciones]
      .join(" ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, ""),
  };
});
escribir("maquinas.json", maquinas);
escribir(
  "specdefs.json",
  SPEC_DEFS.map((d) => ({ key: d.key, etiqueta: d.etiqueta, grupo: d.grupo, grupoNombre: GRUPOS[d.grupo], mejor: d.mejor })),
);

/* ------------------------------------------------------------
   Familias y subcategorías, con su icono en SVG suelto
   ------------------------------------------------------------ */

const iconosUsados = new Set<IconoId>();
const familias = FAMILIAS.map((f) => {
  iconosUsados.add(f.icono);
  return {
    id: f.id,
    nombre: f.nombre,
    nombreLargo: f.nombreLargo,
    slug: f.slug,
    claim: f.claim,
    descripcion: f.descripcion,
    rango: f.rango,
    necesidad: f.necesidad,
    necesidadDesc: f.necesidadDesc,
    icono: f.icono,
    total: CATALOGO.filter((m) => m.familia === f.id).length,
    subcategorias: f.subcategorias.map((s) => {
      iconosUsados.add(s.icono);
      return {
        nombre: s.nombre,
        slug: s.slug,
        claim: s.claim,
        descripcion: s.descripcion,
        icono: s.icono,
        total: CATALOGO.filter((m) => m.subcategoriaSlug === s.slug).length,
      };
    }),
  };
});
escribir("familias.json", familias);

for (const id of iconosUsados) {
  const svg = renderToStaticMarkup(createElement(IconoMaquina, { icono: id }))
    .replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  writeFileSync(join(ICONOS, `maquina-${id}.svg`), svg + "\n", "utf8");
}
for (const tono of ["claro", "oscuro"] as const) {
  const svg = renderToStaticMarkup(createElement(Mapa, { tono }))
    .replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  writeFileSync(join(RAIZ, "recursos", `mapa-delegaciones-${tono}.svg`), svg + "\n", "utf8");
}

/* ------------------------------------------------------------
   Formación
   ------------------------------------------------------------ */

escribir(
  "cursos.json",
  TODOS_LOS_CURSOS.map((id, i) => ({
    ...CURSOS[id],
    orden: i,
    convocatoriaAbierta: (ORDEN_CURSOS as string[]).includes(id),
    grupo: (ORDEN_CURSOS as string[]).includes(id) ? "convocatoria" : "a-medida",
  })),
);
escribir("convocatorias.json", CONVOCATORIAS);
escribir("sedes-formacion.json", Object.values(SEDES_CURSO));
escribir("legislacion.json", LEGISLACION);
escribir("orden-cursos.json", { convocatoria: ORDEN_CURSOS, aMedida: ORDEN_A_MEDIDA });

/* ------------------------------------------------------------
   Empresa
   ------------------------------------------------------------ */

escribir("delegaciones.json", DELEGACIONES);
escribir("empresa.json", {
  empresa: EMPRESA,
  telefonoPrincipal: TELEFONO_PRINCIPAL,
  email: EMAIL_PRINCIPAL,
  redes: REDES,
  lema: LEMA,
  lemaEquipo: LEMA_EQUIPO,
  sedeFormacion: SEDE_FORMACION,
  puntosContacto: PUNTOS_CONTACTO,
  centros: CENTROS,
  certificaciones: CERTIFICACIONES,
  homologaciones: HOMOLOGACIONES,
  afiliaciones: AFILIACIONES,
  fabricantes: FABRICANTES_FLOTA,
  flota: FLOTA,
});
escribir("servicios.json", SERVICIOS);

console.log(
  `${maquinas.length} máquinas · ${familias.length} familias · ${iconosUsados.size} iconos · ` +
    `${TODOS_LOS_CURSOS.length} cursos · ${CONVOCATORIAS.length} convocatorias · ${DELEGACIONES.length} delegaciones`,
);
