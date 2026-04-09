'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { SiteSettingsData } from '@/lib/types'

interface HeaderProps {
  settings?: SiteSettingsData
}

export default function Header({ settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e0e0e]/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {settings?.logo?.url?.default ? (
              <Image
                src={settings.logo.url.default}
                alt={settings.siteName || 'OptiOTT'}
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                Opti<span className="text-[#e50914]">OTT</span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {settings?.mainNavigation?.map((item, i) => (
              <li key={i} className="relative group">
                <Link
                  href={item.url || '#'}
                  className={`text-sm font-medium transition-colors hover:text-[#e50914] ${
                    item.isActive ? 'text-[#e50914]' : 'text-white'
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <ul className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a2e] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {item.children.map((child, j) => (
                      <li key={j}>
                        <Link
                          href={child.url || '#'}
                          className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-[#e50914] transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1a1a2e] border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            {settings?.mainNavigation?.map((item, i) => (
              <Link
                key={i}
                href={item.url || '#'}
                className="block py-3 text-white hover:text-[#e50914]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0e0e0e] p-8">
          <div className="container mx-auto">
            <input
              type="search"
              placeholder={settings?.searchPlaceholder || 'Search movies, shows...'}
              className="w-full bg-transparent border-b-2 border-[#e50914] text-white text-2xl py-4 outline-none placeholder:text-gray-500"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
