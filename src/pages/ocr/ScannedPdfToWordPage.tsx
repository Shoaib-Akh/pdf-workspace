import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import { Link } from 'react-router-dom'
import {
  Sparkles, Download, ShieldCheck, CheckCircle, RefreshCw,
  AlertCircle, FileText, ArrowRight
} from 'lucide-react'
import { runBrowserOcr, type OcrProgress } from '@/services/ocr/ocrEngine'
import { Progress } from '@/components/ui/progress'

export default function ScannedPdfToWordPage() {
  const [file, setFile] = useState<File | null>(null)
  const [ocrText, setOcrText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<OcrProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [wordBlob, setWordBlob] = useState<Blob | null>(null)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setOcrText('')
      setError(null)
      setProgress(null)
      setWordBlob(null)
    }
  }

  const handleRunOcr = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setOcrText('')
    setWordBlob(null)

    try {
      const result = await runBrowserOcr(file, {
        language: 'eng',
        maxPages: 10,
        onProgress: (p) => setProgress(p),
      })
      setOcrText(result.fullText)

      // Build real .docx using docx library
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx')

      const lines = result.fullText.split('\n')
      const paragraphs = lines.map((line) => {
        const text = line.trim()
        if (!text) {
          return new Paragraph({ children: [], spacing: { after: 80 } })
        }
        // Simple heading heuristic: short ALL-CAPS lines become headings
        const isHeading = text.length < 60 && text === text.toUpperCase() && /[A-Z]/.test(text)
        return new Paragraph({
          children: [new TextRun({ text, bold: isHeading })],
          heading: isHeading ? HeadingLevel.HEADING_2 : undefined,
          spacing: { after: 120 },
        })
      })

      const doc = new Document({
        creator: 'PDF Workspace',
        title: file.name.replace(/\.pdf$/i, ''),
        sections: [{ properties: {}, children: paragraphs }],
      })

      const blob = await Packer.toBlob(doc)
      setWordBlob(blob)
    } catch (err: any) {
      setError(err.message || 'OCR recognition failed.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadWord = () => {
    if (!wordBlob || !file) return
    const url = URL.createObjectURL(wordBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.pdf$/i, '')}_ocr.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null)
    setOcrText('')
    setWordBlob(null)
    setError(null)
    setProgress(null)
  }

  const wordCount = ocrText ? ocrText.split(/\s+/).filter(Boolean).length : 0

  return (
    <PageLayout>
      <MetaTags
        title="Scanned PDF to Word — OCR PDF to Editable DOCX Online Free"
        description="Convert scanned PDF documents and images to editable Microsoft Word (.docx) files using browser-based OCR. Runs on your device with 100% privacy."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            Scanned PDF to Word — OCR to Editable DOCX
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert scanned PDFs, photographed documents, and image-based PDFs into editable Microsoft Word (.docx) files
            using browser-based OCR. No uploads, 100% free.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-sm space-y-6">
          {!wordBlob && !isProcessing && (
            <>
              {!file ? (
                <DropZone
                  onFileSelect={handleFileSelect}
                  label="Select a scanned PDF or image"
                  sublabel="Supports PDF, JPG, PNG — OCR runs on your device (max 10 pages)"
                />
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="w-8 h-8 text-purple-500 flex-shrink-0" />
                      <div className="truncate">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={reset} className="text-xs text-red-600 hover:underline ml-2 shrink-0">Remove</button>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                    </div>
                  )}

                  <button
                    onClick={handleRunOcr}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Run OCR &amp; Convert to Word
                  </button>
                </div>
              )}
            </>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="text-center space-y-5 py-6">
              <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Running OCR…</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {progress ? `Page ${progress.currentPage} of ${progress.totalPages} — ${progress.percent}%` : 'Initializing Tesseract…'}
                </p>
              </div>
              {progress && (
                <div className="max-w-sm mx-auto space-y-1">
                  <Progress value={progress.percent} className="h-2" />
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {wordBlob && file && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-3 text-green-800 dark:text-green-300">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Word document ready!</p>
                  <p className="text-xs text-green-600 mt-0.5">{wordCount} words recognized and formatted</p>
                </div>
              </div>

              {/* Preview */}
              {ocrText && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">OCR Preview:</p>
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {ocrText.slice(0, 500)}{ocrText.length > 500 ? '…' : ''}
                  </pre>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadWord}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Word Document (.docx)
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Convert Another File
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>100% private — OCR runs on your device, files never uploaded</span>
          </div>
        </div>

        {/* Related tools */}
        <div className="rounded-2xl border border-zinc-200 dark:border-gray-800 bg-zinc-50/70 dark:bg-gray-800/40 p-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-3">Related Tools</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'OCR PDF', to: '/ocr-pdf' },
              { label: 'Scanned PDF to Text', to: '/scanned-pdf-to-text' },
              { label: 'Scanned PDF to Excel', to: '/scanned-pdf-to-excel' },
              { label: 'PDF to Word', to: '/pdf-to-word' },
              { label: 'PDF to Text', to: '/pdf-to-txt' },
            ].map((tag) => (
              <Link
                key={tag.label}
                to={tag.to}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-gray-300 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all"
              >
                <span>{tag.label}</span>
                <ArrowRight className="h-3 w-3 text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
