'use client'

const StatsSection = () => {
  return (
    <section className="bg-[#0D1D35] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16">
          <span className="text-[#9DFAD7]">Descubre patrones</span>
          <span className="text-white">, no solo números.</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Resumen de Gastos Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">Resumen de Gastos</h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-[#9DFAD7]/20 rounded-xl md:rounded-2xl p-4 md:p-6">
                <p className="text-[#9DFAD7] text-xs md:text-sm mb-1 md:mb-2">Hoy</p>
                <p className="text-white text-xl md:text-3xl font-bold leading-tight">$85.000</p>
                <p className="text-[#9DFAD7]/80 text-xs md:text-sm">COP</p>
              </div>
              <div className="bg-blue-500/20 rounded-xl md:rounded-2xl p-4 md:p-6">
                <p className="text-blue-300 text-xs md:text-sm mb-1 md:mb-2">Esta Semana</p>
                <p className="text-white text-xl md:text-3xl font-bold leading-tight">$420.000</p>
                <p className="text-blue-300/80 text-xs md:text-sm">COP</p>
              </div>
              <div className="bg-purple-500/20 rounded-xl md:rounded-2xl p-4 md:p-6">
                <p className="text-purple-300 text-xs md:text-sm mb-1 md:mb-2">Este Mes</p>
                <p className="text-white text-xl md:text-3xl font-bold leading-tight">$1.850.000</p>
                <p className="text-purple-300/80 text-xs md:text-sm">COP</p>
              </div>
              <div className="bg-gray-500/20 rounded-xl md:rounded-2xl p-4 md:p-6">
                <p className="text-gray-300 text-xs md:text-sm mb-1 md:mb-2">Total</p>
                <p className="text-white text-xl md:text-3xl font-bold leading-tight">$5.240.000</p>
                <p className="text-gray-300/80 text-xs md:text-sm">COP</p>
              </div>
            </div>
          </div>

          {/* Mapa de Gastos Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">Mapa de Gastos por Categoría</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4 h-[280px] md:h-[calc(100%-4rem)]">
              {/* Comida - 36.7% */}
              <div className="col-span-2 md:col-span-4 row-span-2 bg-red-500/80 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-white text-sm md:text-base">🍔</span>
                  <span className="text-white text-xs md:text-sm font-medium">Comida</span>
                </div>
                <div>
                  <p className="text-white text-lg md:text-2xl font-bold leading-tight">$680.000</p>
                  <p className="text-white/80 text-xs md:text-sm">36.7%</p>
                </div>
              </div>

              {/* Transporte - 17.3% */}
              <div className="col-span-2 row-span-2 bg-blue-500/80 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-white text-sm md:text-base">🚗</span>
                  <span className="text-white text-xs md:text-sm font-medium">Transporte</span>
                </div>
                <div>
                  <p className="text-white text-sm md:text-lg font-bold leading-tight">$320.000</p>
                  <p className="text-white/80 text-xs md:text-sm">17.3%</p>
                </div>
              </div>

              {/* Entretenimiento - 15.1% */}
              <div className="col-span-1 md:col-span-2 bg-purple-500/80 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-white text-sm md:text-base">🎮</span>
                  <span className="text-white text-xs md:text-sm font-medium">Entret.</span>
                </div>
                <div>
                  <p className="text-white text-sm md:text-lg font-bold leading-tight">$280.000</p>
                  <p className="text-white/80 text-xs md:text-sm">15.1%</p>
                </div>
              </div>

              {/* Compras - 13.0% */}
              <div className="col-span-1 md:col-span-2 bg-green-500/80 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-white text-sm md:text-base">🛍️</span>
                  <span className="text-white text-xs md:text-sm font-medium">Compras</span>
                </div>
                <div>
                  <p className="text-white text-sm md:text-lg font-bold leading-tight">$240.000</p>
                  <p className="text-white/80 text-xs md:text-sm">13.0%</p>
                </div>
              </div>

              {/* Servicios - 9.7% */}
              <div className="col-span-1 bg-yellow-500/80 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-white text-sm md:text-base">📱</span>
                </div>
                <div>
                  <p className="text-white text-xs md:text-sm font-bold leading-tight">$180.000</p>
                  <p className="text-white/80 text-xs md:text-sm">9.7%</p>
                </div>
              </div>

              {/* Salud - 8.1% */}
              <div className="col-span-1 bg-teal-500/80 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-white text-sm md:text-base">💊</span>
                </div>
                <div>
                  <p className="text-white text-xs md:text-sm font-bold leading-tight">$150.000</p>
                  <p className="text-white/80 text-xs md:text-sm">8.1%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/70 text-center mt-8 md:mt-12 max-w-3xl mx-auto text-sm md:text-base leading-relaxed px-4">
          Olvídate de las hojas de cálculo confusas. Aquí puedes ver tus gastos por categoría, tus ingresos a lo largo del tiempo o el impacto de tus hábitos en gráficas que realmente te hablan.
        </p>
      </div>
    </section>
  );
};

export default StatsSection; 