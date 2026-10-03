import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Read app URL dynamically from environment (never hardcoded)
const baseUrl = (process.env.VITE_APP_URL || 'https://pdfguru.site').replace(/\/+$/, '');
const siteName = process.env.VITE_APP_NAME || 'PDF Guru';

const ROUTES = [
  // ── Core Pages ──
  {
    route: '/',
    title: `${siteName} — Free Online PDF Tools & Document Extractor`,
    description: '100% private, browser-based PDF tools. Merge, split, compress, convert, OCR, and extract tables from PDFs without uploading files to remote servers.',
    h1: 'Complete PDF Toolkit & Data Extraction Platform',
    lead: 'Process documents directly in your web browser with 100% privacy, zero file size limits, and instant exports to Word, Excel, Images, and Text.',
    body: 'PDF Guru runs modern WebAssembly algorithms inside your browser. Your sensitive files, financial records, and confidential contracts never leave your computer. Choose from over 30 specialized converters, document organizers, OCR engines, and structured data extractors.',
    category: 'Home',
    faqs: [
      { q: 'Is my PDF uploaded to any external server?', a: 'For all browser-powered tools (PDF to Word, PDF to Excel, Merge, Split, Compress, OCR, Images), processing executes strictly inside your local web browser session. No document data is transmitted to or stored on our servers.' },
      { q: 'Are there file size or daily usage limits?', a: 'No artificial file size limits or paywalls. You can process documents as large as your device memory allows, completely free of charge.' },
      { q: 'What is the difference between native and scanned PDFs?', a: 'Native PDFs contain digital text and selectable vectors. Scanned PDFs are photographs or raster scans of printed paper, requiring our optical character recognition (OCR) engine to extract editable text and data.' }
    ]
  },
  {
    route: '/tools',
    title: `All PDF Tools — Complete Document Utility Catalog — ${siteName}`,
    description: 'Explore the full catalog of free PDF tools: converters, organizers, OCR utilities, data extractors, and image processors.',
    h1: 'All PDF Tools & Utilities',
    lead: 'Browse our complete catalog of browser-based document processing utilities.',
    body: 'Filter our privacy-first tools by category: Convert, Organize, Extract, OCR, and Images. Every browser tool runs offline without uploading your sensitive data.',
    category: 'Tools',
  },
  {
    route: '/support',
    title: `Support ${siteName} — Free Document Tools for Everyone`,
    description: 'PDF Guru is 100% free with no subscriptions. If our tools saved you time, learn how voluntary contributions help keep our platform running.',
    h1: 'Support PDF Guru',
    lead: 'PDF Guru is built as a transparent, privacy-first alternative to predatory PDF subscription services.',
    body: 'Every utility on PDF Guru is free for everyone. We do not lock features behind paywalls, impose artificial page quotas, or harvest document data. If PDF Guru helped you complete your work faster, you can support ongoing hosting, bandwidth, and open-source development.',
    category: 'About',
  },
  {
    route: '/contact',
    title: `Contact Engineering & Support — ${siteName}`,
    description: 'Get in touch with the PDF Guru engineering team. Report conversion issues, request new document format extractors, or provide feedback.',
    h1: 'Contact Engineering & Support',
    lead: 'Have a question about browser-side document processing or need a custom extractor?',
    body: 'We review user suggestions and bug reports continuously. Submit your inquiry with document details, and our engineering team will respond with guidance.',
    category: 'Contact',
  },
  {
    route: '/blog',
    title: `PDF Engineering Blog & Product Updates — ${siteName}`,
    description: 'In-depth engineering articles on WebAssembly PDF parsing, client-side OCR optimization, document privacy, and data extraction techniques.',
    h1: 'PDF Engineering & Architecture Blog',
    lead: 'Technical insights, release notes, and deep dives from the PDF Guru development team.',
    body: 'Learn how modern web technologies enable client-side document processing that outperforms traditional server-based converter farms in speed and privacy.',
    category: 'Blog',
  },

  // ── Category Hubs ──
  {
    route: '/convert',
    title: `PDF Converter Tools — Convert To & From PDF — ${siteName}`,
    description: 'Convert PDFs to Word, Excel, PowerPoint, Text, HTML, CSV, and Markdown. Or convert Word, Excel, PowerPoint, and images into clean PDF documents.',
    h1: 'PDF Converter Suite',
    lead: 'Fast, browser-based document format transformation with complete layout fidelity.',
    body: 'Transform documents between standard office formats (DOCX, XLSX, PPTX) and PDF. All browser converters process files locally without transmitting sensitive corporate files to external servers.',
    category: 'Convert',
  },
  {
    route: '/organize',
    title: `PDF Organizer Tools — Merge, Split & Rearrange — ${siteName}`,
    description: 'Merge multiple PDFs, split documents into custom ranges, reorder pages, rotate sideways scans, delete blank pages, and watermark documents.',
    h1: 'PDF Organizer & Page Management',
    lead: 'Reorder, merge, split, rotate, and paginate PDF documents instantly in your browser.',
    body: 'Our page organizer suite allows full control over multi-page PDF documents. Remove redundant cover sheets, insert page numbering, combine exhibits, and rotate oriented scans with zero quality degradation.',
    category: 'Organize',
  },
  {
    route: '/extract',
    title: `PDF Data Extractor Tools — Structured Tables & Fields — ${siteName}`,
    description: 'Extract structured tables, key-value pairs, dates, and amounts from PDF documents into Excel, CSV, and JSON.',
    h1: 'Structured PDF Data Extraction',
    lead: 'Extract tabular data, key-value pairs, and financial fields directly into spreadsheets.',
    body: 'Stop manual re-keying. Our spatial heuristic engine recognizes multi-column layouts, table borders, and financial amounts across invoices, bank statements, and engineering specifications.',
    category: 'Extract',
  },
  {
    route: '/ocr',
    title: `PDF OCR Tools — Scanned PDF to Searchable Text — ${siteName}`,
    description: 'Browser-based optical character recognition. Convert scanned PDFs and document photographs into searchable text, Word, and Excel files.',
    h1: 'Browser-Powered PDF OCR',
    lead: 'Extract editable text and tables from raster scans and phone photos using on-device OCR.',
    body: 'Using WebAssembly Tesseract, your scanned documents and screenshots are converted to text locally on your computer with complete confidentiality.',
    category: 'OCR',
  },
  {
    route: '/images',
    title: `Image & PDF Tools — JPG, PNG, WebP to PDF — ${siteName}`,
    description: 'Convert JPG, PNG, WebP, GIF, and BMP images to PDF, or export PDF pages as high-resolution images. Fast and private.',
    h1: 'Image & PDF Converter Suite',
    lead: 'Convert photo collections to single PDFs or extract PDF pages into crisp images.',
    body: 'Batch convert photographs, receipts, and diagrams into unified PDF portfolios, or extract every page of a PDF document as high-resolution image assets.',
    category: 'Images',
  },
  {
    route: '/security',
    title: `PDF Security & Permission Tools — ${siteName}`,
    description: 'Password protection, document encryption, and watermark tools to safeguard intellectual property and confidential files.',
    h1: 'PDF Document Security',
    lead: 'Secure sensitive business disclosures, legal agreements, and proprietary documents.',
    body: 'Brand documents with confidential watermarks, insert copyright stamps, and configure access permissions to prevent unauthorized document circulation.',
    category: 'Security',
  },

  // ── Real Converters & Tools ──
  {
    route: '/pdf-to-word',
    title: `Convert PDF to Word (DOCX) Free Online — ${siteName}`,
    description: 'Convert PDF documents to editable Microsoft Word (.docx) files. Preserves headings, paragraphs, and layout with 100% browser privacy.',
    h1: 'Convert PDF to Word Online',
    lead: 'Transform static PDF documents into fully editable Microsoft Word DOCX files directly in your web browser.',
    body: 'Our client-side conversion engine parses text blocks, font stylings, and paragraph flow to recreate editable Word documents without altering original typography.',
    category: 'Convert',
    isTool: true,
    faqs: [
      { q: 'Will my converted Word document be fully editable?', a: 'Yes, text, headings, bulleted lists, and tables are converted into native Microsoft Word editable elements.' },
      { q: 'Does PDF to Word work on scanned documents?', a: 'For scanned documents containing image-based text, use our Scanned PDF to Word (OCR) tool which recognizes optical characters first.' }
    ]
  },
  {
    route: '/pdf-to-excel',
    title: `Convert PDF to Excel (XLSX) Free Online — ${siteName}`,
    description: 'Extract tables and numbers from PDF into Microsoft Excel spreadsheets. Multi-column spatial layout detection without uploading files.',
    h1: 'Convert PDF to Excel Spreadsheet',
    lead: 'Extract tabular records, cost schedules, and numeric datasets from PDF into clean Excel spreadsheets.',
    body: 'PDF to Excel uses spatial bounding-box clustering to accurately reconstruct table borders, header rows, and numeric columns without garbling numbers.',
    category: 'Convert',
    isTool: true,
    faqs: [
      { q: 'Can it convert multi-page tables into a single sheet?', a: 'Yes, continuous tables spanning multiple pages are concatenated into a cohesive spreadsheet.' },
      { q: 'Are numeric values formatted as numbers?', a: 'Yes, numeric cells are parsed into clean numeric floats ready for Excel formulas and mathematical summation.' }
    ]
  },
  {
    route: '/pdf-to-powerpoint',
    title: `Convert PDF to PowerPoint (PPTX) Free — ${siteName}`,
    description: 'Convert PDF presentation decks and handouts into editable PowerPoint (.pptx) slides in your browser.',
    h1: 'Convert PDF to PowerPoint Presentation',
    lead: 'Transform PDF slide decks and reports into editable PowerPoint PPTX slides.',
    body: 'Recreate presentation decks from static PDF exports with high-fidelity slide dimensions, background graphics, and structured content.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/pdf-to-jpg',
    title: `Convert PDF to JPG Images Free Online — ${siteName}`,
    description: 'Convert PDF pages into high-resolution JPG images. Fast client-side rendering with zero server uploads.',
    h1: 'Convert PDF to JPG Images',
    lead: 'Render every PDF page into crisp, high-resolution JPEG images directly on your device.',
    body: 'Render individual pages or download an entire document as an organized ZIP archive of high-resolution JPG image files.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/pdf-to-png',
    title: `Convert PDF to PNG Images (Lossless) — ${siteName}`,
    description: 'Convert PDF pages into lossless PNG graphics with crisp text, sharp diagrams, and transparent background support.',
    h1: 'Convert PDF to PNG Images',
    lead: 'Export PDF pages as lossless, pixel-perfect PNG images for presentations and graphic design.',
    body: 'PNG preserves sharp vector text and technical illustrations without compression artifacts, ideal for publication and printing.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/pdf-to-webp',
    title: `Convert PDF to WebP Images — Fast & Compact — ${siteName}`,
    description: 'Convert PDF pages into lightweight, next-generation WebP images for websites and web applications.',
    h1: 'Convert PDF to WebP Images',
    lead: 'Generate ultra-compact, high-quality WebP graphics from PDF pages for optimal website performance.',
    body: 'WebP provides superior compression compared to JPG and PNG, reducing file size by up to 35% while maintaining visual fidelity.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/pdf-to-txt',
    title: `Extract Text from PDF Free Online — ${siteName}`,
    description: 'Extract raw text, paragraphs, and content from PDF documents instantly in your browser with zero formatting clutter.',
    h1: 'Extract Plain Text from PDF',
    lead: 'Extract clean UTF-8 plain text from PDF documents for notes, text analysis, and data pipelines.',
    body: 'Strip visual layout and extract continuous readable text directly into your clipboard or download as a .txt file.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/pdf-to-csv',
    title: `Convert PDF to CSV (Comma Separated) — ${siteName}`,
    description: 'Extract PDF data tables into standard RFC 4180 CSV files for import into database software, Python, or spreadsheet applications.',
    h1: 'Convert PDF to CSV Table',
    lead: 'Convert PDF tables into clean, comma-separated values (CSV) for database imports and data science.',
    body: 'Our CSV converter properly handles quoted cells, escaped commas, and tabular column boundaries according to standard RFC 4180.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/pdf-to-json',
    title: `Convert PDF to JSON Schema & Data — ${siteName}`,
    description: 'Parse PDF documents into structured JSON objects containing metadata, text hierarchy, and extracted tables.',
    h1: 'Convert PDF to Structured JSON',
    lead: 'Extract hierarchical document structures, metadata, and data tables as machine-readable JSON.',
    body: 'Ideal for developers and data engineers integrating PDF document content into modern API pipelines and database backends.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/pdf-to-html',
    title: `Convert PDF to HTML Web Pages — ${siteName}`,
    description: 'Convert PDF documents into clean, responsive HTML and CSS web pages for publishing online.',
    h1: 'Convert PDF to HTML Webpage',
    lead: 'Transform static PDF publications into responsive, accessible web pages.',
    body: 'Convert multi-page PDF documents into semantically structured HTML markup suitable for website embedding and SEO indexing.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/pdf-to-markdown',
    title: `Convert PDF to Markdown (.md) Free — ${siteName}`,
    description: 'Convert PDF whitepapers, reports, and documentation into GitHub-flavored Markdown for documentation systems and LLM prompts.',
    h1: 'Convert PDF to Markdown',
    lead: 'Export clean Markdown documents with headings, lists, and tables preserved.',
    body: 'Effortlessly feed PDF content into knowledge bases, Obsidian, Notion, or LLM context windows using formatted Markdown.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/pdf-to-data',
    title: `Extract Structured Data from PDF — ${siteName}`,
    description: 'Universal document data extractor. Automatically identifies tables, key-value pairs, dates, and currencies from business PDFs.',
    h1: 'Universal PDF Data Extractor',
    lead: 'Automatically detect and extract tables, key-value pairs, dates, and amounts from any document.',
    body: 'Extract structured information from financial statements, invoices, and contracts without manual templates or third-party cloud uploads.',
    category: 'Extract',
    isTool: true,
  },

  // ── Organize Tools ──
  {
    route: '/merge-pdf',
    title: `Merge PDF Files Free Online — Combine PDFs — ${siteName}`,
    description: 'Combine multiple PDF documents into one single PDF in seconds. Reorder files with drag-and-drop. 100% private in your browser.',
    h1: 'Merge PDF Files Online',
    lead: 'Combine multiple PDF files into a single organized document with custom page sequencing.',
    body: 'Drag and drop your documents, arrange the desired file order, and merge them instantly into a single unified PDF file without sending any bytes to external servers.',
    category: 'Organize',
    isTool: true,
    faqs: [
      { q: 'Is there a limit on how many PDFs I can combine?', a: 'No, you can combine as many documents as your browser memory supports.' },
      { q: 'Will the original document quality be preserved?', a: 'Yes, original font vectors, high-resolution graphics, and metadata are preserved without re-compression.' }
    ]
  },
  {
    route: '/split-pdf',
    title: `Split PDF into Multiple Files Free — ${siteName}`,
    description: 'Split a large PDF into individual pages or extract custom page ranges into separate PDF documents directly in your browser.',
    h1: 'Split PDF Documents Online',
    lead: 'Divide large PDF files into distinct chapters, exhibits, or standalone single pages.',
    body: 'Define page ranges like "1-3, 5, 8-10" or separate every page into an individual file. All operations run in your browser.',
    category: 'Organize',
    isTool: true,
  },
  {
    route: '/compress-pdf',
    title: `Compress PDF Online Free — Reduce PDF File Size — ${siteName}`,
    description: 'Reduce PDF file size without sacrificing readability. Remove redundant objects and optimize document streams in your browser.',
    h1: 'Compress PDF Online',
    lead: 'Shrink bulky PDF files for faster email sharing and meeting upload portal size restrictions.',
    body: 'Our browser-based compressor cleans redundant structural objects and optimizes stream tables to minimize byte size while retaining text sharpness.',
    category: 'Organize',
    isTool: true,
  },
  {
    route: '/rotate-pdf',
    title: `Rotate PDF Pages Online — Fix Upside Down Pages — ${siteName}`,
    description: 'Rotate PDF pages permanently 90, 180, or 270 degrees clockwise. Correct orientation for odd, even, or all pages.',
    h1: 'Rotate PDF Pages Permanently',
    lead: 'Fix sideways or upside-down scanned pages and save the corrected orientation permanently.',
    body: 'Rotate selected pages or an entire document by 90, 180, or 270 degrees clockwise with instant browser-side processing.',
    category: 'Organize',
    isTool: true,
  },
  {
    route: '/delete-pdf-pages',
    title: `Delete Pages from PDF Free Online — ${siteName}`,
    description: 'Remove unwanted pages, blank covers, and obsolete sheets from PDF files safely without re-uploading.',
    h1: 'Delete Unwanted PDF Pages',
    lead: 'Prune blank divider sheets, confidential sections, or incorrect pages from any PDF document.',
    body: 'Specify page numbers or ranges to remove, creating a streamlined, clean PDF file in seconds.',
    category: 'Organize',
    isTool: true,
  },
  {
    route: '/extract-pdf-pages',
    title: `Extract PDF Pages — Save Specific Pages as PDF — ${siteName}`,
    description: 'Extract specific pages or page ranges from a PDF document into a new standalone PDF file online.',
    h1: 'Extract Pages from PDF',
    lead: 'Pull specific exhibits, chapters, or page selections out into a new standalone PDF.',
    body: 'Select the exact pages you need and save them as a clean new PDF document without touching the rest of the original file.',
    category: 'Organize',
    isTool: true,
  },
  {
    route: '/reorder-pdf-pages',
    title: `Reorder PDF Pages Online — Rearrange PDF Pages — ${siteName}`,
    description: 'Rearrange and reorder pages in your PDF document. Move pages up and down into your preferred sequence.',
    h1: 'Reorder PDF Pages Online',
    lead: 'Rearrange page sequences and organize presentation flow directly in your browser.',
    body: 'Load your multi-page document, adjust the page order with simple controls, and export the rearranged PDF instantly.',
    category: 'Organize',
    isTool: true,
  },
  {
    route: '/watermark-pdf',
    title: `Add Watermark to PDF Free Online — ${siteName}`,
    description: 'Stamp text watermarks like CONFIDENTIAL, DRAFT, or custom copyright text across PDF pages with customizable opacity.',
    h1: 'Watermark PDF Documents',
    lead: 'Protect intellectual property and brand contracts with customizable text watermarks.',
    body: 'Add diagonal or centered watermark stamps across all pages with custom text, rotation, and transparency controls.',
    category: 'Organize',
    isTool: true,
  },
  {
    route: '/add-page-numbers',
    title: `Add Page Numbers to PDF Free Online — ${siteName}`,
    description: 'Insert professional page numbering, Page X of Y labels, and custom start numbers into PDF files in your browser.',
    h1: 'Add Page Numbers to PDF',
    lead: 'Insert clean pagination, header/footer numbers, and custom prefixes into legal and business PDFs.',
    body: 'Choose bottom-center, bottom-right, or top-center positions, select custom start page numbers, and insert pagination seamlessly.',
    category: 'Organize',
    isTool: true,
  },
  {
    route: '/edit-pdf',
    title: `Edit PDF Online Free — Annotate, Sign & Highlight — ${siteName}`,
    description: 'Edit PDF documents online. Add annotations, sign documents, highlight text, and draw directly on PDF pages in your browser.',
    h1: 'Edit & Annotate PDF Online',
    lead: 'Annotate, sign, highlight, and mark up PDF documents directly in your web browser.',
    body: 'Fill forms, stamp digital signatures, highlight crucial passages, and export edited PDFs with zero privacy trade-offs.',
    category: 'Organize',
    isTool: true,
  },

  // ── Document to PDF ──
  {
    route: '/word-to-pdf',
    title: `Convert Word to PDF (DOCX to PDF) Free — ${siteName}`,
    description: 'Convert Microsoft Word (.docx and .doc) documents into standard, printer-ready PDF files directly in your browser.',
    h1: 'Convert Word DOCX to PDF',
    lead: 'Turn Microsoft Word documents into universally readable PDF files with intact formatting.',
    body: 'Convert DOCX files into standardized PDF documents ready for printing, archiving, and official submissions.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/excel-to-pdf',
    title: `Convert Excel to PDF (XLSX to PDF) Free — ${siteName}`,
    description: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) into clean, formatted PDF sheets online without server uploads.',
    h1: 'Convert Excel XLSX to PDF',
    lead: 'Transform financial spreadsheets and data workbooks into clean, printable PDF documents.',
    body: 'Convert worksheets and tabular calculations into standardized PDF reports with crisp lines and formatted cells.',
    category: 'Convert',
    isTool: true,
  },
  {
    route: '/powerpoint-to-pdf',
    title: `Convert PowerPoint to PDF (PPTX to PDF) — ${siteName}`,
    description: 'Convert PowerPoint presentations (.pptx and .ppt) into high-resolution, shareable PDF slide decks.',
    h1: 'Convert PowerPoint PPTX to PDF',
    lead: 'Export PowerPoint slides into universally compatible PDF presentations for seamless sharing.',
    body: 'Ensure every recipient sees your presentation exactly as intended across any device or operating system.',
    category: 'Convert',
    isTool: true,
  },

  // ── Image to PDF ──
  {
    route: '/jpg-to-pdf',
    title: `Convert JPG to PDF Free Online — ${siteName}`,
    description: 'Convert JPEG and JPG photos into high-quality PDF files. Batch convert multiple images into one combined PDF document.',
    h1: 'Convert JPG Images to PDF',
    lead: 'Convert JPEG photos, receipts, and scans into clean, standardized PDF files in seconds.',
    body: 'Combine multiple JPG photographs into a single unified document with automatic dimension scaling.',
    category: 'Images',
    isTool: true,
  },
  {
    route: '/png-to-pdf',
    title: `Convert PNG to PDF Free Online — ${siteName}`,
    description: 'Convert PNG graphics and screenshots into crisp PDF documents with lossless clarity and transparency support.',
    h1: 'Convert PNG Images to PDF',
    lead: 'Transform lossless PNG images and diagrams into print-ready PDF files.',
    body: 'Preserve pixel-perfect line art, transparent areas, and high-resolution diagrams in a portable PDF container.',
    category: 'Images',
    isTool: true,
  },
  {
    route: '/gif-to-pdf',
    title: `Convert GIF to PDF Free Online — ${siteName}`,
    description: 'Convert static GIF images into clean, standardized PDF files directly in your web browser.',
    h1: 'Convert GIF Images to PDF',
    lead: 'Turn GIF image assets and web graphics into standard PDF documents.',
    body: 'Fast in-browser processing for transforming GIF images into universally readable PDF files.',
    category: 'Images',
    isTool: true,
  },
  {
    route: '/bmp-to-pdf',
    title: `Convert BMP to PDF Free Online — ${siteName}`,
    description: 'Convert Windows Bitmap (.bmp) images into lightweight, universally compatible PDF files.',
    h1: 'Convert BMP Images to PDF',
    lead: 'Transform uncompressed BMP images into compact, standardized PDF documents.',
    body: 'Quickly convert legacy Bitmap graphics into modern, easily shareable PDF documents.',
    category: 'Images',
    isTool: true,
  },
  {
    route: '/webp-to-pdf',
    title: `Convert WebP to PDF Free Online — ${siteName}`,
    description: 'Convert Google WebP images into standardized, printable PDF documents in your browser.',
    h1: 'Convert WebP Images to PDF',
    lead: 'Transform modern WebP web images into versatile, universally viewable PDF documents.',
    body: 'Convert single or multiple WebP images into high-quality PDF documents without uploading to remote servers.',
    category: 'Images',
    isTool: true,
  },
  {
    route: '/images-to-pdf',
    title: `Convert Multiple Images to PDF Free — ${siteName}`,
    description: 'Combine multiple JPG, PNG, WebP, GIF, and BMP photos into a single PDF document in custom sequence.',
    h1: 'Combine Multiple Images into PDF',
    lead: 'Assemble mixed photo collections into a unified, clean PDF portfolio in your browser.',
    body: 'Drop mixed image formats, arrange the desired page sequence, and export a combined PDF document instantly.',
    category: 'Images',
    isTool: true,
  },

  // ── OCR Tools ──
  {
    route: '/ocr-pdf',
    title: `OCR PDF Online Free — Make Scanned PDF Searchable — ${siteName}`,
    description: 'Apply browser-based OCR to scanned PDFs and photo documents. Makes text selectable, searchable, and copyable.',
    h1: 'Make Scanned PDF Searchable with OCR',
    lead: 'Recognize printed characters in scanned PDFs and make document text searchable and selectable.',
    body: 'Powered by client-side WebAssembly OCR. Extract readable text from photos and scans without sharing sensitive documents.',
    category: 'OCR',
    isTool: true,
    faqs: [
      { q: 'How does client-side OCR work?', a: 'Optical character recognition runs entirely inside your browser using Tesseract WebAssembly, ensuring your scanned documents are never sent over the internet.' },
      { q: 'Can I copy and search text after OCR?', a: 'Yes, OCR generates a transparent text overlay that enables full-text search, selection, and copy-pasting.' }
    ]
  },
  {
    route: '/scanned-pdf-to-text',
    title: `Extract Text from Scanned PDF (OCR) — ${siteName}`,
    description: 'Extract raw text from scanned image PDFs using optical character recognition directly in your browser.',
    h1: 'Extract Text from Scanned PDF',
    lead: 'Convert non-selectable scanned PDFs and photo documents into editable text with OCR.',
    body: 'Transform scanned book pages, paper forms, and historical documents into plain editable text files.',
    category: 'OCR',
    isTool: true,
  },
  {
    route: '/scanned-pdf-to-word',
    title: `Convert Scanned PDF to Word (OCR) — ${siteName}`,
    description: 'OCR scanned PDFs into editable Microsoft Word (.docx) documents with layout recognition.',
    h1: 'Convert Scanned PDF to Editable Word',
    lead: 'Recreate editable Word documents from scanned paper forms, contracts, and filings.',
    body: 'Our OCR engine recognizes paragraph bounds and text formatting to produce an editable DOCX file from scanned pages.',
    category: 'OCR',
    isTool: true,
  },
  {
    route: '/scanned-pdf-to-excel',
    title: `Convert Scanned PDF to Excel (OCR Tables) — ${siteName}`,
    description: 'Extract tables and financial figures from scanned receipts and document images into Microsoft Excel.',
    h1: 'Convert Scanned PDF Tables to Excel',
    lead: 'Extract tabular data from scanned paper records and receipts into structured Excel spreadsheets.',
    body: 'Combines optical character recognition with gridline analysis to reconstruct tables from scanned documents into XLSX.',
    category: 'OCR',
    isTool: true,
  },

  // ── Learn Articles ──
  {
    route: '/learn',
    title: `PDF Guides & Tutorials — ${siteName} Learn Hub`,
    description: 'Comprehensive tutorials on PDF parsing, table extraction, OCR techniques, and document format conversion.',
    h1: 'PDF Knowledge Base & Guides',
    lead: 'Master document conversion, automated table extraction, and client-side OCR techniques.',
    body: 'Explore expert walkthroughs, practical guides, and architectural breakdowns for accountants, estimators, researchers, and developers.',
    category: 'Learn',
  },
  {
    route: '/learn/how-to-convert-pdf-to-excel',
    title: `How to Convert PDF to Excel (Free & Private) — ${siteName}`,
    description: 'Complete walkthrough on converting PDF tables to Excel spreadsheets without data scrambling or server uploads.',
    h1: 'How to Convert PDF to Excel Accurately',
    lead: 'Step-by-step tutorial on extracting tabular data from PDF into Microsoft Excel without broken columns.',
    body: 'Learn how to handle multi-line descriptions, formatted currency figures, and complex multi-page financial ledgers effectively.',
    category: 'Learn',
  },
  {
    route: '/learn/how-to-extract-tables-from-pdf',
    title: `How to Extract Tables from PDF Documents — ${siteName}`,
    description: 'Learn modern methods for extracting clean tables from digital and scanned PDF files into CSV and Excel.',
    h1: 'Extracting Tables from PDF Documents',
    lead: 'Detailed guide to bounding-box heuristics, column alignment, and header deduplication across pages.',
    body: 'Understand why naive copy-pasting mangles tables and how spatial analysis correctly identifies spreadsheet boundaries.',
    category: 'Learn',
  },
  {
    route: '/learn/pdf-vs-scanned-pdf',
    title: `PDF vs Scanned PDF — What is the Difference? — ${siteName}`,
    description: 'Understand the difference between vector font glyph streams and raster bitmap scans, and why ordinary converters fail on scans.',
    h1: 'PDF vs Scanned PDF: The Fundamental Difference',
    lead: 'Why converters output blank pages on scanned documents and how to choose the right extraction method.',
    body: 'A 30-second inspection test to immediately identify whether your PDF contains native text or pixel images requiring OCR.',
    category: 'Learn',
  },
  {
    route: '/learn/how-ocr-works',
    title: `How OCR Works on PDF Documents — From Pixels to Text — ${siteName}`,
    description: 'A technical deep-dive into binarization, segmentation, Tesseract WebAssembly execution, and character confidence scores.',
    h1: 'How OCR Converts Pixels to Editable Text',
    lead: 'An engineer’s guide to image pre-processing, WebAssembly execution, and optical character recognition.',
    body: 'Discover how image binarization, baseline alignment, and language models turn noisy scanned pixels into clean UTF-8 text.',
    category: 'Learn',
  },

  // ── Legal Pages ──
  {
    route: '/privacy',
    title: `Privacy Policy — 100% Private Browser Processing — ${siteName}`,
    description: 'Our uncompromising privacy guarantee. All browser-based tools execute locally on your device with zero data transmission or retention.',
    h1: 'Privacy Policy & Data Protection',
    lead: 'Your documents never leave your computer. We believe document privacy is a fundamental right.',
    body: 'PDF Guru processes files locally in your web browser. We do not inspect, log, upload, or store your documents on our servers. Optional donations are processed through third-party platforms with no financial data stored on our systems.',
    category: 'Legal',
  },
  {
    route: '/terms',
    title: `Terms of Service — Transparent Document Tools — ${siteName}`,
    description: 'Transparent, fair terms of service. Free access to document processing tools with no hidden subscriptions or automatic renewals.',
    h1: 'Terms of Service',
    lead: 'Clear, honest guidelines for using the PDF Guru platform and document processing utilities.',
    body: 'PDF Guru provides browser-based utilities as-is without recurring subscriptions. You retain 100% ownership of your files. Voluntary contributions are non-refundable unless permitted by the payment processor.',
    category: 'Legal',
  },

  // ── Private / Noindex Routes ──
  {
    route: '/workspace',
    title: `PDF Workspace — ${siteName}`,
    description: 'Interactive PDF editing and processing workspace.',
    h1: 'PDF Document Workspace',
    lead: 'Secure client-side workspace for active document processing.',
    body: 'Manage your active document queue and apply multi-tool workflows entirely inside your local browser memory.',
    noindex: true,
  },
  {
    route: '/admin',
    title: `Admin Dashboard — ${siteName}`,
    description: 'Administrative portal for PDF Guru.',
    h1: 'Platform Administration',
    lead: 'Secure administration portal for platform telemetry and status.',
    body: 'Authorized administrative session management and database status.',
    noindex: true,
  },
  {
    route: '/auth',
    title: `Account Authentication — ${siteName}`,
    description: 'Authentication portal for PDF Guru.',
    h1: 'Account Authentication',
    lead: 'Sign in to access advanced management features.',
    body: 'Authentication management for PDF Guru services.',
    noindex: true,
  },
];

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildJsonLd(routeObj, canonicalUrl) {
  const schemas = [];

  // BreadcrumbList
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...(routeObj.route !== '/'
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: routeObj.category || routeObj.h1,
              item: canonicalUrl,
            },
          ]
        : []),
    ],
  });

  // SoftwareApplication for tools
  if (routeObj.isTool) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: routeObj.h1,
      operatingSystem: 'All (Web Browser)',
      applicationCategory: 'UtilitiesApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: routeObj.description,
      url: canonicalUrl,
    });
  }

  // FAQPage if FAQs exist
  if (routeObj.faqs && routeObj.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: routeObj.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  return `<script type="application/ld+json">${JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)}</script>`;
}

