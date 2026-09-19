import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Download,
  CheckCircle2,
  Shield,
  ArrowRight,
  X,
  FileCode,
  AlertTriangle,
} from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { MetaTags } from '@/components/seo/MetaTags'
import { JsonLd, buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { WORD_TO_PDF_KEYWORDS, WORD_TO_PDF_POPULAR_SEARCHES } from '@/data/seoKeywords'
import { Progress } from '@/components/ui/progress'
import { convertWordToPdf, type WordConversionProgress } from '@/services/conversion/wordConverter'

export const WORD_TO_PDF_FAQS = [
  {
    q: 'How to convert a Word document to PDF online for free?',
    a: 'Upload your Microsoft Word (.docx or .doc) file, click "Convert to PDF", and download your PDF in seconds. All processing runs privately in your browser — no file uploads, no server.',
  },
  {
    q: 'Does it keep my Word formatting — bold, headings, tables?',
    a: 'Yes. The converter uses the mammoth engine to parse your DOCX XML and render bold, italic, headings (H1–H3), lists, and tables before converting them into a clean PDF layout.',
  },
  {
    q: 'Is it safe to convert confidential Word documents here?',
    a: '100% safe. Every conversion runs locally inside your browser using WebAssembly and JavaScript. Your documents never leave your device.',
  },
  {
    q: 'Are there any fees or conversion limits?',
    a: 'No fees, no subscriptions, no daily limits. Convert as many Word documents to PDF as you need, completely free.',
  },
]

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState<WordConversionProgress | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [paragraphCount, setParagraphCount] = useState(0)
  const [warnings, setWarnings] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setResultBlob(null)
      setError(null)
      setWarnings([])
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setIsConverting(true)
    setResultBlob(null)
    setError(null)
    setWarnings([])

    try {
      const result = await convertWordToPdf(file, (p) => setProgress(p))
      setResultBlob(result.blob)
      setParagraphCount(result.paragraphCount)
      setWarnings(result.warnings.slice(0, 3))
    } catch (err: any) {
      console.error('Word to PDF error:', err)
      setError(err.message || 'Conversion failed. Please ensure the file is a valid .docx or .doc file.')
    } finally {
      setIsConverting(false)
      setProgress(null)
    }
  }

  const handleDownload = () => {
    if (!resultBlob || !file) return
    const url = URL.createObjectURL(resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.(docx?|doc)$/i, '')}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null)
    setResultBlob(null)
    setParagraphCount(0)
    setWarnings([])
    setError(null)
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Convert', href: '/convert' },
        { label: 'Word to PDF' },
      ]}
    >
      <MetaTags
        title="Word to PDF Converter Online Free — Convert DOCX / DOC to PDF"
        description="Convert Microsoft Word documents (DOCX, DOC) to PDF online for free. Preserves bold, headings, and tables. Runs directly in your browser with zero file uploads."
        keywords={WORD_TO_PDF_KEYWORDS}
        canonical={`${APP_CONFIG.url}/word-to-pdf`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online Word to PDF Converter',
          description: 'Convert Word DOCX and DOC files into PDF documents for free in your browser.',
          url: `${APP_CONFIG.url}/word-to-pdf`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          WORD_TO_PDF_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            100% Private — Runs In Your Browser
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Word to PDF Converter — Convert DOCX &amp; DOC Online Free
          </h1>
          <p className="text-base text-zinc-600 dark:text-gray-300 leading-relaxed">
            Convert Microsoft Word documents (.docx, .doc) into PDF files instantly.
            Preserves bold, headings, tables, and lists. No watermarks, no account required.
          </p>
        </div>

        {/* Quick shortcut tags */}
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {WORD_TO_PDF_POPULAR_SEARCHES.slice(0, 7).map((sc) => (
            <Link
              key={sc.label}
              to={sc.to}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-100 hover:bg-brand-50 hover:text-brand-700 text-zinc-600 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium transition-colors"
            >
              <span>{sc.label}</span>
              <ArrowRight className="w-3 h-3 text-zinc-400" />
            </Link>
          ))}
        </div>

        {/* Upload / Convert / Result */}
        {!resultBlob && !isConverting && (
          <div className="space-y-6">
            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-300 rounded-2xl cursor-pointer bg-zinc-50 hover:border-brand-400 hover:bg-brand-50/40 transition-all dark:bg-gray-900 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-zinc-700 dark:text-gray-200">
                    Click to select a Word file (.docx, .doc), or drag &amp; drop
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-gray-400">
                    Supports DOCX and DOC — processed on your device
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-gray-800 p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-gray-800 rounded-xl border border-zinc-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white block truncate">{file.name}</span>
                      <span className="text-xs text-zinc-400">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-gray-800">
                  <button
                    onClick={handleConvert}
                    className="px-6 py-2.5 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 flex items-center shadow-sm transition-all"
                  >
                    <FileCode className="w-4 h-4 mr-2" />
                    Convert to PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Converting progress */}
        {isConverting && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-gray-800 p-8 text-center space-y-5">
            <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Converting Word Document…</h3>
              <p className="text-sm text-zinc-500 dark:text-gray-400 mt-1">
                {progress?.stage ?? 'Parsing document structure…'}
              </p>
            </div>
            {progress && (
              <div className="max-w-sm mx-auto space-y-1">
                <Progress value={progress.percent} className="h-2" />
                <p className="text-xs text-zinc-400 text-right">{progress.percent}%</p>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {resultBlob && file && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900 p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Conversion Complete!</h3>
              <p className="text-zinc-600 dark:text-gray-300 mt-1 text-sm font-medium">
                {file.name.replace(/\.(docx?|doc)$/i, '')}.pdf — {(resultBlob.size / 1024).toFixed(1)} KB
              </p>
              {paragraphCount > 0 && (
                <p className="text-xs text-zinc-400 mt-0.5">
                  Processed {paragraphCount} paragraphs and content blocks
                </p>
              )}
            </div>

            {warnings.length > 0 && (
              <div className="text-left p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-700 dark:text-amber-300 space-y-1">
                <p className="font-semibold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Formatting Notes:</p>
                {warnings.map((w, i) => <p key={i} className="ml-5">• {w}</p>)}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 flex items-center shadow-sm transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF Document
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-white dark:bg-gray-800 text-zinc-700 dark:text-gray-200 font-semibold text-sm rounded-xl hover:bg-zinc-50 dark:hover:bg-gray-700 border border-zinc-300 dark:border-gray-700 transition-colors"
              >
                Convert Another Document
              </button>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-12 space-y-8 border-t border-zinc-200 dark:border-gray-800 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 dark:bg-gray-900 rounded-2xl p-6 border border-zinc-200 dark:border-gray-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-3">How to Convert Word to PDF</h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 dark:text-gray-300 text-sm">
                <li>Select your Word document (.docx or .doc)</li>
                <li>Click <strong>Convert to PDF</strong></li>
                <li>The engine renders your text, headings and tables into PDF layout</li>
                <li>Download your ready-to-share PDF instantly</li>
              </ol>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-700" />
                100% Private &amp; In-Browser
              </h3>
              <p className="text-emerald-800 dark:text-emerald-200 text-sm leading-relaxed">
                Your Word documents are parsed locally using JavaScript and WebAssembly.
                Business plans, resumes, and legal papers never leave your computer.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {WORD_TO_PDF_FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                  <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{faq.q}</h4>
                  <p className="text-zinc-600 dark:text-gray-300 text-sm mt-1.5 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          <div className="rounded-2xl border border-zinc-200 dark:border-gray-800 bg-zinc-50/70 dark:bg-gray-800/40 p-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">Related Tools</h4>
            <div className="flex flex-wrap gap-2 mt-3">
              {WORD_TO_PDF_POPULAR_SEARCHES.map((tag) => (
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
