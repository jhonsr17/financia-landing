import { google } from 'googleapis'
import { NextResponse } from 'next/server'

// Crear una instancia de auth reutilizable
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    project_id: process.env.GOOGLE_PROJECT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

// Crear una instancia de sheets reutilizable
const sheets = google.sheets({ version: 'v4', auth })
const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID

// Validar configuración al inicio
const validateConfig = () => {
  const missingVars = []
  if (!process.env.GOOGLE_CLIENT_EMAIL) missingVars.push('GOOGLE_CLIENT_EMAIL')
  if (!process.env.GOOGLE_PRIVATE_KEY) missingVars.push('GOOGLE_PRIVATE_KEY')
  if (!process.env.GOOGLE_PROJECT_ID) missingVars.push('GOOGLE_PROJECT_ID')
  if (!process.env.GOOGLE_SPREADSHEET_ID) missingVars.push('GOOGLE_SPREADSHEET_ID')
  
  if (missingVars.length > 0) {
    console.error('Missing environment variables:', missingVars)
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  // Verificar formato de la clave privada
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
  if (privateKey && !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.error('Invalid private key format')
    throw new Error('Invalid private key format')
  }

  // Verificar que el spreadsheetId tenga el formato correcto
  if (spreadsheetId && !/^[a-zA-Z0-9-_]+$/.test(spreadsheetId)) {
    console.error('Invalid spreadsheet ID format')
    throw new Error('Invalid spreadsheet ID format')
  }

  // Verificar que el email del service account tenga el formato correcto
  const serviceAccountEmail = process.env.GOOGLE_CLIENT_EMAIL
  if (serviceAccountEmail && !serviceAccountEmail.endsWith('.gserviceaccount.com')) {
    console.error('Invalid service account email format')
    throw new Error('Invalid service account email format')
  }
}

export async function POST(request: Request) {
  try {
    // Validar configuración
    validateConfig()

    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    const fecha = new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })
    
    // Intentar guardar en Google Sheets
    try {
      // Primero verificar si podemos acceder a la hoja
      console.log('Intentando acceder a la hoja con el Service Account:', process.env.GOOGLE_CLIENT_EMAIL)
      
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
        ranges: ['A:C'],
        includeGridData: false
      })

      if (!spreadsheet.data) {
        throw new Error('No se pudo acceder a la hoja de cálculo')
      }

      console.log('Acceso exitoso a la hoja. Intentando agregar datos...')

      // Si podemos acceder, intentar agregar los datos
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'A:C',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[fecha, email, name || '']],
        },
      })

      if (!response.data) {
        throw new Error('No se pudo agregar los datos a la hoja')
      }

      console.log('Datos agregados exitosamente')

    } catch (error: any) {
      console.error('Error detallado al acceder a Google Sheets:', {
        error: error.message,
        code: error.code,
        status: error.status,
        details: error.errors,
        serviceAccountEmail: process.env.GOOGLE_CLIENT_EMAIL,
        spreadsheetId: spreadsheetId
      })
      
      if (error.code === 403 || error.message?.includes('permission error')) {
        throw new Error(
          `Error de permisos: El Service Account (${process.env.GOOGLE_CLIENT_EMAIL}) no tiene acceso a la hoja. ` +
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

    return NextResponse.json(
      { message: 'Registro exitoso en la lista de espera' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error detallado en API de lista de espera:', error)
    
    // Manejar diferentes tipos de errores
    if (error instanceof Error) {
      if (error.message.includes('Missing required environment variables')) {
        return NextResponse.json(
          { 
            error: 'Error de configuración del servidor',
            details: error.message
          },
          { status: 500 }
        )
      }
      
      if (error.message.includes('invalid_grant')) {
        return NextResponse.json(
          { 
            error: 'Error de autenticación con Google Sheets',
            details: 'La clave privada o el email del service account son inválidos'
          },
          { status: 500 }
        )
      }

      if (error.message.includes('Error de permisos')) {
        return NextResponse.json(
          { 
            error: 'Error de permisos en Google Sheets',
            details: error.message
          },
          { status: 500 }
        )
      }

      if (error.message.includes('No se encontró la hoja')) {
        return NextResponse.json(
          { 
            error: 'Error de acceso a la hoja de cálculo',
            details: error.message
          },
          { status: 500 }
        )
      }

      if (error.message.includes('Error de Google Sheets')) {
        return NextResponse.json(
          { 
            error: 'Error al acceder a Google Sheets',
            details: error.message
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
} 