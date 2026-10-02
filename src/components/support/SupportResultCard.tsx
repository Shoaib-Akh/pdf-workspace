import React from 'react'
import { Heart } from 'lucide-react'
import { DONATE_URL } from '@/lib/config'

interface SupportResultCardProps {
  className?: string
}

export function SupportResultCard({ className = '' }: SupportResultCardProps) {
  // If DONATE_URL is empty, hide the button completely
  if (!DONATE_URL) {
    return null
  }

  return (
    <div
      className={`mt-6 pt-5 border-t border-zinc-200/80 dark:border-zinc-800 text-center ${className}`}
      role="region"
      aria-label="Support PDF Guru"
    >
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
        This tool is free. If it saved you time, you can support it.
      </p>
      <a
        href={DONATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 rounded-xl transition-colors focus-visible-ring"
      >
        <Heart className="w-3.5 h-3.5 fill-amber-500/20 text-amber-600" />
        <span>Support PDF Guru</span>
      </a>
    </div>
  )
}

export default SupportResultCard
