"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { DELEGACIONES_OPERATIVAS } from "@/content/es/empresa";
import { FAMILIAS } from "@/lib/catalog/familias";

/**
 * El buscador ES el CTA del hero.
 *
 * Dos decisiones de espacio, no de gusto: el hero tiene que caber en una
 * pantalla, así que en móvil el selector de delegación y los atajos se
 * retiran —los dos están completos en /alquiler— y quedan el campo de
 * texto y el botón, que son los que convierten.
 *
 * El `select` va a 17rem y no a 14: "Todas las delegaciones" mide unos
 * 175px y con menos ancho el navegador lo cortaba a media palabra.
 */

const ATAJOS = [
  "Tijera eléctrica",
  "Brazo diésel 4x4",
  "Manipulador 14 m",
  "Miniexcavadora",
] as const;

export function Buscador() {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [delegacion, setDelegacion] = useState("");

  function buscar(consulta = texto, deleg = delegacion) {
    const p = new URLSearchParams();
    if (consulta.trim()) p.set("q", consulta.trim());
    if (deleg) p.set("del", deleg);
    router.push(`/alquiler${p.size ? `?${p}` : ""}`);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          buscar();
        }}
        className="border border-rule-control bg-surface shadow-[0_1px_0_0_rgba(20,23,26,.04)] transition-shadow duration-200 focus-within:shadow-[0_0_0_3px_rgba(227,6,19,.12)]"
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative flex-1 border-b border-rule md:border-r md:border-b-0">
            <label htmlFor="busca-maquina" className="sr-only">
              ¿Qué máquina necesitas?
            </label>
            <Search
              size={18}
              strokeWidth={1.75}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3"
            />
            <input
              id="busca-maquina"
              type="search"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="¿Qué máquina necesitas?"
              list="familias-sugeridas"
              className="h-14 w-full bg-transparent pr-4 pl-11 text-base text-ink placeholder:text-ink-3 focus:outline-none"
            />
            <datalist id="familias-sugeridas">
              {FAMILIAS.flatMap((f) =>
                f.subcategorias.map((s) => (
                  <option key={s.slug} value={s.nombre} />
                )),
              )}
            </datalist>
          </div>

          {/* Se retira en móvil para que el hero quepa en una pantalla.
              El filtro completo por delegación vive en /alquiler. */}
          <div className="relative hidden md:block md:w-[17rem] md:border-r md:border-rule">
            <label htmlFor="busca-delegacion" className="sr-only">
              Delegación
            </label>
            <MapPin
              size={18}
              strokeWidth={1.75}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3"
            />
            <select
              id="busca-delegacion"
              value={delegacion}
              onChange={(e) => setDelegacion(e.target.value)}
              className="h-14 w-full cursor-pointer appearance-none bg-transparent pr-10 pl-11 text-base text-ink focus:outline-none"
            >
              <option value="">Todas las delegaciones</option>
              {DELEGACIONES_OPERATIVAS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-3"
            />
          </div>

          <button
            type="submit"
            className="btn-accent group flex h-14 items-center justify-center gap-2 bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:bg-accent-active"
          >
            Ver disponibilidad
            <ArrowRight
              size={18}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </form>

      {/* Esta línea evita la mitad de los rebotes de quien busca un precio. */}
      <p className="mt-3 text-sm text-ink-2">
        Sin precios online: te confirmamos disponibilidad y presupuesto por
        teléfono o email.
      </p>

      <div className="mt-3 hidden flex-wrap items-center gap-2 md:flex">
        <span className="label-sm text-ink-3">Lo más pedido</span>
        {ATAJOS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setTexto(s);
              buscar(s);
            }}
            className="min-h-11 border border-rule bg-sunken px-3 text-sm text-ink-2 transition-colors duration-200 hover:border-rule-control hover:bg-surface hover:text-ink"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
