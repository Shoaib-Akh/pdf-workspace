import React, { useEffect, useRef } from 'react'
import { APP_CONFIG } from '@/lib/config'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'error-callback'?: (errorCode?: string) => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact' | 'flexible'
          action?: string
          [key: string]: unknown
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
    onTurnstileLoaded?: () => void
  }
}

interface TurnstileWidgetProps {
  siteKey?: string
  onVerify: (token: string) => void
  onError?: (error?: string) => void
  onExpire?: () => void
  theme?: 'light' | 'dark' | 'auto'
  action?: string
  className?: string
}

let turnstileScriptLoading = false
let turnstileScriptLoaded = false

function loadTurnstileScript(onLoad: () => void) {
  if (typeof window === 'undefined') return

  if (window.turnstile) {
    onLoad()
    return
  }

  if (turnstileScriptLoaded) {
    onLoad()
    return
  }

  if (turnstileScriptLoading) {
    const existingScript = document.getElementById('cf-turnstile-script')
    if (existingScript) {
      existingScript.addEventListener('load', () => onLoad(), { once: true })
    }
    return
  }

  turnstileScriptLoading = true
  const script = document.createElement('script')
  script.id = 'cf-turnstile-script'
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
  script.async = true
  script.defer = true
  script.onload = () => {
    turnstileScriptLoaded = true
    turnstileScriptLoading = false
    onLoad()
  }
  script.onerror = () => {
    turnstileScriptLoading = false
    console.error('Failed to load Cloudflare Turnstile script')
  }
  document.head.appendChild(script)
}

export default function TurnstileWidget({
  siteKey = APP_CONFIG.turnstileSiteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  action,
  className = '',
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!siteKey) return
    let isMounted = true

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return

      // If already rendered, remove previous
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // ignore cleanup errors
        }
        widgetIdRef.current = null
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          action,
          callback: (token: string) => {
            if (isMounted) onVerify(token)
          },
          'error-callback': (err?: string) => {
            if (isMounted && onError) onError(err)
          },
          'expired-callback': () => {
            if (isMounted && onExpire) onExpire()
          },
        })
        widgetIdRef.current = id
      } catch (err) {
        console.error('Error rendering Cloudflare Turnstile:', err)
      }
    }

    loadTurnstileScript(renderWidget)

    return () => {
      isMounted = false
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // ignore cleanup errors
        }
        widgetIdRef.current = null
      }
    }
  }, [siteKey, theme, action, onVerify, onError, onExpire])

  if (!siteKey) return null

  return (
    <div className={`flex justify-center my-2 ${className}`}>
      <div ref={containerRef} className="cf-turnstile-container min-h-[65px]" />
    </div>
  )
}
