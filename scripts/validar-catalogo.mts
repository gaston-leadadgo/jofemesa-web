/**
 * Validador del catálogo. Corre en `prebuild`: si algo de aquí falla, la
 * compilación se para. Es la garantía más barata de que el entregable no se
 * rompe en la pantalla del cliente.
 */
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { CATALOGO, FAMILIAS, SUBCATEGORIA_POR_SLUG } from "../src/lib/catalog/index.js";
import { SPEC_POR_KEY } from "../src/lib/catalog/types.js";
import { DELEGACIONES_POR_ID } from "../src/content/es/empresa.js";

const errores: string[] = [];
const avisos: string[] = [];
const vistos = new Set<string>();
let conFotoReal = 0;
let conDibujo = 0;

for (const m of CATALOGO) {
  const donde = `${m.marca} ${m.modelo}`;

  if (vistos.has(m.slug)) errores.push(`slug duplicado: ${m.slug}`);
  vistos.add(m.slug);

  if (!FAMILIAS.some((f) => f.id === m.familia))
    errores.push(`${donde}: familia desconocida "${m.familia}"`);
  if (!SUBCATEGORIA_POR_SLUG[m.subcategoriaSlug])
    errores.push(`${donde}: subcategoría desconocida "${m.subcategoriaSlug}"`);

  for (const d of m.delegaciones)
    if (!DELEGACIONES_POR_ID[d]) errores.push(`${donde}: delegación "${d}"`);

  for (const k of Object.keys(m.specs))
    if (!SPEC_POR_KEY[k as keyof typeof SPEC_POR_KEY])
      errores.push(`${donde}: spec sin definición "${k}"`);

  for (const img of m.imagenes) {
    if (!img.alt?.trim()) errores.push(`${donde}: imagen sin alt`);
    if (!existsSync(join("public", img.src)))
      errores.push(`${donde}: imagen inexistente ${img.src}`);
  }

  if (m.fichaTecnica) {
    const p = join("public", m.fichaTecnica.src);
    if (!existsSync(p)) errores.push(`${donde}: ficha inexistente ${m.fichaTecnica.src}`);
    else if (statSync(p).size !== m.fichaTecnica.bytes)
      avisos.push(`${donde}: bytes de la ficha desactualizados`);
  }

  // Dos estados de imagen: foto oficial de JOFEMESA o dibujo técnico.
  // El dibujo no es un error, es la respuesta honesta a no tener la foto.
  if (m.imagenes.length) conFotoReal++;
  else conDibujo++;
  if (!m.descripcionCorta?.trim()) errores.push(`${donde}: sin descripción`);
}

/* ---------- recuento de verificación ---------- */
let conf = 0, est = 0, pend = 0, na = 0;
for (const m of CATALOGO)
  for (const d of Object.values(m.specs)) {
    if (d.estado === "confirmado") conf++;
    else if (d.estado === "estimado") est++;
    else if (d.estado === "pendiente") pend++;
    else na++;
  }

console.log(`\nCatálogo: ${CATALOGO.length} máquinas`);
for (const f of FAMILIAS) {
  const n = CATALOGO.filter((m) => m.familia === f.id).length;
  if (n) console.log(`  ${String(n).padStart(3)}  ${f.nombre}`);
}
console.log(`\nEspecificaciones: ${conf} confirmadas · ${est} de fabricante · ${pend} pendientes · ${na} no aplican`);
console.log(`Con ficha técnica real: ${CATALOGO.filter((m) => m.fichaTecnica).length}`);
console.log(
  `Imágenes: ${conFotoReal} con fotografía oficial de JOFEMESA · ${conDibujo} con dibujo técnico`,
);

/* ---------- cobertura del catálogo impreso ---------- */
const porSubcat = new Map<string, number>();
for (const m of CATALOGO)
  porSubcat.set(m.subcategoriaSlug, (porSubcat.get(m.subcategoriaSlug) ?? 0) + 1);
for (const f of FAMILIAS)
  for (const s of f.subcategorias)
    if (!porSubcat.get(s.slug))
      errores.push(`subcategoría vacía en el menú: ${f.nombre} › ${s.nombre}`);

if (avisos.length) console.log(`\n${avisos.length} avisos (no bloquean)`);
if (errores.length) {
  console.error(`\n${errores.length} ERRORES:`);
  errores.slice(0, 25).forEach((e) => console.error("  " + e));
  process.exit(1);
}
console.log("\nValidación correcta.");
