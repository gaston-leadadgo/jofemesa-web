import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock,
  GraduationCap,
  Info,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Scale,
  Wrench,
} from "lucide-react";
import { CabeceraSeccion } from "@/components/marca/CabeceraSeccion";
import { CalendarioFormacion } from "@/components/formacion/CalendarioFormacion";
import { EnlaceCalendario } from "@/components/formacion/EnlaceCalendario";
import { CONVOCATORIAS } from "@/content/es/convocatorias";
import {
  CURSOS,
  LEGISLACION,
  ORDEN_A_MEDIDA,
  ORDEN_CURSOS,
  SEDES_CURSO,
  TODOS_LOS_CURSOS,
  esCursoConvocatoria,
  type CursoId,
} from "@/content/es/formacion";
import { SEDE_FORMACION } from "@/content/es/empresa";
import { ambiente } from "@/lib/img/ambiente";

export const metadata: Metadata = {
  title: "Formación de operadores y calendario de cursos",
  description:
    "Cursos de operador de plataformas elevadoras (UNE 58923), carretillas (UNE 58451), trabajos en altura, andamios de torre móvil y espacios confinados, y formación a medida: IPAF, movimiento de tierras, puente grúa, camión pluma y más. Convocatorias en San Fernando de Henares (Madrid) y Puerto de Sagunto (Valencia).",
};

/**
 * Formación.
 *
 * Página propia a petición del cliente (28/09/2026): hay que darle mucha
 * más importancia al departamento de Formación. Sigue el punto 5 del
 * guion de estructura web —catálogo de cursos, calendario nacional y
 * legislación de referencia— y añade las sedes, que es lo segundo que
 * pregunta quien busca un curso después de la fecha.
 *
 * El calendario sale del Excel de convocatorias del cliente. Está en
 * vista de lista, filtrable, y preparado para que el panel de WordPress
 * gestione plazas y ocupación: cuando esos dos campos lleguen con valor,
 * cada fila dice sola «Quedan 3 plazas» o «Completo».
 */
