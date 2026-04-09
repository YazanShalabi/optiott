export function NewsletterStyling(settings: Record<string, string>) {
  const layout = settings.Layout || 'centered'
  const colorScheme = settings.ColorScheme || 'dark'

  const bgMap: Record<string, string> = {
    dark: 'bg-[#1a1a2e]',
    accent: 'bg-gradient-to-r from-[#e50914] to-[#b0060f]',
  }

  return {
    section: `py-16 ${bgMap[colorScheme] || bgMap.dark}`,
    container: `max-w-4xl mx-auto px-6 ${layout === 'centered' ? 'text-center' : 'flex items-center justify-between gap-10'}`,
    textBlock: layout === 'centered' ? 'mb-8' : 'flex-1',
    title: `text-2xl md:text-3xl font-bold ${colorScheme === 'accent' ? 'text-white' : 'text-white'} mb-3`,
    description: `${colorScheme === 'accent' ? 'text-white/80' : 'text-gray-400'}`,
    formWrapper: layout === 'centered' ? 'max-w-md mx-auto' : 'flex-shrink-0 w-96',
    form: 'flex gap-3',
    input: `flex-1 bg-${colorScheme === 'accent' ? 'white/10 border-white/20 placeholder-white/50' : '[#0e0e0e] border-[#2a2a4a] placeholder-gray-500'} border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-${colorScheme === 'accent' ? 'white' : '[#e50914]'} transition-colors duration-200`,
    submitButton: `px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 flex-shrink-0 ${
      colorScheme === 'accent'
        ? 'bg-white text-[#e50914] hover:bg-gray-100'
        : 'bg-[#e50914] text-white hover:bg-[#b0060f]'
    }`,
  }
}
