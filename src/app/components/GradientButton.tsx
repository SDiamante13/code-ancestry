import { ButtonHTMLAttributes } from 'react'

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export default function GradientButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: GradientButtonProps) {
  const variants = {
    primary: 'from-blue-500 to-purple-500 hover:shadow-purple-500/25',
    secondary: 'from-purple-500 to-pink-500 hover:shadow-pink-500/25',
    danger: 'from-red-500 to-orange-500 hover:shadow-red-500/25'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-4 text-lg'
  }

  const baseClasses = 'bg-gradient-to-r text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50'
  const variantClasses = variants[variant]
  const sizeClasses = sizes[size]

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}