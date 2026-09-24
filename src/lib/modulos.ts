/**
 * Módulos que se pueden apagar sin borrar su código.
 *
 * Noticias está apagado a petición del cliente (23/09/2026, «de
 * momento»): fuera del menú, del pie, de la portada y del sitemap, y
 * /noticias responde 404. El contenido y los componentes siguen en el
 * repo; volver a encenderlo es cambiar esta línea.
 */
export const MODULOS = {
  noticias: false,
} as const;
