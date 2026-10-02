"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { avisoCif } from "@/lib/leads/schema";
import { enviarSolicitudFormacion, type EstadoFormulario } from "@/lib/leads/actions";
import {
  CURSOS,
  ORDEN_A_MEDIDA,
  ORDEN_CURSOS,
  SEDES_CURSO,
  esCursoConvocatoria,
  esCursoId,
  partesFecha,
  type CursoId,
} from "@/content/es/formacion";
import { proximasDe, useHoy } from "@/lib/formacion/estado";

const INICIAL: EstadoFormulario = { ok: false };

export type ParametrosFormacion = {
  curso: CursoId | null;
  convocatoria: string | null;
};

const LUGARES = [
  ["jofemesa", "En vuestras instalaciones"],
  ["cliente", "En las de mi empresa"],
  ["indiferente", "Aconsejadme"],
] as const;

/**
 * Solicitud de plaza o de curso a medida.
 *
 * Es un formulario distinto del de alquiler a propósito: aquel pide obra,
 * máquinas y fechas de entrega, y a quien viene a apuntarse a un curso eso
 * le hace pensar que se ha equivocado de sitio. Aquí se pide lo que
 * Formación necesita para confirmar: curso, fecha, cuántas personas y a
 * quién llamar. Como el de alquiler, se envía sin JavaScript.
 */
