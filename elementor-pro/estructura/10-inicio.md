# 10 · Inicio (portada)

Traducción de `src/app/(site)/page.tsx` y de `src/components/home/*`
(`Hero.tsx`, `HeroCarrusel.tsx`, `Buscador.tsx`, `Partners.tsx`,
`Garantias.tsx`, `Necesidades.tsx`, `Destacadas.tsx`, `Cobertura.tsx`,
`Autoridad.tsx`), del asesor empotrado (`asesor/Asesor.tsx` → `AsesorLocal`)
y del cierre. «Noticias» está apagado en el original (`MODULOS`) y no se monta.

- Estilos: `assets/css/30-inicio.css` (portada) y `assets/css/31-asesor.css` (panel del asesor).
- Comportamiento: `assets/js/30-hero.js` (carrusel, buscador, próxima convocatoria,
  flechas de destacadas) y `assets/js/31-asesor.js`.
- Shortcodes: `includes/65-inicio.php` (`[jm_cifra]`, `[jm_buscador]`,
  `[jm_proxima_convocatoria]`, `[jm_asesor]`, `[jm_mapa]`, `[jm_fabricantes]`,
  `[jm_delegaciones_lista]`). `[jm_antiguedad]` y `[jm_dato]` son de
  `includes/60-global.php`.

## Dónde se crea

**Páginas → Añadir nueva** · título «Inicio» · plantilla **Elementor Ancho
completo**. Después, *Ajustes → Lectura → Tu portada muestra: Una página
estática → Inicio*.

Todos los contenedores en **Ancho completo**, relleno y hueco a 0 (paso 0 de
`00-ajustes-globales.md`), **nada en la pestaña Estilo** y **nada de Efectos de
movimiento**. Cuando el árbol dice «Dirección: fila» es el control de
*Diseño → Dirección* del contenedor (pestaña Diseño, no Estilo); el CSS ya la
fuerza igualmente, así que en móvil no hay que tocar nada.

### Antes de empezar: medios

| Archivo (en `elementor-pro/recursos/`) | Para qué | Texto alternativo (en Medios) |
|---|---|---|
| `imagenes/hero-alquiler.jpg` (= `public/img/hero/portada.jpg`) | Foto de la portada Alquiler | «Plataforma elevadora de tijera trabajando en la estructura de una nave» |
| `imagenes/hero-formacion.jpg` (= `public/img/hero/formacion.jpg`) | Foto de la portada Formación | «Instructor explicando los mandos de una plataforma elevadora de tijera a dos alumnos con casco y arnés» |
| `imagenes/jungheinrich.webp` | Logotipo de Partners | «Jungheinrich» |
| `iconos/lucide-boxes.svg`, `lucide-shield-check.svg`, `lucide-map-pin.svg`, `lucide-calendar-clock.svg` | Iconos de Garantías | — |
| `iconos/lucide-clock.svg`, `lucide-wrench.svg`, `lucide-award.svg` (+ `lucide-shield-check.svg`) | Iconos de Autoridad | — |
| `iconos/lucide-arrow-right.svg`, `lucide-phone.svg` | Flecha de las tarjetas de familia y teléfono del cierre | — |
| `plugin/jofemesa-core/assets/iconos/maquina-tijera.svg`, `maquina-manipulador.svg`, `maquina-excavadora.svg`, `maquina-grupo.svg`, `maquina-compresor.svg`, `maquina-herramienta.svg` | Dibujos de las seis familias | — |

Los SVG se suben desde el propio widget Icono (*Subir SVG*). Si WordPress los
rechaza: *Elementor → Ajustes → Avanzado → Habilitar la carga de archivos SVG*.

Los botones con flecha usan el icono *Font Awesome → arrow-right* (o el SVG
`lucide-arrow-right.svg`), posición **Después**.

### Etiquetas dinámicas con cifras

Las cifras que el original cuenta en código (referencias, delegaciones,
alturas…) salen de `[jm_cifra]`:

- **Dentro de un Editor de texto** se escribe el shortcode tal cual (el
  editor de texto ejecuta shortcodes).
- **En un Título o en el texto de un Botón** (que no ejecutan shortcodes) se
  usa la etiqueta dinámica **Shortcode** (icono de base de datos → *Shortcode*)
  y, en su llave inglesa → *Avanzado*, los campos **Antes** / **Después**.

