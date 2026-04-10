/**
 * Fetches a Visual Builder experience with full composition tree from Content Graph.
 * Uses inline fragments for every known component contentType so authored properties flow through.
 */

const GATEWAY =
  process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2'
const SINGLE_KEY = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY || ''

// Inline fragments per component contentType. Field names must match the CMS
// Content Graph schema exactly — introspected via `__type(name:"...")`.
const COMPONENT_FRAGMENTS = `
  ... on HeroBannerBlock {
    Title Duration Quality Genres VideoUrl
    BackgroundImage { default }
    LinkToDetail { default }
  }
  ... on TrendingBannerBlock {
    Title Description VideoUrl PlayButton
    BackgroundImage { default }
  }
  ... on MovieCarouselBlock {
    SectionTitle ShowNavArrows ShowDots
  }
  ... on MovieCardBlock {
    Title Duration Quality Genres VideoUrl
    Image { default }
    LinkToDetail { default }
  }
  ... on HotPicksCardBlock {
    Title Description Duration Quality RankNumber VideoUrl
    Image { default }
    LinkToDetail { default }
  }
  ... on UpcomingMovieBlock {
    Title Duration Quality Genres VideoUrl
    Image { default }
    LinkToDetail { default }
  }
  ... on CategoryCardBlock {
    Title Subtitle
    Image { default }
    LinkToPage { default }
  }
  ... on PricingCardBlock {
    PlanName Description Price PricePeriod
    TrialButtonText TrialButtonLink
    ChooseButtonText ChooseButtonLink
  }
  ... on FaqSectionBlock {
    Title Description CtaButtonText CtaButtonLink
  }
  ... on FaqItemBlock {
    FaqNumber: Number
    Question Answer
  }
  ... on NewsletterBlock {
    Title Description Placeholder
    ButtonIcon { default }
  }
  ... on AboutSectionBlock {
    Heading VideoUrl StoryTitle StoryParagraphs
    MainImage { default }
  }
  ... on CounterItemBlock {
    CounterNumber: Number
    Suffix Label
  }
  ... on AwardsBlock {
    Title Description Years
  }
  ... on TeamMemberBlock {
    Name Role FacebookUrl TwitterUrl LinkedInUrl InstagramUrl
    Photo { default }
  }
  ... on BlogPostCardBlock {
    Title Excerpt Author Date
    FeaturedImage { default }
    LinkToDetail { default }
  }
  ... on ContactFormBlock {
    Title Description SubmitButtonText FormEndpoint
  }
  ... on ContactInfoBlock {
    ContactIcon: Icon
    Label Value LinkUrl
  }
  ... on MapEmbedBlock {
    EmbedUrl Height
  }
  ... on BrandLogoBlock {
    AltText LinkUrl
    LogoImage { default }
  }
  ... on SectionTitleBlock {
    Heading Subtitle Alignment
    SectionIcon: Icon { default }
  }
  ... on ButtonBlock {
    Label Url Style
    ButtonIconRef: Icon { default }
  }
  ... on ProgressBarBlock {
    Title Percentage
  }
`

