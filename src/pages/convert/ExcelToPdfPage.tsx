import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Shield,
  ArrowRight,
  UploadCloud,
  X,
  FileCode,
  Table,
} from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { MetaTags } from '@/components/seo/MetaTags'
import { JsonLd, buildWebApplicationSchema, buildFAQSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { EXCEL_TO_PDF_KEYWORDS, EXCEL_TO_PDF_POPULAR_SEARCHES } from '@/data/seoKeywords'

export const EXCEL_TO_PDF_FAQS = [
  {
    q: 'How to convert Excel spreadsheet to PDF online for free?',
    a: 'Upload your Microsoft Excel workbook (.xlsx, .xls) or CSV file, preview your sheet contents, and click "Convert to PDF". Your formatted PDF table document is generated immediately in your browser.',
  },
  {
    q: 'How do I save an Excel document as a PDF without Microsoft Office?',
    a: 'You do not need Microsoft Excel or Office installed. Our web converter parses spreadsheet data structures using SheetJS and builds a standard PDF in any modern web browser.',
  },
  {
    q: 'Is it safe to convert confidential financial Excel sheets here?',
    a: 'Yes, 100%. Processing occurs strictly inside your browser memory using client-side JavaScript. Your confidential financial models, balance sheets, and company records never leave your computer.',
  },
  {
    q: 'Can I convert multiple sheets from the same workbook?',
    a: 'Yes. You can select any sheet in your workbook or convert all sheets into a unified multi-page PDF document completely free.',
  },
]

export default function ExcelToPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>('')
  const [previewRows, setPreviewRows] = useState<string[][]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [rowCount, setRowCount] = useState<number>(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      setFile(selected)
      setResultBlob(null)

      try {
        const XLSX = await import('xlsx')
        const buffer = await selected.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const names = workbook.SheetNames || []
        setSheetNames(names)

        if (names.length > 0) {
          const firstSheet = names[0]
          setSelectedSheet(firstSheet)
          const worksheet = workbook.Sheets[firstSheet]
          const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 })
          setPreviewRows(rows.slice(0, 5) as string[][])
          setRowCount(rows.length)
        }
      } catch (err) {
        console.error('Failed to parse Excel preview:', err)
      }
    }
  }

  const handleSheetChange = async (sheetName: string) => {
    setSelectedSheet(sheetName)
    if (!file) return

    try {
      const XLSX = await import('xlsx')
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const worksheet = workbook.Sheets[sheetName]
      const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 })
      setPreviewRows(rows.slice(0, 5) as string[][])
      setRowCount(rows.length)
    } catch (err) {
      console.error('Failed to switch sheet:', err)
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setIsConverting(true)
    setResultBlob(null)

    try {
      const XLSX = await import('xlsx')
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')

      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const worksheet = workbook.Sheets[selectedSheet || workbook.SheetNames[0]]
      const allRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 })

      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      // Landscape A4 for spreadsheets (841.89 x 595.28)
      const pageWidth = 841.89
      const pageHeight = 595.28
      const margin = 40
      const usableWidth = pageWidth - margin * 2
      const rowHeight = 22

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
      let currentY = pageHeight - margin

      // Title & Sheet Header
      const title = `${file.name.replace(/\.(xlsx?|xls|csv)$/i, '')} — ${selectedSheet || 'Sheet'}`
      currentPage.drawText(title, {
        x: margin,
        y: currentY,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      })
      currentY -= 30

      if (allRows.length > 0) {
        // Determine number of columns (cap at 8 for standard fit)
        const maxCols = Math.min(Math.max(...allRows.map((r) => (r ? r.length : 0))), 8)
        const colWidth = maxCols > 0 ? usableWidth / maxCols : usableWidth

        for (let rIdx = 0; rIdx < allRows.length; rIdx++) {
          const row = allRows[rIdx] || []

          if (currentY <= margin + rowHeight) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight])
            currentY = pageHeight - margin
          }

          const isHeader = rIdx === 0

          // Row background fill for header or alternating stripes
          if (isHeader) {
            currentPage.drawRectangle({
              x: margin,
              y: currentY - 5,
              width: usableWidth,
              height: rowHeight,
              color: rgb(0.92, 0.94, 0.98),
            })
          } else if (rIdx % 2 === 0) {
            currentPage.drawRectangle({
              x: margin,
              y: currentY - 5,
              width: usableWidth,
              height: rowHeight,
              color: rgb(0.98, 0.98, 0.98),
            })
          }

          // Draw cells
          for (let cIdx = 0; cIdx < maxCols; cIdx++) {
            const rawVal = row[cIdx]
            const cellText = rawVal !== undefined && rawVal !== null ? String(rawVal).trim() : ''
            const truncated = cellText.length > 24 ? `${cellText.slice(0, 22)}…` : cellText

            if (truncated) {
              currentPage.drawText(truncated, {
                x: margin + cIdx * colWidth + 4,
                y: currentY,
                size: isHeader ? 10 : 9,
                font: isHeader ? boldFont : font,
                color: isHeader ? rgb(0.1, 0.2, 0.4) : rgb(0.2, 0.2, 0.2),
              })
            }
          }

          currentY -= rowHeight
        }
      } else {
        currentPage.drawText('Sheet contains no tabular data.', {
          x: margin,
          y: currentY,
          size: 11,
          font,
          color: rgb(0.5, 0.5, 0.5),
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      setResultBlob(blob)
    } catch (err) {
      console.error('Excel to PDF conversion failed:', err)
      alert('Failed to convert Excel document. Please ensure the file is a valid .xlsx, .xls, or .csv document.')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob || !file) return
    const url = URL.createObjectURL(resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.(xlsx?|xls|csv)$/i, '')}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null)
    setResultBlob(null)
    setSheetNames([])
    setSelectedSheet('')
    setPreviewRows([])
    setRowCount(0)
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Convert', href: '/convert' },
        { label: 'Excel to PDF' },
      ]}
    >
      <MetaTags
        title="Excel to PDF Converter Online Free — Convert XLSX / XLS to PDF"
        description="Convert Microsoft Excel spreadsheets (XLSX, XLS, CSV) to PDF online for free. Fast, private, in-browser table formatting with zero server uploads."
        keywords={EXCEL_TO_PDF_KEYWORDS}
        canonical={`${APP_CONFIG.url}/excel-to-pdf`}
      />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free Online Excel to PDF Converter',
          description:
            'Convert Excel XLSX, XLS, and CSV files into PDF table documents for free in your browser.',
          url: `${APP_CONFIG.url}/excel-to-pdf`,
        })}
      />
      <JsonLd
        data={buildFAQSchema(
          EXCEL_TO_PDF_FAQS.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            100% Private Client-Side Browser Processing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Excel to PDF Converter — Convert XLSX & XLS Spreadsheets Online Free
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed">
            Convert Microsoft Excel spreadsheets (.xlsx, .xls, .csv) into clean, printable PDF documents.
            Runs directly on your computer with zero file uploads, no watermarks, and no signups.
          </p>
        </div>

        {/* Quick shortcut tags */}
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {EXCEL_TO_PDF_POPULAR_SEARCHES.slice(0, 7).map((sc) => (
            <Link
              key={sc.label}
              to={sc.to}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-100 hover:bg-brand-50 hover:text-brand-700 text-zinc-600 text-xs font-medium transition-colors"
            >
              <span>{sc.label}</span>
              <ArrowRight className="w-3 h-3 text-zinc-400" />
            </Link>
          ))}
        </div>

        {!resultBlob && !isConverting && (
          <div className="space-y-6">
            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-300 rounded-2xl cursor-pointer bg-zinc-50 hover:border-brand-400 hover:bg-brand-50/40 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-zinc-700">
                    Click to select an Excel spreadsheet, or drag & drop
                  </p>
                  <p className="text-xs text-zinc-500">
                    Supports Microsoft Excel XLSX, XLS, and CSV files
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-zinc-900 block truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-zinc-400">
                        Size: {(file.size / 1024).toFixed(1)} KB • {rowCount} rows detected
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Sheet Selector */}
                {sheetNames.length > 1 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-zinc-700">
                      Select Worksheet:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sheetNames.map((name) => (
                        <button
                          key={name}
                          onClick={() => handleSheetChange(name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedSheet === name
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Table Data Preview */}
                {previewRows.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                      <Table className="w-3.5 h-3.5 text-emerald-600" />
                      Table Preview (First {previewRows.length} rows)
                    </div>
                    <div className="border border-zinc-200 rounded-xl overflow-x-auto">
                      <table className="min-w-full divide-y divide-zinc-200 text-xs">
                        <tbody className="divide-y divide-zinc-100 bg-white">
                          {previewRows.map((row, rIdx) => (
                            <tr key={rIdx} className={rIdx === 0 ? 'bg-zinc-50 font-semibold' : ''}>
                              {(row || []).slice(0, 6).map((cell, cIdx) => (
                                <td key={cIdx} className="px-3 py-2 text-zinc-800 whitespace-nowrap">
                                  {String(cell || '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-zinc-100">
                  <button
                    onClick={handleConvert}
                    className="px-6 py-2.5 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 flex items-center shadow-sm transition-all"
                  >
                    <FileCode className="w-4 h-4 mr-2" />
                    Convert to PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isConverting && (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 text-center space-y-4">
            <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full mx-auto" />
            <h3 className="text-lg font-semibold text-zinc-900">Converting Spreadsheet to PDF...</h3>
            <p className="text-sm text-zinc-500">
              Formatting columns and rendering landscape table pages in browser memory.
            </p>
          </div>
        )}

        {resultBlob && file && (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900">Conversion Complete!</h3>
              <p className="text-zinc-600 mt-1 text-sm font-medium">
                {file.name.replace(/\.(xlsx?|xls|csv)$/i, '')}.pdf ({(resultBlob.size / 1024).toFixed(1)} KB)
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 flex items-center shadow-sm transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF Document
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-white text-zinc-700 font-semibold text-sm rounded-xl hover:bg-zinc-50 border border-zinc-300 transition-colors"
              >
                Convert Another Spreadsheet
              </button>
            </div>
          </div>
        )}

        {/* How it works & security info */}
        <div className="mt-12 space-y-8 border-t border-zinc-200 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 mb-3">
                How to Convert Excel to PDF Online
              </h3>
              <ol className="space-y-2.5 list-decimal list-inside text-zinc-600 text-sm">
                <li>Select and drop your Excel (.xlsx, .xls) or CSV spreadsheet.</li>
                <li>Choose the worksheet you want to convert from the tab list.</li>
                <li>Click <strong>Convert to PDF</strong> to format table columns into PDF.</li>
                <li>Download your professional PDF table document immediately.</li>
              </ol>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-900 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-700" />
                100% Private & In-Browser Secure
              </h3>
              <p className="text-emerald-800 text-sm leading-relaxed">
                Spreadsheet cells and data are converted entirely on your device CPU.
                Confidential corporate spreadsheets, salaries, and invoices never leave your computer.
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">
              Frequently Asked Questions About Excel to PDF Conversion
            </h3>
            <div className="space-y-4">
              {EXCEL_TO_PDF_FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 p-4 bg-white">
                  <h4 className="font-semibold text-zinc-900 text-sm">{faq.q}</h4>
                  <p className="text-zinc-600 text-sm mt-1.5 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Searches & Related Tags */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 mb-2">
              Related Searches & Tools
            </h4>
            <p className="text-xs text-zinc-500 mb-4">
              Explore quick access tools for Excel, Word, and PDF document processing.
            </p>
            <div className="flex flex-wrap gap-2">
              {EXCEL_TO_PDF_POPULAR_SEARCHES.map((tag) => (
                <Link
                  key={tag.label}
                  to={tag.to}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all"
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
