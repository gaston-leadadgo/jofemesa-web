"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { useComparar, MAX_COMPARAR } from "@/lib/compare/context";
import { getMaquina } from "@/lib/catalog";
import { ImagenMaquina } from "@/components/maquina/ImagenMaquina";

/**
 * Bandeja persistente del comparador. Aparece al marcar la primera máquina
 * y sobrevive a la navegación porque vive en el layout.
 *
 * En móvil se sienta justo encima de la barra de acciones, nunca encima.
 */
export function BandejaComparador() {
  const { slugs, quitar, limpiar } = useComparar();
  const pathname = usePathname();

  // En el propio comparador la bandeja sería redundante.
  // Antes de hidratar el snapshot es una lista vacía, así que la bandeja
  // simplemente no se dibuja: no hace falta bandera de hidratación.
  if (slugs.length === 0 || pathname === "/comparador") return null;

  const maquinas = slugs.map(getMaquina).filter(Boolean);

  return (
    <div
      className="no-print fixed inset-x-0 bottom-16 z-30 border-t border-rule bg-inverse text-ink-inv md:bottom-0"
      data-surface="dark"
      role="region"
      aria-label="Máquinas seleccionadas para comparar"
    >
      <div className="container-placa flex items-center gap-4 py-3">
        <p className="label-sm hidden shrink-0 text-ink-inv-3 md:block">
          Comparar
          <span className="ml-2 text-ink-inv">
            {slugs.length}/{MAX_COMPARAR}
          </span>
        </p>

        <ul className="flex flex-1 items-center gap-2 overflow-x-auto">
          {maquinas.map((m) => (
            <li
              key={m!.slug}
              className="relative flex shrink-0 items-center gap-2 border border-rule-inverse bg-inverse-2 pr-1"
            >
              <span className="relative block size-11 shrink-0 overflow-hidden bg-muted">
                <ImagenMaquina maquina={m!} sizes="44px" compacto />
              </span>
              <span className="max-w-32 truncate py-1 text-sm text-ink-inv">
                {m!.modelo}
              </span>
              <button
                type="button"
                onClick={() => quitar(m!.slug)}
                className="flex size-11 items-center justify-center text-ink-inv-3 transition-colors duration-200 hover:text-ink-inv"
                aria-label={`Quitar ${m!.marca} ${m!.modelo} del comparador`}
              >
                <X size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={limpiar}
          className="hidden min-h-11 shrink-0 px-2 text-sm text-ink-inv-3 underline transition-colors duration-200 hover:text-ink-inv md:block"
        >
          Vaciar
        </button>

        <Link
          href={`/comparador?m=${slugs.join(",")}`}
          className="btn-accent flex h-12 shrink-0 items-center gap-2 bg-accent px-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-hover pastilla"
        >
          Comparar
          <span className="value text-white md:hidden">({slugs.length})</span>
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
