import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { IconoMaquina } from "./IconoMaquina";
import type { IconoId } from "@/lib/catalog/types";

/**
 * La cabecera de las páginas interiores.
 *
 * Antes cada página interior era lo mismo: fondo blanco, una etiqueta
 * pequeña y un titular a `display-1` —hasta 88 px— sobre nada. Grande no
 * es lo mismo que bueno: un titular enorme flotando en blanco no da
 * jerarquía, da vacío, y en una tienda el primer pantallazo tiene que
 * vender, no presumir de tipografía.
 *
 * Esta placa hace tres cosas que aquella no hacía:
 *
 *   1. **Cambia de superficie.** Tinta sobre blanco durante toda la web,
 *      y aquí blanco sobre tinta. El contraste de superficie marca dónde
 *      empieza una sección mucho mejor que 30 px más de cuerpo. Es,
 *      además, el recurso de la versión de Emilio, que es la que gustó.
 *   2. **Trae dato.** Tres cifras verificables a la derecha —cuántas
 *      referencias, de qué altura a qué altura, cuántas delegaciones—.
 *      En alquiler de maquinaria eso es argumento de venta, no adorno.
 *   3. **Sale a algún sitio.** Toda cabecera termina en una acción.
 *
 * El titular baja de `display-1` a una escala propia con tope en 3,25rem:
 * la página interior no compite con la portada.
 */

export type DatoCabecera = { k: string; v: string };

export function CabeceraSeccion({
  kicker,
  titulo,
  lede,
  datos,
  icono,
  migas,
  cta,
  secundario,
  children,
  aside,
  className,
}: {
  /** Etiqueta corta en mono. Nunca «Sección 01»: dice de qué va esto. */
  kicker: string;
  titulo: React.ReactNode;
  lede?: React.ReactNode;
  /** Hasta tres cifras. Con menos de tres el raíl no se dibuja mal. */
  datos?: DatoCabecera[];
  /** Marca de agua: el dibujo de la familia, a escala de muro. */
  icono?: IconoId;
  migas?: React.ReactNode;
  cta?: { href: string; texto: string };
  secundario?: { href: string; texto: string };
  children?: React.ReactNode;
  /**
   * Ocupa la columna derecha entera, en lugar del raíl de cifras. Es
   * para piezas que necesitan sitio de verdad —el mapa de delegaciones—
   * y que colgando debajo del texto se quedaban en un cuarto de ancho
   * con media pantalla vacía al lado.
   */
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-surface="dark"
      className={cn(
        "ambient-dark relative overflow-hidden border-b border-rule-inverse text-ink-inv-2",
        className,
      )}
    >
      {/* Galón de marca a escala de muro. Decorativo y con paralaje:
          nunca lleva texto encima que se pueda desplazar al leer. */}
      <div
        aria-hidden="true"
        data-parallax="0.06"
        className="pointer-events-none absolute -top-20 -right-16 hidden w-[34rem] text-white/[0.035] lg:block"
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full">
          <path
            d="M20 10 L110 100 L20 190"
            stroke="currentColor"
            strokeWidth="26"
          />
          <path
            d="M90 10 L180 100 L90 190"
            stroke="currentColor"
            strokeWidth="26"
          />
        </svg>
      </div>

      <div className="container-placa relative py-9 md:py-12 lg:py-14">
        {migas && <div className="mb-5 text-ink-inv-3">{migas}</div>}

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="label flex items-center gap-3 text-accent-dark">
              {icono && (
                <IconoMaquina
                  icono={icono}
                  className="h-7 w-9 shrink-0"
                  aria-hidden="true"
                />
              )}
              {kicker}
            </p>

            <h1
              className="mt-4 max-w-[20ch] font-[family-name:var(--font-display)] text-[clamp(1.9rem,3.4vw,3.25rem)] leading-[1.0] font-extrabold tracking-[-0.03em] text-balance text-ink-inv"
              data-revelar
            >
              {titulo}
            </h1>

            {lede && (
              <p
                className="mt-5 max-w-[56ch] text-base leading-relaxed text-ink-inv-2 lg:text-lg"
                data-revelar
                style={{ "--retardo": 1 } as React.CSSProperties}
              >
                {lede}
              </p>
            )}

            {(cta || secundario) && (
              <div
                className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"
                data-revelar
                style={{ "--retardo": 2 } as React.CSSProperties}
              >
                {cta && (
                  <Link
                    href={cta.href}
                    className="btn-accent inline-flex h-13 items-center justify-center gap-2 bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
                  >
                    {cta.texto}
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </Link>
                )}
                {secundario && (
                  <Link
                    href={secundario.href}
                    className="group inline-flex min-h-11 items-center gap-2 text-base font-semibold text-ink-inv underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-dark"
                  >
                    {secundario.texto}
                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                )}
              </div>
            )}

            {children}
          </div>

          {aside && (
            <div className="lg:col-span-5 lg:self-center">{aside}</div>
          )}

          {!aside && datos && datos.length > 0 && (
            <div className="lg:col-span-5 lg:self-end">
              <dl
                className="grid grid-cols-3 gap-px border border-rule-inverse bg-white/10 overflow-hidden rounded-2xl"
                data-escalonar
              >
                {datos.slice(0, 3).map((d) => (
                  <div key={d.k} className="bg-inverse px-3 py-4 md:px-4">
                    <dt className="label-sm text-ink-inv-3">{d.k}</dt>
                    {/* `text-balance` reparte las dos líneas de un valor
                        largo («Desde 4,5 m hasta 57 m») en vez de dejar
                        una palabra suelta abajo. */}
                    <dd className="value mt-2 text-[clamp(0.95rem,1.5vw,1.3rem)] leading-tight font-semibold text-balance text-ink-inv">
                      {d.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
