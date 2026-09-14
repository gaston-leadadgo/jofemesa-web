import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EMPRESA } from "@/content/es/empresa";
import { ALQUILER } from "@/lib/catalog";
import { Buscador } from "./Buscador";

/**
 * S1 · Hero.
 *
 * Tres cosas salen de la reunión del 24/08/2026:
 *
 *   1. «Yo creo que tiene que ir una imagen, [sin ella] es muy pobre».
 *      Y va una de verdad: una GS-5390 de la flota, con su rotulación
 *      de JOFEMESA. Lo que había antes era una foto de Wikimedia de una
 *      tijera con el logotipo de «renta» —una empresa de alquiler de la
 *      competencia— repetido tres veces.
 *   2. «Que la búsqueda esté aquí, me gusta» + «incluso lo más pedido».
 *      El buscador es el CTA del hero, con los atajos debajo.
 *   3. «Le daría un poquito más de relevancia» a los años. El «desde
 *      1987» deja de ser una línea de 13 px gris y pasa a ser un dato
 *      con su filete rojo.
 *
 * La foto es la de `tarjeta/` —4:3, la máquina entera— y NO la de
 * `recorte/`. El recorte automático partía la propia máquina: cortaba la
 * plataforma por arriba y metía en cuadro el trozo de otra unidad que hay
 * a la izquierda del original. Una foto de producto cortada por la mitad
 * dice más de la web que cualquier titular.
 *
 * La máquina no es decoración: lleva su pie, y el pie es un enlace a su
 * ficha. Es el primer producto de la tienda, no un adorno de fondo.
 */

/** La unidad que preside la portada. Su ficha existe: el pie enlaza a ella. */
const PROTAGONISTA = {
  slug: "genie-gs-5390",
  marca: "Genie",
  modelo: "GS-5390",
  pie: "Tijera diésel · 18 m de altura de trabajo",
  src: "/img/maquinas/oficial/tarjeta/genie-gs-5390.webp",
  alt: "Plataforma de tijera diésel Genie GS-5390 de la flota de JOFEMESA, con estabilizadores desplegados",
};

export function Hero() {
  return (
    <section className="ambient-light relative overflow-hidden border-b border-rule">
      {/* Galón de marca: el mismo ángulo del isotipo, a escala de muro y
          casi invisible. Es la única capa con paralaje —decorativa, nunca
          texto— y se queda quieta con prefers-reduced-motion. */}
      <div
        aria-hidden="true"
        data-parallax="0.08"
        className="pointer-events-none absolute -top-24 -right-24 -z-10 hidden w-[46rem] text-accent/[0.055] lg:block"
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

      <div className="container-placa relative">
        {/* `grid-cols-1` explícito y no la pista implícita: una pista
            `auto` se dimensiona por el contenido, así que el porcentaje
            de anchura de la foto quedaba indefinido y el navegador
            resolvía la pista a su min-content. Con `1fr` la pista la
            manda el contenedor. */}
        <div className="grid grid-cols-1 items-center gap-8 py-8 lg:grid-cols-12 lg:gap-10 lg:py-16 xl:gap-14">
          {/* ---------- Palabra ---------- */}
          <div className="lg:col-span-6 xl:col-span-6">
            <p
              className="label inline-flex items-baseline gap-2.5 border-l-2 border-accent pl-3 text-ink"
              data-revelar
            >
              <span className="value-lg text-accent">{EMPRESA.fundacion}</span>
              <span className="text-ink-2">Alquiler de maquinaria</span>
            </p>

            {/* Medida ancha a propósito: en dos líneas respira, y en tres
                de móvil sigue leyéndose de un vistazo. Un titular de seis
                líneas en una columna estrecha no es un titular. */}
            <h1
              className="mt-4 text-[clamp(2.1rem,4.6vw,3.75rem)] leading-[0.97] font-extrabold tracking-[-0.035em] text-balance text-ink lg:mt-5"
              data-revelar
              style={{ "--retardo": 1 } as React.CSSProperties}
            >
              Alquilamos la máquina que tu obra necesita hoy.
            </h1>

            <p
              className="mt-4 max-w-[48ch] text-base leading-relaxed text-ink-2 lg:mt-6 lg:text-xl"
              data-revelar
              style={{ "--retardo": 2 } as React.CSSProperties}
            >
              Plataformas, manipuladores, carretillas, tierras y energía.{" "}
              {ALQUILER.length} referencias y diez delegaciones propias en
              España y Portugal.
            </p>

            <div
              className="mt-6 lg:mt-8"
              data-revelar
              style={{ "--retardo": 3 } as React.CSSProperties}
            >
              <Buscador />
            </div>

            <div
              className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 lg:mt-6"
              data-revelar
              style={{ "--retardo": 4 } as React.CSSProperties}
            >
              <Link
                href="/asesor"
                className="group inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
              >
                No sé qué máquina necesito
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/alquiler"
                className="hidden min-h-11 items-center text-base text-ink-2 underline decoration-rule-strong decoration-2 underline-offset-4 transition-colors duration-200 hover:text-ink md:inline-flex"
              >
                Ver todo el catálogo
              </Link>
            </div>
          </div>

          {/* ---------- Máquina ----------
              Se sale del contenedor por la derecha en pantallas grandes:
              una foto de producto que toca el borde se lee como escaparate,
              y una encajada con margen a los dos lados, como un banner.

              La anchura va ESCRITA (`calc(100% + padding × 2)`) y no
              solo con márgenes negativos. Un elemento de rejilla tiene
              `min-width: auto`, así que se estira hasta su min-content:
              con la caja de proporción 4:3 dentro, el navegador resolvía
              698 px de ancho dentro de una pista de 320 y la foto salía
              recortada por los dos lados. Con la anchura escrita, la
              pista manda.

              Ojo con los espacios: en un valor arbitrario de Tailwind se
              escriben con guion bajo. `w-[calc(100%+2.5rem)]` no genera
              nada —`100%+2.5rem` no es CSS válido— y la clase muere en
              silencio, que es justo como se coló este fallo. */}
          <div
            className="-mx-5 w-[calc(100%_+_2.5rem)] min-w-0 md:-mx-8 md:w-[calc(100%_+_4rem)] lg:col-span-6 lg:mx-0 lg:w-auto lg:-mr-12 xl:col-span-6 xl:-mr-16"
            data-revelar="escala"
            style={{ "--retardo": 2 } as React.CSSProperties}
          >
            <figure className="group relative">
              <div className="relative aspect-[4/3] overflow-hidden border-y border-rule bg-sunken lg:border">
                <Image
                  src={PROTAGONISTA.src}
                  alt={PROTAGONISTA.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  /* Escala de partida 1,06: la creatividad original trae
                     margen blanco cocido alrededor de la máquina, y a 1:1
                     el hero enseñaba más fondo que tijera. Recorta margen,
                     no máquina. */
                  className="scale-[1.06] object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.1]"
                />
              </div>

              <figcaption className="border-b border-rule bg-surface lg:border-x lg:border-b">
                <Link
                  href={`/maquina/${PROTAGONISTA.slug}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-200 hover:bg-sunken lg:px-5"
                >
                  <span className="min-w-0">
                    <span className="label-sm block text-ink-3">
                      {PROTAGONISTA.marca}
                    </span>
                    <span className="title block truncate text-ink">
                      {PROTAGONISTA.modelo}
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-sm text-ink-2 md:block">
                    {PROTAGONISTA.pie}
                  </span>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="shrink-0 text-rule-strong transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-accent"
                  />
                </Link>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
