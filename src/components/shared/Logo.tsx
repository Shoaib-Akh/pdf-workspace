import React from "react"
import { Link } from "react-router-dom"

interface LogoProps {
  /** Show text next to icon. Default: true */
  showText?: boolean
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Link to home page. Set false to render as a plain div. */
  asLink?: boolean
  className?: string
}

const sizeMap = {
  sm: { icon: 24, text: "text-base", gap: "gap-1.5" },
  md: { icon: 32, text: "text-xl", gap: "gap-2" },
  lg: { icon: 44, text: "text-2xl", gap: "gap-3" },
}

export function Logo({ showText = true, size = "md", asLink = true, className = "" }: LogoProps) {
  const { icon, text, gap } = sizeMap[size]

  const inner = (
    <span className={`flex items-center ${gap} ${className}`}>
      {/* SVG Icon */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background */}
        <rect width="44" height="44" rx="10" fill="#4F46E5" />
        {/* Document body */}
        <rect x="10" y="11" width="19" height="24" rx="2" fill="white" />
        {/* Red folded corner */}
        <path d="M24 11 L29 11 L29 16 Z" fill="#EF4444" />
        <path d="M24 16 L29 16 L24 11 Z" fill="#C7302A" opacity="0.4" />
        {/* Document lines */}
        <line x1="13" y1="21" x2="24" y2="21" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="13" y1="25" x2="26" y2="25" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="13" y1="29" x2="21" y2="29" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
        {/* Graduation cap */}
        <polygon points="19.5,5 33,9.5 19.5,14 6,9.5" fill="white" />
        <rect x="16" y="9.5" width="7" height="5" rx="0" fill="white" opacity="0.5" />
        <line x1="33" y1="9.5" x2="33" y2="14" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="33" cy="15" r="1.4" fill="white" />
      </svg>

      {/* Wordmark */}
      {showText && (
        <span
          className={`font-bold tracking-tight leading-none ${text}`}
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          <span className="text-zinc-900 dark:text-white">PDF</span>
          <span className="text-indigo-600 dark:text-indigo-400"> Guru</span>
        </span>
      )}
    </span>
  )

  if (!asLink) return inner

  return (
    <Link
      to="/"
      aria-label="PDF Guru — Home"
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
    >
      {inner}
    </Link>
  )
}

export default Logo
