export function HotPicksCardStyling(settings: Record<string, string>) {
  const showRank = settings.ShowRankNumber !== 'false'
  const showDesc = settings.ShowDescription !== 'false'

  return {
    card: 'flex gap-4 group cursor-pointer bg-[#1a1a2e]/50 rounded-xl p-4 hover:bg-[#1a1a2e] transition-colors duration-200',
    rankNumber: showRank
      ? 'text-5xl font-black text-[#e50914]/30 leading-none self-start min-w-[48px]'
      : 'hidden',
    imageWrapper: 'relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden',
    image: 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
    info: 'flex flex-col justify-center min-w-0',
    title: 'text-white font-semibold text-sm truncate',
    description: showDesc
      ? 'text-gray-400 text-xs mt-1 line-clamp-2'
      : 'hidden',
    meta: 'flex items-center gap-2 text-xs text-gray-500 mt-2',
    metaBadge: 'bg-[#e50914]/20 text-[#e50914] px-1.5 py-0.5 rounded text-[10px] font-semibold',
  }
}
