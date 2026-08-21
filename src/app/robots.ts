import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // El comparador y el panel interno no aportan nada en un buscador.
        disallow: ["/admin/", "/comparador"],
      },
    ],
    sitemap: "https://www.jofemesa.com/sitemap.xml",
  };
}
