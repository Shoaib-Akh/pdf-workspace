import React from "react"
import { Link } from "react-router-dom"

interface LogoProps {
  showText?: boolean
  size?: "sm" | "md" | "lg"
  asLink?: boolean
  className?: string
}

const sizeMap = {
  sm: { icon: 24, text: "text-base", gap: "gap-1.5" },
  md: { icon: 32, text: "text-xl",  gap: "gap-2"   },
  lg: { icon: 44, text: "text-2xl", gap: "gap-3"   },
}

export function Logo({ showText = true, size = "md", asLink = true, className = "" }: LogoProps) {
  const { icon, text, gap } = sizeMap[size]

  const inner = (
    <span className={`flex items-center ${gap} ${className}`}>
      {/* SVG Icon — violet AI style */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Violet gradient background */}
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <rect width="44" height="44" rx="10" fill="url(#logoGrad)" />
        {/* Document body */}
        <rect x="10" y="12" width="18" height="22" rx="2" fill="white" opacity="0.95" />
        {/* Folded corner */}
        <path d="M23 12 L28 12 L28 17 Z" fill="#c4b5fd" />
        <path d="M23 17 L28 17 L23 12 Z" fill="#7c3aed" opacity="0.5" />
        {/* Document lines */}
        <line x1="13" y1="21" x2="23" y2="21" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="13" y1="25" x2="25" y2="25" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="13" y1="29" x2="20" y2="29" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round" />
        {/* Sparkle / AI star top-right */}
        <circle cx="34" cy="10" r="5" fill="#a78bfa" opacity="0.9" />
        <path d="M34 7 L34.6 9.4 L37 10 L34.6 10.6 L34 13 L33.4 10.6 L31 10 L33.4 9.4 Z" fill="white" />
      </svg>

      {/* Wordmark — adapts to light and dark theme */}
      {showText && (
        <span
          className={`font-bold tracking-tight leading-none ${text}`}
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          <span className="text-slate-900 dark:text-white transition-colors">PDF</span>
          <span className="text-violet-600 dark:text-violet-400 transition-colors"> Guru</span>
        </span>
      )}
    </span>
  )

  if (!asLink) return inner

  return (
    <Link
      to="/"
      aria-label="PDF Guru — Home"
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
    >
      {inner}
    </Link>
  )
}

export default Logo
