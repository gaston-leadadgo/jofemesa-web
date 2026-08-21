import Link from "next/link";
import { Download, Phone, Check } from "lucide-react";
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
              Las cifras subrayadas en ámbar vienen del catálogo del
              fabricante; las confirmamos con la unidad concreta al responder
              tu solicitud.
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

          {/* ---------- Disponibilidad ---------- */}
          <div className="mt-8">
            <h2 className="label text-ink-3">Se puede recoger en</h2>
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
              La disponibilidad de la fecha la confirma la delegación al
              responder tu solicitud.
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

            <div className="flex flex-col gap-3 md:flex-row">
              {/* Si no hay PDF el botón NO se dibuja: nunca una descarga rota. */}
              {m.fichaTecnica && (
                <a
                  href={m.fichaTecnica.src}
                  download
                  className="flex h-12 flex-1 items-center justify-center gap-2 border border-rule-control text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken"
                >
                  <Download size={18} strokeWidth={1.75} aria-hidden="true" />
                  Ficha técnica
                  <span className="value text-sm text-ink-3">({kb})</span>
                </a>
              )}
              <a
                href={`tel:${TELEFONO_PRINCIPAL.tel}`}
                className="flex h-12 flex-1 items-center justify-center gap-2 border border-rule-control text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken"
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
                    <ImagenMaquina maquina={o} sizes="33vw" marca={false} />
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
