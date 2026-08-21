import { ALQUILER, numeroDe } from "@/lib/catalog";
import type { FamiliaId, Maquina, TrabajoId } from "@/lib/catalog/types";

/* ============================================================
   ¿Qué máquina necesito?
   Tres preguntas, y la segunda cambia según la primera.

   La lógica es determinista y pura: las mismas respuestas dan siempre
   la misma lista. Y cada resultado explica POR QUÉ está ahí, en español
   llano, nunca con una puntuación desnuda.
   ============================================================ */

export interface Opcion {
  id: string;
  label: string;
  desc: string;
}

export const TRABAJOS: Opcion[] = [
  {
    id: "altura",
    label: "Trabajos en altura e instalaciones",
    desc: "Pintura, electricidad, climatización, cubiertas, fachadas o poda.",
  },
  {
    id: "cargas",
    label: "Mover y elevar cargas o palets",
    desc: "Descarga de camiones, estanterías de almacén, acopio en forjados.",
  },
  {
    id: "tierra",
    label: "Excavar, abrir zanjas o mover escombros",
    desc: "Canalizaciones, cimentaciones, urbanización y reformas.",
  },
  {
    id: "energia",
    label: "Suministro eléctrico o aire comprimido",
    desc: "Grupos electrógenos e iluminación para obras sin red.",
  },
];

/** La segunda pregunta depende de la primera. Ahí está la gracia. */
export const PARAMETROS: Record<string, Opcion[]> = {
  altura: [
    { id: "h-6", label: "Hasta 6 metros", desc: "Mantenimiento de techos bajos e iluminación interior." },
    { id: "h-10", label: "De 6 a 10 metros", desc: "Instalaciones industriales y almacenes." },
    { id: "h-16", label: "De 10 a 16 metros", desc: "Naves industriales y fachadas de tres o cuatro plantas." },
    { id: "h-28", label: "De 16 a 28 metros", desc: "Grandes estructuras y montajes en exterior." },
    { id: "h-max", label: "Más de 28 metros", desc: "Gran altura técnica o alcances horizontales extremos." },
    { id: "no-se", label: "No lo sé", desc: "Te enseñamos toda la gama y lo vemos por teléfono." },
  ],
  cargas: [
    { id: "c-1600", label: "Hasta 1.600 kg", desc: "Palets estándar de almacén e intralogística." },
    { id: "c-2500", label: "De 1.600 a 2.500 kg", desc: "Carga media en interior o exterior." },
    { id: "c-4000", label: "4.000 kg con elevación a 14-18 m", desc: "Acopio de material en altura en edificación." },
    { id: "c-giro", label: "Rotación 360º, para sustituir una grúa", desc: "Posicionamiento en todo el perímetro sin mover la máquina." },
    { id: "no-se", label: "No lo sé", desc: "Te enseñamos toda la gama y lo vemos por teléfono." },
  ],
  tierra: [
    { id: "t-zanja", label: "Zanjeo estrecho y accesos reducidos", desc: "Paso por puertas de jardín o aceras." },
    { id: "t-profundo", label: "Excavación profunda", desc: "Cimentaciones y saneamientos grandes." },
    { id: "t-mixta", label: "Máquina mixta con pala y retro", desc: "Obras de urbanización y carga de camiones." },
    { id: "t-transporte", label: "Transporte de tierra y hormigón", desc: "Desescombro ágil en espacios reducidos." },
    { id: "t-compactar", label: "Compactar el terreno", desc: "Zanjas, bases de árido y asfalto." },
    { id: "no-se", label: "No lo sé", desc: "Te enseñamos toda la gama y lo vemos por teléfono." },
  ],
  energia: [
    { id: "e-luz", label: "Iluminar de noche", desc: "Torres de focos LED para turnos nocturnos." },
    { id: "e-medio", label: "Generador medio, de 30 a 60 kVA", desc: "Herramienta eléctrica y casetas de obra." },
    { id: "e-grande", label: "Generador de alta potencia", desc: "Grandes grúas, bombeos y eventos." },
    { id: "e-aire", label: "Aire comprimido", desc: "Alimentación de martillos neumáticos pesados." },
    { id: "no-se", label: "No lo sé", desc: "Te enseñamos toda la gama y lo vemos por teléfono." },
  ],
};

export const ENTORNOS: Opcion[] = [
  {
    id: "interior-limpio",
    label: "Interior cerrado, sin humos",
    desc: "Naves en activo, centros comerciales, hospitales o almacenes.",
  },
  {
    id: "exterior-obra",
    label: "Exterior con terreno irregular o barro",
    desc: "Obra abierta, zanjas y pendientes. Hace falta tracción.",
  },
  {
    id: "acceso-estrecho",
    label: "Paso por puertas estrechas o forjados delicados",
    desc: "Espacios angostos, iglesias o reformas en casco urbano.",
  },
  {
    id: "mixto",
    label: "Entorno mixto o con desplazamientos constantes",
    desc: "Uso en interior y exterior o intervenciones en vía pública.",
  },
  { id: "no-se", label: "No lo sé", desc: "No descartamos nada por este motivo." },
];

