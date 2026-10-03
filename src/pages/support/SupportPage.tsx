import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { Link } from 'react-router-dom'
import { Heart, ShieldCheck, Server, Sparkles, HelpCircle, ArrowRight } from 'lucide-react'
import { DONATE_URL } from '@/lib/config'

const SUPPORT_FAQS = [
  {
    q: 'Are donations required to use any tools?',
    a: 'No, absolutely not. Every tool on PDF Guru is 100% free and runs directly in your browser without requiring an account, subscription, or payment.',
  },
  {
    q: 'How are donations processed?',
    a: 'Donations are handled securely by an external third-party payment platform. We never collect, process, or store payment or credit card details on this website.',
  },
  {
    q: 'Are donations refundable?',
    a: 'Donations are voluntary gifts to help maintain our free infrastructure and are not refundable by us unless the third-party processing platform allows it.',
  },
  {
    q: 'How else can I support PDF Guru?',
    a: 'Sharing PDF Guru with colleagues, recommending our tools, or sending us feedback and bug reports helps us immensely!',
  },
]

export default function SupportPage() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Support' }
      ]}
    >
      <MetaTags
        title="Support PDF Guru — Keep Our Tools Free & Private"
        description="Learn how voluntary community support helps keep PDF Guru 100% free, private, and accessible to everyone without ads or paywalls."
        canonical="https://pdfguru.site/support"
      />

      <div className="max-w-4xl mx-auto py-8 sm:py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-amber-500/20 text-amber-600" />
            <span>Community Supported</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Help keep PDF Guru free and private
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            PDF Guru is built on a simple promise: powerful, browser-based document tools that never upload your sensitive files and never lock features behind paywalls.
          </p>
        </div>

        {/* What Donations Pay For */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-zinc-900 dark:text-white text-base">Server & Domain Costs</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Domain registration, fast edge CDN distribution, and infrastructure maintenance to ensure rapid load times worldwide.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-zinc-900 dark:text-white text-base">Privacy & Zero Ads</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Voluntary contributions allow us to remain completely free of intrusive advertisements, affiliate popups, and user-tracking scripts.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-zinc-900 dark:text-white text-base">Continuous Improvement</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ongoing engineering to refine WebAssembly OCR performance, add new document formats, and improve table extraction precision.
            </p>
          </div>
        </div>

        {/* Action Card (Only shown if DONATE_URL is set) */}
        {DONATE_URL ? (
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Heart className="w-7 h-7 fill-amber-500/20 text-amber-600" />
            </div>
            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Support Our Free Tools</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                If PDF Guru saved you hours of manual work or helped your business, you can make an optional contribution. Any support is deeply appreciated.
              </p>
            </div>

            <div>
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors focus-visible-ring"
              >
                <Heart className="w-4 h-4 fill-white/20" />
                Support PDF Guru
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Processed securely via third-party checkout • No credit card details stored on this site
            </p>
          </div>
        ) : (
          <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Thank You for Using PDF Guru</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              All tools are completely free to use. You can support our project by sharing it with friends, recommending it to your team, or sending us feedback.
            </p>
            <div className="pt-2">
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs rounded-xl transition-colors"
              >
                Browse All Tools
              </Link>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-zinc-500">Clear and honest answers regarding our tools and donations.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {SUPPORT_FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <h3 className="font-semibold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
