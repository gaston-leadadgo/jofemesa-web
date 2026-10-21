"""
Listado de material fotográfico pendiente, para el cliente.

    python scripts/material-fotografico-pendiente.py

Lee los datos que exporta la web Next.js al plugin (elementor-pro/plugin/
jofemesa-core/datos/), saca las máquinas que todavía no tienen fotografía
propia, agrupadas por familia y subcategoría en el orden del catálogo, y
escribe ../jofemesa-material-fotografico-pendiente.pdf (junto a Material/).

Hay que volver a generarlo cada vez que se carga material nuevo: después de
`npx tsx elementor-pro/scripts/exportar-datos.tsx`.
"""

import json
import sys
from datetime import date
from pathlib import Path

import fitz  # PyMuPDF

RAIZ = Path(__file__).resolve().parent.parent
DATOS = RAIZ / "elementor-pro" / "plugin" / "jofemesa-core" / "datos"
SALIDA = RAIZ.parent / "jofemesa-material-fotografico-pendiente.pdf"

FUENTES = Path("C:/Windows/Fonts")
NORMAL, NEGRITA, MONO = FUENTES / "arial.ttf", FUENTES / "arialbd.ttf", FUENTES / "consola.ttf"

TINTA = (0.07, 0.07, 0.08)
GRIS = (0.42, 0.42, 0.45)
GRIS_SUAVE = (0.62, 0.62, 0.65)
FILETE = (0.85, 0.85, 0.87)

ANCHO, ALTO = fitz.paper_size("a4")
M_IZQ, M_DER, M_SUP, M_INF = 50, 50, 56, 70

REQUISITOS = [
    "La unidad real de la flota, no una foto del catálogo del fabricante.",
    "Máquina completa, de perfil o 3/4, sobre fondo neutro y sin otra máquina delante.",
    "Formato JPG — la que salga de la cámara o el móvil sirve, la optimizamos al subirla.",
    "Un archivo por máquina como mínimo, nombrado con marca y modelo (p. ej. Takeuchi TB 216.jpg).",
    "Si una referencia ya no está en la flota, decídnoslo también para no pedir de más.",
]


def cargar():
    maquinas = json.loads((DATOS / "maquinas.json").read_text(encoding="utf-8"))
    familias = json.loads((DATOS / "familias.json").read_text(encoding="utf-8"))
    return maquinas, familias


class Documento:
    def __init__(self):
        self.doc = fitz.open()
        self.fuentes = {
            "n": fitz.Font(fontfile=str(NORMAL)),
            "b": fitz.Font(fontfile=str(NEGRITA)),
            "m": fitz.Font(fontfile=str(MONO)),
        }
        self.pagina = None
        self.y = 0
        self.nueva_pagina()

    def nueva_pagina(self):
        self.pagina = self.doc.new_page(width=ANCHO, height=ALTO)
        for clave, ruta in (("n", NORMAL), ("b", NEGRITA), ("m", MONO)):
            self.pagina.insert_font(fontname=f"f{clave}", fontfile=str(ruta))
        self.y = M_SUP

    def texto(self, x, y, cadena, tam, fuente="n", color=TINTA):
        self.pagina.insert_text((x, y), cadena, fontsize=tam, fontname=f"f{fuente}", color=color)

    def ancho(self, cadena, tam, fuente="n"):
        return self.fuentes[fuente].text_length(cadena, fontsize=tam)

    def a_la_derecha(self, y, cadena, tam, fuente="n", color=TINTA):
        self.texto(ANCHO - M_DER - self.ancho(cadena, tam, fuente), y, cadena, tam, fuente, color)

    def filete(self, y, grosor=0.6, color=FILETE):
        self.pagina.draw_line((M_IZQ, y), (ANCHO - M_DER, y), color=color, width=grosor)

    def sitio(self, alto):
        """Salta de página si no caben `alto` puntos más."""
        if self.y + alto > ALTO - M_INF:
            self.nueva_pagina()

    def pies(self):
        total = len(self.doc)
        for i, pagina in enumerate(self.doc, start=1):
            pagina.insert_text((M_IZQ, ALTO - 36), "JOFEMESA · material fotográfico pendiente",
                               fontsize=7.5, fontname="fn", color=GRIS)
            pie = f"Página {i} de {total}"
            pagina.insert_text((ANCHO - M_DER - self.ancho(pie, 7.5), ALTO - 36), pie,
                               fontsize=7.5, fontname="fn", color=GRIS)


def main():
    maquinas, familias = cargar()
    total = len(maquinas)
    pendientes = [m for m in maquinas if not m.get("foto")]
    con_foto = total - len(pendientes)
    pct = round(100 * len(pendientes) / total) if total else 0

    d = Documento()
    hoy = date.today().strftime("%d/%m/%Y")

    d.texto(M_IZQ, d.y + 14, "Material fotográfico pendiente", 18, "b")
    d.y += 36
    d.texto(M_IZQ, d.y, f"JOFEMESA · catálogo de alquiler · {hoy}", 9.5, "n", GRIS)
    d.y += 26
    d.texto(M_IZQ, d.y, f"{total} referencias  ·  {con_foto} con fotografía propia  ·  "
                         f"{len(pendientes)} pendientes ({pct}%)", 10.5, "b")
    d.y += 26
    d.texto(M_IZQ, d.y, "Qué necesitamos, por cada máquina", 9, "b")
    d.y += 15
    for linea in REQUISITOS:
        d.texto(M_IZQ, d.y, "•", 8.5)
        d.texto(M_IZQ + 8, d.y, linea, 8.5)
        d.y += 14
    d.y += 10
    d.filete(d.y)
    d.y += 24

    for familia in familias:
        suyas = [m for m in pendientes if m["familia"] == familia["id"]]
        if not suyas:
            continue
        d.sitio(60)
        d.texto(M_IZQ, d.y, familia["nombre"], 13, "b")
        d.a_la_derecha(d.y, f"{len(suyas)} pendiente{'' if len(suyas) == 1 else 's'}", 8.5, "n", GRIS)
        d.y += 7
        d.filete(d.y, 1.2, TINTA)
        d.y += 20

        orden_sub = [s["slug"] for s in familia.get("subcategorias", [])]
        grupos = {}
        for m in suyas:
            grupos.setdefault(m["subcategoria"], []).append(m)
        for slug in sorted(grupos, key=lambda s: orden_sub.index(s) if s in orden_sub else 999):
            filas = sorted(grupos[slug], key=lambda m: m.get("orden", 0))
            d.sitio(34)
            rotulo = (filas[0].get("subcategoriaNombre") or slug).upper()
            d.texto(M_IZQ, d.y, f"{rotulo}  ·  {len(filas)}", 7.5, "b", GRIS)
            d.y += 15
            for m in filas:
                d.sitio(14)
                x = M_IZQ + 6
                d.texto(x, d.y, m["marca"], 9, "n", GRIS)
                d.texto(x + d.ancho(m["marca"] + " ", 9), d.y, m["modelo"], 9, "b")
                d.a_la_derecha(d.y, m["slug"], 7, "m", GRIS_SUAVE)
                d.y += 14
            d.y += 10
        d.y += 8

    d.pies()
    d.doc.set_metadata({"title": "Material fotográfico pendiente · JOFEMESA", "author": "LeadAdGo"})
    d.doc.save(SALIDA, garbage=4, deflate=True)
    print(f"{SALIDA.name}: {total} referencias · {con_foto} con foto · {len(pendientes)} pendientes · {len(d.doc)} páginas")


if __name__ == "__main__":
    sys.exit(main())
