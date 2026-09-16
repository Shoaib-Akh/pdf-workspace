import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UploadCloud,
  File as FileIcon,
  X,
  ArrowUp,
  ArrowDown,
  Download,
  Layers,
  Shield,
  FileText,
  Images,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { MetaTags } from '@/components/seo/MetaTags'
import { JsonLd, buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { mergePDFs } from '@/services/pdf/pdfOrganizer'
import { MERGE_PDF_FAQS } from '@/components/home/MergePdfSeoSection'

const SEARCH_SHORTCUTS = [
  { label: 'Merge Images to PDF', to: '/images-to-pdf' },
  { label: 'Merge Photos to PDF', to: '/images-to-pdf' },
  { label: 'Merge PNG to PDF', to: '/png-to-pdf' },
  { label: 'JPG to PDF', to: '/jpg-to-pdf' },
  { label: 'Split PDF', to: '/split-pdf' },
  { label: 'Reorder Pages', to: '/reorder-pdf-pages' },
  { label: 'Compress PDF', to: '/compress-pdf' },
]

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setFiles((prev) => {
      const copy = [...prev]
      const temp = copy[index - 1]
      copy[index - 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  const moveDown = (index: number) => {
    if (index === files.length - 1) return
    setFiles((prev) => {
      const copy = [...prev]
      const temp = copy[index + 1]
      copy[index + 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  const handleMerge = async () => {
    if (files.length < 2) return
    setIsProcessing(true)
    setResultBlob(null)
    try {
      const result = await mergePDFs(files, (current, total) => {
        setProgress({ current, total })
      })
      setResultBlob(result)
    } catch (error) {
      console.error(error)
      alert('Failed to merge PDFs.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob) return
    const url = URL.createObjectURL(resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'merged-document.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFiles([])
    setResultBlob(null)
    setProgress({ current: 0, total: 0 })
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Organize', href: '/organize' },
        { label: 'Merge PDF' },
      ]}
    >
      <MetaTags
        title="Merge PDF Online Free — Combine Multiple PDF Files Into One"
        description="Merge PDF files online for free. Combine multiple PDF documents, arrange page sequence, or merge photos into one unified document with 100% private in-browser processing."
        canonical={`${APP_CONFIG.url}/merge-pdf`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online PDF Merger & Combiner',
          description:
            'Combine multiple PDF files and images into one document free in your browser. 100% private, no file uploads.',
          url: `${APP_CONFIG.url}/merge-pdf`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          MERGE_PDF_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            100% Private Client-Side Browser Processing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Merge PDF Files — Combine Multiple PDFs into One
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed">
            Combine multiple PDF files, documents, and reports into a single organized PDF. Drag and
            drop your files into any order before merging. Everything runs directly in your
            browser — your documents never touch a remote server.
          </p>
        </div>

        {/* Quick shortcut tags */}
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {SEARCH_SHORTCUTS.map((sc) => (
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

        {!resultBlob && !isProcessing && (
          <div className="space-y-6">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-300 rounded-2xl cursor-pointer bg-zinc-50 hover:border-brand-400 hover:bg-brand-50/40 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="mb-1 text-sm font-semibold text-zinc-700">
                  Click to select PDF files, or drag & drop
                </p>
                <p className="text-xs text-zinc-500">
                  Select 2 or more PDF documents to combine
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </label>

            {files.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="p-4 bg-zinc-50/80 border-b border-zinc-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-sm">
                      Files to merge ({files.length})
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Total size:{' '}
                      {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <label className="cursor-pointer text-xs font-semibold text-brand-600 hover:text-brand-700 bg-white border border-zinc-300 px-3 py-1.5 rounded-lg hover:border-brand-300 transition-colors">
                    Add more PDFs
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <ul className="divide-y divide-zinc-200">
                  {files.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-4 hover:bg-zinc-50/80 transition-colors"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                          <FileIcon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <span className="text-sm font-medium text-zinc-900 block truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {(file.size / 1024).toFixed(1)} KB • Position #{idx + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          title="Move up"
                          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveDown(idx)}
                          disabled={idx === files.length - 1}
                          title="Move down"
                          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFile(idx)}
                          title="Remove file"
                          className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    {files.length < 2 ? 'Add at least 2 files to merge' : 'Ready to combine files'}
                  </span>
                  <button
                    onClick={handleMerge}
                    disabled={files.length < 2}
                    className="px-6 py-2.5 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center shadow-sm transition-all"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    Merge {files.length} PDFs
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 text-center space-y-4">
            <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full mx-auto" />
            <h3 className="text-lg font-semibold text-zinc-900">
              {progress.total > 0
                ? `Merging page ${progress.current} of ${progress.total}...`
                : 'Loading documents into WebAssembly engine...'}
            </h3>
            <p className="text-sm text-zinc-500">
              Your documents are being combined securely in your browser memory.
            </p>
          </div>
        )}

        {resultBlob && (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900">Merge Complete!</h3>
              <p className="text-zinc-500 mt-2 text-sm">
                merged-document.pdf ({(resultBlob.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 flex items-center shadow-sm transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Merged PDF
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-white text-zinc-700 font-semibold text-sm rounded-xl hover:bg-zinc-50 border border-zinc-300 transition-colors"
              >
                Merge More PDFs
              </button>
            </div>
          </div>
        )}

        {/* How it works & security info */}
        <div className="mt-12 space-y-8 border-t border-zinc-200 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 mb-3">
                How to Combine PDF Files
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 text-sm">
                <li>Upload two or more PDF documents or drag them into the box.</li>
                <li>Use the arrow buttons to arrange files in your desired sequence.</li>
                <li>Click <strong>Merge PDFs</strong> to combine them in your browser.</li>
                <li>Download your merged PDF file instantly with no watermarks.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-700" />
                100% Private & In-Browser Secure
              </h3>
              <p className="text-emerald-800 text-sm leading-relaxed">
                Files are merged locally using WebAssembly in your browser memory. Your sensitive
                contracts, personal records, and financial statements are never uploaded to any
                server.
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">
              Frequently Asked Questions About PDF Merging
            </h3>
            <div className="space-y-4">
              {MERGE_PDF_FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 p-4 bg-white">
                  <h4 className="font-semibold text-zinc-900 text-sm">{faq.q}</h4>
                  <p className="text-zinc-600 text-sm mt-1.5 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
