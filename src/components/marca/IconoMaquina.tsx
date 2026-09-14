import type { SVGProps } from "react";
import type { IconoId } from "@/lib/catalog/types";

/**
 * La iconografía de máquina del sistema.
 *
 * Sale de la lámina que pasó el cliente en la reunión del 24/08/2026 y
 * que gustó a las dos partes («a mí esta parte de la iconografía la
 * verdad que me gustó… el que aparezca la iconografía»): un dibujo de
 * máquina por categoría, de una sola anchura de trazo y en rojo.
 *
 * Tres reglas que hacen que las veintidós se vean como una familia:
 *
 *   1. Mismo lienzo (96×72) y misma línea de suelo en y=64, así que
 *      todas las máquinas «apoyan» a la misma altura y la fila no baila.
 *   2. Trazo de 2 con `vector-effect: non-scaling-stroke`: el icono se
 *      ve igual de fino a 28 px en una pastilla que a 96 px en una
 *      tarjeta de familia, que es justo el problema que tiene el PNG de
 *      la lámina original.
 *   3. `currentColor` y nada más. El rojo lo pone la clase, no el SVG,
 *      así que el mismo dibujo vale sobre blanco, sobre gris hundido y
 *      sobre el negro del faldón.
 */

const T: SVGProps<SVGGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
};

/** Rueda, que se repite en catorce de los veintidós dibujos. */
function Rueda({ cx, r = 6 }: { cx: number; r?: number }) {
  return <circle cx={cx} cy={64 - r} r={r} />;
}

