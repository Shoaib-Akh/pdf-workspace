// ═══════════════════════════════════════════════════════════════════════════
//  PDF Guru — Cloudflare Worker  (Single source of truth for all deployments)
//  Handles: API routes, SEO meta injection, security headers, rate limiting,
//           www→apex redirect, static asset serving
// ═══════════════════════════════════════════════════════════════════════════

export interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  exec: (query: string) => Promise<{ count: number; duration: number }>;
}
export interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = unknown>(colName?: string) => Promise<T | null>;
  run: () => Promise<{ success: boolean }>;
  all: <T = unknown>() => Promise<{ results: T[]; success: boolean }>;
}
export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  DB?: D1Database;
  ADMIN_SECRET?: string;
  TURNSTILE_SECRET_KEY?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const SITE = 'https://pdfguru.site';
const SITE_NAME = 'PDF Guru';
const DEFAULT_TITLE = 'PDF Guru — Your Expert PDF Toolkit';
const DEFAULT_DESC = 'Convert, extract, and transform PDF documents into usable data. Free, private, browser-based PDF tools — no uploads, no accounts needed.';
const DEFAULT_OG = `${SITE}/og/home.jpg`;
const ALLOWED_ORIGIN = SITE;

// ─── Per-route SEO meta map ───────────────────────────────────────────────────
// Format: path → { title, description, canonical? (defaults to SITE+path) }
const SEO_ROUTES: Record<string, { title: string; description: string }> = {
  '/': {
    title: `${SITE_NAME} — Your Expert PDF Toolkit`,
    description: 'Free, fast, and 100% private online PDF tools. Convert, merge, split, compress, and extract data from PDFs directly in your browser — no uploads required.',
  },
  '/tools': {
    title: `All PDF Tools — ${SITE_NAME}`,
    description: 'Browse 60+ free PDF tools: convert, compress, merge, split, OCR, extract tables, and more. All browser-based — no file uploads to servers.',
  },
  '/convert': {
    title: `PDF Converter Tools — ${SITE_NAME}`,
    description: 'Convert PDF to Word, Excel, JPG, PNG, Text, CSV, JSON, HTML, and more. Free online converters that work 100% in your browser.',
  },
  '/extract': {
    title: `PDF Data Extraction Tools — ${SITE_NAME}`,
    description: 'Extract tables, text, and structured data from PDF documents instantly. Browser-based — no server uploads.',
  },
  '/organize': {
    title: `PDF Organizer Tools — ${SITE_NAME}`,
    description: 'Merge, split, compress, rotate, reorder, watermark, and edit PDFs. Free browser-based tools with no file size limits.',
  },
  '/business': {
    title: `Business PDF Tools — ${SITE_NAME}`,
    description: 'Extract data from invoices, BOQs, quotations, bank statements, and business PDFs into Excel. Purpose-built for business document workflows.',
  },
  '/ocr': {
    title: `PDF OCR Tools — ${SITE_NAME}`,
    description: 'Convert scanned PDFs and images to searchable text, Word, and Excel using browser-based OCR. No upload required.',
  },
  '/construction': {
    title: `Construction PDF Tools — ${SITE_NAME}`,
    description: 'Extract Bill of Quantities, tender data, and cost estimates from construction PDFs directly into Excel. Free and private.',
  },
  '/images': {
    title: `Image to PDF Tools — ${SITE_NAME}`,
    description: 'Convert JPG, PNG, WebP, GIF, and BMP images to PDF or extract PDF pages as high-resolution images. Free and instant.',
  },
  '/security': {
    title: `PDF Security Tools — ${SITE_NAME}`,
    description: 'Password protect, unlock, and manage PDF permissions. Secure your documents entirely in your browser.',
  },

  // ── Core Converters ──
  '/pdf-to-word': {
    title: 'Convert PDF to Word (.docx) Free — PDF Guru',
    description: 'Convert PDF to editable Word documents online for free. Browser-based, private, no file uploads. Download a real .docx file in seconds.',
  },
  '/pdf-to-excel': {
    title: 'Convert PDF to Excel Free Online — PDF Guru',
    description: 'Extract tables and data from PDF to Excel (.xlsx) instantly. Works in your browser — 100% private, no server uploads.',
  },
  '/pdf-to-jpg': {
    title: 'Convert PDF to JPG Free — High Quality — PDF Guru',
    description: 'Convert every PDF page to high-quality JPG images in your browser. Choose 72, 150, or 300 DPI. Download individually or as a ZIP.',
  },
  '/pdf-to-png': {
    title: 'Convert PDF to PNG Free — PDF Guru',
    description: 'Export PDF pages as lossless PNG images with transparency support. 100% in-browser, no uploads.',
  },
  '/pdf-to-webp': {
    title: 'Convert PDF to WebP — PDF Guru',
    description: 'Convert PDF pages to WebP format for smaller file sizes and modern browser compatibility. Free, browser-based tool.',
  },
  '/pdf-to-txt': {
    title: 'Extract Text from PDF Free — PDF Guru',
    description: 'Extract all text from PDF documents instantly in your browser. Download as .txt — no uploads, no registration.',
  },
  '/pdf-to-csv': {
    title: 'Convert PDF to CSV — PDF Guru',
    description: 'Extract tabular data from PDF to CSV format. Free, browser-based, no file uploads.',
  },
  '/pdf-to-json': {
    title: 'Convert PDF to JSON — PDF Guru',
    description: 'Parse PDF content into structured JSON format for developers and data pipelines. Free browser-based tool.',
  },
  '/pdf-to-html': {
    title: 'Convert PDF to HTML — PDF Guru',
    description: 'Convert PDF documents to HTML format. Extract text and structure for web publishing. Free, in-browser.',
  },
  '/pdf-to-markdown': {
    title: 'Convert PDF to Markdown — PDF Guru',
    description: 'Extract PDF content as clean Markdown (.md) for documentation and publishing. Free, browser-based.',
  },
  '/pdf-to-data': {
    title: 'Extract Tables from PDF to Excel/CSV — PDF Guru',
    description: 'Detect and extract all tables from PDF documents into Excel or CSV instantly. Free, private browser tool.',
  },
  '/pdf-to-powerpoint': {
    title: 'Convert PDF to PowerPoint — PDF Guru',
    description: 'Convert PDF to PowerPoint (.pptx) presentation format. Free browser-based conversion.',
  },

  // ── Reverse Converters ──
  '/word-to-pdf': {
    title: 'Convert Word to PDF Free — PDF Guru',
    description: 'Convert Word (.docx) documents to PDF format instantly in your browser. Free, private, no uploads.',
  },
  '/excel-to-pdf': {
    title: 'Convert Excel to PDF Free — PDF Guru',
    description: 'Convert Excel (.xlsx) spreadsheets to PDF format. Free, browser-based, no file size limits.',
  },
  '/powerpoint-to-pdf': {
    title: 'Convert PowerPoint to PDF Free — PDF Guru',
    description: 'Convert PowerPoint presentations (.pptx) to PDF instantly. Free, browser-based tool.',
  },
  '/jpg-to-pdf': {
    title: 'Convert JPG to PDF Free — PDF Guru',
    description: 'Combine JPG images into a PDF document instantly. Free, browser-based, no uploads.',
  },
  '/png-to-pdf': {
    title: 'Convert PNG to PDF Free — PDF Guru',
    description: 'Convert PNG images to PDF format. Merge multiple PNGs into one PDF. Free and instant.',
  },
  '/images-to-pdf': {
    title: 'Convert Images to PDF Free — PDF Guru',
    description: 'Combine multiple images (JPG, PNG, WebP, GIF, BMP) into a single PDF. Free, browser-based.',
  },
  '/gif-to-pdf': {
    title: 'Convert GIF to PDF — PDF Guru',
    description: 'Convert GIF images to PDF format for free, instantly in your browser.',
  },
  '/bmp-to-pdf': {
    title: 'Convert BMP to PDF — PDF Guru',
    description: 'Convert BMP images to PDF format for free, instantly in your browser.',
  },

  // ── Organize Tools ──
  '/merge-pdf': {
    title: 'Merge PDF Files Free Online — PDF Guru',
    description: 'Combine multiple PDF files into one document instantly. 100% private browser tool — no file uploads to servers.',
  },
  '/split-pdf': {
    title: 'Split PDF Free Online — PDF Guru',
    description: 'Split a PDF into individual pages or page ranges. Free, instant, browser-based — no uploads.',
  },
  '/compress-pdf': {
    title: 'Compress PDF Free Online — PDF Guru',
    description: 'Reduce PDF file size while maintaining quality. Free browser-based PDF compressor — no uploads.',
  },
  '/edit-pdf': {
    title: 'Edit PDF Online Free — PDF Guru',
    description: 'Add text, annotations, and signatures to PDF documents. Free browser-based PDF editor.',
  },
  '/rotate-pdf': {
    title: 'Rotate PDF Pages Free — PDF Guru',
    description: 'Rotate PDF pages 90, 180, or 270 degrees. Free, instant, browser-based.',
  },
  '/delete-pdf-pages': {
    title: 'Delete Pages from PDF Free — PDF Guru',
    description: 'Remove specific pages from a PDF document instantly in your browser. Free and private.',
  },
  '/extract-pdf-pages': {
    title: 'Extract PDF Pages Free — PDF Guru',
    description: 'Extract specific pages from a PDF into a new document. Free, browser-based.',
  },
  '/reorder-pdf-pages': {
    title: 'Reorder PDF Pages Free — PDF Guru',
    description: 'Drag and drop to reorder PDF pages. Free, instant, browser-based — no uploads.',
  },
  '/watermark-pdf': {
    title: 'Add Watermark to PDF Free — PDF Guru',
    description: 'Add text or image watermarks to PDF pages. Free, browser-based tool.',
  },
  '/add-page-numbers': {
    title: 'Add Page Numbers to PDF Free — PDF Guru',
    description: 'Automatically add page numbers to your PDF document. Free, browser-based.',
  },
  '/password-protect-pdf': {
    title: 'Password Protect PDF Free — PDF Guru',
    description: 'Add password protection to PDF files. Encrypt your documents for free, entirely in your browser.',
  },
  '/unlock-pdf': {
    title: 'Unlock PDF — Remove Password Free — PDF Guru',
    description: 'Remove password protection from PDF files. Free, browser-based PDF unlocker.',
  },

  // ── OCR Tools ──
  '/ocr-pdf': {
    title: 'OCR PDF — Make Scanned PDF Searchable Free — PDF Guru',
    description: 'Use OCR to extract text from scanned PDFs and images. Free, browser-based Tesseract OCR — no uploads.',
  },
  '/scanned-pdf-to-text': {
    title: 'Convert Scanned PDF to Text Free — PDF Guru',
    description: 'Extract text from scanned PDFs using OCR. Convert image-only PDFs to searchable text. Free, browser-based.',
  },
  '/scanned-pdf-to-word': {
    title: 'Convert Scanned PDF to Word Free — PDF Guru',
    description: 'OCR your scanned PDF and convert it to an editable Word document. Free, browser-based tool.',
  },
  '/scanned-pdf-to-excel': {
    title: 'Convert Scanned PDF to Excel Free — PDF Guru',
    description: 'Extract data from scanned PDFs into Excel using OCR. Free, browser-based tool.',
  },

  // ── Business Tools ──
  '/business-pdf-tools': {
    title: 'Business PDF Data Extraction Tools — PDF Guru',
    description: 'Extract structured data from business PDFs: invoices, BOQs, quotations, bank statements, and more. Free tools for finance and procurement.',
  },
  '/boq-pdf-to-excel': {
    title: 'Convert BOQ PDF to Excel Free — PDF Guru',
    description: 'Extract Bill of Quantities from PDF into Excel format. Free browser-based BOQ extractor for construction projects.',
  },
  '/invoice-to-excel': {
    title: 'Extract Invoice Data from PDF to Excel — PDF Guru',
    description: 'Extract line items, totals, and tax data from PDF invoices into Excel. Free, browser-based invoice extractor.',
  },
  '/quotation-to-excel': {
    title: 'Convert Quotation PDF to Excel — PDF Guru',
    description: 'Extract data from PDF quotations and convert to Excel format. Free, browser-based tool.',
  },
  '/receipt-to-excel': {
    title: 'Convert Receipt PDF to Excel — PDF Guru',
    description: 'Extract receipt data from PDF to Excel for expense tracking. Free, browser-based.',
  },
  '/bank-statement-to-excel': {
    title: 'Convert Bank Statement PDF to Excel Free — PDF Guru',
    description: 'Extract transactions from PDF bank statements into Excel. Free, private, browser-based bank statement converter.',
  },
  '/tender-pdf-to-excel': {
    title: 'Convert Tender PDF to Excel — PDF Guru',
    description: 'Extract tender document data and line items into Excel format. Free, browser-based tool.',
  },
  '/purchase-order-to-excel': {
    title: 'Convert Purchase Order PDF to Excel — PDF Guru',
    description: 'Extract purchase order data from PDFs to Excel. Free, browser-based procurement tool.',
  },
  '/expense-report-to-excel': {
    title: 'Convert Expense Report PDF to Excel — PDF Guru',
    description: 'Extract expense report data from PDFs into Excel format. Free, browser-based.',
  },
  '/price-list-pdf-to-excel': {
    title: 'Convert Price List PDF to Excel — PDF Guru',
    description: 'Extract product prices and descriptions from PDF price lists to Excel. Free, browser-based.',
  },

  // ── Construction Tools ──
  '/construction-pdf-to-excel': {
    title: 'Construction PDF to Excel — Extract BOQ & Costs — PDF Guru',
    description: 'Extract construction data, BOQ items, and cost schedules from PDFs to Excel. Free browser-based construction tool.',
  },
  '/quantity-survey-pdf-to-excel': {
    title: 'Quantity Survey PDF to Excel — PDF Guru',
    description: 'Convert quantity survey PDF documents to Excel spreadsheets. Free, browser-based QS tool.',
  },
  '/estimate-pdf-to-excel': {
    title: 'Construction Estimate PDF to Excel — PDF Guru',
    description: 'Extract cost estimates and line items from construction PDFs to Excel. Free, browser-based.',
  },
  '/bill-of-quantities-to-excel': {
    title: 'Bill of Quantities PDF to Excel — PDF Guru',
    description: 'Extract Bill of Quantities items, rates, and totals from PDF to Excel. Free BOQ conversion tool.',
  },
  '/boq-extractor': {
    title: 'BOQ Extractor — Extract Bill of Quantities from PDF — PDF Guru',
    description: 'Advanced BOQ extractor for construction PDFs. Pull out items, quantities, and rates into structured Excel data.',
  },

  // ── Learn Hub ──
  '/learn': {
    title: 'PDF Guides & Tutorials — PDF Guru Learn Hub',
    description: 'Expert guides on PDF conversion, data extraction, OCR, and business document workflows. Free tutorials from the PDF Guru team.',
  },
  '/learn/how-to-convert-pdf-to-excel': {
    title: 'How to Convert PDF to Excel — Complete Guide — PDF Guru',
    description: 'Step-by-step guide to converting PDF files to Excel. Learn which method works best for text PDFs, scanned documents, and tables.',
  },
  '/learn/how-to-extract-tables-from-pdf': {
    title: 'How to Extract Tables from PDF — PDF Guru Guide',
    description: 'Learn how to detect and extract tables from PDF documents into Excel and CSV. Complete guide with free browser tools.',
  },
  '/learn/how-to-convert-boq-pdf-to-excel': {
    title: 'How to Convert BOQ PDF to Excel — PDF Guru Guide',
    description: 'Step-by-step guide to extracting Bill of Quantities from construction PDFs into Excel. Learn the best methods for BOQ conversion.',
  },
  '/learn/pdf-vs-scanned-pdf': {
    title: 'PDF vs Scanned PDF: What\'s the Difference? — PDF Guru',
    description: 'Understand the difference between text PDFs and scanned image PDFs. Learn how OCR works and when you need it.',
  },
  '/learn/how-ocr-works': {
    title: 'How OCR Works — PDF Text Recognition Explained — PDF Guru',
    description: 'Learn how Optical Character Recognition converts scanned images to text. Understand Tesseract, accuracy factors, and best practices.',
  },
  '/learn/how-to-extract-invoice-data': {
    title: 'How to Extract Invoice Data from PDF — PDF Guru Guide',
    description: 'Learn how to automatically extract invoice line items, totals, and tax data from PDF files to Excel.',
  },
  '/learn/how-to-convert-bank-statement': {
    title: 'How to Convert Bank Statement PDF to Excel — PDF Guru',
    description: 'Step-by-step guide to extracting transactions from PDF bank statements into Excel for analysis.',
  },

  // ── Legal & other ──
  '/support': {
    title: 'Support PDF Guru — Keep Our Tools Free & Private',
    description: 'Learn how voluntary donations help support PDF Guru. 100% free, private browser PDF tools funded transparently by community support.',
  },
  '/contact': {
    title: 'Contact & Support — PDF Guru',
    description: 'Get in touch with the PDF Guru team. Report issues, request tools, or give feedback.',
  },
  '/blog': {
    title: 'Blog — PDF Tips, Guides & Updates — PDF Guru',
    description: 'Read expert guides on PDF conversion, data extraction, OCR, and document workflows. Tips and tutorials from the PDF Guru team.',
  },
  '/privacy': {
    title: 'Privacy Policy — PDF Guru',
    description: 'PDF Guru privacy policy. We process your files locally — your documents never leave your browser.',
  },
  '/terms': {
    title: 'Terms of Service — PDF Guru',
    description: 'PDF Guru terms of service. Understand our usage policies and limitations.',
  },
};

