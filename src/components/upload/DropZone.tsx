import { useCallback, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'

interface DropZoneProps {
  onFileSelect: (files: File[]) => void
  accept?: Record<string, string[]>
  multiple?: boolean
  maxSize?: number
  disabled?: boolean
  className?: string
  label?: string
  sublabel?: string
}

export function DropZone({
  onFileSelect,
  accept = { 'application/pdf': ['.pdf'] },
  multiple = false,
  maxSize = 500 * 1024 * 1024,
  disabled = false,
  className = '',
  label = 'Drop your PDF here',
  sublabel = 'or click to browse — max 500MB'
}: DropZoneProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null)

    if (fileRejections.length > 0) {
      const rejection = fileRejections[0]
      const errorCode = rejection.errors[0]?.code
      if (errorCode === 'file-too-large') {
        setError(`This file is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`)
      } else if (errorCode === 'file-invalid-type') {
        setError(Object.keys(accept).includes('application/pdf') ? 'Please select a PDF file.' : 'This file type is not supported.')
      } else {
        setError(rejection.errors[0]?.message || 'File rejected.')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles)
    }
  }, [maxSize, accept, onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
    disabled
  })

  let borderClass = 'border-dashed border-gray-300 dark:border-gray-700'
  let bgClass = 'bg-white dark:bg-gray-900'
  
  if (disabled) {
    borderClass = 'border-dashed border-gray-200 dark:border-gray-800'
    bgClass = 'bg-gray-50 dark:bg-gray-950 cursor-not-allowed opacity-60'
  } else if (error) {
    borderClass = 'border-solid border-red-500'
    bgClass = 'bg-red-50 dark:bg-red-950/20'
  } else if (isDragActive) {
    borderClass = 'border-solid border-primary'
    bgClass = 'bg-primary/5'
  }

  return (
    <div
      {...getRootProps()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={label}
      aria-describedby={error ? 'dropzone-error' : undefined}
      className={`relative w-full rounded-2xl border-2 p-6 sm:p-8 transition-colors flex flex-col items-center justify-center min-h-[200px] outline-none focus-visible-ring ${borderClass} ${bgClass} ${className} ${disabled ? '' : 'cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
    >
      <input {...getInputProps()} aria-label={`${label} file input`} />
      <UploadCloud
        className={`w-12 h-12 mb-4 ${isDragActive ? 'text-primary animate-pulse' : 'text-gray-400'}`}
        aria-hidden="true"
      />
      <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
        {isDragActive ? 'Drop your file now' : label}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 text-center">
        {sublabel}
      </p>
      {error && (
        <p id="dropzone-error" role="alert" className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 mt-4 text-center">
          {error}
        </p>
      )}
    </div>
  )
}

export default DropZone