| `que=` | Devuelve | Hoy |
|---|---|---|
| `referencias` | Máquinas publicadas | 145 |
| `delegaciones` | Delegaciones de alquiler (sin la sede de formación) | 9 |
| `familias` | Familias de primer nivel | 6 |
| `familia` + `familia="slug"` | Máquinas de esa familia (con subcategorías) | 80… |
| `altura-min` / `altura-max` | Altura de trabajo mínima / máxima, con coma decimal | 4,5 / 57 |
| `destacadas` | Máquinas con foto y ficha técnica | 62 |
| `anios` · `fundacion` · `equipos` | Años desde la fundación · año · flota | 39 · 1987 · +5.000 |

Atributo `plural="referencia,referencias"`: añade la palabra en singular o
plural y lo envuelve en un `<span>` que no se parte de línea.

## Árbol de montaje (en el orden de `page.tsx`)

### S1 · Hero en carrusel

Dos portadas apiladas en la misma celda. Son contenedores nativos: el cliente
cambia titulares, textos, botones y fotos. `30-hero.js` añade solo los mandos
(flechas laterales desde 1440 px, pestañas con barra de progreso que es el
temporizador de 8 s, botón «Siguiente: …», pista de scroll), la cortina, la
cuchilla roja, el acercamiento de la foto, la entrada escalonada del texto, la
pausa al pasar el ratón o al enfocar algo dentro (el buscador), `inert` en la
portada oculta y los `aria-*` del carrusel. Con «reducir movimiento» no avanza
solo. En el editor tampoco avanza: se cambia de portada con las pestañas.

```
Contenedor · section · Ancho completo · Clases: jm-hero jm-oscuro
│  Atributos: data-jm|hero
│             aria-label|Portadas de JOFEMESA
│
├─ Contenedor · div · Ancho completo · Clases: jm-hero__portada jm-hero__portada--inicial     ← PORTADA 1
│  │  Atributos: data-jm-portada|alquiler
│  ├─ Imagen · Clases: jm-fondo-img jm-hero__foto jm-hero__foto--alquiler
│  │    Imagen: hero-alquiler.jpg · Tamaño: Completo · Sin enlace · Sin leyenda
│  └─ Contenedor · Ancho completo · Clases: jm-contenedor jm-hero__texto
│     └─ Contenedor · Ancho completo · Clases: jm-hero__columna
│        ├─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-hero__kicker jm-entra-0
│        │  ├─ Título · Etiqueta HTML: span · Clases: jm-label jm-hero__pastilla
│        │  │    Texto: «Desde 1987 especialistas en maquinaria»
│        │  └─ Título · Etiqueta HTML: span · Clases: jm-label jm-hero__zona
│        │       Texto: «España y Portugal»
│        ├─ Título · Etiqueta HTML: h1 · Clases: jm-display-1 jm-hero__titulo jm-entra-1
│        │    Texto: «Alquiler de maquinaria para que tu obra no se pare.»
│        ├─ Editor de texto · Clases: jm-hero__lede jm-hereda jm-entra-2
│        │    Texto: «Plataformas elevadoras, manipuladores, carretillas, movimiento de
│        │    tierras y energía. [jm_cifra que="referencias"] referencias y
│        │    [jm_cifra que="delegaciones"] delegaciones propias con flota, taller y camiones.»
│        ├─ Shortcode · Clases: jm-hero__buscador jm-entra-3
│        │    [jm_buscador tono="oscuro"]
│        └─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-hero__enlaces jm-entra-4
│           ├─ Botón · Clases: jm-btn jm-btn--enlace jm-hero__enlace-acento
│           │    Texto: «No sé qué máquina necesito» · Enlace: /asesor/
│           │    Icono: arrow-right · Posición: Después
│           └─ Botón · Clases: jm-btn jm-btn--enlace jm-hero__enlace-suave        ← oculto < 768 px
│                Texto: «Ver todo el catálogo» · Enlace: /alquiler/ · Sin icono
│
└─ Contenedor · div · Ancho completo · Clases: jm-hero__portada                                ← PORTADA 2
   │  Atributos: data-jm-portada|formacion
   ├─ Imagen · Clases: jm-fondo-img jm-hero__foto jm-hero__foto--formacion
   │    Imagen: hero-formacion.jpg · Tamaño: Completo
   │    (si un día falta: la de obra con las clases jm-fondo-img jm-hero__foto jm-hero__foto--provisional
   │     y texto alternativo vacío, como hace Hero.tsx)
   └─ Contenedor · Ancho completo · Clases: jm-contenedor jm-hero__texto
      └─ Contenedor · Ancho completo · Clases: jm-hero__columna
         ├─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-hero__kicker jm-entra-0
         │  └─ Título · Etiqueta HTML: span · Clases: jm-label jm-hero__pastilla
         │       Texto: «Departamento de Formación»
         ├─ Título · Etiqueta HTML: h2 · Clases: jm-display-1 jm-hero__titulo jm-hero__titulo--corto jm-entra-1
         │    Texto: «Formación de operadores para trabajar seguro.»
         ├─ Editor de texto · Clases: jm-hero__lede jm-hereda jm-entra-2
         │    Texto: «Plataformas elevadoras, carretillas, trabajos en altura, andamios y
         │    espacios confinados. Convocatorias cada semana en Madrid y en Valencia.»
         ├─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-hero__botones jm-entra-3
         │  ├─ Botón · Clases: jm-btn jm-btn--acento
         │  │    Texto: «Ver convocatorias» · Enlace: /formacion/#calendario
         │  │    Icono: arrow-right · Posición: Después
         │  └─ Botón · Clases: jm-btn jm-btn--contorno-claro jm-hero__btn-claro
         │       Texto: «Catálogo de cursos» · Enlace: /formacion/#cursos · Sin icono
         └─ Shortcode · Clases: jm-hero__proxima jm-entra-4                       ← oculto < 768 px
              [jm_proxima_convocatoria]
```

