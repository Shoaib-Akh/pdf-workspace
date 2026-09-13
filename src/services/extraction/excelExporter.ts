import type { ExtractedTable, ExtractionResult, KeyValuePair } from './textExtractor';
import { downloadBlob } from '@/lib/utils';

/**
 * Sanitizes sheet names to conform to Excel's 31-character limit
 * and removes illegal characters: \ / ? * [ ] :
 */
function sanitizeSheetName(name: string, fallback: string): string {
  const sanitized = name.replace(/[\\/?*[\]:]/g, '_').trim().slice(0, 31);
  return sanitized.length > 0 ? sanitized : fallback.slice(0, 31);
}

/**
 * Exports extracted tables to an Excel workbook with one worksheet per table.
 */
export async function exportTablesToExcel(
  tables: ExtractedTable[],
  fileName?: string
): Promise<void> {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  if (tables.length === 0) {
    const ws = XLSX.utils.aoa_to_sheet([['No tables found']]);
    XLSX.utils.book_append_sheet(wb, ws, 'Tables');
  } else {
    tables.forEach((table, index) => {
      const wsData = [table.headers, ...table.rows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const sheetName = sanitizeSheetName(`Table ${index + 1}`, `Table_${index + 1}`);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
  }

  const targetFileName = fileName || 'tables.xlsx';
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, targetFileName);
}

/**
 * Exports full extraction results to an Excel workbook across multiple worksheets:
 * 1. Summary
 * 2. Table 1, Table 2, ...
 * 3. Text (per page)
 * 4. Key Fields
 */
export async function exportFullExtractionToExcel(
  result: ExtractionResult,
  fileName?: string
): Promise<void> {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData: (string | number)[][] = [
    ['Metric', 'Value'],
    ['Page Count', result.pageCount],
    ['Table Count', result.tables.length],
    ['Key Fields Count', result.keyValuePairs.length],
    ['Dates Count', result.detectedDates.length],
    ['Numbers Count', result.detectedNumbers.length],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Sheet 2+: Table N
  result.tables.forEach((table, index) => {
    const wsData = [table.headers, ...table.rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const sheetName = sanitizeSheetName(`Table ${index + 1}`, `Table_${index + 1}`);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // Sheet: Text
  const textData: string[][] = [['Page', 'Text']];
  result.pageTexts.forEach((pageText, index) => {
    textData.push([`Page ${index + 1}`, pageText]);
  });
  const wsText = XLSX.utils.aoa_to_sheet(textData);
  XLSX.utils.book_append_sheet(wb, wsText, 'Text');

  // Sheet: Key Fields
  const kvData: string[][] = [['Key', 'Value']];
  result.keyValuePairs.forEach(p => {
    kvData.push([p.key, p.value]);
  });
  const wsKV = XLSX.utils.aoa_to_sheet(kvData);
  XLSX.utils.book_append_sheet(wb, wsKV, 'Key Fields');

  const targetFileName = fileName || 'extraction-result.xlsx';
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, targetFileName);
}

/**
 * Exports key-value pairs into a dedicated Excel workbook.
 */
export async function exportKVPairsToExcel(
  pairs: KeyValuePair[],
  fileName?: string
): Promise<void> {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  const wsData: string[][] = [['Key', 'Value']];
  pairs.forEach(p => {
    wsData.push([p.key, p.value]);
  });
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Key Fields');

  const targetFileName = fileName || 'key-values.xlsx';
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, targetFileName);
}

/**
 * Exports extracted page text to an Excel workbook.
 */
export async function exportTextToExcel(
  pageTexts: string[],
  fileName?: string
): Promise<void> {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  const wsData: string[][] = [['Page', 'Text']];
  pageTexts.forEach((text, index) => {
    wsData.push([`Page ${index + 1}`, text]);
  });
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Text');

  const targetFileName = fileName || 'text.xlsx';
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, targetFileName);
}
