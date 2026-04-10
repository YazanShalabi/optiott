import Script from 'next/script'
import { PreviewRefresh } from './PreviewRefresh'

export const fetchCache = 'force-no-store'
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PreviewPageProps {
  searchParams: Promise<Record<string, string>>
}

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
  Synopsis?: string
  Duration?: string
  Quality?: string
  Rating?: string
  Genres?: string
  Cast?: string
  ReleaseDate?: string
  Author?: string
  PublishDate?: string
  Category?: string
  Tags?: string
}

async function fetchPreviewContent(
  key: string,
  ver: string,
  loc: string,
  token: string
): Promise<ContentItem | null> {
  const gateway = process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2'
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY || ''
  const appKey = process.env.OPTIMIZELY_GRAPH_APP_KEY || ''
  const secret = process.env.OPTIMIZELY_GRAPH_SECRET || ''

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
          ... on BlogDetailPage {
            MetaTitle
            Author
            PublishDate
            Category
            Tags
          }
        }
      }
    }
  `

  async function runQuery(url: string, headers: Record<string, string>): Promise<ContentItem | null> {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ query, variables: { key } }),
        cache: 'no-store',
      })
      if (!res.ok) {
        console.error('[Preview] Content Graph request failed:', res.status)
        return null
      }
      const data = await res.json()
      if (data?.errors) {
        console.error('[Preview] GraphQL errors:', JSON.stringify(data.errors))
      }
      return data?.data?._Content?.items?.[0] ?? null
    } catch (err) {
      console.error('[Preview] Fetch error:', err)
      return null
    }
  }

  // Try single key first (works for all published content)
  if (singleKey) {
    const item = await runQuery(
      `${gateway}?auth=${singleKey}&stored=false`,
      {}
    )
    if (item) return item
  }

  // If preview token was passed from CMS edit iframe, try that for draft content
  if (token && token.length > 10) {
    const item = await runQuery(gateway, { Authorization: `Bearer ${token}` })
    if (item) return item
  }

  // Last resort: app key + secret basic auth for draft content
  if (appKey && secret) {
    const encoded = Buffer.from(`${appKey}:${secret}`).toString('base64')
    const item = await runQuery(gateway, { Authorization: `Basic ${encoded}` })
    if (item) return item
  }

  return null
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const params = await searchParams
  const key = params.key ?? ''
  const ver = params.ver ?? 'Draft'
  const loc = params.loc ?? 'en'
  const token = params.preview_token ?? ''

  const content = key ? await fetchPreviewContent(key, ver, loc, token) : null

  const displayName = content?._metadata?.displayName || 'Preview'
  const contentType = content?._metadata?.types?.[0] || 'Unknown'
  const metaTitle = content?.MetaTitle || displayName
  const metaDescription = content?.MetaDescription || ''

  const isContentDetail = contentType === 'ContentDetailPage'
  const isBlogDetail = contentType === 'BlogDetailPage'
  const isComingSoon = contentType === 'ComingSoonPage'
  const isError = contentType === 'ErrorPage'

  return (
    <>
      <Script src="/communicationinjector.js" strategy="beforeInteractive" />
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/all.min.css" />
      <link rel="stylesheet" href="/assets/css/animate.css" />
      <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
      <link rel="stylesheet" href="/assets/css/color.css" />
      <link rel="stylesheet" href="/assets/css/main.css" />

      <div
        data-epi-block-id={content?._metadata?.key}
        style={{
          minHeight: '100vh',
          background: '#0e0e0e',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '40px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 32,
              paddingBottom: 24,
              borderBottom: '1px solid #2a2a4a',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e50914 0%, #b20710 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 18,
                }}
              >
                ▶
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>
                  Opti<span style={{ color: '#e50914' }}>OTT</span>{' '}
                  <span style={{ fontSize: 14, color: '#888', fontWeight: 400, marginLeft: 8 }}>
                    Preview Mode
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  {contentType} • version {ver} • {loc}
                </div>
              </div>
            </div>
            <span
              style={{
                background: '#e50914',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              ● Live Preview
            </span>
          </div>

          {!content ? (
            <div
              style={{
                background: '#1a1a2e',
                borderRadius: 12,
                padding: 48,
                textAlign: 'center',
                border: '1px solid #2a2a4a',
              }}
            >
              <h2 style={{ fontSize: 28, marginBottom: 12 }}>
                {key ? 'Content not found' : 'No content key provided'}
              </h2>
              <p style={{ color: '#888' }}>
                {key
                  ? `Unable to load content with key "${key}". Make sure the content exists and is accessible.`
                  : 'This preview page expects ?key=... in the URL.'}
              </p>
            </div>
          ) : (
            <>
              {/* Hero */}
              <section
                style={{
                  background:
                    'linear-gradient(180deg, rgba(26,26,46,1) 0%, rgba(14,14,14,1) 100%)',
                  padding: '60px 40px',
                  borderRadius: 16,
                  marginBottom: 32,
                  border: '1px solid #2a2a4a',
                }}
              >
                <div style={{ fontSize: 13, color: '#888', marginBottom: 12, letterSpacing: 1 }}>
                  {contentType.toUpperCase()}
                </div>
                <h1
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    marginBottom: 16,
                    lineHeight: 1.1,
                  }}
                  data-epi-edit="MetaTitle"
                >
                  {metaTitle}
                </h1>
                {metaDescription && (
                  <p
                    style={{
                      fontSize: 18,
                      color: '#aaa',
                      maxWidth: 720,
                      lineHeight: 1.6,
                    }}
                    data-epi-edit="MetaDescription"
                  >
                    {metaDescription}
                  </p>
                )}
              </section>

              {/* Content detail extras */}
              {isContentDetail && (
                <section
                  style={{
                    background: '#1a1a2e',
                    borderRadius: 12,
                    padding: 32,
                    marginBottom: 24,
                    border: '1px solid #2a2a4a',
                  }}
                >
                  <h2 style={{ fontSize: 24, marginBottom: 20, color: '#e50914' }}>
                    Movie Details
                  </h2>
                  {content.Synopsis && (
                    <p
                      style={{ color: '#ccc', lineHeight: 1.7, marginBottom: 24 }}
                      data-epi-edit="Synopsis"
                    >
                      {content.Synopsis}
                    </p>
                  )}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: 20,
                    }}
                  >
                    {content.Duration && (
                      <MetaRow label="Duration" value={content.Duration} field="Duration" />
                    )}
                    {content.Quality && (
                      <MetaRow label="Quality" value={content.Quality} field="Quality" />
                    )}
                    {content.Rating && (
                      <MetaRow label="Rating" value={`⭐ ${content.Rating}`} field="Rating" />
                    )}
                    {content.ReleaseDate && (
                      <MetaRow label="Release" value={content.ReleaseDate} field="ReleaseDate" />
                    )}
                    {content.Genres && (
                      <MetaRow label="Genres" value={content.Genres} field="Genres" />
                    )}
                    {content.Cast && <MetaRow label="Cast" value={content.Cast} field="Cast" />}
                  </div>
                </section>
              )}

              {isBlogDetail && (
                <section
                  style={{
                    background: '#1a1a2e',
                    borderRadius: 12,
                    padding: 32,
                    marginBottom: 24,
                    border: '1px solid #2a2a4a',
                  }}
                >
                  <h2 style={{ fontSize: 24, marginBottom: 20, color: '#e50914' }}>
                    Blog Details
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: 20,
                    }}
                  >
                    {content.Author && (
                      <MetaRow label="Author" value={content.Author} field="Author" />
                    )}
                    {content.PublishDate && (
                      <MetaRow
                        label="Published"
                        value={content.PublishDate}
                        field="PublishDate"
                      />
                    )}
                    {content.Category && (
                      <MetaRow label="Category" value={content.Category} field="Category" />
                    )}
                    {content.Tags && <MetaRow label="Tags" value={content.Tags} field="Tags" />}
                  </div>
                </section>
              )}

              {(isComingSoon || isError) && content.Title && (
                <section
                  style={{
                    background: '#1a1a2e',
                    borderRadius: 12,
                    padding: 32,
                    marginBottom: 24,
                    border: '1px solid #2a2a4a',
                    textAlign: 'center',
                  }}
                >
                  <h2 style={{ fontSize: 36, marginBottom: 16 }} data-epi-edit="Title">
                    {content.Title}
                  </h2>
                  {content.Description && (
                    <p
                      style={{ color: '#aaa', fontSize: 16, maxWidth: 600, margin: '0 auto' }}
                      data-epi-edit="Description"
                    >
                      {content.Description}
                    </p>
                  )}
                </section>
              )}

              {/* Raw metadata card */}
              <section
                style={{
                  background: '#16213e',
                  borderRadius: 12,
                  padding: 24,
                  border: '1px solid #2a2a4a',
                }}
              >
                <h3 style={{ fontSize: 14, color: '#888', marginBottom: 16, letterSpacing: 1 }}>
                  CONTENT METADATA
                </h3>
                <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, fontSize: 13 }}>
                  <dt style={{ color: '#888' }}>Key</dt>
                  <dd style={{ color: '#e0e0e0', fontFamily: 'monospace', margin: 0 }}>
                    {content._metadata?.key}
                  </dd>
                  <dt style={{ color: '#888' }}>Version</dt>
                  <dd style={{ color: '#e0e0e0', margin: 0 }}>{content._metadata?.version}</dd>
                  <dt style={{ color: '#888' }}>Types</dt>
                  <dd style={{ color: '#e0e0e0', margin: 0 }}>
                    {content._metadata?.types?.join(', ')}
                  </dd>
                  {content._metadata?.url?.default && (
                    <>
                      <dt style={{ color: '#888' }}>URL</dt>
                      <dd style={{ color: '#e0e0e0', fontFamily: 'monospace', margin: 0 }}>
                        {content._metadata.url.default}
                      </dd>
                    </>
                  )}
                </dl>
              </section>
            </>
          )}
        </div>
      </div>
      <PreviewRefresh />
    </>
  )
}

function MetaRow({ label, value, field }: { label: string; value: string; field: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, color: '#fff', marginTop: 4 }} data-epi-edit={field}>
        {value}
      </div>
    </div>
  )
}
