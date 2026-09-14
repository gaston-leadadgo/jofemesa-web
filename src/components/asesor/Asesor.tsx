"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  HelpCircle,
  Phone,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TELEFONO_PRINCIPAL } from "@/content/es/empresa";
import {
  ENTORNOS,
  PARAMETROS,
  TRABAJOS,
  recomendar,
  resumenRespuestas,
  type Opcion,
} from "@/lib/advisor";
import { SPEC_POR_KEY, type Maquina } from "@/lib/catalog/types";
import { specsDestacadas } from "@/lib/catalog";
import { SUBCATEGORIA_POR_SLUG } from "@/lib/catalog/familias";
import { DatoValor } from "@/components/spec/DatoValor";
import { ImagenMaquina } from "@/components/maquina/ImagenMaquina";

/**
 * "¿Qué máquina necesito?" — tres preguntas, la segunda dependiente de
 * la primera, y cada resultado explicado en español llano.
 *
 * Tres correcciones sobre la versión anterior, todas de comprensión:
 *
 *   1. Ahora SE VE que es un formulario. Va dentro de un panel claro
 *      sobre la banda oscura, con `fieldset`/`legend` de verdad y
 *      radios reales en lugar de una rejilla de botones que se leía
 *      como una lista de características.
 *   2. El enunciado de la pregunta está en el panel, junto a las
 *      opciones, no en una columna aparte a la izquierda.
 *   3. El resultado usa filas compactas y no la tarjeta de catálogo
 *      completa, que medía 520px de alto y se salía de la pantalla.
 *
 * Las respuestas viven en la URL: el botón atrás recorre el asistente,
 * el resultado se comparte y la conversión se mide como paso de embudo.
 */

const ENUNCIADOS: Record<number, string> = {
  1: "¿Qué trabajo necesitas realizar?",
  2: "¿Con qué altura, carga o alcance?",
  3: "¿Dónde va a trabajar la máquina?",
};

export interface Respuestas {
  trabajo: string;
  parametro: string;
  entorno: string;
}

const VACIAS: Respuestas = { trabajo: "", parametro: "", entorno: "" };

/**
 * Versión de PÁGINA (/asesor): el estado vive en la URL.
 *
 * Aquí sí interesa: el resultado se comparte por enlace, el botón atrás
 * recorre el asistente y cada paso se mide como escalón de embudo en Ads.
 *
 * Las respuestas iniciales las lee el SERVIDOR y bajan como prop. Antes
 * las leía `useQueryStates`, y eso obligaba a envolver el asistente en un
 * `<Suspense>`: Next lo servía dentro de un `<div hidden>` detrás del pie
 * y en su sitio quedaba un recuadro gris de 288 px, así que un enlace con
 * respuestas abría en gris y sin JavaScript no abría nunca.
 *
 * La URL se mantiene con `pushState` —el mismo `history: "push"` que daba
 * nuqs— y `popstate` la vuelve a leer, para que el botón atrás siga
 * recorriendo el asistente pregunta a pregunta.
 */
