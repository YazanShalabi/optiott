export function CounterItemStyling(settings: Record<string, string>) {
  const size = settings.Size || 'large'

  return {
    item: 'text-center',
    number: `font-black text-white ${size === 'large' ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'}`,
    suffix: `font-bold text-[#e50914] ${size === 'large' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`,
    label: `mt-2 ${size === 'large' ? 'text-base' : 'text-sm'} text-gray-400 uppercase tracking-wider`,
  }
}
