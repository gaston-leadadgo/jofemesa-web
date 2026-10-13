# 50 · Delegaciones (`/delegaciones/`)

Traducción de `src/app/(site)/delegaciones/page.tsx` y `src/lib/utils/maps.ts`.
Estilos: `assets/css/10-placa.css`, `assets/css/60-paginas.css`. Shortcodes: `includes/76-paginas.php`
(+ `[jm_mapa]` de `includes/65-inicio.php`). Los datos son las entradas **Delegaciones**
(importadas de `empresa.json → puntosContacto`, con la sede de Formación incluida).

## Dónde se crea

1. **Loop Item «Delegación · tarjeta»** (Theme Builder → Loop Item; vista previa: Delegaciones).
2. **Página** «Delegaciones» · slug `delegaciones` · Plantilla **Elementor Ancho completo**.

## A · Loop Item «Delegación · tarjeta»

```
Contenedor · article · Clases: jm-deleg
├─ Contenedor · Clases: jm-deleg__cuerpo
│  ├─ Contenedor · Dirección fila · Clases: jm-deleg__cabeza
│  │  ├─ Contenedor · Clases: jm-deleg__nombre-caja
│  │  │  ├─ Shortcode · [jm_delegacion_provincia]             ← «Setúbal» sobre «Lisboa»; nada si coincide
│  │  │  └─ Título · h3 · Clases: jm-display-3 jm-deleg__nombre · Etiqueta dinámica: Título de la entrada
│  │  └─ Shortcode · [jm_delegacion_insignia] · Clases: jm-deleg__insignias   ← «Central» / «Sede» + ancla #slug
│  └─ Contenedor · Clases: jm-deleg__dl
│     ├─ Contenedor · Dirección fila · Clases: jm-fila-icono
│     │  ├─ Icono · Clases: jm-fila-icono__i · FA «map-marker-alt»
│     │  └─ Contenedor · Clases: jm-fila-icono__dd
│     │     ├─ Título · span · Clases: jm-sr · «Dirección»
│     │     ├─ Título · p · Clases: jm-deleg__direccion · ACF Field → jm_direccion
│     │     ├─ Contenedor · Dirección fila · Clases: jm-deleg__cp-loc
│     │     │  ├─ Título · span · Clases: jm-deleg__cp · ACF Field → jm_cp
│     │     │  └─ Título · span · ACF Field → jm_localidad
│     │     └─ Botón · Clases: jm-btn jm-deleg__llegar · «Cómo llegar»
│     │          Enlace: Etiqueta dinámica **ACF URL Field → jm_maps** · Abrir en pestaña nueva
│     │          Icono FA «location-arrow» · Antes
│     └─ Shortcode · [jm_delegacion_contacto]                ← Teléfono, Correo y Horario
└─ Shortcode · [jm_delegacion_servicios] · (dentro de jm-deleg__cuerpo, tras jm-deleg__dl)
Shortcode · [jm_delegacion_boton] · Clases: jm-deleg__pie   ← último hijo de jm-deleg
```

(Orden real de hijos de `jm-deleg`: `jm-deleg__cuerpo` [cabeza, dl, servicios] y después el botón.)

| Pieza no nativa | Motivo |
|---|---|
| `[jm_delegacion_provincia]` | Se rotula solo cuando no repite el nombre (evita «Madrid / Madrid»). |
| `[jm_delegacion_insignia]` | «Central» (jm_central) o «Sede» (jm_tipo = Sede de formación), y el ancla `#slug` a la que redirige la URL de cada delegación (resalta la tarjeta). |
| `[jm_delegacion_contacto]` | Enlaces `tel:`/`mailto:` construidos con los campos (una etiqueta de enlace no admite prefijo) y el horario con su texto por defecto «Llámanos y te confirmamos el horario». |
| `[jm_delegacion_servicios]` | Lista de píldoras a partir de `jm_servicios` (una por línea). |
| `[jm_delegacion_boton]` | «Pedir máquina en {nombre}» → `/consultar-disponibilidad/?del={slug}`; en la sede de Formación, «Ver cursos y convocatorias» (negro) → `/formacion/`. |