Notas del hero:

- La clase `jm-hero__portada--inicial` va **solo** en la primera portada: es
  la que se ve antes de que arranque el JS (o si no arranca).
- El rótulo de cada pestaña sale de `data-jm-portada` (`alquiler` → «Alquiler»,
  `formacion` → «Formación»). Para otro rótulo, añade el atributo
  `data-jm-rotulo|Texto`. Admite más de dos portadas.
- `jm-entra-0` … `jm-entra-4` marcan el orden de la entrada escalonada (90 ms
  entre piezas, tras 420 ms de cortina).
- El texto de la portada de Formación es un `h2`, como en el original: solo
  hay un `h1` en la página.

### S2 · Partners

```
Contenedor · section · Ancho completo · Clases: jm-partners
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-partners__cuerpo
   ├─ Contenedor · Ancho completo · Clases: jm-celdas jm-partners__rejilla
   │  ├─ Contenedor · Ancho completo · Clases: jm-partners__tarjeta                ← Jungheinrich
   │  │  ├─ Título · Etiqueta HTML: p · Clases: jm-label jm-partners__insignia
   │  │  │    Texto: «Partner oficial»
   │  │  ├─ Imagen · Clases: jm-partners__logo
   │  │  │    Imagen: jungheinrich.webp · Tamaño: Completo · Alt: «Jungheinrich»
   │  │  ├─ Editor de texto · Clases: jm-partners__texto jm-hereda
   │  │  │    Texto: «Distribuimos todo el catálogo de Jungheinrich en manutención:
   │  │  │    contrapesadas eléctricas y diésel, mástil retráctil, trilaterales EKX y EFX,
   │  │  │    preparadoras de pedidos, transpaletas, apiladores y tractores de arrastre.
   │  │  │    También su gama reacondicionada JUNGSTARS.»
   │  │  └─ Botón · Clases: jm-btn jm-btn--enlace jm-partners__enlace
   │  │       Texto: «Ver venta y recambios» · Enlace: /servicios/#venta · Icono: arrow-right, Después
   │  └─ Contenedor · Ancho completo · Clases: jm-partners__tarjeta                ← Takeuchi
   │     ├─ Título · Etiqueta HTML: p · Clases: jm-label jm-partners__insignia
   │     │    Texto: «Distribuidor oficial»
   │     ├─ Título · Etiqueta HTML: p · Clases: jm-partners__marca
   │     │    Texto: «Takeuchi»                         (marca tipográfica: no hay logotipo vectorial)
   │     ├─ Editor de texto · Clases: jm-partners__texto jm-hereda
   │     │    Texto: «Distribución oficial de Takeuchi en retroexcavadoras y miniexcavadoras,
   │     │    con venta, recambio original y servicio técnico propio. Centro en San Fernando
   │     │    de Henares, Madrid.»
   │     └─ Botón · Clases: jm-btn jm-btn--enlace jm-partners__enlace
   │          Texto: «Ver el centro Takeuchi» · Enlace: /servicios/#venta · Icono: arrow-right, Después
   └─ Contenedor · Ancho completo · Clases: jm-tira-fabricantes jm-partners__fabricantes
      ├─ Título · Etiqueta HTML: h3 · Clases: jm-label
      │    Texto: «Nuestros fabricantes»
      └─ Shortcode · [jm_fabricantes variante="partners"]      (sin Jungheinrich ni Takeuchi)
```

