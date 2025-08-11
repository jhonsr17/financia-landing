# FinancIA

Asistente financiero con IA enfocado en WhatsApp y una web app en Next.js
para registro, panel y visualización de finanzas personales.

## 🎯 Objetivo
Ayudar a personas a entender y mejorar sus finanzas personales de forma simple
y conversacional. La landing y el panel permiten registrarse, visualizar gastos,
configurar presupuestos mensuales y chatear con el agente de WhatsApp.

## 🧩 ¿Qué hace y qué problema resuelve?
- Centraliza transacciones, categorías y presupuestos mensuales.
- Resume ingresos, gastos y balance con visualizaciones amigables.
- Permite configurar presupuesto total y por categoría.
- Ofrece acceso directo al agente de WhatsApp para asistencia guiada.
- Cumple requisitos legales de Meta (páginas `/terms` y `/privacy`).

Problemas que resuelve:
- Falta de visibilidad del gasto real vs presupuestado.
- Dificultad para categorizar y analizar gastos.
- Fricción para iniciar: onboarding rápido y soporte vía WhatsApp.

## 👥 Público objetivo
- Jóvenes profesionales y freelancers en LATAM.
- Personas que quieren empezar a organizar sus finanzas sin complejidad.
- Usuarios que prefieren guía conversacional (WhatsApp) sobre apps complejas.

## 🛠️ Stack Tecnológico
- Frontend: Next.js (App Router) + React + TypeScript
- Estilos: Tailwind CSS + Shadcn UI (Radix UI) + Framer Motion
- Backend/BaaS: Supabase (Auth, Postgres, RLS, Realtime, Triggers)
- Integraciones: WhatsApp deep links (`wa.me`)
- Deploy: Vercel

## 🏗️ Arquitectura y módulos
- App Router (`app/`): rutas server-first, API Routes, layouts y páginas
  - `app/page.tsx`: landing con CTA "Chatea ya con FinancIA"
  - `app/terms/page.tsx` y `app/privacy/page.tsx`: cumplimiento legal
  - `app/api/auth/register/route.ts`: registro de usuarios (API)
- Componentes principales (`components/`):
  - `RegisterForm.tsx`: registro con nombre, email, teléfono (selector de país)
  - `dashboard/BudgetTable.tsx`: resumen mensual y comparación con presupuesto
  - `dashboard/CategoryChart.tsx`: heatmap de gastos por categoría
  - `dashboard/WhatsAppChatButton.tsx`: chat directo para usuarios registrados
- Hooks (`hooks/`):
  - `useTransactionsUnified.ts`: transacciones normalizadas y realtime
  - `useBudget.ts`: presupuesto mensual total (tabla `public.presupuestos`)
  - `useCategoryBudget.ts`: presupuesto por categoría (tabla `public.presupuesto`)
  - `useCategories.ts`: catálogo `public.categorias`

## 🔐 Autenticación y registro
- Registro vía `POST /api/auth/register` usando Supabase Auth.
- Se guardan `full_name` y `phone` en `auth.users.user_metadata`.
- Trigger Postgres `crear_usuario_simple()` inserta en `public.usuarios` cuando
  el email se confirma. El teléfono se normaliza sin `+`.
- Login redirige al dashboard y saluda por nombre.

## 💰 Presupuestos y transacciones
- Presupuesto mensual total en `public.presupuestos`.
- Presupuesto por categoría en `public.presupuesto` (upsert por usuario/mes).
- Transacciones en `public.transacciones` con `usuario_id`, `valor`, `creado_en`.
- Heatmap por categoría y tendencia semanal calculada en el cliente.

## 📱 WhatsApp
- CTA en landing: si no está registrado, va a `/register`.
- En dashboard, botón abre chat a `+57 3227031301` con mensaje por defecto:
  "👋 Hola FinancIA, soy parte del combo 💼💸 ¿Cómo empiezo para poner en orden mis finanzas?".

## ⚖️ Cumplimiento legal
- Páginas dedicadas: `/terms` y `/privacy`.
- Datos de contacto: `colombiaia.financia@gmail.com` | `+57 3223796302`.

## 📂 Estructura del proyecto (App Router)
```
financia-landing/
├─ app/
│  ├─ api/
│  │  └─ auth/
│  │     └─ register/route.ts
│  ├─ privacy/page.tsx
│  ├─ terms/page.tsx
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ CountryCodeSelector.tsx
│  ├─ RegisterForm.tsx
│  └─ dashboard/
│     ├─ BudgetTable.tsx
│     ├─ BudgetSetupModal.tsx
│     ├─ CategoryChart.tsx
│     └─ WhatsAppChatButton.tsx
├─ hooks/
│  ├─ useBudget.ts
│  ├─ useCategoryBudget.ts
│  ├─ useCategories.ts
│  └─ useTransactionsUnified.ts
├─ styles/globals.css
├─ tailwind.config.js
└─ tsconfig.json
```

## 🔧 Configuración y variables de entorno
Crear `.env.local` con claves de Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## ▶️ Desarrollo local
```
npm install
npm run dev
```

## 🔒 Seguridad y privacidad
- RLS habilitado en tablas de Postgres.
- Inserción en `public.usuarios` sólo tras confirmación de email (trigger).
- Normalización del teléfono sin `+` en trigger de Postgres.

## 🚀 Roadmap breve
- Importación de extractos bancarios (CSV/OFX)
- Reglas automáticas de categorización
- Notificaciones proactivas en WhatsApp
- Multi-moneda y conversión

## 📫 Contacto
`colombiaia.financia@gmail.com` · `+57 3223796302`