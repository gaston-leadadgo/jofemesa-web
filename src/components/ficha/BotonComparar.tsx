"use client";

import { Check, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useComparar, MAX_COMPARAR } from "@/lib/compare/context";

export function BotonComparar({
  slug,
  nombre,
}: {
  slug: string;
  nombre: string;
}) {
  const { contiene, alternar, lleno } = useComparar();
  const marcada = contiene(slug);
  const bloqueada = lleno && !marcada;

  return (
    <button
      type="button"
      onClick={() => alternar(slug)}
      disabled={bloqueada}
      className={cn(
        "flex h-12 w-full items-center justify-center gap-2 border text-base font-semibold transition-colors duration-200",
        marcada
          ? "border-ink bg-ink text-white"
          : "border-rule-control text-ink hover:bg-sunken",
        bloqueada && "cursor-not-allowed opacity-50",
      )}
      title={
        bloqueada
          ? `Ya hay ${MAX_COMPARAR} máquinas en el comparador`
          : undefined
      }
    >
      {marcada ? (
        <Check size={18} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <Columns3 size={18} strokeWidth={1.75} aria-hidden="true" />
      )}
      {marcada ? "En el comparador" : "Añadir al comparador"}
      <span className="sr-only"> — {nombre}</span>
    </button>
  );
}