### S3 · Garantías

```
Contenedor · section · Ancho completo · Clases: jm-garantias
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-pila
   ├─ Contenedor · Ancho completo · Clases: jm-celdas jm-garantias__rejilla
   │  │  Atributos: data-escalonar|
   │  ├─ Contenedor · Ancho completo · Clases: jm-garantia
   │  │  ├─ Icono · Clases: jm-icono-linea · SVG: lucide-boxes.svg
   │  │  ├─ Título · Etiqueta HTML: p · Clases: jm-label jm-garantia__titulo · Texto: «Amplia flota»
   │  │  └─ Editor de texto · Clases: jm-garantia__texto jm-hereda
   │  │       Texto: «[jm_cifra que="referencias"] referencias en catálogo, de
   │  │       [jm_cifra que="altura-min"] a [jm_cifra que="altura-max"] m de altura de trabajo.»
   │  ├─ Contenedor · Clases: jm-garantia
   │  │  ├─ Icono · jm-icono-linea · lucide-shield-check.svg
   │  │  ├─ Título · p · jm-label jm-garantia__titulo · «Seguridad»
   │  │  └─ Editor de texto · jm-garantia__texto jm-hereda
   │  │       «Equipos revisados antes de cada salida y cumplimiento normativo documentado.»
   │  ├─ Contenedor · Clases: jm-garantia
   │  │  ├─ Icono · jm-icono-linea · lucide-map-pin.svg
   │  │  ├─ Título · p · jm-label jm-garantia__titulo · «Cobertura»
   │  │  └─ Editor de texto · jm-garantia__texto jm-hereda
   │  │       «[jm_cifra que="delegaciones"] delegaciones propias en España y Portugal, con transporte propio.»
   │  └─ Contenedor · Clases: jm-garantia
   │     ├─ Icono · jm-icono-linea · lucide-calendar-clock.svg
   │     ├─ Título · p · jm-label jm-garantia__titulo · «Experiencia»
   │     └─ Editor de texto · jm-garantia__texto jm-hereda
   │          «Desde el 24 de marzo de [jm_cifra que="fundacion"]. [jm_cifra que="anios"] años alquilando maquinaria.»
   └─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-garantias__sellos
      ├─ Título · Etiqueta HTML: p · Clases: jm-label-sm · Texto: «Certificados»
      └─ Lista de iconos · Disposición: En línea · Clases: jm-garantias__sellos-lista
           Elementos (sin icono): «ISO 9001» · «ISO 14001» · «ISO 45001» · «IPAF» ·
           «AENOR · UNE 58923» · «AENOR · UNE 58451»
```

### S4 · Necesidades (las seis familias)

Seis tarjetas nativas: cada una es un contenedor con etiqueta HTML `a`
(*Diseño → Etiqueta HTML: a* y su *Enlace*). El dibujo es el SVG de la familia
subido al widget Icono.

```
Contenedor · section · Ancho completo · Clases: jm-necesidades jm-seccion
│  Avanzado → ID CSS: familias
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-pila
   ├─ Contenedor · Ancho completo · Clases: jm-cabecera-seccion
   │  ├─ Contenedor · Ancho completo · Clases: jm-cabecera-seccion__texto
   │  │  │  Atributos: data-revelar|
   │  │  ├─ Título · p · Clases: jm-label · «Catálogo de alquiler»
   │  │  ├─ Título · h2 · Clases: jm-display-2 jm-tinta jm-mt-3 jm-ch-28
   │  │  │    «Dinos qué tienes que hacer. Nosotros ponemos la máquina.»
   │  │  └─ Editor de texto · Clases: jm-lede jm-texto-2 jm-mt-4 jm-ch-52 jm-hereda
   │  │       «Seis familias y [jm_cifra que="referencias"] referencias en un solo catálogo,
   │  │       filtrable por altura, carga, alimentación y terreno.»
   │  └─ Botón · Clases: jm-btn jm-btn--enlace
   │       «Ver el catálogo completo» · Enlace: /alquiler/ · Icono: arrow-right, Después
   └─ Contenedor · Ancho completo · Clases: jm-celdas jm-necesidades__rejilla
      │  Atributos: data-escalonar|
      └─ (×6, en este orden) Contenedor · Etiqueta HTML: a · Enlace: /alquiler/{slug}/ · Clases: jm-necesidad
         ├─ Icono · Clases: jm-necesidad__icono · SVG: maquina-{icono}.svg
         ├─ Contenedor · Ancho completo · Clases: jm-necesidad__cuerpo
         │  ├─ Título · span · Clases: jm-title jm-necesidad__titulo · {necesidad}
         │  ├─ Editor de texto · Clases: jm-necesidad__texto jm-hereda · {descripción}
         │  └─ Editor de texto · Clases: jm-meta jm-necesidad__meta jm-hereda
         │       «{rango} · [jm_cifra que="familia" familia="{slug}" plural="referencia,referencias"]»
         └─ Icono · Clases: jm-necesidad__flecha · SVG: lucide-arrow-right.svg
```

