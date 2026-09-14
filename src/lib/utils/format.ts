/** Formato español: coma decimal, punto de millar. */

/**
 * `useGrouping: "always"` es deliberado.
 *
 * El español, por norma, no separa los millares en números de cuatro
 * cifras: 3771, no 3.771. Pero estas cifras viven en tablas de
 * especificaciones donde una fila dice 3771 kg y la de abajo 10.500 kg, y
 * esa mezcla se lee como descuido y estorba al comparar. En contexto de
 * dato tabular gana la legibilidad de la columna.
 */
const NUM = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 2,
  useGrouping: "always",
});

export function num(v: number): string {
  return NUM.format(v);
}

/** "11,75 m" — la unidad va aparte para poder atenuarla en la interfaz. */
export function medida(v: number, unidad: string): string {
  return `${NUM.format(v)}${unidad ? ` ${unidad}` : ""}`;
}

/**
 * `timeZone: "UTC"` no es un detalle: es la corrección de un error que
 * se vio en pantalla.
 *
 * Una fecha como `"2025-02-27"` se interpreta como medianoche UTC. Si
 * quien la formatea está en un huso por detrás de UTC —el servidor de
 * compilación, o el navegador de alguien— «27 de febrero» se convierte
 * en «26 de febrero». Fijando el huso, la fecha de una entrada de blog
 * es la misma en Madrid, en Lisboa y en la máquina que compila.
 */
const FECHA = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const FECHA_CORTA = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function fecha(iso: string): string {
  return FECHA.format(new Date(iso));
}

export function fechaCorta(iso: string): string {
  return FECHA_CORTA.format(new Date(iso));
}

/** Une con comas y una "y" final: "Madrid, Valencia y Sevilla". */
export function listaEs(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}
