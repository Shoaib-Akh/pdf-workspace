/**
 * pdfToDocxConverter.ts
 * Browser-based PDF → real DOCX conversion.
 * Uses pdfjs-dist to extract text with positional data,
 * groups text into paragraphs/headings by font-size heuristics,
 * then generates a real .docx binary using the `docx` library.
 * Runs 100% client-side. No server required.
 */

export interface PdfToDocxProgress {
  stage: string
  percent: number
}

export interface PdfToDocxResult {
  blob: Blob
  pageCount: number
  paragraphCount: number
}

interface TextItem {
  str: string
  x: number
  y: number
  fontSize: number
  width: number
  height: number
}

/**
 * Extract text items with full positional + size data from a PDF page.
 */
async function extractPageItems(doc: any, pageNum: number): Promise<TextItem[]> {
  const page = await doc.getPage(pageNum)
  const content = await page.getTextContent()
  const viewport = page.getViewport({ scale: 1 })
  const pageH = viewport.height

  const items: TextItem[] = []
  for (const item of content.items as any[]) {
    if (!item.str?.trim()) continue
    const tx = item.transform
    // tx = [scaleX, skewY, skewX, scaleY, translateX, translateY]
    const x = tx[4]
    const y = pageH - tx[5]    // flip Y so 0=top
    const fontSize = Math.abs(tx[3]) || Math.abs(tx[0]) || 12
    items.push({
      str: item.str,
      x: Math.round(x),
      y: Math.round(y),
      fontSize: Math.round(fontSize),
      width: item.width || 0,
      height: item.height || fontSize,
    })
  }
  return items
}

/**
 * Group text items into lines (same Y ± tolerance), then into paragraphs.
 */
function groupIntoLines(items: TextItem[], yTolerance = 3): TextItem[][] {
  const sorted = [...items].sort((a, b) => a.y - b.y || a.x - b.x)
  const lines: TextItem[][] = []
  let current: TextItem[] = []

  for (const item of sorted) {
    if (current.length === 0) {
      current.push(item)
    } else {
      const lastY = current[current.length - 1].y
      if (Math.abs(item.y - lastY) <= yTolerance) {
        current.push(item)
      } else {
        lines.push(current)
        current = [item]
      }
    }
  }
  if (current.length > 0) lines.push(current)
  return lines
}

/**
 * Convert text lines from all pages into docx paragraphs.
 */
async function buildDocxParagraphs(
  allPageLines: TextItem[][][],
  docxLib: any
): Promise<any[]> {
  const { Paragraph, TextRun, HeadingLevel, AlignmentType } = docxLib

  // Calculate font-size statistics to classify headings
  const allFontSizes: number[] = allPageLines
    .flat()
    .flat()
    .map(i => i.fontSize)
    .filter(fs => fs > 0)

  const avgFontSize = allFontSizes.length
    ? allFontSizes.reduce((a, b) => a + b, 0) / allFontSizes.length
    : 11

  const maxFontSize = Math.max(...allFontSizes, 11)

  const paragraphs: any[] = []
  let prevPageIdx = -1

  for (let pi = 0; pi < allPageLines.length; pi++) {
    const pageLines = allPageLines[pi]

    // Add page break between pages (but not before first page)
    if (pi > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: '', break: 1 })],
        })
      )
    }

    for (const line of pageLines) {
      if (line.length === 0) continue

      // Sort line items by X for correct reading order
      const sortedLine = [...line].sort((a, b) => a.x - b.x)
      const lineText = sortedLine.map(i => i.str).join(' ').trim()
      if (!lineText) continue

      const avgLineFont = sortedLine.reduce((s, i) => s + i.fontSize, 0) / sortedLine.length
      const isLargeFont = avgLineFont > avgFontSize * 1.3
      const isVeryLargeFont = avgLineFont > avgFontSize * 1.7 || avgLineFont >= maxFontSize * 0.9
      const isShort = lineText.length < 80
      const isBold = isLargeFont && isShort

      // Heuristic heading classification
      let headingLevel: any = null
      if (isVeryLargeFont && isShort) headingLevel = HeadingLevel.HEADING_1
      else if (isLargeFont && isShort) headingLevel = HeadingLevel.HEADING_2

      const textRun = new TextRun({
        text: lineText,
        bold: isBold && !headingLevel,
        size: Math.round(Math.max(avgLineFont, 9) * 2), // half-points
      })

      paragraphs.push(
        new Paragraph({
          children: [textRun],
          heading: headingLevel || undefined,
          spacing: { after: headingLevel ? 240 : 120, before: headingLevel ? 240 : 0 },
        })
      )
    }
    prevPageIdx = pi
  }

  return paragraphs
}

/**
 * Convert a PDF File to a real .docx Blob in the browser.
 */
export async function convertPdfToDocx(
  file: File,
  onProgress?: (p: PdfToDocxProgress) => void
): Promise<PdfToDocxResult> {
  onProgress?.({ stage: 'Loading PDF…', percent: 5 })

  const pdfjsLib = await import('pdfjs-dist')
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  }

  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  const totalPages = pdf.numPages

  onProgress?.({ stage: 'Extracting text and layout…', percent: 10 })

  const allPageLines: TextItem[][][] = []

  for (let p = 1; p <= totalPages; p++) {
    const items = await extractPageItems(pdf, p)
    const lines = groupIntoLines(items)
    allPageLines.push(lines)
    const pct = 10 + Math.round((p / totalPages) * 50)
    onProgress?.({ stage: `Extracting page ${p} of ${totalPages}…`, percent: pct })
  }

  onProgress?.({ stage: 'Building Word document structure…', percent: 65 })

  const docxLib = await import('docx')
  const { Document, Packer, SectionType } = docxLib

  const paragraphs = await buildDocxParagraphs(allPageLines, docxLib)
  const paragraphCount = paragraphs.length

  onProgress?.({ stage: 'Generating .docx file…', percent: 85 })

  const doc = new Document({
    creator: 'PDF Workspace',
    title: file.name.replace(/\.pdf$/i, ''),
    description: `Converted from ${file.name}`,
    sections: [
      {
        properties: { type: SectionType.CONTINUOUS },
        children: paragraphs,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)

  onProgress?.({ stage: 'Done!', percent: 100 })

  return { blob, pageCount: totalPages, paragraphCount }
}
