"use client";

import { useId, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ALQUILER } from "@/lib/catalog";
import { SUBCATEGORIA_POR_SLUG } from "@/lib/catalog/familias";
import { MAX_COMPARAR } from "@/lib/compare/context";

/**
 * Añadir máquinas desde el propio comparador.
 *
 * Es una petición literal de la reunión del 24/08/2026: «aquí hay que
 * trabajar el comparador… aquí te añade uno, pero deberías poder añadir
 * desde el comparador ya más productos». Hasta ahora solo se podía
 * añadir desde la tarjeta del catálogo, así que para meter una cuarta
 * máquina había que volver atrás, buscarla y marcarla.
 *
 * Es un buscador con lista, no un `<select>` de 145 opciones: con ese
 * volumen un desplegable nativo obliga a recorrerlo a ciegas. Se
 * escribe «4390» o «tijera diésel» y quedan tres.
 */
export function AnadirMaquina({
  yaPuestas,
  onAnadir,
}: {
  yaPuestas: string[];
  onAnadir: (slug: string) => void;
}) {
  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);
  const id = useId();

  const lleno = yaPuestas.length >= MAX_COMPARAR;

  const candidatas = useMemo(() => {
    const q = texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .trim();

    return ALQUILER.filter((m) => {
      if (yaPuestas.includes(m.slug)) return false;
      if (!q) return true;
      const heno = `${m.marca} ${m.modelo} ${
        SUBCATEGORIA_POR_SLUG[m.subcategoriaSlug]?.nombre ?? ""
      }`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
      return q.split(/\s+/).every((t) => heno.includes(t));
    }).slice(0, 40);
  }, [texto, yaPuestas]);

  if (lleno) {
    return (
      <p className="border border-rule bg-sunken px-4 py-3 text-sm text-ink-2">
        Ya tienes {MAX_COMPARAR} máquinas, que es el máximo que cabe en una
        tabla legible. Quita una para añadir otra.
      </p>
    );
  }

  return (
    <div className="no-print border border-rule bg-sunken">
      <div className="relative">
        <label htmlFor={id} className="sr-only">
          Buscar una máquina para añadir a la comparación
        </label>
        <Search
          size={17}
          strokeWidth={1.75}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3"
        />
        <input
          id={id}
          type="search"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          placeholder={`Añadir máquina a la comparación (${yaPuestas.length}/${MAX_COMPARAR})`}
          role="combobox"
          aria-expanded={abierto}
          aria-controls={`${id}-lista`}
          aria-autocomplete="list"
          className="h-13 w-full bg-transparent pr-4 pl-11 text-base text-ink placeholder:text-ink-3 focus:outline-none"
        />
      </div>

      {abierto && (
        <ul
          id={`${id}-lista`}
          className="max-h-72 overflow-y-auto border-t border-rule"
        >
          {candidatas.length === 0 && (
            <li className="px-4 py-3 text-sm text-ink-3">
              Ninguna máquina cuadra con «{texto}».
            </li>
          )}
          {candidatas.map((m) => (
            <li key={m.slug} className="border-b border-rule last:border-b-0">
              <button
                type="button"
                onClick={() => {
                  onAnadir(m.slug);
                  setTexto("");
                  setAbierto(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200",
                  "hover:bg-surface",
                )}
              >
                <Plus
                  size={16}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="shrink-0 text-accent"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-ink">
                    {m.marca} {m.modelo}
                  </span>
                  <span className="label-sm block text-ink-3">
                    {SUBCATEGORIA_POR_SLUG[m.subcategoriaSlug]?.nombre}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
