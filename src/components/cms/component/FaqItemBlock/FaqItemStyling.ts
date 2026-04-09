export function FaqItemStyling(settings: Record<string, string>) {
  const showNumber = settings.ShowNumber !== 'false'

  return {
    item: 'border-b border-[#2a2a4a] last:border-b-0',
    button: 'w-full flex items-center gap-4 py-5 text-left group',
    number: showNumber
      ? 'text-[#e50914] font-bold text-lg min-w-[36px]'
      : 'hidden',
    question: 'flex-1 text-white font-medium text-base group-hover:text-[#e50914] transition-colors duration-200',
    icon: 'text-gray-400 transition-transform duration-300',
    iconRotated: 'text-[#e50914] rotate-180 transition-transform duration-300',
    answerWrapper: 'overflow-hidden transition-all duration-300',
    answer: 'pb-5 pl-10 text-gray-400 text-sm leading-relaxed',
  }
}
