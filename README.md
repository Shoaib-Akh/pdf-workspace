# PDF Guru

**Your Expert PDF Toolkit — Convert, extract, organize, and transform PDF documents.**

Production domain: [pdfguru.site](https://pdfguru.site)

A browser-first PDF intelligence and conversion platform. From simple format conversions to extracting structured data from invoices, BOQs, and business documents — everything runs in the browser with zero file uploads where supported.

---

## Core Differentiator

This platform competes not just on "PDF conversion" but on **PDF → usable business data**:

- 📊 Extract tables, BOQ rows, invoice line items from PDFs
- 🏗️ Construction: BOQ, tender, quantity survey document extraction
- 🧾 Business: invoices, quotations, bank statements, receipts → Excel
- 🔒 Browser-first: supported tools process files locally, never uploaded

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5 (strict) | Type safety |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| shadcn/ui (Radix) | latest | Accessible UI components |
| React Router | v6 | Client-side routing |
| Zustand | 5 | State management |
| PDF.js | 4.6 | PDF rendering (lazy loaded) |
| pdf-lib | 1.17 | PDF manipulation (lazy loaded) |
| Tesseract.js | 5 | Browser OCR (lazy loaded) |
| SheetJS (xlsx) | 0.18 | Excel export (lazy loaded) |
| JSZip | 3 | ZIP download |
| DOMPurify | 3 | Blog HTML sanitization |
| @dnd-kit | 6-8 | Drag and drop (page reorder) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local — at minimum set VITE_APP_URL to your production domain

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Folder Structure

```
src/
├── app/              # App entry, routing
├── components/
│   ├── ui/           # shadcn/ui base components
│   ├── layout/       # Header, Footer, Breadcrumb, PageLayout
│   ├── upload/       # DropZone, FileCard, MultiFileList
│   ├── pdf/          # ProcessingStatus, ResultScreen, ErrorDisplay
│   ├── seo/          # MetaTags, JsonLd
│   └── shared/       # PageLoadingSpinner, etc.
├── features/         # Feature-level business logic
├── pages/
│   ├── home/         # Homepage
│   ├── tools/        # Tool directory
│   ├── convert/      # Converter pages
│   ├── extract/      # Extraction pages
│   ├── organize/     # PDF organize tools
│   ├── business/     # Business document tools
│   ├── ocr/          # OCR tools
│   ├── workspace/    # Universal workspace
│   ├── learn/        # Content hub articles
│   └── legal/        # Privacy, Terms
├── services/
│   ├── pdf/          # pdfEngine, imageExport, pdfOrganizer
│   ├── extraction/   # textExtractor, excelExporter, csvExporter
│   ├── ocr/          # OCR provider
│   └── analytics/    # Privacy-safe event tracking
├── providers/        # ConversionProvider, BrowserProvider, BackendProvider
├── store/            # Zustand app store
├── data/             # tools.ts — master tool definitions
├── types/            # TypeScript types
├── lib/              # utils, config, constants
└── seo/              # metadata, schemas, sitemap helpers
```

---

## Processing Modes

### 🌐 Browser-Native (WebAssembly — No Server Upload)
These tools run entirely in your browser via PDF.js / pdf-lib WebAssembly:
- PDF to JPG / PNG / WebP (high-res, configurable DPI)
- PDF to Text / CSV / JSON / HTML / Markdown
- PDF Data Extractor (tables, key fields)
- Merge PDF, Split PDF, Reorder, Delete, Rotate, Compress
- Watermark, Page Numbers, Password Protect, Unlock
- OCR PDF (Tesseract.js, English, up to ~10 pages effectively)

### 🔬 Browser-Heuristic (Approximate — No Server Upload)
These tools run client-side using heuristic extraction; results are good for many documents but may not perfectly preserve complex layouts:
- **PDF to Word (.docx)** — uses font-size analysis to reconstruct headings and paragraphs; available now in Beta
- **PDF to Excel (.xlsx)** — detects and reconstructs table grids from PDF coordinate data; available now
- **PDF to PowerPoint (.pptx)** — extracts slides as best-effort image/text blocks
- **BOQ / Invoice / Business doc extraction** — heuristic pattern matching

> **Note:** For guaranteed layout-perfect Word/Excel output on complex PDFs, a server-side conversion backend (e.g. LibreOffice) would be needed. The current browser implementations cover the majority of text-heavy documents well.

### ☁️ Server Processing (Future / Not Yet Implemented)
These require backend integration (provider stubs are ready):
- High-accuracy multilingual OCR (large docs)
- Large batch processing
- Layout-perfect complex document conversion

---

## Deployment

This project supports two deployment targets. **Choose one:**

### Option A — Cloudflare (Recommended)
Uses Cloudflare Workers + D1 + Assets:
```bash
# Deploy worker + frontend
wrangler deploy
```
Set `ADMIN_SECRET` in Cloudflare Dashboard → Workers → Settings → Variables (never in wrangler.toml).

### Option B — Vercel (Frontend only)
The `vercel.json` catch-all rewrite serves the SPA. For API routes (`/api/*`), you must deploy the Worker separately on Cloudflare or implement Vercel serverless functions.

> **Important:** Do not run both vercel.json and wrangler.toml in the same active production deployment without explicitly routing API traffic to the Worker. The Vercel config does not execute `src/worker.ts`.

---

## Security Notes

- `ADMIN_SECRET` **must** be set as an environment variable before deploying. The Worker will return 503 on admin routes if it is absent.
- Admin login returns a short-lived HMAC-signed session token (8-hour expiry), not the raw secret.
- API CORS is restricted to `https://pdfguru.site` for admin and contact routes.
- Blog content is sanitized with DOMPurify before rendering to prevent stored XSS.
- The ticket status endpoint (`/api/status/:trackingId`) only returns `{status, reply}` — no personal data.

---

## Environment Variables

See `.env.example` for all variables.

```
VITE_APP_NAME        — Brand name (default: "PDF Guru")
VITE_APP_URL         — Production URL for canonical links (default: "https://pdfguru.site")
VITE_BACKEND_URL     — Optional: backend API URL for server processing
VITE_SUPPORT_EMAIL   — Support email shown in contact/footer
```

---

## SEO Architecture

- **60+ unique landing pages** with hand-written content
- Each page: unique H1, meta title, meta description, canonical URL from `APP_CONFIG.url`
- **robots.txt**: workspace/admin sessions excluded
- **sitemap.xml**: all public pages with correct priorities
- **JSON-LD schemas**: WebSite, Organization, WebApplication, FAQPage, BreadcrumbList, Article
- **Open Graph + Twitter** meta on all pages
- **Breadcrumb navigation** on all inner pages

---

## Sprint Roadmap

| Sprint | Status |
|--------|--------|
| S1: Design System + Homepage | ✅ Complete |
| S2: PDF Engine + Image Export | ✅ Complete |
| S3: Organize Tools + Directory | ✅ Complete |
| S4: Text + Data Extraction | ✅ Complete |
| S5: Business Document Tools | ✅ Complete |
| S6: SEO Architecture | ✅ Complete |
| S7: OCR + Provider Abstraction | 🔄 In Progress |
| S8: Learn Hub Articles | 🔄 In Progress |
| S9: Performance + A11y + Mobile | ⏳ Upcoming |
| S10: QA + Analytics | ⏳ Upcoming |

---

## License

Private / Commercial
