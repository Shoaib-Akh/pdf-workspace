import { Link } from 'react-router-dom'
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  FileText,
  Images,
  CheckCircle2,
  Lock,
  ArrowUpDown,
  Download,
  HelpCircle,
} from 'lucide-react'

// All high-intent search keys mapped to corresponding routes
const POPULAR_SEARCH_TAGS = [
  { label: 'Merge PDF Online', to: '/merge-pdf' },
  { label: 'Combine PDFs', to: '/merge-pdf' },
  { label: 'Free PDF Combiner', to: '/merge-pdf' },
  { label: 'PDF Merger Free', to: '/merge-pdf' },
  { label: 'Merge Multiple PDF into One', to: '/merge-pdf' },
  { label: 'Merge PDF Documents Free', to: '/merge-pdf' },
  { label: 'Combine PDF Files Free', to: '/merge-pdf' },
  { label: 'Merge Two PDF', to: '/merge-pdf' },
  { label: 'PDF Merge to PDF Online', to: '/merge-pdf' },
  { label: 'Combine PDF to PDF Online', to: '/merge-pdf' },
  { label: 'Merge PDF Files Online', to: '/merge-pdf' },
  { label: 'Combined PDF Documents', to: '/merge-pdf' },
  { label: 'Merge Images to PDF', to: '/images-to-pdf' },
  { label: 'Merge Photos to PDF', to: '/images-to-pdf' },
  { label: 'Merge PNG to PDF', to: '/png-to-pdf' },
  { label: 'PDF Combine Software Free', to: '/merge-pdf' },
  { label: 'Merge PDF Freeware', to: '/merge-pdf' },
  { label: 'PDF Combine Files', to: '/merge-pdf' },
  { label: 'Merge Multiple PDF Online Free', to: '/merge-pdf' },
  { label: 'Free PDF Merger', to: '/merge-pdf' },
]

export const MERGE_PDF_FAQS = [
  {
    q: 'How to merge multiple PDF files into one online for free?',
    a: 'Open the Merge PDF tool, select or drag and drop two or more PDF files into the upload area, arrange the files in your preferred reading order with the up/down controls, and click "Merge PDFs". Your combined PDF file is generated instantly in your browser and downloaded with zero watermark.',
  },
  {
    q: 'How to combine PDF files without downloading software?',
    a: 'You do not need to install desktop software or freeware. Our web-based PDF combiner runs entirely inside your modern web browser using client-side JavaScript and WebAssembly. It works on macOS, Windows, Linux, Chromebook, iOS, and Android.',
  },
  {
    q: 'Can I merge photos, images, and PNG or JPG files to PDF?',
    a: 'Yes. Use our Images to PDF tool or PNG to PDF tool to combine photos, scans, and graphic files (PNG, JPG, WebP) into a single, multi-page PDF document. You can also convert images to PDF first and then merge them with existing PDF reports.',
  },
  {
    q: 'How to merge two PDF files together quickly?',
    a: 'Simply drop both PDF documents into the merger. The tool displays a clear file list showing page orders. Check the file sequence, tap "Merge PDFs", and download your combined document in under 3 seconds.',
  },
  {
    q: 'Is it safe to merge confidential PDF documents here?',
    a: 'Yes, 100%. Unlike conventional online PDF merger websites that upload your files to remote third-party cloud servers, our merger processes your files completely in your local browser memory. Your contracts, bank statements, and personal files never leave your computer.',
  },
  {
    q: 'Is there any limit on file count or size when combining PDFs?',
    a: 'There is no artificial page or document limit. You can combine 2, 10, or dozens of PDF files up to your device memory capacity (typically several hundred megabytes). All features are completely free with no signup or credit card required.',
  },
]

