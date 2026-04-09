export function ContactFormStyling(settings: Record<string, string>) {
  const layout = settings.Layout || 'centered'

  return {
    section: 'py-16 bg-[#0e0e0e]',
    container: `${layout === 'centered' ? 'max-w-2xl' : 'max-w-4xl'} mx-auto px-6`,
    header: 'mb-10 text-center',
    title: 'text-3xl md:text-4xl font-bold text-white mb-4',
    description: 'text-gray-400',
    form: 'space-y-6',
    row: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    inputGroup: 'space-y-2',
    label: 'text-gray-300 text-sm font-medium',
    input: 'w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors duration-200',
    textarea: 'w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors duration-200 min-h-[140px] resize-none',
    submitButton: 'w-full bg-[#e50914] hover:bg-[#b0060f] text-white font-semibold py-3 rounded-xl transition-colors duration-200',
  }
}
