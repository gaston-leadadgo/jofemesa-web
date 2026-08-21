/**
 * Extractor de texto de PDF sin dependencias.
 * Suficiente para leer las tablas de especificaciones de las fichas
 * técnicas de fabricante y confirmar cifras reales, en vez de deducirlas
 * de la nomenclatura del modelo.
 *
 *   node scripts/pdf-text.mjs public/fichas/genie-gs-3268rt.pdf
 */
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

export function pdfText(file) {
  const buf = readFileSync(file);
  const latin = buf.toString("latin1");
  let out = "";
  const re = /stream\r?\n/g;
  let m;
  while ((m = re.exec(latin)) !== null) {
    const start = m.index + m[0].length;
    const end = latin.indexOf("endstream", start);
    if (end < 0) continue;
    let data = buf.subarray(start, end);
    try {
      data = inflateSync(data);
    } catch {
      continue;
    }
    const s = data.toString("latin1");
    // Operadores de texto: (...) Tj  y  [(...)(...)] TJ
    const tokens = s.match(/\((?:\\.|[^\\()])*\)/g);
    if (tokens) {
      out += tokens.map((t) => t.slice(1, -1)).join(" ") + "\n";
    }
  }
  return out
    .replace(/\\(\d{3})/g, (_, o) => String.fromCharCode(parseInt(o, 8)))
    .replace(/\\([()\\])/g, "$1")
    .replace(/[ \t]{2,}/g, " ");
}

const file = process.argv[2];
if (file) {
  const limit = Number(process.argv[3] ?? 4000);
  process.stdout.write(pdfText(file).slice(0, limit));
}
