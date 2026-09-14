"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  ALQUILER,
  contarFacetas,
  filtrar,
  filtrosQueMasExcluyen,
  FILTROS_VACIOS,
  SUBCATEGORIA_POR_SLUG,
  type Filtros,
  type OrdenId,
} from "@/lib/catalog";
import {
  ETIQUETAS_ENERGIA,
  ETIQUETAS_ORDEN,
  ETIQUETAS_USO,
  OPCIONES_FILTROS,
  PARSERS_FILTROS,
} from "@/lib/filters/params";
import { TarjetaMaquina } from "@/components/maquina/TarjetaMaquina";
import { HexagonoRelleno } from "@/components/marca/Hexagono";
import { PanelFiltros, type AccionesFiltro } from "./PanelFiltros";
import { TiraCategorias } from "./TiraCategorias";

/** Tarjetas por tanda. Tres filas completas en escritorio. */
const PASO = 24;

/**
 * El catálogo.
 *
 * Estructura aprobada en la reunión del 24/08/2026 —«UX de Emilio para
 * alquiler»—: tira de categorías arriba, filtro técnico con buscador a
 * la izquierda, tarjetas a la derecha.
 *
 * Y las tres correcciones de móvil que se anotaron allí:
 *
 *   1. Las tiras de categoría se arrastran y tienen flecha, así que se
 *      llega a todas (<TiraCategorias>).
 *   2. El buscador está DENTRO del panel de filtros, así que abrir la
 *      hoja de filtros en el móvil ya no lo esconde: es el primer campo.
 *   3. Y además hay un buscador compacto junto al botón «Filtrar», para
 *      no tener que abrir la hoja solo para escribir un modelo. Es
 *      literal del acta: «cuando metemos el filtro activo que te
 *      aparezca buscador al lado, para que puedas buscar directamente
 *      qué máquina quieres».
 */
