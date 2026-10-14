/**
 * Verifica el paquete Elementor de JOFEMESA.
 *
 *   node elementor-pro/scripts/verificar-paquete.mjs
 *
 * FALLOS (no entregar con alguno):
 *   · CSS con llaves descompensadas, o selectores fuera de `body.jm`.
 *   · JS que no compila.
 *   · PHP con errores de sintaxis (si está instalado `php-parser`).
 *   · Un plano (estructura/*.md) que usa un shortcode, un ID de consulta o
 *     una clase `jm-` que no existe en el plugin.
 * AVISOS: selectores de hijo/hermano/posición sobre widgets (ver
 *   CONVENCIONES §4) para revisar uno a uno.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN = join(RAIZ, "plugin", "jofemesa-core");
const fallos = [];
const avisos = [];
const lista = (dir, ext) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(ext)).sort().map((f) => join(dir, f)) : [];
const rel = (p) => p.slice(RAIZ.length + 1).replaceAll("\\", "/");

/** Parte una lista de selectores por las comas de primer nivel (no las de :is(…)). */
function partirSelectores(sel) {
  const partes = [];
  let prof = 0;
  let actual = "";
  for (const c of sel) {
    if (c === "(" || c === "[") prof++;
    if (c === ")" || c === "]") prof--;
    if (c === "," && prof === 0) {
      partes.push(actual.trim());
      actual = "";
      continue;
    }
    actual += c;
  }
  if (actual.trim()) partes.push(actual.trim());
  return partes;
}

/* ---------- CSS ---------- */
const cssArchivos = lista(join(PLUGIN, "assets", "css"), ".css");
const clasesCss = new Set();
for (const f of cssArchivos) {
  const css = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  let prof = 0;
  for (const c of css) {
    if (c === "{") prof++;
    if (c === "}") prof--;
    if (prof < 0) break;
  }
  if (prof !== 0) fallos.push(`${rel(f)}: llaves descompensadas (${prof})`);

  for (const m of css.matchAll(/\.(jm-[a-z0-9_-]+)/gi)) clasesCss.add(m[1]);

  // Selectores de primer nivel y dentro de @media/@supports.
  const reglas = css.matchAll(/(^|[{}])\s*([^{}@][^{}]*?)\s*\{/g);
  for (const r of reglas) {
    const sel = r[2].trim();
    if (!sel || /^(from|to|\d+%)/.test(sel)) continue;
    for (const s of partirSelectores(sel)) {
      if (/^(:root|html|@)/.test(s)) continue;
      if (!/^(html(\[[^\]]+\]|:not\([^)]*\))*\s+)?body(\.[\w-]+)*\.jm\b/.test(s)) {
        fallos.push(`${rel(f)}: selector fuera de body.jm → ${s.slice(0, 90)}`);
      }
      /* El adaptador apunta a la estructura INTERNA de Elementor a propósito:
         sus selectores posicionales no dependen de los envoltorios. */
      if (f.endsWith("90-adaptador.css")) continue;
      if (/\.jm-[\w-]+\s*(>|\+|~)\s*\.elementor-widget|:first-child|:last-child|:nth-child/.test(s) && /elementor-widget|\.jm-/.test(s) && !/e-loop-item|elementor-element:nth|e-con-inner/.test(s)) {
        avisos.push(`${rel(f)}: revisar selector posicional con widgets → ${s.slice(0, 90)}`);
      }
    }
  }
}

