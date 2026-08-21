import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { VENTA } from "@/lib/catalog";
import { TarjetaMaquina } from "@/components/maquina/TarjetaMaquina";

export const metadata: Metadata = {
  title: "Venta de carretillas y recambios",
  description:
    "Carretillas elevadoras contrapesadas y de almacén, nuevas y reacondicionadas, y recambios originales de todas las marcas: Yale, Hyster, Linde, Toyota, Kalmar, Caterpillar y más.",
};

/** Marcas de recambio que ellos mismos publican en su página de venta. */
const MARCAS_RECAMBIO = [
  "Yale",
  "Hyster",
  "Linde",
  "Nissan",
  "Toyota",
  "Kalmar",
  "TCM",
  "Caterpillar",
];

export default function PaginaVenta() {
  return (
    <>
      <section className="ambient-light border-b border-rule">
        <div className="container-placa py-8 md:py-10">
          <p className="label text-ink-2">La otra mitad del negocio</p>
          <h1 className="display-1 mt-4 max-w-[24ch] text-ink" data-revelar>
            También vendemos la máquina, no solo la alquilamos.
          </h1>
          <p className="lede mt-6 max-w-[58ch] text-ink-2">
            Carretillas elevadoras contrapesadas y de almacén, nuevas y
            reacondicionadas. Y recambios originales para maquinaria de
            cualquier marca, no solo de la que vendemos.
          </p>
        </div>
      </section>

      {/* Partner oficial: la credencial que casi ningún competidor pequeño
          puede enseñar, y que hoy está enterrada en su web. */}
      <section className="border-b border-rule bg-sunken">
        <div className="container-placa flex flex-col items-start gap-6 py-10 md:flex-row md:items-center md:gap-10">
          <Image
            src="/marca/partner-jungheinrich.png"
            alt="Partner oficial de Jungheinrich"
            width={210}
            height={42}
            className="h-8 w-auto"
          />
          <p className="max-w-[62ch] text-base text-ink-2">
            Somos{" "}
            <strong className="font-semibold text-ink">
              partner oficial de Jungheinrich
            </strong>{" "}
            y distribuimos todo su catálogo: contrapesadas eléctricas y diésel,
            mástil retráctil, trilaterales EKX y EFX, preparadoras de pedidos,
            transpaletas, apiladores y tractores de arrastre. También su gama
            reacondicionada JUNGSTARS.
          </p>
        </div>
      </section>

      {VENTA.length > 0 && (
        <section className="section-y border-b border-rule">
          <div className="container-placa">
            <h2 className="display-2 max-w-[24ch] text-ink" data-revelar>
              Equipos disponibles ahora
            </h2>
            <ul className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-escalonar>
              {VENTA.map((m, i) => (
                <li key={m.slug}>
                  <TarjetaMaquina maquina={m} prioridad={i < 3} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="container-placa grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <h2 className="display-3 text-ink">Recambios de cualquier marca</h2>
            <p className="mt-5 text-base text-ink-2">
              Vendemos recambios para maquinaria nueva y reacondicionada, sea de
              quien sea. Dinos la marca, el modelo y, si lo tienes, el número de
              serie o la referencia de la pieza.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {MARCAS_RECAMBIO.map((m) => (
                <li
                  key={m}
                  className="border border-rule bg-sunken px-3 py-1.5 text-sm text-ink-2"
                >
                  {m}
                </li>
              ))}
              <li className="px-3 py-1.5 text-sm text-ink-3">y más</li>
            </ul>
          </div>

          <div className="border border-rule bg-sunken p-8">
            <h3 className="title text-ink">¿Buscas una pieza concreta?</h3>
            <p className="mt-3 text-base text-ink-2">
              El formulario es el mismo: dinos qué máquina tienes y qué
              necesitas, y te contestamos con disponibilidad y plazo.
            </p>
            <Link
              href="/consultar-disponibilidad"
              className="btn-accent mt-6 inline-flex h-14 items-center gap-2 bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              Consultar disponibilidad
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
