import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import JsonLd, { buildArticleSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Check,
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react'

export default function HowToConvertPdfToExcel() {
  const pageUrl = `${APP_CONFIG.url}/learn/how-to-convert-pdf-to-excel`

  const articleSchema = buildArticleSchema({
    title: 'How to Convert PDF to Excel (The Right Way)',
    description: 'Why PDF table extraction fails, how native versus scanned documents differ, and how to extract tables cleanly into Excel without broken cell columns.',
    url: pageUrl,
    publishedTime: '2026-09-01T08:00:00Z',
    modifiedTime: '2026-09-12T10:00:00Z',
    authorName: 'PDF Workspace Engineering Team',
  })

  const faqSchema = buildFAQSchema([
    {
      question: 'Why does copy-pasting tables from PDF into Excel create a mess?',
      answer: 'The PDF specification stores text as absolute XY coordinate glyphs on a visual canvas without native <table>, <tr>, or <td> primitives. Copying text grabs raw coordinate text streams, dumping everything into Column A.',
    },
    {
      question: 'How do I know if my PDF is native or scanned?',
      answer: 'Try selecting text with your mouse. If you can highlight individual letters or words, it is a native digital PDF. If your cursor draws a box or highlights a solid image, it is a scan and requires OCR.',
    },
    {
      question: 'Are my confidential financial files uploaded to your servers?',
      answer: 'No. When using our browser table extractor, all coordinate grouping and SheetJS Excel generation runs 100% locally in your browser memory via WebAssembly.',
    },
  ])

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: 'Home', url: APP_CONFIG.url },
    { name: 'Learn', url: `${APP_CONFIG.url}/learn` },
    { name: 'Convert PDF to Excel', url: pageUrl }
  ])

  return (
    <PageLayout>
      <MetaTags
        title="How to Convert PDF to Excel (The Right Way) — Complete Guide"
        description="Learn how to convert native and scanned PDF tables into cleanly structured Excel spreadsheets (.xlsx) without broken rows or merged column errors."
        canonical={pageUrl}
        ogType="article"
        articlePublishedTime="2026-09-01T08:00:00Z"
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

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Guides & Tutorials
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5" /> 7 min read
            </span>
            <span className="text-xs text-zinc-400">• Published Sep 2026 • Technical Review</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            How to Convert PDF to Excel (The Right Way)
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            Extracting tables from PDF files into Microsoft Excel (.xlsx) workbooks is one of the most frustrating business bottlenecks. Here is why it breaks and how to extract tables with 100% cell accuracy.
          </p>
        </header>

        {/* Table of Contents */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" /> In This Guide
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-brand-600 dark:text-brand-400">
            <li><a href="#why-pdf-tables-fail" className="hover:underline">1. Why Copy-Pasting Tables Fails</a></li>
            <li><a href="#native-vs-scanned" className="hover:underline">2. Native vs Scanned Documents</a></li>
            <li><a href="#browser-extraction" className="hover:underline">3. Method 1: Client-Side Table Extraction</a></li>
            <li><a href="#ocr-method" className="hover:underline">4. Method 2: Scanned OCR Processing</a></li>
            <li><a href="#fixing-errors" className="hover:underline">5. Fixing Common Extraction Errors</a></li>
            <li><a href="#comparison-table" className="hover:underline">6. Extraction Engine Comparison</a></li>
            <li><a href="#faq" className="hover:underline">7. Frequently Asked Questions</a></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="prose dark:prose-invert max-w-none space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <section id="why-pdf-tables-fail" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              1. Why Copy-Pasting from PDF to Excel Fails
            </h2>
            <p>
              When you select tabular data in Adobe Acrobat or Chrome, press <code>Ctrl+C</code>, and paste it into Microsoft Excel, you usually get an unusable mess: numbers crammed into Column A, missing row separators, or shifted decimals.
            </p>
            <p>
              This happens because of how the <strong>Portable Document Format (ISO 32000-1)</strong> is designed. Unlike an HTML document with <code>&lt;table&gt;</code>, <code>&lt;tr&gt;</code>, and <code>&lt;td&gt;</code> tags, a PDF is essentially a vector printing blueprint. It stores text as absolute XY coordinates on a visual page canvas:
            </p>
            <div className="p-4 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-xs overflow-x-auto">
              <code>BT /F1 10 Tf 72.0 710.4 Td (Invoice #) Tj ET<br />BT /F1 10 Tf 220.5 710.4 Td (INV-90214) Tj ET</code>
            </div>
            <p>
              There are no cell containers or row delimiters. To produce a true Excel spreadsheet, software must geometrically deduce horizontal baseline alignments and vertical whitespace gutters.
            </p>
          </section>

          <section id="native-vs-scanned" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              2. The 30-Second Test: Native Digital PDF vs Scanned PDF
            </h2>
            <p>
              Before choosing a tool, you must identify whether your document is digitally created or scanned from paper.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Native Digital PDF
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white">Selectable Text Stream</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Created via "Export to PDF" from software like Excel, ERPs, QuickBooks, or Word. Text characters can be highlighted with your cursor.
                </p>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  &rarr; Use Browser Table Extractor (Instant)
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                  Scanned Image PDF
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white">Raster Pixels</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Produced by flatbed scanners, copiers, or mobile camera photos. Trying to select text results in an image bounding box.
                </p>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  &rarr; Requires OCR (Optical Character Recognition)
                </p>
              </div>
            </div>
          </section>

          {/* Direct CTA Card */}
          <div className="not-prose my-8 p-6 bg-gradient-to-r from-brand-50 to-emerald-50 dark:from-brand-950/30 dark:to-emerald-950/30 border border-brand-200/80 dark:border-brand-900/60 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Try our Client-Side PDF to Excel Converter
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                100% private. Files never touch any server. Free and instant.
              </p>
            </div>
            <Link
              to="/pdf-to-excel"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-sm transition whitespace-nowrap"
            >
              Open PDF to Excel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <section id="browser-extraction" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              3. Method 1: Client-Side Table Extraction (Fast & Private)
            </h2>
            <p>
              For native PDFs, client-side extraction uses WebAssembly and SheetJS to read text tokens without server uploads. Here is the step-by-step process:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Open <Link to="/pdf-to-excel" className="text-brand-600 font-semibold hover:underline">PDF to Excel</Link> in PDF Workspace.</li>
              <li>Drop your document into the drag-and-drop zone.</li>
              <li>The engine detects column boundaries based on whitespace gutters across sequential lines.</li>
              <li>Click <strong>Download .XLSX Workbook</strong> to open your structured sheet.</li>
            </ol>
          </section>

          <section id="ocr-method" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              4. Method 2: Scanned Documents with Optical Character Recognition (OCR)
            </h2>
            <p>
              When dealing with paper invoices, printed bank statements, or signed bills of quantities, character glyphs must first be recognized from raw pixel grids.
            </p>
            <p>
              Our WebAssembly OCR engine executes inside your browser using Tesseract.js:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li><strong>Canvas Rasterization:</strong> Pages are rendered at 192 DPI (~2.0x scale) to optimize character edge clarity.</li>
              <li><strong>Adaptive Binarization:</strong> Separates background paper textures and shadows from dark ink.</li>
              <li><strong>Glyph Recognition:</strong> Machine learning models infer alphanumeric characters, currency symbols, and tabular separators.</li>
            </ul>
            <p>
              Try our <Link to="/scanned-pdf-to-excel" className="text-brand-600 font-semibold hover:underline">Scanned PDF to Excel tool</Link> to process scanned tables directly on your device.
            </p>
          </section>

          <section id="fixing-errors" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              5. How to Fix Common Extraction Errors
            </h2>
            <div className="space-y-4 not-prose">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Issue 1: Merged Multi-Line Text Descriptions</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Common in construction BOQs and engineering tenders where an item description spans 3 lines. Solution: Use our <Link to="/boq-pdf-to-excel" className="text-brand-600 hover:underline">BOQ Extractor</Link>, which detects item numbers to concatenate multi-line text into a single cell.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Issue 2: Currency Symbols Stored as Text</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Excel cannot sum numbers if the cell contains "$" or "USD". Our data extractor automatically strips currency prefixes and formats values as numeric floats.
                </p>
              </div>
            </div>
          </section>

          <section id="comparison-table" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              6. PDF to Excel Extraction Engine Comparison
            </h2>
            <div className="overflow-x-auto not-prose">
              <table className="w-full text-xs sm:text-sm text-left border-collapse border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white">
                  <tr>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">Approach</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">Speed</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">Privacy</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">Best Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="p-3 font-semibold text-brand-600">PDF Workspace (Browser)</td>
                    <td className="p-3 text-emerald-600 font-medium">Instant (&lt; 2s)</td>
                    <td className="p-3 text-emerald-600 font-medium">100% Local (0 upload)</td>
                    <td className="p-3">Confidential financials, statements, BOQs</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Standard Cloud Converters</td>
                    <td className="p-3">3-15s</td>
                    <td className="p-3 text-amber-600 font-medium">Server Upload Required</td>
                    <td className="p-3">Public documents without privacy concerns</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Python (pdfplumber / Camelot)</td>
                    <td className="p-3">Variable</td>
                    <td className="p-3 text-emerald-600 font-medium">Local (Code)</td>
                    <td className="p-3">Developers building automated ETL scripts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-brand-600" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4 not-prose">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Why does copy-pasting tables from PDF into Excel create a mess?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  The PDF format does not define tables, rows, or columns. It only stores text as coordinates on a canvas. Copying dumps the coordinate stream into Column A without structure.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  How do I know if my PDF is native or scanned?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Try highlighting text with your mouse. If you can select individual characters, it is a native digital PDF. If your cursor draws a box over an image, it is a scan.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Are my confidential financial files uploaded to your servers?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  No. When using our browser table extractor, all coordinate grouping and SheetJS Excel generation runs 100% locally in your browser memory via WebAssembly.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Author Bio Box */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4 not-prose">
          <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
            PW
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Written by the PDF Workspace Engineering Team</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Specialists in document geometry reconstruction, client-side WebAssembly rendering, and financial data parsing.
            </p>
          </div>
        </div>

        {/* Related Articles */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-bold text-zinc-900 dark:text-white text-base">Related Technical Guides</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              to="/learn/how-to-extract-tables-from-pdf"
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition group space-y-1.5"
            >
              <span className="text-[10px] font-bold text-brand-600 uppercase">Extraction</span>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-brand-600 transition line-clamp-2">
                How to Extract Tables from PDF Documents
              </h4>
            </Link>

            <Link
              to="/learn/how-to-convert-boq-pdf-to-excel"
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition group space-y-1.5"
            >
              <span className="text-[10px] font-bold text-brand-600 uppercase">Construction</span>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-brand-600 transition line-clamp-2">
                How to Convert BOQ PDF to Excel for Bidding
              </h4>
            </Link>

            <Link
              to="/learn/pdf-vs-scanned-pdf"
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition group space-y-1.5"
            >
              <span className="text-[10px] font-bold text-brand-600 uppercase">Architecture</span>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-brand-600 transition line-clamp-2">
                PDF vs Scanned PDF: What Is the Difference?
              </h4>
            </Link>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}
