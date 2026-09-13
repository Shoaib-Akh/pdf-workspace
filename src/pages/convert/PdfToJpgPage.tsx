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
  ArrowRight,
  Sliders
} from 'lucide-react'

type PageState = 'idle' | 'file-selected' | 'processing' | 'complete' | 'error'

export default function PdfToJpgPage() {
  const [state, setState] = useState<PageState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Options
  const [scaleOpt, setScaleOpt] = useState(1.56) // 150 DPI
  const [quality, setQuality] = useState(0.85)
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
    setProgress({ stage: 'Loading PDF into WebAssembly engine...', current: 0, total: 0 })
    
    try {
      const doc = await loadPDF(file)
      const type = await detectContentType(doc)
      if (type === 'scanned') {
        console.info('Scanned PDF detected')
      }

      const totalPages = doc.numPages
      let targetPages: number[] | undefined = undefined
      
      if (pagesInput.trim()) {
        targetPages = pagesInput
          .split(',')
          .map(n => parseInt(n.trim(), 10))
          .filter(n => !isNaN(n) && n >= 1 && n <= totalPages)
      }

      const exportedResults = await exportPdfToImages(doc, file.name.replace(/\.pdf$/i, ''), {
        format: 'jpeg',
        quality: quality,
        scale: scaleOpt,
        grayscale,
        pageNumbers: targetPages,
        onProgress: (cur, tot) => {
          setProgress({ stage: `Rendering page ${cur} of ${tot}...`, current: cur, total: tot })
        }
      })

      setResults(exportedResults)
      setState('complete')
    } catch (err: unknown) {
      console.error('PDF to JPG conversion error:', err)
      setState('error')
      if (err instanceof PdfEngineError) {
        setErrorMsg(err.userMessage)
      } else if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('An unexpected error occurred while converting your PDF. Please verify the file is not corrupted.')
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
      downloadBlob(content, `${file.name.replace(/\.pdf$/i, '')}-jpg-images.zip`)
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
        { label: 'PDF to JPG' }
      ]}
    >
      <MetaTags
        title="Convert PDF to JPG — Free, Private & In-Browser"
        description="Convert every PDF page into high-quality JPG images instantly in your browser. Choose DPI, quality, and download individually or as a ZIP. Zero server uploads."
        canonical="https://pdfworkspace.app/pdf-to-jpg"
      />

      <div className="max-w-4xl mx-auto space-y-10 py-6">
        {/* Tool Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            High Resolution Image Extraction
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Convert PDF to JPG
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Extract every page of your PDF document into crisp, high-resolution JPEG images. Rendered 100% on your device using WebAssembly for complete privacy.
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
              label="Drop your PDF here to convert to JPG"
              sublabel="or click to browse from device — up to 500MB"
            />
          )}

          {state === 'file-selected' && file && (
            <div className="space-y-6">
              {/* Selected File Card */}
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center space-x-3 truncate">
                  <div className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
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
                  Image Export Settings
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* DPI / Scale */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Resolution (DPI)
                    </label>
                    <select
                      value={scaleOpt}
                      onChange={(e) => setScaleOpt(parseFloat(e.target.value))}
                      className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                      <option value={0.75}>72 DPI — Screen preview (Fastest, Smallest)</option>
                      <option value={1.56}>150 DPI — Standard quality (Recommended)</option>
                      <option value={3.125}>300 DPI — Print quality (Ultra crisp)</option>
                    </select>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      JPG Quality
                    </label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                      <option value={0.6}>Normal (60%) — Smaller file size</option>
                      <option value={0.85}>High (85%) — Balanced clarity</option>
                      <option value={0.95}>Maximum (95%) — Best fidelity</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Page Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Pages to Convert (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1, 3, 5 (leave blank for all)"
                      value={pagesInput}
                      onChange={(e) => setPagesInput(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>

                  {/* Grayscale toggle */}
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      <input
                        type="checkbox"
                        checked={grayscale}
                        onChange={(e) => setGrayscale(e.target.checked)}
                        className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                      />
                      Convert to Grayscale (Black & White)
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end gap-3">
                <Button variant="outline" onClick={handleReset}>
                  Cancel
                </Button>
                <Button onClick={handleConvert} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
                  <Sparkles className="w-4 h-4" />
                  Convert to JPG
                </Button>
              </div>
            </div>
          )}

          {state === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  {progress.stage || 'Rendering Pages...'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Processing completely inside your browser memory.
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
                      Conversion Complete!
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {results.length} {results.length === 1 ? 'page' : 'pages'} extracted to JPG
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

              {/* Converted Pages Grid */}
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

        {/* Informational & SEO Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 text-left">
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% In-Browser Privacy
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Your confidential documents never upload to any remote server. The WebAssembly PDF renderer parses and extracts pixels right on your machine.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Print-Ready 300 DPI
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Need razor-sharp images for brochures or presentations? Switch to 300 DPI mode for pixel-perfect image rendering at print dimensions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
              <Archive className="w-4 h-4 text-amber-500" />
              One-Click ZIP Packaging
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Converting 50 pages? Download individual slides or package all high-res JPG files into a compressed ZIP archive in seconds.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10 text-left space-y-6">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Is there a page or file limit?</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Because conversion executes in your browser's local RAM, you can convert files up to 500MB without subscription caps or queue times.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Can I convert only specific pages?</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Yes. Enter comma-separated page numbers (e.g. "1, 3, 7") in the options panel to extract only the target pages.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">What resolution should I choose?</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                150 DPI is ideal for web graphics and email attachments. Choose 300 DPI if you plan to print or zoom deeply into technical drawings.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Looking for lossless transparency?</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Use our <Link to="/pdf-to-png" className="text-brand-600 underline">PDF to PNG converter</Link> if your documents contain vector diagrams or transparent overlays.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
            Related Converters
          </h4>
          <div className="flex flex-wrap gap-2">
            <Link to="/pdf-to-png" className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
              PDF to PNG →
            </Link>
            <Link to="/pdf-to-webp" className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
              PDF to WebP →
            </Link>
            <Link to="/images-to-pdf" className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
              Images to PDF →
            </Link>
            <Link to="/extract-pdf-pages" className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
              Extract PDF Pages →
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
