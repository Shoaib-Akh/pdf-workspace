import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FileText, ArrowRight, Shield, Zap, BarChart3, FileSpreadsheet,
  HardHat, Smartphone, ChevronRight, Star, Upload,
} from 'lucide-react'
import MetaTags from '@/components/seo/MetaTags'
import { JsonLd, buildWebSiteSchema, buildOrganizationSchema, buildFAQSchema, buildWebApplicationSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import { useNavigate as useNav } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { track } from '@/services/analytics/analytics'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MergePdfSeoSection, { MERGE_PDF_FAQS } from '@/components/home/MergePdfSeoSection'

const POPULAR_TOOLS = [
  {
    name: 'PDF to Word',
    description: 'Convert PDF text and layout to editable Word documents',
    href: '/pdf-to-word',
    icon: '📝',
    badge: 'Coming Soon',
  },
  {
    name: 'PDF to Excel',
    description: 'Extract tables and data from PDF into Excel spreadsheets',
    href: '/pdf-to-excel',
    icon: '📊',
    badge: 'Popular',
  },
  {
    name: 'PDF to JPG',
    description: 'Convert each PDF page to a high-quality JPG image instantly in your browser',
    href: '/pdf-to-jpg',
    icon: '🖼️',
    badge: 'Instant',
  },
  {
    name: 'BOQ to Excel',
    description: 'Extract Bill of Quantities from construction PDFs directly into Excel',
    href: '/boq-pdf-to-excel',
    icon: '🏗️',
    badge: 'Featured',
  },
  {
    name: 'Extract PDF Tables',
    description: 'Detect and extract all tables from a PDF to CSV or Excel',
    href: '/pdf-to-data',
    icon: '🗂️',
    badge: 'Instant',
  },
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one file — 100% private and instant',
    href: '/merge-pdf',
    icon: '🔗',
    badge: 'Instant',
  },
  {
    name: 'Invoice to Excel',
    description: 'Extract invoice line items, totals, and tax data from PDF',
    href: '/invoice-to-excel',
    icon: '🧾',
    badge: null,
  },
  {
    name: 'PDF to Text',
    description: 'Extract all readable text from a PDF document instantly',
    href: '/pdf-to-txt',
    icon: '📄',
    badge: 'Instant',
  },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Private by default',
    description:
      'For tools that support browser processing, your PDF is processed on your device and never sent to any server.',
  },
  {
    icon: Zap,
    title: 'Instant processing',
    description:
      'Browser-based tools work locally — no server round-trip, no waiting in a queue.',
  },
  {
    icon: BarChart3,
    title: 'Built for business data',
    description:
      'Extract tables, BOQ rows, invoice line items, and structured data from complex PDFs — not just raw text.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Multiple export formats',
    description:
      'Export to Excel, CSV, JSON, Markdown, HTML, or plain text depending on what you need.',
  },
  {
    icon: HardHat,
    title: 'Construction & procurement',
    description:
      'Specialized tools for BOQ PDFs, tender documents, quotations, and estimates — built for the construction industry.',
  },
  {
    icon: Smartphone,
    title: 'Works on any device',
    description:
      'Full functionality on desktop, tablet, and mobile. No software to install. No plug-in required.',
  },
]

const USE_CASES = [
  {
    audience: 'For businesses',
    cases: [
      'Extract invoice data to Excel for reconciliation',
      'Convert bank statements to Excel for accounting',
      'Pull BOQ data from contractor PDFs into your spreadsheet',
    ],
  },
  {
    audience: 'For construction professionals',
    cases: [
      'Convert tender PDFs to Excel for pricing',
      'Extract quantity survey tables from PDF',
      'Process multiple BOQ PDFs into structured data',
    ],
  },
  {
    audience: 'For researchers & analysts',
    cases: [
      'Extract tables from research papers and reports',
      'Convert PDF data to JSON for analysis pipelines',
      'Export structured data from government PDF reports',
    ],
  },
  {
    audience: 'For individuals',
    cases: [
      'Convert a PDF to Word for editing',
      'Extract images from a PDF document',
      'Merge PDFs into one combined file',
    ],
  },
]

