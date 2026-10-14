# Manual de Formación · jofemesa.com

Guía para el equipo de Formación de JOFEMESA. Explica cómo crear cursos, programar fechas y gestionar plazas desde el escritorio de WordPress.

La misma guía está dentro del escritorio, en **Formación → Guía de uso**. Si cambias una, cambia también la otra (`plugin/jofemesa-core/includes/81-guia-formacion.php`).

> **Lo más importante:** todo se gestiona desde el menú **Formación**. No hace falta abrir Elementor ni tocar el diseño. Lo que guardes aquí aparece al momento en:
> - el calendario de la web;
> - la ficha de cada curso;
> - el formulario de solicitud.

---

## 1. Cómo está organizado

En el menú lateral del escritorio, **Formación** tiene cinco apartados:

| Apartado | Para qué sirve |
|---|---|
| **Panel** | El día a día: programar fechas, ver la agenda, ajustar plazas y ver el calendario del mes. |
| **Convocatorias** | El listado completo de fechas, con filtros por curso y sede y las pestañas *Próximas* y *Celebradas*. |
| **Cursos** | La ficha de cada curso: nombre, norma, duración, descripción y preguntas frecuentes. |
| **Sedes** | Los centros donde se imparte cada curso, con su dirección y su enlace al mapa. |
| **Guía de uso** | Esta guía. |

Una **convocatoria** es un curso en una fecha y una sede concretas. Es lo que aparece en el calendario de la web.

El **Panel** tiene, de arriba abajo:
- cuatro cifras: próximas convocatorias, la próxima fecha, los cursos con fechas y las plazas libres;
- avisos, si hay algo que hacer;
- a la izquierda, *Programar fechas* y la *Agenda*;
- a la derecha, el calendario, los cursos y las sedes.

---

## 2. Programar fechas

Se pueden crear varias fechas a la vez:

1. Abre **Formación → Panel** y busca la tarjeta **Programar fechas**.
2. Elige el **curso** y la **sede**.
3. Añade las **fechas**, de cualquiera de estas dos formas:
   - elige un día en el selector y pulsa **Añadir fecha** (o la tecla Intro);
   - pulsa directamente el día en el **calendario** de la derecha.

   Puedes añadir todas las que quieras. Para quitar una, pulsa la **×** de su etiqueta o vuelve a pulsar el día en el calendario.
4. Revisa el **horario**: por defecto es de 07:30 a 15:30.
5. Opcional: indica las **plazas**. Si las dejas vacías, la web muestra «Consultar plazas».
6. Pulsa **Crear convocatorias**. Se publican al momento y aparecen resaltadas en la agenda.

**Atajos:**
- En la agenda, el botón **Programar otra fecha igual** (dos flechas) rellena el formulario con el mismo curso, sede, horario y plazas. Solo falta elegir el día.
- En la tarjeta **Cursos**, el botón **+ Fechas** de cada curso deja el formulario listo con ese curso.

Si una fecha ya existe para ese curso y esa sede, no se crea dos veces. El panel te lo indica.

---

## 3. Cambiar o anular una fecha

- **Cambiar el día, la hora o la sede.** En la agenda, pulsa el **lápiz** de la fecha. Cambia lo que necesites y pulsa **Actualizar**. La caja de la derecha muestra cómo queda en la web.
- **Anular una fecha.** Pulsa la **papelera**: la fecha desaparece de la web al instante.
  - Si te has equivocado, pulsa **Deshacer** en el aviso que aparece abajo.
  - También puedes recuperarla desde **Convocatorias → Papelera → Restaurar**, durante 30 días. Vuelve publicada.
- **Fechas ya celebradas.** No hace falta borrarlas: al día siguiente dejan de verse en la web. Se quedan en la pestaña *Celebradas* como histórico.

---

## 4. Plazas (opcional)

Si una convocatoria no tiene **plazas totales**, la web muestra «Consultar plazas».

Si indicas las plazas totales, en la agenda aparece una barra con los botones **−** y **+** para ir apuntando las plazas ocupadas. La web cambia el mensaje sola:

| Situación | En la web |
|---|---|
| Quedan más de 3 plazas | «8 plazas libres» |
| Quedan 3 o menos | «Últimas 3 plazas» |
| No queda ninguna | «Completo» |

El panel no deja apuntar más plazas ocupadas que plazas totales.

---

## 5. Crear o editar un curso

