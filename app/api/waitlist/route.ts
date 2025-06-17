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
if (!spreadsheetId) {
  console.error('Error: GOOGLE_SPREADSHEET_ID no está configurado en .env.local')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    const fecha = new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })
    
    // Intentar guardar en Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[fecha, email, name || '']],
      },
    })

    return NextResponse.json(
      { message: 'Registro exitoso en la lista de espera' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en API de lista de espera:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud. Por favor intenta de nuevo.' },
      { status: 500 }
    )
  }
} 