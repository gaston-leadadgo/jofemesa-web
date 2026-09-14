"use client";

import { useSyncExternalStore } from "react";
import { EMPRESA } from "@/content/es/empresa";

/**
 * «Desde el 24/03/1987», al detalle.
 *
 * Es el dato de la lámina del cliente, que lo publica como «XX años · 4
 * meses · 17 días desde el 24/03/1987». En la reunión se pidió darle más
 * relevancia al año de fundación, y esta es la forma de hacerlo sin
 * añadir una cifra nueva: la que ya tienen, contada exacta.
 *
 * La fecha de hoy es estado EXTERNO a React, igual que `localStorage`,
 * así que se lee con `useSyncExternalStore` y no con un efecto que hace
 * `setState`. La consecuencia práctica es la que importa: el servidor
 * pinta los años —una cifra que no depende de la hora ni de la zona—, y
 * el desglose aparece al hidratar, sin desajuste y sin un render
 * encadenado de más.
 */

function desglose(): string {
  const desde = new Date(EMPRESA.fundacionIso);
  const hoy = new Date();

  let anios = hoy.getFullYear() - desde.getFullYear();
  let meses = hoy.getMonth() - desde.getMonth();
  let dias = hoy.getDate() - desde.getDate();

  if (dias < 0) {
    meses -= 1;
    // Día 0 del mes actual = último día del mes anterior.
    dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
  }
  if (meses < 0) {
    anios -= 1;
    meses += 12;
  }

  return [
    `${anios} año${anios === 1 ? "" : "s"}`,
    `${meses} mes${meses === 1 ? "" : "es"}`,
    `${dias} día${dias === 1 ? "" : "s"}`,
  ].join(" · ");
}

/** No cambia mientras la pestaña está abierta: nada a lo que suscribirse. */
const suscribir = () => () => {};
const enServidor = () => `${EMPRESA.anios} años`;

export function Antiguedad({ className }: { className?: string }) {
  const texto = useSyncExternalStore(suscribir, desglose, enServidor);
  return (
    <span className={className} suppressHydrationWarning>
      {texto}
    </span>
  );
}
