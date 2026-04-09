import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'

const Row: React.FC<any> = ({ displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)

  const colsMap: Record<string, string> = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '6': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }

  const gapMap: Record<string, string> = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }

  const alignMap: Record<string, string> = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }

  const cols = colsMap[settings['Columns']] ?? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  const gap = gapMap[settings['Gap']] ?? 'gap-6'
  const align = alignMap[settings['VerticalAlign']] ?? 'items-start'

  return (
    <div className={`grid ${cols} ${gap} ${align}`}>
      {children}
    </div>
  )
}

Row.displayName = 'DefaultRow'
export default Row
