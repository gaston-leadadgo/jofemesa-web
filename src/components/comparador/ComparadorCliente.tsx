"use client";

import { useEffect } from "react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useComparar } from "@/lib/compare/context";
import { TablaComparador } from "./TablaComparador";

/**
 * El comparador lee de la URL, no de la bandeja: así una comparación se
 * puede compartir por WhatsApp y sigue funcionando al abrirla en otro
 * móvil. La bandeja es efímera; la URL es la que manda.
 *
 * Si se llega sin parámetro, se usa lo que haya en la bandeja y se escribe
 * en la URL — de paso queda enlazable.
 */
export function ComparadorCliente() {
  const [m, setM] = useQueryState(
    "m",
    parseAsArrayOf(parseAsString, ",").withDefault([]),
  );
  const { slugs } = useComparar();

  // Si se llega sin parámetro pero hay algo en la bandeja, se escribe en la
  // URL para que la comparación quede enlazable.
  useEffect(() => {
    if (m.length === 0 && slugs.length > 0) {
      void setM(slugs, { history: "replace" });
    }
  }, [m.length, slugs, setM]);

  return <TablaComparador slugs={m.length > 0 ? m : slugs} />;
}
