import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { FaqSectionStyling } from './FaqSectionStyling'

const FaqSectionBlock: React.FC<any> = ({ data, displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = FaqSectionStyling(settings)

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
        <div className={styles.faqList}>
          {children}
        </div>
        <div className={styles.ctaWrapper}>
          {data.CtaButtonText && (
            <a
              href={(data.CtaButtonLink as string) || '#'}
              className={styles.ctaButton}
            >
              {data.CtaButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

FaqSectionBlock.displayName = 'FaqSectionBlock'
export default FaqSectionBlock
