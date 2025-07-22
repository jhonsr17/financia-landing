import { FloatingChat } from '@/components/FloatingChat'
import { WaitlistForm } from '@/components/WaitlistForm'
import ChatCarousel from '@/components/ChatCarousel'
import StatsSection from '@/components/StatsSection'
import FeaturesGrid from '@/components/FeaturesGrid'
import PricingSection from '@/components/PricingSection'
import { AuthNavigation } from '@/components/AuthNavigation'
import { TermsAndConditions } from '@/components/TermsAndConditions'
import { PrivacyPolicy } from '@/components/PrivacyPolicy'

export default function Home() {
  return (
    <main className='min-h-screen bg-[#0D1D35]'>
      <nav className='sticky top-0 z-50 bg-[#0D1D35]/95 backdrop-blur-sm border-b border-white/10 container mx-auto px-4 py-4 md:py-6 flex justify-between items-center'>
        <h1 className='text-xl md:text-2xl font-bold text-white'>FinancIA</h1>
        <div className='flex items-center space-x-4 md:space-x-6'>
          <a href='#producto' className='text-white hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>Producto</a>
          <a href='#plan' className='text-white hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>Plan</a>
          <a href='#inicio' className='text-white hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>Inicio</a>
          <AuthNavigation />
        </div>
      </nav>

      {/* Hero Section */}
      <section id='inicio' className='container mx-auto px-4 py-8 md:py-12'>
        <div className='grid md:grid-cols-2 gap-8 md:gap-12'>
          <div className='space-y-4 md:space-y-6 md:h-[600px] flex flex-col justify-center'>
            <div>
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'>
                Tu asistente financiero personal,{" "}
                <span className='text-[#9DFAD7]'>ahora en tu WhatsApp</span>
              </h2>
              <p className='text-base md:text-lg text-white/80 mt-4 md:mt-6 leading-relaxed'>
                Con tan solo un mensaje, nuestro asistente te ayuda a transformar tu dinero.
                Registra, visualiza y recibe consejos inteligentes al instante.
              </p>
              <a
                href='#waitlist'
                className='inline-block bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] text-[#0D1D35] font-semibold py-3 px-6 md:px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#9DFAD7]/20 mt-4 md:mt-6 text-sm md:text-base'
              >
                Asegura tu lugar
              </a>
            </div>
          </div>
          <div className='relative md:h-[600px] flex items-center justify-center md:justify-start'>
            <FloatingChat />
          </div>
        </div>
      </section>

      {/* Chat Examples Section */}
      <ChatCarousel />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section id='producto'>
        <FeaturesGrid />
      </section>

      {/* CTA Section */}
      <section id='waitlist' className='py-16 md:py-24 relative overflow-hidden scroll-mt-6'>
        <div className='absolute inset-0 bg-gradient-to-b from-[#0D1D35] to-[#0D1D35]/90'></div>
        <div className='absolute inset-0 bg-[url("/grid.svg")] opacity-10'></div>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='grid lg:grid-cols-12 gap-8 lg:gap-12 items-center'>
            <div className='text-left space-y-4 md:space-y-6 lg:col-span-5'>
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] text-transparent bg-clip-text leading-tight'>
                Domina tus finanzas sin ser un experto
              </h2>
              <p className='text-lg md:text-xl text-white/80 max-w-xl leading-relaxed'>
                Sé parte del grupo exclusivo que está transformando su relación con el dinero.
                Con FinancIA, tus finanzas personales dejan de ser un dolor de cabeza
                para convertirse en tu mejor aliado hacia la libertad financiera.
              </p>
            </div>
            <div className='lg:col-span-7 md:scale-105 lg:scale-110 transform md:translate-x-2 lg:translate-x-4 transition-all duration-700 hover:scale-[1.08] lg:hover:scale-[1.15]'>
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className='relative py-12 md:py-16 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-[#0D1D35]/90 to-[#0D1D35]'></div>
        <div className='absolute inset-0 bg-[url("/grid.svg")] opacity-5'></div>
        <div className='container mx-auto px-4 relative'>
          <div className='grid md:grid-cols-4 gap-8 md:gap-12'>
            <div className='space-y-3 md:space-y-4'>
              <h3 className='text-xl md:text-2xl font-bold bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] text-transparent bg-clip-text'>FinancIA</h3>
              <p className='text-white/70 text-sm md:text-base leading-relaxed'>Transformando la manera en que manejas tu dinero, un mensaje a la vez.</p>
            </div>
            <div className='space-y-3 md:space-y-4'>
              <h4 className='text-base md:text-lg font-semibold text-[#9DFAD7]'>Enlaces</h4>
              <div className='space-y-2'>
                <a href='#inicio' className='block text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>Inicio</a>
                <a href='#producto' className='block text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>Producto</a>
                <a href='#waitlist' className='block text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>Únete</a>
              </div>
            </div>
            <div className='space-y-3 md:space-y-4'>
              <h4 className='text-base md:text-lg font-semibold text-[#9DFAD7]'>Legal</h4>
              <div className='space-y-2'>
                <TermsAndConditions />
                <PrivacyPolicy />
              </div>
            </div>
            <div className='space-y-3 md:space-y-4'>
              <h4 className='text-base md:text-lg font-semibold text-[#9DFAD7]'>Contacto</h4>
              <div className='space-y-2'>
                <a
                  href='https://www.linkedin.com/in/jhon-rivera-529022302/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center space-x-2 text-white/70 hover:text-[#9DFAD7] transition-colors group text-sm md:text-base'
                >
                  <svg
                    className='w-4 h-4 md:w-5 md:h-5 fill-current group-hover:scale-110 transition-transform'
                    viewBox='0 0 24 24'
                  >
                    <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          <div className='border-t border-white/10 pt-6 md:pt-8 text-center'>
            <p className='text-white/70 text-sm md:text-base'>© 2025 FinancIA. Todos los derechos reservados.</p>
            <div className='flex flex-wrap justify-center items-center gap-4 mt-3'>
              <TermsAndConditions />
              <span className='text-white/50'>•</span>
              <PrivacyPolicy />
            </div>
            <p className='text-white/70 mt-3 text-sm md:text-base'>Hecho con <span className='text-[#9DFAD7]'>❤️</span> en Colombia <span className='ml-1'>🇨🇴</span></p>
          </div>
        </div>
      </footer>
    </main>
  )
}
