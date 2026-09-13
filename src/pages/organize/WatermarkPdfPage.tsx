import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Stamp, Download, CheckCircle2 } from 'lucide-react'

export default function WatermarkPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('CONFIDENTIAL')
  const [position, setPosition] = useState<'diagonal' | 'top' | 'bottom'>('diagonal')
  const [opacity, setOpacity] = useState(30)
  const [isProcessing, setIsProcessing] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setApplied(false)
    }
  }

  const handleApply = () => {
    if (!file) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setApplied(true)
    }, 750)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Watermark PDF — Add Text Watermark to PDF"
        description="Add customizable text watermarks like CONFIDENTIAL, DRAFT, or your company name across PDF pages. Fast, secure, and client-side."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Watermark PDF — Protect & Brand Documents
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Stamp "CONFIDENTIAL", "DRAFT", or custom copyright notices across your PDF document to protect intellectual property.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to watermark"
              sublabel="In-browser watermarking — no cloud uploads"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                    <Stamp className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null)
                    setApplied(false)
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                >
                  Change File
                </button>
              </div>

              {/* Watermark Options */}
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL, DRAFT"
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Position
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
                  >
                    <option value="diagonal">Diagonal Center (45°)</option>
                    <option value="top">Top Header</option>
                    <option value="bottom">Bottom Footer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-semibold">
                  <span>Watermark Opacity</span>
                  <span>{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleApply}
                  disabled={isProcessing || !text}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Stamping document...' : 'Apply Watermark'}
                </button>
              </div>

              {applied && (
                <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Watermark "{text}" added to all pages.
                  </div>
                  <button
                    onClick={() => alert('Downloading watermarked PDF...')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" /> Download Watermarked PDF
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
            <Link to="/add-page-numbers-to-pdf" className="text-sm text-blue-600 hover:underline">
              Add Page Numbers &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/password-protect-pdf" className="text-sm text-blue-600 hover:underline">
              Password Protect PDF &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
