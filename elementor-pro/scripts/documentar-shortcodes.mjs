/**
 * Genera estructura/99-shortcodes.md leyendo el PHP del plugin: cada
 * shortcode con su archivo, sus atributos (de shortcode_atts) y el primer
 * párrafo del comentario de su función.
 *
 *   node elementor-pro/scripts/documentar-shortcodes.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const INC = join(RAIZ, "plugin", "jofemesa-core", "includes");
const filas = [];
const DOCS = readdirSync(join(RAIZ, "estructura")).filter((f) => f.endsWith(".md") && !f.startsWith("99"));
const usos = (tag) =>
  DOCS.filter((d) => readFileSync(join(RAIZ, "estructura", d), "utf8").includes("[" + tag)).map((d) => d.replace(".md", ""));

for (const archivo of readdirSync(INC).filter((f) => f.endsWith(".php")).sort()) {
  const php = readFileSync(join(INC, archivo), "utf8");
  const registros = new Map();
  for (const m of php.matchAll(/add_shortcode\(\s*['"]([\w-]+)['"]\s*,\s*['"](\w+)['"]/g)) registros.set(m[1], m[2]);
  for (const m of php.matchAll(/['"](jm_[\w]+)['"]\s*=>\s*['"](jm_sc_[\w]+)['"]/g)) registros.set(m[1], m[2]);

  for (const [tag, fn] of registros) {
    /* El comentario /** … *\/ que va justo encima de la función, sin código entre medias. */
    const def = php.match(new RegExp(`((?:/\\*\\*(?:(?!\\*/)[\\s\\S])*\\*/\\s*)?)function\\s+${fn}\\s*\\(([\\s\\S]*?)\\n\\}`, "m"));
    let descripcion = "";
    let atributos = "—";
    if (def) {
      const doc = def[1]
        .replace(/^\/\*\*|\*\/$/g, "")
        .split("\n")
        .map((l) => l.replace(/^\s*\*\s?/, "").trim())
        .join(" ")
        .trim();
      descripcion = doc.split(/(?<=\.)\s/)[0] ?? "";
      const atts = def[2].match(/shortcode_atts\(\s*\[([\s\S]*?)\]\s*,/);
      if (atts) {
        atributos = [...atts[1].matchAll(/['"]([\w-]+)['"]\s*=>\s*([^,\n]+)/g)]
          .map((a) => `\`${a[1]}\`${a[2].trim() !== "''" && a[2].trim() !== '""' ? ` (por defecto ${a[2].trim().replace(/['"]/g, "")})` : ""}`)
          .join(", ") || "—";
      }
    }
    filas.push({ tag, archivo, descripcion: descripcion.replace(/\|/g, "/"), atributos: atributos.replace(/\|/g, "/") });
  }
}

const md = [
  "# 99 · Shortcodes del plugin",
  "",
  "Generado desde el código con `node elementor-pro/scripts/documentar-shortcodes.mjs`. No lo edites a mano.",
  "",
  "Se colocan con el widget **Shortcode** de Elementor. Los que devuelven solo texto o una URL se pueden usar",
  "también como **etiqueta dinámica → Shortcode** dentro de un widget nativo (título, texto, enlace de botón).",
  "",
  "| Shortcode | Atributos | Dónde se usa | Archivo |",
  "|---|---|---|---|",
  ...filas.map((f) => `| \`[${f.tag}]\` | ${f.atributos} | ${usos(f.tag).join(", ") || "—"} | \`${f.archivo}\` |`),
  "",
].join("\n");

writeFileSync(join(RAIZ, "estructura", "99-shortcodes.md"), md, "utf8");
console.log(`${filas.length} shortcodes documentados`);
