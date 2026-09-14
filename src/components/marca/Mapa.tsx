import { DELEGACIONES } from "@/content/es/empresa";
import { cn } from "@/lib/utils/cn";

/**
 * El mapa de la península con las diez delegaciones.
 *
 * La proyección es equirrectangular y explícita:
 *
 *     x = (lon + 9,6) / 13,1 · 100
 *     y = (44 − lat)  /  8,2 · 100
 *
 * Es la misma fórmula con la que están calculadas las coordenadas de
 * cada delegación en `empresa.ts`, así que los puntos caen donde caen
 * de verdad y no donde quedaban bonitos. Almassora y Puerto de Sagunto
 * salen a 4 puntos de distancia porque están a 40 km, y eso es
 * información: si tu obra está en Castellón, tienes dos parques a mano.
 *
 * Trazado deliberadamente simplificado: unos 35 vértices de costa y la
 * frontera con Portugal. No es un mapa de consulta —para eso está la
 * dirección de cada delegación— sino la respuesta de un vistazo a «¿me
 * cogéis cerca?».
 */

/** Costa peninsular, sentido horario desde el noroeste gallego. */
const COSTA = [
  [5.3, 3.0],
  [16.0, 2.4],
  [29.0, 4.9],
  [44.3, 6.7],
  [59.5, 7.9],
  [61.1, 8.5],
  [78.6, 15.9],
  [87.0, 18.3],
  [97.7, 20.1],
  [98.5, 25.6],
  [90.1, 32.9],
  [80.9, 36.6],
  [78.6, 41.5],
  [74.0, 48.8],
  [71.0, 56.1],
  [68.7, 63.4],
  [69.5, 69.5],
  [66.4, 78.0],
  [59.5, 82.9],
  [51.9, 89.0],
  [39.7, 89.0],
  [32.1, 95.7],
  [25.2, 90.2],
  [20.6, 82.9],
  [16.8, 82.9],
  [16.0, 84.1],
  [5.3, 85.4],
  [6.1, 73.2],
  [0.8, 64.6],
  [6.1, 56.1],
  [5.3, 46.3],
  [6.1, 34.1],
  [5.3, 25.6],
  [6.9, 17.1],
  [2.3, 13.4],
  [4.6, 9.8],
] as const;

/** Frontera hispano-portuguesa, de norte a sur. */
const FRONTERA = [
  [10.7, 24.4],
  [19.8, 25.6],
  [26.0, 29.3],
  [20.6, 36.6],
  [19.8, 46.3],
  [16.0, 53.7],
  [19.8, 61.0],
  [17.6, 70.7],
  [16.8, 80.5],
  [16.8, 82.9],
] as const;

const camino = (puntos: readonly (readonly [number, number])[], cerrar = false) =>
  puntos.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ") +
  (cerrar ? " Z" : "");

/**
 * Separa las etiquetas que se pisan.
 *
 * Castellón y Puerto de Sagunto están a 40 km, así que sus puntos caen
 * a menos de cuatro unidades y los dos rótulos se solapaban. El punto NO
 * se mueve —esa es la información— pero el rótulo sí: se empuja hacia
 * abajo lo justo para que quepan los dos, por parejas y de norte a sur.
 */
const ALTO_ETIQUETA = 4.4;

function desplazamientos(): Record<string, number> {
  const orden = [...DELEGACIONES].sort((a, b) => a.mapa.y - b.mapa.y);
  const dy: Record<string, number> = {};
  let ultimaY = -Infinity;
  for (const d of orden) {
    const propuesta = Math.max(d.mapa.y, ultimaY + ALTO_ETIQUETA);
    dy[d.id] = propuesta - d.mapa.y;
    ultimaY = propuesta;
  }
  return dy;
}

const DY = desplazamientos();

/** De norte a sur: es el orden en el que caen los puntos al animarse. */
const ORDEN_NORTE_SUR = [...DELEGACIONES].sort((a, b) => a.mapa.y - b.mapa.y);

export function Mapa({
  className,
  activa,
  tono = "claro",
  animado = false,
}: {
  className?: string;
  /** Delegación resaltada, si la hay. */
  activa?: string;
  tono?: "claro" | "oscuro";
  /**
   * Los puntos van cayendo de norte a sur y las etiquetas detrás. Es
   * CSS puro y cuelga de `html[data-motor]`, así que sin JavaScript, con
   * un rastreador o con `prefers-reduced-motion` el mapa sale entero y
   * quieto: lo animado es cómo aparece, no si aparece.
   */
  animado?: boolean;
}) {
  const oscuro = tono === "oscuro";

  return (
    <svg
      viewBox="-4 -4 108 108"
      className={className}
      role="img"
      aria-label={`Mapa de la península ibérica con las ${DELEGACIONES.length} delegaciones de JOFEMESA`}
    >
      <path
        d={camino(COSTA, true)}
        fill={oscuro ? "var(--color-inverse-2)" : "var(--color-muted)"}
        stroke={oscuro ? "var(--color-rule-inverse)" : "var(--color-rule-strong)"}
        strokeWidth={0.7}
        strokeLinejoin="round"
        className={animado ? "mapa-costa" : undefined}
      />
      <path
        d={camino(FRONTERA)}
        fill="none"
        stroke={oscuro ? "var(--color-rule-inverse)" : "var(--color-rule-strong)"}
        strokeWidth={0.5}
        strokeDasharray="2 1.6"
        strokeLinecap="round"
      />

      {ORDEN_NORTE_SUR.map((d, i) => {
        const esActiva = activa === d.id;
        const dy = DY[d.id] ?? 0;
        return (
          <g
            key={d.id}
            className={animado ? "mapa-punto" : undefined}
            style={
              animado
                ? ({ "--retardo-punto": `${i * 70}ms` } as React.CSSProperties)
                : undefined
            }
          >
            {(esActiva || d.central) && (
              <circle
                cx={d.mapa.x}
                cy={d.mapa.y}
                r={4.6}
                fill="var(--color-accent)"
                opacity={esActiva ? 0.22 : 0.12}
              />
            )}
            <circle
              cx={d.mapa.x}
              cy={d.mapa.y}
              r={d.central ? 2.3 : 1.8}
              fill="var(--color-accent)"
              stroke={oscuro ? "var(--color-inverse)" : "#fff"}
              strokeWidth={0.7}
            />
            {/* Si el rótulo se ha tenido que separar, una línea fina lo
                ata a su punto: sin ella, un rótulo desplazado parece
                señalar a otro sitio. */}
            {dy > 1.5 && (
              <path
                d={`M${d.mapa.x + (d.mapa.x > 70 ? -2.4 : 2.4)} ${d.mapa.y} L${
                  d.mapa.x + (d.mapa.x > 70 ? -3.4 : 3.4)
                } ${d.mapa.y + dy}`}
                stroke={
                  oscuro
                    ? "var(--color-rule-inverse)"
                    : "var(--color-rule-strong)"
                }
                strokeWidth={0.4}
                fill="none"
              />
            )}
            <text
              x={d.mapa.x + (d.mapa.x > 70 ? -3.6 : 3.6)}
              y={d.mapa.y + dy + 1.1}
              textAnchor={d.mapa.x > 70 ? "end" : "start"}
              className={cn(
                "font-mono",
                oscuro ? "fill-[var(--color-ink-inv-2)]" : "fill-[var(--color-ink-2)]",
              )}
              fontSize={3.6}
              letterSpacing={0.1}
            >
              {d.nombre}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
