import { ToolDefinition } from '../types';

export const ALL_TOOLS: ToolDefinition[] = [
  // Convert - Browser
  { slug: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to JPG images.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['jpg'], icon: 'image', featured: true },
  { slug: 'pdf-to-png', name: 'PDF to PNG', description: 'Convert PDF pages to PNG images.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['png'], icon: 'image' },
  { slug: 'pdf-to-webp', name: 'PDF to WebP', description: 'Convert PDF pages to WebP images.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['webp'], icon: 'image' },
  { slug: 'pdf-to-txt', name: 'PDF to Text', description: 'Extract plain text from PDF.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['txt'], icon: 'file-text' },
  { slug: 'pdf-to-csv', name: 'PDF to CSV', description: 'Extract tables to CSV.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['csv'], icon: 'table' },
  { slug: 'pdf-to-json', name: 'PDF to JSON', description: 'Convert PDF to JSON format.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['json'], icon: 'code' },
  { slug: 'pdf-to-html', name: 'PDF to HTML', description: 'Convert PDF to HTML format.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['html'], icon: 'layout' },
  { slug: 'pdf-to-markdown', name: 'PDF to Markdown', description: 'Convert PDF to Markdown.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['md'], icon: 'file-text' },
  { slug: 'pdf-to-data', name: 'Extract Data', description: 'Extract data from PDF.', category: 'extract', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['json', 'csv'], icon: 'database', featured: true },

  // Convert - Server
  { slug: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to Word document.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['docx'], icon: 'file-word', featured: true },
  { slug: 'pdf-to-excel', name: 'PDF to Excel', description: 'Convert PDF to Excel spreadsheet.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['xlsx'], icon: 'file-spreadsheet', featured: true },
  { slug: 'pdf-to-powerpoint', name: 'PDF to PowerPoint', description: 'Convert PDF to PowerPoint presentation.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pptx'], icon: 'presentation' },
  { slug: 'pdf-to-epub', name: 'PDF to EPUB', description: 'Convert PDF to EPUB ebook.', category: 'convert', processingMode: 'server', available: false, inputFormats: ['pdf'], outputFormats: ['epub'], icon: 'book' },

  // Organize
  { slug: 'edit-pdf', name: 'Edit PDF', description: 'Edit, annotate, and sign PDF documents.', category: 'organize', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'edit', featured: true },
  { slug: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one.', category: 'organize', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'combine', featured: true },
  { slug: 'split-pdf', name: 'Split PDF', description: 'Split a PDF into multiple files.', category: 'organize', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'split' },
  { slug: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size.', category: 'organize', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'minimize', featured: true },
  { slug: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages.', category: 'organize', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'rotate-cw' },
  { slug: 'delete-pdf-pages', name: 'Delete Pages', description: 'Remove pages from PDF.', category: 'organize', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'trash' },
  { slug: 'extract-pdf-pages', name: 'Extract Pages', description: 'Extract specific pages from PDF.', category: 'organize', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'copy' },
  { slug: 'reorder-pdf-pages', name: 'Reorder Pages', description: 'Rearrange pages in PDF.', category: 'organize', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'move' },
  { slug: 'watermark-pdf', name: 'Watermark PDF', description: 'Add a watermark to PDF.', category: 'organize', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'droplet' },
  { slug: 'add-page-numbers', name: 'Add Page Numbers', description: 'Insert page numbers to PDF.', category: 'organize', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'hash' },
  { slug: 'password-protect-pdf', name: 'Protect PDF', description: 'Add a password to PDF.', category: 'security', processingMode: 'server', available: false, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'lock' },
  { slug: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove password from PDF.', category: 'security', processingMode: 'server', available: false, inputFormats: ['pdf'], outputFormats: ['pdf'], icon: 'unlock' },

  // Documents to PDF
  { slug: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word DOCX and DOC to PDF.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['docx', 'doc'], outputFormats: ['pdf'], icon: 'file-text', featured: true },
  { slug: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel XLSX, XLS, and CSV to PDF.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['xlsx', 'xls', 'csv'], outputFormats: ['pdf'], icon: 'file-spreadsheet', featured: true },
  { slug: 'powerpoint-to-pdf', name: 'PowerPoint to PDF', description: 'Convert PowerPoint PPTX and PPT to PDF.', category: 'convert', processingMode: 'browser', available: true, inputFormats: ['pptx', 'ppt'], outputFormats: ['pdf'], icon: 'presentation', featured: true },

  // Images
  { slug: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG to PDF.', category: 'images', processingMode: 'browser', available: true, inputFormats: ['jpg', 'jpeg'], outputFormats: ['pdf'], icon: 'file-image' },
  { slug: 'png-to-pdf', name: 'PNG to PDF', description: 'Convert PNG to PDF.', category: 'images', processingMode: 'browser', available: true, inputFormats: ['png'], outputFormats: ['pdf'], icon: 'file-image' },
  { slug: 'gif-to-pdf', name: 'GIF to PDF', description: 'Convert GIF to PDF.', category: 'images', processingMode: 'browser', available: true, inputFormats: ['gif'], outputFormats: ['pdf'], icon: 'file-image' },
  { slug: 'bmp-to-pdf', name: 'BMP to PDF', description: 'Convert BMP to PDF.', category: 'images', processingMode: 'browser', available: true, inputFormats: ['bmp'], outputFormats: ['pdf'], icon: 'file-image' },
  { slug: 'webp-to-pdf', name: 'WebP to PDF', description: 'Convert WebP to PDF.', category: 'images', processingMode: 'browser', available: true, inputFormats: ['webp'], outputFormats: ['pdf'], icon: 'file-image' },
  { slug: 'images-to-pdf', name: 'Images to PDF', description: 'Convert multiple images to PDF.', category: 'images', processingMode: 'browser', available: true, inputFormats: ['jpg', 'png', 'webp', 'bmp', 'gif'], outputFormats: ['pdf'], icon: 'images' },
  { slug: 'pdf-to-image', name: 'PDF to Image', description: 'Convert PDF to Images.', category: 'images', processingMode: 'browser', available: true, inputFormats: ['pdf'], outputFormats: ['jpg'], icon: 'image' }, // alias

  // OCR
  { slug: 'ocr-pdf', name: 'OCR PDF', description: 'Make scanned PDF searchable.', category: 'ocr', processingMode: 'browser', available: true, inputFormats: ['pdf', 'jpg', 'png'], outputFormats: ['pdf'], icon: 'scan-text', featured: true },
  { slug: 'scanned-pdf-to-text', name: 'Scanned to Text', description: 'Extract text from scanned PDF.', category: 'ocr', processingMode: 'browser', available: true, inputFormats: ['pdf', 'jpg', 'png'], outputFormats: ['txt'], icon: 'file-text' },
  { slug: 'scanned-pdf-to-word', name: 'Scanned to Word', description: 'Convert scanned PDF to Word.', category: 'ocr', processingMode: 'browser', available: true, inputFormats: ['pdf', 'jpg', 'png'], outputFormats: ['docx'], icon: 'file-word' },
  { slug: 'scanned-pdf-to-excel', name: 'Scanned to Excel', description: 'Convert scanned PDF to Excel.', category: 'ocr', processingMode: 'browser', available: true, inputFormats: ['pdf', 'jpg', 'png'], outputFormats: ['xlsx'], icon: 'file-spreadsheet' },
];

export function getFeaturedTools(): ToolDefinition[] {
  return ALL_TOOLS.filter(t => t.featured).slice(0, 8);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return ALL_TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  const target = category.toLowerCase().trim();
  return ALL_TOOLS.filter(t => t.category.toLowerCase() === target);
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return ALL_TOOLS.filter(t => t.category === tool.category && t.slug !== slug).slice(0, 5);
}
