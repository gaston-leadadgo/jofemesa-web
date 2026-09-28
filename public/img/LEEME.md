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
| `hero/portada.jpg` | Portada 1 del carrusel (Alquiler), a sangre detrás del titular | 2560 × 1440 (16:9) | **Mitad izquierda libre**: ahí va el texto |
| `hero/formacion.jpg` | Portada 2 del carrusel (Formación) y cabecera de `/formacion` | 2560 × 1440 (16:9) | **Mitad izquierda libre**; el motivo entre el 55 % y el 85 % del ancho |
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

## Prompt para `hero/formacion.jpg`

Ya está puesta (28/09/2026, 2560 × 1429, 491 KB). Contraste medido con el
velo en su peor punto: 11,1:1 el titular y 6,8:1 la entradilla. Si se
quita, la portada de Formación vuelve a usar la foto de obra en espejo.

> Fotografía editorial realista, formato horizontal 16:9, 2560×1440. Un
> curso práctico de formación de operadores de maquinaria en el patio de
> una nave industrial, a primera hora de la tarde con luz dorada lateral.
> En el tercio derecho de la imagen, un instructor de unos 45 años con
> casco blanco y chaleco de alta visibilidad rojo señala el panel de
> mandos de una plataforma elevadora de tijera; a su lado, dos alumnos
> —un hombre y una mujer— con casco, arnés anticaídas y chaleco rojo
> atienden. La plataforma, de color gris y rojo, está en posición baja,
> con la cesta a la altura de los hombros. Al fondo, desenfocado, el
> muro de una nave y otra máquina aparcada. Toda la mitad IZQUIERDA de
> la imagen queda en calma y más oscura (pared de nave en sombra,
> asfalto), sin personas ni objetos importantes, porque encima irá texto.
> Acentos de color rojo intenso (#E30613) solo en chalecos y detalles de
> seguridad; el resto en grises industriales y tonos cálidos del
> atardecer. Cámara a la altura de los ojos, objetivo de 35 mm,
> profundidad de campo media, grano fino de película, contraste natural.
> Sin texto, sin logotipos, sin marcas de agua, sin rótulos legibles en
> la ropa ni en la máquina.

Negativo recomendado: texto, letras, logotipos, marcas de agua, manos
deformes, caras distorsionadas, cascos sin barbuquejo, personas
subidas a la cesta sin arnés, cielo azul saturado, aspecto de render 3D.

Al subirla, vuelve a medir el velo como se explica abajo: el texto de
esta portada cae en la misma zona que el de la de Alquiler.

## Si cambias la foto del hero, vuelve a medir

El velo del hero no está puesto a ojo: sus paradas salen de componer el
pixel real de la fotografía con el degradado y calcular el contraste del
titular y de la entradilla **en su peor punto**. Con la foto actual dan
11,5:1 y 6,0:1, y se ve el 63% de la fotografía por la derecha.

Una foto más clara por la izquierda tumba la entradilla por debajo del
4,5:1 que exige la WCAG AA sin que se note a simple vista. Así que al
cambiarla hay que volver a medir y ajustar las paradas en
`src/components/home/Hero.tsx`.

El nombre de las familias es **el mismo slug que la URL**. Si algún día
se añade una familia, su foto se llama igual que su slug.

## Lo que NO va aquí

Fotografía de **producto**: la tarjeta y la ficha de una máquina solo
llevan fotos de unidades reales de la flota, y viven en
`public/img/maquinas/oficial/completa/`. Van **completas**, tal cual las
entregó el cliente (1254 × 1254, con su logotipo, marca, modelo y
grafismos), y se pintan con `object-contain`: nunca se recortan. Las 111
referencias sin fotografía salen con dibujo técnico a propósito.

La diferencia no es de estilo, es de lo que la imagen afirma. Una foto de
producto dice «esta es la máquina que te vamos a servir»; una de ambiente
dice «así es el trabajo». Una imagen genérica en una tarjeta de producto
sería una afirmación falsa, y es la razón por la que se retiraron las 57
fotos de Wikimedia.

Por eso el `alt` de estas imágenes es vacío (`alt=""`, decorativo) o
genérico: nunca dice «nuestra máquina».
