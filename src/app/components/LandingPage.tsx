'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AuthButton from '@/src/app/components/AuthButton'
import EvolutionsFeed from '@/src/app/components/EvolutionsFeed'
import AuthPromptModal from '@/src/app/components/AuthPromptModal'
import { analytics, usePageView } from '@/src/lib/analytics'
import { fetchRandomEvolution } from '@/src/lib/utils/evolution'
import useRefactorings from '@/src/lib/hooks/useRefactorings'

interface LandingPageProps {
  mousePosition: { x: number; y: number }
}

export default function LandingPage({ mousePosition }: LandingPageProps) {
  const router = useRouter()
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const {
    refactorings,
    loading,
    sortBy,
    setSortBy,
    filterLanguage,
    setFilterLanguage,
    availableLanguages,
    searchTerm,
    setSearchTerm
  } = useRefactorings()

  usePageView('home', {
    total_evolutions: refactorings.length,
    filter_language: filterLanguage,
    sort_by: sortBy
  })

  const handleStartRefactoring = async () => {
    analytics.trackAuth('prompt_shown')
    setShowAuthPrompt(true)
  }

  const handleRandomEvolution = async () => {
    const evolutionId = await fetchRandomEvolution()
    if (evolutionId) {
      router.push(`/refactor/${evolutionId}`)
    }
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgb(59, 130, 246), rgb(147, 51, 234), rgb(236, 72, 153))`,
        }}
      />

      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="absolute top-4 right-4 z-20">
          <AuthButton />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center gap-4 mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              📸 Before & After
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
              🔥 Community Driven
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30">
              🧬 Code Evolution
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
              CodeAncestry
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed max-w-3xl mx-auto">
            <span className="text-blue-400 font-semibold">Every commit has a story.</span> Share the journey of your code from messy to clean,
            broken to beautiful, complex to elegant.
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Capture screenshots of your code before and after refactoring.
            Build a visual timeline of improvement and inspire others with your transformations.
          </p>

          <button
            onClick={handleStartRefactoring}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <span className="relative z-10">Start Refactoring</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-300">
                <div className="text-5xl mb-4">📸</div>
                <h3 className="text-xl font-bold mb-3 text-white">Visual Stories</h3>
                <p className="text-gray-400">
                  Capture before and after screenshots to tell the complete story of your refactoring journey
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl hover:border-pink-500/50 transition-all duration-300">
                <div className="text-5xl mb-4">🧬</div>
                <h3 className="text-xl font-bold mb-3 text-white">Code Evolution</h3>
                <p className="text-gray-400">
                  Track the ancestry of great code through community-shared refactoring transformations
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all duration-300">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-3 text-white">Learn Together</h3>
                <p className="text-gray-400">
                  Discover patterns and techniques from developers worldwide across all languages and frameworks
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
            <h3 className="text-2xl font-bold mb-4 text-white">Every Commit Has a Story</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Behind every great piece of code is a journey of iteration, improvement, and discovery.
              CodeAncestry captures these stories, creating a visual timeline that celebrates
              the craft of writing better code.
            </p>
          </div>
        </div>

        <div className="mt-24 max-w-7xl mx-auto">
          <EvolutionsFeed
            refactorings={refactorings}
            loading={loading}
            sortBy={sortBy}
            filterLanguage={filterLanguage}
            availableLanguages={availableLanguages}
            searchTerm={searchTerm}
            onSortChange={setSortBy}
            onLanguageFilterChange={setFilterLanguage}
            onSearchChange={setSearchTerm}
            onRandomEvolution={handleRandomEvolution}
            title="Recent Evolutions"
            showSearchAndFilters={true}
          />
        </div>
      </div>

      <AuthPromptModal 
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
      />

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}