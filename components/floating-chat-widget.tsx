'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatMessage } from '@/components/ChatMessage'

const PREVIEW_MESSAGES = [
	{ message: 'Hola 👋 ¿cómo te ayudo con tus finanzas hoy?', isBot: true },
	{ message: 'Quiero registrar un gasto de $20.000 en comida', isBot: false },
	{ message: 'Listo ✅ queda guardado en Comida 🍔', isBot: true }
]

export default function FloatingChatWidget () {
	const [isHalfScrolled, setIsHalfScrolled] = useState(false)
	const [isMinimized, setIsMinimized] = useState(false)
	const [messagesVisible, setMessagesVisible] = useState(1)
	const containerRef = useRef<HTMLDivElement | null>(null)

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
		if (!isHalfScrolled || isMinimized) return
		let mounted = true
		let i = 1
		const tick = () => {
			if (!mounted) return
			setMessagesVisible(v => Math.min(PREVIEW_MESSAGES.length, v + 1))
			i++
			if (i <= PREVIEW_MESSAGES.length) {
				setTimeout(tick, 1000)
			}
		}
		setMessagesVisible(1)
		setTimeout(tick, 800)
		return () => { mounted = false }
	}, [isHalfScrolled, isMinimized])

	if (!isHalfScrolled) return null

	return (
		<div
			ref={containerRef}
			aria-label='Chat FinancIA'
			className='fixed inset-0 pointer-events-none z-40 flex items-center justify-center'
		>
			<div className='pointer-events-auto w-[92%] max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-black/5'>
				<header className='px-4 py-3 border-b border-black/10 flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 rounded-full bg-[#9DFAD7] text-[#0D1D35] flex items-center justify-center font-bold'>F</div>
						<div>
							<p className='text-sm font-medium text-[#0D1D35]'>FinancIA</p>
							<p className='text-xs text-[#0D1D35]/60'>Asistente en línea</p>
						</div>
					</div>
					<button
						aria-label={isMinimized ? 'Abrir chat' : 'Minimizar chat'}
						onClick={() => setIsMinimized(v => !v)}
						className='rounded-md px-2 py-1 text-sm bg-[#0D1D35] text-white hover:opacity-90 transition'
					>
						{isMinimized ? 'Abrir' : 'Minimizar'}
					</button>
				</header>

				{!isMinimized && (
					<div className='max-h-[55vh] overflow-y-auto p-4 space-y-3'>
						{PREVIEW_MESSAGES.slice(0, messagesVisible).map((m, idx) => (
							<ChatMessage key={idx} message={m.message} isBot={m.isBot} delay={0} />
						))}
						<div className='flex gap-2 pt-1'>
							<input
								aria-label='Escribe tu mensaje'
								className='flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9DFAD7]'
								placeholder='Escribe un mensaje...'
							/>
							<button className='rounded-lg bg-[#0D1D35] text-white text-sm px-3 py-2 hover:opacity-90'>Enviar</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}


