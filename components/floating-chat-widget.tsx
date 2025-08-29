'use client'

import { useEffect, useRef, useState } from 'react'

interface ChatMessage {
	message: string
	isBot: boolean
	timestamp: string
}

const CONVERSATION_SEQUENCES = [
	// Secuencia 1: Registro de Gastos e Ingresos
	[
		{ message: 'Hoy gasté 50 mil pesos en el Uber.', isBot: false, timestamp: '14:23' },
		{ message: '¡Registrado! 🚕 $50.000 en transporte. ¿Quieres confirmar esta transacción?', isBot: true, timestamp: '14:23' },
		{ message: 'Sí, confirmo.', isBot: false, timestamp: '14:24' },
		{ message: '¡Listo! Tu gasto ha sido guardado. ¿Algo más que quieras anotar?', isBot: true, timestamp: '14:24' }
	],
	// Secuencia 2: Análisis de Gastos de Fin de Semana
	[
		{ message: 'Paz, ¿qué tal estuvo mi fin de semana en gastos?', isBot: false, timestamp: '15:30' },
		{ message: '¡Uy! 😉 Tu fin de semana te costó $180.000 COP, un 25% más que tu promedio. Mayormente en entretenimiento. ¿Te pasaste un poquito? 😅', isBot: true, timestamp: '15:30' },
		{ message: 'Jajaja, creo que sí. ¿Algún consejo?', isBot: false, timestamp: '15:31' },
		{ message: 'Para el próximo fin de semana, podrías intentar establecer un límite de $120.000 COP y buscar planes más económicos. ¡Pequeños cambios hacen la diferencia!', isBot: true, timestamp: '15:31' }
	],
	// Secuencia 3: Roadmap para Metas de Ahorro
	[
		{ message: 'Paz, quiero comprarle un vestido a mi mamá que vale 200 mil pesos para su cumpleaños el próximo mes.', isBot: false, timestamp: '16:15' },
		{ message: '¡Qué gran detalle! 👗 Para tu meta del vestido de $200.000 COP en 4 semanas, te sugiero ahorrar $50.000 COP cada semana. ¡Así lo lograrás! ¿Empezamos hoy?', isBot: true, timestamp: '16:15' },
		{ message: 'Sí, vamos con eso.', isBot: false, timestamp: '16:16' },
		{ message: '¡Excelente! Te recordaré tu meta semanal y tu progreso. ¡Tu mamá estará feliz! 🎉', isBot: true, timestamp: '16:16' }
	]
]

export default function FloatingChatWidget() {
	const [isHalfScrolled, setIsHalfScrolled] = useState(false)
	const [currentSequence, setCurrentSequence] = useState(0)
	const [visibleMessages, setVisibleMessages] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleScroll = () => {
			const scrolled = window.scrollY
			const vh = window.innerHeight
			setIsHalfScrolled(scrolled > vh * 0.5)
		}
		handleScroll()
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		if (!isHalfScrolled) return

		let mounted = true
		let sequenceIndex = 0
		let messageIndex = 0

		const showNextMessage = async () => {
			if (!mounted) return

			const currentSeq = CONVERSATION_SEQUENCES[sequenceIndex]
			if (messageIndex < currentSeq.length) {
				setVisibleMessages(messageIndex + 1)
				messageIndex++
				setTimeout(showNextMessage, 1500)
			} else {
				// Move to next sequence
				messageIndex = 0
				sequenceIndex = (sequenceIndex + 1) % CONVERSATION_SEQUENCES.length
				setCurrentSequence(sequenceIndex)
				setVisibleMessages(0)
				setTimeout(showNextMessage, 2000)
			}
		}

		setTimeout(showNextMessage, 1000)
		return () => { mounted = false }
	}, [isHalfScrolled])

	if (!isHalfScrolled) return null

	const currentMessages = CONVERSATION_SEQUENCES[currentSequence]

	return (
		<div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
			{/* Background Elements */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
			
			{/* Floating Elements */}
			<div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-60 animate-float"></div>
			<div className="absolute bottom-20 right-20 w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
			
			{/* Main Phone Mockup */}
			<div 
				ref={containerRef}
				className="relative w-[320px] h-[640px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-[40px] shadow-2xl border-8 border-gray-700 overflow-hidden transform rotate-12 hover:rotate-6 transition-transform duration-700"
				style={{
					boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
				}}
			>
				{/* Phone Screen */}
				<div className="absolute inset-2 bg-white rounded-[32px] overflow-hidden">
					{/* Status Bar */}
					<div className="h-8 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-between px-6 text-white text-xs font-medium">
						<span>9:41</span>
						<div className="flex items-center gap-1">
							<div className="w-4 h-2 bg-white/80 rounded-full"></div>
							<div className="w-4 h-2 bg-white/80 rounded-full"></div>
							<div className="w-4 h-2 bg-white/80 rounded-full"></div>
						</div>
					</div>

					{/* Chat Header */}
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

					{/* Chat Messages */}
					<div className="h-[calc(100%-120px)] bg-[#f0f0f0] p-4 space-y-3 overflow-y-auto">
						{currentMessages.slice(0, visibleMessages).map((msg, idx) => (
							<div
								key={idx}
								className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
								style={{ animationDelay: `${idx * 100}ms` }}
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
		</div>
	)
}
