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
 * «Desde el 24/03/1987», al detalle.
 *
 * Es el dato de la lámina del cliente, que lo publica como «XX años · 4
 * meses · 17 días desde el 24/03/1987». En la reunión se pidió darle más
 * relevancia al año de fundación, y esta es la forma de hacerlo sin
 * añadir una cifra nueva: la que ya tienen, contada exacta.
 *
 * La fecha de hoy es estado EXTERNO a React, así que se lee con
 * `useSyncExternalStore`: el servidor pinta los años —una cifra que no
 * depende de la hora ni de la zona— y el desglose aparece al hidratar.
 */

const enServidor = () => null;

export function Antiguedad({ className }: { className?: string }) {
  const clave = useSyncExternalStore(suscribirDia, claveFundacion, enServidor);
  if (!clave) {
    return <span className={className}>{EMPRESA.anios} años</span>;
  }
  const { anios, meses, dias } = leerClave(clave);
  return (
    <span className={className}>
      {anios} {plural(anios, "año", "años")} · {meses}{" "}
      {plural(meses, "mes", "meses")} · {dias} {plural(dias, "día", "días")}
    </span>
  );
}
