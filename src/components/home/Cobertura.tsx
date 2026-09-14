import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { DELEGACIONES, LEMA } from "@/content/es/empresa";
import { Mapa } from "@/components/marca/Mapa";

/**
 * S6 · Cobertura.
 *
 * En la reunión se decidió que las delegaciones tienen que estar en la
 * portada —«¿en la home?» «claro»— y además con pestaña propia en el
 * menú. Y se decidió que el sitio del contacto en la portada lo ocupan
 * las delegaciones: «yo esto lo metería aquí, en vez del contacto».
 *
 * Lo que demuestra esta sección es que «disponibilidad» es una promesa
 * que respalda un parque físico y una persona, no un formulario
 * automático. Por eso el teléfono es el dato grande de cada celda: el
 * teléfono es la acción.
 */
export function Cobertura() {
  return (
    <section
      data-surface="dark"
      className="ambient-dark section-y border-b border-rule-inverse text-ink-inv-2"
    >
      <div className="container-placa">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div data-revelar>
              <p className="label text-accent-dark">Cobertura ibérica</p>
              <h2 className="display-2 mt-3 max-w-[22ch] text-ink-inv">
                Más cerca de donde empieza el trabajo
              </h2>
              <p className="lede mt-4 max-w-[52ch]">
                Cuando pides una máquina la confirma una persona de la
                delegación que la tiene, no un formulario automático.{" "}
                <span className="text-ink-inv">{LEMA}</span>
              </p>
            </div>

            <ul
              className="mt-7 grid gap-px bg-rule-inverse md:grid-cols-2 xl:grid-cols-3"
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
                        PT
                      </span>
                    )}
                  </div>

                  {d.localidad && (
                    <p className="mt-0.5 truncate text-sm text-ink-inv-3">
                      {d.localidad}
                    </p>
                  )}

                  <a
                    href={`tel:${d.tel}`}
                    className="value mt-1.5 inline-flex min-h-11 items-center gap-2 text-sm text-ink-inv-2 transition-colors duration-200 hover:text-accent-dark"
                  >
                    <Phone
                      size={13}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="shrink-0"
                    />
                    {d.telefono}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
              <Link
                href="/consultar-disponibilidad"
                className="btn-accent inline-flex h-13 items-center justify-center bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover"
              >
                Consultar disponibilidad
              </Link>
              <Link
                href="/delegaciones"
                className="group inline-flex min-h-11 items-center gap-2 text-base font-semibold text-ink-inv underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-dark"
              >
                Direcciones y teléfonos
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* El mapa. Decorativo en el sentido de que no aporta ningún
              dato que no esté en la lista de al lado, y necesario en el
              sentido de que responde de un vistazo a «¿me cogéis cerca?». */}
          <div
            className="order-first lg:order-none lg:col-span-5"
            data-revelar="escala"
          >
            <Mapa tono="oscuro" className="mx-auto w-full max-w-md" />
          </div>
        </div>

        <p className="mt-6 border-t border-rule-inverse pt-5 text-sm text-ink-inv-3">
          No publicamos horarios que no podamos garantizar: llama a la
          delegación y te lo confirmamos en el momento.
        </p>
      </div>
    </section>
  );
}
