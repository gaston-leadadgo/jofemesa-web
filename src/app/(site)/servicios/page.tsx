import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Phone } from "lucide-react";
import { SERVICIOS, FORMACION_PENDIENTE } from "@/content/es/servicios";
import {
  TELEFONO_PRINCIPAL,
  CENTROS,
  HOMOLOGACIONES,
  DELEGACIONES,
} from "@/content/es/empresa";
import { IconoMaquina } from "@/components/marca/IconoMaquina";
import { CabeceraSeccion } from "@/components/marca/CabeceraSeccion";
import { Mapa } from "@/components/marca/Mapa";

export const metadata: Metadata = {
  title: "Servicios · venta, mantenimiento, transporte y formación",
  description:
    "Venta de carretillas nuevas y reacondicionadas y recambios de cualquier marca, servicio técnico propio con asistencia móvil, transporte y entrega coordinada en obra, y centro de formación homologado IPAF y AENOR.",
};

/**
 * Servicios.
 *
 * Sustituye a las pestañas de /venta y /mantenimiento, que ya no
 * existen: la reunión del 24/08/2026 decidió meterlas aquí dentro
 * —«venta, mantenimiento, esto va todo en la pestaña de servicios»— con
 * este orden exacto: venta, mantenimiento, transporte y la mención a
 * formación.
 *
 * Cada bloque termina en su propio call to action, que era la otra
 * petición literal de la reunión. Los cuatro llevan al mismo
 * formulario, pero cada uno con su asunto ya puesto, así que la
 * solicitud llega sabiendo de qué va.
 */
/** Las delegaciones que documentan taller propio en el catálogo. */
const CON_TALLER = DELEGACIONES.filter((d) =>
  d.servicios.some((x) => /taller/i.test(x)),
);

