import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import { Link, useLocation } from 'react-router-dom'
import { Bell, ShieldCheck, Zap, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function AuthPage() {
  const location = useLocation()
  const isSignUp = location.pathname.includes('signup')
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, toolName: isSignUp ? 'signup' : 'signin' }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setFormState('success')
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setFormState('error')
      }
    } catch {
      setErrorMsg('Could not connect. Please check your connection and try again.')
      setFormState('error')
    }
  }

  return (
    <PageLayout>
      <MetaTags
        title={isSignUp ? `Create Account — ${APP_CONFIG.name}` : `Sign In — ${APP_CONFIG.name}`}
        description={`${APP_CONFIG.name} account features are coming soon. Join the early access waitlist to be notified when user accounts launch.`}
        noindex={true}
      />

      <div className="max-w-md mx-auto py-8 sm:py-16 space-y-8">
        {/* Coming Soon Banner */}
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <span className="font-bold">Accounts are coming soon.</span> User authentication is not yet live.
            Sign up below to be notified when it launches — all standard tools work today with no login required.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3 ring-1 ring-brand-200 dark:ring-brand-800">
            <Bell className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            {isSignUp ? `Join ${APP_CONFIG.name} Early Access` : 'Get Notified at Launch'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            {isSignUp
              ? 'Enter your email to be first in line when accounts and cloud features go live.'
              : 'We\'ll email you as soon as sign-in is ready.'}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {formState === 'success' ? (
            <div className="text-center py-6 space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">You're on the list!</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                We'll notify <strong>{email}</strong> as soon as {APP_CONFIG.name} accounts launch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Your Email
                </label>
                <input
                  id="auth-email"
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={formState === 'submitting'}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-zinc-900 dark:text-white disabled:opacity-60"
                />
              </div>

              {formState === 'error' && (
                <p className="text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
              )}

              <Button type="submit" className="w-full min-h-[44px]" disabled={formState === 'submitting'}>
                {formState === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                  </span>
                ) : (
                  isSignUp ? 'Join Early Access' : 'Notify Me at Launch'
                )}
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
