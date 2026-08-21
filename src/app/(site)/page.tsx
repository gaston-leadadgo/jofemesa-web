import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { CERTIFICACIONES, AFILIACIONES, TELEFONO_PRINCIPAL } from "@/content/es/empresa";
import { CATALOGO } from "@/lib/catalog";
import { Hero } from "@/components/home/Hero";
import { Necesidades } from "@/components/home/Necesidades";
import { Destacadas } from "@/components/home/Destacadas";
import { Autoridad } from "@/components/home/Autoridad";
import { Cobertura } from "@/components/home/Cobertura";
import { AsesorLocal } from "@/components/asesor/Asesor";

export default function Portada() {
  const destacadas = CATALOGO.filter((m) => m.destacada);

  return (
    <>
      <Hero />

      {/* S2 · Raíl de confianza */}
      <section className="border-b border-rule bg-sunken">
        <div className="container-placa">
          <ul className="grid grid-cols-2 gap-px bg-rule md:grid-cols-4 lg:grid-cols-7">
            {[...CERTIFICACIONES, ...AFILIACIONES].map((c) => (
              <li key={c.id} className="bg-sunken px-4 py-5">
                <p className="label text-ink">{c.nombre}</p>
                <p className="mt-1.5 text-sm text-ink-3">{c.descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Necesidades />

      {/* S4 · El asesor, empotrado y funcionando.
          Estado local, así que no lee searchParams y la portada entera se
          prerenderiza: el paso 1 llega pintado en el HTML. */}
      <AsesorLocal />

      <Destacadas maquinas={destacadas} />

      <Cobertura />

      <Autoridad />

      {/* S8 · Venta y Mantenimiento */}
      <section className="border-b border-rule">
        <div className="container-placa grid gap-px bg-rule md:grid-cols-2">
          {[
            {
              href: "/venta",
              titulo: "También vendemos",
              texto:
                "Carretillas elevadoras contrapesadas y de almacén, nuevas y reacondicionadas, y recambios originales de todas las marcas.",
              cta: "Ver venta de maquinaria",
            },
            {
              href: "/mantenimiento",
              titulo: "Y también mantenemos",
              texto:
                "Reparamos todo tipo de maquinaria industrial y hacemos mantenimiento preventivo, con taller propio y unidades móviles.",
              cta: "Solicitar mantenimiento",
            },
          ].map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex flex-col justify-between gap-6 bg-surface px-6 py-10 transition-colors duration-200 hover:bg-sunken md:px-9 md:py-12"
            >
              <div>
                <h2 className="display-3 text-ink">{p.titulo}</h2>
                <p className="mt-4 max-w-[44ch] text-base text-ink-2">{p.texto}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-base font-semibold text-accent">
                {p.cta}
                <ArrowRight
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* S9 · Cierre */}
      <section data-surface="dark" className="relative bg-inverse">
        {/* Filete de seguridad: la única aparición del ámbar de la marca. */}
        <div aria-hidden="true" className="h-1 w-full bg-wait" />
        <div className="container-placa section-y-sm text-center">
          <p className="label text-ink-inv-3">Sin compromiso</p>
          <h2 className="display-2 mx-auto mt-4 max-w-[24ch] text-ink-inv">
            Dinos qué necesitas y qué día. Te confirmamos disponibilidad.
          </h2>
          <p className="lede mx-auto mt-4 max-w-[54ch] text-ink-inv-2">
            Confirmamos disponibilidad y condiciones contigo antes de
            formalizar nada. Sin pasarela de pago y sin letra pequeña.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 md:flex-row">
            <Link
              href="/consultar-disponibilidad"
              className="btn-accent inline-flex h-14 w-full items-center justify-center bg-accent px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover md:w-auto"
            >
              Consultar disponibilidad
            </Link>
            <a
              href={`tel:${TELEFONO_PRINCIPAL.tel}`}
              className="inline-flex h-14 w-full items-center justify-center gap-2 border border-rule-inverse px-8 text-base font-semibold text-ink-inv transition-colors duration-200 hover:bg-inverse-2 md:w-auto"
            >
              <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
              <span className="value text-ink-inv">{TELEFONO_PRINCIPAL.visible}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