const FAQS = [
  {
    q: 'Is my PDF uploaded to a server?',
    a: 'For tools that run in your browser — PDF to JPG, Merge PDF, Split PDF, PDF to text, and more — your file is processed on your device and never sent to any server. Tools that require advanced processing, like high-quality PDF to Word, clearly indicate that server processing is used.',
  },
  {
    q: 'What PDF types are supported?',
    a: 'Standard text-based PDFs allow full text and table extraction. Scanned PDFs (image-only) require OCR to extract readable content — the platform automatically detects this and offers OCR as the next step.',
  },
  {
    q: 'Do I need an account?',
    a: 'No account is required for basic tools. Create an account to access premium features, conversion history, and higher file limits.',
  },
  {
    q: 'What formats can I export to?',
    a: 'Excel (.xlsx), CSV, Word (.docx), JPG, PNG, WebP, Text (.txt), JSON, Markdown, HTML, and PDF for merge, split, and organize operations.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'Browser-based tools can handle most standard PDFs. Very large files (over 500MB) may be limited by available browser memory. Advanced server-based tools have separate size limits.',
  },
]

function HeroDropZone() {
  const navigate = useNavigate()
  const setCurrentFile = useAppStore((s) => s.setCurrentFile)

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) {
        setCurrentFile(accepted[0])
        track('file_selected', { source: 'homepage_hero' })
        navigate('/workspace')
      }
    },
    [navigate, setCurrentFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 500 * 1024 * 1024,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        group relative mt-8 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center
        transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
        ${isDragActive
          ? 'border-violet-400 bg-violet-950/60 scale-[1.01] shadow-glow'
          : 'border-slate-600 bg-slate-900/50 hover:border-violet-500 hover:bg-violet-950/40 hover:shadow-glow'
        }
      `}
      role="button"
      aria-label="Drop your PDF here or click to browse"
      tabIndex={0}
    >
      <input {...getInputProps()} aria-hidden="true" />
      <div className="flex flex-col items-center gap-3">
        <div
          className={`
            flex h-14 w-14 items-center justify-center rounded-xl transition-colors
            ${isDragActive ? 'bg-violet-700/60 text-violet-300' : 'bg-slate-800 text-slate-400 group-hover:bg-violet-900/70 group-hover:text-violet-400'}
          `}
        >
          <Upload className="h-7 w-7" />
        </div>
        <div>
          <p className={`text-base font-semibold ${isDragActive ? 'text-violet-300' : 'text-slate-200'}`}>
            {isDragActive ? 'Drop your PDF here' : 'Drop your PDF here — or click to browse'}
          </p>
          <p className="mt-1 text-sm text-slate-500">Supports PDF files up to 500MB</p>
        </div>
        <Button
          className="mt-2 bg-violet-600 text-white hover:bg-violet-500 shadow-glow"
          size="lg"
          onClick={(e) => e.stopPropagation()}
          onClickCapture={() => {
            const input = document.querySelector('input[type="file"]') as HTMLInputElement
            input?.click()
          }}
        >
          Choose PDF
        </Button>
      </div>
    </div>
  )
}

function BadgePill({ text }: { text: string }) {
  const colors: Record<string, string> = {
    Popular: 'bg-amber-100 text-amber-700 font-semibold',
    Instant: 'bg-emerald-100 text-emerald-700 font-semibold',
    'Coming Soon': 'bg-amber-100 text-amber-700 font-semibold',
    Featured: 'bg-brand-100 text-brand-700 font-semibold',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[text] ?? 'bg-zinc-100 text-zinc-600'}`}>
      {text}
    </span>
  )
}

