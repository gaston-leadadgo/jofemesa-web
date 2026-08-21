import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jofemesa.com"),
  title: {
    default: "JOFEMESA · Alquiler de maquinaria en ocho provincias",
    template: "%s · JOFEMESA",
  },
  description:
    "Alquiler de plataformas elevadoras, manipuladores telescópicos y carretillas. Ocho delegaciones propias en España. Consulta disponibilidad y te la confirmamos desde la delegación que tiene la máquina.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
