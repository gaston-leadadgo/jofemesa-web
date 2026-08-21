import { ALQUILER } from "@/lib/catalog";
import { FAMILIA_POR_ID } from "@/lib/catalog/familias";
import type { FamiliaId } from "@/lib/catalog/types";
import { TarjetaMaquina } from "@/components/maquina/TarjetaMaquina";

/**
 * El catálogo renderizado en el SERVIDOR.
 *
 * Esto no es un esqueleto de carga: es el catálogo de verdad, y por eso
 * existe. `AlquilerCliente` lee los filtros de la URL, y todo componente
 * de cliente que lee la URL obliga a Next a renderizar del navegador
 * hacia abajo (`BAILOUT_TO_CLIENT_SIDE_RENDERING`). Con un esqueleto de
 * relleno, el HTML de /alquiler —la página principal del negocio— salía
 * con cero máquinas: ni un modelo, ni una cifra, ni un enlace para
 * Googlebot, y una pantalla de cajas grises para quien entra con la red
 * lenta de una obra.
 *
 * Poniendo aquí la lista completa, el HTML servido trae las 63 máquinas
 * con su nombre, sus tres especificaciones y su enlace. Cuando hidrata,
 * la versión interactiva toma el relevo y a partir de ahí el filtrado es
 * instantáneo en memoria. Se paga con HTML de más; se cobra en contenido
 * rastreable y en primera pintura útil.
 */
export function ListaEstatica({
  familiaFija,
}: {
  familiaFija?: FamiliaId;
}) {
  const maquinas = familiaFija
    ? ALQUILER.filter((m) => m.familia === familiaFija)
    : ALQUILER;

  return (
    <div className="container-placa grid gap-8 py-8 lg:grid-cols-12 lg:gap-8">
      {/* Hueco de los filtros. Se reserva para que al hidratar no salte
          la maquetación. */}
      <div className="hidden lg:col-span-3 lg:block" aria-hidden="true">
        <p className="label mb-4 text-ink-3">Filtros</p>
        <div className="h-80 border border-rule bg-sunken" />
      </div>

      <div className="lg:col-span-9">
        <p className="label text-ink-2">
          {maquinas.length} máquina{maquinas.length === 1 ? "" : "s"}
          {familiaFija && ` · ${FAMILIA_POR_ID[familiaFija]?.nombre}`}
        </p>

        <ul
          className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          data-escalonar
        >
          {maquinas.map((m, i) => (
            <li key={m.slug}>
              <TarjetaMaquina
                maquina={m}
                sizes="(min-width:1440px) 300px, (min-width:1024px) 30vw, (min-width:768px) 45vw, 92vw"
                prioridad={i < 3}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
