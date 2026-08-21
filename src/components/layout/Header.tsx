"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TELEFONO_PRINCIPAL } from "@/content/es/empresa";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/alquiler", label: "Alquiler" },
  { href: "/venta", label: "Venta" },
  { href: "/mantenimiento", label: "Mantenimiento" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [compacta, setCompacta] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const alHacerScroll = () => setCompacta(window.scrollY > 120);
    alHacerScroll();
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    return () => window.removeEventListener("scroll", alHacerScroll);
  }, []);

  // El menú móvil bloquea el scroll de fondo mientras está abierto.
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  // El menú se cierra al pulsar un enlace, no con un efecto sobre la ruta:
  // así no hay setState dentro de useEffect y el cierre es inmediato.
  const cerrarMenu = () => setMenuAbierto(false);

  const activa = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-rule bg-surface",
        "transition-[height] duration-200 ease-ui",
        compacta ? "h-14 md:h-15" : "h-15 md:h-18",
      )}
    >
      <div className="container-placa flex h-full items-center justify-between gap-6">
        {/* El logotipo conserva su rojo puro y vive aislado a la izquierda:
            nunca comparte campo visual con el rojo de interfaz del CTA. */}
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center"
          aria-label="JOFEMESA, ir a la portada"
        >
          <Image
            src="/marca/logo.png"
            alt="JOFEMESA"
            width={196}
            height={63}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-8 lg:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activa(item.href) ? "page" : undefined}
              className={cn(
                "relative py-2 text-base font-medium transition-colors duration-200",
                activa(item.href)
                  ? "text-ink after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:bg-accent"
                  : "text-ink-2 hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <a
            href={`tel:${TELEFONO_PRINCIPAL.tel}`}
            className="hidden items-center gap-2 value text-ink transition-colors duration-200 hover:text-accent md:flex"
          >
            <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
            {TELEFONO_PRINCIPAL.visible}
          </a>

          <a
            href={`tel:${TELEFONO_PRINCIPAL.tel}`}
            className="flex size-11 items-center justify-center border border-rule-control text-ink md:hidden"
            aria-label={`Llamar al ${TELEFONO_PRINCIPAL.visible}`}
          >
            <Phone size={20} strokeWidth={1.75} aria-hidden="true" />
          </a>

          <Link
            href="/consultar-disponibilidad"
            className="btn-accent hidden h-11 items-center px-5 text-base font-semibold text-white transition-colors duration-200 md:inline-flex"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Consultar disponibilidad
          </Link>

          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            className="flex size-11 items-center justify-center border border-rule-control text-ink lg:hidden"
          >
            {menuAbierto ? (
              <X size={20} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div
          id="menu-movil"
          className="fixed inset-x-0 top-15 bottom-0 z-40 overflow-y-auto border-t border-rule bg-surface lg:hidden"
        >
          <nav aria-label="Navegación principal" className="container-placa">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activa(item.href) ? "page" : undefined}
                onClick={cerrarMenu}
                className={cn(
                  "flex min-h-14 items-center border-b border-rule text-lg font-medium",
                  activa(item.href) ? "text-accent" : "text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/asesor"
              onClick={cerrarMenu}
              className="flex min-h-14 items-center border-b border-rule text-lg font-medium text-ink"
            >
              ¿Qué máquina necesito?
            </Link>
            <Link
              href="/consultar-disponibilidad"
              onClick={cerrarMenu}
              className="mt-6 flex h-14 items-center justify-center text-base font-semibold text-white"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              Consultar disponibilidad
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
