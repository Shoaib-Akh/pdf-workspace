import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import { Link } from 'react-router-dom'
import { Image as ImageIcon, Download, Trash2, ArrowUp, ArrowDown, Shield, ArrowRight } from 'lucide-react'
import { imagesToPdf } from '@/services/pdf/pdfOrganizer'
import { downloadBlob } from '@/lib/utils'
import { GIF_TO_PDF_KEYWORDS, GIF_TO_PDF_POPULAR_SEARCHES } from '@/data/seoKeywords'
import JsonLd, { buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'

const GIF_TO_PDF_FAQS = [
  {
    q: 'How do I convert GIF files to PDF online?',
    a: 'Upload or drag and drop your GIF images into the converter box. You can upload multiple GIF files, arrange their order, and click "Convert GIFs to PDF". Your PDF is generated instantly in your browser.',
  },
  {
    q: 'Can I combine multiple GIF images into a single PDF document?',
    a: 'Yes! You can add multiple GIF pictures simultaneously, reorder them using the arrow buttons, and combine them into one multi-page PDF document.',
  },
  {
    q: 'Are animated GIF frames converted into PDF?',
    a: 'Yes, each GIF image is rendered clearly and saved as a crisp, high-resolution page inside your generated PDF document.',
  },
  {
    q: 'Is this GIF to PDF converter free and private?',
    a: 'Yes, 100% free with no file size limitations or watermarks. All conversion processes happen directly in your browser through WebAssembly and HTML5 Canvas, so your files are never uploaded to any remote server.',
  },
]

export default function GifToPdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles])
    setConverted(false)
    setResultBlob(null)
    setErrorMsg('')
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setResultBlob(null)
    setConverted(false)
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

  const handleConvert = async () => {
    if (files.length === 0) return
    setIsConverting(true)
    setErrorMsg('')
    try {
      const blob = await imagesToPdf(files)
      setResultBlob(blob)
      setConverted(true)
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Failed to convert GIF to PDF. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob) return
    const name = files.length === 1
      ? files[0].name.replace(/\.[^/.]+$/, '') + '.pdf'
      : 'converted-gifs.pdf'
    downloadBlob(resultBlob, name)
  }

  const pageTitle = 'GIF to PDF — Convert GIF Images to PDF Online Free'
  const pageDescription =
    'Convert GIF images and animations to high-quality PDF documents online for free. Combine multiple GIFs into one PDF file with 100% private in-browser processing.'

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Convert', href: '/convert' },
        { label: 'GIF to PDF' },
      ]}
    >
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        keywords={GIF_TO_PDF_KEYWORDS}
        canonical={`${APP_CONFIG.url}/gif-to-pdf`}
      />

      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online GIF to PDF Converter',
          description: pageDescription,
          url: `${APP_CONFIG.url}/gif-to-pdf`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          GIF_TO_PDF_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            GIF to PDF — Convert GIF Images to PDF
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert single or multiple GIF images into clean, portable PDF documents directly on your device without file size limits.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          <DropZone
            onFileSelect={handleFileSelect}
            accept={{ 'image/gif': ['.gif'] }}
            multiple={true}
            label="Drop your GIF files here"
            sublabel="Lossless in-browser conversion — supports multiple GIF images"
          />

          {files.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Selected GIFs ({files.length})
                </h3>
                <button
                  onClick={() => setFiles([])}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {files.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="w-6 text-center text-xs font-semibold text-gray-400">
                        {idx + 1}
                      </span>
                      <ImageIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{f.name}</p>
                        <p className="text-xs text-gray-500">{(f.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={idx === files.length - 1}
                        className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(idx)}
                        className="p-1.5 text-red-400 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConverting ? 'Generating PDF...' : `Convert ${files.length} GIF${files.length > 1 ? 's' : ''} to PDF`}
                </button>

                {converted && (
                  <button
                    onClick={handleDownload}
                    className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}
            </div>
          )}
        </div>

        {/* How it works & security info */}
        <div className="mt-12 space-y-8 border-t border-zinc-200 dark:border-gray-800 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 dark:bg-gray-800/60 rounded-2xl p-6 border border-zinc-200 dark:border-gray-700">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-3">
                How to Convert GIF Images to PDF Online
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 dark:text-gray-300 text-sm">
                <li>Choose or drag and drop single or multiple GIF pictures.</li>
                <li>Reorder your GIF images into the desired page sequence.</li>
                <li>Click <strong>Convert GIFs to PDF</strong> to generate the document locally.</li>
                <li>Download your watermark-free, high-resolution PDF file instantly.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-700 dark:text-emerald-400" />
                100% In-Browser Private & Secure
              </h3>
              <p className="text-emerald-800 dark:text-emerald-300/90 text-sm leading-relaxed">
                Your GIF files are processed entirely on your computer through HTML5 Canvas and WebAssembly. Your photos and animations never leave your browser.
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              Frequently Asked Questions About GIF to PDF Conversion
            </h3>
            <div className="space-y-4">
              {GIF_TO_PDF_FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                  <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{faq.q}</h4>
                  <p className="text-zinc-600 dark:text-gray-400 text-sm mt-1.5 leading-relaxed">{faq.a}</p>
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
              Explore quick access tools for GIF, JPG, PNG, and photo conversions.
            </p>
            <div className="flex flex-wrap gap-2">
              {GIF_TO_PDF_POPULAR_SEARCHES.map((tag) => (
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
