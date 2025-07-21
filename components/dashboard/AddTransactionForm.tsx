'use client'

import { useState } from 'react'
import { Plus, Wallet, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createSupabaseClient } from '@/utils/supabase/client'
import { useTransactions } from '@/hooks/useTransactions'

interface AddTransactionFormProps {
  onTransactionAdded?: () => void
}

export const AddTransactionForm = ({ onTransactionAdded }: AddTransactionFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tipo, setTipo] = useState<'gasto' | 'ingreso'>('gasto')
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const { user } = useTransactions()
  const supabase = createSupabaseClient()

  // Categorías predefinidas
  const gastosCategories = [
    'Comida', 'Transporte', 'Entretenimiento', 'Compras', 'Servicios',
    'Salud', 'Educación', 'Hogar', 'Ropa', 'Tecnología', 'Viajes', 'Otros'
  ]

  const ingresosCategories = [
    'Salario', 'Freelance', 'Ventas', 'Inversiones', 'Bonos',
    'Devoluciones', 'Regalos', 'Alquiler', 'Intereses', 'Otros'
  ]

  const currentCategories = tipo === 'gasto' ? gastosCategories : ingresosCategories

  const resetForm = () => {
    setTipo('gasto')
    setValor('')
    setCategoria('')
    setDescripcion('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !valor || !categoria) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    const valorNumerico = parseFloat(valor)
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Por favor ingresa un valor válido')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('transacciones')
        .insert({
          usuario_id: user.id,
          tipo,
          valor: valorNumerico,
          categoria,
          descripcion: descripcion || null,
          creado_en: new Date().toISOString()
        })

      if (error) {
        console.error('Error al guardar transacción:', error)
        alert('Error al guardar la transacción')
        return
      }

      // Éxito
      console.log('Transacción guardada exitosamente')
      resetForm()
      setIsOpen(false)
      onTransactionAdded?.()
      
      // Mostrar mensaje de éxito
      const tipoTexto = tipo === 'gasto' ? 'Gasto' : 'Ingreso'
      alert(`${tipoTexto} registrado exitosamente: ${new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(valorNumerico)}`)

    } catch (error) {
      console.error('Error:', error)
      alert('Error inesperado al guardar la transacción')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#9DFAD7] text-[#0D1D35] hover:bg-[#9DFAD7]/90 font-semibold shadow-lg">
          <Plus className="h-5 w-5 mr-2" />
          Agregar Nueva Transacción
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-[#0D1D35] border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Plus className="h-6 w-6 text-[#9DFAD7]" />
            Registrar Transacción
          </DialogTitle>
          <p className="text-white/70 text-sm">
            Añade un nuevo gasto o ingreso y visualízalo en tiempo real
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de transacción */}
          <div>
            <Label className="text-white mb-2 block">Tipo *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={tipo === 'gasto' ? 'default' : 'outline'}
                className={`${
                  tipo === 'gasto' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
                onClick={() => setTipo('gasto')}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Gasto
              </Button>
              <Button
                type="button"
                variant={tipo === 'ingreso' ? 'default' : 'outline'}
                className={`${
                  tipo === 'ingreso' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
                onClick={() => setTipo('ingreso')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Ingreso
              </Button>
            </div>
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="valor" className="text-white">Valor (COP) *</Label>
            <Input
              id="valor"
              type="number"
              placeholder="50000"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <Label htmlFor="categoria" className="text-white">Categoría *</Label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9DFAD7] focus:border-transparent"
              required
            >
              <option value="" className="bg-[#0D1D35] text-white">
                Selecciona una categoría
              </option>
              {currentCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0D1D35] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion" className="text-white">Descripción</Label>
            <Input
              id="descripcion"
              placeholder="Ej: Almuerzo en restaurante"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#9DFAD7] text-[#0D1D35] hover:bg-[#9DFAD7]/90 font-semibold"
            >
              {isLoading ? 'Guardando...' : `Registrar ${tipo === 'gasto' ? 'Gasto' : 'Ingreso'}`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                setIsOpen(false)
              }}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 