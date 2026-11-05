/**
 * Agrupa y minifica los CSS y JS del plugin en dos archivos:
 *
 *   assets/dist/jm.min.css  ← assets/css/*.css, en orden alfabético
 *   assets/dist/jm.min.js   ← assets/js/[0-9]*.js, en orden alfabético
 *
 * Antes eran 12 hojas y 9 scripts por página (21 peticiones); ahora 2. Los
 * originales siguen siendo la fuente que se edita: el plugin carga el
 * paquete si existe y, si no (o con SCRIPT_DEBUG), los sueltos.
 *
 *   node elementor-pro/scripts/agrupar.mjs
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "plugin", "jofemesa-core", "assets");
const DIST = join(RAIZ, "dist");
mkdirSync(DIST, { recursive: true });

function juntar(carpeta, filtro) {
  return readdirSync(join(RAIZ, carpeta))
    .filter(filtro)
    .sort()
    .map((n) => `/* ${carpeta}/${n} */\n` + readFileSync(join(RAIZ, carpeta, n), "utf8"))
    .join(carpeta === "js" ? "\n;\n" : "\n");
}

function minificar(codigo, cargador) {
  /* npx con shell en Windows; la entrada va por stdin. */
  return execFileSync(
    "npx",
    ["-y", "esbuild@0.24.0", `--loader=${cargador}`, "--minify", "--target=es2018,chrome80,safari13"],
    { input: codigo, shell: process.platform === "win32", maxBuffer: 64 * 1024 * 1024 },
  ).toString();
}

const css = juntar("css", (n) => n.endsWith(".css"));
const js = juntar("js", (n) => /^\d.*\.js$/.test(n));

const cssMin = minificar(css, "css");
const jsMin = minificar(js, "js");
writeFileSync(join(DIST, "jm.min.css"), cssMin);
writeFileSync(join(DIST, "jm.min.js"), jsMin);

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(0) + " KB";
console.log(`CSS ${kb(css)} → ${kb(cssMin)} · JS ${kb(js)} → ${kb(jsMin)}`);
