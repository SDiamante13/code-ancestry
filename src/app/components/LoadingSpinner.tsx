interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  const spinnerSize = sizeClasses[size]

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${spinnerSize} bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin`} />
        <div className={`absolute inset-1 bg-black rounded-full`} />
      </div>
      {text && (
        <p className="mt-4 text-gray-300 text-lg">{text}</p>
      )}
    </div>
  )
}