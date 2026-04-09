import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'

const Section: React.FC<any> = ({ displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)

  const bgMap: Record<string, string> = {
    transparent: 'bg-transparent',
    dark: 'bg-[#0e0e0e]',
    gradient: 'bg-gradient-to-b from-[#1a1a2e] to-[#0e0e0e]',
  }

  const paddingMap: Record<string, string> = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24',
    none: 'py-0',
  }

  const widthMap: Record<string, string> = {
    full: 'w-full',
    contained: 'container mx-auto px-4',
  }

  const bg = bgMap[settings['Background']] ?? ''
  const padding = paddingMap[settings['Padding']] ?? 'py-16'
  const width = widthMap[settings['ContainerWidth']] ?? 'container mx-auto px-4'

  return (
    <section className={`${bg} ${padding}`}>
      <div className={width}>
        {children}
      </div>
    </section>
  )
}

Section.displayName = 'DefaultSection'
export default Section
