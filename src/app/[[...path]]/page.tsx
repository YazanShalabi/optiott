import { notFound } from 'next/navigation'
import { getPublicClient } from '@/graphql/getSdk'
import { gql } from 'graphql-tag'

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

interface PageProps {
  params: Promise<{ path?: string[] }>
}

export default async function CatchAllPage({ params }: PageProps) {
  const resolvedParams = await params
  const urlPath = resolvedParams.path ? `/${resolvedParams.path.join('/')}` : '/'

  try {
    const client = getPublicClient()
    const data = await client.request(CONTENT_BY_PATH, {
      url: [urlPath, urlPath.endsWith('/') ? urlPath.slice(0, -1) : `${urlPath}/`],
    })

    const items = (data as { _Content?: { items?: unknown[] } })?._Content?.items
    if (!items || items.length === 0) {
      notFound()
    }

    const content = items[0] as { _metadata?: { types?: string[]; displayName?: string } }

    return (
      <main className="min-h-screen bg-[#0e0e0e] text-white pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">
            {content._metadata?.displayName || 'Page'}
          </h1>
          <p className="text-gray-400">
            Content type: {content._metadata?.types?.join(', ')}
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            This page will render the full Visual Builder experience once content types are pushed to the CMS.
          </p>
        </div>
      </main>
    )
  } catch {
    return (
      <main className="min-h-screen bg-[#0e0e0e] text-white pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Opti<span className="text-[#e50914]">OTT</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Welcome to OptiOTT — Your ultimate streaming destination
          </p>
          <p className="text-gray-500 text-sm">
            Connect your Optimizely CMS credentials to start building pages.
          </p>
        </div>
      </main>
    )
  }
}
