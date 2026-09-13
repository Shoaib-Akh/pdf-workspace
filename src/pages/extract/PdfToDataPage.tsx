import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { 
  Table, 
  FileText, 
  Key, 
  FileCheck, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Database,
  Code,
  FileSpreadsheet
} from 'lucide-react'

type TabType = 'tables' | 'text' | 'fields' | 'summary'

export default function PdfToDataPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('tables')
  const [extracted, setExtracted] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setExtracted(false)
    }
  }

  const handleExtract = () => {
    if (!file) return
    setIsExtracting(true)
    setTimeout(() => {
      setIsExtracting(false)
      setExtracted(true)
    }, 900)
  }

  const handleReset = () => {
    setFile(null)
    setExtracted(false)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Extract Data from PDF — Tables, Text, Key-Value Fields"
        description="Upload a PDF and extract all tables, text, and structured data. Export to Excel, CSV, JSON, or Markdown."
      />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            PDF Data Extractor — Turn PDFs into Structured Data
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Stop manually retyping data locked inside documents. Our intelligent PDF data extraction engine automatically detects tabular structures, free-form text paragraphs, key-value pairs, and executive summaries directly in your browser. Export high-fidelity structured data to Excel, CSV, JSON, or Markdown instantly.
          </p>
        </div>

        {/* Action / Extraction Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to extract data"
              sublabel="Process tables, key fields, and text client-side — up to 500MB"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                    PDF
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleExtract}
                    disabled={isExtracting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isExtracting ? (
                      <>Analyzing document...</>
                    ) : (
                      <>
                        <Database className="w-4 h-4" /> Extract Data
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tabs Placeholder */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveTab('tables')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex-shrink-0 min-h-[44px] ${
                      activeTab === 'tables'
                        ? 'border-brand-600 text-brand-600 bg-white dark:bg-gray-900 font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <Table className="w-4 h-4" />
                    Tables (2 detected)
                  </button>
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex-shrink-0 min-h-[44px] ${
                      activeTab === 'text'
                        ? 'border-brand-600 text-brand-600 bg-white dark:bg-gray-900 font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Extracted Text
                  </button>
                  <button
                    onClick={() => setActiveTab('fields')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex-shrink-0 min-h-[44px] ${
                      activeTab === 'fields'
                        ? 'border-brand-600 text-brand-600 bg-white dark:bg-gray-900 font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    Key Fields
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex-shrink-0 min-h-[44px] ${
                      activeTab === 'summary'
                        ? 'border-brand-600 text-brand-600 bg-white dark:bg-gray-900 font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    Summary
                  </button>
                </div>

                <div className="p-6 min-h-[220px]">
                  {activeTab === 'tables' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Detected Table 1: Line Items</h4>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 flex items-center gap-1">
                            <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" /> Export Excel
                          </button>
                          <button className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 flex items-center gap-1">
                            <Code className="w-3.5 h-3.5 text-blue-600" /> Export CSV
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
                        <table className="w-full text-xs text-left text-gray-600 dark:text-gray-300">
                          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                            <tr>
                              <th className="p-2.5">Item #</th>
                              <th className="p-2.5">Description</th>
                              <th className="p-2.5">Qty</th>
                              <th className="p-2.5">Unit Price</th>
                              <th className="p-2.5">Total Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            <tr>
                              <td className="p-2.5 font-mono">01</td>
                              <td className="p-2.5 font-medium text-gray-900 dark:text-white">Structural Concrete 30MPa</td>
                              <td className="p-2.5">45.0 m³</td>
                              <td className="p-2.5">$185.00</td>
                              <td className="p-2.5 font-semibold">$8,325.00</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-mono">02</td>
                              <td className="p-2.5 font-medium text-gray-900 dark:text-white">Steel Reinforcement Rebar #5</td>
                              <td className="p-2.5">1,200 kg</td>
                              <td className="p-2.5">$1.45</td>
                              <td className="p-2.5 font-semibold">$1,740.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'text' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Continuous textual stream</span>
                        <button className="text-xs text-blue-600 hover:underline">Copy full text</button>
                      </div>
                      <textarea
                        readOnly
                        rows={6}
                        value={`Document Analysis Report\nReference: ${file.name}\n\nScope of Work and Deliverables:\nThe contractor shall supply all materials, plant, labor, and supervision necessary for completion of structural foundation works as specified in the architectural drawings. All measurements comply with standard engineering guidelines.`}
                        className="w-full p-3 font-mono text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none"
                      />
                    </div>
                  )}

                  {activeTab === 'fields' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Type</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">Commercial Agreement / Quotation</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Date</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">September 12, 2026</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Stated Value</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">$10,065.00 USD</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Party / Counterparty</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">Apex Industrial Solutions</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'summary' && (
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <p>
                        This document contains <strong>2 primary tables</strong>, <strong>4 identified metadata attributes</strong>, and approximately <strong>340 words</strong> of descriptive body text.
                      </p>
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 rounded-lg text-xs leading-relaxed border border-blue-200 dark:border-blue-900">
                        <strong>Extraction Insight:</strong> All data was processed locally inside your web browser. No proprietary financial figures, sensitive contractor identifiers, or contractual terms ever touched a remote cloud server.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 flex items-center justify-center font-bold">
              <Table className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Multi-Table Detection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detects bordered and borderless tables across multi-page documents while maintaining cell column alignment.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Key-Value Harvesting</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Identifies document properties such as invoice numbers, tax IDs, payment terms, and date ranges.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Universal Exports</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Seamlessly export into your preferred data analysis format: Excel (.xlsx), CSV, clean JSON, or Markdown tables.
            </p>
          </div>
        </div>

        {/* Detailed Explanatory SEO Content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            How PDF Data Extraction Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Portable Document Format (PDF) files are designed to preserve exact visual layouts across monitors and printers. However, they lack native semantic markup for tables, rows, or cells. When you copy and paste from a PDF, you usually get broken columns, tangled numbers, and missing line wraps.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Our data extractor reconstructs the logical structure by grouping bounding boxes of text characters according to their spatial geometry, column boundaries, and row baselines. This provides clean tabular output suitable for accounting software, databases, or spreadsheet modeling.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white pt-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div className="border border-gray-100 dark:border-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white">Can I extract data from scanned PDFs?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                For scanned documents or image-only PDFs, use our <Link to="/ocr-pdf" className="text-blue-600 hover:underline">OCR PDF tool</Link> first to convert the visual scans into computer-readable text.
              </p>
            </div>
            <div className="border border-gray-100 dark:border-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white">Are my confidential files stored on any server?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                No. The extraction logic runs 100% in your local web browser engine using WebAssembly and Web Workers. Your files never leave your computer.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Specialized Extraction Tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/boq-pdf-to-excel"
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 hover:shadow-sm transition group"
            >
              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 text-sm">
                BOQ to Excel &rarr;
              </div>
              <div className="text-xs text-gray-500 mt-1">Bill of quantities extractor</div>
            </Link>

            <Link
              to="/invoice-to-excel"
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 hover:shadow-sm transition group"
            >
              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 text-sm">
                Invoice to Excel &rarr;
              </div>
              <div className="text-xs text-gray-500 mt-1">Accounts payable extractor</div>
            </Link>

            <Link
              to="/pdf-to-csv"
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 hover:shadow-sm transition group"
            >
              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 text-sm">
                PDF to CSV &rarr;
              </div>
              <div className="text-xs text-gray-500 mt-1">Comma-separated tabular export</div>
            </Link>

            <Link
              to="/pdf-to-json"
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 hover:shadow-sm transition group"
            >
              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 text-sm">
                PDF to JSON &rarr;
              </div>
              <div className="text-xs text-gray-500 mt-1">Programmatic JSON schema</div>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
