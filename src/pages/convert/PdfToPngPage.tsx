import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageLayout } from '@/components/layout/PageLayout'
import { MetaTags } from '@/components/seo/MetaTags'
import { DropZone } from '@/components/upload/DropZone'
import { ProcessingModeTag } from '@/components/pdf/ProcessingModeTag'
import { Button } from '@/components/ui/button'
import { loadPDF, detectContentType, PdfEngineError } from '@/services/pdf/pdfEngine'
import { exportPdfToImages, ImageExportResult } from '@/services/pdf/imageExport'
import { downloadBlob, formatFileSize } from '@/lib/utils'
import { 
  FileText, 
  Download, 
  Archive, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Sliders
} from 'lucide-react'

type PageState = 'idle' | 'file-selected' | 'processing' | 'complete' | 'error'

export default function PdfToPngPage() {
  const [state, setState] = useState<PageState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Options
  const [scaleOpt, setScaleOpt] = useState(2.0) // 192 DPI for PNG clarity
  const [grayscale, setGrayscale] = useState(false)
  const [pagesInput, setPagesInput] = useState('')
  
  // Processing state
  const [progress, setProgress] = useState({ stage: '', current: 0, total: 0 })
  const [results, setResults] = useState<ImageExportResult[]>([])

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setState('file-selected')
      setErrorMsg('')
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setState('processing')
    setProgress({ stage: 'Initializing lossless WebAssembly renderer...', current: 0, total: 0 })
    
    try {
      const doc = await loadPDF(file)
      await detectContentType(doc)

      const totalPages = doc.numPages
      let targetPages: number[] | undefined = undefined
      
      if (pagesInput.trim()) {
        targetPages = pagesInput
          .split(',')
          .map(n => parseInt(n.trim(), 10))
          .filter(n => !isNaN(n) && n >= 1 && n <= totalPages)
      }

      const exportedResults = await exportPdfToImages(doc, file.name.replace(/\.pdf$/i, ''), {
        format: 'png',
        quality: 1.0,
        scale: scaleOpt,
        grayscale,
        pageNumbers: targetPages,
        onProgress: (cur, tot) => {
          setProgress({ stage: `Exporting PNG page ${cur} of ${tot}...`, current: cur, total: tot })
        }
      })

      setResults(exportedResults)
      setState('complete')
    } catch (err: unknown) {
      console.error('PDF to PNG conversion error:', err)
      setState('error')
      if (err instanceof PdfEngineError) {
        setErrorMsg(err.userMessage)
      } else if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('An unexpected error occurred while converting your PDF to PNG.')
      }
    }
  }

  const handleDownloadZip = async () => {
    if (results.length === 0 || !file) return
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      results.forEach(res => {
        zip.file(res.fileName, res.blob)
      })
      const content = await zip.generateAsync({ type: 'blob' })
      downloadBlob(content, `${file.name.replace(/\.pdf$/i, '')}-png-images.zip`)
    } catch (err) {
      console.error('ZIP generation failed:', err)
    }
  }

  const handleReset = () => {
    setState('idle')
    setFile(null)
    setResults([])
    setErrorMsg('')
    setPagesInput('')
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Convert', href: '/convert' },
        { label: 'PDF to PNG' }
      ]}
    >
      <MetaTags
        title="Convert PDF to PNG — Lossless, Transparent & Free"
        description="Convert PDF pages into crystal-clear lossless PNG images with alpha transparency support. In-browser processing with zero server uploads."
        canonical="https://pdfguru.site/pdf-to-png"
      />

      <div className="max-w-4xl mx-auto space-y-10 py-6">
        {/* Tool Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Lossless Vector & Diagram Fidelity
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Convert PDF to PNG
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Render your PDF pages as lossless PNGs with clean typography, sharp borders, and no compression artifacts.
          </p>
          <div className="pt-2">
            <ProcessingModeTag mode="browser" />
          </div>
        </div>

        {/* Upload & Workspace Box */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          {state === 'idle' && (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Drop your PDF here to convert to PNG"
              sublabel="or click to browse from device — up to 500MB"
            />
          )}

          {state === 'file-selected' && file && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center space-x-3 truncate">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="truncate text-left">
                    <h4 className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{file.name}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-zinc-500 hover:text-zinc-700">
                  Change File
                </Button>
              </div>

              {/* Conversion Configuration */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-4 text-left">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  <Sliders className="w-4 h-4 text-brand-600" />
                  PNG Rendering Options
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Rendering Scale / Sharpness
                    </label>
                    <select
                      value={scaleOpt}
                      onChange={(e) => setScaleOpt(parseFloat(e.target.value))}
                      className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                      <option value={1.0}>1x — Standard 96 DPI</option>
                      <option value={2.0}>2x — High-DPI Retina (192 DPI)</option>
                      <option value={3.0}>3x — Ultra Sharp (288 DPI)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Page Selection (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1, 2, 4 (blank for all)"
                      value={pagesInput}
                      onChange={(e) => setPagesInput(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={grayscale}
                      onChange={(e) => setGrayscale(e.target.checked)}
                      className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                    />
                    Monochrome / Grayscale Mode
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button variant="outline" onClick={handleReset}>
                  Cancel
                </Button>
                <Button onClick={handleConvert} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
                  <Sparkles className="w-4 h-4" />
                  Convert to PNG
                </Button>
              </div>
            </div>
          )}

          {state === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  {progress.stage || 'Rendering PNGs...'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Lossless rasterization in progress.
                </p>
              </div>
            </div>
          )}

          {state === 'complete' && (
            <div className="space-y-8 text-left">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      PNG Export Complete!
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {results.length} {results.length === 1 ? 'image' : 'images'} ready to download
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <Button onClick={handleDownloadZip} className="bg-brand-600 hover:bg-brand-700 text-white gap-1.5 text-xs sm:text-sm">
                    <Archive className="w-4 h-4" />
                    Download All as ZIP
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="gap-1.5 text-xs sm:text-sm">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Convert Another
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.map((res) => (
                  <div key={res.pageNumber} className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 bg-zinc-50 dark:bg-zinc-800/40 flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div className="aspect-[3/4] bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-2">
                      <img
                        src={URL.createObjectURL(res.blob)}
                        alt={`Page ${res.pageNumber}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">Page {res.pageNumber}</span>
                        <span>{formatFileSize(res.blob.size)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadBlob(res.blob, res.fileName)}
                        className="w-full text-xs h-8 gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="p-6 text-center space-y-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Conversion Failed</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">{errorMsg}</p>
              </div>
              <Button onClick={handleReset} variant="outline" className="gap-1.5">
                <RefreshCw className="w-4 h-4" /> Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Content & FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 text-left">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Why Choose PNG over JPG?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              PNG is a lossless compression standard. If your PDF contains small typography, architectural drawings, technical charts, or diagrams, PNG avoids the blurred compression blocks typical of standard JPG output.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              Retina High-Density Support
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Select 2x or 3x scale to output ultra-crisp imagery designed for 4K displays, presentation decks, or print materials.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
