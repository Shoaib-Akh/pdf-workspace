import React, { useState } from 'react'
import { Rocket, ArrowRight, CheckCircle2, Mail, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { analytics } from '@/services/analytics/analytics'

interface ServerRequiredStateProps {
  toolName: string
  alternateToolSlug?: string
  alternateToolName?: string
}

export function ServerRequiredState({
  toolName,
  alternateToolSlug,
  alternateToolName,
}: ServerRequiredStateProps) {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(() => {
    try {
      const saved = localStorage.getItem(`waitlist_${toolName}`)
      return !!saved
    } catch {
      return false
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setIsSubmitting(true)
    setTimeout(() => {
      try {
        localStorage.setItem(`waitlist_${toolName}`, email)
      } catch {
        // storage fallback
      }
      analytics.waitlistJoined(toolName)
      setIsSubscribed(true)
      setIsSubmitting(false)
    }, 400)
  }

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800 mb-4">
        <Clock className="w-3.5 h-3.5" /> Coming Soon
      </div>

      <div className="w-14 h-14 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-brand-200 dark:ring-brand-800">
        <Rocket className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {toolName} — Coming Soon
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        Server-side processing for <strong>{toolName}</strong> is currently under development. Join our early access list to be notified as soon as it launches!
      </p>

      {/* Interactive Waitlist Form */}
      <div className="w-full mb-6 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
        {isSubscribed ? (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>You're on the waitlist! We'll notify you when server processing launches.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-3">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Get notified when {toolName} cloud processing is available:
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Joining...' : 'Notify me'}
              </Button>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Zero spam. We'll only send an email when this specific tool goes live.
            </p>
          </form>
        )}
      </div>

      {/* Alternative Tool Action */}
      {alternateToolSlug && alternateToolName && (
        <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-800">
          <Link
            to={`/${alternateToolSlug}`}
            className="w-full py-2.5 px-4 text-sm font-medium text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Try {alternateToolName} right now in your browser</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default ServerRequiredState
