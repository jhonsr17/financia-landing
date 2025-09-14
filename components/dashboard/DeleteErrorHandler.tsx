'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteErrorHandlerProps {
  error: string
  onRetry?: () => void
  onClose?: () => void
}

export const DeleteErrorHandler = ({ error, onRetry, onClose }: DeleteErrorHandlerProps) => {
  const isRLSError = error.includes('permission denied') || error.includes('row-level security')
  const isAuthError = error.includes('authentication') || error.includes('auth')

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 mb-1">
            Error al eliminar
          </h4>
          <p className="text-sm text-red-700 mb-3">
            {isRLSError 
              ? "No tienes permisos para eliminar este elemento. Esto puede deberse a restricciones de seguridad."
              : isAuthError
              ? "Error de autenticación. Por favor, inicia sesión nuevamente."
              : "Ocurrió un error inesperado al intentar eliminar el elemento."
            }
          </p>
          
          {isRLSError && (
            <div className="bg-red-100 border border-red-200 rounded p-3 mb-3">
              <p className="text-xs text-red-600">
                <strong>Solución:</strong> Contacta al administrador del sistema para configurar los permisos de eliminación.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            )}
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
