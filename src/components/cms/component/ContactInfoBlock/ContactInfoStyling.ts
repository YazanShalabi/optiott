export function ContactInfoStyling(settings: Record<string, string>) {
  const iconStyle = settings.IconStyle || 'filled'
  const size = settings.Size || 'medium'

  const sizeMap: Record<string, string> = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  }

  return {
    card: `bg-[#1a1a2e] rounded-2xl ${sizeMap[size] || sizeMap.medium} flex items-start gap-4 hover:bg-[#16213e] transition-colors duration-200`,
    iconWrapper: `flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl ${
      iconStyle === 'filled'
        ? 'bg-[#e50914] text-white'
        : 'border-2 border-[#e50914] text-[#e50914]'
    }`,
    icon: 'w-5 h-5',
    textBlock: 'min-w-0',
    label: 'text-gray-400 text-sm mb-1',
    value: 'text-white font-medium',
  }
}
