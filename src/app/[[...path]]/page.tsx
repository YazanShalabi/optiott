import { notFound } from 'next/navigation'
import { getPublicClient } from '@/graphql/getSdk'
import { gql } from 'graphql-tag'
import Link from 'next/link'

export const revalidate = 60

const CONTENT_BY_PATH = gql`
  query ContentByPath($url: [String!]!) {
    _Content(
      where: {
        _or: [
          { _metadata: { url: { default: { in: $url } } } }
          { _metadata: { url: { hierarchical: { in: $url } } } }
        ]
      }
      variation: { include: ALL }
    ) {
      items {
        _metadata {
          key
          version
          types
          displayName
          url {
            default
            hierarchical
          }
        }
      }
    }
  }
`

const HOME_PAGE_QUERY = gql`
  query HomePageQuery {
    HomePage(variation: { include: ALL }, limit: 1) {
      items {
        _metadata {
          key
          displayName
          url {
            default
            hierarchical
          }
        }
        MetaTitle
        MetaDescription
      }
    }
  }
`

const LIST_ALL_PAGES_QUERY = gql`
  query ListAllPages {
    _Content(
      where: { _metadata: { types: { eq: "_Page" } } }
      variation: { include: ALL }
      limit: 50
    ) {
      items {
        _metadata {
          key
          displayName
          types
          url {
            default
            hierarchical
          }
        }
      }
    }
  }
`

interface PageProps {
  params: Promise<{ path?: string[] }>
}

function normalizePath(path: string): string[] {
  const variants = new Set<string>()
  variants.add(path)
  variants.add(path.endsWith('/') ? path.slice(0, -1) : `${path}/`)
  // Also try with /en/ locale prefix
  if (!path.startsWith('/en/')) {
    const withLocale = `/en${path}`
    variants.add(withLocale)
    variants.add(withLocale.endsWith('/') ? withLocale.slice(0, -1) : `${withLocale}/`)
  }
  return Array.from(variants)
}

export default async function CatchAllPage({ params }: PageProps) {
  const resolvedParams = await params
  const urlPath = resolvedParams.path ? `/${resolvedParams.path.join('/')}` : '/'

  try {
    const client = getPublicClient()

    // If requesting root, fetch the HomePage directly
    if (urlPath === '/') {
      const homeData = await client.request<{
        HomePage?: {
          items?: Array<{
            _metadata?: { key?: string; displayName?: string; url?: { default?: string } }
            MetaTitle?: string
            MetaDescription?: string
          }>
        }
      }>(HOME_PAGE_QUERY)

      const homePage = homeData?.HomePage?.items?.[0]
      const listData = await client.request<{
        _Content?: {
          items?: Array<{
            _metadata?: {
              key?: string
              displayName?: string
              types?: string[]
              url?: { default?: string; hierarchical?: string }
            }
          }>
        }
      }>(LIST_ALL_PAGES_QUERY)
      const pages = listData?._Content?.items || []

      return (
        <main className="min-h-screen bg-[#0e0e0e] text-white">
          {/* Hero */}
          <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0e0e0e] pt-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Opti<span className="text-[#e50914]">OTT</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-4">
                {homePage?.MetaDescription || 'Your ultimate streaming destination'}
              </p>
              <p className="text-gray-400 mb-8">
                Powered by Optimizely SaaS CMS + Next.js + Vercel
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/en/movies"
                  className="bg-[#e50914] text-white px-8 py-3 rounded-lg hover:bg-[#b20710] transition-colors font-medium"
                >
                  Browse Movies
                </Link>
                <Link
                  href="/en/tv-shows"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-colors font-medium"
                >
                  TV Shows
                </Link>
              </div>
            </div>
          </section>

          {/* Content from CMS */}
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Available Pages from CMS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => {
                const url = page._metadata?.url?.default || '#'
                const type = page._metadata?.types?.[0] || 'Page'
                return (
                  <Link
                    key={page._metadata?.key}
                    href={url}
                    className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 hover:border-[#e50914] transition-colors group"
                  >
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-[#e50914] transition-colors">
                      {page._metadata?.displayName}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">{type}</p>
                    <p className="text-gray-500 text-xs truncate">{url}</p>
                  </Link>
                )
              })}
            </div>
            {pages.length === 0 && (
              <p className="text-center text-gray-500">No pages found in CMS</p>
            )}
          </section>

          {/* Stats */}
          <section className="bg-[#1a1a2e] py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-[#e50914] mb-2">{pages.length}+</div>
                  <div className="text-gray-400">CMS Pages</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#e50914] mb-2">50+</div>
                  <div className="text-gray-400">Content Types</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#e50914] mb-2">28</div>
                  <div className="text-gray-400">VB Components</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#e50914] mb-2">24</div>
                  <div className="text-gray-400">Display Templates</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )
    }

    // Fetch content by path
    const data = await client.request<{
      _Content?: {
        items?: Array<{
          _metadata?: {
            key?: string
            displayName?: string
            types?: string[]
            url?: { default?: string; hierarchical?: string }
          }
        }>
      }
    }>(CONTENT_BY_PATH, {
      url: normalizePath(urlPath),
    })

    const items = data?._Content?.items
    if (!items || items.length === 0) {
      notFound()
    }

    const content = items[0]
    const displayName = content._metadata?.displayName || 'Page'
    const types = content._metadata?.types?.join(', ') || ''

    return (
      <main className="min-h-screen bg-[#0e0e0e] text-white pt-20">
        {/* Breadcrumb hero */}
        <section className="relative py-24 bg-gradient-to-b from-[#1a1a2e] to-[#0e0e0e]">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{displayName}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-[#e50914]">Home</Link>
              <span>/</span>
              <span className="text-[#e50914]">{displayName}</span>
            </div>
          </div>
        </section>

        {/* Content area */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Content Details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex gap-4">
                <dt className="text-gray-400 w-32">Key:</dt>
                <dd className="text-white font-mono text-xs">{content._metadata?.key}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-gray-400 w-32">Display Name:</dt>
                <dd className="text-white">{displayName}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-gray-400 w-32">Types:</dt>
                <dd className="text-gray-300">{types}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-gray-400 w-32">URL:</dt>
                <dd className="text-gray-300 font-mono text-xs">{content._metadata?.url?.default}</dd>
              </div>
            </dl>
            <div className="mt-8 pt-8 border-t border-[#2a2a4a]">
              <p className="text-gray-400 mb-4">
                This page is rendered from Optimizely SaaS CMS via Content Graph.
                The full Visual Builder experience will render here once composition data is available.
              </p>
              <Link
                href="/"
                className="inline-block bg-[#e50914] text-white px-6 py-3 rounded-lg hover:bg-[#b20710] transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  } catch (error) {
    console.error('[CatchAllPage] Error:', error)
    return (
      <main className="min-h-screen bg-[#0e0e0e] text-white pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Opti<span className="text-[#e50914]">OTT</span>
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            CMS Connection Error
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Unable to fetch content from Optimizely CMS. Check environment variables.
          </p>
          <pre className="text-xs text-gray-600 bg-[#1a1a2e] p-4 rounded inline-block text-left">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </div>
      </main>
    )
  }
}
