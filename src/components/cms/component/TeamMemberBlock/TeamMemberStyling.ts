export function TeamMemberStyling(settings: Record<string, string>) {
  const showSocial = settings.ShowSocialLinks !== 'false'
  const imageShape = settings.ImageShape || 'rounded'

  const shapeMap: Record<string, string> = {
    square: 'rounded-none',
    rounded: 'rounded-xl',
    circle: 'rounded-full',
  }

  return {
    card: 'bg-[#1a1a2e] rounded-2xl p-6 text-center group hover:bg-[#16213e] transition-colors duration-300',
    imageWrapper: `relative w-32 h-32 mx-auto mb-4 overflow-hidden ${shapeMap[imageShape] || shapeMap.rounded}`,
    image: 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-110',
    name: 'text-white font-semibold text-lg',
    role: 'text-[#e50914] text-sm mt-1',
    socialLinks: showSocial
      ? 'flex items-center justify-center gap-3 mt-4'
      : 'hidden',
    socialLink: 'w-8 h-8 flex items-center justify-center rounded-full bg-[#2a2a4a] text-gray-400 hover:bg-[#e50914] hover:text-white transition-colors duration-200',
    socialIcon: 'w-4 h-4',
  }
}
