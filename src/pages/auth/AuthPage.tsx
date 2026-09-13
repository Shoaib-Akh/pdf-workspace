import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { Link, useLocation } from 'react-router-dom'
import { Lock, ShieldCheck, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthPage() {
  const location = useLocation()
  const isSignUp = location.pathname.includes('signup')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <PageLayout>
      <MetaTags
        title={isSignUp ? 'Create an Account — PDF Workspace' : 'Sign In — PDF Workspace'}
        description="Access cloud processing features, batch conversion queues, and saved workspace preferences."
      />

      <div className="max-w-md mx-auto py-8 sm:py-16 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3 ring-1 ring-brand-200 dark:ring-brand-800">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            {isSignUp ? 'Get Started with PDF Workspace' : 'Welcome Back'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            {isSignUp
              ? 'Join to sync preferences across devices and access cloud features.'
              : 'Sign in to access your cloud tier settings and priority queues.'}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Check Your Inbox</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                We've sent a secure magic sign-in link to <strong>{email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Work Email</label>
                <input
                  id="auth-email"
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-zinc-900 dark:text-white"
                />
              </div>

              <Button type="submit" className="w-full min-h-[44px]">
                {isSignUp ? 'Create Free Account' : 'Sign In with Magic Link'}
              </Button>
            </form>
          )}

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1 text-center">
            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              No account required for standard tools!
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              All browser converters, extractors, and organize tools work 100% free with no login.
            </p>
            <div className="pt-2">
              <Link to="/tools" className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1">
                Browse All Tools <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
