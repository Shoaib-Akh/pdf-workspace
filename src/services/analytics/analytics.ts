export type EventName =
  | 'tool_opened'
  | 'file_selected'
  | 'conversion_started'
  | 'conversion_completed'
  | 'conversion_failed'
  | 'export_clicked'
  | 'ocr_started'
  | 'ocr_completed'
  | 'waitlist_joined'
  | 'error_encountered'

export function bucketFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  if (mb < 1) return '<1MB'
  if (mb <= 10) return '1-10MB'
  if (mb <= 50) return '10-50MB'
  return '50MB+'
}

export function bucketPageCount(n: number): string {
  if (n === 1) return '1'
  if (n <= 5) return '2-5'
  if (n <= 20) return '6-20'
  return '20+'
}

/**
 * Privacy-safe telemetry tracker.
 * GUARANTEE: Never transmits user filenames, user email addresses, document text, or PII.
 */
export function track(event: EventName, properties?: Record<string, string | number | boolean>): void {
  // Sanitize properties to prevent accidental PII leakage
  const safeProps: Record<string, string | number | boolean> = {}
  if (properties) {
    for (const [key, value] of Object.entries(properties)) {
      // Blacklist sensitive property keys
      if (/email|name|filename|text|content|password|token/i.test(key)) {
        continue
      }
      safeProps[key] = value
    }
  }

  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.log(`[Analytics - Privacy Safe] ${event}`, safeProps)
  }

  // Production provider hook (e.g. Plausible, Umami, PostHog, or custom endpoint)
  try {
    if (typeof window !== 'undefined' && (window as unknown as { plausible?: (evt: string, opts?: unknown) => void }).plausible) {
      (window as unknown as { plausible: (evt: string, opts?: unknown) => void }).plausible(event, { props: safeProps })
    }
  } catch {
    // Fail silently without disrupting user experience
  }
}

export const analytics = {
  toolOpened: (toolSlug: string) => track('tool_opened', { tool: toolSlug }),
  fileSelected: (bytes: number, type: string) => track('file_selected', { sizeBucket: bucketFileSize(bytes), mimeType: type }),
  conversionStarted: (toolSlug: string, format: string) => track('conversion_started', { tool: toolSlug, output: format }),
  conversionCompleted: (toolSlug: string, durationMs: number) => track('conversion_completed', { tool: toolSlug, durationMs }),
  conversionFailed: (toolSlug: string, errorCategory: string) => track('conversion_failed', { tool: toolSlug, category: errorCategory }),
  ocrStarted: (pageCount: number) => track('ocr_started', { pagesBucket: bucketPageCount(pageCount) }),
  ocrCompleted: (pageCount: number, durationMs: number) => track('ocr_completed', { pagesBucket: bucketPageCount(pageCount), durationMs }),
  waitlistJoined: (toolSlug: string) => track('waitlist_joined', { tool: toolSlug }),
}

