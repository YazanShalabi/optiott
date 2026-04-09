export function TrendingBannerStyling(settings: Record<string, string>) {
  const layout = settings.Layout || 'split'
  const colorScheme = settings.ColorScheme || 'dark'

  const bgMap: Record<string, string> = {
    dark: 'bg-[#0e0e0e]',
    branded: 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e]',
  }

  return {
    section: `relative py-16 ${bgMap[colorScheme] || bgMap.dark} overflow-hidden`,
    container: `max-w-7xl mx-auto px-6 ${layout === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-10 items-center' : 'flex flex-col items-center text-center'}`,
    leftSide: 'space-y-6',
    title: 'text-3xl md:text-5xl font-bold text-white leading-tight',
    description: 'text-gray-400 text-base md:text-lg max-w-md',
    playButton: 'inline-flex items-center gap-3 bg-[#e50914] hover:bg-[#b0060f] text-white font-semibold px-8 py-4 rounded-full transition-colors duration-200',
    playIcon: 'w-6 h-6',
    rightSide: 'w-full overflow-hidden',
    trendingList: 'flex gap-4 overflow-x-auto scrollbar-hide pb-4',
    trendingItem: 'flex-shrink-0 w-32 group cursor-pointer',
    trendingImage: 'relative h-44 rounded-lg overflow-hidden mb-2',
    trendingImg: 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
  }
}
