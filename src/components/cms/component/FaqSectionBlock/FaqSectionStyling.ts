export function FaqSectionStyling(settings: Record<string, string>) {
  const layout = settings.Layout || 'contained'
  const showCta = settings.ShowCta !== 'false'

  return {
    section: 'py-16 bg-[#0e0e0e]',
    container: `${layout === 'full-width' ? 'max-w-5xl' : 'max-w-3xl'} mx-auto px-6`,
    header: 'text-center mb-12',
    title: 'text-3xl md:text-4xl font-bold text-white mb-4',
    description: 'text-gray-400 max-w-xl mx-auto',
    faqList: 'bg-[#1a1a2e] rounded-2xl p-6 md:p-8',
    ctaWrapper: showCta ? 'text-center mt-10' : 'hidden',
    ctaButton: 'inline-flex items-center gap-2 bg-[#e50914] hover:bg-[#b0060f] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200',
  }
}
