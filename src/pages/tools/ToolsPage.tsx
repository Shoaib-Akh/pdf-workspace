import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  Globe,
  Cloud,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Table as TableIcon,
  Code,
  Layout,
  Database,
  FileSpreadsheet,
  Presentation,
  Book,
  Split,
  RotateCw,
  Trash2,
  Copy,
  Move,
  Droplet,
  Hash,
  Lock,
  Unlock,
  Receipt,
  Landmark,
  List,
  ShoppingCart,
  PieChart,
  Tag,
  HardHat,
  ClipboardList,
  Calculator,
  ListChecks,
  Zap,
  Sparkles,
  Layers,
  X
} from 'lucide-react'
import { ALL_TOOLS, getToolsByCategory } from '@/data/tools'
import { MetaTags } from '@/components/seo/MetaTags'
import { PageLayout } from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import type { ToolDefinition } from '@/types'

const CATEGORIES = [
  'All',
  'Convert',
  'Extract',
  'Organize',
  'OCR',
  'Business',
  'Construction',
  'Images',
  'Security'
]

function getToolIcon(iconName: string) {
  const iconProps = { className: 'w-5 h-5 text-brand-600 dark:text-brand-400' }

  switch (iconName) {
    case 'image':
    case 'images':
    case 'file-image':
      return <ImageIcon {...iconProps} />
    case 'table':
      return <TableIcon {...iconProps} />
    case 'code':
      return <Code {...iconProps} />
    case 'layout':
      return <Layout {...iconProps} />
    case 'database':
      return <Database {...iconProps} />
    case 'file-word':
      return <FileText {...iconProps} />
    case 'file-spreadsheet':
      return <FileSpreadsheet {...iconProps} />
    case 'presentation':
      return <Presentation {...iconProps} />
    case 'book':
      return <Book {...iconProps} />
    case 'combine':
      return <Layers {...iconProps} />
    case 'split':
      return <Split {...iconProps} />
    case 'minimize':
      return <Sparkles {...iconProps} />
    case 'rotate-cw':
      return <RotateCw {...iconProps} />
    case 'trash':
      return <Trash2 {...iconProps} />
    case 'copy':
      return <Copy {...iconProps} />
    case 'move':
      return <Move {...iconProps} />
    case 'droplet':
      return <Droplet {...iconProps} />
    case 'hash':
      return <Hash {...iconProps} />
    case 'lock':
      return <Lock {...iconProps} />
    case 'unlock':
      return <Unlock {...iconProps} />
    case 'receipt':
      return <Receipt {...iconProps} />
    case 'landmark':
      return <Landmark {...iconProps} />
    case 'list':
      return <List {...iconProps} />
    case 'shopping-cart':
      return <ShoppingCart {...iconProps} />
    case 'pie-chart':
      return <PieChart {...iconProps} />
    case 'tag':
      return <Tag {...iconProps} />
    case 'hard-hat':
      return <HardHat {...iconProps} />
    case 'clipboard-list':
      return <ClipboardList {...iconProps} />
    case 'calculator':
      return <Calculator {...iconProps} />
    case 'list-checks':
      return <ListChecks {...iconProps} />
    case 'zap':
    case 'scan-text':
      return <Zap {...iconProps} />
    default:
      return <FileText {...iconProps} />
  }
}

interface ToolsPageProps {
  initialCategory?: string
}