// Alias routes point to their canonical equivalent
const CANONICAL_ALIASES: Record<string, string> = {
  '/pdf-to-doc': '/pdf-to-word',
  '/pdf-to-docx': '/pdf-to-word',
  '/pdf-to-text': '/pdf-to-txt',
  '/pdf-to-image': '/pdf-to-jpg',
  '/pdf-ocr': '/ocr-pdf',
  '/doc-to-pdf': '/word-to-pdf',
  '/docx-to-pdf': '/word-to-pdf',
  '/xlsx-to-pdf': '/excel-to-pdf',
  '/xls-to-pdf': '/excel-to-pdf',
  '/ppt-to-pdf': '/powerpoint-to-pdf',
  '/pptx-to-pdf': '/powerpoint-to-pdf',
  '/pdf-editor': '/edit-pdf',
  '/privacy-policy': '/privacy',
  '/terms-of-service': '/terms',
  '/boq-to-excel': '/boq-pdf-to-excel',
  '/learn/how-to-extract-invoice-data-from-pdf': '/learn/how-to-extract-invoice-data',
  '/learn/how-to-convert-bank-statement-pdf-to-excel': '/learn/how-to-convert-bank-statement',
};

// Routes that must NOT be indexed
const NOINDEX_ROUTES = new Set(['/workspace', '/admin', '/signin', '/signup']);

