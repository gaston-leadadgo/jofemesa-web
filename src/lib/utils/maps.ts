/**
 * Enlace «Cómo llegar» a Google Maps a partir de una dirección publicada.
 *
 * Se construye con la API pública de búsqueda (`?api=1&query=`), que no
 * necesita clave, en vez de pegar enlaces cortos `maps.app.goo.gl` a
 * mano: la dirección es el dato verificado y el enlace se deriva de ella.
 */
export function urlMaps(d: {
  direccion: string | null;
  cp: string | null;
  localidad: string | null;
  pais?: string;
}): string {
  const partes = [d.direccion, d.cp, d.localidad, d.pais].filter(Boolean);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    partes.join(", "),
  )}`;
}
