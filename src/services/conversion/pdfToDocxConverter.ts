/**
 * pdfToDocxConverter.ts
 * Browser-based PDF → real DOCX conversion.
 *
 * Strategy:
 * 1. Extract every text item with full positional data (x, y, fontSize, fontName)
 * 2. Group items into ROWS by Y-coordinate (same Y ± tolerance = same line)
 * 3. Within each row, group items into CELLS by X-coordinate clusters
 * 4. Detect whether a row-group is a TABLE (3+ consistent columns) or PARAGRAPH (1-2 cols)
 * 5. Detect BOLD by checking if fontName ends in a different suffix from the regular font
 *    (pdfjs uses internal names like g_d0_f1/g_d0_f2; the font that appears FIRST and is
 *    used for headers is treated as bold when it differs from the dominant font)
 * 6. Build DOCX with proper tables using the `docx` library.
 *
 * Runs 100% client-side — no server required.
 */

export interface PdfToDocxProgress {
  stage: string
  percent: number
}

export interface PdfToDocxResult {
  blob: Blob
  pageCount: number
  paragraphCount: number
  tableCount: number
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TextItem {
  str: string
  x: number
  y: number
  fontSize: number
  fontName: string
  width: number
}

interface Row {
  y: number
  items: TextItem[]
}

interface Cell {
  text: string
  isBold: boolean
  fontSize: number
}

interface DocRow {
  cells: Cell[]
  isTableRow: boolean
}

// ─── Helper: Extract text items with positional data ─────────────────────────

async function extractPageItems(doc: any, pageNum: number): Promise<TextItem[]> {
  const page = await doc.getPage(pageNum)
  const content = await page.getTextContent({ includeMarkedContent: false })
  const viewport = page.getViewport({ scale: 1 })
  const pageH = viewport.height

  const items: TextItem[] = []
  for (const item of content.items as any[]) {
    const str = (item.str || '').replace(/\u0000/g, '') // strip null bytes
    if (!str) continue
    const tx = item.transform
    const x = Math.round(tx[4])
    const y = Math.round(pageH - tx[5])          // flip Y so 0=top of page
    const fontSize = Math.round(Math.abs(tx[3]) || Math.abs(tx[0]) || 10)
    items.push({
      str,
      x,
      y,
      fontSize,
      fontName: item.fontName || '',
      width: item.width || 0,
    })
  }
  return items
}

// ─── Helper: Detect which fontName is "bold" ────────────────────────────────

/**
 * Determines bold fontNames by heuristic:
 * - In most PDFs, internal font names like "g_d0_f1", "g_d0_f2" are assigned in order.
 *   Headers (bold text) often appear FIRST in the stream.
 * - We count how often each fontName is used; the LEAST frequent one in short-text
 *   positions is likely bold.
 * - Also check if fontName string contains "Bold", "Heavy", "Black", "Demi".
 */
function detectBoldFonts(allItems: TextItem[]): Set<string> {
  const boldFonts = new Set<string>()

  // Heuristic 1: Explicit "Bold" in font name
  const fontNames = [...new Set(allItems.map(i => i.fontName))]
  for (const fn of fontNames) {
    if (/bold|heavy|black|demi|strong/i.test(fn)) {
      boldFonts.add(fn)
    }
  }

  // Heuristic 2: If there are exactly 2 font names used in the document,
  // the one used less often (header font) is typically bold.
  if (boldFonts.size === 0 && fontNames.length === 2) {
    const countA = allItems.filter(i => i.fontName === fontNames[0]).length
    const countB = allItems.filter(i => i.fontName === fontNames[1]).length
    // The less-used one is bold (headers, labels)
    if (countA < countB) boldFonts.add(fontNames[0])
    else boldFonts.add(fontNames[1])
  }

  // Heuristic 3: If 3+ fonts, look for the one used mostly for short lines (headings)
  if (boldFonts.size === 0 && fontNames.length >= 3) {
    const avgLenByFont: Record<string, number> = {}
    for (const fn of fontNames) {
      const strs = allItems.filter(i => i.fontName === fn).map(i => i.str.length)
      avgLenByFont[fn] = strs.reduce((a, b) => a + b, 0) / (strs.length || 1)
    }
    // Font with the shortest average string length = headings/labels = bold
    const sortedByLen = fontNames.sort((a, b) => avgLenByFont[a] - avgLenByFont[b])
    boldFonts.add(sortedByLen[0])
  }

  return boldFonts
}

// ─── Helper: Group items into rows (same Y ± tolerance) ─────────────────────

function groupIntoRows(items: TextItem[], yTolerance = 4): Row[] {
  const sorted = [...items].sort((a, b) => a.y - b.y || a.x - b.x)
  const rows: Row[] = []
  let current: TextItem[] = []

  for (const item of sorted) {
    if (current.length === 0) {
      current.push(item)
    } else {
      const lastY = current[current.length - 1].y
      if (Math.abs(item.y - lastY) <= yTolerance) {
        current.push(item)
      } else {
        rows.push({ y: current[0].y, items: current })
        current = [item]
      }
    }
  }
  if (current.length > 0) rows.push({ y: current[0].y, items: current })
  return rows
}

// ─── Helper: Detect column X-positions from all rows ────────────────────────

function detectColumnBands(rows: Row[], minRows = 3): number[] {
  // Collect all starting X positions of items across rows
  const xCounts: Record<number, number> = {}
  for (const row of rows) {
    // Snap X to nearest 10px bucket
    const xs = [...new Set(row.items.map(i => Math.round(i.x / 8) * 8))]
    for (const x of xs) {
      xCounts[x] = (xCounts[x] || 0) + 1
    }
  }

  // X positions that appear in at least minRows rows are column starts
  const colXs = Object.entries(xCounts)
    .filter(([, count]) => count >= minRows)
    .map(([x]) => parseInt(x))
    .sort((a, b) => a - b)

  return colXs
}

// ─── Helper: Assign each row's items into columns ───────────────────────────

function assignItemsToCols(row: Row, colBands: number[], boldFonts: Set<string>): Cell[] {
  const cells: Cell[] = colBands.map(() => ({ text: '', isBold: false, fontSize: 10 }))

  const sortedItems = [...row.items].sort((a, b) => a.x - b.x)

  for (const item of sortedItems) {
    // Find the column this item belongs to (closest band that is ≤ item.x + 20px)
    let bestCol = 0
    let bestDist = Infinity
    for (let ci = 0; ci < colBands.length; ci++) {
      const dist = Math.abs(item.x - colBands[ci])
      if (dist < bestDist && item.x >= colBands[ci] - 20) {
        bestDist = dist
        bestCol = ci
      }
    }

    const cell = cells[bestCol]
    if (cell.text && !cell.text.endsWith(' ')) cell.text += ' '
    cell.text += item.str
    if (boldFonts.has(item.fontName)) cell.isBold = true
    cell.fontSize = Math.max(cell.fontSize, item.fontSize)
  }

  // Clean up text
  for (const cell of cells) {
    cell.text = cell.text.trim()
  }

  return cells
}

// ─── Build DOCX table from row groups ────────────────────────────────────────

async function buildTableElement(docRows: Cell[][], docxLib: any): Promise<any> {
  const {
    Table, TableRow, TableCell, Paragraph, TextRun, WidthType,
    BorderStyle, ShadingType, AlignmentType,
  } = docxLib

  const colCount = Math.max(...docRows.map(r => r.length))
  const colWidthPct = Math.floor(9000 / colCount)  // total table width in pct units (9000 = 100%)

  const tRows = docRows.map((row, ri) => {
    const isHeader = ri === 0 && row.every(c => c.isBold)
    return new TableRow({
      children: row.map((cell, ci) =>
        new TableCell({
          width: { size: colWidthPct, type: WidthType.PERCENTAGE },
          shading: isHeader
            ? { type: ShadingType.SOLID, color: 'D9E1F2', fill: 'D9E1F2' }
            : undefined,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cell.text,
                  bold: cell.isBold,
                  size: Math.round(cell.fontSize * 2),
                }),
              ],
              alignment: /^\d/.test(cell.text.trim())
                ? AlignmentType.RIGHT
                : AlignmentType.LEFT,
            }),
          ],
        })
      ),
    })
  })

  return new Table({
    rows: tRows,
    width: { size: 9000, type: WidthType.DXA },
  })
}

