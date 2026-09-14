import type { Metadata } from "next";
import { EMAIL_PRINCIPAL, EMPRESA } from "@/content/es/empresa";

export const metadata: Metadata = {
  title: "Aviso legal",
  robots: { index: false },
};

export default function PaginaAvisoLegal() {
  return (
    <div className="container-placa py-10 md:py-12">
      <div className="max-w-[70ch]">
        <h1 className="display-2 text-ink">Aviso legal</h1>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="label text-ink-3">Titular del sitio</h2>
            <dl className="mt-3 divide-y divide-rule border-y border-rule">
              {[
                ["Razón social", EMPRESA.razonSocial],
                ["CIF", EMPRESA.cif],
                ["Domicilio social", EMPRESA.domicilioSocial],
                ["Actividad", "Alquiler y venta de maquinaria industrial"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 py-3 md:flex-row md:gap-8">
                  <dt className="text-base text-ink-2 md:w-48 md:shrink-0">{k}</dt>
                  <dd className="text-base text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* El aviso legal actual de jofemesa.com publica los campos del
              Registro Mercantil en blanco, así que aquí no se rellenan a
              ojo. Esta nota es lo que se ve mientras falten, y el recado
              de pedirlos está en /admin/datos-pendientes, que es donde
              van los recados: esta página la lee cualquiera. */}
          <section className="border-l-2 border-wait bg-sunken px-5 py-4">
            <p className="label-sm text-ink-2">Pendiente de completar</p>
            <p className="mt-2 text-base text-ink">
              Los datos de inscripción en el Registro Mercantil —tomo, folio
              y hoja— se incorporarán a este aviso legal en cuanto estén
              verificados. Si los necesitas antes, escríbenos a{" "}
              <a
                href={`mailto:${EMAIL_PRINCIPAL}`}
                className="font-semibold text-accent underline decoration-2 underline-offset-4"
              >
                {EMAIL_PRINCIPAL}
              </a>{" "}
              y te los facilitamos.
            </p>
          </section>

          <section>
            <h2 className="label text-ink-3">Condiciones de uso</h2>
            <p className="mt-3 text-base text-ink-2">
              Este sitio ofrece información sobre el catálogo de alquiler y
              venta. Las especificaciones técnicas que aparecen provienen de las
              fichas de los fabricantes y se indican como tales; las que aún no
              están confirmadas contra la unidad concreta de flota se muestran
              marcadas. Ninguna de ellas constituye oferta contractual: la
              disponibilidad, el precio y las condiciones se confirman por
              escrito antes de formalizar cualquier alquiler.
            </p>
          </section>

          <section>
            <h2 className="label text-ink-3">Propiedad intelectual</h2>
            <p className="mt-3 text-base text-ink-2">
              Las marcas de los fabricantes que aparecen en este sitio
              pertenecen a sus respectivos titulares y se usan únicamente para
              identificar los equipos de la flota.
            </p>
            {/* Aquí aterriza la antigua /creditos-imagen. Esa página
                existía para citar la autoría de 57 fotografías de licencia
                Creative Commons que ya no se usan: toda la fotografía de
                producto de la web es material propio del cliente. */}
            <p className="mt-3 text-base text-ink-2">
              La fotografía de producto de este sitio es material propio de
              JOFEMESA, tomado de su propia flota. Las máquinas para las que
              todavía no hay fotografía se representan con un dibujo técnico
              hecho para esta web, nunca con fotografía de archivo de otra
              empresa.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
