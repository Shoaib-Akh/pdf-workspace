import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Sparkles, Download, ShieldCheck, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { runBrowserOcr, type OcrProgress } from '@/services/ocr/ocrEngine'
import { Progress } from '@/components/ui/progress'

export default function ScannedPdfToWordPage() {
  const [file, setFile] = useState<File | null>(null)
  const [ocrText, setOcrText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<OcrProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setOcrText('')
      setError(null)
      setProgress(null)
    }
  }

  const handleRunOcr = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setOcrText('')

    try {
      const result = await runBrowserOcr(file, {
        language: 'eng',
        maxPages: 10,
        onProgress: (p) => setProgress(p),
      })
      setOcrText(result.fullText)
    } catch (err: any) {
      setError(err.message || 'Scanned OCR recognition failed.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadWord = () => {
    if (!ocrText || !file) return
    const content = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Calibri;}}\\f0\\fs24 ${ocrText.replace(/\n/g, '\\par ')} }`
    const blob = new Blob([content], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.pdf$/i, '')}_ocr.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Scanned PDF to Word — OCR and Convert to Editable Word"
        description="Convert scanned PDFs and paper documents into editable Word documents (.docx). Client-side text OCR plus advanced layout preservation options."
      />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Scanned PDF to Word — OCR and Word Conversion
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Extract text from scanned paper contracts, receipts, and faxes using client-side OCR, or leverage advanced layout reconstruction to generate formatted Microsoft Word documents (.docx).
          </p>
        </div>

        {/* Dual Mode Display: Browser OCR (Text Word wrapper) + Server DOCX */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Browser OCR Text Word */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Browser OCR & Word Export
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Client-Side OCR Text (.doc)
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Extracts words from scanned pages locally using Tesseract.js and saves directly to an editable Microsoft Word document.
              </p>

              {!file ? (
                <DropZone
                  onFileSelect={handleFileSelect}
                  label="Select scanned PDF for OCR Word conversion"
                  sublabel="Processes on your device — up to 10 pages"
                />
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between truncate">
                    <div className="truncate">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null)
                        setOcrText('')
                        setProgress(null)
                        setError(null)
                      }}
                      disabled={isProcessing}
                      className="text-xs text-red-600 hover:underline ml-2"
                    >
                      Remove
                    </button>
                  </div>

                  {isProcessing && progress && (
                    <div className="space-y-2 p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
                      <div className="flex justify-between text-xs font-medium text-blue-900 dark:text-blue-200">
                        <span className="flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                          {progress.stage}
                        </span>
                        <span>{progress.percent}%</span>
                      </div>
                      <Progress value={progress.percent} className="h-1.5" />
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  {!ocrText ? (
                    <button
                      onClick={handleRunOcr}
                      disabled={isProcessing}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Recognizing Text...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> Run OCR & Prepare Word File
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-2 text-xs text-green-800 dark:text-green-300">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        OCR complete! Ready to download editable document.
                      </div>
                      <button
                        onClick={handleDownloadWord}
                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Download Word Document (.doc)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Server-Side Advanced Formatted DOCX */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> High-Accuracy OCR Reconstruction
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Layout-Preserving DOCX
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Retains exact fonts, stamps, multi-column articles, and table borders from scanned pages into native Word structures.
              </p>

              <ServerRequiredState
                toolName="Scanned Layout-Preserving DOCX Engine"
                alternateToolSlug="ocr-pdf"
                alternateToolName="Client-Side OCR Tool"
              />
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related OCR Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/ocr-pdf" className="text-sm text-blue-600 hover:underline">
              Standard OCR PDF &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/scanned-pdf-to-text" className="text-sm text-blue-600 hover:underline">
              Scanned PDF to Plain Text &rarr;
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
