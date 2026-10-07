// Comprobaciones sobre el HTML REALMENTE servido.
//
// Contra una compilación de producción, no contra `next dev`: en dev todo
// se renderiza dinámicamente y pasan comprobaciones que en producción no
// se cumplirían.
//
//   npm run build && npm start
//   PUERTO=3000 node scripts/verificar-servidor.mjs
//
// El puerto cambia en cada arranque (autoPort). Se pasa por variable o
// argumento: PUERTO=4321 node scripts/verificar-servidor.mjs
const PUERTO = process.env.PUERTO ?? process.argv[2] ?? "3000";
const BASE = `http://localhost:${PUERTO}`;
const pruebas = [];
const t = (d, c) => pruebas.push({ d, c });

async function html(ruta) {
  const r = await fetch(BASE + ruta);
  return {
    estado: r.status,
    cuerpo: await r.text(),
    tipo: r.headers.get("content-type"),
  };
}
const cuenta = (s, re) => (s.match(re) || []).length;

/* ============================================================
   1 · La ficha, rastreable y con datos del catálogo del cliente
   ============================================================ */

let p = await html("/maquina/genie-gs-4390");
t("la ficha responde 200", p.estado === 200);
t("un solo <h1> en la ficha", cuenta(p.cuerpo, /<h1[\s>]/g) === 1);
t("la ficha lleva la altura del catálogo (15 m)", p.cuerpo.includes("15"));
t("la ficha lleva el peso del catálogo (5.973)", p.cuerpo.includes("5.973"));
t("la ficha lleva la carga del catálogo (680)", p.cuerpo.includes("680"));
t(
  "la ficha ofrece el PDF que entregó el cliente",
  p.cuerpo.includes("/fichas/genie-gs-4390.pdf"),
);
t(
  "la ficha enseña la foto oficial de JOFEMESA",
  p.cuerpo.includes("oficial/completa/genie-gs-4390.webp"),
);
t("la ficha lleva JSON-LD de Product", p.cuerpo.includes('"@type":"Product"'));
t("el JSON-LD es de arrendamiento", p.cuerpo.includes("LeaseOut"));
t("el JSON-LD NO lleva AggregateRating", !p.cuerpo.includes("AggregateRating"));
t("el JSON-LD no lleva precio", !/"price"\s*:/.test(p.cuerpo));
t(
  "la ficha enlaza a consultar disponibilidad",
  p.cuerpo.includes("/consultar-disponibilidad?m=genie-gs-4390"),
);

/* ============================================================
   2 · El PDF se descarga de verdad y pesa lo declarado
   ============================================================ */

const pdf = await fetch(BASE + "/fichas/genie-gs-4390.pdf");
const buf = Buffer.from(await pdf.arrayBuffer());
t("el PDF responde 200", pdf.status === 200);
t("el PDF es un PDF de verdad", buf.subarray(0, 4).toString() === "%PDF");
t("el PDF pesa lo declarado", buf.length === 713898);

/* ============================================================
   3 · Lo que no sabemos se marca, no se inventa
   ============================================================ */

p = await html("/maquina/jungheinrich-maquinas-de-almacen");
t("una gama del catálogo responde 200", p.estado === 200);
t("la gama se anuncia como gama", p.cuerpo.includes("gama"));
t("una spec pendiente se marca como pendiente", p.cuerpo.includes("Pendiente"));

p = await html("/maquina/genie-z-80-60");
t(
  "un dato dudoso del catálogo sale marcado y explicado",
  p.cuerpo.includes("7.530") &&
    p.cuerpo.includes("Confirmamos el peso real de transporte"),
);

/* ============================================================
   4 · Catálogo
   ============================================================ */

p = await html("/alquiler?energia=electrico&hmin=6&hmax=10");
t("el catálogo filtrado responde 200", p.estado === 200);
t(
  "el catálogo servido trae producto de verdad, no un esqueleto",
  cuenta(p.cuerpo, /<article/g) >= 20,
);
t("un solo <h1> en el catálogo", cuenta(p.cuerpo, /<h1[\s>]/g) === 1);
t(
  "el catálogo anuncia las 145 referencias",
  p.cuerpo.includes("145"),
);

/* ============================================================
   5 · Las seis familias, cada una con su URL de campaña
   ============================================================ */

