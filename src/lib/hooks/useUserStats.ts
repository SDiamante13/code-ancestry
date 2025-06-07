'use client'

import { useState } from 'react'
import { createClient } from '@/src/lib/supabase/client'

interface UserStats {
  evolutionsShared: number
  reactionsReceived: number
  totalViews: number
}

interface UseUserStatsReturn {
  userStats: UserStats
  fetchUserStats: (userId: string) => Promise<void>
  resetUserStats: () => void
}

export default function useUserStats(): UseUserStatsReturn {
  const [userStats, setUserStats] = useState<UserStats>({
    evolutionsShared: 0,
    reactionsReceived: 0,
    totalViews: 0
  })

  const fetchUserStats = async (userId: string) => {
    try {
      const supabase = createClient()

      const { data: refactorings, error: refactoringsError } = await supabase
        .from('refactorings')
        .select('id')
        .eq('author_id', userId)
        .eq('is_complete', true)
        .eq('is_hidden', false)

      if (refactoringsError) {
        console.error('Error fetching refactorings:', refactoringsError)
        throw refactoringsError
      }

      const refactoringIds = refactorings?.map(r => r.id) || []
      let reactions: any[] = []

      if (refactoringIds.length > 0) {
        try {
          const { data, error } = await supabase
            .from('reactions')
            .select('refactoring_id')
            .in('refactoring_id', refactoringIds)
          
          if (error) {
            console.warn('Reactions table not accessible, using fallback:', error.message)
            reactions = []
          } else {
            reactions = data || []
          }
        } catch (error) {
          console.warn('Reactions feature not available:', error)
          reactions = []
        }
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
      resetUserStats()
    }
  }

  const resetUserStats = () => {
    setUserStats({
      evolutionsShared: 0,
      reactionsReceived: 0,
      totalViews: 0
    })
  }

  return {
    userStats,
    fetchUserStats,
    resetUserStats
  }
}