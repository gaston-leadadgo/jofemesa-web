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
