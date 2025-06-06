'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AuthButton from '@/app/components/AuthButton'
import RefactoringCard from '@/app/components/RefactoringCard'
import { analytics, usePageView } from '@/lib/analytics'

interface Refactoring {
  id: string
  created_at: string
  before_screenshot_url: string
  during_screenshot_url: string | null
  after_screenshot_url: string | null
  title: string | null
  description: string | null
  language: string | null
  is_complete: boolean
}

export default function Home() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [refactorings, setRefactorings] = useState<Refactoring[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [filterLanguage, setFilterLanguage] = useState<string>('all')
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [userStats, setUserStats] = useState({
    evolutionsShared: 0,
    reactionsReceived: 0,
    totalViews: 0
  })

  usePageView('home', { 
    total_evolutions: refactorings.length,
    filter_language: filterLanguage,
    sort_by: sortBy 
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    fetchUser()
    fetchRefactorings()
  }, [sortBy, filterLanguage])

  useEffect(() => {
    fetchAvailableLanguages()
  }, [])

  const fetchUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      console.log('User fetched:', user?.id)
      setUser(user)
      
      if (user) {
        console.log('Fetching stats for user:', user.id)
        await fetchUserStats(user.id)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const fetchUserStats = async (userId: string) => {
    try {
      const supabase = createClient()
      
      // Get user's refactorings count
      const { data: refactorings, error: refactoringsError } = await supabase
        .from('refactorings')
        .select('id')
        .eq('author_id', userId)
        .eq('is_complete', true)

      if (refactoringsError) {
        console.error('Error fetching refactorings:', refactoringsError)
        throw refactoringsError
      }

      // Get total reactions received on user's refactorings
      const { data: reactions, error: reactionsError } = await supabase
        .from('reactions')
        .select('refactoring_id')
        .in('refactoring_id', refactorings?.map(r => r.id) || [])

      if (reactionsError) {
        console.error('Error fetching reactions:', reactionsError)
        throw reactionsError
      }

      const stats = {
        evolutionsShared: refactorings?.length || 0,
        reactionsReceived: reactions?.length || 0,
        totalViews: (reactions?.length || 0) * 2
      }

      console.log('User stats fetched:', stats)
      setUserStats(stats)
    } catch (error) {
      console.error('Error fetching user stats:', error)
      // Set to zero state on error
      setUserStats({
        evolutionsShared: 0,
        reactionsReceived: 0,
        totalViews: 0
      })
    }
  }

  const fetchRefactorings = async () => {
    try {
      const supabase = createClient()
      let query = supabase
        .from('refactorings')
        .select('*')
        .eq('is_complete', true)
        .order('created_at', { ascending: sortBy === 'oldest' })
        .limit(20)

      if (filterLanguage !== 'all') {
        query = query.eq('language', filterLanguage)
      }

      const { data, error } = await query

      if (error) throw error
      setRefactorings(data || [])
    } catch (error) {
      console.error('Error fetching refactorings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableLanguages = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('refactorings')
        .select('language')
        .eq('is_complete', true)
        .not('language', 'is', null)

      if (error) throw error
      
      // Extract unique languages from ALL refactorings
      const languages = [...new Set(data?.map(r => r.language) || [])]
      setAvailableLanguages(languages.sort())
    } catch (error) {
      console.error('Error fetching languages:', error)
    }
  }

  const handleStartRefactoring = async () => {
    if (!user) {
      analytics.trackAuth('prompt_shown')
      setShowAuthPrompt(true)
    } else {
      analytics.track('start_refactoring_clicked')
      router.push('/refactor/new')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin" />
          <div className="absolute inset-1 bg-black rounded-full" />
        </div>
      </div>
    )
  }

  // Authenticated User Dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
        
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{user.email?.split('@')[0]}</span>
              </h1>
              <p className="text-gray-400">Share your code evolution and explore the ancestry</p>
            </div>
            <AuthButton />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Start New Evolution */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                <div className="text-center">
                  <div className="text-5xl mb-4">🧬</div>
                  <h3 className="text-xl font-bold text-white mb-3">Start New Evolution</h3>
                  <p className="text-gray-400 mb-6">Capture the ancestry of your next refactoring</p>
                  <button
                    onClick={handleStartRefactoring}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    Capture Evolution
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-white mb-3">Your Impact</h3>
                  {userStats.evolutionsShared === 0 ? (
                    <div className="space-y-2 text-gray-400">
                      <p>Share your first evolution to</p>
                      <p>start building your legacy!</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-gray-300">
                      <p><span className="text-blue-400 font-semibold">{userStats.evolutionsShared}</span> evolution{userStats.evolutionsShared !== 1 ? 's' : ''} shared</p>
                      <p><span className="text-purple-400 font-semibold">{userStats.reactionsReceived}</span> reaction{userStats.reactionsReceived !== 1 ? 's' : ''} received</p>
                      <p><span className="text-pink-400 font-semibold">{userStats.totalViews}</span> developer views</p>
                    </div>
                  )}
                  <button
                    onClick={() => router.push('/profile')}
                    className="mt-4 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    View Profile →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Evolutions Feed */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Community Evolutions</h2>
              <div className="flex gap-4 items-center">
                {/* Language Filter */}
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">All Languages</option>
                  {availableLanguages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>

                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                  className="bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-2xl p-4 animate-pulse">
                    <div className="h-48 bg-gray-800 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : refactorings.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No evolutions yet. Be the first!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {refactorings.map((refactoring) => (
                  <RefactoringCard key={refactoring.id} refactoring={refactoring} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Unauthorized Landing Page
  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgb(59, 130, 246), rgb(147, 51, 234), rgb(236, 72, 153))`,
        }}
      />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header with Auth */}
        <div className="absolute top-4 right-4 z-20">
          <AuthButton />
        </div>
        
        <div className="max-w-5xl mx-auto text-center">
          {/* AI/Human badges */}
          <div className="flex justify-center gap-4 mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              🤖 AI-Powered
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
              🌐 MCP Connected
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30">
              👥 Human+Bot Collaboration
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
              CodeAncestry
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed max-w-3xl mx-auto">
            Trace the <span className="text-blue-400 font-semibold">ancestry</span> of code evolution. Where{' '}
            <span className="text-purple-400 font-semibold">humans</span> and{' '}
            <span className="text-pink-400 font-semibold">AI</span> share refactoring wisdom
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Through the Model Context Protocol, AI assistants can directly contribute 
            refactorings, creating a living archive of mankind and botkind&apos;s collective 
            wisdom in code improvement.
          </p>
          
          <button
            onClick={handleStartRefactoring}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <span className="relative z-10">Start Refactoring</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-300">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-3 text-white">AI-First Design</h3>
                <p className="text-gray-400">
                  LLMs connect via MCP to automatically share refactorings as they help developers
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl hover:border-pink-500/50 transition-all duration-300">
                <div className="text-5xl mb-4">🧬</div>
                <h3 className="text-xl font-bold mb-3 text-white">Evolutionary Archive</h3>
                <p className="text-gray-400">
                  Watch code evolve through the lens of both human creativity and AI optimization
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all duration-300">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-3 text-white">Global Knowledge</h3>
                <p className="text-gray-400">
                  A shared consciousness of code improvements across all languages and paradigms
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
            <h3 className="text-2xl font-bold mb-4 text-white">The MCP Revolution</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              With Model Context Protocol integration, every AI assistant becomes a contributor. 
              As they help refactor code around the world, they can share these improvements here, 
              creating an unprecedented collaboration between human ingenuity and artificial intelligence.
            </p>
          </div>
        </div>

        {/* Recent Refactorings Feed */}
        <div className="mt-24 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Recent Evolutions</h2>
            <div className="flex gap-4 items-center">
              {/* Language Filter */}
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Languages</option>
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900/50 rounded-2xl p-4 animate-pulse">
                  <div className="h-48 bg-gray-800 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : refactorings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No refactorings yet. Be the first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {refactorings.map((refactoring) => (
                <RefactoringCard key={refactoring.id} refactoring={refactoring} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 max-w-md w-full">
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Join the Network</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Create a free account to share your code evolutions and contribute to the collective wisdom on CodeAncestry.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    analytics.trackAuth('signup_clicked')
                    router.push('/auth/login')
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => {
                    analytics.trackAuth('continue_browsing')
                    setShowAuthPrompt(false)
                  }}
                  className="w-full text-gray-400 hover:text-white transition-colors px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-600"
                >
                  Continue Browsing
                </button>
              </div>
              
              <p className="text-gray-500 text-sm mt-4">
                You can view all refactorings without an account
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}