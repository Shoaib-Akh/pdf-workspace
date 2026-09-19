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
import { BMP_TO_PDF_KEYWORDS, BMP_TO_PDF_POPULAR_SEARCHES } from '@/data/seoKeywords'
import JsonLd, { buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'

const BMP_TO_PDF_FAQS = [
  {
    q: 'How do I convert BMP bitmap images to PDF?',
    a: 'Simply select or drop your BMP files into the upload box. You can arrange their page order using the arrow buttons, then click "Convert BMPs to PDF" to generate a crisp, standardized PDF file instantly.',
  },
  {
    q: 'Can I convert multiple BMP images into a single PDF?',
    a: 'Yes, our tool supports batch conversion. Upload as many BMP images as you need, reorder them, and merge them all into one combined PDF document.',
  },
  {
    q: 'Will the image quality of bitmap files be preserved?',
    a: 'Yes, BMP images are converted losslessly into the PDF container without unwanted compression artifacts or degradation, ensuring high-definition print-ready quality.',
  },
  {
    q: 'Is it free and are my files kept private?',
    a: 'Yes, 100% free with no file limitations or watermarks. All file processing is performed client-side inside your browser via WebAssembly. Your photos and bitmap documents never leave your computer.',
  },
]

export default function BmpToPdfPage() {
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
      setErrorMsg('Failed to convert BMP to PDF. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob) return
    const name = files.length === 1
      ? files[0].name.replace(/\.[^/.]+$/, '') + '.pdf'
      : 'converted-bitmap.pdf'
    downloadBlob(resultBlob, name)
  }

  const pageTitle = 'BMP to PDF — Convert BMP Bitmap Images to PDF Online Free'
  const pageDescription =
    'Convert BMP bitmap images to PDF online for free. Combine multiple BMP files into a single high-quality PDF document with 100% private in-browser processing.'

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Convert', href: '/convert' },
        { label: 'BMP to PDF' },
      ]}
    >
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        keywords={BMP_TO_PDF_KEYWORDS}
        canonical={`${APP_CONFIG.url}/bmp-to-pdf`}
      />

      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online BMP to PDF Converter',
          description: pageDescription,
          url: `${APP_CONFIG.url}/bmp-to-pdf`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          BMP_TO_PDF_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            BMP to PDF — Convert BMP Images to PDF
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert uncompressed BMP bitmap images and graphics into compact, universally compatible PDF documents in your browser.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          <DropZone
            onFileSelect={handleFileSelect}
            accept={{ 'image/bmp': ['.bmp'] }}
            multiple={true}
            label="Drop your BMP bitmap images here"
            sublabel="Lossless in-browser conversion — supports multiple BMP files"
          />

          {files.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Selected BMPs ({files.length})
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
                      <ImageIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
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
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConverting ? 'Generating PDF...' : `Convert ${files.length} BMP${files.length > 1 ? 's' : ''} to PDF`}
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
                How to Convert BMP Images to PDF Online
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 dark:text-gray-300 text-sm">
                <li>Select or drag and drop single or multiple BMP bitmap files.</li>
                <li>Reorder your images into the preferred sequence.</li>
                <li>Click <strong>Convert BMPs to PDF</strong> to assemble the document locally.</li>
                <li>Download your high-resolution, watermark-free PDF instantly.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-700 dark:text-emerald-400" />
                100% Client-Side In-Browser Security
              </h3>
              <p className="text-emerald-800 dark:text-emerald-300/90 text-sm leading-relaxed">
                Your bitmap graphics are processed locally in your browser memory using HTML5 Canvas and WebAssembly. Your images are never transferred or stored on remote servers.
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              Frequently Asked Questions About BMP to PDF Conversion
            </h3>
            <div className="space-y-4">
              {BMP_TO_PDF_FAQS.map((faq, i) => (
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
              Explore quick access tools for BMP, GIF, PNG, JPG, and photo conversions.
            </p>
            <div className="flex flex-wrap gap-2">
              {BMP_TO_PDF_POPULAR_SEARCHES.map((tag) => (
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
