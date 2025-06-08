'use client'

import { useRouter } from 'next/navigation'
import { analytics } from '@/src/lib/analytics'
import { fetchRandomEvolution } from '@/src/lib/utils/evolution'
import type { User } from '@supabase/supabase-js'

interface UseNavigationReturn {
  handleStartRefactoring: (user: User | null, setShowAuthPrompt: (show: boolean) => void) => Promise<void>
  handleRandomEvolution: () => Promise<void>
  handleAuthSignup: () => void
  handleContinueBrowsing: (setShowAuthPrompt: (show: boolean) => void) => void
  navigateToProfile: () => void
}

export default function useNavigation(): UseNavigationReturn {
  const router = useRouter()

  const handleStartRefactoring = async (
    user: User | null, 
    setShowAuthPrompt: (show: boolean) => void
  ) => {
    if (!user) {
      analytics.trackAuth('prompt_shown')
      setShowAuthPrompt(true)
    } else {
      analytics.trackNavigation('start_refactoring')
      router.push('/refactor/new')
    }
  }

  const handleRandomEvolution = async () => {
    analytics.trackNavigation('random_evolution')
    const evolutionId = await fetchRandomEvolution()
    if (evolutionId) {
      router.push(`/refactor/${evolutionId}`)
    }
  }

  const handleAuthSignup = () => {
    analytics.trackAuth('signup_clicked')
    router.push('/auth/login')
  }

  const handleContinueBrowsing = (setShowAuthPrompt: (show: boolean) => void) => {
    analytics.trackAuth('continue_browsing')
    setShowAuthPrompt(false)
  }

  const navigateToProfile = () => {
    analytics.trackNavigation('profile_view')
    router.push('/profile')
  }

  return {
    handleStartRefactoring,
    handleRandomEvolution,
    handleAuthSignup,
    handleContinueBrowsing,
    navigateToProfile
  }
}