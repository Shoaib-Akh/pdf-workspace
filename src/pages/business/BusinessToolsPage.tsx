import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import DropZone from '@/components/upload/DropZone'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'
import { 
  Receipt, 
  FileSpreadsheet, 
  Building2, 
  CreditCard, 
  ShoppingCart, 
  FileText, 
  DollarSign, 
  Calculator, 
  Tag, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

const businessTools = [
  {
    name: 'Invoice to Excel',
    desc: 'Extract header fields, line items, VAT/taxes, vendor details, and totals into structured spreadsheets.',
    path: '/invoice-to-excel',
    icon: Receipt,
    badge: 'Finance'
  },
  {
    name: 'BOQ PDF to Excel',
    desc: 'Extract complex Bill of Quantities, item descriptions, unit rates, quantities, and section subtotals.',
    path: '/boq-pdf-to-excel',
    icon: Building2,
    badge: 'Construction'
  },
  {
    name: 'Bank Statement to Excel',
    desc: 'Convert bank statements into clean tabular transaction rows with dates, descriptions, and debit/credit amounts.',
    path: '/bank-statement-to-excel',
    icon: CreditCard,
    badge: 'Banking'
  },
  {
    name: 'Quotation to Excel',
    desc: 'Extract price quotes, scope deliverables, materials pricing, and terms into comparison spreadsheets.',
    path: '/quotation-to-excel',
    icon: DollarSign,
    badge: 'Sales'
  },
  {
    name: 'Receipt to Excel',
    desc: 'Parse merchant receipts, expenses, sales tax figures, and payment types for streamlined book-keeping.',
    path: '/receipt-to-excel',
    icon: Tag,
    badge: 'Expenses'
  },
  {
    name: 'Purchase Order to Excel',
    desc: 'Extract PO numbers, vendor information, item codes, deliver-to addresses, and line totals.',
    path: '/purchase-order-to-excel',
    icon: ShoppingCart,
    badge: 'Procurement'
  },
  {
    name: 'Tender PDF to Excel',
    desc: 'Convert procurement tender documents, schedule of rates, and contractor bid items into Excel sheets.',
    path: '/tender-pdf-to-excel',
    icon: FileText,
    badge: 'Bidding'
  },
  {
    name: 'Expense Report to Excel',
    desc: 'Consolidate multiple employee expense reports, travel receipts, and meal records into unified audit sheets.',
    path: '/expense-report-to-excel',
    icon: Calculator,
    badge: 'Accounting'
  },
  {
    name: 'Price List to Excel',
    desc: 'Extract product catalogs, SKU matrices, tiered pricing tables, and inventory lists from distributor PDFs.',
    path: '/price-list-pdf-to-excel',
    icon: FileSpreadsheet,
    badge: 'Commerce'
  }
]

export default function BusinessToolsPage() {
  return (
    <PageLayout>
      <MetaTags
        title="Business PDF Tools — Extract Data from Business Documents"
        description="Suite of intelligent PDF document extractors for business: Invoices, Bank Statements, BOQs, Quotations, Purchase Orders, and Tenders to Excel."
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="browser" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Business PDF Tools — Extract Business Document Data
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Eliminate manual data entry across your finance, operations, and estimation teams. Our specialized document intelligence extractors recognize business document layouts and output structured Excel workbooks.
          </p>
        </div>

        {/* 9 Business Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessTools.map((tool, idx) => {
            const Icon = tool.icon
            return (
              <Link
                key={idx}
                to={tool.path}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition">
                    {tool.name}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  Launch Extractor <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Security & Privacy Banner */}
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Enterprise Data Security & Confidentiality
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Proprietary financial figures, confidential contractor rates, and personal banking transactions never get harvested, logged, or retained. Browser-based extraction happens on your device in real-time.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
