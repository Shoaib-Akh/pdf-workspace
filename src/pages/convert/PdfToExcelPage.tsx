import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import JsonLd, { buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import PageLayout from '@/components/layout/PageLayout'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { FileSpreadsheet, Download, Table, ArrowRight, CheckCircle2, Sparkles, Shield, AlertCircle, RefreshCw, Layers, Check } from 'lucide-react'
import { loadPDF } from '@/services/pdf/pdfEngine'
import { extractFullData, type ExtractionResult } from '@/services/extraction/textExtractor'
import { exportFullExtractionToExcel } from '@/services/extraction/excelExporter'
import { Progress } from '@/components/ui/progress'
import { APP_CONFIG } from '@/lib/config'
import { PDF_TO_EXCEL_KEYWORDS, PDF_TO_EXCEL_POPULAR_SEARCHES } from '@/data/seoKeywords'

const PDF_TO_EXCEL_FAQS = [
  {
    q: 'How do I convert a PDF to Excel for free?',
    a: 'Upload or drop your PDF into the converter above. Our browser engine detects tables, columns, and rows, and allows you to download a clean .xlsx spreadsheet immediately with zero sign-up or fee.'
  },
  {
    q: 'Are my financial documents and sensitive PDFs private?',
    a: 'Yes, 100%. Extraction runs entirely inside your browser using client-side WebAssembly and JavaScript. Your documents are never uploaded to any remote server or cloud storage.'
  },
  {
    q: 'Can I extract tables from scanned PDF documents?',
    a: 'For scanned PDFs or photo documents, visit our Scanned PDF to Excel (OCR) tool which uses optical character recognition to read and extract text from images into spreadsheet columns.'
  },
  {
    q: 'Will the formatting and column structure of my tables be preserved?',
    a: 'Yes, our extraction algorithm analyzes bounding boxes and horizontal alignments to reconstruct columns, headers, and numerical values accurately into Microsoft Excel sheets.'
  },
  {
    q: 'Is there a limit on how many files I can convert?',
    a: 'No. Because all computation runs locally on your computer, there are no hourly or daily conversion limits.'
  }
]

export default function PdfToExcelPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null)
  const [progressStage, setProgressStage] = useState('')
  const [progressPercent, setProgressPercent] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setExtractionResult(null)
      setError(null)
    }
  }

  const handleExtract = async () => {
    if (!file) return
    setIsExtracting(true)
    setError(null)
    setExtractionResult(null)
    setProgressStage('Loading PDF...')
    setProgressPercent(10)

    try {
      const doc = await loadPDF(file)
      const result = await extractFullData(doc, (stage, pct) => {
        setProgressStage(stage)
        setProgressPercent(pct)
      })
      setExtractionResult(result)
    } catch (err: any) {
      setError(err.message || 'Failed to extract table data from PDF.')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleDownloadExcel = async () => {
    if (!file || !extractionResult) return
    const outName = `${file.name.replace(/\.pdf$/i, '')}_extracted.xlsx`
    await exportFullExtractionToExcel(extractionResult, outName)
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Convert', href: '/convert' },
        { label: 'PDF to Excel' },
      ]}
    >
      <MetaTags
        title="PDF to Excel Converter — Extract Tables to XLSX Free & Private"
        description="Convert PDF tables and tabular figures into Microsoft Excel (.xlsx) spreadsheets online. 100% private in-browser extraction with zero file uploads."
        keywords={PDF_TO_EXCEL_KEYWORDS}
        canonical={`${APP_CONFIG.url}/pdf-to-excel`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online PDF to Excel Converter',
          description:
            'Convert PDF tables and documents to Microsoft Excel (.xlsx) workbooks online. 100% private in-browser processing.',
          url: `${APP_CONFIG.url}/pdf-to-excel`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          PDF_TO_EXCEL_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            PDF to Excel — Extract Tables and Data to Spreadsheet
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Extract tabular data, columns, and financial figures from your PDF directly into Microsoft Excel (.xlsx) workbooks. No manual copying and pasting cell by cell. For detailed cell editing and key-value attributes, explore our{' '}
            <Link to="/pdf-to-data" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
              PDF to Data tool <ArrowRight className="w-3.5 h-3.5" />
            </Link>.
          </p>
        </div>

        {/* Browser Extraction Flow */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                Browser Table Extraction
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Processes text-based PDF tables locally with zero cloud upload
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-800">
              <Shield className="w-3 h-3" /> 100% Client-Side
            </span>
          </div>

          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF table here"
              sublabel="Extract tables to Excel (.xlsx) in your browser"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 flex items-center justify-center font-bold text-xs">
                    XLSX
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • Tables ready for conversion</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setFile(null)
                      setExtractionResult(null)
                      setError(null)
                    }}
                    disabled={isExtracting}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition disabled:opacity-50"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleExtract}
                    disabled={isExtracting}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Extracting...
                      </>
                    ) : (
                      'Extract to Excel'
                    )}
                  </button>
                </div>
              </div>

              {isExtracting && (
                <div className="p-4 bg-green-50/60 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-medium text-green-900 dark:text-green-200">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-green-600" />
                      {progressStage || 'Processing...'}
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-3 text-sm text-red-800 dark:text-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Extraction Notice</p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {extractionResult && (
                <div className="p-5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Data processed! Found {extractionResult.tables.length} table(s), {extractionResult.keyValuePairs.length} key fields, and {extractionResult.pageCount} pages.
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleDownloadExcel}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Download className="w-4 h-4" /> Download .XLSX Workbook
                    </button>
                    <Link
                      to="/pdf-to-data"
                      className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 flex items-center gap-1.5 transition"
                    >
                      Open in Advanced Data Extractor &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Server Required State for Complex Layout */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complex Document Layouts
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Documents with split merged cells, non-standard financial ledgers, or image scans require specialized layout pipelines.
            </p>
          </div>

          <ServerRequiredState
            toolName="Neural Financial Matrix Excel Engine"
            alternateToolSlug="pdf-to-data"
            alternateToolName="Client-Side PDF Data Extractor"
          />
        </div>

        {/* How it works & security info */}
        <div className="mt-12 space-y-8 border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-3">
                How to Convert PDF to Excel Online Free
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 dark:text-zinc-300 text-sm">
                <li>Upload your PDF file by dragging it into the box or selecting it from your device.</li>
                <li>Our browser engine analyzes the layout, rows, and column boundaries automatically.</li>
                <li>Click <strong>Extract to Excel</strong> to process the table structures locally.</li>
                <li>Download your formatted <strong>.xlsx spreadsheet</strong> ready to open in Microsoft Excel or Google Sheets.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                100% Private Client-Side Processing
              </h3>
              <p className="text-emerald-800 dark:text-emerald-300/90 text-sm leading-relaxed mb-3">
                Your financial ledgers, vendor invoices, BOQs, and sensitive client documents never touch a third-party server.
              </p>
              <ul className="text-xs text-emerald-700 dark:text-emerald-400 space-y-1.5">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Zero cloud uploads — 100% in-browser memory</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Compliant with strict corporate data protection standards</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> No registration, credit card, or email address required</li>
              </ul>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Why Convert PDF to Excel with PDF Guru?
            </h3>
            <div className="grid sm:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">Accurate Column Detection</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  Advanced heuristics align multi-column grids and numbers without corrupting decimal formats or headers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">Native .XLSX Output</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  Generated workbooks are fully compatible with Microsoft Excel 2016+, Office 365, Google Sheets, and LibreOffice.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">No File Size Limits</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  Process large, multi-page business reports without being blocked by arbitrary upload file caps.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              Frequently Asked Questions About PDF to Excel
            </h3>
            <div className="space-y-4">
              {PDF_TO_EXCEL_FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900">
                  <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{faq.q}</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Searches & Related Tags */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 p-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">
              Related Searches & PDF Extraction Tools
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Explore specialized tools for extracting tabular data, financial sheets, and organizing PDFs.
            </p>
            <div className="flex flex-wrap gap-2">
              {PDF_TO_EXCEL_POPULAR_SEARCHES.map((tag) => (
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
