import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { ButtonStyling } from './ButtonStyling'

const ButtonBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = ButtonStyling(settings)

  const url = (data.Url as string) || (data.Link as string) || '#'
  const label = (data.Label as string) || (data.Text as string) || 'Click Here'

  return (
    <a
      href={url}
      className={styles.button}
      data-epi-block-id={data._metadata?.key}
    >
      {data.IconPosition === 'left' && data.Icon && (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
      <span data-epi-edit="Label">{label}</span>
      {(data.IconPosition !== 'left' && data.Icon) && (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </a>
  )
}

ButtonBlock.displayName = 'ButtonBlock'
export default ButtonBlock
