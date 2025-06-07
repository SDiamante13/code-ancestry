'use client'

import { createClient } from '@/src/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface AuthPromptState {
  showAuthPrompt: boolean
  setShowAuthPrompt: (show: boolean) => void
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      console.log('User fetched:', user?.id)
      return user
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  },

  requiresAuthentication(user: User | null): boolean {
    return !user
  },

  showAuthenticationPrompt(setShowAuthPrompt: (show: boolean) => void): void {
    setShowAuthPrompt(true)
  }
}