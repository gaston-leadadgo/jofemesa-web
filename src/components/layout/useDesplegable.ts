"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Abre y cierra un desplegable de la cabecera.
 *
 * Se abre con clic, no al pasar por encima: la franja superior también
 * se ve en tableta, y ahí un hover que abre más un clic que alterna
 * dejaban el panel cerrándose en el mismo toque que lo abría. Se cierra
 * con Escape (devolviendo el foco al botón), con un clic fuera y cuando
 * el foco sale del bloque con el tabulador.
 */
export function useDesplegable<T extends HTMLElement = HTMLButtonElement>() {
  const [abierto, setAbierto] = useState(false);
  const bloque = useRef<HTMLDivElement>(null);
  const boton = useRef<T>(null);

  useEffect(() => {
    if (!abierto) return;
    const alPulsarFuera = (e: PointerEvent) => {
      if (!bloque.current?.contains(e.target as Node)) setAbierto(false);
    };
    const alPulsarTecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      boton.current?.focus();
    };
    document.addEventListener("pointerdown", alPulsarFuera);
    document.addEventListener("keydown", alPulsarTecla);
    return () => {
      document.removeEventListener("pointerdown", alPulsarFuera);
      document.removeEventListener("keydown", alPulsarTecla);
    };
  }, [abierto]);

  const alPerderFoco = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setAbierto(false);
  };

  return { abierto, setAbierto, bloque, boton, alPerderFoco };
}
