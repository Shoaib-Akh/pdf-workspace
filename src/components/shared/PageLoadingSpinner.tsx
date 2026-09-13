import { Loader2 } from 'lucide-react'

export default function PageLoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" aria-hidden />
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    </div>
  )
}
