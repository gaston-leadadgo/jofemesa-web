# Fotografía de ambiente

Se deja el archivo en su carpeta con el nombre exacto de esta tabla y
**aparece solo**. No hay que tocar código: `src/lib/img/ambiente.ts`
comprueba en tiempo de compilación qué hay aquí, así que lo que falta no
se dibuja y la página sigue funcionando igual.

Se aceptan `.jpg`, `.jpeg`, `.webp` y `.png`. Si hay dos con el mismo
nombre gana el `.webp`.

Después de dejar los archivos hay que recompilar (`npm run build`) para
que se detecten.

## Dónde va cada una

| Archivo | Dónde sale | Medida | Encuadre |
|---|---|---|---|
| `hero/portada.jpg` | Portada, a sangre detrás del titular | 2560 × 1440 (16:9) | **Mitad izquierda libre**: ahí va el texto |
| `servicios/portada.jpg` | Cabecera de `/servicios` | 2560 × 1000 (~21:9) | Tercio izquierdo libre |
| `servicios/venta.jpg` | Bloque «Venta de maquinaria y recambios» | 1600 × 1067 (3:2) | Centrado |
| `servicios/mantenimiento.jpg` | Bloque «Mantenimiento y taller propio» | 1600 × 1067 (3:2) | Centrado |
| `servicios/transporte.jpg` | Bloque «Transporte y entrega en obra» | 1600 × 1067 (3:2) | Centrado |
| `servicios/formacion.jpg` | Bloque «Formación de operadores» | 1600 × 1067 (3:2) | Centrado |
| `familias/elevacion.jpg` | Cabecera de `/alquiler/elevacion` | 2560 × 1000 (~21:9) | Tercio izquierdo libre |
| `familias/manutencion.jpg` | `/alquiler/manutencion` | 2560 × 1000 | Tercio izquierdo libre |
| `familias/movimiento-tierras.jpg` | `/alquiler/movimiento-tierras` | 2560 × 1000 | Tercio izquierdo libre |
| `familias/energia.jpg` | `/alquiler/energia` | 2560 × 1000 | Tercio izquierdo libre |
| `familias/aire-martillos.jpg` | `/alquiler/aire-martillos` | 2560 × 1000 | Tercio izquierdo libre |
| `familias/herramienta-auxiliar.jpg` | `/alquiler/herramienta-auxiliar` | 2560 × 1000 | Tercio izquierdo libre |

El nombre de las familias es **el mismo slug que la URL**. Si algún día
se añade una familia, su foto se llama igual que su slug.

## Lo que NO va aquí

Fotografía de **producto**: la tarjeta y la ficha de una máquina solo
llevan fotos de unidades reales de la flota, y viven en
`public/img/maquinas/oficial/`. Las 118 referencias sin fotografía salen
con dibujo técnico a propósito.

La diferencia no es de estilo, es de lo que la imagen afirma. Una foto de
producto dice «esta es la máquina que te vamos a servir»; una de ambiente
dice «así es el trabajo». Una imagen genérica en una tarjeta de producto
sería una afirmación falsa, y es la razón por la que se retiraron las 57
fotos de Wikimedia.

Por eso el `alt` de estas imágenes es vacío (`alt=""`, decorativo) o
genérico: nunca dice «nuestra máquina».
