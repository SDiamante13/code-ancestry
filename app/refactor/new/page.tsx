'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewRefactoring() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [captureMethod, setCaptureMethod] = useState<'camera' | 'upload' | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const supabase = createClient()
      
      // Upload screenshot to Supabase storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('screenshots')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('screenshots')
        .getPublicUrl(fileName)

      // Create refactoring record
      const { data: refactoring, error: dbError } = await supabase
        .from('refactorings')
        .insert({
          before_screenshot_url: publicUrl,
          is_complete: false
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Redirect to the refactoring page
      router.push(`/refactor/${refactoring.id}`)
    } catch (error) {
      console.error('Error uploading screenshot:', error)
      alert('Failed to upload screenshot. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleCameraCapture = () => {
    // For mobile devices, this will open the camera
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'
      fileInputRef.current.capture = 'environment'
      fileInputRef.current.click()
    }
  }

  const handleUploadClick = () => {
    // For desktop file upload
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'
      fileInputRef.current.removeAttribute('capture')
      fileInputRef.current.click()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => router.back()}
          className="mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-8">Capture Your Refactoring</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6">Step 1: Upload the "Before" Code</h2>
          
          {!captureMethod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setCaptureMethod('camera')
                  handleCameraCapture()
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg flex flex-col items-center gap-2"
                disabled={uploading}
              >
                <span className="text-4xl">📸</span>
                <span>Take Photo</span>
              </button>

              <button
                onClick={() => {
                  setCaptureMethod('upload')
                  handleUploadClick()
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg flex flex-col items-center gap-2"
                disabled={uploading}
              >
                <span className="text-4xl">📁</span>
                <span>Upload Screenshot</span>
              </button>
            </div>
          )}

          {uploading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Uploading your screenshot...</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}