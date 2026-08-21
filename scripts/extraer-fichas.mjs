/**
 * Vuelca el texto de todas las fichas técnicas descargadas a data/raw/fichas/
 * para poder transcribir a mano las cifras al catálogo.
 *
 * Se transcribe a mano a propósito: un parser heurístico sobre tablas de
 * PDF se equivoca en silencio, y una cifra de altura equivocada en una web
 * de alquiler es un problema comercial real, no un bug cosmético.
 */
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pdfText } from "./pdf-text.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const origen = join(raiz, "public", "fichas");
const destino = join(raiz, "data", "raw", "fichas");

mkdirSync(destino, { recursive: true });

let n = 0;
for (const f of readdirSync(origen).filter((f) => f.endsWith(".pdf"))) {
  const texto = pdfText(join(origen, f))
    // las fichas traen basura binaria de las fuentes incrustadas al final
    .split("\n")
    .filter((l) => {
      const legible = (l.match(/[a-zA-Z0-9 ,.\/%áéíóúñÁÉÍÓÚÑ-]/g) ?? []).length;
      return l.length > 20 && legible / l.length > 0.85;
    })
    .join("\n");
  writeFileSync(join(destino, f.replace(/\.pdf$/, ".txt")), texto, "utf8");
  console.log(`${f.padEnd(28)} ${texto.length} caracteres legibles`);
  n++;
}
console.log(`\n${n} fichas volcadas en data/raw/fichas/`);
