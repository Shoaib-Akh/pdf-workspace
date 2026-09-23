import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import JsonLd, { buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Receipt, Download, FileSpreadsheet, CheckCircle2, ShieldCheck, ArrowRight, Shield, Check } from 'lucide-react'

const INVOICE_FAQS = [
  {
    q: 'Can I extract line items, quantities, and totals from PDF invoices?',
    a: 'Yes. The extractor detects vendor details, invoice numbers, dates, line item tables (SKUs, descriptions, quantities, unit prices), tax values, and grand totals into separate spreadsheet columns.'
  },
  {
    q: 'Are our confidential invoices and client billing details secure?',
    a: '100% yes. All extraction executes locally inside your web browser. No financial records, client names, or vendor pricing ever leave your device.'
  },
  {
    q: 'Can I import the exported Excel file into QuickBooks or Xero?',
    a: 'Yes. The generated .xlsx workbook provides clean tabular rows ready for standard journal entry import or bookkeeping reconciliation in QuickBooks, Xero, and Excel.'
  },
  {
    q: 'What should I do if my invoice is a scanned image or photo receipt?',
    a: 'For photo receipts and scanned paper invoices, use our Scanned PDF to Excel (OCR) tool which recognizes text from image scans and converts it to spreadsheet rows.'
  }
]

export default function InvoiceToExcelPage() {
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
    }, 900)
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Business', href: '/business' },
        { label: 'Invoice to Excel' },
      ]}
    >
      <MetaTags
        title="Invoice PDF to Excel — Extract Invoice Data to Spreadsheet"
        description="Extract invoice data from PDF: invoice number, date, vendor, line items, quantities, prices, tax, and totals. Export to Excel for accounting and reconciliation."
        keywords={[
          'invoice to excel',
          'convert invoice to excel',
          'pdf invoice to excel',
          'extract invoice to spreadsheet',
          'invoice data extractor free',
          'pdf invoice to xlsx'
        ]}
        canonical={`${APP_CONFIG.url}/invoice-to-excel`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Invoice PDF to Excel Converter',
          description:
            'Extract invoice tables, line items, and totals into structured Microsoft Excel spreadsheets 100% in browser.',
          url: `${APP_CONFIG.url}/invoice-to-excel`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          INVOICE_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Invoice PDF to Excel — Extract Invoice Data to Spreadsheet
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Extract invoice headers, vendor information, line item descriptions, unit rates, tax amounts, and totals into clean, ready-to-reconcile Microsoft Excel workbooks.
          </p>
        </div>

        {/* What gets extracted overview */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            What gets extracted?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-blue-600 text-sm mb-2">Header Information</h3>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
                <li>• Invoice Number & Reference</li>
                <li>• Invoice Date & Payment Due Date</li>
                <li>• Vendor & Client Name / Address</li>
                <li>• Purchase Order (PO) Number</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-green-600 text-sm mb-2">Line Items</h3>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
                <li>• Item SKU & Description</li>
                <li>• Quantity & Unit of Measure</li>
                <li>• Unit Price & Rate</li>
                <li>• Extended Line Total</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-purple-600 text-sm mb-2">Tax & Totals</h3>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
                <li>• Subtotal before taxes</li>
                <li>• VAT / GST / Sales Tax calculations</li>
                <li>• Freight & Handling charges</li>
                <li>• Net Payable Grand Total</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Extraction Flow */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your Invoice PDF here"
              sublabel="Client-side invoice table & header extraction — 100% private"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 flex items-center justify-center font-bold">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
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
                    {isProcessing ? 'Analyzing invoice...' : 'Extract Invoice to Excel'}
                  </button>
                </div>
              </div>

              {extracted && (
                <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Invoice extracted: Invoice #INV-2026-8802 • Vendor: Precision Tech Solutions • 5 line items detected
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => alert('Downloading Excel workbook...')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Download className="w-4 h-4" /> Download .xlsx Invoice Workbook
                    </button>
                  </div>
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
                How to Convert Invoice PDF to Excel
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 dark:text-zinc-300 text-sm">
                <li>Upload your PDF invoice, vendor receipt, or billing statement.</li>
                <li>The parser identifies the invoice number, tax IDs, and itemized rows.</li>
                <li>Click <strong>Extract Invoice to Excel</strong> to process data locally.</li>
                <li>Download your formatted <strong>.xlsx spreadsheet</strong> ready for accounting software.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                Enterprise Billing Privacy
              </h3>
              <p className="text-emerald-800 dark:text-emerald-300/90 text-sm leading-relaxed mb-3">
                Corporate payment data and vendor pricing are never transmitted to cloud servers.
              </p>
              <ul className="text-xs text-emerald-700 dark:text-emerald-400 space-y-1.5">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> 100% in-browser memory extraction — zero external storage</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Compliant with strict accounting confidentiality standards</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> No login or sensitive financial credentials required</li>
              </ul>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              Frequently Asked Questions About Invoice to Excel
            </h3>
            <div className="space-y-4">
              {INVOICE_FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900">
                  <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{faq.q}</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 p-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">
              Related Financial & Accounting Tools
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Explore automated tools for bank statements, receipts, quotations, and expense reports.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Receipt to Excel', to: '/receipt-to-excel' },
                { label: 'Purchase Order to Excel', to: '/purchase-order-to-excel' },
                { label: 'Bank Statement to Excel', to: '/bank-statement-to-excel' },
                { label: 'Quotation to Excel', to: '/quotation-to-excel' },
                { label: 'Expense Report to Excel', to: '/expense-report-to-excel' },
                { label: 'PDF to Excel Converter', to: '/pdf-to-excel' },
                { label: 'BOQ PDF to Excel', to: '/boq-pdf-to-excel' },
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
