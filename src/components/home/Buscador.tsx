"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { FAMILIAS } from "@/lib/catalog/familias";

/**
 * El buscador ES el CTA del hero.
 *
 * Se quedó tal cual en la reunión del 24/08/2026 —«que la búsqueda esté
 * aquí, me gusta» y «incluso lo más pedido»— con dos correcciones de
 * maquetación que se vieron al montarlo:
 *
 *   1. Fuera el selector de delegación. Ocupaba 17 rem al lado del
 *      campo de texto y dejaba el campo en «¿Qué máquina n…», que es el
 *      elemento que de verdad convierte. Y además no filtraba nada:
 *      todas las delegaciones sirven todo el catálogo. La delegación se
 *      elige donde significa algo, que es el formulario.
 *   2. El campo de texto ocupa todo el ancho disponible y el botón se
 *      queda con lo justo, en una sola línea.
 *
 * Los atajos de «lo más pedido» NO son un dato de ventas: son las
 * cuatro búsquedas que resuelven de un clic las cuatro entradas más
 * habituales al catálogo. La etiqueta dice «empieza por» y no «lo más
 * alquilado» justamente por eso.
 */

const ATAJOS = [
  { texto: "Tijera eléctrica", q: "tijeras electricas" },
  { texto: "Brazo diésel 4x4", q: "brazos articulados diesel" },
  { texto: "Manipulador telescópico", q: "manipuladores telescopicos" },
  { texto: "Retroexcavadora", q: "retroexcavadoras" },
] as const;

export function Buscador() {
  const router = useRouter();
  const [texto, setTexto] = useState("");

  function buscar(consulta = texto) {
    const p = new URLSearchParams();
    if (consulta.trim()) p.set("q", consulta.trim());
    router.push(`/alquiler${p.size ? `?${p}` : ""}`);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          buscar();
        }}
        className="flex flex-col border border-rule-control bg-surface shadow-[0_1px_0_0_rgba(20,23,26,.04)] transition-shadow duration-200 focus-within:shadow-[0_0_0_3px_rgba(227,6,19,.12)] md:flex-row"
      >
        <div className="relative min-w-0 flex-1 border-b border-rule md:border-r md:border-b-0">
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

        <button
          type="submit"
          className="btn-accent group flex h-14 shrink-0 items-center justify-center gap-2 bg-accent px-6 text-base font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover active:bg-accent-active"
        >
          Ver disponibilidad
          <ArrowRight
            size={18}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </form>

      {/* Esta línea evita la mitad de los rebotes de quien busca un precio. */}
      <p className="mt-3 text-sm text-ink-2">
        Sin precios online: te confirmamos disponibilidad y presupuesto por
        teléfono o email.
      </p>

      {/* Los cuatro atajos, pero en móvil en UNA fila que se arrastra.
          Envueltos ocupaban tres filas a 375 px y empujaban la foto del
          hero fuera de la pantalla; el hero tiene que caber en un
          vistazo. En tableta y escritorio ya envuelven con normalidad. */}
      {/* La etiqueta se alinea con la PRIMERA fila de atajos, no con el
          centro del bloque: cuando envuelven en dos filas, centrada
          quedaba flotando entre las dos. */}
      <div className="mt-3 flex items-start gap-2">
        <span className="label-sm mt-3.5 shrink-0 text-ink-3">Empieza por</span>
        <div className="pista-horizontal flex min-w-0 gap-2 overflow-x-auto md:flex-wrap md:overflow-visible">
          {ATAJOS.map((a) => (
            <button
              key={a.texto}
              type="button"
              onClick={() => buscar(a.q)}
              className={cn(
                "min-h-11 shrink-0 border border-rule bg-sunken px-3 text-sm whitespace-nowrap text-ink-2",
                "transition-colors duration-200 hover:border-rule-control hover:bg-surface hover:text-ink",
              )}
            >
              {a.texto}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