for (const [slug, marca] of [
  ["elevacion", "con la solución adecuada bajo tus pies"],
  ["manutencion", "Mover más"],
  ["movimiento-tierras", "Primero hay que mover tierra"],
  ["energia", "Si no hay red"],
  ["aire-martillos", "aire, presión"],
  ["herramienta-auxiliar", "no todo el trabajo pesa toneladas"],
]) {
  const q = await html(`/alquiler/${slug}`);
  t(`/alquiler/${slug} responde 200`, q.estado === 200);
  t(`/alquiler/${slug} lleva su claim`, q.cuerpo.includes(marca));
  t(`/alquiler/${slug} tiene un solo h1`, cuenta(q.cuerpo, /<h1[\s>]/g) === 1);
}

/* ============================================================
   6 · Comparador desde la URL
   ============================================================ */

p = await html("/comparador?m=genie-gs-4390,haulotte-hs18-e-pro");
t("el comparador responde 200", p.estado === 200);
t(
  "el comparador enseña las dos máquinas",
  p.cuerpo.includes("GS-4390") && p.cuerpo.includes("HS18 E PRO"),
);
t("el comparador marca el máximo", p.cuerpo.includes("Máx."));
t(
  "el comparador ya no ofrece «solo diferencias»: pedido del cliente, vista simple",
  !p.cuerpo.includes("Solo mostrar diferencias"),
);
t(
  "se puede añadir otra máquina desde el comparador",
  p.cuerpo.includes("Añadir máquina a la comparación"),
);

/* ============================================================
   7 · Asesor, con y sin respuestas
   ============================================================ */

p = await html("/asesor");
t("el asesor responde 200", p.estado === 200);
t(
  "el asesor arranca con los tres selectores",
  cuenta(p.cuerpo, /<select/g) >= 3,
);
p = await html("/asesor?trabajo=altura&parametro=h-10&entorno=interior-limpio");
t(
  "el asesor resuelve desde la URL",
  p.cuerpo.includes("Esto es lo que te encaja"),
);
t("el resultado da razones en español", p.cuerpo.includes("sin humos"));

/* ============================================================
   8 · Formulario
   ============================================================ */

p = await html("/consultar-disponibilidad?m=genie-gs-4390");
t("el formulario responde 200", p.estado === 200);
t("el formulario precarga la máquina", p.cuerpo.includes("GS-4390"));
t("el formulario pide consentimiento", p.cuerpo.includes("consentimiento"));
t(
  "el formulario deja elegir delegación",
  p.cuerpo.includes("Delegación de referencia"),
);
t(
  "el formulario dice que no hay pago",
  p.cuerpo.includes("sin pago online") ||
    p.cuerpo.includes("Sin compromiso y sin pago"),
);

/* ============================================================
   9 · La arquitectura que salió de la reunión
   ============================================================ */

for (const [ruta, marca] of [
  ["/", "para que tu obra no se pare"],
  ["/servicios", "partner oficial de Jungheinrich"],
  ["/delegaciones", "delegaciones propias"],
  ["/contacto", "Hablas con la delegación"],
  ["/admin/datos-pendientes", "Datos pendientes"],
  ["/aviso-legal", "JOFEME"],
  ["/cookies", "no instala ninguna cookie"],
]) {
  const q = await html(ruta);
  t(`${ruta} responde 200`, q.estado === 200);
  t(`${ruta} tiene su contenido`, q.cuerpo.includes(marca));
  t(`${ruta} tiene un solo h1`, cuenta(q.cuerpo, /<h1[\s>]/g) === 1);
}

// Noticias está apagado de momento (src/lib/modulos.ts): ni página ni enlace.
{
  const q = await html("/noticias");
  t("/noticias responde 404 mientras el módulo esté apagado", q.estado === 404);
  const portada = await html("/");
  t("la portada no enlaza a /noticias", !portada.cuerpo.includes('href="/noticias"'));
}

// Servicios lleva los cuatro bloques, en el orden que se acordó.
p = await html("/servicios");
const orden = ["venta", "mantenimiento", "transporte", "formacion"].map((id) =>
  p.cuerpo.indexOf(`id="${id}"`),
);
t("servicios tiene los cuatro bloques", orden.every((i) => i > 0));
t(
  "servicios los ordena venta → mantenimiento → transporte → formación",
  orden[0] < orden[1] && orden[1] < orden[2] && orden[2] < orden[3],
);
t(
  "cada bloque de servicios lleva su call to action",
  cuenta(p.cuerpo, /consultar-disponibilidad\?asunto=/g) >= 3 &&
    p.cuerpo.includes('href="/formacion#calendario"'),
);

