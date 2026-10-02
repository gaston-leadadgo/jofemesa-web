import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, Phone, Scale, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CURSOS, esCursoConvocatoria, type CursoId } from "@/content/es/formacion";
import { SEDE_FORMACION } from "@/content/es/empresa";
import { EnlaceCalendario } from "./EnlaceCalendario";
import { ProximasCurso } from "./ProximasCurso";

/**
 * La información detallada de un curso. La misma pieza sirve para el
 * modal que se abre desde /formacion y para la página propia del curso,
 * que es la que se comparte y la que indexa Google.
 */
export function FichaCurso({
  id,
  variante,
}: {
  id: CursoId;
  variante: "modal" | "pagina";
}) {
  const c = CURSOS[id];
  const abierta = esCursoConvocatoria(id);
  const Titulo = variante === "pagina" ? "h1" : "h2";

  const parrafo = (texto: string, i: number) => {
    const nota = texto.startsWith("Nota:");
    const partes = texto.split("{calendario}");
    return (
      <p
        key={i}
        className={cn(
          "leading-relaxed",
          nota ? "mt-3 border-l-2 border-rule-strong pl-3 text-sm text-ink-3" : "mt-2 text-base text-ink-2",
        )}
      >
        {partes.map((t, j) => (
          <span key={j}>
            {t}
            {j < partes.length - 1 && abierta && (
              <EnlaceCalendario
                curso={id}
                className="font-semibold text-accent underline decoration-2 underline-offset-4 hover:text-accent-hover"
              >
                calendario de convocatorias abiertas
              </EnlaceCalendario>
            )}
          </span>
        ))}
      </p>
    );
  };

  return (
    <article>
      <header>
        <div className="flex flex-wrap items-center gap-2">
          {(c.certificacion || c.norma) && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-3 py-1 text-xs font-semibold text-accent">
              {c.certificacion && <BadgeCheck size={14} strokeWidth={2} aria-hidden="true" />}
              {[c.certificacion, c.norma].filter(Boolean).join(" · ")}
            </span>
          )}
          <span className="rounded-full border border-rule-strong px-3 py-1 text-xs font-semibold text-ink-2">
            {abierta ? "Convocatoria abierta" : "A medida"}
          </span>
        </div>

        <Titulo className="mt-4 max-w-[30ch] font-[family-name:var(--font-display)] text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-ink">
          {c.titulo}
        </Titulo>
        <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-ink-2 md:text-lg">{c.descripcion}</p>

        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-3">
          <Dato icono={<Clock size={15} strokeWidth={2} aria-hidden="true" />} k="Duración" v={c.duracion} />
          <Dato icono={<Users size={15} strokeWidth={2} aria-hidden="true" />} k="Modalidad" v={c.modalidad} />
          <Dato
            icono={<Scale size={15} strokeWidth={2} aria-hidden="true" />}
            k="Normativa"
            v={c.normativa.join(" · ")}
            className="col-span-2 md:col-span-1"
          />
        </dl>
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
        <div className="divide-y divide-rule">
          {c.preguntas.map((q) => (
            <section key={q.p} className="py-5 first:pt-0">
              <h3 className="text-lg font-semibold text-ink">{q.p}</h3>
              {q.r.map(parrafo)}
            </section>
          ))}
        </div>

        <aside className="flex flex-col gap-4 md:sticky md:top-4 md:self-start">
          {abierta && <ProximasCurso curso={id} />}

          <div className="rounded-3xl bg-inverse p-5 text-ink-inv-2">
            <p className="text-base font-semibold text-ink-inv">
              {abierta ? "¿Otra fecha o un grupo a formar?" : "¿Quieres este curso?"}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">
              Cuéntanos cuántas personas y dónde, y Formación te prepara la propuesta.
            </p>
            <Link
              href={`/formacion/solicitar?curso=${id}`}
              className="btn-accent mt-4 flex h-11 items-center justify-center gap-2 bg-accent px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
            >
              Solicitar información
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </Link>
            <a
              href={`tel:${SEDE_FORMACION.tel}`}
              className="value mt-3 flex min-h-10 items-center justify-center gap-2 text-sm text-ink-inv transition-colors duration-200 hover:text-accent-dark"
            >
              <Phone size={14} strokeWidth={2} aria-hidden="true" />
              Formación · {SEDE_FORMACION.telefono}
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Dato({
  icono,
  k,
  v,
  className,
}: {
  icono: React.ReactNode;
  k: string;
  v: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-surface px-4 py-3", className)}>
      <dt className="meta flex items-center gap-1.5 text-ink-3">
        <span className="text-accent">{icono}</span>
        {k}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{v}</dd>
    </div>
  );
}
