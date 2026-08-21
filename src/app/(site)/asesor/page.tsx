import { Suspense } from "react";
import type { Metadata } from "next";
import { AsesorUrl } from "@/components/asesor/Asesor";

export const metadata: Metadata = {
  title: "¿Qué máquina necesito?",
  description:
    "Tres preguntas y te decimos qué maquinaria de nuestro parque encaja con tu trabajo, tu altura y tu terreno. Sin llamar y sin describir la obra a ciegas.",
};

/* Se renderiza por petición: el estado del asistente vive en la URL, y
   prerenderizado el HTML solo contendría el hueco vacío del paso 1. */
export const dynamic = "force-dynamic";

export default function PaginaAsesor() {
  return (
    <div className="container-placa py-8 md:py-10">
      <Suspense fallback={<p className="text-ink-2">Cargando el asesor…</p>}>
        <AsesorUrl />
      </Suspense>
    </div>
  );
}
