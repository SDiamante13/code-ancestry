import { analytics } from '@/src/lib/analytics'

export async function fetchRandomEvolution(): Promise<string | null> {
  try {
    analytics.track('random_evolution_clicked')
    const response = await fetch('/api/random-evolution')
    const data = await response.json()
    
    if (data.id) {
      return data.id
    } else {
      console.error('No random evolution found')
      return null
    }
  } catch (error) {
    console.error('Error fetching random evolution:', error)
    return null
  }
}