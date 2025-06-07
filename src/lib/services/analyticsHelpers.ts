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
    analytics.track('start_refactoring_clicked')
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
    analytics.track('random_evolution_clicked')
  },

  trackLanguageFilterChange(language: string): void {
    analytics.track('filter_changed', {
      filter_type: 'language',
      filter_value: language
    })
  },

  trackSortChange(sortBy: string): void {
    analytics.track('sort_changed', {
      sort_value: sortBy
    })
  },

  trackSearchPerformed(searchTerm: string): void {
    analytics.track('search_performed', {
      search_term: searchTerm.length > 0 ? 'has_term' : 'empty'
    })
  }
}