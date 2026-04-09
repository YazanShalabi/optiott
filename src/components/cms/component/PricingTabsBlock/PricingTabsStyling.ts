export function PricingTabsStyling(settings: Record<string, string>) {
  const layout = settings.Layout || 'tabs'
  const columns = settings.Columns || '3'

  const colMap: Record<string, string> = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return {
    section: 'py-16 bg-[#0e0e0e]',
    container: 'max-w-6xl mx-auto px-6',
    tabsWrapper: 'flex justify-center mb-12',
    tabList: layout === 'toggle'
      ? 'flex bg-[#1a1a2e] rounded-full p-1'
      : 'flex border-b border-[#2a2a4a]',
    tab: (active: boolean) =>
      layout === 'toggle'
        ? `px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
            active ? 'bg-[#e50914] text-white' : 'text-gray-400 hover:text-white'
          }`
        : `px-6 py-3 text-sm font-semibold transition-colors duration-200 border-b-2 -mb-[2px] ${
            active
              ? 'border-[#e50914] text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`,
    grid: `grid ${colMap[columns] || colMap['3']} gap-6 items-stretch`,
  }
}
