'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import type { User } from '@supabase/supabase-js'

interface PosthogProviderProps {
  children: React.ReactNode
  user?: User | null
}

export function PosthogProvider({ children, user }: PosthogProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize PostHog
    if (typeof window !== 'undefined' && !posthog.__loaded) {
      posthog.init(
        process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
        {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
          person_profiles: 'identified_only',
          capture_pageview: false, // We'll handle this manually
          capture_pageleave: true,
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
              posthog.debug()
            }
          }
        }
      )
    }
  }, [])

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && posthog.__loaded) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      posthog.capture('$pageview', {
        $current_url: url
      })
    }
  }, [pathname, searchParams])

  useEffect(() => {
    // Handle user identification
    if (typeof window !== 'undefined' && posthog.__loaded) {
      if (user?.id) {
        posthog.identify(user.id, {
          email: user.email,
          created_at: user.created_at
        })
      } else {
        posthog.reset()
      }
    }
  }, [user])

  return <>{children}</>
}