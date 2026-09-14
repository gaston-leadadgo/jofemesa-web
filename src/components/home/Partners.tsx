import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { FABRICANTES_FLOTA, CENTROS } from "@/content/es/empresa";

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
 * catálogo completo, incluida la gama reacondicionada JUNGSTARS) y
 * **distribuidor oficial** de Takeuchi, con centro propio. Lo demás son
 * fabricantes de la flota, que es otra cosa, y por eso van debajo en
 * gris y sin logotipo.
 */

const TAKEUCHI = CENTROS.find((c) => c.id === "takeuchi");

export function Partners() {
  return (
    <section className="border-b border-rule bg-surface">
      <div className="container-placa py-10 md:py-12">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-2">
          {/* ---------- Jungheinrich ---------- */}
          <div className="flex flex-col bg-surface p-6 md:p-8">
            <p className="label flex items-center gap-2 text-accent">
              <BadgeCheck size={15} strokeWidth={2.25} aria-hidden="true" />
              Partner oficial
            </p>
            <Image
              src="/marca/partner-jungheinrich.png"
              alt="Partner oficial de Jungheinrich"
              width={210}
              height={42}
              className="mt-5 h-9 w-auto"
            />
            <p className="mt-5 flex-1 text-base leading-relaxed text-ink-2">
              Distribuimos todo el catálogo de Jungheinrich en manutención:
              contrapesadas eléctricas y diésel, mástil retráctil, trilaterales
              EKX y EFX, preparadoras de pedidos, transpaletas, apiladores y
              tractores de arrastre. También su gama reacondicionada JUNGSTARS.
            </p>
            <Link
              href="/servicios#venta"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
            >
              Ver venta y recambios
              <ArrowRight
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* ---------- Takeuchi ----------
              No hay logotipo vectorial suyo en el material, así que va
              como marca tipográfica. Antes de inventar un logotipo,
              rotularlo. */}
          <div className="flex flex-col bg-surface p-6 md:p-8">
            <p className="label flex items-center gap-2 text-accent">
              <BadgeCheck size={15} strokeWidth={2.25} aria-hidden="true" />
              Distribuidor oficial
            </p>
            <p className="mt-5 flex h-9 items-center font-[family-name:var(--font-display)] text-[1.75rem] leading-none font-medium tracking-[-0.02em] text-ink">
              Takeuchi
            </p>
            <p className="mt-5 flex-1 text-base leading-relaxed text-ink-2">
              Distribución oficial de Takeuchi en retroexcavadoras y
              miniexcavadoras, con venta, recambio original y servicio técnico
              propio.
              {TAKEUCHI && ` Centro en ${TAKEUCHI.localidad}.`}
            </p>
            <Link
              href="/servicios#venta"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
            >
              Ver el centro Takeuchi
              <ArrowRight
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Los fabricantes de la flota son otra cosa y se rotulan como
            tal: alquilamos su maquinaria, no los distribuimos. */}
        <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <h3 className="label shrink-0 text-ink-3">Fabricantes de la flota</h3>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {FABRICANTES_FLOTA.filter(
              (f) => !/jungheinrich|takeuchi/i.test(f.nombre),
            ).map((f) => (
              <li
                key={f.nombre}
                className="text-base font-medium text-ink-3"
                title={f.area}
              >
                {f.nombre}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
