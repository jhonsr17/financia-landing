import React from 'react';

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-[#0D1D35] text-white pt-8">
      {/* Navbar */}
      <nav className="container mx-auto px-4 md:px-8 mb-16">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">FinancIA</h1>
          <div className="space-x-6">
            <a href="#producto" className="hover:text-[#9DFAD7] transition-colors">Producto</a>
            <a href="#inicio" className="hover:text-[#9DFAD7] transition-colors">Inicio</a>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
        {/* Columna izquierda - Texto */}
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Tu asistente{' '}
            <span className="block">financiero</span>{' '}
            <span className="block">personal,{' '}
              <span className="text-[#9DFAD7]">ahora en tu WhatsApp</span>
            </span>
          </h2>
          <p className="text-lg mb-8 text-gray-300 max-w-xl">
            Con tan solo un mensaje, nuestro asistente te ayuda a transformar tu dinero. 
            Registra, visualiza y recibe consejos inteligentes al instante.
          </p>
          <button 
            className="bg-[#9DFAD7] text-[#0D1D35] px-8 py-4 rounded-lg font-medium 
                     hover:bg-opacity-90 transition-all duration-300 shadow-lg text-lg"
          >
            Chatea ya con nuestro agente
          </button>
        </div>

        {/* Columna derecha - Chat Mockup */}
        <div className="md:w-1/2 md:pl-8">
          <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-md mx-auto">
            {/* Header del chat */}
            <div className="flex items-center space-x-3 mb-4 pb-3 border-b">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="font-medium text-gray-900">FinancIA</div>
                <div className="text-sm text-gray-500">En línea</div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="space-y-4">
              {/* Mensaje del usuario */}
              <div className="bg-[#D4FFB5] p-4 rounded-2xl ml-auto max-w-[85%] relative">
                <p className="text-gray-800">Hoy gasté 50 mil pesos en el almuerzo con mis compañeros</p>
                <div className="text-xs text-gray-500 text-right mt-1">07:44 pm</div>
              </div>

              {/* Mensaje del bot */}
              <div className="bg-gray-100 p-4 rounded-2xl max-w-[85%] relative">
                <div className="text-gray-800">
                  Confirma tu transacción 💫
                  <br />
                  Monto: 50,000
                  <br />
                  Categoría: Comida 🍽️
                  <br />
                  Cuenta: Efectivo
                  <br />
                  Descripción: Almuerzo
                </div>
                <div className="text-xs text-gray-500 mt-1">07:44 pm</div>
              </div>

              {/* Mensaje del usuario */}
              <div className="bg-[#D4FFB5] p-4 rounded-2xl ml-auto max-w-[85%] relative">
                <p className="text-gray-800">Quiero comprarme unos audífonos que valen 300 mil pesos, ¿Qué me recomiendas?</p>
                <div className="text-xs text-gray-500 text-right mt-1">07:44 pm</div>
              </div>

              {/* Mensaje del bot */}
              <div className="bg-gray-100 p-4 rounded-2xl max-w-[85%] relative">
                <div className="text-gray-800">
                  ¡Con gusto! Para tus audífonos de $300,000, te sugiero reducir $100,000 en Salidas cada mes. ¡Así los tendrás en 3 meses! ✨
                  <br />
                  ¿Quieres activar un recordatorio para tu meta?
                </div>
                <div className="text-xs text-gray-500 mt-1">07:44 pm</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 