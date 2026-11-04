import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { CENTROS } from "@/content/es/empresa";
import { CarruselFabricantes } from "@/components/home/CarruselFabricantes";

/**
 * S2 · Distribuciones oficiales.
 *
 * Va justo debajo del hero, y va ahí por una razón comercial: ser partner
 * oficial de Jungheinrich y distribuidor oficial de Takeuchi es lo único
 * de esta web que un competidor no puede copiar. Antes esto estaba a
 * media página de profundidad, dentro de un párrafo de la sección de
 * autoridad y en una línea de texto entre nueve marcas más. Ahora tiene
 * su propia banda, su logotipo a tamaño legible y su salida.
 *
 * La distinción importa y se rotula: **partner** de Jungheinrich (su
 * catálogo completo, incluida la gama reacondicionada JUNGSTARS),
 * **distribuidor oficial** de Takeuchi, con centro propio, y distribuidor
 * de Riversa en Valencia. Lo demás son fabricantes de la flota, que es
 * otra cosa, y por eso van debajo, en una tira de logotipos en gris
 * (`CarruselFabricantes`).
 */

const TAKEUCHI = CENTROS.find((c) => c.id === "takeuchi");

/**
 * Las tres distribuciones con la misma estructura: etiqueta, caja de logo
 * de alto fijo y texto, para que el texto empiece a la misma altura en las
 * tres (cliente, 04/11/2026).
 *
 * Los logotipos tienen proporciones muy distintas (Jungheinrich es 6,7
 * veces más ancho que alto; Riversa, 2,8). A la misma altura el ancho
 * pesaría el doble que el compacto, así que el alto sale de un área visual
 * común, `AREA / proporción`, dentro de una caja de `CAJA` px. Los tres son
 * SVG oficiales: Jungheinrich de Wikimedia Commons, Takeuchi de
 * takeuchiglobal.com (solo el rótulo, sin el cuadrado rojo, como pidió el
 * cliente el 05/11/2026) y Riversa de riversa.es.
 */
const AREA = 6200;
const CAJA = 48;

const DISTRIBUCIONES = [
  {
    id: "jungheinrich",
    etiqueta: "Partner oficial",
    logo: { src: "/marca/jungheinrich.svg", alt: "Jungheinrich", w: 283, h: 42 },
    texto:
      "Distribuimos todo el catálogo de Jungheinrich en manutención: contrapesadas eléctricas y diésel, mástil retráctil, trilaterales EKX y EFX, preparadoras de pedidos, transpaletas, apiladores y tractores de arrastre. También su gama reacondicionada JUNGSTARS.",
    enlace: { href: "/servicios#venta", texto: "Ver venta y recambios" },
  },
  {
    id: "takeuchi",
    etiqueta: "Distribuidor oficial",
    logo: { src: "/marca/takeuchi.svg", alt: "Takeuchi", w: 169, h: 17 },
    texto:
      "Distribución oficial de Takeuchi en retroexcavadoras y miniexcavadoras, con venta, recambio original y servicio técnico propio." +
      (TAKEUCHI ? ` Centro en ${TAKEUCHI.localidad}.` : ""),
    enlace: { href: "/servicios#venta", texto: "Ver el centro Takeuchi" },
  },
  {
    /* Nueva distribución, solo en Valencia (cliente, 04/11/2026). Los datos
       de Riversa salen de su web; el texto se ajusta cuando llegue su
       material. */
    id: "riversa",
    etiqueta: "Distribuidor en Valencia",
    logo: { src: "/marca/riversa.svg", alt: "Riversa", w: 451, h: 163 },
    texto:
      "Riversa importa y distribuye maquinaria profesional desde 1976, con marcas como Toro, Club Car, Avant y Greenmech. Desde nuestra delegación de Valencia distribuimos sus buggies.",
    enlace: { href: "/delegaciones#valencia", texto: "Ver la delegación de Valencia" },
  },
] as const;

export function Partners() {
  return (
    <section className="border-b border-rule bg-surface">
      <div className="container-placa py-10 md:py-12">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-2 lg:grid-cols-3">
          {DISTRIBUCIONES.map((d, i) => {
            const proporcion = d.logo.w / d.logo.h;
            const alto = Math.min(CAJA, Math.round(Math.sqrt(AREA / proporcion)));
            return (
              <div
                key={d.id}
                className={`flex flex-col bg-surface p-6 md:p-8${i === 2 ? " md:col-span-2 lg:col-span-1" : ""}`}
              >
                <p className="label flex items-center gap-2 text-accent">
                  <BadgeCheck size={15} strokeWidth={2.25} aria-hidden="true" />
                  {d.etiqueta}
                </p>
                {/* Caja de alto fijo: el logo va centrado en vertical y el
                    texto siempre empieza a la misma distancia. */}
                <div className="mt-5 flex items-center" style={{ height: CAJA }}>
                  <Image
                    src={d.logo.src}
                    alt={d.logo.alt}
                    width={d.logo.w}
                    height={d.logo.h}
                    unoptimized
                    className="w-auto max-w-full"
                    style={{ height: alto }}
                  />
                </div>
                <p className="mt-5 flex-1 text-base leading-relaxed text-ink-2">
                  {d.texto}
                </p>
                <Link
                  href={d.enlace.href}
                  className="group mt-6 inline-flex min-h-11 items-center gap-2 self-start text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
                >
                  {d.enlace.texto}
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Los fabricantes de la flota son otra cosa y se rotulan como
            tal: alquilamos su maquinaria, no los distribuimos. */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <h3 className="label shrink-0 text-ink-3">Nuestros fabricantes</h3>
          <div className="min-w-0 flex-1">
            <CarruselFabricantes />
          </div>
        </div>
      </div>
    </section>
  );
}
