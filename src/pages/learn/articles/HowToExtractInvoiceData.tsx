import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import JsonLd, { buildArticleSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Receipt,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Calculator,
  FileSpreadsheet,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react'

export default function HowToExtractInvoiceData() {
  const pageUrl = `${APP_CONFIG.url}/learn/how-to-extract-invoice-data`

  const articleSchema = buildArticleSchema({
    title: 'How to Extract Invoice Data from PDF to Excel or Accounting Software',
    description: 'Learn how accounts payable teams automate PDF invoice parsing, extract header metadata and multi-line item tables, and export cleanly into Excel and ERP systems.',
    url: pageUrl,
    publishedTime: '2026-09-03T08:00:00Z',
    modifiedTime: '2026-09-12T10:00:00Z',
    authorName: 'PDF Workspace Engineering Team',
  })

  const faqSchema = buildFAQSchema([
    {
      question: 'Can I extract multi-page invoice tables without repeating header rows?',
      answer: 'Yes. Advanced table extractors detect identical header rows across consecutive pages and deduplicate them into a single consolidated table, appending line items seamlessly.',
    },
    {
      question: 'How do you handle invoices with varying date formats like DD/MM/YYYY vs MM/DD/YYYY?',
      answer: 'Extraction systems use locale-aware normalization algorithms. By cross-referencing the vendor country code, tax registration prefix (e.g. GB vs US), and day/month values exceeding 12, the engine resolves the unambiguous ISO 8601 standard date (YYYY-MM-DD).',
    },
    {
      question: 'Is it safe to process confidential vendor invoices in the browser?',
      answer: 'Yes. In-browser client-side extraction processes all PDF streams in local computer memory via WebAssembly. Neither supplier names, negotiated unit discounts, nor banking wire coordinates are ever uploaded or saved to remote cloud servers.',
    },
    {
      question: 'What happens if the invoice is a physical paper scan or photo?',
      answer: 'If the invoice is scanned, native text stream extraction will detect zero characters. You simply run the document through our OCR pipeline first to convert ink pixels into text, after which table extraction proceeds normally.',
    },
  ])

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: 'Home', url: APP_CONFIG.url },
    { name: 'Learn', url: `${APP_CONFIG.url}/learn` },
    { name: 'Extract Invoice Data', url: pageUrl },
  ])

  return (
    <PageLayout>
      <MetaTags
        title="How to Extract Invoice Data from PDF to Excel — AP Automation Guide"
        description="Master invoice PDF extraction: parse header metadata, extract tabular line items, verify mathematical totals, and export clean Excel spreadsheets."
        canonical={pageUrl}
        ogType="article"
        articlePublishedTime="2026-09-03T08:00:00Z"
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
              Finance & Accounting
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5" /> 7 min read
            </span>
            <span className="text-xs text-zinc-400">• Published Sep 2026 • Technical Review</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            How to Extract Invoice Data from PDF to Excel or Accounting Software
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            Manual invoice processing costs finance teams an average of $12 to $25 per document and is notoriously prone to transcription typos. Here is how modern extraction pipelines turn PDF bills into cleanly structured, ledger-ready Excel workbooks.
          </p>
        </header>

        {/* Table of Contents */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" /> In This Guide
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-brand-600 dark:text-brand-400">
            <li><a href="#ap-bottleneck" className="hover:underline">1. The Accounts Payable Bottleneck</a></li>
            <li><a href="#invoice-anatomy" className="hover:underline">2. Anatomy of a PDF Invoice</a></li>
            <li><a href="#extraction-methods" className="hover:underline">3. Three Invoice Extraction Methods</a></li>
            <li><a href="#math-integrity" className="hover:underline">4. Mathematical Validation & Cross-Checking</a></li>
            <li><a href="#accounting-export" className="hover:underline">5. Exporting for QuickBooks, Xero & ERPs</a></li>
            <li><a href="#privacy-audit" className="hover:underline">6. Why Privacy Matters for Supplier Bills</a></li>
            <li><a href="#faq" className="hover:underline">7. Frequently Asked Questions</a></li>
          </ul>
        </div>

        {/* Content Body */}
        <div className="prose dark:prose-invert max-w-none space-y-10 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <section id="ap-bottleneck" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              1. The Accounts Payable Bottleneck
            </h2>
            <p>
              According to the Institute of Financial Operations & Leadership (IFOL), over <strong>70% of business-to-business invoices</strong> arrive as PDF email attachments. Because every supplier uses a customized accounting layout, accounts payable clerks spend hours every week re-typing data into Excel or ERP software.
            </p>
            <p>
              This manual data entry introduces major operational liabilities:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li><strong>Transposition Typos:</strong> Reversing digits (e.g. typing $1,450 instead of $1,540) causes reconciliation discrepancies that take days to audit.</li>
              <li><strong>Duplicate Payments:</strong> Inadvertently keying the same vendor reference code twice results in dual cash disbursements.</li>
              <li><strong>Missed Early-Payment Discounts:</strong> Delays in manual processing cycle times cause finance teams to miss standard 2/10 Net 30 vendor settlement terms.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="invoice-anatomy" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              2. Anatomy of an Invoice: What Needs to be Extracted
            </h2>
            <p>
              Every invoice is composed of three distinct data topologies: scalar metadata, tabular line items, and financial summary totals.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 not-prose my-6">
              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  1. Header Metadata
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Scalar Key-Value Pairs</h3>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pt-1 list-disc pl-4">
                  <li>Invoice Number (e.g. INV-9821)</li>
                  <li>Invoice Date & Due Date</li>
                  <li>Purchase Order (PO) Number</li>
                  <li>Vendor Name & Tax ID (VAT/EIN)</li>
                  <li>Remit-to Bank Account / IBAN</li>
                </ul>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  2. Line Item Grid
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Repeating Tabular Rows</h3>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pt-1 list-disc pl-4">
                  <li>Line Item / SKU Code</li>
                  <li>Item Description / Service details</li>
                  <li>Quantity (Units, Hours, Sets)</li>
                  <li>Unit Price / Rate</li>
                  <li>Applicable Tax Rate (e.g. 20%)</li>
                  <li>Extended Line Amount</li>
                </ul>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  3. Summary Totals
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Financial Balances</h3>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pt-1 list-disc pl-4">
                  <li>Net Subtotal (Pre-tax)</li>
                  <li>Promotional / Trade Discounts</li>
                  <li>Freight & Shipping charges</li>
                  <li>Tax Breakdowns (Sales Tax / GST)</li>
                  <li>Total Amount Payable</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="extraction-methods" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              3. Three Invoice Extraction Methods Compared
            </h2>
            <p>
              Depending on your technical setup and document volume, three extraction methodologies exist:
            </p>

            <div className="overflow-x-auto not-prose my-6">
              <table className="w-full text-left text-xs sm:text-sm border-collapse border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead className="bg-zinc-100 dark:bg-zinc-800/60 font-semibold text-zinc-900 dark:text-zinc-100">
                  <tr>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Method</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">How It Works</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Best For</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Limitations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-white">Fixed Template Anchors</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Extracts text from fixed X, Y coordinates per vendor.</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">High-volume identical vendors (e.g. AWS monthly bills).</td>
                    <td className="p-3 text-red-600 font-medium">Breaks whenever vendor updates their PDF template.</td>
                  </tr>
                  <tr className="bg-brand-50/40 dark:bg-brand-950/20">
                    <td className="p-3 font-bold text-brand-700 dark:text-brand-300">Heuristic Spatial Parsing</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Scans for keyword anchors ('Total', 'Tax', 'Due') and finds aligned text horizontally.</td>
                    <td className="p-3 font-semibold text-emerald-600">General business invoices across varied suppliers.</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Requires OCR pre-processing if scanned.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-white">AI / LLM Extraction</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Sends text tokens into large language models to output JSON schema.</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Highly irregular, unstructured, or foreign language bills.</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">High API cost, higher latency, requires cloud transmission.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section id="math-integrity" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              4. Mathematical Validation & Cross-Checking
            </h2>
            <p>
              The hallmark of professional document intelligence software is <strong>automated mathematical integrity checking</strong>. When an invoice table is parsed, the software should run two automated validation checks before exporting:
            </p>

            <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 not-prose">
              <div className="flex items-start gap-3">
                <Calculator className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Check 1: Line Item Extension Check</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    Math.abs(Quantity × UnitPrice - LineAmount) &lt; 0.02
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Confirms that item totals match the stated unit rate and quantity within standard rounding tolerance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Check 2: Ledger Balance Check</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    Math.abs((Σ LineAmounts + Tax + Freight - Discounts) - TotalDue) &lt; 0.02
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Guarantees that the sum of line items reconciles perfectly with the final accounts payable balance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="accounting-export" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              5. Exporting for QuickBooks, Xero & ERP Systems
            </h2>
            <p>
              When exporting to Excel or CSV, formatting matters. Different accounting platforms require specific row alignments:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Single Flat Ledger (Standard CSV):</strong> Replicates the header fields (Invoice #, Date, Vendor) on every line item row. This allows pivot tables and QuickBooks IIF/CSV import wizards to attribute all line items to one bill.
              </li>
              <li>
                <strong>Multi-Tab Excel (.xlsx):</strong> Sheet 1 contains the high-level Invoice Summary (one row per document for ledger control). Sheet 2 contains the granular Line Item details linked by Invoice ID.
              </li>
              <li>
                <strong>Clean Numeric Typing:</strong> Exporting numbers as raw floats (e.g. <code>1450.50</code>) rather than string text formatted with currency glyphs (<code>"$1,450.50"</code>) prevents broken formulas in Excel.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="privacy-audit" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              6. Why Privacy Matters for Supplier Bills
            </h2>
            <p>
              Vendor invoices contain highly sensitive business intelligence:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Proprietary trade pricing and negotiated vendor discount schedules.</li>
              <li>Supplier bank account coordinates and international wire instructions (SWIFT / IBAN).</li>
              <li>Internal employee names and procurement authorization hierarchies.</li>
            </ul>
            <p>
              Uploading these financial records to unverified online converters risks data leakage and violates SOC 2 and GDPR compliance. By processing documents inside your browser via local WebAssembly, your documents never touch a third-party server.
            </p>
          </section>

          {/* Section 7 */}
          <section id="faq" className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              7. Frequently Asked Questions
            </h2>

            <div className="space-y-4 not-prose">
              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  Can I extract multi-page invoice tables without repeating header rows?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Yes. Advanced table extractors detect identical header rows across consecutive pages and deduplicate them into a single consolidated table, appending line items seamlessly.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  How do you handle invoices with varying date formats like DD/MM/YYYY vs MM/DD/YYYY?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Extraction systems use locale-aware normalization algorithms. By cross-referencing the vendor country code, tax registration prefix (e.g. GB vs US), and day/month values exceeding 12, the engine resolves the unambiguous ISO 8601 standard date (YYYY-MM-DD).
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  Is it safe to process confidential vendor invoices in the browser?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Yes. In-browser client-side extraction processes all PDF streams in local computer memory via WebAssembly. Neither supplier names, negotiated unit discounts, nor banking wire coordinates are ever uploaded or saved to remote cloud servers.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <div className="p-8 bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-zinc-900 dark:to-brand-950/30 border border-brand-200 dark:border-brand-800/40 rounded-3xl space-y-4 not-prose">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Extract Your First Invoice into Excel
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                  Upload vendor invoices and export line items, dates, and amounts into structured spreadsheets. Free, instant, and 100% private.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/invoice-to-excel"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition"
                >
                  <Receipt className="w-4 h-4" /> Open Invoice Extractor
                </Link>
                <Link
                  to="/pdf-to-data"
                  className="px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  Universal PDF Data Extractor
                </Link>
              </div>
            </div>
          </div>

          {/* Author Box */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4 not-prose">
            <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-base flex-shrink-0">
              PW
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">PDF Workspace Engineering Team</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Specialists in document financial extraction, accounts payable automation, and browser data privacy.
              </p>
            </div>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}

