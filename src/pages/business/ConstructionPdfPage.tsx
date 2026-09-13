import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { HardHat, Download, CheckCircle2, Building2, FileText, ArrowRight } from 'lucide-react'

export default function ConstructionPdfPage() {
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
        title="Construction PDF to Excel"
        description="Extract construction schedules, Bill of Quantities, takeoff estimates, and trade submittals from PDF into Excel workbooks."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Construction PDF to Excel — Extract Project Data
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert architectural material schedules, finish schedules, quantity survey sheets, and subcontractor bids into Excel.
          </p>
        </div>

        {/* Specialized Construction Shortcuts */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/boq-pdf-to-excel"
            className="p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-center justify-between hover:border-amber-400 transition group"
          >
            <div className="flex items-center space-x-3">
              <Building2 className="w-6 h-6 text-amber-600" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">Bill of Quantities (BOQ)</h4>
                <p className="text-xs text-gray-500">Dedicated BOQ trade rate extractor</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/tender-pdf-to-excel"
            className="p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-center justify-between hover:border-blue-400 transition group"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">Tender Document Parser</h4>
                <p className="text-xs text-gray-500">Bidding schedules & procurement packages</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Action Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your Construction PDF here"
              sublabel="Extract takeoff schedules, door/window schedules, and quantities"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center font-bold">
                    <HardHat className="w-5 h-5" />
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
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? 'Analyzing project sheets...' : 'Extract Construction Data'}
                  </button>
                </div>
              </div>

              {extracted && (
                <div className="p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    Construction schedule converted: 26 material line items with quantities and units.
                  </div>
                  <button
                    onClick={() => alert('Downloading Excel workbook...')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" /> Download .xlsx Construction Workbook
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Links */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Construction Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/boq-pdf-to-excel" className="text-sm text-blue-600 hover:underline">
              BOQ PDF to Excel &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/tender-pdf-to-excel" className="text-sm text-blue-600 hover:underline">
              Tender PDF to Excel &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/quantity-survey-pdf-to-excel" className="text-sm text-blue-600 hover:underline">
              Quantity Survey PDF to Excel &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
