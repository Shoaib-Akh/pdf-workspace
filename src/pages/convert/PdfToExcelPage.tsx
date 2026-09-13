import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { FileSpreadsheet, Download, Table, ArrowRight, CheckCircle2, Sparkles, Shield, AlertCircle, RefreshCw } from 'lucide-react'
import { loadPDF } from '@/services/pdf/pdfEngine'
import { extractFullData, type ExtractionResult } from '@/services/extraction/textExtractor'
import { exportFullExtractionToExcel } from '@/services/extraction/excelExporter'
import { Progress } from '@/components/ui/progress'

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
    <PageLayout>
      <MetaTags
        title="PDF to Excel — Extract PDF Tables to Spreadsheet"
        description="Convert PDF tables directly into Microsoft Excel (.xlsx) spreadsheets. Fast client-side tabular extraction with layout preservation."
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
      </div>
    </PageLayout>
  )
}
