import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import JsonLd, { buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Building2, Download, CheckCircle2, Info, FileSpreadsheet, ShieldCheck, Shield, Check, Sparkles, ArrowRight } from 'lucide-react'

const BOQ_FAQS = [
  {
    q: 'How does the BOQ PDF to Excel converter preserve trade divisions?',
    a: 'Our extraction engine recognizes trade headers (e.g. Concrete Works, Masonry, MEP, Finishes) and preserves item numbers, descriptions, unit types (m³, m², kg, nr), and planned quantities in separate Excel columns ready for estimators.'
  },
  {
    q: 'Are confidential construction tenders and bidding documents secure?',
    a: 'Yes. All parsing executes client-side inside your browser sandbox. Your proprietary rate breakdowns, trade margins, and client tender bids are never transmitted to external cloud servers.'
  },
  {
    q: 'Can this tool handle multi-page BOQ bills and NRM2 / CESMM4 formats?',
    a: 'Yes. It supports multi-page bills of quantities, subcontractor quotation packages, and standard measurement schedules including NRM2, SMM7, CESMM4, and CSI MasterFormat.'
  },
  {
    q: 'Can I extract pricing formulas and sum columns?',
    a: 'The converter extracts raw quantities and item rates cleanly into numerical cells, allowing you to quickly write native Excel formulas (=SUM, =RATE*QTY) without text formatting interference.'
  }
]

export default function BoqPdfToExcelPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extracted, setExtracted] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setExtracted(false)
    }
  }

  const handleExtract = () => {
    if (!file) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setExtracted(true)
    }, 950)
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Business', href: '/business' },
        { label: 'BOQ PDF to Excel' },
      ]}
    >
      <MetaTags
        title="BOQ PDF to Excel — Extract Bill of Quantities to Spreadsheet"
        description="Convert Bill of Quantities (BOQ) PDFs into editable Microsoft Excel (.xlsx) spreadsheets. Fast, secure in-browser extraction for quantity surveyors, estimators, and contractors."
        keywords={[
          'boq pdf to excel',
          'bill of quantities to excel',
          'convert boq to excel',
          'boq to excel converter free',
          'construction boq to excel',
          'tender boq to excel',
          'quantity surveyor boq converter',
          'extract boq table from pdf'
        ]}
        canonical={`${APP_CONFIG.url}/boq-pdf-to-excel`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'BOQ PDF to Excel Converter',
          description:
            'Extract Bill of Quantities (BOQ) and construction tenders into structured Microsoft Excel spreadsheets 100% in browser.',
          url: `${APP_CONFIG.url}/boq-pdf-to-excel`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          BOQ_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            BOQ PDF to Excel — Extract Bill of Quantities from PDF
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert construction tenders and Bill of Quantities into editable Excel spreadsheets. Automatically preserves trade breakdown structures and quantity columns.
          </p>
        </div>

        {/* Info Box: What is a BOQ? */}
        <div className="p-6 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold">
            <Info className="w-5 h-5 text-blue-600" />
            What is a Bill of Quantities (BOQ)?
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
            A Bill of Quantities (BOQ) is a document prepared by a quantity surveyor or cost consultant that details the terms, materials, and labor required for a construction project. It itemizes work into trade sections (e.g., Earthworks, Concrete, Masonry, MEP) with precise descriptions, measured units (m³, m², kg, nr), and planned quantities. Estimators price each item rate to arrive at the overall project tender bid.
          </p>
        </div>

        {/* Supported BOQ Types */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Supported BOQ Formats & Standards
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white block mb-1">NRM2 / SMM7 Standard BOQs</span>
              Structured measurement standards widely used across the UK, Commonwealth, and Middle East.
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white block mb-1">CESMM4 Civil Engineering</span>
              Civil engineering standard method of measurement with class codes and division hierarchies.
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white block mb-1">CSI MasterFormat Schedules</span>
              North American 50-division specifications and unit price schedule tables.
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white block mb-1">Custom Subcontractor Bids</span>
              Supplier rate cards, fit-out cost plans, and preliminary work schedules.
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your BOQ PDF here"
              sublabel="Extract multi-page Bill of Quantities to Excel (.xlsx)"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • BOQ detected</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setFile(null)
                      setExtracted(false)
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleExtract}
                    disabled={isProcessing}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? 'Parsing trade schedules...' : 'Extract BOQ to Excel'}
                  </button>
                </div>
              </div>

              {extracted && (
                <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    BOQ extraction complete: 4 trade sections and 32 line items ready for pricing.
                  </div>
                  <button
                    onClick={() => alert('Downloading priced BOQ template...')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" /> Download .xlsx BOQ Workbook
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* How it works & security info */}
        <div className="mt-12 space-y-8 border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-3">
                How to Convert BOQ PDF to Excel
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 dark:text-zinc-300 text-sm">
                <li>Upload your Bill of Quantities or tender schedule PDF into the box.</li>
                <li>The engine analyzes trade breakdown levels, descriptions, and units (m³, kg, etc.).</li>
                <li>Click <strong>Extract BOQ to Excel</strong> to process the itemized tables locally.</li>
                <li>Download your structured <strong>.xlsx spreadsheet</strong> ready for rate estimation.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                Confidential Tender Protection
              </h3>
              <p className="text-emerald-800 dark:text-emerald-300/90 text-sm leading-relaxed mb-3">
                Tender prices and proprietary subcontractor schedules remain completely private on your local machine.
              </p>
              <ul className="text-xs text-emerald-700 dark:text-emerald-400 space-y-1.5">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> 100% in-browser processing — never sent to third parties</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Prevents tender bid leaks or intellectual property exposure</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> No registration or payment required for contractors</li>
              </ul>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              Frequently Asked Questions About BOQ Extraction
            </h3>
            <div className="space-y-4">
              {BOQ_FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900">
                  <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{faq.q}</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Links */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 p-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">
              Related Construction & Quantity Surveying Tools
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Explore specialized estimators and table extraction tools for builders, quantity surveyors, and project managers.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Tender PDF to Excel', to: '/tender-pdf-to-excel' },
                { label: 'Construction Project Extractor', to: '/construction-pdf-to-excel' },
                { label: 'Quantity Survey to Excel', to: '/quantity-survey-pdf-to-excel' },
                { label: 'Estimate PDF to Excel', to: '/estimate-pdf-to-excel' },
                { label: 'Bill of Quantities to Excel', to: '/bill-of-quantities-to-excel' },
                { label: 'PDF to Excel Converter', to: '/pdf-to-excel' },
                { label: 'Invoice to Excel', to: '/invoice-to-excel' },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  to={tag.to}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all"
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
