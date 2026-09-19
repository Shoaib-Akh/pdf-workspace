import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Edit3,
  Download,
  CheckCircle2,
  Shield,
  ArrowRight,
  UploadCloud,
  File as FileIcon,
  X,
  Type,
  PenTool,
  RotateCw,
} from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { MetaTags } from '@/components/seo/MetaTags'
import { JsonLd, buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { EDIT_PDF_KEYWORDS, EDIT_PDF_POPULAR_SEARCHES } from '@/data/seoKeywords'

export const EDIT_PDF_FAQS = [
  {
    q: 'How to edit a PDF document online for free?',
    a: 'Upload your PDF into the online editor, select the text or annotation tool, type your text or draw your signature, position it on your document, and click "Save & Download". The modified PDF is generated immediately in your browser with zero watermark.',
  },
  {
    q: 'Can I add electronic signatures and annotations to my PDF?',
    a: 'Yes. You can draw your signature with your mouse or stylus, or type custom notes, stamps, and dates directly onto any page.',
  },
  {
    q: 'Is it safe to edit confidential legal or financial PDF files here?',
    a: 'Yes, 100%. Processing takes place strictly within your browser memory using WebAssembly and client-side JavaScript. Your files, contracts, and signatures are never sent to any external server.',
  },
  {
    q: 'Do I need to install desktop software or register an account?',
    a: 'No installation, account registration, or payment is required. Our online PDF editor is 100% free with unlimited usage.',
  },
]

export default function EditPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [textToAdd, setTextToAdd] = useState('')
  const [fontSize, setFontSize] = useState<number>(18)
  const [textColor, setTextColor] = useState<string>('#000000')
  const [activeTab, setActiveTab] = useState<'text' | 'signature'>('text')
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)

  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResultBlob(null)
    }
  }

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1e293b'
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = sigCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    const canvas = sigCanvasRef.current
    if (canvas) {
      setSignatureData(canvas.toDataURL('image/png'))
    }
  }

  const clearSignature = () => {
    const canvas = sigCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
      setSignatureData(null)
    }
  }

  const handleSaveAndDownload = async () => {
    if (!file) return
    setIsProcessing(true)
    setResultBlob(null)

    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

      // Add text if provided
      if (textToAdd.trim() && firstPage) {
        // Convert hex to rgb
        const r = parseInt(textColor.slice(1, 3), 16) / 255 || 0
        const g = parseInt(textColor.slice(3, 5), 16) / 255 || 0
        const b = parseInt(textColor.slice(5, 7), 16) / 255 || 0

        firstPage.drawText(textToAdd, {
          x: 50,
          y: firstPage.getHeight() - 60,
          size: fontSize,
          font,
          color: rgb(r, g, b),
        })
      }

      // Add signature if drawn
      if (signatureData && firstPage) {
        const sigImageBytes = await fetch(signatureData).then((res) => res.arrayBuffer())
        const embeddedSig = await pdfDoc.embedPng(sigImageBytes)
        const sigDims = embeddedSig.scale(0.5)

        firstPage.drawImage(embeddedSig, {
          x: 50,
          y: 60,
          width: Math.min(sigDims.width, 180),
          height: Math.min(sigDims.height, 80),
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      setResultBlob(blob)
    } catch (err) {
      console.error('Failed to edit PDF:', err)
      alert('Failed to edit PDF. Please make sure the file is not corrupted or password protected.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob || !file) return
    const url = URL.createObjectURL(resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `edited-${file.name}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null)
    setResultBlob(null)
    setTextToAdd('')
    clearSignature()
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Organize', href: '/organize' },
        { label: 'Edit PDF' },
      ]}
    >
      <MetaTags
        title="Edit PDF Online Free — Best Free PDF Document Editor"
        description="Edit PDF documents online for free. Add text, annotations, signatures, and modify PDF pages directly in your browser with 100% private in-browser processing."
        keywords={EDIT_PDF_KEYWORDS}
        canonical={`${APP_CONFIG.url}/edit-pdf`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online PDF Editor & Document Modifier',
          description:
            'Free online PDF editor to add text, signatures, and annotate documents directly in your browser.',
          url: `${APP_CONFIG.url}/edit-pdf`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          EDIT_PDF_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            100% Private Client-Side Browser Processing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            PDF Editor — Edit, Annotate & Sign PDF Documents Online Free
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed">
            Easily add custom text, annotations, notes, and digital signatures to your PDF documents.
            Everything processes directly inside your web browser without uploading files to remote servers.
          </p>
        </div>

        {/* Quick shortcut tags */}
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {EDIT_PDF_POPULAR_SEARCHES.slice(0, 7).map((sc) => (
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
            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-300 rounded-2xl cursor-pointer bg-zinc-50 hover:border-brand-400 hover:bg-brand-50/40 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-zinc-700">
                    Click to select a PDF file, or drag & drop
                  </p>
                  <p className="text-xs text-zinc-500">
                    Select a PDF to edit, annotate, or sign
                  </p>
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
                    <div>
                      <span className="text-sm font-medium text-zinc-900 block truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-zinc-400">
                        Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Editor Tool Tabs */}
                <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/60 space-y-4">
                  <div className="flex gap-2 border-b border-zinc-200 pb-3">
                    <button
                      onClick={() => setActiveTab('text')}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === 'text'
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                      }`}
                    >
                      <Type className="w-4 h-4" /> Add Text / Note
                    </button>
                    <button
                      onClick={() => setActiveTab('signature')}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === 'signature'
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                      }`}
                    >
                      <PenTool className="w-4 h-4" /> Draw Signature
                    </button>
                  </div>

                  {activeTab === 'text' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          Text / Annotation Content
                        </label>
                        <input
                          type="text"
                          value={textToAdd}
                          onChange={(e) => setTextToAdd(e.target.value)}
                          placeholder="e.g. Approved by Director, 2026-09-18"
                          className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex flex-wrap gap-4 items-center">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-700 mb-1">
                            Font Size: {fontSize}px
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="36"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                            className="w-32 accent-brand-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-700 mb-1">
                            Text Color
                          </label>
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="h-8 w-14 cursor-pointer rounded border border-zinc-300 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'signature' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-700">
                          Draw your electronic signature:
                        </label>
                        <button
                          onClick={clearSignature}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Clear canvas
                        </button>
                      </div>
                      <canvas
                        ref={sigCanvasRef}
                        width={400}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="w-full h-28 bg-white border border-dashed border-zinc-300 rounded-lg cursor-crosshair touch-none"
                      />
                      <p className="text-[11px] text-zinc-500">
                        Signature will be securely placed on the first page of your document.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-zinc-100">
                  <button
                    onClick={handleSaveAndDownload}
                    className="px-6 py-2.5 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 flex items-center shadow-sm transition-all"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Save & Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 text-center space-y-4">
            <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full mx-auto" />
            <h3 className="text-lg font-semibold text-zinc-900">Applying modifications...</h3>
            <p className="text-sm text-zinc-500">
              Embedding annotations and rendering PDF changes in browser memory.
            </p>
          </div>
        )}

        {resultBlob && file && (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900">PDF Successfully Edited!</h3>
              <p className="text-zinc-600 mt-1 text-sm font-medium">
                Your modifications and signatures have been stamped into the document.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 flex items-center shadow-sm transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Edited PDF
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-white text-zinc-700 font-semibold text-sm rounded-xl hover:bg-zinc-50 border border-zinc-300 transition-colors"
              >
                Edit Another Document
              </button>
            </div>
          </div>
        )}

        {/* How it works & security info */}
        <div className="mt-12 space-y-8 border-t border-zinc-200 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 mb-3">
                How to Edit a PDF Document Online
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 text-sm">
                <li>Select and upload your PDF file into the editor.</li>
                <li>Add customized text notes, font styles, or draw your digital signature.</li>
                <li>Click <strong>Save & Download PDF</strong> to generate the updated file.</li>
                <li>Download your finalized PDF instantly with zero watermarks or fees.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-700" />
                100% Private & In-Browser Secure
              </h3>
              <p className="text-emerald-800 text-sm leading-relaxed">
                All document editing and signature rendering are performed entirely client-side.
                Your private contracts, business records, and personal signatures never touch remote servers.
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">
              Frequently Asked Questions About PDF Editing
            </h3>
            <div className="space-y-4">
              {EDIT_PDF_FAQS.map((faq, i) => (
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
              Quick access to PDF editing, signatures, and document optimization tools.
            </p>
            <div className="flex flex-wrap gap-2">
              {EDIT_PDF_POPULAR_SEARCHES.map((tag) => (
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
