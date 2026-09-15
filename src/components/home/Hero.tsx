import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { EMPRESA, DELEGACIONES } from "@/content/es/empresa";
import { ALQUILER } from "@/lib/catalog";
import { heroPortada } from "@/lib/img/ambiente";
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
 * A SANGRE y a pantalla completa. Antes iba dentro de una placa con
 * margen y esquina blanda, y el efecto era el contrario del buscado: la
 * placa encogía la fotografía y la dejaba en una cajita en medio de la
 * página. Una fotografía de obra o llega a los cuatro bordes o no vale
 * la pena ponerla.
 *
 * El alto es `hero-alto`, que es `100svh` menos la cabecera fija y menos
 * la barra fija de móvil. Pantalla completa de verdad, pero la que se
 * VE: con `100vh` a secas, la cabecera de 108 px empuja el buscador
 * fuera del primer vistazo, que es justo el que decide el primer clic.
 * Y `svh` en vez de `vh` porque en móvil el navegador cuenta su propia
 * barra como retraída y corta el CTA.
 *
 * El texto sí va contenido: lo que sangra es la imagen. Un titular que
 * empieza a 8 px del borde de un monitor de 27 pulgadas no se lee.
 *
 * ---------------------------------------------------------------------
 * LA FOTOGRAFÍA
 *
 * Dos estados, y el componente elige solo:
 *
 *   · Si existe `public/img/hero/portada.jpg` —una fotografía de obra,
 *     de ambiente— se usa esa, el velo pasa a tinta y el texto a blanco.
 *   · Si no existe, se cae a la creatividad de estudio del cliente, que
 *     tiene fondo claro, así que el velo va en blanco y el texto en
 *     tinta.
 *
 * No hay que tocar nada para cambiar de uno a otro: basta con dejar el
 * archivo en su sitio. Medidas y encuadre, en `public/img/LEEME.md`.
 * ---------------------------------------------------------------------
 */

/** El respaldo: la creatividad de estudio, con fondo claro. */
const ESTUDIO = {
  src: "/img/maquinas/oficial/tarjeta/genie-gs-5390.webp",
  alt: "Plataforma de tijera diésel Genie GS-5390 de la flota de JOFEMESA",
  velo: "claro" as const,
  posicion: "object-[78%_center]",
};

/** La de ambiente, cuando está. Fondo de obra, así que velo en tinta. */
const AMBIENTE = {
  /* Genérica a propósito: el `alt` NO dice «nuestra máquina». Es una
     imagen de ambiente y afirmar lo contrario sería falso. */
  alt: "Plataforma elevadora de tijera trabajando en la estructura de una nave",
  velo: "oscuro" as const,
  /* 72% y no el centro: en móvil la sección es vertical y `object-cover`
     solo deja ver una franja estrecha de una foto horizontal. A 72% esa
     franja cae sobre la máquina —operario, barandilla, tijera y ruedas—
     en vez de sobre el cielo vacío. */
  posicion: "object-[72%_center]",
};

export function Hero() {
  const deObra = heroPortada();
  const HERO = deObra ? { ...AMBIENTE, src: deObra } : ESTUDIO;
  const oscuro = HERO.velo === "oscuro";

  return (
    <section
      className={`hero-alto relative isolate flex items-center overflow-hidden ${
        oscuro ? "bg-inverse" : "border-b border-rule bg-sunken"
      }`}
      {...(oscuro ? { "data-surface": "dark" } : {})}
    >
      {/* ---------- La fotografía, a los cuatro bordes ---------- */}
      <Image
        src={HERO.src}
        alt={HERO.alt}
        fill
        priority
        sizes="100vw"
        className={`-z-10 object-cover ${HERO.posicion}`}
      />

      {/* ---------- El velo ----------
          Dos direcciones y no una: en vertical sostiene el texto en
          móvil, donde la foto queda detrás del bloque entero, y en
          horizontal lo sostiene en escritorio, donde el texto ocupa la
          izquierda y la máquina se ve limpia a la derecha.

          Las paradas están MEDIDAS, no puestas a ojo: se compone el
          pixel real de la foto con el velo y se calcula el contraste del
          titular y de la entradilla en su peor punto. Bajar el velo
          enseña más foto pero tumba la entradilla por debajo del 4,5:1
          que exige la WCAG AA sin que se note a simple vista, así que si
          se cambia la fotografía hay que volver a medir.

          Con la foto actual y la sección a 1425×792: 11,3:1 el titular y
          6,1:1 la entradilla, con el 63% de la fotografía visible por la
          derecha. Se probó una parada más suave (52%/88%) que enseña el
          68% pero deja la entradilla en 5,0:1: pasa, pero sin margen
          para la siguiente foto. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 ${
          oscuro
            ? "bg-gradient-to-t from-inverse/96 via-inverse/86 to-inverse/50 lg:bg-gradient-to-r lg:from-inverse/96 lg:via-inverse/78 lg:via-56% lg:to-transparent lg:to-90%"
            : "bg-gradient-to-t from-white via-white/90 to-white/40 lg:bg-gradient-to-r lg:from-white lg:from-38% lg:via-white/80 lg:via-62% lg:to-transparent"
        }`}
      />

      {/* El texto SÍ va contenido: lo que sangra es la imagen. */}
      <div className="container-placa relative w-full py-14 md:py-16">
        <div className="max-w-[60ch] lg:max-w-[56%]">
          {/* Etiqueta de autoridad en pastilla. El «desde 1987» con peso
              propio, que es lo que se pidió. */}
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
            className={`display-1 mt-6 max-w-[24ch] ${
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
              className={`group inline-flex min-h-11 items-center gap-2 text-base font-semibold underline decoration-2 underline-offset-4 transition-colors duration-200 ${
                oscuro
                  ? "text-accent-dark hover:text-white"
                  : "text-accent hover:text-accent-hover"
              }`}
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
              className={`hidden min-h-11 items-center text-base underline decoration-2 underline-offset-4 transition-colors duration-200 md:inline-flex ${
                oscuro
                  ? "text-ink-inv-2 decoration-white/30 hover:text-ink-inv"
                  : "text-ink-2 decoration-rule-strong hover:text-ink"
              }`}
            >
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* Pista de scroll. Con el hero a pantalla completa deja de estar
          claro que abajo hay más, y esa duda cuesta visitas. Decorativa:
          no es un control, así que no entra en el orden de tabulación.
          Se queda quieta con prefers-reduced-motion. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-5 hidden justify-center lg:flex ${
          oscuro ? "text-ink-inv-3" : "text-ink-3"
        }`}
      >
        <ChevronDown
          size={22}
          strokeWidth={1.75}
          className="motion-safe:animate-[latir-abajo_2.4s_ease-in-out_infinite]"
        />
      </div>
    </section>
  );
}
