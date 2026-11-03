import { Boxes, ShieldCheck, MapPin, CalendarClock } from "lucide-react";
import {
  DELEGACIONES,
  EMPRESA,
} from "@/content/es/empresa";
import { Sellos } from "@/components/marca/Sellos";
import { ALQUILER } from "@/lib/catalog";

/**
 * S2 · El raíl de garantías.
 *
 * Es el bloque de la lámina que pasó el cliente el 24/08/2026 —«amplia
 * flota / seguridad / cobertura / experiencia», con iconografía— y que
 * gustó en la reunión. Lo que cambia respecto a su lámina es el texto de
 * la primera columna.
 *
 * La lámina dice «maquinaria moderna y en continuo renovación». Eso NO
 * se puede publicar: Jorge lo desmintió por teléfono antes de las
 * vacaciones —«hay máquinas que están nuevas, pero hay máquinas que
 * tienen un montón de años; eso no lo puedo poner»—. Así que la columna
 * de flota habla de lo que sí es verificable y además es mejor
 * argumento: cuántas referencias hay y desde qué altura hasta cuál.
 *
 * En móvil son dos columnas, no un carrusel. La duda de la reunión era
 * precisamente esta («el mobile no sé cómo soluciona esto»): cuatro
 * pares de icono y dato caben a 375 px sin desplazamiento lateral, y un
 * carrusel aquí esconde tres de los cuatro argumentos.
 */
export function Garantias() {
  const alturas = ALQUILER.map((m) => m.specs.alturaTrabajo)
    .map((d) => (d && (d.estado === "confirmado" || d.estado === "estimado") ? d.valor : null))
    .filter((v): v is number => typeof v === "number");
  const min = Math.min(...alturas);
  const max = Math.max(...alturas);

  const COLUMNAS = [
    {
      icono: Boxes,
      titulo: "Amplia flota",
      texto: `${ALQUILER.length} referencias en catálogo, de ${min.toLocaleString("es-ES")} a ${max} m de altura de trabajo.`,
    },
    {
      icono: ShieldCheck,
      titulo: "Seguridad",
      texto:
        "Equipos revisados antes de cada salida y cumplimiento normativo documentado.",
    },
    {
      icono: MapPin,
      titulo: "Cobertura",
      texto: `${DELEGACIONES.length} delegaciones propias en España y Portugal, con transporte propio.`,
    },
    {
      icono: CalendarClock,
      titulo: "Experiencia",
      texto: `Desde el 24 de marzo de ${EMPRESA.fundacion}. ${EMPRESA.anios} años alquilando maquinaria.`,
    },
  ] as const;

  return (
    <section className="border-b border-rule bg-sunken">
      <div className="container-placa">
        <ul
          className="grid grid-cols-2 gap-px bg-rule lg:grid-cols-4 overflow-hidden rounded-2xl border border-rule"
          data-escalonar
        >
          {COLUMNAS.map((c) => (
            <li key={c.titulo} className="bg-sunken px-4 py-5 md:px-5 md:py-6">
              <c.icono
                size={22}
                strokeWidth={1.75}
                aria-hidden="true"
                className="text-accent"
              />
              <p className="label mt-3 text-ink">{c.titulo}</p>
              <p className="mt-1.5 max-w-[34ch] text-sm text-ink-2">{c.texto}</p>
            </li>
          ))}
        </ul>

        {/* Los sellos, todos con su logotipo: certificaciones a la
            izquierda y asociaciones a la derecha. Las ISO no van: son
            solo de la delegación de Asturias (cliente, 03/11/2026). */}
        <div className="grid gap-x-10 gap-y-5 border-t border-rule py-5 lg:grid-cols-[auto_auto] lg:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <p className="label-sm shrink-0 text-ink-3">Certificaciones</p>
            <Sellos grupo="certificacion" alto={44} />
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <p className="label-sm shrink-0 text-ink-3">Asociaciones</p>
            <Sellos grupo="asociacion" alto={36} />
          </div>
        </div>
      </div>
    </section>
  );
}
