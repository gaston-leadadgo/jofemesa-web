/**
 * Entrada del paquete del asesor para WordPress.
 *
 *   npx esbuild elementor-pro/scripts/entrada-asesor.ts --bundle --minify \
 *     --format=iife --target=es2018 --alias:@=./src \
 *     --outfile=elementor-pro/plugin/jofemesa-core/assets/js/asesor-motor.js
 *
 * Es la MISMA función `recomendar()` de la web Next.js, con el catálogo
 * dentro. La interfaz (jofemesa.js) solo recibe slugs y razones, y pinta las
 * tarjetas con los datos que ya imprime el plugin.
 */
import {
  ENTORNOS,
  PARAMETROS,
  TRABAJOS,
  recomendar,
  resumenRespuestas,
  type Respuestas,
} from "@/lib/advisor";

const aSlugs = (lista: { maquina: { slug: string }; puntos: number; razones: string[] }[]) =>
  lista.map((r) => ({ slug: r.maquina.slug, puntos: r.puntos, razones: r.razones }));

(window as unknown as { JMAsesor: unknown }).JMAsesor = {
  TRABAJOS,
  PARAMETROS,
  ENTORNOS,
  resumen: (r: Respuestas) => resumenRespuestas(r),
  recomendar(r: Respuestas) {
    const res = recomendar(r);
    return {
      recomendadas: aSlugs(res.recomendadas),
      alternativas: aSlugs(res.alternativas),
      enlaceCatalogo: res.enlaceCatalogo,
      relajado: res.relajado,
    };
  },
};
