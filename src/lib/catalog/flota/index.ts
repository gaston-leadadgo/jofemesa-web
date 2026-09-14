import type { Maquina } from "../types";
import { FLOTA_ELEVACION } from "./elevacion";
import { FLOTA_GAMAS } from "./gamas";
import { FLOTA_TIERRAS } from "./tierras";

/**
 * La flota completa, en el orden del catálogo general impreso.
 *
 * 80 plataformas elevadoras + 50 máquinas de tierras y compactación +
 * 15 gamas de manutención, energía, aire y herramienta = 145 entradas.
 *
 * No hay ninguna máquina aquí que no esté en el catálogo del cliente, y
 * no falta ninguna de las que sí están. Es el cambio de fondo de esta
 * entrega: la versión anterior publicaba 67 máquinas de las que 23 no
 * aparecen en su catálogo (Genie GS-1530, GS-1930, GS-3232, la serie ES
 * de JLG, los Haulotte Compact 8/10/12, los H-SX, un Pramac que no
 * distribuyen, un Hinowa que no tienen…) y dejaba fuera casi todo lo
 * que sí alquilan: las columnas verticales, los brazos articulados
 * diésel, los telescópicos hasta 57 m, las orugas, los camiones cesta,
 * las doce retroexcavadoras Takeuchi, los dúmperes y la compactación.
 */
export const FLOTA: Maquina[] = [
  ...FLOTA_ELEVACION,
  ...FLOTA_GAMAS,
  ...FLOTA_TIERRAS,
];

export { FLOTA_ELEVACION, FLOTA_GAMAS, FLOTA_TIERRAS };