// ─── Main converter ───────────────────────────────────────────────────────────

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

  // ── Extract all pages ───────────────────────────────────────────────────────
  const allPageItems: TextItem[][] = []
  for (let p = 1; p <= totalPages; p++) {
    const items = await extractPageItems(pdf, p)
    allPageItems.push(items)
    const pct = 10 + Math.round((p / totalPages) * 40)
    onProgress?.({ stage: `Extracting page ${p} of ${totalPages}…`, percent: pct })
  }

  // ── Detect bold fonts from ALL pages combined ───────────────────────────────
  const allItems = allPageItems.flat()
  const boldFonts = detectBoldFonts(allItems)

  onProgress?.({ stage: 'Analysing document structure…', percent: 55 })

  // ── Detect column bands from all pages (table awareness) ───────────────────
  const allRows = allPageItems.flatMap(items => groupIntoRows(items))
  const colBands = detectColumnBands(allRows, Math.max(3, Math.floor(totalPages * 1.5)))

  const isTableDocument = colBands.length >= 3

  onProgress?.({ stage: 'Building Word document…', percent: 65 })

  const docxLib = await import('docx')
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, SectionType,
    Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType,
    PageOrientation } = docxLib

  const docChildren: any[] = []
  let tableCount = 0
  let paragraphCount = 0

  // ── Process each page ───────────────────────────────────────────────────────
  for (let pi = 0; pi < allPageItems.length; pi++) {
    if (pi > 0) {
      // Page break between pages
      docChildren.push(
        new Paragraph({ children: [], pageBreakBefore: true })
      )
    }

    const pageRows = groupIntoRows(allPageItems[pi])

    if (isTableDocument && colBands.length >= 3) {
      // ── TABLE MODE: group consecutive rows into one table ─────────────────
      let tableRows: Cell[][] = []

      const flushTable = () => {
        if (tableRows.length === 0) return

        // Build docx table rows
        const tRows = tableRows.map((row, ri) => {
          const isHeader = ri === 0 && row.every(c => c.isBold || c.text.length < 20)
          return new TableRow({
            tableHeader: isHeader,
            children: row.map((cell) =>
              new TableCell({
                width: { size: Math.floor(9000 / row.length), type: WidthType.PERCENTAGE },
                shading: isHeader
                  ? { type: ShadingType.SOLID, color: 'BDD7EE', fill: 'BDD7EE' }
                  : undefined,
                margins: { top: 60, bottom: 60, left: 80, right: 80 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cell.text,
                        bold: cell.isBold || isHeader,
                        size: Math.round(Math.max(cell.fontSize, 9) * 2),
                      }),
                    ],
                    alignment: /^[\d,.\-$£€]+$/.test(cell.text.replace(/\s/g, ''))
                      ? AlignmentType.RIGHT
                      : AlignmentType.LEFT,
                  }),
                ],
              })
            ),
          })
        })

        docChildren.push(
          new Table({
            rows: tRows,
            width: { size: 9000, type: WidthType.DXA },
          })
        )
        docChildren.push(new Paragraph({ children: [] })) // spacing after table
        tableRows = []
        tableCount++
      }

      for (const row of pageRows) {
        const cells = assignItemsToCols(row, colBands, boldFonts)
        const nonEmptyCells = cells.filter(c => c.text.trim())

        if (nonEmptyCells.length >= 2) {
          // Looks like a table row
          tableRows.push(cells)
        } else if (nonEmptyCells.length === 1) {
          // Single-cell row — could be a section heading between table sections
          flushTable()

          const item = row.items[0]
          const isBold = boldFonts.has(item?.fontName || '') || cells[0].isBold
          const text = nonEmptyCells[0].text
          const isLarge = row.items.some(i => i.fontSize > 10)

          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text, bold: isBold, size: isLarge ? 24 : 20 })],
              heading: (isBold && text.length < 80) ? HeadingLevel.HEADING_2 : undefined,
              spacing: { before: 160, after: 80 },
            })
          )
          paragraphCount++
        } else {
          // Empty row — flush any pending table
          flushTable()
        }
      }

      flushTable()
    } else {
      // ── PARAGRAPH MODE: for non-table PDFs (letters, reports, etc.) ───────
      const fontSizes = allItems.map(i => i.fontSize).filter(f => f > 0)
      const avgFontSize = fontSizes.length
        ? fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length
        : 10

      for (const row of pageRows) {
        const sortedItems = [...row.items].sort((a, b) => a.x - b.x)
        const text = sortedItems.map(i => i.str).join(' ').trim()
        if (!text) continue

        const isBold = sortedItems.some(i => boldFonts.has(i.fontName))
        const avgRowFont = sortedItems.reduce((s, i) => s + i.fontSize, 0) / sortedItems.length
        const isHeading = isBold && text.length < 100 && avgRowFont >= avgFontSize

        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text,
                bold: isBold,
                size: Math.round(Math.max(avgRowFont, 9) * 2),
              }),
            ],
            heading: isHeading ? HeadingLevel.HEADING_2 : undefined,
            spacing: { after: isHeading ? 160 : 80 },
          })
        )
        paragraphCount++
      }
    }

    const pct = 65 + Math.round(((pi + 1) / totalPages) * 25)
    onProgress?.({ stage: `Building page ${pi + 1} of ${totalPages}…`, percent: pct })
  }

  onProgress?.({ stage: 'Generating .docx file…', percent: 92 })

  const doc = new Document({
    creator: 'PDF Workspace',
    title: file.name.replace(/\.pdf$/i, ''),
    description: `Converted from ${file.name}`,
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT,
              width: 12240,    // Letter width in TWIPs (8.5 inches × 1440)
              height: 15840,   // Letter height in TWIPs (11 inches × 1440)
            },
            margin: {
              top: 720,        // 0.5 inch
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children: docChildren,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)

  onProgress?.({ stage: 'Done!', percent: 100 })

  return {
    blob,
    pageCount: totalPages,
    paragraphCount: paragraphCount + tableCount,
    tableCount,
  }
}
