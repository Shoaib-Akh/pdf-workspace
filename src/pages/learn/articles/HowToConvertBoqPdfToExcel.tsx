import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import JsonLd, { buildArticleSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, HardHat, FileSpreadsheet, ArrowRight, BookOpen, HelpCircle, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function HowToConvertBoqPdfToExcel() {
  const pageUrl = `${APP_CONFIG.url}/learn/how-to-convert-boq-pdf-to-excel`

  const articleSchema = buildArticleSchema({
    title: 'How to Convert BOQ PDF to Excel for Construction Bidding',
    description: 'Step-by-step guide for estimators and quantity surveyors converting tender Bill of Quantities (BOQ) PDFs into priced Excel takeoff models.',
    url: pageUrl,
    publishedTime: '2026-09-03T08:00:00Z',
    modifiedTime: '2026-09-12T10:00:00Z',
    authorName: 'PDF Workspace Engineering Team',
  })

  const faqSchema = buildFAQSchema([
    {
      question: 'How do you handle multi-line item descriptions in a construction BOQ?',
      answer: 'Standard converters create a new spreadsheet row for every wrapped line, corrupting column alignment. Our BOQ extractor detects item numbers (e.g. 1.01, 1.02) as row anchors, concatenating secondary lines into a single description cell.',
    },
    {
      question: 'Does the converted Excel sheet include formulas?',
      answer: 'The extractor exports clean numeric columns for Quantity and Rate, and automatically inserts standard Excel multiplication formulas (=Quantity*Rate) into the Total Amount column.',
    },
    {
      question: 'Can I convert 100+ page civil tender BOQs?',
      answer: 'Yes. In our browser extractor, multi-page tenders are processed sequentially, merging repeating headers across chapters into a single contiguous estimating workbook.',
    },
  ])

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: 'Home', url: APP_CONFIG.url },
    { name: 'Learn', url: `${APP_CONFIG.url}/learn` },
    { name: 'Convert BOQ to Excel', url: pageUrl }
  ])

  return (
    <PageLayout>
      <MetaTags
        title="How to Convert BOQ PDF to Excel for Construction Bidding — Estimator Guide"
        description="Learn how to convert tender Bill of Quantities (BOQ) PDFs into clean, formula-ready Excel spreadsheets without broken rows or lost descriptions."
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
            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Construction & Estimating
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5" /> 10 min read
            </span>
            <span className="text-xs text-zinc-400">• Published Sep 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            How to Convert BOQ PDF to Excel for Construction Bidding
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            Tender deadlines are tight. Estimators and quantity surveyors lose countless hours manually retyping Bill of Quantities schedules into Excel. Here is how to convert BOQ PDFs accurately in minutes.
          </p>
        </header>

        {/* Table of Contents */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" /> In This Guide
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-brand-600 dark:text-brand-400">
            <li><a href="#the-boq-problem" className="hover:underline">1. The BOQ Problem in Construction</a></li>
            <li><a href="#anatomy-of-boq" className="hover:underline">2. Anatomy of a Standard Tender BOQ</a></li>
            <li><a href="#step-by-step" className="hover:underline">3. Step-by-Step Conversion Walkthrough</a></li>
            <li><a href="#multiline-descriptions" className="hover:underline">4. Solving Multi-Line Item Descriptions</a></li>
            <li><a href="#pre-bidding-checks" className="hover:underline">5. Four Critical Verification Checks</a></li>
            <li><a href="#trades-differences" className="hover:underline">6. Civil vs MEP vs Architectural BOQs</a></li>
            <li><a href="#faq" className="hover:underline">7. FAQ</a></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="prose dark:prose-invert max-w-none space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <section id="the-boq-problem" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              1. The BOQ Problem: Why Estimators Waste Hours on Manual Entry
            </h2>
            <p>
              In commercial construction, architects and quantity surveyors issue procurement tenders as non-editable PDF documents to preserve layout and legal wording. But general contractors and subcontractors must price these tenders in Microsoft Excel or specialized estimating software like Candy, CostX, or Procore.
            </p>
            <p>
              Manually typing hundreds of line items into Excel is not only grueling — it introduces severe pricing risks. A single misplaced decimal point or skipped row can cause a six-figure bidding error that either loses the tender or causes a catastrophic deficit upon contract award.
            </p>
          </section>

          <section id="anatomy-of-boq" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              2. Anatomy of a Standard Tender BOQ
            </h2>
            <p>
              Regardless of whether a project uses MasterFormat, NRM, or SMM7 standards, almost all construction bills share a 5-to-7 column architecture:
            </p>
            <div className="overflow-x-auto not-prose">
              <table className="w-full text-xs sm:text-sm text-left border-collapse border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white">
                  <tr>
                    <th className="p-3 border-b">Item #</th>
                    <th className="p-3 border-b">Description</th>
                    <th className="p-3 border-b">Unit</th>
                    <th className="p-3 border-b">Qty</th>
                    <th className="p-3 border-b">Rate (USD)</th>
                    <th className="p-3 border-b">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="p-3 font-mono font-semibold">03.10.1</td>
                    <td className="p-3">Cast-in-place reinforced concrete foundation footings (30 MPa)</td>
                    <td className="p-3 font-mono">m3</td>
                    <td className="p-3 font-mono">420.00</td>
                    <td className="p-3 font-mono text-zinc-400">[To be priced]</td>
                    <td className="p-3 font-mono text-zinc-400">[=Qty*Rate]</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA Banner */}
          <div className="not-prose my-8 p-6 bg-gradient-to-r from-amber-50 to-brand-50 dark:from-amber-950/30 dark:to-brand-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                <HardHat className="w-5 h-5 text-amber-600" /> Convert your tender BOQ to Excel now
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                Specialized construction parser: handles multi-line descriptions and preserves item numbering.
              </p>
            </div>
            <Link
              to="/boq-pdf-to-excel"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-sm transition whitespace-nowrap"
            >
              Open BOQ to Excel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <section id="step-by-step" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              3. Step-by-Step Conversion Walkthrough
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>Open our dedicated <Link to="/boq-pdf-to-excel" className="text-brand-600 font-semibold hover:underline">BOQ PDF to Excel Tool</Link>.</li>
              <li>Upload your tender schedule PDF (files up to 500MB supported).</li>
              <li>The construction algorithm runs item-anchor detection, identifying hierarchy codes like <code>1.01</code>, <code>Division 03</code>, or <code>Section B</code>.</li>
              <li>Review the extracted table in the browser spreadsheet viewer.</li>
              <li>Download as <code>.xlsx</code> with pre-formatted numeric columns ready for formulas.</li>
            </ol>
          </section>

          <section id="multiline-descriptions" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              4. Solving the Multi-Line Description Dilemma
            </h2>
            <p>
              In tender documents, item specifications frequently span several lines:
            </p>
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl font-mono text-xs leading-relaxed">
              1.04 Supply and install 150mm thick rigid polyisocyanurate<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;insulation board, including mechanical fasteners, vapor<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;barrier membrane, and expansion joint trims.&nbsp;&nbsp;&nbsp;&nbsp;m2&nbsp;&nbsp;&nbsp;&nbsp;1,250
            </div>
            <p>
              Generic PDF converters treat each physical line as a separate spreadsheet row. This creates 3 rows in Excel, with the Quantity "1,250" sitting on Row 3 while the Item Number "1.04" sits on Row 1!
            </p>
            <p>
              Our construction algorithm utilizes <strong>anchor token indexing</strong>: it knows that an Item Number initiates a record, while secondary lines belong to the same description cell until a new anchor or section header is encountered.
            </p>
          </section>

          <section id="pre-bidding-checks" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              5. Four Critical Verification Checks Before Pricing
            </h2>
            <div className="space-y-3 not-prose">
              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. Quantity Sum Control Check
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Select the Quantity column in Excel and check the <code>SUM()</code> against the subtotal stated in the original tender summary page.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 2. Unit of Measure Normalization
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Verify that units (m2, m3, nr, item, sum, tonne) were not accidentally merged into the quantity column.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3. Section Continuity
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Confirm that section headings (e.g. Earthworks, Concrete, Finishes) remain distinct dividers between item blocks.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 4. Currency and Comma Formatting
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Ensure numbers with thousand separators (e.g. "1,450.00") are parsed as numeric values rather than strings.
                </p>
              </div>
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
                  How do you handle multi-line item descriptions in a construction BOQ?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Our extractor detects item numbers (e.g. 1.01, 1.02) as row anchors, concatenating secondary lines into a single description cell.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Does the converted Excel sheet include formulas?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  The extractor exports clean numeric columns for Quantity and Rate, and inserts standard Excel multiplication formulas (=Quantity*Rate) into the Total Amount column.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Can I convert 100+ page civil tender BOQs?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Yes. In our browser extractor, multi-page tenders are processed sequentially, merging repeating headers across chapters into a single contiguous estimating workbook.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Author Bio */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4 not-prose">
          <div className="w-12 h-12 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
            PW
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Written by the PDF Workspace Engineering Team</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Developed in partnership with commercial construction estimators and quantity surveying practitioners.
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
              to="/learn/how-to-extract-tables-from-pdf"
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition group space-y-1.5"
            >
              <span className="text-[10px] font-bold text-brand-600 uppercase">Extraction</span>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-brand-600 transition line-clamp-2">
                How to Extract Tables from PDF Documents
              </h4>
            </Link>

            <Link
              to="/learn/how-to-extract-invoice-data-from-pdf"
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition group space-y-1.5"
            >
              <span className="text-[10px] font-bold text-brand-600 uppercase">Business</span>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-brand-600 transition line-clamp-2">
                How to Extract Invoice Data from PDF to Excel
              </h4>
            </Link>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}
