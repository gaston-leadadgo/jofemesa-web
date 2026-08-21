/** Comprueba contrastes WCAG del sistema. No se aprueba un color "a ojo". */
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (hex) => { const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * (n & 255) / 255 * 0 + 0.0722 * lin(n & 255); };
export const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const pares = [
  ["#E30613", "#FFFFFF", "rojo referencia sobre blanco"],
  ["#D81F13", "#FFFFFF", "rojo del plan sobre blanco"],
  ["#E30613", "#F6F8F9", "rojo referencia sobre hundido"],
  ["#E30613", "#EEF1F3", "rojo referencia sobre lecho"],
  ["#C20510", "#FFFFFF", "hover"],
  ["#A80410", "#FFFFFF", "activo"],
  ["#FF4438", "#14171A", "acento en oscuro"],
  ["#14171A", "#FFFFFF", "tinta"],
  ["#4A545C", "#FFFFFF", "tinta 2"],
  ["#6B7780", "#FFFFFF", "tinta 3"],
  ["#FFFFFF", "#E30613", "blanco sobre botón rojo"],
  ["#14171A", "#EFBB20", "tinta sobre ámbar"],
  ["#0E7A46", "#FFFFFF", "ok"],
  ["#C3CBD1", "#14171A", "tinta inv 2"],
  ["#8A9199", "#14171A", "tinta inv 3"],
];
for (const [a, b, nota] of pares) {
  const r = ratio(a, b);
  const sello = r >= 7 ? "AAA" : r >= 4.5 ? "AA " : r >= 3 ? "AA-grande" : "FALLA";
  console.log(`${a} / ${b}  ${r.toFixed(2).padStart(6)}:1  ${sello.padEnd(10)} ${nota}`);
}
