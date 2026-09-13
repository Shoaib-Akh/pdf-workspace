import type { PDFDocumentProxy } from 'pdfjs-dist';

export class PdfEngineError extends Error {
  constructor(public userMessage: string, public technicalMessage?: string) {
    super(userMessage);
    this.name = 'PdfEngineError';
  }
}

async function getPdfLib() {
  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }
  return pdfjsLib;
}

export async function loadPDF(file: File): Promise<PDFDocumentProxy> {
  try {
    const buffer = await file.arrayBuffer();
    const pdfjsLib = await getPdfLib();
    const task = pdfjsLib.getDocument({ data: buffer });
    return await task.promise;
  } catch (err: any) {
    const msg = err?.message || err?.name || '';
    if (msg.includes('Password') || err?.name === 'PasswordException') {
      throw new PdfEngineError("This PDF is password-protected. Use Unlock PDF first.", msg);
    }
    if (msg.includes('Invalid') || err?.name === 'InvalidPDFException') {
      throw new PdfEngineError("This doesn't appear to be a valid PDF file.", msg);
    }
    throw new PdfEngineError("This file appears to be damaged. Try re-downloading the original.", msg);
  }
}

export async function getPageCount(doc: PDFDocumentProxy): Promise<number> {
  return doc.numPages;
}

export async function renderPageToCanvas(
  doc: PDFDocumentProxy,
  pageNumber: number,
  scale: number = 2.0
): Promise<HTMLCanvasElement> {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
  return canvas;
}

export async function extractPageText(
  doc: PDFDocumentProxy,
  pageNumber: number
): Promise<string> {
  const page = await doc.getPage(pageNumber);
  const textContent = await page.getTextContent();
  return textContent.items
    .map((item: any) => (typeof item?.str === 'string' ? item.str : ''))
    .filter(Boolean)
    .join(' ');
}

export async function extractAllText(
  doc: PDFDocumentProxy,
  onProgress?: (page: number, total: number) => void
): Promise<string[]> {
  const total = doc.numPages;
  const texts: string[] = [];
  
  for (let i = 1; i <= total; i++) {
    const text = await extractPageText(doc, i);
    texts.push(text);
    if (onProgress) {
      onProgress(i, total);
    }
  }
  
  return texts;
}

export async function detectContentType(
  doc: PDFDocumentProxy
): Promise<'text' | 'scanned' | 'mixed'> {
  const maxPagesToCheck = Math.min(3, doc.numPages);
  let pagesWithText = 0;
  
  for (let i = 1; i <= maxPagesToCheck; i++) {
    const text = await extractPageText(doc, i);
    if (text.trim().length > 50) { // simple heuristic
      pagesWithText++;
    }
  }
  
  if (pagesWithText === maxPagesToCheck) return 'text';
  if (pagesWithText === 0) return 'scanned';
  return 'mixed';
}

export interface PdfMetadataResult {
  title?: string;
  author?: string;
  subject?: string;
  pageCount: number;
  fileSize: number;
  fileName: string;
  isEncrypted: boolean;
  hasText: boolean;
  isScanned: boolean;
}

export async function getPdfMetadata(
  doc: PDFDocumentProxy,
  file: File
): Promise<PdfMetadataResult> {
  let title = '';
  let author = '';
  let subject = '';
  let isEncrypted = false;
  
  try {
    const metaData = await doc.getMetadata();
    const info = metaData?.info as any;
    if (info) {
      title = info.Title || '';
      author = info.Author || '';
      subject = info.Subject || '';
    }
  } catch (e) {
    // getMetadata can fail on some documents
  }

  const contentType = await detectContentType(doc);

  return {
    title,
    author,
    subject,
    pageCount: doc.numPages,
    fileSize: file.size,
    fileName: file.name,
    isEncrypted, // Typically handled upfront, but included in shape
    hasText: contentType === 'text' || contentType === 'mixed',
    isScanned: contentType === 'scanned'
  };
}
