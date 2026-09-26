import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import { useAppStore } from '@/store/appStore'
import { Link } from 'react-router-dom'
import {
  FileText,
  Table,
  RefreshCw,
  Download,
  Copy,
  Trash2,
  FileSpreadsheet,
  Code,
  Check,
  Sparkles,
  ShieldCheck,
  FileCheck2,
  Info,
} from 'lucide-react'

type WorkspaceTab = 'overview' | 'text' | 'tables' | 'convert'

export default function WorkspacePage() {
  const { currentFile, setCurrentFile } = useAppStore()
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview')
  const [copied, setCopied] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setCurrentFile(files[0])
    }
  }

  const handleCopyFilename = () => {
    if (!currentFile) return
    navigator.clipboard.writeText(currentFile.name)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fileSizeMB = currentFile ? (currentFile.size / (1024 * 1024)).toFixed(2) : '0'
  const fileSizeKB = currentFile ? Math.round(currentFile.size / 1024) : 0
  const lastModified = currentFile
    ? new Date(currentFile.lastModified).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : ''

  return (
    <PageLayout>
      <MetaTags
        title="PDF Intelligence Workspace"
        description="Unified browser-based workspace for inspecting, extracting, converting, and analyzing PDF documents."
        noindex={true}
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {!currentFile ? (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <ProcessingModeTag mode="browser" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                PDF Intelligence Workspace
              </h1>
              <p className="max-w-xl mx-auto text-sm text-gray-600 dark:text-gray-400">
                Load any PDF document into your private browser workspace to inspect file metadata and access all conversion tools — 100% in your browser.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
              <DropZone
                onFileSelect={handleFileSelect}
                label="Drop a PDF file to open Workspace"
                sublabel="Processes securely in your browser — zero files uploaded to servers"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Document Header Bar */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4 truncate">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  PDF
                </div>
                <div className="truncate">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {currentFile.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>{fileSizeMB} MB</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Client-Side Session
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={() => setCurrentFile(null)}
                  className="px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Close Document
                </button>
              </div>
            </div>

            {/* Workspace Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-800 flex gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                <FileCheck2 className="w-4 h-4" /> Overview & Metadata
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                  activeTab === 'text'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                <FileText className="w-4 h-4" /> Text Extraction
              </button>
              <button
                onClick={() => setActiveTab('tables')}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                  activeTab === 'tables'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                <Table className="w-4 h-4" /> Table Extraction
              </button>
              <button
                onClick={() => setActiveTab('convert')}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                  activeTab === 'convert'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                <RefreshCw className="w-4 h-4" /> Conversion Hub
              </button>
            </div>

            {/* Tab 1: Overview — actual file metadata */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">File Information</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-xs text-gray-500">File Size</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{fileSizeMB} MB</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-xs text-gray-500">Size (KB)</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{fileSizeKB} KB</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-xs text-gray-500">Last Modified</span>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{lastModified}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">File Properties</h4>
                    <div className="text-xs space-y-1.5 text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl">
                      <p>Name: {currentFile.name}</p>
                      <p>Type: {currentFile.type || 'application/pdf'}</p>
                      <p>Size: {currentFile.size.toLocaleString()} bytes</p>
                      <p>Last Modified: {new Date(currentFile.lastModified).toISOString()}</p>
                    </div>
                  </div>

                  {/* Note about deeper analysis */}
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      For deep page-count, table detection, and text extraction, use the dedicated tool pages below.
                      Full in-browser PDF analysis runs via WebAssembly on each specific tool.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link
                      to="/pdf-to-data"
                      className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold flex items-center justify-between transition"
                    >
                      <span>Extract Tables to Excel</span>
                      <Table className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/pdf-to-txt"
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-between transition"
                    >
                      <span>Extract All Text</span>
                      <FileText className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={handleCopyFilename}
                      className="w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold flex items-center justify-between transition"
                    >
                      <span>{copied ? 'Filename Copied!' : 'Copy Filename'}</span>
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Text Extraction — link to real tool */}
            {activeTab === 'text' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center space-y-5">
                <FileText className="w-12 h-12 text-blue-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Extract Text from PDF</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Full in-browser text extraction is available on the dedicated PDF to Text tool.
                    It uses WebAssembly to parse every character from your document without uploading anything.
                  </p>
                </div>
                <Link
                  to="/pdf-to-txt"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                >
                  Open PDF to Text Tool <Download className="w-4 h-4" />
                </Link>
                <p className="text-xs text-gray-400">
                  Your file stays in your browser — nothing is uploaded.
                </p>
              </div>
            )}

            {/* Tab 3: Table Extraction — link to real tool */}
            {activeTab === 'tables' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center space-y-5">
                <Table className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Extract Tables from PDF</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Detect and extract all tables from your PDF and download them as Excel or CSV.
                    The full extraction engine runs on the dedicated tool page.
                  </p>
                </div>
                <Link
                  to="/pdf-to-data"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition"
                >
                  Open Table Extractor <FileSpreadsheet className="w-4 h-4" />
                </Link>
                <p className="text-xs text-gray-400">
                  Processes entirely in your browser — no server uploads.
                </p>
              </div>
            )}

            {/* Tab 4: Convert — links to real tool pages */}
            {activeTab === 'convert' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link
                  to="/pdf-to-excel"
                  className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 hover:shadow-md transition-shadow group"
                >
                  <FileSpreadsheet className="w-6 h-6 text-green-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-green-600 transition-colors">
                    Microsoft Excel (.xlsx)
                  </h4>
                  <p className="text-xs text-gray-500">Export detected tabular structures into spreadsheet workbooks.</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                    Open Tool <Download className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  to="/pdf-to-json"
                  className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 hover:shadow-md transition-shadow group"
                >
                  <Code className="w-6 h-6 text-indigo-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 transition-colors">
                    JSON Data (.json)
                  </h4>
                  <p className="text-xs text-gray-500">Structured data representations for developer APIs and pipelines.</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                    Open Tool <Download className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  to="/pdf-to-txt"
                  className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 hover:shadow-md transition-shadow group"
                >
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 transition-colors">
                    Plain Text (.txt)
                  </h4>
                  <p className="text-xs text-gray-500">Clean unicode text stream without styling or formatting.</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                    Open Tool <Download className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  to="/pdf-to-word"
                  className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 hover:shadow-md transition-shadow group"
                >
                  <FileText className="w-6 h-6 text-blue-700" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-700 transition-colors">
                    Word Document (.docx)
                  </h4>
                  <p className="text-xs text-gray-500">Convert PDF text and layout to an editable Word document.</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                    Open Tool <Download className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  to="/pdf-to-csv"
                  className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 hover:shadow-md transition-shadow group"
                >
                  <FileSpreadsheet className="w-6 h-6 text-amber-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-amber-600 transition-colors">
                    CSV Spreadsheet (.csv)
                  </h4>
                  <p className="text-xs text-gray-500">Extract tabular data to a universal comma-separated format.</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                    Open Tool <Download className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  to="/pdf-to-jpg"
                  className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 hover:shadow-md transition-shadow group"
                >
                  <Sparkles className="w-6 h-6 text-rose-500" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-rose-500 transition-colors">
                    JPG Images (.jpg)
                  </h4>
                  <p className="text-xs text-gray-500">Convert every PDF page to a high-resolution JPEG image.</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500">
                    Open Tool <Download className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
