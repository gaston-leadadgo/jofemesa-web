import type { Metadata } from "next";
import { FOTOS_PROVISIONALES } from "@/lib/catalog/fotos";

export const metadata: Metadata = {
  title: "Créditos de imagen",
  description:
    "Autoría y licencia de las fotografías de referencia que usa esta web mientras llega la fotografía oficial de los fabricantes.",
  robots: { index: false, follow: false },
};

/**
 * Atribución de imagen.
 *
 * Esto no es un extra: las fotografías provisionales vienen de Wikimedia
 * Commons con licencias Creative Commons, y casi todas exigen citar al
 * autor y la licencia. Publicarlas sin esta página sería incumplir la
 * licencia. Cuando entren las fotos oficiales de fabricante, esta página
 * se queda vacía sola y se puede borrar.
 */
export default function PaginaCreditos() {
  const porLicencia = new Map<string, number>();
  for (const f of FOTOS_PROVISIONALES)
    porLicencia.set(f.licencia, (porLicencia.get(f.licencia) ?? 0) + 1);

  return (
    <div className="container-placa py-10 md:py-12">
      <h1 className="display-2 max-w-[24ch] text-ink" data-revelar>
        Créditos de imagen
      </h1>
      <p className="lede mt-4 max-w-[68ch] text-ink-2">
        Las fotografías que se ven ahora en el catálogo son{" "}
        <strong className="font-semibold text-ink">de referencia</strong>: no
        son del modelo exacto, sino de un equipo de la misma familia. Están
        aquí para que la web se pueda valorar con volumen real de imagen
        mientras se gestiona la autorización de fotografía oficial con los
        fabricantes. Cada tarjeta y cada ficha lo indica.
      </p>
      <p className="mt-4 max-w-[68ch] text-base text-ink-2">
        Todas provienen de Wikimedia Commons y se publican bajo la licencia que
        figura en cada línea. Algunas incluyen rótulos de otras empresas
        visibles en la propia foto: es otra razón para sustituirlas antes de
        salir a producción.
      </p>

      <dl className="mt-7 grid grid-cols-2 gap-px border border-rule bg-rule md:grid-cols-4">
        <div className="bg-surface px-4 py-4">
          <dt className="label-sm text-ink-3">Fotografías</dt>
          <dd className="value-lg mt-1.5 text-ink">
            {FOTOS_PROVISIONALES.length}
          </dd>
        </div>
        <div className="bg-surface px-4 py-4">
          <dt className="label-sm text-ink-3">Licencias distintas</dt>
          <dd className="value-lg mt-1.5 text-ink">{porLicencia.size}</dd>
        </div>
        <div className="bg-surface px-4 py-4">
          <dt className="label-sm text-ink-3">Del modelo exacto</dt>
          <dd className="value-lg mt-1.5 text-ink">0</dd>
        </div>
        <div className="bg-surface px-4 py-4">
          <dt className="label-sm text-ink-3">Origen</dt>
          <dd className="mt-1.5 text-base font-semibold text-ink">
            Wikimedia Commons
          </dd>
        </div>
      </dl>

      <div className="mt-8 overflow-x-auto border border-rule">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="p-3">
                <span className="label-sm text-ink-3">Subcategoría</span>
              </th>
              <th scope="col" className="p-3">
                <span className="label-sm text-ink-3">Fichero</span>
              </th>
              <th scope="col" className="p-3">
                <span className="label-sm text-ink-3">Autor</span>
              </th>
              <th scope="col" className="p-3">
                <span className="label-sm text-ink-3">Licencia</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {FOTOS_PROVISIONALES.map((f) => (
              <tr
                key={f.fichero}
                className="border-b border-rule last:border-0"
              >
                <td className="p-3 align-top text-ink-2">{f.subcategoria}</td>
                <td className="p-3 align-top">
                  {f.origen ? (
                    <a
                      href={f.origen}
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                      className="text-ink underline decoration-rule-strong underline-offset-2 hover:text-accent"
                    >
                      {f.commons.replace(/^File:/, "")}
                    </a>
                  ) : (
                    <span className="text-ink">{f.commons}</span>
                  )}
                </td>
                <td className="p-3 align-top text-ink-2">{f.autor}</td>
                <td className="p-3 align-top">
                  <span className="value text-sm text-ink-2">
                    {f.licencia}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