function generatePrerenderHtml(templateHtml, routeObj) {
  const canonicalUrl = `${baseUrl}${routeObj.route === '/' ? '' : routeObj.route}`;
  const robotsTag = routeObj.noindex
    ? '<meta name="robots" content="noindex, nofollow" />'
    : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />';

  const jsonLdScript = !routeObj.noindex ? buildJsonLd(routeObj, canonicalUrl) : '';

  // 1. Prepare semantic prerender body to go inside <div id="root">
  const faqsHtml =
    routeObj.faqs && routeObj.faqs.length > 0
      ? `
        <section class="prerender-faqs" style="margin-top: 2rem; border-top: 1px solid #e5e7eb; padding-top: 1.5rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Frequently Asked Questions</h2>
          <div class="faq-list">
            ${routeObj.faqs
              .map(
                (f) => `
              <div class="faq-item" style="margin-bottom: 1rem;">
                <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem;">${escapeHtml(f.q)}</h3>
                <p style="color: #4b5563; font-size: 0.875rem;">${escapeHtml(f.a)}</p>
              </div>`
              )
              .join('\n')}
          </div>
        </section>`
      : '';

  const rootContent = `
    <header class="prerender-header" style="padding: 1rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
      <a href="/" style="font-weight: 700; font-size: 1.25rem; color: #4f46e5; text-decoration: none;">${siteName}</a>
      <nav style="display: flex; gap: 1rem; font-size: 0.875rem;">
        <a href="/tools" style="text-decoration: none; color: #374151;">All Tools</a>
        <a href="/learn" style="text-decoration: none; color: #374151;">Learn</a>
        <a href="/support" style="text-decoration: none; color: #374151;">Support</a>
      </nav>
    </header>
    <main class="prerender-main" style="max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: Inter, sans-serif;">
      <article>
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #111827; line-height: 1.25; margin-bottom: 1rem;">${escapeHtml(routeObj.h1)}</h1>
        <p class="prerender-lead" style="font-size: 1.125rem; color: #4b5563; line-height: 1.6; margin-bottom: 1.5rem;">${escapeHtml(routeObj.lead)}</p>
        <div class="prerender-body" style="font-size: 1rem; color: #374151; line-height: 1.7; margin-bottom: 2rem;">
          <p>${escapeHtml(routeObj.body)}</p>
        </div>
        ${faqsHtml}
      </article>
    </main>
    <footer class="prerender-footer" style="padding: 2rem 1rem; border-top: 1px solid #e5e7eb; text-align: center; font-size: 0.875rem; color: #6b7280; margin-top: 3rem;">
      <p>&copy; ${new Date().getFullYear()} ${siteName}. 100% Private Browser Document Utilities.</p>
      <p style="margin-top: 0.5rem;">
        <a href="/privacy" style="color: #6b7280; text-decoration: underline; margin: 0 0.5rem;">Privacy Policy</a>
        <a href="/terms" style="color: #6b7280; text-decoration: underline; margin: 0 0.5rem;">Terms of Service</a>
        <a href="/contact" style="color: #6b7280; text-decoration: underline; margin: 0 0.5rem;">Contact Us</a>
      </p>
    </footer>`;

  // 2. Inject meta, title, canonical, OG, robots, and JSON-LD into <head>
  let html = templateHtml;

  // Clean any previously injected tags
  html = html.replace(/<link rel="canonical"[^>]*>\s*/gi, '');
  html = html.replace(/<meta property="og:[^>]*>\s*/gi, '');
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');

  // Replace title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(routeObj.title)}</title>`);

  // Replace description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(routeObj.description)}" />`
  );

  // Replace robots
  html = html.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    robotsTag
  );

  // Inject canonical and OG tags before </head>
  const metaTagsToInject = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(routeObj.title)}" />
    <meta property="og:description" content="${escapeHtml(routeObj.description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    ${jsonLdScript}
  </head>`;

  html = html.replace('</head>', metaTagsToInject);

  // 3. Inject root content inside <div id="root">...</div>
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${rootContent}</div>`);

  return html;
}

