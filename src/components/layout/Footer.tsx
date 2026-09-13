import React from "react"
import { Link } from "react-router-dom"
import { FileText, ShieldCheck, Cpu, Zap, ArrowRight, Lock } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Architecture Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-zinc-800/80 items-start">
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="PDF Workspace Home">
              <div className="bg-red-600 text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center shadow-sm shadow-red-500/20">
                <FileText size={18} className="mr-1" /> PDF
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                PDF Workspace
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              The high-performance, privacy-first PDF intelligence platform. Convert, organize, and extract structured data from PDF documents directly in your browser.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Client-Side Privacy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/60 text-blue-400 border border-blue-800/50">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                WebAssembly Engine
              </span>
            </div>
          </div>

          {/* Quick Category Hub Navigation Pills */}
          <div className="lg:col-span-8 bg-zinc-900/80 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Explore Tool Categories
              </h4>
              <Link to="/tools" className="text-xs font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1">
                Browse All 49 Tools <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/convert" className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors">
                Convert PDF
              </Link>
              <Link to="/extract" className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors">
                Data Extractor
              </Link>
              <Link to="/organize" className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors">
                Organize PDF
              </Link>
              <Link to="/business" className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors">
                Business & Invoices
              </Link>
              <Link to="/construction" className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors">
                BOQ & Construction
              </Link>
              <Link to="/ocr" className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors">
                WASM OCR
              </Link>
              <Link to="/images" className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors">
                Image Converters
              </Link>
              <Link to="/security" className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors">
                Security & Protect
              </Link>
              <Link to="/workspace" className="px-3 py-1.5 rounded-lg bg-brand-950/70 text-brand-300 border border-brand-800/60 text-xs font-semibold hover:bg-brand-900/70 transition-colors">
                Interactive Workspace
              </Link>
            </div>
          </div>
        </div>

        {/* Master Directory Columns (All Pages & Tools) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 py-12 border-b border-zinc-800/80 text-sm">
          {/* Column 1: Convert PDF */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white tracking-wide text-xs uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
              Convert
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/pdf-to-word" className="hover:text-white transition-colors">PDF to Word</Link></li>
              <li><Link to="/pdf-to-excel" className="hover:text-white transition-colors">PDF to Excel</Link></li>
              <li><Link to="/pdf-to-jpg" className="hover:text-white transition-colors">PDF to JPG</Link></li>
              <li><Link to="/pdf-to-png" className="hover:text-white transition-colors">PDF to PNG</Link></li>
              <li><Link to="/pdf-to-webp" className="hover:text-white transition-colors">PDF to WebP</Link></li>
              <li><Link to="/pdf-to-txt" className="hover:text-white transition-colors">PDF to Text</Link></li>
              <li><Link to="/pdf-to-csv" className="hover:text-white transition-colors">PDF to CSV</Link></li>
              <li><Link to="/pdf-to-json" className="hover:text-white transition-colors">PDF to JSON</Link></li>
              <li><Link to="/pdf-to-html" className="hover:text-white transition-colors">PDF to HTML</Link></li>
              <li><Link to="/pdf-to-markdown" className="hover:text-white transition-colors">PDF to Markdown</Link></li>
              <li><Link to="/pdf-to-powerpoint" className="hover:text-white transition-colors">PDF to PPT</Link></li>
              <li><Link to="/jpg-to-pdf" className="hover:text-white transition-colors">JPG to PDF</Link></li>
              <li><Link to="/images-to-pdf" className="hover:text-white transition-colors">Images to PDF</Link></li>
              <li><Link to="/convert" className="text-brand-400 hover:text-brand-300 font-medium">All Converters →</Link></li>
            </ul>
          </div>

          {/* Column 2: Extract & Tables */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white tracking-wide text-xs uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Extract Data
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/pdf-to-data" className="hover:text-white transition-colors">PDF Data Extractor</Link></li>
              <li><Link to="/boq-pdf-to-excel" className="hover:text-white transition-colors">BOQ to Excel</Link></li>
              <li><Link to="/invoice-to-excel" className="hover:text-white transition-colors">Invoice to Excel</Link></li>
              <li><Link to="/bank-statement-to-excel" className="hover:text-white transition-colors">Bank Statement</Link></li>
              <li><Link to="/receipt-to-excel" className="hover:text-white transition-colors">Receipt to Excel</Link></li>
              <li><Link to="/quotation-to-excel" className="hover:text-white transition-colors">Quotation to Excel</Link></li>
              <li><Link to="/purchase-order-to-excel" className="hover:text-white transition-colors">Purchase Order</Link></li>
              <li><Link to="/expense-report-to-excel" className="hover:text-white transition-colors">Expense Report</Link></li>
              <li><Link to="/price-list-pdf-to-excel" className="hover:text-white transition-colors">Price List to Excel</Link></li>
              <li><Link to="/extract" className="text-brand-400 hover:text-brand-300 font-medium">All Extractors →</Link></li>
            </ul>
          </div>

          {/* Column 3: Organize */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white tracking-wide text-xs uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Organize
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/merge-pdf" className="hover:text-white transition-colors">Merge PDF</Link></li>
              <li><Link to="/split-pdf" className="hover:text-white transition-colors">Split PDF</Link></li>
              <li><Link to="/compress-pdf" className="hover:text-white transition-colors">Compress PDF</Link></li>
              <li><Link to="/rotate-pdf" className="hover:text-white transition-colors">Rotate PDF</Link></li>
              <li><Link to="/delete-pdf-pages" className="hover:text-white transition-colors">Delete Pages</Link></li>
              <li><Link to="/extract-pdf-pages" className="hover:text-white transition-colors">Extract Pages</Link></li>
              <li><Link to="/reorder-pdf-pages" className="hover:text-white transition-colors">Reorder Pages</Link></li>
              <li><Link to="/watermark-pdf" className="hover:text-white transition-colors">Watermark PDF</Link></li>
              <li><Link to="/add-page-numbers" className="hover:text-white transition-colors">Page Numbers</Link></li>
              <li><Link to="/password-protect-pdf" className="hover:text-white transition-colors">Protect PDF</Link></li>
              <li><Link to="/unlock-pdf" className="hover:text-white transition-colors">Unlock PDF</Link></li>
              <li><Link to="/organize" className="text-brand-400 hover:text-brand-300 font-medium">All Organize Tools →</Link></li>
            </ul>
          </div>

          {/* Column 4: Construction & OCR */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white tracking-wide text-xs uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              OCR & BOQ
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/ocr-pdf" className="hover:text-white transition-colors">OCR PDF (WASM)</Link></li>
              <li><Link to="/scanned-pdf-to-text" className="hover:text-white transition-colors">Scanned to Text</Link></li>
              <li><Link to="/scanned-pdf-to-word" className="hover:text-white transition-colors">Scanned to Word</Link></li>
              <li><Link to="/scanned-pdf-to-excel" className="hover:text-white transition-colors">Scanned to Excel</Link></li>
              <li><Link to="/construction-pdf-to-excel" className="hover:text-white transition-colors">Construction BOQ</Link></li>
              <li><Link to="/quantity-survey-pdf-to-excel" className="hover:text-white transition-colors">Quantity Survey</Link></li>
              <li><Link to="/estimate-pdf-to-excel" className="hover:text-white transition-colors">Estimate to Excel</Link></li>
              <li><Link to="/tender-pdf-to-excel" className="hover:text-white transition-colors">Tender to Excel</Link></li>
              <li><Link to="/bill-of-quantities-to-excel" className="hover:text-white transition-colors">Bill of Quantities</Link></li>
              <li><Link to="/boq-extractor" className="hover:text-white transition-colors">BOQ Extractor</Link></li>
              <li><Link to="/ocr" className="text-brand-400 hover:text-brand-300 font-medium">All OCR Tools →</Link></li>
            </ul>
          </div>

          {/* Column 5: Learn & Guides */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white tracking-wide text-xs uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
              Learn & Guides
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/learn" className="hover:text-white transition-colors">All PDF Guides</Link></li>
              <li><Link to="/learn/how-to-convert-pdf-to-excel" className="hover:text-white transition-colors">Convert PDF to Excel</Link></li>
              <li><Link to="/learn/how-to-extract-tables-from-pdf" className="hover:text-white transition-colors">Extract PDF Tables</Link></li>
              <li><Link to="/learn/how-to-convert-boq-pdf-to-excel" className="hover:text-white transition-colors">BOQ to Excel Guide</Link></li>
              <li><Link to="/learn/pdf-vs-scanned-pdf" className="hover:text-white transition-colors">Text vs Scanned PDF</Link></li>
              <li><Link to="/learn/how-ocr-works" className="hover:text-white transition-colors">How Browser OCR Works</Link></li>
              <li><Link to="/learn/how-to-extract-invoice-data-from-pdf" className="hover:text-white transition-colors">Extract Invoice Data</Link></li>
              <li><Link to="/learn/how-to-convert-bank-statement-pdf-to-excel" className="hover:text-white transition-colors">Bank Statement Guide</Link></li>
            </ul>
          </div>

          {/* Column 6: Platform & Legal */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white tracking-wide text-xs uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/tools" className="hover:text-white transition-colors">Tools Directory (49)</Link></li>
              <li><Link to="/workspace" className="hover:text-white transition-colors">Live Workspace</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing & Plans</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/signin" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Privacy Promise Notice */}
        <div className="mt-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-zinc-800 text-emerald-400 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">
                Zero Document Retention & Local Browser Security
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                For browser tools, your PDF never touches a server — all parsing, rendering, and table extraction happens locally in your device's memory.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs">
            <Link to="/privacy" className="text-zinc-300 hover:text-white underline underline-offset-2">
              Privacy Architecture
            </Link>
            <span className="text-zinc-700">•</span>
            <Link to="/pricing" className="text-zinc-300 hover:text-white underline underline-offset-2">
              Free vs Cloud
            </Link>
          </div>
        </div>

        {/* Bottom Copyright & Status */}
        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p>&copy; {currentYear} PDF Workspace. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-zinc-300 transition-colors">Contact</Link>
            <Link to="/tools" className="hover:text-zinc-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
