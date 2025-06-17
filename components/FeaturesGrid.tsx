'use client'

const FeaturesGrid = () => {
  const features = [
    {
      icon: "💬",
      title: "Chatea y registra gastos"
    },
    {
      icon: "🎤",
      title: "Envía notas de voz"
    },
    {
      icon: "📸",
      title: "Captura tus recibos"
    },
    {
      icon: "📊",
      title: "Visualiza tus finanzas"
    },
    {
      icon: "🎯",
      title: "Recibe consejos personalizados"
    },
    {
      icon: "📱",
      title: "Todo en WhatsApp"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-[#0D1D35] to-[#0D1D35]/90 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-[#9DFAD7]">Simple</span>
          <span className="text-white">, rápido y efectivo</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 bg-[#9DFAD7] rounded-2xl flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                <span className="text-4xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-medium text-white">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid; 