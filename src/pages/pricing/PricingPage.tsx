import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { Link } from 'react-router-dom'
import { Check, Sparkles, Shield, HelpCircle, CreditCard, RefreshCw, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PRICING_FAQS = [
  {
    q: 'How does the billing and subscription work?',
    a: 'Subscriptions are billed automatically every month via our secure Merchant of Record, Lemon Squeezy. You get immediate access to all Pro features upon checkout.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and PayPal.'
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, absolutely. You can cancel your subscription at any time with a single click from your billing portal. There are no cancellation fees or lock-in contracts.'
  },
  {
    q: 'What is your refund policy?',
    a: 'We offer an unconditional 14-day money-back guarantee. If you are not completely satisfied with PDF Guru Pro, email us at developershoaibakhtar@gmail.com within 14 days and we will issue a full refund.'
  }
]

export default function PricingPage() {
  const checkoutUrl =
    import.meta.env.VITE_LEMON_SQUEEZY_CHECKOUT_URL ||
    'https://nexaforce1.lemonsqueezy.com/buy/0f845d4a-67b1-4f11-965a-8b8357eb456f'

  return (
    <PageLayout>
      <MetaTags
        title="Pricing — Transparent, Honest Plans | PDF Guru"
        description="Free in-browser PDF tools forever. Upgrade to Pro for high-volume invoice, BOQ, and batch extraction."
        canonical="https://pdfguru.site/pricing"
      />

      <div className="max-w-5xl mx-auto py-8 sm:py-16 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Simple & Transparent
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Fair pricing for powerful PDF workflows
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Start free in your browser with no credit card required, or unlock unlimited cloud intelligence with Pro.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Free Tier */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm relative">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                  Free Forever
                </span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-3">Browser Starter</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">For everyday document conversion and private on-device data extraction.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white">$0</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">/ forever</span>
              </div>

              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>100% Private:</strong> Client-side browser processing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>PDF to JPG, PNG, and WebP export</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Merge, Split, Rotate, and Reorder pages</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Basic Table extraction to Excel (.xlsx) & CSV</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Standard OCR (up to 10 pages per file)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>No credit card or registration required</span>
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
          <div className="bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-950/20 dark:to-zinc-900 border-2 border-brand-500/80 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative">
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md">
              Most Popular
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full">
                  Pro Access
                </span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-3">Pro Plan</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">For contractors, accountants, estimators & growing businesses.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white">$9</span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">/ month</span>
                </div>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">Billed monthly • Cancel anytime</p>
              </div>

              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span><strong>Automated BOQ & Tender Extraction:</strong> Multi-page schedules into structured Excel</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span><strong>Invoices & Receipts to Excel:</strong> Line items, tax, and vendor parsing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Unlimited high-volume Neural OCR conversions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Batch processing (upload up to 100 files simultaneously)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Priority email support (<a href="mailto:developershoaibakhtar@gmail.com" className="underline">direct response</a>)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span><strong>14-Day Money-Back Guarantee:</strong> 100% risk-free</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 space-y-3">
              <Button asChild className="w-full min-h-[46px] bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-lg shadow-brand-500/20">
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                  Upgrade to Pro Now
                </a>
              </Button>
              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-600" />
                Secured by Lemon Squeezy • 256-bit SSL
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="max-w-4xl mx-auto p-6 bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">
              100% Risk-Free 14-Day Money-Back Guarantee
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              We want you to love PDF Guru Pro. If it doesn't save you hours of work, email{' '}
              <a href="mailto:developershoaibakhtar@gmail.com" className="font-semibold underline text-brand-600 dark:text-brand-400">
                developershoaibakhtar@gmail.com
              </a>{' '}
              within 14 days and we will issue a full refund immediately.
            </p>
          </div>
        </div>

        {/* Payment Methods Badges */}
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Supported Secure Payment Options</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Visa & MasterCard
            </span>
            <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
              Apple Pay
            </span>
            <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
              Google Pay
            </span>
            <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
              PayPal
            </span>
            <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
              American Express
            </span>
          </div>
        </div>

        {/* Pricing FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-zinc-500">Everything you need to know about our billing and refund policy.</p>
          </div>

          <div className="space-y-4">
            {PRICING_FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 bg-zinc-50 dark:bg-zinc-850 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <h3 className="font-semibold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-zinc-500 pt-4">
            Have questions before subscribing? Contact us at{' '}
            <a href="mailto:developershoaibakhtar@gmail.com" className="text-brand-600 dark:text-brand-400 font-semibold underline">
              developershoaibakhtar@gmail.com
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
