import Link from "next/link";
import Image from "next/image";
import {
  DELEGACIONES,
  EMPRESA,
  CERTIFICACIONES,
  AFILIACIONES,
  LEMA,
} from "@/content/es/empresa";
import { Hexagono } from "@/components/marca/Hexagono";

/**
 * El pie.
 *
 * Antes las nueve delegaciones iban en dos columnas con el teléfono
 * envuelto en un objetivo táctil de 44px cada uno: 220px de alto solo
 * para el listado, y el pie entero pasaba de 700px. Ahora las nueve van
 * en tres columnas de líneas de una sola altura, y el aire se reparte
 * entre columnas en vez de acumularse debajo.
 */

const LEGAL = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
  // Obligatorio mientras se usen las fotos de referencia: las licencias
  // Creative Commons exigen citar autoría.
  { href: "/creditos-imagen", label: "Créditos de imagen" },
] as const;

const SECCIONES = [
  { href: "/alquiler", label: "Alquiler de maquinaria" },
  { href: "/asesor", label: "¿Qué máquina necesito?" },
  { href: "/comparador", label: "Comparador" },
  { href: "/venta", label: "Venta y recambios" },
  { href: "/mantenimiento", label: "Mantenimiento" },
] as const;

export function Footer() {
  return (
    <footer
      data-surface="dark"
      className="relative isolate overflow-hidden bg-inverse text-ink-inv-2"
    >
      {/* Filigrana: el hexágono del isotipo, el único ornamento del sistema. */}
      <Hexagono
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -bottom-20 -z-10 size-72 text-white/[0.04]"
      />

      <div className="container-placa py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ---------- Marca ---------- */}
          <div className="lg:col-span-3">
            <Image
              src="/marca/logo.png"
              alt="JOFEMESA"
              width={196}
              height={63}
              className="h-8 w-auto"
            />
            <p className="mt-4 max-w-[26ch] text-base font-semibold text-ink-inv">
              {LEMA}
            </p>
            <p className="mt-3 max-w-[38ch] text-sm text-ink-inv-3">
              {EMPRESA.razonSocial} · CIF {EMPRESA.cif}. Alquiler de maquinaria
              desde {EMPRESA.fundacion}.
            </p>
          </div>

          {/* ---------- Secciones ---------- */}
          <nav className="lg:col-span-2" aria-label="Secciones">
            <h2 className="label text-ink-inv-3">Secciones</h2>
            <ul className="mt-4 space-y-1.5">
              {SECCIONES.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm text-ink-inv-2 transition-colors duration-200 hover:text-accent-dark"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Delegaciones: tres columnas de una línea ---------- */}
          <div className="lg:col-span-5">
            <h2 className="label text-ink-inv-3">
              Delegaciones · {DELEGACIONES.length}
            </h2>
            <ul className="mt-4 grid gap-x-6 gap-y-1.5 md:grid-cols-2 lg:grid-cols-2">
              {DELEGACIONES.map((d) => (
                <li
                  key={d.id}
                  className="flex items-baseline justify-between gap-3 border-b border-rule-inverse pb-1.5 text-sm"
                >
                  <span className="shrink-0 font-semibold text-ink-inv">
                    {d.nombre}
                  </span>
                  {d.tel ? (
                    <a
                      href={`tel:${d.tel}`}
                      className="value text-sm text-ink-inv-2 transition-colors duration-200 hover:text-accent-dark"
                    >
                      {d.telefono}
                    </a>
                  ) : (
                    <span className="text-ink-inv-3">Pendiente</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Certificaciones ---------- */}
          <div className="lg:col-span-2">
            <h2 className="label text-ink-inv-3">Certificados</h2>
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 lg:flex-col">
              {CERTIFICACIONES.map((c) => (
                <li key={c.id} className="value text-sm text-ink-inv">
                  {c.nombre}
                </li>
              ))}
            </ul>

            <h2 className="label mt-6 text-ink-inv-3">Pertenecemos a</h2>
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 lg:flex-col">
              {AFILIACIONES.map((a) => (
                <li key={a.id} className="text-sm font-semibold text-ink-inv">
                  {a.nombre}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-rule-inverse pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-ink-inv-3">
            © {new Date().getFullYear()} {EMPRESA.razonSocial}. Todos los
            derechos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-ink-inv-3 transition-colors duration-200 hover:text-ink-inv"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
