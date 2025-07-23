// Script para verificar la estructura de la base de datos
const { createClient } = require('@supabase/supabase-js')

// Configuración
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno faltantes:')
  console.error('   - SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   - SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌')
  console.error('\n💡 Asegúrate de tener configurado el archivo .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyDatabase() {
  console.log('🔍 Verificando estructura de base de datos...\n')

  try {
    // Verificar tabla transacciones
    console.log('📊 Verificando tabla "transacciones":')
    const { data: transactions, error: transError } = await supabase
      .from('transacciones')
      .select('*')
      .limit(1)

    if (transError) {
      console.error('❌ Error en tabla transacciones:', transError.message)
      
      // Verificar posibles códigos de error
      if (transError.code === '42P01') {
        console.error('   La tabla "transacciones" no existe')
      } else if (transError.code === '42501') {
        console.error('   Sin permisos para acceder a la tabla')
      }
    } else {
      console.log('✅ Tabla transacciones existe')
      if (transactions && transactions.length > 0) {
        console.log('📋 Estructura de columnas:')
        Object.keys(transactions[0]).forEach(column => {
          console.log(`   - ${column}: ${typeof transactions[0][column]}`)
        })
      } else {
        console.log('   (No hay datos para mostrar estructura)')
      }
    }

    console.log('\n📊 Verificando tabla "presupuestos":')
    const { data: budgets, error: budgetError } = await supabase
      .from('presupuestos')
      .select('*')
      .limit(1)

    if (budgetError) {
      console.error('❌ Error en tabla presupuestos:', budgetError.message)
    } else {
      console.log('✅ Tabla presupuestos existe')
      if (budgets && budgets.length > 0) {
        console.log('📋 Estructura de columnas:')
        Object.keys(budgets[0]).forEach(column => {
          console.log(`   - ${column}: ${typeof budgets[0][column]}`)
        })
      } else {
        console.log('   (No hay datos para mostrar estructura)')
      }
    }

    // Verificar autenticación
    console.log('\n🔐 Verificando sistema de autenticación:')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('ℹ️  No hay usuario autenticado (esperado en script)')
    } else if (user) {
      console.log('✅ Sistema de autenticación funcionando')
      console.log(`   Usuario: ${user.email}`)
    }

  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

// Ejecutar verificación
verifyDatabase()
  .then(() => {
    console.log('\n✅ Verificación completada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error durante la verificación:', error)
    process.exit(1)
  })

module.exports = { verifyDatabase } 