import { cn } from "@/lib/utils/cn";
import type { FamiliaId } from "@/lib/catalog/types";

/**
 * Dibujo técnico de cada familia de máquina, con la misma gramática de
 * trazo de 2px que los iconos.
 *
 * Es lo que se ve mientras no haya fotografía de fabricante autorizada.
 * Un dibujo es honesto y parece deliberado; una foto de stock de la
 * máquina de otro parece un robo y se nota.
 */

const TRAZO = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Tijera() {
  return (
    <g {...TRAZO}>
      {/* chasis */}
      <path d="M14 74h60v8H14z" />
      <circle cx="26" cy="86" r="5" />
      <circle cx="62" cy="86" r="5" />
      {/* tijera */}
      <path d="M24 74 64 54M64 74 24 54M24 54 64 34M64 54 24 34M24 34 64 20M64 34 24 20" />
      {/* plataforma y barandilla */}
      <path d="M10 20h68v5H10zM10 20V6M78 20V6M10 6h68M10 13h68" />
    </g>
  );
}

function Brazo() {
  return (
    <g {...TRAZO}>
      <path d="M10 76h44v10H10z" />
      <circle cx="20" cy="88" r="5" />
      <circle cx="46" cy="88" r="5" />
      {/* torreta */}
      <path d="M26 76V64h14v12" />
      {/* pluma articulada */}
      <path d="M33 64 52 36M52 36 78 24" />
      {/* cesta */}
      <path d="M70 24h18v4H70zM70 24V14M88 24V14M70 14h18" />
    </g>
  );
}

function Excavadora() {
  return (
    <g {...TRAZO}>
      {/* orugas */}
      <path d="M8 78h52a4 4 0 0 1 0 12H8a4 4 0 0 1 0-12Z" />
      <circle cx="18" cy="84" r="3" />
      <circle cx="50" cy="84" r="3" />
      {/* cabina */}
      <path d="M18 78V54h22v24M40 60h10v18" />
      {/* pluma y cazo */}
      <path d="M50 62 74 44M74 44 66 66M66 66l-4 12 14 2" />
    </g>
  );
}

function Rodillo() {
  return (
    <g {...TRAZO}>
      <circle cx="24" cy="74" r="16" />
      <circle cx="72" cy="76" r="14" />
      <path d="M24 58h48v14M34 58V44h30v14" />
      <path d="M40 44V34h18v10" />
    </g>
  );
}

function Grupo() {
  return (
    <g {...TRAZO}>
      <path d="M12 34h72v46H12z" />
      <path d="M12 46h72" />
      {/* rejillas */}
      <path d="M22 56v14M32 56v14M42 56v14" />
      {/* panel */}
      <path d="M58 56h18v14H58z" />
      <circle cx="67" cy="63" r="3" />
      {/* remolque */}
      <path d="M12 80v6h72v-6" />
      <circle cx="30" cy="90" r="4" />
      <circle cx="66" cy="90" r="4" />
    </g>
  );
}

function Compresor() {
  return (
    <g {...TRAZO}>
      <path d="M14 40h68a6 6 0 0 1 6 6v30H8V46a6 6 0 0 1 6-6Z" />
      <path d="M8 58h80" />
      <circle cx="30" cy="84" r="6" />
      <circle cx="68" cy="84" r="6" />
      {/* lanza */}
      <path d="M88 62h8M14 48v4" />
    </g>
  );
}

function Herramienta() {
  return (
    <g {...TRAZO}>
      <path d="M30 20h18v34H30z" />
      <path d="M39 54v20" />
      <path d="M28 74h22l-4 14H32z" />
      <path d="M56 34h20M56 44h20M56 54h14" />
    </g>
  );
}

const POR_FAMILIA: Record<FamiliaId, () => React.JSX.Element> = {
  elevacion: Tijera,
  manipulacion: Brazo,
  "movimiento-tierras": Excavadora,
  compactacion: Rodillo,
  energia: Grupo,
  "aire-martillos": Compresor,
  "herramienta-auxiliar": Herramienta,
};

export function SiluetaMaquina({
  familia,
  etiqueta,
  className,
}: {
  familia: FamiliaId;
  etiqueta?: string;
  className?: string;
}) {
  const Dibujo = POR_FAMILIA[familia] ?? Tijera;
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-3 bg-muted",
        className,
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-3/5 w-auto max-w-[70%] text-rule-strong"
        role="img"
        aria-label={
          etiqueta ? `Dibujo técnico de ${etiqueta}` : "Dibujo técnico de la máquina"
        }
      >
        <Dibujo />
      </svg>
      <span className="label-sm text-ink-3">Foto pendiente</span>
    </div>
  );
}
