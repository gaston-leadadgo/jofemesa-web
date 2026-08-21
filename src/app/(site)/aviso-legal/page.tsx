import type { Metadata } from "next";
import { EMPRESA } from "@/content/es/empresa";

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

          {/* Su propio aviso legal publica los campos del Registro Mercantil
              en blanco. No los rellenamos a ojo: se piden al cliente. */}
          <section className="border-l-2 border-wait bg-sunken px-5 py-4">
            <p className="label-sm text-ink-2">Pendiente de completar</p>
            <p className="mt-2 text-base text-ink">
              Faltan los datos de inscripción en el Registro Mercantil (tomo,
              folio y hoja). En el aviso legal actual de jofemesa.com esos
              campos están publicados en blanco, así que no los damos por
              buenos: hay que pedírselos al cliente antes de publicar.
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
          </section>
        </div>
      </div>
    </div>
  );
}
