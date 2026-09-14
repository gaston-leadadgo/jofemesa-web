import type { IconoId } from "@/lib/catalog/types";

/**
 * Servicios.
 *
 * La reunión del 24/08/2026 cerró esto con nombre y orden: «venta,
 * mantenimiento, esto va todo en la pestaña de servicios», y dentro,
 * «dejar venta lo primero, mantenimiento y luego transporte». La
 * formación se nombra pero no se desarrolla: «dejamos la formación, la
 * nombramos aunque no la desarrollemos».
 *
 * Y una petición explícita que aquí es estructura, no adorno: «lo que
 * sí que añadiría es un call to action en cada sección». Cada bloque
 * lleva el suyo, y todos terminan en el mismo formulario.
 *
 * Los textos de venta se han reescrito: el titular anterior («la otra
 * mitad del negocio») no describía el servicio, y la lista de producto
 * incluía cosas que el cliente no vende. Aquí solo está lo que sí
 * publican ellos: carretillas contrapesadas y de almacén, nuevas y
 * reacondicionadas, y recambios de cualquier marca.
 */

export interface BloqueServicio {
  id: string;
  /** Etiqueta de sección, en versalitas. */
  epigrafe: string;
  titulo: string;
  /** Una línea para la tarjeta del índice. La promesa, no el catálogo. */
  resumen: string;
  entradilla: string;
  puntos: string[];
  cta: { texto: string; href: string };
  icono: IconoId;
  /** Credencial que se enseña dentro del bloque, si la hay. */
  credencial?: {
    logo: string;
    alto: number;
    ancho: number;
    alt: string;
    texto: string;
  };
}

export const SERVICIOS: readonly BloqueServicio[] = [
  {
    id: "venta",
    epigrafe: "Venta de maquinaria y recambios",
    titulo: "También vendemos la máquina, no solo la alquilamos",
    resumen:
      "Carretillas nuevas y reacondicionadas, y recambios de cualquier marca.",
    entradilla:
      "Carretillas elevadoras contrapesadas y de almacén, nuevas y reacondicionadas. Y recambios originales para maquinaria de cualquier marca, no solo de la que vendemos.",
    puntos: [
      "Carretillas contrapesadas y de almacén, nuevas y reacondicionadas",
      "Recambios para maquinaria nueva y reacondicionada de cualquier marca",
      "Asesoramiento sobre compra o alquiler según el uso real que le vayas a dar",
    ],
    cta: { texto: "Pedir presupuesto de venta", href: "/consultar-disponibilidad?asunto=venta" },
    icono: "carretilla",
    credencial: {
      logo: "/marca/jungheinrich.webp",
      ancho: 840,
      alto: 124,
      alt: "Partner oficial de Jungheinrich",
      texto:
        "Somos partner oficial de Jungheinrich y distribuimos todo su catálogo: contrapesadas eléctricas y diésel, mástil retráctil, trilaterales EKX y EFX, preparadoras de pedidos, transpaletas, apiladores y tractores de arrastre. También su gama reacondicionada JUNGSTARS.",
    },
  },
  {
    id: "mantenimiento",
    epigrafe: "Mantenimiento y taller propio",
    titulo: "Servicio técnico propio y asistencia móvil",
    resumen:
      "Mecánicos propios y furgones taller que se desplazan al tajo.",
    entradilla:
      "Cada equipo pasa una revisión técnica antes de cada salida. Si durante el trabajo surge una incidencia, nuestros furgones taller se desplazan al tajo para resolverla. También mantenemos la máquina que no has alquilado con nosotros.",
    puntos: [
      "Mecánicos propios formados por los fabricantes de nuestra flota",
      "Furgones taller equipados para diagnóstico hidráulico y eléctrico",
      "Mantenimiento preventivo programado, con histórico de cada intervención",
      "Reparación de carretillas, palas, retroexcavadoras y plataformas de cualquier marca",
    ],
    cta: { texto: "Solicitar una intervención", href: "/consultar-disponibilidad?asunto=mantenimiento" },
    icono: "herramienta",
  },
  {
    id: "transporte",
    epigrafe: "Logística directa",
    titulo: "Transporte y entrega coordinada en obra",
    resumen:
      "Camiones propios y entrega en la franja horaria que acordemos.",
    entradilla:
      "Flota de camiones propia con rampas, góndolas rebajadas y camiones pluma. Coordinamos la entrega en la franja horaria acordada para que tus operarios tengan la máquina desde el primer minuto.",
    puntos: [
      "Descarga por conductores especializados en maquinaria pesada",
      "Puesta en marcha básica y comprobación de mandos en la entrega",
      "Retirada coordinada en cuanto termina el periodo de alquiler",
      "Rutas propias entre delegaciones de España y Portugal",
    ],
    cta: { texto: "Consultar transporte y plazo", href: "/consultar-disponibilidad?asunto=transporte" },
    icono: "camion",
  },
  {
    id: "formacion",
    epigrafe: "Formación de operadores",
    titulo: "Centro de formación homologado",
    resumen:
      "Centro homologado IPAF y AENOR para operadores de PEMP y carretillas.",
    entradilla:
      "Somos centro de formación homologado IPAF y contamos con los certificados de AENOR de formación de operadores de plataformas (UNE 58923) y de carretillas (UNE 58451). Tenemos central de formación propia en San Fernando de Henares.",
    puntos: [
      "Carné IPAF (PAL), reconocido en más de 65 países",
      "Certificación AENOR UNE 58923 para operadores de PEMP",
      "Certificación AENOR UNE 58451 para operadores de carretillas",
    ],
    cta: { texto: "Consultar convocatorias", href: "/consultar-disponibilidad?asunto=formacion" },
    icono: "columna",
  },
] as const;

/**
 * Lo que todavía NO se cuenta de formación. Está en el acta: la
 * pestaña se nombra y no se desarrolla hasta definir el contenido con
 * el cliente. La página lo dice con estas palabras en vez de rellenar
 * con un catálogo de cursos que no está confirmado.
 */
export const FORMACION_PENDIENTE =
  "El calendario de convocatorias, el catálogo de cursos y la gestión de la bonificación de FUNDAE están en preparación. Mientras tanto, llámanos o escríbenos y te contamos las fechas disponibles.";
