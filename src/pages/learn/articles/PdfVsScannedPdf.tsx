import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import JsonLd, { buildArticleSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Eye, Sparkles, ArrowRight, BookOpen, HelpCircle, Layers, CheckCircle2 } from 'lucide-react'

export default function PdfVsScannedPdf() {
  const pageUrl = `${APP_CONFIG.url}/learn/pdf-vs-scanned-pdf`

  const articleSchema = buildArticleSchema({
    title: 'PDF vs Scanned PDF: What Is the Difference and Why Does It Matter?',
    description: 'Understand the architectural differences between native digital PDFs and scanned image PDFs, why text extraction fails on scans, and how OCR solves it.',
    url: pageUrl,
    publishedTime: '2026-09-04T08:00:00Z',
    modifiedTime: '2026-09-12T10:00:00Z',
    authorName: 'PDF Guru Engineering Team',
  })

  const faqSchema = buildFAQSchema([
    {
      question: 'Why does my PDF converter output a completely blank Word or Excel file?',
      answer: 'Standard converters extract text streams from PDF content streams. If your PDF is a scanned image, there are no text streams to extract, resulting in an empty document unless OCR is used.',
    },
    {
      question: 'Can I make a scanned PDF searchable without changing its appearance?',
      answer: 'Yes. An OCR tool creates a "Searchable PDF" (PDF/A with hidden text layer) by positioning transparent character glyphs directly over the original raster image coordinates.',
    },
    {
      question: 'Why are scanned PDFs so much larger in file size than digital PDFs?',
      answer: 'A digital PDF stores characters as tiny text strings and font definitions (e.g. 50 KB for 20 pages). A scanned PDF stores uncompressed or JPEG image bitmaps for every page (e.g. 25 MB for 20 pages).',
    },
  ])

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: 'Home', url: APP_CONFIG.url },
    { name: 'Learn', url: `${APP_CONFIG.url}/learn` },
    { name: 'PDF vs Scanned PDF', url: pageUrl }
  ])

  return (
    <PageLayout>
      <MetaTags
        title="PDF vs Scanned PDF: What Is the Difference? — Technical Guide"
        description="Learn the architectural differences between digital vector PDFs and scanned raster PDFs, why converters fail on scans, and how OCR makes them searchable."
        canonical={pageUrl}
        ogType="article"
        articlePublishedTime="2026-09-04T08:00:00Z"
        articleModifiedTime="2026-09-12T10:00:00Z"
      />
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbsSchema} />

      <article className="max-w-4xl mx-auto space-y-10 py-4 sm:py-8">
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
        </Link>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Core Architecture
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5" /> 6 min read
            </span>
            <span className="text-xs text-zinc-400">• Published Sep 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            PDF vs Scanned PDF: What Is the Difference and Why Does It Matter?
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            They both end in <code>.pdf</code>, look identical on screen, and open in the same browser window. But under the hood, they are completely different technologies. Here is what you need to know.
          </p>
        </header>

        {/* Table of Contents */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" /> In This Guide
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-brand-600 dark:text-brand-400">
            <li><a href="#fundamental-difference" className="hover:underline">1. Characters vs Pixels: The Core Distinction</a></li>
            <li><a href="#thirty-second-test" className="hover:underline">2. The 30-Second Text Selection Test</a></li>
            <li><a href="#why-converters-fail" className="hover:underline">3. Why Standard Converters Fail on Scans</a></li>
            <li><a href="#how-ocr-solves" className="hover:underline">4. How OCR Bridges the Gap</a></li>
            <li><a href="#file-size-disparity" className="hover:underline">5. Why Scans Are 10x Larger in File Size</a></li>
            <li><a href="#making-searchable" className="hover:underline">6. Making Scanned PDFs Searchable</a></li>
            <li><a href="#faq" className="hover:underline">7. FAQ</a></li>
          </ul>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <section id="fundamental-difference" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              1. Characters vs Pixels: The Core Architectural Distinction
            </h2>
            <p>
              To understand why PDF converters and search engines treat these files differently, examine their binary content streams:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Native Digital PDF
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white">Vector & Text Operators</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Contains character codes linked to embedded font tables (TrueType / OpenType). The word "INVOICE" is stored as 7 ASCII bytes <code>49 4E 56 4F 49 43 45</code>. Searchable, selectable, and lightweight.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                  Scanned Image PDF
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white">Raster Bitmaps (XObjects)</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Contains no font definitions or text characters. The page is merely a high-resolution photograph (JPEG / JBIG2 / CCITT fax compression) wrapped in a PDF envelope. The computer sees only colored dots.
                </p>
              </div>
            </div>
          </section>

          <section id="thirty-second-test" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              2. The 30-Second Test: Is Your PDF Scanned?
            </h2>
            <p>
              Open the document in Chrome, Safari, or Adobe Acrobat:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li><strong>Click and drag:</strong> Try highlighting a single word. If your cursor highlights exact text characters, it is a native PDF. If nothing happens or a large blue rectangular box covers the whole page, it is a scanned image.</li>
              <li><strong>Search test:</strong> Press <code>Ctrl+F</code> or <code>Cmd+F</code> and type a word clearly visible on the page. If it says <em>"0 results found"</em>, the document is an image without a searchable text layer.</li>
              <li><strong>Zoom test:</strong> Zoom in to 400%. If text remains crisp with razor-sharp edges, it is vector text. If the edges become blurry, pixelated, or noisy, it is a raster scan.</li>
            </ol>
          </section>

          {/* CTA Banner */}
          <div className="not-prose my-8 p-6 bg-gradient-to-r from-purple-50 to-brand-50 dark:from-purple-950/30 dark:to-brand-950/30 border border-purple-200/80 dark:border-purple-900/60 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                <Sparkles className="w-5 h-5 text-purple-600" /> Have a scanned PDF that needs text extraction?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                Run client-side OCR in your browser. Extracts text from image scans without cloud uploads.
              </p>
            </div>
            <Link
              to="/ocr-pdf"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-sm transition whitespace-nowrap"
            >
              Run Browser OCR <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <section id="why-converters-fail" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              3. Why Standard Converters Produce Blank Documents on Scans
            </h2>
            <p>
              When you pass a scanned PDF into a standard converter, the converter queries the PDF text engine for string objects. Because the image wrapper contains 0 character strings, the converter completes successfully and generates a 0-byte or blank document!
            </p>
            <p>
              To convert a scanned PDF, an optical recognition engine must first decode character shapes into ASCII/Unicode strings.
            </p>
          </section>

          <section id="how-ocr-solves" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              4. How OCR Bridges the Gap
            </h2>
            <p>
              Optical Character Recognition (OCR) transforms raster pixel matrices into editable characters through neural feature extraction. In our browser engine powered by Tesseract.js:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>The page image is rendered onto an off-screen HTML5 canvas.</li>
              <li>WebAssembly neural networks segment the canvas into lines and words.</li>
              <li>Each glyph is classified into Unicode characters with confidence scores.</li>
              <li>The recognized text is outputted as copyable text or formatted spreadsheets.</li>
            </ul>
          </section>

          <section id="file-size-disparity" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              5. File Size: Why Scanned PDFs Are 10x to 50x Larger
            </h2>
            <p>
              A 10-page text agreement generated directly from Microsoft Word takes approximately <strong>120 KB</strong>. The same 10-page agreement printed, scanned on an office copier at 300 DPI, and saved as a PDF often takes <strong>15 MB to 35 MB</strong>.
            </p>
            <p>
              Why? Because a scanner cannot store abstract characters. It must store millions of RGB or Grayscale pixels per page. Use our <Link to="/compress-pdf" className="text-brand-600 font-semibold hover:underline">Compress PDF tool</Link> or run OCR to strip unnecessary raster bloat.
            </p>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-brand-600" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4 not-prose">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Why does my PDF converter output a completely blank Word or Excel file?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Standard converters extract text streams from PDF content streams. If your PDF is a scanned image, there are no text streams to extract, resulting in an empty document unless OCR is used.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Can I make a scanned PDF searchable without changing its appearance?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Yes. An OCR tool creates a "Searchable PDF" (PDF/A with hidden text layer) by positioning transparent character glyphs directly over the original raster image coordinates.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Why are scanned PDFs so much larger in file size than digital PDFs?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  A digital PDF stores characters as tiny text strings and font definitions. A scanned PDF stores uncompressed or JPEG image bitmaps for every page.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Author Bio */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4 not-prose">
          <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
            PW
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Written by the PDF Guru Engineering Team</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Focused on document specifications, ISO 32000 PDF standards, and client-side WebAssembly OCR implementations.
            </p>
          </div>
        </div>

        {/* Related Articles */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-bold text-zinc-900 dark:text-white text-base">Related Technical Guides</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              to="/learn/how-ocr-works"
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition group space-y-1.5"
            >
              <span className="text-[10px] font-bold text-brand-600 uppercase">OCR</span>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-brand-600 transition line-clamp-2">
                How OCR Works on PDF Documents: From Pixels to Text
              </h4>
            </Link>

            <Link
              to="/learn/how-to-convert-pdf-to-excel"
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition group space-y-1.5"
            >
              <span className="text-[10px] font-bold text-brand-600 uppercase">Conversion</span>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-brand-600 transition line-clamp-2">
                How to Convert PDF to Excel (The Right Way)
              </h4>
            </Link>

            <Link
              to="/learn/how-to-extract-tables-from-pdf"
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition group space-y-1.5"
            >
              <span className="text-[10px] font-bold text-brand-600 uppercase">Extraction</span>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-brand-600 transition line-clamp-2">
                How to Extract Tables from PDF Documents
              </h4>
            </Link>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}