export function FormularioFormacion({ inicial }: { inicial: ParametrosFormacion }) {
  const [estado, accion] = useActionState(enviarSolicitudFormacion, INICIAL);
  const v = estado.valores;
  const errores = estado.errores ?? {};
  const hayErrores = Object.keys(errores).length > 0;
  const hoy = useHoy();

  const [curso, setCurso] = useState<CursoId | "">(
    esCursoId(v?.curso) ? v.curso : (inicial.curso ?? ""),
  );
  const [convocatoria, setConvocatoria] = useState(
    v?.convocatoria ?? inicial.convocatoria ?? "",
  );
  const [cif, setCif] = useState(v?.cif ?? "");
  const [t0] = useState(() => Date.now());
  const resumenErrores = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hayErrores) resumenErrores.current?.focus();
  }, [hayErrores, estado]);

  const fechas = curso && esCursoConvocatoria(curso) ? proximasDe(curso, hoy) : [];
  const aMedida = !convocatoria;
  const avisoDeCif = avisoCif(cif);

  return (
    <form action={accion} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <input type="hidden" name="_t" value={t0} />
      <div aria-hidden="true" className="hidden">
        <label htmlFor="_trampa">No rellenes este campo</label>
        <input id="_trampa" type="text" name="_trampa" tabIndex={-1} autoComplete="off" />
      </div>

      {/* ---------- Qué curso ---------- */}
      <div className="lg:col-span-5">
        <h2 className="display-3 border-b border-rule-strong pb-3 text-ink">El curso</h2>

        <label className="mt-6 block">
          <span className="etiqueta-campo text-ink">
            Curso <Obligatorio />
          </span>
          <select
            name="curso"
            required
            value={curso}
            onChange={(e) => {
              const nuevo = e.target.value as CursoId | "";
              setCurso(nuevo);
              setConvocatoria(
                nuevo && esCursoConvocatoria(nuevo) ? (proximasDe(nuevo, hoy)[0]?.id ?? "") : "",
              );
            }}
            aria-invalid={Boolean(errores.curso)}
            className="mt-2 h-12 w-full border border-rule-control bg-surface px-3 text-base text-ink pastilla"
          >
            <option value="">Elige un curso</option>
            <optgroup label="Con convocatoria abierta">
              {ORDEN_CURSOS.map((id) => (
                <option key={id} value={id}>
                  {CURSOS[id].nombre}
                  {CURSOS[id].norma ? ` (${CURSOS[id].norma})` : ""}
                </option>
              ))}
            </optgroup>
            <optgroup label="A medida">
              {ORDEN_A_MEDIDA.map((id) => (
                <option key={id} value={id}>
                  {CURSOS[id].nombre}
                </option>
              ))}
            </optgroup>
          </select>
          {errores.curso && <Error>{errores.curso}</Error>}
        </label>

        {curso && (
          <Link
            href={`/formacion/cursos/${curso}`}
            className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-accent underline decoration-2 underline-offset-4 hover:text-accent-hover"
          >
            <Info size={14} strokeWidth={2} aria-hidden="true" />
            Ver información del curso
          </Link>
        )}

        {curso && esCursoConvocatoria(curso) && (
          <label className="mt-5 block">
            <span className="etiqueta-campo text-ink">Convocatoria</span>
            <select
              name="convocatoria"
              value={convocatoria}
              onChange={(e) => setConvocatoria(e.target.value)}
              aria-invalid={Boolean(errores.convocatoria)}
              className="mt-2 h-12 w-full border border-rule-control bg-surface px-3 text-base text-ink pastilla"
            >
              {fechas.map((c) => {
                const f = partesFecha(c.fecha);
                return (
                  <option key={c.id} value={c.id}>
                    {`${f.diaSemana[0].toUpperCase()}${f.diaSemana.slice(1)} ${f.dia} de ${f.mes} · ${SEDES_CURSO[c.sede].nombre}`}
                  </option>
                );
              })}
              <option value="">Otra fecha o curso a medida para mi grupo</option>
            </select>
            {errores.convocatoria && <Error>{errores.convocatoria}</Error>}
          </label>
        )}
        {curso && !esCursoConvocatoria(curso) && (
          <p className="mt-5 border-l-2 border-accent bg-accent-tint px-4 py-3 text-sm text-ink-2">
            Este curso no tiene convocatoria abierta: se imparte a medida.
            Formación te propone fecha y lugar.
          </p>
        )}

        {curso && aMedida && (
          <fieldset className="mt-5">
            <legend className="etiqueta-campo text-ink">¿Dónde prefieres la formación?</legend>
            <div className="mt-2 grid gap-2">
              {LUGARES.map(([valor, texto]) => (
                <label
                  key={valor}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-rule-control bg-surface px-4 text-base text-ink has-[:checked]:border-ink has-[:checked]:bg-sunken"
                >
                  <input
                    type="radio"
                    name="lugar"
                    value={valor}
                    defaultChecked={(v?.lugar ?? "indiferente") === valor}
                    className="size-4 accent-[var(--color-accent)]"
                  />
                  {texto}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-[9rem_1fr]">
          <Campo
            id="alumnos"
            etiqueta="Personas"
            tipo="number"
            requerido
            min="1"
            valor={v?.alumnos ?? "1"}
            error={errores.alumnos}
            mono
          />
          {curso && aMedida && (
            <Campo
              id="localidad"
              etiqueta="Localidad"
              ayuda="Si la formación es en tu empresa."
              valor={v?.localidad}
              error={errores.localidad}
            />
          )}
        </div>
      </div>

      {/* ---------- Quién lo pide ---------- */}
      <div className="lg:col-span-7">
        <h2 className="display-3 border-b border-rule-strong pb-3 text-ink">Quién lo pide</h2>

        {hayErrores && (
          <div
            ref={resumenErrores}
            tabIndex={-1}
            role="alert"
            className="mt-5 flex items-start gap-3 border-l-2 border-danger bg-accent-tint px-4 py-3 focus:outline-none"
          >
            <AlertCircle size={20} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-danger" />
            <div>
              <p className="text-base font-semibold text-ink">
                {errores._global ?? `Faltan ${Object.keys(errores).length} datos por revisar.`}
              </p>
              {!errores._global && (
                <p className="mt-1 text-sm text-ink-2">
                  Están marcados en el formulario. No se ha perdido nada de lo que ya habías escrito.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Campo
              id="contacto"
              etiqueta="Nombre y apellidos"
              requerido
              autoComplete="name"
              valor={v?.contacto}
              error={errores.contacto}
            />
          </div>
          <Campo
            id="telefono"
            etiqueta="Teléfono"
            tipo="tel"
            requerido
            autoComplete="tel"
            valor={v?.telefono}
            error={errores.telefono}
            mono
          />
          <Campo
            id="email"
            etiqueta="Correo electrónico"
            tipo="email"
            requerido
            autoComplete="email"
            valor={v?.email}
            error={errores.email}
          />
          <Campo
            id="empresa"
            etiqueta="Empresa"
            ayuda="Si te forma tu empresa."
            autoComplete="organization"
            valor={v?.empresa}
            error={errores.empresa}
          />
          <label className="block">
            <span className="etiqueta-campo text-ink">CIF o NIF</span>
            <input
              name="cif"
              value={cif}
              onChange={(e) => setCif(e.target.value)}
              className="value mt-2 h-12 w-full border border-rule-control bg-surface px-3 text-ink pastilla"
            />
            <span className="mt-2 block text-sm text-ink-3">Para la factura. Puedes dárnoslo después.</span>
            {avisoDeCif && <span className="mt-1 block text-sm text-wait-text">{avisoDeCif}</span>}
          </label>
        </div>

        <label className="mt-5 block">
          <span className="etiqueta-campo text-ink">Algo más que debamos saber</span>
          <textarea
            name="notas"
            rows={4}
            defaultValue={v?.notas ?? ""}
            placeholder="Nombres de los alumnos, si necesitáis el curso en otro horario, el tipo de carretilla…"
            className="mt-2 w-full border border-rule-control bg-surface p-3 text-base text-ink placeholder:text-ink-3"
          />
        </label>

        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="consentimiento" required className="peer sr-only" />
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-6 shrink-0 items-center justify-center border-2 border-rule-control peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none">
              <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-sm text-ink-2">
            Acepto que JOFEMESA use estos datos para responder a esta solicitud, según su{" "}
            <Link href="/privacidad" className="font-semibold text-accent underline decoration-2 underline-offset-4">
              política de privacidad
            </Link>
            . <Obligatorio />
          </span>
        </label>
        {errores.consentimiento && <Error>{errores.consentimiento}</Error>}

        <BotonEnviar />

        <p className="mt-4 text-sm text-ink-2">
          Sin pago online. Formación te confirma la plaza, el precio y lo que
          tienes que llevar el día del curso.
        </p>
      </div>
    </form>
  );
}

function Obligatorio() {
  return (
    <span className="text-accent" aria-hidden="true">
      *
    </span>
  );
}

function Error({ children }: { children: React.ReactNode }) {
  return <span className="mt-2 block text-sm font-semibold text-danger">{children}</span>;
}

function Campo({
  id,
  etiqueta,
  tipo = "text",
  requerido = false,
  ayuda,
  error,
  valor,
  autoComplete,
  min,
  mono = false,
}: {
  id: string;
  etiqueta: string;
  tipo?: string;
  requerido?: boolean;
  ayuda?: string;
  error?: string;
  valor?: string;
  autoComplete?: string;
  min?: string;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="etiqueta-campo text-ink">
        {etiqueta} {requerido && <Obligatorio />}
      </span>
      <input
        id={id}
        name={id}
        type={tipo}
        required={requerido}
        min={min}
        autoComplete={autoComplete}
        defaultValue={valor ?? ""}
        aria-invalid={Boolean(error)}
        aria-describedby={ayuda ? `${id}-ayuda` : undefined}
        className={cn(
          "mt-2 h-12 w-full rounded-xl border border-rule-control bg-surface px-3 text-ink",
          mono ? "value" : "text-base",
        )}
      />
      {ayuda && (
        <span id={`${id}-ayuda`} className="mt-2 block text-sm text-ink-3">
          {ayuda}
        </span>
      )}
      {error && <Error>{error}</Error>}
    </label>
  );
}

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-accent mt-8 flex h-14 w-full items-center justify-center bg-accent text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover disabled:opacity-70 md:w-auto md:px-8 pastilla"
    >
      {pending ? "Enviando…" : "Enviar la solicitud de formación"}
    </button>
  );
}
