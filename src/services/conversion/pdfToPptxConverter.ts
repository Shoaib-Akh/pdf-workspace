/**
 * pdfToPptxConverter.ts
 * Browser-based PDF → PPTX conversion.
 * Renders each PDF page as a high-res canvas image using pdfjs-dist,
 * then embeds each image as a full-bleed slide in a PPTX using pptxgenjs.
 * Runs 100% client-side. No server required.
 */

export interface PdfToPptxProgress {
  stage: string
  percent: number
}

export interface PdfToPptxResult {
  blob: Blob
  pageCount: number
  slideCount: number
}

/**
 * Convert a PDF File to a .pptx Blob in the browser.
 * Each PDF page becomes one slide (full-width image).
 */
export async function convertPdfToPptx(
  file: File,
  onProgress?: (p: PdfToPptxProgress) => void
): Promise<PdfToPptxResult> {
  onProgress?.({ stage: 'Loading PDF…', percent: 5 })

  // Load pdfjs
  const pdfjsLib = await import('pdfjs-dist')
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  }

  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  const totalPages = pdf.numPages

  onProgress?.({ stage: `Preparing ${totalPages} slide${totalPages === 1 ? '' : 's'}…`, percent: 10 })

  // Load pptxgenjs
  const PptxGenJS = (await import('pptxgenjs')).default
  const pptx = new PptxGenJS()

  // Get first page dimensions to set slide aspect ratio
  const firstPage = await pdf.getPage(1)
  const vp = firstPage.getViewport({ scale: 1 })
  const isLandscape = vp.width > vp.height
  const slideW = isLandscape ? 10 : 7.5   // inches
  const slideH = isLandscape ? 7.5 : 10   // inches

  pptx.defineLayout({ name: 'PDF_LAYOUT', width: slideW, height: slideH })
  pptx.layout = 'PDF_LAYOUT'

  // Render each page to canvas and add as a slide
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const pct = 10 + Math.round(((pageNum - 1) / totalPages) * 80)
    onProgress?.({ stage: `Rendering page ${pageNum} of ${totalPages}…`, percent: pct })

    const page = await pdf.getPage(pageNum)
    const scale = 2.0   // high-res: 2x for crisp slides
    const viewport = page.getViewport({ scale })

    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context unavailable')

    await page.render({ canvasContext: ctx, viewport }).promise

    const imgData = canvas.toDataURL('image/jpeg', 0.92)

    const slide = pptx.addSlide()
    slide.background = { color: 'FFFFFF' }
    slide.addImage({
      data: imgData,
      x: 0,
      y: 0,
      w: slideW,
      h: slideH,
      sizing: { type: 'contain', w: slideW, h: slideH },
    })
  }

  onProgress?.({ stage: 'Building PPTX file…', percent: 92 })

  const pptxBlob = await pptx.write({ outputType: 'blob' }) as Blob

  onProgress?.({ stage: 'Done!', percent: 100 })

  return {
    blob: pptxBlob,
    pageCount: totalPages,
    slideCount: totalPages,
  }
}
