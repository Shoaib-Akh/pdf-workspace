/**
 * wordConverter.ts
 * Browser-based Word (.docx/.doc) → PDF conversion.
 * Uses mammoth to convert DOCX → clean HTML, then
 * jsPDF + html2canvas to render HTML → PDF.
 * Runs 100% client-side. No server required.
 */

export interface WordConversionProgress {
  stage: string
  percent: number
}

export interface WordConversionResult {
  blob: Blob
  pageCount: number
  paragraphCount: number
  hasWarnings: boolean
  warnings: string[]
}

/**
 * Convert a Word document (DOCX/DOC) to a PDF Blob in the browser.
 */
export async function convertWordToPdf(
  file: File,
  onProgress?: (p: WordConversionProgress) => void
): Promise<WordConversionResult> {
  onProgress?.({ stage: 'Reading document…', percent: 5 })

  const arrayBuffer = await file.arrayBuffer()

  // Step 1: DOCX → HTML via mammoth
  onProgress?.({ stage: 'Parsing Word document…', percent: 20 })
  const mammoth = await import('mammoth')

  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Title'] => h1.title:fresh",
      ],
    }
  )

  const htmlContent = result.value
  const warnings = result.messages
    .filter((m: any) => m.type === 'warning')
    .map((m: any) => m.message)

  onProgress?.({ stage: 'Rendering document layout…', percent: 40 })

  // Step 2: Wrap HTML in a styled A4-like container
  const styledHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8"/>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: Calibri, 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #111;
            background: #fff;
            padding: 48px 56px;
            width: 794px;
          }
          h1 { font-size: 18pt; font-weight: bold; margin: 16px 0 8px; }
          h2 { font-size: 14pt; font-weight: bold; margin: 12px 0 6px; }
          h3 { font-size: 12pt; font-weight: bold; margin: 10px 0 4px; }
          p { margin-bottom: 8px; }
          strong, b { font-weight: bold; }
          em, i { font-style: italic; }
          u { text-decoration: underline; }
          ul { margin: 8px 0 8px 24px; list-style-type: disc; }
          ol { margin: 8px 0 8px 24px; list-style-type: decimal; }
          li { margin-bottom: 4px; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
            font-size: 10pt;
          }
          th, td {
            border: 1px solid #bbb;
            padding: 5px 8px;
            text-align: left;
          }
          th { background: #f0f0f0; font-weight: bold; }
          img { max-width: 100%; height: auto; display: block; margin: 8px auto; }
          hr { border: none; border-top: 1px solid #ccc; margin: 12px 0; }
        </style>
      </head>
      <body>${htmlContent}</body>
    </html>
  `

  // Step 3: Render HTML in an off-screen iframe and capture with html2canvas
  onProgress?.({ stage: 'Generating PDF pages…', percent: 60 })

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:794px;height:1123px;border:none;visibility:hidden;'
  document.body.appendChild(iframe)

  let blob: Blob
  let pageCount = 1

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) throw new Error('Could not create rendering context')

    iframeDoc.open()
    iframeDoc.write(styledHtml)
    iframeDoc.close()

    // Wait for images/fonts to load
    await new Promise(resolve => setTimeout(resolve, 500))

    const body = iframeDoc.body
    const totalHeight = Math.max(body.scrollHeight, body.offsetHeight, 1123)
    iframe.style.height = `${totalHeight}px`

    await new Promise(resolve => setTimeout(resolve, 300))

    onProgress?.({ stage: 'Capturing pages…', percent: 70 })

    const html2canvas = (await import('html2canvas')).default

    const canvas = await html2canvas(body, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: totalHeight,
      windowWidth: 794,
    })

    onProgress?.({ stage: 'Building PDF…', percent: 85 })

    const { jsPDF } = await import('jspdf')

    const A4_W = 210   // mm
    const A4_H = 297   // mm
    const DPI = 72
    const MM_PER_PX = 25.4 / DPI

    const canvasWidthMm = canvas.width * MM_PER_PX / 1.5
    const canvasHeightMm = canvas.height * MM_PER_PX / 1.5

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    const imgData = canvas.toDataURL('image/jpeg', 0.92)

    // Scale canvas width to fit A4 width
    const scale = A4_W / canvasWidthMm
    const scaledHeight = canvasHeightMm * scale

    pageCount = Math.ceil(scaledHeight / A4_H)

    let yOffset = 0
    let firstPage = true
    while (yOffset < scaledHeight) {
      if (!firstPage) pdf.addPage()
      firstPage = false

      // How many mm of canvas to show on this page
      const srcY = (yOffset / scale) / MM_PER_PX * 1.5
      const srcH = Math.min((A4_H / scale) / MM_PER_PX * 1.5, canvas.height - srcY)

      if (srcH <= 0) break

      // Crop canvas for this page
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = Math.ceil(srcH)
      const ctx = pageCanvas.getContext('2d')!
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH)

      const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.92)
      const pageHeightMm = (srcH * MM_PER_PX / 1.5) * scale
      pdf.addImage(pageImgData, 'JPEG', 0, 0, A4_W, Math.min(pageHeightMm, A4_H))

      yOffset += A4_H
    }

    blob = pdf.output('blob')
  } finally {
    document.body.removeChild(iframe)
  }

  onProgress?.({ stage: 'Done!', percent: 100 })

  // Count paragraphs from HTML
  const pCount = (htmlContent.match(/<p[\s>]/g) || []).length || 1

  return {
    blob,
    pageCount,
    paragraphCount: pCount,
    hasWarnings: warnings.length > 0,
    warnings,
  }
}
