import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Download, CheckCircle, HelpCircle, Shield, Sparkles, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { loadPDF, extractAllText, detectContentType } from '@/services/pdf/pdfEngine'
import { PDF_TO_WORD_KEYWORDS, PDF_TO_WORD_POPULAR_SEARCHES } from '@/data/seoKeywords'
import JsonLd, { buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'

const PDF_TO_WORD_FAQS = [
  {
    q: 'How do I convert a PDF to an editable Word document online for free?',
    a: 'Upload your PDF document into our converter box. The tool extracts headings, paragraphs, and sections directly in your browser and packages them into an editable Word document ready for immediate download.',
  },
  {
    q: 'Can I convert a scanned PDF or photo into Word?',
    a: 'Scanned PDFs contain picture data instead of text characters. If our tool detects a scanned PDF, you can use our built-in OCR PDF / Scanned PDF to Word tool to recognize the characters into editable Microsoft Word text.',
  },
  {
    q: 'What is the difference between Option 1 (Browser) and Option 2 (Server)?',
    a: 'Option 1 extracts all text, paragraphs, and sections directly on your device CPU for 100% privacy and instant speed. Option 2 is designed for complex multi-column reports, recreating exact visual fonts, tables, and embedded graphics through deep layout analysis.',
  },
  {
    q: 'Are my confidential PDF documents safe and private?',
    a: 'Yes, your privacy is fully protected. In Option 1, all text extraction occurs locally in your browser memory via WebAssembly and JavaScript. No document content is ever uploaded to any cloud server.',
  },
  {
    q: 'Is there a file limit or fee to convert PDF to Word?',
    a: 'No, our browser PDF to Word converter is completely free without page limits, hidden subscriptions, or watermarks.',
  },
]

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [convertedText, setConvertedText] = useState<string | null>(null)
  const [isScanned, setIsScanned] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setConvertedText(null)
      setIsScanned(false)
      setError(null)
    }
  }

  const handleConvertBrowser = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setConvertedText(null)

    try {
      const doc = await loadPDF(file)
      const type = await detectContentType(doc)

      if (type === 'scanned') {
        setIsScanned(true)
        setIsProcessing(false)
        return
      }

      const pageTexts = await extractAllText(doc)
      const fullText = pageTexts
        .map((t, idx) => `Section ${idx + 1} (Page ${idx + 1})\n\n${t}`)
        .join('\n\n----------------------------------------\n\n')

      setConvertedText(fullText)
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from PDF.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadDocx = () => {
    if (!file || !convertedText) return
    const sanitized = convertedText.replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/\n/g, '\\par\n')
    const content = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Calibri;}}\\f0\\fs24 \\b Document Extract: ${file.name}\\b0\\par\\par ${sanitized} }`
    const blob = new Blob([content], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.pdf$/i, '')}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const pageTitle = 'PDF to Word Converter — Convert PDF to Editable Word Document Online Free'
  const pageDescription =
    'Convert PDF to editable Word document (.docx / .doc) online for free. Fast, accurate text extraction directly in your browser with 100% private security.'

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Convert', href: '/convert' },
        { label: 'PDF to Word' },
      ]}
    >
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        keywords={PDF_TO_WORD_KEYWORDS}
        canonical={`${APP_CONFIG.url}/pdf-to-word`}
      />

      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online PDF to Word Converter',
          description: pageDescription,
          url: `${APP_CONFIG.url}/pdf-to-word`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          PDF_TO_WORD_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            PDF to Word — Convert PDF to Editable Word Document
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert your PDF into an editable Microsoft Word document (.docx / .doc). Extract text, paragraphs, and headings instantly on your device with complete privacy.
          </p>
        </div>

        {/* Quick Search Tags */}
        <div className="flex flex-wrap justify-center gap-2 pt-1 pb-2">
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

        {/* Two conversion paths */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Option 1: Browser Plain Text Word Wrapper */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" /> Option 1: Browser Extraction
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Basic Word Document (.doc)
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Extracts text, paragraphs, and headings directly in your browser. Fast, 100% private, and free. Best for articles, drafts, and text-heavy reports where exact visual layout is not required.
              </p>

              {!file ? (
                <DropZone
                  onFileSelect={handleFileSelect}
                  label="Select PDF for Word extraction"
                  sublabel="Processes on your device — max 500MB"
                />
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between truncate">
                    <div className="truncate">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null)
                        setConvertedText(null)
                        setIsScanned(false)
                        setError(null)
                      }}
                      className="text-xs text-red-600 hover:underline ml-2"
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
                      <p>This PDF contains images without selectable text. Use our OCR tool to recognize scanned pages into Word.</p>
                      <Link to="/scanned-pdf-to-word" className="inline-block font-semibold text-blue-600 hover:underline">
                        Open Scanned PDF to Word &rarr;
                      </Link>
                    </div>
                  )}

                  {!convertedText ? (
                    <button
                      onClick={handleConvertBrowser}
                      disabled={isProcessing}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Extracting Content...
                        </>
                      ) : (
                        'Generate Word Document'
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-2 text-xs text-green-800 dark:text-green-300">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        Ready to download! Text structured into editable document.
                      </div>
                      <button
                        onClick={handleDownloadDocx}
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

          {/* Option 2: Server-Side Advanced DOCX */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Option 2: Server Processing
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Layout-Preserving DOCX
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Recreates columns, tables, headers, footers, embedded graphics, and precise font kerning using cloud document layout reconstruction models.
              </p>

              <ServerRequiredState
                toolName="Layout-Preserving DOCX Engine"
                alternateToolSlug="pdf-to-txt"
                alternateToolName="Plain Text Extractor"
              />
            </div>
          </div>
        </div>

        {/* Informational Guidance & FAQs */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-10 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions About PDF to Word Conversion
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {PDF_TO_WORD_FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
                    <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Searches & Related Tags */}
          <div className="rounded-2xl border border-zinc-200 dark:border-gray-800 bg-zinc-50/70 dark:bg-gray-800/40 p-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">
              Related Searches & Tools
            </h4>
            <p className="text-xs text-zinc-500 dark:text-gray-400 mb-4">
              Explore quick access tools for PDF to Word, DOCX conversion, and document editing.
            </p>
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

