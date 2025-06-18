import { FloatingChat } from '@/components/FloatingChat'
import { WaitlistForm } from '@/components/WaitlistForm'
import ChatCarousel from '@/components/ChatCarousel'
import StatsSection from '@/components/StatsSection'
import FeaturesGrid from '@/components/FeaturesGrid'

export default function Home() {
  return (
    <main className='min-h-screen bg-[#0D1D35]'>
      <FloatingChat />
      <ChatCarousel />
      <StatsSection />
      <FeaturesGrid />
      <WaitlistForm />
    </main>
  )
}
