import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { DELEGACIONES } from "@/content/es/empresa";
import "./globals.css";

/**
 * Tipografía.
 *
 * Montserrat en los titulares porque es lo que pidió la reunión:
 * «tenemos que utilizar su tipografía». El logotipo de JOFEMESA está
 * dibujado con una geométrica de caja alta —O casi circular, E de
 * brazos iguales, A de ápice apuntado— y Montserrat es la que se le
 * pega sin pagar una licencia ni desalinear el peso del rótulo.
 *
 * Geist Sans se queda en el texto corrido, donde Montserrat cansa a
 * partir del segundo párrafo, y Geist Mono en las etiquetas y en las
 * cifras, que es donde el sistema PLACA pide versalitas tabulares.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
