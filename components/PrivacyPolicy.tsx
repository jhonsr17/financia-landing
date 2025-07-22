'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function PrivacyPolicy() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base underline hover:no-underline'
      >
        Política de Privacidad
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='bg-[#0D1D35] border border-white/20 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-white/10'>
              <h2 className='text-xl md:text-2xl font-bold text-[#9DFAD7]'>
                Política de Privacidad
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
                  En FinancIA valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, protegemos y compartimos tu información personal cuando utilizas nuestro asistente financiero a través de WhatsApp y nuestro sitio web.
                </p>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>1. Información que Recopilamos</h3>
                  <div className='text-sm space-y-2'>
                    <p><strong className='text-white'>Información Personal:</strong> Nombre, número de teléfono, país de residencia proporcionados al registrarte en nuestra lista de espera.</p>
                    <p><strong className='text-white'>Información Financiera:</strong> Datos de gastos, ingresos, categorías y descripciones que compartes con nuestro asistente a través de WhatsApp.</p>
                    <p><strong className='text-white'>Información de Uso:</strong> Mensajes enviados, fecha y hora de interacciones, preferencias de configuración.</p>
                    <p><strong className='text-white'>Información Técnica:</strong> Dirección IP, tipo de dispositivo, datos de navegación cuando visitas nuestro sitio web.</p>
                  </div>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>2. Cómo Utilizamos tu Información</h3>
                  <div className='text-sm space-y-1'>
                    <p>• Proporcionar y mejorar nuestros servicios de asistencia financiera</p>
                    <p>• Procesar y analizar tus datos financieros para generar insights personalizados</p>
                    <p>• Comunicarnos contigo sobre actualizaciones del servicio y nuevas funcionalidades</p>
                    <p>• Cumplir con obligaciones legales y regulatorias</p>
                    <p>• Detectar y prevenir fraudes o uso indebido del servicio</p>
                  </div>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>3. Base Legal para el Procesamiento</h3>
                  <div className='text-sm space-y-2'>
                    <p><strong className='text-white'>Consentimiento:</strong> Procesamos tu información financiera basados en tu consentimiento explícito al usar el servicio.</p>
                    <p><strong className='text-white'>Ejecución de Contrato:</strong> Para proporcionarte los servicios solicitados a través de nuestra plataforma.</p>
                    <p><strong className='text-white'>Interés Legítimo:</strong> Para mejorar nuestros servicios y desarrollar nuevas funcionalidades.</p>
                  </div>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>4. Compartir Información con Terceros</h3>
                  <div className='text-sm space-y-2'>
                    <p>No vendemos, alquilamos ni compartimos tu información personal con terceros para fines comerciales. Podemos compartir información únicamente en los siguientes casos:</p>
                    <p>• <strong className='text-white'>Proveedores de Servicios:</strong> WhatsApp (Meta), Supabase, Google Sheets para el funcionamiento del servicio</p>
                    <p>• <strong className='text-white'>Cumplimiento Legal:</strong> Cuando sea requerido por ley o autoridades competentes</p>
                    <p>• <strong className='text-white'>Protección de Derechos:</strong> Para proteger nuestros derechos legales o los de nuestros usuarios</p>
                  </div>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>5. Seguridad de los Datos</h3>
                  <div className='text-sm space-y-2'>
                    <p>Implementamos medidas de seguridad técnicas y organizacionales apropiadas para proteger tu información:</p>
                    <p>• Cifrado de datos en tránsito y en reposo</p>
                    <p>• Acceso restringido a tu información solo a personal autorizado</p>
                    <p>• Monitoreo regular de nuestros sistemas de seguridad</p>
                    <p>• Auditorías periódicas de seguridad</p>
                  </div>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>6. Tus Derechos</h3>
                  <div className='text-sm space-y-1'>
                    <p>Como usuario, tienes los siguientes derechos sobre tu información personal:</p>
                    <p>• <strong className='text-white'>Acceso:</strong> Solicitar una copia de tu información personal</p>
                    <p>• <strong className='text-white'>Rectificación:</strong> Corregir información inexacta o incompleta</p>
                    <p>• <strong className='text-white'>Eliminación:</strong> Solicitar la eliminación de tu información personal</p>
                    <p>• <strong className='text-white'>Portabilidad:</strong> Recibir tu información en un formato estructurado</p>
                    <p>• <strong className='text-white'>Oposición:</strong> Oponerte al procesamiento de tu información</p>
                    <p>• <strong className='text-white'>Limitación:</strong> Solicitar la limitación del procesamiento</p>
                  </div>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>7. Retención de Datos</h3>
                  <p className='text-sm leading-relaxed'>
                    Retenemos tu información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, salvo que la ley requiera o permita un período de retención más largo. Los datos financieros se conservan mientras mantengas tu cuenta activa y hasta 5 años después del cierre de la cuenta para cumplir con obligaciones legales.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>8. Transferencias Internacionales</h3>
                  <p className='text-sm leading-relaxed'>
                    Algunos de nuestros proveedores de servicios pueden estar ubicados fuera de Colombia. En estos casos, nos aseguramos de que existan garantías adecuadas para proteger tu información personal conforme a los estándares colombianos e internacionales de protección de datos.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>9. Menores de Edad</h3>
                  <p className='text-sm leading-relaxed'>
                    Nuestro servicio no está dirigido a menores de 18 años. No recopilamos intencionalmente información personal de menores de edad. Si descubrimos que hemos recopilado información de un menor, eliminaremos dicha información inmediatamente.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>10. Cambios a esta Política</h3>
                  <p className='text-sm leading-relaxed'>
                    Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios significativos a través de nuestro servicio o por otros medios antes de que los cambios entren en vigor. Tu uso continuado del servicio después de dichos cambios constituye tu aceptación de la nueva política.
                  </p>
                </section>

                <section>
                  <h3 className='text-lg font-semibold text-[#9DFAD7] mb-3'>11. Contacto</h3>
                  <p className='text-sm leading-relaxed'>
                    Si tienes preguntas sobre esta Política de Privacidad o deseas ejercer tus derechos, puedes contactarnos a través de nuestros canales oficiales. También puedes presentar una queja ante la Superintendencia de Industria y Comercio (SIC) como autoridad de protección de datos en Colombia.
                  </p>
                </section>

                <div className='mt-8 p-4 bg-[#9DFAD7]/10 border border-[#9DFAD7]/20 rounded-lg'>
                  <p className='text-xs text-white/70'>
                    <strong>Última actualización:</strong> Enero 2025
                  </p>
                  <p className='text-xs text-white/70 mt-1'>
                    Esta política cumple con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia sobre protección de datos personales.
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