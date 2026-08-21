import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { num } from "@/lib/utils/format";
import type { SpecDef, SpecValor } from "@/lib/catalog/types";

/**
 * Dibuja una especificación según su estado de verificación.
 *
 * Esta es la pieza donde el proyecto cumple su promesa: un dato que no
 * tenemos NUNCA se dibuja como una cifra. Se dibuja como lo que es.
 */
export function DatoValor({
  dato,
  def,
  className,
  invertido = false,
}: {
  dato: SpecValor | undefined;
  def: SpecDef;
  className?: string;
  invertido?: boolean;
}) {
  if (!dato || dato.estado === "no_aplica") {
    return (
      <span
        className={cn("value", invertido ? "text-ink-inv-3" : "text-ink-3", className)}
        title="No aplica a este tipo de máquina"
      >
        —
      </span>
    );
  }

  if (dato.estado === "pendiente") {
    return (
      <span
        className={cn(
          "label-sm inline-flex items-center gap-1.5 bg-wait px-2 py-1 text-wait-ink",
          className,
        )}
        title={dato.nota ?? "Te lo confirmamos al responder la solicitud."}
      >
        <AlertTriangle size={12} strokeWidth={2} aria-hidden="true" />
        Pendiente
      </span>
    );
  }

  const texto =
    typeof dato.valor === "number" ? num(dato.valor) : String(dato.valor);
  const unidad = def.unidad && typeof dato.valor === "number" ? def.unidad : "";

  return (
    <span
      className={cn(
        "value",
        invertido ? "text-ink-inv" : "text-ink",
        // El dato de catálogo del fabricante se marca, no se disimula.
        dato.estado === "estimado" &&
          "decoration-wait underline decoration-2 underline-offset-4",
        className,
      )}
      title={
        dato.estado === "estimado"
          ? (dato.nota ??
            "Dato del catálogo del fabricante. Lo confirmamos con la unidad de flota al responder la solicitud.")
          : "Dato de la ficha técnica del fabricante"
      }
    >
      {texto}
      {unidad && (
        <span
          className={cn("ml-1", invertido ? "text-ink-inv-3" : "text-ink-3")}
        >
          {unidad}
        </span>
      )}
    </span>
  );
}
