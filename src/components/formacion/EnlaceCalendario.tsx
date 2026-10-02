"use client";

import Link from "next/link";
import { elegirCursoCalendario } from "@/lib/formacion/estado";
import type { CursoConvocatoriaId } from "@/content/es/formacion";

/** Salta al calendario con el curso ya filtrado. */
export function EnlaceCalendario({
  curso,
  className,
  children,
}: {
  curso: CursoConvocatoriaId | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href="/formacion#calendario"
      onClick={() => elegirCursoCalendario(curso)}
      className={className}
    >
      {children}
    </Link>
  );
}
