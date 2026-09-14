"use client";

import { useId } from "react";
import Link from "next/link";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MARCAS, type Filtros } from "@/lib/catalog";
import {
  ETIQUETAS_ENERGIA,
  ETIQUETAS_USO,
  TRAMOS_ALTURA,
} from "@/lib/filters/params";

type Cuentas = {
  familia: Record<string, number>;
  energia: Record<string, number>;
  entorno: Record<string, number>;
  marca: Record<string, number>;
};

export interface AccionesFiltro {
  energia: (v: string) => void;
  uso: (v: string) => void;
  marca: (v: string | null) => void;
  altura: (min: number | null, max: number | null) => void;
  texto: (v: string | null) => void;
}

/**
 * Panel de filtros TÉCNICOS.
 *
 * La reunión separó los dos planos: «un filtro de las categorías previo
 * y el filtro técnico a la izquierda con el buscador». Así que la
 * familia y la subcategoría ya no están aquí —viven en las tiras de
 * arriba, que además tienen URL propia para campañas— y este panel se
 * queda con lo que de verdad es técnico: modelo, alimentación, altura,
 * uso y fabricante.
 *
 * El buscador por modelo va DENTRO del panel y es el primer campo. Eso
 * resuelve la pega que se detectó en móvil —«el filtro oculta el
 * buscador… tendría que estar visible»—: al abrir la hoja de filtros en
 * el móvil, lo primero que aparece es el campo de búsqueda.
 *
 * Se ha quitado el filtro de delegación. Ninguna máquina está asignada
 * a un parque concreto porque el cliente no publica ese dato, así que
 * era un filtro que salía siempre con las diez marcadas y no descartaba
 * nada: ruido con aspecto de función. La delegación se elige donde sí
 * significa algo, que es el formulario.
 *
 * Dos reglas que no se saltan:
 *
 *   1. Las opciones con cero resultados se DESHABILITAN en gris, no se
 *      eliminan: quitarlas hace creer que el filtro se ha roto.
 *   2. Casillas cuadradas de 24 px con área táctil de 44: un cuadrado se
 *      encuentra con guante puesto, una marca de verificación no.
 */
