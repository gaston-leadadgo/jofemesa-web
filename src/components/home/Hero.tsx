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
      alt: "Sede de JOFEMESA en Valencia al atardecer, con plataformas elevadoras de brazo y de tijera en la campa",
      /* «Hero v2» de la agencia (04/11/2026), sobre la foto de la sede de
         Valencia. 60%: en móvil la franja visible cae entre la fachada
         rotulada y las plataformas de brazo. */
      posicion: "object-[60%_center]",
      /* La foto ya es oscura (atardecer): con el velo de siempre la mitad
         izquierda quedaba casi negra. Este es más ligero, para que se vea
         como la portada de Formación (cliente, 04/11/2026). */
      velo: "bg-gradient-to-t from-inverse/88 via-inverse/62 to-inverse/25 lg:bg-gradient-to-r lg:from-inverse/88 lg:via-inverse/58 lg:via-45% lg:to-transparent lg:to-78%",
    },
    formacion: formacion
      ? {
          src: formacion,
          alt: "Monitora de JOFEMESA Formación, con casco y arnés, da indicaciones a un operario en la cesta de una plataforma de brazo articulado",
          /* Foto de prueba del 03/11/2026: la plataforma y la monitora
             ocupan del 45 al 100 % del ancho. En móvil la franja visible
             tiene que caer sobre ellas. */
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
