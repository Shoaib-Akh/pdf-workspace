import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  bucketFileSize,
  bucketPageCount,
  track,
  analytics,
} from '@/services/analytics/analytics';

describe('services/analytics (Privacy-Safe Telemetry)', () => {
  describe('bucketFileSize', () => {
    it('buckets files smaller than 1MB', () => {
      assert.strictEqual(bucketFileSize(500 * 1024), '<1MB');
    });

    it('buckets files between 1MB and 10MB', () => {
      assert.strictEqual(bucketFileSize(2 * 1024 * 1024), '1-10MB');
      assert.strictEqual(bucketFileSize(10 * 1024 * 1024), '1-10MB');
    });

    it('buckets files between 10MB and 50MB', () => {
      assert.strictEqual(bucketFileSize(25 * 1024 * 1024), '10-50MB');
      assert.strictEqual(bucketFileSize(50 * 1024 * 1024), '10-50MB');
    });

    it('buckets files larger than 50MB', () => {
      assert.strictEqual(bucketFileSize(75 * 1024 * 1024), '50MB+');
    });
  });

  describe('bucketPageCount', () => {
    it('buckets single page documents', () => {
      assert.strictEqual(bucketPageCount(1), '1');
    });

    it('buckets 2-5 pages', () => {
      assert.strictEqual(bucketPageCount(3), '2-5');
      assert.strictEqual(bucketPageCount(5), '2-5');
    });

    it('buckets 6-20 pages', () => {
      assert.strictEqual(bucketPageCount(12), '6-20');
      assert.strictEqual(bucketPageCount(20), '6-20');
    });

    it('buckets 20+ pages', () => {
      assert.strictEqual(bucketPageCount(21), '20+');
      assert.strictEqual(bucketPageCount(100), '20+');
    });
  });

  describe('Privacy Guarantee - PII Stripping', () => {
    it('executes analytics events without throwing errors', () => {
      assert.doesNotThrow(() => {
        analytics.toolOpened('merge-pdf');
        analytics.fileSelected(1024 * 1024, 'application/pdf');
        analytics.conversionStarted('merge-pdf', 'pdf');
        analytics.conversionCompleted('merge-pdf', 450);
        analytics.conversionFailed('merge-pdf', 'damaged_file');
        analytics.ocrStarted(3);
        analytics.ocrCompleted(3, 1200);
        analytics.waitlistJoined('pdf-to-word');
      });
    });

    it('filters out sensitive properties like filename, email, and document text', () => {
      // Mock console.log to inspect logged properties in DEV mode
      const originalLog = console.log;
      let loggedProps: Record<string, unknown> | undefined;

      console.log = (_msg: unknown, props: unknown) => {
        loggedProps = props as Record<string, unknown>;
      };

      try {
        track('file_selected', {
          tool: 'pdf-to-text',
          filename: 'confidential_contract.pdf',
          email: 'user@example.com',
          user_name: 'John Doe',
          textContent: 'Secret bank account 12345',
          passwordHash: 'hash123',
          allowedProp: 42,
        } as any);

        assert.ok(loggedProps, 'Logged properties should exist');
        assert.strictEqual(loggedProps?.allowedProp, 42);
        assert.strictEqual(loggedProps?.tool, 'pdf-to-text');
        assert.strictEqual(loggedProps?.filename, undefined);
        assert.strictEqual(loggedProps?.email, undefined);
        assert.strictEqual(loggedProps?.user_name, undefined);
        assert.strictEqual(loggedProps?.textContent, undefined);
        assert.strictEqual(loggedProps?.passwordHash, undefined);
      } finally {
        console.log = originalLog;
      }
    });
  });
});
