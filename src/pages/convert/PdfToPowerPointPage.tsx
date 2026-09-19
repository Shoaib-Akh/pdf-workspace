import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import { Link } from 'react-router-dom'
import {
  Presentation, Download, CheckCircle, Shield, ArrowRight,
  FileText, AlertCircle, RefreshCw, Layers
} from 'lucide-react'
import { convertPdfToPptx, type PdfToPptxProgress } from '@/services/conversion/pdfToPptxConverter'
import { Progress } from '@/components/ui/progress'

const PPTX_FAQS = [
  {
    q: 'How does PDF to PowerPoint conversion work in the browser?',
    a: 'Each PDF page is rendered as a high-resolution image using PDF.js, then embedded as a full-slide image in a PPTX file using PptxGenJS — all running on your device with zero uploads.',
  },
  {
    q: 'Is the PowerPoint file editable?',
    a: 'Each slide contains the PDF page as a high-res image. You can add new text boxes, shapes, and animations in PowerPoint on top of the image.',
  },
  {
    q: 'Are my PDF files uploaded to a server?',
    a: 'No. The entire conversion runs locally in your browser. Your PDF files never leave your device.',
  },
  {
    q: 'What slide size will the PPTX use?',
    a: 'The converter automatically detects the PDF page orientation and sets the slide layout to match — landscape (10×7.5 in) for horizontal PDFs, portrait (7.5×10 in) for vertical PDFs.',
  },
]

export default function PdfToPowerPointPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<PdfToPptxProgress | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [slideCount, setSlideCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setResultBlob(null)
      setError(null)
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setResultBlob(null)

    try {
      const result = await convertPdfToPptx(file, (p) => setProgress(p))
      setResultBlob(result.blob)
      setSlideCount(result.slideCount)
    } catch (err: any) {
      console.error('PDF to PPTX error:', err)
      setError(err.message || 'Conversion failed. Please ensure the file is a valid PDF.')
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
    a.download = `${file.name.replace(/\.pdf$/i, '')}.pptx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null)
    setResultBlob(null)
    setSlideCount(0)
    setError(null)
  }

  return (
    <PageLayout>
      <MetaTags
        title="PDF to PowerPoint — Convert PDF to PPTX Online Free"
        description="Convert PDF presentations and documents into Microsoft PowerPoint (.pptx) slides online for free. Each page becomes a crisp slide. Runs entirely in your browser."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            PDF to PowerPoint — Convert PDF to PPTX Presentation
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert static PDF slides, conference decks, and pitches into fully shareable Microsoft PowerPoint (.pptx) files.
            Each PDF page becomes one high-resolution slide. 100% browser-based.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!resultBlob && !isProcessing && (
            <>
              {!file ? (
                <DropZone
                  onFileSelect={handleFileSelect}
                  label="Select a PDF to convert to PowerPoint"
                  sublabel="Each page becomes one slide — runs on your device"
                />
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 truncate">
                      <Presentation className="w-8 h-8 text-orange-500 flex-shrink-0" />
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
                    onClick={handleConvert}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Layers className="w-4 h-4" /> Convert to PowerPoint (.pptx)
                  </button>
                </div>
              )}
            </>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="text-center space-y-5 py-6">
              <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Rendering slides…</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{progress?.stage ?? 'Processing pages…'}</p>
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
                <span className="font-semibold">PPTX ready!</span>
                <span className="text-xs text-green-600">({slideCount} slides created)</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PowerPoint (.pptx)
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

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Shield className="w-4 h-4 text-green-500" />
            <span>100% private — your file never leaves your browser</span>
          </div>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: <FileText className="w-6 h-6 text-blue-600" />, title: 'Upload PDF', desc: 'Select any PDF — slide decks, reports, or documents' },
            { icon: <Layers className="w-6 h-6 text-orange-600" />, title: 'Render Slides', desc: 'Each page is rendered at 2× resolution for crisp slides' },
            { icon: <Download className="w-6 h-6 text-green-600" />, title: 'Download PPTX', desc: 'Open and edit in PowerPoint, Google Slides, or Keynote' },
          ].map((step, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto">{step.icon}</div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{step.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {PPTX_FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{faq.q}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
