import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getMaquina } from "@/lib/catalog";
import { fechaCorta } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Solicitudes recibidas",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface Solicitud {
  ref: string;
  recibida: string;
  tipo: string;
  maquinas: string[];
  fechaInicio: string;
  fechaFin: string;
  provincia: string;
  localidad: string;
  delegacionSugerida: string | null;
  empresa: string;
  cif: string;
  contacto: string;
  telefono: string;
  email: string;
  notas?: string;
  contextoAsesor?: string;
}

async function leer(): Promise<Solicitud[]> {
  try {
    const crudo = await readFile(
      join(process.cwd(), ".data", "solicitudes.jsonl"),
      "utf8",
    );
    return crudo
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as Solicitud)
      .reverse();
  } catch {
    return [];
  }
}

/**
 * Bandeja de solicitudes. Página interna, sin enlazar desde ningún menú y
 * marcada como noindex.
 *
 * Existe por una razón concreta: poder enseñarle al cliente que el
 * formulario captura de verdad, con su referencia, sus fechas y sus
 * máquinas. Es la diferencia entre "esto funcionará" y "aquí está tu lead".
 */
export default async function PaginaSolicitudes() {
  const solicitudes = await leer();

  return (
    <div className="container-placa py-14">
      <p className="label text-ink-3">Interno · no indexado</p>
      <h1 className="display-2 mt-4 text-ink">Solicitudes recibidas</h1>
      <p className="lede mt-5 max-w-[62ch] text-ink-2">
        Todo lo que entra por el formulario se guarda aquí y se imprime en la
        consola del servidor. Con las variables de entorno configuradas se
        reenvía además por correo o al CRM, sin tocar código.
      </p>

      {solicitudes.length === 0 ? (
        <p className="mt-10 border border-rule bg-sunken p-6 text-base text-ink-2">
          Todavía no hay ninguna. Envía el formulario de{" "}
          <span className="value">/consultar-disponibilidad</span> y aparecerá
          aquí.
        </p>
      ) : (
        <>
          <p className="value-lg mt-10 text-ink">
            {solicitudes.length}
            <span className="ml-2 text-base font-normal text-ink-2">
              en total
            </span>
          </p>

          <ul className="mt-6 space-y-px bg-rule">
            {solicitudes.map((s) => (
              <li key={s.ref} className="bg-surface p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="value-lg text-ink">{s.ref}</p>
                  <p className="label-sm text-ink-3">
                    {fechaCorta(s.recibida)} · {s.tipo}
                  </p>
                </div>

                <dl className="mt-5 grid gap-x-8 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
                  <Dato k="Empresa">
                    {s.empresa}
                    <span className="value ml-2 text-sm text-ink-3">{s.cif}</span>
                  </Dato>
                  <Dato k="Contacto">
                    {s.contacto}
                    <br />
                    <a href={`tel:${s.telefono}`} className="value text-accent">
                      {s.telefono}
                    </a>
                    <br />
                    <a href={`mailto:${s.email}`} className="text-ink-2 underline">
                      {s.email}
                    </a>
                  </Dato>
                  <Dato k="Obra">
                    {s.localidad} ({s.provincia})
                    {s.delegacionSugerida && (
                      <>
                        <br />
                        <span className="label-sm text-ink-3">
                          Delegación: {s.delegacionSugerida}
                        </span>
                      </>
                    )}
                  </Dato>
                  <Dato k="Fechas">
                    <span className="value">
                      {s.fechaInicio} → {s.fechaFin}
                    </span>
                  </Dato>
                  <Dato k="Máquinas">
                    {s.maquinas.length === 0
                      ? "Sin especificar"
                      : s.maquinas
                          .map((slug) => {
                            const m = getMaquina(slug);
                            return m ? `${m.marca} ${m.modelo}` : slug;
                          })
                          .join(" · ")}
                  </Dato>
                  {s.contextoAsesor && (
                    <Dato k="Asesor">{s.contextoAsesor}</Dato>
                  )}
                </dl>

                {s.notas && (
                  <p className="mt-4 border-l-2 border-rule-strong bg-sunken px-4 py-3 text-base text-ink-2">
                    {s.notas}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Dato({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label-sm text-ink-3">{k}</dt>
      <dd className="mt-1 text-base text-ink">{children}</dd>
    </div>
  );
}
