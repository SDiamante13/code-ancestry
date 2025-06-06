'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Refactoring {
  id: string
  created_at: string
  title: string | null
  language: string | null
  is_complete: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [refactorings, setRefactorings] = useState<Refactoring[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserAndRefactorings()
  }, [])

  const fetchUserAndRefactorings = async () => {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)

      // Get user's refactorings
      const { data, error } = await supabase
        .from('refactorings')
        .select('id, created_at, title, language, is_complete')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRefactorings(data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => router.push('/')}
          className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-3xl">
              {user?.email?.[0].toUpperCase() || 'U'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.email?.split('@')[0]}
          </h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Refactorings</h2>
          
          {refactorings.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              You haven't shared any refactorings yet.
            </p>
          ) : (
            <div className="space-y-4">
              {refactorings.map((refactoring) => (
                <button
                  key={refactoring.id}
                  onClick={() => router.push(`/refactor/${refactoring.id}`)}
                  className="w-full text-left p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold">
                        {refactoring.title || `Evolution #${refactoring.id.slice(0, 8)}`}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(refactoring.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {refactoring.language && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                          {refactoring.language}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        refactoring.is_complete 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {refactoring.is_complete ? 'Complete' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}