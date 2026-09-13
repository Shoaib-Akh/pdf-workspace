import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import { Link } from 'react-router-dom'
import { Sparkles, Download, Copy, Check, FileText, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { runBrowserOcr, type OcrResult, type OcrProgress, MAX_BROWSER_OCR_PAGES } from '@/services/ocr/ocrEngine'
import { Progress } from '@/components/ui/progress'

export default function ScannedPdfToTextPage() {
  const [file, setFile] = useState<File | null>(null)
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<OcrProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setOcrResult(null)
      setExtractedText('')
      setError(null)
      setProgress(null)
    }
  }

  const handleExtract = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setOcrResult(null)
    setExtractedText('')

    try {
      const result = await runBrowserOcr(file, {
        language: 'eng',
        maxPages: MAX_BROWSER_OCR_PAGES,
        onProgress: (p) => setProgress(p),
      })
      setOcrResult(result)
      setExtractedText(result.fullText)
    } catch (err: any) {
      setError(err.message || 'Scanned text recognition failed.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = () => {
    if (!extractedText) return
    navigator.clipboard.writeText(extractedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!extractedText || !file) return
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.pdf$/i, '')}_scanned_text.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Scanned PDF to Text — OCR Text Extraction"
        description="Convert scanned PDFs, camera photos, and physical documents into editable plain text with optical character recognition."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Scanned PDF to Text — OCR Text Extraction
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Extract text from image-only PDFs, scanned contracts, receipts, and archived records directly in your browser.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your scanned PDF here"
              sublabel="Client-side OCR recognition for scans and photographs"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setFile(null)
                      setOcrResult(null)
                      setExtractedText('')
                      setProgress(null)
                      setError(null)
                    }}
                    disabled={isProcessing}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition disabled:opacity-50"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleExtract}
                    disabled={isProcessing}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Processing Scan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Extract Text
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {isProcessing && progress && (
                <div className="p-4 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-medium text-blue-900 dark:text-blue-200">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      {progress.stage}
                    </span>
                    <span>{progress.percent}%</span>
                  </div>
                  <Progress value={progress.percent} className="h-2" />
                  {progress.totalPages > 0 && (
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 text-right">
                      Processing Page {progress.currentPage} of {progress.totalPages}
                    </p>
                  )}
                </div>
              )}

              {/* Error Box */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-3 text-sm text-red-800 dark:text-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Extraction Failed</p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Result Area */}
              {ocrResult && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>
                        Extracted {ocrResult.pageCount} page(s) • Quality Confidence: <strong>{ocrResult.averageConfidence}%</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Extracted Text Content
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Save .txt
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="w-full p-4 font-mono text-xs md:text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed text-gray-800 dark:text-gray-200"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Informational Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">When to use OCR</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Standard converters fail when a PDF is a scanned image without an underlying font glyph layer. Scanned PDF to Text runs raster analysis to construct copyable characters.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">Privacy Guarantee</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Optical character recognition computes inside your browser tab via WebAssembly. Neither your original scanned file nor the extracted text ever leaves your machine.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
