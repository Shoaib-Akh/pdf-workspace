import { Globe, Cloud, Zap } from 'lucide-react'

interface ProcessingModeTagProps {
  mode: 'browser' | 'server' | 'external-api'
}

export function ProcessingModeTag({ mode }: ProcessingModeTagProps) {
  if (mode === 'browser') {
    return (
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium border border-green-200 dark:border-green-800/50">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          🌐 Browser
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Files are processed entirely on your device. No data is sent to our servers.
        </p>
      </div>
    )
  }

  if (mode === 'server') {
    return (
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-800/50">
          <Cloud className="w-3.5 h-3.5" />
          ☁️ Server
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Files are securely uploaded and automatically deleted after processing.
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
