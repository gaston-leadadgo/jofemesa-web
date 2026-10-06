import { cn } from "@/lib/utils/cn";
import { REDES } from "@/content/es/empresa";

/* Lucide ya no trae logos de marca: los trazos van aquí. LinkedIn y
   Facebook son los de Simple Icons (CC0); Instagram, su glifo de línea. */
const ICONOS: Record<(typeof REDES)[number]["id"], React.ReactNode> = {
  linkedin: (
    <path
      fill="currentColor"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  ),
  facebook: (
    <path
      fill="currentColor"
      d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
    />
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </g>
  ),
};

/** Los logos de las redes de JOFEMESA, cada uno enlazado a su perfil. */
export function RedesSociales({
  tamano = 15,
  className,
  enlaceClassName,
}: {
  tamano?: number;
  className?: string;
  enlaceClassName?: string;
}) {
  return (
    <ul className={cn("flex items-center", className)} aria-label="Redes sociales de JOFEMESA">
      {REDES.map((r) => (
        <li key={r.id} className="flex h-full">
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`JOFEMESA en ${r.nombre} (se abre en una pestaña nueva)`}
            title={r.nombre}
            className={cn(
              "flex items-center justify-center transition-colors duration-200",
              enlaceClassName,
            )}
          >
            <svg viewBox="0 0 24 24" width={tamano} height={tamano} aria-hidden="true">
              {ICONOS[r.id]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
