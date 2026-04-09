export function CategoryCardStyling(settings: Record<string, string>) {
  const aspectRatio = settings.AspectRatio || 'landscape'
  const overlayPos = settings.OverlayPosition || 'bottom'

  const aspectMap: Record<string, string> = {
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
  }

  const overlayPosMap: Record<string, string> = {
    bottom: 'items-end justify-start',
    center: 'items-center justify-center text-center',
  }

  return {
    card: `relative ${aspectMap[aspectRatio] || aspectMap.landscape} rounded-xl overflow-hidden group cursor-pointer`,
    image: 'absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110',
    overlay: `absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex ${overlayPosMap[overlayPos] || overlayPosMap.bottom} p-5`,
    textBlock: '',
    subtitle: 'text-[#e50914] text-xs font-semibold uppercase tracking-wider mb-1',
    title: 'text-white text-lg font-bold',
  }
}
