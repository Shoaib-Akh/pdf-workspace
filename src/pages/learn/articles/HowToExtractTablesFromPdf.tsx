import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import JsonLd, { buildArticleSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Table, Database, ArrowRight, BookOpen, HelpCircle, Code } from 'lucide-react'

export default function HowToExtractTablesFromPdf() {
  const pageUrl = `${APP_CONFIG.url}/learn/how-to-extract-tables-from-pdf`

  const articleSchema = buildArticleSchema({
    title: 'How to Extract Tables from PDF Documents',
    description: 'Learn the difference between bordered and borderless PDF tables, coordinate heuristics, and automated extraction methods for structured data.',
    url: pageUrl,
    publishedTime: '2026-09-02T08:00:00Z',
    modifiedTime: '2026-09-12T10:00:00Z',
    authorName: 'PDF Workspace Engineering Team',
  })

  const faqSchema = buildFAQSchema([
    {
      question: 'Can you extract tables from borderless PDFs?',
      answer: 'Yes. Borderless table extraction relies on stream/whitespace heuristics, analyzing vertical alignment clusters of text bounding boxes rather than relying on drawn vector rules.',
    },
    {
      question: 'Which export format is best: Excel, CSV, or JSON?',
      answer: 'Choose Excel (.xlsx) if you need multiple sheets and formatted column widths. Choose CSV for loading directly into database tables or pandas DataFrames. Choose JSON for nested web APIs.',
    },
    {
      question: 'How do you handle tables that span across multiple PDF pages?',
      answer: 'Our extractor compares the header signature on each page. If Page 2 has the exact same header tokens or column count as Page 1, it automatically combines them into one contiguous sheet.',
    },
  ])

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: 'Home', url: APP_CONFIG.url },
    { name: 'Learn', url: `${APP_CONFIG.url}/learn` },
    { name: 'Extract Tables from PDF', url: pageUrl }
  ])

  return (
    <PageLayout>
      <MetaTags
        title="How to Extract Tables from PDF Documents — Complete Technical Guide"
        description="Master PDF table extraction. Understand bordered vs borderless grids, coordinate heuristics, multi-page repeating headers, and export to Excel/JSON."
        canonical={pageUrl}
        ogType="article"
        articlePublishedTime="2026-09-02T08:00:00Z"
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
            <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Data Engineering
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5" /> 8 min read
            </span>
            <span className="text-xs text-zinc-400">• Published Sep 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            How to Extract Tables from PDF Documents
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            A deep-dive into how PDF documents encode tabular data, the difference between lattice and stream detection methods, and how to reliably extract tables into Excel, CSV, and JSON.
          </p>
        </header>

        {/* Table of Contents */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" /> In This Guide
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-brand-600 dark:text-brand-400">
            <li><a href="#how-pdf-tables-work" className="hover:underline">1. Anatomy of a PDF Table</a></li>
            <li><a href="#three-table-types" className="hover:underline">2. The 3 Types of PDF Tables</a></li>
            <li><a href="#extraction-walkthrough" className="hover:underline">3. Step-by-Step Table Extraction</a></li>
            <li><a href="#export-formats" className="hover:underline">4. Choosing Output Formats (Excel vs CSV vs JSON)</a></li>
            <li><a href="#multi-page" className="hover:underline">5. Handling Multi-Page Repeating Headers</a></li>
            <li><a href="#automation" className="hover:underline">6. Automation: Python Libraries vs Browser Tools</a></li>
            <li><a href="#faq" className="hover:underline">7. FAQ</a></li>
          </ul>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <section id="how-pdf-tables-work" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              1. Anatomy of a PDF Table: Why There Are No "Cells"
            </h2>
            <p>
              In Microsoft Excel, a worksheet is organized as a contiguous grid of cells identified by row and column indices (e.g. <code>B4</code>). When you read an Excel file programmatically, you read an array of rows and cell properties.
            </p>
            <p>
              In a PDF file, however, there are no cells, columns, or rows. When a program generates a PDF table, it emits:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Individual text glyph drawing instructions (<code>Tj</code> / <code>TJ</code> operators) positioned at exact X and Y points.</li>
              <li>Separate stroke commands (<code>m</code>, <code>l</code>, <code>re</code>, <code>S</code> operators) that draw lines representing borders.</li>
            </ul>
            <p>
              The visual illusion of a "table" exists entirely in human perception. To extract the table, software must reverse-engineer the visual structure from raw coordinate streams.
            </p>
          </section>

          <section id="three-table-types" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              2. The Three Types of PDF Tables
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 not-prose">
              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                  Type 1: Lattice / Bordered
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Explicit Vector Borders</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Every cell is enclosed by drawn horizontal and vertical vector lines. Cleanest to extract by finding line intersections.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full">
                  Type 2: Stream / Borderless
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Whitespace Alignment</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Common in financial statements and invoices. Columns are defined only by vertical gaps between words.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                  Type 3: Scanned Table
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Raster Pixels</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Photocopied documents or mobile scans. Requires optical character recognition before table segmentation.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <div className="not-prose my-8 p-6 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-950/30 dark:to-blue-950/30 border border-brand-200/80 dark:border-brand-900/60 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                <Database className="w-5 h-5 text-brand-600" /> Need to extract tables right now?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                Upload your document to our PDF Data Extractor. Preview tables, edit cells inline, and export to Excel or CSV.
              </p>
            </div>
            <Link
              to="/pdf-to-data"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-sm transition whitespace-nowrap"
            >
              Launch Data Extractor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <section id="extraction-walkthrough" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              3. Step-by-Step Table Extraction
            </h2>
            <p>
              Here is how to extract tables into structured formats using our client-side extraction suite:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>Open the <Link to="/pdf-to-data" className="text-brand-600 font-semibold hover:underline">PDF to Data Extractor</Link>.</li>
              <li>Upload your financial statement, BOQ, or report.</li>
              <li>The engine runs coordinate clustering, identifying distinct table entities across all pages.</li>
              <li>Inspect the table preview in your browser: click any cell to edit or verify numbers.</li>
              <li>Choose your export format: Excel workbook, CSV, or structured JSON.</li>
            </ol>
          </section>

          <section id="export-formats" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              4. Choosing Output Formats: Excel vs CSV vs JSON
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li><strong>Microsoft Excel (.xlsx):</strong> Best for human review. Supports multiple sheets per document (e.g. Table 1, Table 2, Summary), preserved column widths, and numeric cell formatting.</li>
              <li><strong>CSV (Comma-Separated Values):</strong> Best for loading data into relational databases (PostgreSQL, MySQL) or analytical tools (Python pandas, R, Google Sheets).</li>
              <li><strong>JSON (JavaScript Object Notation):</strong> Best for software engineers building automated data pipelines or feeding structured data into REST APIs or LLM prompts.</li>
            </ul>
          </section>

          <section id="multi-page" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              5. Handling Multi-Page Tables with Repeating Headers
            </h2>
            <p>
              Long procurement schedules and statements often span 10 to 50 pages. On every page, the table header row repeats (e.g., <em>Item, Description, Quantity, Unit, Price, Total</em>).
            </p>
            <p>
              If an extraction tool blindly stacks pages, your spreadsheet gets repeated header rows scattered every 30 rows. Our extractor compares the token sequence of each page's first row against the master table header. When a match is found, the header row is suppressed and the data rows are appended contiguously.
            </p>
          </section>

          <section id="automation" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              6. Automation: Python Libraries vs Browser Tools
            </h2>
            <p>
              If you are a Python developer building a recurring ingestion pipeline, several open-source libraries exist:
            </p>
            <div className="overflow-x-auto not-prose">
              <table className="w-full text-xs sm:text-sm text-left border-collapse border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white">
                  <tr>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">Library</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">Algorithm</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">Trade-offs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="p-3 font-semibold text-brand-600">pdfplumber</td>
                    <td className="p-3">Visual coordinate bounding boxes</td>
                    <td className="p-3">Highly customizable; requires Python setup</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Camelot</td>
                    <td className="p-3">Lattice (line detection) & Stream</td>
                    <td className="p-3">Excellent for bordered tables; requires OpenCV/Ghostscript</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">PDF Workspace (Web)</td>
                    <td className="p-3">Client-Side WASM Heuristics</td>
                    <td className="p-3">Zero installation, 100% private, instant GUI review</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-brand-600" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4 not-prose">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Can you extract tables from borderless PDFs?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Yes. Borderless table extraction relies on stream/whitespace heuristics, analyzing vertical alignment clusters of text bounding boxes rather than relying on drawn vector rules.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Which export format is best: Excel, CSV, or JSON?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Choose Excel (.xlsx) if you need multiple sheets and formatted column widths. Choose CSV for loading directly into database tables or pandas DataFrames. Choose JSON for nested web APIs.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  How do you handle tables that span across multiple PDF pages?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Our extractor compares the header signature on each page. If Page 2 has the exact same header tokens or column count as Page 1, it automatically combines them into one contiguous sheet.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Author Bio */}
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
              to="/learn/how-to-convert-pdf-to-excel"
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition group space-y-1.5"
            >
              <span className="text-[10px] font-bold text-brand-600 uppercase">Conversion</span>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-brand-600 transition line-clamp-2">
                How to Convert PDF to Excel (The Right Way)
              </h4>
            </Link>

            <Link
              to="/learn/how-to-extract-invoice-data-from-pdf"
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition group space-y-1.5"
            >
              <span className="text-[10px] font-bold text-brand-600 uppercase">Accounting</span>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-brand-600 transition line-clamp-2">
                How to Extract Invoice Data from PDF to Excel
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
          </div>
        </div>
      </article>
    </PageLayout>
  )
}
