# PDF Workspace

**Turn PDFs into usable data.**

A production-ready, SEO-first PDF intelligence and conversion platform. Convert, extract, organize, and transform PDF documents — from simple format conversions to extracting structured data from invoices, BOQs, and business documents.

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
| @dnd-kit | 6-8 | Drag and drop (page reorder) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

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

### 🌐 Browser Processing (No Upload)
These tools run entirely in your browser:
- PDF to JPG / PNG / WebP
- PDF to Text / CSV / JSON / HTML / Markdown
- PDF Data Extractor (tables, key fields)
- Merge PDF, Split PDF, Reorder, Delete, Rotate, Compress
- Watermark, Page Numbers
- BOQ / Invoice / Business doc extraction (browser heuristic)
- OCR PDF (Tesseract.js, English, up to ~10 pages)

### ☁️ Server Processing (Future)
These require backend integration (stubs ready):
- PDF to Word (layout-preserving)
- PDF to Excel (complex layout)
- PDF to PowerPoint
- High-accuracy OCR (multilingual, large docs)
- Large batch processing

---

## SEO Architecture

- **60+ unique landing pages** with hand-written content
- Each page: unique H1, meta title, meta description, canonical URL
- **robots.txt**: workspace sessions excluded
- **sitemap.xml**: all public pages with correct priorities
- **JSON-LD schemas**: WebSite, Organization, WebApplication, FAQPage, BreadcrumbList, Article
- **Open Graph + Twitter** meta on all pages
- **Breadcrumb navigation** on all inner pages

---

## Adding a Backend

The conversion provider abstraction makes backend integration seamless:

```ts
// src/providers/BackendProvider.ts
// Set VITE_BACKEND_URL in .env.local to enable
// Implement: POST /api/convert, POST /api/ocr, POST /api/extract
```

No frontend redesign needed when backend is added.

---

## Environment Variables

See `.env.example` for all variables.

```
VITE_APP_NAME        — Brand name (default: "PDF Workspace")
VITE_APP_URL         — Production URL for canonical links
VITE_BACKEND_URL     — Optional: backend API URL
```

---

## Content & SEO

- Learn hub at `/learn` with 7 full articles
- Each article targets a high-intent search query
- All content is human-written (no AI spam)
- Internal linking map in `implementation_plan.md`

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
# pdf-workspace
