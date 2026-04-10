import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type ContentItem = {
  _metadata?: {
    key?: string
    version?: string
    types?: string[]
    displayName?: string
    url?: { default?: string; hierarchical?: string }
  }
  MetaTitle?: string
  MetaDescription?: string
  BreadcrumbTitle?: string
  Title?: string
  Description?: string
}

// Map CMS content type → template HTML file in /public
const TEMPLATE_FOR_TYPE: Record<string, string> = {
  HomePage: 'index.html',
  BlankExperience: 'index.html',
  HomePageExperience: 'index.html',
  AboutPage: 'about.html',
  ContactPage: 'contact.html',
  PricingPage: 'pricing.html',
  TeamPage: 'team.html',
  BlogListingPage: 'news.html',
  BlogDetailPage: 'news-details.html',
  MovieListingPage: 'movie.html',
  ContentDetailPage: 'movie-details.html',
  ComingSoonPage: 'cooming-soon.html',
  LoginPage: 'login.html',
  ErrorPage: '404.html',
}

async function fetchContent(key: string, token: string): Promise<ContentItem | null> {
  const gateway = process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2'
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY || ''

  const query = `
    query PreviewContent($key: String!) {
      _Content(
        where: { _metadata: { key: { eq: $key } } }
        variation: { include: ALL }
        limit: 1
      ) {
        items {
          _metadata {
            key
            version
            types
            displayName
            url { default hierarchical }
          }
          ... on HomePage { MetaTitle MetaDescription }
          ... on AboutPage { MetaTitle MetaDescription BreadcrumbTitle }
          ... on ContactPage { MetaTitle MetaDescription BreadcrumbTitle }
          ... on PricingPage { MetaTitle MetaDescription BreadcrumbTitle }
          ... on TeamPage { MetaTitle MetaDescription BreadcrumbTitle }
          ... on BlogListingPage { MetaTitle MetaDescription BreadcrumbTitle }
          ... on MovieListingPage { MetaTitle MetaDescription BreadcrumbTitle }
          ... on ComingSoonPage { MetaTitle Title Description }
          ... on LoginPage { MetaTitle }
          ... on ErrorPage { Title Description }
          ... on BlogDetailPage { MetaTitle }
        }
      }
    }
  `

  async function runQuery(url: string, headers: Record<string, string>) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ query, variables: { key } }),
        cache: 'no-store',
      })
      if (!res.ok) return null
      const data = await res.json()
      return data?.data?._Content?.items?.[0] ?? null
    } catch {
      return null
    }
  }

  if (singleKey) {
    const item = await runQuery(`${gateway}?auth=${singleKey}&stored=false`, {})
    if (item) return item
  }
  if (token && token.length > 10) {
    const item = await runQuery(gateway, { Authorization: `Bearer ${token}` })
    if (item) return item
  }
  return null
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function injectIntoTemplate(html: string, content: ContentItem | null): string {
  if (!content) return html

  const metaTitle = content.MetaTitle || content._metadata?.displayName || ''
  const metaDescription = content.MetaDescription || ''
  const breadcrumbTitle = content.BreadcrumbTitle || content._metadata?.displayName || ''

  if (metaTitle) {
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(metaTitle)}</title>`)
  }

  if (metaDescription) {
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(metaDescription)}">`
    )
  }

  if (breadcrumbTitle) {
    // Try common breadcrumb title patterns in the template
    html = html.replace(
      /(<div class="breadcrumb-content[^"]*"[^>]*>\s*<h1[^>]*>)[^<]*(<\/h1>)/i,
      `$1${escapeHtml(breadcrumbTitle)}$2`
    )
  }

  // Inject live-preview badge + CMS communication bridge before </body>
  const badge = `
    <div id="optiott-live-preview-badge" style="position:fixed;top:20px;right:20px;z-index:99999;background:#e50914;color:#fff;padding:8px 16px;border-radius:4px;font-size:12px;font-weight:700;letter-spacing:1px;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.5);display:flex;align-items:center;gap:8px">
      <span style="width:8px;height:8px;background:#fff;border-radius:50%;animation:optiott-pulse 1.5s infinite"></span>
      LIVE PREVIEW
    </div>
    <style>@keyframes optiott-pulse{0%,100%{opacity:1}50%{opacity:.3}}</style>
    <script src="/communicationinjector.js"></script>
    <script>
      window.addEventListener('optimizely:cms:contentSaved', function() {
        setTimeout(function() { window.location.reload(); }, 750);
      });
    </script>
  `
  html = html.replace('</body>', `${badge}</body>`)

  return html
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const rawKey = params.get('key') ?? ''
  const key = rawKey.replace(/-/g, '')
  const token = params.get('preview_token') ?? ''

  // Fetch the content (gets the content type so we know which template to use)
  const content = key ? await fetchContent(key, token) : null

  // Pick template based on content type
  const contentType = content?._metadata?.types?.[0] || 'HomePage'
  const templateFile = TEMPLATE_FOR_TYPE[contentType] || 'index.html'

  // Read the template HTML from /public
  const templatePath = path.join(process.cwd(), 'public', templateFile)
  let html: string
  try {
    html = await readFile(templatePath, 'utf-8')
  } catch {
    return new Response(
      `<!DOCTYPE html><html><head><title>Preview Error</title></head><body style="background:#0e0e0e;color:#fff;font-family:sans-serif;padding:40px"><h1>Preview</h1><p>Template not found: ${escapeHtml(templateFile)}</p><p>Content type: ${escapeHtml(contentType)}</p><p>Key: ${escapeHtml(key)}</p></body></html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  // Inject CMS content into the template
  html = injectIntoTemplate(html, content)

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      // Allow embedding in the Optimizely CMS iframe
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors 'self' https://*.cms.optimizely.com https://*.optimizely.com",
    },
  })
}
