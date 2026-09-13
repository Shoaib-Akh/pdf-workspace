import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import { Link } from 'react-router-dom'
import { Sparkles, Download, Copy, Check, Info, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { runBrowserOcr, type OcrResult, type OcrProgress, MAX_BROWSER_OCR_PAGES } from '@/services/ocr/ocrEngine'
import { Progress } from '@/components/ui/progress'

export default function OcrPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null)
  const [ocrText, setOcrText] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState<OcrProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('eng')

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setOcrResult(null)
      setOcrText('')
      setError(null)
      setProgress(null)
    }
  }

  const handleRunOcr = async () => {
    if (!file) return
    setIsRunning(true)
    setError(null)
    setOcrResult(null)
    setOcrText('')

    try {
      const result = await runBrowserOcr(file, {
        language: selectedLanguage,
        maxPages: MAX_BROWSER_OCR_PAGES,
        onProgress: (p) => setProgress(p),
      })
      setOcrResult(result)
      setOcrText(result.fullText)
    } catch (err: any) {
      setError(err.message || 'OCR processing failed. The file may be corrupt or encrypted.')
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopy = () => {
    if (!ocrText) return
    navigator.clipboard.writeText(ocrText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!ocrText || !file) return
    const blob = new Blob([ocrText], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.pdf$/i, '')}_ocr.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <PageLayout>
      <MetaTags
        title="OCR PDF — Convert Scanned PDF to Searchable Text"
        description="Run client-side OCR on scanned PDFs using Tesseract.js. Turn non-selectable scans, receipts, and images into clean, searchable, editable text."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            OCR PDF — Extract Text from Scanned Documents
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Harnessing client-side optical character recognition powered by <strong>Tesseract.js</strong> and WebAssembly, our browser OCR engine reads scanned contracts, paper receipts, and document scans directly on your device.
          </p>
        </div>

        {/* Capability disclosure box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl flex items-start space-x-3 text-xs md:text-sm text-blue-900 dark:text-blue-200">
          <Info className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Browser OCR Capabilities & Limits</p>
            <p className="text-blue-800 dark:text-blue-300">
              <strong>Local Browser Execution:</strong> English optical character recognition processed up to {MAX_BROWSER_OCR_PAGES} pages per run to protect browser memory. Files are processed 100% locally and never sent to a server. High-volume batch OCR and cloud multi-language pipelines are available via our server API provider.
            </p>
          </div>
        </div>

        {/* Action Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your scanned PDF here to run OCR"
              sublabel="Client-side optical character recognition — confidential files stay on your device"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center font-bold text-sm">
                    OCR
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for OCR</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    aria-label="OCR Language"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    disabled={isRunning}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <option value="eng">English (eng)</option>
                  </select>

                  <button
                    onClick={() => {
                      setFile(null)
                      setOcrResult(null)
                      setOcrText('')
                      setProgress(null)
                      setError(null)
                    }}
                    disabled={isRunning}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition disabled:opacity-50"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleRunOcr}
                    disabled={isRunning}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Recognizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Run OCR
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Indicator */}
              {isRunning && progress && (
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-medium text-amber-900 dark:text-amber-200">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      {progress.stage}
                    </span>
                    <span>{progress.percent}%</span>
                  </div>
                  <Progress value={progress.percent} className="h-2" />
                  {progress.totalPages > 0 && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 text-right">
                      Page {progress.currentPage} of {progress.totalPages}
                    </p>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-3 text-sm text-red-800 dark:text-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">OCR Process Error</p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Result Area */}
              {ocrResult && (
                <div className="space-y-4">
                  {/* Summary Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>
                        Recognized {ocrResult.pageCount} page(s) • Average Confidence: <strong>{ocrResult.averageConfidence}%</strong>
                      </span>
                    </div>
                    {ocrResult.truncatedDueToLimit && (
                      <span className="text-amber-700 dark:text-amber-300">
                        (First {MAX_BROWSER_OCR_PAGES} pages processed)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" /> OCR Output Text
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy Text'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Download .txt
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={ocrText}
                    onChange={(e) => setOcrText(e.target.value)}
                    className="w-full p-4 font-mono text-xs md:text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed text-gray-800 dark:text-gray-200"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Links */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related OCR Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/scanned-pdf-to-text" className="text-sm text-blue-600 hover:underline">
              Scanned PDF to Text &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/pdf-to-txt" className="text-sm text-blue-600 hover:underline">
              Digital PDF to Text &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/scanned-pdf-to-word" className="text-sm text-blue-600 hover:underline">
              Scanned PDF to Word &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/scanned-pdf-to-excel" className="text-sm text-blue-600 hover:underline">
              Scanned PDF to Excel &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
