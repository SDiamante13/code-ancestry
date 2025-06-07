import { createClient } from '@/src/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get total count of complete refactorings
    const { count, error: countError } = await supabase
      .from('refactorings')
      .select('*', { count: 'exact', head: true })
      .eq('is_complete', true)
      .eq('is_hidden', false)
    
    if (countError) throw countError
    
    if (!count || count === 0) {
      return NextResponse.json({ error: 'No evolutions found' }, { status: 404 })
    }
    
    // Get a random offset
    const randomOffset = Math.floor(Math.random() * count)
    
    // Fetch the random refactoring
    const { data, error } = await supabase
      .from('refactorings')
      .select('id')
      .eq('is_complete', true)
      .eq('is_hidden', false)
      .range(randomOffset, randomOffset)
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ id: data.id })
  } catch (error) {
    console.error('Error fetching random evolution:', error)
    return NextResponse.json({ error: 'Failed to fetch random evolution' }, { status: 500 })
  }
}