| # | slug (enlace /alquiler/{slug}/) | icono | Título | Texto | Rango |
|---|---|---|---|---|---|
| 1 | `elevacion` | `maquina-tijera.svg` | Trabajos en altura | Equipos para llegar donde el trabajo te necesita, desde espacios reducidos hasta grandes alturas. | Desde 4,5 m hasta 57 m |
| 2 | `manutencion` | `maquina-manipulador.svg` | Mover y elevar cargas | Carretillas y manipuladores para transportar, elevar y posicionar cargas con mayor eficacia. | Hasta 7.000 kg y 21 m |
| 3 | `movimiento-tierras` | `maquina-excavadora.svg` | Excavar, mover tierra y compactar | Equipos para excavar, cargar, desplazar, preparar el terreno y compactarlo. | De 1,2 a 19 toneladas |
| 4 | `energia` | `maquina-grupo.svg` | Energía e iluminación | Grupos electrógenos y torres de luz para llevar suministro allí donde la red no llega. | De 5 a 300 kVA |
| 5 | `aire-martillos` | `maquina-compresor.svg` | Aire y demolición | Compresores, picadores y rompedores para cuando el trabajo pide potencia. | De 2 a 11 m³/min |
| 6 | `herramienta-auxiliar` | `maquina-herramienta.svg` | Herramienta de obra | Corte, perforación, demolición ligera y nivelación para cerrar el trabajo que la máquina grande no hace. | Demolición, corte y perforación |

(Los textos coinciden con los campos `jm_necesidad`, `jm_necesidad_desc` y
`jm_rango` de cada término de *Familia*; si el cliente los cambia allí, hay
que cambiarlos aquí también.)

### S5 · Asesor empotrado

```
Contenedor · section · Ancho completo · Clases: jm-asesor-banda jm-ambiente-oscuro jm-oscuro jm-seccion
│  Avanzado → ID CSS: asesor
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-pila
   ├─ Contenedor · Ancho completo · Clases: jm-asesor-banda__cabeza
   │  │  Atributos: data-revelar|
   │  ├─ Título · h2 · Clases: jm-display-2 jm-asesor-banda__titulo
   │  │    «No sabes qué máquina pedir. Normal.»
   │  └─ Editor de texto · Clases: jm-lede jm-asesor-banda__lede jm-hereda
   │       «Contesta tres preguntas sobre el trabajo que tienes delante y te decimos qué
   │       equipos de nuestro parque encajan, y por qué.»
   └─ Shortcode · [jm_asesor variante="portada"]
```

El panel (barra de estado, tres selectores dependientes, ayudas y resultado)
lo pinta `31-asesor.js` con el motor `asesor-motor.js`, que encola el propio
shortcode. En portada el estado es local (no toca la URL).

### S6 · Destacadas (con ficha y foto oficial)