/* ---------- Escritorio (panel de Formación): fuera de body.jm, solo sintaxis ---------- */
for (const f of lista(join(PLUGIN, "assets", "admin"), ".css")) {
  const css = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const prof = [...css].reduce((n, c) => n + (c === "{") - (c === "}"), 0);
  if (prof !== 0) fallos.push(`${rel(f)}: llaves descompensadas (${prof})`);
  for (const r of css.matchAll(/(^|[{}])\s*([^{}@][^{}]*?)\s*\{/g)) {
    const sel = r[2].trim();
    if (!sel || /^(from|to|\d+%)/.test(sel)) continue;
    for (const s of partirSelectores(sel)) {
      if (!s.startsWith("@") && !/^body\.jm-adm\b/.test(s)) fallos.push(`${rel(f)}: selector fuera de body.jm-adm → ${s.slice(0, 90)}`);
    }
  }
}

/* ---------- JS ---------- */
for (const f of [...lista(join(PLUGIN, "assets", "js"), ".js"), ...lista(join(PLUGIN, "assets", "admin"), ".js")]) {
  try {
    execFileSync(process.execPath, ["--check", f], { stdio: "pipe" });
  } catch (e) {
    fallos.push(`${rel(f)}: no compila → ${String(e.stderr).split("\n").find((l) => /Error/.test(l)) ?? ""}`);
  }
}

/* ---------- PHP ---------- */
const phpArchivos = [join(PLUGIN, "jofemesa-core.php"), ...lista(join(PLUGIN, "includes"), ".php")];
let parser = null;
try {
  const require = createRequire(import.meta.url);
  const Engine = require("php-parser");
  parser = new Engine({ parser: { php8: true, suppressErrors: false }, ast: { withPositions: false } });
} catch {
  avisos.push("php-parser no instalado: sin comprobar la sintaxis PHP (npm i -D php-parser en elementor-pro/scripts)");
}
const shortcodes = new Set();
const consultas = new Set();
const funciones = new Map();
for (const f of phpArchivos) {
  const php = readFileSync(f, "utf8");
  /* Una función declarada dos veces es un error fatal al activar el plugin. */
  for (const m of php.matchAll(/^\s*function\s+(jm_\w+)\s*\(/gm)) {
    if (funciones.has(m[1])) fallos.push(`${rel(f)}: la función ${m[1]} ya está declarada en ${funciones.get(m[1])} (error fatal en WordPress)`);
    else funciones.set(m[1], rel(f));
  }
  for (const m of php.matchAll(/add_shortcode\(\s*['"]([\w-]+)['"]/g)) {
    if (shortcodes.has(m[1])) fallos.push(`${rel(f)}: el shortcode [${m[1]}] se registra dos veces`);
  }
  if (parser) {
    try { parser.parseCode(php, f); } catch (e) { fallos.push(`${rel(f)}: ${e.message}`); }
  }
  for (const m of php.matchAll(/add_shortcode\(\s*['"]([\w-]+)['"]/g)) shortcodes.add(m[1]);
  /* Registro en bloque: 'jm_specs' => 'jm_sc_specs' recorrido con add_shortcode($tag, $fn). */
  for (const m of php.matchAll(/['"](jm_[\w]+)['"]\s*=>\s*['"]jm_sc_[\w]+['"]/g)) shortcodes.add(m[1]);
  for (const m of php.matchAll(/elementor\/query\/(jm_[\w]+)/g)) consultas.add(m[1]);
  for (const m of php.matchAll(/['"](jm_[\w]+)['"]\s*=>\s*(?:'[01]'|null|'[^']*')/g)) consultas.add(m[1]);
  // Clases que el PHP imprime también cuentan como existentes.
  for (const m of php.matchAll(/\b(jm-[a-z0-9_-]+)/gi)) clasesCss.add(m[1]);
}
for (const f of lista(join(PLUGIN, "assets", "js"), ".js")) {
  for (const m of readFileSync(f, "utf8").matchAll(/\b(jm-[a-z0-9_-]+)/gi)) clasesCss.add(m[1]);
}

/* ---------- Planos ---------- */
const docs = lista(join(RAIZ, "estructura"), ".md");
let usosShortcode = 0;
for (const f of docs) {
  const md = readFileSync(f, "utf8");
  for (const m of md.matchAll(/\[(jm_[\w]+)/g)) {
    usosShortcode++;
    if (!shortcodes.has(m[1])) fallos.push(`${rel(f)}: shortcode [${m[1]}] no registrado en el plugin`);
  }
  for (const m of md.matchAll(/(?:ID de consulta|Query ID|consulta)[^\n`]*`(jm_[\w]+)`/gi)) {
    if (!consultas.has(m[1])) fallos.push(`${rel(f)}: ID de consulta ${m[1]} no implementado`);
  }
  for (const linea of md.split("\n")) {
    const c = linea.match(/Clases?:\s*([^·|\n]+)/);
    if (!c) continue;
    for (const clase of c[1].trim().split(/\s+/)) {
      const limpia = clase.replace(/[`*,.;]+$/g, "").replace(/^[`*]+/, "");
      if (/^jm-/.test(limpia) && !clasesCss.has(limpia)) {
        avisos.push(`${rel(f)}: la clase ${limpia} no aparece en el CSS/JS/PHP`);
      }
    }
  }
}

/* ---------- Informe ---------- */
console.log(`CSS: ${cssArchivos.length} archivos · ${clasesCss.size} clases jm-`);
console.log(`PHP: ${phpArchivos.length} archivos · ${shortcodes.size} shortcodes · ${consultas.size} IDs de consulta`);
console.log(`Planos: ${docs.length} documentos · ${usosShortcode} usos de shortcode`);
if (avisos.length) {
  console.log(`\nAVISOS (${avisos.length}):`);
  [...new Set(avisos)].forEach((a) => console.log("  · " + a));
}
if (fallos.length) {
  console.log(`\nFALLOS (${fallos.length}):`);
  [...new Set(fallos)].forEach((a) => console.log("  ✗ " + a));
  process.exit(1);
}
console.log("\nFALLOS: 0. Paquete correcto.");
