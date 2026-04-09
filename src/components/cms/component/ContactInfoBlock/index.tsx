import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { ContactInfoStyling } from './ContactInfoStyling'

const ContactInfoBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = ContactInfoStyling(settings)

  return (
    <div className={styles.card} data-epi-block-id={data._metadata?.key}>
      <div className={styles.iconWrapper}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      </div>
      <div className={styles.textBlock}>
        <p className={styles.label} data-epi-edit="Label">
          {data.Label}
        </p>
        <p className={styles.value} data-epi-edit="Value">
          {data.Value}
        </p>
      </div>
    </div>
  )
}

ContactInfoBlock.displayName = 'ContactInfoBlock'
export default ContactInfoBlock
