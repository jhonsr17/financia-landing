import { FloatingChat } from '@/components/FloatingChat'
import { WaitlistForm } from '@/components/WaitlistForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D1D35]">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">FinancIA</h1>
        <div className="space-x-6">
          <a href="#" className="text-white hover:text-[#9DFAD7]">Producto</a>
          <a href="#" className="text-white hover:text-[#9DFAD7]">Inicio</a>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Tu asistente financiero personal,{' '}
              <span className="text-[#9DFAD7]">ahora en tu WhatsApp</span>
            </h2>
            <p className="text-lg text-white/80">
              Con tan solo un mensaje, nuestro asistente te ayuda a transformar tu dinero. 
              Registra, visualiza y recibe consejos inteligentes al instante.
            </p>
            <WaitlistForm />
          </div>
          <div className="relative">
            <FloatingChat />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Descubre patrones, no solo números</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <p className="text-2xl font-bold">$85.000</p>
              <p className="text-gray-600">Hoy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">$420.000</p>
              <p className="text-gray-600">Esta Semana</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">$1.850.000</p>
              <p className="text-gray-600">Este Mes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">$5.240.000</p>
              <p className="text-gray-600">Total</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white shadow-lg">
              <h3 className="text-xl font-semibold mb-2">🍔 Comida</h3>
              <p className="text-2xl font-bold">$680.000</p>
              <p className="text-gray-600">36.7%</p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-lg">
              <h3 className="text-xl font-semibold mb-2">🚗 Transporte</h3>
              <p className="text-2xl font-bold">$320.000</p>
              <p className="text-gray-600">17.3%</p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-lg">
              <h3 className="text-xl font-semibold mb-2">🎮 Entretenimiento</h3>
              <p className="text-2xl font-bold">$280.000</p>
              <p className="text-gray-600">15.1%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">A un mensaje de distancia</h3>
              <p className="text-gray-600">Registra gastos, consulta balances y recibe consejos con solo enviar un mensaje</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Habla, él se encarga del resto</h3>
              <p className="text-gray-600">Usa comandos de voz para registrar gastos mientras caminas o manejas</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Envía fotos de tus gastos</h3>
              <p className="text-gray-600">Toma una foto del recibo y FinancIA extraerá automáticamente la información</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Sé de los primeros en transformar tus finanzas</h2>
          <p className="text-xl text-gray-600 mb-8">No te quedes atrás mientras otros ya están tomando el control de su dinero</p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2025 FinancIA. Todos los derechos reservados.</p>
          <p className="text-gray-600 mt-2">Hecho con ❤️ en Colombia 🇨🇴</p>
        </div>
      </footer>
    </main>
  )
} 