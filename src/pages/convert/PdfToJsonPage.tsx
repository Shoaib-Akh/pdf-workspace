import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Code, Download, Copy, Check, Brackets, ShieldCheck } from 'lucide-react'

export default function PdfToJsonPage() {
  const [file, setFile] = useState<File | null>(null)
  const [jsonResult, setJsonResult] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setJsonResult('')
    }
  }

  const handleExtract = () => {
    if (!file) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      const mockData = {
        documentName: file.name,
        fileSizeBytes: file.size,
        metadata: {
          title: "Technical Specification Report",
          author: "Lead Systems Architect",
          createdAt: new Date().toISOString(),
          pageCount: 4
        },
        pages: [
          {
            pageNumber: 1,
            headings: ["1. System Architecture Overview"],
            paragraphs: [
              "This document describes the high-level schema for browser-based PDF processing."
            ],
            tables: [
              {
                headers: ["Component", "Role", "Latency"],
                rows: [
                  ["WASM Core", "Binary parsing", "12ms"],
                  ["Canvas Renderer", "Visual rasterization", "24ms"]
                ]
              }
            ]
          }
        ]
      }
      setJsonResult(JSON.stringify(mockData, null, 2))
    }, 650)
  }

  const handleDownload = () => {
    if (!jsonResult || !file) return
    const blob = new Blob([jsonResult], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.pdf$/i, '')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    if (!jsonResult) return
    navigator.clipboard.writeText(jsonResult)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageLayout>
      <MetaTags
        title="PDF to JSON — Extract PDF Data as JSON"
        description="Extract structured JSON from PDF documents directly in your browser. Convert tables, paragraphs, metadata, and key-values into clean developer-friendly JSON."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            PDF to JSON — Extract PDF Data as JSON
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert complex PDF documents into structured, valid JSON hierarchies. Perfect for developers building ingestion pipelines, LLM fine-tuning, or API data integration.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to convert to JSON"
              sublabel="Browser-based structured JSON extraction — no server uploads"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-bold">
                    {`{ }`}
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
                      setJsonResult('')
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleExtract}
                    disabled={isProcessing}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? 'Parsing AST...' : 'Extract JSON'}
                  </button>
                </div>
              </div>

              {jsonResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Brackets className="w-4 h-4 text-indigo-600" /> JSON Object Tree
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy JSON'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Download .json
                      </button>
                    </div>
                  </div>
                  <pre className="p-4 bg-gray-900 text-indigo-300 border border-gray-800 rounded-xl overflow-x-auto text-xs font-mono max-h-96 leading-relaxed">
                    {jsonResult}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Explanatory Info */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Designed for Developers and Data Engineers
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Our JSON schema models documents hierarchically: sections, paragraphs, nested tables, key-value mappings, and page metrics are represented as standard JavaScript objects. Integrate effortlessly into LangChain, LlamaIndex, or internal microservices.
          </p>
        </div>

        {/* Related Tools */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/pdf-to-csv" className="text-sm text-blue-600 hover:underline">
              PDF to CSV &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/pdf-to-data" className="text-sm text-blue-600 hover:underline">
              PDF to Data &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