const DIBUJOS: Record<IconoId, () => React.JSX.Element> = {
  /* ---------- Elevación ---------- */

  tijera: () => (
    <g {...T}>
      <path d="M20 48h44v8H20z" />
      <Rueda cx={28} r={5} />
      <Rueda cx={56} r={5} />
      <path d="M26 48 58 34M58 48 26 34M26 34 58 20M58 34 26 20" />
      <path d="M16 20h52M16 20V8M68 20V8M16 8h52M16 14h52" />
    </g>
  ),

  columna: () => (
    <g {...T}>
      <path d="M30 50h30v6H30z" />
      <Rueda cx={36} r={4} />
      <Rueda cx={54} r={4} />
      <path d="M40 50V16M50 50V16" />
      <path d="M52 22h22M52 22V8M74 22V8M52 8h22" />
    </g>
  ),

  brazo: () => (
    <g {...T}>
      <path d="M14 48h34v8H14z" />
      <Rueda cx={22} r={5} />
      <Rueda cx={42} r={5} />
      <path d="M26 48V38h14v10" />
      <path d="M32 38 52 16M52 16 78 24" />
      <path d="M70 24h18M70 24V12M88 24V12M70 12h18" />
    </g>
  ),

  telescopica: () => (
    <g {...T}>
      <path d="M12 48h32v8H12z" />
      <Rueda cx={20} r={5} />
      <Rueda cx={38} r={5} />
      <path d="M22 48V40h14v8" />
      <path d="M28 40 82 14" />
      <path d="M44 34l4 8M60 27l4 8" />
      <path d="M74 14h16M74 14V4M90 14V4M74 4h16" />
    </g>
  ),

  oruga: () => (
    <g {...T}>
      <rect x="26" y="48" width="40" height="10" rx="5" />
      <path d="M26 42 14 56M66 42 78 56" />
      <path d="M34 48V40h24v8" />
      <path d="M40 40 34 20M34 20 62 14" />
      <path d="M56 14h16M56 14V4M72 14V4M56 4h16" />
    </g>
  ),

  camion: () => (
    <g {...T}>
      <path d="M8 40h20l6 8v8H8z" />
      <path d="M34 48h44v8H34z" />
      <Rueda cx={20} r={5} />
      <Rueda cx={44} r={5} />
      <Rueda cx={68} r={5} />
      <path d="M12 40V30h14v10" />
      <path d="M44 48 74 22" />
      <path d="M66 22h20M66 22V12M86 22V12M66 12h20" />
    </g>
  ),

  /* ---------- Manutención de cargas ---------- */

  manipulador: () => (
    <g {...T}>
      {/* chasis y ruedas de obra */}
      <path d="M14 40h52v14H14z" />
      <Rueda cx={24} r={9} />
      <Rueda cx={58} r={9} />
      {/* cabina */}
      <path d="M18 40V24h18v16" />
      <path d="M22 28h10v8H22z" />
      {/* pluma telescópica hacia delante */}
      <path d="M34 30 78 20" />
      <path d="M38 36 78 27" />
      {/* carro y horquilla */}
      <path d="M78 16v18" />
      <path d="M78 32h14" />
    </g>
  ),

  giratorio: () => (
    <g {...T}>
      {/* chasis, torreta giratoria y estabilizadores */}
      <path d="M18 42h44v10H18z" />
      <Rueda cx={26} r={7} />
      <Rueda cx={54} r={7} />
      <path d="M10 56h10M60 56h10M18 46 10 56M62 46l8 10" />
      {/* corona de giro */}
      <path d="M28 42h24l-3-6H31z" />
      {/* cabina y pluma */}
      <path d="M30 36V24h14v12" />
      <path d="M42 28 80 18" />
      <path d="M80 14v16M80 28h12" />
      {/* flecha de rotación */}
      <path d="M24 20a12 7 0 0 1 18-3" />
      <path d="M40 13l3 4-5 1" />
    </g>
  ),

  carretilla: () => (
    <g {...T}>
      <path d="M22 38h26v18H22z" />
      <Rueda cx={30} r={6} />
      <Rueda cx={44} r={6} />
      <path d="M22 26h12v30" />
      <path d="M56 26V8M66 26V8" />
      <path d="M56 56h22M56 56V26" />
      <path d="M48 46h8" />
    </g>
  ),

  todoterreno: () => (
    <g {...T}>
      <path d="M20 36h28v16H20z" />
      <circle cx="30" cy="54" r="9" />
      <circle cx="48" cy="54" r="9" />
      <path d="M20 24h12v28" />
      <path d="M58 24V6M68 24V6" />
      <path d="M58 50h22M58 50V24" />
    </g>
  ),

  almacen: () => (
    <g {...T}>
      {/* mástil */}
      <path d="M32 12v40M40 12v40M32 12h8" />
      {/* horquilla y palet */}
      <path d="M40 52h36" />
      <path d="M46 36h28v14H46z" />
      <path d="M46 41h28M55 36v14M65 36v14" />
      {/* timón y ruedas */}
      <path d="M32 18 18 8" />
      <Rueda cx={36} r={4} />
      <Rueda cx={72} r={4} />
    </g>
  ),

  /* ---------- Excavación, tierras y compactación ---------- */

  excavadora: () => (
    <g {...T}>
      <rect x="10" y="48" width="46" height="10" rx="5" />
      <path d="M22 48V30h20v18M42 36h10v12" />
      <path d="M52 34 80 20M80 20 70 42" />
      <path d="M70 42l-4 10 14 2" />
    </g>
  ),

  mixta: () => (
    <g {...T}>
      <path d="M28 38h28v14H28z" />
      <Rueda cx={36} r={7} />
      <circle cx="60" cy="50" r="9" />
      <path d="M32 38V28h18v10" />
      <path d="M28 44 12 50l0-10" />
      <path d="M56 34 74 22M74 22 84 40M84 40l-8 8" />
    </g>
  ),

  minicargadora: () => (
    <g {...T}>
      <path d="M32 38h26v18H32z" />
      <Rueda cx={40} r={6} />
      <Rueda cx={54} r={6} />
      <path d="M36 38V26h16v12" />
      <path d="M32 32 14 42" />
      <path d="M14 42 8 56h18l-4-14" />
    </g>
  ),

  dumper: () => (
    <g {...T}>
      <path d="M18 44h50v12H18z" />
      <Rueda cx={28} r={7} />
      <Rueda cx={58} r={7} />
      <path d="M22 44 32 24h30l8 20z" />
      <path d="M74 44V20M74 20h-8" />
    </g>
  ),

  rodillo: () => (
    <g {...T}>
      <circle cx="24" cy="50" r="12" />
      <circle cx="68" cy="52" r="10" />
      <path d="M24 38h44v14" />
      <path d="M34 38V24h26v14" />
      <path d="M40 24V14h14v10" />
    </g>
  ),

  pison: () => (
    <g {...T}>
      <path d="M38 20h18v26H38z" />
      <path d="M47 46v6" />
      <path d="M32 52h30l-4 10H36z" />
      <path d="M38 26 24 16M56 26l14-10" />
    </g>
  ),

  /* ---------- Energía e iluminación ---------- */

  grupo: () => (
    <g {...T}>
      {/* cabina insonorizada sobre patines */}
      <path d="M16 20h60v34H16z" />
      <path d="M16 29h60" />
      {/* puerta de acceso y cuadro */}
      <path d="M22 35h20v14H22z" />
      <path d="M50 35h20v14H50z" />
      <circle cx={60} cy={42} r={3.5} />
      <path d="M60 42v-3" />
      {/* rejilla de escape */}
      <path d="M26 24h14M46 24h14" />
      {/* patines */}
      <path d="M12 54h68M22 58v6M70 58v6M22 58h48" />
    </g>
  ),

  torre: () => (
    <g {...T}>
      <path d="M26 44h40v10H26z" />
      <Rueda cx={34} r={5} />
      <Rueda cx={58} r={5} />
      <path d="M46 44V14" />
      <path d="M30 14h32M30 14V4M62 14V4M30 4h32" />
      <path d="M38 4V0M54 4V0" />
      <path d="M66 48h12" />
    </g>
  ),

  /* ---------- Aire comprimido y martillos ---------- */

  compresor: () => (
    <g {...T}>
      {/* capota remolcable */}
      <path d="M26 26h44a8 8 0 0 1 8 8v16H18V34a8 8 0 0 1 8-8Z" />
      <path d="M18 38h60" />
      <path d="M26 43v4M34 43v4M42 43v4" />
      {/* eje y ruedas */}
      <Rueda cx={34} r={6} />
      <Rueda cx={64} r={6} />
      {/* lanza de enganche y rueda de apoyo */}
      <path d="M18 44 4 52M18 50 4 52" />
      <circle cx={4} cy={56} r={3} />
      {/* salida de aire */}
      <path d="M78 44h8M86 40v8" />
    </g>
  ),

  martillo: () => (
    <g {...T}>
      {/* rompedor neumático con manillar en T */}
      <path d="M38 18h18v26H38z" />
      <path d="M28 18h10M56 18h10" />
      <path d="M28 18v6M66 18v6" />
      {/* manguera de aire */}
      <path d="M56 24c10 0 14 6 14 12" />
      {/* puntero */}
      <path d="M47 44v10" />
      <path d="M43 54h8l-4 12z" />
    </g>
  ),

  herramienta: () => (
    <g {...T}>
      {/* martillo perforador eléctrico */}
      <path d="M34 16h22v24H34z" />
      {/* empuñadura en D */}
      <path d="M34 20H24v12h10" />
      {/* empuñadura lateral */}
      <path d="M56 26h14" />
      {/* portabrocas y broca */}
      <path d="M40 40h10v6H40z" />
      <path d="M45 46v14" />
      <path d="M42 60h6l-3 6z" />
    </g>
  ),
};

export function IconoMaquina({
  icono,
  etiqueta,
  className,
  ...props
}: {
  icono: IconoId;
  /** Si se pasa, el icono se anuncia. Si no, es decorativo. */
  etiqueta?: string;
} & SVGProps<SVGSVGElement>) {
  const Dibujo = DIBUJOS[icono] ?? DIBUJOS.tijera;
  return (
    <svg
      viewBox="0 0 96 72"
      className={className}
      role={etiqueta ? "img" : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta ? undefined : true}
      {...props}
    >
      <Dibujo />
    </svg>
  );
}
