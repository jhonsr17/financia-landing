'use client'

import { useEffect, useRef, useState } from 'react'

interface ChatMessage {
	message: string
	isBot: boolean
	timestamp: string
}

interface ConversationFeature {
	title: string
	description: string
	messages: ChatMessage[]
	icon: string
}

const FEATURE_CONVERSATIONS: ConversationFeature[] = [
	// Feature 1: Registro de Gastos
	{
		title: 'Registro Automático',
		description: 'Registra gastos e ingresos con un simple mensaje',
		icon: '💰',
		messages: [
			{ message: 'Hoy gasté 50 mil pesos en el Uber.', isBot: false, timestamp: '14:23' },
			{ message: '¡Registrado! 🚕 $50.000 en transporte. ¿Quieres confirmar esta transacción?', isBot: true, timestamp: '14:23' },
			{ message: 'Sí, confirmo.', isBot: false, timestamp: '14:24' },
			{ message: '¡Listo! Tu gasto ha sido guardado. ¿Algo más que quieras anotar?', isBot: true, timestamp: '14:24' }
		]
	},
	// Feature 2: Análisis y Recomendaciones
	{
		title: 'Análisis Inteligente',
		description: 'Recibe consejos personalizados para tus finanzas',
		icon: '📊',
		messages: [
			{ message: 'Paz, ¿cómo va mi presupuesto de comida esta semana?', isBot: false, timestamp: '15:30' },
			{ message: '¡Excelente pregunta! 🍽️ Has gastado $120.000 de los $200.000 presupuestados. Te quedan $80.000 para los próximos 3 días.', isBot: true, timestamp: '15:30' },
			{ message: '¿Algún consejo para estirar ese presupuesto?', isBot: false, timestamp: '15:31' },
			{ message: '¡Claro! Te sugiero planificar las comidas, hacer lista de compras y aprovechar ofertas. ¡Puedes lograrlo! 💪', isBot: true, timestamp: '15:31' }
		]
	},
	// Feature 3: Metas de Ahorro
	{
		title: 'Metas de Ahorro',
		description: 'Establece y alcanza tus objetivos financieros',
		icon: '🎯',
		messages: [
			{ message: 'Paz, quiero comprarle un vestido a mi mamá que vale 200 mil pesos para su cumpleaños el próximo mes.', isBot: false, timestamp: '16:15' },
			{ message: '¡Qué gran detalle! 👗 Para tu meta del vestido de $200.000 COP en 4 semanas, te sugiero ahorrar $50.000 COP cada semana. ¡Así lo lograrás! ¿Empezamos hoy?', isBot: true, timestamp: '16:15' },
			{ message: 'Sí, vamos con eso.', isBot: false, timestamp: '16:16' },
			{ message: '¡Excelente! Te recordaré tu meta semanal y tu progreso. ¡Tu mamá estará feliz! 🎉', isBot: true, timestamp: '16:16' }
		]
	},
	// Feature 4: Resumen Financiero
	{
		title: 'Resumen Mensual',
		description: 'Visualiza tu progreso financiero completo',
		icon: '📈',
		messages: [
			{ message: 'Paz, ¿cómo estuvo mi mes financieramente?', isBot: false, timestamp: '17:00' },
			{ message: '📊 Tu mes fue muy bueno! Ahorraste un 15% más que el mes pasado. Los gastos en entretenimiento bajaron un 20%. ¡Excelente progreso! 🎉', isBot: true, timestamp: '17:00' },
			{ message: '¡Qué bien! ¿Algún consejo para mantener esta tendencia?', isBot: false, timestamp: '17:01' },
			{ message: 'Mantén tu rutina de registro diario y sigue revisando tus metas semanalmente. ¡La consistencia es la clave del éxito financiero! 🔑', isBot: true, timestamp: '17:01' }
		]
	}
]

