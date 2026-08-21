"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQueryStates, parseAsString } from "nuqs";
import {
  ArrowLeft,
  ArrowRight,
  Check,
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
import { fotoProvisional } from "@/lib/catalog/fotos";
import { SUBCATEGORIA_POR_SLUG } from "@/lib/catalog/familias";
import { DatoValor } from "@/components/spec/DatoValor";
import { SiluetaMaquina } from "@/components/maquina/SiluetaMaquina";

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
  1: "¿Qué trabajo tienes que hacer?",
  2: "¿Con qué exigencia?",
  3: "¿Y dónde va a trabajar la máquina?",
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
 * El precio es que la página tiene que renderizarse en cada petición para
 * que un enlace con respuestas llegue ya resuelto.
 */
export function AsesorUrl() {
  const [r, setR] = useQueryStates(
    {
      trabajo: parseAsString.withDefault(""),
      parametro: parseAsString.withDefault(""),
      entorno: parseAsString.withDefault(""),
    },
    { history: "push", shallow: true, clearOnDefault: true },
  );
  return (
    <Asesor
      modo="pagina"
      respuestas={r}
      cambiar={(p) => setR(p as Record<string, string | null>)}
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

  const opciones: Opcion[] =
    paso === 1
      ? TRABAJOS
      : paso === 2
        ? (PARAMETROS[r.trabajo] ?? [])
        : paso === 3
          ? ENTORNOS
          : [];

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
          className="border border-rule bg-surface shadow-panel"
          data-revelar="escala"
        >
          {/* Barra de estado del formulario */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule bg-sunken px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <span className="label text-ink-2">
                {paso === 4 ? "Resultado" : `Paso ${paso} de 3`}
              </span>
              <span className="flex gap-1" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className={cn(
                      "h-1.5 w-8 transition-colors duration-200",
                      paso > n || paso === 4
                        ? "bg-accent"
                        : paso === n
                          ? "bg-rule-control"
                          : "bg-rule",
                    )}
                  />
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

          {/* ---------- Preguntas ---------- */}
          {paso < 4 && (
            <fieldset className="px-4 py-5 md:px-6 md:py-6">
              <legend
                ref={enfoque as React.Ref<HTMLLegendElement>}
                tabIndex={-1}
                className="display-3 mb-1 text-ink focus:outline-none"
              >
                {ENUNCIADOS[paso]}
              </legend>
              <p className="mb-5 text-sm text-ink-2">
                Elige la opción que más se parezca. Si no lo tienes claro,
                marca <em className="not-italic font-semibold">No lo sé</em>: el
                asesor ensancha la búsqueda en vez de bloquearse.
              </p>

              <div className="grid gap-px bg-rule md:grid-cols-2 lg:grid-cols-3">
                {opciones.map((o) => (
                  <label
                    key={o.id}
                    className="group relative flex cursor-pointer gap-3 bg-surface p-4 transition-colors duration-200 hover:bg-sunken has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-accent"
                  >
                    <input
                      type="radio"
                      name={`asesor-paso-${paso}`}
                      value={o.id}
                      className="peer sr-only"
                      onChange={() =>
                        setR(
                          paso === 1
                            ? { trabajo: o.id }
                            : paso === 2
                              ? { parametro: o.id }
                              : { entorno: o.id },
                        )
                      }
                    />
                    {/* El indicador de radio es lo que dice "esto se
                        elige". Cuadrado y de 20px: se ve con guante. */}
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 border-rule-control transition-colors duration-150 group-hover:border-accent peer-checked:border-accent peer-checked:bg-accent peer-checked:[&>svg]:opacity-100"
                    >
                      {/* `peer-checked:` compila a `.peer:checked ~ .x`, así
                          que no alcanza a un descendiente: la opacidad del
                          glifo se controla desde el hermano con [&>svg]. */}
                      <Check
                        size={13}
                        strokeWidth={3}
                        className="text-white opacity-0"
                      />
                    </span>
                    <span>
                      <span className="flex items-center gap-1.5 text-base font-semibold text-ink">
                        {o.label}
                        {o.id === "no-se" && (
                          <HelpCircle
                            size={14}
                            strokeWidth={2}
                            aria-hidden="true"
                            className="text-ink-3"
                          />
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-ink-2">
                        {o.desc}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
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
                  className="btn-accent inline-flex h-13 items-center justify-center bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover"
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
  const foto = m.imagenes[0] ?? fotoProvisional(m);
  const src = m.imagenes[0]?.src ?? (foto && "fichero" in foto ? foto.fichero : null);
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
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center p-2">
            <SiluetaMaquina familia={m.familia} />
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <p className="label-sm text-ink-3">{subcat?.nombre ?? m.marca}</p>
        <h4 className="title mt-0.5">
          <Link
            href={`/maquina/${m.slug}`}
            className="text-ink transition-colors duration-200 hover:text-accent"
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
    <div className="mt-5 border border-rule bg-sunken p-5">
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
        className="mt-4 inline-flex min-h-12 items-center gap-2 border border-rule-control bg-surface px-5 text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken"
      >
        <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
        <span className="value">{TELEFONO_PRINCIPAL.visible}</span>
      </a>
    </div>
  );
}
