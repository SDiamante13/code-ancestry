import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { refactoringId, reason } = await request.json()

    if (!refactoringId || !reason) {
      return NextResponse.json(
        { error: 'Missing refactoringId or reason' },
        { status: 400 }
      )
    }

    const validReasons = ['inappropriate', 'not_code', 'spam', 'other']
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { error: 'Invalid reason' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    
    let reporterId: string
    if (user) {
      reporterId = user.id
    } else {
      const sessionId = request.headers.get('x-session-id') || 
                       request.headers.get('x-forwarded-for') || 
                       'anonymous'
      reporterId = sessionId
    }

    const { error } = await supabase
      .from('content_reports')
      .insert({
        refactoring_id: refactoringId,
        reporter_id: reporterId,
        reason
      })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You have already reported this content' },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error reporting content:', error)
    return NextResponse.json(
      { error: 'Failed to report content' },
      { status: 500 }
    )
  }
}