'use client'

import { createClient } from '@/src/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { analytics } from '@/src/lib/analytics'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    analytics.trackAuth('logout')
    await supabase.auth.signOut()
    router.refresh()
  }

  if (loading) {
    return (
      <div className="h-10 w-20 bg-gray-800 rounded-lg animate-pulse" />
    )
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/auth/login')}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
      >
        Sign In
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {user.email?.[0].toUpperCase() || 'U'}
          </span>
        </div>
        <span className="text-gray-300 text-sm hidden sm:inline">
          {user.email?.split('@')[0]}
        </span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
          <button
            onClick={() => {
              analytics.trackNavigation('profile_view')
              router.push('/profile')
              setShowMenu(false)
            }}
            className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-t-lg transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => {
              handleSignOut()
              setShowMenu(false)
            }}
            className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-b-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
