"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { listaEs } from "@/lib/utils/format";
import { DELEGACIONES_POR_ID } from "@/content/es/empresa";
import { SPEC_POR_KEY, type Maquina } from "@/lib/catalog/types";
import { specsDestacadas } from "@/lib/catalog";
import { SUBCATEGORIA_POR_SLUG } from "@/lib/catalog/familias";
import { useComparar } from "@/lib/compare/context";
import { ImagenMaquina } from "./ImagenMaquina";
import { DatoValor } from "@/components/spec/DatoValor";

/**
 * El componente más repetido de la web, así que está especificado al detalle.
 *
 * La tarjeta NO es un enlace gigante: tiene tres objetivos táctiles distintos
 * — imagen y título, casilla de comparar, y el CTA — sin interactivos anidados.
 */
export function TarjetaMaquina({
  maquina: m,
  sizes = "(min-width:1440px) 300px, (min-width:1024px) 30vw, (min-width:768px) 45vw, 92vw",
  prioridad = false,
}: {
  maquina: Maquina;
  sizes?: string;
  prioridad?: boolean;
}) {
  const { contiene, alternar, lleno } = useComparar();
  const marcada = contiene(m.slug);
  const bloqueada = lleno && !marcada;
  const specs = specsDestacadas(m);
  const subcat = SUBCATEGORIA_POR_SLUG[m.subcategoriaSlug];

  const nombres = m.delegaciones
    .map((d) => DELEGACIONES_POR_ID[d]?.nombre)
    .filter(Boolean) as string[];
  const disponibilidad =
    nombres.length >= 6
      ? "En todas las delegaciones"
      : listaEs(nombres.slice(0, 3)) +
        (nombres.length > 3 ? ` +${nombres.length - 3}` : "");

  return (
    <article
      className={cn(
        "group flex flex-col border border-rule bg-surface",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
        "transition-colors duration-200 hover:border-rule-strong",
      )}
    >
      {/* ---------- La foto manda: 4/3 y contain ---------- */}
      <div className="relative aspect-16/10 overflow-hidden border-b border-rule bg-muted">
        <Link
          href={`/maquina/${m.slug}`}
          className="absolute inset-0 block"
          tabIndex={-1}
          aria-hidden="true"
        >
          <ImagenMaquina
            maquina={m}
            sizes={sizes}
            prioridad={prioridad}
            className="transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
          />
        </Link>

        {subcat && (
          <span className="label-sm absolute top-0 left-0 z-1 bg-surface/95 px-2 py-1.5 text-ink-2">
            {subcat.nombre}
          </span>
        )}

        {/* Casilla de comparar SIEMPRE visible: nunca revelada al hover.
            Un cuadrado se encuentra con guante; una marca de verificación no. */}
        <label
          className={cn(
            "absolute top-1 right-1 z-2 flex size-11 cursor-pointer items-center justify-center",
            bloqueada && "cursor-not-allowed",
          )}
          title={
            bloqueada
              ? `Máximo 4 máquinas — quita una para añadir otra`
              : marcada
                ? "Quitar del comparador"
                : "Añadir al comparador"
          }
        >
          <input
            type="checkbox"
            className="peer sr-only"
            checked={marcada}
            disabled={bloqueada}
            onChange={() => alternar(m.slug)}
            aria-label={`Comparar ${m.marca} ${m.modelo}`}
          />
          <span
            className={cn(
              "flex size-6 items-center justify-center border-2 transition-colors duration-200",
              marcada
                ? "border-ink bg-ink text-white"
                : "border-rule-control bg-surface/90",
              bloqueada && "opacity-40",
            )}
          >
            {marcada && <Check size={16} strokeWidth={3} aria-hidden="true" />}
          </span>
        </label>

        {/* El filete rojo barre el borde inferior al pasar por encima. */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-100"
        />
      </div>

      {/* ---------- Cuerpo ---------- */}
      <div className="flex flex-1 flex-col p-4">
        <p className="label-sm text-ink-3">{m.marca}</p>
        {/* Dos líneas de altura siempre reservadas: un nombre corto no
            desplaza la rejilla. */}
        <h3 className="title mt-1 text-ink">
          {/* `min-h-11` hace dos trabajos y ninguno es decorativo: da los
              44px de objetivo táctil que exige el proyecto —un nombre de una
              línea mide 22px— y reserva el alto de dos líneas, así que un
              modelo de nombre corto no descuadra la rejilla frente al de al
              lado. No quitarlo para ganar altura. */}
          <Link
            href={`/maquina/${m.slug}`}
            className="flex min-h-11 items-start [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden hover:text-accent"
          >
            {m.modelo}
          </Link>
        </h3>

        {/* Franja de exactamente tres specs, en versalitas tabulares. */}
        <dl className="mt-3 grid grid-cols-3 divide-x divide-rule border-y border-rule">
          {specs.map((k) => {
            const def = SPEC_POR_KEY[k];
            return (
              <div key={k} className="flex flex-col justify-between px-2 py-2 first:pl-0 last:pr-0">
                <dt className="label-sm leading-tight text-ink-3">
                  {def.etiqueta}
                </dt>
                <dd className="mt-1.5">
                  <DatoValor dato={m.specs[k]} def={def} />
                </dd>
              </div>
            );
          })}
        </dl>

        {/* Estado: marca cuadrada Y palabra. El color nunca es la señal. */}
        <p className="mt-3 flex items-start gap-2 text-sm text-ink-2">
          <span
            aria-hidden="true"
            className="mt-1 size-3.5 shrink-0 bg-ok"
          />
          {disponibilidad}
        </p>

        <Link
          href={`/consultar-disponibilidad?m=${m.slug}`}
          className="btn-accent mt-4 flex h-12 items-center justify-center bg-accent text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:bg-accent-active"
        >
          Consultar disponibilidad
        </Link>
      </div>
    </article>
  );
}
