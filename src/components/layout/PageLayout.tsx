import React from "react"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb"
import { cn } from "@/lib/utils"

interface PageLayoutProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  className?: string
}

export function PageLayout({ children, breadcrumbs, className }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Skip to Main Content Link for Keyboard & Screen Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm font-semibold transition-all"
      >
        Skip to main content
      </a>

      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
          {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PageLayout
