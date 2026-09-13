import React, { useState, useMemo } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import JsonLd, { buildBreadcrumbSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, ArrowRight, Search, Sparkles, FileSpreadsheet, Layers, ShieldCheck, Tag, X } from 'lucide-react'

export interface ArticleMetadata {
  title: string
  slug: string
  desc: string
  readTime: string
  category: string
  updated: string
  featured?: boolean
  toolCta?: {
    name: string
    href: string
  }
}

export const LEARN_ARTICLES: ArticleMetadata[] = [
  {
    title: 'How to Convert PDF to Excel — The Complete Guide',
    slug: '/learn/how-to-convert-pdf-to-excel',
    desc: 'Why PDF table extraction is notoriously difficult, how native versus scanned documents differ, and how to extract tables cleanly without merged cell corruption.',
    readTime: '7 min read',
    category: 'Conversion',
    updated: 'Sep 2026',
    featured: true,
    toolCta: {
      name: 'Try PDF to Excel',
      href: '/pdf-to-excel',
    }
  },
  {
    title: 'How to Extract Tables from PDF Documents',
    slug: '/learn/how-to-extract-tables-from-pdf',
    desc: 'Understand bordered vs borderless tables, vertical gutter heuristics, and automated row extraction strategies for financial and research data.',
    readTime: '8 min read',
    category: 'Extraction',
    updated: 'Sep 2026',
    toolCta: {
      name: 'Open Data Extractor',
      href: '/pdf-to-data',
    }
  },
  {
    title: 'How to Convert a BOQ PDF to Excel for Construction Estimating',
    slug: '/learn/how-to-convert-boq-pdf-to-excel',
    desc: 'Step-by-step walkthrough for commercial estimators and quantity surveyors converting Bill of Quantities tenders into priced Excel takeoff models.',
    readTime: '10 min read',
    category: 'Construction',
    updated: 'Sep 2026',
    toolCta: {
      name: 'BOQ to Excel Tool',
      href: '/boq-pdf-to-excel',
    }
  },
  {
    title: 'PDF vs Scanned PDF — What is the Difference and Why Does it Matter?',
    slug: '/learn/pdf-vs-scanned-pdf',
    desc: 'The fundamental difference between glyph vector streams and raster images, the 30-second test, and why converters output blank documents on scans.',
    readTime: '5 min read',
    category: 'Core Concepts',
    updated: 'Sep 2026',
    toolCta: {
      name: 'Scanned PDF to Text',
      href: '/scanned-pdf-to-text',
    }
  },
  {
    title: 'How OCR Works on PDF Documents — From Pixels to Text',
    slug: '/learn/how-ocr-works',
    desc: 'A technical deep-dive into binarization, segmentation, Tesseract WebAssembly execution, confidence scores, and browser vs cloud trade-offs.',
    readTime: '8 min read',
    category: 'OCR Technology',
    updated: 'Sep 2026',
    toolCta: {
      name: 'Run OCR Tool',
      href: '/ocr-pdf',
    }
  },
  {
    title: 'How to Extract Invoice Data from PDF to Excel or Accounting Software',
    slug: '/learn/how-to-extract-invoice-data-from-pdf',
    desc: 'Automate accounts payable data entry. Extract invoice numbers, dates, line items, and tax amounts into structured spreadsheets without manual entry.',
    readTime: '6 min read',
    category: 'Business',
    updated: 'Sep 2026',
    toolCta: {
      name: 'Invoice to Excel',
      href: '/invoice-to-excel',
    }
  },
  {
    title: 'How to Convert Bank Statements from PDF to Excel or CSV',
    slug: '/learn/how-to-convert-bank-statement-pdf-to-excel',
    desc: 'Reconcile ledgers faster. Securely convert banking and credit card transaction histories into spreadsheets with the running balance verification check.',
    readTime: '6 min read',
    category: 'Finance',
    updated: 'Sep 2026',
    toolCta: {
      name: 'Bank Statement to Excel',
      href: '/bank-statement-to-excel',
    }
  }
]

const CATEGORIES = ['All', 'Conversion', 'Extraction', 'Construction', 'Core Concepts', 'OCR Technology', 'Business', 'Finance']

export default function LearnIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return LEARN_ARTICLES.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.desc.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const featuredArticle = LEARN_ARTICLES.find((a) => a.featured) || LEARN_ARTICLES[0]

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: APP_CONFIG.url },
    { name: 'Learn', url: `${APP_CONFIG.url}/learn` }
  ])

  return (
    <PageLayout>
      <MetaTags
        title="PDF Knowledge Base — Technical Guides, Tutorials & Data Engineering"
        description="Engineering guides and practical tutorials for PDF table extraction, OCR text recognition, Excel spreadsheet conversion, and automated document workflows."
        canonical={`${APP_CONFIG.url}/learn`}
      />
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-5xl mx-auto space-y-12 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold tracking-wide uppercase">
            <BookOpen className="w-3.5 h-3.5" /> PDF Intelligence Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Guides, Tutorials & Technical Reference
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Master document data engineering. Learn how PDF internal coordinate streams work, how OCR recognizes characters, and how to automate tabular extraction.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search guides (e.g. Excel, BOQ, OCR, Invoices, Bank Statements)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 overflow-x-auto max-w-full p-1.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/60 dark:hover:bg-zinc-700/50'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Featured Article Hero (when on All and no search) */}
        {selectedCategory === 'All' && !searchQuery && featuredArticle && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-zinc-900 to-zinc-950 p-8 sm:p-10 text-white shadow-xl border border-zinc-800">
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/20 text-brand-300 border border-brand-400/30 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Featured In-Depth Guide
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {featuredArticle.desc}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to={featuredArticle.slug}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-lg transition"
                >
                  Read the Guide <ArrowRight className="w-4 h-4" />
                </Link>
                {featuredArticle.toolCta && (
                  <Link
                    to={featuredArticle.toolCta.href}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-xl inline-flex items-center gap-1.5 backdrop-blur-sm transition"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    {featuredArticle.toolCta.name}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1">
            <span>Showing {filteredArticles.length} article(s)</span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-3">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">No articles matched your query</p>
              <p className="text-xs text-zinc-500">Try searching for generic terms like "table", "invoice", or "OCR".</p>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                }}
                className="mt-2 text-xs text-brand-600 font-semibold hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredArticles.map((article) => (
                <div
                  key={article.slug}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition group flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <Clock className="w-3.5 h-3.5" /> {article.readTime}
                      </span>
                      <span className="text-xs text-zinc-400">• Updated {article.updated}</span>
                    </div>

                    <Link to={article.slug} className="block group-hover:text-brand-600 transition">
                      <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 transition">
                        {article.title}
                      </h2>
                    </Link>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {article.desc}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 flex-shrink-0">
                    <Link
                      to={article.slug}
                      className="inline-flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 group-hover:translate-x-0.5 transition-transform"
                    >
                      Read full article <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                    {article.toolCta && (
                      <Link
                        to={article.toolCta.href}
                        className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg transition"
                      >
                        Launch {article.toolCta.name} &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
