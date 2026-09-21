import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X, ChevronDown, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"
import { useTheme } from "@/providers/ThemeProvider"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // Cycle: light → dark → system → light
  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor
  const themeLabel = theme === 'dark' ? 'Dark mode' : theme === 'light' ? 'Light mode' : 'System mode'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md transition-all duration-200 ${
        isScrolled ? "border-b border-indigo-900/60 shadow-glow" : "border-b border-slate-900"
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
                className="flex items-center text-slate-300 hover:text-white font-medium focus-visible-ring rounded-lg px-2 py-1 transition-colors"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Tools <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-xl shadow-lg bg-slate-900 border border-slate-700/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
                <div className="py-1.5" role="menu" aria-label="Tools Submenu">
                  <Link to="/convert" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" role="menuitem">Convert</Link>
                  <Link to="/extract" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" role="menuitem">Extract</Link>
                  <Link to="/organize" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" role="menuitem">Organize</Link>
                  <Link to="/business" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" role="menuitem">Business</Link>
                  <Link to="/ocr" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" role="menuitem">OCR</Link>
                  <div className="border-t border-slate-700 my-1"></div>
                  <Link to="/tools" className="block px-4 py-2 text-sm font-semibold text-indigo-400 hover:bg-slate-800" role="menuitem">Browse All Tools →</Link>
                </div>
              </div>
            </div>
            <Link to="/pricing" className="text-slate-300 hover:text-white font-medium focus-visible-ring rounded-lg px-2 py-1 transition-colors">Pricing</Link>
            <Link to="/learn" className="text-slate-300 hover:text-white font-medium focus-visible-ring rounded-lg px-2 py-1 transition-colors">Learn</Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              title={themeLabel}
              aria-label={themeLabel}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible-ring"
            >
              <ThemeIcon size={18} />
            </button>
            <Link to="/signin" className="text-slate-300 hover:text-white font-medium focus-visible-ring rounded-lg px-3 py-1.5 transition-colors">Sign in</Link>
            <Button asChild className="bg-violet-600 hover:bg-violet-500 text-white shadow-glow focus-visible-ring">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus-visible-ring min-w-[44px] min-h-[44px] transition-colors"
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
        <nav id="mobile-menu" aria-label="Mobile Navigation" className="md:hidden border-t border-slate-800 bg-slate-950 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-2 duration-150">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Tools</div>
            <div className="grid grid-cols-2 gap-1.5">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/convert" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Convert</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/extract" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Extract</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/organize" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Organize</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/business" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Business</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/ocr" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">OCR</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/tools" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold text-indigo-400 hover:bg-slate-800">All Tools →</Link>
            </div>
            
            <div className="mt-4 border-t border-slate-800 pt-3 space-y-1">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/pricing" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Pricing</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/learn" className="flex items-center px-3 py-2.5 min-h-[44px] rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Learn & Guides</Link>
            </div>
            
            <div className="mt-4 border-t border-slate-800 pt-4 flex flex-col space-y-2">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/signin" className="flex items-center justify-center min-h-[44px] text-base font-medium text-slate-300 hover:text-white">Sign in</Link>
              <Button asChild className="w-full min-h-[44px] bg-indigo-600 hover:bg-indigo-500 text-white">
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
