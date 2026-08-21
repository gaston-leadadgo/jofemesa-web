/**
 * El logotipo que sirve jofemesa.com es un PNG de 24 bits sin canal alfa:
 * letras rojas sobre un rectángulo blanco opaco. Eso obliga a que cualquier
 * fondo detrás del logo sea blanco, lo que ata las manos al diseño.
 *
 * Este script recorta el fondo blanco a transparente conservando las
 * letras originales — no redibujamos la marca, solo le quitamos la caja.
 *
 * El SVG definitivo lo tiene que entregar el cliente; esto es el puente.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const entrada = join(raiz, "public", "marca", "logo-original.png");
const salida = join(raiz, "public", "marca", "logo.png");

/* ---------- lectura mínima de PNG ---------- */
function leerPNG(buf) {
  let p = 8;
  let w = 0,
    h = 0,
    prof = 0,
    tipo = 0;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const chunk = buf.toString("ascii", p + 4, p + 8);
    if (chunk === "IHDR") {
      w = buf.readUInt32BE(p + 8);
      h = buf.readUInt32BE(p + 12);
      prof = buf[p + 16];
      tipo = buf[p + 17];
    } else if (chunk === "IDAT") {
      idat.push(buf.subarray(p + 8, p + 8 + len));
    }
    p += 12 + len;
  }
  if (prof !== 8 || (tipo !== 2 && tipo !== 6)) {
    throw new Error(`PNG no soportado: profundidad ${prof}, tipo ${tipo}`);
  }
  const canales = tipo === 6 ? 4 : 3;
  const crudo = inflateSync(Buffer.concat(idat));
  const paso = w * canales;
  const pix = Buffer.alloc(h * paso);
  for (let y = 0; y < h; y++) {
    const filtro = crudo[y * (paso + 1)];
    const linea = crudo.subarray(y * (paso + 1) + 1, (y + 1) * (paso + 1));
    for (let x = 0; x < paso; x++) {
      const a = x >= canales ? pix[y * paso + x - canales] : 0;
      const b = y > 0 ? pix[(y - 1) * paso + x] : 0;
      const c = x >= canales && y > 0 ? pix[(y - 1) * paso + x - canales] : 0;
      let v = linea[x];
      if (filtro === 1) v += a;
      else if (filtro === 2) v += b;
      else if (filtro === 3) v += (a + b) >> 1;
      else if (filtro === 4) {
        const pa = Math.abs(b - c),
          pb = Math.abs(a - c),
          pc = Math.abs(a + b - 2 * c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      pix[y * paso + x] = v & 255;
    }
  }
  return { w, h, canales, pix };
}

function escribirPNG(w, h, rgba) {
  const paso = w * 4;
  const crudo = Buffer.alloc(h * (paso + 1));
  for (let y = 0; y < h; y++) {
    crudo[y * (paso + 1)] = 0; // sin filtro
    rgba.copy(crudo, y * (paso + 1) + 1, y * paso, (y + 1) * paso);
  }
  const comprimido = deflateSync(crudo, { level: 9 });

  const crcTabla = (() => {
    const t = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  })();
  const crc = (b) => {
    let c = -1;
    for (const byte of b) c = crcTabla[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
  const chunk = (tipo, datos) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(datos.length);
    const cuerpo = Buffer.concat([Buffer.from(tipo, "ascii"), datos]);
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc(cuerpo));
    return Buffer.concat([len, cuerpo, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", comprimido),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ---------- recorte del fondo ---------- */
const { w, h, canales, pix } = leerPNG(readFileSync(entrada));
const rgba = Buffer.alloc(w * h * 4);
let recortados = 0;

for (let i = 0, j = 0; i < pix.length; i += canales, j += 4) {
  const r = pix[i],
    g = pix[i + 1],
    b = pix[i + 2];
  rgba[j] = r;
  rgba[j + 1] = g;
  rgba[j + 2] = b;

  // El fondo es blanco puro. Cuanto más claro y menos saturado, más
  // transparente — así los bordes antialiasados no quedan con halo.
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const saturacion = max - min;
  if (saturacion < 24 && min > 200) {
    rgba[j + 3] = 0;
    recortados++;
  } else if (saturacion < 60 && min > 150) {
    rgba[j + 3] = Math.round(255 * (1 - (min - 150) / 105));
  } else {
    rgba[j + 3] = 255;
  }
}

writeFileSync(salida, escribirPNG(w, h, rgba));
console.log(
  `logo.png escrito · ${w}×${h} · ${recortados} de ${w * h} píxeles a transparente`,
);
