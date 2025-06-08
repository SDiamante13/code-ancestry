export async function fetchRandomEvolution(): Promise<string | null> {
  try {
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