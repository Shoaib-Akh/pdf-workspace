import { describe, it } from 'node:test';
import assert from 'node:assert';
import { tableToCSV } from '@/services/extraction/csvExporter';
import type { ExtractedTable, ExtractionResult } from '@/services/extraction/textExtractor';

describe('services/extraction/csvExporter', () => {
  describe('tableToCSV', () => {
    it('formats a simple table into standard comma-separated lines', () => {
      const table: ExtractedTable = {
        id: 't-1',
        pageNumber: 1,
        headers: ['Name', 'Age', 'Role'],
        rows: [
          ['Alice', '30', 'Engineer'],
          ['Bob', '28', 'Designer'],
        ],
        confidence: 0.9,
      };

      const csv = tableToCSV(table);
      const lines = csv.split('\n');

      assert.strictEqual(lines.length, 3);
      assert.strictEqual(lines[0], 'Name,Age,Role');
      assert.strictEqual(lines[1], 'Alice,30,Engineer');
      assert.strictEqual(lines[2], 'Bob,28,Designer');
    });

    it('escapes cells containing commas according to RFC 4180', () => {
      const table: ExtractedTable = {
        id: 't-2',
        pageNumber: 1,
        headers: ['Item', 'Description'],
        rows: [
          ['A1', 'Red, blue, and green pencils'],
        ],
        confidence: 0.85,
      };

      const csv = tableToCSV(table);
      assert.ok(csv.includes('"Red, blue, and green pencils"'));
    });

    it('escapes cells containing double quotes by doubling them', () => {
      const table: ExtractedTable = {
        id: 't-3',
        pageNumber: 1,
        headers: ['Key', 'Quote'],
        rows: [
          ['Q1', 'He said "Hello World"'],
        ],
        confidence: 0.9,
      };

      const csv = tableToCSV(table);
      assert.ok(csv.includes('"He said ""Hello World"""'));
    });

    it('escapes cells containing embedded newlines', () => {
      const table: ExtractedTable = {
        id: 't-4',
        pageNumber: 1,
        headers: ['Title', 'MultiLineNotes'],
        rows: [
          ['Note 1', 'Line one\nLine two'],
        ],
        confidence: 0.9,
      };

      const csv = tableToCSV(table);
      assert.ok(csv.includes('"Line one\nLine two"'));
    });
  });

  describe('Workbook sheet sanitization logic', () => {
    it('verifies sheet names adhere to Excel 31-character limit and strips illegal chars', () => {
      const sanitizeSheetName = (name: string, fallback: string) => {
        const sanitized = name.replace(/[\\/?*[\]:]/g, '_').trim().slice(0, 31);
        return sanitized.length > 0 ? sanitized : fallback.slice(0, 31);
      };

      assert.strictEqual(sanitizeSheetName('Valid Sheet Name', 'Fallback'), 'Valid Sheet Name');
      assert.strictEqual(sanitizeSheetName('Sheet/With:Illegal*Chars?', 'Fallback'), 'Sheet_With_Illegal_Chars_');
      assert.strictEqual(
        sanitizeSheetName('Very Long Sheet Name That Exceeds The Thirty One Character Limit Definitely', 'Fallback'),
        'Very Long Sheet Name That Excee'
      );
      assert.strictEqual(sanitizeSheetName('???', 'DefaultFallback'), '___');
    });
  });
});
