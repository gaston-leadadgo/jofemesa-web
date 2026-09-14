import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calendar } from "lucide-react";
import { fecha } from "@/lib/utils/format";
import {
  CATEGORIAS_NOTICIA,
  NOTICIAS_RECIENTES,
} from "@/content/es/noticias";

/**
 * S8 · Noticias en la portada.
 *
 * Tres entradas, no más. Son reales —de su blog, con su fecha— y abren
 * la original en jofemesa.com, donde está el cuerpo. Lo que había antes
 * en la maqueta que se revisó eran entradas inventadas, y así se dijo:
 * «estas que están ahí publicadas son ficticias».
 */
export function Noticias() {
  return (
    <section className="section-y border-b border-rule">
      <div className="container-placa">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div data-revelar>
            <p className="label text-accent">Casos de éxito</p>
            <h2 className="display-2 mt-3 max-w-[26ch] text-ink">
              Dónde ha estado nuestra maquinaria
            </h2>
          </div>
          <Link
            href="/noticias"
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
          >
            Ver todas las noticias
            <ArrowRight
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <ul
          className="mt-7 grid gap-px border border-rule bg-rule md:grid-cols-3"
          data-escalonar
        >
          {NOTICIAS_RECIENTES.map((n) => (
            <li key={n.slug} className="bg-surface">
              <a
                href={n.url}
                target="_blank"
                rel="noopener"
                className="group flex h-full flex-col p-5 transition-colors duration-200 hover:bg-sunken md:p-6"
              >
                <span className="flex items-center gap-2.5">
                  <span className="label-sm bg-sunken px-2 py-1 text-ink-2">
                    {
                      CATEGORIAS_NOTICIA.find((c) => c.id === n.categoria)
                        ?.nombre
                    }
                  </span>
                  {n.delegacion && (
                    <span className="label-sm text-ink-3">{n.delegacion}</span>
                  )}
                </span>

                <h3 className="title mt-4 text-ink transition-colors duration-200 group-hover:text-accent">
                  {n.titulo}
                </h3>
                <p className="mt-2.5 flex-1 text-sm text-ink-2">
                  {n.entradilla}
                </p>

                <span className="mt-5 flex items-center justify-between gap-3 border-t border-rule pt-3.5">
                  <time
                    dateTime={n.fecha}
                    className="label-sm flex items-center gap-1.5 text-ink-3"
                  >
                    <Calendar size={13} strokeWidth={1.75} aria-hidden="true" />
                    {fecha(n.fecha)}
                  </time>
                  <ArrowUpRight
                    size={17}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="shrink-0 text-rule-strong transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-accent"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
