export function CounterSectionStyling(settings: Record<string, string>) {
  const background = settings.Background || 'dark'
  const columns = settings.Columns || '4'

  const bgMap: Record<string, string> = {
    transparent: 'bg-transparent',
    dark: 'bg-[#1a1a2e]',
    gradient: 'bg-gradient-to-r from-[#1a1a2e] via-[#0e0e0e] to-[#1a1a2e]',
  }

  const colMap: Record<string, string> = {
    '2': 'grid-cols-2',
    '3': 'grid-cols-2 md:grid-cols-3',
    '4': 'grid-cols-2 md:grid-cols-4',
  }

  return {
    section: `py-16 ${bgMap[background] || bgMap.dark}`,
    container: 'max-w-6xl mx-auto px-6',
    grid: `grid ${colMap[columns] || colMap['4']} gap-8`,
  }
}
