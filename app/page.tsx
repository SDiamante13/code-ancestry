'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleStartRefactoring = () => {
    router.push('/refactor/new')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Refactoring Social Network
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12">
            Share your code refactorings with the world. Learn from others.
          </p>
          
          <button
            onClick={handleStartRefactoring}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-6 px-12 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            Start Refactoring
          </button>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-lg font-semibold mb-2">Capture</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Screenshot your code before and after refactoring
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold mb-2">Compare</h3>
              <p className="text-gray-600 dark:text-gray-400">
                See the transformation side by side
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold mb-2">Share</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get a link to share your refactoring with anyone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}