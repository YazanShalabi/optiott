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
    Number Question Answer
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
    Number Suffix Label
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
    Icon Label Value LinkUrl
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
    Icon { default }
  }
  ... on ButtonBlock {
    Label Url Style
    Icon { default }
  }
  ... on ProgressBarBlock {
    Title Percentage
  }
`

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

export async function fetchExperienceByKey(
  key: string,
  token?: string
): Promise<ExperienceData | null> {
  const variables = { key: key.replace(/-/g, '') }

  const runQuery = async (url: string, headers: Record<string, string>) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ query: COMPOSITION_QUERY, variables }),
        cache: 'no-store',
      })
      if (!res.ok) return null
      const data = await res.json()
      const item = data?.data?._Content?.items?.[0]
      return (item ?? null) as ExperienceData | null
    } catch {
      return null
    }
  }

  if (SINGLE_KEY) {
    const item = await runQuery(`${GATEWAY}?auth=${SINGLE_KEY}&stored=false`, {})
    if (item) return item
  }

  if (token && token.length > 10) {
    const item = await runQuery(GATEWAY, { Authorization: `Bearer ${token}` })
    if (item) return item
  }

  return null
}
