# JOFEMESA · web nueva

Web de alquiler, venta y mantenimiento de maquinaria para JOFEMESA
(JOFEME S.A.). Next.js 16, React 19, Tailwind v4, TypeScript. En español,
con la estructura preparada para añadir `/en/` sin reescribir componentes.

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # tipos + lint + validación del catálogo + pruebas
npm run build    # compilación de producción

# Comprobaciones sobre el HTML servido, CONTRA PRODUCCIÓN:
npm run build && npm start
PUERTO=3000 node scripts/verificar-servidor.mjs
```

---

## Qué cambió en esta entrega

Todo lo de esta sección sale de la **reunión de seguimiento del
24/08/2026** entre Emilio, Marcos y Gastón, y está implementado.

### Arquitectura

El menú pasa a **Inicio · Alquiler · Servicios · Delegaciones · Noticias
· Contacto**. Venta y mantenimiento **dejan de ser pestañas** y viven
dentro de `/servicios`, en este orden: venta → mantenimiento →
transporte → mención a formación, y **cada bloque con su propio call to
action**. Las URL antiguas (`/venta`, `/mantenimiento`) redirigen con
308, porque ya se habían enseñado al cliente.

Cada familia de maquinaria tiene **URL propia** (`/alquiler/elevacion`,
`/alquiler/manutencion`…) porque se va a hacer campaña de cada una. Las
subcategorías se quedan como filtro (`?sub=`): no habrá campaña por
subcategoría.

### Catálogo: de 67 máquinas a 145, y todas suyas

Este es el cambio de fondo. La versión anterior publicaba 67 máquinas de
las que **23 no aparecen en el catálogo del cliente** —Genie GS-1530,
GS-1930, GS-3232, la serie ES de JLG, los Haulotte Compact 8/10/12, los
H-SX, un Pramac que no distribuyen, un Hinowa que no tienen— y dejaba
fuera casi todo lo que sí alquilan.

Ahora el catálogo es una transcripción del **CATÁLOGO GENERAL DE
MAQUINARIA JOFEMESA** que entregó el cliente, tabla por tabla:

| Familia | Referencias | De dónde sale |
|---|---:|---|
| Elevación | 80 | Página 2, diez tablas de PEMP |
| Manutención de cargas | 7 | Página 3, por rangos |
| Excavación, tierras y compactación | 50 | Página 4 + el guion «SEGÚN GUIÓN» |
| Energía e iluminación | 4 | Página 5, por rangos |
| Aire comprimido y martillos | 3 | Página 5, por rangos |
| Herramienta auxiliar | 1 | Página 5 |

**595 especificaciones confirmadas**, 34 fichas técnicas de fabricante en
PDF y 27 fotografías oficiales.

El orden de los submenús de tierras es literalmente el del documento
«MAQUINARIA DE MOVIMIENTO DE TIERRAS Y COMPACTACIÓN SEGÚN GUIÓN»:
retroexcavadoras, retrocargadoras/mixtas, minicargadoras, dúmper,
rodillos, y pisones y bandejas. Compactación **no** es una familia
aparte: es el punto 2.2 junto con excavación, como pidió el cliente.

**Manutención, energía, aire y herramienta van por gama, no por modelo.**
Su catálogo publica esas cuatro familias por rangos —«desde 2.000 hasta
7.000 kg»— así que cada entrada es la gama entera, marcada como tal, con
el rango real. No hay ni un modelo inventado para rellenar.

### Fotografía: fuera Wikimedia

La capa de 57 fotografías de licencia libre está **retirada por
completo**. No era solo que no fueran del modelo exacto: varias llevaban
rotulación visible de empresas de alquiler de la competencia —«renta»,
«Sunbelt», «Skyjack»— y una de ellas **era el hero de la portada**.

En su lugar están las 27 creatividades oficiales que entregó el cliente:
máquinas de su propia flota, con su rotulación. De cada una salen dos
derivados generados una sola vez:

- `oficial/tarjeta/` — lienzo 4:3 de 1200×900, para tarjeta y ficha.
- `oficial/recorte/` — la máquina a su caja real, en vertical, para el hero.

Las 118 referencias que aún no tienen foto salen con **dibujo técnico**.
Un dibujo parece deliberado; la máquina de otro con su logotipo, no.

### Lo que NO se puede decir

Jorge desmintió por teléfono que la flota sea nueva: *«hay máquinas que
están nuevas, pero hay máquinas que tienen un montón de años; eso no lo
puedo poner»*. Así que **ningún claim de la web dice «flota nueva»,
«maquinaria moderna» ni «en continua renovación»**, y
`scripts/verificar-servidor.mjs` lo comprueba en ocho páginas para que no
se cuele en el futuro. Cuando amplíen catálogo se hablará de «nuevo
catálogo».

La columna de flota del raíl de garantías dice lo que sí es verificable y
además es mejor argumento: cuántas referencias hay y de qué altura a qué
altura.

### Iconografía

22 dibujos de máquina, un lienzo (96×72), una anchura de trazo y
`currentColor`. Es la iconografía de la lámina que pasó el cliente y que
gustó en la reunión. Se ven en el raíl de familias de la portada, en las
tiras de categoría del catálogo, en el desplegable del menú, en el índice
de servicios y como respaldo de la máquina sin foto. Hay una hoja de
control en `/admin/iconos`.

### Datos de empresa

Del catálogo general salen las direcciones, teléfonos y correos de las
**diez** delegaciones, incluidas las **dos de Portugal** —Vila Nova de
Gaia y Palmela— que su web actual no publica en ninguna parte y que la
versión anterior de esta web tenía como «contacto pendiente de
confirmar». También los dos centros con dirección propia: la central de
formación y el distribuidor oficial Takeuchi, ambos en San Fernando de
Henares.

Los horarios siguen en blanco porque no los publican. La web dice
«llámanos y te lo confirmamos».

### Noticias

14 entradas **reales** de su blog, con título, fecha y entradilla
verificados. Las que había en la maqueta eran inventadas. Se muestran
seis y el resto se piden, y se filtra por tema y por delegación. El
cuerpo sigue en su servidor, así que cada tarjeta abre la original: la
migración del histórico —unas 267 entradas— está fuera de esta entrega.

### Logotipo

En SVG, extraído del vectorial que entregó el cliente. Cuatro variantes:
principal, blanco para fondo oscuro, formación e isotipo. El PNG con el
fondo recortado por script ya no se usa.

### Las tres páginas interactivas van dentro del HTML

Formulario, comparador y asesor leen la URL. Cuando la leía el cliente con
`nuqs`, las tres necesitaban una frontera de `<Suspense>`, y Next servía el
contenido **dentro de un `<div hidden>` detrás del pie**, con un recuadro
gris en su sitio. Consecuencia: sin JavaScript no había ni formulario, ni
comparación, ni asistente; y con JavaScript, un parpadeo gris justo donde
está el objetivo.

Ahora los parámetros los lee el **servidor** y bajan como props. La URL
sigue siendo el estado compartible —se mantiene con `replaceState`, y en el
asesor con `pushState` más `popstate` para que el botón atrás recorra las
preguntas— pero ha dejado de decidir si el contenido existe. Lo vigilan
siete comprobaciones del bloque 12 de `verificar-servidor.mjs`.

El catálogo sigue con `nuqs`: ahí son muchos filtros que se combinan, y su
respaldo de servidor ya era catálogo de verdad, no un recuadro.

### Zonas de toque

Ningún objetivo en bloque mide menos de 24 px de alto, que es el mínimo de
la WCAG 2.5.8 AA. Se auditaron las 23 rutas a los cuatro anchos (375 / 768
/ 1024 / 1440): 92 combinaciones sin desbordamiento horizontal, sin texto
recortado, sin imagen sin `alt` y sin ningún objetivo por debajo del
mínimo. Los enlaces dentro de una frase se quedan como están: la norma los
exceptúa y partir un párrafo para engordarlos sería peor.

Una trampa que costó encontrar: **`flex-1` dentro de un contenedor
`flex-col` mata la altura fija**. En columna el eje principal es el
vertical, así que `flex-basis: 0` gana al `h-12` y el botón se queda en la
altura de su contenido —22 px en los dos botones de la ficha—. Cuando el
`flex-1` es para repartir una fila, va con su punto de ruptura:
`md:flex-1`.

---

## Lo primero que hay que saber

**Esta web no cobra nada.** No hay pasarela de pago, ni carrito de
compra, ni se piden datos bancarios en ningún sitio. Todos los caminos
terminan en el mismo formulario: *Consultar disponibilidad*. El precio
final depende del transporte, de la duración y de la disponibilidad real
de cada delegación, así que lo confirma una persona.

**Los datos que no tenemos no se inventan.** Es la regla que estructura
todo el proyecto, no una buena intención. Cada especificación lleva su
estado de verificación:

| Estado | De dónde sale | Cómo se ve en la web |
|---|---|---|
| `conf(...)` | Catálogo general de JOFEMESA o ficha técnica del fabricante | La cifra, tal cual |
| `est(...)` | Sin confirmar contra la unidad de flota, o rango de una gama | La cifra con subrayado ámbar y su nota al pasar por encima |
| `pend(...)` | No lo sabemos | Una etiqueta **Pendiente**, nunca un número |
| `na()` | No aplica a ese tipo de máquina | Una raya, y solo en el comparador |

Los filtros y el asesor **solo leen `conf` y `est`**. Una máquina sin
altura confirmada queda fuera del filtro de altura en lugar de colarse
con un cero, y el estado vacío lo explica. La lista completa de lo que
falta está en `/admin/datos-pendientes`.

Tres celdas del catálogo del cliente que no cuadran salen **marcadas y
explicadas** en vez de darse por buenas: el peso del Genie Z-80/60
—7.530 kg para un brazo de 26 m, la misma cifra que el Z-60/37 FE de 20
m— y la anchura de los dos Socage sobre camión, que no puede ser la del
vehículo.

---

## Rendimiento: dev no es producción

Si al navegar parece que la web tarda, mide antes de tocar nada. La
diferencia entre los dos modos es de dos órdenes de magnitud, y es toda
de `next dev`, que compila cada ruta la primera vez que se pide. Para
valorar velocidad, siempre compilación de producción.

El catálogo pinta **24 tarjetas por tanda**. Con 145 referencias,
pintarlas todas de golpe son casi 6.000 nodos y 145 imágenes en el móvil
de una obra. El respaldo de servidor sirve esas mismas 24 —no un
esqueleto— así que el HTML servido trae producto de verdad; el camino
completo para un rastreador son las seis páginas de familia y el sitemap
con las 145 fichas.

`BarraProgreso` es un filete rojo de 2px en el borde superior mientras
navega. No acelera nada: hace que la espera sea legible, que es lo que
evita que el usuario vuelva a pulsar y la haga más lenta de verdad.

---

## Movimiento

Un solo `IntersectionObserver` global (`MotorRevelado`) observa todo lo
que lleve `data-revelar`. La consecuencia buena es que **un componente de
servidor se anima añadiendo un atributo**, sin convertirse en componente
de cliente. `data-escalonar` en un contenedor reparte el retardo entre
sus hijos, con tope de 6.

La regla dura de accesibilidad se mantiene: el CSS que oculta los
elementos cuelga de `html[data-motor]`, y ese atributo **solo lo pone el
JavaScript**. Sin JS, con JS caído o con un rastreador leyendo, la página
se sirve entera y visible. Con `prefers-reduced-motion` no se registra
observador ni atributo.

La primera pasada espera **dos `requestAnimationFrame`**. No es una
precaución vaga: React hidrata de forma selectiva y los árboles que hay
dentro de un `<Suspense>` —el catálogo y el asesor— pueden hidratar
después; escribir `data-visible` antes de eso provoca un aviso de
desajuste de hidratación.

Duraciones por clase, no una sola cifra: acuse de recibo ≤100 ms, estado
de interfaz 150–200 ms, entrada de modal 260 ms, salida 180 ms, revelado
de sección 450 ms. Solo se animan `transform` y `opacity`. **No hay
fijado de secciones con GSAP**: en una rejilla de catálogo el pinning
esconde contenido y rompe la restauración del scroll, y el usuario de
esta web está buscando una máquina, no viendo una película.

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
solicitudes se guardan en local y se ven en `/admin/solicitudes`, que es
la página que se le enseña al cliente para demostrar que la captura
funciona de verdad.

El formulario es un `<form action={…}>` de verdad, así que se envía y se
valida **con JavaScript desactivado**. Antispam sin terceros: campo
trampa oculto y descarte de envíos en menos de tres segundos. Sin
CAPTCHA, porque cuesta conversiones. El CIF se valida con su dígito de
control real, pero **avisa en vez de bloquear**.

Lleva **selector de delegación**, que es lo que se pidió en la reunión, y
reconoce el `?asunto=` con el que llega desde cada bloque de servicios.

---

## Las cuatro funcionalidades

**¿Qué máquina necesito?** (`/asesor`, y empotrado en la portada). Tres
**selectores** en una sola pantalla —así se pidió en la reunión—. Solo el
segundo depende del primero, porque sus opciones cambian con el trabajo; el
tercero —dónde va a trabajar la máquina— se puede contestar cuando se
quiera, que es lo coherente con enseñar las tres preguntas a la vez. Cada
uno con un *No lo sé* que ensancha en vez de bloquear. Dos etapas: eliminación dura y después puntuación
relativa al mejor candidato. Cada resultado muestra hasta tres razones en
español llano, nunca una puntuación. La salida es **el mismo objeto de
filtros** que usa el catálogo. Las respuestas viven en la URL.

**Comparador** (`/comparador?m=a,b,c`). La bandeja vive en el layout, así
que sobrevive a la navegación, y usa `localStorage` con
`useSyncExternalStore`. La página lee de la URL: la bandeja es efímera,
la comparación es enlazable. **Se pueden añadir máquinas desde el propio
comparador**, que era la pega de la reunión. Primera columna fija,
`scroll-snap` por columna en móvil, marca **Máx.**/**Mín.** con subrayado
y palabra, interruptor de *solo diferencias* y hoja de impresión A4
apaisada. Una fila solo aparece si alguna de las máquinas comparadas
tiene ahí un dato de verdad.

**Filtros** (`/alquiler`). Dos planos separados, como se acordó: las
**categorías arriba** —dos tiras que se arrastran y tienen flecha, así se
llega a todas en móvil— y el **filtro técnico a la izquierda con el
buscador dentro**: modelo, alimentación, altura, uso y fabricante. Todo
sincronizado con la URL vía `nuqs` en modo `shallow`. En móvil hay además
un buscador compacto junto al botón de filtrar, para no abrir la hoja
solo para escribir un modelo. Las opciones con cero resultados se
**deshabilitan en gris, no se eliminan**.

Se ha quitado el filtro de delegación: ninguna máquina está asignada a un
parque concreto porque el cliente no publica ese dato, así que salía
siempre con las diez marcadas y no descartaba nada. La delegación se
elige donde significa algo, que es el formulario.

**Ficha interactiva.** Un único componente de servidor sirve a la vez la
página rastreable `/maquina/[slug]` y el modal interceptado. Usa el
`<dialog>` nativo, así que la trampa de foco, el `Escape` y el fondo
inerte son del navegador.

---

## Diseño

El sistema se rehízo en la revisión posterior a la primera entrega. El
diagnóstico del cliente fue «demasiado tosca», y tenía razón: la versión
anterior era radio cero en todo, filete de 1 px a #DFE4E8 por toda la
página, titulares en Montserrat **extrabold** a 88 px y cada etiqueta en
monoespaciada de caja alta. Cada pieza se defendía sola; juntas daban una
placa de características industrial, no una tienda. La referencia ahora es
la versión de Emilio.

### Tipografía

**Archivo** en titulares, **Plus Jakarta Sans** en texto corrido. Las dos
de Google, variables, muy comunes.

Lo que cambia el aire no es la familia, es el **peso**: los titulares van
en 300 y 400. Archivo es una grotesca estrecha que aguanta pesos ligeros
sin deshacerse, así que la jerarquía la da la escala y el interletrado, no
el grosor. `display-1` baja de 88 px a 56 px de tope.

#### La caja alta es para etiquetas, no para frases

Esta es la regla que faltaba, y es la que más limpió la página. Hay tres
utilidades y la elección **no** es de tamaño, es de qué clase de texto es:

| Utilidad | Para qué | Ejemplo |
|---|---|---|
| `label` / `label-sm` | Etiquetas cortas, en caja alta | `GAMA`, `PARTNER OFICIAL` |
| `meta` | Frases de apoyo, en caja baja | «Demolición, corte y perforación · 1 referencia» |
| `etiqueta-campo` | Etiquetas de formulario, en caja baja | «Algo más que debamos saber» |

`label` además se suavizó dos veces: primero saliendo de la monoespaciada
—cien versalitas de terminal por página—, y después bajando de peso 600 a
500 y de 0,18em a 0,10em de interletrado. La caja alta muy espaciada y en
seminegrita grita, y repetida no deja respirar a nada.

En la duda, `meta`. Lo que rompía era la caja alta aplicada a frases:
«DEMOLICIÓN, CORTE Y PERFORACIÓN» partido en dos líneas no se lee, y
«ALTURA TRABAJO» en un tercio de tarjeta salía como «ALTURA TRA…».
Los formularios van enteros en caja baja: un formulario de doce campos
con las etiquetas en versalitas es un cartel de avisos, y se rellenan
mejor cuando parecen amables.

Geist Mono se queda **solo** en cifras que tienen que alinearse en
columna: tabla del comparador y especificaciones.

### Dos trampas de maquetación que costaron encontrar

Las dos dan el mismo síntoma —una imagen deformada— y ninguna avisa.

1. **`w-auto` no sobrevive a un contenedor flex en columna.** El
   `align-items: stretch` que trae por defecto le gana, así que el
   logotipo de Jungheinrich se estiraba de 217 px a los 469 px de la
   tarjeta. Se arregla con `self-start`.
2. **Un elemento de rejilla tiene `min-width: auto`**, así que se estira
   hasta su min-content y puede reventar su propia pista: la foto del
   hero se resolvía a 698 px dentro de una pista de 320 y se recortaba
   por los dos lados. Se arregla con la anchura escrita y
   `grid-cols-1` explícito.

Y una tercera, de Tailwind: en un valor arbitrario los espacios van con
guion bajo. `w-[calc(100%+2.5rem)]` no genera nada y la clase muere en
silencio; hay que escribir `w-[calc(100%_+_2.5rem)]`.

### Superficie

Radio real donde antes había cero: 8 px en chips, 16 px en paneles
internos, 28 px en la tarjeta, 32 px en el hero, y pastilla completa en
los botones. El botón en pastilla es la decisión que más limpia la página:
un rectángulo recto en rojo de marca pesa el doble.

Los filetes se aclaran a #ECEFF1 y la elevación la hace una sombra
mínima (`--shadow-tarjeta`) en vez de un filete duro. Tres utilidades
—`tarjeta`, `panel`, `pastilla`— concentran eso, así que dejó de estar
repetido a mano en cada componente.

Sigue habiendo **un solo acento**: el rojo JOFEMESA #E30613, que mide
4,88:1 sobre blanco. El rojo puro del logotipo (#FF0000) mide 4,00:1 y no
llega al mínimo, así que vive solo en el logotipo. `scripts/contraste.mjs`
lo comprueba.

### El mapa de delegaciones

Ocupa la columna derecha entera de la cabecera y se lleva consigo las tres
cifras. Colgando debajo del texto se quedaba en 380 px con media pantalla
vacía al lado, y es la pieza que contesta la única pregunta de esa página:
«¿llegáis a mi obra?».

La costa se traza y los diez puntos caen de norte a sur. Es CSS puro y
cuelga de `html[data-motor]`, igual que el motor de revelado: sin
JavaScript, con un rastreador o con `prefers-reduced-motion` el mapa sale
entero y quieto. Lo animado es **cómo** aparece, no **si** aparece.

### Hero

**A sangre y a pantalla completa.** La fotografía llega a los cuatro
bordes y el texto va encima, sobre un velo que va de opaco a
transparente. Hubo una versión intermedia metida en una placa con margen
y esquina blanda, y el efecto era el contrario del buscado: la placa
encogía la foto y la dejaba en una cajita en medio de la página. Una
fotografía de obra o llega a los bordes o no vale la pena ponerla.

El alto es `hero-alto` = `100svh` menos la cabecera fija y menos la barra
fija de móvil. Pantalla completa de verdad, pero la que **se ve**: con
`100vh` a secas la cabecera de 108 px empuja el buscador fuera del primer
vistazo, que es justo el que decide el primer clic. Y `svh` en vez de
`vh` porque en móvil el navegador cuenta su propia barra como retraída y
corta el CTA. Comprobado a 1440×900, 1180×740, 768×1024 y 375×812: en los
cuatro la sección llega al borde inferior de la ventana y el buscador
entra sin scroll.

Lo que sangra es la imagen; el **texto va contenido** en
`container-placa`. Un titular que empieza a 8 px del borde de un monitor
de 27 pulgadas no se lee.

El velo está **medido**, no puesto a ojo: se compone el pixel real de la
foto con el degradado y se calcula el contraste del titular y de la
entradilla en su peor punto. Con la foto actual dan 11,3:1 y 6,1:1, con
el 63% de la fotografía visible por la derecha. Una parada más suave
enseña el 68% pero deja la entradilla en 5,0:1 —pasa, pero sin margen—.
**Si se cambia la fotografía hay que volver a medir**: una imagen más
clara por la izquierda tumba la entradilla por debajo del 4,5:1 de la
WCAG AA sin que se note a simple vista.

Todo lo que hay que tocar para cambiar la fotografía está en la constante
`HERO` de `src/components/home/Hero.tsx`: `src`, `alt`, `velo`
(`claro` / `oscuro`) y `posicion`. Con `velo: "oscuro"` el componente
invierte el texto a blanco él solo. La actual es la creatividad de estudio
del cliente, que tiene fondo claro; cuando llegue una fotografía de obra
de ambiente se cambian esos cuatro campos y nada más.

### La tarjeta de máquina

Composición de la versión de Emilio: cabecera con marca y modelo,
**etiqueta de alimentación** a la derecha, plataforma hundida para la
foto, franja de tres cifras, una línea de beneficio y dos acciones en
pastilla.

La etiqueta de alimentación es nueva y es la que más se echaba en falta:
eléctrico, híbrido o diésel decide un alquiler **antes** que la altura, y
si es 4x4 se rotula «Diésel 4x4». El color no es el único portador —cada
etiqueta lleva su palabra— y los tres pares están medidos sobre su propio
fondo, no sobre blanco: 7,26:1, 8,04:1 y 7,80:1.

La plataforma de la foto tiene alto **fijo** (11rem) y no proporción 4:3:
con 4:3 la tarjeta se iba a 670 px en una columna de 390, y una rejilla de
tarjetas de 670 px se recorre a ciegas.

De la reunión del 24/08/2026 se mantienen las dos instrucciones sobre los
botones: **Ficha va en rojo de marca** —literal: «aunque quede peor, pues
tiene que ir en rojo»— y por eso «Consultar disponibilidad» cede y pasa a
tinta. Un rojo por tarjeta.

### Las distribuciones oficiales, arriba

Ser partner oficial de Jungheinrich y distribuidor oficial de Takeuchi es
lo único de esta web que un competidor no puede copiar, así que tiene
banda propia justo debajo del hero, con el logotipo a tamaño legible y su
salida. Antes estaba a media página de profundidad, dentro de un párrafo
y en una línea de texto entre nueve marcas más.

La distinción se rotula, porque no es la misma cosa: **partner** de
Jungheinrich (su catálogo completo, incluida la gama reacondicionada
JUNGSTARS) y **distribuidor oficial** de Takeuchi, con centro propio en
San Fernando de Henares. Lo demás son fabricantes de la flota —alquilamos
su maquinaria, no la distribuimos— y por eso van debajo, en gris y sin
logotipo.

### Espaciado

El padding de sección es 56/72/88 px. Muy por debajo del cine de 192 px
que pide `gpt-taste`, y a propósito: en un catálogo, si una sección no
cabe de un vistazo hay que scrollear a ciegas. El aire se gana con
filetes y jerarquía tipográfica, no con vacío.

Cuatro puntos de ruptura y solo cuatro: 375 / 768 / 1024 / 1440. Ojo con
esto: **`sm:` no existe** en este proyecto —el tema anula la escala— y una
utilidad `sm:algo` se compila a nada sin avisar.

## Scripts

| Script | Para qué |
|---|---|
| `npm run check` | Tipos, lint, validación del catálogo y pruebas |
| `npm test` | 57 aserciones sobre filtros, asesor, comparador y formulario |
| `PUERTO=4477 node scripts/verificar-servidor.mjs` | 153 comprobaciones del HTML servido. **Contra una compilación de producción**, no contra `dev` |
| `npm run catalogo:validar` | Corre en `prebuild`: para la compilación si hay un slug duplicado, un PDF o una imagen que no existen, un `alt` vacío, una spec sin definición o una **subcategoría vacía en el menú** |
| `node scripts/contraste.mjs` | Contrastes WCAG de la paleta |
| `node scripts/preparar-logo.mjs` | Histórico: recortaba el fondo del PNG del logotipo, que ya no se usa |

---

## Pendiente antes de publicar

Está todo en `/admin/datos-pendientes`, que es la página que se le enseña
al cliente. Lo bloqueante:

1. **Confirmar la cifra de flota.** La web publica «+5.000 equipos en
   flota» porque es lo que dice su propia lámina del 24/08/2026. Hay que
   confirmarla.
2. **Fotografía de manutención, tierras y energía.** 118 referencias
   salen con dibujo técnico. El cliente dijo que a final de mes tendría
   los PDF y las fotos del catálogo ampliado.
3. **Fichas técnicas del resto del catálogo.** Están las 34 de elevación.
4. **Contenido de formación.** Acordado: se nombra y no se desarrolla
   hasta definirlo con el cliente.
5. **Horarios de las delegaciones.** No están publicados en ninguna
   parte.
6. **Teléfono y dirección de Castellón.** El catálogo general la nombra
   en la portada pero no le da ficha de contacto.
7. **Número de WhatsApp Business** para la barra móvil.
8. **Registro Mercantil.** Su propio aviso legal publica esos campos en
   blanco.
9. **Certificados ISO en PDF.** Los enlaces de su web devuelven una
   página vacía con código 200.
10. **Consentimiento de cookies.** Hoy la web no instala ninguna cookie
    de seguimiento y la política lo dice. En el momento en que se añada
    Analytics, Ads o Meta Pixel, hace falta un banner real con bloqueo
    previo.
11. **Migración del blog.** 267 entradas reales en su servidor. Las 14
    últimas están cargadas y enlazan allí.
