"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { EMPRESA, DELEGACIONES } from "@/content/es/empresa";
import { ALQUILER } from "@/lib/catalog";
import { CONVOCATORIAS } from "@/content/es/convocatorias";
import { CURSOS, SEDES_CURSO, partesFecha } from "@/content/es/formacion";
import { Buscador } from "./Buscador";

export type FotoHero = {
  src: string;
  alt: string;
  posicion: string;
  /** La portada de Formación usa la de obra hasta que llegue la suya. */
  provisional?: boolean;
};

type Id = "alquiler" | "formacion";
const ORDEN: Id[] = ["alquiler", "formacion"];
const ROTULO: Record<Id, string> = { alquiler: "Alquiler", formacion: "Formación" };

/** Lo que dura cada portada. Es la duración de la barra de progreso. */
const DURACION_MS = 8000;

const hoyIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const sinSuscripcion = () => () => {};

/**
 * El carrusel del hero.
 *
 * Todas las portadas están SIEMPRE en el HTML —la primera visible desde
 * el servidor, para que el titular y el buscador lleguen pintados—, una
 * encima de otra. Las que no están activas van con `inert`: ni el
 * tabulador ni el lector de pantalla entran en una portada que no se ve.
 *
 * El cambio lo dispara el final de la animación CSS de la barra de
 * progreso (`onAnimationEnd`). Así pausar es gratis: al pasar el ratón,
 * al enfocar algo dentro —el buscador— o con la pestaña oculta, la barra
 * se detiene y con ella el reloj.
 */
