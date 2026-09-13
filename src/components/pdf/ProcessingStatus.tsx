import { Loader2, CheckCircle2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface ProcessingStatusProps {
  stage: string
  progress: number
  isComplete: boolean
}

export function ProcessingStatus({ stage, progress, isComplete }: ProcessingStatusProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center"
    >
      <div className="mb-4" aria-hidden="true">
        {isComplete ? (
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        ) : (
          <Loader2 className="w-12 h-12 text-primary animate-spin motion-reduce:animate-none" />
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {isComplete ? 'Processing Complete' : stage}
      </h3>
      <div className="w-full mt-4">
        <Progress value={progress} className="h-2 w-full transition-all duration-300 motion-reduce:transition-none" />
        <p className="text-sm text-gray-500 mt-2 font-medium">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  )
}
