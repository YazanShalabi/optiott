export function ButtonStyling(settings: Record<string, string>) {
  const variant = settings.Variant || 'primary'
  const size = settings.Size || 'medium'
  const fullWidth = settings.FullWidth === 'true'

  const variantMap: Record<string, string> = {
    primary: 'bg-[#e50914] hover:bg-[#b0060f] text-white',
    secondary: 'bg-transparent border-2 border-[#e50914] text-[#e50914] hover:bg-[#e50914] hover:text-white',
    outline: 'bg-transparent border border-[#2a2a4a] text-white hover:border-[#e50914] hover:text-[#e50914]',
    ghost: 'bg-transparent text-gray-300 hover:text-[#e50914]',
  }

  const sizeMap: Record<string, string> = {
    small: 'px-4 py-2 text-xs',
    medium: 'px-6 py-3 text-sm',
    large: 'px-8 py-4 text-base',
  }

  return {
    button: `inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ${
      variantMap[variant] || variantMap.primary
    } ${sizeMap[size] || sizeMap.medium} ${fullWidth ? 'w-full' : ''}`,
    icon: 'w-4 h-4',
  }
}