export function AsesorUrl({ inicial }: { inicial: Respuestas }) {
  const [r, setEstado] = useState<Respuestas>(inicial);

  const leerUrl = useCallback((): Respuestas => {
    const q = new URLSearchParams(window.location.search);
    return {
      trabajo: q.get("trabajo") ?? "",
      parametro: q.get("parametro") ?? "",
      entorno: q.get("entorno") ?? "",
    };
  }, []);

  useEffect(() => {
    const alVolver = () => setEstado(leerUrl());
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, [leerUrl]);

  const cambiar = useCallback((p: Partial<Record<keyof Respuestas, string | null>>) => {
    const siguiente: Respuestas = { ...leerUrl() };
    for (const [k, v] of Object.entries(p))
      siguiente[k as keyof Respuestas] = v ?? "";
    setEstado(siguiente);

    const url = new URL(window.location.href);
    for (const k of ["trabajo", "parametro", "entorno"] as const) {
      if (siguiente[k]) url.searchParams.set(k, siguiente[k]);
      else url.searchParams.delete(k);
    }
    window.history.pushState(null, "", url);
  }, [leerUrl]);

  return (
    <Asesor
      modo="pagina"
      respuestas={r}
      cambiar={cambiar as (p: Record<string, string | null>) => void}
    />
  );
}

/**
 * Versión EMPOTRADA en la portada: el estado es local.
 *
 * En la portada el asesor es un anzuelo, no un destino: nadie comparte el
 * enlace del paso 2 de la home. Con estado local la portada se puede
 * prerenderizar entera —el paso 1 llega ya pintado en el HTML— en vez de
 * servir un hueco vacío hasta que hidrate. Quien quiera el asistente
 * enlazable tiene /asesor.
 */
export function AsesorLocal() {
  const [r, setR] = useState<Respuestas>(VACIAS);
  return (
    <Asesor
      modo="empotrado"
      respuestas={r}
      cambiar={(p) =>
        setR((prev) => {
          const sig = { ...prev };
          for (const [k, v] of Object.entries(p))
            sig[k as keyof Respuestas] = v ?? "";
          return sig;
        })
      }
    />
  );
}

export function Asesor({
  modo = "pagina",
  respuestas: r,
  cambiar: setR,
}: {
  modo?: "pagina" | "empotrado";
  respuestas: Respuestas;
  cambiar: (parcial: Partial<Record<keyof Respuestas, string | null>>) => void;
}) {
  const paso = !r.trabajo ? 1 : !r.parametro ? 2 : !r.entorno ? 3 : 4;
  const contestadas = [r.trabajo, r.parametro, r.entorno].filter(Boolean).length;
  const enfoque = useRef<HTMLLegendElement | HTMLHeadingElement>(null);

  // El foco viaja al enunciado nuevo: sin esto, quien navega con teclado
  // o lector de pantalla se queda anclado al botón que acaba de pulsar.
  useEffect(() => {
    if (paso > 1) enfoque.current?.focus();
  }, [paso]);

  const resultado = useMemo(
    () =>
      paso === 4
        ? recomendar({
            trabajo: r.trabajo,
            parametro: r.parametro,
            entorno: r.entorno,
          })
        : null,
    [paso, r.trabajo, r.parametro, r.entorno],
  );

  const empotrado = modo === "empotrado";

  function atras() {
    setR(
      paso === 4
        ? { entorno: null }
        : paso === 3
          ? { parametro: null }
          : { trabajo: null },
    );
  }

  const reiniciar = () =>
    setR({ trabajo: null, parametro: null, entorno: null });

  return (
    <section
      id="asesor"
      data-surface={empotrado ? "dark" : undefined}
      className={cn(
        empotrado
          ? "ambient-dark section-y border-y border-rule-inverse"
          : "py-10",
      )}
    >
      <div className={cn(empotrado && "container-placa")}>
        {empotrado && (
          <div className="mb-7 max-w-[54ch]" data-revelar>
            <h2 className="display-2 text-ink-inv">
              No sabes qué máquina pedir. Normal.
            </h2>
            <p className="lede mt-4 text-ink-inv-2">
              Contesta tres preguntas sobre el trabajo que tienes delante y te
              decimos qué equipos de nuestro parque encajan, y por qué.
            </p>
          </div>
        )}

        {/* ---------- El panel del formulario ----------
            Claro sobre la banda oscura: así se lee como una superficie
            donde se introducen datos, no como más contenido. */}
        <div
          className="overflow-hidden rounded-3xl border border-rule bg-surface shadow-[0_18px_50px_-24px_rgba(20,23,26,.35)]"
          data-revelar="escala"
          suppressHydrationWarning
        >
          {/* Barra de estado del formulario */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule bg-sunken px-4 py-3 md:px-6">
            {/* Ya no dice «paso 1 de 3»: las tres preguntas están a la
                vista al mismo tiempo, así que lo que informa es cuántas
                llevas contestadas, no en cuál estás. */}
            <div className="flex items-center gap-3">
              <span className="label text-ink-2">
                {paso === 4
                  ? "Resultado"
                  : `${contestadas} de 3 contestadas`}
              </span>
              {/* Tres canales fijos y dentro una barra que CRECE. Antes
                  el filete cambiaba de color de golpe, que informa pero
                  no acusa recibo: el movimiento sí. */}
              <span className="flex gap-1.5" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className="h-1.5 w-8 overflow-hidden rounded-full bg-rule"
                  >
                    <span
                      className={cn(
                        "block h-full origin-left rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        contestadas >= n ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </span>
                ))}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {paso > 1 && (
                <button
                  type="button"
                  onClick={atras}
                  className="inline-flex min-h-11 items-center gap-1.5 px-3 text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent"
                >
                  <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
                  Atrás
                </button>
              )}
              {paso > 1 && (
                <button
                  type="button"
                  onClick={reiniciar}
                  className="inline-flex min-h-11 items-center gap-1.5 px-3 text-sm text-ink-2 transition-colors duration-200 hover:text-ink"
                >
                  <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
                  Empezar de nuevo
                </button>
              )}
            </div>
          </div>

          {/* ---------- Preguntas ----------
              Tres selectores en una sola pantalla, no un asistente de
              tres pasos con tarjetas. Es la forma que se pidió en la
              reunión del 24/08/2026: «asesoría… lo dejaría con el look
              and feel, pero lo metería de esta manera, que pueda
              seleccionar».

              Lo que se gana además del gusto: se ven las tres preguntas
              de golpe, así que se entiende el compromiso antes de
              empezar, y se puede cambiar la primera respuesta sin
              deshacer las otras dos.

              El segundo selector depende del primero —ahí está la
              gracia del asesor— así que arranca desactivado y con su
              motivo escrito, no simplemente vacío. */}
          {paso < 4 && (
            <fieldset className="px-4 py-5 md:px-6 md:py-6">
              <legend
                ref={enfoque as React.Ref<HTMLLegendElement>}
                tabIndex={-1}
                className="display-3 mb-1 text-ink focus:outline-none"
              >
                Tres respuestas y te decimos qué encaja
              </legend>
              <p className="mb-6 max-w-[60ch] text-sm text-ink-2">
                Elige la opción que más se parezca. Si no lo tienes claro,
                marca <em className="font-semibold not-italic">No lo sé</em>:
                el asesor ensancha la búsqueda en vez de bloquearse.
              </p>

              <div className="grid gap-5 lg:grid-cols-3">
                <Selector
                  numero={1}
                  etiqueta={ENUNCIADOS[1]}
                  valor={r.trabajo}
                  opciones={TRABAJOS}
                  placeholder="Elige el trabajo"
                  /* Cambiar de trabajo solo invalida la exigencia —sus
                     opciones dependen del trabajo—. El entorno vale igual
                     para las cuatro familias, así que no se borra. */
                  onChange={(v) => setR({ trabajo: v, parametro: null })}
                />
                <Selector
                  numero={2}
                  etiqueta={ENUNCIADOS[2]}
                  valor={r.parametro}
                  opciones={PARAMETROS[r.trabajo] ?? []}
                  placeholder="Elige la exigencia"
                  motivoBloqueo={
                    !r.trabajo ? "Contesta primero qué trabajo tienes" : undefined
                  }
                  onChange={(v) => setR({ parametro: v })}
                />
                <Selector
                  numero={3}
                  etiqueta={ENUNCIADOS[3]}
                  valor={r.entorno}
                  opciones={ENTORNOS}
                  placeholder="Elige el entorno"
                  /* Sin bloqueo: dónde va a trabajar la máquina no depende
                     ni del trabajo ni de la altura, y el resultado ya se
                     guarda hasta que estén las tres contestadas. Tenerlo
                     cerrado era fricción sin motivo en una pantalla que
                     presume de enseñar las tres preguntas a la vez. */
                  onChange={(v) => setR({ entorno: v })}
                />
              </div>

              {/* La ayuda de la opción elegida, debajo: en un selector no
                  cabe la descripción, y esa descripción es la que evita
                  que alguien elija «excavación profunda» para una zanja
                  de acometida. */}
              <Ayudas r={r} />

              <p className="mt-6 flex items-center gap-2 text-sm text-ink-2">
                <HelpCircle
                  size={15}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="shrink-0 text-ink-3"
                />
                En cuanto contestes las tres, la recomendación aparece
                aquí mismo.
              </p>
            </fieldset>
          )}

          {/* ---------- Resultado ---------- */}
          {paso === 4 && resultado && (
            <div className="px-4 py-5 md:px-6 md:py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3
                  ref={enfoque as React.Ref<HTMLHeadingElement>}
                  tabIndex={-1}
                  className="display-3 text-ink focus:outline-none"
                >
                  {resultado.recomendadas.length > 0
                    ? "Esto es lo que te encaja"
                    : "Nada encaja del todo"}
                </h3>
                {resultado.recomendadas.length > 0 && (
                  <p className="text-sm text-ink-2">
                    {resultado.recomendadas.length} de nuestro parque
                    {resultado.relajado &&
                      " · nada encajaba exacto, esto es lo más cercano"}
                  </p>
                )}
              </div>

              {resultado.recomendadas.length > 0 ? (
                <ul className="mt-5 divide-y divide-rule border-y border-rule">
                  {resultado.recomendadas.slice(0, 4).map((rec) => (
                    <FilaResultado
                      key={rec.maquina.slug}
                      maquina={rec.maquina}
                      razones={rec.razones}
                    />
                  ))}
                </ul>
              ) : (
                <SinResultados />
              )}

              {/* El asesor y los filtros son el mismo sistema. */}
              <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
                <Link
                  href={`/consultar-disponibilidad?contexto=${encodeURIComponent(
                    resumenRespuestas({
                      trabajo: r.trabajo,
                      parametro: r.parametro,
                      entorno: r.entorno,
                    }),
                  )}${
                    resultado.recomendadas.length
                      ? `&m=${resultado.recomendadas
                          .slice(0, 4)
                          .map((x) => x.maquina.slug)
                          .join(",")}`
                      : ""
                  }`}
                  className="btn-accent inline-flex h-13 items-center justify-center bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
                >
                  Consultar disponibilidad
                </Link>
                <Link
                  href={resultado.enlaceCatalogo}
                  className="group inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
                >
                  Ver estas máquinas en el catálogo
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Fila de resultado: compacta a propósito.
   La tarjeta de catálogo mide medio kilo de alto porque su trabajo es
   competir con las de al lado en una rejilla. Aquí el trabajo es otro:
   caber cuatro en pantalla con su explicación al lado.
   ============================================================ */

function FilaResultado({
  maquina: m,
  razones,
}: {
  maquina: Maquina;
  razones: string[];
}) {
  const specs = specsDestacadas(m).slice(0, 3);
  const subcat = SUBCATEGORIA_POR_SLUG[m.subcategoriaSlug];

  return (
    <li className="flex flex-col gap-4 py-4 md:flex-row md:items-center">
      <Link
        href={`/maquina/${m.slug}`}
        className="relative block h-20 w-28 shrink-0 overflow-hidden border border-rule bg-muted"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ImagenMaquina maquina={m} sizes="112px" compacto />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="label-sm text-ink-3">{subcat?.nombre ?? m.marca}</p>
        <h4 className="title mt-0.5">
          <Link
            href={`/maquina/${m.slug}`}
            className="inline-block py-0.5 text-ink transition-colors duration-200 hover:text-accent"
          >
            {m.marca} {m.modelo}
          </Link>
        </h4>
        <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {specs.map((k) => {
            const def = SPEC_POR_KEY[k];
            return (
              <div key={k} className="flex items-baseline gap-1.5">
                <dt className="label-sm text-ink-3">{def.etiqueta}</dt>
                <dd>
                  <DatoValor dato={m.specs[k]} def={def} />
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {/* Tres razones y no dos: la tercera suele ser la que explica la
          alimentación o el ancho de paso, que es lo que decide si la
          máquina sirve de verdad en ese sitio. Caben sin crecer la fila,
          porque la miniatura ya mide 80px de alto. */}
      {razones.length > 0 && (
        <ul className="shrink-0 space-y-1 md:max-w-[32ch]">
          {razones.slice(0, 3).map((z) => (
            <li key={z} className="flex items-start gap-2 text-sm text-ink-2">
              <Check
                size={14}
                strokeWidth={2.5}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-ok"
              />
              {z}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SinResultados() {
  return (
    <div className="panel mt-5 p-5">
      <p className="title text-ink">
        No tenemos una máquina que cumpla las tres condiciones a la vez.
      </p>
      <p className="mt-2 max-w-[70ch] text-base text-ink-2">
        Eso no significa que no haya solución: casi siempre la hay combinando
        dos equipos o ajustando un requisito. Llámanos y lo vemos en dos
        minutos.
      </p>
      <a
        href={`tel:${TELEFONO_PRINCIPAL.tel}`}
        className="mt-4 inline-flex min-h-12 items-center gap-2 border border-rule-control bg-surface px-5 text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken pastilla"
      >
        <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
        <span className="value">{TELEFONO_PRINCIPAL.visible}</span>
      </a>
    </div>
  );
}


/* ============================================================
   Piezas del formulario
   ============================================================ */

function Selector({
  numero,
  etiqueta,
  valor,
  opciones,
  placeholder,
  motivoBloqueo,
  onChange,
}: {
  numero: number;
  etiqueta: string;
  valor: string;
  opciones: readonly Opcion[];
  placeholder: string;
  motivoBloqueo?: string;
  onChange: (v: string) => void;
}) {
  const bloqueado = Boolean(motivoBloqueo) || opciones.length === 0;

  return (
    <label className="block">
      <span className="etiqueta-campo flex items-center gap-2.5 text-ink">
        <span
          className={cn(
            "value flex size-6 shrink-0 items-center justify-center rounded-full text-xs transition-colors duration-300",
            valor
              ? "bg-accent text-white"
              : bloqueado
                ? "bg-muted text-ink-3"
                : "bg-accent-tint text-accent",
          )}
          aria-hidden="true"
        >
          {valor ? "✓" : numero}
        </span>
        {etiqueta}
      </span>

      <span className="relative mt-2.5 block">
        <select
          value={valor}
          disabled={bloqueado}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-13 w-full cursor-pointer appearance-none rounded-xl border bg-surface pr-10 pl-3.5 text-base transition-[border-color,box-shadow] duration-200",
            bloqueado
              ? "cursor-not-allowed border-rule bg-sunken text-ink-3"
              : "border-rule-strong text-ink hover:border-rule-control focus:border-accent focus:shadow-[0_0_0_3px_rgba(227,6,19,.12)]",
            valor && !bloqueado && "border-ink",
          )}
        >
          <option value="">{bloqueado ? "—" : placeholder}</option>
          {opciones.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={17}
          strokeWidth={2}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2",
            bloqueado ? "text-rule-strong" : "text-ink-3",
          )}
        />
      </span>

      {motivoBloqueo && (
        <span className="mt-2 block text-sm text-ink-3">{motivoBloqueo}</span>
      )}
    </label>
  );
}

/** La descripción de lo ya elegido, que en un `<select>` no cabe. */
function Ayudas({ r }: { r: Respuestas }) {
  const elegidas = [
    TRABAJOS.find((o) => o.id === r.trabajo),
    (PARAMETROS[r.trabajo] ?? []).find((o) => o.id === r.parametro),
    ENTORNOS.find((o) => o.id === r.entorno),
  ].filter(Boolean) as Opcion[];

  if (elegidas.length === 0) return null;

  return (
    <ul className="panel mt-5 space-y-2 border-l-2 border-l-accent px-4 py-3.5">
      {elegidas.map((o) => (
        <li key={o.id} className="text-sm text-ink-2">
          <span className="font-semibold text-ink">{o.label}</span> — {o.desc}
        </li>
      ))}
    </ul>
  );
}
