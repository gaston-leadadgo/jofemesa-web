"use client";

import { useCallback, useEffect, useState } from "react";
import { MAX_COMPARAR, useComparar } from "@/lib/compare/context";
import { reflejarEnUrl } from "@/lib/compare/url";
import { TablaComparador } from "./TablaComparador";
import { AnadirMaquina } from "./AnadirMaquina";

/**
 * El comparador lee de la URL, no de la bandeja: así una comparación se
 * puede compartir por WhatsApp y sigue funcionando al abrirla en otro
 * móvil. La bandeja es efímera; la URL es la que manda.
 *
 * Quién lee la URL importa: la lee el SERVIDOR y baja como prop. Cuando la
 * leía `useQueryState` hacía falta una frontera de Suspense, y Next servía
 * la tabla dentro de un `<div hidden>` detrás del pie con un recuadro gris
 * en su sitio: un enlace compartido abría en gris hasta que hidrataba, y
 * sin JavaScript no abría nunca.
 *
 * Si se llega sin parámetro, manda lo que haya en la bandeja.
 *
 * Al añadir desde aquí se escriben las dos cosas: la selección, que se
 * refleja en la URL para que el enlace siga siendo el estado, y la
 * bandeja, para que al volver al catálogo la casilla aparezca marcada.
 */
export function ComparadorCliente({ inicial }: { inicial: string[] }) {
  const { slugs, alternar } = useComparar();

  /** `null` = nadie ha tocado nada aquí todavía: manda la bandeja. */
  const [elegidas, setElegidas] = useState<string[] | null>(
    inicial.length > 0 ? inicial : null,
  );
  const puestas = elegidas ?? slugs;

  const setM = useCallback((siguiente: string[]) => {
    setElegidas(siguiente);
  }, []);

  /** La URL es un reflejo de la comparación, para poder compartirla. */
  useEffect(() => {
    reflejarEnUrl(puestas);
  }, [puestas]);

  return (
    <div className="space-y-8">
      <AnadirMaquina
        yaPuestas={puestas}
        onAnadir={(slug) => {
          if (puestas.includes(slug) || puestas.length >= MAX_COMPARAR) return;
          setM([...puestas, slug]);
          alternar(slug);
        }}
      />
      <TablaComparador slugs={puestas} />
    </div>
  );
}
