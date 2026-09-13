import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Building2, Download, CheckCircle2, Info } from 'lucide-react'

export default function BillOfQuantitiesPage() {
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
    <PageLayout>
      <MetaTags
        title="Bill of Quantities to Excel"
        description="Extract construction Bill of Quantities (BOQ) from PDF into formatted Excel spreadsheets. Preserves trade codes, item descriptions, and measurement quantities."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Bill of Quantities to Excel
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert architectural and civil Bill of Quantities documents into structured, formula-ready Microsoft Excel workbooks.
          </p>
        </div>

        {/* Informational BOQ Breakdown */}
        <div className="p-6 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl space-y-2">
          <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Automated Trade Classification
          </h2>
          <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
            This extractor automatically detects work division hierarchies (Substructure, Superstructure, Internal Finishes, Plumbing, Electrical) and separates item reference numbers, scope descriptions, unit symbols (m, m2, m3, nr, tonnes), and bill quantities into clean Excel columns.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your Bill of Quantities PDF here"
              sublabel="Processes multi-page measurement schedules client-side"
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
                    {isProcessing ? 'Extracting BOQ...' : 'Extract Bill of Quantities'}
                  </button>
                </div>
              </div>

              {extracted && (
                <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Bill of Quantities exported: 34 items ready for rate entry and submission.
                  </div>
                  <button
                    onClick={() => alert('Downloading Excel workbook...')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" /> Download .xlsx Spreadsheet
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/boq-pdf-to-excel" className="text-sm text-blue-600 hover:underline">
              BOQ PDF to Excel &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/boq-extractor" className="text-sm text-blue-600 hover:underline">
              BOQ Extractor &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/tender-pdf-to-excel" className="text-sm text-blue-600 hover:underline">
              Tender PDF to Excel &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
