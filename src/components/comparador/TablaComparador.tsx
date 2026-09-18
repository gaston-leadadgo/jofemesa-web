"use client";

import { useMemo } from "react";
import Link from "next/link";
import { X, Printer } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getMaquinas, numeroDe } from "@/lib/catalog";
import { SPEC_DEFS } from "@/lib/catalog/types";
import { SUBCATEGORIA_POR_SLUG } from "@/lib/catalog/familias";
import { useComparar } from "@/lib/compare/context";
import { DatoValor } from "@/components/spec/DatoValor";
import { ImagenMaquina } from "@/components/maquina/ImagenMaquina";
import { HexagonoRelleno } from "@/components/marca/Hexagono";

/**
 * La tabla comparativa.
 *
 * La primera columna va fija (`sticky left-0`) y cada columna de máquina
 * hace `scroll-snap`: en móvil se avanza máquina a máquina, no píxel a
 * píxel. El mejor valor de cada fila lleva subrayado Y la etiqueta MÁX. —
 * marca y palabra, nunca solo color.
 *
 * Sin «Solo mostrar diferencias»: era una segunda decisión antes de poder
 * leer la tabla, y la comparación completa ya cabe en pantalla con hasta
 * cuatro máquinas, que es el máximo.
 */
export function TablaComparador({ slugs }: { slugs: string[] }) {
  const { quitar, limpiar } = useComparar();
  const maquinas = useMemo(() => getMaquinas(slugs), [slugs]);

  const filas = useMemo(() => {
    /* Una fila entra si ALGUNA de las máquinas comparadas tiene ahí un
       dato de verdad. Antes bastaba con que la clave existiera, y como
       las specs que no aplican existen como `na()` para poder poner la
       raya, comparar tres tijeras sacaba seis filas seguidas de rayas:
       profundidad de excavación, capacidad del cazo, caudal de aire…
       Ninguna tijera tiene nada de eso y nadie viene a comprobarlo.

       La raya SÍ se mantiene cuando la fila es mixta —una tijera contra
       una excavadora— porque ahí dice algo: esta máquina no juega en
       esta fila. */
    return SPEC_DEFS.filter((def) =>
      maquinas.some((m) => {
        const d = m.specs[def.key];
        return d && d.estado !== "no_aplica";
      }),
    );
  }, [maquinas]);

  if (maquinas.length === 0) return <Vacio />;

  /** Índices con el mejor valor de la fila, si la spec es comparable. */
  const mejores = (key: (typeof SPEC_DEFS)[number]["key"], mejor: "mayor" | "menor" | null) => {
    if (!mejor || maquinas.length < 2) return new Set<number>();
    const nums = maquinas.map((m) => numeroDe(m.specs[key]));
    const validos = nums.filter((n): n is number => n != null);
    if (validos.length < 2) return new Set<number>();
    const objetivo = mejor === "mayor" ? Math.max(...validos) : Math.min(...validos);
    return new Set(nums.map((n, i) => (n === objetivo ? i : -1)).filter((i) => i >= 0));
  };

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 items-center gap-2 text-base text-ink-2 underline decoration-2 underline-offset-4 hover:text-ink"
        >
          <Printer size={16} strokeWidth={1.75} aria-hidden="true" />
          Imprimir la comparación
        </button>

        <button
          type="button"
          onClick={limpiar}
          className="inline-flex min-h-11 items-center px-1 text-base text-ink-2 underline decoration-2 underline-offset-4 hover:text-ink"
        >
          Vaciar
        </button>
      </div>

      <div className="overflow-x-auto border border-rule" style={{ scrollSnapType: "x mandatory" }}>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Comparación técnica de {maquinas.length} máquinas
          </caption>

          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 w-32 min-w-32 border-r border-b border-ink bg-surface p-4 align-bottom md:w-52 md:min-w-52"
              >
                <span className="label text-ink-3">Especificación</span>
              </th>
              {maquinas.map((m) => (
                <th
                  key={m.slug}
                  scope="col"
                  className="w-60 min-w-60 border-b border-ink bg-surface p-4 align-bottom"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="relative h-32 overflow-hidden border border-rule bg-muted">
                    <ImagenMaquina maquina={m} sizes="240px" compacto />
                  </div>
                  <p className="label-sm mt-3 text-ink-3">
                    {SUBCATEGORIA_POR_SLUG[m.subcategoriaSlug]?.nombre}
                  </p>
                  <p className="mt-1 text-sm text-ink-2">{m.marca}</p>
                  <Link
                    href={`/maquina/${m.slug}`}
                    className="title block py-0.5 text-ink hover:text-accent"
                  >
                    {m.modelo}
                  </Link>
                  <Link
                    href={`/consultar-disponibilidad?m=${m.slug}`}
                    className="btn-accent no-print mt-3 flex h-11 items-center justify-center bg-accent text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
                  >
                    Consultar disponibilidad
                  </Link>
                  <button
                    type="button"
                    onClick={() => quitar(m.slug)}
                    className="no-print mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-2 underline decoration-2 underline-offset-4 hover:text-ink"
                  >
                    <X size={14} strokeWidth={2.5} aria-hidden="true" />
                    Quitar
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filas.map((def) => {
              const top = mejores(def.key, def.mejor);
              return (
                <tr key={def.key} className="border-b border-rule last:border-0">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-rule bg-surface p-4 align-middle"
                  >
                    <span className="text-sm font-semibold text-ink-2">
                      {def.etiqueta}
                    </span>
                  </th>
                  {maquinas.map((m, i) => (
                    <td
                      key={m.slug}
                      className="p-4 text-right align-middle"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <span className="inline-flex flex-wrap items-center justify-end gap-2">
                        <DatoValor
                          dato={m.specs[def.key]}
                          def={def}
                          className={cn(
                            top.has(i) &&
                              "border-b-2 border-ink pb-0.5",
                          )}
                        />
                        {top.has(i) && (
                          <span className="label-sm bg-ink px-1.5 py-0.5 text-white">
                            {def.mejor === "mayor" ? "Máx." : "Mín."}
                          </span>
                        )}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {maquinas.length === 1 && (
        <p className="mt-5 text-base text-ink-2">
          Añade al menos una máquina más para poder comparar.{" "}
          <Link
            href="/alquiler"
            className="font-semibold text-accent underline decoration-2 underline-offset-4"
          >
            Ir al catálogo
          </Link>
        </p>
      )}

      {maquinas.length > 1 && (
        <div className="no-print mt-8 border-t border-rule pt-6">
          <Link
            href={`/consultar-disponibilidad?m=${maquinas.map((m) => m.slug).join(",")}`}
            className="btn-accent inline-flex h-14 items-center bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
          >
            Consultar disponibilidad de las {maquinas.length}
          </Link>
        </div>
      )}
    </div>
  );
}

function Vacio() {
  return (
    <div className="flex flex-col items-start gap-5 border border-rule bg-sunken p-8">
      <HexagonoRelleno aria-hidden="true" className="size-8 text-rule-strong" />
      <p className="title text-ink">
        Marca dos o más máquinas para compararlas.
      </p>
      <p className="max-w-[52ch] text-base text-ink-2">
        En cada tarjeta del catálogo hay una casilla arriba a la derecha. Marca
        las que estés dudando y aquí verás sus fichas técnicas una junto a
        otra.
      </p>
      <Link
        href="/alquiler"
        className="btn-accent inline-flex h-12 items-center bg-accent px-5 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
      >
        Ir al catálogo
      </Link>
    </div>
  );
}