```
Contenedor · section · Ancho completo · Clases: jm-destacadas jm-seccion
│  Atributos: data-jm|destacadas
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-pila
   ├─ Contenedor · Ancho completo · Clases: jm-cabecera-seccion jm-cabecera-seccion--4
   │  ├─ Contenedor · Ancho completo · Clases: jm-cabecera-seccion__texto
   │  │  │  Atributos: data-revelar|
   │  │  ├─ Título · p · Clases: jm-label · «Con ficha y foto oficial»
   │  │  ├─ Título · h2 · Clases: jm-display-2 jm-tinta jm-mt-3 jm-ch-24
   │  │  │    Etiqueta dinámica Shortcode: [jm_cifra que="destacadas"]
   │  │  │    Después: « máquinas que puedes decidir sin llamar»
   │  │  └─ Editor de texto · Clases: jm-lede jm-texto-2 jm-mt-4 jm-ch-52 jm-hereda
   │  │       «Fotografía de nuestra propia flota y ficha técnica del fabricante, para comparar
   │  │       cifras antes de pedir nada.»
   │  └─ Contenedor · Ancho completo · Dirección: fila · Clases: jm-destacadas__acciones
   │     └─ Botón · Clases: jm-btn jm-btn--enlace
   │          «Ver todo el catálogo» · Enlace: /alquiler/ · Icono: arrow-right, Después
   │     (el JS inserta delante las flechas «Ver las anteriores» / «Ver las siguientes», ≥ 768 px)
   ├─ Loop Carousel · Clases: jm-destacadas__carrusel
   │    Plantilla: «Tarjeta de máquina» (estructura/21-loop-tarjeta-maquina.md, raíz jm-tarjeta-maquina)
   │    Consulta → Fuente: Máquinas · ID de consulta: jm_destacadas · Entradas por página: 0 (todas)
   │    Diapositivas visibles: 3,5 escritorio / 2,2 tableta / 1,15 móvil (o 3 / 2 / 1 si no admite decimales)
   │    Diapositivas a desplazar: 1 · Espacio entre diapositivas: 20
   │    Flechas: Sí (se ocultan por CSS; las mueve el par de la cabecera) · Paginación: Ninguna
   │    Reproducción automática: No · Bucle: No
   └─ Título · p · Clases: jm-label-sm jm-destacadas__pie jm-solo-movil
        «Arrastra para ver el resto»
```

### S7 · Cobertura

```
Contenedor · section · Ancho completo · Clases: jm-cobertura jm-ambiente-oscuro jm-oscuro jm-seccion
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-pila
   ├─ Contenedor · Ancho completo · Clases: jm-cobertura__rejilla
   │  ├─ Contenedor · Ancho completo · Clases: jm-cobertura__texto
   │  │  ├─ Contenedor · Ancho completo · Clases: jm-cabecera-seccion__texto
   │  │  │  │  Atributos: data-revelar|
   │  │  │  ├─ Título · p · Clases: jm-label · «Cobertura ibérica»
   │  │  │  ├─ Título · h2 · Clases: jm-display-2 jm-mt-3 jm-ch-22
   │  │  │  │    «Más cerca de donde empieza el trabajo»
   │  │  │  └─ Editor de texto · Clases: jm-lede jm-mt-4 jm-ch-52 jm-hereda
   │  │  │       «Cuando pides una máquina la confirma una persona de la delegación que la
   │  │  │       tiene, no un formulario automático. <span class="jm-texto-inv">[jm_dato clave="lema"]</span>»
   │  │  │       (en la pestaña Código del editor; el lema hoy es «Llegamos lejos para estar cerca.»)
   │  │  ├─ Shortcode · [jm_delegaciones_lista]
   │  │  └─ Contenedor · Ancho completo · Clases: jm-cobertura__botones
   │  │     ├─ Botón · Clases: jm-btn jm-btn--acento
   │  │     │    «Consultar disponibilidad» · Enlace: /consultar-disponibilidad/ · Sin icono
   │  │     └─ Botón · Clases: jm-btn jm-btn--enlace jm-enlace-claro
   │  │          «Direcciones y teléfonos» · Enlace: /delegaciones/ · Icono: arrow-right, Después
   │  └─ Contenedor · Ancho completo · Clases: jm-cobertura__mapa      ← va primero en móvil
   │     │  Atributos: data-revelar|escala
   │     └─ Shortcode · [jm_mapa tono="oscuro"]
   └─ Editor de texto · Clases: jm-cobertura__pie jm-hereda
        «No publicamos horarios que no podamos garantizar: llama a la delegación y te lo
        confirmamos en el momento.»
```

### S8 · Autoridad

