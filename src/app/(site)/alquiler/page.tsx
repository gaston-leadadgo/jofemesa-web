import { Suspense } from "react";
import type { Metadata } from "next";
import { ALQUILER } from "@/lib/catalog";
import { DELEGACIONES } from "@/content/es/empresa";
import { AlquilerCliente } from "@/components/alquiler/AlquilerCliente";
import { ListaEstatica } from "@/components/alquiler/ListaEstatica";
import { CabeceraSeccion } from "@/components/marca/CabeceraSeccion";

export const metadata: Metadata = {
  title: "Alquiler de maquinaria",
  description:
    "Todo el catálogo de alquiler de JOFEMESA: plataformas elevadoras, manutención de cargas, movimiento de tierras, compactación, energía, aire comprimido y herramienta. Filtrable por altura, alimentación, uso y fabricante.",
};

export default function PaginaAlquiler() {
  return (
    <>
      {/* El titular y la entradilla venden; no cuentan inventario de la
          web. La versión anterior anunciaba cuántas fichas técnicas en
          PDF hay en el catálogo, que es un dato de nuestra intendencia y
          no una razón para alquilar. Lo que decide aquí es que la máquina
          existe, que la tiene una delegación concreta y que sale con su
          transporte. */}
      <CabeceraSeccion
        kicker="Catálogo de alquiler"
        titulo="La máquina que te falta, lista para salir a tu obra."
        lede={
          <>
            Plataformas, manutención, tierras, energía, aire y herramienta, con
            flota, taller y camiones propios. Filtra por altura, alimentación,
            uso o fabricante y pide disponibilidad: te contesta la delegación
            que tiene la máquina.
          </>
        }
        datos={[
          { k: "Referencias", v: `${ALQUILER.length}` },
          { k: "Altura máxima", v: "57 m" },
          { k: "Delegaciones", v: `${DELEGACIONES.length}` },
        ]}
        cta={{ href: "/consultar-disponibilidad", texto: "Consultar disponibilidad" }}
        secundario={{ href: "/asesor", texto: "No sé qué máquina necesito" }}
      />

      {/* El <Suspense> es obligatorio alrededor de lo que lee la URL. Y
          el respaldo NO es un esqueleto: es catálogo renderizado en
          servidor, así que el HTML servido trae máquinas de verdad para
          los rastreadores y para la primera pintura. */}
      <Suspense fallback={<ListaEstatica />}>
        <AlquilerCliente />
      </Suspense>
    </>
  );
}
