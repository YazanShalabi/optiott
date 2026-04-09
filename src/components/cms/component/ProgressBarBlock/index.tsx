import React from 'react'
'use client'

import { useEffect, useRef, useState } from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { ProgressBarStyling } from './ProgressBarStyling'

const ProgressBarBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = ProgressBarStyling(settings)
  const animated = settings.Animated !== 'false'
  const percentage = Number(data.Percentage) || 0
  const [width, setWidth] = useState(animated ? 0 : percentage)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animated) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(percentage)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animated, percentage])

  return (
    <div ref={ref} className={styles.wrapper} data-epi-block-id={data._metadata?.key}>
      <div className={styles.header}>
        <span className={styles.title} data-epi-edit="Title">
          {data.Title}
        </span>
        <span className={styles.percentage}>{percentage}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.bar} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

ProgressBarBlock.displayName = 'ProgressBarBlock'
export default ProgressBarBlock
