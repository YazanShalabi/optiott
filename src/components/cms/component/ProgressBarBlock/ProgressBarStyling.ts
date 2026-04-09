export function ProgressBarStyling(settings: Record<string, string>) {
  const animated = settings.Animated !== 'false'

  return {
    wrapper: 'space-y-2',
    header: 'flex justify-between items-center',
    title: 'text-white text-sm font-medium',
    percentage: 'text-[#e50914] text-sm font-semibold',
    track: 'h-2 bg-[#2a2a4a] rounded-full overflow-hidden',
    bar: `h-full bg-gradient-to-r from-[#e50914] to-[#ff4757] rounded-full ${animated ? 'transition-all duration-1000 ease-out' : ''}`,
  }
}
