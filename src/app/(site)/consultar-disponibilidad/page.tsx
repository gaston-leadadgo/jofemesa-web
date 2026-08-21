import { Suspense } from "react";
import type { Metadata } from "next";
import { FormularioDisponibilidad } from "@/components/forms/FormularioDisponibilidad";

export const metadata: Metadata = {
  title: "Consultar disponibilidad",
  description:
    "Dinos qué máquina necesitas, para qué fechas y dónde está la obra. Te confirmamos disponibilidad y condiciones desde la delegación que la tiene.",
};

/* El formulario precarga máquinas desde ?m= y el contexto del asesor desde
   ?contexto=: prerenderizado llegaría vacío. */
export const dynamic = "force-dynamic";

export default function PaginaDisponibilidad() {
  return (
    <div className="container-placa py-10 md:py-14">
      <h1 className="display-2 max-w-[26ch] text-ink">
        Dinos qué necesitas y qué día.
      </h1>
      <p className="lede mt-5 max-w-[58ch] text-ink-2">
        No hay pasarela de pago: el precio final depende del transporte, de la
        duración y de la disponibilidad real de cada delegación, así que lo
        confirmamos contigo.
      </p>

      <div className="mt-12">
        <Suspense fallback={<div className="h-96 border border-rule bg-sunken" />}>
          <FormularioDisponibilidad />
        </Suspense>
      </div>
    </div>
  );
}
