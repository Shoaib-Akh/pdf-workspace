export const MAX_FILE_SIZE_BROWSER = 500 * 1024 * 1024; // 500MB
export const MAX_FILE_SIZE_SERVER = 100 * 1024 * 1024; // 100MB
export const ACCEPTED_PDF_MIME = ['application/pdf'];
export const ACCEPTED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];

export const enum PROCESSING_MODES {
  BROWSER = 'browser',
  SERVER = 'server',
  EXTERNAL_API = 'external-api',
}

export const TOOL_CATEGORIES = [
  { id: 'convert', label: 'Convert', icon: 'file-refresh' },
  { id: 'extract', label: 'Extract Data', icon: 'file-text' },
  { id: 'organize', label: 'Organize PDF', icon: 'layers' },
  { id: 'ocr', label: 'OCR', icon: 'scan-text' },
  { id: 'business', label: 'Business Documents', icon: 'briefcase' },
  { id: 'construction', label: 'Construction', icon: 'hammer' },
  { id: 'images', label: 'Images', icon: 'image' },
  { id: 'security', label: 'Security', icon: 'shield' },
];
