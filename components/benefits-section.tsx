'use client'

import { Reveal } from '@/components/reveal'

interface BenefitItem {
	icon: string
	title: string
	description: string
}

const benefits: BenefitItem[] = [
	{
		icon: '⚡',
		title: 'Registra en segundos',
		description: 'Agrega gastos e ingresos chateando, sin formularios eternos.'
	},
	{
		icon: '🤖',
		title: 'Asistente inteligente',
		description: 'Te sugiere categorías y detecta montos automáticamente.'
	},
	{
		icon: '📊',
		title: 'Resumen claro',
		description: 'Ve tu presupuesto y variación por categoría en tiempo real.'
	},
	{
		icon: '🔔',
		title: 'Alertas útiles',
		description: 'Recibe avisos cuando te acerques al límite del mes.'
	},
	{
		icon: '🔒',
		title: 'Seguro por diseño',
		description: 'Datos cifrados y políticas estrictas para tu tranquilidad.'
	},
	{
		icon: '📱',
		title: 'Funciona en tu WhatsApp',
		description: 'Nada que instalar. Usa la app que ya conoces.'
	}
]

export default function BenefitsSection () {
	return (
		<section aria-label='Beneficios del producto' className='bg-[#0D1D35] py-16 md:py-24'>
			<div className='container mx-auto px-4'>
				<Reveal className='text-center mb-10 md:mb-16'>
					<h2 className='text-2xl md:text-4xl font-bold'>
						<span className='bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] text-transparent bg-clip-text'>Lo que obtienes</span>
					</h2>
					<p className='text-white/70 mt-3 md:mt-4 max-w-2xl mx-auto'>
						Automatiza tu control financiero con una experiencia simple y humana
					</p>
				</Reveal>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8'>
					{benefits.map((b, i) => (
						<Reveal key={b.title} delayMs={i * 100}>
							<article
								role='article'
								className='h-full rounded-2xl bg-white text-[#0D1D35] shadow-lg p-5 md:p-6 flex flex-col'
							>
								<div className='flex items-center gap-3'>
									<div className='w-12 h-12 rounded-xl bg-[#9DFAD7] flex items-center justify-center shadow-sm'>
										<span className='text-2xl'>{b.icon}</span>
									</div>
									<h3 className='text-lg md:text-xl font-semibold'>{b.title}</h3>
								</div>
								<p className='text-sm md:text-base text-[#0D1D35]/70 mt-3'>
									{b.description}
								</p>
							</article>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	)
}


