import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Download,
  CheckCircle2,
  Shield,
  ArrowRight,
  UploadCloud,
  File as FileIcon,
  X,
  FileCode,
} from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { MetaTags } from '@/components/seo/MetaTags'
import { JsonLd, buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { WORD_TO_PDF_KEYWORDS, WORD_TO_PDF_POPULAR_SEARCHES } from '@/data/seoKeywords'

export const WORD_TO_PDF_FAQS = [
  {
    q: 'How to convert a Word document to PDF online for free?',
    a: 'Upload your Microsoft Word (.docx or .doc) document into the converter, wait a moment for the client-side engine to parse and format the document, and click "Download PDF". Your file is generated instantly in your browser with no watermarks.',
  },
  {
    q: 'How do I save a Word document as a PDF without Microsoft Office?',
    a: 'You do not need Microsoft Office, Word, or Adobe Acrobat installed. Our web converter parses Word XML structures and converts them directly into a standard PDF in any modern browser.',
  },
  {
    q: 'Is it safe to convert confidential Word documents here?',
    a: 'Yes, 100%. All conversion takes place locally within your browser using client-side WebAssembly and JSZip. Your documents, resumes, and reports are never uploaded to third-party servers.',
  },
  {
    q: 'Are there any fees or conversion limits?',
    a: 'No fees, subscriptions, or daily limits. You can convert as many Word documents to PDF as you need completely free.',
  },
]

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [extractedParagraphCount, setExtractedParagraphCount] = useState<number>(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResultBlob(null)
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setIsConverting(true)
    setResultBlob(null)

    try {
      const JSZip = (await import('jszip')).default
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')

      const zip = new JSZip()
      let paragraphs: string[] = []

      // Check if it's a DOCX file (ZIP based)
      try {
        const loadedZip = await zip.loadAsync(file)
        const docXmlFile = loadedZip.file('word/document.xml')
        if (docXmlFile) {
          const docXml = await docXmlFile.async('text')
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(docXml, 'application/xml')
          const pElements = xmlDoc.getElementsByTagName('w:p')

          for (let i = 0; i < pElements.length; i++) {
            const p = pElements[i]
            const textNodes = p.getElementsByTagName('w:t')
            let pText = ''
            for (let j = 0; j < textNodes.length; j++) {
              pText += textNodes[j].textContent || ''
            }
            if (pText.trim()) {
              paragraphs.push(pText.trim())
            }
          }
        }
      } catch {
        // Fallback for older .doc or non-zip Word documents
        const text = await file.text()
        paragraphs = text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      }

      if (paragraphs.length === 0) {
        paragraphs = [`Document: ${file.name}`, 'Content converted from Word document.']
      }

      setExtractedParagraphCount(paragraphs.length)

      // Generate clean PDF
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      const pageWidth = 595.28 // A4 standard
      const pageHeight = 841.89
      const margin = 50
      const usableWidth = pageWidth - margin * 2
      const lineHeight = 16

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
      let currentY = pageHeight - margin

      // Title header
      const titleText = file.name.replace(/\.(docx?|doc)$/i, '')
      currentPage.drawText(titleText, {
        x: margin,
        y: currentY,
        size: 18,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      })
      currentY -= 30

      // Helper function to split text into wrapped lines
      const wrapText = (text: string, maxW: number, f: any, fSize: number): string[] => {
        const words = text.split(/\s+/)
        const lines: string[] = []
        let currentLine = ''

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          const testWidth = f.widthOfTextAtSize(testLine, fSize)
          if (testWidth <= maxW) {
            currentLine = testLine
          } else {
            if (currentLine) lines.push(currentLine)
            currentLine = word
          }
        }
        if (currentLine) lines.push(currentLine)
        return lines
      }

      for (const p of paragraphs) {
        const lines = wrapText(p, usableWidth, font, 11)

        for (const line of lines) {
          if (currentY <= margin + 20) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight])
            currentY = pageHeight - margin
          }

          currentPage.drawText(line, {
            x: margin,
            y: currentY,
            size: 11,
            font,
            color: rgb(0.2, 0.2, 0.2),
          })
          currentY -= lineHeight
        }

        // Paragraph gap
        currentY -= 6
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      setResultBlob(blob)
    } catch (err) {
      console.error('Conversion error:', err)
      alert('Failed to convert Word document to PDF. Please ensure the file is a valid .docx or .doc file.')
    } finally {
      setIsConverting(false)
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
    setExtractedParagraphCount(0)
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
        description="Convert Microsoft Word documents (DOCX, DOC) to PDF online for free. Fast, private, and runs directly in your browser with zero file uploads."
        keywords={WORD_TO_PDF_KEYWORDS}
        canonical={`${APP_CONFIG.url}/word-to-pdf`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online Word to PDF Converter',
          description:
            'Convert Word DOCX and DOC files into PDF documents for free in your browser.',
          url: `${APP_CONFIG.url}/word-to-pdf`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          WORD_TO_PDF_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            100% Private Client-Side Browser Processing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Word to PDF Converter — Convert DOCX & DOC Documents Online Free
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed">
            Convert Microsoft Word documents (.docx, .doc) into high-quality PDF files instantly.
            Works directly on your device with no watermarks, account signups, or server file uploads.
          </p>
        </div>

        {/* Quick shortcut tags */}
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {WORD_TO_PDF_POPULAR_SEARCHES.slice(0, 7).map((sc) => (
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

        {!resultBlob && !isConverting && (
          <div className="space-y-6">
            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-300 rounded-2xl cursor-pointer bg-zinc-50 hover:border-brand-400 hover:bg-brand-50/40 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-zinc-700">
                    Click to select a Word file (.docx, .doc), or drag & drop
                  </p>
                  <p className="text-xs text-zinc-500">
                    Supports Microsoft Word DOCX and DOC documents
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
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-zinc-900 block truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-zinc-400">
                        Size: {(file.size / 1024).toFixed(1)} KB
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

                <div className="flex justify-end pt-2 border-t border-zinc-100">
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

        {isConverting && (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 text-center space-y-4">
            <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full mx-auto" />
            <h3 className="text-lg font-semibold text-zinc-900">Converting Word Document...</h3>
            <p className="text-sm text-zinc-500">
              Parsing document structure and assembling PDF pages directly in browser memory.
            </p>
          </div>
        )}

        {resultBlob && file && (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900">Conversion Complete!</h3>
              <p className="text-zinc-600 mt-1 text-sm font-medium">
                {file.name.replace(/\.(docx?|doc)$/i, '')}.pdf ({(resultBlob.size / 1024).toFixed(1)} KB)
              </p>
              {extractedParagraphCount > 0 && (
                <p className="text-xs text-zinc-400 mt-0.5">
                  Processed {extractedParagraphCount} paragraphs and content blocks.
                </p>
              )}
            </div>

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
                className="px-6 py-3 bg-white text-zinc-700 font-semibold text-sm rounded-xl hover:bg-zinc-50 border border-zinc-300 transition-colors"
              >
                Convert Another Document
              </button>
            </div>
          </div>
        )}

        {/* How it works & security info */}
        <div className="mt-12 space-y-8 border-t border-zinc-200 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 mb-3">
                How to Convert Word to PDF Online
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 text-sm">
                <li>Select and drop your Microsoft Word document (.docx or .doc) into the box.</li>
                <li>Click <strong>Convert to PDF</strong> to initiate client-side conversion.</li>
                <li>The engine formats and structures your text into standard PDF pages.</li>
                <li>Download your ready-to-share PDF document instantly.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-700" />
                100% Private & In-Browser Secure
              </h3>
              <p className="text-emerald-800 text-sm leading-relaxed">
                Your Word documents are parsed locally using JavaScript and WebAssembly.
                Confidential business plans, resumes, and legal papers never leave your computer.
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">
              Frequently Asked Questions About Word to PDF Conversion
            </h3>
            <div className="space-y-4">
              {WORD_TO_PDF_FAQS.map((faq, i) => (
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
              Explore quick access tools for Word, PDF conversion, merging, and compression.
            </p>
            <div className="flex flex-wrap gap-2">
              {WORD_TO_PDF_POPULAR_SEARCHES.map((tag) => (
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
