import type { PDFDocumentProxy } from 'pdfjs-dist';
import { extractAllText } from '@/services/pdf/pdfEngine';

export interface ExtractedTable {
  id: string;
  pageNumber: number;
  headers: string[];
  rows: string[][];
  confidence: number;
}

export interface KeyValuePair {
  key: string;
  value: string;
  confidence: number;
}

export interface ExtractionResult {
  tables: ExtractedTable[];
  pageTexts: string[];
  fullText: string;
  keyValuePairs: KeyValuePair[];
  detectedDates: string[];
  detectedNumbers: string[];
  pageCount: number;
}

/**
 * Detect tables from raw page texts by splitting lines, identifying multi-column rows
 * separated by 2 or more spaces or tabs, grouping consecutive lines into tables,
 * and inferring headers and confidence.
 */
export function detectTablesFromText(pageTexts: string[]): ExtractedTable[] {
  const tables: ExtractedTable[] = [];

  pageTexts.forEach((pageText, pageIndex) => {
    const pageNumber = pageIndex + 1;
    const lines = pageText.split(/\r?\n/);
    let currentTableRows: string[][] = [];
    let inTable = false;
    let expectedCols = 0;

    const finalizeTable = () => {
      if (currentTableRows.length >= 2) {
        const maxCols = Math.max(...currentTableRows.map(row => row.length));
        if (maxCols >= 2) {
          // Normalize rows so all rows match maxCols
          const normalizedRows = currentTableRows.map(row => {
            if (row.length < maxCols) {
              return [...row, ...Array(maxCols - row.length).fill('')];
            }
            return row;
          });

          // Compute confidence based on row length consistency and total rows
          const perfectMatches = currentTableRows.filter(r => r.length === maxCols).length;
          const consistencyScore = perfectMatches / currentTableRows.length;
          const rowBonus = Math.min(currentTableRows.length / 10, 0.1);
          const confidence = Math.round(Math.min(0.95, 0.7 + consistencyScore * 0.2 + rowBonus) * 100) / 100;

          tables.push({
            id: `table-${pageNumber}-${tables.length + 1}`,
            pageNumber,
            headers: normalizedRows[0],
            rows: normalizedRows.slice(1),
            confidence,
          });
        }
      }
      inTable = false;
      currentTableRows = [];
      expectedCols = 0;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        if (inTable) {
          finalizeTable();
        }
        continue;
      }

      // Identify multi-column lines separated by 2+ spaces or tabs
      const columns = line
        .split(/\s{2,}|\t+/)
        .map(col => col.trim())
        .filter(col => col.length > 0);

      if (columns.length >= 2) {
        if (!inTable) {
          inTable = true;
          expectedCols = columns.length;
          currentTableRows = [columns];
        } else {
          // Check if column count aligns with expected count (tolerance +/- 2)
          if (Math.abs(columns.length - expectedCols) <= 2) {
            currentTableRows.push(columns);
            expectedCols = Math.round((expectedCols + columns.length) / 2);
          } else {
            // Significant structural change; finalize current table and start new one
            finalizeTable();
            inTable = true;
            expectedCols = columns.length;
            currentTableRows = [columns];
          }
        }
      } else {
        if (inTable) {
          finalizeTable();
        }
      }
    }

    if (inTable) {
      finalizeTable();
    }
  });

  return tables;
}

/**
 * Extract key-value pairs from text matching both:
 * 1. 'Key: Value' pattern
 * 2. 'Key   Value' pattern (separated by 2+ spaces)
 */
