import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { SectionTitleStyling } from './SectionTitleStyling'

const SectionTitleBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = SectionTitleStyling(settings)

  return (
    <div className={styles.wrapper} data-epi-block-id={data._metadata?.key}>
      <div className={styles.iconWrapper}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <h2 className={styles.heading} data-epi-edit="Heading">
        {data.Heading}
      </h2>
      {data.Subtitle && (
        <p className={styles.subtitle} data-epi-edit="Subtitle">
          {data.Subtitle}
        </p>
      )}
      <div className={styles.divider} />
    </div>
  )
}

SectionTitleBlock.displayName = 'SectionTitleBlock'
export default SectionTitleBlock
