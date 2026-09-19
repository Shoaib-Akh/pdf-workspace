import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import { Link } from 'react-router-dom'
import {
  Sparkles, Download, ShieldCheck, CheckCircle, Table,
  RefreshCw, AlertCircle, FileText, ArrowRight
} from 'lucide-react'
import { runBrowserOcr, type OcrProgress } from '@/services/ocr/ocrEngine'
import { detectTablesFromText } from '@/services/extraction/textExtractor'
import { exportTablesToExcel } from '@/services/extraction/excelExporter'
import { Progress } from '@/components/ui/progress'
import { downloadBlob } from '@/lib/utils'

export default function ScannedPdfToExcelPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<OcrProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [extractedRows, setExtractedRows] = useState<string[][] | null>(null)
  const [rowCount, setRowCount] = useState(0)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setExtractedRows(null)
      setError(null)
      setProgress(null)
    }
  }

  const handleRunOcr = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setExtractedRows(null)

    try {
      const ocrResult = await runBrowserOcr(file, {
        language: 'eng',
        maxPages: 10,
        onProgress: (p) => setProgress(p),
      })

      const pageTexts = ocrResult.pages.map((p) => p.text)
      const detectedTables = detectTablesFromText(pageTexts)

      let rows: string[][] = []

      if (detectedTables.length > 0) {
        // Use the largest detected table
        const bestTable = detectedTables.reduce((a, b) =>
          (a.rows.length > b.rows.length ? a : b)
        )
        rows = [bestTable.headers, ...bestTable.rows]
      } else {
        // Fallback: smart line-based reconstruction
        // Group OCR lines by spacing — lines close together → same row
        const allLines = ocrResult.fullText
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0 && !l.startsWith('--- Page'))

        rows = allLines.map((line) => {
          // Split on 2+ spaces or tabs
          const parts = line.split(/\s{2,}|\t/).map((p) => p.trim()).filter(Boolean)
          return parts.length > 1 ? parts : [line]
        })
      }

      if (rows.length === 0) {
        rows = [['OCR Content'], [ocrResult.fullText.slice(0, 500)]]
      }

      setExtractedRows(rows)
      setRowCount(rows.length)
    } catch (err: any) {
      setError(err.message || 'OCR table recognition failed.')
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
    downloadBlob(blob, `${file.name.replace(/\.pdf$/i, '')}_ocr_tables.csv`)
  }

  const handleDownloadExcel = async () => {
    if (!extractedRows || !file) return
    const headers = extractedRows[0] || ['Column 1']
    const rows = extractedRows.slice(1)
    await exportTablesToExcel(
      [{ id: 'ocr-1', pageNumber: 1, headers, rows, confidence: 0.8 }],
      `${file.name.replace(/\.pdf$/i, '')}_ocr_tables.xlsx`
    )
  }

  const reset = () => {
    setFile(null)
    setExtractedRows(null)
    setError(null)
    setProgress(null)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Scanned PDF to Excel — OCR Tables and Export to XLSX Online Free"
        description="Convert scanned PDF tables, paper invoices, and bank statements into Microsoft Excel (.xlsx) spreadsheets using browser-based OCR. 100% private, no uploads."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            Scanned PDF to Excel — OCR Table Extraction
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Extract tables and numeric data from scanned PDFs, paper documents, and photographs
            into Microsoft Excel (.xlsx). Browser-based OCR — zero uploads, completely free.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-sm space-y-6">
          {!extractedRows && !isProcessing && (
            <>
              {!file ? (
                <DropZone
                  onFileSelect={handleFileSelect}
                  label="Select a scanned PDF or image"
                  sublabel="Supports PDF, JPG, PNG — OCR + table detection runs on your device (max 10 pages)"
                />
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="w-8 h-8 text-green-500 flex-shrink-0" />
                      <div className="truncate">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={reset} className="text-xs text-red-600 hover:underline ml-2 shrink-0">Remove</button>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                    </div>
                  )}

                  <button
                    onClick={handleRunOcr}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Table className="w-4 h-4" /> Run OCR &amp; Detect Tables
                  </button>
                </div>
              )}
            </>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="text-center space-y-5 py-6">
              <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Recognizing text and tables…</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {progress
                    ? `Page ${progress.currentPage} of ${progress.totalPages}`
                    : 'Initializing OCR engine…'}
                </p>
              </div>
              {progress && (
                <div className="max-w-sm mx-auto space-y-1">
                  <Progress value={progress.percent} className="h-2" />
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {extractedRows && file && (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-2 text-sm text-green-800 dark:text-green-300">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-semibold">Tables extracted!</span>
                <span className="text-xs text-green-600">({rowCount} rows found)</span>
              </div>

              {/* Preview table */}
              <div className="max-h-52 overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {extractedRows.slice(0, 8).map((row, ri) => (
                      <tr key={ri} className={ri === 0
                        ? 'bg-gray-100 dark:bg-gray-800 font-semibold'
                        : 'border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }>
                        {row.map((cell, ci) => (
                          <td key={ci} className="p-1.5 border-r border-gray-100 dark:border-gray-800 truncate max-w-[150px]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {extractedRows.length > 8 && (
                  <p className="text-xs text-gray-400 text-center py-1.5">…and {extractedRows.length - 8} more rows</p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadExcel}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export Excel (.xlsx)
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Convert Another
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>100% private — OCR runs on your device, files never uploaded</span>
          </div>
        </div>

        {/* Related tools */}
        <div className="rounded-2xl border border-zinc-200 dark:border-gray-800 bg-zinc-50/70 dark:bg-gray-800/40 p-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-3">Related Tools</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'OCR PDF', to: '/ocr-pdf' },
              { label: 'Scanned PDF to Word', to: '/scanned-pdf-to-word' },
              { label: 'Scanned PDF to Text', to: '/scanned-pdf-to-text' },
              { label: 'PDF to Excel', to: '/pdf-to-excel' },
              { label: 'Invoice to Excel', to: '/invoice-to-excel' },
              { label: 'BOQ to Excel', to: '/boq-pdf-to-excel' },
            ].map((tag) => (
              <Link
                key={tag.label}
                to={tag.to}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-gray-300 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all"
              >
                <span>{tag.label}</span>
                <ArrowRight className="h-3 w-3 text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
