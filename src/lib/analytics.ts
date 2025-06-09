// Analytics tracking for CodeAncestry with PostHog integration
// Tracks key user interactions and feature usage

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
}

class Analytics {
  private isDev = process.env.NODE_ENV === 'development'
  private posthog: any = null

  constructor() {
    // Initialize PostHog if available
    if (typeof window !== 'undefined') {
      this.initializePostHog()
    }
  }

  private async initializePostHog() {
    try {
      // Check if PostHog is available globally
      if (typeof window !== 'undefined' && (window as any).posthog) {
        this.posthog = (window as any).posthog
      }
    } catch (error) {
      console.warn('PostHog not available:', error)
    }
  }

  // Track events with PostHog integration
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

    // Send to PostHog if available
    if (this.posthog) {
      try {
        this.posthog.capture(event, eventData.properties)
        
        // Identify user if userId is provided
        if (userId) {
          this.posthog.identify(userId)
        }
      } catch (error) {
        console.warn('PostHog tracking failed:', error)
      }
    }

    // Fallback: Store in localStorage for debugging
    if (typeof window !== 'undefined') {
      const existingEvents = JSON.parse(localStorage.getItem('codeancestry_analytics') || '[]')
      existingEvents.push(eventData)
      
      // Keep only last 100 events to avoid storage bloat
      if (existingEvents.length > 100) {
        existingEvents.splice(0, existingEvents.length - 100)
      }
      
      localStorage.setItem('codeancestry_analytics', JSON.stringify(existingEvents))
    }
  }

  // Identify user for PostHog
  identify(userId: string, traits?: Record<string, any>) {
    if (this.posthog) {
      try {
        this.posthog.identify(userId, traits)
      } catch (error) {
        console.warn('PostHog identify failed:', error)
      }
    }
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    if (this.posthog) {
      try {
        this.posthog.people.set(properties)
      } catch (error) {
        console.warn('PostHog user properties failed:', error)
      }
    }
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

  trackEvolutionComplete(evolutionId: string, properties?: Record<string, any>) {
    this.track('evolution_completed', {
      evolution_id: evolutionId,
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

  trackAuth(action: 'prompt_shown' | 'signup_clicked' | 'continue_browsing' | 'login_success' | 'logout' | 'github_login_clicked' | 'google_login_clicked' | 'discord_login_clicked' | 'twitter_login_clicked') {
    this.track('auth_interaction', {
      action,
    })
  }

  trackNavigation(action: 'start_refactoring' | 'random_evolution' | 'profile_view' | 'home_view') {
    this.track('navigation', {
      action,
    })
  }

  trackSearch(query: string, results: number, filters?: Record<string, any>) {
    this.track('search', {
      query: query.length > 0 ? 'has_term' : 'empty',
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

  trackFeatureUsage(feature: string, action: string, properties?: Record<string, any>) {
    this.track('feature_usage', {
      feature,
      action,
      ...properties
    })
  }

  trackUserEngagement(action: 'scroll' | 'click' | 'hover' | 'share', properties?: Record<string, any>) {
    this.track('user_engagement', {
      action,
      ...properties
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

// User identification hook
export function useUserIdentification(userId?: string, traits?: Record<string, any>) {
  useEffect(() => {
    if (userId) {
      analytics.identify(userId, traits)
    }
  }, [userId, traits])
}