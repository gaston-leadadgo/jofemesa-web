import Link from "next/link";
import { Clock, Wrench, ShieldCheck, Award, ArrowRight } from "lucide-react";
import {
  EMPRESA,
  CERTIFICACIONES,
  FABRICANTES_FLOTA,
  DELEGACIONES,
  FLOTA,
} from "@/content/es/empresa";
import { ALQUILER, FAMILIAS } from "@/lib/catalog";
import { Antiguedad } from "@/components/marca/Antiguedad";

/**
 * S7 · Autoridad.
 *
 * Las cifras en crudo están prohibidas en el hero y permitidas aquí,
 * que es donde alguien ya interesado quiere comprobar con quién está
 * hablando. Todas son verificables contra su propio material:
 *
 *   · La fecha de fundación y los «+5.000 equipos en flota» salen de la
 *     lámina que pasó el cliente el 24/08/2026. La cifra de flota queda
 *     anotada en /admin/datos-pendientes para que la confirme.
 *   · Las delegaciones y las referencias del catálogo salen del catálogo
 *     general, contadas por el propio código.
 *
 * Lo que NO hay es ningún claim de flota nueva. Está desmentido por el
 * cliente y no aparece en ninguna página.
 */

const PILARES = [
  {
    icono: Clock,
    titulo: `Desde ${EMPRESA.fundacion}`,
    texto:
      "Empezamos en Avilés y hoy servimos desde diez delegaciones propias. Décadas junto a profesionales que necesitan maquinaria para avanzar sin contratiempos.",
    pie: "Solidez empresarial",
  },
  {
    icono: Wrench,
    titulo: "Servicio técnico propio",
    texto:
      "Mecánicos, taller y furgones de asistencia móvil. Una incidencia con la máquina no debería convertirse en un problema mayor.",
    pie: "Talleres y unidades móviles",
  },
  {
    icono: ShieldCheck,
    titulo: "Procesos certificados",
    texto:
      "Gestión auditada según ISO 9001, 14001 y 45001, con revisión del equipo antes de cada salida.",
    pie: CERTIFICACIONES.map((c) => c.nombre).join(" · "),
  },
  {
    icono: Award,
    titulo: "Marcas de referencia",
    texto:
      "Genie, JLG, Haulotte, Manitou, Takeuchi, JCB, Bomag, Hamm, Atlas Copco. Y partner oficial de Jungheinrich en manutención.",
    pie: "Flota de marca oficial",
  },
] as const;

export function Autoridad() {
  const CIFRAS = [
    { v: FLOTA.equipos, k: "Equipos en flota" },
    { v: String(ALQUILER.length), k: "Referencias en catálogo" },
    { v: String(DELEGACIONES.length), k: "Delegaciones propias" },
    { v: String(FAMILIAS.length), k: "Familias de maquinaria" },
  ] as const;

  return (
    <section className="section-y border-b border-rule bg-sunken">
      <div className="container-placa">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7" data-revelar>
            <p className="label text-accent">Garantía técnica y solvencia</p>
            <h2 className="display-2 mt-3 max-w-[24ch] text-ink">
              La máquina importa. Lo que hay detrás, todavía más.
            </h2>
            <p className="lede mt-4 max-w-[54ch] text-ink-2">
              Una obra, una instalación o una línea de producción no pueden
              depender solo de una ficha técnica. Detrás del equipo necesitas
              experiencia, mantenimiento y gente que sepa de maquinaria.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-px border border-rule bg-rule md:grid-cols-4 overflow-hidden rounded-2xl">
              {CIFRAS.map((c) => (
                <div key={c.k} className="bg-surface px-4 py-4">
                  <dt className="label-sm text-ink-3">{c.k}</dt>
                  <dd className="value-lg mt-1.5 text-ink">{c.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* La antigüedad, contada exacta. Es el gesto de la lámina del
              cliente y el sitio donde el «desde 1987» gana la relevancia
              que se pidió en la reunión. */}
          <div
            data-surface="dark"
            className="ambient-dark flex flex-col justify-between gap-6 border border-rule-inverse p-6 lg:col-span-5 lg:p-8"
            data-revelar="escala"
          >
            <div>
              <p className="label-sm text-ink-inv-3">Experiencia acumulada</p>
              <p className="mt-3 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none font-bold tracking-[-0.02em] text-ink-inv">
                <Antiguedad />
              </p>
              <p className="value mt-4 text-accent-dark">
                desde el 24 · 03 · {EMPRESA.fundacion}
              </p>
            </div>

            <p className="text-base text-ink-inv-2">
              {EMPRESA.razonSocial} nació en Avilés como taller de manutención
              y hoy alquila, vende y mantiene maquinaria en toda la península.
            </p>

            <Link
              href="/delegaciones"
              className="group inline-flex min-h-11 items-center gap-2 text-base font-semibold text-ink-inv underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-dark"
            >
              Ver las {DELEGACIONES.length} delegaciones
              <ArrowRight
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        <div
          className="mt-6 grid gap-px bg-rule md:grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-2xl border border-rule"
          data-escalonar
        >
          {PILARES.map((p) => (
            <div key={p.titulo} className="flex flex-col bg-surface p-5">
              <p.icono
                size={22}
                strokeWidth={1.75}
                aria-hidden="true"
                className="text-accent"
              />
              <h3 className="title mt-4 text-ink">{p.titulo}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-2">{p.texto}</p>
              <p className="label-sm mt-4 border-t border-rule pt-3 text-ink-3">
                {p.pie}
              </p>
            </div>
          ))}
        </div>

        {/* Fabricantes: una tira, no una rejilla con aire. */}
        <div className="mt-6 flex flex-col gap-3 border-t border-rule pt-5 md:flex-row md:items-center md:gap-6">
          <h3 className="label shrink-0 text-ink-3">Fabricantes de la flota</h3>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {FABRICANTES_FLOTA.map((f) => (
              <li
                key={f.nombre}
                className="text-base font-semibold text-ink-2"
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
