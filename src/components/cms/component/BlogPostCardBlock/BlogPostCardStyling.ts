export function BlogPostCardStyling(settings: Record<string, string>) {
  const imagePosition = settings.ImagePosition || 'top'

  return {
    card: `bg-[#1a1a2e] rounded-2xl overflow-hidden group cursor-pointer hover:ring-1 hover:ring-[#e50914]/30 transition-all duration-300 ${
      imagePosition === 'left' ? 'flex flex-row' : 'flex flex-col'
    }`,
    imageWrapper: `relative ${
      imagePosition === 'left' ? 'w-1/3 min-h-[200px]' : 'aspect-video'
    } overflow-hidden`,
    image: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
    content: `${imagePosition === 'left' ? 'flex-1' : ''} p-5 flex flex-col`,
    metaRow: 'flex items-center gap-3 mb-3',
    author: 'text-sm text-gray-400',
    date: 'text-sm text-gray-500',
    dot: 'w-1 h-1 rounded-full bg-gray-500',
    title: 'text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#e50914] transition-colors duration-200',
    excerpt: 'text-gray-400 text-sm line-clamp-3 flex-1',
    readMore: 'text-[#e50914] text-sm font-semibold mt-4 inline-flex items-center gap-1 hover:gap-2 transition-all duration-200',
  }
}
