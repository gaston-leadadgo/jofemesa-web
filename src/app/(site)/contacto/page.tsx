import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight, Building2 } from "lucide-react";
import {
  DELEGACIONES,
  DELEGACIONES_POR_ID,
  EMPRESA,
  EMAIL_PRINCIPAL,
  TELEFONO_PRINCIPAL,
  LEMA_EQUIPO,
} from "@/content/es/empresa";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Teléfonos y correos de las diez delegaciones de JOFEMESA, dirección de la sede central y formulario de consulta directa.",
};

/**
 * Contacto.
 *
 * En la reunión se dio por bueno tal cual —«el contacto así está
 * bien»—, con una condición que sí cambia cosas: en la portada las
 * delegaciones ocupan el sitio que tenía el contacto, y aquí «el
 * contacto le puedas elegir directamente dónde la ubicación». De ahí
 * que esta página sea, sobre todo, una centralita: los diez teléfonos
 * y los diez correos, y el formulario con el selector de delegación.
 */
export default function PaginaContacto() {
  const central = DELEGACIONES_POR_ID.madrid;

  return (
    <>
      <section data-surface="dark" className="ambient-dark border-b border-rule-inverse">
        <div className="container-placa py-10 md:py-14">
          <p className="label text-accent-dark">Atención profesional directa</p>
          <h1
            className="mt-4 max-w-[22ch] font-[family-name:var(--font-display)] text-[clamp(1.9rem,3.4vw,3.25rem)] leading-[1.0] font-extrabold tracking-[-0.03em] text-balance text-ink-inv"
            data-revelar
          >
            Hablas con la delegación que tiene la máquina
          </h1>
          <p className="lede mt-6 max-w-[58ch] text-ink-inv-2">
            {LEMA_EQUIPO}. Llama a la delegación más cercana a tu obra o
            escríbenos y te contestamos desde la que te va a servir el equipo.
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <a
              href={`tel:${TELEFONO_PRINCIPAL.tel}`}
              className="inline-flex h-14 items-center justify-center gap-2.5 border border-rule-inverse px-6 text-base font-semibold text-ink-inv transition-colors duration-200 hover:bg-inverse-2"
            >
              <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
              <span className="value">{TELEFONO_PRINCIPAL.visible}</span>
            </a>
            <a
              href={`mailto:${EMAIL_PRINCIPAL}`}
              className="inline-flex h-14 items-center justify-center gap-2.5 border border-rule-inverse px-6 text-base font-semibold text-ink-inv transition-colors duration-200 hover:bg-inverse-2"
            >
              <Mail size={18} strokeWidth={1.75} aria-hidden="true" />
              {EMAIL_PRINCIPAL}
            </a>
          </div>
        </div>
      </section>

      <section className="section-y border-b border-rule">
        <div className="container-placa">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h2 className="display-3 text-ink">Sede central</h2>
              <div className="mt-6 border border-rule bg-sunken p-6">
                <p className="title text-ink">{EMPRESA.razonSocial}</p>
                <dl className="mt-5 space-y-3.5 text-base">
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Dirección</dt>
                    <MapPin
                      size={17}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-ink-3"
                    />
                    <dd className="text-ink-2">
                      <span className="text-ink">{central.direccion}</span>
                      <br />
                      <span className="value text-sm">{central.cp}</span>{" "}
                      {central.localidad}
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Teléfono</dt>
                    <Phone
                      size={17}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-ink-3"
                    />
                    <dd>
                      <a
                        href={`tel:${central.tel}`}
                        className="value inline-flex min-h-11 items-center text-ink transition-colors duration-200 hover:text-accent"
                      >
                        {central.telefono}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Correo</dt>
                    <Mail
                      size={17}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-ink-3"
                    />
                    <dd className="min-w-0">
                      <a
                        href={`mailto:${central.email}`}
                        className="block truncate text-ink-2 underline decoration-rule-strong underline-offset-4 transition-colors duration-200 hover:text-ink"
                      >
                        {central.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Domicilio social</dt>
                    <Building2
                      size={17}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-ink-3"
                    />
                    <dd className="text-sm text-ink-3">
                      Domicilio social: {EMPRESA.domicilioSocial}. CIF{" "}
                      <span className="value text-sm">{EMPRESA.cif}</span>.
                    </dd>
                  </div>
                </dl>
              </div>

              <p className="mt-6 text-sm text-ink-3">
                No publicamos horarios que no podamos garantizar. Llama a la
                delegación y te lo confirmamos en el momento.
              </p>
            </div>

            <div className="lg:col-span-7">
              <h2 className="display-3 text-ink">Teléfonos de delegación</h2>
              <p className="mt-4 max-w-[56ch] text-base text-ink-2">
                Cada delegación tiene su parque, su taller y su equipo
                comercial. Si sabes dónde está tu obra, llama directamente
                allí: te ahorra un paso.
              </p>

              <ul className="mt-6 grid gap-px border border-rule bg-rule md:grid-cols-2">
                {DELEGACIONES.map((d) => (
                  <li key={d.id} className="bg-surface px-4 py-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-base font-semibold text-ink">
                        {d.nombre}
                      </p>
                      {d.pais === "Portugal" && (
                        <span className="label-sm shrink-0 bg-wait px-1.5 py-0.5 text-wait-ink">
                          PT
                        </span>
                      )}
                    </div>
                    <a
                      href={`tel:${d.tel}`}
                      className="value mt-1.5 inline-flex min-h-11 items-center gap-2 text-sm text-ink-2 transition-colors duration-200 hover:text-accent"
                    >
                      <Phone
                        size={13}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                      {d.telefono}
                    </a>
                    <a
                      href={`mailto:${d.email}`}
                      className="block truncate py-1 text-sm text-ink-3 underline decoration-rule underline-offset-4 transition-colors duration-200 hover:text-ink-2"
                    >
                      {d.email}
                    </a>
                  </li>
                ))}
              </ul>

              <Link
                href="/delegaciones"
                className="group mt-6 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
              >
                Ver direcciones completas y el mapa
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-placa">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-7">
              <h2 className="display-2 max-w-[24ch] text-ink">
                ¿Prefieres que te llamemos nosotros?
              </h2>
              <p className="lede mt-4 max-w-[54ch] text-ink-2">
                Cuéntanos qué necesitas hacer, dónde y cuándo. Puedes elegir la
                delegación desde la que quieres que te atendamos, y si no lo
                sabes, la asignamos por la provincia de la obra.
              </p>
            </div>
            <div className="lg:col-span-5">
              <Link
                href="/consultar-disponibilidad"
                className="btn-accent flex h-14 items-center justify-center bg-accent px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover"
              >
                Abrir el formulario
              </Link>
              <Link
                href="/asesor"
                className="mt-3 flex h-14 items-center justify-center border border-rule-control px-8 text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken"
              >
                No sé qué máquina necesito
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
