import React from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-zinc-700 font-medium">{item.label}</span>
              )}
              
              {!isLast && (
                <ChevronRight size={14} className="mx-2 text-zinc-500" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
