'use client'

import { createClient } from '@/src/lib/supabase/client'
import { analytics } from '@/src/lib/analytics'
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
      
      // Track login success if user exists
      if (user) {
        analytics.identify(user.id, {
          email: user.email,
          created_at: user.created_at
        })
      }
      
      return user
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  },

  async signInWithProvider(provider: 'github' | 'google'): Promise<{ error: any }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (!error) {
        analytics.trackAuth(`${provider}_login_clicked`)
      }
      
      return { error }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      return { error }
    }
  },

  requiresAuthentication(user: User | null): boolean {
    return !user
  },

  showAuthenticationPrompt(setShowAuthPrompt: (show: boolean) => void): void {
    analytics.trackAuth('prompt_shown')
    setShowAuthPrompt(true)
  },

  trackLogout(): void {
    analytics.trackAuth('logout')
  }
}