"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { DELEGACIONES_POR_ID } from "@/content/es/empresa";
import {
  ALQUILER,
  contarFacetas,
  filtrar,
  filtrosQueMasExcluyen,
  FILTROS_VACIOS,
  FAMILIA_POR_ID,
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

export function AlquilerCliente({
  familiaFija,
}: {
  familiaFija?: string | null;
}) {
  const [p, setP] = useQueryStates(PARSERS_FILTROS, OPCIONES_FILTROS);
  const [hojaAbierta, setHojaAbierta] = useState(false);

  const filtros: Filtros = useMemo(
    () => ({
      ...FILTROS_VACIOS,
      familia: (familiaFija ?? p.fam) as Filtros["familia"],
      subcategoria: p.sub,
      energia: p.energia as Filtros["energia"],
      entorno: p.uso as Filtros["entorno"],
      delegacion: p.del as Filtros["delegacion"],
      alturaMin: p.hmin,
      alturaMax: p.hmax,
      cargaMin: p.carga,
      texto: p.q,
      orden: p.orden as OrdenId,
    }),
    [familiaFija, p],
  );

  const resultados = useMemo(() => filtrar(ALQUILER, filtros), [filtros]);
  const cuentas = useMemo(() => contarFacetas(ALQUILER, filtros), [filtros]);
  const rescates = useMemo(
    () => (resultados.length === 0 ? filtrosQueMasExcluyen(ALQUILER, filtros) : []),
    [resultados.length, filtros],
  );

  const alterna = (lista: string[], v: string) =>
    lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v];

  const acciones: AccionesFiltro = {
    familia: (id) => setP({ fam: familiaFija ? null : id, sub: null }),
    subcategoria: (slug) => setP({ sub: slug }),
    energia: (v) => setP({ energia: alterna(p.energia, v) }),
    uso: (v) => setP({ uso: alterna(p.uso, v) }),
    delegacion: (v) => setP({ del: alterna(p.del, v) }),
    altura: (min, max) => setP({ hmin: min, hmax: max }),
  };

  /* ---------- chips de filtros activos ---------- */
  const chips: { etiqueta: string; quitar: () => void }[] = [];
  if (p.fam && !familiaFija)
    chips.push({
      etiqueta: FAMILIA_POR_ID[p.fam as keyof typeof FAMILIA_POR_ID]?.nombre ?? p.fam,
      quitar: () => setP({ fam: null, sub: null }),
    });
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
  for (const d of p.del)
    chips.push({
      etiqueta:
        DELEGACIONES_POR_ID[d as keyof typeof DELEGACIONES_POR_ID]?.nombre ?? d,
      quitar: () => setP({ del: p.del.filter((x) => x !== d) }),
    });
  if (p.q)
    chips.push({ etiqueta: `“${p.q}”`, quitar: () => setP({ q: null }) });

  const limpiarTodo = () =>
    setP({
      fam: familiaFija ? undefined : null,
      sub: null,
      energia: [],
      uso: [],
      del: [],
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
    <div className="container-placa grid gap-10 py-10 lg:grid-cols-12 lg:gap-8">
      {/* ---------- Raíl de escritorio ---------- */}
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <h2 className="label mb-4 text-ink-3">Filtros</h2>
          {panel}
        </div>
      </aside>

      <div className="lg:col-span-9">
        {/* ---------- Barra de control ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="value text-ink" aria-live="polite">
            {resultados.length}{" "}
            <span className="text-base font-normal text-ink-2">
              {resultados.length === 1 ? "máquina" : "máquinas"}
            </span>
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHojaAbierta(true)}
              className="inline-flex min-h-11 items-center gap-2 border border-rule-control px-4 text-base font-semibold text-ink lg:hidden"
            >
              <SlidersHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />
              Filtrar
              {chips.length > 0 && (
                <span className="value bg-accent px-1.5 text-sm text-white">
                  {chips.length}
                </span>
              )}
            </button>

            <label className="flex items-center gap-2">
              <span className="label-sm hidden text-ink-3 md:inline">Ordenar</span>
              <select
                value={p.orden}
                onChange={(e) => setP({ orden: e.target.value as OrdenId })}
                className="min-h-11 border border-rule-control bg-surface px-3 text-base text-ink"
              >
                {Object.entries(ETIQUETAS_ORDEN).map(([v, t]) => (
                  <option key={v} value={v}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* ---------- Chips activos ---------- */}
        {chips.length > 0 && (
          <ul className="mt-5 flex flex-wrap items-center gap-2">
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
          <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-escalonar>
            {resultados.map((m, i) => (
              <li key={m.slug}>
                <TarjetaMaquina maquina={m} prioridad={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 border border-rule bg-sunken p-8">
            <HexagonoRelleno aria-hidden="true" className="size-8 text-rule-strong" />
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
                            sub: "subcategoria" in q ? null : p.sub,
                            q: "texto" in q ? null : p.q,
                          });
                        }}
                        className="inline-flex min-h-12 items-center border border-rule-control bg-surface px-4 text-base font-semibold text-ink transition-colors duration-200 hover:bg-muted"
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
      </div>

      {/* ---------- Hoja de filtros en móvil ---------- */}
      {hojaAbierta && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => setHojaAbierta(false)}
            className="absolute inset-0 bg-inverse/70"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col bg-surface">
            <div className="flex items-center justify-between border-b border-rule px-5 py-3">
              <h2 className="label text-ink">Filtros</h2>
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
                className="btn-accent flex h-14 flex-1 items-center justify-center bg-accent text-base font-semibold text-white"
              >
                Ver {resultados.length}{" "}
                {resultados.length === 1 ? "máquina" : "máquinas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Buscador de texto, arriba de la página de Alquiler. */
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
        placeholder="Buscar por marca o modelo: Genie, GS-3268, Manitou…"
        className={cn(
          "h-14 w-full border border-rule-control bg-surface pr-4 pl-12",
          "text-base text-ink placeholder:text-ink-3 focus:outline-none",
        )}
      />
    </div>
  );
}
