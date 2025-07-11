'use client'
import React, { useState, useEffect, useCallback } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselSlide {
  id: string
  url: string
  title?: string
  description?: string
  ctaText?: string
  ctaLink?: string
}

const MyCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const carouselSlides: CarouselSlide[] = [
    {
      id: '1',
      url: '/iphone-1836071_1920.jpg',
      title: 'Amazing Deals',
      description: 'Discover incredible offers on your favorite products',
      ctaText: 'Shop Now',
      ctaLink: '/deals'
    },
    {
      id: '2',
      url: '/air-conditioner-62.jpg',
      title: 'New Arrivals',
      description: 'Check out the latest products just for you',
      ctaText: 'Explore',
      ctaLink: '/new-arrivals'
    },
    
    {
      id: '3',
      url: '/fashion.jpg',
      title: 'Fashion Week',
      description: 'Trendy fashion at unbeatable prices',
      ctaText: 'Shop Fashion',
      ctaLink: '/fashion'
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, isPaused, carouselSlides.length])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
  }, [carouselSlides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
  }, [carouselSlides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === ' ') {
        e.preventDefault()
        setIsAutoPlaying(!isAutoPlaying)
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, isAutoPlaying, isFullscreen])

  // Fullscreen functionality
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-64 md:h-80 lg:h-96 bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="relative w-full bg-gray-100 overflow-hidden">
        {/* Main Carousel Container */}
        <div
          className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image Container */}
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            {carouselSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-in-out",
                  index === currentSlide
                    ? "opacity-100 translate-x-0 scale-100"
                    : index < currentSlide
                    ? "opacity-0 -translate-x-full scale-95"
                    : "opacity-0 translate-x-full scale-95"
                )}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={slide.url}
                    alt={slide.title || `Slide ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
                  
                  {/* Content Overlay */}
                  {slide.title && (
                    <div className="absolute inset-0 flex items-center justify-center md:justify-start">
                      <div className="text-center hidden md:block md:text-left p-6 md:p-12 max-w-2xl">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">
                          {slide.title}
                        </h2>
                        {slide.description && (
                          <p className="text-sm md:text-lg text-white/90 mb-4 md:mb-6 drop-shadow-md">
                            {slide.description}
                          </p>
                        )}
                        
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>

          {/* Control Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {/* <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button> */}
            
            {/* <button
              onClick={toggleFullscreen}
              className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Toggle fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button> */}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / carouselSlides.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center items-center space-x-2 mt-4 pb-4">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-blue-600 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {currentSlide + 1} / {carouselSlides.length}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10"
            aria-label="Exit fullscreen"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-full">
            <Image
              src={carouselSlides[currentSlide].url}
              alt={carouselSlides[currentSlide].title || `Slide ${currentSlide + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full transition-all duration-300"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  )
}

export default MyCarousel