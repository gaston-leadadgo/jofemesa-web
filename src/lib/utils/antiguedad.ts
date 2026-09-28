import { EMPRESA } from "@/content/es/empresa";

export type Desglose = { anios: number; meses: number; dias: number };

/** Años, meses y días exactos desde la fundación (24/03/1987) hasta hoy. */
export function desgloseFundacion(hoy = new Date()): Desglose {
  /* En hora LOCAL, no `new Date("1987-03-24")`: una fecha ISO sin hora se
     lee como medianoche UTC, y al oeste de Greenwich eso cae el 23 y el
     contador sumaba un día de más. */
  const [a, m, d] = EMPRESA.fundacionIso.split("-").map(Number);
  const desde = new Date(a, m - 1, d);

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
  return { anios, meses, dias };
}

/**
 * Para `useSyncExternalStore`: una cadena, no un objeto, porque el
 * snapshot tiene que ser igual entre llamadas o React entra en bucle.
 */
export function claveFundacion(): string {
  const { anios, meses, dias } = desgloseFundacion();
  return `${anios}|${meses}|${dias}`;
}

export function leerClave(clave: string): Desglose {
  const [anios, meses, dias] = clave.split("|").map(Number);
  return { anios, meses, dias };
}

/**
 * La fecha cambia a medianoche: se comprueba cada minuto y React solo
 * repinta si la cadena ha cambiado de verdad.
 */
export function suscribirDia(avisar: () => void): () => void {
  const t = window.setInterval(avisar, 60_000);
  return () => window.clearInterval(t);
}

export const plural = (n: number, uno: string, varios: string) =>
  n === 1 ? uno : varios;
