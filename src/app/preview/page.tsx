import Script from 'next/script'

export const fetchCache = 'force-no-store'
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PreviewPageProps {
  searchParams: Promise<Record<string, string>>
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const params = await searchParams
  const key = params.key ?? ''
  const ver = params.ver ?? 'Draft'

  return (
    <>
      <Script src="/communicationinjector.js" strategy="beforeInteractive" />
      <main className="min-h-screen bg-[#0e0e0e] text-white pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold mb-4">Preview Mode</h1>
          <p className="text-gray-400">
            Content Key: {key} | Version: {ver}
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            This preview endpoint will render content from the CMS once connected.
          </p>
        </div>
      </main>
      <PreviewRefresh />
    </>
  )
}

function PreviewRefresh() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('optimizely:cms:contentSaved', function() {
            setTimeout(function() { window.location.reload(); }, 750);
          });
        `,
      }}
    />
  )
}