// Las delegaciones de Portugal, que su web actual no publica.
p = await html("/delegaciones");
t("delegaciones publica Oporto", p.cuerpo.includes("Vila Nova de Gaia"));
t("delegaciones publica Lisboa", p.cuerpo.includes("Quinta do Anjo"));
t(
  "delegaciones da los diez teléfonos",
  cuenta(p.cuerpo, /href="tel:/g) >= 10,
);
t(
  "no se inventa un horario",
  p.cuerpo.includes("te confirmamos el horario"),
);

/* ============================================================
   10 · Las URL que se enseñaron al cliente siguen vivas
   ============================================================ */

for (const [vieja, nueva] of [
  ["/venta", "/servicios#venta"],
  ["/mantenimiento", "/servicios#mantenimiento"],
  ["/alquiler/compactacion", "/alquiler/movimiento-tierras"],
  ["/alquiler/manipulacion", "/alquiler/manutencion"],
]) {
  const r = await fetch(BASE + vieja, { redirect: "manual" });
  t(
    `${vieja} redirige a ${nueva}`,
    (r.status === 308 || r.status === 301) &&
      r.headers.get("location") === nueva,
  );
}

/* ============================================================
   10b · Entrega del 28/09/2026
   ============================================================ */

p = await html("/formacion");
t("/formacion responde 200", p.estado === 200);
t("/formacion tiene un solo h1", cuenta(p.cuerpo, /<h1[\s>]/g) === 1);
const CURSOS_DOC = {
  plataformas: "Operador de plataformas elevadoras",
  altura: "Trabajos en altura",
  confinados: "Trabajos en espacios confinados",
  andamios: "Montaje y desmontaje de andamios de torre móvil",
  carretillas: "Operador de carretillas elevadoras",
  ipaf: "Programa de formación IPAF",
  "movimiento-de-tierras": "movimiento de tierras",
  "carretillas-mas-10000-kg": "más de 10.000 kg",
  "gondolas-suspendidas": "góndolas suspendidas",
  "puente-grua": "puente grúa",
  "camion-pluma": "camión pluma",
  "estiba-y-eslingado": "Estiba y eslingado",
};
t("/formacion lista los doce cursos del documento", Object.values(CURSOS_DOC).every((c) => p.cuerpo.includes(c)));
t("/formacion cambia el titular del catálogo", p.cuerpo.includes("Si no encuentras el curso que necesitas, lo diseñamos exclusivamente") && !p.cuerpo.includes("Cinco cursos con convocatoria abierta"));
t("/formacion separa convocatorias abiertas y resto de cursos", p.cuerpo.includes("Convocatorias abiertas") && p.cuerpo.includes("Resto de cursos"));
t("/formacion pone los datos de autoridad debajo de la cabecera", p.cuerpo.indexOf('aria-label="Formación certificada"') > p.cuerpo.indexOf("<h1") && p.cuerpo.includes("AENOR") && p.cuerpo.includes("Bureau Veritas"));
t("/formacion trae el calendario en el HTML", cuenta(p.cuerpo, /Solicitar plaza/g) >= 20);
t("/formacion enlaza a Maps con los enlaces del Excel", p.cuerpo.includes("maps.app.goo.gl/rEFVwDXHP6VVntpP7"));
t("/formacion ya no dice «Consultar plazas»", !p.cuerpo.includes("Consultar plazas"));
t("cada convocatoria abre la información del curso", cuenta(p.cuerpo, /Ver información del curso/g) >= 20 && p.cuerpo.includes('href="/formacion/cursos/plataformas"'));
t("«Solicitar plaza» va al formulario de formación", p.cuerpo.includes("/formacion/solicitar?convocatoria=") && !p.cuerpo.includes("asunto=formacion"));

for (const [id, texto] of Object.entries(CURSOS_DOC)) {
  const c = await html(`/formacion/cursos/${id}`);
  t(`/formacion/cursos/${id} tiene página propia`, c.estado === 200 && cuenta(c.cuerpo, /<h1[\s>]/g) === 1 && c.cuerpo.toLowerCase().includes(texto.toLowerCase()) && c.cuerpo.includes("¿Quién necesita esta formación?"));
}
p = await html("/formacion/cursos/plataformas");
t("la ficha del curso trae el texto del documento", p.cuerpo.includes("certificado por AENOR en la Norma UNE 58923") && p.cuerpo.includes("barbuquejo"));
t("la ficha del curso enlaza al calendario", p.cuerpo.includes("calendario de convocatorias abiertas"));
t("un curso inexistente da 404", (await html("/formacion/cursos/no-existe")).estado === 404);

p = await html("/formacion/solicitar?convocatoria=2026-12-14-carretillas-sagunto");
t("el formulario de formación responde 200", p.estado === 200);
t("el formulario de formación es distinto del de alquiler", p.cuerpo.includes('name="alumnos"') && p.cuerpo.includes('name="convocatoria"') && !p.cuerpo.includes('name="provincia"') && !p.cuerpo.includes('name="fechaInicio"'));
t("el formulario de formación llega con la convocatoria elegida", p.cuerpo.includes('value="2026-12-14-carretillas-sagunto" selected') || p.cuerpo.includes('selected="" value="2026-12-14-carretillas-sagunto"'));
p = await html("/formacion");
t("«¿No está tu curso?» abre el formulario con «Otro curso» elegido", p.cuerpo.includes('href="/formacion/solicitar?curso=otro"'));
p = await html("/formacion/solicitar?curso=otro");
t("con «Otro curso» el formulario pide describir la formación", p.cuerpo.includes('name="cursoMedida"') && p.cuerpo.includes('name="lugar"') && !p.cuerpo.includes('name="convocatoria"'));
p = await html("/formacion/solicitar?curso=puente-grua");
t("un curso a medida pide dónde formarse", p.cuerpo.includes('name="lugar"') && !p.cuerpo.includes('name="convocatoria"'));
{
  const r = await fetch(BASE + "/consultar-disponibilidad?asunto=formacion", { redirect: "manual" });
  t("el enlace antiguo de formación redirige al formulario nuevo", [303, 307, 308].includes(r.status) && (r.headers.get("location") ?? "").includes("/formacion/solicitar"));
}
p = await html("/consultar-disponibilidad");
t("el formulario de alquiler sigue pidiendo obra y fechas", p.cuerpo.includes('name="provincia"') && p.cuerpo.includes('name="fechaInicio"'));

p = await html("/");
t("el menú principal lleva Formación", p.cuerpo.includes('href="/formacion"'));
t("el hero tiene las dos portadas", p.cuerpo.includes("Alquiler de maquinaria para que tu obra no se pare") && p.cuerpo.includes("Formación de operadores para trabajar seguro"));
t("la portada sigue con un solo h1", cuenta(p.cuerpo, /<h1[\s>]/g) === 1);
t("el pie enlaza a LinkedIn, Facebook e Instagram", [
  "https://www.linkedin.com/company/jofemesa/",
  "https://www.facebook.com/Jofemesaempresa",
  "https://www.instagram.com/jofemesaempresa/",
].every((u) => p.cuerpo.includes(`href="${u}"`)) && !p.cuerpo.includes("lipi="));
t("el rótulo dice «Nuestros fabricantes»", p.cuerpo.includes("Nuestros fabricantes") && !p.cuerpo.includes("Fabricantes de la flota"));

p = await html("/delegaciones");
t("Castellón ya no figura", !p.cuerpo.includes("Castellón") && !p.cuerpo.includes("Almassora"));
t("la sede de Formación figura como sede", p.cuerpo.includes('id="formacion"') && p.cuerpo.includes("formacion@jofemesa.com"));

for (const slug of ["genie-z-34-22-rt", "haulotte-ha15-ip", "jlg-e600sjp", "genie-z-45-fe", "jlg-1250-ajp"]) {
  const m = await html(`/maquina/${slug}`);
  t(`los brazos articulados ya tienen foto y ficha: ${slug}`, m.estado === 200 && m.cuerpo.includes(`oficial/completa/${slug}.webp`) && m.cuerpo.includes(`/fichas/${slug}.pdf`));
}
t("la ficha de la HA15 IP se descarga", (await fetch(BASE + "/fichas/haulotte-ha15-ip.pdf")).status === 200);
t("los nombres viejos ya no existen", (await html("/maquina/haulotte-ha-15tp")).estado === 404 && (await html("/maquina/jlg-e600jp")).estado === 404);
p = await html("/maquina/jlg-nano-sp-plus");
t("las columnas verticales ya tienen foto completa", p.cuerpo.includes("oficial/completa/jlg-nano-sp-plus.webp"));
t("no queda ninguna foto recortada", !p.cuerpo.includes("oficial/tarjeta/") && !p.cuerpo.includes("oficial/recorte/"));

/* ============================================================
   11 · Lo que el cliente dijo que NO se puede publicar
   ============================================================ */

const rutasRevisadas = [
  "/",
  "/alquiler",
  "/alquiler/elevacion",
  "/servicios",
  "/delegaciones",
  "/contacto",
  "/asesor",
];
const prohibido = [
  // Jorge desmintió por teléfono que la flota sea nueva.
  /flota\s+nueva/i,
  /maquinaria\s+moderna/i,
  /continua?\s+renovaci/i,
  // Rotulación de empresas de alquiler de la competencia que llevaban
  // las fotos de Wikimedia que se han retirado.
  /wikimedia/i,
  /sunbelt/i,
  /skyjack/i,
];
for (const ruta of rutasRevisadas) {
  const q = await html(ruta);
  for (const re of prohibido)
    t(`${ruta} no dice ${re}`, !re.test(q.cuerpo));
}

/* ============================================================
   12 · Las tres páginas interactivas, DENTRO del HTML servido
   ============================================================

   Las tres leen la URL. Cuando la leía el cliente con nuqs hacía falta
   una frontera de Suspense, y Next servía el contenido dentro de un
   `<div hidden>` detrás del pie con un recuadro gris en su sitio: sin
   JavaScript no había ni formulario, ni comparación, ni asistente. Ahora
   los parámetros los lee el servidor y bajan como props. Esto lo vigila.
*/

const RECUADRO_MUERTO = /border border-rule bg-sunken" \/>/;

const form = await html("/consultar-disponibilidad?m=genie-gs-4390");
t(
  "el formulario va en el HTML servido",
  /<form/.test(form.cuerpo) &&
    form.cuerpo.indexOf("<form") < form.cuerpo.indexOf("Todos los derechos"),
);
t(
  "el formulario precarga la máquina de ?m= en servidor",
  form.cuerpo.includes('name="maquinas" value="genie-gs-4390"'),
);
t(
  "el formulario no sirve un recuadro gris en su sitio",
  !RECUADRO_MUERTO.test(form.cuerpo),
);

const comp = await html("/comparador?m=genie-gs-4390,genie-gs-5390");
t(
  "el comparador sirve la tabla con las dos máquinas",
  comp.cuerpo.includes("GS-4390") && comp.cuerpo.includes("GS-5390"),
);
t(
  "el comparador no sirve un recuadro gris en su sitio",
  !RECUADRO_MUERTO.test(comp.cuerpo),
);

const ases = await html("/asesor");
t("el asesor sirve los tres selectores", cuenta(ases.cuerpo, /<select/g) === 3);
t(
  "el asesor no sirve un recuadro gris en su sitio",
  !RECUADRO_MUERTO.test(ases.cuerpo),
);
const asesHecho = await html(
  "/asesor?trabajo=altura&parametro=8-12&entorno=interior-limpio",
);
t(
  "el asesor resuelve en servidor un enlace con las tres respuestas",
  /Esto es lo que te encaja/.test(asesHecho.cuerpo),
);

/* La tercera pregunta ya no espera a la segunda: son tres selectores en
   una pantalla, no un asistente encadenado. */
t(
  "la tercera pregunta del asesor no está bloqueada",
  !/Contesta primero la exigencia/.test(ases.cuerpo),
);

/* ============================================================
   13 · La estética acordada
   ============================================================

   Tres decisiones de la revisión posterior que es fácil deshacer sin
   darse cuenta, así que quedan ancladas aquí.
*/

const port = await html("/");

/* Las tipografías son las de la versión de Emilio. Si alguien vuelve a
   Montserrat extrabold, esto lo dice. */
t(
  "la portada carga Archivo y Plus Jakarta Sans",
  /archivo/i.test(port.cuerpo) && /jakarta/i.test(port.cuerpo),
);

/* Las distribuciones oficiales van EN LA PORTADA, no enterradas en la
   sección de autoridad: es el argumento que un competidor no copia. */
t(
  "la portada rotula el partner oficial de Jungheinrich",
  /Partner oficial/i.test(port.cuerpo) && /Jungheinrich/.test(port.cuerpo),
);
t(
  "la portada rotula la distribución oficial de Takeuchi",
  /Distribuidor oficial/i.test(port.cuerpo) && /Takeuchi/.test(port.cuerpo),
);

/* La tarjeta lleva etiqueta de alimentación: es el dato que decide un
   alquiler antes que la altura. */
const cat = await html("/alquiler");
t(
  "las tarjetas del catálogo llevan etiqueta de alimentación",
  /Eléctrico|Híbrido|Diésel/.test(cat.cuerpo),
);

/* ============================================================
   14 · 404 real
   ============================================================ */

const nada = await fetch(BASE + "/maquina/no-existe-esta-maquina");
t("un slug inexistente devuelve 404", nada.status === 404);
const nadaFam = await fetch(BASE + "/alquiler/no-existe-esta-familia");
t("una familia inexistente devuelve 404", nadaFam.status === 404);

const malos = pruebas.filter((x) => !x.c);
console.log(
  `\n${pruebas.length - malos.length}/${pruebas.length} comprobaciones de servidor correctas`,
);
if (malos.length) {
  console.error("\nFALLOS:");
  malos.forEach((x) => console.error("  ✗ " + x.d));
  process.exit(1);
}
console.log("Servidor en verde.\n");