// ─── Security Headers ─────────────────────────────────────────────────────────
function addSecurityHeaders(headers: Headers, isHtml = false): Headers {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  if (isHtml) {
    headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://www.google-analytics.com",
        "worker-src 'self' blob:",
        "frame-ancestors 'none'",
      ].join('; ')
    );
  }
  return headers;
}

// ─── Rate Limiting (in-memory per worker instance) ───────────────────────────
// Resets when the worker restarts. Good enough for API abuse protection.
// For persistent rate limiting across workers, add Cloudflare KV.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, limitPerMinute = 30): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= limitPerMinute) return true;
  entry.count++;
  return false;
}

// ─── HMAC session tokens ──────────────────────────────────────────────────────
async function generateSessionToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const payload = `session:${Date.now()}`;
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${payload}.${b64}`;
}

async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  try {
    const [payloadPart, sigPart] = token.split('.');
    if (!payloadPart?.startsWith('session:') || !sigPart) return false;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const sigBytes = Uint8Array.from(atob(sigPart), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payloadPart));
    if (!valid) return false;
    const ts = parseInt(payloadPart.split(':')[1], 10);
    return Date.now() - ts < 8 * 60 * 60 * 1000; // 8h expiry
  } catch { return false; }
}

// ─── CORS helpers ─────────────────────────────────────────────────────────────
function corsHeaders(isPublic = false): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': isPublic ? '*' : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}

// ─── Tracking ID generator ────────────────────────────────────────────────────
function generateTrackingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'TK-';
  for (let i = 0; i < 6; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

// ─── Cloudflare Turnstile Verification ─────────────────────────────────────────
async function verifyTurnstileToken(
  token?: string,
  secretKey?: string,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  // If no secret key is set in environment (e.g. local dev without secret), skip check
  if (!secretKey) return { success: true };
  if (!token) {
    return { success: false, error: 'Security verification (Turnstile) is required.' };
  }

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });
    const outcome = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
    if (!outcome.success) {
      const codeStr = outcome['error-codes']?.join(', ') || 'failed';
      return { success: false, error: `CAPTCHA verification failed (${codeStr}). Please try again.` };
    }
    return { success: true };
  } catch (err) {
    console.error('Turnstile verification error:', err);
    return { success: false, error: 'Security verification failed to connect. Please try again.' };
  }
}

// ─── SEO Meta Injection ───────────────────────────────────────────────────────
// Injects per-route <title>, <meta>, <canonical>, OG, noindex into the HTML shell.
// Gives crawlers correct metadata without full SSR.
function injectSeoMeta(html: string, path: string): string {
  const canonical = SITE + path;
  const isNoindex = [...NOINDEX_ROUTES].some((p) => path.startsWith(p));

  // Resolve canonical alias
  const canonicalPath = CANONICAL_ALIASES[path] ?? path;
  const canonicalUrl = SITE + canonicalPath;

  // Get route metadata (or fall back to default)
  const seo = SEO_ROUTES[path] ?? SEO_ROUTES[canonicalPath] ?? { title: DEFAULT_TITLE, description: DEFAULT_DESC };

  const robotsContent = isNoindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const metaBlock = `
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description.replace(/"/g, '&quot;')}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="${robotsContent}">
    <meta property="og:title" content="${seo.title.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${seo.description.replace(/"/g, '&quot;')}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${DEFAULT_OG}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seo.title.replace(/"/g, '&quot;')}">
    <meta name="twitter:description" content="${seo.description.replace(/"/g, '&quot;')}">
    <meta name="twitter:image" content="${DEFAULT_OG}">`.trimStart();

  // Replace the generic <title> and inject our full meta block before </head>
  return html
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/i, '')
    .replace(/<meta name="robots"[^>]*>/i, '')
    .replace(/<link rel="canonical"[^>]*>/i, '')
    .replace('</head>', `${metaBlock}\n  </head>`);
}

// ─── Main Worker ──────────────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname, hostname } = url;

    // ── 1. www → apex 301 redirect ────────────────────────────────────────────
    if (hostname === 'www.pdfguru.site') {
      return Response.redirect(`${SITE}${pathname}${url.search}`, 301);
    }

    // ── 2. Static assets: serve directly without meta injection ───────────────
    // Anything with a file extension (js, css, png, svg, woff2, etc.) or _assets
    const isStaticAsset = /\.[a-zA-Z0-9]{1,6}$/.test(pathname);
    if (isStaticAsset) {
      try {
        const resp = await env.ASSETS.fetch(request);
        const headers = new Headers(resp.headers);
        addSecurityHeaders(headers, false);
        // Long cache for hashed assets, short for others
        if (/\.(js|css)$/.test(pathname)) {
          headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (/\.(png|jpg|svg|webp|ico|woff2?)$/.test(pathname)) {
          headers.set('Cache-Control', 'public, max-age=86400');
        }
        return new Response(resp.body, { status: resp.status, headers });
      } catch {
        return new Response('Not found', { status: 404 });
      }
    }

    // ── 3. API Routes ─────────────────────────────────────────────────────────
    if (pathname.startsWith('/api/')) {
      const ip = request.headers.get('CF-Connecting-IP') ?? request.headers.get('X-Forwarded-For') ?? 'unknown';
      const isPublicRoute = pathname === '/api/health' || pathname === '/api/blogs' || pathname.startsWith('/api/blogs/') || pathname.startsWith('/api/status/');

      // Rate limit API routes (60/min public, 30/min admin & write)
      const limit = isPublicRoute ? 60 : 30;
      if (isRateLimited(`${ip}:${pathname.startsWith('/api/admin') ? 'admin' : 'pub'}`, limit)) {
        return new Response(JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        });
      }

      const headers = corsHeaders(isPublicRoute);

      if (request.method === 'OPTIONS') return new Response(null, { headers });

      // ── Admin auth guard ──
      const checkAdminAuth = async () => {
        if (!env.ADMIN_SECRET) return false;
        const auth = request.headers.get('Authorization');
        if (!auth?.startsWith('Bearer ')) return false;
        return verifySessionToken(auth.slice(7), env.ADMIN_SECRET);
      };

      // Health check
      if (pathname === '/api/health') {
        return new Response(JSON.stringify({ status: 'ok', db: !!env.DB }), { headers });
      }

      // Waitlist
      if (pathname === '/api/waitlist' && request.method === 'POST') {
        try {
          const body = await request.json() as { email?: string; toolName?: string };
          if (!body.email) return new Response(JSON.stringify({ error: 'Email required' }), { status: 400, headers });
          if (env.DB) await env.DB.prepare('INSERT INTO waitlist (email, tool_name) VALUES (?, ?)').bind(body.email, body.toolName || 'general').run();
          return new Response(JSON.stringify({ success: true }), { headers });
        } catch { return new Response(JSON.stringify({ error: 'Failed to save' }), { status: 500, headers }); }
      }

      // Contact form
      if (pathname === '/api/contact' && request.method === 'POST') {
        try {
          const body = await request.json() as {
            name: string;
            email: string;
            message: string;
            turnstileToken?: string;
            'cf-turnstile-response'?: string;
          };
          if (!body.email || !body.message) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers });

          // Turnstile bot protection check
          const token = body.turnstileToken || body['cf-turnstile-response'];
          const clientIp = request.headers.get('CF-Connecting-IP') || undefined;
          const secretKey = env.TURNSTILE_SECRET_KEY || '0x4AAAAAAFF6Ds-PvDCEfzNCGHySGpUINJQ';
          const verification = await verifyTurnstileToken(token, secretKey, clientIp);
          if (!verification.success) {
            return new Response(JSON.stringify({ error: verification.error || 'CAPTCHA verification failed' }), { status: 403, headers });
          }

          const trackingId = generateTrackingId();
          if (env.DB) await env.DB.prepare('INSERT INTO contact_messages (name, email, message, tracking_id) VALUES (?, ?, ?, ?)').bind(body.name || '', body.email, body.message, trackingId).run();
          return new Response(JSON.stringify({ success: true, trackingId }), { headers });
        } catch { return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500, headers }); }
      }

      // Ticket status — only returns status + reply (no personal data)
      if (pathname.startsWith('/api/status/') && request.method === 'GET') {
        const trackingId = pathname.split('/').pop();
        if (!env.DB || !trackingId) return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers });
        const result = await env.DB.prepare('SELECT status, admin_reply FROM contact_messages WHERE tracking_id = ?').bind(trackingId).first<{ status: string; admin_reply: string | null }>();
        if (!result) return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404, headers });
        return new Response(JSON.stringify({ status: result.status, reply: result.admin_reply ?? null }), { headers });
      }

      // Admin login
      if (pathname === '/api/admin/login' && request.method === 'POST') {
        if (!env.ADMIN_SECRET) return new Response(JSON.stringify({ error: 'Admin not configured on this deployment.' }), { status: 503, headers });
        const body = await request.json() as { password?: string };
        if (body.password === env.ADMIN_SECRET) {
          const token = await generateSessionToken(env.ADMIN_SECRET);
          return new Response(JSON.stringify({ success: true, token }), { headers });
        }
        return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401, headers });
      }

      // Admin protected routes
      if (pathname.startsWith('/api/admin/')) {
        if (!(await checkAdminAuth())) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

        if (pathname === '/api/admin/stats' && request.method === 'GET') {
          if (!env.DB) return new Response(JSON.stringify({}), { headers });
          const messages = ((await env.DB.prepare('SELECT count(*) as count FROM contact_messages').first()) as any)?.count || 0;
          const waitlist = ((await env.DB.prepare('SELECT count(*) as count FROM waitlist').first()) as any)?.count || 0;
          const blogs = ((await env.DB.prepare('SELECT count(*) as count FROM blogs').first()) as any)?.count || 0;
          return new Response(JSON.stringify({ stats: { messages, waitlist, blogs } }), { headers });
        }
        if (pathname === '/api/admin/messages' && request.method === 'GET' && env.DB) {
          const { results } = await env.DB.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
          return new Response(JSON.stringify({ messages: results }), { headers });
        }
        if (pathname.match(/^\/api\/admin\/messages\/\d+\/reply$/) && request.method === 'POST') {
          const id = pathname.split('/')[4];
          const body = await request.json() as { reply: string };
          if (env.DB && body.reply) {
            await env.DB.prepare('UPDATE contact_messages SET admin_reply = ?, status = ? WHERE id = ?').bind(body.reply, 'replied', id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
        if (pathname === '/api/admin/waitlist' && request.method === 'GET' && env.DB) {
          const { results } = await env.DB.prepare('SELECT * FROM waitlist ORDER BY created_at DESC').all();
          return new Response(JSON.stringify({ waitlist: results }), { headers });
        }
        if (pathname === '/api/admin/blogs') {
          if (request.method === 'GET' && env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM blogs ORDER BY created_at DESC').all();
            return new Response(JSON.stringify({ blogs: results }), { headers });
          }
          if (request.method === 'POST' && env.DB) {
            const body = await request.json() as { title: string; content: string; slug: string; excerpt?: string; meta_description?: string; author?: string; status?: string };
            const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            await env.DB.prepare('INSERT INTO blogs (title, content, slug, excerpt, meta_description, author, status) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(body.title, body.content, slug, body.excerpt || '', body.meta_description || '', body.author || 'Admin', body.status || 'published').run();
            return new Response(JSON.stringify({ success: true, slug }), { headers });
          }
        }
        if (pathname.match(/^\/api\/admin\/blogs\/\d+$/)) {
          const id = pathname.split('/').pop();
          if (request.method === 'PUT' && env.DB) {
            const body = await request.json() as { title: string; content: string; slug: string; excerpt?: string; meta_description?: string; author?: string; status?: string };
            await env.DB.prepare('UPDATE blogs SET title=?, content=?, slug=?, excerpt=?, meta_description=?, author=?, status=? WHERE id=?').bind(body.title, body.content, body.slug, body.excerpt || '', body.meta_description || '', body.author || 'Admin', body.status || 'published', id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (request.method === 'DELETE' && env.DB) {
            await env.DB.prepare('DELETE FROM blogs WHERE id=?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
      }

      // Public blog APIs
      if (pathname === '/api/blogs' && request.method === 'GET') {
        if (!env.DB) return new Response(JSON.stringify({ blogs: [] }), { headers });
        const { results } = await env.DB.prepare("SELECT id, title, slug, excerpt, author, created_at FROM blogs WHERE status = 'published' ORDER BY created_at DESC").all();
        return new Response(JSON.stringify({ blogs: results }), { headers });
      }
      if (pathname.startsWith('/api/blogs/') && request.method === 'GET') {
        const slug = pathname.split('/').pop();
        if (!env.DB || !slug) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
        const blog = await env.DB.prepare("SELECT * FROM blogs WHERE slug = ? AND status = 'published'").bind(slug).first();
        if (!blog) return new Response(JSON.stringify({ error: 'Blog not found' }), { status: 404, headers });
        return new Response(JSON.stringify({ blog }), { headers });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
    }

    // ── 4. HTML routes: serve index.html with injected SEO meta ───────────────
    if (request.method === 'GET') {
      try {
        // Always fetch the root index.html for SPA routing
        const rootReq = new Request(new URL('/', request.url).toString(), { method: 'GET', headers: request.headers });
        const assetResp = await env.ASSETS.fetch(rootReq);

        if (assetResp.ok || assetResp.status === 200) {
          let html = await assetResp.text();

          // Inject per-route SEO meta
          html = injectSeoMeta(html, pathname);

          const headers = new Headers();
          headers.set('Content-Type', 'text/html; charset=UTF-8');
          // No cache for HTML — always get fresh meta injected
          headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
          addSecurityHeaders(headers, true);

          return new Response(html, { status: 200, headers });
        }
      } catch {
        // fall through to passthrough
      }

      // Passthrough for anything else
      const resp = await env.ASSETS.fetch(request);
      const headers = new Headers(resp.headers);
      addSecurityHeaders(headers, resp.headers.get('Content-Type')?.includes('text/html') ?? false);
      return new Response(resp.body, { status: resp.status, headers });
    }

    return new Response('Method not allowed', { status: 405 });
  },
};
