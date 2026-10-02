"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { SEDES_CURSO, partesFecha, type CursoConvocatoriaId } from "@/content/es/formacion";
import { proximasDe, useHoy } from "@/lib/formacion/estado";
import { EnlaceCalendario } from "./EnlaceCalendario";

const MAXIMO = 4;

/** Las próximas fechas de un curso, con su botón de plaza. */
export function ProximasCurso({ curso }: { curso: CursoConvocatoriaId }) {
  const hoy = useHoy();
  const todas = proximasDe(curso, hoy);
  const lista = todas.slice(0, MAXIMO);

  return (
    <div className="rounded-3xl border border-rule bg-surface p-5">
      <p className="meta flex items-center gap-1.5 text-ink-3">
        <CalendarDays size={14} strokeWidth={2} aria-hidden="true" className="text-accent" />
        Próximas convocatorias
      </p>
      {lista.length === 0 ? (
        <p className="mt-3 text-sm text-ink-2">
          No hay fechas abiertas ahora mismo. Pídenos información y te
          avisamos de la próxima.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-rule">
          {lista.map((c) => {
            const f = partesFecha(c.fecha);
            return (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-sunken text-ink">
                  <span className="font-[family-name:var(--font-display)] text-lg leading-none">{f.dia}</span>
                  <span className="mt-0.5 text-[0.65rem] font-semibold tracking-wide uppercase opacity-80">
                    {f.mesCorto}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink capitalize">{f.diaSemana}</span>
                  <span className="flex items-center gap-1 text-xs text-ink-3">
                    <MapPin size={11} strokeWidth={2} aria-hidden="true" />
                    {SEDES_CURSO[c.sede].nombre}
                  </span>
                </span>
                <Link
                  href={`/formacion/solicitar?convocatoria=${encodeURIComponent(c.id)}`}
                  className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-accent px-3.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-accent-hover"
                >
                  Solicitar plaza
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {todas.length > 0 && (
        <EnlaceCalendario
          curso={curso}
          className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-accent underline decoration-2 underline-offset-4 hover:text-accent-hover"
        >
          {todas.length > MAXIMO ? `Ver las ${todas.length} fechas en el calendario` : "Ver en el calendario"}
          <ArrowRight size={14} strokeWidth={2.25} aria-hidden="true" />
        </EnlaceCalendario>
      )}
    </div>
  );
}
