# JOFEMESA · web nueva

Web de alquiler y venta de maquinaria para JOFEMESA (JOFEME S.A.). Next.js 16,
React 19, Tailwind v4, TypeScript. En español, con la estructura preparada para
añadir `/en/` sin reescribir componentes.

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # tipos + lint + validación del catálogo + pruebas
npm run build    # compilación de producción
```

---

## Lo primero que hay que saber

**Esta web no cobra nada.** No hay pasarela de pago, ni carrito de compra, ni se
piden datos bancarios en ningún sitio. Todos los caminos terminan en el mismo
formulario: *Consultar disponibilidad*. El precio final depende del transporte,
de la duración y de la disponibilidad real de cada delegación, así que lo
confirma una persona.

**Los datos que no tenemos no se inventan.** Es la regla que estructura todo el
proyecto, no una buena intención. Cada especificación técnica del catálogo lleva
su estado de verificación:

| Estado | De dónde sale | Cómo se ve en la web |
|---|---|---|
| `conf(...)` | Transcrito de la ficha técnica en PDF que sirve jofemesa.com | La cifra, tal cual |
| `est(...)` | Catálogo público del fabricante, sin confirmar contra la unidad de flota | La cifra con subrayado ámbar y una nota al pasar por encima |
| `pend(...)` | No lo sabemos | Una etiqueta **Pendiente**, nunca un número |
| `na()` | No aplica a ese tipo de máquina | Una raya |

Los filtros y el asesor **solo leen `conf` y `est`**. Una máquina sin altura
confirmada queda fuera del filtro de altura en lugar de colarse con un cero, y
el estado vacío lo explica. La lista completa de lo que falta está en
`/admin/datos-pendientes`.

---

## Estado del catálogo

67 máquinas. 254 especificaciones transcritas de fichas técnicas reales
descargadas de su propio servidor, 32 máquinas con su PDF adjunto.

Las 28 plataformas de tijera (Genie, JLG y Haulotte) están transcritas a mano
desde los nueve PDF que ellos publican; el resto del catálogo entra con
especificaciones de catálogo de fabricante, marcadas como tales.

**Dos ficheros de ficha estaban mal nombrados en su servidor:** los PDF de la
serie ES y de los modelos 3394RT/4394RT llevan el copyright y las designaciones
de **JLG**, no de Genie ni de Haulotte. Se ha respetado lo que dice el
documento. Conviene confirmarlo con el cliente.

---

## Fotografía

**Las fotos que se ven hoy son de referencia, no del modelo exacto.** Son 57
imágenes de licencia libre descargadas de Wikimedia Commons con
`scripts/descargar-fotos.mjs`, asignadas por subcategoría con un reparto
determinista (`src/lib/catalog/fotos.ts`), de forma que cada máquina recibe
siempre la misma. Cada tarjeta y cada ficha lo dice con una etiqueta *Foto de
referencia*, y `/creditos-imagen` lista autoría y licencia de todas — lo cual
no es un extra: las licencias Creative Commons **obligan** a citar.

Están puestas porque la web es un catálogo y sin volumen real de imagen no se
puede juzgar la maquetación. Tres avisos antes de publicar:

1. **No son del modelo exacto.** Una GS-1932 puede estar ilustrada con la foto
   de otra tijera. Para producción no sirve.
2. **Varias llevan rótulos de otras empresas** visibles en la propia foto
   (empresas de alquiler, ferias). Es motivo suficiente para sustituirlas.
3. La capa provisional **cede el paso sola**: en cuanto una máquina tiene
   `imagenes` rellenas, esas manda y la de referencia desaparece, sin tocar
   maquetación.

La decisión acordada sigue siendo **fotografía oficial de fabricante**, que es
la práctica del sector. El motivo de fondo no ha cambiado: todo el banco de
imágenes de jofemesa.com es demasiado pequeño para una web visual —de 360×256
a 1600×1000, la mayoría en torno a 600×430— y su
`resize_image.php?…&new_width=1600` **reescala hacia arriba**, devolviendo un
fichero de 245 KB sin un píxel más de información que el original.

> La fotografía de producto de Genie, JLG, Haulotte, Manitou, Takeuchi,
> Jungheinrich, Volvo y Bomag tiene derechos de autor. JOFEMESA es partner
> oficial de Jungheinrich y propietaria de flota de las demás marcas,
> situación en la que los fabricantes suelen dar acceso a su portal de medios
> para distribuidores y alquiladores. **Hay que pedir ese acceso o la
> autorización antes de publicar.**

Cero fotografía de stock genérica: foto del fabricante del modelo exacto, foto
propia de JOFEMESA, o silueta técnica.

---

## Rendimiento: dev no es producción

Si al navegar parece que la web tarda, mide antes de tocar nada. La diferencia
entre los dos modos es de dos órdenes de magnitud, y es toda de `next dev`,
que compila cada ruta la primera vez que se pide:

| Ruta | `next dev` | `next build && next start` |
|---|---|---|
| `/` | 495 ms | 17 ms |
| `/alquiler` | 600 ms | 27 ms |
| `/maquina/[slug]` | 2 265 ms | 9 ms |
| `/comparador` | 332 ms | 19 ms |

Para valorar velocidad, siempre compilación de producción. Aun así se ha
añadido `BarraProgreso`: un filete rojo de 2px en el borde superior mientras
navega. No acelera nada — hace que la espera sea legible, que es lo que evita
que el usuario vuelva a pulsar y la haga más lenta de verdad.

---

## Movimiento

Un solo `IntersectionObserver` global (`MotorRevelado`) observa todo lo que
lleve `data-revelar`. La consecuencia buena es que **un componente de servidor
se anima añadiendo un atributo**, sin convertirse en componente de cliente ni
mandar su HTML al navegador como JavaScript. `data-escalonar` en un contenedor
reparte el retardo entre sus hijos, con tope de 6.

La regla dura de accesibilidad se mantiene: el CSS que oculta los elementos
cuelga de `html[data-motor]`, y ese atributo **solo lo pone el JavaScript**.
Sin JS, con JS caído o con un rastreador leyendo, la página se sirve entera y
visible. Con `prefers-reduced-motion` no se registra observador ni atributo:
se ve igual de completa, solo que de golpe.

Duraciones por clase, no una sola cifra: acuse de recibo ≤100 ms, estado de
interfaz 150–200 ms, entrada de modal 260 ms, salida 180 ms, revelado de
sección 450 ms. Solo se animan `transform` y `opacity`.

---

## Los formularios, sin backend

`Consultar disponibilidad` usa una Server Action con validación `zod`
compartida entre cliente y servidor. Las solicitudes van a sumideros
enchufables:

| Sumidero | Cuándo se activa | Qué hace |
|---|---|---|
| Consola | Siempre | Imprime la solicitud formateada en la terminal |
| Fichero | Siempre | Añade una línea a `.data/solicitudes.jsonl` (ignorado por git) |
| Webhook | Si existe `LEADS_WEBHOOK_URL` | Envía la solicitud como JSON |

**Sin variables de entorno configuradas, nada se manda por correo.** Las
solicitudes se guardan en local y se ven en `/admin/solicitudes`, que es la
página que se le enseña al cliente para demostrar que la captura funciona de
verdad. Salir a producción es añadir la variable, no reescribir código.

El formulario es un `<form action={…}>` de verdad, así que se envía y se valida
**con JavaScript desactivado**. Antispam sin terceros: campo trampa oculto y
descarte de envíos en menos de tres segundos. Sin CAPTCHA, porque cuesta
conversiones.

El CIF se valida con su dígito de control real, pero **avisa en vez de
bloquear**: rechazar un lead auténtico por un dígito es peor que aceptar un CIF
mal escrito.

---

## Las cuatro funcionalidades

**¿Qué máquina necesito?** (`/asesor`, y empotrado en la portada). Tres
preguntas, y la segunda cambia según la primera. Cada una con un *No lo sé* que
ensancha en vez de bloquear. Dos etapas: eliminación dura y después puntuación
relativa al mejor candidato. Cada resultado muestra hasta tres razones en
español llano, nunca una puntuación. La salida es **el mismo objeto de filtros**
que usa el catálogo, así que termina con un enlace a `/alquiler?…`. Las
respuestas viven en la URL: el botón atrás recorre el asistente y el resultado
se puede compartir y medir como paso de embudo en Ads.

**Comparador** (`/comparador?m=a,b,c`). La bandeja vive en el layout, así que
sobrevive a la navegación, y usa `localStorage` con hidratación diferida para
evitar el desajuste servidor/cliente. La página, en cambio, lee de la URL: la
bandeja es efímera, la comparación es enlazable. Primera columna fija,
`scroll-snap` por columna en móvil, marca **Máx.**/**Mín.** con subrayado y
palabra, interruptor de *solo diferencias* y hoja de impresión A4 apaisada.

**Filtros** (`/alquiler`). Familia, subcategoría, altura, alimentación, uso y
delegación, todo sincronizado con la URL vía `nuqs` en modo `shallow`: el
filtrado es instantáneo en memoria y la URL queda compartible. Las opciones con
cero resultados se **deshabilitan en gris, no se eliminan**. Sin resultados,
ofrece quitar los filtros que más excluyen — probando también pares, porque hay
combinaciones donde quitar uno solo no basta. En móvil, hoja inferior con
casillas cuadradas de 24 px y el contador como botón (*Ver 24 máquinas*).

**Ficha interactiva.** Un único componente de servidor sirve a la vez la página
rastreable `/maquina/[slug]` y el modal interceptado. Al pulsar una tarjeta el
modal se abre encima sin desmontar el listado; al recargar, pegar la URL o
entrar un rastreador, se sirve la página completa. Usa el `<dialog>` nativo, así
que la trampa de foco, el `Escape` y el fondo inerte son del navegador.

---

## Diseño

**El espaciado se ha ceñido a la mitad.** El padding de sección era
80/128/192px, siguiendo el cine editorial que pide `gpt-taste`. En un catálogo
eso es un error: si una sección no cabe de un vistazo hay que scrollear a
ciegas, y la comparación entre tarjetas —que es el trabajo de la página— se
rompe. Ahora es 56/72/88px, y ninguna sección de la portada pasa de 1,06
pantallas a 1440×900. El aire se gana con filetes y jerarquía tipográfica, no
con vacío.

El hero ocupa exactamente `100svh` menos la cabecera —y menos la barra fija en
móvil—, así que titular, buscador y las dos salidas entran sin scroll. `svh` y
no `vh`: con `vh`, en móvil el navegador cuenta su propia barra como retraída
y el CTA acaba cortado justo en el vistazo que decide el primer clic.

Sistema **PLACA**: la placa de características del chasis a escala de web. Radio
cero en todo (la escala de Tailwind está anulada a `0px` para que no se cuele
ninguna esquina redondeada), filetes de 1 px en lugar de sombras, cuatro puntos
de ruptura exactos (375 / 768 / 1024 / 1440) y cifras siempre en versalitas
tabulares.

Un solo acento: el rojo JOFEMESA **#E30613**, que mide 4,88:1 sobre blanco. El
rojo puro del logotipo (#FF0000) mide 4,00:1 y no llega al mínimo, así que se
usa **solo en el logotipo**, aislado arriba a la izquierda y nunca en el mismo
campo visual que el rojo de interfaz. El ámbar #EFBB20 de su web actual mide
1,78:1 sobre blanco: sobrevive únicamente como fondo de chip y como filete de
seguridad. `npm run` no lo comprueba, pero `scripts/contraste.mjs` sí.

Tipografía Geist Sans + Geist Mono, autoalojadas. Títulos en caja baja; las
mayúsculas quedan enteramente para las etiquetas de dato en mono.

---

## Scripts

| Script | Para qué |
|---|---|
| `npm run check` | Tipos, lint, validación del catálogo y pruebas |
| `npm test` | 56 aserciones sobre filtros, asesor, comparador y formulario |
| `PUERTO=4477 node scripts/verificar-servidor.mjs` | 52 comprobaciones del HTML servido. **Contra una compilación de producción**, no contra `dev`: en `dev` todo se renderiza dinámicamente y pasan comprobaciones que en producción no se cumplirían |
| `node scripts/descargar-fotos.mjs` | Rellena `public/img/maquinas/` con fotografía de referencia de Wikimedia Commons y escribe `data/fotos-provisionales.json` |
| `node scripts/contraste.mjs` | Contrastes WCAG de la paleta |
| `npm run catalogo:validar` | Corre en `prebuild`: para la compilación si hay un slug duplicado, un PDF o una imagen que no existen, un `alt` vacío o una spec sin definición |
| `node scripts/convertir-catalogo.mjs` | Regenera `maquinas-catalogo.ts` |
| `node scripts/extraer-fichas.mjs` | Vuelca el texto de los PDF a `data/raw/fichas/` |
| `node scripts/preparar-logo.mjs` | Recorta a transparente el fondo blanco del logotipo |

---

## Pendiente antes de publicar

1. **Autorización de imagen de los fabricantes.** Bloqueante. Hoy hay 57
   fotos de referencia de licencia libre haciendo su papel, ninguna del modelo
   exacto y algunas con rótulos de terceros. Ver `/creditos-imagen`.
2. **Logotipo en SVG.** El PNG que sirven no tiene canal alfa; este proyecto le
   recorta el fondo con un script, pero lo correcto es el vectorial.
3. **Certificados ISO.** Los enlaces de su web
   (`/images/certifications/*.pdf`) devuelven una página HTML vacía con código
   200. Hacen falta los documentos reales.
4. **Horarios de las delegaciones.** No están publicados en ninguna parte, así
   que la web dice *llama y te lo confirmamos* en vez de inventarlos.
5. **Delegación de Portugal.** Su blog anuncia la expansión en noviembre de 2024
   pero no da ciudad, dirección ni teléfono.
6. **Teléfono de Valladolid.** Su web da dos números distintos.
7. **Número de WhatsApp Business** para la barra móvil.
8. **Registro Mercantil.** Su propio aviso legal publica esos campos en blanco.
9. **Consentimiento de cookies.** Hoy la web no instala ninguna cookie de
   seguimiento y la política lo dice. En el momento en que se añada Analytics,
   Ads o Meta Pixel, hace falta un banner real con bloqueo previo.
10. **Noticias.** Fuera de esta entrega. Su blog tiene ~267 entradas reales
    (activo hasta enero de 2025) y es un activo aprovechable: la ruta está
    reservada. Lo que está roto hoy es la URL `/noticias` de su menú, que
    devuelve una página en blanco; el contenido vive en `/blogs/`.
