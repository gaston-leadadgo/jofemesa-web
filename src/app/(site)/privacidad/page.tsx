import type { Metadata } from "next";
import { EMPRESA } from "@/content/es/empresa";

export const metadata: Metadata = {
  title: "Política de privacidad",
  robots: { index: false },
};

export default function PaginaPrivacidad() {
  return (
    <div className="container-placa py-10 md:py-12">
      <div className="max-w-[70ch]">
        <h1 className="display-2 text-ink">Política de privacidad</h1>

        <div className="mt-10 space-y-8">
          <section className="border-l-2 border-wait bg-sunken px-5 py-4">
            <p className="label-sm text-ink-2">Borrador de trabajo</p>
            <p className="mt-2 text-base text-ink">
              Este texto describe lo que el formulario de la web hace
              realmente, para que sirva de base. La versión definitiva la tiene
              que revisar el asesor legal de {EMPRESA.razonSocial} antes de
              publicar.
            </p>
          </section>

          <section>
            <h2 className="label text-ink-3">Quién trata tus datos</h2>
            <p className="mt-3 text-base text-ink-2">
              {EMPRESA.razonSocial}, con CIF {EMPRESA.cif} y domicilio en{" "}
              {EMPRESA.domicilioSocial}.
            </p>
          </section>

          <section>
            <h2 className="label text-ink-3">Qué datos recogemos y para qué</h2>
            <p className="mt-3 text-base text-ink-2">
              Solo lo que hace falta para responder a una solicitud de
              disponibilidad: la máquina o máquinas que te interesan, las fechas
              de alquiler, la provincia y localidad de la obra, y los datos de
              contacto de la empresa que la solicita (nombre, CIF, persona de
              contacto, teléfono y correo). Si has usado el asesor, se adjunta
              también el resumen de tus tres respuestas, porque le ahorra una
              llamada al equipo comercial.
            </p>
          </section>

          <section>
            <h2 className="label text-ink-3">Base legal</h2>
            <p className="mt-3 text-base text-ink-2">
              Tu consentimiento, que das marcando la casilla del formulario, y
              el interés legítimo en atender una solicitud comercial que has
              iniciado tú.
            </p>
          </section>

          <section>
            <h2 className="label text-ink-3">Con quién se comparten</h2>
            <p className="mt-3 text-base text-ink-2">
              La solicitud llega a la delegación que tiene la máquina, que es
              quien puede confirmar la disponibilidad. No se ceden datos a
              terceros con fines publicitarios.
            </p>
          </section>

          <section>
            <h2 className="label text-ink-3">Tus derechos</h2>
            <p className="mt-3 text-base text-ink-2">
              Puedes pedir acceso, rectificación, supresión, limitación,
              portabilidad y oposición escribiendo a la dirección de contacto de
              cualquiera de nuestras delegaciones. También puedes reclamar ante
              la Agencia Española de Protección de Datos.
            </p>
          </section>

          <section>
            <h2 className="label text-ink-3">Qué no hacemos</h2>
            <p className="mt-3 text-base text-ink-2">
              Esta web no cobra nada, no tiene pasarela de pago y no pide datos
              bancarios ni de tarjeta en ningún momento. Si alguna página te los
              pide diciendo que es de JOFEMESA, no es nuestra.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
