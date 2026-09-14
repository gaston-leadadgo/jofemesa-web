import type { Familia, FamiliaId } from "./types";

/**
 * Taxonomía de dos niveles: familia → subcategoría.
 *
 * Es exactamente la del CATÁLOGO GENERAL DE MAQUINARIA JOFEMESA, con dos
 * consecuencias importantes:
 *
 *   1. Excavación, movimiento de tierras y compactación son UNA familia,
 *      con seis subcategorías, tal y como pidió el cliente en el guion
 *      «ORDEN DE MAQUINARIA RESPECTO AL HOME ENVIADO» (punto 2.2):
 *      retroexcavadoras, retrocargadoras/mixtas, minicargadoras, dúmper,
 *      rodillos, y pisones y bandejas.
 *   2. Las subcategorías de elevación separan alimentación (eléctrico,
 *      híbrido, diésel) porque es así como está dividido su catálogo y
 *      es la primera decisión real de quien alquila: si puede entrar en
 *      interior o no.
 *
 * Los claims están escritos en clave de trabajo, no de producto: quien
 * busca no piensa «necesito una plataforma articulada eléctrica», piensa
 * «tengo que llegar a una luminaria de una nave en activo».
 */
export const FAMILIAS: readonly Familia[] = [
  {
    id: "elevacion",
    nombre: "Elevación",
    nombreLargo: "Plataformas elevadoras móviles de personal",
    slug: "elevacion",
    claim:
      "Maquinaria para trabajar en altura con la solución adecuada bajo tus pies",
    descripcion:
      "Desde trabajos interiores en espacios estrechos hasta intervenciones a grandes alturas. Elige el equipo según alcance, entorno, terreno y condiciones del proyecto.",
    rango: "Desde 4,5 m hasta 57 m",
    necesidad: "Trabajos en altura",
    necesidadDesc:
      "Equipos para llegar donde el trabajo te necesita, desde espacios reducidos hasta grandes alturas.",
    icono: "tijera",
    subcategorias: [
      {
        nombre: "Columnas verticales",
        slug: "columnas-verticales",
        claim: "Cuando hay poco espacio, cada centímetro cuenta.",
        descripcion:
          "Mástiles verticales para trabajos en altura donde la maniobrabilidad y unas dimensiones contenidas resultan especialmente importantes. Ideales para interiores, mantenimiento y logística.",
        icono: "columna",
      },
      {
        nombre: "Tijeras eléctricas",
        slug: "tijeras-electricas",
        claim: "Subir recto. Trabajar cómodo. Complicar poco.",
        descripcion:
          "Plataformas para trabajos en altura donde se necesita una superficie estable, movilidad vertical y funcionamiento eléctrico, especialmente útil en interiores y superficies adecuadas sin emisiones.",
        icono: "tijera",
      },
      {
        nombre: "Brazos articulados eléctricos",
        slug: "brazos-articulados-electricos",
        claim: "Porque el punto de trabajo no siempre está justo encima.",
        descripcion:
          "Su geometría articulada permite alcanzar posiciones elevadas salvando obstáculos e instalaciones aéreas, con funcionamiento silencioso y sin emisiones.",
        icono: "brazo",
      },
      {
        nombre: "Tijeras híbridas",
        slug: "tijeras-hibridas",
        claim:
          "Un proyecto puede cambiar de entorno. Tu máquina también debería poder hacerlo.",
        descripcion:
          "Combinan alimentación eléctrica y motor de apoyo para trabajar dentro y fuera sin cambiar de equipo, con capacidades de carga de plataforma muy altas.",
        icono: "tijera",
      },
      {
        nombre: "Brazos articulados híbridos",
        slug: "brazos-articulados-hibridos",
        claim:
          "Más flexibilidad para trabajos que no vienen con un único escenario.",
        descripcion:
          "Alcance articulado con doble alimentación, para proyectos con requisitos variados de emisiones, ruido y autonomía.",
        icono: "brazo",
      },
      {
        nombre: "Tijeras diésel",
        slug: "tijeras-diesel",
        claim:
          "Cuando la obra se pone seria, necesitas una máquina preparada para seguirla.",
        descripcion:
          "Equipos pensados para trabajos exteriores que requieren capacidad de carga ampliada, gran autonomía y tracción 4x4 para responder en terrenos de obra complejos.",
        icono: "tijera",
      },
      {
        nombre: "Brazos articulados diésel",
        slug: "brazos-articulados-diesel",
        claim: "Altura, alcance y terreno. Todo cuenta.",
        descripcion:
          "Equipos articulados preparados para acceder a zonas elevadas y salvar obstáculos en trabajos exteriores y obras con terrenos difíciles y pendientes pronunciadas.",
        icono: "brazo",
      },
      {
        nombre: "Brazos telescópicos diésel",
        slug: "brazos-telescopicos-diesel",
        claim: "Cuando el trabajo está lejos, el alcance deja de ser un detalle.",
        descripcion:
          "Equipos diseñados para alcanzar grandes alturas y distancias horizontales directas. Rapidez de posicionamiento para montajes industriales, fachadas y grandes infraestructuras.",
        icono: "telescopica",
      },
      {
        nombre: "Plataformas sobre orugas",
        slug: "plataformas-sobre-orugas",
        claim: "El acceso difícil no debería significar trabajo imposible.",
        descripcion:
          "Equipos tipo araña para situaciones donde puertas estrechas, forjados delicados o pendientes pronunciadas descartan una plataforma convencional.",
        icono: "oruga",
      },
      {
        nombre: "Plataformas sobre camión",
        slug: "plataformas-sobre-camion",
        claim: "Llegar, elevar y seguir al siguiente punto.",
        descripcion:
          "Combinan movilidad por carretera y capacidad de elevación inmediata con estabilizadores. Óptimas cuando hay que intervenir en varias ubicaciones el mismo día.",
        icono: "camion",
      },
    ],
  },
  {
    id: "manipulacion",
    nombre: "Manutención de cargas",
    nombreLargo: "Manutención y manipulación de cargas",
    slug: "manutencion",
    claim: "Mover más. Maniobrar mejor. Trabajar con menos complicaciones.",
    descripcion:
      "Equipos para elevar, transportar y posicionar cargas según el peso, la altura, el terreno y el espacio disponible. Para logística, eventos, construcción e industria.",
    rango: "Hasta 7.000 kg y 21 m",
    necesidad: "Mover y elevar cargas",
    necesidadDesc:
      "Carretillas y manipuladores para transportar, elevar y posicionar cargas con mayor eficacia.",
    icono: "manipulador",
    subcategorias: [
      {
        nombre: "Manipuladores telescópicos rígidos",
        slug: "manipuladores-telescopicos-rigidos",
        claim: "Alcance y capacidad directa en obra.",
        descripcion:
          "Todo terreno, para elevar cargas pesadas a alturas de hasta 18 metros con máxima estabilidad frontal.",
        icono: "manipulador",
      },
      {
        nombre: "Manipuladores telescópicos giratorios",
        slug: "manipuladores-telescopicos-giratorios",
        claim: "Versatilidad 360º para sustituir grúas ligeras.",
        descripcion:
          "Torreta giratoria continua para descargar y posicionar materiales en todo el perímetro sin mover la máquina.",
        icono: "giratorio",
      },
      {
        nombre: "Carretillas contrapesadas eléctricas",
        slug: "carretillas-contrapesadas-electricas",
        claim: "Eficiencia y cero emisiones en almacén.",
        descripcion:
          "Frontales de tres y cuatro ruedas, silenciosas, ágiles y compactas para carga y descarga en interiores.",
        icono: "carretilla",
      },
      {
        nombre: "Carretillas contrapesadas diésel",
        slug: "carretillas-contrapesadas-diesel",
        claim: "Potencia constante para exteriores y patios logísticos.",
        descripcion:
          "Frontales de cuatro ruedas con gran resistencia mecánica para ciclos intensivos de carga y descarga.",
        icono: "carretilla",
      },
      {
        nombre: "Carretillas todoterreno",
        slug: "carretillas-todoterreno",
        claim: "Tracción total en terrenos irregulares.",
        descripcion:
          "Neumáticos de gran diámetro y tracción 4x4 para mover materiales en terrenos sin pavimentar y pendientes.",
        icono: "todoterreno",
      },
      {
        nombre: "Máquinas de almacén",
        slug: "maquinas-almacen",
        claim: "El movimiento diario del almacén, sin esfuerzo.",
        descripcion:
          "Transpaletas, apiladores y preparadoras de pedidos eléctricas para el trasiego de palets y el trabajo en estanterías.",
        icono: "almacen",
      },
    ],
  },
  {
    id: "movimiento-tierras",
    nombre: "Excavación y movimiento de tierras",
    nombreLargo: "Excavación, movimiento de tierras y compactación",
    slug: "movimiento-tierras",
    claim:
      "Primero hay que mover tierra. Luego ya hablamos de construir encima.",
    descripcion:
      "Equipos para excavar, cargar, transportar, preparar el terreno y compactarlo, con soluciones adaptadas al espacio disponible y a las características de cada obra.",
    rango: "De 1,2 a 19 toneladas",
    necesidad: "Excavar, mover tierra y compactar",
    necesidadDesc:
      "Equipos para excavar, cargar, desplazar, preparar el terreno y compactarlo.",
    icono: "excavadora",
    subcategorias: [
      {
        nombre: "Retroexcavadoras",
        slug: "retroexcavadoras",
        claim: "Precisión y fuerza en espacios reducidos.",
        descripcion:
          "Doce modelos Takeuchi desde 1,2 hasta 16,3 toneladas para zanjeo, cimentaciones y canalizaciones, con cadenas que no marcan el pavimento.",
        icono: "excavadora",
      },
      {
        nombre: "Retrocargadoras / mixtas",
        slug: "retrocargadoras",
        claim: "Doble funcionalidad de carga frontal y excavación trasera.",
        descripcion:
          "La máquina polivalente por excelencia para obras de urbanización, canalización y reformas.",
        icono: "mixta",
      },
      {
        nombre: "Minicargadoras",
        slug: "minicargadoras",
        claim: "Agilidad extrema para despeje y carga rápida.",
        descripcion:
          "Giro sobre su propio eje para mover materiales y escombros en accesos estrechos, con capacidades de 318 a 2.640 kg.",
        icono: "minicargadora",
      },
      {
        nombre: "Dúmperes 4x4",
        slug: "dumperes",
        claim: "Transporte ágil de tierra y escombros sobre cualquier terreno.",
        descripcion:
          "Descarga elevada, tolvas giratorias y modelos autocargables para optimizar el ciclo de movimiento de material.",
        icono: "dumper",
      },
      {
        nombre: "Rodillos de compactación",
        slug: "rodillos",
        claim: "Grandes superficies con control de compactación.",
        descripcion:
          "Rodillos de lanza, tándem y monocilíndricos de 710 kg a 19 toneladas para zanjas, bases de árido y asfalto.",
        icono: "rodillo",
      },
      {
        nombre: "Pisones y bandejas de compactación",
        slug: "pisones-bandejas",
        claim: "Impacto profundo en zanjas y acabado en superficie.",
        descripcion:
          "Pisones vibrantes para suelos cohesivos y bandejas reversibles y unidireccionales para gravas, adoquines y asfalto.",
        icono: "pison",
      },
    ],
  },
  {
    id: "energia",
    nombre: "Energía e iluminación",
    nombreLargo: "Energía eléctrica e iluminación",
    slug: "energia",
    claim: "Si no hay red, que no falte energía",
    descripcion:
      "Grupos electrógenos y torres de iluminación para suministrar electricidad y luz temporal a obras, instalaciones, industria y eventos donde no puedes depender de la red.",
    rango: "De 5 a 300 kVA",
    necesidad: "Energía e iluminación",
    necesidadDesc:
      "Grupos electrógenos y torres de luz para llevar suministro allí donde la red no llega.",
    icono: "grupo",
    subcategorias: [
      {
        nombre: "Grupos electrógenos",
        slug: "grupos-electrogenos",
        claim: "Suministro eléctrico continuo e insonorizado.",
        descripcion:
          "Generadores diésel Stage V de 20 a 300 kVA con cuadros de distribución y depósitos de gran autonomía.",
        icono: "grupo",
      },
      {
        nombre: "Grupos electrógenos portátiles",
        slug: "grupos-electrogenos-portatiles",
        claim: "Potencia que se lleva a mano.",
        descripcion:
          "Grupos de gasolina de 5 a 10 kVA para herramienta, reformas e instalaciones puntuales.",
        icono: "grupo",
      },
      {
        nombre: "Torres de iluminación",
        slug: "torres-iluminacion",
        claim: "Visibilidad total para turnos nocturnos.",
        descripcion:
          "Torres telescópicas LED móviles con generador incorporado y bajo consumo.",
        icono: "torre",
      },
    ],
  },
  {
    id: "aire-martillos",
    nombre: "Aire comprimido y martillos",
    nombreLargo: "Aire comprimido y martillos neumáticos",
    slug: "aire-martillos",
    claim:
      "Cuando el trabajo necesita aire, presión y bastante menos delicadeza",
    descripcion:
      "Compresores remolcables y martillos neumáticos para demolición, perforación, picado y cualquier aplicación que necesite suministro constante de aire comprimido.",
    rango: "De 2 a 11 m³/min",
    necesidad: "Aire y demolición",
    necesidadDesc:
      "Compresores, picadores y rompedores para cuando el trabajo pide potencia.",
    icono: "compresor",
    subcategorias: [
      {
        nombre: "Compresores de aire remolcables",
        slug: "compresores-remolcables",
        claim: "Caudal constante sobre remolque para obra.",
        descripcion:
          "Compresores diésel insonorizados de 2 a 11 m³/min de aire libre suministrado para alimentar herramienta neumática.",
        icono: "compresor",
      },
      {
        nombre: "Martillos neumáticos",
        slug: "martillos-neumaticos",
        claim: "Potencia de impacto para demolición y saneamiento.",
        descripcion:
          "Picadores y rompedores Atlas Copco y Toku, con punteros y cinceles de alta resistencia.",
        icono: "martillo",
      },
    ],
  },
  {
    id: "herramienta-auxiliar",
    nombre: "Herramienta auxiliar",
    nombreLargo: "Herramienta auxiliar de obra",
    slug: "herramienta-auxiliar",
    claim: "Porque no todo el trabajo pesa toneladas",
    descripcion:
      "Martillos eléctricos, cortadoras, perforadoras de corona, fijación y nivelación para completar trabajos de obra, instalación y mantenimiento.",
    rango: "Demolición, corte y perforación",
    necesidad: "Herramienta de obra",
    necesidadDesc:
      "Corte, perforación, demolición ligera y nivelación para cerrar el trabajo que la máquina grande no hace.",
    icono: "herramienta",
    subcategorias: [
      {
        nombre: "Herramienta eléctrica de obra",
        slug: "herramienta-obra",
        claim: "Demolición ligera, corte y perforación.",
        descripcion:
          "Martillos rompedores y perforadores, cortadoras de disco, perforadoras de corona, clavadoras y niveles láser.",
        icono: "herramienta",
      },
    ],
  },
] as const;

export const FAMILIA_POR_ID = Object.fromEntries(
  FAMILIAS.map((f) => [f.id, f]),
) as Record<FamiliaId, Familia>;

export const SUBCATEGORIAS = FAMILIAS.flatMap((f) =>
  f.subcategorias.map((s) => ({ ...s, familia: f.id })),
);

export const SUBCATEGORIA_POR_SLUG = Object.fromEntries(
  SUBCATEGORIAS.map((s) => [s.slug, s]),
);