export function ToolsPage({ initialCategory }: ToolsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  
  const startingCategory = useMemo(() => {
    const query = categoryFromUrl || initialCategory
    if (!query) return 'All'
    const found = CATEGORIES.find(c => c.toLowerCase() === query.toLowerCase())
    return found || 'All'
  }, [categoryFromUrl, initialCategory])

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(startingCategory)

  // Sync state if category prop or URL param changes
  React.useEffect(() => {
    if (initialCategory) {
      const found = CATEGORIES.find(c => c.toLowerCase() === initialCategory.toLowerCase())
      if (found) setActiveCategory(found)
    } else if (categoryFromUrl) {
      const found = CATEGORIES.find(c => c.toLowerCase() === categoryFromUrl.toLowerCase())
      if (found) setActiveCategory(found)
    } else {
      setActiveCategory('All')
    }
  }, [initialCategory, categoryFromUrl])

  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return ALL_TOOLS.filter((tool) => {
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      const matchesCategory =
        activeCategory === 'All' || tool.category.toLowerCase() === activeCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, ToolDefinition[]> = {}

    if (activeCategory === 'All' && !searchQuery.trim()) {
      CATEGORIES.filter((c) => c !== 'All').forEach((cat) => {
        const tools = getToolsByCategory(cat)
        if (tools.length > 0) {
          grouped[cat] = tools
        }
      })
      return grouped
    }

    // When searching or category filtered:
    filteredTools.forEach((tool) => {
      const matchedCat =
        CATEGORIES.find((c) => c.toLowerCase() === tool.category.toLowerCase()) || 'Other'
      if (!grouped[matchedCat]) grouped[matchedCat] = []
      grouped[matchedCat].push(tool)
    })

    return grouped
  }, [filteredTools, activeCategory, searchQuery])

  const totalMatchingTools = filteredTools.length

  const headerInfo = useMemo(() => {
    switch (activeCategory) {
      case 'Convert':
        return {
          title: 'Convert PDF Tools — Free In-Browser PDF Converters',
          h1: 'Convert PDF Tools',
          desc: 'Convert PDF files to Word, Excel, JPG, PNG, Text, CSV, JSON, and Markdown directly in your browser without uploading to a third-party server.',
          canonical: `${APP_CONFIG.url}/convert`
        }
      case 'Extract':
        return {
          title: 'Extract PDF Data Tools — Tables, Text & Fields',
          h1: 'PDF Extraction Tools',
          desc: 'Extract structured tables, numbers, key-value fields, and plain text from PDF documents into Excel, CSV, and JSON.',
          canonical: `${APP_CONFIG.url}/extract`
        }
      case 'Organize':
        return {
          title: 'Organize PDF Tools — Merge, Split, Rotate & Compress',
          h1: 'Organize PDF Tools',
          desc: 'Rearrange, combine, separate, rotate, watermark, and compress PDF documents privately in your browser.',
          canonical: `${APP_CONFIG.url}/organize`
        }
      case 'OCR':
        return {
          title: 'OCR & Scanned PDF Tools — Optical Character Recognition',
          h1: 'OCR & Scanned PDF Tools',
          desc: 'Transform scanned PDFs and paper photos into searchable text and editable documents using in-browser WebAssembly OCR.',
          canonical: `${APP_CONFIG.url}/ocr`
        }
      case 'Business':
        return {
          title: 'Business PDF Tools — Invoices, BOQs & Bank Statements',
          h1: 'Business Document Tools',
          desc: 'Specialized data extraction tools for financial statements, supplier invoices, construction BOQs, and quotations.',
          canonical: `${APP_CONFIG.url}/business`
        }
      case 'Construction':
        return {
          title: 'Construction PDF Tools — BOQs, Quantity Surveys & Estimates',
          h1: 'Construction PDF Tools',
          desc: 'Extract line items, quantities, and rates from construction drawings, tender schedules, and quantity surveyor documents.',
          canonical: `${APP_CONFIG.url}/construction`
        }
      default:
        return {
          title: 'All PDF Tools — Convert, Extract, Organize, OCR',
          h1: 'All PDF Tools',
          desc: 'Every tool for working with PDFs — from simple format conversions to extracting structured data from invoices, BOQs, and business documents.',
          canonical: `${APP_CONFIG.url}/tools`
        }
    }
  }, [activeCategory])

  return (
    <PageLayout>
      <MetaTags
        title={headerInfo.title}
        description={headerInfo.desc}
        canonical={headerInfo.canonical}
      />

      <div className="py-4 sm:py-8 space-y-10">
        {/* Hero header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
            {headerInfo.h1}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            {headerInfo.desc}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by tool name, format, or task (e.g. Excel, BOQ, OCR, Merge)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm sm:text-base transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 overflow-x-auto max-w-full p-1.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 scrollbar-none">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/60 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Area */}
        {Object.keys(toolsByCategory).length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-zinc-900 dark:text-zinc-100 font-semibold text-lg">
              No tools found matching "{searchQuery}"
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
              We couldn't find any PDF tools matching your search criteria. Try a different keyword or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
              }}
              className="mt-2 inline-flex items-center px-4 py-2 bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 font-semibold text-xs rounded-xl hover:bg-brand-100 transition"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(toolsByCategory).map(([category, tools]) => (
              <section key={category} className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white capitalize">
                      {category === 'OCR' ? 'OCR & Scanned PDF' : `${category} PDF`}
                    </h2>
                    <span className="inline-flex items-center justify-center bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-full px-2.5 py-0.5 text-xs font-bold">
                      {tools.length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      to={`/${tool.slug}`}
                      className="group relative flex flex-col justify-between bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 transition-all duration-200 hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 hover:-translate-y-0.5"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center border border-brand-100 dark:border-brand-900/50 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/40 transition">
                            {getToolIcon(tool.icon)}
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {tool.featured && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                Featured
                              </span>
                            )}
                            {tool.processingMode === 'browser' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <Globe className="w-2.5 h-2.5 mr-1" />
                                Browser
                              </span>
                            ) : tool.processingMode === 'server' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                <Cloud className="w-2.5 h-2.5 mr-1" />
                                Server
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
                        <span>Open Tool</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Footer Banner */}
        <div className="mt-16 text-center border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Looking for an automated workflow or batch document processing API?
          </p>
          <a
            href="mailto:support@pdfworkspace.app?subject=Tool%20Request%20or%20Enterprise"
            className="mt-2 inline-flex items-center text-brand-600 dark:text-brand-400 font-semibold text-sm hover:underline"
          >
            Contact us for custom integrations <ArrowRight className="ml-1.5 w-4 h-4" />
          </a>
        </div>
      </div>
    </PageLayout>
  )
}

export default ToolsPage
