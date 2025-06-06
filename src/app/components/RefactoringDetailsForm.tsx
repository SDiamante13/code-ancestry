'use client'

import { useState } from 'react'
import LanguageSelector from './LanguageSelector'
import { createClient } from '@/src/lib/supabase/client'

interface RefactoringDetailsFormProps {
  refactoringId: string
  onSuccess?: () => void
}

export default function RefactoringDetailsForm({ refactoringId, onSuccess }: RefactoringDetailsFormProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [saving, setSaving] = useState(false)

  const handleUpdateDetails = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('refactorings')
        .update({
          language: selectedLanguage || null,
          title: title || null,
          description: description || null
        })
        .eq('id', refactoringId)

      if (error) throw error

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating refactoring:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 rounded-2xl border border-purple-500/20">
      <h3 className="text-lg font-semibold text-white mb-4">Add Details (Optional)</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Programming Language</label>
          <LanguageSelector
            value={selectedLanguage}
            onChange={setSelectedLanguage}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Extract Method Refactoring"
            className="w-full bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you refactor and why?"
            rows={3}
            className="w-full bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
          />
        </div>

        <button
          onClick={handleUpdateDetails}
          disabled={saving}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Details'}
        </button>
      </div>
    </div>
  )
}
