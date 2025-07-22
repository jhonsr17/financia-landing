'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const PrivacyPolicy = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base cursor-pointer">
        Política de Privacidad
      </DialogTrigger>
      <DialogContent className="bg-[#0D1D35] border border-[#9DFAD7]/20 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-[#9DFAD7] text-center">
            Política de Privacidad
          </DialogTitle>
          <DialogDescription className="text-white/80 text-center">
            Última actualización: Enero 2025
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <p className="text-white/90">
            En FinancIA, nos comprometemos a proteger la privacidad y seguridad de la información personal de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos su información.
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Información que Recopilamos</h3>
            <div className="space-y-2 text-white/90">
              <p><strong>Datos de Registro:</strong> Nombre, correo electrónico, número de teléfono para crear su cuenta.</p>
              <p><strong>Información Financiera:</strong> Datos de ingresos y gastos que usted proporciona voluntariamente para el funcionamiento del servicio.</p>
              <p><strong>Datos de Uso:</strong> Información sobre cómo interactúa con nuestro servicio, incluyendo mensajes enviados y recibidos.</p>
              <p><strong>Información Técnica:</strong> Dirección IP, tipo de dispositivo, y datos de navegación para mejorar nuestro servicio.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Cómo Utilizamos su Información</h3>
            <div className="space-y-2 text-white/90">
              <p>• Proporcionar y mantener nuestro servicio de asistente financiero</p>
              <p>• Generar insights y recomendaciones personalizadas</p>
              <p>• Comunicarnos con usted sobre el servicio</p>
              <p>• Mejorar y desarrollar nuevas funcionalidades</p>
              <p>• Cumplir con obligaciones legales</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Compartición de Información</h3>
            <p className="text-white/90">
              No vendemos, intercambiamos o transferimos su información personal a terceros, excepto en los siguientes casos:
            </p>
            <div className="space-y-2 text-white/90">
              <p>• Con su consentimiento explícito</p>
              <p>• Para cumplir con requisitos legales o regulatorios</p>
              <p>• Para proteger nuestros derechos, propiedad o seguridad</p>
              <p>• Con proveedores de servicios que nos ayudan a operar nuestra plataforma (bajo estrictos acuerdos de confidencialidad)</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Seguridad de Datos</h3>
            <p className="text-white/90">
              Implementamos medidas de seguridad técnicas y organizacionales apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye encriptación de datos, acceso restringido y auditorías regulares de seguridad.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Retención de Datos</h3>
            <p className="text-white/90">
              Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley requiera o permita un período de retención más largo.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Sus Derechos</h3>
            <p className="text-white/90">
              De acuerdo con la legislación colombiana de protección de datos, usted tiene los siguientes derechos:
            </p>
            <div className="space-y-2 text-white/90">
              <p>• <strong>Acceso:</strong> Solicitar información sobre los datos que tenemos sobre usted</p>
              <p>• <strong>Rectificación:</strong> Corregir datos inexactos o incompletos</p>
              <p>• <strong>Supresión:</strong> Solicitar la eliminación de sus datos personales</p>
              <p>• <strong>Portabilidad:</strong> Obtener una copia de sus datos en formato estructurado</p>
              <p>• <strong>Oposición:</strong> Oponerse al procesamiento de sus datos en ciertos casos</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Cookies y Tecnologías Similares</h3>
            <p className="text-white/90">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web, analizar el tráfico y personalizar el contenido. Puede gestionar las preferencias de cookies a través de la configuración de su navegador.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Menores de Edad</h3>
            <p className="text-white/90">
              Nuestro servicio no está dirigido a menores de 18 años. No recopilamos conscientemente información personal de menores de edad. Si descubrimos que hemos recopilado información de un menor, tomaremos medidas para eliminar dicha información.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Cambios a esta Política</h3>
            <p className="text-white/90">
              Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos sobre cambios significativos publicando la nueva política en nuestro sitio web y, cuando sea apropiado, a través de otros canales de comunicación.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9DFAD7]">Contacto</h3>
            <p className="text-white/90">
              Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos de protección de datos, puede contactarnos a través de nuestro sitio web o los canales de comunicación proporcionados en nuestro servicio.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6 mt-8">
            <p className="text-center text-white/70 text-sm">
              Esta política está diseñada para cumplir con la legislación colombiana de protección de datos personales (Ley 1581 de 2012).
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 