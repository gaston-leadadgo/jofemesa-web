import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { Maquina } from "@/lib/catalog/types";
import { SUBCATEGORIA_POR_SLUG, FAMILIA_POR_ID } from "@/lib/catalog/familias";
import { IconoMaquina } from "@/components/marca/IconoMaquina";

/**
 * La imagen de la máquina.
 *
 * Dos niveles y ninguno más:
 *
 *   1. `maquina.imagenes` — la fotografía oficial de JOFEMESA. Son 27
 *      máquinas de su propia flota, con su rotulación.
 *   2. El dibujo técnico de su subcategoría, si no hay foto.
 *
 * Lo que se ha quitado a propósito es el nivel intermedio que había
 * antes: 57 fotografías de licencia libre de Wikimedia repartidas por
 * subcategoría. No era solo que no fueran del modelo exacto —varias
 * llevaban rotulación visible de empresas de alquiler de la
 * competencia, y una de ellas era el hero de la portada—. Un dibujo
 * parece deliberado; la máquina de otro con su logotipo, no.
 */
export function ImagenMaquina({
  maquina,
  indice = 0,
  sizes,
  prioridad = false,
  className,
  compacto = false,
}: {
  maquina: Maquina;
  indice?: number;
  sizes: string;
  prioridad?: boolean;
  /** Se aplica a la imagen, para el zoom al pasar por encima. */
  className?: string;
  /** En miniatura se quita la palabra «Foto pendiente». */
  compacto?: boolean;
}) {
  const real = maquina.imagenes[indice];

  if (real) {
    return (
      <Image
        src={real.src}
        alt={real.alt}
        fill
        sizes={sizes}
        priority={prioridad}
        className={cn("object-cover", className)}
      />
    );
  }

  const icono =
    SUBCATEGORIA_POR_SLUG[maquina.subcategoriaSlug]?.icono ??
    FAMILIA_POR_ID[maquina.familia]?.icono ??
    "tijera";

  return (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted">
      <IconoMaquina
        icono={icono}
        etiqueta={`Dibujo técnico de ${maquina.marca} ${maquina.modelo}`}
        className="h-1/2 w-auto max-w-[62%] text-rule-strong"
      />
      {!compacto && (
        <span className="label-sm text-ink-3">Foto pendiente</span>
      )}
    </span>
  );
}
