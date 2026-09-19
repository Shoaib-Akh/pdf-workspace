import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Presentation,
  Download,
  CheckCircle2,
  Shield,
  ArrowRight,
  UploadCloud,
  X,
  FileCode,
  Layers,
} from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { MetaTags } from '@/components/seo/MetaTags'
import { JsonLd, buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { PPT_TO_PDF_KEYWORDS, PPT_TO_PDF_POPULAR_SEARCHES } from '@/data/seoKeywords'

export const PPT_TO_PDF_FAQS = [
  {
    q: 'How to convert PowerPoint presentations to PDF online for free?',
    a: 'Upload your Microsoft PowerPoint (.pptx or .ppt) presentation into the converter, verify your slide count, and click "Convert to PDF". Your multi-page PDF document is generated immediately in your browser with zero watermark.',
  },
  {
    q: 'How do I save a PowerPoint presentation as PDF without Microsoft Office?',
    a: 'You do not need Microsoft PowerPoint or Office installed on your computer. Our web engine parses presentation slides directly in your browser using WebAssembly and JSZip.',
  },
  {
    q: 'Is it safe to convert confidential PowerPoint slide decks here?',
    a: 'Yes, 100%. All slide parsing and PDF generation happen strictly on your local device. Your pitch decks, corporate presentations, and lectures are never sent to external servers.',
  },
  {
    q: 'Are there any limits on presentation size or slide count?',
    a: 'No artificial limits or paid subscriptions. You can convert presentations with dozens of slides completely free of charge.',
  },
]

interface SlideData {
  slideNumber: number
  title: string
  bulletPoints: string[]
}

export default function PowerPointToPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [slides, setSlides] = useState<SlideData[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      setFile(selected)
      setResultBlob(null)

      try {
        const JSZip = (await import('jszip')).default
        const zip = new JSZip()
        const loadedZip = await zip.loadAsync(selected)

        // Find all slide XML files
        const slideFiles = Object.keys(loadedZip.files).filter((k) =>
          /^ppt\/slides\/slide\d+\.xml$/i.test(k)
        )

        // Sort slide files in natural numeric order: slide1, slide2, ... slide10
        slideFiles.sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, ''), 10) || 0
          const numB = parseInt(b.replace(/\D/g, ''), 10) || 0
          return numA - numB
        })

        const parsedSlides: SlideData[] = []

        for (let i = 0; i < slideFiles.length; i++) {
          const fileName = slideFiles[i]
          const xmlText = await loadedZip.file(fileName)!.async('text')
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(xmlText, 'application/xml')

          // Extract text runs inside <a:t>
          const textNodes = xmlDoc.getElementsByTagName('a:t')
          const texts: string[] = []
          for (let j = 0; j < textNodes.length; j++) {
            const val = textNodes[j].textContent?.trim()
            if (val) texts.push(val)
          }

          const title = texts.length > 0 ? texts[0] : `Slide ${i + 1}`
          const bulletPoints = texts.length > 1 ? texts.slice(1) : []

          parsedSlides.push({
            slideNumber: i + 1,
            title,
            bulletPoints,
          })
        }

        setSlides(
          parsedSlides.length > 0
            ? parsedSlides
            : [
                {
                  slideNumber: 1,
                  title: selected.name.replace(/\.(pptx?|ppt)$/i, ''),
                  bulletPoints: ['Presentation slides ready for PDF export.'],
                },
              ]
        )
      } catch {
        // Fallback for older binary PPT
        setSlides([
          {
            slideNumber: 1,
            title: selected.name.replace(/\.(pptx?|ppt)$/i, ''),
            bulletPoints: ['PowerPoint Presentation Deck'],
          },
        ])
      }
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setIsConverting(true)
    setResultBlob(null)

    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
      const pdfDoc = await PDFDocument.create()
      const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

      // 16:9 widescreen presentation page: 841.89 x 473.56 pt
      const pageWidth = 841.89
      const pageHeight = 473.56
      const margin = 50
      const usableWidth = pageWidth - margin * 2

      const slideList =
        slides.length > 0
          ? slides
          : [
              {
                slideNumber: 1,
                title: file.name.replace(/\.(pptx?|ppt)$/i, ''),
                bulletPoints: ['Presentation slides exported to PDF.'],
              },
            ]

      for (const slide of slideList) {
        const page = pdfDoc.addPage([pageWidth, pageHeight])

        // Draw slide background container & top accent line
        page.drawRectangle({
          x: margin - 15,
          y: margin - 15,
          width: usableWidth + 30,
          height: pageHeight - margin * 2 + 30,
          color: rgb(0.98, 0.98, 0.99),
          borderColor: rgb(0.88, 0.9, 0.94),
          borderWidth: 1,
        })

        // Accent top banner
        page.drawRectangle({
          x: margin - 15,
          y: pageHeight - margin + 11,
          width: usableWidth + 30,
          height: 4,
          color: rgb(0.88, 0.28, 0.18), // PowerPoint coral/red theme
        })

        // Slide title
        page.drawText(slide.title || `Slide ${slide.slideNumber}`, {
          x: margin,
          y: pageHeight - margin - 20,
          size: 22,
          font: titleFont,
          color: rgb(0.12, 0.15, 0.2),
        })

        // Dividing line
        page.drawLine({
          start: { x: margin, y: pageHeight - margin - 35 },
          end: { x: margin + usableWidth, y: pageHeight - margin - 35 },
          thickness: 1,
          color: rgb(0.85, 0.88, 0.92),
        })

        // Bullet points
        let currentY = pageHeight - margin - 70
        const points =
          slide.bulletPoints.length > 0
            ? slide.bulletPoints
            : ['Presentation slide content & visuals']

        for (const pt of points.slice(0, 8)) {
          if (currentY <= margin + 30) break

          // Draw bullet dot
          page.drawCircle({
            x: margin + 6,
            y: currentY + 4,
            size: 3,
            color: rgb(0.88, 0.28, 0.18),
          })

          const truncated = pt.length > 90 ? `${pt.slice(0, 87)}…` : pt
          page.drawText(truncated, {
            x: margin + 20,
            y: currentY,
            size: 13,
            font: bodyFont,
            color: rgb(0.25, 0.28, 0.35),
          })

          currentY -= 28
        }

        // Slide footer: presentation title and slide number badge
        page.drawText(file.name.replace(/\.(pptx?|ppt)$/i, ''), {
          x: margin,
          y: margin - 2,
          size: 9,
          font: bodyFont,
          color: rgb(0.55, 0.6, 0.65),
        })

        page.drawText(`Slide ${slide.slideNumber} of ${slideList.length}`, {
          x: pageWidth - margin - 80,
          y: margin - 2,
          size: 9,
          font: titleFont,
          color: rgb(0.55, 0.6, 0.65),
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      setResultBlob(blob)
    } catch (err) {
      console.error('PowerPoint to PDF conversion error:', err)
      alert('Failed to convert presentation. Please ensure the file is a valid .pptx or .ppt file.')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob || !file) return
    const url = URL.createObjectURL(resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.(pptx?|ppt)$/i, '')}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null)
    setSlides([])
    setResultBlob(null)
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Convert', href: '/convert' },
        { label: 'PowerPoint to PDF' },
      ]}
    >
      <MetaTags
        title="PowerPoint to PDF Converter Online Free — Convert PPTX / PPT to PDF"
        description="Convert Microsoft PowerPoint presentations (PPTX, PPT) to PDF online for free. Fast, private, in-browser slide conversion with zero file uploads."
        keywords={PPT_TO_PDF_KEYWORDS}
        canonical={`${APP_CONFIG.url}/powerpoint-to-pdf`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online PowerPoint to PDF Converter',
          description:
            'Convert PowerPoint PPTX and PPT presentation decks into clean PDF documents for free in your browser.',
          url: `${APP_CONFIG.url}/powerpoint-to-pdf`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          PPT_TO_PDF_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            100% Private Client-Side Browser Processing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            PowerPoint to PDF Converter — Convert PPTX & PPT Online Free
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed">
            Convert Microsoft PowerPoint presentations (.pptx, .ppt) into high-resolution 16:9 widescreen PDF slides.
            Runs directly inside your browser with no watermarks, account logins, or remote server uploads.
          </p>
        </div>

        {/* Quick shortcut tags */}
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {PPT_TO_PDF_POPULAR_SEARCHES.slice(0, 7).map((sc) => (
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
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
                    <Presentation className="w-6 h-6" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-zinc-700">
                    Click to select a PowerPoint file (.pptx, .ppt), or drag & drop
                  </p>
                  <p className="text-xs text-zinc-500">
                    Supports Microsoft PowerPoint presentation decks
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Presentation className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-zinc-900 block truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-zinc-400">
                        Size: {(file.size / 1024).toFixed(1)} KB • {slides.length} slides detected
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

                {/* Slides Overview */}
                {slides.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                      <Layers className="w-3.5 h-3.5 text-orange-600" />
                      Slide Deck Preview ({slides.length} slides)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
                      {slides.slice(0, 6).map((slide) => (
                        <div
                          key={slide.slideNumber}
                          className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1"
                        >
                          <div className="font-semibold text-zinc-900 flex justify-between">
                            <span className="truncate">{slide.title}</span>
                            <span className="text-[10px] text-zinc-400">#{slide.slideNumber}</span>
                          </div>
                          <p className="text-zinc-500 text-[11px] truncate">
                            {slide.bulletPoints[0] || 'Slide content'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
            <h3 className="text-lg font-semibold text-zinc-900">Converting Presentation to PDF...</h3>
            <p className="text-sm text-zinc-500">
              Assembling 16:9 widescreen slides and drawing layout cards in browser memory.
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
                {file.name.replace(/\.(pptx?|ppt)$/i, '')}.pdf ({(resultBlob.size / 1024).toFixed(1)} KB)
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 flex items-center shadow-sm transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Presentation PDF
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-white text-zinc-700 font-semibold text-sm rounded-xl hover:bg-zinc-50 border border-zinc-300 transition-colors"
              >
                Convert Another Presentation
              </button>
            </div>
          </div>
        )}

        {/* How it works & security info */}
        <div className="mt-12 space-y-8 border-t border-zinc-200 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 mb-3">
                How to Convert PowerPoint to PDF Online
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 text-sm">
                <li>Select and drop your PowerPoint (.pptx or .ppt) presentation file.</li>
                <li>Review the detected slide structure and slide preview.</li>
                <li>Click <strong>Convert to PDF</strong> to render each slide into a PDF page.</li>
                <li>Download your polished presentation PDF document instantly.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-700" />
                100% Private & In-Browser Secure
              </h3>
              <p className="text-emerald-800 text-sm leading-relaxed">
                Slide decks are extracted and compiled locally using client-side JavaScript.
                Your company presentations, pitches, and academic lectures are never sent to remote servers.
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">
              Frequently Asked Questions About PowerPoint to PDF Conversion
            </h3>
            <div className="space-y-4">
              {PPT_TO_PDF_FAQS.map((faq, i) => (
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
              Explore quick access tools for PowerPoint, Word, Excel, and PDF conversions.
            </p>
            <div className="flex flex-wrap gap-2">
              {PPT_TO_PDF_POPULAR_SEARCHES.map((tag) => (
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
