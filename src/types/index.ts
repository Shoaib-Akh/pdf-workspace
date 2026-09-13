export type ProcessingMode = 'browser' | 'server' | 'external-api'
export type ProcessingState = 'idle' | 'loading' | 'processing' | 'complete' | 'error'

export interface PDFMetadata {
  title?: string
  author?: string
  subject?: string
  pageCount: number
  fileSize: number
  fileName: string
  isEncrypted: boolean
  hasText: boolean
  isScanned: boolean
}

export interface ConversionJob {
  id: string
  inputFile: File
  outputFormat: string
  options?: Record<string, unknown>
  mode: ProcessingMode
}

export interface ConversionResult {
  success: boolean
  blob?: Blob
  url?: string
  error?: string
  fileName?: string
  pageCount?: number
}

export interface ExtractedTable {
  id: string
  pageNumber: number
  headers: string[]
  rows: string[][]
  confidence: number
}

export interface ExtractedData {
  tables: ExtractedTable[]
  text: string
  keyValuePairs: Record<string, string>
  numbers: string[]
  dates: string[]
  pageTexts: string[]
}

export interface ToolDefinition {
  slug: string
  name: string
  description: string
  category: string
  processingMode: ProcessingMode
  available: boolean
  inputFormats: string[]
  outputFormats: string[]
  icon: string
  featured?: boolean
}

export interface ConversionProvider {
  name: string
  isAvailable(): Promise<boolean>
  convert(job: ConversionJob): Promise<ConversionResult>
}
