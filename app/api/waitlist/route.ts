import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Función para cargar credenciales desde archivo JSON
const loadCredentials = () => {
  try {
    // Intentar cargar desde archivo JSON
    const credentialsPath = path.join(process.cwd(), 'credentials.json')
    if (fs.existsSync(credentialsPath)) {
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
      console.log('✅ Credenciales cargadas desde archivo JSON')
      return credentials
    }
    
    // Si no existe el archivo, usar variables de entorno
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      console.log('✅ Usando credenciales desde variables de entorno')
      return {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        project_id: process.env.GOOGLE_PROJECT_ID,
      }
    }
    
    return null
  } catch (error) {
    console.error('❌ Error al cargar credenciales:', error)
    return null
  }
}

// Función para formatear el número de teléfono correctamente
const formatPhoneNumber = (phone: string) => {
  // El número ya viene con el prefijo del país desde el formulario
  // Solo necesitamos limpiarlo y formatearlo para Google Sheets
  
  // Remover espacios extra y caracteres especiales, pero mantener el +
  const cleanPhone = phone.replace(/\s+/g, ' ').trim()
  
  // Agregar comilla simple al inicio para que Google Sheets lo trate como texto
  return `'${cleanPhone}`
}

const validateConfig = () => {
  console.log('🔍 Verificando configuración...')
  
  const credentials = loadCredentials()
  if (!credentials) {
    console.error('❌ No se pudieron cargar las credenciales')
    return false
  }
  
  console.log('GOOGLE_CLIENT_EMAIL:', credentials.client_email ? '✅ Presente' : '❌ Faltante')
  console.log('GOOGLE_PRIVATE_KEY:', credentials.private_key ? '✅ Presente' : '❌ Faltante')
  console.log('GOOGLE_PROJECT_ID:', credentials.project_id ? '✅ Presente' : '❌ Faltante')
  console.log('GOOGLE_SPREADSHEET_ID:', process.env.GOOGLE_SPREADSHEET_ID ? '✅ Presente' : '❌ Faltante')
  
  if (!process.env.GOOGLE_SPREADSHEET_ID) {
    console.error('❌ GOOGLE_SPREADSHEET_ID faltante')
    return false
  }
  
  return true
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, name, country } = body

    if (!phone) {
      return NextResponse.json(
        { error: 'El número de teléfono es requerido' },
        { status: 400 }
      )
    }

    const fecha = new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })
    
    // Formatear el número de teléfono correctamente
    const formattedPhone = formatPhoneNumber(phone)
    
    // Verificar configuración
    const isConfigValid = validateConfig()
    
    if (!isConfigValid) {
      console.error('❌ Configuración incompleta')
      return NextResponse.json(
        { error: 'Error de configuración del servidor. Contacta al administrador.' },
        { status: 500 }
      )
    }
    
    // Cargar credenciales
    const credentials = loadCredentials()
    if (!credentials) {
      return NextResponse.json(
        { error: 'Error de autenticación. Contacta al administrador.' },
        { status: 500 }
      )
    }
    
    try {
      console.log('🔗 Conectando con Google Sheets...')
      
      // Crear autenticación
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })
      
      console.log('✅ Autenticación creada')
      
      // Crear instancia de sheets
      const sheets = google.sheets({ version: 'v4', auth })
      
      console.log('✅ Instancia de sheets creada')
      
      // Agregar datos a la hoja
      console.log('📝 Agregando datos a la hoja...')
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'A:D',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[fecha, formattedPhone, name || '', country || '']],
        },
      })

      if (!response.data) {
        throw new Error('No se pudo agregar los datos a la hoja')
      }

      console.log('✅ Datos guardados exitosamente en Google Sheets')
      console.log('📊 Datos guardados:', {
        fecha,
        phone: formattedPhone,
        name: name || '',
        country: country || ''
      })

      return NextResponse.json(
        { message: 'Registro exitoso en la lista de espera' },
        { status: 200 }
      )

    } catch (error: any) {
      console.error('❌ Error al guardar en Google Sheets:', {
        error: error.message,
        code: error.code,
        status: error.status,
        details: error.errors,
        serviceAccountEmail: credentials.client_email,
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID
      })
      
      if (error.code === 403 || error.message?.includes('permission error')) {
        throw new Error(
          `Error de permisos: El Service Account (${credentials.client_email}) no tiene acceso a la hoja. ` +
          'Por favor, sigue estos pasos:\n' +
          '1. Abre tu hoja de Google Sheets\n' +
          '2. Haz clic en "Compartir" en la esquina superior derecha\n' +
          '3. Agrega el email del Service Account como editor\n' +
          '4. Asegúrate de que el Service Account tenga el rol "Editor" en Google Cloud Console'
        )
      }
      if (error.code === 404) {
        throw new Error('No se encontró la hoja de cálculo. Verifica el ID de la hoja.')
      }
      throw new Error(`Error de Google Sheets: ${error?.message || 'Error desconocido'}`)
    }

  } catch (error) {
    console.error('❌ Error en API de lista de espera:', error)
    
    return NextResponse.json(
      { 
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
} 