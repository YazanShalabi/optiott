export function MovieCardStyling(settings: Record<string, string>) {
  const size = settings.Size || 'medium'

  const sizeMap: Record<string, string> = {
    small: 'w-40',
    medium: 'w-52',
    large: 'w-64',
  }

  const imageHeightMap: Record<string, string> = {
    small: 'h-56',
    medium: 'h-72',
    large: 'h-88',
  }

  return {
    card: `${sizeMap[size] || sizeMap.medium} flex-shrink-0 group cursor-pointer`,
    imageWrapper: `relative ${imageHeightMap[size] || imageHeightMap.medium} rounded-lg overflow-hidden mb-3`,
    image: 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
    playOverlay: 'absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center',
    playIcon: 'w-12 h-12 text-white',
    title: 'text-white text-sm font-medium truncate',
    meta: 'flex items-center gap-2 text-xs text-gray-400 mt-1',
    metaBadge: 'bg-[#e50914]/20 text-[#e50914] px-1.5 py-0.5 rounded text-[10px] font-semibold',
  }
}
