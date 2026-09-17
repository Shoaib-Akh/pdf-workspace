import { Globe, Cloud, Zap, Clock } from 'lucide-react'

interface ProcessingModeTagProps {
  mode: 'browser' | 'server' | 'external-api'
}

export function ProcessingModeTag({ mode }: ProcessingModeTagProps) {
  if (mode === 'server') {
    return (
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800/50">
          <Clock className="w-3.5 h-3.5" />
          ⏳ Coming Soon (Cloud Server)
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Cloud server processing for this tool is under development and coming soon.
        </p>
      </div>
    )
  }

  if (mode === 'browser') {
    return (
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/50">
          <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ⚡ Instant & 100% Private
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Processed instantly on your device. Zero data uploaded to any server.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 text-xs font-medium border border-yellow-200 dark:border-yellow-800/50">
        <Zap className="w-3.5 h-3.5" />
        ⚡ External API
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Files are processed securely using a trusted third-party service provider.
      </p>
    </div>
  )
}

export default ProcessingModeTag
