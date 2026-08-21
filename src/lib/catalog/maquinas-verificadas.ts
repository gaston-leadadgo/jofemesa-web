import type { Maquina } from "./types";
import { conf, est, pend, na } from "./types";

/**
 * Máquinas cuyas especificaciones están transcritas de la ficha técnica
 * real que JOFEMESA sirve en su propio servidor. Todo lo marcado como
 * `conf(..., "ficha-pdf")` se ha leído literalmente en ese PDF.
 *
 * Lo que la ficha no dice queda en `pend()`. No se completa por analogía
 * con el modelo hermano, aunque sea tentador: una altura de trabajo mal
 * puesta en una web de alquiler es un problema comercial, no un bug.
 */

const TODAS_DELEGACIONES = [
  "madrid",
  "asturias",
  "valencia",
  "castellon",
  "malaga",
  "sevilla",
  "valladolid",
  "alicante",
] as const;

export const MAQUINAS_VERIFICADAS: Maquina[] = [
  /* ============================================================
     Genie GS-2668RT / GS-3268RT — tijeras diésel todoterreno
     Ficha: /fichas/genie-gs-2668-3268rt.pdf (Ref B109350 SP)
     ============================================================ */
  {
    id: "genie-gs-2668rt",
    slug: "genie-gs-2668rt",
    marca: "Genie",
    modelo: "GS-2668 RT",
    familia: "elevacion",
    subcategoriaSlug: "tijeras-diesel",
    lineas: ["alquiler"],
    destacada: true,
    orden: 305,
    facetas: {
      energia: "diesel",
      entornos: ["exterior"],
      traccion: "4x4",
      requiereFormacion: true,
    },
    delegaciones: [...TODAS_DELEGACIONES],
    specs: {
      alturaTrabajo: conf(9.92, "ficha-pdf"),
      capacidadCarga: conf(567, "ficha-pdf"),
      dimensionesPlataforma: conf("2,51 × 1,55 m (3,61 m extendida)", "ficha-pdf"),
      anchoTransporte: conf(1730, "ficha-pdf"),
      alturaTransporte: conf(1190, "ficha-pdf"),
      longitudTransporte: conf(2670, "ficha-pdf"),
      peso: conf(3263, "ficha-pdf"),
      pendienteSuperable: conf("35 %", "ficha-pdf"),
      velocidadTraslacion: conf("6,1 km/h replegada", "ficha-pdf"),
      traccion: conf("4x4", "ficha-pdf"),
      potencia: conf("Kubota D-1105 diésel, 24,9 CV", "ficha-pdf"),
      alcanceHorizontal: na(),
      autonomia: pend("Depende del ciclo de trabajo. Depósito de 56,8 L."),
    },
    descripcionCorta:
      "Tijera diésel todoterreno con tracción a las cuatro ruedas y plataforma extensible. Para trabajar en fachada o estructura cuando el suelo es de obra y hay pendiente que salvar.",
    aplicaciones: [
      "Fachadas sobre terreno irregular",
      "Montaje de estructura en obra",
      "Mantenimiento de naves en exterior",
    ],
    destacados: [
      "Tracción 4x4 y dirección a las cuatro ruedas",
      "Supera pendientes del 35 %",
      "Cuatro personas en plataforma",
    ],
    imagenes: [],
    fichaTecnica: { src: "/fichas/genie-gs-2668-3268rt.pdf", bytes: 762848 },
    trabajos: ["altura"],
    notaAsesor:
      "Si el suelo está liso y hay corriente, una tijera eléctrica sale más barata y no mancha.",
  },
  {
    id: "genie-gs-3268rt",
    slug: "genie-gs-3268rt",
    marca: "Genie",
    modelo: "GS-3268 RT",
    familia: "elevacion",
    subcategoriaSlug: "tijeras-diesel",
    lineas: ["alquiler"],
    destacada: true,
    orden: 315,
    facetas: {
      energia: "diesel",
      entornos: ["exterior"],
      traccion: "4x4",
      requiereFormacion: true,
    },
    delegaciones: [...TODAS_DELEGACIONES],
    specs: {
      alturaTrabajo: conf(11.75, "ficha-pdf"),
      capacidadCarga: conf(454, "ficha-pdf"),
      dimensionesPlataforma: conf("2,51 × 1,55 m (3,61 m extendida)", "ficha-pdf"),
      anchoTransporte: conf(1730, "ficha-pdf"),
      alturaTransporte: conf(1310, "ficha-pdf"),
      longitudTransporte: conf(2670, "ficha-pdf"),
      peso: conf(3771, "ficha-pdf"),
      pendienteSuperable: conf("30 %", "ficha-pdf"),
      velocidadTraslacion: conf("6,1 km/h replegada", "ficha-pdf"),
      traccion: conf("4x4", "ficha-pdf"),
      potencia: conf("Kubota D-1105 diésel, 24,9 CV", "ficha-pdf"),
      alcanceHorizontal: na(),
      autonomia: pend("Depende del ciclo de trabajo. Depósito de 56,8 L."),
    },
    descripcionCorta:
      "La hermana mayor de la GS-2668: casi doce metros de altura de trabajo con la misma plataforma extensible y tracción 4x4. Cuando la fachada sube y el terreno no ayuda.",
    aplicaciones: [
      "Fachadas de tres y cuatro plantas",
      "Naves industriales en construcción",
      "Montaje de cubierta",
    ],
    destacados: [
      "11,75 m de altura de trabajo",
      "Plataforma extensible 1,10 m",
      "Solo 1,73 m de anchura",
    ],
    imagenes: [],
    fichaTecnica: { src: "/fichas/genie-gs-2668-3268rt.pdf", bytes: 762848 },
    trabajos: ["altura"],
    notaAsesor:
      "Mide la puerta de acceso antes de pedirla: entra por 1,73 m, no por menos.",
  },

  /* ============================================================
     Haulotte H12 SX / H15 SX / H18 SX — tijeras todoterreno
     Ficha: /fichas/haulotte-h-sx.pdf (Ed. 07/2007)
     La ficha da la altura por modelo y la plataforma, la capacidad y
     la pendiente como valores de gama. El resto queda pendiente.
     ============================================================ */
  {
    id: "haulotte-h12sx",
    slug: "haulotte-h-12-sx",
    marca: "Haulotte",
    modelo: "H 12 SX",
    familia: "elevacion",
    subcategoriaSlug: "tijeras-diesel",
    lineas: ["alquiler"],
    destacada: false,
    orden: 320,
    facetas: {
      energia: "diesel",
      entornos: ["exterior"],
      traccion: "4x4",
      requiereFormacion: true,
    },
    delegaciones: [...TODAS_DELEGACIONES],
    specs: {
      alturaTrabajo: conf(12, "ficha-pdf"),
      dimensionesPlataforma: conf("6,00 × 1,80 m con doble extensión", "ficha-pdf"),
      capacidadCarga: est(
        900,
        "ficha-pdf",
        "La ficha da 900 kg como máximo de la gama H SX, no por modelo. A confirmar con la unidad.",
      ),
      pendienteSuperable: conf("40 %", "ficha-pdf"),
      traccion: conf("4x4", "ficha-pdf"),
      anchoTransporte: pend("La ficha no publica la anchura total."),
      alturaTransporte: pend(),
      longitudTransporte: pend(),
      peso: pend("Relevante para el transporte: confirmar antes de publicar."),
      alcanceHorizontal: na(),
    },
    descripcionCorta:
      "Tijera todoterreno con una plataforma de seis metros de largo: la opción cuando hay que subir material y personas a la vez y el tajo es ancho.",
    aplicaciones: [
      "Cerramientos y paneles de fachada",
      "Naves industriales",
      "Montaje de instalaciones en cubierta",
    ],
    destacados: [
      "Plataforma de 6 m con doble extensión",
      "Cuatro ruedas motrices de serie",
      "Supera pendientes del 40 %",
    ],
    imagenes: [],
    fichaTecnica: { src: "/fichas/haulotte-h-sx.pdf", bytes: 873869 },
    trabajos: ["altura"],
    notaAsesor:
      "Es la más ancha de la gama: si el acceso es justo, mira la Genie GS-3268 RT.",
  },
  {
    id: "haulotte-h15sx",
    slug: "haulotte-h-15-sx",
    marca: "Haulotte",
    modelo: "H 15 SX",
    familia: "elevacion",
    subcategoriaSlug: "tijeras-diesel",
    lineas: ["alquiler"],
    destacada: false,
    orden: 330,
    facetas: {
      energia: "diesel",
      entornos: ["exterior"],
      traccion: "4x4",
      requiereFormacion: true,
    },
    delegaciones: [...TODAS_DELEGACIONES],
    specs: {
      alturaTrabajo: conf(15, "ficha-pdf"),
      dimensionesPlataforma: conf("6,00 × 1,80 m con doble extensión", "ficha-pdf"),
      capacidadCarga: est(
        900,
        "ficha-pdf",
        "Máximo de la gama H SX, no por modelo. A confirmar con la unidad.",
      ),
      pendienteSuperable: conf("40 %", "ficha-pdf"),
      traccion: conf("4x4", "ficha-pdf"),
      anchoTransporte: pend("La ficha no publica la anchura total."),
      alturaTransporte: pend(),
      longitudTransporte: pend(),
      peso: pend("Relevante para el transporte: confirmar antes de publicar."),
      alcanceHorizontal: na(),
    },
    descripcionCorta:
      "Quince metros de altura con plataforma de seis metros. Para obra abierta donde hace falta superficie de trabajo y no solo alcance.",
    aplicaciones: [
      "Estructura metálica",
      "Fachadas de cuatro y cinco plantas",
      "Mantenimiento industrial en exterior",
    ],
    destacados: [
      "15 m de altura de trabajo",
      "Plataforma de 6 m",
      "Tracción integral",
    ],
    imagenes: [],
    fichaTecnica: { src: "/fichas/haulotte-h-sx.pdf", bytes: 873869 },
    trabajos: ["altura"],
  },
  {
    id: "haulotte-h18sx",
    slug: "haulotte-h-18-sx",
    marca: "Haulotte",
    modelo: "H 18 SX",
    familia: "elevacion",
    subcategoriaSlug: "tijeras-diesel",
    lineas: ["alquiler"],
    destacada: true,
    orden: 340,
    facetas: {
      energia: "diesel",
      entornos: ["exterior"],
      traccion: "4x4",
      requiereFormacion: true,
    },
    delegaciones: [...TODAS_DELEGACIONES],
    specs: {
      alturaTrabajo: conf(18, "ficha-pdf"),
      dimensionesPlataforma: conf("6,00 × 1,80 m con doble extensión", "ficha-pdf"),
      capacidadCarga: est(
        900,
        "ficha-pdf",
        "Máximo de la gama H SX, no por modelo. A confirmar con la unidad.",
      ),
      pendienteSuperable: conf("40 %", "ficha-pdf"),
      traccion: conf("4x4", "ficha-pdf"),
      anchoTransporte: pend("La ficha no publica la anchura total."),
      alturaTransporte: pend(),
      longitudTransporte: pend(),
      peso: pend("Relevante para el transporte: confirmar antes de publicar."),
      alcanceHorizontal: na(),
    },
    descripcionCorta:
      "La tijera más alta de la gama H SX: dieciocho metros con una plataforma de seis. Cuando ni una tijera normal llega ni un brazo articulado da la superficie que necesitas.",
    aplicaciones: [
      "Grandes naves logísticas",
      "Montaje de cubierta industrial",
      "Rehabilitación de fachada alta",
    ],
    destacados: [
      "18 m de altura de trabajo",
      "Plataforma de 6 m con doble extensión",
      "Supera pendientes del 40 %",
    ],
    imagenes: [],
    fichaTecnica: { src: "/fichas/haulotte-h-sx.pdf", bytes: 873869 },
    trabajos: ["altura"],
    notaAsesor:
      "A 18 m y con plataforma de 6 m, comprueba el peso admisible del forjado antes de subirla.",
  },
];
