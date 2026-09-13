import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { Link } from 'react-router-dom'
import { Check, Sparkles, Shield, Cpu, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  return (
    <PageLayout>
      <MetaTags
        title="Pricing — Transparent, Honest Plans"
        description="Free in-browser PDF tools forever. Optional cloud tier for complex layout conversions and high-volume automation."
        canonical="https://pdfworkspace.app/pricing"
      />

      <div className="max-w-5xl mx-auto py-8 sm:py-16 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Simple & Transparent
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Free in your browser. Powerful in the cloud.
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            All our standard tools run 100% locally on your device via WebAssembly. No hidden fees, no document uploads, no credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Free Tier */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm relative">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                  Free Forever
                </span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-3">Browser Tier</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">For everyday document conversion and private data extraction.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white">$0</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">/ forever</span>
              </div>

              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>100% Private:</strong> Files never leave your device</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>PDF to JPG, PNG, WebP image export</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Merge, Split, Rotate, Delete, Reorder pages</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Extract tables to Excel (.xlsx) & CSV</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Tesseract.js WebAssembly OCR (up to 10 pages/doc)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>No account or sign-in required</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button asChild className="w-full min-h-[44px]" variant="outline">
                <Link to="/tools">Start Using Free Tools</Link>
              </Button>
            </div>
          </div>

          {/* Cloud Pro Tier */}
          <div className="bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-950/20 dark:to-zinc-900 border-2 border-brand-500/40 rounded-3xl p-8 flex flex-col justify-between shadow-md relative">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm">
              Coming Soon
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full">
                  Cloud Pro
                </span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-3">High-Volume Tier</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">For accounting firms, construction estimators & large archives.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white">$9</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">/ month (planned)</span>
              </div>

              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span><strong>Native Word (.docx)</strong> layout-preserving conversion</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Unlimited multi-page neural OCR in the cloud</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Batch processing (upload up to 100 files simultaneously)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Automated multi-page BOQ & Invoice ERP sync</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>REST API access for developer automation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Enterprise SOC 2 certified auto-purge guarantees</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button asChild className="w-full min-h-[44px]">
                <Link to="/tools/pdf-to-word#waitlist">Join Cloud Waitlist</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
