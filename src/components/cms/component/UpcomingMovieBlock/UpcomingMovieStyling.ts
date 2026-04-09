export function UpcomingMovieStyling(settings: Record<string, string>) {
  const size = settings.Size || 'medium'
  const showMeta = settings.ShowMetadata !== 'false'

  const sizeMap: Record<string, string> = {
    small: 'w-44',
    medium: 'w-56',
    large: 'w-72',
  }

  const imageHeightMap: Record<string, string> = {
    small: 'h-60',
    medium: 'h-80',
    large: 'h-96',
  }

  return {
    card: `${sizeMap[size] || sizeMap.medium} flex-shrink-0 group cursor-pointer`,
    imageWrapper: `relative ${imageHeightMap[size] || imageHeightMap.medium} rounded-xl overflow-hidden mb-3`,
    image: 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
    badge: 'absolute top-3 left-3 bg-[#e50914] text-white text-[10px] font-bold uppercase px-2 py-1 rounded',
    title: 'text-white text-sm font-semibold truncate',
    meta: showMeta ? 'flex items-center gap-2 text-xs text-gray-400 mt-1' : 'hidden',
    metaBadge: 'bg-[#e50914]/20 text-[#e50914] px-1.5 py-0.5 rounded text-[10px] font-semibold',
  }
}
