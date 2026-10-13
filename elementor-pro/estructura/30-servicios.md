# 30 · Servicios (`/servicios/`)

Traducción de `src/app/(site)/servicios/page.tsx` y `src/content/es/servicios.ts`.
Estilos: `assets/css/10-placa.css` y `assets/css/60-paginas.css`. Todo nativo salvo el mapa
(`[jm_mapa]`, de `includes/65-inicio.php`).

## Dónde se crea

**Páginas → Añadir nueva** · «Servicios» · slug `servicios` · Plantilla **Elementor Ancho completo**.

Sube a **Medios**:
- `recursos/imagenes/jungheinrich.webp` (alt «Partner oficial de Jungheinrich»).
- Los dibujos `plugin/jofemesa-core/assets/iconos/maquina-carretilla.svg`, `maquina-herramienta.svg`,
  `maquina-camion.svg`, `maquina-columna.svg` (para el widget Icono → *Subir SVG*).

> Las fotos de bloque y de cabecera (`public/img/servicios/*.jpg`) **no existen** en la web Next,
> que por eso pinta la cabecera sin foto (con el galón) y los bloques sin foto. Cuando lleguen,
> añade en la placa la Imagen `jm-fondo-img jm-placa__foto` + el HTML `jm-placa__velo` (quitando
> el galón) y, en cada bloque, una Imagen arriba de la columna derecha.

## Árbol de montaje

```
① CABECERA (placa sin foto)
Contenedor · section · Clases: jm-placa
├─ HTML · Clases: jm-placa__galon
│    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M20 10 L110 100 L20 190" stroke="currentColor" stroke-width="26"/><path d="M90 10 L180 100 L90 190" stroke="currentColor" stroke-width="26"/></svg>
└─ Contenedor · Clases: jm-contenedor jm-placa__cuerpo
   └─ Contenedor · Clases: jm-placa__rejilla
      ├─ Contenedor · Clases: jm-placa__texto
      │  ├─ Título · p · jm-label jm-placa__kicker · «Servicios integrales de soporte»
      │  ├─ Título · h1 · jm-titular-placa jm-placa__titulo · data-revelar| · «Respaldo técnico, transporte y formación»
      │  ├─ Editor de texto · jm-placa__lede jm-hereda · data-revelar| style|--retardo:1
      │  │    «No solo alquilamos. Vendemos carretillas y recambios, mantenemos maquinaria de cualquier marca,
      │  │     la llevamos a pie de obra y formamos a quien la va a manejar.»
      │  └─ Contenedor · jm-placa__botones · data-revelar| style|--retardo:2
      │     └─ Botón · jm-btn jm-btn--acento · «Pedir información» · /consultar-disponibilidad/?asunto=servicios · arrow-right Después
      └─ Contenedor · Clases: jm-placa__datos · Atributos: data-escalonar|
         ├─ Contenedor · jm-placa__dato → Título p jm-placa__dato-k «Servicios» · Título p jm-placa__dato-v «4»
         ├─ Contenedor · jm-placa__dato → «Talleres propios» · «2»
         └─ Contenedor · jm-placa__dato → «Homologaciones» · «3»

② ÍNDICE EN TARJETAS
Contenedor · section · Clases: jm-srv-indice-seccion
└─ Contenedor · Clases: jm-contenedor jm-srv-indice
   └─ Contenedor · Clases: jm-srv-indice__rejilla · Atributos: data-escalonar|
      └─ (×4) Contenedor · Etiqueta HTML: a · Enlace: #venta (…) · Clases: jm-srv-tarjeta
         ├─ Contenedor · Dirección fila · jm-srv-tarjeta__cabeza
         │  ├─ Icono · jm-srv-tarjeta__icono · SVG subido (dibujo)
         │  └─ Título · span · jm-srv-tarjeta__num · «01»
         ├─ Título · span · jm-title jm-srv-tarjeta__titulo · EPÍGRAFE
         ├─ Título · span · jm-srv-tarjeta__resumen · RESUMEN
         └─ Título · span · jm-srv-tarjeta__pie · «Ver el detalle»       (la flecha la pone el CSS)

③ BLOQUES (×4, uno por servicio)
Contenedor · section · ID CSS: venta | mantenimiento | transporte | formacion
│  Clases: jm-seccion jm-borde-abajo jm-srv  (+ jm-hundido en el 2.º y el 4.º)
└─ Contenedor · Clases: jm-contenedor
   └─ Contenedor · Clases: jm-srv__rejilla
      ├─ Contenedor · Clases: jm-srv__texto · Atributos: data-revelar|
      │  ├─ Contenedor · Dirección fila · jm-srv__epigrafe
      │  │  ├─ Icono · jm-srv__icono · SVG subido (dibujo)
      │  │  └─ Título · p · jm-label jm-srv__label · EPÍGRAFE
      │  ├─ Título · h2 · jm-display-2 jm-srv__titulo · TÍTULO
      │  ├─ Editor de texto · jm-lede jm-srv__lede jm-hereda · ENTRADILLA
      │  ├─ Lista de iconos · jm-ticks jm-srv__puntos · icono FA «check» en cada punto · PUNTOS
      │  ├─ (solo Formación) Contenedor · jm-srv__homolog
      │  │    (×3) Contenedor · jm-srv__homolog-item → Título p jm-srv__homolog-k · Título p jm-srv__homolog-v
      │  ├─ (solo Formación) Editor de texto · jm-aviso-pendiente jm-srv__aviso jm-hereda · AVISO
      │  └─ Contenedor · jm-srv__ctas
      │     ├─ Botón · jm-btn jm-btn--acento jm-btn--h14 · CTA · ENLACE · arrow-right Después
      │     └─ Botón · jm-btn jm-btn--contorno jm-btn--h14 jm-btn--mono jm-srv__tel
      │          «91 361 31 31» · tel:+34913613131 · FA «phone» Antes
      └─ Contenedor · Clases: jm-srv__lado
         └─ PANELES (ver abajo), cada uno: Contenedor · jm-srv__panel · Atributos: data-revelar|escala

④ CTA FINAL
Contenedor · section · Clases: jm-seccion
└─ Contenedor · Clases: jm-contenedor jm-srv-cta__cuerpo
   ├─ Título · h2 · jm-display-3 · «¿Necesitas un plan a medida para tu empresa?»
   ├─ Editor de texto · jm-lede jm-srv-cta__lede jm-hereda
   │    «Consúltanos sobre transporte agrupado, mantenimiento de flota o convocatorias de formación para grupos de operadores.»
   └─ Botón · jm-btn jm-btn--acento jm-btn--lg jm-srv-cta__boton · «Pedir información de servicios»
        /consultar-disponibilidad/?asunto=servicios · sin icono
```

