/**
 * Genera elementor-pro/dist/jofemesa-core.zip, listo para
 * Plugins → Añadir nuevo → Subir plugin.
 *
 *   node elementor-pro/scripts/empaquetar.mjs
 *
 * ZIP escrito a mano con zlib (deflate) para no depender de nada instalado.
 */
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync, crc32 } from "node:zlib";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEN = join(RAIZ, "plugin");
const DESTINO = join(RAIZ, "dist", "jofemesa-core.zip");

function recorrer(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? recorrer(p) : [p];
  });
}

const archivos = recorrer(join(ORIGEN, "jofemesa-core")).sort();
const locales = [];
const central = [];
let desplazamiento = 0;
const fechaDos = (() => {
  const d = new Date();
  const hora = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const dia = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { hora, dia };
})();

for (const ruta of archivos) {
  const nombre = Buffer.from(relative(ORIGEN, ruta).replaceAll("\\", "/"), "utf8");
  const datos = readFileSync(ruta);
  const comprimido = deflateRawSync(datos, { level: 9 });
  const crc = crc32(datos);

  const cab = Buffer.alloc(30);
  cab.writeUInt32LE(0x04034b50, 0);
  cab.writeUInt16LE(20, 4);
  cab.writeUInt16LE(0x0800, 6); // UTF-8
  cab.writeUInt16LE(8, 8);
  cab.writeUInt16LE(fechaDos.hora, 10);
  cab.writeUInt16LE(fechaDos.dia, 12);
  cab.writeUInt32LE(crc, 14);
  cab.writeUInt32LE(comprimido.length, 18);
  cab.writeUInt32LE(datos.length, 22);
  cab.writeUInt16LE(nombre.length, 26);
  cab.writeUInt16LE(0, 28);
  locales.push(cab, nombre, comprimido);

  const cen = Buffer.alloc(46);
  cen.writeUInt32LE(0x02014b50, 0);
  cen.writeUInt16LE(20, 4);
  cen.writeUInt16LE(20, 6);
  cen.writeUInt16LE(0x0800, 8);
  cen.writeUInt16LE(8, 10);
  cen.writeUInt16LE(fechaDos.hora, 12);
  cen.writeUInt16LE(fechaDos.dia, 14);
  cen.writeUInt32LE(crc, 16);
  cen.writeUInt32LE(comprimido.length, 20);
  cen.writeUInt32LE(datos.length, 24);
  cen.writeUInt16LE(nombre.length, 28);
  cen.writeUInt32LE(desplazamiento, 42);
  central.push(cen, nombre);

  desplazamiento += cab.length + nombre.length + comprimido.length;
}

const centralBuf = Buffer.concat(central);
const fin = Buffer.alloc(22);
fin.writeUInt32LE(0x06054b50, 0);
fin.writeUInt16LE(archivos.length, 8);
fin.writeUInt16LE(archivos.length, 10);
fin.writeUInt32LE(centralBuf.length, 12);
fin.writeUInt32LE(desplazamiento, 16);

mkdirSync(dirname(DESTINO), { recursive: true });
writeFileSync(DESTINO, Buffer.concat([...locales, centralBuf, fin]));
console.log(`${relative(RAIZ, DESTINO)} · ${archivos.length} archivos · ${(statSync(DESTINO).size / 1024).toFixed(0)} KB`);
