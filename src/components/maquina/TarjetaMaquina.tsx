"use client";

import Link from "next/link";
import { Check, FileText, Columns3, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SPEC_POR_KEY, type Maquina } from "@/lib/catalog/types";
import { specsDestacadas } from "@/lib/catalog";
import { SUBCATEGORIA_POR_SLUG } from "@/lib/catalog/familias";
import { useComparar, MAX_COMPARAR } from "@/lib/compare/context";
import { ImagenMaquina } from "./ImagenMaquina";
import { DatoValor } from "@/components/spec/DatoValor";

/**
 * El componente más repetido de la web, así que está especificado al
 * detalle.
 *
 * Las tres acciones son las que se aprobaron en la reunión del
 * 24/08/2026 mirando la versión de Emilio —«tú aquí tienes consultar
 * disponibilidad; tú aquí tienes ficha y comparar»— con la corrección
 * que se dio allí mismo sobre el botón de ficha:
 *
 *   «adaptado, a lo mejor el tema de ficha, aunque quede peor, pues
 *   tiene que ir en rojo; de primeras iría incluso así».
 *
 * Así que FICHA va en rojo de marca. Y sí, dos rojos en la misma
 * tarjeta serían dos llamadas compitiendo, así que el que cede es el
 * otro: «Consultar disponibilidad» pasa a negro de tinta. La jerarquía
 * se mantiene —el rojo sigue siendo uno solo por tarjeta— y se respeta
 * la instrucción.
 *
 * La tarjeta NO es un enlace gigante: tiene cuatro objetivos táctiles
 * distintos —imagen y título, casilla de comparar, ficha y CTA— sin
 * interactivos anidados.
 */
export function TarjetaMaquina({
  maquina: m,
  sizes = "(min-width:1280px) 300px, (min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw",
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

  return (
    <article
      className={cn(
        "group flex h-full flex-col border border-rule bg-surface",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
        "transition-[border-color,box-shadow] duration-200 hover:border-rule-strong",
      )}
    >
      {/* ---------- La foto manda ---------- */}
      <div className="relative aspect-4/3 overflow-hidden border-b border-rule bg-muted">
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
            className="transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
          />
        </Link>

        {subcat && (
          <span className="label-sm absolute top-0 left-0 z-1 bg-surface/95 px-2 py-1.5 text-ink-2">
            {subcat.nombre}
          </span>
        )}

        {m.gama && (
          <span className="label-sm absolute bottom-0 left-0 z-1 bg-wait px-2 py-1 text-wait-ink">
            Gama
          </span>
        )}

        {/* Casilla de comparar SIEMPRE visible: nunca revelada al hover.
            Un cuadrado se encuentra con guante; una marca de
            verificación no. */}
        <label
          className={cn(
            "absolute top-1 right-1 z-2 flex size-11 cursor-pointer items-center justify-center",
            bloqueada && "cursor-not-allowed",
          )}
          title={
            bloqueada
              ? `Máximo ${MAX_COMPARAR} máquinas — quita una para añadir otra`
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
          className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-100"
        />
      </div>

      {/* ---------- Cuerpo ---------- */}
      <div className="flex flex-1 flex-col p-4">
        <p className="label-sm text-ink-3">{m.marca}</p>
        <h3 className="title mt-1 text-ink">
          {/* `min-h-11` hace dos trabajos y ninguno es decorativo: da los
              44px de objetivo táctil que exige el proyecto —un nombre de
              una línea mide 22px— y reserva el alto de dos líneas, así
              que un modelo de nombre corto no descuadra la rejilla
              frente al de al lado. No quitarlo para ganar altura. */}
          <Link
            href={`/maquina/${m.slug}`}
            className="flex min-h-11 items-start [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden transition-colors duration-200 hover:text-accent"
          >
            {m.modelo}
          </Link>
        </h3>

        {/* Franja de exactamente tres specs, en versalitas tabulares. */}
        <dl className="mt-3 grid grid-cols-3 divide-x divide-rule border-y border-rule">
          {specs.map((k) => {
            const def = SPEC_POR_KEY[k];
            return (
              <div
                key={k}
                className="flex flex-col justify-between px-2 py-2 first:pl-0 last:pr-0"
              >
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

        <p className="mt-3 line-clamp-2 flex-1 text-sm text-ink-2">
          {m.descripcionCorta}
        </p>

        {/* ---------- Las tres acciones ---------- */}
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* FICHA en rojo, por indicación expresa de la reunión. */}
            <Link
              href={`/maquina/${m.slug}`}
              className="btn-accent flex h-11 items-center justify-center gap-1.5 bg-accent text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:bg-accent-active"
            >
              <FileText size={15} strokeWidth={2} aria-hidden="true" />
              Ficha
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>

            <button
              type="button"
              onClick={() => alternar(m.slug)}
              disabled={bloqueada}
              aria-pressed={marcada}
              className={cn(
                "flex h-11 items-center justify-center gap-1.5 border text-sm font-semibold transition-colors duration-200",
                marcada
                  ? "border-ink bg-ink text-white"
                  : "border-rule-control text-ink hover:bg-sunken",
                bloqueada && "cursor-not-allowed opacity-50",
              )}
            >
              {marcada ? (
                <Check size={15} strokeWidth={2.5} aria-hidden="true" />
              ) : (
                <Columns3 size={15} strokeWidth={2} aria-hidden="true" />
              )}
              {marcada ? "Comparando" : "Comparar"}
            </button>
          </div>

          <Link
            href={`/consultar-disponibilidad?m=${m.slug}`}
            className="flex h-12 items-center justify-center bg-ink text-base font-semibold text-white transition-colors duration-200 hover:bg-inverse-2"
          >
            Consultar disponibilidad
          </Link>
        </div>
      </div>
    </article>
  );
}