export default function PaginaServicios() {
  return (
    <>
      <CabeceraSeccion
        kicker="Servicios integrales de soporte"
        titulo="Respaldo técnico, transporte y formación"
        lede="No solo alquilamos. Vendemos carretillas y recambios, mantenemos maquinaria de cualquier marca, la llevamos a pie de obra y formamos a quien la va a manejar."
        datos={[
          { k: "Servicios", v: `${SERVICIOS.length}` },
          { k: "Talleres propios", v: `${CON_TALLER.length}` },
          { k: "Homologaciones", v: `${HOMOLOGACIONES.length}` },
        ]}
        cta={{
          href: "/consultar-disponibilidad?asunto=servicios",
          texto: "Pedir información",
        }}
      />

      {/* Índice en tarjetas, no en chips.
          Cuatro bloques largos necesitan una entrada que diga de qué va
          cada uno antes de bajar: una fila de píldoras da el nombre pero
          no la promesa, y bajar a ciegas por cuatro pantallas es lo que
          hace que una página de servicios «no se lea». */}
      <section className="border-b border-rule bg-sunken">
        <div className="container-placa py-8 md:py-10">
          <ul
            className="grid grid-flow-dense gap-px border border-rule bg-rule md:grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-2xl"
            data-escalonar
          >
            {SERVICIOS.map((s, i) => (
              <li key={s.id} className="bg-surface">
                <a
                  href={`#${s.id}`}
                  className="group flex h-full flex-col p-5 transition-colors duration-200 hover:bg-sunken md:p-6"
                >
                  <span className="flex items-start justify-between gap-3">
                    <IconoMaquina
                      icono={s.icono}
                      className="h-11 w-14 shrink-0 text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5"
                    />
                    <span className="value text-sm text-rule-strong">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="title mt-5 block text-ink transition-colors duration-200 group-hover:text-accent">
                    {s.epigrafe}
                  </span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">
                    {s.resumen}
                  </span>
                  <span className="mt-5 flex items-center gap-2 border-t border-rule pt-3.5 text-sm font-semibold text-ink-2 transition-colors duration-200 group-hover:text-accent">
                    Ver el detalle
                    <ArrowRight
                      size={15}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {SERVICIOS.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`section-y scroll-mt-28 border-b border-rule ${
            i % 2 ? "bg-sunken" : ""
          }`}
        >
          <div className="container-placa">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7" data-revelar>
                <div className="flex items-center gap-4">
                  <IconoMaquina
                    icono={s.icono}
                    className="h-10 w-13 shrink-0 text-accent"
                  />
                  <p className="label text-ink-3">{s.epigrafe}</p>
                </div>

                <h2 className="display-2 mt-4 max-w-[24ch] text-ink">
                  {s.titulo}
                </h2>
                <p className="lede mt-4 max-w-[58ch] text-ink-2">
                  {s.entradilla}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {s.puntos.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 text-base text-ink-2"
                    >
                      <Check
                        size={17}
                        strokeWidth={2.5}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-accent"
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                {s.id === "formacion" && (
                  <>
                    <ul className="mt-6 grid gap-px border border-rule bg-rule md:grid-cols-3 overflow-hidden rounded-2xl">
                      {HOMOLOGACIONES.map((h) => (
                        <li key={h.id} className="bg-surface px-4 py-3">
                          <p className="value text-sm text-ink">{h.nombre}</p>
                          <p className="mt-1 text-sm text-ink-2">
                            {h.descripcion}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-l-2 border-wait bg-sunken px-4 py-3 text-base text-ink-2">
                      {FORMACION_PENDIENTE}
                    </p>
                  </>
                )}

                <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
                  <Link
                    href={s.cta.href}
                    className="btn-accent group inline-flex h-14 items-center justify-center gap-2 bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
                  >
                    {s.cta.texto}
                    <ArrowRight
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                  <a
                    href={`tel:${TELEFONO_PRINCIPAL.tel}`}
                    className="inline-flex h-14 items-center justify-center gap-2 border border-rule-control px-6 text-base font-semibold text-ink transition-colors duration-200 hover:bg-surface pastilla"
                  >
                    <Phone size={17} strokeWidth={1.75} aria-hidden="true" />
                    <span className="value">{TELEFONO_PRINCIPAL.visible}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                {s.credencial && (
                  <div
                    className="border border-rule bg-surface p-6"
                    data-revelar="escala"
                  >
                    <Image
                      src={s.credencial.logo}
                      alt={s.credencial.alt}
                      width={s.credencial.ancho}
                      height={s.credencial.alto}
                      className="h-9 w-auto"
                    />
                    <p className="mt-5 text-base text-ink-2">
                      {s.credencial.texto}
                    </p>
                  </div>
                )}

                {/* La segunda credencial de venta: son distribuidor
                    oficial de Takeuchi, con dirección y teléfono
                    propios en el catálogo general. */}
                {s.id === "venta" && (
                  <div
                    className="mt-5 border border-rule bg-surface p-6"
                    data-revelar="escala"
                  >
                    <p className="label text-ink-3">Distribuidor oficial</p>
                    {CENTROS.filter((c) => c.id === "takeuchi").map((c) => (
                      <div key={c.id} className="mt-4">
                        <p className="title text-ink">{c.nombre}</p>
                        <p className="mt-2 text-base text-ink-2">
                          {c.direccion}, {c.cp} {c.localidad}
                        </p>
                        <a
                          href={`tel:${c.tel}`}
                          className="value mt-4 inline-flex min-h-11 items-center gap-2 text-ink transition-colors duration-200 hover:text-accent"
                        >
                          <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
                          {c.telefono}
                        </a>
                        <a
                          href={`mailto:${c.email}`}
                          className="mt-1 block text-base text-ink-2 underline decoration-rule-strong underline-offset-4 transition-colors duration-200 hover:text-ink"
                        >
                          {c.email}
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {s.id === "formacion" && (
                  <div
                    className="border border-rule bg-surface p-6"
                    data-revelar="escala"
                  >
                    <p className="label text-ink-3">Central de formación</p>
                    {CENTROS.filter((c) => c.id === "formacion").map((c) => (
                      <div key={c.id} className="mt-4">
                        <p className="text-base text-ink">{c.direccion}</p>
                        <p className="text-base text-ink-2">
                          {c.cp} {c.localidad}
                        </p>
                        <a
                          href={`tel:${c.tel}`}
                          className="value mt-4 inline-flex min-h-11 items-center gap-2 text-ink transition-colors duration-200 hover:text-accent"
                        >
                          <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
                          {c.telefono}
                        </a>
                        <a
                          href={`mailto:${c.email}`}
                          className="mt-1 block text-base text-ink-2 underline decoration-rule-strong underline-offset-4 transition-colors duration-200 hover:text-ink"
                        >
                          {c.email}
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* Transporte no tenía panel y la columna se quedaba en
                    blanco media pantalla. Lo que corresponde aquí es el
                    mapa: la pregunta de logística es «¿llegáis a mi
                    obra?», y eso se contesta mejor enseñándolo. */}
                {s.id === "transporte" && (
                  <div
                    className="border border-rule bg-surface p-6"
                    data-revelar="escala"
                  >
                    <p className="label text-ink-3">Rutas propias</p>
                    <Mapa className="mx-auto mt-4 w-full max-w-[17rem]" />
                    <p className="mt-4 text-base text-ink-2">
                      Camiones propios con base en las {DELEGACIONES.length}{" "}
                      delegaciones y rutas diarias entre ellas, también entre
                      España y Portugal.
                    </p>
                    <Link
                      href="/delegaciones"
                      className="group mt-4 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
                    >
                      Ver las delegaciones
                      <ArrowRight
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                )}

                {/* El mantenimiento sale de las mismas delegaciones que
                    el alquiler, así que la máquina la atiende quien la
                    conoce. Solo se listan las que documentan taller. */}
                {s.id === "mantenimiento" && (
                  <div
                    className="border border-rule bg-surface p-6"
                    data-revelar="escala"
                  >
                    <p className="label text-ink-3">Talleres propios</p>
                    <ul className="mt-4 space-y-2.5">
                      {CON_TALLER.map((d) => (
                        <li
                          key={d.id}
                          className="flex items-baseline justify-between gap-3 border-b border-rule pb-2.5 text-base"
                        >
                          <span className="font-semibold text-ink">
                            {d.nombre}
                          </span>
                          <a
                            href={`tel:${d.tel}`}
                            className="value inline-block py-1 text-sm text-ink-2 transition-colors duration-200 hover:text-accent"
                          >
                            {d.telefono}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-ink-3">
                      Y furgones taller que se desplazan al tajo desde
                      cualquiera de las {DELEGACIONES.length} delegaciones.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section-y">
        <div className="container-placa max-w-3xl text-center">
          <h2 className="display-3 text-ink">
            ¿Necesitas un plan a medida para tu empresa?
          </h2>
          <p className="lede mx-auto mt-4 max-w-[54ch] text-ink-2">
            Consúltanos sobre transporte agrupado, mantenimiento de flota o
            convocatorias de formación para grupos de operadores.
          </p>
          <Link
            href="/consultar-disponibilidad?asunto=servicios"
            className="btn-accent mt-7 inline-flex h-14 items-center bg-accent px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
          >
            Pedir información de servicios
          </Link>
        </div>
      </section>
    </>
  );
}
