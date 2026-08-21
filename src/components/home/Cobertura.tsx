import Link from "next/link";
import { Phone } from "lucide-react";
import { DELEGACIONES, LEMA } from "@/content/es/empresa";

/**
 * S6 · Cobertura. Demostrar que "disponibilidad" es una promesa que
 * respalda un parque físico y una persona, no un formulario automático.
 *
 * Nueve delegaciones en dos columnas de tarjetas con 20px de padding
 * ocupaban tres pantallas de alto para decir nueve nombres y nueve
 * teléfonos. Ahora es lo que realmente es: un listado. Cuatro columnas,
 * filete de 1px como separación y el teléfono como el dato grande de
 * cada celda, porque el teléfono es la acción.
 */
export function Cobertura() {
  return (
    <section
      data-surface="dark"
      className="ambient-dark section-y border-b border-rule-inverse text-ink-inv-2"
    >
      <div className="container-placa">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div data-revelar>
            <h2 className="display-2 max-w-[20ch] text-ink-inv">
              Más cerca de donde empieza el trabajo
            </h2>
            <p className="lede mt-4 max-w-[52ch]">
              Cuando pides una máquina, la confirma una persona de la
              delegación que la tiene. No un formulario automático.
            </p>
          </div>

          <div className="shrink-0 lg:text-right" data-revelar>
            <p className="value-lg text-accent-dark">{LEMA}</p>
            <Link
              href="/consultar-disponibilidad"
              className="btn-accent mt-5 inline-flex h-13 items-center bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              Consultar disponibilidad
            </Link>
          </div>
        </div>

        <ul
          className="mt-8 grid gap-px bg-rule-inverse md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-escalonar
        >
          {DELEGACIONES.map((d) => (
            <li key={d.id} className="bg-inverse-2 px-4 py-3.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-base font-semibold text-ink-inv">
                  {d.nombre}
                </p>
                {d.pais === "Portugal" && (
                  <span className="label-sm shrink-0 bg-wait px-1.5 py-0.5 text-wait-ink">
                    Nuevo
                  </span>
                )}
              </div>

              {d.localidad && (
                <p className="mt-0.5 truncate text-sm text-ink-inv-3">
                  {d.localidad}
                </p>
              )}

              {d.tel ? (
                <a
                  href={`tel:${d.tel}`}
                  className="value mt-2 inline-flex min-h-11 items-center gap-2 text-ink-inv-2 transition-colors duration-200 hover:text-accent-dark"
                >
                  <Phone
                    size={14}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="shrink-0"
                  />
                  {d.telefono}
                </a>
              ) : (
                <p className="mt-2 flex min-h-11 items-center text-sm text-ink-inv-3">
                  Contacto pendiente de confirmar
                </p>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm text-ink-inv-3">
          No publicamos horarios que no podamos garantizar: llama a la
          delegación y te lo confirmamos en el momento.
        </p>
      </div>
    </section>
  );
}
