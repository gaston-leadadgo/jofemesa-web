import type { Metadata, Viewport } from "next";
import { Archivo, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { DELEGACIONES } from "@/content/es/empresa";
import "./globals.css";

/**
 * Tipografía: la misma que la versión de Emilio.
 *
 * **Archivo** en los titulares y **Plus Jakarta Sans** en el texto
 * corrido. Es un cambio deliberado respecto a Montserrat extrabold, que
 * es lo que había: una geométrica de caja alta a peso 800 da un bloque
 * macizo, y eso leído en pantalla completa resulta tosco. Archivo es
 * una grotesca de proporción estrecha que aguanta pesos ligeros sin
 * deshacerse, así que los titulares pueden ir en **300 y 400** —de ahí
 * viene la elegancia, no de la escala— y el conjunto respira.
 *
 * Las dos son fuentes variables de Google, muy comunes y sin licencia
 * que pagar, y las dos traen cifras tabulares.
 *
 * Geist Mono se queda, pero SOLO para columnas de cifras que tienen que
 * alinearse —tabla del comparador y especificaciones—. Las etiquetas de
 * sección ya no van en mono: van en Plus Jakarta Sans en caja alta con
 * interletrado abierto, que es lo que hace la versión de Emilio y pesa
 * bastante menos en pantalla.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jofemesa.com"),
  title: {
    default: `JOFEMESA · Alquiler de maquinaria en ${DELEGACIONES.length} delegaciones`,
    template: "%s · JOFEMESA",
  },
  description:
    "Alquiler de plataformas elevadoras, manipuladores telescópicos, carretillas, movimiento de tierras y energía. Diez delegaciones propias en España y Portugal. Consulta disponibilidad y te la confirma la delegación que tiene la máquina.",
  applicationName: "JOFEMESA",
  authors: [{ name: "JOFEME S.A." }],
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // nunca se desactiva el zoom
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${jakarta.variable} ${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
