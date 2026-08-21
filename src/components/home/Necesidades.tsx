import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FAMILIAS } from "@/lib/catalog/familias";
import { ALQUILER } from "@/lib/catalog";
import { fotoFamilia } from "@/lib/catalog/fotos";
import { SiluetaMaquina } from "@/components/maquina/SiluetaMaquina";
import type { FamiliaId } from "@/lib/catalog/types";

/**
 * S3 · El único bento de la web, en clave de necesidad ("Trabajos en
 * altura") y no de producto ("Plataformas elevadoras"): quien busca
 * piensa en el trabajo que tiene delante.
 *
 * Dos cosas que estaban mal y ahora manda la rejilla:
 *
 *   · El titular de celda ya no usa `display-3`. Una escala global de
 *     36px metida en una celda de una columna de ancho parte las
 *     palabras en tres líneas; el tamaño lo fija el hueco, no el token.
 *   · Se ha quitado el `justify-between` sobre celdas de 256px, que
 *     separaba el contador del título hasta dejar un agujero en medio.
 *     Ahora el bloque de texto es una unidad, apoyada en la foto.
 */

type Disposicion = { celda: string; destacada?: boolean };

/** Teselado sin huecos de 4 columnas × 2 filas: la primera ocupa
 *  2×2 y las otras cuatro rellenan las dos columnas de la derecha. */
const DISPOSICION: Record<string, Disposicion> = {
  elevacion: { celda: "lg:col-span-2 lg:row-span-2", destacada: true },
  manipulacion: { celda: "lg:col-span-1" },
  "movimiento-tierras": { celda: "lg:col-span-1" },
  energia: { celda: "lg:col-span-1" },
  compactacion: { celda: "lg:col-span-1" },
};

const EN_BENTO = [
  "elevacion",
  "manipulacion",
  "movimiento-tierras",
  "energia",
  "compactacion",
] as const;

export function Necesidades() {
  const celdas = EN_BENTO.map((id) => FAMILIAS.find((f) => f.id === id)!);

  return (
    <section className="section-y border-b border-rule">
      <div className="container-placa">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div data-revelar>
            <h2 className="display-2 max-w-[30ch] text-ink">
              Dinos qué tienes que hacer. Nosotros ponemos la máquina.
            </h2>
            <p className="lede mt-4 max-w-[52ch] text-ink-2">
              Siete familias en un solo catálogo, filtrable por altura, carga,
              alimentación, terreno y delegación.
            </p>
          </div>
          <Link
            href="/alquiler"
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
          >
            Ver las siete familias
            <ArrowRight
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div
          className="mt-8 grid gap-px bg-rule md:grid-cols-2 lg:grid-cols-4"
          data-escalonar
        >
          {celdas.map((f) => {
            const unidades = ALQUILER.filter((m) => m.familia === f.id).length;
            const d = DISPOSICION[f.id] ?? { celda: "lg:col-span-1" };
            return (
              <Celda
                key={f.id}
                familia={f.id}
                slug={f.slug}
                titulo={f.necesidad}
                desc={f.necesidadDesc}
                rango={f.rango}
                unidades={unidades}
                clase={d.celda}
                destacada={d.destacada}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Celda({
  familia,
  slug,
  titulo,
  desc,
  rango,
  unidades,
  clase,
  destacada = false,
}: {
  familia: FamiliaId;
  slug: string;
  titulo: string;
  desc: string;
  rango: string;
  unidades: number;
  clase: string;
  destacada?: boolean;
}) {
  const foto = fotoFamilia(familia);

  return (
    <Link
      href={`/alquiler/${slug}`}
      className={`group relative flex flex-col overflow-hidden bg-surface transition-colors duration-200 hover:bg-sunken ${clase}`}
    >
      {/* La foto ocupa el hueco que sobra: en la celda destacada eso son
          dos filas de alto, y ahí la máquina se ve de verdad. */}
      <div
        className={`relative overflow-hidden bg-muted ${
          destacada ? "min-h-48 flex-1 lg:min-h-0" : "aspect-16/9"
        }`}
      >
        {foto ? (
          <Image
            src={foto.fichero}
            alt={`Maquinaria de la familia ${titulo.toLowerCase()}`}
            fill
            sizes={destacada ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
            className="object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
          />
        ) : (
          <span className="flex size-full items-center justify-center p-8">
            <SiluetaMaquina familia={familia} />
          </span>
        )}
        <span className="label-sm absolute top-0 left-0 bg-surface/95 px-2 py-1 text-ink-2">
          {unidades} modelo{unidades === 1 ? "" : "s"}
        </span>
      </div>

      {/* Bloque de texto compacto: título, una línea de explicación y el
          rango. Sin aire interpuesto entre las tres cosas. */}
      <div className="flex shrink-0 items-end justify-between gap-3 p-4">
        <div>
          <h3
            className={
              destacada
                ? "text-[clamp(1.375rem,2vw,1.875rem)] leading-tight font-bold tracking-[-0.02em] text-ink"
                : "title text-ink"
            }
          >
            {titulo}
          </h3>
          {destacada && (
            <p className="mt-2 max-w-[52ch] text-sm text-ink-2">{desc}</p>
          )}
          <p className="label-sm mt-2 text-ink-3">{rango}</p>
        </div>
        <ArrowRight
          size={20}
          strokeWidth={2}
          aria-hidden="true"
          className="mb-1 shrink-0 text-rule-strong transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent"
        />
      </div>
    </Link>
  );
}
