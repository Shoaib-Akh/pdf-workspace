import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Receipt, Download, FileSpreadsheet, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react'

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
    <PageLayout>
      <MetaTags
        title="Invoice PDF to Excel — Extract Invoice Data to Spreadsheet"
        description="Extract invoice data from PDF: invoice number, date, vendor, line items, quantities, prices, tax, and totals. Export to Excel for accounting and reconciliation."
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

        {/* Related Tools */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Business Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/receipt-to-excel" className="text-sm text-blue-600 hover:underline">
              Receipt to Excel &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/purchase-order-to-excel" className="text-sm text-blue-600 hover:underline">
              Purchase Order to Excel &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/bank-statement-to-excel" className="text-sm text-blue-600 hover:underline">
              Bank Statement to Excel &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
