/**
 * node construccion/generar.mjs inicio      → salida/inicio-<seccion>.json
 * Cada archivo de página exporta `default` = { prefijo, secciones: { nombre: () => [elementos] } }.
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empezar } from "./lib.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const nombre = process.argv[2];
const doc = (await import(`./${nombre}.mjs`)).default;
empezar(doc.prefijo);
for (const [sec, fn] of Object.entries(doc.secciones)) {
  const json = JSON.stringify(fn());
  writeFileSync(join(AQUI, "salida", `${nombre}-${sec}.json`), json);
  console.log(`${nombre}-${sec}.json · ${json.length} bytes`);
}