## B · Página

```
① CABECERA (placa sin foto, con mapa a la derecha)
Contenedor · section · Clases: jm-placa
├─ HTML · Clases: jm-placa__galon · (el SVG del galón, ver 30-servicios.md)
└─ Contenedor · jm-contenedor jm-placa__cuerpo
   └─ Contenedor · jm-placa__rejilla
      ├─ Contenedor · jm-placa__texto
      │  ├─ Título · p · jm-label jm-placa__kicker · «Cobertura territorial ibérica»
      │  ├─ Título · h1 · jm-titular-placa jm-placa__titulo · data-revelar| · «9 delegaciones propias y una sede de formación»
      │  ├─ Editor de texto · jm-placa__lede jm-hereda · data-revelar| style|--retardo:1
      │  │    «Flota, taller y camiones propios en cada una. Llegamos lejos para estar cerca. Si tu obra está lejos
      │  │     de todas ellas, tenemos rutas de transporte diarias entre delegaciones: llámanos y te decimos plazo.»
      │  └─ Contenedor · jm-placa__botones · data-revelar| style|--retardo:2
      │     └─ Botón · jm-btn jm-btn--acento · «Pedir una máquina» · /consultar-disponibilidad/ · arrow-right Después
      └─ Contenedor · Clases: jm-placa__aside jm-deleg-aside · Atributos: data-revelar|escala
         ├─ Shortcode · [jm_mapa tono="oscuro" animado="1"]
         └─ Contenedor · Clases: jm-deleg-cifras
            ├─ Contenedor · jm-deleg-cifras__item → Título p jm-deleg-cifras__v «7» · Título p jm-label-sm jm-deleg-cifras__k «España»
            ├─ Contenedor · jm-deleg-cifras__item → «2» · «Portugal»
            └─ Contenedor · jm-deleg-cifras__item → «1» · «Sede formación»

② ESPAÑA
Contenedor · section · Clases: jm-seccion jm-borde-abajo
└─ Contenedor · jm-contenedor
   ├─ Título · h2 · jm-display-3 jm-deleg-grupo__titulo · data-revelar| · «España»
   └─ Loop Grid · Clases: jm-deleg-rejilla · Plantilla «Delegación · tarjeta»
        ID de consulta: jm_delegaciones_espana · Elementos: 20 · Sin paginación

③ PORTUGAL  (igual, título «Portugal», ID de consulta jm_delegaciones_portugal)

④ OTROS CENTROS
Contenedor · section · Clases: jm-seccion
└─ Contenedor · jm-contenedor
   ├─ Título · h2 · jm-display-3 · «Otros centros»
   ├─ Título · p · jm-centros__intro · «Con teléfono y correo propios; también figura en nuestro catálogo general.»
   └─ Contenedor · jm-centros
      └─ Contenedor · jm-centro
         ├─ Título · h3 · jm-title jm-centro__titulo · «Distribuidor oficial Takeuchi»
         ├─ Editor de texto · jm-centro__dir jm-hereda
         │    «Polígono Industrial Las Fronteras, C/ Mar Mediterráneo, 1<br><span class="jm-value">28830</span> San Fernando de Henares, Madrid»
         ├─ Lista de iconos · jm-enlace-tel jm-centro__tel · FA phone · «680 800 215» · tel:+34680800215
         └─ Título · p · jm-enlace-correo jm-centro__correo · «ventastakeuchi@jofemesa.com» · mailto:
```

## Lista de comprobación

- [ ] La sede de Formación tiene `jm_pais` = España y `jm_orden` entre Málaga y Oporto: sale 8.ª en España con la insignia «Sede» y botón negro.
- [ ] Con 8 tarjetas en España, a ≥ 1440 px la última ocupa dos columnas (como el original).
- [ ] `/delegacion/sevilla/` redirige a `/delegaciones/#sevilla`, baja a la tarjeta y la tiñe de rojo suave.
- [ ] «Cómo llegar» abre Google Maps en pestaña nueva.
- [ ] El mapa de la cabecera se anima al cargar (y queda quieto con «reducir movimiento»).
