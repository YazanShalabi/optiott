export function PricingCardStyling(settings: Record<string, string>) {
  const highlighted = settings.Highlighted === 'true'
  const colorScheme = settings.ColorScheme || 'dark'

  const baseBg = highlighted
    ? 'bg-gradient-to-b from-[#e50914] to-[#b0060f] border-[#e50914]'
    : colorScheme === 'accent'
      ? 'bg-[#1a1a2e] border-[#e50914]/30'
      : 'bg-[#1a1a2e] border-[#2a2a4a]'

  return {
    card: `relative rounded-2xl border ${baseBg} p-8 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1`,
    highlightBadge: highlighted
      ? 'absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#e50914] text-xs font-bold px-4 py-1 rounded-full'
      : 'hidden',
    planName: `text-lg font-semibold ${highlighted ? 'text-white' : 'text-gray-300'} mb-2`,
    price: `text-4xl font-black ${highlighted ? 'text-white' : 'text-white'} mb-1`,
    period: `text-sm ${highlighted ? 'text-white/70' : 'text-gray-500'} mb-4`,
    description: `text-sm ${highlighted ? 'text-white/80' : 'text-gray-400'} mb-8 max-w-xs`,
    trialButton: `w-full py-3 rounded-lg font-semibold text-sm transition-colors duration-200 mb-3 ${
      highlighted
        ? 'bg-white text-[#e50914] hover:bg-gray-100'
        : 'bg-[#e50914] text-white hover:bg-[#b0060f]'
    }`,
    chooseButton: `w-full py-3 rounded-lg font-semibold text-sm transition-colors duration-200 ${
      highlighted
        ? 'border border-white/40 text-white hover:bg-white/10'
        : 'border border-[#2a2a4a] text-gray-300 hover:border-[#e50914] hover:text-white'
    }`,
  }
}
