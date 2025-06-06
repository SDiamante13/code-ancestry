'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Refactoring {
  id: string
  before_screenshot_url: string
  after_screenshot_url: string | null
  title: string | null
  description: string | null
  is_complete: boolean
}

export default function RefactoringPage() {
  const { id } = useParams()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [refactoring, setRefactoring] = useState<Refactoring | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchRefactoring()
  }, [id])

  const fetchRefactoring = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('refactorings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setRefactoring(data)
    } catch (error) {
      console.error('Error fetching refactoring:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAfterUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !refactoring) return

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

      // Update refactoring record
      const { error: dbError } = await supabase
        .from('refactorings')
        .update({
          after_screenshot_url: publicUrl,
          is_complete: true
        })
        .eq('id', refactoring.id)

      if (dbError) throw dbError

      // Refresh the data
      await fetchRefactoring()
    } catch (error) {
      console.error('Error uploading screenshot:', error)
      alert('Failed to upload screenshot. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!refactoring) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Refactoring not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Home
          </button>
          
          {refactoring.is_complete && (
            <button
              onClick={handleShare}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Share Link 🔗
            </button>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-8">
          {refactoring.title || 'Code Refactoring'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Before Screenshot */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-500 text-white px-4 py-2 font-semibold">
              Before
            </div>
            <div className="p-4">
              {refactoring.before_screenshot_url && (
                <img
                  src={refactoring.before_screenshot_url}
                  alt="Before refactoring"
                  className="w-full h-auto rounded"
                />
              )}
            </div>
          </div>

          {/* After Screenshot */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-500 text-white px-4 py-2 font-semibold">
              After
            </div>
            <div className="p-4">
              {refactoring.after_screenshot_url ? (
                <img
                  src={refactoring.after_screenshot_url}
                  alt="After refactoring"
                  className="w-full h-auto rounded"
                />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  <p className="text-gray-500 mb-4">Upload the "after" screenshot</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Add After Screenshot'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAfterUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}