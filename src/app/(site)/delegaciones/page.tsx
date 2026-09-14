import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import {
  DELEGACIONES,
  DELEGACIONES_ESPANA,
  DELEGACIONES_PORTUGAL,
  CENTROS,
  LEMA,
} from "@/content/es/empresa";
import { Mapa } from "@/components/marca/Mapa";
import { CabeceraSeccion } from "@/components/marca/CabeceraSeccion";

export const metadata: Metadata = {
  title: "Delegaciones en España y Portugal",
  description:
    "Diez delegaciones propias: Madrid, Asturias, Valladolid, Valencia, Castellón, Alicante, Sevilla, Málaga, Oporto y Lisboa. Dirección, teléfono y correo de cada una.",
};

/**
 * Delegaciones.
 *
 * Pestaña propia, decidida en la reunión: «dejaría la pestaña de
 * delegaciones porque creo que está bien que aparte puedan ver las
 * delegaciones».
 *
 * Lo importante de esta página no es el diseño: son los datos. Las
 * direcciones, teléfonos y correos de las diez delegaciones salen del
 * catálogo general que entregó el cliente, incluidas las DOS de
 * Portugal —Vila Nova de Gaia y Palmela—, que su web actual no publica
 * en ninguna parte y que la versión anterior de esta web tenía como
 * «contacto pendiente de confirmar».
 *
 * Los horarios siguen en blanco porque no los publican en ningún sitio.
 * La página lo dice en vez de inventarse un «L-V 8:00-18:00».
 */
export default function PaginaDelegaciones() {
  const grupos = [
    { titulo: "España", delegaciones: DELEGACIONES_ESPANA },
    { titulo: "Portugal", delegaciones: DELEGACIONES_PORTUGAL },
  ];

  return (
    <>
      <CabeceraSeccion
        kicker="Cobertura territorial ibérica"
        titulo={`${DELEGACIONES.length} delegaciones propias`}
        lede={
          <>
            Flota, taller y camiones propios en cada una. {LEMA} Si tu obra está
            lejos de todas ellas, tenemos rutas de transporte diarias entre
            delegaciones: llámanos y te decimos plazo.
          </>
        }
        datos={[
          { k: "España", v: `${DELEGACIONES_ESPANA.length}` },
          { k: "Portugal", v: `${DELEGACIONES_PORTUGAL.length}` },
          { k: "Centros", v: `${CENTROS.length}` },
        ]}
        cta={{ href: "/consultar-disponibilidad", texto: "Pedir una máquina" }}
      >
        <div className="mt-9 max-w-sm" data-revelar="escala">
          <Mapa className="w-full" tono="oscuro" />
        </div>
      </CabeceraSeccion>

      {grupos.map((g) => (
        <section key={g.titulo} className="section-y border-b border-rule">
          <div className="container-placa">
            <h2 className="display-3 text-ink" data-revelar>
              {g.titulo}
            </h2>

            <ul
              className="mt-7 grid gap-px bg-rule md:grid-cols-2 xl:grid-cols-3 overflow-hidden rounded-2xl border border-rule"
              data-escalonar
            >
              {g.delegaciones.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-col gap-5 bg-surface p-5 md:p-6"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {/* La provincia solo se rotula cuando dice algo que
                            el nombre no dice ya: en ocho de las diez
                            delegaciones son la misma palabra y salía
                            «Madrid / Madrid». */}
                        {d.provincia !== d.nombre && (
                          <p className="label-sm text-ink-3">{d.provincia}</p>
                        )}
                        <h3 className="display-3 text-ink">{d.nombre}</h3>
                      </div>
                      {d.central && (
                        <span className="label-sm shrink-0 bg-accent px-2 py-1 text-white">
                          Central
                        </span>
                      )}
                    </div>

                    <dl className="mt-5 space-y-3 text-base">
                      <div className="flex items-start gap-3">
                        <dt className="sr-only">Dirección</dt>
                        <MapPin
                          size={17}
                          strokeWidth={1.75}
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-ink-3"
                        />
                        <dd className="text-ink-2">
                          <span className="text-ink">{d.direccion}</span>
                          <br />
                          <span className="value text-sm">{d.cp}</span>{" "}
                          {d.localidad}
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
                            href={`tel:${d.tel}`}
                            className="value inline-flex min-h-11 items-center text-ink transition-colors duration-200 hover:text-accent"
                          >
                            {d.telefono}
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
                            href={`mailto:${d.email}`}
                            className="block truncate text-ink-2 underline decoration-rule-strong underline-offset-4 transition-colors duration-200 hover:text-ink"
                          >
                            {d.email}
                          </a>
                        </dd>
                      </div>

                      <div className="flex items-start gap-3">
                        <dt className="sr-only">Horario</dt>
                        <Clock
                          size={17}
                          strokeWidth={1.75}
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-ink-3"
                        />
                        <dd className="text-sm text-ink-3">
                          {d.horario ?? "Llámanos y te confirmamos el horario"}
                        </dd>
                      </div>
                    </dl>

                    {d.servicios.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-rule pt-4">
                        {d.servicios.map((s) => (
                          <li
                            key={s}
                            className="border border-rule bg-sunken px-2.5 py-1 text-sm text-ink-2"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Link
                    href={`/consultar-disponibilidad?del=${d.id}`}
                    className="btn-accent mt-auto flex h-12 items-center justify-center gap-2 bg-accent text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
                  >
                    Pedir máquina en {d.nombre}
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="section-y">
        <div className="container-placa">
          <h2 className="display-3 text-ink">Otros centros</h2>
          <p className="mt-4 max-w-[56ch] text-base text-ink-2">
            Dos direcciones más, con teléfono y correo propios, que también
            aparecen en nuestro catálogo general.
          </p>
          <ul className="mt-6 grid gap-px bg-rule md:grid-cols-2 overflow-hidden rounded-2xl border border-rule">
            {CENTROS.map((c) => (
              <li key={c.id} className="bg-surface p-5 md:p-6">
                <h3 className="title text-ink">{c.nombre}</h3>
                <p className="mt-2 text-base text-ink-2">
                  {c.direccion}
                  <br />
                  <span className="value text-sm">{c.cp}</span> {c.localidad}
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
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