export function PanelFiltros({
  filtros,
  cuentas,
  acciones,
}: {
  filtros: Filtros;
  cuentas: Cuentas;
  acciones: AccionesFiltro;
}) {
  const idBusqueda = useId();

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {/* ---------- Búsqueda por modelo ---------- */}
      <div className="py-5">
        <label htmlFor={idBusqueda} className="label block text-ink">
          Búsqueda por modelo
        </label>
        <div className="relative mt-3">
          <Search
            size={17}
            strokeWidth={1.75}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3"
          />
          <input
            id={idBusqueda}
            type="search"
            value={filtros.texto ?? ""}
            onChange={(e) => acciones.texto(e.target.value || null)}
            placeholder="GS-4390, Manitou, tijera diésel…"
            className="h-12 w-full border border-rule-control bg-surface pr-3 pl-10 text-base text-ink placeholder:text-ink-3"
          />
        </div>
      </div>

      {/* ---------- Alimentación ---------- */}
      <Grupo titulo="Tipo de energía">
        <ul>
          {Object.entries(ETIQUETAS_ENERGIA).map(([id, etiqueta]) => (
            <li key={id}>
              <Casilla
                etiqueta={etiqueta}
                cuenta={cuentas.energia[id] ?? 0}
                marcado={filtros.energia.includes(id as never)}
                onChange={() => acciones.energia(id)}
              />
            </li>
          ))}
        </ul>
      </Grupo>

      {/* ---------- Altura de trabajo ---------- */}
      <Grupo titulo="Altura de trabajo">
        <ul>
          {TRAMOS_ALTURA.map((t) => {
            const activo =
              filtros.alturaMin === (t.min ?? null) &&
              filtros.alturaMax === (t.max ?? null);
            return (
              <li key={t.label}>
                <Radio
                  nombre="altura"
                  etiqueta={t.label}
                  marcado={activo}
                  onChange={() =>
                    activo
                      ? acciones.altura(null, null)
                      : acciones.altura(t.min ?? null, t.max ?? null)
                  }
                  sinCuenta
                />
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-sm text-ink-3">
          Las máquinas que no tienen altura de trabajo —carretillas,
          excavadoras, compactación— quedan fuera de este filtro.
        </p>
      </Grupo>

      {/* ---------- Uso ---------- */}
      <Grupo titulo="Uso">
        <ul>
          {Object.entries(ETIQUETAS_USO).map(([id, etiqueta]) => (
            <li key={id}>
              <Casilla
                etiqueta={etiqueta}
                cuenta={cuentas.entorno[id] ?? 0}
                marcado={filtros.entorno.includes(id as never)}
                onChange={() => acciones.uso(id)}
              />
            </li>
          ))}
        </ul>
      </Grupo>

      {/* ---------- Fabricante ---------- */}
      <Grupo titulo="Fabricante">
        <label className="block">
          <span className="sr-only">Fabricante</span>
          <select
            value={filtros.marca ?? ""}
            onChange={(e) => acciones.marca(e.target.value || null)}
            className="h-12 w-full border border-rule-control bg-surface px-3 text-base text-ink"
          >
            <option value="">Todos los fabricantes</option>
            {MARCAS.map((m) => {
              const n = cuentas.marca[m] ?? 0;
              return (
                <option key={m} value={m} disabled={n === 0}>
                  {m} ({n})
                </option>
              );
            })}
          </select>
        </label>
      </Grupo>

      {/* ---------- Salida al asesor ---------- */}
      <div className="py-5">
        <div className="border border-rule bg-sunken p-4">
          <p className="flex items-center gap-2 text-base font-semibold text-ink">
            <Sparkles
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="shrink-0 text-accent"
            />
            ¿Dudas con la maquinaria?
          </p>
          <p className="mt-2 text-sm text-ink-2">
            Cuéntanos la altura y el tipo de suelo en tres preguntas y te
            decimos qué encaja.
          </p>
          <Link
            href="/asesor"
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 bg-ink text-base font-semibold text-white transition-colors duration-200 hover:bg-inverse-2"
          >
            Iniciar asistente
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- piezas ---------- */

function Grupo({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <details open className="group py-5">
      <summary className="label flex cursor-pointer list-none items-center justify-between text-ink marker:hidden">
        {titulo}
        <span
          aria-hidden="true"
          className="text-ink-3 transition-transform duration-200 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function Casilla({
  etiqueta,
  cuenta,
  marcado,
  onChange,
  sinCuenta = false,
}: {
  etiqueta: string;
  cuenta?: number;
  marcado: boolean;
  onChange: () => void;
  sinCuenta?: boolean;
}) {
  const vacio = !sinCuenta && cuenta === 0 && !marcado;
  return (
    <label
      className={cn(
        "flex min-h-12 cursor-pointer items-center gap-3 text-base",
        vacio ? "cursor-not-allowed text-ink-3" : "text-ink-2 hover:text-ink",
      )}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={marcado}
        disabled={vacio}
        onChange={onChange}
      />
      <span
        aria-hidden="true"
        className={cn(
          "flex size-6 shrink-0 items-center justify-center border-2 transition-colors duration-200",
          marcado ? "border-ink bg-ink text-white" : "border-rule-control",
          vacio && "border-rule opacity-50",
        )}
      >
        {marcado && (
          <svg viewBox="0 0 16 16" className="size-4" fill="none">
            <path
              d="M3 8.5 6.5 12 13 4.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="flex-1">{etiqueta}</span>
      {!sinCuenta && (
        <span className="value text-sm text-ink-3">{cuenta ?? 0}</span>
      )}
    </label>
  );
}

function Radio({
  nombre,
  etiqueta,
  cuenta,
  marcado,
  onChange,
  sinCuenta = false,
}: {
  nombre: string;
  etiqueta: string;
  cuenta?: number;
  marcado: boolean;
  onChange: () => void;
  sinCuenta?: boolean;
}) {
  const vacio = !sinCuenta && cuenta === 0 && !marcado;
  return (
    <label
      className={cn(
        "flex min-h-12 cursor-pointer items-center gap-3 text-base",
        vacio ? "cursor-not-allowed text-ink-3" : "text-ink-2 hover:text-ink",
        marcado && "font-semibold text-ink",
      )}
    >
      <input
        type="radio"
        name={nombre}
        className="sr-only"
        checked={marcado}
        disabled={vacio}
        onChange={onChange}
      />
      <span
        aria-hidden="true"
        className={cn(
          "size-6 shrink-0 border-2 transition-colors duration-200",
          marcado
            ? "border-accent bg-accent shadow-[inset_0_0_0_3px_#fff]"
            : "border-rule-control",
          vacio && "border-rule opacity-50",
        )}
      />
      <span className="flex-1">{etiqueta}</span>
      {!sinCuenta && (
        <span className="value text-sm text-ink-3">{cuenta ?? 0}</span>
      )}
    </label>
  );
}
