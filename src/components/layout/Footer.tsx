import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettingsData } from '@/lib/types'

interface FooterProps {
  settings?: SiteSettingsData
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#0a0a0a] pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            {settings?.logo?.url?.default ? (
              <Image
                src={settings.logo.url.default}
                alt={settings.siteName || 'OptiOTT'}
                width={140}
                height={40}
                className="h-10 w-auto mb-4"
              />
            ) : (
              <span className="text-2xl font-bold text-white block mb-4">
                Opti<span className="text-[#e50914]">OTT</span>
              </span>
            )}
            <p className="text-gray-400 text-sm mb-4">
              {settings?.offcanvasDescription || 'Your ultimate streaming destination for movies, TV shows, and web series.'}
            </p>
            <div className="flex gap-3">
              {settings?.socialLinks?.map((link, i) => (
                <a
                  key={i}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#e50914] transition-colors"
                >
                  <span className="text-sm">{link.platform?.charAt(0).toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              {settings?.footerCompanyLinks?.map((link, i) => (
                <li key={i}>
                  <Link href={link.url || '#'} className="text-gray-400 hover:text-[#e50914] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Explore</h4>
            <ul className="space-y-2">
              {settings?.footerExploreLinks?.map((link, i) => (
                <li key={i}>
                  <Link href={link.url || '#'} className="text-gray-400 hover:text-[#e50914] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              {settings?.newsletterTitle || 'Newsletter'}
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              {settings?.newsletterDescription || 'Subscribe to get the latest updates.'}
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm placeholder:text-gray-500 outline-none focus:border-[#e50914]"
              />
              <button
                type="submit"
                className="bg-[#e50914] text-white px-4 py-2 rounded-lg hover:bg-[#b20710] transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            {settings?.copyrightText || `© ${new Date().getFullYear()} OptiOTT. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
