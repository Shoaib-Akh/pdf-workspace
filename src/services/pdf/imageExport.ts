import type { PDFDocumentProxy } from 'pdfjs-dist';
import { renderPageToCanvas } from '@/services/pdf/pdfEngine';

export type ImageFormat = 'jpeg' | 'png' | 'webp';

export interface ImageExportOptions {
  format: ImageFormat;
  quality: number;        // 0-1 (for jpeg/webp)
  scale: number;          // 1 = 96dpi, 1.5 = 144dpi, 2 = 192dpi, 3 = 288dpi
  grayscale?: boolean;
  pageNumbers?: number[]; // if undefined, export all pages
  onProgress?: (page: number, total: number) => void;
}

export interface ImageExportResult {
  pageNumber: number;
  blob: Blob;
  width: number;
  height: number;
  fileName: string;  // e.g. "document-page-1.jpg"
}

export const DPI_OPTIONS = [
  { label: '72 DPI (screen)', value: 72, scale: 0.75 },
  { label: '150 DPI (standard)', value: 150, scale: 1.56 },
  { label: '300 DPI (print)', value: 300, scale: 3.125 },
];

function applyGrayscale(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
  ctx.putImageData(imgData, 0, 0);
}

export async function exportPageToBlob(
  doc: PDFDocumentProxy,
  pageNumber: number,
  options: Omit<ImageExportOptions, 'pageNumbers' | 'onProgress'>
): Promise<Blob> {
  const canvas = await renderPageToCanvas(doc, pageNumber, options.scale);
  
  if (options.grayscale) {
    applyGrayscale(canvas);
  }

  const mimeType = `image/${options.format}`;
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas to Blob conversion failed'));
      },
      mimeType,
      options.quality
    );
  });
}

export async function exportPdfToImages(
  doc: PDFDocumentProxy,
  baseName: string,
  options: ImageExportOptions
): Promise<ImageExportResult[]> {
  const results: ImageExportResult[] = [];
  const totalPages = doc.numPages;
  const targetPages = options.pageNumbers || Array.from({ length: totalPages }, (_, i) => i + 1);
  const ext = options.format === 'jpeg' ? 'jpg' : options.format;
  
  const baseNameWithoutExt = baseName.replace(/\.[^/.]+$/, "");

  let index = 0;
  for (const pageNum of targetPages) {
    index++;
    if (options.onProgress) {
      options.onProgress(index, targetPages.length);
    }
    
    // Calculate dimensions
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: options.scale });

    const blob = await exportPageToBlob(doc, pageNum, {
      format: options.format,
      quality: options.quality,
      scale: options.scale,
      grayscale: options.grayscale
    });

    results.push({
      pageNumber: pageNum,
      blob,
      width: Math.round(viewport.width),
      height: Math.round(viewport.height),
      fileName: `${baseNameWithoutExt}-page-${pageNum}.${ext}`
    });
  }

  return results;
}
