import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ErrorDisplayProps {
  error: string
  recovery?: { label: string; href: string }
  onRetry?: () => void
}

export function ErrorDisplay({ error, recovery, onRetry }: ErrorDisplayProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full max-w-md mx-auto p-6 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/50 flex flex-col items-center text-center"
    >
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" aria-hidden="true" />
      <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-red-600 dark:text-red-300 mb-6">
        {error}
      </p>
      
      <div className="flex flex-col w-full gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        
        {recovery && (
          <Link
            to={recovery.href}
            className="w-full py-2.5 px-4 bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {recovery.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
