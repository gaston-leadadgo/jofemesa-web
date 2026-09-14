import type { MetadataRoute } from "next";
import { CATALOGO } from "@/lib/catalog";
import { FAMILIAS } from "@/lib/catalog/familias";

/**
 * Un árbol de URLs limpio.
 *
 * El sitemap actual de jofemesa.com tiene unas 280 entradas de las que
 * cerca de 150 son la misma categoría repetida bajo distintos padres
 * (/manipuladores/venta-de-recambios/ y así). Aquí cada cosa aparece una
 * vez y en un solo sitio.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.jofemesa.com";
  const ahora = new Date();

  return [
    { url: `${base}/`, priority: 1, changeFrequency: "weekly", lastModified: ahora },
    { url: `${base}/alquiler`, priority: 0.9, changeFrequency: "weekly", lastModified: ahora },
    { url: `${base}/asesor`, priority: 0.8, changeFrequency: "monthly", lastModified: ahora },
    { url: `${base}/servicios`, priority: 0.8, changeFrequency: "monthly", lastModified: ahora },
    { url: `${base}/delegaciones`, priority: 0.8, changeFrequency: "monthly", lastModified: ahora },
    { url: `${base}/noticias`, priority: 0.7, changeFrequency: "weekly", lastModified: ahora },
    { url: `${base}/contacto`, priority: 0.7, changeFrequency: "yearly", lastModified: ahora },
    { url: `${base}/consultar-disponibilidad`, priority: 0.7, changeFrequency: "yearly", lastModified: ahora },
    ...FAMILIAS.map((f) => ({
      url: `${base}/alquiler/${f.slug}`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: ahora,
    })),
    ...CATALOGO.map((m) => ({
      url: `${base}/maquina/${m.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: ahora,
    })),
    { url: `${base}/aviso-legal`, priority: 0.1, lastModified: ahora },
    { url: `${base}/privacidad`, priority: 0.1, lastModified: ahora },
    { url: `${base}/cookies`, priority: 0.1, lastModified: ahora },
  ];
}
