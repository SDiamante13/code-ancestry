'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ImageLightbox from './ImageLightbox'

interface RefactoringCardProps {
  refactoring: {
    id: string
    created_at: string
    before_screenshot_url: string
    after_screenshot_url: string | null
    title: string | null
    language: string | null
    is_complete: boolean
  }
}

export default function RefactoringCard({ refactoring }: RefactoringCardProps) {
  const router = useRouter()
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null)

  return (
    <>
      <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="p-4">
          <button
            onClick={() => router.push(`/refactor/${refactoring.id}`)}
            className="block w-full text-left"
          >
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div 
                className="relative"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setLightboxImage({ src: refactoring.before_screenshot_url, title: 'Before' })
                }}
              >
                <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full z-10">Before</div>
                <img
                  src={refactoring.before_screenshot_url}
                  alt="Before"
                  className="w-full h-32 object-cover rounded-lg border border-gray-700 cursor-zoom-in hover:opacity-90 transition-opacity"
                />
              </div>
              {refactoring.after_screenshot_url && (
                <div 
                  className="relative"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setLightboxImage({ src: refactoring.after_screenshot_url!, title: 'After' })
                  }}
                >
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full z-10">After</div>
                  <img
                    src={refactoring.after_screenshot_url}
                    alt="After"
                    className="w-full h-32 object-cover rounded-lg border border-gray-700 cursor-zoom-in hover:opacity-90 transition-opacity"
                  />
                </div>
              )}
            </div>
          </button>

          <h3 className="font-semibold text-white mb-1">
            {refactoring.title || `Evolution #${refactoring.id.slice(0, 8)}`}
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              {new Date(refactoring.created_at).toLocaleDateString()}
            </p>
            {refactoring.language && (
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                {refactoring.language}
              </span>
            )}
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