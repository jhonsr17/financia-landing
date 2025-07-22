'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const TermsAndConditions = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base cursor-pointer">
        Términos y Condiciones
      </DialogTrigger>
      <DialogContent className="bg-[#0D1D35] border border-[#9DFAD7]/20 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-[#9DFAD7] text-center">
            Términos y Condiciones de Uso
          </DialogTitle>
          <DialogDescription className="text-white/80 text-center">
            Última actualización: Enero 2025
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <p className="text-white/90">
            Los siguientes Términos y Condiciones se considerarán aceptados por el Usuario desde el momento en que utilice el servicio de asistente financiero personal disponible a través de WhatsApp y el sitio web. Le solicitamos que los lea cuidadosamente antes de utilizar nuestros servicios.
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Definiciones</h3>
            <div className="space-y-2 text-white/90">
              <p><strong>Usuario:</strong> toda persona que acceda o haga uso del asistente financiero personal a través de WhatsApp o el sitio web.</p>
              <p><strong>La Compañía:</strong> FinancIA, responsable del desarrollo, operación y mantenimiento del asistente financiero y la plataforma asociada.</p>
              <p><strong>Servicio:</strong> el asistente financiero personal automatizado, que permite registrar ingresos, gastos y visualizar métricas simplificadas a través de WhatsApp y el sitio web.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Aceptación de los Términos</h3>
            <p className="text-white/90">
              Al acceder y utilizar el Servicio, el Usuario acepta quedar obligado por estos Términos y Condiciones, así como por la Política de Privacidad y cualquier otro documento aplicable publicado por la Compañía, que podrá modificar en cualquier momento sin previo aviso.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Uso del Servicio</h3>
            <p className="text-white/90">
              La Compañía se reserva el derecho de modificar, suspender o discontinuar total o parcialmente el Servicio, con o sin previo aviso. También podrá restringir o cancelar el acceso de cualquier Usuario que incumpla con estos Términos.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Propiedad Intelectual</h3>
            <p className="text-white/90">
              Todo el contenido, software, textos, imágenes, audio, video, gráficos y demás materiales asociados al Servicio son propiedad exclusiva de la Compañía o sus licenciantes. Queda estrictamente prohibido copiar, reproducir, modificar, distribuir, transmitir o utilizar dichos materiales sin la previa autorización escrita de la Compañía.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Exención de Garantías y Responsabilidades</h3>
            <div className="space-y-2 text-white/90">
              <p>
                El Servicio se proporciona "tal cual" y "según disponibilidad", sin garantías explícitas ni implícitas de calidad, exactitud, puntualidad o funcionamiento ininterrumpido.
              </p>
              <p>
                La Compañía no garantiza que la información financiera registrada o procesada mediante el Servicio sea siempre 100% precisa o libre de errores, ni se responsabiliza por decisiones tomadas con base en dicha información.
              </p>
              <p>
                La Compañía no será responsable de ningún daño directo, indirecto, incidental, consecuente o especial relacionado con el uso o imposibilidad de uso del Servicio, incluyendo pérdida de datos o interrupciones.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Seguridad y Privacidad</h3>
            <p className="text-white/90">
              La Compañía se compromete a proteger los datos personales de los Usuarios conforme a su Política de Privacidad. El Usuario reconoce y acepta que el uso de WhatsApp como canal implica ciertos riesgos inherentes propios de la plataforma.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Uso Responsable</h3>
            <p className="text-white/90">
              El Usuario se obliga a utilizar el Servicio de manera lícita, responsable y adecuada, y acepta indemnizar y mantener indemne a la Compañía frente a cualquier reclamo, daño o gasto derivado de un uso indebido.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Enlaces a Terceros</h3>
            <p className="text-white/90">
              El Servicio puede contener enlaces o referencias a sitios web o servicios de terceros, sobre los cuales la Compañía no ejerce control ni asume responsabilidad alguna. El Usuario acepta que la Compañía no responde por el contenido, operaciones o seguridad de dichos terceros.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Limitaciones</h3>
            <p className="text-white/90">
              Estos Términos no limitan derechos irrenunciables del Usuario según la legislación colombiana vigente en materia de protección de datos y consumidor.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Modificaciones</h3>
            <p className="text-white/90">
              La Compañía podrá modificar estos Términos en cualquier momento. Las modificaciones serán efectivas al ser publicadas en el sitio web o comunicadas mediante el Servicio.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Legislación Aplicable y Jurisdicción</h3>
            <p className="text-white/90">
              Estos Términos se rigen por las leyes de la República de Colombia. Para cualquier controversia derivada del uso del Servicio, las partes se someten a la jurisdicción de los tribunales competentes en Colombia.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6 mt-8">
            <p className="text-center text-white/70 text-sm">
              Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de nuestro sitio web.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 