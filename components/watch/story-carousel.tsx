'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Volume2, VolumeX, Share2 } from 'lucide-react'

interface CarouselItem {
  id: string
  title: string
  description?: string
  duration: number
  thumbnail?: string
  type: 'video' | 'image'
}

interface StoryCarouselProps {
  items: CarouselItem[]
  onClose?: () => void
  autoPlay?: boolean
}

export function StoryCarousel({ items, onClose, autoPlay = true }: StoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const current = items[currentIndex]

  useEffect(() => {
    if (!autoPlay || isPaused || !current) return

    const duration = current.duration || 5
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration * 10))
        if (newProgress >= 100) {
          nextSlide()
          return 0
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentIndex, autoPlay, isPaused, current])

  const nextSlide = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
    } else {
      onClose?.()
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setProgress(0)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      {/* Content */}
      <div className="relative w-full h-full max-w-md max-h-screen md:max-h-screen aspect-video flex flex-col items-center justify-center overflow-hidden rounded-2xl">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-4">
          {items.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%' }}
              ></div>
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <X size={24} className="text-white" />
        </button>

        {/* Content */}
        <div
          className="relative w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center cursor-pointer"
          onClick={() => setIsPaused(!isPaused)}
        >
          {current.thumbnail && (
            <img
              src={current.thumbnail}
              alt={current.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Content overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Text content */}
          <div className="relative z-10 text-center text-white max-w-sm px-6">
            <h2 className="text-3xl font-bold mb-2">{current.title}</h2>
            {current.description && (
              <p className="text-white/80 text-sm">{current.description}</p>
            )}
          </div>

          {/* Play indicator */}
          {isPaused && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent px-6 py-6 flex items-center justify-between">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            {isMuted ? (
              <VolumeX size={20} className="text-white" />
            ) : (
              <Volume2 size={20} className="text-white" />
            )}
          </button>

          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span>{currentIndex + 1}</span>
            <span>/</span>
            <span>{items.length}</span>
          </div>

          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            <Share2 size={20} className="text-white" />
          </button>
        </div>

        {/* Navigation buttons */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
        )}

        {currentIndex < items.length - 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
