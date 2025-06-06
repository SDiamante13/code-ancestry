'use client'

export const COMMON_LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML/CSS'
].sort()

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export default function LanguageSelector({ 
  value, 
  onChange, 
  className = "",
  placeholder = "Select a language..."
}: LanguageSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-gray-900/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none ${className}`}
    >
      <option value="">{placeholder}</option>
      {COMMON_LANGUAGES.map(lang => (
        <option key={lang} value={lang}>{lang}</option>
      ))}
    </select>
  )
}