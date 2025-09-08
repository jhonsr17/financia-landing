'use client'

import { useEffect, useRef } from 'react'

// Importar GSAP solo en el cliente
let gsap: any
let ScrollTrigger: any

if (typeof window !== 'undefined') {
  gsap = require('gsap').gsap
  ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)
}

export interface ScrollRevealOptions {
  trigger?: string | Element
  start?: string
  end?: string
  toggleActions?: string
  once?: boolean
  delay?: number
  duration?: number
  ease?: string
  x?: number
  y?: number
  scale?: number
  opacity?: number
  rotation?: number
  stagger?: number
  markers?: boolean
}

export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!gsap || !ScrollTrigger || !elementRef.current) return

    const {
      trigger = elementRef.current,
      start = 'top 80%',
      end = 'bottom 20%',
      toggleActions = 'play none none reverse',
      once = true,
      delay = 0,
      duration = 0.8,
      ease = 'power2.out',
      x = 0,
      y = 50,
      scale = 1,
      opacity = 1,
      rotation = 0,
      stagger = 0,
      markers = false
    } = options

    // Configurar estado inicial
    gsap.set(elementRef.current, {
      opacity: 0,
      x: x,
      y: y,
      scale: scale,
      rotation: rotation
    })

    // Crear animación
    const animation = gsap.to(elementRef.current, {
      opacity: opacity,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: duration,
      ease: ease,
      delay: delay,
      stagger: stagger
    })

    // Crear ScrollTrigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: trigger,
      start: start,
      end: end,
      toggleActions: once ? 'play none none none' : toggleActions,
      animation: animation,
      markers: markers
    })

    // Cleanup
    return () => {
      scrollTrigger.kill()
    }
  }, [options])

  return elementRef
}

// Hook específico para animaciones de lista con stagger
export const useStaggerReveal = (options: ScrollRevealOptions = {}) => {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!gsap || !ScrollTrigger || !containerRef.current) return

    const {
      trigger = containerRef.current,
      start = 'top 80%',
      end = 'bottom 20%',
      toggleActions = 'play none none reverse',
      once = true,
      delay = 0,
      duration = 0.6,
      ease = 'power2.out',
      x = 0,
      y = 30,
      scale = 0.95,
      opacity = 1,
      stagger = 0.1,
      markers = false
    } = options

    const children = containerRef.current.children

    // Configurar estado inicial para todos los hijos
    gsap.set(children, {
      opacity: 0,
      x: x,
      y: y,
      scale: scale
    })

    // Crear animación con stagger
    const animation = gsap.to(children, {
      opacity: opacity,
      x: 0,
      y: 0,
      scale: 1,
      duration: duration,
      ease: ease,
      delay: delay,
      stagger: stagger
    })

    // Crear ScrollTrigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: trigger,
      start: start,
      end: end,
      toggleActions: once ? 'play none none none' : toggleActions,
      animation: animation,
      markers: markers
    })

    // Cleanup
    return () => {
      scrollTrigger.kill()
    }
  }, [options])

  return containerRef
}

// Hook para animaciones de texto tipo máquina de escribir
export const useTypewriterReveal = (options: ScrollRevealOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!gsap || !ScrollTrigger || !elementRef.current) return

    const {
      trigger = elementRef.current,
      start = 'top 80%',
      end = 'bottom 20%',
      toggleActions = 'play none none reverse',
      once = true,
      delay = 0,
      duration = 2,
      ease = 'none',
      markers = false
    } = options

    const text = elementRef.current.textContent || ''
    elementRef.current.textContent = ''

    // Crear animación de typewriter
    const animation = gsap.to(elementRef.current, {
      duration: duration,
      ease: ease,
      delay: delay,
      onUpdate: function() {
        const progress = this.progress()
        const currentLength = Math.floor(progress * text.length)
        elementRef.current!.textContent = text.substring(0, currentLength)
      }
    })

    // Crear ScrollTrigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: trigger,
      start: start,
      end: end,
      toggleActions: once ? 'play none none none' : toggleActions,
      animation: animation,
      markers: markers
    })

    // Cleanup
    return () => {
      scrollTrigger.kill()
    }
  }, [options])

  return elementRef
}
