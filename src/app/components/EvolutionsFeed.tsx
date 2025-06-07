'use client'

import SearchBar from '@/src/app/components/SearchBar'
import RefactoringCard from '@/src/app/components/RefactoringCard'
import { Refactoring } from '@/src/lib/types'

interface EvolutionsFeedProps {
  refactorings: Refactoring[]
  loading: boolean
  sortBy: 'newest' | 'oldest'
  filterLanguage: string
  availableLanguages: string[]
  searchTerm: string
  onSortChange: (sortBy: 'newest' | 'oldest') => void
  onLanguageFilterChange: (language: string) => void
  onSearchChange: (term: string) => void
  onRandomEvolution: () => void
  title?: string
  showSearchAndFilters?: boolean
}

export default function EvolutionsFeed({
  refactorings,
  loading,
  sortBy,
  filterLanguage,
  availableLanguages,
  searchTerm: _searchTerm,
  onSortChange,
  onLanguageFilterChange,
  onSearchChange,
  onRandomEvolution,
  title = "Community Evolutions",
  showSearchAndFilters = true
}: EvolutionsFeedProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      {showSearchAndFilters && (
        <>
          <SearchBar 
            onSearch={onSearchChange}
            className="mb-6"
          />
          
          <div className="flex gap-4 items-center mb-6 flex-wrap">
            <select
              value={filterLanguage}
              onChange={(e) => onLanguageFilterChange(e.target.value)}
              className="bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Languages</option>
              {availableLanguages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest')}
              className="bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <button
              onClick={onRandomEvolution}
              className="ml-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-500/50 transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-lg">🎲</span>
              Random Evolution
            </button>
          </div>
        </>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900/50 rounded-2xl p-4 animate-pulse">
              <div className="h-48 bg-gray-800 rounded-lg mb-4" />
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : refactorings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No evolutions yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {refactorings.map((refactoring) => (
            <RefactoringCard key={refactoring.id} refactoring={refactoring} />
          ))}
        </div>
      )}
    </div>
  )
}