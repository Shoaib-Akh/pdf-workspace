import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Trash2, Download, CheckCircle2 } from 'lucide-react'
import { deletePages } from '@/services/pdf/pdfOrganizer'
import { downloadBlob } from '@/lib/utils'

function parsePageNumbers(input: string): number[] {
  const pages = new Set<number>()
  const parts = input.split(/[,;\s]+/)
  for (const part of parts) {
    if (!part) continue
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          if (i > 0) pages.add(i)
        }
      }
    } else {
      const num = Number(part)
      if (!isNaN(num) && num > 0) {
        pages.add(num)
      }
    }
  }
  return Array.from(pages).sort((a, b) => a - b)
}

export default function DeletePdfPagesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pagesToDelete, setPagesToDelete] = useState('2, 4')
  const [isProcessing, setIsProcessing] = useState(false)
  const [applied, setApplied] = useState(false)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setApplied(false)
      setResultBlob(null)
      setErrorMsg('')
    }
  }

  const handleDelete = async () => {
    if (!file) return
    const nums = parsePageNumbers(pagesToDelete)
    if (nums.length === 0) {
      setErrorMsg('Please specify at least one valid page number to delete.')
      return
    }
    setIsProcessing(true)
    setErrorMsg('')
    try {
      const blob = await deletePages(file, nums)
      setResultBlob(blob)
      setApplied(true)
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Failed to delete pages from PDF. Please check your page numbers.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob || !file) return
    const name = file.name.replace(/\.[^/.]+$/, '') + '-trimmed.pdf'
    downloadBlob(resultBlob, name)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Delete PDF Pages — Remove Pages from PDF"
        description="Delete unwanted pages, cover sheets, and blank dividers from PDF documents online. Fast, secure, and client-side."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Delete PDF Pages — Remove Unwanted Pages
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Quickly remove blank pages, redundant covers, and sensitive sheets from your PDF document without uploading files to any external server.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to remove pages"
              sublabel="In-browser page pruning — 100% private"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center font-bold">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null)
                    setApplied(false)
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                >
                  Change File
                </button>
              </div>

              {/* Delete Options UI */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Pages to Delete (comma-separated or ranges)
                </label>
                <input
                  type="text"
                  value={pagesToDelete}
                  onChange={(e) => setPagesToDelete(e.target.value)}
                  placeholder="e.g. 2, 4-6, 9"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono"
                />
                <p className="text-[11px] text-gray-500">
                  Example: <code>1, 3, 5-7</code> removes page 1, page 3, and pages 5 through 7.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleDelete}
                  disabled={isProcessing || !pagesToDelete}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Removing pages...' : 'Apply Deletion'}
                </button>
              </div>

              {applied && (
                <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Pages ({pagesToDelete}) removed successfully.
                  </div>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" /> Download Trimmed PDF
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/extract-pdf-pages" className="text-sm text-blue-600 hover:underline">
              Extract PDF Pages &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/reorder-pdf-pages" className="text-sm text-blue-600 hover:underline">
              Reorder PDF Pages &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
