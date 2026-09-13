import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Sparkles, Download, ShieldCheck, CheckCircle, Table, RefreshCw, AlertCircle } from 'lucide-react'
import { runBrowserOcr, type OcrProgress } from '@/services/ocr/ocrEngine'
import { detectTablesFromText } from '@/services/extraction/textExtractor'
import { exportTablesToExcel } from '@/services/extraction/excelExporter'
import { Progress } from '@/components/ui/progress'

export default function ScannedPdfToExcelPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<OcrProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [extractedRows, setExtractedRows] = useState<string[][] | null>(null)
  const [rawText, setRawText] = useState<string>('')

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setExtractedRows(null)
      setRawText('')
      setError(null)
      setProgress(null)
    }
  }

  const handleRunOcr = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setExtractedRows(null)
    setRawText('')

    try {
      const ocrResult = await runBrowserOcr(file, {
        language: 'eng',
        maxPages: 10,
        onProgress: (p) => setProgress(p),
      })

      setRawText(ocrResult.fullText)

      // Run table detection on the OCR page texts
      const pageTexts = ocrResult.pages.map((p) => p.text)
      const detectedTables = detectTablesFromText(pageTexts)

      if (detectedTables.length > 0) {
        const primaryTable = detectedTables[0]
        const combined = [primaryTable.headers, ...primaryTable.rows]
        setExtractedRows(combined)
      } else {
        // Fallback: parse lines from OCR text into columns if possible
        const lines = ocrResult.fullText
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0 && !l.startsWith('--- Page'))

        const rows = lines.map((line) => {
          const parts = line.split(/\s{2,}|\t/).map((p) => p.trim())
          return parts.length > 1 ? parts : [line]
        })

        setExtractedRows(rows.length > 0 ? rows : [['Recognized OCR Content'], [ocrResult.fullText]])
      }
    } catch (err: any) {
      setError(err.message || 'Scanned table recognition failed.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadCsv = () => {
    if (!extractedRows || !file) return
    const csvContent = extractedRows
      .map((row) => row.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.pdf$/i, '')}_scanned_tables.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadExcel = async () => {
    if (!extractedRows || !file) return
    const headers = extractedRows[0] || ['Column 1']
    const rows = extractedRows.slice(1)

    const tableObj = {
      id: 'ocr-table-1',
      pageNumber: 1,
      headers,
      rows,
      confidence: 0.8,
    }

    await exportTablesToExcel([tableObj], `${file.name.replace(/\.pdf$/i, '')}_ocr_extracted.xlsx`)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Scanned PDF to Excel — OCR Tables and Export"
        description="Convert scanned PDF tables, paper invoices, and statements into editable Microsoft Excel (.xlsx) spreadsheets using Optical Character Recognition."
      />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Scanned PDF to Excel — OCR and Table Extraction
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Extract tabular grids and numeric columns from scanned documents, paper statements, and phone photos into Excel. Choose between quick client-side tabular OCR or server-grade neural vision table reconstruction.
          </p>
        </div>

        {/* Dual Options Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Option 1: Browser Table OCR */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Browser OCR Table Extraction
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Client-Side OCR Grid Detection
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Processes scanned text and tabular lines locally in your browser. Fast, 100% private, and exports directly to CSV and Excel (.xlsx) format.
              </p>

              {!file ? (
                <DropZone
                  onFileSelect={handleFileSelect}
                  label="Select scanned PDF for table OCR"
                  sublabel="Extracts tables on your device — up to 10 pages"
                />
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between truncate">
                    <div className="truncate">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null)
                        setExtractedRows(null)
                        setProgress(null)
                        setError(null)
                      }}
                      disabled={isProcessing}
                      className="text-xs text-red-600 hover:underline ml-2"
                    >
                      Remove
                    </button>
                  </div>

                  {isProcessing && progress && (
                    <div className="space-y-2 p-3 bg-amber-50/70 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/30">
                      <div className="flex justify-between text-xs font-medium text-amber-900 dark:text-amber-200">
                        <span className="flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                          {progress.stage}
                        </span>
                        <span>{progress.percent}%</span>
                      </div>
                      <Progress value={progress.percent} className="h-1.5" />
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  {!extractedRows ? (
                    <button
                      onClick={handleRunOcr}
                      disabled={isProcessing}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Recognizing Tables...
                        </>
                      ) : (
                        <>
                          <Table className="w-4 h-4" /> Run OCR & Detect Tables
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-2 text-xs text-green-800 dark:text-green-300">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        Found {extractedRows.length} extracted row(s)! Ready to download.
                      </div>

                      {/* Small Preview Table */}
                      <div className="max-h-48 overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900">
                        <table className="w-full text-left border-collapse">
                          <tbody>
                            {extractedRows.slice(0, 6).map((r, ri) => (
                              <tr key={ri} className={ri === 0 ? 'bg-gray-100 dark:bg-gray-800 font-semibold' : 'border-t border-gray-100 dark:border-gray-800'}>
                                {r.map((c, ci) => (
                                  <td key={ci} className="p-1.5 border-r border-gray-100 dark:border-gray-800 truncate max-w-[120px]">
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleDownloadExcel}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> Export Excel (.xlsx)
                        </button>
                        <button
                          onClick={handleDownloadCsv}
                          className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> Export CSV
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Option 2: Server-Side Advanced Formatted Excel */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Neural Table Vision Service
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Complex Matrix Excel Reconstruction
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Handles nested sub-headers, merged multi-line descriptions, vertical text, and borderless tables using deep learning vision models.
              </p>

              <ServerRequiredState
                toolName="Neural Scanned Table OCR Service"
                alternateToolSlug="pdf-to-data"
                alternateToolName="Digital PDF Table Extractor"
              />
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related OCR Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/ocr-pdf" className="text-sm text-blue-600 hover:underline">
              Standard OCR PDF &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/scanned-pdf-to-text" className="text-sm text-blue-600 hover:underline">
              Scanned PDF to Plain Text &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/scanned-pdf-to-word" className="text-sm text-blue-600 hover:underline">
              Scanned PDF to Word &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/boq-pdf-to-excel" className="text-sm text-blue-600 hover:underline">
              BOQ PDF to Excel &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
