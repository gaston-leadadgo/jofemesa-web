import Link from "next/link";
import { Download, Phone, Check, Layers } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { DELEGACIONES_POR_ID, TELEFONO_PRINCIPAL } from "@/content/es/empresa";
import { specsAgrupadas, relacionadas } from "@/lib/catalog";
import { SUBCATEGORIA_POR_SLUG, FAMILIA_POR_ID } from "@/lib/catalog/familias";
import type { Maquina, SpecGrupo } from "@/lib/catalog/types";
import { DatoValor } from "@/components/spec/DatoValor";
import { ImagenMaquina } from "@/components/maquina/ImagenMaquina";
import { BotonComparar } from "./BotonComparar";

const NOMBRE_GRUPO: Record<SpecGrupo, string> = {
  prestaciones: "Prestaciones",
  capacidades: "Capacidades",
  dimensiones: "Dimensiones",
  motorizacion: "Motorización",
};

/**
 * La ficha de máquina. UN solo componente de servidor que sirve a la vez
 * la página rastreable (/maquina/[slug]) y el modal interceptado.
 *
 * Que sea de servidor tiene una consecuencia buena: la tabla de
 * especificaciones no viaja al navegador como JavaScript.
 */
export function FichaMaquina({
  maquina: m,
  variante,
}: {
  maquina: Maquina;
  variante: "pagina" | "modal";
}) {
  const grupos = specsAgrupadas(m);
  /* La frase del subrayado ámbar solo se escribe si hay algo subrayado:
     si no, habla de una marca que no aparece en esta página. */
  const hayEstimadas = [...grupos.values()]
    .flat()
    .some(({ dato }) => dato.estado === "estimado");
  const subcat = SUBCATEGORIA_POR_SLUG[m.subcategoriaSlug];
  const familia = FAMILIA_POR_ID[m.familia];
  const otras = variante === "pagina" ? relacionadas(m) : [];

  const kb = m.fichaTecnica
    ? m.fichaTecnica.bytes > 1_048_576
      ? `${(m.fichaTecnica.bytes / 1_048_576).toFixed(1).replace(".", ",")} MB`
      : `${Math.round(m.fichaTecnica.bytes / 1024)} KB`
    : null;

  return (
    <div>
      <div
        className={cn(
          "grid gap-8",
          variante === "modal" ? "lg:grid-cols-[55%_45%]" : "lg:grid-cols-2 lg:gap-12",
        )}
      >
        {/* ---------- Imagen ---------- */}
        <div>
          <div className="relative aspect-4/3 overflow-hidden border border-rule bg-muted">
            <ImagenMaquina
              maquina={m}
              sizes={variante === "modal" ? "600px" : "(min-width:1024px) 640px, 92vw"}
              prioridad={variante === "pagina"}
            />
          </div>

          {m.destacados.length > 0 && (
            <ul className="mt-6 space-y-2">
              {m.destacados.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-base text-ink-2">
                  <Check
                    size={17}
                    strokeWidth={2.5}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-ok"
                  />
                  {d}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ---------- Datos ---------- */}
        <div>
          <p className="label text-ink-3">
            {subcat?.nombre ?? familia?.nombre}
          </p>
          <p className="mt-3 text-base font-semibold text-ink-2">{m.marca}</p>
          <h1
            className={cn(
              "text-ink",
              variante === "modal" ? "display-3" : "display-2 mt-1",
            )}
          >
            {m.modelo}
          </h1>

          <p className="lede mt-5 text-ink-2">{m.descripcionCorta}</p>

          {m.gama && (
            <p className="mt-5 flex items-start gap-3 border-l-2 border-wait bg-sunken px-4 py-3 text-base text-ink-2">
              <Layers
                size={17}
                strokeWidth={2}
                aria-hidden="true"
                className="mt-1 shrink-0 text-wait-text"
              />
              <span>
                Esta ficha es la <strong className="font-semibold text-ink">gama completa</strong>,
                no una unidad concreta. El catálogo de JOFEMESA publica esta
                familia por rangos, así que aquí verás el máximo de la gama:
                dinos qué necesitas mover y a qué altura y te decimos el
                modelo exacto.
              </span>
            </p>
          )}

          {/* ---------- Especificaciones ---------- */}
          <div className="mt-8">
            <h2 className="label border-b border-ink pb-3 text-ink">
              Especificaciones
            </h2>
            {[...grupos.entries()].map(([grupo, filas]) => (
              <div key={grupo} className="mt-5">
                <h3 className="label-sm text-ink-3">
                  {NOMBRE_GRUPO[grupo as SpecGrupo] ?? grupo}
                </h3>
                <dl className="mt-2 divide-y divide-rule border-t border-rule">
                  {filas.map(({ def, dato }) => (
                    <div
                      key={def.key}
                      className="flex items-baseline justify-between gap-4 py-2.5"
                    >
                      <dt className="text-base text-ink-2">{def.etiqueta}</dt>
                      <dd className="text-right">
                        <DatoValor dato={dato} def={def} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

            <p className="mt-4 text-sm text-ink-3">
              Las cifras salen del Catálogo General de Maquinaria de JOFEMESA
              y de la ficha técnica del fabricante.
              {hayEstimadas
                ? " Las subrayadas en ámbar están sin confirmar contra la unidad concreta: las comprobamos al responder tu solicitud."
                : " La disponibilidad y las cotas de acceso las confirmamos al responder tu solicitud."}
            </p>
          </div>

          {/* ---------- Aplicaciones ---------- */}
          {m.aplicaciones.length > 0 && (
            <div className="mt-8">
              <h2 className="label text-ink-3">Para qué se usa</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {m.aplicaciones.map((a) => (
                  <li
                    key={a}
                    className="border border-rule bg-sunken px-3 py-1.5 text-sm text-ink-2"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ---------- Disponibilidad ----------
              «Se sirve desde» y no «se puede recoger en». Es una
              diferencia de precisión, no de estilo: el cliente no
              publica en qué parque está cada unidad, así que decir «se
              recoge en Málaga» sería una afirmación que no podemos
              sostener. Lo que sí es cierto es que el catálogo es común a
              las diez delegaciones y que la fecha la confirma la que te
              atienda. */}
          <div className="mt-8">
            <h2 className="label text-ink-3">Se sirve desde</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
              {m.delegaciones.map((d) => {
                const del = DELEGACIONES_POR_ID[d];
                if (!del) return null;
                return (
                  <li
                    key={d}
                    className="flex items-center gap-2 py-1 text-base text-ink-2"
                  >
                    <span aria-hidden="true" className="size-3 shrink-0 bg-ok" />
                    {del.nombre}
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-sm text-ink-3">
              Con transporte propio entre delegaciones. La disponibilidad de
              la fecha la confirma la delegación que te atiende al responder
              tu solicitud.
            </p>
          </div>

          {m.notaAsesor && (
            <p className="mt-8 border-l-2 border-accent bg-accent-tint px-4 py-3 text-base text-ink">
              {m.notaAsesor}
            </p>
          )}

          {/* ---------- Acciones ---------- */}
          <div className="mt-8 space-y-3 border-t border-rule pt-6">
            <Link
              href={`/consultar-disponibilidad?m=${m.slug}`}
              className="btn-accent flex h-14 items-center justify-center bg-accent text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              Consultar disponibilidad
            </Link>

            {/* `md:flex-1` y no `flex-1`: en columna el eje principal es
                el vertical, así que un `flex-basis: 0` se comía el `h-12`
                y los dos botones quedaban en 22 px de alto en el móvil. */}
            <div className="flex flex-col gap-3 md:flex-row">
              {/* Si no hay PDF el botón NO se dibuja: nunca una descarga rota. */}
              {m.fichaTecnica && (
                <a
                  href={m.fichaTecnica.src}
                  download
                  className="flex h-12 items-center justify-center gap-2 border border-rule-control text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken md:flex-1"
                >
                  <Download size={18} strokeWidth={1.75} aria-hidden="true" />
                  Ficha técnica
                  <span className="value text-sm text-ink-3">({kb})</span>
                </a>
              )}
              <a
                href={`tel:${TELEFONO_PRINCIPAL.tel}`}
                className="flex h-12 items-center justify-center gap-2 border border-rule-control text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken md:flex-1"
              >
                <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
                <span className="value">{TELEFONO_PRINCIPAL.visible}</span>
              </a>
            </div>

            <BotonComparar slug={m.slug} nombre={`${m.marca} ${m.modelo}`} />
          </div>
        </div>
      </div>

      {/* ---------- Relacionadas: solo en la página ---------- */}
      {otras.length > 0 && (
        <section className="mt-10 border-t border-rule pt-8">
          <h2 className="display-3 text-ink">Máquinas parecidas</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {otras.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/maquina/${o.slug}`}
                  className="group flex h-full flex-col border border-rule transition-colors duration-200 hover:border-rule-strong"
                >
                  <span className="relative block aspect-4/3 overflow-hidden border-b border-rule bg-muted">
                    <ImagenMaquina maquina={o} sizes="33vw" compacto />
                  </span>
                  <span className="flex flex-1 flex-col p-4">
                    <span className="label-sm text-ink-3">{o.marca}</span>
                    <span className="title mt-1 text-ink group-hover:text-accent">
                      {o.modelo}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
