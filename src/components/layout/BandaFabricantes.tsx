import { CarruselFabricantes } from "@/components/home/CarruselFabricantes";

/**
 * Tira de fabricantes justo encima del pie, en todas las páginas (cliente,
 * 03/11/2026). Es el mismo carrusel que la banda de partners de la portada.
 */
export function BandaFabricantes() {
  return (
    <section aria-label="Nuestros fabricantes" className="border-t border-rule bg-surface">
      <div className="container-placa flex flex-col gap-4 py-8 md:flex-row md:items-center md:gap-8">
        <h2 className="label shrink-0 text-ink-3">Nuestros fabricantes</h2>
        <div className="min-w-0 flex-1">
          <CarruselFabricantes />
        </div>
      </div>
    </section>
  );
}
