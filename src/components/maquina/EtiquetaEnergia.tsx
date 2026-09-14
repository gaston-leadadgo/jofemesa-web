import { cn } from "@/lib/utils/cn";
import type { Energia, Traccion } from "@/lib/catalog/types";

/**
 * La etiqueta de alimentación: eléctrico, híbrido, diésel, gasolina.
 *
 * Es el dato que más se pregunta en un alquiler de maquinaria y el que
 * antes no estaba en la tarjeta. Decide antes que la altura: si la
 * máquina entra en un aparcamiento o en una nave, no puede echar humo,
 * y si el tajo es de tierra, la eléctrica no sirve. Así que va arriba y
 * va en color.
 *
 * El color no es el único portador: cada etiqueta lleva su palabra. Y
 * los tres pares están medidos sobre su propio fondo, no sobre blanco:
 *
 *   · eléctrico  #166534 sobre #F0FDF4 → 7,26:1  AAA
 *   · híbrido    #1E40AF sobre #EFF6FF → 8,04:1  AAA
 *   · térmico    #3F4A52 sobre #F4F6F7 → 7,80:1  AAA
 *
 * La tracción se pega al diésel cuando es 4x4 —«Diésel 4x4»— porque en
 * exterior es la mitad de la respuesta.
 */

const ETIQUETAS: Record<Energia, { texto: string; clase: string }> = {
  electrico: {
    texto: "Eléctrico",
    clase: "border-[#D3F0DD] bg-[#F0FDF4] text-[#166534]",
  },
  hibrido: {
    texto: "Híbrido",
    clase: "border-[#D8E6FE] bg-[#EFF6FF] text-[#1E40AF]",
  },
  diesel: {
    texto: "Diésel",
    clase: "border-rule-strong bg-sunken text-ink-2",
  },
  gasolina: {
    texto: "Gasolina",
    clase: "border-rule-strong bg-sunken text-ink-2",
  },
};

export function EtiquetaEnergia({
  energia,
  traccion,
  className,
}: {
  energia: Energia;
  traccion?: Traccion;
  className?: string;
}) {
  const e = ETIQUETAS[energia];
  const cuatroPorCuatro = traccion === "4x4" && energia !== "electrico";

  return (
    <span
      className={cn(
        "label-sm pastilla inline-flex shrink-0 items-center border px-2.5 py-1",
        e.clase,
        className,
      )}
    >
      {cuatroPorCuatro ? `${e.texto} 4x4` : e.texto}
    </span>
  );
}
