import type { ExtractedTable, ExtractionResult, KeyValuePair } from './textExtractor';
import { downloadBlob } from '@/lib/utils';

/**
 * Escapes a cell value according to standard CSV RFC 4180 rules.
 * If the string contains comma, quote, or newline, it is enclosed in double quotes
 * and any inner double quotes are escaped as two double quotes.
 */
function escapeCsvCell(cell: string | number | null | undefined): string {
  if (cell === null || cell === undefined) {
    return '';
  }
  const str = String(cell);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts an ExtractedTable into a properly formatted and escaped CSV string.
 */
export function tableToCSV(table: ExtractedTable): string {
  const rows = [table.headers, ...table.rows];
  return rows
    .map(row => row.map(escapeCsvCell).join(','))
    .join('\n');
}

/**
 * Initiates a browser file download for a CSV string using downloadBlob.
 */
export function downloadCSV(content: string, fileName: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, fileName);
}

/**
 * Exports a single ExtractedTable as a CSV file download.
 */
export function exportTableToCSV(table: ExtractedTable, fileName?: string): void {
  const targetFileName = fileName || `${table.id || 'table'}.csv`;
  const csvContent = tableToCSV(table);
  downloadCSV(csvContent, targetFileName);
}

/**
 * Exports key-value pairs as a 2-column CSV file download.
 */
export function exportKVPairsToCSV(pairs: KeyValuePair[], fileName?: string): void {
  const targetFileName = fileName || 'key-values.csv';
  const rows = [
    ['Key', 'Value'],
    ...pairs.map(pair => [pair.key, pair.value]),
  ];
  const csvContent = rows
    .map(row => row.map(escapeCsvCell).join(','))
    .join('\n');
  downloadCSV(csvContent, targetFileName);
}

/**
 * Exports raw page texts to a plain text (.txt) file download.
 */
export function exportTextToTxt(pageTexts: string[], fileName?: string): void {
  const targetFileName = fileName || 'text.txt';
  const content = pageTexts.join('\n\n--- PAGE BREAK ---\n\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  downloadBlob(blob, targetFileName);
}

/**
 * Exports any arbitrary object or data structure as a formatted JSON file download.
 */
export function exportToJSON(data: unknown, fileName?: string): void {
  const targetFileName = fileName || 'data.json';
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, targetFileName);
}

/**
 * Exports the full ExtractionResult as a formatted Markdown file download
 * containing key-value pairs, tables, and detected entities.
 */
export function exportToMarkdown(result: ExtractionResult, fileName?: string): void {
  const targetFileName = fileName || 'extraction.md';
  const sections: string[] = ['# Extracted Document Data\n'];

  // Summary Section
  sections.push('## Summary\n');
  sections.push(`- **Pages**: ${result.pageCount}`);
  sections.push(`- **Tables Found**: ${result.tables.length}`);
  sections.push(`- **Key Fields**: ${result.keyValuePairs.length}`);
  sections.push(`- **Dates Found**: ${result.detectedDates.length}`);
  sections.push(`- **Numbers Found**: ${result.detectedNumbers.length}`);
  sections.push('');

  // Key Fields Section
  if (result.keyValuePairs.length > 0) {
    sections.push('## Key Fields\n');
    result.keyValuePairs.forEach(p => {
      sections.push(`- **${p.key}**: ${p.value}`);
    });
    sections.push('');
  }

  // Tables Section
  if (result.tables.length > 0) {
    sections.push('## Tables\n');
    result.tables.forEach((table, index) => {
      sections.push(`### Table ${index + 1} (Page ${table.pageNumber})\n`);
      if (table.headers.length > 0) {
        sections.push(`| ${table.headers.map(h => h.replace(/\|/g, '\\|')).join(' | ')} |`);
        sections.push(`| ${table.headers.map(() => '---').join(' | ')} |`);
      }
      table.rows.forEach(row => {
        sections.push(`| ${row.map(c => c.replace(/\|/g, '\\|')).join(' | ')} |`);
      });
      sections.push('');
    });
  }

  // Detected Dates Section
  if (result.detectedDates.length > 0) {
    sections.push('## Detected Dates\n');
    result.detectedDates.forEach(date => {
      sections.push(`- ${date}`);
    });
    sections.push('');
  }

  // Detected Numbers Section
  if (result.detectedNumbers.length > 0) {
    sections.push('## Detected Numbers & Currency\n');
    result.detectedNumbers.forEach(num => {
      sections.push(`- ${num}`);
    });
    sections.push('');
  }

  const content = sections.join('\n');
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  downloadBlob(blob, targetFileName);
}
