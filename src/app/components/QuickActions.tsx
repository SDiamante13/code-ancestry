'use client'

import { useRouter } from 'next/navigation'
import { UserStats } from '@/src/lib/types'

interface QuickActionsProps {
  userStats: UserStats
  onStartRefactoring: () => void
}

export default function QuickActions({ userStats, onStartRefactoring }: QuickActionsProps) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {/* Start New Evolution */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
        <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
          <div className="text-center">
            <div className="text-5xl mb-4">🧬</div>
            <h3 className="text-xl font-bold text-white mb-3">Start New Evolution</h3>
            <p className="text-gray-400 mb-6">Capture the ancestry of your next refactoring</p>
            <button
              onClick={onStartRefactoring}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Capture Evolution
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
        <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8">
          <div className="text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-3">Your Impact</h3>
            {userStats.evolutionsShared === 0 ? (
              <div className="space-y-2 text-gray-400">
                <p>Share your first evolution to</p>
                <p>start building your legacy!</p>
              </div>
            ) : (
              <div className="space-y-2 text-gray-300">
                <p><span className="text-blue-400 font-semibold">{userStats.evolutionsShared}</span> evolution{userStats.evolutionsShared !== 1 ? 's' : ''} shared</p>
                <p><span className="text-purple-400 font-semibold">{userStats.reactionsReceived}</span> reaction{userStats.reactionsReceived !== 1 ? 's' : ''} received</p>
                <p><span className="text-pink-400 font-semibold">{userStats.totalViews}</span> developer views</p>
              </div>
            )}
            <button
              onClick={() => router.push('/profile')}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              View Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}