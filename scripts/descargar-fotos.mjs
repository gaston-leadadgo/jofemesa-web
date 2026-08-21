/**
 * Descarga fotografía de maquinaria de Wikimedia Commons para usarla como
 * SUSTITUTO TEMPORAL mientras llega la autorización de los fabricantes.
 *
 * Commons y no el catálogo del fabricante a propósito: aquí las licencias
 * son libres (CC / dominio público) y se pueden publicar sin pedir permiso.
 * No es la foto del modelo exacto, así que cada imagen se marca en el
 * catálogo con `provisional: true` y la web lo dice.
 *
 *   node scripts/descargar-fotos.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = join(RAIZ, "public", "img", "maquinas");
const API = "https://commons.wikimedia.org/w/api.php";
const AGENTE = "JOFEMESA-web-maqueta/1.0 (contacto: agencia.gutmark@gmail.com)";

/** Búsquedas por subcategoría. Varias por subcategoría para que dos
 *  máquinas de la misma familia no salgan con la misma foto. */
const BUSQUEDAS = {
  "tijeras-electricas": [
    "Genie scissor lift", "scissor lift platform indoor",
    "Skyjack scissor lift", "aerial work platform scissor",
    "Hebebuehne Scherenbuehne", "scissor lift warehouse",
    "elevating work platform scissor", "Scherenarbeitsbuehne",
    "scissor lift maintenance building", "JLG scissor lift",
    "Haulotte Compact scissor", "mobile elevating work platform",
  ],
  "tijeras-diesel": [
    "rough terrain scissor lift", "Genie GS-4390", "scissor lift construction site",
    "Scherenbuehne Baustelle", "scissor lift outdoor construction",
    "diesel scissor lift", "Genie GS scissor", "scissor lift four wheel drive",
    "Skyjack rough terrain", "scissor lift road works",
  ],
  "tijeras-hibridas": ["hybrid scissor lift"],
  "mastiles-verticales": ["vertical mast lift", "Genie GR-20 lift"],
  "brazos-articulados-electricos": ["articulated boom lift electric", "JLG articulating boom"],
  "brazos-diesel": ["articulated boom lift diesel", "Haulotte boom lift", "telescopic boom lift crawler"],
  "brazos-hibridos": ["hybrid boom lift"],
  "brazos-telescopicos": ["telescopic boom lift", "JLG telescopic boom", "Genie telescopic boom lift"],
  "plataformas-sobre-camion": ["truck mounted aerial platform", "truck mounted lift"],
  "plataformas-sobre-oruga": ["tracked spider lift", "crawler aerial platform"],
  "manipuladores-telescopicos-rigidos": ["Manitou telehandler", "telescopic handler construction"],
  "manipuladores-telescopicos-giratorios": ["rotating telehandler", "Manitou MRT"],
  "carretillas-electricas": [
    "electric forklift warehouse", "Jungheinrich forklift",
    "electric counterbalance forklift", "reach truck warehouse",
  ],
  "carretillas-diesel": ["diesel forklift", "counterbalance forklift outdoor"],
  "carretillas-todoterreno": ["rough terrain forklift", "Manitou MH forklift"],
  "transpaletas-apiladores": ["pallet stacker", "electric pallet truck"],
  miniexcavadoras: ["Takeuchi mini excavator", "mini excavator construction", "compact excavator"],
  retrocargadoras: ["backhoe loader", "JCB backhoe"],
  minicargadoras: ["Bobcat skid steer loader", "skid steer loader"],
  "dumpers-4x4": ["site dumper", "articulated dumper construction"],
  rodillos: ["Bomag road roller", "tandem roller compactor"],
  pisones: ["tamping rammer compactor", "Wacker Neuson rammer"],
  "bandejas-vibrantes": ["vibratory plate compactor"],
  "grupos-electrogenos": ["portable diesel generator set", "generator set construction"],
  "torres-iluminacion": ["mobile lighting tower", "light tower construction"],
  "compresores-portatiles": ["portable air compressor construction", "Atlas Copco compressor"],
  "martillos-neumaticos": ["pneumatic breaker jackhammer"],
  "bombas-agua": ["water pump construction site"],
  cortadoras: ["floor saw concrete cutting"],
};

