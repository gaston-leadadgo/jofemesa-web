import type { Metadata } from "next";
import Link from "next/link";
import { DATOS_PENDIENTES } from "@/content/es/empresa";
import { CATALOGO } from "@/lib/catalog";
import { SPEC_POR_KEY, type SpecKey } from "@/lib/catalog/types";

export const metadata: Metadata = {
  title: "Datos pendientes de confirmar",
  robots: { index: false, follow: false },
};

/**
 * La lista de deberes del cliente.
 *
 * Es el entregable honesto de todo el modelo Dato<T>: en vez de rellenar los
 * huecos con cifras plausibles, los contamos. El cliente se sienta una tarde,
 * rellena esto, y la web pasa de "casi" a "completa".
 */
export default function PaginaDatosPendientes() {
  const filas: { maquina: string; slug: string; specs: string[] }[] = [];
  let pendientes = 0;
  let estimadas = 0;
  let confirmadas = 0;
  let sinImagen = 0;
  let sinFicha = 0;

  for (const m of CATALOGO) {
    const suyas: string[] = [];
    for (const [k, d] of Object.entries(m.specs)) {
      if (d.estado === "pendiente") {
        pendientes++;
        suyas.push(SPEC_POR_KEY[k as SpecKey]?.etiqueta ?? k);
      } else if (d.estado === "estimado") estimadas++;
      else if (d.estado === "confirmado") confirmadas++;
    }
    if (!m.imagenes.length) sinImagen++;
    if (!m.fichaTecnica) sinFicha++;
    if (suyas.length)
      filas.push({ maquina: `${m.marca} ${m.modelo}`, slug: m.slug, specs: suyas });
  }

  return (
    <div className="container-placa py-14">
      <p className="label text-ink-3">Interno · no indexado</p>
      <h1 className="display-2 mt-4 text-ink">Datos pendientes de confirmar</h1>
      <p className="lede mt-5 max-w-[64ch] text-ink-2">
        Todo lo que la web no sabe, contado en vez de inventado. Ninguna de
        estas cifras aparece en el sitio como si fuera cierta: donde falta un
        dato, el usuario ve una etiqueta de pendiente.
      </p>

      <dl className="mt-10 grid grid-cols-2 gap-px border border-rule bg-rule lg:grid-cols-5">
        {[
          { k: "Máquinas", v: CATALOGO.length },
          { k: "Specs de ficha real", v: confirmadas },
          { k: "Specs de fabricante", v: estimadas },
          { k: "Specs pendientes", v: pendientes },
          { k: "Sin fotografía", v: sinImagen },
        ].map((c) => (
          <div key={c.k} className="bg-surface p-5">
            <dt className="label-sm text-ink-3">{c.k}</dt>
            <dd className="value-lg mt-2 text-ink">{c.v}</dd>
          </div>
        ))}
      </dl>

      {/* ---------- Datos de empresa ---------- */}
      <section className="mt-14">
        <h2 className="display-3 text-ink">De la empresa</h2>
        <ul className="mt-6 space-y-px bg-rule">
          {DATOS_PENDIENTES.map((d) => (
            <li key={d.campo} className="bg-surface p-5">
              <p className="title text-ink">{d.campo}</p>
              <p className="mt-2 max-w-[80ch] text-base text-ink-2">{d.nota}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Del catálogo ---------- */}
      <section className="mt-14">
        <h2 className="display-3 text-ink">Del catálogo</h2>
        <p className="mt-4 max-w-[64ch] text-base text-ink-2">
          {sinFicha} de {CATALOGO.length} máquinas no tienen ficha técnica en
          PDF. Las {CATALOGO.length - sinFicha} que sí la tienen usan el
          documento real que ya sirve jofemesa.com.
        </p>

        <div className="mt-6 overflow-x-auto border border-rule">
          <table className="w-full border-collapse text-left text-base">
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className="p-4">
                  <span className="label text-ink-3">Máquina</span>
                </th>
                <th scope="col" className="p-4">
                  <span className="label text-ink-3">Especificaciones sin confirmar</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.slug} className="border-b border-rule last:border-0">
                  <td className="p-4 align-top">
                    <Link
                      href={`/maquina/${f.slug}`}
                      className="font-semibold text-ink hover:text-accent"
                    >
                      {f.maquina}
                    </Link>
                  </td>
                  <td className="p-4 align-top text-ink-2">
                    {f.specs.join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
