import { GraphQLClient } from 'graphql-request'

type AuthMode = 'public' | 'preview' | 'edit'

function createClient(mode: AuthMode, token?: string): GraphQLClient {
  const gateway = process.env.OPTIMIZELY_GRAPH_GATEWAY!
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY!
  const appKey = process.env.OPTIMIZELY_GRAPH_APP_KEY!
  const secret = process.env.OPTIMIZELY_GRAPH_SECRET!

  const url = `${gateway}?stored=true`

  if (mode === 'edit' && token) {
    return new GraphQLClient(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  if (mode === 'preview') {
    const encoded = Buffer.from(`${appKey}:${secret}`).toString('base64')
    return new GraphQLClient(url, {
      headers: { Authorization: `Basic ${encoded}` },
    })
  }

  return new GraphQLClient(`${gateway}?auth=${singleKey}&stored=true`)
}

export function getPublicClient() {
  return createClient('public')
}

export function getPreviewClient() {
  return createClient('preview')
}

export function getEditClient(token: string) {
  return createClient('edit', token)
}