### Contenido literal de los cuatro servicios

| | Venta | Mantenimiento | Transporte | Formación |
|---|---|---|---|---|
| ID CSS / enlace índice | `venta` | `mantenimiento` | `transporte` | `formacion` |
| Dibujo | maquina-carretilla.svg | maquina-herramienta.svg | maquina-camion.svg | maquina-columna.svg |
| Epígrafe | Venta de maquinaria y recambios | Mantenimiento y taller propio | Logística directa | Formación de operadores |
| Resumen (índice) | Carretillas nuevas y reacondicionadas, y recambios de cualquier marca. | Mecánicos propios y furgones taller que se desplazan al tajo. | Camiones propios y entrega en la franja horaria que acordemos. | Centro homologado IPAF y AENOR para operadores de PEMP y carretillas. |
| Título | También vendemos la máquina, no solo la alquilamos | Servicio técnico propio y asistencia móvil | Transporte y entrega coordinada en obra | Centro de formación homologado |
| CTA | Pedir presupuesto de venta → `/consultar-disponibilidad/?asunto=venta` | Solicitar una intervención → `/consultar-disponibilidad/?asunto=mantenimiento` | Consultar transporte y plazo → `/consultar-disponibilidad/?asunto=transporte` | Consultar convocatorias → `/formacion/#calendario` |

**Entradillas**
- Venta: «Carretillas elevadoras contrapesadas y de almacén, nuevas y reacondicionadas. Y recambios originales para maquinaria de cualquier marca, no solo de la que vendemos.»
- Mantenimiento: «Cada equipo pasa una revisión técnica antes de cada salida. Si durante el trabajo surge una incidencia, nuestros furgones taller se desplazan al tajo para resolverla. También mantenemos la máquina que no has alquilado con nosotros.»
- Transporte: «Flota de camiones propia con rampas, góndolas rebajadas y camiones pluma. Coordinamos la entrega en la franja horaria acordada para que tus operarios tengan la máquina desde el primer minuto.»
- Formación: «Somos centro de formación homologado IPAF y contamos con los certificados de AENOR de formación de operadores de plataformas (UNE 58923) y de carretillas (UNE 58451). Tenemos central de formación propia en San Fernando de Henares.»

**Puntos**
- Venta: «Carretillas contrapesadas y de almacén, nuevas y reacondicionadas» · «Recambios para maquinaria nueva y reacondicionada de cualquier marca» · «Asesoramiento sobre compra o alquiler según el uso real que le vayas a dar»
- Mantenimiento: «Mecánicos propios formados por los fabricantes de nuestra flota» · «Furgones taller equipados para diagnóstico hidráulico y eléctrico» · «Mantenimiento preventivo programado, con histórico de cada intervención» · «Reparación de carretillas, palas, retroexcavadoras y plataformas de cualquier marca»
- Transporte: «Descarga por conductores especializados en maquinaria pesada» · «Puesta en marcha básica y comprobación de mandos en la entrega» · «Retirada coordinada en cuanto termina el periodo de alquiler» · «Rutas propias entre delegaciones de España y Portugal»
- Formación: «Carné IPAF (PAL), reconocido en más de 65 países» · «Certificación AENOR UNE 58923 para operadores de PEMP» · «Certificación AENOR UNE 58451 para operadores de carretillas»

