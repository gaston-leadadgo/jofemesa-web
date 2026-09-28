"use client";

import { useSyncExternalStore } from "react";
import { EMPRESA } from "@/content/es/empresa";
import {
  claveFundacion,
  leerClave,
  plural,
  suscribirDia,
} from "@/lib/utils/antiguedad";

/**
 * El contador de la franja superior: años, meses y días desde el
 * 24/03/1987, contados desde cero hasta hoy al cargar la página.
 *
 * La cuenta es CSS puro (`@property --n` + `counter()`, en globals.css):
 * sin estado ni temporizadores en JavaScript. Cada cifra arranca un poco
 * después de la anterior. Con «reducir movimiento» sale quieta.
 *
 * El valor visible es un pseudo-elemento, que un lector de pantalla no
 * lee de forma fiable, así que la frase completa va aparte en `sr-only`.
 *
 * El servidor no sabe qué día es para el que visita —la página se
 * prerenderiza—, así que pinta «Desde 1987» y la cuenta aparece al
 * hidratar.
 */

const enServidor = () => null;

function Cifra({ n, retardo }: { n: number; retardo: number }) {
  return (
    <span
      className="cifra-contador text-ink-inv"
      style={
        { "--n": n, "--retardo-cifra": `${retardo}ms` } as React.CSSProperties
      }
    />
  );
}

export function ContadorFundacion() {
  const clave = useSyncExternalStore(suscribirDia, claveFundacion, enServidor);

  return (
    <p className="meta flex items-center gap-2 text-ink-inv-2">
      <span className="relative flex size-1.5" aria-hidden="true">
        <span className="absolute inline-flex size-full rounded-full bg-accent-dark opacity-70 motion-safe:animate-ping" />
        <span className="relative inline-flex size-1.5 rounded-full bg-accent-dark" />
      </span>
      {clave ? (
        (() => {
          const { anios, meses, dias } = leerClave(clave);
          return (
            <>
              <span className="sr-only">
                {anios} años, {meses} meses y {dias} días desde el 24 de marzo
                de {EMPRESA.fundacion}
              </span>
              <span aria-hidden="true" className="whitespace-nowrap">
                <Cifra n={anios} retardo={0} /> {plural(anios, "año", "años")}
                <span className="text-ink-inv-3"> · </span>
                <Cifra n={meses} retardo={180} /> {plural(meses, "mes", "meses")}
                <span className="text-ink-inv-3"> · </span>
                <Cifra n={dias} retardo={360} /> {plural(dias, "día", "días")}
                <span className="hidden text-ink-inv-3 lg:inline">
                  {" "}
                  desde el 24·03·{EMPRESA.fundacion}
                </span>
              </span>
            </>
          );
        })()
      ) : (
        <span>Especialistas en maquinaria desde {EMPRESA.fundacion}</span>
      )}
    </p>
  );
}
