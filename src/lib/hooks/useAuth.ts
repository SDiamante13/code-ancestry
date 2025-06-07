'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UseAuthReturn {
  user: User | null
  authLoading: boolean
  fetchUser: () => Promise<void>
}

export default function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      console.log('User fetched:', user?.id)
      setUser(user)
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    } finally {
      setAuthLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return {
    user,
    authLoading,
    fetchUser
  }
}