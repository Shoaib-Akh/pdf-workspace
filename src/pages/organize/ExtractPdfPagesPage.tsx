import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { FileOutput, Download, CheckCircle2 } from 'lucide-react'

export default function ExtractPdfPagesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pagesToExtract, setPagesToExtract] = useState('1, 3-4')
  const [mode, setMode] = useState<'single' | 'split'>('single')
  const [isProcessing, setIsProcessing] = useState(false)
  const [extracted, setExtracted] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setExtracted(false)
    }
  }

  const handleExtract = () => {
    if (!file) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setExtracted(true)
    }, 750)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Extract PDF Pages — Save Specific Pages as PDF"
        description="Extract specific pages from a PDF document into a new PDF file. Choose custom page ranges or separate individual pages."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Extract PDF Pages — Split & Save Specific Pages
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Select specific chapters, single exhibits, or page ranges to extract into a clean standalone PDF file directly in your browser.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to extract pages"
              sublabel="Browser-powered page slicing — 100% private"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                    <FileOutput className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null)
                    setExtracted(false)
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                >
                  Change File
                </button>
              </div>

              {/* Extract Options UI */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Pages to Extract
                  </label>
                  <input
                    type="text"
                    value={pagesToExtract}
                    onChange={(e) => setPagesToExtract(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8"
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Extraction Mode
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
                  >
                    <option value="single">Combine into 1 PDF</option>
                    <option value="split">Separate into individual PDFs</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleExtract}
                  disabled={isProcessing || !pagesToExtract}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Extracting pages...' : 'Apply Extraction'}
                </button>
              </div>

              {extracted && (
                <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Pages ({pagesToExtract}) extracted successfully!
                  </div>
                  <button
                    onClick={() => alert('Downloading extracted pages...')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" /> Download Extracted PDF
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
            <Link to="/delete-pdf-pages" className="text-sm text-blue-600 hover:underline">
              Delete PDF Pages &rarr;
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
