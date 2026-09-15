import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Fotografía de AMBIENTE: el hero, los bloques de servicios y las
 * cabeceras de familia.
 *
 * No es fotografía de producto. La distinción no es de estilo, es de lo
 * que la imagen afirma:
 *
 *   · Una foto de PRODUCTO dice «esta es la máquina que te vamos a
 *     servir». Solo puede ser una unidad real de su flota, y por eso las
 *     118 referencias sin fotografía siguen saliendo con dibujo técnico.
 *   · Una foto de AMBIENTE dice «así es el trabajo». Ahí una imagen
 *     genérica es legítima, y es lo que hace todo el sector.
 *
 * Por eso este módulo existe aparte del catálogo y por eso ninguna de
 * estas imágenes entra nunca en una tarjeta de máquina.
 *
 * ---------------------------------------------------------------------
 * CÓMO SE AÑADE UNA
 *
 * Se deja el archivo en su carpeta con su nombre exacto y aparece. No
 * hay que tocar código: esto comprueba en tiempo de compilación qué hay
 * en `public/`, así que lo que falta simplemente no se dibuja y la
 * página sigue funcionando igual que antes.
 *
 * Los nombres y las medidas están en `public/img/LEEME.md`.
 * ---------------------------------------------------------------------
 */

/** Extensiones que se aceptan, en orden de preferencia. */
const EXT = [".webp", ".jpg", ".jpeg", ".png"] as const;

const PUBLICO = path.join(process.cwd(), "public");

/**
 * Devuelve la ruta pública de la imagen si existe, o `null`.
 *
 * `base` va sin extensión y sin `/`: `"hero/portada"`.
 *
 * Se resuelve con `existsSync` y no con un `import`, a propósito: un
 * import de un archivo que no está rompe la compilación, y la idea es
 * justo la contraria —que falten casi todas y la web aguante—.
 */
export function ambiente(base: string): string | null {
  for (const ext of EXT) {
    const rel = `img/${base}${ext}`;
    if (existsSync(path.join(PUBLICO, rel))) return `/${rel}`;
  }
  return null;
}

/** La del hero de portada. */
export const heroPortada = () => ambiente("hero/portada");

/** La del bloque de servicio: `venta`, `mantenimiento`, `transporte`, `formacion`. */
export const fotoServicio = (id: string) => ambiente(`servicios/${id}`);

/** La de la cabecera de familia, por su slug de URL. */
export const fotoFamilia = (slug: string) => ambiente(`familias/${slug}`);
