'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ImageLightbox from './ImageLightbox'
import { analytics } from '@/src/lib/analytics'

interface RefactoringCardProps {
  refactoring: {
    id: string
    created_at: string
    before_screenshot_url: string
    during_screenshot_url: string | null
    after_screenshot_url: string | null
    title: string | null
    language: string | null
    is_complete: boolean
  }
}


export default function RefactoringCard({ refactoring }: RefactoringCardProps) {
  const router = useRouter()
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <>
      {isFocused && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsFocused(false)}
        >
          <div
            className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                analytics.trackFocusMode(refactoring.id, 'close')
                setIsFocused(false)
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-semibold text-white mb-4 text-xl pr-12">
              {refactoring.title || `Evolution #${refactoring.id.slice(0, 8)}`}
            </h3>

            <div className={`grid grid-cols-1 ${refactoring.during_screenshot_url ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 mb-6`}>
              <div className="relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-sm px-3 py-1 rounded-full z-10">Before</div>
                <img
                  src={refactoring.before_screenshot_url}
                  alt="Before"
                  className="w-full h-auto rounded-lg border border-gray-700 cursor-zoom-in hover:opacity-90 transition-opacity"
                  onClick={() => setLightboxImage({ src: refactoring.before_screenshot_url, title: 'Before' })}
                />
              </div>
              {refactoring.during_screenshot_url && (
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-sm px-3 py-1 rounded-full z-10">During</div>
                  <img
                    src={refactoring.during_screenshot_url}
                    alt="During"
                    className="w-full h-auto rounded-lg border border-gray-700 cursor-zoom-in hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage({ src: refactoring.during_screenshot_url!, title: 'During' })}
                  />
                </div>
              )}
              {refactoring.after_screenshot_url && (
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-sm px-3 py-1 rounded-full z-10">After</div>
                  <img
                    src={refactoring.after_screenshot_url}
                    alt="After"
                    className="w-full h-auto rounded-lg border border-gray-700 cursor-zoom-in hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage({ src: refactoring.after_screenshot_url!, title: 'After' })}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-400">
                {new Date(refactoring.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2">
                {refactoring.language && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                    {refactoring.language}
                  </span>
                )}
                <button
                  onClick={() => {
                    analytics.trackUserEngagement('click', { 
                      action: 'view_details',
                      evolution_id: refactoring.id 
                    })
                    router.push(`/refactor/${refactoring.id}`)
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

        <div className="p-4">
          <div 
            onClick={() => {
              analytics.trackFocusMode(refactoring.id, 'open')
              setIsFocused(true)
            }}
            className="cursor-pointer"
          >
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="relative">
                <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full z-10">Before</div>
                <img
                  src={refactoring.before_screenshot_url}
                  alt="Before"
                  className="w-full h-32 object-cover rounded-lg border border-gray-700 hover:opacity-90 transition-opacity"
                />
              </div>
              {refactoring.after_screenshot_url && (
                <div className="relative">
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full z-10">After</div>
                  <img
                    src={refactoring.after_screenshot_url}
                    alt="After"
                    className="w-full h-32 object-cover rounded-lg border border-gray-700 hover:opacity-90 transition-opacity"
                  />
                </div>
              )}
            </div>
          </div>

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
