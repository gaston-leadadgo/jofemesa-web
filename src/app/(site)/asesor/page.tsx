import type { Metadata } from "next";
import { ALQUILER, FAMILIAS } from "@/lib/catalog";
import { AsesorUrl } from "@/components/asesor/Asesor";
import { CabeceraSeccion } from "@/components/marca/CabeceraSeccion";

export const metadata: Metadata = {
  title: "¿Qué máquina necesito?",
  description:
    "Tres respuestas y te decimos qué maquinaria de nuestro parque encaja con tu trabajo, tu altura y tu terreno. Sin llamar y sin describir la obra a ciegas.",
};

/* Se renderiza por petición: el estado del asistente vive en la URL, y
   prerenderizado el HTML solo contendría el hueco vacío del paso 1. Las
   respuestas las lee el servidor y bajan como prop, así el asistente va
   dentro del HTML en su sitio. */
export const dynamic = "force-dynamic";

const uno = (v: string | string[] | undefined): string =>
  (Array.isArray(v) ? v[0] : v) ?? "";

export default async function PaginaAsesor({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  return (
    <>
      <CabeceraSeccion
        kicker="Asistente de selección guiada"
        titulo="No sabes qué máquina pedir. Normal."
        lede={`Hay ${ALQUILER.length} referencias en ${FAMILIAS.length} familias, y la diferencia entre dos tijeras de la misma altura puede ser que una pase por tu puerta y la otra no. Contesta tres preguntas y te decimos qué encaja, y por qué.`}
        datos={[
          { k: "Preguntas", v: "3" },
          { k: "Referencias", v: `${ALQUILER.length}` },
          { k: "Tiempo", v: "Un minuto" },
        ]}
      />

      <div className="container-placa">
        <AsesorUrl
          inicial={{
            trabajo: uno(q.trabajo),
            parametro: uno(q.parametro),
            entorno: uno(q.entorno),
          }}
        />
      </div>
    </>
  );
}