export function extractKeyValuePairs(text: string): KeyValuePair[] {
  const pairs: KeyValuePair[] = [];
  const lines = text.split(/\r?\n/);

  // Matches 'Key: Value'
  const colonRegex = /^([A-Za-z0-9\s#\-_/()&.]{2,40}?)\s*:\s*(.+)$/;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Pattern 1: 'Key: Value'
    const colonMatch = line.match(colonRegex);
    if (colonMatch) {
      const key = colonMatch[1].trim();
      const value = colonMatch[2].trim();

      // Avoid matching URL schemes (http, https, ftp, etc.) or purely numeric keys
      if (
        key.length >= 2 &&
        value.length > 0 &&
        !/^https?$/i.test(key) &&
        !/^\d+$/.test(key)
      ) {
        pairs.push({ key, value, confidence: 0.9 });
        continue;
      }
    }

    // Pattern 2: 'Key   Value' (2+ spaces or tabs separating exactly two columns)
    const spacedColumns = line
      .split(/\s{2,}|\t+/)
      .map(col => col.trim())
      .filter(col => col.length > 0);

    if (spacedColumns.length === 2) {
      const [key, value] = spacedColumns;
      // Key must look like a label (starts with a letter, reasonable length, not sentence-like)
      if (
        key.length >= 2 &&
        key.length <= 40 &&
        value.length > 0 &&
        /^[A-Za-z][A-Za-z0-9\s#\-_/()&.]*$/.test(key) &&
        !key.endsWith('.')
      ) {
        pairs.push({ key, value, confidence: 0.75 });
      }
    }
  }

  // Deduplicate by case-insensitive key name, keeping first occurrence
  const seenKeys = new Set<string>();
  const uniquePairs: KeyValuePair[] = [];

  for (const pair of pairs) {
    const normalizedKey = pair.key.toLowerCase();
    if (!seenKeys.has(normalizedKey)) {
      seenKeys.add(normalizedKey);
      uniquePairs.push(pair);
    }
  }

  return uniquePairs;
}

/**
 * Extract dates in common formats (YYYY-MM-DD, DD/MM/YYYY, Month Day, Year, etc.).
 */
export function extractDates(text: string): string[] {
  const datePatterns: RegExp[] = [
    // ISO and numeric: YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
    /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b/g,
    // Numeric: DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY, MM-DD-YYYY, DD.MM.YYYY, DD/MM/YY
    /\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b/g,
    // Textual: Jan 15, 2024; January 15, 2024; Jan 15 2024; 15th Jan 2024
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{2,4}\b/gi,
    // Textual: 15 Jan 2024; 15th January 2024; 15-Jan-2024
    /\b\d{1,2}(?:st|nd|rd|th)?[- ](?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?[- ]\d{2,4}\b/gi,
  ];

  const matches: string[] = [];
  for (const pattern of datePatterns) {
    const found = text.match(pattern);
    if (found) {
      matches.push(...found);
    }
  }

  const seen = new Set<string>();
  const uniqueDates: string[] = [];
  for (const date of matches) {
    const trimmed = date.trim();
    if (trimmed && !seen.has(trimmed.toLowerCase())) {
      seen.add(trimmed.toLowerCase());
      uniqueDates.push(trimmed);
    }
  }

  return uniqueDates;
}

/**
 * Extract numbers with currency symbols and monetary/formatted numeric expressions.
 */
export function extractNumbers(text: string): string[] {
  const numberPatterns: RegExp[] = [
    // Currency symbol or code prefix (e.g. $1,450.00, € 120.00, USD 500)
    /(?:[\$€£¥₹₩]|(?:USD|EUR|GBP|INR|CAD|AUD|CHF)[ \t]?)[ \t]?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?\b/gi,
    // Currency suffix (e.g. 1,450.00 USD, 50.00€)
    /\b\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?[ \t]?(?:[\$€£¥₹₩]|(?:USD|EUR|GBP|INR|CAD|AUD|CHF)\b)/gi,
    // Generic formatted numbers with thousands separator (e.g. 10,000 or 1,234,567.89)
    /\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b/g,
  ];

  const matches: string[] = [];
  for (const pattern of numberPatterns) {
    const found = text.match(pattern);
    if (found) {
      matches.push(...found);
    }
  }

  const seen = new Set<string>();
  const uniqueNumbers: string[] = [];
  for (const num of matches) {
    const trimmed = num.trim();
    if (trimmed && !seen.has(trimmed.toLowerCase())) {
      seen.add(trimmed.toLowerCase());
      uniqueNumbers.push(trimmed);
    }
  }

  return uniqueNumbers;
}

/**
 * Extract full structured data from a PDF document:
 * text, tables, key-value pairs, dates, and numbers.
 */
export async function extractFullData(
  doc: PDFDocumentProxy,
  onProgress?: (stage: string, progress: number) => void
): Promise<ExtractionResult> {
  const pageCount = doc.numPages;

  onProgress?.('Extracting text...', 0);
  const pageTexts = await extractAllText(doc, (currentPage, totalPages) => {
    const progress = totalPages > 0 ? (currentPage / totalPages) * 0.5 : 0;
    onProgress?.(`Extracting text from page ${currentPage} of ${totalPages}...`, progress);
  });

  const fullText = pageTexts.join('\n');

  onProgress?.('Detecting tables...', 0.6);
  const tables = detectTablesFromText(pageTexts);

  onProgress?.('Finding key fields...', 0.75);
  const keyValuePairs = extractKeyValuePairs(fullText);

  onProgress?.('Extracting dates & numbers...', 0.9);
  const detectedDates = extractDates(fullText);
  const detectedNumbers = extractNumbers(fullText);

  onProgress?.('Extraction complete', 1.0);

  return {
    tables,
    pageTexts,
    fullText,
    keyValuePairs,
    detectedDates,
    detectedNumbers,
    pageCount,
  };
}

/**
 * Backward compatibility alias for extractAllText
 */
export async function extractTextFromPdf(
  doc: PDFDocumentProxy,
  onProgress?: (page: number, total: number) => void
): Promise<string[]> {
  return extractAllText(doc, onProgress);
}
