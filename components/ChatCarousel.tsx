'use client'

import { useRef, useEffect } from 'react';
import ChatExample from './ChatExample';

const CHAT_EXAMPLES = [
  {
    messages: [
      {
        isUser: true,
        text: "Gasté $40,000 en el lavado del carro",
        time: "16:12",
      },
      {
        isUser: false,
        text: "👍 Confirma tu transacción:\nMonto: $40,000 COP\nCategoría: Auto 🚗\nDescripción: Servicio Auto\nCuenta: Bancolombia 🏦",
        time: "16:12",
      },
      {
        isUser: true,
        text: "Confirmar ✅",
        time: "16:13",
      },
    ],
  },
  {
    messages: [
      {
        isUser: true,
        text: "¿Qué tal estuvo mi fin de semana en gastos? 😅",
        time: "15:44",
      },
      {
        isUser: false,
        text: "🎉 Wey, tu fin de semana costó $200,000 COP en fiestas... Te recomiendo que le bajes un poquito 😅 🎯 ¿Quieres quebrar?",
        time: "15:45",
      },
    ],
  },
  {
    messages: [
      {
        isUser: true,
        text: "¿Por qué gasto tanto en transporte? 🚗 💸",
        time: "18:30",
      },
      {
        isUser: false,
        text: "🚗 Hermano, gastaste $104,000 COP en Ubers porque seguiste \"durmiendo accidentalmente\" 😴\nTe recomiendo poner 5 alarmas o comprar una bici 🚲",
        time: "18:30",
      },
    ],
  },
];

const ChatCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const scroll = () => {
      const maxScroll = scrollElement.scrollWidth - scrollElement.clientWidth;
      let currentScroll = scrollElement.scrollLeft;

      currentScroll += 1;
      if (currentScroll >= maxScroll) {
        currentScroll = 0;
      }

      scrollElement.scrollLeft = currentScroll;
    };

    const intervalId = setInterval(scroll, 40);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="bg-[#0D1D35] py-8 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12 px-4">
          Imagina tener un amigo que{' '}
          <span className="text-[#5ce1e6]">siempre cuida tu dinero</span>
        </h2>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-hidden gap-3 md:gap-4 py-4 mb-8 md:mb-12 px-2 md:px-0"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
        >
          {[...CHAT_EXAMPLES, ...CHAT_EXAMPLES, ...CHAT_EXAMPLES].map((example, index) => (
            <ChatExample key={index} messages={example.messages} />
          ))}
        </div>

        <p className="text-white/80 text-center max-w-4xl mx-auto text-sm md:text-lg leading-relaxed px-4">
          ¿Necesitas un consejo rápido? Pregúntale. ¿Quieres saber dónde se fue tu último gasto? Él lo sabe. Es la tranquilidad de tener un experto que te acompaña en cada decisión financiera, sin juicios y siempre listo para ayudarte.
        </p>
      </div>
    </section>
  );
};

export default ChatCarousel; 