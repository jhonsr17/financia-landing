'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

interface RevealProps {
	children: ReactNode
	className?: string
	rootMargin?: string
	threshold?: number | number[]
	delayMs?: number
}

export function Reveal ({
	children,
	className,
	rootMargin = '0px 0px -10% 0px',
	threshold = 0.15,
	delayMs = 0
}: RevealProps) {
	const ref = useRef<HTMLDivElement | null>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		if (!ref.current) return

		const element = ref.current
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						setIsVisible(true)
						observer.unobserve(entry.target)
					}
				})
			},
			{ root: null, rootMargin, threshold }
		)

		observer.observe(element)
		return () => observer.disconnect()
	}, [rootMargin, threshold])

	const style: CSSProperties | undefined = delayMs ? { animationDelay: `${delayMs}ms` } : undefined

	return (
		<div
			ref={ref}
			style={style}
			className={[
				'will-change-transform',
				isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-6',
				className || ''
			].join(' ').trim()}
		>
			{children}
		</div>
	)
}


