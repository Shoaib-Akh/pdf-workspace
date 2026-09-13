import type { PDFDocumentProxy } from 'pdfjs-dist';
import { loadPDF, renderPageToCanvas, extractPageText, detectContentType } from '@/services/pdf/pdfEngine';

export interface PageOcrResult {
  pageNumber: number;
  text: string;
  confidence: number;
}

export interface OcrProgress {
  stage: string;
  currentPage: number;
  totalPages: number;
  percent: number;
}

export interface OcrResult {
  fullText: string;
  pages: PageOcrResult[];
  averageConfidence: number;
  pageCount: number;
  language: string;
  isScanned: boolean;
  truncatedDueToLimit: boolean;
}

export const MAX_BROWSER_OCR_PAGES = 10;

export async function detectIsScannedPdf(fileOrDoc: File | PDFDocumentProxy): Promise<boolean> {
  const doc = 'numPages' in fileOrDoc ? fileOrDoc : await loadPDF(fileOrDoc);
  const type = await detectContentType(doc);
  return type === 'scanned';
}

export async function runBrowserOcr(
  fileOrDoc: File | PDFDocumentProxy,
  options: {
    language?: string;
    maxPages?: number;
    pageNumbers?: number[];
    onProgress?: (progress: OcrProgress) => void;
  } = {}
): Promise<OcrResult> {
  const language = options.language || 'eng';
  const doc = 'numPages' in fileOrDoc ? fileOrDoc : await loadPDF(fileOrDoc);
  const totalInDoc = doc.numPages;

  let pagesToProcess: number[] = [];
  if (options.pageNumbers && options.pageNumbers.length > 0) {
    pagesToProcess = options.pageNumbers.filter((p) => p >= 1 && p <= totalInDoc);
  } else {
    const limit = options.maxPages || MAX_BROWSER_OCR_PAGES;
    const count = Math.min(totalInDoc, limit);
    for (let i = 1; i <= count; i++) {
      pagesToProcess.push(i);
    }
  }

  const truncatedDueToLimit = totalInDoc > pagesToProcess.length && !options.pageNumbers;

  options.onProgress?.({
    stage: 'Initializing OCR Engine (Tesseract.js)...',
    currentPage: 0,
    totalPages: pagesToProcess.length,
    percent: 5,
  });

  // Lazy-load Tesseract.js so it's not in the main bundle
  const { createWorker } = await import('tesseract.js');

  const worker = await createWorker(language, 1, {
    logger: (msg: any) => {
      if (msg.status === 'recognizing text' && typeof msg.progress === 'number') {
        // Sub-progress during active page
      }
    },
  });

  const pageResults: PageOcrResult[] = [];

  try {
    for (let idx = 0; idx < pagesToProcess.length; idx++) {
      const pageNum = pagesToProcess[idx];
      const pageIndex1 = idx + 1;
      const basePercent = Math.round((idx / pagesToProcess.length) * 85) + 10;

      options.onProgress?.({
        stage: `Rendering Page ${pageNum} for recognition...`,
        currentPage: pageIndex1,
        totalPages: pagesToProcess.length,
        percent: basePercent,
      });

      // Render page to canvas at 2.0 scale (192 DPI approx) for optimal OCR accuracy
      const canvas = await renderPageToCanvas(doc, pageNum, 2.0);

      options.onProgress?.({
        stage: `Running OCR on Page ${pageNum} of ${pagesToProcess.length}...`,
        currentPage: pageIndex1,
        totalPages: pagesToProcess.length,
        percent: basePercent + 5,
      });

      const result = await worker.recognize(canvas);
      const text = result.data.text.trim();
      const confidence = Math.round(result.data.confidence || 0);

      pageResults.push({
        pageNumber: pageNum,
        text,
        confidence,
      });
    }
  } finally {
    await worker.terminate();
  }

  options.onProgress?.({
    stage: 'OCR complete!',
    currentPage: pagesToProcess.length,
    totalPages: pagesToProcess.length,
    percent: 100,
  });

  const fullText = pageResults
    .map((p) => `--- Page ${p.pageNumber} ---\n${p.text}`)
    .join('\n\n');

  const totalConfidence = pageResults.reduce((acc, p) => acc + p.confidence, 0);
  const averageConfidence = pageResults.length > 0 ? Math.round(totalConfidence / pageResults.length) : 0;

  // Check if native text was present
  let hasNativeText = false;
  try {
    const firstPageText = await extractPageText(doc, 1);
    hasNativeText = firstPageText.trim().length > 20;
  } catch {
    hasNativeText = false;
  }

  return {
    fullText,
    pages: pageResults,
    averageConfidence,
    pageCount: pagesToProcess.length,
    language,
    isScanned: !hasNativeText,
    truncatedDueToLimit,
  };
}
