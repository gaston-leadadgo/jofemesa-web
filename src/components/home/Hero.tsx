import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EMPRESA, DELEGACIONES } from "@/content/es/empresa";
import { ALQUILER } from "@/lib/catalog";
import { Buscador } from "./Buscador";

/**
 * S1 · Hero.
 *
 * Tres cosas salen de la reunión del 24/08/2026:
 *
 *   1. «Yo creo que tiene que ir una imagen, [sin ella] es muy pobre».
 *   2. «Que la búsqueda esté aquí, me gusta» + «incluso lo más pedido».
 *   3. «Le daría un poquito más de relevancia» a los años.
 *
 * La composición es una placa única de esquina blanda con la fotografía
 * a sangre dentro y el texto ENCIMA, sobre un velo que va de opaco a
 * transparente. No es decoración: con el texto fuera de la imagen hacen
 * falta dos columnas y la foto se queda en un cuarto de pantalla; con el
 * texto encima, la foto ocupa la placa entera y el titular se lee igual.
 *
 * ---------------------------------------------------------------------
 * CAMBIAR LA FOTOGRAFÍA
 *
 * Todo lo que hay que tocar está en `HERO`. La actual es la creatividad
 * de estudio que entregó el cliente: fondo claro, así que el velo va en
 * `claro` y el texto en tinta. Cuando llegue una fotografía de obra de
 * verdad —ambiente, hora dorada, máquina trabajando— se cambian `src`,
 * `alt` y `velo: "oscuro"`, y el componente invierte el texto a blanco
 * él solo. No hay que tocar nada más.
 * ---------------------------------------------------------------------
 */

const HERO = {
  src: "/img/maquinas/oficial/tarjeta/genie-gs-5390.webp",
  alt: "Plataforma de tijera diésel Genie GS-5390 de la flota de JOFEMESA",
  /** `claro` = velo blanco y texto en tinta. `oscuro` = lo contrario. */
  velo: "claro" as "claro" | "oscuro",
  /** Hacia dónde se aparta la máquina para dejar sitio al texto. */
  posicion: "object-[78%_center]",
};

export function Hero() {
  const oscuro = HERO.velo === "oscuro";

  return (
    <section className="border-b border-rule bg-surface">
      <div className="container-placa py-6 md:py-10 lg:py-12">
        <div
          className={`relative isolate overflow-hidden rounded-3xl ${
            oscuro ? "bg-inverse" : "bg-sunken"
          }`}
          {...(oscuro ? { "data-surface": "dark" } : {})}
        >
          {/* ---------- La fotografía, a sangre ---------- */}
          <Image
            src={HERO.src}
            alt={HERO.alt}
            fill
            priority
            sizes="100vw"
            className={`-z-10 object-cover ${HERO.posicion}`}
          />

          {/* ---------- El velo ----------
              Dos capas y no una: la vertical sostiene el texto en móvil,
              donde la foto queda detrás del bloque entero, y la
              horizontal lo sostiene en escritorio, donde el texto está a
              la izquierda y la máquina se ve limpia a la derecha. Los
              topes dejan la máquina sin velo por su lado. */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 -z-10 ${
              oscuro
                ? "bg-gradient-to-t from-inverse via-inverse/88 to-inverse/35 lg:bg-gradient-to-r lg:from-inverse lg:from-38% lg:via-inverse/75 lg:via-62% lg:to-transparent"
                : "bg-gradient-to-t from-white via-white/90 to-white/40 lg:bg-gradient-to-r lg:from-white lg:from-38% lg:via-white/80 lg:via-62% lg:to-transparent"
            }`}
          />

          <div className="relative px-6 py-10 md:px-10 md:py-12 lg:max-w-[58%] lg:px-12 lg:py-16">
            {/* Etiqueta de autoridad en pastilla. El «desde 1987» con
                peso propio, que es lo que se pidió. */}
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-2"
              data-revelar
            >
              <span
                className={`label pastilla inline-flex items-center gap-2 border px-3 py-1.5 ${
                  oscuro
                    ? "border-white/20 bg-white/10 text-ink-inv-2"
                    : "border-rule bg-surface text-ink-2"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-accent"
                />
                Desde {EMPRESA.fundacion} especialistas en maquinaria
              </span>
              <span
                className={`label hidden md:inline ${
                  oscuro ? "text-ink-inv-3" : "text-ink-3"
                }`}
              >
                España y Portugal
              </span>
            </div>

            <h1
              className={`display-1 mt-6 max-w-[26ch] ${
                oscuro ? "text-ink-inv" : "text-ink"
              }`}
              data-revelar
              style={{ "--retardo": 1 } as React.CSSProperties}
            >
              Alquiler de maquinaria para que tu obra no se pare.
            </h1>

            <p
              className={`mt-5 max-w-[52ch] text-base leading-relaxed lg:text-lg ${
                oscuro ? "text-ink-inv-2" : "text-ink-2"
              }`}
              data-revelar
              style={{ "--retardo": 2 } as React.CSSProperties}
            >
              Plataformas elevadoras, manipuladores, carretillas, movimiento de
              tierras y energía. {ALQUILER.length} referencias y{" "}
              {DELEGACIONES.length} delegaciones propias con flota, taller y
              camiones.
            </p>

            <div
              className="mt-7 max-w-xl"
              data-revelar
              style={{ "--retardo": 3 } as React.CSSProperties}
            >
              <Buscador />
            </div>

            <div
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2"
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
                className={`hidden min-h-11 items-center text-base underline decoration-rule-strong decoration-2 underline-offset-4 transition-colors duration-200 md:inline-flex ${
                  oscuro
                    ? "text-ink-inv-2 hover:text-ink-inv"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                Ver todo el catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