export interface Respuestas {
  trabajo: string;
  parametro: string;
  entorno: string;
}

export interface Recomendacion {
  maquina: Maquina;
  puntos: number;
  razones: string[];
}

export interface Resultado {
  recomendadas: Recomendacion[];
  alternativas: Recomendacion[];
  /** Enlace al catálogo con el filtro equivalente ya aplicado. */
  enlaceCatalogo: string;
  /** true si hubo que relajar la altura para no dejar al usuario sin nada. */
  relajado: boolean;
}

/* ---------- rangos de la segunda pregunta ---------- */

const RANGO_ALTURA: Record<string, [number, number]> = {
  "h-6": [0, 6],
  "h-10": [6, 10],
  "h-16": [10, 16],
  "h-28": [16, 28],
  "h-max": [28, 999],
};

const CARGA_MIN: Record<string, number> = {
  "c-1600": 0,
  "c-2500": 1600,
  "c-4000": 3500,
};

/** Familias que responden a cada trabajo, con su grado de encaje. */
const FAMILIAS_POR_TRABAJO: Record<
  string,
  { preferidas: FamiliaId[]; aceptables: FamiliaId[] }
> = {
  altura: { preferidas: ["elevacion"], aceptables: ["manipulacion"] },
  cargas: { preferidas: ["manipulacion"], aceptables: ["movimiento-tierras"] },
  tierra: {
    preferidas: ["movimiento-tierras", "compactacion"],
    aceptables: ["manipulacion", "herramienta-auxiliar"],
  },
  energia: {
    preferidas: ["energia", "aire-martillos"],
    aceptables: ["herramienta-auxiliar"],
  },
};

const SUBCAT_PARAMETRO: Record<string, string[]> = {
  "c-giro": ["manipuladores-telescopicos-giratorios"],
  "t-zanja": ["miniexcavadoras"],
  "t-profundo": ["miniexcavadoras", "retrocargadoras"],
  "t-mixta": ["retrocargadoras", "minicargadoras"],
  "t-transporte": ["dumpers-4x4"],
  "t-compactar": ["rodillos", "pisones", "bandejas-vibrantes"],
  "e-luz": ["torres-iluminacion"],
  "e-medio": ["grupos-electrogenos"],
  "e-grande": ["grupos-electrogenos"],
  "e-aire": ["compresores-portatiles", "martillos-neumaticos"],
};

/* ---------- el motor ---------- */

function evaluar(
  m: Maquina,
  r: Respuestas,
  rango: [number, number] | null,
): Recomendacion | null {
  const razones: string[] = [];
  let puntos = 0;

  /* --- eliminatorios --- */
  const mapa = FAMILIAS_POR_TRABAJO[r.trabajo];
  if (!mapa) return null;
  const preferida = mapa.preferidas.includes(m.familia);
  const aceptable = mapa.aceptables.includes(m.familia);
  if (!preferida && !aceptable) return null;

  if (rango) {
    const h = numeroDe(m.specs.alturaTrabajo);
    // Sin altura confirmada no la recomendamos a ciegas.
    if (h == null) return null;
    if (h < rango[0] || h > rango[1]) return null;
  }

  const cargaMin = CARGA_MIN[r.parametro];
  if (cargaMin != null) {
    const c = numeroDe(m.specs.capacidadCarga);
    if (c == null || c < cargaMin) return null;
  }

  if (r.entorno === "interior-limpio") {
    if (!m.facetas.entornos.includes("interior")) return null;
    if (m.facetas.energia === "diesel") return null;
  }
  if (r.entorno === "exterior-obra") {
    if (m.facetas.traccion !== "4x4" && m.facetas.traccion !== "oruga")
      return null;
  }

  /* --- puntuación --- */
  if (preferida) {
    puntos += 40;
    razones.push("Es el tipo de máquina habitual para este trabajo");
  } else {
    puntos += 18;
  }

  const subcats = SUBCAT_PARAMETRO[r.parametro];
  if (subcats) {
    if (subcats.includes(m.subcategoriaSlug)) {
      puntos += 30;
      razones.push("Encaja exactamente con lo que has descrito");
    } else {
      puntos -= 10;
    }
  }

  // Sobredimensionar cuesta dinero y a veces no cabe.
  if (rango && rango[1] < 900) {
    const h = numeroDe(m.specs.alturaTrabajo)!;
    const holgura = h / Math.max(rango[0], 1);
    if (h >= rango[0] && h <= rango[1]) {
      puntos += 22;
      // Coma decimal: "7,6 m", no "7.6 m". Es texto para un cliente
      // español, no una cifra de depuración.
      razones.push(
        `Llega a los ${h.toLocaleString("es-ES", { maximumFractionDigits: 2 })} m que necesitas`,
      );
    }
    if (holgura > 2) {
      puntos -= 8;
      razones.push("Más máquina de la necesaria: sube el coste del alquiler");
    }
  }

  if (r.entorno === "interior-limpio" && m.facetas.energia === "electrico") {
    puntos += 16;
    razones.push("Eléctrica: sin humos ni ruido en interior");
  }
  if (r.entorno === "exterior-obra" && m.facetas.traccion === "4x4") {
    puntos += 14;
    razones.push("Tracción 4x4 para terreno irregular");
  }
  if (r.entorno === "acceso-estrecho") {
    const ancho = numeroDe(m.specs.anchoTransporte);
    if (ancho != null && ancho <= 1000) {
      puntos += 20;
      razones.push(`Solo ${(ancho / 1000).toFixed(2).replace(".", ",")} m de ancho: pasa por puertas`);
    } else if (ancho != null && ancho > 1800) {
      puntos -= 14;
    }
    if (m.subcategoriaSlug === "plataformas-sobre-oruga") {
      puntos += 18;
      razones.push("Sobre orugas: reparte el peso en forjados delicados");
    }
  }
  if (r.entorno === "mixto" && m.facetas.energia === "hibrido") {
    puntos += 16;
    razones.push("Híbrida: sirve dentro y fuera sin cambiar de máquina");
  }

  if (m.destacada) puntos += 5;
  // Un dato confirmado en ficha vale más que uno de catálogo.
  if (m.specs.alturaTrabajo?.estado === "confirmado") puntos += 4;

  return { maquina: m, puntos, razones: razones.slice(0, 3) };
}

