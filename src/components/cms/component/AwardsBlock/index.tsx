import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { AwardsStyling } from './AwardsStyling'

const AwardsBlock: React.FC<any> = ({ data, displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = AwardsStyling(settings)

  return (
    <section className={styles.section} data-epi-block-id={data._metadata?.key}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title} data-epi-edit="Title">
            {data.Title}
          </h2>
          {data.Description && (
            <p className={styles.description} data-epi-edit="Description">
              {data.Description}
            </p>
          )}
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </section>
  )
}

AwardsBlock.displayName = 'AwardsBlock'
export default AwardsBlock
