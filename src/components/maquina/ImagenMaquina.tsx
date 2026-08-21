import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { Maquina } from "@/lib/catalog/types";
import { fotoProvisional } from "@/lib/catalog/fotos";
import { SiluetaMaquina } from "./SiluetaMaquina";

/**
 * La foto de la máquina, que es la protagonista de esta web.
 *
 * Tres niveles, en este orden:
 *
 *   1. `maquina.imagenes` — la foto real del modelo. Manda siempre.
 *   2. Foto provisional de licencia libre por subcategoría. Es de otra
 *      unidad de la misma familia, así que se marca como referencia.
 *   3. Silueta técnica dibujada, si no hay ninguna de las dos.
 *
 * El relleno lo pone este componente y no quien lo llama, porque depende
 * del tipo de imagen: la foto de fabricante viene recortada sobre fondo
 * limpio y necesita aire para que `contain` no la pegue al filete; la
 * foto de obra va a sangre, y ahí cualquier margen deja un marco gris
 * que rompe la rejilla.
 */
export function ImagenMaquina({
  maquina,
  indice = 0,
  sizes,
  prioridad = false,
  className,
  marca = true,
}: {
  maquina: Maquina;
  indice?: number;
  sizes: string;
  prioridad?: boolean;
  /** Se aplica a la imagen, para el zoom al pasar por encima. */
  className?: string;
  /** Dibuja el aviso de "foto de referencia". Se apaga en miniaturas. */
  marca?: boolean;
}) {
  const real = maquina.imagenes[indice];

  if (real) {
    return (
      <span className="absolute inset-0 block p-4">
        <Image
          src={real.src}
          alt={real.alt}
          fill
          sizes={sizes}
          priority={prioridad}
          className={cn("object-contain", className)}
        />
      </span>
    );
  }

  const prov = fotoProvisional(maquina);

  if (!prov) {
    return (
      <span className="absolute inset-0 flex items-center justify-center p-5">
        <SiluetaMaquina
          familia={maquina.familia}
          etiqueta={`${maquina.marca} ${maquina.modelo}`}
        />
      </span>
    );
  }

  return (
    <>
      <Image
        src={prov.fichero}
        alt={`Fotografía de referencia de un equipo de la misma familia que el ${maquina.marca} ${maquina.modelo}`}
        fill
        sizes={sizes}
        priority={prioridad}
        className={cn("object-cover", className)}
      />
      {marca && (
        <span
          className="label-sm pointer-events-none absolute right-0 bottom-0 z-1 bg-surface/90 px-2 py-1 text-ink-3"
          title={`Imagen de referencia (${prov.licencia}, Wikimedia Commons). Pendiente la foto del modelo exacto.`}
        >
          Foto de referencia
        </span>
      )}
    </>
  );
}
