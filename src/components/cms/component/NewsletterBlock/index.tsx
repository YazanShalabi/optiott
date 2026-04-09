import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { NewsletterStyling } from './NewsletterStyling'

const NewsletterBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = NewsletterStyling(settings)

  return (
    <section className={styles.section} data-epi-block-id={data._metadata?.key}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <h2 className={styles.title} data-epi-edit="Title">
            {data.Title}
          </h2>
          {data.Description && (
            <p className={styles.description} data-epi-edit="Description">
              {data.Description}
            </p>
          )}
        </div>
        <div className={styles.formWrapper}>
          <form className={styles.form}>
            <input
              type="email"
              className={styles.input}
              placeholder="Enter your email"
            />
            <button type="submit" className={styles.submitButton}>
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

NewsletterBlock.displayName = 'NewsletterBlock'
export default NewsletterBlock
