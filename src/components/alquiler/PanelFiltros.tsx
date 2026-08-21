"use client";

import { cn } from "@/lib/utils/cn";
import { DELEGACIONES_OPERATIVAS } from "@/content/es/empresa";
import { FAMILIAS } from "@/lib/catalog/familias";
import type { Filtros } from "@/lib/catalog";
import {
  ETIQUETAS_ENERGIA,
  ETIQUETAS_USO,
  TRAMOS_ALTURA,
} from "@/lib/filters/params";

type Cuentas = {
  familia: Record<string, number>;
  energia: Record<string, number>;
  entorno: Record<string, number>;
};

export interface AccionesFiltro {
  familia: (id: string | null) => void;
  subcategoria: (slug: string | null) => void;
  energia: (v: string) => void;
  uso: (v: string) => void;
  delegacion: (v: string) => void;
  altura: (min: number | null, max: number | null) => void;
}

/**
 * Panel de facetas. Dos reglas que no se saltan:
 *
 * 1. Las opciones con cero resultados se DESHABILITAN en gris, no se
 *    eliminan: quitarlas hace creer al usuario que el filtro se ha roto.
 * 2. Casillas cuadradas de 24px con área táctil de 44: un cuadrado se
 *    encuentra con guante puesto, una marca de verificación no.
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
  const familia = FAMILIAS.find((f) => f.id === filtros.familia);

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {/* ---------- Familia ---------- */}
      <Grupo titulo="Tipo de máquina">
        <ul>
          <li>
            <Radio
              nombre="familia"
              etiqueta="Todas las familias"
              cuenta={Object.values(cuentas.familia).reduce((a, b) => Math.max(a, b), 0)}
              marcado={!filtros.familia}
              onChange={() => acciones.familia(null)}
              sinCuenta
            />
          </li>
          {FAMILIAS.map((f) => (
            <li key={f.id}>
              <Radio
                nombre="familia"
                etiqueta={f.nombre}
                cuenta={cuentas.familia[f.id] ?? 0}
                marcado={filtros.familia === f.id}
                onChange={() => acciones.familia(f.id)}
              />
            </li>
          ))}
        </ul>
      </Grupo>

      {/* ---------- Subcategoría: solo si hay familia elegida ---------- */}
      {familia && (
        <Grupo titulo={`Dentro de ${familia.nombre.toLowerCase()}`}>
          <ul>
            <li>
              <Radio
                nombre="sub"
                etiqueta="Todas"
                marcado={!filtros.subcategoria}
                onChange={() => acciones.subcategoria(null)}
                sinCuenta
              />
            </li>
            {familia.subcategorias.map((s) => (
              <li key={s.slug}>
                <Radio
                  nombre="sub"
                  etiqueta={s.nombre}
                  marcado={filtros.subcategoria === s.slug}
                  onChange={() => acciones.subcategoria(s.slug)}
                  sinCuenta
                />
              </li>
            ))}
          </ul>
        </Grupo>
      )}

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
          Las máquinas cuya altura todavía no está confirmada quedan fuera de
          este filtro: preferimos no enseñártelas que darte una cifra que no
          hemos comprobado.
        </p>
      </Grupo>

      {/* ---------- Alimentación ---------- */}
      <Grupo titulo="Alimentación">
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

      {/* ---------- Delegación ---------- */}
      <Grupo titulo="Recogida en">
        <ul>
          {DELEGACIONES_OPERATIVAS.map((d) => (
            <li key={d.id}>
              <Casilla
                etiqueta={d.nombre}
                marcado={filtros.delegacion.includes(d.id)}
                onChange={() => acciones.delegacion(d.id)}
                sinCuenta
              />
            </li>
          ))}
        </ul>
      </Grupo>
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