export function HeroCarrusel({ fotos }: { fotos: Record<Id, FotoHero> }) {
  const [activa, setActiva] = useState(0);
  const [previa, setPrevia] = useState<number | null>(null);
  /** Sube en cada cambio: reinicia las animaciones de entrada por `key`. */
  const [ciclo, setCiclo] = useState(0);
  const [encima, setEncima] = useState(false);
  const [foco, setFoco] = useState(false);

  const ir = useCallback(
    (i: number) => {
      const destino = (i + ORDEN.length) % ORDEN.length;
      if (destino === activa) return;
      setPrevia(activa);
      setActiva(destino);
      setCiclo((c) => c + 1);
    },
    [activa],
  );

  const pausado = encima || foco;

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Portadas de JOFEMESA"
      data-surface="dark"
      className="hero-alto relative isolate overflow-hidden bg-inverse"
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocus={() => setFoco(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFoco(false);
      }}
    >
      {ORDEN.map((id, i) => {
        const esActiva = i === activa;
        const esPrevia = i === previa;
        return (
          <div
            key={id}
            role="group"
            aria-roledescription="portada"
            aria-label={`${i + 1} de ${ORDEN.length}: ${ROTULO[id]}`}
            inert={!esActiva}
            className={cn(
              "absolute inset-0 flex items-center",
              esActiva ? "z-20" : esPrevia ? "z-10" : "pointer-events-none z-0 opacity-0",
              /* La cortina va sobre la portada ENTERA: si solo cubría la
                 foto, el texto nuevo aparecía encima del viejo. */
              esActiva && ciclo > 0 && "hero-cortina",
            )}
          >
            {/* ---------- Foto: cortina + acercamiento ---------- */}
            <div
              key={esActiva ? `foto-${ciclo}` : "foto"}
              className="absolute inset-0 -z-10 overflow-hidden"
            >
              <Image
                src={fotos[id].src}
                alt={fotos[id].alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={cn(
                  "object-cover",
                  fotos[id].posicion,
                  esActiva && "hero-acercar",
                )}
              />
              {/* Velo medido: el texto va a la izquierda y la máquina se
                  ve limpia a la derecha. Paradas comprobadas contra la
                  foto de obra (11,3:1 titular, 6,1:1 entradilla). */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-inverse/96 via-inverse/86 to-inverse/50 lg:bg-gradient-to-r lg:from-inverse/96 lg:via-inverse/78 lg:via-56% lg:to-transparent lg:to-90%"
              />
              {fotos[id].provisional && (
                <div aria-hidden="true" className="absolute inset-0 bg-inverse/35" />
              )}
            </div>

            <div
              key={esActiva ? `texto-${ciclo}` : "texto"}
              className={cn("container-placa relative w-full py-14 md:py-16", esActiva && "hero-entra")}
            >
              {id === "alquiler" ? <PortadaAlquiler /> : <PortadaFormacion />}
            </div>
          </div>
        );
      })}

      {/* La cuchilla roja que cruza con la cortina. Va fuera de las
          portadas: dentro, la propia cortina la recortaba. */}
      {ciclo > 0 && (
        <span
          key={`cuchilla-${ciclo}`}
          aria-hidden="true"
          className="hero-cuchilla pointer-events-none absolute inset-y-0 z-30 w-3 bg-accent"
        />
      )}

      {/* ---------- Mando: pestañas con progreso + flechas ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-40">
        <div className="container-placa flex items-end justify-between gap-4 pb-5 md:pb-7">
          <div role="tablist" aria-label="Elegir portada" className="flex gap-2 md:gap-3">
            {ORDEN.map((id, i) => {
              const esActiva = i === activa;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={esActiva}
                  onClick={() => ir(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") ir(activa + 1);
                    if (e.key === "ArrowLeft") ir(activa - 1);
                  }}
                  className="group flex min-h-11 w-28 flex-col justify-end gap-2 text-left md:w-40"
                >
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors duration-300",
                      esActiva ? "text-ink-inv" : "text-ink-inv-3 group-hover:text-ink-inv-2",
                    )}
                  >
                    {ROTULO[id]}
                  </span>
                  <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                    {esActiva && (
                      <span
                        key={`barra-${ciclo}`}
                        className="hero-progreso absolute inset-y-0 left-0 w-full origin-left rounded-full bg-accent"
                        style={
                          {
                            "--duracion-hero": `${DURACION_MS}ms`,
                            animationPlayState: pausado ? "paused" : "running",
                          } as React.CSSProperties
                        }
                        onAnimationEnd={() => ir(activa + 1)}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => ir(activa - 1)}
              aria-label="Portada anterior"
              className="flex size-11 items-center justify-center rounded-full border border-white/25 text-ink-inv transition-colors duration-200 hover:border-accent hover:bg-accent"
            >
              <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => ir(activa + 1)}
              aria-label="Portada siguiente"
              className="flex size-11 items-center justify-center rounded-full border border-white/25 text-ink-inv transition-colors duration-200 hover:border-accent hover:bg-accent"
            >
              <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Pista de scroll, decorativa. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 z-30 hidden justify-center text-ink-inv-3 xl:flex"
      >
        <ChevronDown
          size={22}
          strokeWidth={1.75}
          className="motion-safe:animate-[latir-abajo_2.4s_ease-in-out_infinite]"
        />
      </div>
    </section>
  );
}

/* ================================================================
   Portada 1 · Alquiler
   ================================================================ */

function PortadaAlquiler() {
  return (
    <div className="max-w-[60ch] pb-20 md:pb-16 lg:max-w-[56%]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2" data-entra style={{ "--i": 0 } as React.CSSProperties}>
        <span className="label pastilla inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1.5 text-ink-inv-2">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          Desde {EMPRESA.fundacion} especialistas en maquinaria
        </span>
        <span className="label hidden text-ink-inv-3 md:inline">España y Portugal</span>
      </div>

      <h1 className="display-1 mt-6 max-w-[24ch] text-ink-inv" data-entra style={{ "--i": 1 } as React.CSSProperties}>
        Alquiler de maquinaria para que tu obra no se pare.
      </h1>

      <p
        className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-inv-2 lg:text-lg"
        data-entra style={{ "--i": 2 } as React.CSSProperties}
      >
        Plataformas elevadoras, manipuladores, carretillas, movimiento de
        tierras y energía. {ALQUILER.length} referencias y {DELEGACIONES.length}{" "}
        delegaciones propias con flota, taller y camiones.
      </p>

      <div className="mt-7 max-w-xl" data-entra style={{ "--i": 3 } as React.CSSProperties}>
        <Buscador oscuro />
      </div>

      <div
        className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2"
        data-entra style={{ "--i": 4 } as React.CSSProperties}
      >
        <Link
          href="/asesor"
          className="group inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent-dark underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-white"
        >
          No sé qué máquina necesito
          <ArrowRight
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
        <Link
          href="/alquiler"
          className="hidden min-h-11 items-center text-base text-ink-inv-2 underline decoration-white/30 decoration-2 underline-offset-4 transition-colors duration-200 hover:text-ink-inv md:inline-flex"
        >
          Ver todo el catálogo
        </Link>
      </div>
    </div>
  );
}

/* ================================================================
   Portada 2 · Formación
   ================================================================ */

function PortadaFormacion() {
  /* La próxima convocatoria de verdad: la calcula el navegador, que es
     el que sabe qué día es. El servidor pinta la primera del Excel. */
  const hoy = useSyncExternalStore(sinSuscripcion, hoyIso, () => null);
  const proximas = hoy ? CONVOCATORIAS.filter((c) => c.fecha >= hoy) : CONVOCATORIAS;
  const siguiente = proximas[0];

  return (
    <div className="grid items-center gap-10 pb-20 md:pb-16 lg:grid-cols-12">
      <div className="max-w-[60ch] lg:col-span-7">
        <div data-entra style={{ "--i": 0 } as React.CSSProperties}>
          <span className="label pastilla inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1.5 text-ink-inv-2">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            Departamento de Formación
          </span>
        </div>

        <h2 className="display-1 mt-6 max-w-[22ch] text-ink-inv" data-entra style={{ "--i": 1 } as React.CSSProperties}>
          Formación de operadores para trabajar seguro.
        </h2>

        <p
          className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-inv-2 lg:text-lg"
          data-entra style={{ "--i": 2 } as React.CSSProperties}
        >
          Plataformas elevadoras, carretillas, trabajos en altura, andamios y
          espacios confinados. Convocatorias cada semana en Madrid y en
          Valencia.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3" data-entra style={{ "--i": 3 } as React.CSSProperties}>
          <Link
            href="/formacion#calendario"
            className="btn-accent inline-flex h-13 items-center gap-2 bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
          >
            Ver convocatorias
            <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
          </Link>
          <Link
            href="/formacion#cursos"
            className="inline-flex h-13 items-center border border-white/30 px-6 text-base font-semibold text-ink-inv transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink pastilla"
          >
            Catálogo de cursos
          </Link>
        </div>
      </div>

      {siguiente && (
        <div className="hidden lg:col-span-5 lg:block" data-entra style={{ "--i": 4 } as React.CSSProperties}>
          <ProximaConvocatoria
            fecha={siguiente.fecha}
            curso={siguiente.curso}
            sede={siguiente.sede}
            masEsteMes={
              proximas.filter(
                (c) => partesFecha(c.fecha).claveMes === partesFecha(siguiente.fecha).claveMes,
              ).length - 1
            }
          />
        </div>
      )}
    </div>
  );
}

function ProximaConvocatoria({
  fecha,
  curso,
  sede,
  masEsteMes,
}: {
  fecha: string;
  curso: keyof typeof CURSOS;
  sede: keyof typeof SEDES_CURSO;
  masEsteMes: number;
}) {
  const f = partesFecha(fecha);
  const c = CURSOS[curso];
  const s = SEDES_CURSO[sede];
  return (
    <div className="ml-auto max-w-sm rounded-[28px] border border-white/15 bg-white/10 p-6 text-ink-inv shadow-panel backdrop-blur-md">
      <p className="meta flex items-center gap-2 text-ink-inv-2">
        <CalendarDays size={15} strokeWidth={2} aria-hidden="true" className="text-accent-dark" />
        Próxima convocatoria
      </p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex size-18 shrink-0 flex-col items-center justify-center rounded-2xl bg-accent text-white">
          <span className="font-[family-name:var(--font-display)] text-3xl leading-none">{f.dia}</span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-wide">{f.mesCorto}</span>
        </div>
        <div className="min-w-0">
          <p className="text-lg leading-snug font-semibold">{c.nombre}</p>
          {c.norma && <p className="mt-0.5 text-sm text-ink-inv-2">{c.norma}</p>}
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-ink-inv-2">
        <MapPin size={14} strokeWidth={2} aria-hidden="true" className="text-accent-dark" />
        {s.nombre} · <span className="capitalize">{f.diaSemana}</span>
      </p>
      <Link
        href="/formacion#calendario"
        className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-inv underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-dark"
      >
        {masEsteMes > 0 ? `Y ${masEsteMes} más este mes` : "Ver el calendario"}
        <ArrowRight size={14} strokeWidth={2.25} aria-hidden="true" />
      </Link>
    </div>
  );
}
