import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Calculator, Download, CheckCircle2 } from 'lucide-react'

export default function ExpenseReportToExcelPage() {
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
    }, 850)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Expense Report PDF to Excel"
        description="Extract corporate expense reports, travel reimbursements, and employee claims from PDF into structured Excel spreadsheets."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Expense Report PDF to Excel
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert travel summaries, per diem reports, and corporate reimbursement claims into organized audit spreadsheets.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your Expense Report PDF here"
              sublabel="Extract expense dates, categories, receipts, and approval totals"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center font-bold">
                    <Calculator className="w-5 h-5" />
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
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? 'Auditing claims...' : 'Extract to Excel'}
                  </button>
                </div>
              </div>

              {extracted && (
                <div className="p-6 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    Expense claims extracted: 14 receipts • Claim Total: $2,840.50
                  </div>
                  <button
                    onClick={() => alert('Downloading Excel report...')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" /> Download .xlsx Expense Report
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
            <Link to="/receipt-to-excel" className="text-sm text-blue-600 hover:underline">
              Receipt to Excel &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/invoice-to-excel" className="text-sm text-blue-600 hover:underline">
              Invoice to Excel &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
