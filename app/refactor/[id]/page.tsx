'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageLightbox from '@/app/components/ImageLightbox'

interface Refactoring {
  id: string
  before_screenshot_url: string
  after_screenshot_url: string | null
  title: string | null
  description: string | null
  is_complete: boolean
}

interface ReactionCounts {
  fire_count: number
  lightbulb_count: number
  thinking_count: number
}

const COMMON_LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML/CSS'
].sort()

export default function RefactoringPage() {
  const { id } = useParams()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [refactoring, setRefactoring] = useState<Refactoring | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reactions, setReactions] = useState<ReactionCounts>({ fire_count: 0, lightbulb_count: 0, thinking_count: 0 })
  const [userReactions, setUserReactions] = useState<string[]>([])
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  useEffect(() => {
    fetchRefactoring()
    fetchReactions()
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

  const fetchReactions = async () => {
    try {
      const supabase = createClient()
      
      // Get reaction counts
      const { data: counts, error: countsError } = await supabase
        .from('reaction_counts')
        .select('*')
        .eq('refactoring_id', id)
        .single()

      if (!countsError && counts) {
        setReactions(counts)
      }

      // Get user's reactions (using session ID for anonymous users)
      const sessionId = localStorage.getItem('session_id') || generateSessionId()
      localStorage.setItem('session_id', sessionId)

      const { data: userReactionData, error: userError } = await supabase
        .from('reactions')
        .select('reaction_type')
        .eq('refactoring_id', id)
        .eq('user_id', sessionId)

      if (!userError && userReactionData) {
        setUserReactions(userReactionData.map(r => r.reaction_type))
      }
    } catch (error) {
      console.error('Error fetching reactions:', error)
    }
  }

  const generateSessionId = () => {
    return 'anon_' + Math.random().toString(36).substr(2, 9)
  }

  const handleReaction = async (reactionType: string) => {
    try {
      const supabase = createClient()
      const sessionId = localStorage.getItem('session_id') || generateSessionId()
      localStorage.setItem('session_id', sessionId)

      if (userReactions.includes(reactionType)) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('refactoring_id', id)
          .eq('user_id', sessionId)
          .eq('reaction_type', reactionType)

        setUserReactions(prev => prev.filter(r => r !== reactionType))
        setReactions(prev => ({
          ...prev,
          [`${reactionType}_count`]: Math.max(0, prev[`${reactionType}_count` as keyof ReactionCounts] - 1)
        }))
      } else {
        // Add reaction
        await supabase
          .from('reactions')
          .insert({
            refactoring_id: id,
            user_id: sessionId,
            reaction_type: reactionType
          })

        setUserReactions(prev => [...prev, reactionType])
        setReactions(prev => ({
          ...prev,
          [`${reactionType}_count`]: prev[`${reactionType}_count` as keyof ReactionCounts] + 1
        }))
      }
    } catch (error) {
      console.error('Error handling reaction:', error)
    }
  }

  const handleAfterUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !refactoring) return

    setUploading(true)
    try {
      const supabase = createClient()
      
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`
      const { data: uploadData, error: uploadError } = await supabase.storage
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
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUpdateDetails = async () => {
    if (!refactoring) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('refactorings')
        .update({
          language: selectedLanguage || null,
          title: title || null,
          description: description || null
        })
        .eq('id', refactoring.id)

      if (error) throw error
      
      await fetchRefactoring()
    } catch (error) {
      console.error('Error updating refactoring:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin" />
          <div className="absolute inset-1 bg-black rounded-full" />
        </div>
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
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Home
          </button>
          
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                {refactoring.before_screenshot_url && (
                  <img
                    src={refactoring.before_screenshot_url}
                    alt="Before refactoring"
                    className="w-full h-auto rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                    onClick={() => setLightboxImage({ src: refactoring.before_screenshot_url, title: 'Before' })}
                  />
                )}
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
                {refactoring.after_screenshot_url ? (
                  <img
                    src={refactoring.after_screenshot_url}
                    alt="After refactoring"
                    className="w-full h-auto rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                    onClick={() => setLightboxImage({ src: refactoring.after_screenshot_url!, title: 'After' })}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-center">
                      <p className="text-gray-400 mb-6">Complete the evolution</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative bg-gradient-to-r from-green-500 to-blue-500 px-8 py-4 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                        disabled={uploading}
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Form */}
        {refactoring.is_complete && (!refactoring.language || !refactoring.title) && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 rounded-2xl border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Add Details (Optional)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Programming Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select a language...</option>
                  {COMMON_LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Extract Method Refactoring"
                  className="w-full bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you refactor and why?"
                  rows={3}
                  className="w-full bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>
              
              <button
                onClick={handleUpdateDetails}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Save Details
              </button>
            </div>
          </div>
        )}

        {refactoring.is_complete && (
          <>
            {/* Reactions */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full px-8 py-4">
                <button
                  onClick={() => handleReaction('fire')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    userReactions.includes('fire')
                      ? 'bg-orange-500/20 border border-orange-500/50 text-orange-300'
                      : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-orange-300 hover:border-orange-500/30'
                  }`}
                >
                  <span className="text-2xl">🔥</span>
                  <span className="font-semibold">{reactions.fire_count || 0}</span>
                </button>

                <button
                  onClick={() => handleReaction('lightbulb')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    userReactions.includes('lightbulb')
                      ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'
                      : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-yellow-300 hover:border-yellow-500/30'
                  }`}
                >
                  <span className="text-2xl">💡</span>
                  <span className="font-semibold">{reactions.lightbulb_count || 0}</span>
                </button>

                <button
                  onClick={() => handleReaction('thinking')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    userReactions.includes('thinking')
                      ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                      : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-blue-300 hover:border-blue-500/30'
                  }`}
                >
                  <span className="text-2xl">🤔</span>
                  <span className="font-semibold">{reactions.thinking_count || 0}</span>
                </button>
              </div>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl border border-purple-500/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Evolution Complete</h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  This refactoring is now part of the collective wisdom. Through MCP, AI assistants 
                  worldwide can learn from this transformation and apply similar patterns to help 
                  developers everywhere.
                </p>
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
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageSrc={lightboxImage?.src || ''}
        title={lightboxImage?.title}
      />
    </div>
  )
}