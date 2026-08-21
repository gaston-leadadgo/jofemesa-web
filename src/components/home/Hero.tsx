import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Buscador } from "./Buscador";

/**
 * S1 · Hero a pantalla completa.
 *
 * `hero-alto` = 100svh menos la cabecera fija: todo lo que decide el
 * primer clic —titular, buscador y las dos salidas— entra sin scroll.
 * Es el requisito que manda sobre el resto: si algo no cabe, se recorta
 * el texto, no se empuja el buscador fuera de la pantalla.
 *
 * `svh` y no `vh` a propósito: en móvil `vh` cuenta la barra del
 * navegador como si estuviera retraída, y el CTA acaba cortado justo en
 * el vistazo que importa.
 */
export function Hero() {
  return (
    <section className="ambient-light hero-alto relative flex flex-col overflow-hidden border-b border-rule">
      {/* La máquina, a sangre por el borde derecho y a toda altura.
          Solo desde lg; en móvil va debajo, dentro de la misma pantalla. */}
      <div className="absolute inset-y-0 right-0 hidden w-[44%] border-l border-rule bg-muted lg:block xl:w-[46%]">
        <Image
          src="/img/maquinas/tijeras-electricas/tijeras-electricas-1.jpg"
          alt="Plataforma elevadora de tijera desplegada junto a una nave industrial"
          fill
          priority
          sizes="46vw"
          className="object-cover object-[38%_center]"
        />
        {/* Difuminado hacia la izquierda: cose la foto con la página en
            vez de dejar un corte duro a media pantalla. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent"
        />
      </div>

      <div className="container-placa relative flex shrink-0 items-center py-6 lg:flex-1 lg:py-10">
        <div className="w-full lg:grid lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label text-ink-2" data-revelar>
              Alquiler de maquinaria desde 1987
            </p>

            <h1
              className="mt-4 max-w-[17ch] text-[clamp(2.125rem,4.4vw,3.75rem)] leading-[0.98] font-extrabold tracking-[-0.03em] text-balance text-ink md:max-w-[22ch] lg:mt-5"
              data-revelar
              style={{ "--retardo": 1 } as React.CSSProperties}
            >
              Alquilamos la máquina
              <br className="hidden lg:block" /> que tu obra necesita hoy.
            </h1>

            {/* En móvil va a 16px y no al `lede` de 18: tres líneas de
                lede se comían la franja de foto del primer vistazo. */}
            <p
              className="mt-3 max-w-[46ch] text-base leading-relaxed text-ink-2 lg:mt-6 lg:text-xl"
              data-revelar
              style={{ "--retardo": 2 } as React.CSSProperties}
            >
              Plataformas, manipuladores, carretillas y maquinaria de obra.
              Delegación propia en cada provincia.
            </p>

            <div
              className="mt-6 lg:mt-8"
              data-revelar
              style={{ "--retardo": 3 } as React.CSSProperties}
            >
              <Buscador />
            </div>

            <div
              className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1"
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
        </div>
      </div>

      {/* Móvil y tablet: la foto cierra la pantalla, sin salirse de ella.
          `min-h-0` deja que se comprima antes que el contenido. */}
      <div className="relative min-h-28 flex-1 border-t border-rule bg-muted lg:hidden">
        <Image
          src="/img/maquinas/tijeras-electricas/tijeras-electricas-1.jpg"
          alt="Plataforma elevadora de tijera desplegada junto a una nave industrial"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[40%_60%]"
        />
      </div>
    </section>
  );
}
