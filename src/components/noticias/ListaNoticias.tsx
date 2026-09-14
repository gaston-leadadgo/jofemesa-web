"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { fecha } from "@/lib/utils/format";
import {
  CATEGORIAS_NOTICIA,
  NOTICIAS,
  type CategoriaNoticia,
} from "@/content/es/noticias";

/**
 * El listado de noticias.
 *
 * Dos decisiones que vienen de la reunión:
 *
 *   · «Aquí hacemos que aparezcan 5 o 6, como mucho». Arrancan seis y
 *     el resto se piden. No es paginación: es que una portada de blog
 *     con catorce tarjetas no la lee nadie.
 *   · «Y que puedas filtrar por aquí». Se filtra por categoría y por
 *     delegación, que es lo que de verdad distingue unas entradas de
 *     otras en este blog: casi todas son un caso de éxito en una
 *     provincia concreta.
 *
 * Las opciones que darían cero se deshabilitan en gris, no se ocultan,
 * igual que en el catálogo: mover los filtros de sitio es peor que
 * dejar uno desactivado.
 */

const PASO = 6;

export function ListaNoticias() {
  const [categoria, setCategoria] = useState<CategoriaNoticia | null>(null);
  const [delegacion, setDelegacion] = useState<string | null>(null);
  const [visibles, setVisibles] = useState(PASO);

  const delegaciones = useMemo(
    () =>
      [...new Set(NOTICIAS.map((n) => n.delegacion).filter(Boolean))].sort() as string[],
    [],
  );

  const filtradas = useMemo(
    () =>
      NOTICIAS.filter(
        (n) =>
          (!categoria || n.categoria === categoria) &&
          (!delegacion || n.delegacion === delegacion),
      ),
    [categoria, delegacion],
  );

  const cuenta = (parcial: {
    categoria?: CategoriaNoticia | null;
    delegacion?: string | null;
  }) =>
    NOTICIAS.filter((n) => {
      const c = parcial.categoria !== undefined ? parcial.categoria : categoria;
      const d =
        parcial.delegacion !== undefined ? parcial.delegacion : delegacion;
      return (!c || n.categoria === c) && (!d || n.delegacion === d);
    }).length;

  const reiniciar = () => setVisibles(PASO);

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-rule pb-6">
        {/* Las dos etiquetas comparten anchura para que las dos filas de
            chips arranquen en la misma vertical, y se alinean con la
            PRIMERA fila: centradas, un bloque de chips de dos filas
            dejaba «Tema» flotando entre las dos. */}
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
          <span
            className="label-sm shrink-0 text-ink-3 md:mt-4 md:w-24"
            id="filtro-categoria"
          >
            Tema
          </span>
          <ul
            className="flex flex-wrap gap-2"
            aria-labelledby="filtro-categoria"
          >
            <li>
              <button
                type="button"
                aria-pressed={categoria === null}
                onClick={() => {
                  setCategoria(null);
                  reiniciar();
                }}
                className={cn(
                  "inline-flex min-h-11 items-center border px-3.5 text-sm transition-colors duration-200",
                  categoria === null
                    ? "border-ink bg-ink text-white"
                    : "border-rule bg-surface text-ink-2 hover:border-rule-control hover:text-ink",
                )}
              >
                Todos <span className="ml-1.5 value text-xs">{NOTICIAS.length}</span>
              </button>
            </li>
            {CATEGORIAS_NOTICIA.map((c) => {
              const n = cuenta({ categoria: c.id });
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    disabled={n === 0}
                    aria-pressed={categoria === c.id}
                    onClick={() => {
                      setCategoria(c.id);
                      reiniciar();
                    }}
                    className={cn(
                      "inline-flex min-h-11 items-center border px-3.5 text-sm transition-colors duration-200",
                      categoria === c.id
                        ? "border-ink bg-ink text-white"
                        : "border-rule bg-surface text-ink-2 hover:border-rule-control hover:text-ink",
                      n === 0 && "cursor-not-allowed opacity-40 hover:border-rule",
                    )}
                  >
                    {c.nombre} <span className="ml-1.5 value text-xs">{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
          <span
            className="label-sm shrink-0 text-ink-3 md:mt-4 md:w-24"
            id="filtro-delegacion"
          >
            Delegación
          </span>
          <ul
            className="flex flex-wrap gap-2"
            aria-labelledby="filtro-delegacion"
          >
            <li>
              <button
                type="button"
                aria-pressed={delegacion === null}
                onClick={() => {
                  setDelegacion(null);
                  reiniciar();
                }}
                className={cn(
                  "inline-flex min-h-11 items-center border px-3.5 text-sm transition-colors duration-200",
                  delegacion === null
                    ? "border-ink bg-ink text-white"
                    : "border-rule bg-surface text-ink-2 hover:border-rule-control hover:text-ink",
                )}
              >
                Todas
              </button>
            </li>
            {delegaciones.map((d) => {
              const n = cuenta({ delegacion: d });
              return (
                <li key={d}>
                  <button
                    type="button"
                    disabled={n === 0}
                    aria-pressed={delegacion === d}
                    onClick={() => {
                      setDelegacion(d);
                      reiniciar();
                    }}
                    className={cn(
                      "inline-flex min-h-11 items-center border px-3.5 text-sm transition-colors duration-200",
                      delegacion === d
                        ? "border-ink bg-ink text-white"
                        : "border-rule bg-surface text-ink-2 hover:border-rule-control hover:text-ink",
                      n === 0 && "cursor-not-allowed opacity-40 hover:border-rule",
                    )}
                  >
                    {d} <span className="ml-1.5 value text-xs">{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="label-sm mt-6 text-ink-3" aria-live="polite">
        {filtradas.length} entrada{filtradas.length === 1 ? "" : "s"}
      </p>

      <ul className="mt-4 grid gap-px bg-rule md:grid-cols-2 lg:grid-cols-3">
        {filtradas.slice(0, visibles).map((n) => (
          <li key={n.slug} className="bg-surface">
            <a
              href={n.url}
              target="_blank"
              rel="noopener"
              className="group flex h-full flex-col p-5 transition-colors duration-200 hover:bg-sunken md:p-6"
            >
              <span className="flex items-center gap-2.5">
                <span className="label-sm bg-sunken px-2 py-1 text-ink-2">
                  {CATEGORIAS_NOTICIA.find((c) => c.id === n.categoria)?.nombre}
                </span>
                {n.delegacion && (
                  <span className="label-sm text-ink-3">{n.delegacion}</span>
                )}
              </span>

              <h3 className="title mt-4 text-ink transition-colors duration-200 group-hover:text-accent">
                {n.titulo}
              </h3>
              <p className="mt-2.5 flex-1 text-sm text-ink-2">{n.entradilla}</p>

              <span className="mt-5 flex items-center justify-between gap-3 border-t border-rule pt-3.5">
                <time
                  dateTime={n.fecha}
                  className="label-sm flex items-center gap-1.5 text-ink-3"
                >
                  <Calendar size={13} strokeWidth={1.75} aria-hidden="true" />
                  {fecha(n.fecha)}
                </time>
                <ArrowUpRight
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="shrink-0 text-rule-strong transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
              </span>
            </a>
          </li>
        ))}
      </ul>

      {visibles < filtradas.length && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisibles((v) => v + PASO)}
            className="inline-flex h-14 items-center border border-rule-control px-8 text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken"
          >
            Ver {Math.min(PASO, filtradas.length - visibles)} entradas más
          </button>
        </div>
      )}

      {filtradas.length === 0 && (
        <div className="mt-8 border border-rule bg-sunken p-8 text-center">
          <p className="title text-ink">No hay entradas con ese filtro</p>
          <button
            type="button"
            onClick={() => {
              setCategoria(null);
              setDelegacion(null);
              reiniciar();
            }}
            className="mt-4 text-base font-semibold text-accent underline decoration-2 underline-offset-4"
          >
            Quitar los filtros
          </button>
        </div>
      )}
    </>
  );
}