function filtrosEquivalentes(r: Respuestas): string {
  const p = new URLSearchParams();
  const mapa = FAMILIAS_POR_TRABAJO[r.trabajo];
  if (mapa?.preferidas[0]) p.set("fam", mapa.preferidas[0]);
  const rango = RANGO_ALTURA[r.parametro];
  if (rango) {
    if (rango[0] > 0) p.set("hmin", String(rango[0]));
    if (rango[1] < 900) p.set("hmax", String(rango[1]));
  }
  if (r.entorno === "interior-limpio") {
    p.set("energia", "electrico");
    p.set("uso", "interior");
  }
  return `/alquiler${p.size ? `?${p}` : ""}`;
}

export function recomendar(r: Respuestas): Resultado {
  const rangoBase = RANGO_ALTURA[r.parametro] ?? null;

  const evaluarCon = (rango: [number, number] | null) =>
    ALQUILER.map((m) => evaluar(m, r, rango))
      .filter((x): x is Recomendacion => x !== null)
      .sort(
        (a, b) =>
          b.puntos - a.puntos ||
          (numeroDe(a.maquina.specs.alturaTrabajo) ?? 0) -
            (numeroDe(b.maquina.specs.alturaTrabajo) ?? 0) ||
          a.maquina.modelo.localeCompare(b.maquina.modelo, "es"),
      );

  let evaluadas = evaluarCon(rangoBase);
  let relajado = false;

  // Nunca un callejón sin salida: si nada encaja, se ensancha el tramo.
  if (evaluadas.length === 0 && rangoBase) {
    const ancho: [number, number] = [
      Math.max(0, rangoBase[0] * 0.6),
      rangoBase[1] * 1.8,
    ];
    evaluadas = evaluarCon(ancho);
    relajado = evaluadas.length > 0;
  }
  if (evaluadas.length === 0) {
    evaluadas = evaluarCon(null);
    relajado = evaluadas.length > 0;
  }

  /* El umbral es relativo, no fijo.
   *
   * Con un fijo en 55 puntos pasaba algo tonto: si el usuario contesta
   * "No lo sé" a las dos preguntas concretas, nadie sumaba lo suficiente
   * y la lista de recomendadas salía vacía teniendo alternativas de sobra.
   * Con un umbral relativo al mejor candidato, si hay algo que encaja se
   * enseña, y si no hay nada bueno tampoco se infla la lista. */
  const mejor = evaluadas[0]?.puntos ?? 0;
  const umbral = Math.max(40, mejor - 20);

  return {
    recomendadas: evaluadas.filter((e) => e.puntos >= umbral).slice(0, 6),
    alternativas: evaluadas
      .filter((e) => e.puntos < umbral && e.puntos >= 25)
      .slice(0, 4),
    enlaceCatalogo: filtrosEquivalentes(r),
    relajado,
  };
}

/** Resumen legible de las respuestas, para meterlo en el formulario. */
export function resumenRespuestas(r: Respuestas): string {
  const t = TRABAJOS.find((x) => x.id === r.trabajo)?.label ?? r.trabajo;
  const p =
    PARAMETROS[r.trabajo]?.find((x) => x.id === r.parametro)?.label ??
    r.parametro;
  const e = ENTORNOS.find((x) => x.id === r.entorno)?.label ?? r.entorno;
  return `Trabajo: ${t} · Requisito: ${p} · Entorno: ${e}`;
}

export type { TrabajoId };
