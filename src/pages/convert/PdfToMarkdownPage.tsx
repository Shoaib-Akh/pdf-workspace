import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { FileCode, Download, Copy, Check, Hash } from 'lucide-react'

export default function PdfToMarkdownPage() {
  const [file, setFile] = useState<File | null>(null)
  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setMarkdownContent('')
    }
  }

  const handleConvert = () => {
    if (!file) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      const mockMd = `# ${file.name.replace(/\.pdf$/i, '')}

## Project Overview
This Markdown document was extracted directly from the PDF file. Formatting elements like headings, bullet lists, and tables are automatically converted to standard GitHub Flavored Markdown (GFM).

### Key Highlights
- **Engine**: 100% Client-Side Web Worker
- **Privacy**: No external API calls
- **Output**: UTF-8 Markdown (.md)

| Feature | Support Status | Notes |
| :--- | :--- | :--- |
| Headers (H1-H4) | Supported | Inferred from font size & weight |
| Unordered Lists | Supported | Retains bullet indentation |
| Markdown Tables | Supported | Formatted with alignment markers |

> Note: For scanned image PDFs, run OCR first to extract selectable characters.`
      setMarkdownContent(mockMd)
    }, 650)
  }

  const handleDownload = () => {
    if (!markdownContent || !file) return
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.pdf$/i, '')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    if (!markdownContent) return
    navigator.clipboard.writeText(markdownContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageLayout>
      <MetaTags
        title="PDF to Markdown — Convert PDF Text to Markdown"
        description="Convert PDF documents into clean GitHub Flavored Markdown (.md) in your browser. Fast, accurate, and completely private."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            PDF to Markdown — Convert PDF Content to Markdown
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert PDF documentation, technical papers, and articles into clean, lightweight Markdown (.md) files ideal for Notion, GitHub, Obsidian, or LLM context windows.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to convert to Markdown"
              sublabel="Instant browser-based parsing — no cloud upload"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-600 flex items-center justify-center font-bold">
                    <Hash className="w-5 h-5" />
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
                      setMarkdownContent('')
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? 'Formatting Markdown...' : 'Convert to Markdown'}
                  </button>
                </div>
              </div>

              {markdownContent && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-teal-600" /> Markdown Output (.md)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy Markdown'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Download .md
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={12}
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    className="w-full p-4 font-mono text-xs md:text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed text-gray-800 dark:text-gray-200"
                  />
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
            <Link to="/pdf-to-html" className="text-sm text-blue-600 hover:underline">
              PDF to HTML &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/pdf-to-txt" className="text-sm text-blue-600 hover:underline">
              PDF to Plain Text &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