export function AlquilerCliente({
  familiaFija,
}: {
  familiaFija?: string | null;
}) {
  const [p, setP] = useQueryStates(PARSERS_FILTROS, OPCIONES_FILTROS);
  const [hojaAbierta, setHojaAbierta] = useState(false);
  /**
   * Cuántas tarjetas se pintan. El catálogo tiene 145 referencias y
   * pintarlas todas de golpe son casi 6.000 nodos y 145 imágenes en un
   * móvil de obra. De 24 en 24, que es tres filas completas en
   * escritorio y suficiente para que el scroll no llegue nunca al final
   * sin querer.
   */
  const [visibles, setVisibles] = useState(PASO);

  const filtros: Filtros = useMemo(
    () => ({
      ...FILTROS_VACIOS,
      familia: (familiaFija ?? p.fam) as Filtros["familia"],
      subcategoria: p.sub,
      energia: p.energia as Filtros["energia"],
      entorno: p.uso as Filtros["entorno"],
      delegacion: p.del as Filtros["delegacion"],
      marca: p.marca,
      alturaMin: p.hmin,
      alturaMax: p.hmax,
      cargaMin: p.carga,
      texto: p.q,
      orden: p.orden as OrdenId,
    }),
    [familiaFija, p],
  );

  const resultados = useMemo(() => filtrar(ALQUILER, filtros), [filtros]);

  /* Cualquier cambio de filtro vuelve a empezar por arriba: si no, se
     queda enseñando 96 resultados de una búsqueda que ya no es esa. */
  const huella = JSON.stringify(filtros);
  const [huellaPrev, setHuellaPrev] = useState(huella);
  if (huella !== huellaPrev) {
    setHuellaPrev(huella);
    setVisibles(PASO);
  }

  const cuentas = useMemo(() => contarFacetas(ALQUILER, filtros), [filtros]);
  const rescates = useMemo(
    () =>
      resultados.length === 0 ? filtrosQueMasExcluyen(ALQUILER, filtros) : [],
    [resultados.length, filtros],
  );

  const alterna = (lista: string[], v: string) =>
    lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v];

  const acciones: AccionesFiltro = {
    energia: (v) => setP({ energia: alterna(p.energia, v) }),
    uso: (v) => setP({ uso: alterna(p.uso, v) }),
    marca: (v) => setP({ marca: v }),
    altura: (min, max) => setP({ hmin: min, hmax: max }),
    texto: (v) => setP({ q: v }),
  };

  /* ---------- chips de filtros activos ---------- */
  const chips: { etiqueta: string; quitar: () => void }[] = [];
  if (p.sub)
    chips.push({
      etiqueta: SUBCATEGORIA_POR_SLUG[p.sub]?.nombre ?? p.sub,
      quitar: () => setP({ sub: null }),
    });
  if (p.hmin != null || p.hmax != null)
    chips.push({
      etiqueta: `Altura ${p.hmin ?? 0}–${p.hmax ?? "+"} m`,
      quitar: () => setP({ hmin: null, hmax: null }),
    });
  for (const e of p.energia)
    chips.push({
      etiqueta: ETIQUETAS_ENERGIA[e] ?? e,
      quitar: () => setP({ energia: p.energia.filter((x) => x !== e) }),
    });
  for (const u of p.uso)
    chips.push({
      etiqueta: ETIQUETAS_USO[u] ?? u,
      quitar: () => setP({ uso: p.uso.filter((x) => x !== u) }),
    });
  if (p.marca)
    chips.push({ etiqueta: p.marca, quitar: () => setP({ marca: null }) });
  if (p.q)
    chips.push({ etiqueta: `«${p.q}»`, quitar: () => setP({ q: null }) });

  const limpiarTodo = () =>
    setP({
      fam: familiaFija ? undefined : null,
      sub: null,
      energia: [],
      uso: [],
      del: [],
      marca: null,
      hmin: null,
      hmax: null,
      carga: null,
      q: null,
    });

  // La hoja móvil bloquea el scroll del fondo mientras está abierta.
  useEffect(() => {
    document.body.style.overflow = hojaAbierta ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hojaAbierta]);

  const panel = (
    <PanelFiltros filtros={filtros} cuentas={cuentas} acciones={acciones} />
  );

  return (
    <>
      {/* ---------- Tiras de categoría, a todo el ancho ---------- */}
      <div className="border-b border-rule bg-surface">
        <div className="container-placa py-4">
          <TiraCategorias
            familiaActiva={familiaFija ?? p.fam}
            subActiva={p.sub}
            onSub={(slug) => setP({ sub: slug })}
          />
        </div>
      </div>

      <div className="container-placa grid gap-8 py-8 lg:grid-cols-12 lg:gap-8">
        {/* ---------- Raíl de escritorio ---------- */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
            <h2 className="label mb-4 text-ink-3">Filtros técnicos</h2>
            {panel}
          </div>
        </aside>

        <div className="lg:col-span-9">
          {/* ---------- Barra de control ----------
              En móvil son dos filas, no una: el contador y el orden
              arriba, y el buscador a ancho completo con el botón de
              filtrar al lado. Apretados en una sola fila, el campo de
              búsqueda se quedaba en 40 px —solo la lupa—, que es
              exactamente el problema que se pidió corregir. */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <p className="value text-ink" aria-live="polite">
                {resultados.length}{" "}
                <span className="text-base font-normal text-ink-2">
                  {resultados.length === 1 ? "máquina" : "máquinas"}
                </span>
              </p>

              <label className="flex shrink-0 items-center gap-2">
                <span className="label-sm hidden text-ink-3 lg:inline">
                  Ordenar
                </span>
                <select
                  value={p.orden}
                  onChange={(e) => setP({ orden: e.target.value as OrdenId })}
                  aria-label="Ordenar resultados"
                  className="min-h-11 max-w-52 border border-rule-control bg-surface px-2 text-base text-ink lg:px-3 pastilla"
                >
                  {Object.entries(ETIQUETAS_ORDEN).map(([v, t]) => (
                    <option key={v} value={v}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="relative min-w-0 flex-1">
                <label htmlFor="q-movil" className="sr-only">
                  Buscar por marca o modelo
                </label>
                <Search
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3"
                />
                <input
                  id="q-movil"
                  type="search"
                  value={p.q ?? ""}
                  onChange={(e) => setP({ q: e.target.value || null })}
                  placeholder="Buscar marca o modelo"
                  className="h-12 w-full min-w-0 border border-rule-control bg-surface pr-3 pl-9 text-base text-ink placeholder:text-ink-3 pastilla"
                />
              </div>

              <button
                type="button"
                onClick={() => setHojaAbierta(true)}
                className="inline-flex h-12 shrink-0 items-center gap-2 border border-rule-control px-3.5 text-base font-semibold text-ink pastilla"
              >
                <SlidersHorizontal
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                Filtrar
                {chips.length > 0 && (
                  <span className="value bg-accent px-1.5 text-sm text-white">
                    {chips.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ---------- Chips activos ---------- */}
          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((c, i) => (
                <li key={`${c.etiqueta}-${i}`}>
                  <button
                    type="button"
                    onClick={c.quitar}
                    className="inline-flex min-h-9 items-center gap-2 border border-rule bg-sunken px-3 text-sm text-ink transition-colors duration-200 hover:border-rule-strong"
                  >
                    {c.etiqueta}
                    <X size={14} strokeWidth={2.5} aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={limpiarTodo}
                  className="min-h-9 px-2 text-sm text-ink-2 underline decoration-2 underline-offset-4 hover:text-ink"
                >
                  Borrar todo ({chips.length})
                </button>
              </li>
            </ul>
          )}

          {/* ---------- Resultados ---------- */}
          {resultados.length > 0 ? (
            <ul
              className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              data-escalonar
            >
              {resultados.slice(0, visibles).map((m, i) => (
                <li key={m.slug} suppressHydrationWarning>
                  <TarjetaMaquina maquina={m} prioridad={i < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 border border-rule bg-sunken p-8">
              <HexagonoRelleno
                aria-hidden="true"
                className="size-8 text-rule-strong"
              />
              <p className="title mt-5 text-ink">
                Ninguna máquina con esos filtros.
              </p>
              {rescates.length > 0 && (
                <>
                  <p className="mt-3 text-base text-ink-2">
                    Quitando uno de estos vuelves a tener resultados:
                  </p>
                  <ul className="mt-4 flex flex-col items-start gap-3">
                    {rescates.map((r) => (
                      <li key={r.etiqueta}>
                        <button
                          type="button"
                          onClick={() => {
                            const q = r.quitar;
                            setP({
                              hmin: "alturaMin" in q ? null : p.hmin,
                              hmax: "alturaMax" in q ? null : p.hmax,
                              carga: "cargaMin" in q ? null : p.carga,
                              energia: "energia" in q ? [] : p.energia,
                              uso: "entorno" in q ? [] : p.uso,
                              del: "delegacion" in q ? [] : p.del,
                              marca: "marca" in q ? null : p.marca,
                              sub: "subcategoria" in q ? null : p.sub,
                              q: "texto" in q ? null : p.q,
                            });
                          }}
                          className="inline-flex min-h-12 items-center border border-rule-control bg-surface px-4 text-base font-semibold text-ink transition-colors duration-200 hover:bg-muted pastilla"
                        >
                          Quitar {r.etiqueta}
                          <span className="value ml-3 text-accent">
                            → {r.resultados}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="mt-6 text-base text-ink-2">
                O deja que te ayudemos:{" "}
                <Link
                  href="/asesor"
                  className="font-semibold text-accent underline decoration-2 underline-offset-4"
                >
                  dinos qué trabajo tienes
                </Link>{" "}
                y te decimos qué máquina encaja.
              </p>
            </div>
          )}
          {visibles < resultados.length && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setVisibles((v) => v + PASO)}
                className="inline-flex h-14 items-center border border-rule-control px-8 text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken pastilla"
              >
                Ver {Math.min(PASO, resultados.length - visibles)} máquinas más
              </button>
              <p className="label-sm text-ink-3">
                {visibles} de {resultados.length}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Hoja de filtros en móvil ---------- */}
      {hojaAbierta && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => setHojaAbierta(false)}
            className="absolute inset-0 bg-inverse/70 motion-safe:animate-[velo-entra_.2s_linear]"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col bg-surface motion-safe:animate-[hoja-entra_.26s_var(--ease-entrance)]">
            <div className="flex items-center justify-between border-b border-rule px-5 py-3">
              <h2 className="label text-ink">Filtros técnicos</h2>
              <button
                type="button"
                onClick={() => setHojaAbierta(false)}
                className="flex size-12 items-center justify-center text-ink"
                aria-label="Cerrar filtros"
              >
                <X size={22} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">{panel}</div>

            <div className="flex items-center gap-3 border-t border-rule px-5 py-3">
              <button
                type="button"
                onClick={limpiarTodo}
                className="min-h-12 px-3 text-base text-ink-2 underline decoration-2 underline-offset-4"
              >
                Borrar
              </button>
              {/* El contador ES el botón: el patrón de filtro móvil que
                  mejor convierte. */}
              <button
                type="button"
                onClick={() => setHojaAbierta(false)}
                className="btn-accent flex h-14 flex-1 items-center justify-center bg-accent text-base font-semibold text-white pastilla"
              >
                Ver {resultados.length}{" "}
                {resultados.length === 1 ? "máquina" : "máquinas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Buscador de texto de la cabecera de Alquiler. */
export function BuscadorCatalogo() {
  const [p, setP] = useQueryStates(PARSERS_FILTROS, OPCIONES_FILTROS);
  return (
    <div className="relative max-w-xl">
      <label htmlFor="q-catalogo" className="sr-only">
        Buscar por marca o modelo
      </label>
      <Search
        size={18}
        strokeWidth={1.75}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3"
      />
      <input
        id="q-catalogo"
        type="search"
        defaultValue={p.q ?? ""}
        onChange={(e) => setP({ q: e.target.value || null })}
        placeholder="Buscar por marca o modelo: Genie, GS-4390, Takeuchi…"
        className={cn(
          "h-14 w-full border border-rule-control bg-surface pr-4 pl-12 rounded-xl",
          "text-base text-ink placeholder:text-ink-3 focus:outline-none",
        )}
      />
    </div>
  );
}