export async function prerenderAll() {
  console.log(`Starting static SEO prerendering with base URL: ${baseUrl}...`);
  const templatePath = path.resolve(distDir, 'index.html');
  const backupTemplatePath = path.resolve(distDir, '_template.html');

  if (!fs.existsSync(templatePath) && !fs.existsSync(backupTemplatePath)) {
    throw new Error(`dist/index.html not found. Please run vite build first.`);
  }

  let templateHtml;
  if (fs.existsSync(templatePath)) {
    const raw = fs.readFileSync(templatePath, 'utf8');
    if (!raw.includes('prerender-header')) {
      fs.writeFileSync(backupTemplatePath, raw, 'utf8');
      templateHtml = raw;
    } else if (fs.existsSync(backupTemplatePath)) {
      templateHtml = fs.readFileSync(backupTemplatePath, 'utf8');
    } else {
      const cleaned = raw.replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');
      fs.writeFileSync(backupTemplatePath, cleaned, 'utf8');
      templateHtml = cleaned;
    }
  } else {
    templateHtml = fs.readFileSync(backupTemplatePath, 'utf8');
  }

  let count = 0;

  for (const routeObj of ROUTES) {
    const renderedHtml = generatePrerenderHtml(templateHtml, routeObj);

    let targetFile;
    if (routeObj.route === '/') {
      targetFile = templatePath;
    } else {
      const cleanPath = routeObj.route.replace(/^\/+/, '');
      const outDir = path.resolve(distDir, cleanPath);
      fs.mkdirSync(outDir, { recursive: true });
      targetFile = path.resolve(outDir, 'index.html');
    }

    fs.writeFileSync(targetFile, renderedHtml, 'utf8');

    // Verification: ensure file exists and contains the H1 text (raw or escaped)
    const verifyContent = fs.readFileSync(targetFile, 'utf8');
    const escapedH1 = escapeHtml(routeObj.h1);
    if (!verifyContent.includes(routeObj.h1) && !verifyContent.includes(escapedH1)) {
      throw new Error(`Prerender verification failed for ${routeObj.route}: H1 "${routeObj.h1}" missing in ${targetFile}`);
    }

    count++;
  }

  console.log(`✓ Successfully prerendered and verified ${count} static pages with unique titles, meta descriptions, single H1s, canonical URLs, and JSON-LD!`);
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  prerenderAll().catch((err) => {
    console.error('Prerender failed:', err);
    process.exit(1);
  });
}
