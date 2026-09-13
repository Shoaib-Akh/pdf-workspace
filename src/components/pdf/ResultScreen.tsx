import { CheckCircle, Download, FileArchive, RefreshCw } from 'lucide-react'
import { ToolDefinition } from '@/types'
import { Link } from 'react-router-dom'

interface ResultScreenProps {
  title: string
  fileName: string
  fileSize: number
  outputFormat: string
  pageCount?: number
  onDownload: () => void
  onDownloadZip?: () => void
  onConvertAnother: () => void
  relatedTools?: ToolDefinition[]
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function ResultScreen({
  title,
  fileName,
  fileSize,
  outputFormat,
  pageCount,
  onDownload,
  onDownloadZip,
  onConvertAnother,
  relatedTools
}: ResultScreenProps) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 w-full text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8 text-left flex flex-wrap justify-between items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate" title={fileName}>{fileName}</p>
            <div className="text-sm text-gray-500 mt-1 flex gap-3">
              <span>{formatBytes(fileSize)}</span>
              <span>•</span>
              <span className="uppercase">{outputFormat}</span>
              {pageCount !== undefined && (
                <>
                  <span>•</span>
                  <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onDownload}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 focus-visible-ring min-h-[44px]"
          >
            <Download className="w-5 h-5" aria-hidden="true" />
            Download
          </button>
          {onDownloadZip && (
            <button
              onClick={onDownloadZip}
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 focus-visible-ring min-h-[44px]"
            >
              <FileArchive className="w-5 h-5" aria-hidden="true" />
              Download as ZIP
            </button>
          )}
          <button
            onClick={onConvertAnother}
            className="w-full sm:w-auto px-6 py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 focus-visible-ring min-h-[44px]"
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            Convert another
          </button>
        </div>
      </div>

      {relatedTools && relatedTools.length > 0 && (
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">You might also like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.slice(0, 4).map((tool) => (
              <Link
                key={tool.slug}
                to={`/${tool.slug}`}
                className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-1">{tool.name}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{tool.description}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
