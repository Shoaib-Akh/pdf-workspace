import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
        isScrolled ? "border-b border-border shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo size="md" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            <div className="relative group">
              <button
                className="flex items-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium focus-visible-ring rounded-lg px-2 py-1"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Tools <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-zinc-900 border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
                <div className="py-1.5" role="menu" aria-label="Tools Submenu">
                  <Link to="/convert" className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800" role="menuitem">Convert</Link>
                  <Link to="/extract" className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800" role="menuitem">Extract</Link>
                  <Link to="/organize" className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800" role="menuitem">Organize</Link>
                  <Link to="/business" className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800" role="menuitem">Business</Link>
                  <Link to="/ocr" className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800" role="menuitem">OCR</Link>
                  <div className="border-t border-border my-1"></div>
                  <Link to="/tools" className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800" role="menuitem">Browse All Tools →</Link>
                </div>
              </div>
            </div>
            <Link to="/pricing" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium focus-visible-ring rounded-lg px-2 py-1">Pricing</Link>
            <Link to="/learn" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium focus-visible-ring rounded-lg px-2 py-1">Learn</Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/signin" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium focus-visible-ring rounded-lg px-3 py-1.5">Sign in</Link>
            <Button asChild variant="default" className="focus-visible-ring">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible-ring min-w-[44px] min-h-[44px]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle mobile menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav id="mobile-menu" aria-label="Mobile Navigation" className="md:hidden border-t border-border bg-white dark:bg-zinc-950 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-2 duration-150">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <div className="px-3 py-1 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Document Tools</div>
            <div className="grid grid-cols-2 gap-1.5">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/convert" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900">Convert</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/extract" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900">Extract</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/organize" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900">Organize</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/business" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900">Business</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/ocr" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900">OCR</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/tools" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold text-primary hover:bg-primary/5">All Tools →</Link>
            </div>
            
            <div className="mt-4 border-t border-border pt-3 space-y-1">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/pricing" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900">Pricing</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/learn" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900">Learn & Guides</Link>
            </div>
            
            <div className="mt-4 border-t border-border pt-4 flex flex-col space-y-2">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/signin" className="flex items-center justify-center min-h-[44px] text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900">Sign in</Link>
              <Button asChild className="w-full min-h-[44px]">
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/signup">Get started</Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header
