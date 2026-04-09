import { revalidatePath } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[Revalidation Webhook] Received:', JSON.stringify(body).slice(0, 200))

    // Revalidate the entire site
    revalidatePath('/', 'layout')

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    console.error('[Revalidation Webhook] Error:', error)
    return NextResponse.json(
      { revalidated: false, error: 'Failed to revalidate' },
      { status: 500 }
    )
  }
}

export async function GET() {
  revalidatePath('/', 'layout')
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
