"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Navigation, ArrowRight, X, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CONVOCATORIAS } from "@/content/es/convocatorias";
import {
  CURSOS,
  ORDEN_CURSOS,
  SEDES_CURSO,
  nombreMes,
  partesFecha,
  type Convocatoria,
  type CursoConvocatoriaId,
  type SedeCursoId,
} from "@/content/es/formacion";
import { elegirCursoCalendario, useCursoCalendario, useHoy } from "@/lib/formacion/estado";

/**
 * El calendario de convocatorias, en LISTA y no en rejilla de mes: con
 * setenta convocatorias en tres meses, una rejilla ocupa tres pantallas
 * y obliga a abrir cada día para saber qué hay. La lista se lee de un
 * vistazo y se filtra por curso, por sede y por mes.
 *
 * Las pasadas se ocultan en el navegador, que es el que sabe qué día es.
 * La página está prerenderizada, así que el servidor las pinta todas y
 * la limpieza ocurre al hidratar.
 */

type FiltroLocal = { sede: SedeCursoId | null; mes: string | null };
type Filtro = FiltroLocal & { curso: CursoConvocatoriaId | null };

export function CalendarioFormacion() {
  const hoy = useHoy();
  const curso = useCursoCalendario();
  const [local, setLocal] = useState<FiltroLocal>({ sede: null, mes: null });
  const filtro: Filtro = { ...local, curso };
  const setFiltro = ({ curso: c, ...resto }: Filtro) => {
    if (c !== curso) elegirCursoCalendario(c);
    setLocal(resto);
  };

  const vigentes = useMemo(
    () => (hoy ? CONVOCATORIAS.filter((c) => c.fecha >= hoy) : CONVOCATORIAS),
    [hoy],
  );

  const meses = useMemo(
    () => [...new Set(vigentes.map((c) => partesFecha(c.fecha).claveMes))],
    [vigentes],
  );

  const visibles = vigentes.filter(
    (c) =>
      (!filtro.curso || c.curso === filtro.curso) &&
      (!filtro.sede || c.sede === filtro.sede) &&
      (!filtro.mes || partesFecha(c.fecha).claveMes === filtro.mes),
  );

  const porMes = useMemo(() => {
    const g = new Map<string, Convocatoria[]>();
    for (const c of visibles) {
      const k = partesFecha(c.fecha).claveMes;
      g.set(k, [...(g.get(k) ?? []), c]);
    }
    return [...g.entries()];
  }, [visibles]);

  const cuenta = (id: CursoConvocatoriaId | null) =>
    vigentes.filter(
      (c) =>
        (!id || c.curso === id) &&
        (!filtro.sede || c.sede === filtro.sede) &&
        (!filtro.mes || partesFecha(c.fecha).claveMes === filtro.mes),
    ).length;

  const hayFiltro = filtro.curso || filtro.sede || filtro.mes;

  return (
    <div>
      {/* ---------- Filtros ---------- */}
      <div className="rounded-3xl border border-rule bg-surface p-4 shadow-tarjeta md:p-5">
        <p className="meta text-ink-3">Tipo de curso</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Tipo de curso">
          <Chip activo={!filtro.curso} onClick={() => setFiltro({ ...filtro, curso: null })}>
            Todos <span className="value opacity-70">{cuenta(null)}</span>
          </Chip>
          {ORDEN_CURSOS.map((id) => (
            <Chip
              key={id}
              activo={filtro.curso === id}
              onClick={() => setFiltro({ ...filtro, curso: filtro.curso === id ? null : id })}
            >
              {CURSOS[id].corto} <span className="value opacity-70">{cuenta(id)}</span>
            </Chip>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="block">
            <span className="etiqueta-campo text-ink-2">Sede</span>
            <select
              id="filtro-sede"
              value={filtro.sede ?? ""}
              onChange={(e) =>
                setFiltro({ ...filtro, sede: (e.target.value || null) as SedeCursoId | null })
              }
              className="mt-1.5 h-12 w-full rounded-full border border-rule-control bg-surface px-4 text-base text-ink"
            >
              <option value="">Todas las sedes</option>
              {Object.values(SEDES_CURSO).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} ({s.zona})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="etiqueta-campo text-ink-2">Mes</span>
            <select
              id="filtro-mes"
              value={filtro.mes ?? ""}
              onChange={(e) => setFiltro({ ...filtro, mes: e.target.value || null })}
              className="mt-1.5 h-12 w-full rounded-full border border-rule-control bg-surface px-4 text-base text-ink first-letter:uppercase"
            >
              <option value="">Todos los meses</option>
              {meses.map((m) => (
                <option key={m} value={m}>
                  {nombreMes(m)}
                </option>
              ))}
            </select>
          </label>
          {hayFiltro && (
            <button
              type="button"
              onClick={() => setFiltro({ curso: null, sede: null, mes: null })}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink-2 transition-colors duration-200 hover:bg-sunken hover:text-ink"
            >
              <X size={15} strokeWidth={2.25} aria-hidden="true" />
              Quitar filtros
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-3" aria-live="polite">
        {visibles.length === 1
          ? "1 convocatoria"
          : `${visibles.length} convocatorias`}
        {hayFiltro ? " con estos filtros" : " abiertas"}
      </p>

      {/* ---------- Lista ---------- */}
      {porMes.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-rule bg-sunken p-8 text-center">
          <p className="title text-ink">No hay convocatorias con esos filtros.</p>
          <p className="mt-2 text-base text-ink-2">
            Llámanos y te decimos cuándo es la próxima, o si podemos abrir una
            para tu empresa.
          </p>
        </div>
      ) : (
        porMes.map(([mes, lista]) => (
          <section key={mes} className="mt-6" aria-labelledby={`mes-${mes}`}>
            <h3
              id={`mes-${mes}`}
              className="flex items-baseline gap-3 font-[family-name:var(--font-display)] text-xl text-ink first-letter:uppercase"
            >
              {nombreMes(mes)}
              <span className="text-sm text-ink-3">{lista.length}</span>
            </h3>
            <ul className="mt-2 overflow-hidden rounded-3xl border border-rule bg-surface">
              {lista.map((c) => (
                <Fila key={c.id} c={c} esHoy={c.fecha === hoy} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200",
        activo
          ? "border-ink bg-ink text-white"
          : "border-rule-strong bg-surface text-ink-2 hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function Plazas({ c }: { c: Convocatoria }) {
  if (c.plazas == null || c.ocupadas == null) return null;
  const libres = Math.max(0, c.plazas - c.ocupadas);
  const tono =
    libres === 0 ? "bg-accent" : libres <= 3 ? "bg-wait" : "bg-ok";
  return (
    <span className="flex flex-col gap-1.5">
      <span
        className={cn(
          "text-sm font-semibold",
          libres === 0 ? "text-accent" : libres <= 3 ? "text-wait-text" : "text-ok",
        )}
      >
        {libres === 0
          ? "Completo"
          : libres <= 3
            ? `Últimas ${libres} plazas`
            : `${libres} plazas libres`}
      </span>
      <span className="h-1.5 w-28 overflow-hidden rounded-full bg-rule" aria-hidden="true">
        <span
          className={cn("block h-full rounded-full", tono)}
          style={{ width: `${Math.min(100, (c.ocupadas / c.plazas) * 100)}%` }}
        />
      </span>
    </span>
  );
}

function Fila({ c, esHoy }: { c: Convocatoria; esHoy: boolean }) {
  const f = partesFecha(c.fecha);
  const curso = CURSOS[c.curso];
  const sede = SEDES_CURSO[c.sede];
  const completo = c.plazas != null && c.ocupadas != null && c.ocupadas >= c.plazas;

  return (
    <li className="grid gap-3 border-b border-rule p-4 last:border-b-0 md:grid-cols-[3.5rem_1fr_auto] md:items-center md:gap-x-6 md:px-5 md:py-3 lg:grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1fr)_auto]">
      {/* Fecha */}
      <div className="flex items-center gap-3 md:block md:text-center">
        <div
          className={cn(
            "flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl",
            esHoy ? "bg-accent text-white" : "bg-sunken text-ink",
          )}
        >
          <span className="font-[family-name:var(--font-display)] text-2xl leading-none">
            {f.dia}
          </span>
          <span className="mt-0.5 text-xs font-semibold uppercase tracking-wide opacity-80">
            {f.mesCorto}
          </span>
        </div>
        <p className="text-sm text-ink-3 capitalize md:hidden">
          {esHoy ? "Hoy" : f.diaSemana}
        </p>
      </div>

      {/* Curso */}
      <div className="min-w-0">
        <p className="text-base font-semibold text-ink">{curso.nombre}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-2">
          {curso.norma && (
            <span className="rounded-full bg-accent-tint px-2.5 py-0.5 text-xs font-semibold text-accent">
              {curso.norma}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} strokeWidth={2} aria-hidden="true" className="text-ink-3" />
            <span className="hidden capitalize md:inline">{esHoy ? "Hoy" : f.diaSemana} ·</span>
            {c.inicio} – {c.fin} h
          </span>
        </div>
        {/* Cuando el panel gestione plazas, el estado aparece aquí. */}
        <div className="mt-2 empty:hidden">
          <Plazas c={c} />
        </div>
      </div>

      {/* Sede */}
      <div className="min-w-0 md:col-start-2 lg:col-start-auto">
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
          <MapPin size={14} strokeWidth={2} aria-hidden="true" className="text-accent" />
          {sede.nombre}
          <span className="font-normal text-ink-3">· {sede.zona}</span>
        </p>
        <p className="mt-0.5 text-xs text-ink-3">
          {sede.direccion}
          <a
            href={sede.maps}
            target="_blank"
            rel="noopener"
            className="ml-2 inline-flex min-h-8 items-center gap-1 align-middle font-semibold whitespace-nowrap text-accent underline decoration-2 underline-offset-4 hover:text-accent-hover md:min-h-0"
          >
            <Navigation size={12} strokeWidth={2.25} aria-hidden="true" />
            Ver en Maps
          </a>
        </p>
      </div>

      {/* Acciones: la información del curso y la plaza. */}
      <div className="flex flex-col gap-2 md:col-start-3 md:row-span-2 md:row-start-1 lg:col-start-auto lg:row-span-1 lg:row-start-auto lg:flex-row">
        <Link
          href={`/formacion/cursos/${curso.id}`}
          scroll={false}
          className="inline-flex h-11 items-center justify-center gap-2 border border-rule-control bg-surface px-4 text-sm font-semibold whitespace-nowrap text-ink transition-colors duration-200 hover:border-ink hover:bg-sunken pastilla"
        >
          <Info size={15} strokeWidth={2} aria-hidden="true" className="text-accent" />
          Ver información del curso
        </Link>
        {completo ? (
          <span className="inline-flex h-11 items-center justify-center rounded-full border border-rule px-5 text-sm font-semibold text-ink-3">
            Sin plazas
          </span>
        ) : (
          <Link
            href={`/formacion/solicitar?convocatoria=${encodeURIComponent(c.id)}`}
            className="btn-accent inline-flex h-11 items-center justify-center gap-2 bg-accent px-5 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
          >
            Solicitar plaza
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        )}
      </div>
    </li>
  );
}
