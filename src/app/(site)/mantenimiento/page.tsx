import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Truck, ShieldCheck, GraduationCap } from "lucide-react";
import { DELEGACIONES_OPERATIVAS } from "@/content/es/empresa";

export const metadata: Metadata = {
  title: "Mantenimiento de maquinaria industrial",
  description:
    "Reparamos todo tipo de maquinaria industrial: carretillas elevadoras, palas cargadoras, retroexcavadoras y plataformas. Mantenimiento preventivo, taller propio y unidades móviles.",
};

const SERVICIOS = [
  {
    icono: Wrench,
    titulo: "Reparación de avería",
    texto:
      "Diagnóstico y reparación de maquinaria industrial: carretillas elevadoras, palas cargadoras, retroexcavadoras y plataformas de cualquier marca.",
  },
  {
    icono: ShieldCheck,
    titulo: "Mantenimiento preventivo",
    texto:
      "Revisiones programadas para que la máquina no pare cuando más falta hace, con histórico de cada intervención.",
  },
  {
    icono: Truck,
    titulo: "Asistencia desplazada",
    texto:
      "Flota de vehículos de servicio que va al sitio de la avería. Cuando no es posible, la reparación se hace en nuestras instalaciones.",
  },
  {
    icono: GraduationCap,
    titulo: "Formación de operadores",
    texto:
      "Somos centro homologado IPAF y emitimos el carné PAL, reconocido en más de 65 países. Cursos de operador, demostrador, arnés y carga y descarga.",
  },
] as const;

export default function PaginaMantenimiento() {
  return (
    <>
      <section className="ambient-light border-b border-rule">
        <div className="container-placa py-8 md:py-10">
          <p className="label text-ink-2">Servicio técnico propio</p>
          <h1 className="display-1 mt-4 max-w-[26ch] text-ink" data-revelar>
            Una avería no debería convertirse en un problema mayor.
          </h1>
          <p className="lede mt-6 max-w-[58ch] text-ink-2">
            Mantenemos y reparamos maquinaria industrial con mecánicos propios,
            taller y unidades móviles. También la que no has alquilado con
            nosotros.
          </p>
          <Link
            href="/consultar-disponibilidad"
            className="btn-accent mt-8 inline-flex h-14 items-center bg-accent px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover"
          >
            Solicitar una intervención
          </Link>
        </div>
      </section>

      <section className="section-y border-b border-rule">
        <div className="container-placa">
          <h2 className="display-2 max-w-[24ch] text-ink" data-revelar>Qué hacemos</h2>
          <ul className="mt-7 grid gap-px bg-rule md:grid-cols-2" data-escalonar>
            {SERVICIOS.map((s) => (
              <li key={s.titulo} className="bg-surface p-8">
                <s.icono
                  size={24}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="text-accent"
                />
                <h3 className="title mt-5 text-ink">{s.titulo}</h3>
                <p className="mt-3 text-base text-ink-2">{s.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-placa">
          <h2 className="display-3 text-ink">Dónde llegamos</h2>
          <p className="mt-4 max-w-[54ch] text-base text-ink-2">
            El servicio técnico sale de las mismas delegaciones que el alquiler,
            así que la máquina la atiende quien la conoce.
          </p>
          <ul className="mt-6 grid gap-px bg-rule md:grid-cols-2 lg:grid-cols-4" data-escalonar>
            {DELEGACIONES_OPERATIVAS.map((d) => (
              <li key={d.id} className="bg-surface p-5">
                <p className="title text-ink">{d.nombre}</p>
                <a
                  href={`tel:${d.tel}`}
                  className="value mt-2 inline-flex min-h-11 items-center text-ink-2 hover:text-accent"
                >
                  {d.telefono}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
