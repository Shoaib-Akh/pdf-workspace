import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  cn,
  formatFileSize,
  formatPageCount,
  getFileExtension,
  sanitizeFilename,
  sleep,
} from '@/lib/utils';

describe('lib/utils', () => {
  describe('cn (classNames helper)', () => {
    it('combines basic class names', () => {
      assert.strictEqual(cn('px-2', 'py-1'), 'px-2 py-1');
    });

    it('handles conditional and falsy classes correctly', () => {
      assert.strictEqual(cn('base', false && 'hidden', null, undefined, 'visible'), 'base visible');
    });

    it('resolves conflicting Tailwind utility classes using twMerge', () => {
      assert.strictEqual(cn('p-4', 'p-2'), 'p-2');
      assert.strictEqual(cn('text-red-500', 'text-blue-500'), 'text-blue-500');
    });
  });

  describe('formatFileSize', () => {
    it('returns "0 Bytes" when given 0', () => {
      assert.strictEqual(formatFileSize(0), '0 Bytes');
    });

    it('formats bytes correctly', () => {
      assert.strictEqual(formatFileSize(500), '500 Bytes');
    });

    it('formats kilobytes correctly', () => {
      assert.strictEqual(formatFileSize(1024), '1 KB');
      assert.strictEqual(formatFileSize(1536), '1.5 KB');
    });

    it('formats megabytes correctly', () => {
      assert.strictEqual(formatFileSize(1024 * 1024), '1 MB');
      assert.strictEqual(formatFileSize(5.25 * 1024 * 1024), '5.25 MB');
    });

    it('formats gigabytes correctly', () => {
      assert.strictEqual(formatFileSize(1024 * 1024 * 1024), '1 GB');
    });
  });

  describe('formatPageCount', () => {
    it('formats singular page count as "1 page"', () => {
      assert.strictEqual(formatPageCount(1), '1 page');
    });

    it('formats plural page counts with "pages"', () => {
      assert.strictEqual(formatPageCount(0), '0 pages');
      assert.strictEqual(formatPageCount(2), '2 pages');
      assert.strictEqual(formatPageCount(42), '42 pages');
    });
  });

  describe('getFileExtension', () => {
    it('extracts single file extension', () => {
      assert.strictEqual(getFileExtension('document.pdf'), 'pdf');
      assert.strictEqual(getFileExtension('data.xlsx'), 'xlsx');
    });

    it('extracts final extension for multi-dot files', () => {
      assert.strictEqual(getFileExtension('archive.tar.gz'), 'gz');
      assert.strictEqual(getFileExtension('report.2024.final.pdf'), 'pdf');
    });

    it('returns empty string when there is no extension', () => {
      assert.strictEqual(getFileExtension('filename'), '');
      assert.strictEqual(getFileExtension('.gitignore'), '');
    });
  });

  describe('sanitizeFilename', () => {
    it('replaces spaces and special characters with underscores', () => {
      assert.strictEqual(sanitizeFilename('my file (2).pdf'), 'my_file__2_.pdf');
      assert.strictEqual(sanitizeFilename('invoice #123 & tax.pdf'), 'invoice__123___tax.pdf');
    });

    it('preserves alphanumeric characters, dashes, and dots', () => {
      assert.strictEqual(sanitizeFilename('valid-file_name.123.pdf'), 'valid-file_name.123.pdf');
    });
  });

  describe('sleep', () => {
    it('resolves after specified milliseconds', async () => {
      const start = Date.now();
      await sleep(20);
      const elapsed = Date.now() - start;
      assert.ok(elapsed >= 15);
    });
  });
});