export default function HomePage() {
  const combinedFaqs = [
    ...MERGE_PDF_FAQS.map((f) => ({ question: f.q, answer: f.a })),
    ...FAQS.map((f) => ({ question: f.q, answer: f.a })),
  ]

  return (
    <>
      <MetaTags
        title="PDF Converter, Data Extractor & Free PDF Merger — Merge, Convert, Extract PDFs"
        description="Merge PDF online free, combine multiple PDF documents into one, or convert PDF to Word, Excel, JPG, and CSV. 100% private in-browser processing with zero server uploads."
        canonical={APP_CONFIG.url}
        ogImage={`${APP_CONFIG.url}/og/home.jpg`}
      />
      <JsonLd data={buildWebSiteSchema(APP_CONFIG)} />
      <JsonLd data={buildOrganizationSchema(APP_CONFIG)} />
      <JsonLd
        data={buildWebApplicationSchema({
          name: 'Free PDF Merger & Combiner Online',
          description:
            'Merge multiple PDF documents and combine photos or images into one clean PDF file directly in your browser. 100% free with no file limits.',
          url: `${APP_CONFIG.url}/merge-pdf`,
        })}
      />
      <JsonLd data={buildFAQSchema(combinedFaqs)} />

      <Header />

      <main>
        {/* ─── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 px-4 pb-16 pt-14 sm:px-6 lg:px-8">
          {/* subtle violet glow overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-700/60 bg-violet-900/40 px-3 py-1 text-sm text-violet-300 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />
              PDF → usable data
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Turn PDFs into{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                usable data.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
              Stop copying and pasting from PDFs. Upload your document and convert it to
              Word, Excel, CSV, or extract structured tables, invoice data, BOQ rows, and
              more — all in your browser, no account required.
            </p>

            <HeroDropZone />

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                100% browser processing for supported tools
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                No unnecessary uploads
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-indigo-400" />
                No account required
              </span>
            </div>
          </div>
        </section>

        {/* ─── POPULAR TOOLS ────────────────────────────────────── */}
        <section className="border-t border-zinc-100 bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Popular tools</h2>
                <p className="mt-1 text-zinc-500">The most-used PDF tools in one place</p>
              </div>
              <Link
                to="/tools"
                className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Browse all tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {POPULAR_TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  to={tool.href}
                  className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-card transition-all hover:border-brand-200 hover:shadow-hover"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl" role="img" aria-hidden>
                      {tool.icon}
                    </span>
                    {tool.badge && <BadgePill text={tool.badge} />}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 group-hover:text-brand-700">
                      {tool.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-500">{tool.description}</p>
                  </div>
                  <span className="mt-auto flex items-center gap-1 text-sm font-medium text-brand-600">
                    Open tool <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MERGE & COMBINE PDF HUB (SEO SERP ENGINE) ────────── */}
        <MergePdfSeoSection />

        {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-zinc-900">How it works</h2>
            <p className="mt-2 text-zinc-500">Three steps from PDF to usable data</p>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Upload your PDF',
                  body: 'Drop your file or click to browse. Supports PDFs up to 500MB. Processing begins immediately in your browser.',
                },
                {
                  step: '02',
                  title: 'Choose what to do',
                  body: 'Convert to another format, extract tables and data, organize pages, or open the full workspace for advanced operations.',
                },
                {
                  step: '03',
                  title: 'Export and download',
                  body: 'Download your converted file, extracted data, or organized PDF. Temporary files are cleared when you close the tab.',
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─────────────────────────────────────────── */}
        <section className="border-t border-zinc-100 bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-zinc-900">
                Why use this platform?
              </h2>
              <p className="mt-2 text-zinc-500">
                Built around one goal: turning difficult PDFs into usable information.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-card"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-500">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── USE CASES ────────────────────────────────────────── */}
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-zinc-900">Who uses PDF Workspace?</h2>
              <p className="mt-2 text-zinc-500">Real use cases across industries and roles</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {USE_CASES.map((uc) => (
                <div key={uc.audience} className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                  <h3 className="font-semibold text-zinc-900">{uc.audience}</h3>
                  <ul className="mt-3 space-y-2">
                    {uc.cases.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-zinc-600">
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BUSINESS TOOLS SPOTLIGHT ─────────────────────────── */}
        <section className="relative overflow-hidden border-t border-indigo-800/30 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 px-4 py-16 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.3),transparent_60%)]" />
          <div className="relative mx-auto max-w-5xl text-center">
            <h2 className="text-2xl font-bold text-white">
              The strongest PDF → data tools for business documents
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-brand-100">
              BOQs, invoices, quotations, bank statements, and purchase orders — extract
              the actual data you need, not just raw text.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {[
                { label: 'BOQ to Excel', href: '/boq-pdf-to-excel' },
                { label: 'Invoice to Excel', href: '/invoice-to-excel' },
                { label: 'Quotation to Excel', href: '/quotation-to-excel' },
                { label: 'Bank Statement to Excel', href: '/bank-statement-to-excel' },
                { label: 'Tender to Excel', href: '/tender-pdf-to-excel' },
                { label: 'Purchase Order to Excel', href: '/purchase-order-to-excel' },
              ].map((t) => (
                <Link
                  key={t.href}
                  to={t.href}
                  className="rounded-full border border-brand-400 bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
                >
                  {t.label}
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/business-pdf-tools">
                <Button
                  variant="outline"
                  className="border-white bg-transparent text-white hover:bg-white hover:text-brand-700"
                  size="lg"
                >
                  Explore business tools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-zinc-900">
              Frequently asked questions
            </h2>

            <dl className="mt-10 space-y-6 divide-y divide-zinc-200">
              {FAQS.map((faq) => (
                <div key={faq.q} className="pt-6">
                  <dt className="font-semibold text-zinc-900">{faq.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-zinc-600">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ─── CTA BANNER ───────────────────────────────────────── */}
        <section className="border-t border-zinc-100 bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-zinc-900">
              Ready to get started?
            </h2>
            <p className="mt-2 text-zinc-500">
              No account required. Drop a PDF and start working immediately.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/tools">
                <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white">
                  Browse all tools
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="outline" size="lg">
                  Read PDF guides
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
