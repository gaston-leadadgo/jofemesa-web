"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { EMPRESA, DELEGACIONES } from "@/content/es/empresa";
import { FAMILIAS } from "@/lib/catalog/familias";
import { ALQUILER } from "@/lib/catalog";
import { MODULOS } from "@/lib/modulos";
import { IconoMaquina } from "@/components/marca/IconoMaquina";
import { DesplegableDelegaciones } from "./DesplegableDelegaciones";
import { DesplegableTelefonos } from "./DesplegableTelefonos";

/**
 * La cabecera.
 *
 * La navegación es la que se cerró en la reunión del 24/08/2026:
 * «Home, alquiler, servicios y noticias… más contacto evidentemente,
 * delegaciones». Venta y mantenimiento ya NO son pestañas: viven dentro
 * de Servicios. Y el desplegable de Alquiler lleva las seis familias,
 * porque cada una tiene URL propia para poder hacerle campaña — «esto
 * tiene que ser una URL diferente… para poder hacer una campaña de cada
 * categoría».
 *
 * El desplegable se abre al pasar por encima Y con teclado, pero el
 * enlace del propio «Alquiler» sigue navegando: un menú que solo se
 * abre al hover deja fuera al que navega con teclado, y un menú que
 * secuestra el clic deja sin catálogo completo al que llega con el
 * ratón. Se cierra con Escape y al salir del bloque.
 */

type ItemNav = { href: string; label: string; familias?: true };

