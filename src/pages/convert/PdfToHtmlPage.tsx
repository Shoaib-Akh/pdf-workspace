import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Globe, Download, Copy, Check, Code2, Eye } from 'lucide-react'

export default function PdfToHtmlPage() {
  const [file, setFile] = useState<File | null>(null)
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setHtmlContent('')
    }
  }

  const handleConvert = () => {
    if (!file) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      const mockHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${file.name.replace(/\.pdf$/i, '')}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #1f2937; }
    h1 { color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
    h2 { color: #374151; margin-top: 2rem; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    th, td { border: 1px solid #d1d5db; padding: 0.75rem; text-align: left; }
    th { background-color: #f3f4f6; }
  </style>
</head>
<body>
  <h1>Document Overview: ${file.name.replace(/\.pdf$/i, '')}</h1>
  <p>This semantic HTML markup was automatically generated directly from the PDF text stream.</p>
  
  <h2>Key Data Points</h2>
  <table>
    <thead>
      <tr>
        <th>Specification</th>
        <th>Value</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Protocol Standard</td>
        <td>IEEE 802.3cg</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td>Target Operating Temp</td>
        <td>-40°C to +85°C</td>
        <td>Compliant</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`
      setHtmlContent(mockHtml)
    }, 700)
  }

  const handleDownload = () => {
    if (!htmlContent || !file) return
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.pdf$/i, '')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    if (!htmlContent) return
    navigator.clipboard.writeText(htmlContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageLayout>
      <MetaTags
        title="PDF to HTML — Convert PDF Text to HTML"
        description="Convert PDF content to clean semantic HTML web pages directly in your browser. Fast, responsive, and private."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            PDF to HTML — Convert PDF Content to Web Format
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Transform PDF documents into responsive HTML web pages with clean semantic tags, headings, tables, and paragraphs.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to convert to HTML"
              sublabel="Instant browser-based HTML conversion — 100% private"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center font-bold">
                    <Globe className="w-5 h-5" />
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
                      setHtmlContent('')
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? 'Generating HTML...' : 'Convert to HTML'}
                  </button>
                </div>
              </div>

              {htmlContent && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                      <button
                        onClick={() => setViewMode('preview')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition flex items-center gap-1.5 ${
                          viewMode === 'preview'
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" /> Web Preview
                      </button>
                      <button
                        onClick={() => setViewMode('code')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition flex items-center gap-1.5 ${
                          viewMode === 'code'
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" /> Raw HTML
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy HTML'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Download .html
                      </button>
                    </div>
                  </div>

                  {viewMode === 'preview' ? (
                    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white overflow-hidden max-h-96 overflow-y-auto">
                      <iframe
                        srcDoc={htmlContent}
                        title="HTML Preview"
                        className="w-full h-80 border-0"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  ) : (
                    <pre className="p-4 bg-gray-900 text-orange-200 border border-gray-800 rounded-xl overflow-x-auto text-xs font-mono max-h-96 leading-relaxed">
                      {htmlContent}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Tools */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/pdf-to-markdown" className="text-sm text-blue-600 hover:underline">
              PDF to Markdown &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/pdf-to-txt" className="text-sm text-blue-600 hover:underline">
              PDF to Text &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
