export function SectionTitleStyling(settings: Record<string, string>) {
  const alignment = settings.Alignment || 'center'
  const showIcon = settings.ShowIcon !== 'false'
  const size = settings.Size || 'large'

  const alignMap: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const sizeMap: Record<string, string> = {
    small: 'text-xl md:text-2xl',
    medium: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-4xl',
  }

  return {
    wrapper: `${alignMap[alignment] || alignMap.center} mb-10`,
    iconWrapper: showIcon
      ? `${alignment === 'center' ? 'mx-auto' : ''} w-10 h-10 flex items-center justify-center bg-[#e50914]/10 rounded-lg mb-4`
      : 'hidden',
    icon: 'w-5 h-5 text-[#e50914]',
    heading: `${sizeMap[size] || sizeMap.large} font-bold text-white mb-3`,
    subtitle: 'text-gray-400 max-w-2xl mx-auto',
    divider: `h-1 w-12 bg-[#e50914] rounded-full mt-4 ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''}`,
  }
}