const NAV: ItemNav[] = [
  { href: "/", label: "Inicio" },
  { href: "/alquiler", label: "Alquiler", familias: true },
  { href: "/servicios", label: "Servicios" },
  ...(MODULOS.noticias ? [{ href: "/noticias", label: "Noticias" }] : []),
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [compacta, setCompacta] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [familiasAbierto, setFamiliasAbierto] = useState(false);
  const bloqueFamilias = useRef<HTMLDivElement>(null);
  const idFamilias = useId();

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

  // Escape cierra lo que esté abierto.
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setFamiliasAbierto(false);
      setMenuAbierto(false);
    };
    document.addEventListener("keydown", alPulsar);
    return () => document.removeEventListener("keydown", alPulsar);
  }, []);

  const cerrarTodo = () => {
    setMenuAbierto(false);
    setFamiliasAbierto(false);
  };

  const activa = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Franja de confianza. Se retira en móvil: ahí el espacio vertical
          lo necesita el hero, y el teléfono ya está en la cabecera. */}
      {/* `relative z-50`: el panel de delegaciones cae por encima de la
          cabecera, que es `sticky z-40`. */}
      <div
        data-surface="dark"
        className="relative z-50 hidden border-b border-rule-inverse bg-inverse md:block"
      >
        <div className="container-placa flex h-9 items-center justify-between gap-6">
          {/* Caja baja: dos frases largas en versalitas espaciadas, y lo
              primero que ve cualquiera al entrar es un cartel. */}
          <p className="meta flex items-center gap-2 text-ink-inv-2">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent-dark"
            />
            Especialistas en maquinaria desde {EMPRESA.fundacion}
          </p>
          <div className="flex h-full items-center gap-6">
            <DesplegableDelegaciones />
            <span aria-hidden="true" className="h-3.5 w-px bg-rule-inverse" />
            <Link
              href="/asesor"
              className="label-sm flex h-full items-center text-ink-inv-2 underline decoration-rule-inverse decoration-from-font underline-offset-4 transition-colors duration-200 hover:text-accent-dark"
            >
              ¿Qué máquina necesito?
            </Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b border-rule bg-surface/95 backdrop-blur-sm",
          "transition-[height] duration-200 ease-ui",
          compacta ? "h-14 md:h-15" : "h-15 md:h-18",
        )}
      >
        <div className="container-placa flex h-full items-center justify-between gap-4 lg:gap-6">
          {/* El logotipo conserva su rojo puro y vive aislado a la izquierda:
              nunca comparte campo visual con el rojo de interfaz del CTA. */}
          <Link
            href="/"
            onClick={cerrarTodo}
            className="flex min-h-11 shrink-0 items-center"
            aria-label="JOFEMESA, ir a la portada"
          >
            <Image
              src="/marca/logo-jofemesa.svg"
              alt="JOFEMESA · Alquiler de maquinaria"
              width={196}
              height={49}
              priority
              className="h-7 w-auto md:h-9"
            />
          </Link>

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-6 lg:flex xl:gap-7"
          >
            {NAV.map((item) =>
              item.familias ? (
                <div
                  key={item.href}
                  ref={bloqueFamilias}
                  className="relative"
                  onMouseEnter={() => setFamiliasAbierto(true)}
                  onMouseLeave={() => setFamiliasAbierto(false)}
                  onFocus={() => setFamiliasAbierto(true)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node))
                      setFamiliasAbierto(false);
                  }}
                >
                  <span className="flex items-center gap-1">
                    <Link
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
                    <button
                      type="button"
                      onClick={() => setFamiliasAbierto((v) => !v)}
                      aria-expanded={familiasAbierto}
                      aria-controls={idFamilias}
                      aria-label="Ver las familias de maquinaria"
                      className="flex size-6 items-center justify-center text-ink-3 transition-colors duration-200 hover:text-ink"
                    >
                      <ChevronDown
                        size={15}
                        strokeWidth={2.25}
                        aria-hidden="true"
                        className={cn(
                          "transition-transform duration-200",
                          familiasAbierto && "rotate-180 text-accent",
                        )}
                      />
                    </button>
                  </span>

                  {familiasAbierto && (
                    <div
                      id={idFamilias}
                      className="absolute top-full left-0 z-50 w-[min(42rem,calc(100vw-4rem))] origin-top-left border border-rule bg-surface shadow-panel motion-safe:animate-[panel-entra_.18s_var(--ease-entrance)]"
                    >
                      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
                        <p className="label-sm text-ink-3">
                          Familias de maquinaria
                        </p>
                        <Link
                          href="/alquiler"
                          onClick={cerrarTodo}
                          className="label-sm inline-flex items-center gap-1.5 text-accent hover:underline"
                        >
                          Catálogo completo
                          <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                        </Link>
                      </div>
                      <ul className="grid grid-cols-2 gap-px bg-rule overflow-hidden rounded-2xl border border-rule">
                        {FAMILIAS.map((f) => {
                          const n = ALQUILER.filter(
                            (m) => m.familia === f.id,
                          ).length;
                          return (
                            <li key={f.id} className="bg-surface">
                              <Link
                                href={`/alquiler/${f.slug}`}
                                onClick={cerrarTodo}
                                className="group flex h-full items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-sunken"
                              >
                                <IconoMaquina
                                  icono={f.icono}
                                  className="h-7 w-9 shrink-0 text-accent"
                                />
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-semibold text-ink group-hover:text-accent">
                                    {f.nombre}
                                  </span>
                                  <span className="label-sm block text-ink-3">
                                    {n} referencias · {f.rango}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
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
              ),
            )}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <DesplegableTelefonos alAbrir={() => setMenuAbierto(false)} />

            <Link
              href="/consultar-disponibilidad"
              className="btn-accent hidden h-11 items-center bg-accent px-5 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover md:inline-flex pastilla"
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
      </header>

      {menuAbierto && (
        <div
          id="menu-movil"
          className="fixed inset-x-0 top-15 bottom-0 z-50 overflow-y-auto border-t border-rule bg-surface lg:hidden"
        >
          <nav aria-label="Navegación principal" className="container-placa pb-8">
            {NAV.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  aria-current={activa(item.href) ? "page" : undefined}
                  onClick={cerrarTodo}
                  className={cn(
                    "flex min-h-14 items-center justify-between border-b border-rule text-lg font-medium",
                    activa(item.href) ? "text-accent" : "text-ink",
                  )}
                >
                  {item.label}
                  <ArrowRight
                    size={17}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="text-rule-strong"
                  />
                </Link>

                {item.familias && (
                  <ul className="border-b border-rule py-1.5">
                    {FAMILIAS.map((f) => (
                      <li key={f.id}>
                        <Link
                          href={`/alquiler/${f.slug}`}
                          onClick={cerrarTodo}
                          className="flex min-h-12 items-center gap-3 pl-1 text-base text-ink-2"
                        >
                          <IconoMaquina
                            icono={f.icono}
                            className="h-6 w-8 shrink-0 text-accent"
                          />
                          {f.nombre}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <Link
              href="/delegaciones"
              aria-current={activa("/delegaciones") ? "page" : undefined}
              onClick={cerrarTodo}
              className={cn(
                "flex min-h-14 items-center justify-between border-b border-rule text-lg font-medium",
                activa("/delegaciones") ? "text-accent" : "text-ink",
              )}
            >
              Delegaciones
              <ArrowRight
                size={17}
                strokeWidth={2}
                aria-hidden="true"
                className="text-rule-strong"
              />
            </Link>
            <Link
              href="/asesor"
              onClick={cerrarTodo}
              className="flex min-h-14 items-center border-b border-rule text-lg font-medium text-ink"
            >
              ¿Qué máquina necesito?
            </Link>
            <Link
              href="/comparador"
              onClick={cerrarTodo}
              className="flex min-h-14 items-center border-b border-rule text-lg font-medium text-ink"
            >
              Comparador
            </Link>

            <Link
              href="/consultar-disponibilidad"
              onClick={cerrarTodo}
              className="btn-accent mt-6 flex h-14 items-center justify-center bg-accent text-base font-semibold text-white pastilla"
            >
              Consultar disponibilidad
            </Link>
            {/* Todos los números en un <details>: nativo, funciona sin
                JavaScript y no roba altura al menú hasta que se abre. */}
            <details className="group mt-3 overflow-hidden rounded-3xl border border-rule-control">
              <summary className="flex h-14 cursor-pointer list-none items-center justify-center gap-2 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
                Llamar a una delegación
                <ChevronDown
                  size={16}
                  strokeWidth={2.25}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <ul className="border-t border-rule">
                {DELEGACIONES.filter((d) => d.tel).map((d) => (
                  <li key={d.id} className="border-b border-rule last:border-b-0">
                    <a
                      href={`tel:${d.tel}`}
                      className="flex min-h-12 items-center justify-between gap-4 px-5 text-base"
                    >
                      <span className="font-medium text-ink">
                        {d.nombre}
                        {d.central && (
                          <span className="ml-2 rounded-full bg-accent-tint px-1.5 py-0.5 text-xs font-semibold text-accent">
                            Central
                          </span>
                        )}
                      </span>
                      <span className="value text-ink-2">{d.telefono}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </nav>
        </div>
      )}
    </>
  );
}
