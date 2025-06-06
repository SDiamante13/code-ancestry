// Simple analytics tracking for CodeAncestry
// Tracks key user interactions and feature usage

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
}

class Analytics {
  private isDev = process.env.NODE_ENV === 'development'

  // Track events to console in dev, could integrate with analytics service later
  track(event: string, properties?: Record<string, any>, userId?: string) {
    const eventData: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : ''
      },
      userId
    }

    if (this.isDev) {
      console.log('📊 Analytics Event:', eventData)
    }

    // Store in localStorage for now (could send to analytics service)
    if (typeof window !== 'undefined') {
      const existingEvents = JSON.parse(localStorage.getItem('codeancestry_analytics') || '[]')
      existingEvents.push(eventData)
      
      // Keep only last 100 events to avoid storage bloat
      if (existingEvents.length > 100) {
        existingEvents.splice(0, existingEvents.length - 100)
      }
      
      localStorage.setItem('codeancestry_analytics', JSON.stringify(existingEvents))
    }

    // TODO: Send to analytics service (PostHog, Mixpanel, etc.)
    // this.sendToAnalyticsService(eventData)
  }

  // Feature-specific tracking methods
  trackEvolutionView(evolutionId: string, properties?: Record<string, any>) {
    this.track('evolution_viewed', {
      evolution_id: evolutionId,
      ...properties
    })
  }

  trackEvolutionCreate(step: 'before' | 'during' | 'after', properties?: Record<string, any>) {
    this.track('evolution_create_step', {
      step,
      ...properties
    })
  }

  trackReaction(evolutionId: string, reactionType: string, action: 'add' | 'remove') {
    this.track('reaction', {
      evolution_id: evolutionId,
      reaction_type: reactionType,
      action,
    })
  }

  trackFocusMode(evolutionId: string, action: 'open' | 'close') {
    this.track('focus_mode', {
      evolution_id: evolutionId,
      action,
    })
  }

  trackAuth(action: 'prompt_shown' | 'signup_clicked' | 'continue_browsing') {
    this.track('auth_interaction', {
      action,
    })
  }

  trackSearch(query: string, results: number, filters?: Record<string, any>) {
    this.track('search', {
      query,
      results_count: results,
      filters,
    })
  }

  trackImageReplacement(type: 'before' | 'during' | 'after', evolutionId: string) {
    this.track('image_replacement', {
      image_type: type,
      evolution_id: evolutionId,
    })
  }

  trackError(error: string, context?: Record<string, any>) {
    this.track('error', {
      error_message: error,
      ...context,
    })
  }

  // Get analytics data for debugging
  getStoredEvents() {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('codeancestry_analytics') || '[]')
  }

  // Clear stored events
  clearEvents() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('codeancestry_analytics')
    }
  }
}

// Export singleton instance
export const analytics = new Analytics()

// Helper hook for React components
import { useEffect } from 'react'

export function usePageView(pageName: string, properties?: Record<string, any>) {
  useEffect(() => {
    analytics.track('page_view', {
      page: pageName,
      ...properties
    })
  }, [pageName, properties])
}