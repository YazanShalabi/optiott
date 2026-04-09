import React from 'react'
'use client'

import { useState } from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { FaqItemStyling } from './FaqItemStyling'

const FaqItemBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = FaqItemStyling(settings)
  const [isOpen, setIsOpen] = useState(settings.Expanded === 'true')

  return (
    <div className={styles.item} data-epi-block-id={data._metadata?.key}>
      <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.number}>{data.Number}</span>
        <span className={styles.question} data-epi-edit="Question">
          {data.Question}
        </span>
        <svg
          className={isOpen ? styles.iconRotated : styles.icon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={styles.answerWrapper}
        style={{ maxHeight: isOpen ? '500px' : '0px' }}
      >
        <div className={styles.answer} data-epi-edit="Answer">
          {data.Answer}
        </div>
      </div>
    </div>
  )
}

FaqItemBlock.displayName = 'FaqItemBlock'
export default FaqItemBlock