```
Contenedor · section · Ancho completo · Clases: jm-autoridad jm-seccion
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-pila
   ├─ Contenedor · Ancho completo · Clases: jm-autoridad__rejilla
   │  ├─ Contenedor · Ancho completo · Clases: jm-autoridad__texto
   │  │  │  Atributos: data-revelar|
   │  │  ├─ Título · p · Clases: jm-label jm-acento · «Garantía técnica y solvencia»
   │  │  ├─ Título · h2 · Clases: jm-display-2 jm-tinta jm-mt-3 jm-ch-24
   │  │  │    «La máquina importa. Lo que hay detrás, todavía más.»
   │  │  ├─ Editor de texto · Clases: jm-lede jm-texto-2 jm-mt-4 jm-ch-54 jm-hereda
   │  │  │    «Una obra, una instalación o una línea de producción no pueden depender solo de
   │  │  │    una ficha técnica. Detrás del equipo necesitas experiencia, mantenimiento y gente
   │  │  │    que sepa de maquinaria.»
   │  │  └─ Contenedor · Ancho completo · Clases: jm-celdas jm-autoridad__cifras
   │  │     └─ (×4) Contenedor · Clases: jm-autoridad__cifra
   │  │        ├─ Título · span · Clases: jm-label-sm · {rótulo}
   │  │        └─ Título · span · Clases: jm-value-lg · etiqueta dinámica Shortcode {cifra}
   │  │        Rótulos y cifras, en orden:
   │  │          «Equipos en flota»         [jm_cifra que="equipos"]
   │  │          «Referencias en catálogo»  [jm_cifra que="referencias"]
   │  │          «Delegaciones propias»     [jm_cifra que="delegaciones"]
   │  │          «Familias de maquinaria»   [jm_cifra que="familias"]
   │  └─ Contenedor · Ancho completo · Clases: jm-autoridad__tarjeta jm-ambiente-oscuro jm-oscuro
   │     │  Atributos: data-revelar|escala
   │     ├─ Contenedor · Ancho completo · Clases: jm-autoridad__tarjeta-cabeza
   │     │  ├─ Título · p · Clases: jm-label-sm · «Experiencia acumulada»
   │     │  ├─ Shortcode · Clases: jm-autoridad__antiguedad
   │     │  │    [jm_antiguedad]           (de 60-global.php; 10-global.js pinta «39 años · 6 meses · 19 días»)
   │     │  └─ Título · p · Clases: jm-value jm-autoridad__desde
   │     │       «desde el 24 · 03 · 1987»
   │     ├─ Editor de texto · Clases: jm-autoridad__parrafo jm-hereda
   │     │    «[jm_dato clave="razon_social"] nació en Avilés como taller de manutención y hoy
   │     │    alquila, vende y mantiene maquinaria en toda la península.»
   │     └─ Botón · Clases: jm-btn jm-btn--enlace jm-enlace-claro
   │          Texto: etiqueta dinámica Shortcode [jm_cifra que="delegaciones"]
   │                 Antes: «Ver las » · Después: « delegaciones»
   │          Enlace: /delegaciones/ · Icono: arrow-right, Después
   ├─ Contenedor · Ancho completo · Clases: jm-celdas jm-autoridad__pilares
   │  │  Atributos: data-escalonar|
   │  └─ (×4) Contenedor · Clases: jm-pilar
   │     ├─ Icono · Clases: jm-icono-linea · {svg}
   │     ├─ Título · h3 · Clases: jm-title jm-pilar__titulo · {título}
   │     ├─ Editor de texto · Clases: jm-pilar__texto jm-hereda · {texto}
   │     └─ Título · p · Clases: jm-label-sm jm-pilar__pie · {pie}
   └─ Contenedor · Ancho completo · Clases: jm-tira-fabricantes jm-autoridad__fabricantes
      ├─ Título · h3 · Clases: jm-label · «Nuestros fabricantes»
      └─ Shortcode · [jm_fabricantes variante="autoridad"]
```

| Pilar | Icono | Título | Texto | Pie |
|---|---|---|---|---|
| 1 | `lucide-clock.svg` | «Desde 1987» | Empezamos en Avilés y hoy servimos desde nueve delegaciones propias. Décadas junto a profesionales que necesitan maquinaria para avanzar sin contratiempos. | Solidez empresarial |
| 2 | `lucide-wrench.svg` | «Servicio técnico propio» | Mecánicos, taller y furgones de asistencia móvil. Una incidencia con la máquina no debería convertirse en un problema mayor. | Talleres y unidades móviles |
| 3 | `lucide-shield-check.svg` | «Procesos certificados» | Gestión auditada según ISO 9001, 14001 y 45001, con revisión del equipo antes de cada salida. | ISO 9001 · ISO 14001 · ISO 45001 |
| 4 | `lucide-award.svg` | «Marcas de referencia» | Genie, JLG, Haulotte, Manitou, Takeuchi, JCB, Bomag, Hamm, Atlas Copco. Y partner oficial de Jungheinrich en manutención. | Flota de marca oficial |

### S10 · Cierre

