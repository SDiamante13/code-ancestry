'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'
import ScreenshotDisplay from '@/src/app/components/ScreenshotDisplay'
import ReactionButtons from '@/src/app/components/ReactionButtons'
import RefactoringDetailsForm from '@/src/app/components/RefactoringDetailsForm'
import { analytics, usePageView, useUserIdentification } from '@/src/lib/analytics'
import { generateFileName, extractErrorMessage } from '@/src/lib/utils/fileUtils'
import { fetchRandomEvolution } from '@/src/lib/utils/evolution'
import LoadingSpinner from '@/src/app/components/LoadingSpinner'

interface Refactoring {
  id: string
  before_screenshot_url: string
  during_screenshot_url: string | null
  after_screenshot_url: string | null
  title: string | null
  description: string | null
  language: string | null
  is_complete: boolean
  author_id: string | null
  created_at: string
  author_username?: string
}


export default function RefactoringPage() {
  const { id } = useParams()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const duringInputRef = useRef<HTMLInputElement>(null)
  const beforeInputRef = useRef<HTMLInputElement>(null)
  const [refactoring, setRefactoring] = useState<Refactoring | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadingDuring, setUploadingDuring] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  usePageView('evolution_detail', {
    evolution_id: id as string,
    has_during: !!refactoring?.during_screenshot_url,
    has_after: !!refactoring?.after_screenshot_url,
    is_complete: refactoring?.is_complete
  })

  useUserIdentification(currentUser?.id, {
    email: currentUser?.email,
    created_at: currentUser?.created_at
  })

  useEffect(() => {
    fetchRefactoringAndUser()
  }, [id])

  const fetchRefactoringAndUser = async () => {
    try {
      const supabase = createClient()
      
      // Fetch current user
      const { data: { user } } = await supabase.auth.getUser()
      
      // Fetch refactoring
      const { data, error } = await supabase
        .from('refactorings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      // Transform the data to include author_username
      const refactoringWithUsername = {
        ...data,
        author_username: null
      }
      setRefactoring(refactoringWithUsername)
      setCurrentUser(user)
      
      // Check if current user is the owner
      if (user && data.author_id) {
        setIsOwner(user.id === data.author_id)
      }
    } catch (error) {
      console.error('Error fetching refactoring:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleBeforeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !refactoring || !isOwner) return

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

      const { error: dbError } = await supabase
        .from('refactorings')
        .update({
          before_screenshot_url: publicUrl
        })
        .eq('id', refactoring.id)

      if (dbError) throw dbError

      analytics.trackImageReplacement('before', refactoring.id)
      await fetchRefactoringAndUser()
    } catch (error) {
      console.error('Error uploading before screenshot:', error)
      const errorMessage = extractErrorMessage(error)
      analytics.trackError(`Before upload failed: ${errorMessage}`, { evolution_id: refactoring.id })
      alert(`Failed to upload before screenshot: ${errorMessage}. Please try again.`)
    } finally {
      setUploading(false)
    }
  }

  const handleDuringUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !refactoring || !isOwner) return

    setUploadingDuring(true)
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

      const { error: dbError } = await supabase
        .from('refactorings')
        .update({
          during_screenshot_url: publicUrl
        })
        .eq('id', refactoring.id)

      if (dbError) throw dbError

      analytics.trackEvolutionCreate('during', { evolution_id: refactoring.id })
      await fetchRefactoringAndUser()
    } catch (error) {
      console.error('Error uploading during screenshot:', error)
      const errorMessage = extractErrorMessage(error)
      analytics.trackError(`During upload failed: ${errorMessage}`, { evolution_id: refactoring.id })
      alert(`Failed to upload during screenshot: ${errorMessage}. Please try again.`)
    } finally {
      setUploadingDuring(false)
    }
  }

  const handleAfterUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !refactoring || !isOwner) return

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

      const { error: dbError } = await supabase
        .from('refactorings')
        .update({
          after_screenshot_url: publicUrl,
          is_complete: true
        })
        .eq('id', refactoring.id)

      if (dbError) throw dbError

      analytics.trackEvolutionCreate('after', { evolution_id: refactoring.id })
      analytics.trackEvolutionComplete(refactoring.id, { 
        language: refactoring.language,
        has_during: !!refactoring.during_screenshot_url 
      })
      await fetchRefactoringAndUser()
    } catch (error) {
      console.error('Error uploading after screenshot:', error)
      const errorMessage = extractErrorMessage(error)
      analytics.trackError(`After upload failed: ${errorMessage}`, { evolution_id: refactoring.id })
      alert(`Failed to upload after screenshot: ${errorMessage}. Please try again.`)
    } finally {
      setUploading(false)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    analytics.trackUserEngagement('share', { 
      evolution_id: refactoring?.id,
      url: url 
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRandomEvolution = async () => {
    const evolutionId = await fetchRandomEvolution()
    if (evolutionId) {
      router.push(`/refactor/${evolutionId}`)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!refactoring) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Refactoring not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Home
            </button>
            
            <button
              onClick={handleRandomEvolution}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-500/50 transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-lg">🎲</span>
              Random
            </button>
          </div>

          {refactoring.is_complete && (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Share:</span>
              <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2">
                <span className="text-gray-300 text-sm font-mono">
                  {typeof window !== 'undefined' ? window.location.href : ''}
                </span>
                <button
                  onClick={handleShare}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  title="Copy link"
                >
                  {copied ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              {refactoring.title || 'Code Evolution #' + refactoring.id.slice(0, 8)}
            </span>
          </h1>
          {refactoring.language && (
            <span className="inline-block mt-2 text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
              {refactoring.language}
            </span>
          )}
          {refactoring.description && (
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-4">
              {refactoring.description}
            </p>
          )}
        </div>

        <ScreenshotDisplay
          beforeUrl={refactoring.before_screenshot_url}
          duringUrl={refactoring.during_screenshot_url}
          afterUrl={refactoring.after_screenshot_url}
          onBeforeClick={isOwner ? () => beforeInputRef.current?.click() : undefined}
          onDuringClick={isOwner ? () => duringInputRef.current?.click() : undefined}
          onAfterClick={isOwner ? () => fileInputRef.current?.click() : undefined}
          uploading={uploading}
          uploadingDuring={uploadingDuring}
        />

        {/* Details Form */}
        {refactoring.is_complete && (!refactoring.language || !refactoring.title) && isOwner && (
          <div className="mt-8">
            <RefactoringDetailsForm
              refactoringId={refactoring.id}
              onSuccess={fetchRefactoringAndUser}
            />
          </div>
        )}

        {refactoring.is_complete && (
          <>
            {/* Reactions */}
            <div className="mt-8 flex justify-center">
              <ReactionButtons refactoringId={refactoring.id} />
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl border border-purple-500/20">
              <div className="text-center">
                {isOwner ? (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-4">Evolution Complete</h3>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                      This refactoring is now part of the collective wisdom. Through MCP, AI assistants
                      worldwide can learn from this transformation and apply similar patterns to help
                      developers everywhere.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2">Evolved by</h3>
                    <p className="text-purple-400 text-lg mb-2">
                      {refactoring.author_username || (refactoring.author_id ? 'A Fellow Developer' : 'Anonymous')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(refactoring.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAfterUpload}
          className="hidden"
        />
        <input
          ref={duringInputRef}
          type="file"
          accept="image/*"
          onChange={handleDuringUpload}
          className="hidden"
        />
        <input
          ref={beforeInputRef}
          type="file"
          accept="image/*"
          onChange={handleBeforeUpload}
          className="hidden"
        />
      </div>

    </div>
  )
}
