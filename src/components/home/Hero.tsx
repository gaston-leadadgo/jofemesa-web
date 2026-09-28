import { ambiente, heroPortada } from "@/lib/img/ambiente";
import { HeroCarrusel, type FotoHero } from "./HeroCarrusel";

/**
 * S1 · Hero, en carrusel de dos portadas: Alquiler y Formación.
 *
 * El cliente pidió (28/09/2026) que Formación ganase peso y que el hero
 * se moviera; la referencia era el slider de loxamhune.com, «pero mucho
 * más dinámico». Lo que lo separa de un slider de flechas:
 *
 *   · La portada entra con un barrido de cortina y una cuchilla roja que
 *     cruza la pantalla —el grafismo de sus láminas de Interempresas—.
 *   · La foto se acerca despacio mientras está en pantalla.
 *   · El texto entra escalonado cada vez que cambia la portada.
 *   · El temporizador ES la barra de progreso de la pestaña: se para al
 *     pasar el ratón o al escribir en el buscador, y con «reducir
 *     movimiento» no avanza solo.
 *
 * Este componente es de servidor solo para mirar en disco qué fotos hay:
 * si falta `public/img/hero/formacion.jpg`, la portada de Formación usa
 * la de obra reencuadrada hasta que llegue la suya (prompt en el LEEME).
 */
export function Hero() {
  const obra = heroPortada() ?? "/img/hero/portada.jpg";
  const formacion = ambiente("hero/formacion");

  const fotos: Record<"alquiler" | "formacion", FotoHero> = {
    alquiler: {
      src: obra,
      alt: "Plataforma elevadora de tijera trabajando en la estructura de una nave",
      /* 72%: en móvil la sección es vertical y la franja visible cae
         sobre la máquina en vez de sobre el cielo vacío. */
      posicion: "object-[72%_center]",
    },
    formacion: formacion
      ? {
          src: formacion,
          alt: "Instructor explicando los mandos de una plataforma elevadora de tijera a dos alumnos con casco y arnés",
          /* El grupo ocupa del 60 al 95 % del ancho: en móvil la franja
             visible tiene que caer sobre ellos. Contraste medido con el
             velo en el peor punto: 11,1:1 titular, 6,8:1 entradilla. */
          posicion: "object-[80%_center]",
        }
      : {
          src: obra,
          alt: "",
          posicion: "object-[20%_center] -scale-x-100",
          provisional: true,
        },
  };

  return <HeroCarrusel fotos={fotos} />;
}
