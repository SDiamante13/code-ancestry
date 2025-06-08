'use client'

import { analytics } from '@/src/lib/analytics'

export interface PageAnalyticsData {
  total_evolutions: number
  filter_language: string
  sort_by: string
}

export const analyticsHelpers = {
  trackPageView(data: PageAnalyticsData): void {
    analytics.track('page_view', {
      page: 'home',
      ...data
    })
  },

  trackStartRefactoringClick(): void {
    analytics.trackNavigation('start_refactoring')
  },

  trackAuthPromptShown(): void {
    analytics.trackAuth('prompt_shown')
  },

  trackSignupClick(): void {
    analytics.trackAuth('signup_clicked')
  },

  trackContinueBrowsing(): void {
    analytics.trackAuth('continue_browsing')
  },

  trackRandomEvolutionClick(): void {
    analytics.trackNavigation('random_evolution')
  },

  trackLanguageFilterChange(language: string): void {
    analytics.trackFeatureUsage('filter', 'language_change', {
      filter_type: 'language',
      filter_value: language
    })
  },

  trackSortChange(sortBy: string): void {
    analytics.trackFeatureUsage('sort', 'sort_change', {
      sort_value: sortBy
    })
  },

  trackSearchPerformed(searchTerm: string): void {
    analytics.trackSearch(searchTerm, 0, {
      has_term: searchTerm.length > 0
    })
  }
}