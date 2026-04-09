export function MapEmbedStyling(settings: Record<string, string>) {
  const height = settings.Height || 'medium'

  const heightMap: Record<string, string> = {
    small: 'h-64',
    medium: 'h-96',
    large: 'h-[500px]',
  }

  return {
    wrapper: `w-full ${heightMap[height] || heightMap.medium} rounded-2xl overflow-hidden border border-[#2a2a4a]`,
    iframe: 'w-full h-full border-0',
  }
}
