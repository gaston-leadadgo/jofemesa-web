import Image from "next/image";
import { Clock, Wrench, ShieldCheck, Award } from "lucide-react";
import {
  EMPRESA,
  CERTIFICACIONES,
  FABRICANTES_FLOTA,
  DELEGACIONES_OPERATIVAS,
} from "@/content/es/empresa";

/**
 * S7 · Autoridad. Las cifras en crudo están prohibidas en el hero y
 * permitidas aquí, que es donde alguien ya interesado quiere comprobar
 * con quién está hablando.
 *
 * Antes esto era un titular de 46 caracteres solo en una fila de 1320px
 * de ancho, con 192px de aire arriba y abajo: leía como un error de
 * maquetación. Ahora el titular comparte fila con las cuatro cifras y
 * con una foto de taller, así que la fila está ocupada de lado a lado y
 * el texto tiene con qué medirse.
 */

const PILARES = [
  {
    icono: Clock,
    titulo: `Desde ${EMPRESA.fundacion}`,
    texto:
      "Décadas junto a profesionales que necesitan maquinaria para avanzar sin contratiempos.",
    pie: "Solidez empresarial",
  },
  {
    icono: Wrench,
    titulo: "Servicio técnico propio",
    texto:
      "Mantenimiento, diagnóstico y reparación para que una incidencia no pare la obra.",
    pie: "Talleres y unidades móviles",
  },
  {
    icono: ShieldCheck,
    titulo: "Procesos certificados",
    texto:
      "Gestión auditada según ISO 9001, 14001 y 45001, con revisión antes de cada salida.",
    pie: CERTIFICACIONES.map((c) => c.nombre).join(" · "),
  },
  {
    icono: Award,
    titulo: "Marcas que conoces",
    texto:
      "Flota compuesta por los fabricantes de referencia del sector.",
    pie: "Flota de marca oficial",
  },
] as const;

const CIFRAS = [
  { v: String(EMPRESA.fundacion), k: "Año de fundación" },
  { v: String(EMPRESA.anios), k: "Años de actividad" },
  { v: String(DELEGACIONES_OPERATIVAS.length), k: "Delegaciones propias" },
  { v: "3", k: "Certificaciones ISO" },
] as const;

export function Autoridad() {
  return (
    <section className="section-y border-b border-rule bg-sunken">
      <div className="container-placa">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Titular + cifras: media fila, no una fila entera vacía. */}
          <div className="lg:col-span-7" data-revelar>
            <h2 className="display-2 max-w-[24ch] text-ink">
              La máquina importa. Lo que hay detrás, todavía más.
            </h2>
            <p className="lede mt-4 max-w-[54ch] text-ink-2">
              Una obra no puede depender solo de una ficha técnica. Detrás del
              equipo necesitas experiencia, mantenimiento y gente que sepa de
              maquinaria.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-px border border-rule bg-rule md:grid-cols-4">
              {CIFRAS.map((c) => (
                <div key={c.k} className="bg-surface px-4 py-4">
                  <dt className="label-sm text-ink-3">{c.k}</dt>
                  <dd className="value-lg mt-1.5 text-ink">{c.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            className="relative min-h-56 border border-rule bg-muted lg:col-span-5 lg:min-h-0"
            data-revelar="escala"
          >
            <Image
              src="/img/maquinas/manipuladores-telescopicos-rigidos/manipuladores-telescopicos-rigidos-1.jpg"
              alt="Manipulador telescópico en obra"
              fill
              sizes="(min-width:1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div
          className="mt-6 grid gap-px bg-rule md:grid-cols-2 lg:grid-cols-4"
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
