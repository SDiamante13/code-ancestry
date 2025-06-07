'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/src/lib/supabase/client'

interface Refactoring {
  id: string
  created_at: string
  before_screenshot_url: string
  during_screenshot_url: string | null
  after_screenshot_url: string | null
  title: string | null
  description: string | null
  language: string | null
  is_complete: boolean
}

interface UseRefactoringsReturn {
  refactorings: Refactoring[]
  loading: boolean
  sortBy: 'newest' | 'oldest'
  setSortBy: (sort: 'newest' | 'oldest') => void
  filterLanguage: string
  setFilterLanguage: (language: string) => void
  availableLanguages: string[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  fetchRefactorings: () => Promise<void>
}

export default function useRefactorings(): UseRefactoringsReturn {
  const [refactorings, setRefactorings] = useState<Refactoring[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [filterLanguage, setFilterLanguage] = useState<string>('all')
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')

  const fetchRefactorings = async () => {
    try {
      const supabase = createClient()
      let query = supabase
        .from('refactorings')
        .select('*')
        .eq('is_complete', true)
        .eq('is_hidden', false)
        .order('created_at', { ascending: sortBy === 'oldest' })
        .limit(20)

      if (filterLanguage !== 'all') {
        query = query.eq('language', filterLanguage)
      }

      if (searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,language.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) throw error
      
      setRefactorings(data || [])
    } catch (error) {
      console.error('Error fetching refactorings:', error)
      setRefactorings([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableLanguages = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('refactorings')
        .select('language')
        .eq('is_complete', true)
        .eq('is_hidden', false)
        .not('language', 'is', null)

      if (error) throw error

      const languages = [...new Set(data?.map(r => r.language) || [])]
      setAvailableLanguages(languages.sort())
    } catch (error) {
      console.error('Error fetching languages:', error)
      setAvailableLanguages([])
    }
  }

  useEffect(() => {
    fetchRefactorings()
  }, [sortBy, filterLanguage, searchTerm])

  useEffect(() => {
    fetchAvailableLanguages()
  }, [])

  return {
    refactorings,
    loading,
    sortBy,
    setSortBy,
    filterLanguage,
    setFilterLanguage,
    availableLanguages,
    searchTerm,
    setSearchTerm,
    fetchRefactorings
  }
}