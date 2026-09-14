import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { NOTICIAS, URL_BLOG } from "@/content/es/noticias";
import { ListaNoticias } from "@/components/noticias/ListaNoticias";
import { CabeceraSeccion } from "@/components/marca/CabeceraSeccion";
import { DELEGACIONES } from "@/content/es/empresa";

export const metadata: Metadata = {
  title: "Noticias y casos de éxito",
  description:
    "Entregas de maquinaria, casos de éxito en obra y novedades de JOFEMESA en Madrid, Asturias, Valencia, Sevilla, Málaga y el resto de delegaciones.",
};

/**
 * Noticias.
 *
 * Las catorce entradas son reales, de su propio blog. Las que había
 * antes en la maqueta eran inventadas, y así se dijo en la reunión:
 * «me refiero a que estas que están ahí publicadas son ficticias».
 *
 * El cuerpo de cada entrada sigue en su servidor —tienen del orden de
 * 267 publicadas—, así que cada tarjeta abre la original. La migración
 * del blog está fuera de esta entrega y anotada como pendiente; lo que
 * no se hace es fabricar un texto y firmarlo como suyo.
 */
export default function PaginaNoticias() {
  return (
    <>
      <CabeceraSeccion
        kicker="Blog y casos de éxito"
        titulo="Lo que sale del almacén, contado desde la obra"
        lede="Entregas de máquina, proyectos en los que hemos estado y novedades de las delegaciones."
        datos={[
          { k: "Entradas aquí", v: `${NOTICIAS.length}` },
          { k: "En el blog", v: "+260" },
          { k: "Delegaciones", v: `${DELEGACIONES.length}` },
        ]}
      >
        <a
          href={URL_BLOG}
          target="_blank"
          rel="noopener"
          className="mt-7 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-ink-inv underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-dark"
        >
          Ver el blog completo en jofemesa.com
          <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
        </a>
      </CabeceraSeccion>

      <section className="section-y">
        <div className="container-placa">
          <ListaNoticias />

          <p className="mt-8 border-t border-rule pt-5 text-sm text-ink-3">
            Las entradas se abren en el blog de jofemesa.com, donde está el
            texto completo y las fotografías. La migración del histórico a esta
            web está pendiente.
          </p>
        </div>
      </section>
    </>
  );
}
