import Link from "next/link";
import { Phone } from "lucide-react";
import { TELEFONO_PRINCIPAL } from "@/content/es/empresa";
import { CATALOGO } from "@/lib/catalog";
import { Hero } from "@/components/home/Hero";
import { Garantias } from "@/components/home/Garantias";
import { Necesidades } from "@/components/home/Necesidades";
import { Destacadas } from "@/components/home/Destacadas";
import { Autoridad } from "@/components/home/Autoridad";
import { Cobertura } from "@/components/home/Cobertura";
import { Noticias } from "@/components/home/Noticias";
import { AsesorLocal } from "@/components/asesor/Asesor";

/**
 * La portada, con el orden que salió de la reunión del 24/08/2026.
 *
 *   S1  Hero con imagen real, buscador y «lo más pedido».
 *   S2  Raíl de garantías con iconografía (la lámina del cliente).
 *   S3  Las seis familias, también con iconografía.
 *   S4  Asistente de selección guiada.
 *   S5  Las máquinas con foto y ficha oficial.
 *   S6  Delegaciones y mapa — ocupan el sitio que tenía el contacto.
 *   S7  Autoridad, con la antigüedad exacta desde el 24/03/1987.
 *   S8  Noticias reales de su blog.
 *   S9  Cierre.
 *
 * Lo que ya no está: el bloque doble de «venta / mantenimiento», que
 * ahora vive dentro de /servicios.
 */
export default function Portada() {
  /* Las que llevan fotografía oficial y ficha técnica del fabricante.
     Van ordenadas poniendo delante la selección editorial (`destacada`)
     y después el orden del catálogo. `destacada` NO significa «la que
     más se alquila» —ese dato no existe— sino «la que mejor representa
     su subcategoría», que es lo único que podemos afirmar. */
  const conFotoYFicha = CATALOGO.filter(
    (m) => m.imagenes.length > 0 && m.fichaTecnica,
  ).sort(
    (a, b) => Number(b.destacada) - Number(a.destacada) || a.orden - b.orden,
  );

  return (
    <>
      <Hero />
      <Garantias />
      <Necesidades />

      {/* El asesor, empotrado y funcionando. Estado local, así que no
          lee searchParams y la portada entera se prerenderiza: el paso 1
          llega pintado en el HTML. */}
      <AsesorLocal />

      <Destacadas maquinas={conFotoYFicha} />
      <Cobertura />
      <Autoridad />
      <Noticias />

      {/* S9 · Cierre */}
      <section data-surface="dark" className="relative bg-inverse">
        {/* Filete de seguridad: la única aparición del ámbar de la marca. */}
        <div aria-hidden="true" className="h-1 w-full bg-wait" />
        <div className="container-placa section-y-sm text-center">
          <p className="label text-accent-dark">Sin compromiso</p>
          <h2 className="display-2 mx-auto mt-4 max-w-[24ch] text-ink-inv">
            Dinos qué necesitas y qué día. Te confirmamos disponibilidad.
          </h2>
          <p className="lede mx-auto mt-4 max-w-[54ch] text-ink-inv-2">
            Confirmamos disponibilidad, transporte y condiciones contigo antes
            de formalizar nada. Sin pasarela de pago y sin letra pequeña.
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
              <span className="value text-ink-inv">
                {TELEFONO_PRINCIPAL.visible}
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
