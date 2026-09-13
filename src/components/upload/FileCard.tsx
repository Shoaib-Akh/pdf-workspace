import { X, FileText } from 'lucide-react'
import { PDFMetadata } from '@/types'

interface FileCardProps {
  file: File
  metadata?: PDFMetadata
  onRemove?: () => void
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function FileCard({ file, metadata, onRemove }: FileCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
      <div className="flex-shrink-0">
        <FileText className="w-10 h-10 text-red-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {file.name}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatBytes(file.size)}</span>
          {metadata?.pageCount && (
            <>
              <span>•</span>
              <span>{metadata.pageCount} {metadata.pageCount === 1 ? 'page' : 'pages'}</span>
            </>
          )}
          {metadata?.isScanned && (
            <>
              <span>•</span>
              <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-1.5 py-0.5 rounded font-medium">Scanned</span>
            </>
          )}
        </div>
      </div>
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Remove file"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
