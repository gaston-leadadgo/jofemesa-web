import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BarraMovil } from "@/components/layout/BarraMovil";
import { BandejaComparador } from "@/components/comparador/BandejaComparador";
import { CompararProvider } from "@/lib/compare/context";
import { CATALOGO } from "@/lib/catalog";
import { MotorRevelado } from "@/components/motion/MotorRevelado";
import { BarraProgreso } from "@/components/motion/BarraProgreso";

/**
 * El layout del sitio. Aquí viven las tres cosas que tienen que sobrevivir
 * a la navegación de cliente: la bandeja del comparador, la barra móvil y
 * el hueco `@modal` donde aterriza la ficha interceptada.
 */
export default function LayoutSitio({
  children,
  modal,
}: LayoutProps<"/">) {
  return (
    <CompararProvider slugsValidos={CATALOGO.map((m) => m.slug)}>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>

      {/* BarraProgreso lee searchParams, así que va envuelta o la
          compilación de producción falla. */}
      <Suspense fallback={null}>
        <BarraProgreso />
      </Suspense>
      <MotorRevelado />

      <Header />

      <main id="contenido" className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Sitio para la bandeja y la barra móvil, que son fijas. */}
      <div aria-hidden="true" className="h-16 md:h-0" />

      <BandejaComparador />
      <BarraMovil />

      {modal}
    </CompararProvider>
  );
}
