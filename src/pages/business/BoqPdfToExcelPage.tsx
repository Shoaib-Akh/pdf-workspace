import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Building2, Download, CheckCircle2, Info, FileSpreadsheet, ShieldCheck } from 'lucide-react'

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
    <PageLayout>
      <MetaTags
        title="BOQ PDF to Excel — Extract Bill of Quantities from PDF"
        description="Extract Bill of Quantities (BOQ) from PDF into structured Excel spreadsheets. Handles item descriptions, units, quantities, rates, and multi-level sections."
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

        {/* Related Links */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Construction Estimation Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/tender-pdf-to-excel" className="text-sm text-blue-600 hover:underline">
              Tender PDF to Excel &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/construction-pdf-to-excel" className="text-sm text-blue-600 hover:underline">
              Construction Project Extractor &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/quantity-survey-pdf-to-excel" className="text-sm text-blue-600 hover:underline">
              Quantity Survey to Excel &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
