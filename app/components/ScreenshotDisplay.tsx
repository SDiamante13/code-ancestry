'use client'

import { useState } from 'react'
import ImageLightbox from './ImageLightbox'

interface ScreenshotDisplayProps {
  beforeUrl: string
  afterUrl: string | null
  className?: string
  onAfterClick?: () => void
  uploading?: boolean
}

export default function ScreenshotDisplay({ 
  beforeUrl, 
  afterUrl, 
  className = "",
  onAfterClick,
  uploading = false
}: ScreenshotDisplayProps) {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null)

  return (
    <>
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${className}`}>
        {/* Before Screenshot */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-800">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                Before
              </span>
              <span className="text-white/80 text-sm">Original Code</span>
            </div>
            <div className="p-4">
              <img
                src={beforeUrl}
                alt="Before refactoring"
                className="w-full h-auto rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                onClick={() => setLightboxImage({ src: beforeUrl, title: 'Before' })}
              />
            </div>
          </div>
        </div>

        {/* After Screenshot */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-800">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                After
              </span>
              <span className="text-white/80 text-sm">Evolved Code</span>
            </div>
            <div className="p-4">
              {afterUrl ? (
                <img
                  src={afterUrl}
                  alt="After refactoring"
                  className="w-full h-auto rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                  onClick={() => setLightboxImage({ src: afterUrl, title: 'After' })}
                />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <p className="text-gray-400 mb-6">Complete the evolution</p>
                    {onAfterClick && (
                      <button
                        onClick={onAfterClick}
                        disabled={uploading}
                        className="group relative bg-gradient-to-r from-green-500 to-blue-500 px-8 py-4 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50"
                      >
                        {uploading ? (
                          <span className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Uploading...
                          </span>
                        ) : (
                          'Add After Screenshot'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageSrc={lightboxImage?.src || ''}
        title={lightboxImage?.title}
      />
    </>
  )
}