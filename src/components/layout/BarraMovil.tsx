import Link from "next/link";
import { Phone, MessageCircle, Wrench } from "lucide-react";
import { TELEFONO_PRINCIPAL, WHATSAPP } from "@/content/es/empresa";

/**
 * Barra de acciones fija en móvil, en todas las páginas.
 *
 * Tres objetivos de 48px con separación real: el usuario de esta web está
 * en una obra, de pie, con guantes y con sol de frente.
 */
export function BarraMovil() {
  const conWhatsapp = Boolean(WHATSAPP.numero);

  return (
    <div
      data-surface="dark"
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-rule-inverse bg-inverse md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className={`grid ${conWhatsapp ? "grid-cols-3" : "grid-cols-2"} divide-x divide-rule-inverse`}
      >
        <a
          href={`tel:${TELEFONO_PRINCIPAL.tel}`}
          className="flex min-h-16 flex-col items-center justify-center gap-1 text-ink-inv"
        >
          <Phone size={20} strokeWidth={1.75} aria-hidden="true" />
          <span className="label-sm">Llamar</span>
        </a>

        {conWhatsapp && (
          <a
            href={`https://wa.me/${WHATSAPP.numero}`}
            className="flex min-h-16 flex-col items-center justify-center gap-1 text-ink-inv"
          >
            <MessageCircle size={20} strokeWidth={1.75} aria-hidden="true" />
            <span className="label-sm">WhatsApp</span>
          </a>
        )}

        <Link
          href="/consultar-disponibilidad"
          className="flex min-h-16 flex-col items-center justify-center gap-1 bg-accent text-white"
        >
          <Wrench size={20} strokeWidth={1.75} aria-hidden="true" />
          <span className="label-sm">Consultar</span>
        </Link>
      </div>
    </div>
  );
}