export default function MergePdfSeoSection() {
  return (
    <section className="border-t border-zinc-200/80 bg-gradient-to-b from-white via-zinc-50/50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Header Badge & Intro */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 shadow-sm">
            <Layers className="h-3.5 w-3.5 text-brand-600" />
            <span>Fast In-Browser PDF Merger & Combiner</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Merge PDF Online Free —{' '}
            <span className="text-brand-600">Combine Multiple PDFs into One</span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
            Got multiple PDF documents that belong together? Combine PDF files, merge two or
            more documents, or bind photos and PNG images into a single organized PDF.
            Zero file uploads, no software installation, and completely free.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/merge-pdf"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-all hover:shadow-md"
            >
              <Layers className="h-4 w-4" />
              Open PDF Merger Tool
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/images-to-pdf"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
            >
              <Images className="h-4 w-4 text-zinc-500" />
              Merge Images to PDF
            </Link>
          </div>
        </div>

        {/* Quick Search Intent Tags (SERP Keywords) */}
        <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800">
                Popular PDF Merge & Combine Searches
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Instant access to free PDF merging, file combining, and photo-to-PDF tools
              </p>
            </div>
            <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md self-start sm:self-auto">
              100% Free • No Signup
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <Link
                key={tag.label}
                to={tag.to}
                className="group inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all"
                title={`Use ${tag.label}`}
              >
                <span>{tag.label}</span>
                <ArrowRight className="h-3 w-3 text-zinc-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* 3 Steps: How to Merge Multiple PDF Files */}
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-zinc-900">
              How to Combine Multiple PDF Files in 3 Easy Steps
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Simple, reliable document combining directly on your computer or mobile device
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 font-bold text-brand-700 text-base">
                1
              </div>
              <h4 className="mt-4 font-semibold text-zinc-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-600" />
                Select PDF Documents
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Click upload or drag and drop two or more PDF files. You can combine multiple
                invoices, reports, bank statements, or contracts into one unified document.
              </p>
            </div>

            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 font-bold text-brand-700 text-base">
                2
              </div>
              <h4 className="mt-4 font-semibold text-zinc-900 flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-brand-600" />
                Arrange Document Order
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Easily move files up or down in the list to match your exact reading order. Remove
                unwanted pages or files before merging with a single click.
              </p>
            </div>

            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 font-bold text-brand-700 text-base">
                3
              </div>
              <h4 className="mt-4 font-semibold text-zinc-900 flex items-center gap-2">
                <Download className="h-4 w-4 text-brand-600" />
                Combine & Download
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Click <strong>Merge PDFs</strong>. The client-side engine stitches all pages
                together in seconds. Download your clean, unwatermarked PDF immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Comparison / Highlights (Authentic, Practical Content) */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-semibold text-zinc-900 text-sm">100% Client-Side Privacy</h4>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              No server uploads. Your PDF files never leave your device memory, keeping confidential
              financial, legal, and personal documents secure.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-semibold text-zinc-900 text-sm">Instant Local Merging</h4>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              No upload wait times or server rendering queues. Merging happens directly on your CPU
              using WebAssembly for high-speed page assembly.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Images className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-semibold text-zinc-900 text-sm">Merge Photos & PNG Files</h4>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              Easily convert and stitch PNG, JPG, and mobile photos into a single PDF alongside your
              existing documents and scans.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-semibold text-zinc-900 text-sm">No Watermarks or Subscriptions</h4>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              Unlike trial software and freeware with hidden limits, our tools are 100% free with no
              watermarks, account requirements, or daily quotas.
            </p>
          </div>
        </div>

        {/* Merge PDF SERP FAQ Block */}
        <div className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-5 w-5 text-brand-600" />
              <h3 className="text-xl font-bold text-zinc-900">
                PDF Merge & Combiner — Frequently Asked Questions
              </h3>
            </div>
            <p className="text-sm text-zinc-500 mb-8">
              Everything you need to know about combining and merging PDF files online.
            </p>

            <div className="space-y-6 divide-y divide-zinc-200/80">
              {MERGE_PDF_FAQS.map((faq, idx) => (
                <div key={idx} className={idx === 0 ? '' : 'pt-6'}>
                  <h4 className="text-sm font-semibold text-zinc-900 flex items-start gap-2">
                    <span className="text-brand-600 font-bold shrink-0">Q:</span>
                    {faq.q}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 pl-5">{faq.a}</p>
                </div>
              ))}
            </div>

            {/* Direct Tool CTA */}
            <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-zinc-900 text-sm">
                  Ready to combine your PDF documents?
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Start merging now — fast, free, and private.
                </p>
              </div>
              <Link
                to="/merge-pdf"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-brand-700 transition-colors"
              >
                Merge PDFs Now
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
