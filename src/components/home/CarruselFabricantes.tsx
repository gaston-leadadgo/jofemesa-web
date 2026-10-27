import { FABRICANTES_FLOTA } from "@/content/es/empresa";

/**
 * Tira de logotipos de los fabricantes de la flota, en bucle continuo.
 *
 * Los logotipos son los oficiales de cada marca (sus webs o Wikimedia
 * Commons), recortados al borde y pasados a WebP en
 * `public/marca/fabricantes/`. Jungheinrich y Takeuchi no entran: tienen
 * su propia tarjeta encima, como distribuciones oficiales.
 *
 * Cada logotipo tiene una proporción distinta (Dagartech es 7,5 veces
 * más ancho que alto; Atlas Copco, 2). A la misma altura, los anchos
 * pesarían el triple que los compactos. Por eso la altura sale de un
 * área constante —`AREA / proporción`— con tope arriba y abajo: es el
 * ajuste óptico de toda tira de logos, hecho con una fórmula y no a ojo.
 *
 * La lista va dos veces seguida y la pista se desplaza la mitad de su
 * ancho, así el bucle no tiene salto. La copia va con `aria-hidden`.
 * Con movimiento reducido no hay desplazamiento: los logotipos se
 * reparten en filas y la copia se oculta.
 */

/** Ancho × alto en píxeles de cada WebP, para reservar su hueco. */
const LOGOS: Record<string, { archivo: string; w: number; h: number }> = {
  Genie: { archivo: "genie", w: 229, h: 66 },
  JLG: { archivo: "jlg", w: 483, h: 160 },
  Haulotte: { archivo: "haulotte", w: 1053, h: 160 },
  Manitou: { archivo: "manitou", w: 600, h: 160 },
  JCB: { archivo: "jcb", w: 416, h: 160 },
  Snorkel: { archivo: "snorkel", w: 854, h: 160 },
  Ausa: { archivo: "ausa", w: 166, h: 32 },
  Bomag: { archivo: "bomag", w: 825, h: 160 },
  Hamm: { archivo: "hamm", w: 709, h: 160 },
  "Wacker Neuson": { archivo: "wacker-neuson", w: 481, h: 160 },
  "Atlas Copco": { archivo: "atlas-copco", w: 334, h: 160 },
  Himoinsa: { archivo: "himoinsa", w: 895, h: 160 },
  Dagartech: { archivo: "dagartech", w: 1195, h: 160 },
  Hilti: { archivo: "hilti", w: 680, h: 160 },
};

/** Área visual común de cada logotipo, en px² CSS. */
const AREA = 4600;
const ALTO_MIN = 22;
const ALTO_MAX = 42;

const FABRICANTES = FABRICANTES_FLOTA.flatMap((f) => {
  const logo = LOGOS[f.nombre];
  if (!logo) return [];
  const proporcion = logo.w / logo.h;
  const alto = Math.round(
    Math.min(ALTO_MAX, Math.max(ALTO_MIN, Math.sqrt(AREA / proporcion))),
  );
  return [{ ...f, ...logo, alto, ancho: Math.round(alto * proporcion) }];
});

function Lista({ copia = false }: { copia?: boolean }) {
  return (
    <ul
      className="carrusel-logos__lista"
      aria-hidden={copia || undefined}
      data-copia={copia || undefined}
    >
      {FABRICANTES.map((f) => (
        <li key={f.nombre} className="flex shrink-0 items-center">
          {/* <img> y no next/image: son WebP de pocos KB ya optimizados
              y a su tamaño, y el optimizador solo añadiría peticiones. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/marca/fabricantes/${f.archivo}.webp`}
            alt={copia ? "" : f.nombre}
            title={f.area}
            width={f.ancho}
            height={f.alto}
            loading="lazy"
            decoding="async"
            className="carrusel-logos__logo"
            style={{ height: f.alto, width: f.ancho }}
          />
        </li>
      ))}
    </ul>
  );
}

export function CarruselFabricantes() {
  return (
    <div className="carrusel-logos">
      <div className="carrusel-logos__pista">
        <Lista />
        <Lista copia />
      </div>
    </div>
  );
}
