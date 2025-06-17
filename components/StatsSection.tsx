'use client'

const StatsSection = () => {
  return (
    <section className="bg-[#0D1D35] py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-[#9DFAD7]">Descubre patrones</span>
          <span className="text-white">, no solo números.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resumen de Gastos Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8">Resumen de Gastos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#9DFAD7]/20 rounded-2xl p-6">
                <p className="text-[#9DFAD7] text-sm mb-2">Hoy</p>
                <p className="text-white text-3xl font-bold">$85.000</p>
                <p className="text-[#9DFAD7]/80 text-sm">COP</p>
              </div>
              <div className="bg-blue-500/20 rounded-2xl p-6">
                <p className="text-blue-300 text-sm mb-2">Esta Semana</p>
                <p className="text-white text-3xl font-bold">$420.000</p>
                <p className="text-blue-300/80 text-sm">COP</p>
              </div>
              <div className="bg-purple-500/20 rounded-2xl p-6">
                <p className="text-purple-300 text-sm mb-2">Este Mes</p>
                <p className="text-white text-3xl font-bold">$1.850.000</p>
                <p className="text-purple-300/80 text-sm">COP</p>
              </div>
              <div className="bg-gray-500/20 rounded-2xl p-6">
                <p className="text-gray-300 text-sm mb-2">Total</p>
                <p className="text-white text-3xl font-bold">$5.240.000</p>
                <p className="text-gray-300/80 text-sm">COP</p>
              </div>
            </div>
          </div>

          {/* Mapa de Gastos Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8">Mapa de Gastos por Categoría</h3>
            <div className="grid grid-cols-6 gap-4 h-[calc(100%-4rem)]">
              {/* Comida - 36.7% */}
              <div className="col-span-4 row-span-2 bg-red-500/80 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white">🍔</span>
                  <span className="text-white">Comida</span>
                </div>
                <div>
                  <p className="text-white text-2xl font-bold">$680.000</p>
                  <p className="text-white/80">36.7%</p>
                </div>
              </div>

              {/* Transporte - 17.3% */}
              <div className="col-span-2 row-span-2 bg-blue-500/80 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white">🚗</span>
                  <span className="text-white">Transporte</span>
                </div>
                <div>
                  <p className="text-white text-lg font-bold">$320.000</p>
                  <p className="text-white/80">17.3%</p>
                </div>
              </div>

              {/* Entretenimiento - 15.1% */}
              <div className="col-span-2 bg-purple-500/80 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white">🎮</span>
                  <span className="text-white">Entret.</span>
                </div>
                <div>
                  <p className="text-white text-lg font-bold">$280.000</p>
                  <p className="text-white/80">15.1%</p>
                </div>
              </div>

              {/* Compras - 13.0% */}
              <div className="col-span-2 bg-green-500/80 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white">🛍️</span>
                  <span className="text-white">Compras</span>
                </div>
                <div>
                  <p className="text-white text-lg font-bold">$240.000</p>
                  <p className="text-white/80">13.0%</p>
                </div>
              </div>

              {/* Servicios - 9.7% */}
              <div className="col-span-1 bg-yellow-500/80 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white">📱</span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">$180.000</p>
                  <p className="text-white/80">9.7%</p>
                </div>
              </div>

              {/* Salud - 8.1% */}
              <div className="col-span-1 bg-teal-500/80 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white">💊</span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">$150.000</p>
                  <p className="text-white/80">8.1%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/70 text-center mt-12 max-w-3xl mx-auto">
          Olvídate de las hojas de cálculo confusas. Aquí puedes ver tus gastos por categoría, tus ingresos a lo largo del tiempo o el impacto de tus hábitos en gráficas que realmente te hablan.
        </p>
      </div>
    </section>
  );
};

export default StatsSection; 