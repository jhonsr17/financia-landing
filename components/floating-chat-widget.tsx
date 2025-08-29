'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatMessage } from '@/components/ChatMessage'

const PREVIEW_MESSAGES = [
	{ message: 'Hola Memorae, recuérdame mañana por la mañana(8:00) que tengo que hacer meditación.🧘‍♂️', isBot: false },
	{ message: 'He creado tu recordatorio para mañana a las 8:00 para hacer meditación. ¡No olvides dedicar ese momento a cuidarte!🌟', isBot: true },
	{ message: 'El día 14 de Agosto es el cumpleaños de mi amigo Luis, recuérdamelo anualmente por favor', isBot: false },
	{ message: 'He creado un recordatorio recurrente para el cumpleaños de tu amigo Luis el 14 de agosto a las 08:00. Cada año recibirás este aviso para recordarte esta fecha tan especial.', isBot: true }
]

export default function FloatingChatWidget () {
	const [isHalfScrolled, setIsHalfScrolled] = useState(false)
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
		if (!isHalfScrolled) return
		let mounted = true
		let i = 1
		const tick = () => {
			if (!mounted) return
			setMessagesVisible(v => Math.min(PREVIEW_MESSAGES.length, v + 1))
			i++
			if (i <= PREVIEW_MESSAGES.length) {
				setTimeout(tick, 2000)
			}
		}
		setMessagesVisible(1)
		setTimeout(tick, 800)
		return () => { mounted = false }
	}, [isHalfScrolled])

	if (!isHalfScrolled) return null

	return (
		<div
			ref={containerRef}
			aria-label='Chat Memorae'
			className='fixed inset-0 pointer-events-none z-40 flex items-center justify-center'
		>
			<div 
				className='pointer-events-auto w-[340px] bg-[#f6f6f6] rounded-[32px] shadow-2xl border-8 border-black overflow-hidden'
				style={{ height: '600px' }}
			>
				{/* iPhone Notch */}
				<div className='bg-black h-6 w-full relative'>
					<div className='absolute left-1/2 -translate-x-1/2 top-0 w-36 h-6 bg-black rounded-b-2xl flex items-center justify-center'>
						<div className='w-16 h-4 bg-[#1a1a1a] rounded-full'></div>
					</div>
				</div>
				
				{/* Status Bar */}
				<div className='bg-[#f6f6f6] px-5 py-2 flex items-center justify-between text-xs'>
					<span>9:41</span>
					<div className='flex items-center gap-1'>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
							<path fillRule="evenodd" d="M1.371 8.143c5.858-5.857 15.356-5.857 21.213 0a.75.75 0 0 1 0 1.061l-.53.53a.75.75 0 0 1-1.06 0c-4.98-4.979-13.053-4.979-18.032 0a.75.75 0 0 1-1.06 0l-.53-.53a.75.75 0 0 1 0-1.06Zm3.182 3.182c4.1-4.1 10.749-4.1 14.85 0a.75.75 0 0 1 0 1.061l-.53.53a.75.75 0 0 1-1.062 0 8.25 8.25 0 0 0-11.667 0 .75.75 0 0 1-1.06 0l-.53-.53a.75.75 0 0 1 0-1.06Zm3.204 3.182a6 6 0 0 1 8.486 0 .75.75 0 0 1 0 1.061l-.53.53a.75.75 0 0 1-1.061 0 3.75 3.75 0 0 0-5.304 0 .75.75 0 0 1-1.06 0l-.53-.53a.75.75 0 0 1 0-1.06Zm3.182 3.182a1.5 1.5 0 0 1 2.122 0 .75.75 0 0 1 0 1.061l-.53.53a.75.75 0 0 1-1.061 0 .75.75 0 0 1 0-1.06l-.53-.53Z" clipRule="evenodd" />
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
							<path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
							<path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
							<path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
							<path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384c1.888 1.023 4.394 1.609 7.078 1.609Z" />
						</svg>
						<div className='w-6 h-3 bg-black rounded-sm relative overflow-hidden'>
							<div className='absolute inset-0.5 bg-white rounded-sm' style={{ width: '60%' }}></div>
						</div>
					</div>
				</div>
				
				{/* Chat Header */}
				<header className='px-4 py-2 flex items-center gap-3 border-b border-black/10'>
					<button className='text-blue-500'>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
							<path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
						</svg>
					</button>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 rounded-full bg-[#0084ff] flex items-center justify-center text-white font-medium'>M</div>
						<div>
							<p className='text-[15px] font-medium'>Memorae</p>
						</div>
					</div>
					<div className='flex items-center gap-4 ml-auto'>
						<button className='text-blue-500'>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
								<path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
							</svg>
						</button>
						<button className='text-blue-500'>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
								<path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
							</svg>
						</button>
					</div>
				</header>

				{/* Chat Messages */}
				<div className='h-[calc(100%-110px)] overflow-y-auto p-4 space-y-3 bg-[#efeae2]'>
					{PREVIEW_MESSAGES.slice(0, messagesVisible).map((m, idx) => (
						<ChatMessage key={idx} message={m.message} isBot={m.isBot} delay={0} />
					))}
				</div>
			</div>
		</div>
	)
}