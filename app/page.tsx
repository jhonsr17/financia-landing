import ChatCarousel from '@/components/ChatCarousel'
import StatsSection from '@/components/StatsSection'
import FeaturesGrid from '@/components/FeaturesGrid'
import PricingSection from '@/components/PricingSection'
import { AuthNavigation } from '@/components/AuthNavigation'
import { FloatingUserMessages } from '@/components/FloatingUserMessages'
import { CommunityStats } from '@/components/CommunityStats'
import { WhatsAppCTAButton } from '@/components/WhatsAppCTAButton'


export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-[#ECFFF1] via-[#D4FFB5]/60 to-[#9DFAD7]/40'>
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
      <section id='inicio' className='min-h-screen flex items-center justify-center px-4 py-8'>
        <div className='text-center max-w-6xl mx-auto space-y-4'>
          {/* Header Title */}
          <div className='space-y-3'>
            <h1 className='text-3xl md:text-5xl lg:text-6xl font-bold text-[#0D1D35] leading-tight'>
              Tu asistente financiero personal, <span className='text-[#0D1D35]'>ahora en tu WhatsApp</span>
            </h1>
            <p className='text-lg md:text-xl text-[#0D1D35]/80 leading-relaxed max-w-3xl mx-auto'>
              Organiza tus finanzas con un simple mensaje en WhatsApp.
            </p>
          </div>

          {/* Floating User Messages */}
          <div className='flex justify-center py-4'>
            <FloatingUserMessages />
          </div>

          {/* Community Stats */}
          <div className='py-3'>
            <CommunityStats />
          </div>

          {/* CTA Button */}
          <div className='pt-3'>
            <WhatsAppCTAButton text="Probar Gratis Ahora" href="/register" />
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



      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className='relative py-12 md:py-16 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-[#0D1D35]/90 to-[#0D1D35]'></div>
        <div className='absolute inset-0 bg-[url("/grid.svg")] opacity-5'></div>
        <div className='container mx-auto px-4 relative'>
          <div className='grid md:grid-cols-3 gap-8 md:gap-12'>
            <div className='space-y-3 md:space-y-4'>
              <h3 className='text-xl md:text-2xl font-bold bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] text-transparent bg-clip-text'>FinancIA</h3>
              <p className='text-white/70 text-sm md:text-base leading-relaxed'>Transformando la manera en que manejas tu dinero, un mensaje a la vez.</p>
            </div>
            <div className='space-y-3 md:space-y-4'>
              <h4 className='text-base md:text-lg font-semibold text-[#9DFAD7]'>Enlaces</h4>
              <div className='space-y-2'>
                <a href='#inicio' className='block text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>Inicio</a>
                <a href='#producto' className='block text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>Producto</a>
                <a href='#plan' className='block text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>Plan</a>
                <div className='pt-2 space-y-2'>
                  <a href='/terms' className='block text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>
                    Términos y Condiciones
                  </a>
                  <a href='/privacy' className='block text-white/70 hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>
                    Política de Privacidad
                  </a>
                </div>
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
            <p className='text-white/70 mt-2 text-sm md:text-base'>Hecho con <span className='text-[#9DFAD7]'>❤️</span> en Colombia <span className='ml-1'>🇨🇴</span></p>
          </div>
        </div>
      </footer>
    </main>
  )
}
