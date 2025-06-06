'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { analytics } from '@/src/lib/analytics'

interface ReactionCounts {
  fire_count: number
  lightbulb_count: number
  thinking_count: number
}

interface ReactionButtonsProps {
  refactoringId: string
  initialCounts?: ReactionCounts
}

export default function ReactionButtons({ refactoringId, initialCounts }: ReactionButtonsProps) {
  const [reactions, setReactions] = useState<ReactionCounts>(
    initialCounts || { fire_count: 0, lightbulb_count: 0, thinking_count: 0 }
  )
  const [userReactions, setUserReactions] = useState<string[]>([])

  useEffect(() => {
    fetchReactions()
  }, [refactoringId])

  const fetchReactions = async () => {
    try {
      const supabase = createClient()

      // Get reaction counts
      const { data: counts, error: countsError } = await supabase
        .from('reaction_counts')
        .select('*')
        .eq('refactoring_id', refactoringId)
        .single()

      if (!countsError && counts) {
        setReactions(counts)
      }

      // Get user's reactions
      const userId = await getUserId()
      const { data: userReactionData, error: userError } = await supabase
        .from('reactions')
        .select('reaction_type')
        .eq('refactoring_id', refactoringId)
        .eq('user_id', userId)

      if (!userError && userReactionData) {
        setUserReactions(userReactionData.map(r => r.reaction_type))
      }
    } catch (error) {
      console.error('Error fetching reactions:', error)
    }
  }

  const generateSessionId = () => {
    return 'anon_' + Math.random().toString(36).substr(2, 9)
  }

  const getUserId = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      return user.id
    } else {
      const sessionId = localStorage.getItem('session_id') || generateSessionId()
      localStorage.setItem('session_id', sessionId)
      return sessionId
    }
  }

  const handleReaction = async (reactionType: string) => {
    try {
      const supabase = createClient()
      const userId = await getUserId()

      if (userReactions.includes(reactionType)) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('refactoring_id', refactoringId)
          .eq('user_id', userId)
          .eq('reaction_type', reactionType)

        analytics.trackReaction(refactoringId, reactionType, 'remove')
        setUserReactions(prev => prev.filter(r => r !== reactionType))
        setReactions(prev => ({
          ...prev,
          [`${reactionType}_count`]: Math.max(0, prev[`${reactionType}_count` as keyof ReactionCounts] - 1)
        }))
      } else {
        // Add reaction
        await supabase
          .from('reactions')
          .insert({
            refactoring_id: refactoringId,
            user_id: userId,
            reaction_type: reactionType
          })

        analytics.trackReaction(refactoringId, reactionType, 'add')
        setUserReactions(prev => [...prev, reactionType])
        setReactions(prev => ({
          ...prev,
          [`${reactionType}_count`]: prev[`${reactionType}_count` as keyof ReactionCounts] + 1
        }))
      }
    } catch (error) {
      console.error('Error handling reaction:', error)
    }
  }

  return (
    <div className="flex gap-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full px-8 py-4">
      <button
        onClick={() => handleReaction('fire')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          userReactions.includes('fire')
            ? 'bg-orange-500/20 border border-orange-500/50 text-orange-300'
            : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-orange-300 hover:border-orange-500/30'
        }`}
      >
        <span className="text-2xl">🔥</span>
        <span className="font-semibold">{reactions.fire_count || 0}</span>
      </button>

      <button
        onClick={() => handleReaction('lightbulb')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          userReactions.includes('lightbulb')
            ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'
            : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-yellow-300 hover:border-yellow-500/30'
        }`}
      >
        <span className="text-2xl">💡</span>
        <span className="font-semibold">{reactions.lightbulb_count || 0}</span>
      </button>

      <button
        onClick={() => handleReaction('thinking')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          userReactions.includes('thinking')
            ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
            : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-blue-300 hover:border-blue-500/30'
        }`}
      >
        <span className="text-2xl">🤔</span>
        <span className="font-semibold">{reactions.thinking_count || 0}</span>
      </button>
    </div>
  )
}
