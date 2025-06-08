'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'
import { generateFileName, extractErrorMessage } from '@/src/lib/utils/fileUtils'
import { analytics, usePageView } from '@/src/lib/analytics'

export default function NewRefactoring() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [captureMethod, setCaptureMethod] = useState<'camera' | 'upload' | null>(null)

  usePageView('new_evolution')

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const supabase = createClient()

      const fileName = generateFileName(file.name)
      const { error: uploadError } = await supabase.storage
        .from('screenshots')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('screenshots')
        .getPublicUrl(fileName)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      const { data: refactoring, error: dbError } = await supabase
        .from('refactorings')
        .insert({
          before_screenshot_url: publicUrl,
          is_complete: false,
          author_id: user?.id || null
        })
        .select()
        .single()

      if (dbError) throw dbError

      analytics.trackEvolutionCreate('before', { 
        evolution_id: refactoring.id,
        capture_method: captureMethod 
      })
      router.push(`/refactor/${refactoring.id}`)
    } catch (error) {
      console.error('Error uploading screenshot:', error)
      const errorMessage = extractErrorMessage(error)
      alert(`Failed to upload screenshot: ${errorMessage}. Please try again.`)
    } finally {
      setUploading(false)
    }
  }

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'
      fileInputRef.current.capture = 'environment'
      fileInputRef.current.click()
    }
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'
      fileInputRef.current.removeAttribute('capture')
      fileInputRef.current.click()
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Capture Your Evolution
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Document the transformation. Share the wisdom.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl" />

          <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse" />
              <h2 className="text-2xl font-semibold text-white">Step 1: Before Code</h2>
            </div>

            {!captureMethod && !uploading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => {
                    analytics.trackFeatureUsage('upload', 'camera_capture')
                    setCaptureMethod('camera')
                    handleCameraCapture()
                  }}
                  className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                >
                  <div className="relative z-10">
                    <span className="text-5xl mb-4 block">📸</span>
                    <span className="text-xl font-semibold text-white">Take Photo</span>
                    <p className="text-gray-400 text-sm mt-2">Perfect for mobile</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button
                  onClick={() => {
                    analytics.trackFeatureUsage('upload', 'file_upload')
                    setCaptureMethod('upload')
                    handleUploadClick()
                  }}
                  className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
                >
                  <div className="relative z-10">
                    <span className="text-5xl mb-4 block">📁</span>
                    <span className="text-xl font-semibold text-white">Upload Screenshot</span>
                    <p className="text-gray-400 text-sm mt-2">From your device</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            )}

            {uploading && (
              <div className="text-center py-12">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin" />
                  <div className="absolute inset-1 bg-gray-900 rounded-full" />
                  <div className="absolute inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
                </div>
                <p className="mt-6 text-gray-300 text-lg">Uploading to the evolutionary archive...</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl border border-purple-500/20">
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="font-semibold text-purple-400">AI Tip:</span> When connected via MCP,
                AI assistants can automatically capture and share refactorings as they happen,
                creating a real-time stream of code evolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
