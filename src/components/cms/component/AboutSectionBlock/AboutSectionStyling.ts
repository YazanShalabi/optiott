export function AboutSectionStyling(settings: Record<string, string>) {
  const layout = settings.Layout || 'side-by-side'

  return {
    section: 'py-16 bg-[#0e0e0e]',
    container: `max-w-6xl mx-auto px-6 ${layout === 'side-by-side' ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' : 'space-y-10'}`,
    mediaBlock: 'relative',
    imageWrapper: 'relative aspect-video rounded-2xl overflow-hidden',
    image: 'w-full h-full object-cover',
    playButton: 'absolute inset-0 flex items-center justify-center',
    playCircle: 'w-16 h-16 bg-[#e50914] rounded-full flex items-center justify-center hover:bg-[#b0060f] transition-colors duration-200 cursor-pointer',
    playIcon: 'w-6 h-6 text-white ml-1',
    textBlock: 'space-y-6',
    heading: 'text-3xl md:text-4xl font-bold text-white leading-tight',
    story: 'text-gray-400 leading-relaxed',
    progressBars: 'space-y-4 mt-6',
  }
}
