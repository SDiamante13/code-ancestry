'use client'

import { useEffect, useCallback } from 'react'
import { analytics } from '@/src/lib/analytics'

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  title?: string
}

export default function ImageLightbox({ isOpen, onClose, imageSrc, title }: ImageLightboxProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      analytics.trackFeatureUsage('lightbox', 'open', { title })
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown, title])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-[95vw] max-h-[95vh]">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {title && (
          <div className="absolute -top-12 left-0 text-white text-lg font-semibold">
            {title}
          </div>
        )}

        <img
          src={imageSrc}
          alt={title || 'Full size image'}
          className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm bg-black/50 px-3 py-1 rounded-full">
          Click outside or press ESC to close
        </div>
      </div>
    </div>
  )
}