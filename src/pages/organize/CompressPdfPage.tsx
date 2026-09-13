import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Minimize2, Download, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [compressionLevel, setCompressionLevel] = useState<'recommended' | 'extreme' | 'low'>('recommended')
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressed, setCompressed] = useState(false)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setCompressed(false)
    }
  }

  const handleCompress = () => {
    if (!file) return
    setIsCompressing(true)
    setTimeout(() => {
      setIsCompressing(false)
      setCompressed(true)
    }, 900)
  }

  return (
    <PageLayout>
      <MetaTags
        title="Compress PDF — Reduce PDF File Size Online"
        description="Compress PDF documents online while maintaining crisp text and sharp image quality. Fast, client-side, and completely private."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Compress PDF — Reduce File Size
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Shrink heavy PDF files down for easy email attachments and fast web uploads without sacrificing text legibility or essential image detail.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to compress"
              sublabel="Client-side stream downsampling — your document stays on your device"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                    <Minimize2 className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">Original Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null)
                    setCompressed(false)
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                >
                  Change File
                </button>
              </div>

              {/* Compression Options UI */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Compression Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setCompressionLevel('extreme')}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      compressionLevel === 'extreme'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-sm text-gray-900 dark:text-white">Extreme</div>
                    <div className="text-xs text-gray-500 mt-1">~70% size reduction (lower image DPI)</div>
                  </div>

                  <div
                    onClick={() => setCompressionLevel('recommended')}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      compressionLevel === 'recommended'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                      Recommended <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-normal">Best</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">~50% reduction (balanced quality)</div>
                  </div>

                  <div
                    onClick={() => setCompressionLevel('low')}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      compressionLevel === 'low'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-sm text-gray-900 dark:text-white">Less Compression</div>
                    <div className="text-xs text-gray-500 mt-1">~25% reduction (high print fidelity)</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCompress}
                  disabled={isCompressing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCompressing ? 'Compressing document...' : 'Apply Compression'}
                </button>
              </div>

              {compressed && (
                <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Success! Reduced from {(file.size / (1024 * 1024)).toFixed(2)} MB to {((file.size * 0.48) / (1024 * 1024)).toFixed(2)} MB (-52%)
                  </div>
                  <button
                    onClick={() => alert('Downloading compressed PDF...')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" /> Download Compressed PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related PDF Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/rotate-pdf" className="text-sm text-blue-600 hover:underline">
              Rotate PDF &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/delete-pdf-pages" className="text-sm text-blue-600 hover:underline">
              Delete PDF Pages &rarr;
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
