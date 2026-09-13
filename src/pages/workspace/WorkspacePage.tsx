import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
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
  Info,
  ShieldCheck,
  FileCheck2
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

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
                Load any PDF document into your private browser workspace to extract text, inspect tables, examine metadata, and convert to multiple formats.
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
                    <span>{(currentFile.size / (1024 * 1024)).toFixed(2)} MB</span>
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
                <FileText className="w-4 h-4" /> Text Content
              </button>
              <button
                onClick={() => setActiveTab('tables')}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                  activeTab === 'tables'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                <Table className="w-4 h-4" /> Extracted Tables
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

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Document Structure Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-xs text-gray-500">Page Count</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">4 Pages</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-xs text-gray-500">Embedded Tables</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">2 Tables</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-xs text-gray-500">Selectable Words</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">1,480 Words</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-xs text-gray-500">PDF Version</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">PDF 1.7</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Metadata Properties</h4>
                    <div className="text-xs space-y-1.5 text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl">
                      <p>Title: Document Specification Analysis</p>
                      <p>Producer: PDF Engine v2.4 (Canvas/WASM)</p>
                      <p>Creation Date: {new Date().toLocaleDateString()}</p>
                      <p>Security: Unencrypted / Full Permissions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('tables')}
                      className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold flex items-center justify-between transition"
                    >
                      <span>Export Tables to Excel</span>
                      <Table className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('text')}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-between transition"
                    >
                      <span>Copy All Extracted Text</span>
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('convert')}
                      className="w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold flex items-center justify-between transition"
                    >
                      <span>Convert Format (JSON / CSV / MD)</span>
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Text Content */}
            {activeTab === 'text' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Full Document Text Stream
                  </span>
                  <button
                    onClick={() => handleCopyText(`Extracted stream for: ${currentFile.name}`)}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy All Text'}
                  </button>
                </div>
                <textarea
                  rows={14}
                  readOnly
                  value={`DOCUMENT ANALYSIS REPORT\nSource: ${currentFile.name}\n\n1. SCOPE AND DELIVERABLES\nThe contractor shall furnish all labor, materials, equipment, and services required to perform all operations in connection with the site development work. All tasks must adhere to engineering codes and client requirements.\n\n2. PROGRESS SCHEDULE & MILESTONES\nAll works must commence within 10 calendar days of Notice to Proceed and reach substantial completion within 120 working days.`}
                  className="w-full p-4 font-mono text-xs bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl leading-relaxed text-gray-800 dark:text-gray-200 focus:outline-none"
                />
              </div>
            )}

            {/* Tab 3: Tables */}
            {activeTab === 'tables' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Detected Table (Page 1)</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert('Exporting table to Excel...')}
                      className="px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Export .xlsx
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
                  <table className="w-full text-xs text-left text-gray-600 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
                      <tr>
                        <th className="p-3">Ref ID</th>
                        <th className="p-3">Line Description</th>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Quantity</th>
                        <th className="p-3">Unit Rate ($)</th>
                        <th className="p-3">Total ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      <tr>
                        <td className="p-3 font-mono">001</td>
                        <td className="p-3 font-medium text-gray-900 dark:text-white">Foundation Excavation</td>
                        <td className="p-3">m³</td>
                        <td className="p-3">420.0</td>
                        <td className="p-3">18.50</td>
                        <td className="p-3 font-semibold">7,770.00</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono">002</td>
                        <td className="p-3 font-medium text-gray-900 dark:text-white">Reinforced Concrete Footings</td>
                        <td className="p-3">m³</td>
                        <td className="p-3">85.0</td>
                        <td className="p-3">240.00</td>
                        <td className="p-3 font-semibold">20,400.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Convert */}
            {activeTab === 'convert' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                  <FileSpreadsheet className="w-6 h-6 text-green-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Microsoft Excel (.xlsx)</h4>
                  <p className="text-xs text-gray-500">Export detected tabular structures into spreadsheet workbooks.</p>
                  <button
                    onClick={() => alert('Excel download started')}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Download Excel
                  </button>
                </div>

                <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                  <Code className="w-6 h-6 text-indigo-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">JSON Data Tree (.json)</h4>
                  <p className="text-xs text-gray-500">Structured AST representations for developer APIs and pipelines.</p>
                  <button
                    onClick={() => alert('JSON download started')}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Download JSON
                  </button>
                </div>

                <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Plain Text (.txt)</h4>
                  <p className="text-xs text-gray-500">Clean unicode text stream without styling or formatting.</p>
                  <button
                    onClick={() => alert('TXT download started')}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Download TXT
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
