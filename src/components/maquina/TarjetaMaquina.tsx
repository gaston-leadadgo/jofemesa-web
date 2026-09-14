"use client";

import Link from "next/link";
import { Check, Columns3, ArrowRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SPEC_POR_KEY, type Maquina } from "@/lib/catalog/types";
import { specsDestacadas } from "@/lib/catalog";
import { SUBCATEGORIA_POR_SLUG } from "@/lib/catalog/familias";
import { useComparar, MAX_COMPARAR } from "@/lib/compare/context";
import { ImagenMaquina } from "./ImagenMaquina";
import { EtiquetaEnergia } from "./EtiquetaEnergia";
import { DatoValor } from "@/components/spec/DatoValor";

/**
 * El componente más repetido de la web, así que está especificado al
 * detalle.
 *
 * La composición es la de la versión de Emilio, que es la que se aprobó:
 * cabecera con marca y modelo, etiqueta de alimentación a la derecha,
 * plataforma hundida para la foto, franja de tres cifras, una línea de
 * beneficio y dos acciones en pastilla.
 *
 * Dos cosas cambian respecto a esa versión, y las dos vienen de la
 * reunión del 24/08/2026:
 *
 *   1. FICHA va en rojo de marca. Literal: «adaptado, a lo mejor el
 *      tema de ficha, aunque quede peor, pues tiene que ir en rojo; de
 *      primeras iría incluso así».
 *   2. Y por eso «Consultar disponibilidad» cede y pasa a tinta: dos
 *      rojos en una tarjeta son dos llamadas compitiendo. Un rojo por
 *      tarjeta.
 *
 * La etiqueta de alimentación es nueva y es la que más se echaba en
 * falta: eléctrico, híbrido o diésel decide un alquiler antes que la
 * altura.
 *
 * La tarjeta NO es un enlace gigante: tiene cuatro objetivos táctiles
 * distintos —foto, título, comparar y las dos acciones— sin
 * interactivos anidados.
 */
export function TarjetaMaquina({
  maquina: m,
  sizes = "(min-width:1280px) 300px, (min-width:1024px) 30vw, (min-width:768px) 45vw, 92vw",
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
        "tarjeta group flex h-full flex-col gap-4 p-4 md:p-5",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
      )}
    >
      {/* ---------- Cabecera ---------- */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-sm text-ink-3">{m.marca}</p>
          {/* `min-h-11` hace dos trabajos y ninguno es decorativo: da los
              44px de objetivo táctil que exige el proyecto y reserva el
              alto de dos líneas, así que un modelo de nombre corto no
              descuadra la rejilla frente al de al lado. */}
          <h3 className="title mt-1">
            <Link
              href={`/maquina/${m.slug}`}
              className="flex min-h-11 items-start text-ink transition-colors duration-200 hover:text-accent"
            >
              <span className="[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                {m.modelo}
              </span>
            </Link>
          </h3>
          {subcat && (
            <p className="mt-0.5 truncate text-sm text-ink-3">
              {subcat.nombre}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <EtiquetaEnergia
            energia={m.facetas.energia}
            traccion={m.facetas.traccion}
          />
          {m.gama && (
            <span className="label-sm pastilla inline-flex items-center gap-1 border border-[#F3E0A8] bg-[#FFFBEB] px-2.5 py-1 text-[#7A5A00]">
              <Layers size={11} strokeWidth={2.25} aria-hidden="true" />
              Gama
            </span>
          )}
        </div>
      </div>

      {/* ---------- La plataforma de la foto ----------
          Alto FIJO y no proporción 4:3. Con 4:3 la tarjeta se iba a 670px
          en una columna de 390, y una rejilla de tarjetas de 670px se
          recorre a ciegas. 11rem es lo que usa la versión de Emilio y
          deja la tarjeta entera por debajo de 580px. */}
      <div className="panel relative h-44 overflow-hidden">
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
            className="p-3 transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.05]"
          />
        </Link>

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
              "flex size-6 items-center justify-center rounded-md border transition-colors duration-200",
              marcada
                ? "border-ink bg-ink text-white"
                : "border-rule-strong bg-surface/90",
              bloqueada && "opacity-40",
            )}
          >
            {marcada && <Check size={15} strokeWidth={3} aria-hidden="true" />}
          </span>
        </label>
      </div>

      {/* ---------- Las tres cifras que deciden ---------- */}
      <dl className="panel grid grid-cols-3 gap-2 px-2 py-2.5 text-center">
        {specs.map((k) => {
          const def = SPEC_POR_KEY[k];
          return (
            <div key={k} className="flex min-w-0 flex-col">
              <dd className="order-1">
                <DatoValor dato={m.specs[k]} def={def} />
              </dd>
              {/* Caja baja y sin recortar. En versalitas, «ALTURA
                  TRABAJO» no entra en un tercio de tarjeta y salía
                  «ALTURA TRA…», que no significa nada. En caja baja
                  entra, y si no entra parte en dos líneas y se lee. */}
              <dt className="order-2 mt-1 text-[0.6875rem] leading-tight font-medium text-ink-3">
                {def.etiquetaCorta ?? def.etiqueta}
              </dt>
            </div>
          );
        })}
      </dl>

      <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-ink-2">
        {m.descripcionCorta}
      </p>

      {/* ---------- Las tres acciones ---------- */}
      <div className="space-y-2 border-t border-rule pt-3">
        <div className="grid grid-cols-2 gap-2">
          {/* FICHA en rojo, por indicación expresa de la reunión. */}
          <Link
            href={`/maquina/${m.slug}`}
            className="btn-accent pastilla flex h-11 items-center justify-center gap-1.5 bg-accent text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:bg-accent-active"
          >
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
              "pastilla flex h-11 items-center justify-center gap-1.5 border text-sm font-semibold transition-colors duration-200",
              marcada
                ? "border-accent bg-accent-tint text-accent"
                : "border-rule-strong bg-sunken text-ink-2 hover:bg-muted hover:text-ink",
              bloqueada && "cursor-not-allowed opacity-50",
            )}
          >
            {marcada ? (
              <Check size={15} strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <Columns3 size={15} strokeWidth={2} aria-hidden="true" />
            )}
            {marcada ? "Añadida" : "Comparar"}
          </button>
        </div>

        <Link
          href={`/consultar-disponibilidad?m=${m.slug}`}
          className="pastilla flex h-11 items-center justify-center bg-ink text-sm font-semibold text-white transition-colors duration-200 hover:bg-inverse-2"
        >
          Consultar disponibilidad
        </Link>
      </div>
    </article>
  );
}
