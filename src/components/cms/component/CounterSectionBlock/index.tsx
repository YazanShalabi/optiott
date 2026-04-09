import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { CounterSectionStyling } from './CounterSectionStyling'

const CounterSectionBlock: React.FC<any> = ({ data, displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = CounterSectionStyling(settings)

  return (
    <section className={styles.section} data-epi-block-id={data._metadata?.key}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {children}
        </div>
      </div>
    </section>
  )
}

CounterSectionBlock.displayName = 'CounterSectionBlock'
export default CounterSectionBlock
