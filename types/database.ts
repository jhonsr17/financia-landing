export interface Transaction {
  id: string
  user_id: string
  monto: number
  categoria: string
  descripcion?: string
  fecha: string
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  monto_mensual: number
  mes: number
  año: number
  created_at: string
  updated_at: string
}

export interface TransactionCreate {
  monto: number
  categoria: string
  descripcion?: string
  fecha: string
}

export interface BudgetCreate {
  monto_mensual: number
  mes: number
  año: number
}

export type TransactionCategory = 
  | 'Alimentación'
  | 'Vivienda'
  | 'Transporte' 
  | 'Educación'
  | 'Entretenimiento y Ocio'
  | 'Deudas'
  | 'Compras personales'
  | 'Salud'
  | 'Otros'
  | 'Salario'
  | 'Bonificaciones'
  | 'Arriendo'
  | 'Extras'
  | 'Regalos'

export interface CategorySummary {
  categoria: TransactionCategory
  total: number
  porcentaje: number
  color: string
}

export interface WeeklySummary {
  week: number
  total: number
  fecha_inicio: string
  fecha_fin: string
} 