**Homologaciones (Formación)**: «IPAF» / «Centro de formación homologado» · «AENOR · UNE 58923» / «Formación de operadores de PEMP» · «AENOR · UNE 58451» / «Formación de operadores de carretillas».

**Aviso (Formación)**: «El calendario de convocatorias, el catálogo de cursos y la gestión de la bonificación de FUNDAE están en preparación. Mientras tanto, llámanos o escríbenos y te contamos las fechas disponibles.»
> ⚠ Texto literal del original, pero ya **no es cierto**: el calendario y el catálogo existen en `/formacion/`. Recomiendo confirmarlo con el cliente y quitar el aviso o dejar solo la parte de FUNDAE.

### Paneles de la columna derecha

```
VENTA
Contenedor · jm-srv__panel                                  ← credencial
├─ Imagen · jm-srv__logo · jungheinrich.webp (alt «Partner oficial de Jungheinrich»)
└─ Editor de texto · jm-srv__panel-texto jm-hereda
     «Somos partner oficial de Jungheinrich y distribuimos todo su catálogo: contrapesadas eléctricas y diésel,
      mástil retráctil, trilaterales EKX y EFX, preparadoras de pedidos, transpaletas, apiladores y tractores de
      arrastre. También su gama reacondicionada JUNGSTARS.»
Contenedor · jm-srv__panel                                  ← Takeuchi
├─ Título · p · jm-label jm-srv__panel-label · «Distribuidor oficial»
├─ Título · p · jm-title jm-srv__panel-titulo · «Distribuidor oficial Takeuchi»
├─ Título · p · jm-srv__panel-dir · «Polígono Industrial Las Fronteras, C/ Mar Mediterráneo, 1, 28830 San Fernando de Henares, Madrid»
├─ Lista de iconos · jm-enlace-tel jm-srv__panel-tel · FA phone · «680 800 215» · tel:+34680800215
└─ Título · p · jm-enlace-correo jm-srv__panel-correo · «ventastakeuchi@jofemesa.com» · Enlace mailto:ventastakeuchi@jofemesa.com

MANTENIMIENTO
Contenedor · jm-srv__panel
├─ Título · p · jm-label jm-srv__panel-label · «Talleres propios»
├─ Contenedor · jm-srv__talleres
│  ├─ Contenedor · Dirección fila · jm-srv__taller
│  │  ├─ Título · span · jm-srv__taller-nombre · «Madrid»
│  │  └─ Título · span · jm-srv__taller-tel · «91 361 31 31» · Enlace tel:+34913613131
│  └─ Contenedor · Dirección fila · jm-srv__taller
│     ├─ Título · span · jm-srv__taller-nombre · «Sevilla»
│     └─ Título · span · jm-srv__taller-tel · «955 77 63 63» · Enlace tel:+34955776363
└─ Título · p · jm-srv__panel-nota · «Y furgones taller que se desplazan al tajo desde cualquiera de las 9 delegaciones.»

TRANSPORTE
Contenedor · jm-srv__panel
├─ Título · p · jm-label jm-srv__panel-label · «Rutas propias»
├─ Shortcode · [jm_mapa tono="claro"] · Clases: jm-srv__mapa
├─ Título · p · jm-srv__panel-texto · «Camiones propios con base en las 9 delegaciones y rutas diarias entre ellas, también entre España y Portugal.»
└─ Botón · jm-btn jm-btn--enlace jm-srv__panel-enlace · «Ver las delegaciones» · /delegaciones/ · arrow-right Después

FORMACIÓN
Contenedor · jm-srv__panel
├─ Título · p · jm-label jm-srv__panel-label · «Sede de formación»
├─ Título · p · jm-srv__panel-dir jm-srv__panel-dir--ink · «Pol. Ind. Las Fronteras, C/ Mar Mediterráneo, 1»
├─ Título · p · jm-srv__panel-dir · «28830 San Fernando de Henares (Madrid)»
├─ Lista de iconos · jm-enlace-tel jm-srv__panel-tel · FA phone · «649 755 883» · tel:+34649755883
├─ Título · p · jm-enlace-correo jm-srv__panel-correo · «formacion@jofemesa.com» · mailto:formacion@jofemesa.com
└─ Botón · jm-btn jm-btn--enlace jm-srv__panel-enlace · «Ver calendario de convocatorias» · /formacion/
```

## Lista de comprobación

- [ ] IDs CSS de los cuatro bloques (`venta`, `mantenimiento`, `transporte`, `formacion`) y los enlaces del índice a `#…`.
- [ ] Alternancia de fondo: 2.º y 4.º bloque con `jm-hundido`.
- [ ] Los dibujos son SVG subidos en el widget Icono (no imagen).
- [ ] La tarjeta del índice es un contenedor con etiqueta `a` (no metas botones dentro: enlace en enlace).
- [ ] Revisar con el cliente el aviso de formación (desactualizado).
