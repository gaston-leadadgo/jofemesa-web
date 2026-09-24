import Link from "next/link";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import {
  DELEGACIONES,
  EMPRESA,
  CERTIFICACIONES,
  HOMOLOGACIONES,
  AFILIACIONES,
  EMAIL_PRINCIPAL,
  LEMA,
} from "@/content/es/empresa";
import { FAMILIAS } from "@/lib/catalog/familias";
import { MODULOS } from "@/lib/modulos";
import { Hexagono } from "@/components/marca/Hexagono";

/**
 * El pie.
 *
 * El faldón inferior va en rojo de marca. Es literal de la reunión:
 * «tenemos que utilizar la tipografía y… ese faldón, aunque nos guste
 * menos, pues que vaya en rojo». Es la única superficie de la web
 * pintada en rojo entera, y por eso funciona: cierra la página con la
 * marca en vez de con un gris más.
 *
 * El listado de delegaciones son diez líneas de una sola altura en tres
 * columnas. Antes eran dos columnas con el teléfono envuelto en un
 * objetivo táctil de 44 px cada uno: 220 px de alto solo para el
 * listado y un pie que pasaba de 700.
 */

const LEGAL = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
] as const;

const SECCIONES = [
  { href: "/alquiler", label: "Alquiler de maquinaria" },
  { href: "/servicios#venta", label: "Venta y recambios" },
  { href: "/servicios#mantenimiento", label: "Mantenimiento" },
  { href: "/servicios#transporte", label: "Transporte a obra" },
  { href: "/servicios#formacion", label: "Formación" },
  { href: "/delegaciones", label: "Delegaciones" },
  ...(MODULOS.noticias ? [{ href: "/noticias", label: "Noticias" }] : []),
  { href: "/contacto", label: "Contacto" },
];

const HERRAMIENTAS = [
  { href: "/asesor", label: "¿Qué máquina necesito?" },
  { href: "/comparador", label: "Comparador" },
  { href: "/consultar-disponibilidad", label: "Consultar disponibilidad" },
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
        className="pointer-events-none absolute -right-16 -bottom-24 -z-10 size-80 text-white/[0.035]"
      />

      <div className="container-placa py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ---------- Marca ---------- */}
          <div className="lg:col-span-3">
            <Image
              src="/marca/logo-jofemesa-blanco.svg"
              alt="JOFEMESA · Alquiler de maquinaria"
              width={196}
              height={49}
              className="h-8 w-auto"
            />
            <p className="mt-5 max-w-[26ch] text-base font-semibold text-ink-inv">
              {LEMA}
            </p>
            <p className="mt-3 max-w-[38ch] text-sm text-ink-inv-3">
              {EMPRESA.razonSocial} · CIF {EMPRESA.cif}. Alquiler de maquinaria
              desde {EMPRESA.fundacion}.
            </p>
            <a
              href={`mailto:${EMAIL_PRINCIPAL}`}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-ink-inv-2 transition-colors duration-200 hover:text-accent-dark"
            >
              <Mail size={15} strokeWidth={1.75} aria-hidden="true" />
              {EMAIL_PRINCIPAL}
            </a>
          </div>

          {/* ---------- Familias ---------- */}
          <nav className="lg:col-span-3" aria-label="Familias de maquinaria">
            <h2 className="label text-ink-inv-3">Maquinaria</h2>
            <ul className="mt-3 space-y-0.5">
              {FAMILIAS.map((f) => (
                <li key={f.id}>
                  <Link
                    href={`/alquiler/${f.slug}`}
                    className="inline-block py-1 text-sm text-ink-inv-2 transition-colors duration-200 hover:text-accent-dark"
                  >
                    {f.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Secciones ---------- */}
          <nav className="lg:col-span-2" aria-label="Secciones">
            <h2 className="label text-ink-inv-3">Secciones</h2>
            <ul className="mt-3 space-y-0.5">
              {SECCIONES.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="inline-block py-1 text-sm text-ink-inv-2 transition-colors duration-200 hover:text-accent-dark"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="label mt-6 text-ink-inv-3">Herramientas</h2>
            <ul className="mt-3 space-y-0.5">
              {HERRAMIENTAS.map((h) => (
                <li key={h.href}>
                  <Link
                    href={h.href}
                    className="inline-block py-1 text-sm text-ink-inv-2 transition-colors duration-200 hover:text-accent-dark"
                  >
                    {h.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Delegaciones ---------- */}
          <div className="lg:col-span-4">
            <h2 className="label text-ink-inv-3">
              Delegaciones · {DELEGACIONES.length}
            </h2>
            {/* Nombre ARRIBA y teléfono debajo, no los dos en la misma
                línea. En dos columnas de pie no caben juntos: el nombre se
                recortaba a «Mad…» y, en Oporto y Lisboa, a «O» y «L.».
                Una delegación que no se puede nombrar no sirve de nada. */}
            <ul className="mt-4 grid gap-x-6 gap-y-3 lg:grid-cols-2">
              {DELEGACIONES.map((d) => (
                <li
                  key={d.id}
                  className="border-b border-rule-inverse pb-2.5"
                >
                  <a
                    href={`tel:${d.tel}`}
                    className="group block transition-colors duration-200"
                  >
                    <span className="block text-sm font-semibold text-ink-inv transition-colors duration-200 group-hover:text-accent-dark">
                      {d.nombre}
                    </span>
                    <span className="value mt-0.5 flex items-center gap-1.5 text-sm whitespace-nowrap text-ink-inv-2 transition-colors duration-200 group-hover:text-accent-dark">
                      <Phone size={12} strokeWidth={2} aria-hidden="true" />
                      {d.telefono}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
              <h2 className="label-sm shrink-0 text-ink-inv-3">Certificados</h2>
              <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                {[...CERTIFICACIONES, ...HOMOLOGACIONES, ...AFILIACIONES].map(
                  (c) => (
                    <li
                      key={c.id}
                      className="value text-sm text-ink-inv-2"
                      title={c.descripcion}
                    >
                      {c.nombre}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- El faldón, en rojo de marca ---------- */}
      <div className="bg-accent">
        <div className="container-placa flex flex-col gap-2 py-3.5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white">
            {/* Sin punto detrás de la razón social: ya acaba en «S.A.» y
                salían dos seguidos. */}
            © {new Date().getFullYear()} {EMPRESA.razonSocial} · Todos los
            derechos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block py-1 text-sm text-white/85 underline decoration-white/40 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
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
