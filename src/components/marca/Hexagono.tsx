import type { SVGProps } from "react";

/**
 * El hexágono del isotipo de JOFEMESA: la silueta de una tuerca.
 * Es el único ornamento del sistema — indicador de carga, viñeta,
 * marca de estado vacío y filigrana del pie. Nunca fondo de patrón.
 */
export function Hexagono(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 88" fill="none" {...props}>
      <path
        d="M27 2h46l25 42-25 42H27L2 44 27 2Z"
        stroke="currentColor"
        strokeWidth={5}
        fill="none"
      />
    </svg>
  );
}

/** Versión rellena, para viñetas pequeñas. */
export function HexagonoRelleno(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 88" fill="none" {...props}>
      <path d="M27 2h46l25 42-25 42H27L2 44 27 2Z" fill="currentColor" />
    </svg>
  );
}
