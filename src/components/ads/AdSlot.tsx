import React from 'react'
import { cn } from '@/lib/utils'

export type AdFormat = 'leaderboard' | 'rectangle' | 'responsive' | 'in-feed'

interface AdSlotProps {
  /** Format of the ad unit */
  format?: AdFormat
  /** Unique identifier for future ad network integration (e.g. AdSense data-ad-slot) */
  slotId?: string
  /** Custom container styling */
  className?: string
  /** Optional label override */
  label?: string
}

/**
 * AdSlot Component
 * 
 * Reserves non-shifting layout space for advertisements (zero CLS).
 * Ad complies with Google AdSense & Coalition for Better Ads policies:
 * - Distinct, visible "ADVERTISEMENT" label.
 * - Does not block content, tools, or download buttons.
 * - Ready for ad network script insertion (data-ad-slot).
 */
export function AdSlot({
  format = 'responsive',
  slotId,
  className,
  label = 'Advertisement',
}: AdSlotProps) {
  // CLS-safe height and layout reservations
  const formatClasses: Record<AdFormat, string> = {
    leaderboard: 'min-h-[90px] sm:min-h-[100px] max-w-[728px] mx-auto',
    rectangle: 'min-h-[250px] sm:min-h-[280px] max-w-[336px] mx-auto',
    responsive: 'min-h-[100px] sm:min-h-[120px] w-full',
    'in-feed': 'min-h-[120px] sm:min-h-[140px] w-full my-6',
  }

  return (
    <aside
      aria-label="Advertisement"
      data-ad-slot={slotId}
      className={cn(
        'w-full my-8 flex flex-col items-center justify-center transition-all',
        className
      )}
    >
      <div className="w-full flex justify-center items-center mb-1.5">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-zinc-500 select-none">
          {label}
        </span>
      </div>

      <div
        className={cn(
          'w-full rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/75 dark:bg-zinc-900/40 flex items-center justify-center overflow-hidden p-4',
          formatClasses[format]
        )}
      >
        <div className="text-center select-none py-4 px-2">
          <p className="text-xs font-medium text-slate-400 dark:text-zinc-500">
            Ad Space Available
          </p>
          <p className="text-[11px] text-slate-300 dark:text-zinc-600 mt-0.5">
            Non-intrusive sponsor unit
          </p>
        </div>
      </div>
    </aside>
  )
}

export default AdSlot
