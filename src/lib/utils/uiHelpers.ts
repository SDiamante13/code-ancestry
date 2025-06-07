'use client'

import type { UserStats } from '@/src/lib/types'

export const uiHelpers = {
  formatUserDisplayName(email: string): string {
    return email.split('@')[0]
  },

  generateMouseGradientStyle(mousePosition: { x: number; y: number }): React.CSSProperties {
    return {
      background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgb(59, 130, 246), rgb(147, 51, 234), rgb(236, 72, 153))`,
    }
  },

  shouldShowFirstTimeMessage(userStats: UserStats): boolean {
    return userStats.evolutionsShared === 0
  },

  formatPlural(count: number, singular: string): string {
    return count !== 1 ? `${singular}s` : singular
  },

  generateLoadingSkeletons(count: number): number[] {
    return [...Array(count)].map((_, i) => i)
  }
}