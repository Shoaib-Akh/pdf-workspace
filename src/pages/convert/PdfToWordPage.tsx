import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import { Link } from 'react-router-dom'
import { Download, CheckCircle, HelpCircle, Shield, AlertCircle, RefreshCw, ArrowRight, FileText } from 'lucide-react'
import { convertPdfToDocx, type PdfToDocxProgress } from '@/services/conversion/pdfToDocxConverter'
import { PDF_TO_WORD_KEYWORDS, PDF_TO_WORD_POPULAR_SEARCHES } from '@/data/seoKeywords'
import JsonLd, { buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import { Progress } from '@/components/ui/progress'

const PDF_TO_WORD_FAQS = [
  {
    q: 'How do I convert a PDF to an editable Word document online for free?',
    a: 'Upload your PDF, click Convert to Word, and download a real .docx file. The tool extracts headings, paragraphs, and text directly in your browser and packages them into an editable Word document.',
  },
  {
    q: 'Does the Word document keep the original text structure?',
    a: 'Yes. The converter uses font-size analysis to detect headings (H1, H2) and groups text by position to reconstruct paragraphs, so you get a clean, editable .docx file.',
  },
  {
    q: 'Can I convert a scanned PDF or photo into Word?',
    a: 'Scanned PDFs contain images instead of text. Use our Scanned PDF to Word tool which runs OCR (Tesseract) to recognize and convert scanned pages into editable Word text.',
  },
  {
    q: 'Are my confidential PDF documents safe and private?',
    a: 'Yes. All text extraction and .docx generation occurs locally in your browser memory via WebAssembly and JavaScript. No document content is ever uploaded to any server.',
  },
  {
    q: 'Is there a file limit or fee to convert PDF to Word?',
    a: 'No fees, no page limits, and no watermarks. Our browser PDF to Word converter is completely free.',
  },
]

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<PdfToDocxProgress | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [paragraphCount, setParagraphCount] = useState(0)
  const [isScanned, setIsScanned] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setResultBlob(null)
      setIsScanned(false)
      setError(null)
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setResultBlob(null)
    setIsScanned(false)

    try {
      const result = await convertPdfToDocx(file, (p) => setProgress(p))
      if (result.paragraphCount === 0) {
        setIsScanned(true)
      } else {
        setResultBlob(result.blob)
        setParagraphCount(result.paragraphCount)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to convert PDF to Word document.')
    } finally {
      setIsProcessing(false)
      setProgress(null)
    }
  }

  const handleDownload = () => {
    if (!resultBlob || !file) return
    const url = URL.createObjectURL(resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.pdf$/i, '')}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null)
    setResultBlob(null)
    setParagraphCount(0)
    setIsScanned(false)
    setError(null)
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Convert', href: '/convert' },
        { label: 'PDF to Word' },
      ]}
    >
      <MetaTags
        title="PDF to Word Converter — Convert PDF to Editable Word Document Online Free"
        description="Convert PDF to editable Word document (.docx) online for free. Extracts headings, paragraphs and structure directly in your browser with 100% privacy."
        keywords={PDF_TO_WORD_KEYWORDS}
        canonical={`${APP_CONFIG.url}/pdf-to-word`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online PDF to Word Converter',
          description: 'Convert PDF to real .docx Word document in the browser. No server, no uploads.',
          url: `${APP_CONFIG.url}/pdf-to-word`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          PDF_TO_WORD_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            PDF to Word — Convert PDF to Editable Word Document
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert your PDF into a real editable Microsoft Word document (.docx). Detects headings, paragraphs, and text structure. Runs instantly on your device with 100% privacy.
          </p>
        </div>

        {/* Quick Search Tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {PDF_TO_WORD_POPULAR_SEARCHES.slice(0, 6).map((sc) => (
            <Link
              key={sc.label}
              to={sc.to}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-100 hover:bg-brand-50 hover:text-brand-700 text-zinc-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-xs font-medium transition-colors"
            >
              <span>{sc.label}</span>
              <ArrowRight className="w-3 h-3 text-zinc-400" />
            </Link>
          ))}
        </div>

        {/* Main converter card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-sm space-y-6">
          {!resultBlob && !isProcessing && (
            <>
              {!file ? (
                <DropZone
                  onFileSelect={handleFileSelect}
                  label="Select PDF to convert to Word"
                  sublabel="Extracts text, headings and paragraphs — runs on your device"
                />
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                      <div className="truncate">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={reset}
                      className="text-xs text-red-600 hover:underline ml-2 shrink-0"
                    >
                      Remove
                    </button>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  {isScanned && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg space-y-2 text-xs text-amber-800 dark:text-amber-200">
                      <p className="font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" /> Scanned PDF Detected
                      </p>
                      <p>This PDF contains scanned images without selectable text. Use our OCR tool instead.</p>
                      <Link to="/scanned-pdf-to-word" className="inline-block font-semibold text-blue-600 hover:underline">
                        Open Scanned PDF to Word →
                      </Link>
                    </div>
                  )}

                  <button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Convert to Word (.docx)
                  </button>
                </div>
              )}
            </>
          )}

          {/* Processing state */}
          {isProcessing && (
            <div className="text-center space-y-5 py-6">
              <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Converting PDF to Word…</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{progress?.stage ?? 'Processing…'}</p>
              </div>
              {progress && (
                <div className="max-w-sm mx-auto space-y-1">
                  <Progress value={progress.percent} className="h-2" />
                  <p className="text-xs text-gray-400 text-right">{progress.percent}%</p>
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {resultBlob && file && (
            <div className="space-y-4 text-center">
              <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-lg flex items-center justify-center gap-2 text-sm text-green-800 dark:text-green-300">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-semibold">Word document ready!</span>
                <span className="text-xs text-green-600">({paragraphCount} paragraphs extracted)</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Word Document (.docx)
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Convert Another PDF
                </button>
              </div>
            </div>
          )}

          {/* Privacy badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Shield className="w-4 h-4 text-green-500" />
            <span>100% private — your file never leaves your browser</span>
          </div>
        </div>

        {/* FAQs */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-10 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {PDF_TO_WORD_FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
                  <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Related tags */}
          <div className="rounded-2xl border border-zinc-200 dark:border-gray-800 bg-zinc-50/70 dark:bg-gray-800/40 p-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-3">Related Tools</h4>
            <div className="flex flex-wrap gap-2">
              {PDF_TO_WORD_POPULAR_SEARCHES.map((tag) => (
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
      </div>
    </PageLayout>
  )
}
