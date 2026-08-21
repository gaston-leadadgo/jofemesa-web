"use server";

import { redirect } from "next/navigation";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { esquemaSolicitud, type DatosSolicitud } from "./schema";
import { getMaquina } from "@/lib/catalog";
import { DELEGACIONES_OPERATIVAS } from "@/content/es/empresa";

export interface EstadoFormulario {
  ok: boolean;
  errores?: Record<string, string>;
  valores?: Record<string, string>;
}

/** SOL-2026-0417: fecha más un contador por día. */
function referencia(): string {
  const d = new Date();
  const dia = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  const azar = Math.floor(Math.random() * 90 + 10);
  return `SOL-${d.getFullYear()}-${String(dia).padStart(3, "0")}${azar}`;
}

/** Delegación más probable según la provincia de la obra. */
function delegacionSugerida(provincia: string) {
  const directa = DELEGACIONES_OPERATIVAS.find(
    (d) => d.provincia.toLowerCase() === provincia.toLowerCase(),
  );
  return directa?.nombre ?? null;
}

/* ============================================================
   Sumideros. Los dos primeros están siempre activos; los otros dos
   se encienden solos si aparecen sus variables de entorno. Salir a
   producción es editar un .env, no reescribir nada.
   ============================================================ */

async function sumideroConsola(ref: string, d: DatosSolicitud) {
  const maquinas = d.maquinas
    .map((s) => {
      const m = getMaquina(s);
      return m ? `${m.marca} ${m.modelo}` : s;
    })
    .join(", ");

  console.log(
    [
      "",
      "─".repeat(62),
      `  NUEVA SOLICITUD  ${ref}   (${d.tipo})`,
      "─".repeat(62),
      `  Máquinas    ${maquinas || "sin especificar"}`,
      `  Fechas      ${d.fechaInicio} → ${d.fechaFin}`,
      `  Obra        ${d.localidad} (${d.provincia})${d.direccionObra ? ` · ${d.direccionObra}` : ""}`,
      `  Delegación  ${delegacionSugerida(d.provincia) ?? "a asignar"}`,
      `  Empresa     ${d.empresa} · ${d.cif}`,
      `  Contacto    ${d.contacto} · ${d.telefono} · ${d.email}`,
      d.contextoAsesor ? `  Asesor      ${d.contextoAsesor}` : null,
      d.notas ? `  Notas       ${d.notas}` : null,
      "─".repeat(62),
      "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

async function sumideroFichero(ref: string, d: DatosSolicitud) {
  try {
    const dir = join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      join(dir, "solicitudes.jsonl"),
      JSON.stringify({
        ref,
        recibida: new Date().toISOString(),
        delegacionSugerida: delegacionSugerida(d.provincia),
        ...d,
        _trampa: undefined,
        _t: undefined,
      }) + "\n",
      "utf8",
    );
  } catch (e) {
    console.error("No se pudo escribir la solicitud en disco:", e);
  }
}

async function sumideroWebhook(ref: string, d: DatosSolicitud) {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref, ...d }),
    });
  } catch (e) {
    console.error("El webhook de leads falló:", e);
  }
}

/* ============================================================
   La acción
   ============================================================ */

export async function enviarSolicitud(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const crudo = Object.fromEntries(formData.entries()) as Record<string, string>;

  // Antispam: campo trampa relleno o envío en menos de tres segundos.
  if (crudo._trampa) return { ok: true };
  const t0 = Number(crudo._t);
  if (t0 && Date.now() - t0 < 3000) {
    return {
      ok: false,
      errores: { _global: "Envío demasiado rápido. Inténtalo otra vez." },
      valores: crudo,
    };
  }

  const datos = {
    ...crudo,
    maquinas: formData.getAll("maquinas").map(String).filter(Boolean),
  };

  const r = esquemaSolicitud.safeParse(datos);
  if (!r.success) {
    const errores: Record<string, string> = {};
    for (const issue of r.error.issues) {
      const clave = String(issue.path[0] ?? "_global");
      errores[clave] ??= issue.message;
    }
    return { ok: false, errores, valores: crudo };
  }

  const ref = referencia();
  await Promise.all([
    sumideroConsola(ref, r.data),
    sumideroFichero(ref, r.data),
    sumideroWebhook(ref, r.data),
  ]);

  redirect(`/consultar-disponibilidad/gracias?ref=${ref}`);
}
