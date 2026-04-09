import React from 'react'
'use client'

import { useEffect, useRef, useState } from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { CounterItemStyling } from './CounterItemStyling'

const CounterItemBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = CounterItemStyling(settings)
  const animated = settings.Animated !== 'false'
  const target = Number(data.Number) || 0
  const [count, setCount] = useState(animated ? 0 : target)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animated) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const duration = 2000
          const step = Math.ceil(target / (duration / 16))
          const timer = setInterval(() => {
            start += step
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(start)
            }
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animated, target])

  return (
    <div ref={ref} className={styles.item} data-epi-block-id={data._metadata?.key}>
      <div>
        <span className={styles.number}>{count}</span>
        {data.Suffix && <span className={styles.suffix}>{data.Suffix}</span>}
      </div>
      <p className={styles.label} data-epi-edit="Label">
        {data.Label}
      </p>
    </div>
  )
}

CounterItemBlock.displayName = 'CounterItemBlock'
export default CounterItemBlock
