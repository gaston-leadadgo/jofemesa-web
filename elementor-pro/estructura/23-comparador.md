# 23 · Comparador (/comparador/) y bandeja

Traducción de `src/app/(site)/comparador/page.tsx`, `@modal/(.)comparador`,
`components/comparador/*` y `lib/compare/*`. Estilos: `42-comparador.css`.
Comportamiento: `42-comparador.js` (+ `44-modal.js`). PHP: `70-catalogo.php`.

## Cómo funciona

- **La bandeja** (máx. 4 máquinas) vive en `localStorage` (`jm:comparador`) y
  se sincroniza entre pestañas. La pinta el plugin en `wp_footer` en todas
  las páginas salvo /comparador/: barra oscura fija abajo (encima de la barra
  móvil), miniaturas con ✕, «Vaciar» y «Comparar (n) →». No se monta nada.
- **«Comparar»** de la bandeja lleva a `/comparador/?m=a,b,c` y se abre en
  **modal** sobre la página («Comparador de maquinaria», sin «Abrir la ficha»).
  Al recargar o compartir el enlace se sirve la página completa.
- **La URL manda**: con `?m=` se comparan esas; sin `?m=`, las de la bandeja.
  Cada cambio se refleja en `?m=` (coma legible para WhatsApp).
- La tabla la genera el servidor (`[jm_comparador]`) y, al añadir o quitar, el
  JS la vuelve a pedir a `admin-ajax.php?action=jm_comparador&m=…`.
- Filas: todas las de `specdefs.json` en las que alguna máquina tenga dato
  real. Mejor valor por fila según `mejor` (mayor/menor), con subrayado y
  la palabra «Máx.» / «Mín.». Primera columna fija; en móvil se avanza
  máquina a máquina (scroll-snap). «Imprimir la comparación» → A4 apaisado.

## Dónde se crea

**Páginas → Añadir nueva** · «Comparador de maquinaria» · slug `comparador` ·
Plantilla **Elementor Ancho completo**. Recomendado: *noindex* (Rank Math/Yoast),
como el original.

## Árbol de montaje

```
Contenedor · div · Ancho completo · Clases: jm-contenedor jm-comparador-pagina
├─ Título · h1 · Clases: jm-label jm-comparador-pagina__titulo · «Comparador de maquinaria»
└─ Contenedor · div · Ancho completo · Clases: jm-comparador-cuerpo
   │  Atributos: data-jm-modal-contenido|  ·  data-jm-modal-titulo|Comparador de maquinaria  ·  data-jm-modal-enlace|
   └─ Shortcode · [jm_comparador]
```

`[jm_comparador]` (sin atributos) pinta: el buscador «Añadir máquina a la
comparación (n/4)» (lista con las 145, se filtra al escribir «4390» o
«tijera diésel»; con 4 dice «Ya tienes 4 máquinas…»), «Imprimir la
comparación», «Vaciar», la tabla (foto, subcategoría, marca, modelo,
«Consultar disponibilidad», «Quitar») y al pie «Consultar disponibilidad de
las N» o «Añade al menos una máquina más…». Sin máquinas: el estado vacío
«Marca dos o más máquinas para compararlas.» con «Ir al catálogo».

Por qué no es nativo: tabla de dimensiones variables (1–4 columnas × filas
que dependen de las máquinas) con cálculo del mejor valor; ningún widget lo hace.

## Lista de comprobación

- [ ] Marcar 2 máquinas en el catálogo → aparece la bandeja «Comparar 2/4».
- [ ] La quinta casilla queda bloqueada con el aviso «Máximo 4 máquinas…».
- [ ] «Comparar» abre el modal; Atrás lo cierra y la bandeja vuelve.
- [ ] `/comparador/?m=jlg-nano-sp-plus,genie-gr-15` en otra ventana muestra esas dos.
- [ ] Altura de trabajo: la mayor lleva subrayado y «Máx.»; Anchura: la menor lleva «Mín.».
- [ ] Añadir desde el buscador actualiza tabla y `?m=`; «Quitar» y «Vaciar» también.
- [ ] Imprimir: sin cabecera, pie, bandeja ni botones.
- [ ] En /comparador/ no aparece la bandeja.
