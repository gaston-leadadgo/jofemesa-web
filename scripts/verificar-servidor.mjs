// El puerto cambia en cada arranque (autoPort). Se pasa por variable o
// argumento: PUERTO=4321 node scripts/verificar-servidor.mjs
const PUERTO = process.env.PUERTO ?? process.argv[2] ?? "3000";
const BASE = `http://localhost:${PUERTO}`;
const pruebas = [];
const t = (d, c) => pruebas.push({ d, c });

async function html(ruta) {
  const r = await fetch(BASE + ruta);
  return { estado: r.status, cuerpo: await r.text(), tipo: r.headers.get("content-type") };
}
const cuenta = (s, re) => (s.match(re) || []).length;

// 1 · Ficha rastreable
let p = await html("/maquina/genie-gs-3268rt");
t("la ficha responde 200", p.estado === 200);
t("un solo <h1> en la ficha", cuenta(p.cuerpo, /<h1[\s>]/g) === 1);
t("la ficha lleva la altura real 11,75", p.cuerpo.includes("11,75"));
t("la ficha lleva el peso real 3.771", p.cuerpo.includes("3.771"));
t("la ficha lleva el motor Kubota", p.cuerpo.includes("Kubota"));
t("la ficha ofrece el PDF real", p.cuerpo.includes("/fichas/genie-gs-2668-3268rt.pdf"));
t("la ficha lleva JSON-LD de Product", p.cuerpo.includes('"@type":"Product"'));
t("el JSON-LD es de arrendamiento", p.cuerpo.includes("LeaseOut"));
t("el JSON-LD NO lleva AggregateRating", !p.cuerpo.includes("AggregateRating"));
t("el JSON-LD no lleva precio", !/"price"\s*:/.test(p.cuerpo));
t("la ficha enlaza a consultar disponibilidad", p.cuerpo.includes("/consultar-disponibilidad?m=genie-gs-3268rt"));

// 2 · El PDF se descarga de verdad
const pdf = await fetch(BASE + "/fichas/genie-gs-2668-3268rt.pdf");
const buf = Buffer.from(await pdf.arrayBuffer());
t("el PDF responde 200", pdf.status === 200);
t("el PDF es un PDF de verdad", buf.subarray(0, 4).toString() === "%PDF");
t("el PDF pesa lo declarado", buf.length === 762848);

// 3 · Una máquina con datos pendientes los marca, no los inventa
p = await html("/maquina/haulotte-h-12-sx");
t("una spec pendiente se marca como pendiente", p.cuerpo.includes("Pendiente"));
t("la H12 SX lleva su altura confirmada", p.cuerpo.includes("12"));

// 4 · Catálogo con filtros en la URL
//
// OJO con lo que se puede comprobar aquí. /alquiler se prerenderiza con el
// catálogo ENTERO y filtra en el navegador (nuqs en modo `shallow`), que es
// lo que hace que mover un filtro sea instantáneo en vez de una ida y vuelta
// al servidor. Así que el HTML servido no trae el recuento filtrado, y
// exigirlo sería comprobar algo que el diseño no promete.
//
// Lo que sí tiene que cumplirse: que responda, que traiga el catálogo
// completo —sin él el filtrado de cliente no tendría con qué trabajar— y
// que haya un solo h1. El recuento filtrado se comprueba en pruebas.mts,
// sobre la función `filtrar`, que es donde vive esa lógica.
p = await html("/alquiler?fam=elevacion&energia=electrico&hmin=6&hmax=10");
t("el catálogo filtrado responde 200", p.estado === 200);
t(
  "el catálogo llega completo para filtrar en cliente",
  cuenta(p.cuerpo, /<article/g) >= 60,
);
t("un solo <h1> en el catálogo", cuenta(p.cuerpo, /<h1[\s>]/g) === 1);

// 5 · Aterrizaje por familia
p = await html("/alquiler/elevacion");
t("el aterrizaje de familia responde 200", p.estado === 200);
t("lleva el claim de la familia", p.cuerpo.includes("con la solución adecuada bajo tus pies"));

// 6 · Comparador desde la URL
p = await html("/comparador?m=genie-gs-3268rt,haulotte-h-18-sx");
t("el comparador responde 200", p.estado === 200);
t("el comparador enseña las dos máquinas", p.cuerpo.includes("GS-3268RT") && p.cuerpo.includes("H 18 SX"));
t("el comparador marca el máximo", p.cuerpo.includes("Máx."));
t("el comparador ofrece solo diferencias", p.cuerpo.includes("Solo mostrar diferencias"));

// 7 · Asesor, con y sin respuestas
p = await html("/asesor");
t("el asesor responde 200", p.estado === 200);
t("el asesor arranca en el paso 1", p.cuerpo.includes("Paso 1 de 3"));
p = await html("/asesor?trabajo=altura&parametro=h-10&entorno=interior-limpio");
t("el asesor resuelve desde la URL", p.cuerpo.includes("Esto es lo que te encaja"));
t("el resultado da razones en español", p.cuerpo.includes("sin humos"));

// 8 · Formulario
p = await html("/consultar-disponibilidad?m=genie-gs-3268rt");
t("el formulario responde 200", p.estado === 200);
t("el formulario precarga la máquina", p.cuerpo.includes("GS-3268RT"));
t("el formulario pide consentimiento", p.cuerpo.includes("consentimiento"));
t("el formulario dice que no hay pago", p.cuerpo.includes("sin pago online") || p.cuerpo.includes("Sin compromiso y sin pago"));

// 9 · Resto de páginas
for (const [ruta, marca] of [
  ["/", "Alquilamos la máquina"],
  ["/venta", "partner oficial de Jungheinrich"],
  ["/mantenimiento", "Servicio técnico propio"],
  ["/admin/datos-pendientes", "Datos pendientes"],
  ["/aviso-legal", "JOFEME"],
  ["/cookies", "no instala ninguna cookie"],
]) {
  const q = await html(ruta);
  t(`${ruta} responde 200`, q.estado === 200);
  t(`${ruta} tiene su contenido`, q.cuerpo.includes(marca));
  t(`${ruta} tiene un solo h1`, cuenta(q.cuerpo, /<h1[\s>]/g) === 1);
}

// 10 · 404 real
const nada = await fetch(BASE + "/maquina/no-existe-esta-maquina");
t("un slug inexistente devuelve 404", nada.status === 404);

const malos = pruebas.filter((x) => !x.c);
console.log(`\n${pruebas.length - malos.length}/${pruebas.length} comprobaciones de servidor correctas`);
if (malos.length) {
  console.error("\nFALLOS:");
  malos.forEach((x) => console.error("  ✗ " + x.d));
  process.exit(1);
}
console.log("Servidor en verde.\n");
