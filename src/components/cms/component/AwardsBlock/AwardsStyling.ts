export function AwardsStyling(settings: Record<string, string>) {
  const layout = settings.Layout || 'side-by-side'

  return {
    section: 'py-16 bg-[#0e0e0e]',
    container: `max-w-6xl mx-auto px-6 ${layout === 'side-by-side' ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-start' : 'space-y-10'}`,
    header: layout === 'stacked' ? 'text-center' : '',
    title: 'text-3xl md:text-4xl font-bold text-white mb-4',
    description: 'text-gray-400 max-w-lg',
    content: '',
    yearTabs: 'flex gap-3 mb-8 flex-wrap',
    yearTab: 'px-4 py-2 rounded-lg text-sm font-semibold bg-[#1a1a2e] text-gray-400 hover:bg-[#e50914] hover:text-white transition-colors duration-200 cursor-pointer',
    yearTabActive: 'px-4 py-2 rounded-lg text-sm font-semibold bg-[#e50914] text-white',
    awardsList: 'space-y-4',
    awardItem: 'flex items-center gap-4 bg-[#1a1a2e] rounded-xl p-4 hover:bg-[#16213e] transition-colors duration-200',
    awardIcon: 'w-12 h-12 flex items-center justify-center bg-[#e50914]/10 rounded-lg text-[#e50914]',
    awardInfo: 'flex-1',
    awardTitle: 'text-white font-medium',
    awardDesc: 'text-gray-400 text-sm mt-1',
  }
}
