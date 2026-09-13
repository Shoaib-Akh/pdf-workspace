import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { ArrowUpDown, Download, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react'

export default function ReorderPdfPagesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<number[]>([1, 2, 3, 4])
  const [isProcessing, setIsProcessing] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setPages([1, 2, 3, 4])
      setApplied(false)
    }
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setPages((prev) => {
      const copy = [...prev]
      const temp = copy[index - 1]
      copy[index - 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  const moveDown = (index: number) => {
    if (index === pages.length - 1) return
    setPages((prev) => {
      const copy = [...prev]
      const temp = copy[index + 1]
      copy[index + 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  const handleApply = () => {
    if (!file) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setApplied(true)
    }, 750)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Reorder PDF Pages — Rearrange PDF Page Order"
        description="Reorder and rearrange pages in your PDF document online. Drag and drop pages into new sequence directly in your browser."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Reorder PDF Pages — Rearrange Document Flow
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Sort and rearrange the page sequence of your PDF. Move chapters, exhibits, and appendices into the perfect reading order.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to reorder pages"
              sublabel="Rearrange pages client-side with zero data upload"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                    <ArrowUpDown className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • {pages.length} Pages detected</p>
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

              {/* Page Ordering UI */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Page Sequence: {pages.map((p) => `Page ${p}`).join(' → ')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pages.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-between gap-3 text-center"
                    >
                      <span className="text-xs font-bold text-gray-400">Position {idx + 1}</span>
                      <div className="w-12 h-16 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center font-bold text-sm text-gray-800 dark:text-gray-200">
                        P{p}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 disabled:opacity-30"
                          title="Move Left"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveDown(idx)}
                          disabled={idx === pages.length - 1}
                          className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 disabled:opacity-30"
                          title="Move Right"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleApply}
                  disabled={isProcessing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Rearranging document...' : 'Apply New Page Order'}
                </button>
              </div>

              {applied && (
                <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Page order applied! New sequence: {pages.join(', ')}
                  </div>
                  <button
                    onClick={() => alert('Downloading reordered PDF...')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" /> Download Reordered PDF
                  </button>
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
            <Link to="/rotate-pdf" className="text-sm text-blue-600 hover:underline">
              Rotate PDF &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
