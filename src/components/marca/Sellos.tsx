import { SELLOS } from "@/content/es/empresa";

/**
 * Los sellos de certificación con su logotipo: AENOR (UNE 58923 y
 * 58451), IPAF (centro de formación y empresa afiliada) y ANAPAT.
 *
 * Todos a la misma altura: son sellos, no marcas comerciales, y el de
 * ANAPAT ya es apaisado por naturaleza. Los de AENOR abren su
 * certificado en PDF, que es lo que da valor a un sello en una web.
 *
 * `solo` filtra por id cuando una página solo necesita algunos.
 */
export function Sellos({
  solo,
  alto = 48,
}: {
  solo?: readonly (typeof SELLOS)[number]["id"][];
  alto?: number;
}) {
  const sellos = solo ? SELLOS.filter((s) => solo.includes(s.id)) : SELLOS;
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-4">
      {sellos.map((s) => {
        const img = (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/marca/certificaciones/${s.id}.webp`}
            alt={s.nombre}
            width={Math.round((alto * s.w) / s.h)}
            height={alto}
            loading="lazy"
            decoding="async"
            className="block w-auto max-w-none"
            style={{ height: alto }}
          />
        );
        return (
          <li key={s.id} title={s.descripcion}>
            {"certificado" in s ? (
              <a
                href={s.certificado}
                target="_blank"
                rel="noopener"
                aria-label={`${s.nombre}: ver el certificado (PDF)`}
                className="block rounded-sm transition-opacity duration-200 hover:opacity-80"
              >
                {img}
              </a>
            ) : (
              img
            )}
          </li>
        );
      })}
    </ul>
  );
}
