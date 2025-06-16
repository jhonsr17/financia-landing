# FinancIA Landing Page - Waitlist

## Descripción General
Landing page para el proyecto **FinancIA**: un gestor financiero por WhatsApp con IA. El objetivo de la landing es presentar el proyecto, mostrar sus funcionalidades y captar leads mediante un formulario de waitlist que almacena los datos directamente en Google Sheets.

---

## Stack Tecnológico

- **Frontend:**
  - [Next.js](https://nextjs.org/) (React framework): Sencillo para landing pages, SEO friendly, fácil de escalar a web app.
  - [Tailwind CSS](https://tailwindcss.com/): Para estilos rápidos, modernos y responsivos.
  - **TypeScript** (opcional, recomendado): Para mayor robustez y escalabilidad del código.

- **Backend/Formulario:**
  - API Route de Next.js: Permite crear endpoints backend dentro del mismo proyecto.
  - Google Sheets API: Para guardar los leads directamente en una hoja de cálculo de Google Sheets.

- **Deploy:**
  - [Vercel](https://vercel.com/): Integración nativa con Next.js, despliegue rápido y gratuito.

---

## Estructura del Proyecto

```
financia-landing/
│
├── pages/
│   ├── index.tsx         # Landing page principal
│   └── api/
│       └── waitlist.ts   # Endpoint para guardar leads en Google Sheets
│
├── components/
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── WaitlistForm.tsx
│   └── Footer.tsx
│
├── styles/
│   └── globals.css
│
├── public/
│   └── ... (imágenes, logos)
│
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## Paso a Paso para Implementación

### 1. Preparación del Entorno
- Instala [Node.js](https://nodejs.org/) y npm.
- Instala Cursor (editor de código).
- Crea el proyecto base:
  ```bash
  npx create-next-app@latest financia-landing -ts
  cd financia-landing
  ```

### 2. Configuración de Tailwind CSS
- Sigue la [guía oficial de Tailwind para Next.js](https://tailwindcss.com/docs/guides/nextjs).

### 3. Estructura la Landing Page
- Crea los componentes sugeridos:
  - Hero (presentación)
  - Features (funcionalidades)
  - How It Works (cómo funciona)
  - WaitlistForm (formulario de leads)
  - Footer (pie de página)
- Usa tu diseño como referencia.

### 4. Formulario de Waitlist + Google Sheets
- Crea una hoja de Google Sheets para almacenar los leads.
- Configura una API Route en Next.js (`pages/api/waitlist.ts`) que reciba los datos del formulario y los envíe a Google Sheets usando la [Google Sheets API](https://developers.google.com/sheets/api/quickstart/nodejs).
- Implementa el formulario en React (`components/WaitlistForm.tsx`) que envía los datos al endpoint.

### 5. Deploy
- Sube el proyecto a un repositorio (GitHub recomendado).
- Conecta el repo a [Vercel](https://vercel.com/) y despliega.

---

## Escalabilidad
- **Next.js** permite crecer de landing a web app sin migrar de stack.
- Puedes agregar autenticación, dashboards, y más endpoints API.
- Google Sheets es ideal para el MVP, pero puedes migrar a una base de datos real (MongoDB, PostgreSQL) cuando crezcas.
- El código modular (componentes) facilita agregar nuevas secciones o funcionalidades.

---

## Recursos Útiles
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Google Sheets API Node.js Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs)
- [Vercel Docs](https://vercel.com/docs)

---

## Contacto
Para dudas o soporte, contacta al equipo de FinancIA. 