// NOTE: `nodes` is only defined on ICompositionStructureNode, not on the
// base ICompositionNode union. Any access to nested children must be wrapped
// in `... on ICompositionStructureNode { nodes { ... } }` or the query errors.
// The SaaS outline layout is flat (component nodes at the root), so we query
// one level of components plus one optional structure level for forward compat.
const COMPOSITION_QUERY = `
  query ExperienceByKey($key: String!) {
    _Content(
      where: { _metadata: { key: { eq: $key } } }
      variation: { include: ALL }
      limit: 1
    ) {
      items {
        _metadata {
          key
          version
          displayName
          types
          url { default hierarchical }
        }
        ... on _IExperience {
          composition {
            key
            displayName
            nodeType
            layoutType
            nodes {
              key
              displayName
              nodeType
              layoutType
              __typename
              ... on CompositionComponentNode {
                component {
                  _metadata { types key }
                  ${COMPONENT_FRAGMENTS}
                }
              }
              ... on ICompositionStructureNode {
                nodes {
                  key
                  displayName
                  nodeType
                  layoutType
                  __typename
                  ... on CompositionComponentNode {
                    component {
                      _metadata { types key }
                      ${COMPONENT_FRAGMENTS}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export type ExperienceMetadata = {
  key?: string
  version?: string
  displayName?: string
  types?: string[]
  url?: { default?: string; hierarchical?: string }
}

export type ComponentNode = {
  key?: string
  displayName?: string
  nodeType?: string
  layoutType?: string | null
  __typename?: string
  component?: {
    _metadata?: { types?: string[]; key?: string }
    [property: string]: unknown
  }
  nodes?: ComponentNode[]
}

export type ExperienceComposition = {
  key?: string
  displayName?: string
  nodeType?: string
  layoutType?: string
  nodes?: ComponentNode[]
}

export type ExperienceData = {
  _metadata?: ExperienceMetadata
  composition?: ExperienceComposition
}

export type FetchExperienceResult = {
  experience: ExperienceData | null
  // Populated when the request succeeded at HTTP level but GraphQL returned errors,
  // or when no items matched, or when no auth was available. Used by /preview to
  // show a useful error banner instead of silently rendering an empty page.
  diagnostic: {
    source: 'single-key' | 'bearer' | 'none'
    httpStatus?: number
    errors?: unknown[]
    itemsCount?: number
  }
}

export async function fetchExperienceByKey(
  key: string,
  token?: string
): Promise<FetchExperienceResult> {
  const variables = { key: key.replace(/-/g, '') }

  const runQuery = async (
    url: string,
    headers: Record<string, string>
  ): Promise<{
    item: ExperienceData | null
    httpStatus: number
    errors?: unknown[]
    itemsCount: number
    errorBody?: string
  }> => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ query: COMPOSITION_QUERY, variables }),
      cache: 'no-store',
    })
    const httpStatus = res.status
    if (!res.ok) {
      // Capture body so the diagnostic surfaces the real GraphQL validation error
      // instead of a bare "HTTP 400".
      const errorBody = await res.text().catch(() => '')
      let parsed: unknown[] | undefined
      try {
        const j = JSON.parse(errorBody) as { errors?: unknown[] }
        parsed = j.errors
      } catch {
        /* not JSON */
      }
      return {
        item: null,
        httpStatus,
        errors: parsed ?? [{ message: `HTTP ${httpStatus}`, body: errorBody.slice(0, 400) }],
        itemsCount: 0,
        errorBody,
      }
    }
    const data = await res.json()
    const errors = data?.errors as unknown[] | undefined
    const items = data?.data?._Content?.items ?? []
    const item = (items[0] ?? null) as ExperienceData | null
    return { item, httpStatus, errors, itemsCount: items.length }
  }

  // Cache-bust the gateway so fresh edits show up (stored=false already bypasses the
  // durable store, but we add a rolling param to defeat any intermediate CDN cache).
  const bust = Date.now()
  const hasPreviewToken = !!(token && token.length > 10)

  // Auth priority: when we are inside the CMS preview iframe we receive a
  // `preview_token` query param. That token is a short-lived bearer that grants
  // access to DRAFT content. Single-key only sees PUBLISHED content, so for any
  // in-editor preview (where authors expect unsaved edits to reflect) we must
  // prefer the bearer path. Single-key is the public fallback for anonymous
  // previews (e.g. sharing a /preview link outside the CMS).
  if (hasPreviewToken) {
    const r = await runQuery(`${GATEWAY}?_=${bust}`, { Authorization: `Bearer ${token}` })
    if (r.item) {
      return {
        experience: r.item,
        diagnostic: { source: 'bearer', httpStatus: r.httpStatus, itemsCount: r.itemsCount },
      }
    }
    // If bearer returned GraphQL errors, fall through to single-key as a
    // last-ditch attempt (common during schema drift).
    if (r.errors && r.errors.length > 0 && !SINGLE_KEY) {
      return {
        experience: null,
        diagnostic: {
          source: 'bearer',
          httpStatus: r.httpStatus,
          errors: r.errors,
          itemsCount: r.itemsCount,
        },
      }
    }
  }

  if (SINGLE_KEY) {
    const url = `${GATEWAY}?auth=${SINGLE_KEY}&stored=false&_=${bust}`
    const r = await runQuery(url, {})
    if (r.item) {
      return {
        experience: r.item,
        diagnostic: {
          source: hasPreviewToken ? 'bearer' : 'single-key',
          httpStatus: r.httpStatus,
          itemsCount: r.itemsCount,
        },
      }
    }
    if (r.errors && r.errors.length > 0) {
      return {
        experience: null,
        diagnostic: {
          source: 'single-key',
          httpStatus: r.httpStatus,
          errors: r.errors,
          itemsCount: r.itemsCount,
        },
      }
    }
  }

  return { experience: null, diagnostic: { source: 'none', itemsCount: 0 } }
}