export default function PaginaFormacion() {
  const foto = ambiente("hero/formacion");
  const porCurso = (id: string) => CONVOCATORIAS.filter((c) => c.curso === id).length;

  return (
    <>
      <CabeceraSeccion
        kicker="Departamento de Formación"
        titulo="Formación de operadores, con la máquina delante."
        lede="Cursos certificados de plataformas elevadoras, carretillas, trabajos en altura, andamios y espacios confinados, con convocatorias cada semana en Madrid y en Valencia."
        foto={foto}
        cta={{ href: "#calendario", texto: "Ver convocatorias" }}
        secundario={{ href: "#cursos", texto: "Catálogo de cursos" }}
      >
        <a
          href={`tel:${SEDE_FORMACION.tel}`}
          className="value mt-5 inline-flex min-h-11 items-center gap-2 text-base text-ink-inv-2 transition-colors duration-200 hover:text-accent-dark"
        >
          <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
          Formación · {SEDE_FORMACION.telefono}
        </a>
      </CabeceraSeccion>

      {/* ---------- Datos de autoridad ----------
          Petición del cliente (02/10/2026): en un bloque propio justo
          debajo de la cabecera, no metidos en ella. Todo sale de sus
          documentos: certificados AENOR y Bureau Veritas, homologación
          IPAF y el Excel de convocatorias. */}
      <section aria-label="Formación certificada" className="border-b border-rule bg-surface">
        <dl className="container-placa grid grid-cols-2 gap-x-6 gap-y-6 py-7 md:py-8 lg:grid-cols-4" data-escalonar>
          {AUTORIDAD.map((d) => (
            <div key={d.k} className="border-l-2 border-accent pl-4">
              <dt className="sr-only">{d.k}</dt>
              <dd>
                <span className="block font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.4vw,2.1rem)] leading-none font-extrabold tracking-[-0.02em] text-ink">
                  {d.v}
                </span>
                <span className="mt-2 block text-sm leading-snug text-ink-2">{d.texto}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Índice de la página: cuatro saltos, no un menú. */}
      <nav
        aria-label="En esta página"
        className="sticky top-14 z-30 border-b border-rule bg-surface/95 backdrop-blur-sm md:top-15"
      >
        <div className="container-placa pista-horizontal flex gap-1 overflow-x-auto py-2">
          {[
            ["#cursos", "Cursos"],
            ["#calendario", "Convocatorias"],
            ["#sedes", "Sedes"],
            ["#legislacion", "Legislación"],
          ].map(([href, texto]) => (
            <a
              key={href}
              href={href}
              className="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-medium text-ink-2 transition-colors duration-200 hover:bg-sunken hover:text-ink"
            >
              {texto}
            </a>
          ))}
        </div>
      </nav>

      {/* ---------- Catálogo de cursos ---------- */}
      <section id="cursos" className="py-10 scroll-mt-32 md:py-12 lg:py-14 border-b border-rule">
        <div className="container-placa">
          <p className="label text-accent">Catálogo de cursos</p>
          <h2 className="display-2 mt-3 max-w-[36ch] text-ink">
            Si no encuentras el curso que necesitas, lo diseñamos exclusivamente
            para ti.
          </h2>

          <div className="mt-9 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b border-rule-strong pb-3">
            <h3 className="display-3 text-ink">Convocatorias abiertas</h3>
            <p className="text-sm text-ink-3">
              Fechas fijas cada semana en San Fernando de Henares y Puerto de Sagunto
            </p>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-escalonar>
            {ORDEN_CURSOS.map((id) => (
              <TarjetaCurso key={id} id={id} convocatorias={porCurso(id)} />
            ))}
            {/* Sexta casilla: con cinco cursos la rejilla de tres dejaba un
                hueco, y el hueco es justo lo que hacía la página vacía. */}
            <li className="flex flex-col justify-between gap-6 rounded-3xl bg-inverse p-6 text-ink-inv-2">
              <div>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-white">
                  <CalendarDays size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-none font-extrabold tracking-[-0.02em] text-ink-inv">
                  {CONVOCATORIAS.length}
                </p>
                <p className="mt-2 text-base leading-relaxed">
                  convocatorias en 2026, todas de 07:30 a 15:30, en San Fernando
                  de Henares y Puerto de Sagunto.
                </p>
              </div>
              <EnlaceCalendario
                curso={null}
                className="btn-accent inline-flex h-12 items-center justify-center gap-2 bg-accent px-5 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
              >
                Ver el calendario
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </EnlaceCalendario>
            </li>
          </ul>

          <div className="mt-11 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b border-rule-strong pb-3">
            <h3 className="display-3 text-ink">Resto de cursos</h3>
            <p className="text-sm text-ink-3">
              A medida, en tus instalaciones o en las nuestras
            </p>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-escalonar>
            {ORDEN_A_MEDIDA.map((id) => (
              <TarjetaCurso key={id} id={id} convocatorias={0} />
            ))}
            <li className="flex flex-col justify-between gap-6 rounded-3xl bg-inverse p-6 text-ink-inv-2 lg:col-span-2 xl:col-span-1">
              <div>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-white">
                  <Wrench size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="mt-5 text-lg font-semibold text-ink-inv">
                  ¿No está tu curso?
                </p>
                <p className="mt-2 text-base leading-relaxed">
                  Lo diseñamos para tu equipo, con tus máquinas y en tus
                  instalaciones o en las nuestras.
                </p>
              </div>
              <Link
                href="/formacion/solicitar?curso=otro"
                className="btn-accent inline-flex h-12 items-center justify-center gap-2 bg-accent px-5 text-base font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
              >
                Cuéntanos qué necesitas
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- Calendario ---------- */}
      <section id="calendario" className="py-10 scroll-mt-32 md:py-12 lg:py-14 border-b border-rule bg-sunken">
        <div className="container-placa">
          <p className="label text-accent">Calendario de formaciones</p>
          <h2 className="display-2 mt-3 max-w-[24ch] text-ink">
            Convocatorias abiertas.
          </h2>
          <p className="mt-4 max-w-[60ch] text-base text-ink-2">
            Todas las jornadas son de 07:30 a 15:30. Abre la información de
            cada curso o pide tu plaza desde la convocatoria, y el equipo de
            Formación te confirma la inscripción.
          </p>
          <div className="mt-6">
            <CalendarioFormacion />
          </div>
        </div>
      </section>

      {/* ---------- Sedes ---------- */}
      <section id="sedes" className="py-10 scroll-mt-32 md:py-12 lg:py-14 border-b border-rule">
        <div className="container-placa">
          <p className="label text-accent">Dónde se imparten</p>
          <h2 className="display-2 mt-3 text-ink">Sedes de formación.</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {Object.values(SEDES_CURSO).map((s) => (
              <li key={s.id} className="tarjeta flex flex-col gap-4 p-6 md:p-7">
                <div>
                  <p className="meta text-ink-3">{s.tipo}</p>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-ink">
                    {s.nombre}
                  </h3>
                </div>
                <p className="flex items-start gap-3 text-base text-ink-2">
                  <MapPin size={17} strokeWidth={1.75} aria-hidden="true" className="mt-1 shrink-0 text-accent" />
                  <span>
                    {s.direccion}
                    <br />
                    <span className="value text-sm">{s.cp}</span> {s.localidad}
                  </span>
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <a
                    href={`tel:${s.tel}`}
                    className="value inline-flex min-h-11 items-center gap-2 text-ink transition-colors duration-200 hover:text-accent"
                  >
                    <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
                    {s.telefono}
                  </a>
                  <a
                    href={`mailto:${s.email}`}
                    className="inline-flex min-h-11 items-center gap-2 text-ink-2 underline decoration-rule-strong underline-offset-4 transition-colors duration-200 hover:text-ink"
                  >
                    <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
                    {s.email}
                  </a>
                </div>
                <a
                  href={s.maps}
                  target="_blank"
                  rel="noopener"
                  className="mt-auto inline-flex h-12 items-center justify-center gap-2 border border-rule-control text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken pastilla"
                >
                  <Navigation size={16} strokeWidth={2} aria-hidden="true" />
                  Cómo llegar
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Legislación ---------- */}
      <section id="legislacion" className="py-10 scroll-mt-32 md:py-12 lg:py-14">
        <div className="container-placa grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-accent">Legislación de referencia</p>
            <h2 className="display-3 mt-3 text-ink">
              Por qué la formación no es opcional.
            </h2>
            <p className="mt-4 text-base text-ink-2">
              La normativa obliga a que quien maneja estos equipos esté formado
              para hacerlo. Estas son las referencias en las que se apoyan
              nuestros cursos.
            </p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule lg:col-span-8">
            {LEGISLACION.map((l) => (
              <li key={l.ref} className="flex gap-4 bg-surface p-5 md:p-6">
                <Scale size={18} strokeWidth={1.75} aria-hidden="true" className="mt-1 shrink-0 text-ink-3" />
                <div>
                  <p className="text-base font-semibold text-ink">
                    {l.ref} <span className="font-normal text-ink-2">· {l.titulo}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{l.nota}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

const AUTORIDAD = [
  {
    k: "Certificación AENOR",
    v: "AENOR",
    texto: "Cursos certificados en UNE 58923 (plataformas) y UNE 58451 (carretillas)",
  },
  {
    k: "Homologación IPAF",
    v: "IPAF",
    texto: "Centro homologado. Programa certificado por Bureau Veritas (ISO 18878)",
  },
  {
    k: "Convocatorias en 2026",
    v: String(CONVOCATORIAS.length),
    texto: "Convocatorias en 2026, cada semana en Madrid y en Valencia",
  },
  {
    k: "Cursos",
    v: String(TODOS_LOS_CURSOS.length),
    texto: `Cursos en catálogo y ${Object.keys(SEDES_CURSO).length} sedes de formación propias`,
  },
];

function TarjetaCurso({ id, convocatorias }: { id: CursoId; convocatorias: number }) {
  const c = CURSOS[id];
  return (
    <li className="tarjeta flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-accent-tint text-accent">
          <GraduationCap size={20} strokeWidth={1.75} aria-hidden="true" />
        </span>
        {c.norma && (
          <span className="inline-flex items-center gap-1 rounded-full border border-rule-strong px-3 py-1 text-xs font-semibold text-ink-2">
            {c.certificacion && (
              <BadgeCheck size={13} strokeWidth={2} aria-hidden="true" className="text-accent" />
            )}
            {c.norma}
          </span>
        )}
      </div>
      <h4 className="mt-5 text-lg font-semibold text-ink">{c.nombre}</h4>
      <p className="mt-2 flex-1 text-base leading-relaxed text-ink-2">{c.paraQuien}</p>
      <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-3">
        <Clock size={14} strokeWidth={2} aria-hidden="true" />
        {c.duracion}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-rule pt-3">
        <Link
          href={`/formacion/cursos/${id}`}
          scroll={false}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent"
        >
          <Info size={15} strokeWidth={2} aria-hidden="true" className="text-accent" />
          Ver información del curso
        </Link>
        {esCursoConvocatoria(id) && convocatorias > 0 && (
          <EnlaceCalendario
            curso={id}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover"
          >
            <CalendarDays size={15} strokeWidth={2} aria-hidden="true" />
            {convocatorias} convocatorias
          </EnlaceCalendario>
        )}
      </div>
    </li>
  );
}
