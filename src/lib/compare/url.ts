/**
 * `?m=a,b,c` → lista de slugs. Tolera el parámetro repetido.
 *
 * La usan tanto la página completa de `/comparador` como su versión
 * interceptada en modal: las dos leen la URL en el servidor, así que la
 * función vive aquí y no duplicada en cada `page.tsx`.
 */
export function slugsDeQuery(
  v: string | string[] | undefined,
): string[] {
  const bruto = Array.isArray(v) ? v : v ? [v] : [];
  return bruto
    .flatMap((s) => s.split(","))
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Refleja una lista en `?m=` sin recargar.
 *
 * `URLSearchParams` escapa la coma a `%2C`, y estos enlaces se comparten
 * por WhatsApp: `?m=genie-gs-4390,genie-gs-5390` se lee, `%2C` no. La coma
 * es un carácter legal en una query, así que se devuelve a su sitio.
 */
export function reflejarEnUrl(slugs: string[]) {
  const url = new URL(window.location.href);
  const actual = url.searchParams.get("m") ?? "";
  const siguiente = slugs.join(",");
  if (actual === siguiente) return;
  if (siguiente) url.searchParams.set("m", siguiente);
  else url.searchParams.delete("m");
  window.history.replaceState(
    null,
    "",
    url.pathname + url.search.replace(/%2C/g, ",") + url.hash,
  );
}
