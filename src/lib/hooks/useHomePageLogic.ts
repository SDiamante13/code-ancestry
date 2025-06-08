'use client'

import { useState, useEffect } from 'react'
import { usePageView } from '@/src/lib/analytics'
import useAuth from '@/src/lib/hooks/useAuth'
import useUserStats from '@/src/lib/hooks/useUserStats'
import useRefactorings from '@/src/lib/hooks/useRefactorings'
import useMousePosition from '@/src/lib/hooks/useMousePosition'
import useNavigation from '@/src/lib/hooks/useNavigation'

interface UseHomePageLogicReturn {
  user: any
  authLoading: boolean
  userStats: any
  refactorings: any[]
  loading: boolean
  sortBy: 'newest' | 'oldest'
  setSortBy: (sort: 'newest' | 'oldest') => void
  filterLanguage: string
  setFilterLanguage: (language: string) => void
  availableLanguages: string[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  mousePosition: { x: number; y: number }
  showAuthPrompt: boolean
  setShowAuthPrompt: (show: boolean) => void
  handleStartRefactoring: () => Promise<void>
  handleRandomEvolution: () => Promise<void>
  handleAuthSignup: () => void
  handleContinueBrowsing: () => void
  navigateToProfile: () => void
}

export default function useHomePageLogic(): UseHomePageLogicReturn {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  
  const { user, authLoading } = useAuth()
  const { userStats, fetchUserStats } = useUserStats()
  const {
    refactorings,
    loading,
    sortBy,
    setSortBy,
    filterLanguage,
    setFilterLanguage,
    availableLanguages,
    searchTerm,
    setSearchTerm
  } = useRefactorings()
  const { mousePosition } = useMousePosition()
  const {
    handleStartRefactoring: navHandleStartRefactoring,
    handleRandomEvolution,
    handleAuthSignup,
    handleContinueBrowsing: navHandleContinueBrowsing,
    navigateToProfile
  } = useNavigation()

  usePageView('home', {
    total_evolutions: refactorings.length,
    filter_language: filterLanguage,
    sort_by: sortBy,
    user_authenticated: !!user
  })

  useEffect(() => {
    if (user) {
      fetchUserStats(user.id)
    }
  }, [user, fetchUserStats])

  const handleStartRefactoring = async () => {
    await navHandleStartRefactoring(user, setShowAuthPrompt)
  }

  const handleContinueBrowsing = () => {
    navHandleContinueBrowsing(setShowAuthPrompt)
  }

  return {
    user,
    authLoading,
    userStats,
    refactorings,
    loading,
    sortBy,
    setSortBy,
    filterLanguage,
    setFilterLanguage,
    availableLanguages,
    searchTerm,
    setSearchTerm,
    mousePosition,
    showAuthPrompt,
    setShowAuthPrompt,
    handleStartRefactoring,
    handleRandomEvolution,
    handleAuthSignup,
    handleContinueBrowsing,
    navigateToProfile
  }
}