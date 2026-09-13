import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { Presentation, FileText, Image as ImageIcon, Sparkles, Layers } from 'lucide-react'

export default function PdfToPowerPointPage() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
    }
  }

  return (
    <PageLayout>
      <MetaTags
        title="PDF to PowerPoint — Convert PDF to PPTX"
        description="Convert PDF presentations and documents into editable Microsoft PowerPoint (.pptx) slides. Preserve slide layouts, vector shapes, and text formatting."
      />

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="server" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            PDF to PowerPoint — Convert PDF to PPTX Presentation
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Convert static PDF slides, conference decks, and pitches into fully editable Microsoft PowerPoint (.pptx) presentation files.
          </p>
        </div>

        {/* DropZone for future ingestion or quick preview */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6">
          {!file ? (
            <DropZone
              onFileSelect={handleFileSelect}
              label="Select a PDF slide deck to prepare conversion"
              sublabel="PPTX conversion engine will process slide elements and layout shapes"
            />
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3 truncate">
                <Presentation className="w-8 h-8 text-orange-600" />
                <div className="truncate">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-xs text-red-600 hover:underline"
              >
                Change File
              </button>
            </div>
          )}

          {/* Server Required State Notice */}
          <ServerRequiredState
            toolName="PDF to PowerPoint (PPTX) Conversion Engine"
            alternateToolSlug="pdf-to-jpg"
            alternateToolName="Convert Slides to High-Res Images"
          />
        </div>

        {/* Technical Explanation */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Why PowerPoint Conversion Requires Server Processing
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Unlike simple text or single image exports, converting a PDF into an editable PowerPoint presentation requires separating overlapping vector artwork, detecting slide background color fills, grouping bounding boxes into editable text frames, and isolating embedded photographs without losing crispness.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
              <Layers className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Slide Segmentation</h4>
              <p className="text-xs text-gray-500">Separates text boxes from background images automatically.</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Editable Typography</h4>
              <p className="text-xs text-gray-500">Maintains headings, bullet points, font sizing, and text colors.</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Shape Vectors</h4>
              <p className="text-xs text-gray-500">Converts PDF vector paths into native Microsoft Office auto-shapes.</p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/pdf-to-word" className="text-sm text-blue-600 hover:underline">
              PDF to Word (.docx) &rarr;
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
