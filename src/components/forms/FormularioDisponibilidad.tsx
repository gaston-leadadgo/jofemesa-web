"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getMaquinas } from "@/lib/catalog";
import { avisoCif, PROVINCIAS } from "@/lib/leads/schema";
import { enviarSolicitud, type EstadoFormulario } from "@/lib/leads/actions";
import { useComparar } from "@/lib/compare/context";
import { ImagenMaquina } from "@/components/maquina/ImagenMaquina";

const INICIAL: EstadoFormulario = { ok: false };

/**
 * "Consultar disponibilidad". El único final de todos los caminos de la web.
 *
 * Es un <form action={…}> de verdad, así que se envía y se valida incluso
 * con JavaScript desactivado. Sin CAPTCHA: cuesta conversiones. En su lugar,
 * un campo trampa y un mínimo de tres segundos en pantalla.
 */
export function FormularioDisponibilidad() {
  const [estado, accion] = useActionState(enviarSolicitud, INICIAL);
  const [mParam, setM] = useQueryState(
    "m",
    parseAsArrayOf(parseAsString, ",").withDefault([]),
  );
  const [contexto] = useQueryState("contexto", parseAsString);
  const { slugs: enBandeja } = useComparar();

  const [t0] = useState(() => Date.now());
  const resumenErrores = useRef<HTMLDivElement>(null);

  // Si se llega sin máquinas pero hay algo en el comparador, se precarga.
  useEffect(() => {
    if (mParam.length === 0 && enBandeja.length > 0) {
      void setM(enBandeja, { history: "replace" });
    }
  }, [mParam.length, enBandeja, setM]);

  const maquinas = useMemo(() => getMaquinas(mParam), [mParam]);
  const errores = estado.errores ?? {};
  const hayErrores = Object.keys(errores).length > 0;

  // Con errores, el foco va al resumen: quien usa lector de pantalla se
  // enteraría si no.
  useEffect(() => {
    if (hayErrores) resumenErrores.current?.focus();
  }, [hayErrores, estado]);

  const [cif, setCif] = useState("");
  const avisoDeCif = avisoCif(cif);

  return (
    <form action={accion} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <input type="hidden" name="_t" value={t0} />
      <div aria-hidden="true" className="hidden">
        <label htmlFor="_trampa">No rellenes este campo</label>
        <input id="_trampa" type="text" name="_trampa" tabIndex={-1} autoComplete="off" />
      </div>

      {/* ---------- Columna izquierda: qué se pide ---------- */}
      <div className="lg:col-span-5">
        <h2 className="label border-b border-ink pb-3 text-ink">
          Qué necesitas
        </h2>

        {maquinas.length > 0 ? (
          <ul className="mt-5 divide-y divide-rule border-y border-rule">
            {maquinas.map((m) => (
              <li key={m.slug} className="flex items-center gap-4 py-3">
                <input type="hidden" name="maquinas" value={m.slug} />
                <span className="relative block size-14 shrink-0 overflow-hidden border border-rule bg-muted">
                  <ImagenMaquina maquina={m} sizes="56px" marca={false} />
                </span>
                <span className="flex-1">
                  <span className="label-sm block text-ink-3">{m.marca}</span>
                  <span className="block text-base font-semibold text-ink">
                    {m.modelo}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setM(mParam.filter((s) => s !== m.slug))}
                  className="flex size-11 items-center justify-center text-ink-2 hover:text-accent"
                  aria-label={`Quitar ${m.marca} ${m.modelo} de la solicitud`}
                >
                  <X size={18} strokeWidth={2} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 border border-rule bg-sunken p-5">
            <p className="text-base text-ink-2">
              No has seleccionado ninguna máquina todavía. Puedes enviar la
              solicitud igualmente y te asesoramos, o{" "}
              <Link
                href="/alquiler"
                className="font-semibold text-accent underline decoration-2 underline-offset-4"
              >
                elegir en el catálogo
              </Link>
              .
            </p>
          </div>
        )}

        {contexto && (
          <div className="mt-6 border-l-2 border-accent bg-accent-tint px-4 py-3">
            <p className="label-sm text-ink-2">Lo que nos contaste en el asesor</p>
            <p className="mt-1.5 text-base text-ink">{contexto}</p>
            <input type="hidden" name="contextoAsesor" value={contexto} />
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Campo
            id="fechaInicio"
            etiqueta="Desde"
            tipo="date"
            requerido
            error={errores.fechaInicio}
            min={new Date().toISOString().slice(0, 10)}
          />
          <Campo
            id="fechaFin"
            etiqueta="Hasta"
            tipo="date"
            requerido
            error={errores.fechaFin}
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="label text-ink">
              Provincia de la obra <Obligatorio />
            </span>
            <select
              name="provincia"
              required
              defaultValue={estado.valores?.provincia ?? ""}
              aria-invalid={Boolean(errores.provincia)}
              className="mt-2 h-12 w-full border border-rule-control bg-surface px-3 text-base text-ink"
            >
              <option value="">Elige provincia</option>
              {PROVINCIAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errores.provincia && <Error>{errores.provincia}</Error>}
          </label>

          <Campo
            id="localidad"
            etiqueta="Localidad"
            requerido
            error={errores.localidad}
            valor={estado.valores?.localidad}
          />
        </div>

        <div className="mt-5">
          <Campo
            id="direccionObra"
            etiqueta="Dirección de la obra"
            ayuda="Si ya la sabes. Nos sirve para calcular el transporte."
            error={errores.direccionObra}
            valor={estado.valores?.direccionObra}
          />
        </div>
      </div>

      {/* ---------- Columna derecha: quién lo pide ---------- */}
      <div className="lg:col-span-7">
        <h2 className="label border-b border-ink pb-3 text-ink">
          Quién lo pide
        </h2>

        {hayErrores && (
          <div
            ref={resumenErrores}
            tabIndex={-1}
            role="alert"
            className="mt-5 flex items-start gap-3 border-l-2 border-danger bg-accent-tint px-4 py-3 focus:outline-none"
          >
            <AlertCircle
              size={20}
              strokeWidth={2}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-danger"
            />
            <div>
              <p className="text-base font-semibold text-ink">
                Faltan {Object.keys(errores).length} datos por revisar.
              </p>
              <p className="mt-1 text-sm text-ink-2">
                Están marcados más abajo. No se ha perdido nada de lo que ya
                habías escrito.
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Campo
            id="empresa"
            etiqueta="Empresa"
            requerido
            autoComplete="organization"
            error={errores.empresa}
            valor={estado.valores?.empresa}
          />
          <label className="block">
            <span className="label text-ink">
              CIF o NIF <Obligatorio />
            </span>
            <input
              name="cif"
              required
              value={cif}
              onChange={(e) => setCif(e.target.value)}
              aria-invalid={Boolean(errores.cif)}
              className="value mt-2 h-12 w-full border border-rule-control bg-surface px-3 text-ink"
            />
            {errores.cif && <Error>{errores.cif}</Error>}
            {!errores.cif && avisoDeCif && (
              <span className="mt-2 block text-sm text-wait-text">
                {avisoDeCif}
              </span>
            )}
          </label>

          <Campo
            id="contacto"
            etiqueta="Persona de contacto"
            requerido
            autoComplete="name"
            error={errores.contacto}
            valor={estado.valores?.contacto}
          />
          <Campo
            id="telefono"
            etiqueta="Teléfono"
            tipo="tel"
            requerido
            autoComplete="tel"
            error={errores.telefono}
            valor={estado.valores?.telefono}
            mono
          />
          <div className="md:col-span-2">
            <Campo
              id="email"
              etiqueta="Correo electrónico"
              tipo="email"
              requerido
              autoComplete="email"
              error={errores.email}
              valor={estado.valores?.email}
            />
          </div>
        </div>

        <label className="mt-5 block">
          <span className="label text-ink">Algo más que debamos saber</span>
          <textarea
            name="notas"
            rows={4}
            defaultValue={estado.valores?.notas ?? ""}
            placeholder="Altura del tajo, acceso, si hace falta operador, horario de entrega…"
            className="mt-2 w-full border border-rule-control bg-surface p-3 text-base text-ink placeholder:text-ink-3"
          />
        </label>

        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consentimiento"
            required
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-6 shrink-0 items-center justify-center border-2 border-rule-control peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none">
              <path
                d="M3 8.5 6.5 12 13 4.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-sm text-ink-2">
            Acepto que JOFEMESA use estos datos para responder a esta
            solicitud, según su{" "}
            <Link
              href="/privacidad"
              className="font-semibold text-accent underline decoration-2 underline-offset-4"
            >
              política de privacidad
            </Link>
            . <Obligatorio />
          </span>
        </label>
        {errores.consentimiento && <Error>{errores.consentimiento}</Error>}

        <BotonEnviar />

        <p className="mt-4 text-sm text-ink-2">
          Sin compromiso y sin pago online. Confirmamos disponibilidad,
          transporte y condiciones contigo antes de formalizar nada.
        </p>
      </div>
    </form>
  );
}

/* ---------- piezas ---------- */

function Obligatorio() {
  return (
    <span className="text-accent" aria-hidden="true">
      *
    </span>
  );
}

function Error({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-2 block text-sm font-semibold text-danger">
      {children}
    </span>
  );
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
      <span className="label text-ink">
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
          "mt-2 h-12 w-full border border-rule-control bg-surface px-3 text-ink",
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
      className="btn-accent mt-8 flex h-14 w-full items-center justify-center bg-accent text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover disabled:opacity-70 md:w-auto md:px-8"
    >
      {pending ? "Enviando…" : "Enviar la solicitud"}
    </button>
  );
}