1. Ve a **Formación → Cursos → Añadir curso**.
2. Escribe arriba el **nombre del curso**. Es el que aparece en las tarjetas, en el calendario y en el formulario.
3. Rellena los **datos del curso**:

   | Campo | Para qué sirve | ¿Obligatorio? |
   |---|---|---|
   | Título completo | El titular de la ficha, con el nombre oficial. | No. Si lo dejas vacío, se usa el nombre. |
   | Nombre corto | El texto de los botones de filtro del calendario. | No. Si lo dejas vacío, se usa el nombre. |
   | Norma | La etiqueta junto al curso, por ejemplo «UNE 58923». | No |
   | Certificación | Quién lo certifica, por ejemplo «AENOR». | No |
   | Normativa que cumple | Las normas, separadas por « · ». | No |
   | Duración y modalidad | Por ejemplo «8 horas» y «Presencial». | Recomendado |
   | Orden | La posición en los listados (1 = primero). | No. Si lo dejas vacío, el curso va al final. |
   | Descripción | Dos o tres frases bajo el titular de la ficha. | Recomendado |
   | Para quién es | Una frase para la tarjeta del curso. | Recomendado |

4. Debajo, en el editor, escribe las **preguntas frecuentes** de la ficha:
   - Cada pregunta, con el formato **Encabezado 3** (desplegable *Párrafo* → *Encabezado 3*).
   - Su respuesta, debajo, en párrafos normales.
   - Un párrafo que empiece por «Nota:» sale destacado.
   - Para enlazar al calendario, enlaza el texto a `/formacion/#calendario`: la web lo abre ya filtrado por ese curso.
5. Pulsa **Publicar**.
6. En la caja **Fechas de este curso** de la derecha, pulsa **Programar fechas**.

**«Convocatoria abierta» o «A medida»: no tienes que marcarlo.** Cambia solo:
- Un curso con fechas próximas sale en **Convocatorias abiertas**.
- Un curso sin fechas sale en **Resto de cursos**, como «A medida».

> **No cambies el «slug»** (la parte final de la dirección) de un curso ya publicado. Cambiaría su dirección en la web y se romperían los enlaces que ya apuntan a él.

---

## 6. Sedes

En **Formación → Sedes** puedes:
- **Añadir una sede nueva**: nombre, tipo, zona, dirección, código postal, localidad, enlace de Google Maps, teléfono y correo. Aparece al momento en *Programar fechas*.
- **Corregir una sede existente**: pasa el ratón por su nombre y pulsa **Editar**.

> No borres una sede que tenga convocatorias: esas fechas se quedarían sin sede. Si una sede deja de usarse, simplemente no le programes más fechas.

---

## 7. Lo que se hace solo

- Las fechas pasadas desaparecen de la web al día siguiente.
- Cada curso pasa de «Convocatoria abierta» a «A medida», y al revés, según tenga o no fechas.
- El formulario de solicitud ofrece siempre los cursos y las fechas publicados.
- El nombre de cada convocatoria se escribe solo: «Curso · fecha · sede».
- El panel avisa si:
  - quedan menos de tres semanas de fechas programadas;
  - una fecha se ha quedado sin curso o sin sede;
  - alguna convocatoria está completa.
- En el **Escritorio** de WordPress, la caja *Formación · próximas convocatorias* muestra las cinco siguientes.

---

## 8. Preguntas frecuentes

**He creado una fecha y no la veo en la web.**
Comprueba dos cosas:
- que está **publicada** y no en borrador;
- que la fecha es **de hoy en adelante**.

Si la web tiene caché, puede tardar unos minutos en aparecer.

**¿Dónde llegan las solicitudes de plaza?**
Por correo a formacion@jofemesa.com, con una referencia (FOR-…). Además quedan guardadas en **Elementor → Envíos**. Para cambiar el correo de destino, avisa a la agencia.

**¿Puedo cambiar el diseño de la ficha de un curso?**
El diseño es común a todos los cursos y lo mantiene la agencia. Desde Formación cambias los textos, que se colocan solos en ese diseño.

**He borrado algo por error.**
Todo lo que se borra pasa por la papelera durante 30 días. Ve a **Convocatorias** (o **Cursos**) → **Papelera**, pasa el ratón por el elemento y pulsa **Restaurar**. Vuelve publicado.

**¿Quién puede usar el panel?**
Cualquier usuario con rol **Editor** o **Administrador**. Para dar acceso a alguien de Formación, créale un usuario con rol *Editor*. Puede gestionar cursos, fechas y sedes sin acceso a plugins ni ajustes.
