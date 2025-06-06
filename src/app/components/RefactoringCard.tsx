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
    after_screenshot_url: string | null
    title: string | null
    language: string | null
    is_complete: boolean
  }
}

function StartRefactoringButton(props: {
  onClick: () => void,
  onClick1: (e: React.MouseEvent) => void,
  src: string,
  afterScreenshotUrl: string | null,
  onClick2: (e: React.MouseEvent) => void
}) {
  return <button
    onClick={props.onClick}
    className="block w-full text-left"
  >
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div
        className="relative"
        onClick={props.onClick1}
      >
        <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full z-10">Before</div>
        <img
          src={props.src}
          alt="Before"
          className="w-full h-32 object-cover rounded-lg border border-gray-700 cursor-zoom-in hover:opacity-90 transition-opacity"
        />
      </div>
      {props.afterScreenshotUrl && (
        <div
          className="relative"
          onClick={props.onClick2}
        >
          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full z-10">After
          </div>
          <img
            src={props.afterScreenshotUrl}
            alt="After"
            className="w-full h-32 object-cover rounded-lg border border-gray-700 cursor-zoom-in hover:opacity-90 transition-opacity"
          />
        </div>
      )}
    </div>
  </button>;
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-sm px-3 py-1 rounded-full z-10">Before</div>
                <img
                  src={refactoring.before_screenshot_url}
                  alt="Before"
                  className="w-full h-auto rounded-lg border border-gray-700 cursor-zoom-in hover:opacity-90 transition-opacity"
                  onClick={() => setLightboxImage({ src: refactoring.before_screenshot_url, title: 'Before' })}
                />
              </div>
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
                  onClick={() => router.push(`/refactor/${refactoring.id}`)}
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
          <StartRefactoringButton onClick={() => {
            analytics.trackEvolutionView(refactoring.id, {
              source: 'card_click',
              has_after: !!refactoring.after_screenshot_url,
              language: refactoring.language
            })
            router.push(`/refactor/${refactoring.id}`)
          }} onClick1={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setLightboxImage({ src: refactoring.before_screenshot_url, title: 'Before' })
          }} src={refactoring.before_screenshot_url} afterScreenshotUrl={refactoring.after_screenshot_url}
                                  onClick2={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setLightboxImage({ src: refactoring.after_screenshot_url!, title: 'After' })
                                  }}/>

          <h3 className="font-semibold text-white mb-1">
            {refactoring.title || `Evolution #${refactoring.id.slice(0, 8)}`}
          </h3>

          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              {new Date(refactoring.created_at).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-2">
              {refactoring.language && (
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                  {refactoring.language}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  analytics.trackFocusMode(refactoring.id, 'open')
                  setIsFocused(true)
                }}
                className="text-gray-400 hover:text-purple-300 transition-colors p-1"
                title="Focus view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </button>
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
