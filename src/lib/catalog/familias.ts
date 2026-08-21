import type { Familia, FamiliaId } from "./types";

/**
 * Taxonomía de dos niveles: familia → subcategoría.
 *
 * Los claims están escritos en clave de trabajo, no de producto: quien
 * busca no piensa "necesito una plataforma articulada eléctrica", piensa
 * "tengo que llegar a una luminaria de una nave en activo".
 */
export const FAMILIAS: readonly Familia[] = [
  {
    id: "elevacion",
    nombre: "Elevación",
    slug: "elevacion",
    claim:
      "Maquinaria para trabajar en altura con la solución adecuada bajo tus pies",
    descripcion:
      "Desde trabajos interiores en espacios estrechos hasta intervenciones a grandes alturas. Elige el equipo según alcance, entorno, terreno y condiciones del proyecto.",
    rango: "Desde 4,5 m hasta 57 m",
    necesidad: "Trabajos en altura",
    necesidadDesc:
      "Equipos para llegar donde el trabajo te necesita, desde espacios reducidos hasta grandes alturas.",
    subcategorias: [
      {
        nombre: "Mástiles verticales",
        slug: "mastiles-verticales",
        claim: "Cuando hay poco espacio, cada centímetro cuenta.",
        descripcion:
          "Equipos para trabajos en altura donde la maniobrabilidad y unas dimensiones contenidas resultan especialmente importantes. Ideales para interiores, mantenimiento y logística.",
      },
      {
        nombre: "Tijeras eléctricas",
        slug: "tijeras-electricas",
        claim: "Subir recto. Trabajar cómodo. Complicar poco.",
        descripcion:
          "Plataformas para trabajos en altura donde se necesita una superficie estable, movilidad vertical y funcionamiento eléctrico, especialmente útil en interiores y superficies adecuadas sin emisiones.",
      },
      {
        nombre: "Tijeras diésel",
        slug: "tijeras-diesel",
        claim:
          "Cuando la obra se pone seria, necesitas una máquina preparada para seguirla.",
        descripcion:
          "Equipos pensados para trabajos exteriores que requieren capacidad de carga ampliada, gran autonomía y tracción 4x4 para responder en terrenos de obra complejos.",
      },
      {
        nombre: "Tijeras híbridas",
        slug: "tijeras-hibridas",
        claim:
          "Un proyecto puede cambiar de entorno. Tu máquina también debería poder hacerlo.",
        descripcion:
          "Soluciones que combinan distintas formas de alimentación para aportar mayor flexibilidad cuando el proyecto exige trabajar tanto en exterior como en interior.",
      },
      {
        nombre: "Brazos articulados eléctricos",
        slug: "brazos-articulados-electricos",
        claim: "Porque el punto de trabajo no siempre está justo encima.",
        descripcion:
          "Su geometría articulada permite alcanzar posiciones elevadas salvando obstáculos e instalaciones aéreas, con funcionamiento silencioso y sin emisiones.",
      },
      {
        nombre: "Brazos diésel",
        slug: "brazos-diesel",
        claim: "Altura, alcance y terreno. Todo cuenta.",
        descripcion:
          "Equipos articulados preparados para acceder a zonas elevadas y salvar obstáculos en trabajos exteriores y obras con terrenos difíciles y pendientes pronunciadas.",
      },
      {
        nombre: "Brazos híbridos",
        slug: "brazos-hibridos",
        claim:
          "Más flexibilidad para trabajos que no vienen con un único escenario.",
        descripcion:
          "Combinan alcance articulado y distintas posibilidades de funcionamiento para adaptarse a proyectos con requisitos variados de emisiones y autonomía.",
      },
      {
        nombre: "Brazos telescópicos",
        slug: "brazos-telescopicos",
        claim: "Cuando el trabajo está lejos, el alcance deja de ser un detalle.",
        descripcion:
          "Equipos diseñados para alcanzar grandes alturas y distancias horizontales directas. Rapidez de posicionamiento para montajes industriales, fachadas y grandes infraestructuras.",
      },
      {
        nombre: "Plataformas sobre camión",
        slug: "plataformas-sobre-camion",
        claim: "Llegar, elevar y seguir al siguiente punto.",
        descripcion:
          "Combinan movilidad por carretera y capacidad de elevación inmediata con estabilizadores. Óptimas cuando hay que intervenir en varias ubicaciones el mismo día.",
      },
      {
        nombre: "Plataformas sobre oruga",
        slug: "plataformas-sobre-oruga",
        claim: "El acceso difícil no debería significar trabajo imposible.",
        descripcion:
          "Equipos tipo araña para situaciones donde puertas estrechas, forjados delicados o pendientes pronunciadas descartan una plataforma convencional.",
      },
    ],
  },
  {
    id: "manipulacion",
    nombre: "Manipulación de cargas",
    slug: "manipulacion",
    claim: "Mover más. Maniobrar mejor. Trabajar con menos complicaciones.",
    descripcion:
      "Equipos para elevar, transportar y posicionar cargas según el peso, la altura, el terreno y el espacio disponible. Para logística, eventos, construcción e industria.",
    rango: "Hasta 5.000 kg y 21 m",
    necesidad: "Mover y elevar cargas",
    necesidadDesc:
      "Carretillas y manipuladores para transportar, elevar y posicionar cargas con mayor eficacia.",
    subcategorias: [
      {
        nombre: "Manipuladores telescópicos rígidos",
        slug: "manipuladores-telescopicos-rigidos",
        claim: "Alcance y capacidad directa en obra.",
        descripcion:
          "Para elevar cargas pesadas a alturas de hasta 18 metros con máxima estabilidad frontal.",
      },
      {
        nombre: "Manipuladores telescópicos giratorios",
        slug: "manipuladores-telescopicos-giratorios",
        claim: "Versatilidad 360º para sustituir grúas ligeras.",
        descripcion:
          "Torreta giratoria continua para descargar y posicionar materiales en todo el perímetro sin mover la máquina.",
      },
      {
        nombre: "Carretillas eléctricas",
        slug: "carretillas-electricas",
        claim: "Eficiencia y cero emisiones en almacén.",
        descripcion:
          "Carretillas contrapesadas silenciosas, ágiles y compactas para carga y descarga en interiores.",
      },
      {
        nombre: "Carretillas diésel",
        slug: "carretillas-diesel",
        claim: "Potencia constante para exteriores y patios logísticos.",
        descripcion:
          "Capacidades de hasta 5 toneladas con gran resistencia mecánica para ciclos intensivos de carga.",
      },
      {
        nombre: "Carretillas todoterreno",
        slug: "carretillas-todoterreno",
        claim: "Tracción total en terrenos irregulares.",
        descripcion:
          "Neumáticos de gran diámetro y tracción 4x4 para mover materiales en terrenos sin pavimentar.",
      },
      {
        nombre: "Transpaletas y apiladores",
        slug: "transpaletas-apiladores",
        claim: "El movimiento diario del almacén, sin esfuerzo.",
        descripcion:
          "Equipos eléctricos de acompañamiento para el trasiego de palets y el apilado en estanterías bajas.",
      },
    ],
  },
  {
    id: "movimiento-tierras",
    nombre: "Excavación y movimiento de tierras",
    slug: "movimiento-tierras",
    claim:
      "Primero hay que mover tierra. Luego ya hablamos de construir encima.",
    descripcion:
      "Equipos para excavar, cargar, transportar y preparar el terreno con soluciones adaptadas al espacio disponible y a las características de cada obra.",
    rango: "Minis, mixtas y dúmperes",
    necesidad: "Excavar y mover tierra",
    necesidadDesc:
      "Equipos para excavar, cargar, desplazar y preparar el terreno.",
    subcategorias: [
      {
        nombre: "Miniexcavadoras",
        slug: "miniexcavadoras",
        claim: "Precisión y fuerza en espacios reducidos.",
        descripcion:
          "Desde 1,5 hasta 9 toneladas para zanjeo, cimentaciones y canalizaciones, con cadenas de goma que no marcan el pavimento.",
      },
      {
        nombre: "Retrocargadoras",
        slug: "retrocargadoras",
        claim: "Doble funcionalidad de carga frontal y excavación trasera.",
        descripcion:
          "La máquina polivalente por excelencia para obras de urbanización, canalización y reformas.",
      },
      {
        nombre: "Minicargadoras",
        slug: "minicargadoras",
        claim: "Agilidad extrema para despeje y carga rápida.",
        descripcion:
          "Giro sobre su propio eje para mover materiales y escombros en accesos estrechos.",
      },
      {
        nombre: "Dúmperes 4x4",
        slug: "dumpers-4x4",
        claim: "Transporte ágil de tierra y escombros sobre cualquier terreno.",
        descripcion:
          "Tolvas giratorias y descarga en altura para optimizar el ciclo de movimiento de material.",
      },
    ],
  },
  {
    id: "compactacion",
    nombre: "Compactación",
    slug: "compactacion",
    claim: "Una buena obra también empieza por lo que no se ve",
    descripcion:
      "Maquinaria para compactar terrenos, rellenos, zanjas y superficies asfálticas antes de continuar con las siguientes fases del trabajo.",
    rango: "Pisones, bandejas y rodillos",
    necesidad: "Compactar",
    necesidadDesc:
      "Equipos para preparar bases y conseguir una compactación adecuada al terreno.",
    subcategorias: [
      {
        nombre: "Pisones",
        slug: "pisones",
        claim: "Impacto profundo en zanjas y espacios muy estrechos.",
        descripcion:
          "Pisones vibrantes de alta frecuencia para suelos cohesivos y canalizaciones de servicios.",
      },
      {
        nombre: "Bandejas vibrantes",
        slug: "bandejas-vibrantes",
        claim: "Acabado uniforme en pavimentos y bases de árido.",
        descripcion:
          "Bandejas reversibles y unidireccionales para compactación de gravas, adoquines y asfalto.",
      },
      {
        nombre: "Rodillos",
        slug: "rodillos",
        claim: "Grandes superficies con control de compactación.",
        descripcion:
          "Rodillos tándem para asfalto y rodillos de zanja con mando a distancia para máxima seguridad del operario.",
      },
    ],
  },
  {
    id: "energia",
    nombre: "Energía",
    slug: "energia",
    claim: "Si no hay red, que no falte energía",
    descripcion:
      "Grupos electrógenos para suministrar electricidad temporal a obras, instalaciones, industria y eventos donde necesitas energía independientemente de la red.",
    rango: "Insonorizados de 30 a 300 kVA",
    necesidad: "Necesito energía",
    necesidadDesc:
      "Grupos electrógenos para llevar suministro eléctrico allí donde la red no llega.",
    subcategorias: [
      {
        nombre: "Grupos electrógenos",
        slug: "grupos-electrogenos",
        claim: "Suministro eléctrico continuo e insonorizado.",
        descripcion:
          "Generadores diésel de alta fiabilidad con cuadros de distribución y depósitos de gran autonomía.",
      },
      {
        nombre: "Torres de iluminación",
        slug: "torres-iluminacion",
        claim: "Visibilidad total para turnos nocturnos.",
        descripcion:
          "Torres telescópicas LED con generador incorporado y bajo consumo.",
      },
    ],
  },
  {
    id: "aire-martillos",
    nombre: "Aire comprimido y martillos",
    slug: "aire-martillos",
    claim:
      "Cuando el trabajo necesita aire, presión y bastante menos delicadeza",
    descripcion:
      "Compresores y martillos neumáticos para demolición, perforación, chorreo y cualquier aplicación que necesite suministro constante de aire comprimido.",
    rango: "Compresores y demoledores",
    necesidad: "Aire y herramienta",
    necesidadDesc:
      "Compresores, martillos y herramienta profesional para cuando el trabajo pide potencia.",
    subcategorias: [
      {
        nombre: "Compresores portátiles",
        slug: "compresores-portatiles",
        claim: "Caudal constante sobre remolque para obra.",
        descripcion:
          "Compresores diésel insonorizados de 5 a 12 m³/min para alimentar herramientas neumáticas.",
      },
      {
        nombre: "Martillos neumáticos y demoledores",
        slug: "martillos-neumaticos",
        claim: "Potencia de impacto para demolición y saneamiento.",
        descripcion:
          "Martillos picadores y demoledores de 10 a 30 kg con punteros y cinceles de alta resistencia.",
      },
    ],
  },
  {
    id: "herramienta-auxiliar",
    nombre: "Herramienta auxiliar",
    slug: "herramienta-auxiliar",
    claim: "Porque no todo el trabajo pesa toneladas",
    descripcion:
      "Herramientas, bombas de achique, cortadoras y equipos auxiliares para completar trabajos de obra, instalación y mantenimiento.",
    rango: "Bombas, cortadoras y auxiliares",
    necesidad: "Herramienta de obra",
    necesidadDesc:
      "Bombas, cortadoras y equipos auxiliares para cerrar el trabajo que la máquina grande no hace.",
    subcategorias: [
      {
        nombre: "Bombas de agua y achique",
        slug: "bombas-agua",
        claim: "Drenaje rápido en excavaciones y sótanos.",
        descripcion:
          "Bombas sumergibles y motobombas para aguas limpias y cargadas.",
      },
      {
        nombre: "Cortadoras y amoladoras",
        slug: "cortadoras",
        claim: "Corte preciso en hormigón, asfalto y metales.",
        descripcion:
          "Cortadoras de disco y mesas de corte al agua para materiales de construcción.",
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
