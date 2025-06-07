'use client'

import { useRouter } from 'next/navigation'
import { analytics } from '@/src/lib/analytics'

interface AuthPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthPromptModal({ isOpen, onClose }: AuthPromptModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleSignupClick = () => {
    analytics.trackAuth('signup_clicked')
    router.push('/auth/login')
  }

  const handleContinueBrowsing = () => {
    analytics.trackAuth('continue_browsing')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">Join the Network</h3>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Create a free account to share your refactoring stories and learn from the community on CodeAncestry.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleSignupClick}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Create Free Account
            </button>
            <button
              onClick={handleContinueBrowsing}
              className="w-full text-gray-400 hover:text-white transition-colors px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-600"
            >
              Continue Browsing
            </button>
          </div>

          <p className="text-gray-500 text-sm mt-4">
            You can browse all code stories without an account
          </p>
        </div>
      </div>
    </div>
  )
}