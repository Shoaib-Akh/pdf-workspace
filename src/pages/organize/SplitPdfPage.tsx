import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UploadCloud,
  File as FileIcon,
  X,
  Download,
  Shield,
  Scissors,
  ArrowRight,
} from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { MetaTags } from '@/components/seo/MetaTags'
import { JsonLd, buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { splitPDF, PageRange } from '@/services/pdf/pdfOrganizer'
import { SPLIT_PDF_KEYWORDS, SPLIT_PDF_POPULAR_SEARCHES } from '@/data/seoKeywords'

export const SPLIT_PDF_FAQS = [
  {
    q: 'How to split PDF pages into multiple files online for free?',
    a: 'Upload your PDF file into the box, enter the custom page intervals you want to separate (for example "1-2, 3-5"), and click "Split PDF". Each part is generated instantly in your browser and ready for one-click download.',
  },
  {
    q: 'Can I separate individual pages or specific page ranges?',
    a: 'Yes. You can specify single pages, ranges, or a combination separated by commas. For example, "1, 3, 5-8" will split the document into three distinct PDF files containing those exact pages.',
  },
  {
    q: 'Is it safe to split confidential PDF documents here?',
    a: 'Yes, 100%. All PDF splitting runs completely inside your web browser via client-side WebAssembly. Your documents are never uploaded to any remote server or third-party cloud.',
  },
  {
    q: 'Are there any limits on file size or page count?',
    a: 'No artificial limits. You can split documents with dozens or hundreds of pages as long as your browser memory permits. It is 100% free with zero watermarks or registration.',
  },
]

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [rangeInput, setRangeInput] = useState('1-2, 3-5')
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultBlobs, setResultBlobs] = useState<Blob[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResultBlobs([])
    }
  }

  const parseRanges = (input: string): PageRange[] => {
    return input
      .split(',')
      .map((part) => {
        const trimmed = part.trim()
        if (trimmed.includes('-')) {
          const [from, to] = trimmed.split('-').map((n) => parseInt(n.trim(), 10))
          return { from, to }
        }
        const num = parseInt(trimmed, 10)
        return { from: num, to: num }
      })
      .filter((r) => !isNaN(r.from) && !isNaN(r.to))
  }

  const handleSplit = async () => {
    if (!file) return
    setIsProcessing(true)
    setResultBlobs([])
    try {
      const ranges = parseRanges(rangeInput)
      const results = await splitPDF(file, ranges)
      setResultBlobs(results)
    } catch (error) {
      console.error(error)
      alert('Failed to split PDF. Please check your ranges and try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null)
    setResultBlobs([])
    setRangeInput('1-2, 3-5')
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Organize', href: '/organize' },
        { label: 'Split PDF' },
      ]}
    >
      <MetaTags
        title="Split PDF Online Free — Separate PDF Pages into Multiple Files"
        description="Split PDF pages online for free. Separate PDF documents into individual pages or custom ranges with 100% private in-browser processing."
        keywords={SPLIT_PDF_KEYWORDS}
        canonical={`${APP_CONFIG.url}/split-pdf`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online PDF Splitter & Page Separator',
          description:
            'Split PDF documents into individual files or extract custom page ranges for free in your browser.',
          url: `${APP_CONFIG.url}/split-pdf`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          SPLIT_PDF_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            100% Private Client-Side Browser Processing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Split PDF — Separate PDF Pages into Multiple Files
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed">
            Divide a large PDF into smaller files or extract specific page ranges with ease.
            Enter custom ranges (e.g. 1-2, 3-5) and split instantly directly in your browser.
          </p>
        </div>

        {/* Quick shortcut tags */}
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {SPLIT_PDF_POPULAR_SEARCHES.slice(0, 7).map((sc) => (
            <Link
              key={sc.label}
              to={sc.to}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-100 hover:bg-brand-50 hover:text-brand-700 text-zinc-600 text-xs font-medium transition-colors"
            >
              <span>{sc.label}</span>
              <ArrowRight className="w-3 h-3 text-zinc-400" />
            </Link>
          ))}
        </div>

        {!resultBlobs.length && !isProcessing && (
          <div className="space-y-6">
            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-300 rounded-2xl cursor-pointer bg-zinc-50 hover:border-brand-400 hover:bg-brand-50/40 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-zinc-700">
                    Click to select a PDF file, or drag & drop
                  </p>
                  <p className="text-xs text-zinc-500">Select a PDF to split into separate pages</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <FileIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-zinc-900 truncate">{file.name}</span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-zinc-800">
                    Custom Page Ranges
                  </label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    className="w-full border border-zinc-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-zinc-900"
                    placeholder="e.g. 1-2, 3-5, 6"
                  />
                  <p className="text-xs text-zinc-500">
                    Enter ranges separated by commas. E.g. '1-2, 3-5' produces 2 separate PDF files.
                  </p>

                  <div className="p-4 bg-brand-50/50 rounded-xl border border-brand-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900 mb-2">
                      Split Preview
                    </h4>
                    <ul className="text-xs text-brand-800 space-y-1 list-disc list-inside">
                      {parseRanges(rangeInput).map((r, i) => (
                        <li key={i}>
                          Part {i + 1}: pages {r.from} to {r.to}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-zinc-100">
                  <button
                    onClick={handleSplit}
                    className="px-6 py-2.5 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 flex items-center shadow-sm transition-all"
                  >
                    <Scissors className="w-4 h-4 mr-2" />
                    Split PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 text-center space-y-4">
            <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full mx-auto" />
            <h3 className="text-lg font-semibold text-zinc-900">Splitting your PDF...</h3>
            <p className="text-sm text-zinc-500">
              Extracting specified page ranges directly in browser memory.
            </p>
          </div>
        )}

        {resultBlobs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
              <Scissors className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900">Split Complete!</h3>
              <p className="text-zinc-500 mt-1 text-sm">
                Generated {resultBlobs.length} separate PDF documents.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-2.5">
              {resultBlobs.map((blob, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200"
                >
                  <span className="text-xs font-semibold text-zinc-800">
                    Part {idx + 1} ({(blob.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    onClick={() => downloadBlob(blob, `split-part-${idx + 1}.pdf`)}
                    className="text-xs px-3.5 py-1.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 flex items-center transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> Download
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={reset}
                className="px-6 py-2.5 bg-white text-zinc-700 font-semibold text-sm rounded-xl hover:bg-zinc-50 border border-zinc-300 transition-colors"
              >
                Split Another PDF
              </button>
            </div>
          </div>
        )}

        {/* How it works & security info */}
        <div className="mt-12 space-y-8 border-t border-zinc-200 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 mb-3">
                How to Separate & Split PDF Files
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 text-sm">
                <li>Select and upload your PDF document into the browser.</li>
                <li>Enter the desired page intervals (e.g. 1-3, 4-8, 9).</li>
                <li>Click <strong>Split PDF</strong> to separate pages locally.</li>
                <li>Download each generated PDF file individually with zero watermarks.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-700" />
                100% Private & In-Browser Secure
              </h3>
              <p className="text-emerald-800 text-sm leading-relaxed">
                Your PDF files are split strictly inside your browser using client-side WebAssembly.
                No sensitive documents, personal files, or statements are ever transferred to
                external servers.
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">
              Frequently Asked Questions About PDF Splitting
            </h3>
            <div className="space-y-4">
              {SPLIT_PDF_FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 p-4 bg-white">
                  <h4 className="font-semibold text-zinc-900 text-sm">{faq.q}</h4>
                  <p className="text-zinc-600 text-sm mt-1.5 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Searches & Related Tags */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 mb-2">
              Related Searches & Tools
            </h4>
            <p className="text-xs text-zinc-500 mb-4">
              Quick access to PDF page extraction, dividing, and organization tools.
            </p>
            <div className="flex flex-wrap gap-2">
              {SPLIT_PDF_POPULAR_SEARCHES.map((tag) => (
                <Link
                  key={tag.label}
                  to={tag.to}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all"
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
