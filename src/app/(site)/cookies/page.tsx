import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de cookies",
  robots: { index: false },
};

export default function PaginaCookies() {
  return (
    <div className="container-placa py-10 md:py-12">
      <div className="max-w-[70ch]">
        <h1 className="display-2 text-ink">Política de cookies</h1>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="label text-ink-3">Estado actual</h2>
            <p className="mt-3 text-base text-ink-2">
              Tal y como está construida hoy, esta web{" "}
              <strong className="font-semibold text-ink">
                no instala ninguna cookie de seguimiento
              </strong>
              . Por eso no verás un aviso de cookies: no hay nada que
              consentir. Guardamos dos cosas en el propio navegador, que no
              salen de tu dispositivo y no identifican a nadie:
            </p>
            <dl className="mt-5 divide-y divide-rule border-y border-rule">
              <div className="py-3">
                <dt className="value text-ink">jofemesa.comparador.v1</dt>
                <dd className="mt-1 text-base text-ink-2">
                  Las máquinas que has marcado para comparar, para que no se
                  pierdan al cambiar de página. Almacenamiento local, no cookie.
                </dd>
              </div>
              <div className="py-3">
                <dt className="value text-ink">Respuestas del asesor</dt>
                <dd className="mt-1 text-base text-ink-2">
                  Van en la propia dirección de la página, para que puedas
                  compartir el resultado o volver atrás.
                </dd>
              </div>
            </dl>
          </section>

          <section className="border-l-2 border-wait bg-sunken px-5 py-4">
            <p className="label-sm text-ink-2">Antes de publicar</p>
            <p className="mt-2 text-base text-ink">
              En el momento en que se añada medición (Google Analytics,
              Google Ads, Meta Pixel o cualquier etiqueta de terceros), esta
              página deja de ser cierta y hace falta un banner de consentimiento
              real, con bloqueo previo. Conviene decidirlo antes del lanzamiento
              y no después.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
