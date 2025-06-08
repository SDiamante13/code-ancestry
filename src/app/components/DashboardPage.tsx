'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import AuthButton from '@/src/app/components/AuthButton'
import QuickActions from '@/src/app/components/QuickActions'
import EvolutionsFeed from '@/src/app/components/EvolutionsFeed'
import { analytics, usePageView, useUserIdentification } from '@/src/lib/analytics'
import { fetchRandomEvolution } from '@/src/lib/utils/evolution'
import useRefactorings from '@/src/lib/hooks/useRefactorings'
import useUserStats from '@/src/lib/hooks/useUserStats'

interface DashboardPageProps {
  user: User
}

export default function DashboardPage({ user }: DashboardPageProps) {
  const router = useRouter()
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

  usePageView('home', {
    total_evolutions: refactorings.length,
    filter_language: filterLanguage,
    sort_by: sortBy
  })

  useUserIdentification(user.id, {
    email: user.email,
    created_at: user.created_at
  })

  useEffect(() => {
    if (user) {
      fetchUserStats(user.id)
    }
  }, [user, fetchUserStats])

  const handleStartRefactoring = async () => {
    analytics.trackNavigation('start_refactoring')
    router.push('/refactor/new')
  }

  const handleRandomEvolution = async () => {
    const evolutionId = await fetchRandomEvolution()
    if (evolutionId) {
      router.push(`/refactor/${evolutionId}`)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{user.email?.split('@')[0]}</span>
            </h1>
            <p className="text-gray-400">Share your code evolution and explore the ancestry</p>
          </div>
          <AuthButton />
        </div>

        <QuickActions 
          userStats={userStats}
          onStartRefactoring={handleStartRefactoring}
        />

        <EvolutionsFeed
          refactorings={refactorings}
          loading={loading}
          sortBy={sortBy}
          filterLanguage={filterLanguage}
          availableLanguages={availableLanguages}
          searchTerm={searchTerm}
          onSortChange={setSortBy}
          onLanguageFilterChange={setFilterLanguage}
          onSearchChange={setSearchTerm}
          onRandomEvolution={handleRandomEvolution}
          title="Community Evolutions"
          showSearchAndFilters={true}
        />
      </div>
    </div>
  )
}