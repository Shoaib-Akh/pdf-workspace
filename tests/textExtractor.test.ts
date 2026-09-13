import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  detectTablesFromText,
  extractKeyValuePairs,
  extractDates,
  extractNumbers,
} from '@/services/extraction/textExtractor';

describe('services/extraction/textExtractor', () => {
  describe('detectTablesFromText', () => {
    it('detects a clean multi-column table separated by spaces or tabs', () => {
      const pageText = `
Company Quarterly Report

Item Code    Description             Quantity    Unit Price    Total Amount
A-101        Structural Steel Beam   10          $150.00       $1,500.00
A-102        Concrete Mix 50kg       40          $12.50        $500.00
A-103        Reinforcing Rebar       25          $30.00        $750.00

Notes: Delivered on site.
`;
      const tables = detectTablesFromText([pageText]);
      assert.strictEqual(tables.length, 1);
      const table = tables[0];
      assert.strictEqual(table.pageNumber, 1);
      assert.deepStrictEqual(table.headers, ['Item Code', 'Description', 'Quantity', 'Unit Price', 'Total Amount']);
      assert.strictEqual(table.rows.length, 3);
      assert.strictEqual(table.rows[0][0], 'A-101');
      assert.strictEqual(table.rows[0][1], 'Structural Steel Beam');
      assert.ok(table.confidence >= 0.7 && table.confidence <= 1.0);
    });

    it('normalizes ragged rows so all rows have uniform column counts', () => {
      const pageText = `
Col1    Col2    Col3    Col4
R1C1    R1C2    R1C3    R1C4
R2C1    R2C2
`;
      const tables = detectTablesFromText([pageText]);
      assert.strictEqual(tables.length, 1);
      assert.strictEqual(tables[0].rows[1].length, 4);
      assert.strictEqual(tables[0].rows[1][2], '');
      assert.strictEqual(tables[0].rows[1][3], '');
    });

    it('handles multiple pages and generates distinct table IDs', () => {
      const page1 = `
Header1    Header2
Val1       Val2
`;
      const page2 = `
HeaderA    HeaderB    HeaderC
RowA1      RowB1      RowC1
`;
      const tables = detectTablesFromText([page1, page2]);
      assert.strictEqual(tables.length, 2);
      assert.strictEqual(tables[0].pageNumber, 1);
      assert.strictEqual(tables[1].pageNumber, 2);
      assert.notStrictEqual(tables[0].id, tables[1].id);
    });

    it('ignores single-column paragraphs and does not detect false tables', () => {
      const pageText = `
This is a standard text paragraph that has no table formatting.
Another single line of text without multi-column whitespace.
Just regular document notes.
`;
      const tables = detectTablesFromText([pageText]);
      assert.strictEqual(tables.length, 0);
    });
  });

  describe('extractKeyValuePairs', () => {
    it('extracts "Key: Value" formatted pairs', () => {
      const text = `
Invoice Number: INV-98421
Billing Date: 2024-08-15
Customer Name: Acme Corporation
Total Amount Due: $4,250.00
`;
      const pairs = extractKeyValuePairs(text);
      assert.ok(pairs.length >= 4);

      const findPair = (k: string) => pairs.find(p => p.key.toLowerCase() === k.toLowerCase());
      assert.strictEqual(findPair('Invoice Number')?.value, 'INV-98421');
      assert.strictEqual(findPair('Billing Date')?.value, '2024-08-15');
      assert.strictEqual(findPair('Customer Name')?.value, 'Acme Corporation');
      assert.strictEqual(findPair('Total Amount Due')?.value, '$4,250.00');
    });

    it('extracts tabular "Key   Value" separated by multiple spaces', () => {
      const text = `
Vendor        Acme Supplies Ltd
PO Reference  PO-40912
Terms         Net 30
`;
      const pairs = extractKeyValuePairs(text);
      const findPair = (k: string) => pairs.find(p => p.key.toLowerCase() === k.toLowerCase());
      assert.strictEqual(findPair('Vendor')?.value, 'Acme Supplies Ltd');
      assert.strictEqual(findPair('PO Reference')?.value, 'PO-40912');
      assert.strictEqual(findPair('Terms')?.value, 'Net 30');
    });

    it('filters out web URL schemes and purely numeric keys', () => {
      const text = `
https://example.com/api/v1
12345: Invalid numeric key
Valid Label: Good value
`;
      const pairs = extractKeyValuePairs(text);
      assert.strictEqual(pairs.length, 1);
      assert.strictEqual(pairs[0].key, 'Valid Label');
    });

    it('deduplicates keys case-insensitively keeping the first instance', () => {
      const text = `
Status: Pending
status: Approved
`;
      const pairs = extractKeyValuePairs(text);
      assert.strictEqual(pairs.length, 1);
      assert.strictEqual(pairs[0].value, 'Pending');
    });
  });

  describe('extractDates', () => {
    it('extracts ISO dates', () => {
      const text = 'Created on 2024-01-15 and finalized on 2024/02/20.';
      const dates = extractDates(text);
      assert.ok(dates.includes('2024-01-15'));
      assert.ok(dates.includes('2024/02/20'));
    });

    it('extracts slash and dash numeric dates', () => {
      const text = 'Transaction dates: 15/06/2023, 08-12-2022, 01.05.2024';
      const dates = extractDates(text);
      assert.ok(dates.includes('15/06/2023'));
      assert.ok(dates.includes('08-12-2022'));
      assert.ok(dates.includes('01.05.2024'));
    });

    it('extracts textual month dates with or without ordinal suffixes', () => {
      const text = 'Effective January 15, 2024 and expired on 3rd March 2024.';
      const dates = extractDates(text);
      assert.ok(dates.some(d => d.includes('January 15, 2024')));
      assert.ok(dates.some(d => d.includes('3rd March 2024')));
    });

    it('deduplicates recurring dates', () => {
      const text = 'Due: 2024-04-30. Reminder for 2024-04-30 sent.';
      const dates = extractDates(text);
      assert.strictEqual(dates.filter(d => d === '2024-04-30').length, 1);
    });
  });

  describe('extractNumbers', () => {
    it('extracts currency amounts with symbols ($, €, £, ₹)', () => {
      const text = 'Totals: $1,450.00, € 120.50, £99.00, and ₹50,000.';
      const numbers = extractNumbers(text);
      assert.ok(numbers.some(n => n.includes('$1,450.00')));
      assert.ok(numbers.some(n => n.includes('€ 120.50') || n.includes('120.50')));
      assert.ok(numbers.some(n => n.includes('£99.00')));
      assert.ok(numbers.some(n => n.includes('₹50,000')));
    });

    it('extracts currency amounts with ISO code prefixes or suffixes', () => {
      const text = 'Payments: USD 500.00 and 1,250.00 EUR.';
      const numbers = extractNumbers(text);
      assert.ok(numbers.some(n => n.includes('USD 500.00') || n.includes('500.00')));
      assert.ok(numbers.some(n => n.includes('1,250.00 EUR') || n.includes('1,250.00')));
    });

    it('extracts formatted numbers with thousand separators', () => {
      const text = 'Population count was 1,234,567 units in total.';
      const numbers = extractNumbers(text);
      assert.ok(numbers.includes('1,234,567'));
    });
  });
});
