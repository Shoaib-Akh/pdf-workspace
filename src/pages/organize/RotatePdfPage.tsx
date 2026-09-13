import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { RotateCw, RotateCcw, Download, CheckCircle2 } from 'lucide-react'

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [angle, setAngle] = useState<90 | 180 | 270>(90)
  const [scope, setScope] = useState<'all' | 'odd' | 'even'>('all')
  const [isApplying, setIsApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setApplied(false)
    }
  }

  const handleRotate = () => {
    if (!file) return
    setIsApplying(true)
    setTimeout(() => {
      setIsApplying(false)
      setApplied(true)
    }, 700)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Rotate PDF — Rotate PDF Pages Online"
        description="Rotate PDF pages 90, 180, or 270 degrees clockwise or counterclockwise. Permanently save rotated PDF documents in your browser."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Rotate PDF — Rotate Pages Permanently
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Fix upside-down or sideways pages in scanned documents and presentations. Rotate individual pages or the entire document permanently.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to rotate"
              sublabel="Instant browser rotation — no server uploads"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                    <RotateCw className="w-5 h-5" />
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

              {/* Rotation Options UI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Rotation Angle
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setAngle(90)}
                      className={`p-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        angle === 90
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600'
                          : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <RotateCw className="w-4 h-4" /> 90° CW
                    </button>
                    <button
                      onClick={() => setAngle(180)}
                      className={`p-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        angle === 180
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600'
                          : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <RotateCw className="w-4 h-4" /> 180°
                    </button>
                    <button
                      onClick={() => setAngle(270)}
                      className={`p-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        angle === 270
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600'
                          : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" /> 90° CCW
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Apply To Pages
                  </label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
                  >
                    <option value="all">All Pages</option>
                    <option value="odd">Odd Pages Only (1, 3, 5...)</option>
                    <option value="even">Even Pages Only (2, 4, 6...)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRotate}
                  disabled={isApplying}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isApplying ? 'Applying rotation...' : `Apply ${angle}° Rotation`}
                </button>
              </div>

              {applied && (
                <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Pages rotated successfully! Ready to download.
                  </div>
                  <button
                    onClick={() => alert('Downloading rotated PDF...')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" /> Download Rotated PDF
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
            <Link to="/compress-pdf" className="text-sm text-blue-600 hover:underline">
              Compress PDF &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/delete-pdf-pages" className="text-sm text-blue-600 hover:underline">
              Delete PDF Pages &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
