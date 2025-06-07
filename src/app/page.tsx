'use client'

import useHomePageLogic from '@/src/lib/hooks/useHomePageLogic'
import DashboardPage from '@/src/app/components/DashboardPage'
import LandingPage from '@/src/app/components/LandingPage'
import LoadingSpinner from '@/src/app/components/LoadingSpinner'

export default function Home() {
  const homePageState = useHomePageLogic()

  if (homePageState.authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (homePageState.user) {
    return <DashboardPage {...homePageState} />
  }

  return <LandingPage {...homePageState} />
}
