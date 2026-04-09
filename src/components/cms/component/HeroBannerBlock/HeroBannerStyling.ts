export function HeroBannerStyling(settings: Record<string, string>) {
  const layout = settings.Layout || 'full-width'
  const overlay = settings.Overlay || 'gradient'
  const height = settings.Height || 'tall'

  const heightMap: Record<string, string> = {
    tall: 'min-h-[90vh]',
    medium: 'min-h-[70vh]',
    short: 'min-h-[50vh]',
  }

  const overlayMap: Record<string, string> = {
    dark: 'bg-black/70',
    gradient: 'bg-gradient-to-r from-black/80 via-black/50 to-transparent',
    none: '',
  }

  return {
    wrapper: `relative w-full ${heightMap[height] || heightMap.tall} overflow-hidden bg-[#0e0e0e]`,
    backgroundImage: 'absolute inset-0 w-full h-full object-cover',
    overlay: `absolute inset-0 ${overlayMap[overlay] || overlayMap.gradient}`,
    content: `relative z-10 flex ${layout === 'two-col' ? 'flex-row items-center' : 'flex-col justify-end'} h-full max-w-7xl mx-auto px-6 pb-16`,
    textBlock: layout === 'two-col' ? 'w-1/2' : 'max-w-2xl',
    title: 'text-4xl md:text-6xl font-bold text-white leading-tight mb-4',
    meta: 'flex items-center gap-4 text-sm text-gray-300 mb-4',
    metaBadge: 'bg-[#e50914] text-white px-2 py-0.5 rounded text-xs font-semibold uppercase',
    genres: 'text-gray-400 text-sm mb-6',
    playButton: 'inline-flex items-center gap-2 bg-[#e50914] hover:bg-[#b0060f] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200',
    playIcon: 'w-5 h-5',
  }
}
