'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function TermsAndConditions() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base underline hover:no-underline'
      >
        Términos y Condiciones
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='bg-[#0D1D35] border border-white/20 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-white/10'>
              <h2 className='text-xl md:text-2xl font-bold text-[#9DFAD7]'>
                Términos y Condiciones de Uso
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className='text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            {/* Content */}
            <div className='p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar'>
              <div className='prose prose-invert max-w-none space-y-6 text-white/80'>
                <p className='text-sm text-white/60 leading-relaxed'>
                  Los siguientes Términos y Condiciones se considerarán aceptados por el Usuario desde el momento en que utilice el servicio de asistente financiero personal disponible a través de WhatsApp y el sitio web. Le solicitamos que los lea cuidadosamente antes de utilizar nuestros servicios.
                </p>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>1. Definiciones</h3>
                  <div className='space-y-2 text-sm'>
                    <p><strong className='text-white'>Usuario:</strong> toda persona que acceda o haga uso del asistente financiero personal a través de WhatsApp o el sitio web.</p>
                    <p><strong className='text-white'>La Compañía:</strong> FinancIA, responsable del desarrollo, operación y mantenimiento del asistente financiero y la plataforma asociada.</p>
                    <p><strong className='text-white'>Servicio:</strong> el asistente financiero personal automatizado, que permite registrar ingresos, gastos y visualizar métricas simplificadas a través de WhatsApp y el sitio web.</p>
                  </div>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>2. Aceptación de los Términos</h3>
                  <p className='text-sm leading-relaxed'>
                    Al acceder y utilizar el Servicio, el Usuario acepta quedar obligado por estos Términos y Condiciones, así como por la Política de Privacidad y cualquier otro documento aplicable publicado por la Compañía, que podrá modificar en cualquier momento sin previo aviso.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>3. Uso del Servicio</h3>
                  <p className='text-sm leading-relaxed'>
                    La Compañía se reserva el derecho de modificar, suspender o discontinuar total o parcialmente el Servicio, con o sin previo aviso. También podrá restringir o cancelar el acceso de cualquier Usuario que incumpla con estos Términos.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>4. Propiedad Intelectual</h3>
                  <p className='text-sm leading-relaxed'>
                    Todo el contenido, software, textos, imágenes, audio, video, gráficos y demás materiales asociados al Servicio son propiedad exclusiva de la Compañía o sus licenciantes. Queda estrictamente prohibido copiar, reproducir, modificar, distribuir, transmitir o utilizar dichos materiales sin la previa autorización escrita de la Compañía.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>5. Exención de Garantías y Responsabilidades</h3>
                  <div className='text-sm space-y-2'>
                    <p>El Servicio se proporciona "tal cual" y "según disponibilidad", sin garantías explícitas ni implícitas de calidad, exactitud, puntualidad o funcionamiento ininterrumpido.</p>
                    <p>La Compañía no garantiza que la información financiera registrada o procesada mediante el Servicio sea siempre 100% precisa o libre de errores, ni se responsabiliza por decisiones tomadas con base en dicha información.</p>
                    <p>La Compañía no será responsable de ningún daño directo, indirecto, incidental, consecuente o especial relacionado con el uso o imposibilidad de uso del Servicio, incluyendo pérdida de datos o interrupciones.</p>
                  </div>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>6. Seguridad y Privacidad</h3>
                  <p className='text-sm leading-relaxed'>
                    La Compañía se compromete a proteger los datos personales de los Usuarios conforme a su Política de Privacidad. El Usuario reconoce y acepta que el uso de WhatsApp como canal implica ciertos riesgos inherentes propios de la plataforma.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>7. Uso Responsable</h3>
                  <p className='text-sm leading-relaxed'>
                    El Usuario se obliga a utilizar el Servicio de manera lícita, responsable y adecuada, y acepta indemnizar y mantener indemne a la Compañía frente a cualquier reclamo, daño o gasto derivado de un uso indebido.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>8. Enlaces a Terceros</h3>
                  <p className='text-sm leading-relaxed'>
                    El Servicio puede contener enlaces o referencias a sitios web o servicios de terceros, sobre los cuales la Compañía no ejerce control ni asume responsabilidad alguna. El Usuario acepta que la Compañía no responde por el contenido, operaciones o seguridad de dichos terceros.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>9. Limitaciones</h3>
                  <p className='text-sm leading-relaxed'>
                    Estos Términos no limitan derechos irrenunciables del Usuario según la legislación colombiana vigente en materia de protección de datos y consumidor.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>10. Modificaciones</h3>
                  <p className='text-sm leading-relaxed'>
                    La Compañía podrá modificar estos Términos en cualquier momento. Las modificaciones serán efectivas al ser publicadas en el sitio web o comunicadas mediante el Servicio.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>11. Legislación Aplicable y Jurisdicción</h3>
                  <p className='text-sm leading-relaxed'>
                    Estos Términos se rigen por las leyes de la República de Colombia. Para cualquier controversia derivada del uso del Servicio, las partes se someten a la jurisdicción de los tribunales competentes en Colombia.
                  </p>
                </section>

                <div className='mt-8 p-4 bg-[#9DFAD7]/10 border border-[#9DFAD7]/20 rounded-lg'>
                  <p className='text-xs text-white/70'>
                    <strong>Última actualización:</strong> Enero 2025
                  </p>
                  <p className='text-xs text-white/70 mt-1'>
                    Para consultas sobre estos términos, puedes contactarnos a través de nuestros canales oficiales.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='border-t border-white/10 p-6 bg-[#0D1D35]/50'>
              <button
                onClick={() => setIsOpen(false)}
                className='w-full bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] text-[#0D1D35] font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]'
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(157, 250, 215, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(157, 250, 215, 0.7);
        }
      `}</style>
    </>
  )
} 