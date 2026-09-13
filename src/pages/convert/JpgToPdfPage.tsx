import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Image as ImageIcon, Download, Trash2, ArrowUp, ArrowDown, FilePlus, ShieldCheck } from 'lucide-react'
import { imagesToPdf } from '@/services/pdf/pdfOrganizer'
import { downloadBlob } from '@/lib/utils'

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [margin, setMargin] = useState<'none' | 'small' | 'large'>('small')
  const [isConverting, setIsConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles])
    setConverted(false)
    setResultBlob(null)
    setErrorMsg('')
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setResultBlob(null)
    setConverted(false)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setFiles((prev) => {
      const copy = [...prev]
      const temp = copy[index - 1]
      copy[index - 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  const moveDown = (index: number) => {
    if (index === files.length - 1) return
    setFiles((prev) => {
      const copy = [...prev]
      const temp = copy[index + 1]
      copy[index + 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  const handleConvert = async () => {
    if (files.length === 0) return
    setIsConverting(true)
    setErrorMsg('')
    try {
      const blob = await imagesToPdf(files)
      setResultBlob(blob)
      setConverted(true)
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Failed to convert JPG to PDF. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob) return
    const name = files.length === 1
      ? files[0].name.replace(/\.[^/.]+$/, '') + '.pdf'
      : 'converted-images.pdf'
    downloadBlob(resultBlob, name)
  }

  return (
    <PageLayout>
      <MetaTags
        title="JPG to PDF — Convert JPG Images to PDF"
        description="Convert JPG and JPEG images into clean, multi-page PDF documents. Merge multiple photos in custom order directly in your browser."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            JPG to PDF — Convert JPG Images to PDF
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Combine multiple JPG and JPEG pictures into a single, high-quality PDF document. Adjust page orientation, margin spacing, and reorder images before converting.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          <DropZone
            onFileSelect={handleFileSelect}
            accept={{ 'image/jpeg': ['.jpg', '.jpeg'] }}
            multiple={true}
            label="Drop your JPG images here"
            sublabel="Select single or multiple JPG / JPEG files to combine into a PDF"
          />

          {files.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Selected Images ({files.length}) — Drag or use arrows to reorder
                </h3>
                <button
                  onClick={() => setFiles([])}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {files.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="w-6 text-center text-xs font-semibold text-gray-400">
                        {idx + 1}
                      </span>
                      <ImageIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{f.name}</p>
                        <p className="text-xs text-gray-500">{(f.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={idx === files.length - 1}
                        className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(idx)}
                        className="p-1.5 text-red-400 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Layout Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Page Size
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <option value="a4">A4 (Standard)</option>
                    <option value="letter">US Letter</option>
                    <option value="fit">Fit to Image Size</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Margin
                  </label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(e.target.value as any)}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <option value="none">No Margin (Full Bleed)</option>
                    <option value="small">Small Margin (10mm)</option>
                    <option value="large">Large Margin (25mm)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConverting ? 'Assembling PDF...' : `Convert ${files.length} Image${files.length > 1 ? 's' : ''} to PDF`}
                </button>

                {converted && (
                  <button
                    onClick={handleDownload}
                    className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Tools */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Image & PDF Converters
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/png-to-pdf" className="text-sm text-blue-600 hover:underline">
              PNG to PDF &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/images-to-pdf" className="text-sm text-blue-600 hover:underline">
              Images to PDF (Mixed Formats) &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/pdf-to-jpg" className="text-sm text-blue-600 hover:underline">
              PDF to JPG Images &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