export default function FloatingChatWidget() {
	const [scrollProgress, setScrollProgress] = useState(0)
	const [currentFeature, setCurrentFeature] = useState(0)
	const [phoneOpacity, setPhoneOpacity] = useState(0)
	const [phoneScale, setPhoneScale] = useState(0.8)
	const [phoneTranslateY, setPhoneTranslateY] = useState(50)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleScroll = () => {
			const scrolled = window.scrollY
			const vh = window.innerHeight
			
			// Transición fluida desde el hero section
			if (scrolled > 0) {
				// Aparición gradual del teléfono (0% a 30% del scroll)
				const phoneAppearProgress = Math.min(scrolled / (vh * 0.3), 1)
				setPhoneOpacity(phoneAppearProgress)
				setPhoneScale(0.8 + (phoneAppearProgress * 0.2)) // 0.8 a 1.0
				setPhoneTranslateY(50 - (phoneAppearProgress * 50)) // 50px a 0px
				
				// Cambio de feature basado en el scroll (después de que aparezca el teléfono)
				if (phoneAppearProgress >= 1) {
					const featureProgress = Math.min((scrolled - vh * 0.3) / (vh * 1.2), 1) // Reducido de 1.7 a 1.2
					const featureIndex = Math.floor(featureProgress * FEATURE_CONVERSATIONS.length)
					setCurrentFeature(Math.min(featureIndex, FEATURE_CONVERSATIONS.length - 1))
					
					// Actualizar scrollProgress solo para el rango de features
					setScrollProgress(featureProgress)
				} else {
					setScrollProgress(0)
				}
			} else {
				setScrollProgress(0)
				setCurrentFeature(0)
				setPhoneOpacity(0)
				setPhoneScale(0.8)
				setPhoneTranslateY(50)
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// No mostrar nada hasta que haya scroll
	if (scrollProgress === 0 && phoneOpacity === 0) return null

	const currentFeatureData = FEATURE_CONVERSATIONS[currentFeature]
	const parallaxOffset = scrollProgress * 40 // Reducido para movimiento más sutil

	return (
		<div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
			{/* Background - Mismo que el hero section */}
			<div 
				className="absolute inset-0 bg-gradient-to-b from-[#0D1D35] via-[#1a2e4a] to-[#0D1D35]"
				style={{
					opacity: phoneOpacity
				}}
			></div>
			
			{/* Floating Elements con opacidad gradual */}
			<div 
				className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-60 animate-float"
				style={{
					opacity: phoneOpacity * 0.8
				}}
			></div>
			<div 
				className="absolute bottom-20 right-20 w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-40 animate-float"
				style={{
					animationDelay: '2s',
					opacity: phoneOpacity * 0.6
				}}
			></div>
			
			{/* Main Phone Mockup - Gradual Appearance */}
			<div 
				ref={containerRef}
				className="relative w-[320px] h-[640px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-[40px] shadow-2xl border-8 border-gray-700 overflow-hidden transform transition-all duration-1000 ease-out"
				style={{
					boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
					opacity: phoneOpacity,
					transform: `translateY(${phoneTranslateY}px) scale(${phoneScale})`,
					transformOrigin: 'center center'
				}}
			>
				{/* Phone Screen */}
				<div className="absolute inset-2 bg-white rounded-[32px] overflow-hidden">
					{/* Status Bar - Like Memorae */}
					<div className="h-8 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-between px-6 text-white text-xs font-medium">
						<span>9:41</span>
						<div className="flex items-center gap-1">
							<div className="w-4 h-2 bg-white/80 rounded-full"></div>
							<div className="w-4 h-2 bg-white/80 rounded-full"></div>
							<div className="w-4 h-2 bg-white/80 rounded-full"></div>
						</div>
					</div>

					{/* Chat Header - Like Memorae */}
					<div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-[#4CAFB9] to-[#26A69A] rounded-full flex items-center justify-center text-white font-bold text-lg">
							F
						</div>
						<div className="flex-1">
							<h3 className="font-semibold text-gray-800">Paz</h3>
							<p className="text-xs text-green-500">en línea</p>
						</div>
						<div className="flex gap-2">
							<button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
								<svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
								</svg>
							</button>
							<button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
								<svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
								</svg>
							</button>
						</div>
					</div>

					{/* Feature Header - Like Memorae */}
					<div className="bg-gradient-to-r from-[#4CAFB9] to-[#26A69A] px-4 py-3 text-center">
						<div className="flex items-center justify-center gap-2 mb-1">
							<span className="text-2xl">{currentFeatureData.icon}</span>
							<h4 className="text-white text-sm font-medium">{currentFeatureData.title}</h4>
						</div>
						<p className="text-white/90 text-xs">{currentFeatureData.description}</p>
					</div>

					{/* Chat Messages - Complete Conversation */}
					<div className="h-[calc(100%-160px)] bg-[#f0f0f0] p-4 space-y-3 overflow-y-auto">
						{currentFeatureData.messages.map((msg, idx) => (
							<div
								key={idx}
								className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
								style={{ animationDelay: `${idx * 50}ms` }}
							>
								<div
									className={`max-w-[80%] rounded-2xl px-4 py-3 ${
										msg.isBot
											? 'bg-[#E0F2F1] text-gray-800'
											: 'bg-[#DCF8C6] text-gray-800'
									}`}
								>
									<p className="text-sm leading-relaxed">{msg.message}</p>
									<span className="text-xs text-gray-500 mt-1 block">
										{msg.timestamp}
									</span>
								</div>
							</div>
						))}
					</div>

					{/* Input Area */}
					<div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3">
						<div className="flex items-center gap-2">
							<div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
								<span className="text-gray-400 text-sm">Escribe un mensaje...</span>
							</div>
							<button className="w-8 h-8 bg-[#4CAFB9] rounded-full flex items-center justify-center">
								<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.25A1 1 0 009 15.5V9a1 1 0 00-1-1H4a1 1 0 00-1 1v5.5a1 1 0 00.894 1.409l5 1.25a1 1 0 001.169-1.409l-7-14z"/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Feature Progress Indicator - Gradual Appearance */}
			<div 
				className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-1000 ease-out"
				style={{
					opacity: phoneOpacity,
					transform: `translateX(-50%) translateY(${phoneOpacity * 20}px)`
				}}
			>
				{FEATURE_CONVERSATIONS.map((feature, idx) => (
					<div
						key={idx}
						className={`flex flex-col items-center gap-1 transition-all duration-300 ${
							idx === currentFeature 
								? 'opacity-100 scale-110' 
								: 'opacity-40 scale-90'
						}`}
					>
						<div className={`w-4 h-4 rounded-full transition-all duration-300 ${
							idx === currentFeature 
								? 'bg-[#4CAFB9]' 
								: 'bg-gray-300'
						}`}></div>
						<span className={`text-xs font-medium transition-colors duration-300 ${
							idx === currentFeature 
								? 'text-[#4CAFB9]' 
								: 'text-gray-400'
						}`}>
							{feature.title.split(' ')[0]}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