```
Contenedor · section · Ancho completo · Clases: jm-cierre jm-oscuro       ← filete ámbar arriba (CSS)
└─ Contenedor · Ancho completo · Clases: jm-contenedor jm-seccion-sm jm-cierre__cuerpo
   ├─ Título · p · Clases: jm-label · «Sin compromiso»
   ├─ Título · h2 · Clases: jm-display-2 jm-cierre__titulo
   │    «Dinos qué necesitas y qué día. Te confirmamos disponibilidad.»
   ├─ Editor de texto · Clases: jm-lede jm-cierre__lede jm-hereda
   │    «Confirmamos disponibilidad, transporte y condiciones contigo antes de formalizar nada.
   │    Sin pasarela de pago y sin letra pequeña.»
   └─ Contenedor · Ancho completo · Clases: jm-cierre__botones
      ├─ Botón · Clases: jm-btn jm-btn--acento jm-btn--lg
      │    «Consultar disponibilidad» · Enlace: /consultar-disponibilidad/ · Sin icono
      └─ Botón · Clases: jm-btn jm-btn--lg jm-cierre__tel
           Texto: etiqueta dinámica Shortcode [jm_dato clave="telefono"]
           Enlace: etiqueta dinámica Shortcode [jm_dato clave="tel"] con Antes: «tel:»
           Icono: lucide-phone.svg · Posición: Antes
```

## Qué es nativo y qué no

| Pieza | Cómo | Por qué no es nativa (si no lo es) |
|---|---|---|
| Textos, titulares, botones, fotos y las seis tarjetas de familia | Widgets nativos | — |
| Carrusel del hero | Contenedores nativos + `30-hero.js` | Ningún widget hace cortina + barra-temporizador + `inert`; el JS solo orquesta. |
| Buscador `[jm_buscador]` | Shortcode | Formulario GET con `datalist` de subcategorías y atajos: el widget Formulario no hace GET ni datalist. |
| Próxima convocatoria `[jm_proxima_convocatoria]` | Shortcode + JS | La convocatoria se elige en el navegador con su fecha (la página puede venir de caché). |
| Cifras `[jm_cifra]` | Shortcode en texto / etiqueta dinámica | Se cuentan de las entradas: cambian solas al añadir máquinas o delegaciones. |
| Asesor `[jm_asesor]` | Shortcode + motor + JS | Lógica de recomendación de la web Next compilada. |
| Destacadas | **Loop Carousel nativo** + consulta `jm_destacadas` | Solo las flechas de cabecera las añade el JS. |
| Rejilla de delegaciones `[jm_delegaciones_lista]` | Shortcode | Celda compacta con insignia «PT» condicional y teléfono enlazado; excluye la sede de formación, que también es una entrada `delegacion`. |
| Mapa `[jm_mapa]` | Shortcode | SVG en línea con sus etiquetas y su `aria-label`. |
| Antigüedad `[jm_antiguedad]` | Shortcode de 60-global | Se cuenta en el navegador cada día. |
| Fabricantes `[jm_fabricantes]` | Shortcode | Lista de `empresa.json` (con su área en `title`). |

## Lista de comprobación

- [ ] Página «Inicio» con plantilla *Elementor Ancho completo* y fijada como portada.
- [ ] Todos los contenedores en *Ancho completo*; nada en Estilo ni en Efectos de movimiento.
- [ ] Hero: `data-jm|hero` en la sección, `data-jm-portada|…` en las dos portadas y `jm-hero__portada--inicial` solo en la primera.
- [ ] Pasa el ratón por el hero: la barra roja se detiene. Escribe en el buscador: también.
- [ ] Al acabar los 8 s entra Formación con cortina y cuchilla; «Siguiente: Alquiler» cambia de rótulo.
- [ ] Con *reducir movimiento* en el sistema: no avanza solo y no hay cortina.
- [ ] El buscador sin texto lleva a `/alquiler/` (sin `?q=`); con texto, a `/alquiler/?q=…`.
- [ ] La tarjeta «Próxima convocatoria» muestra una fecha ≥ hoy (se oculta si no hay ninguna).
- [ ] El asesor: el segundo selector arranca bloqueado con «Contesta primero qué trabajo tienes»; al contestar las tres aparece el resultado y el foco va al titular.
- [ ] Destacadas: las flechas de la cabecera mueven el carrusel; en móvil se lee «Arrastra para ver el resto».
- [ ] Cobertura: 9 celdas (sin la sede de formación), Oporto y Lisboa con «PT»; en móvil el mapa va arriba.
- [ ] Autoridad: la antigüedad pasa de «39 años» a «39 años · 6 meses · 19 días» al cargar.
- [ ] El cierre tiene el filete ámbar arriba y el teléfono enlaza a `tel:+34…`.
