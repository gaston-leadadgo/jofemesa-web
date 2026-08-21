import { z } from "zod";

/**
 * El mismo esquema en cliente y servidor. La validación de cliente es
 * comodidad; la del servidor es la verdad.
 */

/** Dígito de control real de CIF y NIF españoles. */
function cifValido(v: string): boolean {
  const s = v.toUpperCase().replace(/[\s-]/g, "");

  // NIF de persona física: 8 dígitos + letra
  if (/^\d{8}[A-Z]$/.test(s)) {
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    return letras[Number(s.slice(0, 8)) % 23] === s[8];
  }
  // NIE
  if (/^[XYZ]\d{7}[A-Z]$/.test(s)) {
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const n = Number(String("XYZ".indexOf(s[0])) + s.slice(1, 8));
    return letras[n % 23] === s[8];
  }
  // CIF de sociedad: letra + 7 dígitos + control
  if (/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(s)) {
    const digitos = s.slice(1, 8).split("").map(Number);
    let suma = 0;
    digitos.forEach((d, i) => {
      if (i % 2 === 0) {
        const doble = d * 2;
        suma += doble > 9 ? doble - 9 : doble;
      } else {
        suma += d;
      }
    });
    const control = (10 - (suma % 10)) % 10;
    const ultimo = s[8];
    return ultimo === String(control) || ultimo === "JABCDEFGHI"[control];
  }
  return false;
}

const HOY = () => new Date().toISOString().slice(0, 10);

export const esquemaSolicitud = z
  .object({
    tipo: z
      .enum(["alquiler", "venta", "recambios", "mantenimiento"])
      .default("alquiler"),

    maquinas: z.array(z.string()).default([]),

    fechaInicio: z
      .string()
      .min(1, "Dinos cuándo la necesitas.")
      .refine((v) => v >= HOY(), "La fecha de inicio no puede ser pasada."),
    fechaFin: z.string().min(1, "Dinos hasta cuándo la necesitas."),

    provincia: z.string().min(1, "Elige la provincia de la obra."),
    localidad: z.string().trim().min(2, "Indica la localidad de la obra."),
    direccionObra: z.string().trim().optional().default(""),

    empresa: z.string().trim().min(2, "Necesitamos el nombre de la empresa."),
    cif: z.string().trim().min(1, "Necesitamos el CIF o NIF."),
    contacto: z.string().trim().min(2, "¿Con quién hablamos?"),
    telefono: z
      .string()
      .trim()
      .regex(
        /^(?:\+34[\s-]?)?[6789]\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}$/,
        "Revisa el teléfono: nueve dígitos, fijo o móvil.",
      ),
    email: z.string().trim().email("Revisa el correo electrónico."),

    notas: z.string().trim().max(2000).optional().default(""),
    contextoAsesor: z.string().trim().max(500).optional().default(""),

    consentimiento: z.literal(
      "on",
      "Necesitamos tu consentimiento para poder contactarte.",
    ),

    /* --- antispam sin CAPTCHA --- */
    _trampa: z.string().max(0).optional().default(""),
    _t: z.string().optional().default(""),
  })
  .refine((d) => d.fechaFin >= d.fechaInicio, {
    path: ["fechaFin"],
    message: "La fecha de fin tiene que ser posterior a la de inicio.",
  });

export type DatosSolicitud = z.infer<typeof esquemaSolicitud>;

/**
 * El CIF se comprueba pero NO bloquea: rechazar un lead real por un dígito
 * de control es mucho peor que aceptar un CIF mal escrito. Se avisa y se
 * deja pasar.
 */
export function avisoCif(cif: string): string | null {
  if (!cif.trim()) return null;
  return cifValido(cif)
    ? null
    : "Este CIF/NIF no cuadra con el dígito de control. Puedes enviarlo igualmente y lo comprobamos nosotros.";
}

export const PROVINCIAS = [
  "A Coruña", "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila",
  "Badajoz", "Baleares", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria",
  "Castellón", "Ceuta", "Ciudad Real", "Córdoba", "Cuenca", "Girona", "Granada",
  "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "La Rioja",
  "Las Palmas", "León", "Lleida", "Lugo", "Madrid", "Málaga", "Melilla",
  "Murcia", "Navarra", "Ourense", "Palencia", "Pontevedra", "Salamanca",
  "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona",
  "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora",
  "Zaragoza", "Portugal",
] as const;
