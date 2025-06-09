export interface Refactoring {
  id: string
  created_at: string
  before_screenshot_url: string
  during_screenshot_url: string | null
  after_screenshot_url: string | null
  title: string | null
  description: string | null
  language: string | null
  is_complete: boolean
  author_id?: string | null
  author_username?: string | null
}

export interface UserStats {
  evolutionsShared: number
  reactionsReceived: number
  totalViews: number
}

export interface MousePosition {
  x: number
  y: number
}

export interface PageAnalyticsData {
  total_evolutions: number
  filter_language: string
  sort_by: string
}

export interface AuthPromptState {
  showAuthPrompt: boolean
  setShowAuthPrompt: (show: boolean) => void
}