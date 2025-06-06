import { analytics } from '@/src/lib/analytics'

interface ErrorOptions {
  showAlert?: boolean
  trackAnalytics?: boolean
  context?: Record<string, unknown>
  operation?: string
}

export const handleError = (
  error: unknown,
  options: ErrorOptions = {}
): string => {
  const {
    showAlert = true,
    trackAnalytics = true,
    context = {},
    operation = 'operation'
  } = options

  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
  
  console.error(`Error ${operation}:`, error)

  if (trackAnalytics) {
    analytics.trackError(`${operation} failed: ${errorMessage}`, context)
  }

  if (showAlert) {
    alert(`Failed to ${operation}: ${errorMessage}. Please try again.`)
  }

  return errorMessage
}

export const createErrorHandler = (defaultOperation: string, defaultContext: Record<string, unknown> = {}) => {
  return (error: unknown, options: Partial<ErrorOptions> = {}) => {
    return handleError(error, {
      operation: defaultOperation,
      context: defaultContext,
      ...options
    })
  }
}