const ESPERA = (ms) => new Promise((r) => setTimeout(r, ms));

async function json(url) {
  const res = await fetch(url, { headers: { "User-Agent": AGENTE } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/** Busca ficheros y devuelve el mejor candidato: horizontal y ancho. */
async function mejorFoto(consulta, yaUsadas) {
  const busca = new URL(API);
  busca.search = new URLSearchParams({
    action: "query", format: "json",
    generator: "search", gsrsearch: `filetype:bitmap ${consulta}`,
    gsrnamespace: "6", gsrlimit: "18",
    prop: "imageinfo", iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "1600",
  }).toString();

  const data = await json(busca);
  const paginas = Object.values(data?.query?.pages ?? {});

  const candidatas = paginas
    .map((p) => ({ titulo: p.title, info: p.imageinfo?.[0] }))
    .filter((c) => c.info && !yaUsadas.has(c.titulo))
    .filter((c) => {
      const { width, height, mime } = c.info;
      if (!/jpeg|png|webp/.test(mime ?? "")) return false;
      if (width < 1000) return false;          // nada por debajo de 1000px
      if (height / width > 1.05) return false; // horizontal o casi cuadrada
      return true;
    })
    // Cuanto más ancha, mejor: esta web se ve a tamaño grande.
    .sort((a, b) => b.info.width - a.info.width);

  return candidatas[0] ?? null;
}

function atribucion(info) {
  const m = info.extmetadata ?? {};
  const limpia = (s) => (s ? String(s).replace(/<[^>]*>/g, "").trim() : null);
  return {
    autor: limpia(m.Artist?.value) ?? "Autor no indicado",
    licencia: limpia(m.LicenseShortName?.value) ?? "ver Commons",
    origen: info.descriptionurl ?? null,
  };
}

const registro = [];
const usadas = new Set();

for (const [sub, consultas] of Object.entries(BUSQUEDAS)) {
  const carpeta = join(DESTINO, sub);
  await mkdir(carpeta, { recursive: true });
  let n = 0;

  for (const consulta of consultas) {
    let elegida = null;
    try {
      elegida = await mejorFoto(consulta, usadas);
    } catch (e) {
      console.warn(`  ! ${consulta}: ${e.message}`);
    }
    if (!elegida) {
      console.warn(`  – sin candidata: ${consulta}`);
      await ESPERA(200);
      continue;
    }

    usadas.add(elegida.titulo);
    const info = elegida.info;
    const url = info.thumburl ?? info.url;
    // La URL de miniatura trae parámetros de campaña: se recortan antes
    // de deducir la extensión, o el patrón nunca encaja.
    const limpia = url.split("?")[0];
    const ext = (limpia.match(/\.(jpe?g|png|webp)$/i)?.[1] ?? "jpg").toLowerCase();
    const nombre = `${sub}-${++n}.${ext === "jpeg" ? "jpg" : ext}`;
    const ruta = join(carpeta, nombre);

    if (existsSync(ruta)) {
      console.log(`  = ${nombre} (ya estaba)`);
    } else {
      const bin = await fetch(url, { headers: { "User-Agent": AGENTE } });
      if (!bin.ok) { console.warn(`  ! bajada ${bin.status}`); continue; }
      await writeFile(ruta, Buffer.from(await bin.arrayBuffer()));
      console.log(`  + ${nombre}  ${info.thumbwidth ?? info.width}px`);
    }

    registro.push({
      subcategoria: sub,
      fichero: `/img/maquinas/${sub}/${nombre}`,
      ancho: info.thumbwidth ?? info.width,
      alto: info.thumbheight ?? info.height,
      commons: elegida.titulo,
      ...atribucion(info),
    });
    await ESPERA(200);
  }
  console.log(`${sub}: ${n} foto(s)`);
}

await writeFile(
  join(RAIZ, "data", "fotos-provisionales.json"),
  JSON.stringify(registro, null, 2) + "\n",
);
console.log(`\n${registro.length} fotos · registro en data/fotos-provisionales.json`);
