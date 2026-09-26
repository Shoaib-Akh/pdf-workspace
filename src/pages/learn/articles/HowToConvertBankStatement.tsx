import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import JsonLd, { buildArticleSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  FileSpreadsheet,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react'

export default function HowToConvertBankStatement() {
  const pageUrl = `${APP_CONFIG.url}/learn/how-to-convert-bank-statement`

  const articleSchema = buildArticleSchema({
    title: 'How to Convert Bank Statements from PDF to Excel or CSV',
    description: 'Learn how accountants and bookkeepers convert bank and credit card PDF statements into reconciled Excel spreadsheets without risking confidential banking credentials.',
    url: pageUrl,
    publishedTime: '2026-09-04T08:00:00Z',
    modifiedTime: '2026-09-12T10:00:00Z',
    authorName: 'PDF Guru Engineering Team',
  })

  const faqSchema = buildFAQSchema([
    {
      question: 'How do you handle multi-line transaction descriptions?',
      answer: 'Bank statements often wrap vendor notes across two or three lines before the next date appears. An intelligent parser groups dangling text lines back into the preceding transaction row rather than creating empty ghost rows.',
    },
    {
      question: 'How do I know the extracted statement balances are 100% mathematically correct?',
      answer: 'The system validates every row against the running balance equation: Opening Balance plus Inflows minus Outflows must equal the Closing Balance. Any discrepancy triggers an instant visual flag for review.',
    },
    {
      question: 'Is it safe to upload bank statements to this website?',
      answer: 'You do not upload them. Our extraction engine executes entirely inside your web browser via WebAssembly. Your account numbers, balances, and confidential payment history never leave your device.',
    },
    {
      question: 'Can I import the resulting CSV into QuickBooks or Xero?',
      answer: 'Yes. The exporter formats tables into standard accounting CSV schemas with clean Date, Description, and Amount (or Debit/Credit) columns ready for one-click banking feed import.',
    },
  ])

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: 'Home', url: APP_CONFIG.url },
    { name: 'Learn', url: `${APP_CONFIG.url}/learn` },
    { name: 'Convert Bank Statement', url: pageUrl },
  ])

  return (
    <PageLayout>
      <MetaTags
        title="How to Convert Bank Statements from PDF to Excel or CSV — Complete Guide"
        description="Convert bank statements from PDF to Excel or CSV securely. Learn transaction parsing, multi-line narrative handling, and mathematical balance verification."
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
            <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Banking & Bookkeeping
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5" /> 7 min read
            </span>
            <span className="text-xs text-zinc-400">• Published Sep 2026 • Technical Review</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            How to Convert Bank Statements from PDF to Excel or CSV
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            Financial institutions issue statements as locked PDF documents to preserve an unalterable audit trail. When reconciling ledgers, however, bookkeepers need editable spreadsheets. Here is how to convert bank statements cleanly and securely.
          </p>
        </header>

        {/* Table of Contents */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" /> In This Guide
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-brand-600 dark:text-brand-400">
            <li><a href="#why-banks-use-pdf" className="hover:underline">1. Why Banks Issue PDFs Instead of CSVs</a></li>
            <li><a href="#security-first" className="hover:underline">2. The Security-First Requirement (Zero Upload)</a></li>
            <li><a href="#ledger-structure" className="hover:underline">3. Anatomy of a Bank Statement Ledger</a></li>
            <li><a href="#common-traps" className="hover:underline">4. Four Common Bank Statement Traps</a></li>
            <li><a href="#reconciliation-formula" className="hover:underline">5. Running Balance Mathematical Verification</a></li>
            <li><a href="#accounting-import" className="hover:underline">6. Preparing Clean CSVs for QuickBooks & Xero</a></li>
            <li><a href="#faq" className="hover:underline">7. Frequently Asked Questions</a></li>
          </ul>
        </div>

        {/* Content Body */}
        <div className="prose dark:prose-invert max-w-none space-y-10 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <section id="why-banks-use-pdf" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              1. Why Banks Issue PDFs Instead of CSVs
            </h2>
            <p>
              Business owners and accountants constantly ask: <em>"Why do banks provide downloadable PDFs for monthly statements, but restrict historical CSV downloads to 90 days?"</em>
            </p>
            <p>
              Banks favor PDF for three structural reasons:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li><strong>Legal Non-Repudiation:</strong> A digitally signed PDF statement represents a frozen historical snapshot that cannot be trivially edited in Excel without invalidating the cryptographic signature.</li>
              <li><strong>Consistent Visual Layout:</strong> Statutory disclosures, interest rate calculation methodologies, and overdraft fee schedules are guaranteed to render identically regardless of the recipient's computer operating system.</li>
              <li><strong>Marketing & Branding:</strong> Corporate statements embed branch addresses, relationship manager contacts, and product promotional messaging that cannot be rendered inside a raw delimited text file.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="security-first" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              2. The Security-First Requirement: Zero-Upload Extraction
            </h2>
            <p>
              Bank and credit card statements are among the most confidential files any business handles. They reveal:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Full account numbers and bank routing transit numbers (ABA/IBAN/Sort Code).</li>
              <li>Total liquid cash reserves and credit limits.</li>
              <li>Payroll distributions and executive compensation records.</li>
              <li>Names of major commercial clients and proprietary vendors.</li>
            </ul>

            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-start gap-3 not-prose my-6">
              <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                <p className="font-bold">Zero-Upload Client-Side Guarantee</p>
                <p>
                  Never upload bank statements to generic "free PDF converter" websites that upload documents to unverified cloud servers. Our platform parses the PDF coordinates directly inside your local web browser engine via WebAssembly. Your statement never touches our servers.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="ledger-structure" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              3. Anatomy of a Bank Statement Ledger
            </h2>
            <p>
              A bank statement table is fundamentally a double-entry transaction journal. A robust conversion tool separates the file into two sections:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 not-prose my-6">
              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Summary Header Block
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Statement Period & Balances</h3>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pt-1 list-disc pl-4">
                  <li>Statement Start Date & End Date</li>
                  <li>Opening (Starting) Cash Balance</li>
                  <li>Total Deposits / Credits (+)</li>
                  <li>Total Withdrawals / Debits (-)</li>
                  <li>Closing (Ending) Cash Balance</li>
                </ul>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Transaction Table Rows
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Granular Bank Movements</h3>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pt-1 list-disc pl-4">
                  <li>Posting Date & Transaction Date</li>
                  <li>Payee / Description / Check #</li>
                  <li>Outflow (Debit / Charge)</li>
                  <li>Inflow (Credit / Deposit)</li>
                  <li>Daily Running Balance</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="common-traps" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              4. Four Common Bank Statement Traps (And How to Solve Them)
            </h2>
            <p>
              Basic PDF converters fail on bank statements because banking layouts violate standard spreadsheet assumptions:
            </p>

            <div className="space-y-4 not-prose">
              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Trap 1: Multi-Line Narrative Wrapping</h3>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">High Frequency</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  A wire description like <code>"WIRE TRANSFER INCOMING / REF: ACME CORP / CUST ID 8892"</code> often wraps across three physical lines without new date or amount tokens. Naive converters generate three separate Excel rows, leaving the second and third rows with blank amounts.
                  <br />
                  <strong className="text-brand-600 dark:text-brand-400">Solution:</strong> The parser treats the Date column as the primary row delimiter, concatenating dangling text lines into the active parent transaction narrative.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Trap 2: Ambiguous Debit vs Credit Representation</h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">Accounting Rule</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Some banks use separate <strong>Debit</strong> and <strong>Credit</strong> columns. Others merge them into a single <strong>Amount</strong> column using accounting parentheses <code>(250.00)</code>, trailing minus signs <code>250.00-</code>, or text flags like <code>250.00 DR</code>.
                  <br />
                  <strong className="text-brand-600 dark:text-brand-400">Solution:</strong> The extractor standardizes negative amounts into signed IEEE floating point numbers (<code>-250.00</code>) so spreadsheets can sum columns without manual reformatting.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Trap 3: Mid-Page Category Headers</h3>
                  <span className="text-xs font-bold text-zinc-600 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">Layout Noise</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Statements frequently break transactions into subsections: <em>"Deposits and Additions"</em>, <em>"ATM & Debit Card Withdrawals"</em>, and <em>"Electronic Bill Payments"</em>. These section banners interrupt the table grid.
                  <br />
                  <strong className="text-brand-600 dark:text-brand-400">Solution:</strong> The parser flags non-transaction banner strings and strips them from the main transaction ledger or stores them as metadata attributes.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Trap 4: Multi-Page Pagination Subtotals</h3>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full">Pagination</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Bottom-of-page rows reading <em>"SUBTOTAL CARRIED FORWARD TO PAGE 3"</em> will duplicate accounting numbers if imported into accounting software.
                  <br />
                  <strong className="text-brand-600 dark:text-brand-400">Solution:</strong> Footer pattern filters suppress carry-over sums, preserving only discrete transactional movements.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="reconciliation-formula" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              5. Running Balance Mathematical Verification
            </h2>
            <p>
              How do you know that a converted 20-page statement hasn't dropped a transaction line? The golden rule of bookkeeping is the <strong>Running Balance Equation</strong>.
            </p>

            <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 not-prose">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-sm">
                <Calculator className="w-5 h-5 text-brand-600" />
                The Running Balance Verification Algorithm
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                For every transaction row <span className="font-mono">i</span> in chronological order:
              </p>
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl font-mono text-xs text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                Balance[i] = Balance[i-1] + Inflow[i] - Outflow[i]
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                If the calculated balance differs from the stated balance on any row by more than 0.01 currency units, the converter automatically highlights the row in red for immediate human audit.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="accounting-import" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              6. Preparing Clean CSVs for QuickBooks, Xero & ERPs
            </h2>
            <p>
              Once extracted, transaction data should be saved in standard bank feed schemas. Two formats are universally accepted:
            </p>

            <div className="overflow-x-auto not-prose my-6">
              <table className="w-full text-left text-xs sm:text-sm border-collapse border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead className="bg-zinc-100 dark:bg-zinc-800/60 font-semibold text-zinc-900 dark:text-zinc-100">
                  <tr>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Format Type</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Columns</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Compatible Software</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Sample Row</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-white">3-Column Single Amount</td>
                    <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400">Date, Description, Amount</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">QuickBooks Online, Wave, FreshBooks</td>
                    <td className="p-3 font-mono text-xs text-zinc-500">2026-08-14, Google Workspace, -18.00</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-white">4-Column Debit / Credit</td>
                    <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400">Date, Description, Debit, Credit</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Xero, NetSuite, Sage 50</td>
                    <td className="p-3 font-mono text-xs text-zinc-500">2026-08-14, Google Workspace, 18.00, 0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                  How do you handle multi-line transaction descriptions?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Bank statements often wrap vendor notes across two or three lines before the next date appears. An intelligent parser groups dangling text lines back into the preceding transaction row rather than creating empty ghost rows.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  How do I know the extracted statement balances are 100% mathematically correct?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  The system validates every row against the running balance equation: Opening Balance plus Inflows minus Outflows must equal the Closing Balance. Any discrepancy triggers an instant visual flag for review.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  Is it safe to upload bank statements to this website?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  You do not upload them. Our extraction engine executes entirely inside your web browser via WebAssembly. Your account numbers, balances, and confidential payment history never leave your device.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <div className="p-8 bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-zinc-900 dark:to-brand-950/30 border border-brand-200 dark:border-brand-800/40 rounded-3xl space-y-4 not-prose">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Convert Your Bank Statement into Excel or CSV
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                  Reconcile ledgers in minutes. Extract transaction rows and export directly into accounting spreadsheets with 100% privacy.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/bank-statement-to-excel"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition"
                >
                  <CreditCard className="w-4 h-4" /> Convert Bank Statement
                </Link>
                <Link
                  to="/pdf-to-data"
                  className="px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  Universal Extractor
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
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">PDF Guru Engineering Team</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Specialists in financial ledger parsing, mathematical reconciliation models, and zero-knowledge client-side computation.
              </p>
            </div>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}

