import type { NextConfig } from "next";

/**
 * Las dos redirecciones son consecuencia de la reunión del 24/08/2026:
 * venta y mantenimiento dejaron de ser pestañas y pasaron a ser dos
 * bloques dentro de /servicios. Las URL antiguas ya se habían enseñado
 * al cliente y estaban en la demo de Vercel, así que se redirigen en
 * vez de romperse. Permanentes porque la decisión está tomada.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/venta", destination: "/servicios#venta", permanent: true },
      {
        source: "/mantenimiento",
        destination: "/servicios#mantenimiento",
        permanent: true,
      },
      /* La taxonomía cambió al catálogo oficial: compactación dejó de
         ser familia y entró en excavación y movimiento de tierras. */
      {
        source: "/alquiler/compactacion",
        destination: "/alquiler/movimiento-tierras",
        permanent: true,
      },
      {
        source: "/alquiler/manipulacion",
        destination: "/alquiler/manutencion",
        permanent: true,
      },
      {
        source: "/creditos-imagen",
        destination: "/aviso-legal",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
